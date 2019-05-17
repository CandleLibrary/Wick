'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

let fn = {}; const 
/************** Maps **************/

    /* Symbols To Inject into the Lexer */
    symbols = ["</","((","))",")(","\"","'"],

    /* Goto lookup maps */
    gt0 = [0,-1,1,2],
gt1 = [0,-10,4],
gt2 = [0,-4,6,7,8],
gt3 = [0,-5,14,8],
gt4 = [0,-2,19,18,-7,20,21,22],
gt5 = [0,-7,28,-6,32,34,33],
gt6 = [0,-2,40,-8,39,21,22],
gt7 = [0,-13,41],
gt8 = [0,-8,42,44,-4,43,34,33],
gt9 = [0,-8,48,44],
gt10 = [0,-17,49],
gt11 = [0,-10,56],
gt12 = [0,-9,58],
gt13 = [0,-17,63],
gt14 = [0,-17,65],

    // State action lookup maps
    sm0=[0,-4,0,-4,0,-4,1],
sm1=[0,2,-3,0,-4,0],
sm2=[0,3,-3,0,-4,0],
sm3=[0,-2,4,-1,0,-4,0],
sm4=[0,-2,5,-1,0,-4,0,-5,6,-1,6,-1,7,-1,8],
sm5=[0,-2,9,-1,0,-4,0,-5,9,-1,9,-1,9,-1,9],
sm6=[0,-2,5,-1,0,-4,0,-5,10,-1,11,-1,7,-1,8],
sm7=[0,-2,12,-1,0,-4,0,-5,12,-1,12,-1,12,-1,12],
sm8=[0,-2,13,-1,0,-4,0,-5,13,-1,13,14,13,-1,13],
sm9=[0,-2,15,-1,0,-4,0],
sm10=[0,-2,16,-1,0,-4,0],
sm11=[0,-2,17,-1,0,-4,0,-5,17,-1,17,17,17,-1,17],
sm12=[0,-2,18,-1,19,-4,20,-3,21,1,-1,22],
sm13=[0,-4,0,-4,0,-5,23],
sm14=[0,-2,24,-1,0,-4,0,-5,24,-1,24,-1,24,-1,24],
sm15=[0,-2,25,-1,0,-4,0,-9,26,-1,27,-3,28],
sm16=[0,-4,0,-4,0,-9,29],
sm17=[0,-4,0,-4,0,-11,30],
sm18=[0,-2,18,-1,19,-4,20,-3,21,1,-1,31],
sm19=[0,-2,32,-1,32,-4,32,-3,32,32,-1,32],
sm20=[0,-2,18,-1,19,-4,20,-3,21,33,-1,33],
sm21=[0,-2,34,-1,34,-4,34,-3,34,34,-1,34],
sm22=[0,-2,35,-1,35,-4,35,-3,35,35,-1,35],
sm23=[0,36,-1,36,-1,36,-4,36,-3,36,36,-1,36],
sm24=[0,-2,37,-1,0,-4,0,-5,37,-1,37,-1,37,-1,37],
sm25=[0,-2,38,-1,39,-4,0,-3,40,-11,28],
sm26=[0,-2,38,-1,39,-4,0,-3,40],
sm27=[0,-2,41,-1,0,-4,0,-5,41,-1,41,-1,41,-1,41],
sm28=[0,-2,42,-1,0,-4,0,-5,42,-1,42,-1,42,-1,42],
sm29=[0,-2,43,-1,44,-2,45,46,47,-3,48],
sm30=[0,-2,49,-1,0,-4,0,-5,49,-1,49,49,49,-1,49],
sm31=[0,-2,50,-1,50,-4,50,-3,50,50,-1,50],
sm32=[0,-2,51,-1,51,-4,51,-3,51,51,-1,51],
sm33=[0,-2,38,-1,39,-4,0,-3,40,-7,52],
sm34=[0,-4,0,-4,0,-11,53],
sm35=[0,-2,54,-1,54,-4,0,-3,54,-5,54,-1,54],
sm36=[0,-2,55,-1,55,-4,0,-3,55,-5,55,-1,55],
sm37=[0,-2,38,-1,39,-4,0,-3,40,-5,56],
sm38=[0,-2,43,-1,44,-2,45,46,47,-3,48,-12,57,58],
sm39=[0,-2,59,-1,59,-2,59,59,59,-3,59,-12,59,59],
sm40=[0,-4,0,-4,0,-5,60],
sm41=[0,-2,61,-1,0,-4,0,-5,61,-1,61,-1,61,-1,61],
sm42=[0,-2,62,-1,62,-4,0,-3,62,-5,62,-1,62],
sm43=[0,-2,63,-1,0,-4,0,-5,63,-1,63,-1,63,-1,63],
sm44=[0,-2,43,-1,44,-2,45,46,47,-3,48,-12,64,64],
sm45=[0,65,-1,65,-1,65,-4,65,-3,65,65,-1,65],
sm46=[0,-2,43,-1,44,-2,45,46,47,-3,48,-12,66],
sm47=[0,-2,67,-1,0,-4,0,-5,67,-1,67,-1,67,-1,67],

    // Symbol Lookup map
    lu = new Map([[1,1],[2,2],[4,3],[8,4],[16,5],[32,6],[64,7],[128,8],[256,9],[512,10],[3,11],[264,11],["any",13],["<",14],[">",15],["</",16],["/",17],["=",18],["'",19],[null,7],["\"",21],["((",25],["))",26],[")(",27]]),

    //Reverse Symbol Lookup map
    rlu = new Map([[1,1],[2,2],[3,4],[4,8],[5,16],[6,32],[7,64],[8,128],[9,256],[10,512],[11,3],[11,264],[13,"any"],[14,"<"],[15,">"],[16,"</"],[17,"/"],[18,"="],[19,"'"],[7,null],[21,"\""],[25,"(("],[26,"))"],[27,")("]]),

    // States 
    state = [sm0,
sm1,
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
sm18,
sm19,
sm19,
sm20,
sm21,
sm22,
sm22,
sm22,
sm22,
sm23,
sm24,
sm25,
sm26,
sm27,
sm27,
sm28,
sm28,
sm29,
sm30,
sm30,
sm3,
sm31,
sm31,
sm32,
sm33,
sm34,
sm35,
sm36,
sm36,
sm36,
sm37,
sm38,
sm39,
sm39,
sm39,
sm39,
sm39,
sm39,
sm40,
sm41,
sm42,
sm41,
sm41,
sm29,
sm43,
sm44,
sm45,
sm46,
sm47],

/************ Functions *************/

    max = Math.max,

    //Error Functions
    e = (tk,r,o,l,p)=>{if(l.END)l.throw("Unexpected end of input");else if(l.ty & (264)) l.throw(`Unexpected space character within input "${1}" `) ; else l.throw(`Unexpected token ${l.tx} within input "${111}" `);}, 
    eh = [e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e,
e],

    //Empty Function
    nf = ()=>-1, 

    //Environment Functions
    
redv = (ret, fn, plen, ln, t, e, o, l, s) => {        ln = max(o.length - plen, 0);        o[ln] = fn(o.slice(-plen), e, l, s);        o.length = ln + 1;        return ret;    },
rednv = (ret, Fn, plen, ln, t, e, o, l, s) => {        ln = max(o.length - plen, 0);        o[ln] = new Fn(o.slice(-plen), e, l, s);        o.length = ln + 1;        return ret;    },
redn = (ret, t, e, o) => (o.push(null), ret),
shftf = (ret, fn, t, e, o, l, s) => (fn(o, e, l, s), ret),
C0_TAG=function (sym,env,lex,state) {this.tagname = sym[1];this.attr = sym[2];this.children = [];this.parent = null;},
R0_TAG_BODY=function (sym,env,lex,state) {return sym[0].push(sym[1]), sym[0]},
R1_TAG_BODY=function (sym,env,lex,state) {return [sym[0]]},
C0_ATTRIBUTE=function (sym,env,lex,state) {this.id = sym[0]; this.val = sym[2];},
C1_ATTRIBUTE=function (sym,env,lex,state) {this.id = sym[0]; this.val = true;},
R0_ATTRIBUTE_HEAD=function (sym,env,lex,state) {return sym[1]},
R0_ATTRIBUTE_DATA=function (sym,env,lex,state) {return sym[0] + ""},
R1_ATTRIBUTE_DATA=function (sym,env,lex,state) {return sym[0] + sym[1]},
C0_TEXT_NODE=function (sym,env,lex,state) {this.val = sym[0];this.parent = null;},
C0_BASIC_BINDING=function (sym,env,lex,state) {this.lex = lex.copy(); this.lex.sl = lex.off-2; this.lex.off = env.start; console.log(this.lex.slice());},
I1_BASIC_BINDING=function (sym,env,lex,state) {env.start = lex.off+2;},
C0_CALL_BINDING=function (sym,env,lex,state) {},
R0_BINDING_DATA=function (sym,env,lex,state) {return null},

    //Sparse Map Lookup
    lsm = (index, map) => {    if (map[0] == 0xFFFFFFFF) return map[index+1];    for (let i = 1, ind = 0, l = map.length, n = 0; i < l && ind <= index; i++) {        if (ind !== index) {            if ((n = map[i]) > -1) ind++;            else ind += -n;        } else return map[i];    }    return -1;},

    //State Action Functions
    state_funct = [()=>(14),
()=>(5),
()=>(1031),
()=>(22),
()=>(46),
(...v)=>((redn(4099,...v))),
()=>(38),
()=>(42),
()=>(10247),
()=>(50),
()=>(54),
(...v)=>(redv(4103,R1_TAG_BODY,1,0,...v)),
(...v)=>(rednv(5127,C1_ATTRIBUTE,1,0,...v)),
()=>(62),
()=>(66),
()=>(70),
()=>(6151),
()=>(94),
()=>(102),
()=>(106),
()=>(98),
(...v)=>((redn(3075,...v))),
()=>(110),
(...v)=>(redv(4107,R0_TAG_BODY,2,0,...v)),
()=>(126),
()=>(122),
()=>(118),
(...v)=>(shftf(142,I1_BASIC_BINDING,...v)),
()=>(146),
()=>(150),
()=>(154),
(...v)=>(redv(3079,R1_TAG_BODY,1,0,...v)),
(...v)=>(rednv(11271,C0_TEXT_NODE,1,0,...v)),
(...v)=>(redv(12295,R0_ATTRIBUTE_DATA,1,0,...v)),
()=>(13319),
(...v)=>(rednv(2071,C0_TAG,5,0,...v)),
(...v)=>(rednv(5135,C0_ATTRIBUTE,3,0,...v)),
()=>(182),
()=>(186),
()=>(190),
()=>(7175),
()=>(14343),
()=>(202),
()=>(206),
()=>(218),
()=>(214),
()=>(210),
()=>(222),
(...v)=>(redv(6159,R0_ATTRIBUTE_HEAD,3,0,...v)),
(...v)=>(redv(3083,R0_TAG_BODY,2,0,...v)),
(...v)=>(redv(12299,R1_ATTRIBUTE_DATA,2,0,...v)),
()=>(230),
()=>(238),
(...v)=>(redv(8199,R0_ATTRIBUTE_DATA,1,0,...v)),
()=>(9223),
()=>(242),
()=>(250),
()=>(246),
()=>(17415),
()=>(258),
(...v)=>(redv(7183,R0_ATTRIBUTE_HEAD,3,0,...v)),
(...v)=>(redv(8203,R1_ATTRIBUTE_DATA,2,0,...v)),
(...v)=>(rednv(15375,C0_BASIC_BINDING,3,0,...v)),
(...v)=>(redv(17419,R0_BINDING_DATA,2,0,...v)),
(...v)=>(rednv(2083,fn.wick_html_element,8,0,...v)),
()=>(266),
(...v)=>(rednv(16407,C0_CALL_BINDING,5,0,...v))],

    //Goto Lookup Functions
    goto = [v=>lsm(v,gt0),
nf,
nf,
v=>lsm(v,gt1),
v=>lsm(v,gt2),
nf,
v=>lsm(v,gt3),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt4),
nf,
nf,
v=>lsm(v,gt5),
nf,
nf,
v=>lsm(v,gt6),
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
v=>lsm(v,gt8),
v=>lsm(v,gt9),
nf,
nf,
nf,
nf,
v=>lsm(v,gt10),
nf,
nf,
v=>lsm(v,gt11),
nf,
nf,
nf,
v=>lsm(v,gt12),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt12),
v=>lsm(v,gt13),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt14),
nf,
v=>lsm(v,gt13),
nf,
v=>lsm(v,gt13),
nf];

function getToken(l, SYM_LU) {
    if (l.END) return 0; /*7*/

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

                const recovery_token = eh[ss[sp]](tk, e, o, l, p, ss[sp]);

                if (RECOVERING > 0 && typeof(recovery_token) == "string") {
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
    console.log(time);
    return o[0];
};

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

class HTMLTag{
	constructor(sym, env){

		const 
			tag = sym[1],
			attribs = sym[2],
			children = sym[4];

		for(const child of children)
			child.parent = this;


		this.tag = tag;
		this.attribs = attribs;
		this.children = children;
		this.url = "";
	}

	createElement() {
        return createElement(this.tag);
    }

    toString(){

    }

	mount(element, scope, statics){
		let out_statics = statics;

        if (this.url || this.__statics__)
            out_statics = Object.assign({}, statics, this.__statics__, { url: this.getURL(par_list.length - 1) });

        const own_element = this.createElement(scope);

        if (!scope)
            scope = new Scope(null, presets || this.__presets__ || this.presets, own_element, this);

        if (this.HAS_TAPS)
            taps = scope.linkTaps(this.tap_list);

        if (own_element) {

            if (!scope.ele) scope.ele = own_element;

            if (this._badge_name_)
                scope.badges[this._badge_name_] = own_element;

            if (element) appendChild(element, own_element);

            for (let i = 0, l = this.bindings.length; i < l; i++) {
                let attr = this.bindings[i];
                attr.binding._bind_(scope, errors, taps, own_element, attr.name, this, statics);
            }
        }

        const ele = own_element ? own_element : element;

        par_list.push(this);

        for (let node = this.fch; node; node = this.getNextChild(node))
            node.build(ele, scope, presets, errors, taps, out_statics);

        par_list.pop();

        return scope;
	}
}

//Environment object for HTML parser

const env = {
	functions : {
		wick_html_element: HTMLTag,
	},
	options : {
		integrate : false
	}
};

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
const i = 105;
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

function whind(string, INCLUDE_WHITE_SPACE_TOKENS = false) { return new Lexer(string, INCLUDE_WHITE_SPACE_TOKENS) }

whind.constructor = Lexer;

Lexer.types = Types;
whind.types = Types;

let fn$1 = {}; const 
/************** Maps **************/

    /* Symbols To Inject into the Lexer */
    symbols$1 = ["{","}","(",")","[","]",".","...",";",",","<",">","<=",">=","==","!=","===","!==","+","-","*","%","/","**","++","--","<<",">>",">>>","&","|","^","!","~","&&","||","?",":","+=","-=","*=","%=","/=","**=","<<=",">>=",">>>=","&=","|=","^=","=>"],

    /* Goto lookup maps */
    gt0$1 = [0,-1,1,-18,2,3,4,5,6,7,103,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-2,104,108,-2,62,106,-7,27,83,-4,81,63,102,-7,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt1$1 = [0,-23,111,6,7,103,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-2,104,108,-2,62,106,-7,27,83,-4,81,63,102,-7,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt2$1 = [0,-22,112,5,6,7,103,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-2,104,108,-2,62,106,-7,27,83,-4,81,63,102,-7,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt3$1 = [0,-113,116],
gt4$1 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-17,156,157,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt5$1 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-17,167,157,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt6$1 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-17,168,157,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt7$1 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-17,169,157,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt8$1 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-17,170,157,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt9$1 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-17,171,157,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt10$1 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-17,172,157,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt11$1 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-17,173,157,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt12$1 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-17,174,157,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt13$1 = [0,-95,176],
gt14$1 = [0,-95,181],
gt15 = [0,-61,62,165,-14,63,166,-9,182,183,57,58,79,-4,56,160,-9,159,-20,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt16 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,187,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt17 = [0,-95,192],
gt18 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-17,193,157,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt19 = [0,-47,195],
gt20 = [0,-55,197,198,-73,200,202,203,-15,199,201,66],
gt21 = [0,-24,207,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt22 = [0,-146,213,-2,214,66],
gt23 = [0,-146,216,-2,214,66],
gt24 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,218,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt25 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,220,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt26 = [0,-29,221],
gt27 = [0,-79,224,225,-67,223,201,66],
gt28 = [0,-148,229,201,66],
gt29 = [0,-59,230,231,-69,233,202,203,-15,232,201,66],
gt30 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,235,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt31 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,236,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt32 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,237,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt33 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,238,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt34 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-7,239,31,32,33,34,35,36,37,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt35 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-8,240,32,33,34,35,36,37,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt36 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-9,241,33,34,35,36,37,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt37 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-10,242,34,35,36,37,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt38 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-11,243,35,36,37,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt39 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-12,244,36,37,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt40 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-12,245,36,37,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt41 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-12,246,36,37,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt42 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-12,247,36,37,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt43 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-13,248,37,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt44 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-13,249,37,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt45 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-13,250,37,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt46 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-13,251,37,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt47 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-13,252,37,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt48 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-13,253,37,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt49 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-14,254,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt50 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-14,255,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt51 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-14,256,38,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt52 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-15,257,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt53 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-15,258,39,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt54 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-16,259,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt55 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-16,260,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt56 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-16,261,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt57 = [0,-61,62,165,-13,81,63,166,-8,158,52,54,57,58,79,53,80,-2,56,160,-9,159,-16,262,40,41,49,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt58 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,265,264,268,267,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt59 = [0,-84,276,-14,271,272,273,-1,278,279,280,274,-35,282,283,-3,275,-1,162,281],
gt60 = [0,-150,287],
gt61 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,288,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt62 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-1,290,56,160,-9,159,-3,291,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt63 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,293,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt64 = [0,-150,294],
gt65 = [0,-95,295],
gt66 = [0,-130,300,202,203,-15,299,201,66],
gt67 = [0,-150,301],
gt68 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,302,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt69 = [0,-61,62,165,-7,27,83,303,-3,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,-10,159,-3,304,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt70 = [0,-24,307,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-1,306,20,-3,21,11,-6,62,308,-7,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt71 = [0,-107,311],
gt72 = [0,-107,313],
gt73 = [0,-103,320,279,280,-27,315,316,-2,318,-1,319,-2,282,283,-4,321,201,281],
gt74 = [0,-110,323,-19,330,202,203,-2,325,327,-1,328,329,324,-7,321,201,66],
gt75 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,331,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt76 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,333,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt77 = [0,-34,339,-22,337,340,-2,62,165,-7,27,83,-4,81,63,166,-7,334,338,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt78 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,342,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt79 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,346,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt80 = [0,-50,348,349],
gt81 = [0,-79,352,225],
gt82 = [0,-81,354,356,357,358,-18,361,279,280,-36,282,283,-6,362],
gt83 = [0,-61,62,165,-13,81,63,166,-8,363,52,54,57,58,79,53,80,-2,56,160,-9,159,-20,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt84 = [0,-64,364,366,365,368,-62,330,202,203,-5,369,329,367,-7,321,201,66],
gt85 = [0,-107,373],
gt86 = [0,-107,374],
gt87 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-2,379,378,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt88 = [0,-110,381],
gt89 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,383,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt90 = [0,-107,386],
gt91 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,387,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt92 = [0,-102,388],
gt93 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,391,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt94 = [0,-103,392,279,280,-36,282,283,-6,362],
gt95 = [0,-103,393,279,280,-36,282,283,-6,362],
gt96 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,397,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt97 = [0,-22,405,5,6,7,103,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-2,104,108,-2,62,106,-6,404,27,83,-4,81,63,102,-7,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt98 = [0,-56,406,-73,200,202,203,-15,199,201,66],
gt99 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,407,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt100 = [0,-148,411,201,66],
gt101 = [0,-107,413],
gt102 = [0,-130,330,202,203,-5,416,329,414,-7,321,201,66],
gt103 = [0,-130,421,202,203,-15,420,201,66],
gt104 = [0,-107,422],
gt105 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,427,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt106 = [0,-35,430,-19,429,198,-73,432,202,203,-15,431,201,66],
gt107 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,433,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt108 = [0,-35,439,-23,230,231,-69,441,202,203,-15,440,201,66],
gt109 = [0,-34,444,-23,445,-2,62,165,-13,81,63,166,-8,442,52,54,57,58,79,53,80,-2,56,160,-9,159,-20,161,-11,61,70,71,69,68,-1,60,-1,162,66],
gt110 = [0,-51,448],
gt111 = [0,-29,450],
gt112 = [0,-81,451,356,357,358,-18,361,279,280,-36,282,283,-6,362],
gt113 = [0,-83,454,358,-18,361,279,280,-36,282,283,-6,362],
gt114 = [0,-84,455,-18,361,279,280,-36,282,283,-6,362],
gt115 = [0,-64,458,366,365,368,-62,330,202,203,-5,369,329,367,-7,321,201,66],
gt116 = [0,-60,459,-69,233,202,203,-15,232,201,66],
gt117 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,460,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt118 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-1,464,463,462,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt119 = [0,-84,276,-15,466,273,-1,278,279,280,274,-35,282,283,-3,275,-1,162,281],
gt120 = [0,-63,467,468,366,365,368,-62,330,202,203,-5,369,329,367,-7,321,201,66],
gt121 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,469,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt122 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,474,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt123 = [0,-130,477,202,203,-15,476,201,66],
gt124 = [0,-103,320,279,280,-27,479,-3,481,-1,319,-2,282,283,-4,321,201,281],
gt125 = [0,-130,330,202,203,-5,482,329,-8,321,201,66],
gt126 = [0,-110,485,-19,330,202,203,-3,487,-1,328,329,486,-7,321,201,66],
gt127 = [0,-24,488,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt128 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,489,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt129 = [0,-24,490,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt130 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,491,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt131 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,494,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt132 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,500,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt133 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,502,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt134 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,503,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt135 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,504,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt136 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,505,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt137 = [0,-35,507,-94,509,202,203,-15,508,201,66],
gt138 = [0,-35,439,-94,509,202,203,-15,508,201,66],
gt139 = [0,-42,511],
gt140 = [0,-24,513,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt141 = [0,-52,514,-77,516,202,203,-15,515,201,66],
gt142 = [0,-66,519,520,-62,330,202,203,-5,369,329,367,-7,321,201,66],
gt143 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,522,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt144 = [0,-67,526,-17,525,-44,330,202,203,-5,369,329,-8,321,201,66],
gt145 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,527,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt146 = [0,-130,330,202,203,-5,416,329,532,-7,321,201,66],
gt147 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,537,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt148 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,539,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt149 = [0,-24,541,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt150 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,542,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt151 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,544,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt152 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,545,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt153 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,546,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt154 = [0,-24,549,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt155 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,554,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt156 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,556,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt157 = [0,-43,558,560,559],
gt158 = [0,-22,405,5,6,7,103,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-2,104,108,-2,62,106,-5,564,565,27,83,-4,81,63,102,-7,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt159 = [0,-24,571,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt160 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,573,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt161 = [0,-24,576,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt162 = [0,-24,578,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt163 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,580,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt164 = [0,-24,585,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt165 = [0,-24,586,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt166 = [0,-24,587,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt167 = [0,-24,588,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt168 = [0,-24,589,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt169 = [0,-24,590,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt170 = [0,-61,62,165,-7,27,83,-4,81,63,166,-8,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,592,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt171 = [0,-44,596,594],
gt172 = [0,-43,597,560],
gt173 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,599,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt174 = [0,-29,601],
gt175 = [0,-22,405,5,6,7,103,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-2,104,108,-2,62,106,-5,603,565,27,83,-4,81,63,102,-7,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt176 = [0,-22,405,5,6,7,103,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-2,104,108,-2,62,106,-5,604,565,27,83,-4,81,63,102,-7,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt177 = [0,-22,405,5,6,7,103,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-2,104,108,-2,62,106,-5,605,565,27,83,-4,81,63,102,-7,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt178 = [0,-24,608,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt179 = [0,-24,609,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt180 = [0,-24,610,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt181 = [0,-61,62,165,-7,27,83,-4,81,63,166,-7,611,28,52,54,57,58,79,53,80,-2,56,160,-9,159,-3,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,-1,60,84,189,66],
gt182 = [0,-24,614,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt183 = [0,-24,615,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt184 = [0,-24,616,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt185 = [0,-24,617,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt186 = [0,-24,618,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt187 = [0,-24,620,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt188 = [0,-44,621],
gt189 = [0,-44,596],
gt190 = [0,-22,625,5,6,7,103,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-2,104,108,-2,62,106,-7,27,83,-4,81,63,102,-7,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt191 = [0,-22,405,5,6,7,103,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-2,104,108,-2,62,106,-5,629,565,27,83,-4,81,63,102,-7,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt192 = [0,-24,630,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt193 = [0,-24,632,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt194 = [0,-24,633,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt195 = [0,-24,634,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt196 = [0,-22,636,5,6,7,103,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-2,104,108,-2,62,106,-7,27,83,-4,81,63,102,-7,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],
gt197 = [0,-24,638,-2,14,8,22,12,9,13,89,-2,15,16,17,19,18,90,-4,10,-2,20,-3,21,11,-6,62,-8,27,83,-4,81,63,-8,24,28,52,54,57,58,79,53,80,-2,56,-14,25,-1,26,29,30,31,32,33,34,35,36,37,38,39,40,41,49,64,-11,61,70,71,69,68,85,60,84,65,66],

    // State action lookup maps
    sm0$1=[0,1,2,3,4,0,-4,0,-8,5,-3,6,-1,7,8,9,-2,10,11,-2,12,13,14,15,-2,16,17,18,19,20,21,22,-2,23,-2,24,25,-5,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm1$1=[0,41,-3,0,-4,0],
sm2$1=[0,42,-3,0,-4,0],
sm3$1=[0,43,-3,0,-4,0],
sm4$1=[0,44,2,3,4,0,-4,0,-8,5,-3,6,-1,7,8,9,-2,10,11,-2,12,13,14,15,-2,16,17,18,19,20,21,22,-2,23,-2,24,25,-5,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm5$1=[0,45,45,45,45,0,-4,0,-8,45,45,-2,45,45,45,45,45,45,-1,45,45,-2,45,45,45,45,-2,45,45,45,45,45,45,45,45,-1,45,-2,45,45,-5,45,-2,45,-2,45,-31,45,45,-3,45,45,45,45,45,45,45,-2,45,45,45],
sm6$1=[0,46,46,46,46,0,-4,0,-8,46,46,-2,46,46,46,46,46,46,-1,46,46,-2,46,46,46,46,-2,46,46,46,46,46,46,46,46,-1,46,-2,46,46,-5,46,-2,46,-2,46,-31,46,46,-3,46,46,46,46,46,46,46,-2,46,46,46],
sm7$1=[0,47,47,47,47,0,-4,0,-8,47,47,-2,47,47,47,47,47,47,-1,47,47,-1,47,47,47,47,47,-2,47,47,47,47,47,47,47,47,-1,47,-2,47,47,-5,47,-2,47,-2,47,-31,47,47,-3,47,47,47,47,47,47,47,-2,47,47,47],
sm8$1=[0,48,48,48,48,0,-4,0,-8,48,48,-2,48,48,48,48,48,48,-1,48,48,-1,48,48,48,48,48,-2,48,48,48,48,48,48,48,48,-1,48,-2,48,48,-5,48,-2,48,-2,48,-31,48,48,-3,48,48,48,48,48,48,48,-2,48,48,48],
sm9$1=[0,-1,2,3,4,0,-4,0,-8,5,-3,6,-1,7,8,9,-2,10,11,-2,12,13,14,15,-2,16,17,18,19,20,21,22,-2,23,-2,24,25,-5,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm10$1=[0,-4,0,-4,0,-5,49,-6,50],
sm11$1=[0,-4,0,-4,0,-5,51,-6,51,-8,51,-15,51,-11,51],
sm12$1=[0,-4,0,-4,0,-5,52,-3,52,-2,52,-8,52,-15,52,-11,52],
sm13$1=[0,-4,0,-4,0,-5,53,53,-2,53,-2,53,-8,53,-5,53,-9,53,-11,53,-5,54,55,56,57,58,59,60,61,62,63,64,65,66,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,-5,67,68],
sm14$1=[0,-4,0,-4,0,-5,69,-3,69,-2,69,-8,69,-15,69,-11,69,-18,70,71],
sm15$1=[0,-4,0,-4,0,-5,72,-3,72,-2,72,-8,72,-15,72,-11,72,-18,72,72,73],
sm16$1=[0,-4,0,-4,0,-5,74,-3,74,-2,74,-8,74,-15,74,-11,74,-18,74,74,74,75],
sm17$1=[0,-4,0,-4,0,-5,76,-3,76,-2,76,-8,76,-15,76,-11,76,-18,76,76,76,76,77],
sm18$1=[0,-4,0,-4,0,-5,78,-3,78,-2,78,-8,78,-15,78,-11,78,-18,78,78,78,78,78,79],
sm19$1=[0,-4,0,-4,0,-5,80,-3,80,-2,80,-8,80,-15,80,-11,80,-18,80,80,80,80,80,80,81,82,83,84],
sm20$1=[0,-4,0,-4,0,-5,85,-3,85,-2,85,-8,85,-5,86,-9,85,-11,85,-18,85,85,85,85,85,85,85,85,85,85,87,88,89,90,91],
sm21$1=[0,-4,0,-4,0,-5,92,-3,92,-2,92,-8,92,-5,92,-9,92,-11,92,-18,92,92,92,92,92,92,92,92,92,92,92,92,92,92,92,93,94,95],
sm22$1=[0,-4,0,-4,0,-5,96,-3,96,-2,96,-8,96,-5,96,-9,96,-11,96,-18,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,97,98],
sm23$1=[0,-4,0,-4,0,-5,99,100,-2,99,-2,99,-8,99,-5,99,-9,99,-11,99,-18,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,101,102],
sm24$1=[0,-4,0,-4,0,-5,103,103,-2,103,-2,103,-8,103,-5,103,-9,103,-11,103,-18,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103],
sm25$1=[0,-4,0,-4,0,-5,104,104,-2,104,-2,104,-8,104,-5,104,-9,104,-11,104,-18,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104],
sm26$1=[0,-4,0,-4,0,-5,105,105,-2,105,-2,105,-8,105,-5,105,-9,105,-11,105,-18,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,106],
sm27$1=[0,-1,2,3,4,0,-4,0,-8,107,-5,7,8,-1,108,-2,11,-8,16,-18,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm28$1=[0,-4,0,-4,0,-5,105,105,-2,105,-2,105,-8,105,-5,105,-9,105,-11,105,-18,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105],
sm29$1=[0,-4,0,-4,0,-5,109,109,-1,109,109,-2,109,-8,109,-5,109,109,-8,109,-11,109,-5,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,-5,109,109],
sm30$1=[0,-4,0,-4,0,-5,109,109,-1,109,109,-2,109,-4,110,-2,111,109,-5,109,109,-8,109,-11,109,112,-4,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,-5,109,109],
sm31$1=[0,-4,0,-4,0,-5,113,113,-1,113,113,-2,113,-4,114,-2,111,113,-5,113,113,-8,113,-11,113,115,-4,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,-5,113,113],
sm32$1=[0,-1,2,3,4,0,-4,0,-8,107,-5,7,8,-1,108,-2,11,-27,26,-1,116,117,-2,28,-45,38,39,40],
sm33$1=[0,-4,0,-4,0,-5,118,118,-1,118,118,-2,118,-4,118,-2,118,118,-5,118,118,-8,118,-11,118,118,-4,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,118,-5,118,118],
sm34$1=[0,-4,0,-4,0,-5,119,119,-1,119,119,-2,119,-4,119,-2,119,119,-5,119,119,-8,119,-11,119,119,-4,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,-5,119,119],
sm35$1=[0,-4,0,-4,0,-5,120,120,-1,120,120,-2,120,-4,120,-2,120,120,-5,120,120,-8,120,-11,120,120,-4,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,-5,120,120],
sm36$1=[0,-4,0,-4,0,-5,120,120,-2,120,-2,120,-4,120,-2,120,120,-5,120,120,-8,120,-5,121,-5,120,120,-4,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,-5,120,120],
sm37$1=[0,-4,0,-4,0,-5,122,122,-5,122,-4,122,-2,122,-6,122,-9,123,-5,124,-6,122,-4,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,-5,122,122],
sm38$1=[0,-4,0,-4,0,-5,125,125,-1,125,125,-2,125,-4,125,-2,125,125,-5,125,125,-8,125,-5,125,125,-4,125,125,-4,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,-5,125,125],
sm39$1=[0,-4,0,-4,0,-5,126,126,-1,126,126,-2,126,-4,126,-2,126,126,-5,126,126,-8,126,-5,126,126,-4,126,126,-4,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,-5,126,126],
sm40$1=[0,-4,0,-4,0,-5,127,127,-1,127,127,-2,127,-4,127,-2,127,127,-5,127,127,-8,127,-11,127,127,-4,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,-5,127,127],
sm41$1=[0,-4,0,-4,0,-5,128,128,-1,128,128,-2,128,-4,128,-2,128,128,-5,128,128,-8,128,-11,128,128,-4,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,-5,128,128],
sm42$1=[0,-4,0,-4,0,-5,129,129,-1,129,129,-2,129,-4,129,-2,129,129,-5,129,129,-8,129,-11,129,129,-4,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,-5,129,129],
sm43$1=[0,-4,0,-4,0,-5,130,130,-1,130,130,-2,130,-4,130,-2,130,130,-5,130,130,-8,130,-11,130,130,-4,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,-5,130,130],
sm44$1=[0,-4,0,-4,0,-5,131,131,-1,131,131,-2,131,-4,131,-2,131,131,-5,131,131,-8,131,-11,131,131,-4,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,-5,131,131],
sm45$1=[0,-1,2,3,4,0,-4,0,-8,107,-5,7,8,-1,108,-2,11,132,-7,16,-18,26,-2,27,-1,133,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm46$1=[0,-4,0,-4,0,-17,134,-2,111,-29,135],
sm47$1=[0,-4,0,-4,0,-5,136,136,-1,136,136,-2,136,-4,136,-2,136,136,-5,136,136,-8,136,-11,136,136,-4,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,-5,136,136],
sm48=[0,-4,0,-4,0,-5,137,137,-1,137,137,-2,137,-4,137,-2,137,137,-5,137,137,-8,137,-11,137,137,-4,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,-5,137,137],
sm49=[0,-4,0,-4,0,-43,138],
sm50=[0,-4,0,-4,0,-43,121],
sm51=[0,-4,0,-4,0,-37,139],
sm52=[0,-2,3,-1,0,-4,0,-8,140,-8,141],
sm53=[0,142,142,142,142,0,-4,0,-8,142,142,-2,142,142,142,142,142,142,-1,142,142,-1,142,142,142,142,142,-2,142,142,142,142,142,142,142,142,-1,142,-2,142,142,-5,142,-2,142,-2,142,-31,142,142,-3,142,142,142,142,142,142,142,-2,142,142,142],
sm54=[0,-4,0,-4,0,-20,143],
sm55=[0,144,144,144,144,0,-4,0,-8,144,144,-2,144,144,144,144,144,144,-1,144,144,-1,144,144,144,144,144,-2,144,144,144,144,144,144,144,144,-1,144,-2,144,144,-5,144,-2,144,-2,144,-31,144,144,-3,144,144,144,144,144,144,144,-2,144,144,144],
sm56=[0,-1,2,3,4,0,-4,0,-8,5,-3,6,-6,10,11,-2,12,13,14,15,-2,16,17,18,19,20,21,22,-2,23,-2,24,-6,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm57=[0,-4,0,-4,0,-20,145],
sm58=[0,-4,0,-4,0,-20,146,-8,147],
sm59=[0,-4,0,-4,0,-20,148],
sm60=[0,-2,3,-1,0,-4,0,-12,149],
sm61=[0,-2,3,-1,0,-4,0,-12,150],
sm62=[0,-1,2,3,4,0,-4,0,-8,107,-3,151,-1,7,8,-1,108,-2,11,-8,16,-18,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm63=[0,-4,0,-4,0,-20,152],
sm64=[0,-4,0,-4,0,-8,5],
sm65=[0,-4,0,-4,0,-12,153],
sm66=[0,154,154,154,154,0,-4,0,-8,154,154,-2,154,154,154,154,154,154,-1,154,154,-2,154,154,154,154,-2,154,154,154,154,154,154,154,154,-1,154,-2,154,154,-5,154,-2,154,-2,154,-31,154,154,-3,154,154,154,154,154,154,154,-2,154,154,154],
sm67=[0,-2,3,-1,0,-4,0,-8,155,-35,156],
sm68=[0,157,157,157,157,0,-4,0,-8,157,157,-2,157,157,157,157,157,157,-1,157,157,-2,157,157,157,157,-2,157,157,157,157,157,157,157,157,-1,157,-2,157,157,-5,157,-2,157,-2,157,-31,157,157,-3,157,157,157,157,157,157,157,-2,157,157,157],
sm69=[0,-2,3,-1,0,-4,0,-20,158],
sm70=[0,-2,159,-1,0,-4,0,-8,159,-8,159],
sm71=[0,-2,160,-1,0,-4,0,-8,160,-8,160],
sm72=[0,161,161,161,161,0,-4,0,-8,161,161,-2,161,161,161,161,161,161,-1,161,161,-2,161,161,161,161,-2,161,161,161,161,161,161,161,161,-1,161,-2,161,161,-5,161,-2,161,-2,161,-31,161,161,-3,161,161,161,161,161,161,161,-2,161,161,161],
sm73=[0,-1,2,3,4,0,-4,0,-8,5,162,-2,6,-1,7,8,9,-2,10,11,-2,12,13,14,15,-2,16,17,18,19,20,21,22,-2,23,-2,24,25,-5,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm74=[0,163,163,163,163,0,-4,0,-8,163,163,-2,163,163,163,163,163,163,-1,163,163,-1,163,163,163,163,163,-2,163,163,163,163,163,163,163,163,-1,163,-2,163,163,-5,163,-2,163,-2,163,-31,163,163,-3,163,163,163,163,163,163,163,-2,163,163,163],
sm75=[0,-4,0,-4,0,-5,164,164,-2,164,-2,164,-8,164,-5,164,-9,164,-11,164,-18,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164],
sm76=[0,-4,0,-4,0,-5,165,165,-2,165,-2,165,-8,165,-5,165,-9,165,-11,165,-18,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165],
sm77=[0,-1,166,166,166,0,-4,0,-8,166,-5,166,166,-1,166,-2,166,-8,166,-18,166,-2,166,-2,166,-31,166,166,-3,166,166,166,166,166,166,166,-2,166,166,166],
sm78=[0,-4,0,-4,0,-5,167,167,-2,167,-2,167,-8,167,-5,167,-9,167,-11,167,-18,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167],
sm79=[0,-4,0,-4,0,-5,53,53,-2,53,-2,53,-8,53,-5,53,-9,53,-11,53,-18,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,-5,67,68],
sm80=[0,-4,0,-4,0,-5,168,168,-1,168,168,-2,168,-4,168,-2,168,168,-5,168,168,-8,168,-11,168,168,-4,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,-5,168,168],
sm81=[0,-4,0,-4,0,-5,169,169,-1,169,169,-2,169,-4,169,-2,169,169,-5,169,169,-8,169,-11,169,169,-4,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,-5,169,169],
sm82=[0,-4,0,-4,0,-5,122,122,-1,122,122,-2,122,-4,122,-2,122,122,-5,122,122,-8,122,-11,122,122,-4,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,-5,122,122],
sm83=[0,-1,2,3,4,0,-4,0,-5,170,-2,107,-5,7,8,-1,108,-2,11,-8,16,-18,26,171,-1,27,-1,172,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm84=[0,-1,2,3,4,0,-4,0,-9,173,-7,174,-28,175,176,-5,177],
sm85=[0,-4,0,-4,0,-5,178,178,-1,178,178,-2,178,-4,178,-2,178,178,-5,178,178,-8,178,-11,178,178,-4,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,-5,178,178],
sm86=[0,-4,0,-4,0,-5,179,179,-1,179,179,-2,179,-4,179,-2,179,179,-5,179,179,-8,179,-11,179,179,-4,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,-5,179,179],
sm87=[0,-4,0,-4,0,-5,180,180,-2,180,-2,180,-8,180,-5,180,-9,180,-11,180,-18,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180],
sm88=[0,-4,0,-4,0,-5,181,181,-2,181,-2,181,-8,181,-5,181,-9,181,-11,181,-18,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181],
sm89=[0,-4,0,-4,0,-5,182,182,-2,182,-2,182,-8,182,-5,182,-9,182,-11,182,-18,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182],
sm90=[0,-4,0,-4,0,-5,183,183,-2,183,-2,183,-8,183,-5,183,-9,183,-11,183,-18,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183],
sm91=[0,-4,0,-4,0,-5,184,184,-2,184,-2,184,-8,184,-5,184,-9,184,-11,184,-18,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184],
sm92=[0,-4,0,-4,0,-5,185,185,-2,185,-2,185,-8,185,-5,185,-9,185,-11,185,-18,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185],
sm93=[0,-4,0,-4,0,-5,186,186,-2,186,-2,186,-8,186,-5,186,-9,186,-11,186,-18,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186],
sm94=[0,-4,0,-4,0,-5,187,187,-2,187,-2,187,-8,187,-5,187,-9,187,-11,187,-18,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187],
sm95=[0,-2,3,-1,0,-4,0],
sm96=[0,-4,0,-4,0,-5,188,188,-1,188,188,-2,188,-4,188,-2,188,188,-5,188,188,-8,188,-11,188,188,-4,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,-5,188,188],
sm97=[0,-1,2,3,4,0,-4,0,-8,107,-5,7,8,-1,108,-2,11,189,-7,16,-18,26,-2,27,-1,190,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm98=[0,-4,0,-4,0,-5,191,191,-1,191,191,-2,191,-4,191,-2,191,191,-5,191,191,-8,191,-11,191,191,-4,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,-5,191,191],
sm99=[0,-4,0,-4,0,-5,192,192,-1,192,192,-2,192,-8,192,-5,192,192,-8,192,-11,192,-5,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,-5,192,192],
sm100=[0,-4,0,-4,0,-52,193],
sm101=[0,-4,0,-4,0,-17,134,-32,135],
sm102=[0,-4,0,-4,0,-5,194,194,-1,194,194,-2,194,-4,194,-2,194,194,-5,194,194,-8,194,-5,194,-5,194,194,-4,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,-5,194,194],
sm103=[0,-4,0,-4,0,-5,195,-15,196],
sm104=[0,-4,0,-4,0,-5,122,122,-2,122,-2,122,-4,122,-2,122,122,-5,122,122,-8,122,-5,124,-5,122,122,-4,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,-5,122,122],
sm105=[0,-4,0,-4,0,-5,197,197,-1,197,197,-2,197,-4,197,-2,197,197,-5,197,197,-8,197,-11,197,197,-4,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,-5,197,197],
sm106=[0,-4,0,-4,0,-5,198,198,-2,198,-2,198,-8,198,-5,198,-9,198,-11,198,-18,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198],
sm107=[0,-1,2,3,4,0,-4,0,-8,199,-5,7,8,-1,108,-2,11,-8,16,-18,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm108=[0,200,200,200,200,0,-4,0,-8,200,200,-2,200,200,200,200,200,200,-1,200,200,-1,200,200,200,200,200,-2,200,200,200,200,200,200,200,200,-1,200,-2,200,200,-5,200,-2,200,-2,200,-31,200,200,-3,200,200,200,200,200,200,200,-2,200,200,200],
sm109=[0,-1,2,3,4,0,-4,0,-8,5,-3,6,-1,7,-4,10,11,-2,12,13,14,15,-2,16,17,18,19,20,21,22,-2,23,-2,24,-6,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm110=[0,-4,0,-4,0,-5,201,-6,202],
sm111=[0,-4,0,-4,0,-5,203,-6,203],
sm112=[0,-4,0,-4,0,-5,204,-6,204,-42,205],
sm113=[0,-4,0,-4,0,-55,205],
sm114=[0,-4,0,-4,0,-5,124,-2,124,124,-2,124,-7,124,124,-5,124,124,-15,124,-4,124,-5,124],
sm115=[0,-4,0,-4,0,-5,206,-3,206,-11,206,-5,206,206,-20,206,-5,206],
sm116=[0,-1,2,3,4,0,-4,0,-9,207,-7,174,-35,208],
sm117=[0,-2,3,-1,0,-4,0,-5,170,-2,140,-8,141,-31,209,-3,210],
sm118=[0,-4,0,-4,0,-24,211],
sm119=[0,-1,2,3,4,0,-4,0,-8,107,-3,212,-1,7,8,9,108,-2,11,-5,213,-2,16,-12,25,-5,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm120=[0,-4,0,-4,0,-20,214],
sm121=[0,215,215,215,215,0,-4,0,-8,215,215,-2,215,215,215,215,215,215,-1,215,215,-1,215,215,215,215,215,-2,215,215,215,215,215,215,215,215,-1,215,-2,215,215,-5,215,-2,215,-2,215,-31,215,215,-3,215,215,215,215,215,215,215,-2,215,215,215],
sm122=[0,-4,0,-4,0,-12,216],
sm123=[0,-4,0,-4,0,-12,123],
sm124=[0,217,217,217,217,0,-4,0,-8,217,217,-2,217,217,217,217,217,217,-1,217,217,-1,217,217,217,217,217,-2,217,217,217,217,217,217,217,217,-1,217,-2,217,217,-5,217,-2,217,-2,217,-31,217,217,-3,217,217,217,217,217,217,217,-2,217,217,217],
sm125=[0,-4,0,-4,0,-12,218],
sm126=[0,219,219,219,219,0,-4,0,-8,219,219,-2,219,219,219,219,219,219,-1,219,219,-1,219,219,219,219,219,-2,219,219,219,219,219,219,219,219,-1,219,-2,219,219,-5,219,-2,219,-2,219,-31,219,219,-3,219,219,219,219,219,219,219,-2,219,219,219],
sm127=[0,-4,0,-4,0,-5,49,-6,220],
sm128=[0,-4,0,-4,0,-5,49,-6,221],
sm129=[0,-4,0,-4,0,-39,222,223],
sm130=[0,224,224,224,224,0,-4,0,-8,224,224,-2,224,224,224,224,224,224,-1,224,224,-1,224,224,224,224,224,-2,224,224,224,224,224,224,224,224,-1,224,-2,224,224,-5,224,-2,224,-2,224,-31,224,224,-3,224,224,224,224,224,224,224,-2,224,224,224],
sm131=[0,-4,0,-4,0,-8,155,-35,156],
sm132=[0,225,225,225,225,0,-4,0,-5,225,225,-1,225,225,-2,225,225,225,225,225,225,-1,225,225,225,-1,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,-2,225,225,-5,225,225,225,225,-2,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,-2,225,225,225],
sm133=[0,-4,0,-4,0,-8,226],
sm134=[0,-1,2,3,4,0,-4,0,-9,227,-2,228,-4,174,-27,229,175,176],
sm135=[0,-1,2,3,4,0,-4,0,-8,107,-5,7,8,-1,108,-2,11,-27,26,-2,27,-2,28,-45,38,39,40],
sm136=[0,-2,3,-1,0,-4,0,-8,140,-8,141,-3,230,-31,210],
sm137=[0,-4,0,-4,0,-20,231],
sm138=[0,-4,0,-4,0,-5,232,-6,233],
sm139=[0,-4,0,-4,0,-5,234,-6,234],
sm140=[0,235,235,235,235,0,-4,0,-8,235,235,-2,235,235,235,235,235,235,-1,235,235,-1,235,235,235,235,235,-2,235,235,235,235,235,235,235,235,-1,235,235,235,235,235,-5,235,-2,235,-2,235,-31,235,235,-3,235,235,235,235,235,235,235,-2,235,235,235],
sm141=[0,-4,0,-4,0,-5,236,-6,236,-8,236,-15,236,-11,236],
sm142=[0,-4,0,-4,0,-5,237,-3,237,-2,237,-8,237,-15,237,-11,237],
sm143=[0,-4,0,-4,0,-37,238],
sm144=[0,-4,0,-4,0,-5,239,-3,239,-2,239,-8,239,-15,239,-11,239,-18,239,239,73],
sm145=[0,-4,0,-4,0,-5,240,-3,240,-2,240,-8,240,-15,240,-11,240,-18,240,240,240,75],
sm146=[0,-4,0,-4,0,-5,241,-3,241,-2,241,-8,241,-15,241,-11,241,-18,241,241,241,241,77],
sm147=[0,-4,0,-4,0,-5,242,-3,242,-2,242,-8,242,-15,242,-11,242,-18,242,242,242,242,242,79],
sm148=[0,-4,0,-4,0,-5,243,-3,243,-2,243,-8,243,-15,243,-11,243,-18,243,243,243,243,243,243,81,82,83,84],
sm149=[0,-4,0,-4,0,-5,244,-3,244,-2,244,-8,244,-5,86,-9,244,-11,244,-18,244,244,244,244,244,244,244,244,244,244,87,88,89,90,91],
sm150=[0,-4,0,-4,0,-5,245,-3,245,-2,245,-8,245,-5,86,-9,245,-11,245,-18,245,245,245,245,245,245,245,245,245,245,87,88,89,90,91],
sm151=[0,-4,0,-4,0,-5,246,-3,246,-2,246,-8,246,-5,86,-9,246,-11,246,-18,246,246,246,246,246,246,246,246,246,246,87,88,89,90,91],
sm152=[0,-4,0,-4,0,-5,247,-3,247,-2,247,-8,247,-5,86,-9,247,-11,247,-18,247,247,247,247,247,247,247,247,247,247,87,88,89,90,91],
sm153=[0,-4,0,-4,0,-5,248,-3,248,-2,248,-8,248,-5,248,-9,248,-11,248,-18,248,248,248,248,248,248,248,248,248,248,248,248,248,248,248,93,94,95],
sm154=[0,-4,0,-4,0,-5,249,-3,249,-2,249,-8,249,-5,249,-9,249,-11,249,-18,249,249,249,249,249,249,249,249,249,249,249,249,249,249,249,93,94,95],
sm155=[0,-4,0,-4,0,-5,250,-3,250,-2,250,-8,250,-5,250,-9,250,-11,250,-18,250,250,250,250,250,250,250,250,250,250,250,250,250,250,250,93,94,95],
sm156=[0,-4,0,-4,0,-5,251,-3,251,-2,251,-8,251,-5,251,-9,251,-11,251,-18,251,251,251,251,251,251,251,251,251,251,251,251,251,251,251,93,94,95],
sm157=[0,-4,0,-4,0,-5,252,-3,252,-2,252,-8,252,-5,252,-9,252,-11,252,-18,252,252,252,252,252,252,252,252,252,252,252,252,252,252,252,93,94,95],
sm158=[0,-4,0,-4,0,-5,253,-3,253,-2,253,-8,253,-5,253,-9,253,-11,253,-18,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,93,94,95],
sm159=[0,-4,0,-4,0,-5,254,-3,254,-2,254,-8,254,-5,254,-9,254,-11,254,-18,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,97,98],
sm160=[0,-4,0,-4,0,-5,255,-3,255,-2,255,-8,255,-5,255,-9,255,-11,255,-18,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,97,98],
sm161=[0,-4,0,-4,0,-5,256,-3,256,-2,256,-8,256,-5,256,-9,256,-11,256,-18,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256,97,98],
sm162=[0,-4,0,-4,0,-5,257,100,-2,257,-2,257,-8,257,-5,257,-9,257,-11,257,-18,257,257,257,257,257,257,257,257,257,257,257,257,257,257,257,257,257,257,257,257,101,102],
sm163=[0,-4,0,-4,0,-5,258,100,-2,258,-2,258,-8,258,-5,258,-9,258,-11,258,-18,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,101,102],
sm164=[0,-4,0,-4,0,-5,259,259,-2,259,-2,259,-8,259,-5,259,-9,259,-11,259,-18,259,259,259,259,259,259,259,259,259,259,259,259,259,259,259,259,259,259,259,259,259,259],
sm165=[0,-4,0,-4,0,-5,260,260,-2,260,-2,260,-8,260,-5,260,-9,260,-11,260,-18,260,260,260,260,260,260,260,260,260,260,260,260,260,260,260,260,260,260,260,260,260,260],
sm166=[0,-4,0,-4,0,-5,261,261,-2,261,-2,261,-8,261,-5,261,-9,261,-11,261,-18,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261],
sm167=[0,-4,0,-4,0,-5,262,262,-2,262,-2,262,-8,262,-5,262,-9,262,-11,262,-18,262,262,262,262,262,262,262,262,262,262,262,262,262,262,262,262,262,262,262,262,262,262],
sm168=[0,-4,0,-4,0,-5,263,263,-1,263,263,-2,263,-4,263,-2,263,263,-5,263,263,-8,263,-11,263,263,-4,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263,-5,263,263],
sm169=[0,-1,2,3,4,0,-4,0,-5,264,-2,107,-5,7,8,-1,108,-2,11,-8,16,-18,26,265,-1,27,-1,172,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm170=[0,-4,0,-4,0,-5,266,-43,267],
sm171=[0,-1,268,268,268,0,-4,0,-5,268,-2,268,-5,268,268,-1,268,-2,268,-8,268,-18,268,268,-1,268,-1,268,268,-31,268,268,-3,268,268,268,268,268,268,268,-2,268,268,268],
sm172=[0,-4,0,-4,0,-5,269,-43,269],
sm173=[0,-4,0,-4,0,-5,270,270,-1,270,270,-2,270,-4,270,-2,270,270,-5,270,270,-8,270,-11,270,270,-4,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,-5,270,270],
sm174=[0,-4,0,-4,0,-5,271,-3,272],
sm175=[0,-4,0,-4,0,-5,273,-3,273],
sm176=[0,-4,0,-4,0,-5,274,-3,274],
sm177=[0,-4,0,-4,0,-5,275,-3,275],
sm178=[0,-4,0,-4,0,-5,274,-3,274,-45,205],
sm179=[0,-4,0,-4,0,-20,276,-16,277],
sm180=[0,-4,0,-4,0,-20,278,-16,278],
sm181=[0,-4,0,-4,0,-5,125,-3,125,-10,279,-16,279,-17,125],
sm182=[0,-4,0,-4,0,-20,279,-16,279],
sm183=[0,-1,2,3,4,0,-4,0,-17,174],
sm184=[0,-4,0,-4,0,-5,280,280,-1,280,280,-2,280,-4,280,-2,280,280,-5,280,280,-8,280,-11,280,280,-4,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,-5,280,280],
sm185=[0,-4,0,-4,0,-5,49,-43,281],
sm186=[0,-4,0,-4,0,-5,282,282,-1,282,282,-2,282,-4,282,-2,282,282,-5,282,282,-8,282,-11,282,282,-4,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,-5,282,282],
sm187=[0,-4,0,-4,0,-5,283,-15,284],
sm188=[0,-4,0,-4,0,-5,285,-15,285],
sm189=[0,-4,0,-4,0,-5,49,-43,286],
sm190=[0,-4,0,-4,0,-5,287,287,-1,287,287,-2,287,-4,287,-2,287,287,-5,287,287,-8,287,-11,287,287,-4,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,-5,287,287],
sm191=[0,-4,0,-4,0,-5,288,288,-1,288,288,-2,288,-4,288,-2,288,288,-5,288,288,-8,288,-11,288,288,-4,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,-5,288,288],
sm192=[0,-4,0,-4,0,-5,289,289,-1,289,289,-2,289,-4,289,-2,289,289,-5,289,289,-8,289,-11,289,289,-4,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,-5,289,289],
sm193=[0,-4,0,-4,0,-5,290,290,-1,290,290,-2,290,-4,290,-2,290,290,-5,290,290,-8,290,-5,290,-5,290,290,-4,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,-5,290,290],
sm194=[0,-1,2,3,4,0,-4,0,-8,107,-5,7,8,-1,108,-2,11,291,-7,16,-18,26,-2,27,-1,292,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm195=[0,-4,0,-4,0,-21,293],
sm196=[0,-4,0,-4,0,-21,294],
sm197=[0,-4,0,-4,0,-5,295,295,-1,295,295,-2,295,-4,295,-2,295,295,-5,295,295,-8,295,-11,295,295,-4,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,-5,295,295],
sm198=[0,-4,0,-4,0,-5,49,-43,296],
sm199=[0,-4,0,-4,0,-5,297,-3,297,-2,297,-8,297,-15,297,-11,297],
sm200=[0,-4,0,-4,0,-5,298,-3,298,-2,298,-8,298,-15,298,-11,298],
sm201=[0,299,299,299,299,0,-4,0,-8,299,299,-2,299,299,299,299,299,299,-1,299,299,-1,299,299,299,299,299,-2,299,299,299,299,299,299,299,299,-1,299,-2,299,299,-5,299,-2,299,-2,299,-31,299,299,-3,299,299,299,299,299,299,299,-2,299,299,299],
sm202=[0,300,300,300,300,0,-4,0,-8,300,300,-2,300,300,300,300,300,300,-1,300,300,-1,300,300,300,300,300,-2,300,300,300,300,300,300,300,300,-1,300,-2,300,300,-5,300,-2,300,-2,300,-31,300,300,-3,300,300,300,300,300,300,300,-2,300,300,300],
sm203=[0,301,301,301,301,0,-4,0,-8,301,301,-2,301,301,301,301,301,301,-1,301,301,-1,301,301,301,301,301,-2,301,301,301,301,301,301,301,301,-1,301,-2,301,301,-5,301,-2,301,-2,301,-31,301,301,-3,301,301,301,301,301,301,301,-2,301,301,301],
sm204=[0,-4,0,-4,0,-5,302,-6,302],
sm205=[0,-4,0,-4,0,-5,303,-3,303,-11,303,-5,303,303,-20,303,-5,303],
sm206=[0,-4,0,-4,0,-9,304],
sm207=[0,-4,0,-4,0,-5,305,-3,306],
sm208=[0,-4,0,-4,0,-5,307,-3,307],
sm209=[0,-4,0,-4,0,-5,308,-3,308],
sm210=[0,-4,0,-4,0,-37,309],
sm211=[0,-4,0,-4,0,-5,310,-3,310,-11,310,-27,310,-5,205],
sm212=[0,-4,0,-4,0,-5,311,-3,311,-11,311,-5,311,311,-20,311,-5,311],
sm213=[0,-2,3,-1,0,-4,0,-5,264,-2,140,-8,141,-31,312,-3,210],
sm214=[0,-4,0,-4,0,-49,313],
sm215=[0,-4,0,-4,0,-5,314,-43,315],
sm216=[0,-4,0,-4,0,-5,316,-43,316],
sm217=[0,-4,0,-4,0,-5,317,-43,317],
sm218=[0,-4,0,-4,0,-5,318,-3,318,-11,318,-27,318],
sm219=[0,-4,0,-4,0,-5,318,-3,318,-11,318,-27,318,-5,205],
sm220=[0,-4,0,-4,0,-5,49,-15,319],
sm221=[0,-4,0,-4,0,-20,320],
sm222=[0,-4,0,-4,0,-5,49,-15,321],
sm223=[0,-4,0,-4,0,-5,49,-6,322],
sm224=[0,-1,2,3,4,0,-4,0,-8,107,-3,323,-1,7,8,-1,108,-2,11,-8,16,-18,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm225=[0,-1,2,3,4,0,-4,0,-8,107,-3,324,-1,7,8,-1,108,-2,11,-8,16,-18,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm226=[0,-4,0,-4,0,-5,53,53,-5,53,-14,325,326,-26,54,55,56,57,58,59,60,61,62,63,64,65,66,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,-5,67,68],
sm227=[0,-4,0,-4,0,-27,327,328],
sm228=[0,-1,2,3,4,0,-4,0,-8,107,-5,7,8,9,108,-2,11,-5,329,-15,25,-5,26,-2,27,-2,28,-45,38,39,40],
sm229=[0,-4,0,-4,0,-5,49,-15,330],
sm230=[0,331,331,331,331,0,-4,0,-8,331,331,-2,331,331,331,331,331,331,-1,331,331,-1,331,331,331,331,331,-2,331,331,331,331,331,331,331,331,-1,331,-2,331,331,-5,331,-2,331,-2,331,-31,331,331,-3,331,331,331,331,331,331,331,-2,331,331,331],
sm231=[0,332,332,332,332,0,-4,0,-8,332,332,-2,332,332,332,332,332,332,-1,332,332,-1,332,332,332,332,332,-2,332,332,332,332,332,332,332,332,-1,332,-2,332,332,-5,332,-2,332,-2,332,-31,332,332,-3,332,332,332,332,332,332,332,-2,332,332,332],
sm232=[0,333,333,333,333,0,-4,0,-8,333,333,-2,333,333,333,333,333,333,-1,333,333,-1,333,333,333,333,333,-2,333,333,333,333,333,333,333,333,-1,333,-2,333,333,-5,333,-2,333,-2,333,-31,333,333,-3,333,333,333,333,333,333,333,-2,333,333,333],
sm233=[0,-4,0,-4,0,-5,49,-15,334],
sm234=[0,335,335,335,335,0,-4,0,-8,335,335,-2,335,335,335,335,335,335,-1,335,335,-1,335,335,335,335,335,-2,335,335,335,335,335,335,335,335,-1,335,-2,335,335,-5,335,-2,335,-2,335,-31,335,335,-3,335,335,335,335,335,335,335,-2,335,335,335],
sm235=[0,336,336,336,336,0,-4,0,-8,336,336,-2,336,336,336,336,336,336,-1,336,336,-1,336,336,336,336,336,-2,336,336,336,336,336,336,336,336,-1,336,-1,223,336,336,-5,336,-2,336,-2,336,-31,336,336,-3,336,336,336,336,336,336,336,-2,336,336,336],
sm236=[0,337,337,337,337,0,-4,0,-8,337,337,-2,337,337,337,337,337,337,-1,337,337,-1,337,337,337,337,337,-2,337,337,337,337,337,337,337,337,-1,337,-2,337,337,-5,337,-2,337,-2,337,-31,337,337,-3,337,337,337,337,337,337,337,-2,337,337,337],
sm237=[0,-4,0,-4,0,-20,338],
sm238=[0,339,339,339,339,0,-4,0,-5,339,339,-1,339,339,-2,339,339,339,339,339,339,-1,339,339,339,-1,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,-2,339,339,-5,339,339,339,339,-2,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,-2,339,339,339],
sm239=[0,-1,2,3,4,0,-4,0,-9,340,-2,228,-4,174,-27,229,175,176],
sm240=[0,-4,0,-4,0,-9,341],
sm241=[0,342,342,342,342,0,-4,0,-5,342,342,-1,342,342,-2,342,342,342,342,342,342,-1,342,342,342,-1,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,-2,342,342,-5,342,342,342,342,-2,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,342,-2,342,342,342],
sm242=[0,-1,2,3,4,0,-4,0,-9,343,-2,228,-4,174,-27,229,175,176],
sm243=[0,-1,344,344,344,0,-4,0,-9,344,-2,344,-4,344,-27,344,344,344],
sm244=[0,-1,345,345,345,0,-4,0,-9,345,-2,345,-4,345,-27,345,345,345],
sm245=[0,-1,2,3,4,0,-4,0,-17,174,-28,175,176],
sm246=[0,-4,0,-4,0,-20,276],
sm247=[0,-4,0,-4,0,-20,279],
sm248=[0,-4,0,-4,0,-8,346],
sm249=[0,-4,0,-4,0,-21,347],
sm250=[0,-4,0,-4,0,-21,348],
sm251=[0,-4,0,-4,0,-5,349,-15,348],
sm252=[0,-4,0,-4,0,-21,350],
sm253=[0,-4,0,-4,0,-5,351,-15,351],
sm254=[0,-4,0,-4,0,-5,352,-15,352],
sm255=[0,353,353,353,353,0,-4,0,-8,353,353,-2,353,353,353,353,353,353,-1,353,353,-2,353,353,353,353,-2,353,353,353,353,353,353,353,353,-1,353,-2,353,353,-5,353,-2,353,-2,353,-31,353,353,-3,353,353,353,353,353,353,353,-2,353,353,353],
sm256=[0,-4,0,-4,0,-5,354,-6,354],
sm257=[0,-4,0,-4,0,-5,355,355,-1,355,355,-2,355,-4,355,-2,355,355,-5,355,355,-8,355,-11,355,355,-4,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,-5,355,355],
sm258=[0,-1,356,356,356,0,-4,0,-5,356,-2,356,-5,356,356,-1,356,-2,356,-8,356,-18,356,356,-1,356,-1,356,356,-31,356,356,-3,356,356,356,356,356,356,356,-2,356,356,356],
sm259=[0,-4,0,-4,0,-5,357,-43,357],
sm260=[0,-4,0,-4,0,-5,358,358,-1,358,358,-2,358,-4,358,-2,358,358,-5,358,358,-8,358,-11,358,358,-4,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,-5,358,358],
sm261=[0,-4,0,-4,0,-5,264,-43,359],
sm262=[0,-1,2,3,4,0,-4,0,-5,170,-2,107,-5,7,8,-1,108,-2,11,-8,16,-18,26,268,-1,27,-1,172,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm263=[0,-4,0,-4,0,-5,360,-43,360],
sm264=[0,-4,0,-4,0,-5,361,361,-1,361,361,-2,361,-4,361,-2,361,361,-5,361,361,-8,361,-11,361,361,-4,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,-5,361,361],
sm265=[0,-1,2,3,4,0,-4,0,-9,362,-7,174,-28,175,176,-5,177],
sm266=[0,-4,0,-4,0,-5,363,-3,363],
sm267=[0,-4,0,-4,0,-5,364,-3,364],
sm268=[0,-4,0,-4,0,-5,365,-3,365],
sm269=[0,-4,0,-4,0,-49,366],
sm270=[0,-4,0,-4,0,-20,367],
sm271=[0,-4,0,-4,0,-20,368],
sm272=[0,-4,0,-4,0,-5,369,369,-1,369,369,-2,369,-4,369,-2,369,369,-5,369,369,-8,369,-11,369,369,-4,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,-5,369,369],
sm273=[0,-4,0,-4,0,-5,370,370,-1,370,370,-2,370,-4,370,-2,370,370,-5,370,370,-8,370,-11,370,370,-4,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,-5,370,370],
sm274=[0,-1,2,3,4,0,-4,0,-8,107,-5,7,8,-1,108,-2,11,371,-7,16,-18,26,-2,27,-1,372,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm275=[0,-4,0,-4,0,-5,373,-15,373],
sm276=[0,-4,0,-4,0,-5,374,374,-1,374,374,-2,374,-4,374,-2,374,374,-5,374,374,-8,374,-11,374,374,-4,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,-5,374,374],
sm277=[0,-4,0,-4,0,-5,375,375,-1,375,375,-2,375,-4,375,-2,375,375,-5,375,375,-8,375,-5,375,-5,375,375,-4,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,-5,375,375],
sm278=[0,-4,0,-4,0,-5,376,376,-1,376,376,-2,376,-4,376,-2,376,376,-5,376,376,-8,376,-5,376,-5,376,376,-4,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,-5,376,376],
sm279=[0,-4,0,-4,0,-5,377,377,-1,377,377,-2,377,-4,377,-2,377,377,-5,377,377,-8,377,-11,377,377,-4,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,-5,377,377],
sm280=[0,-4,0,-4,0,-9,378],
sm281=[0,-1,2,3,4,0,-4,0,-8,5,379,-2,6,-1,7,8,9,-2,10,11,-2,12,13,14,15,-2,16,17,18,19,20,21,22,-2,23,-2,24,25,-5,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm282=[0,-4,0,-4,0,-5,380,-6,380],
sm283=[0,-4,0,-4,0,-5,381,-3,381,-2,381,-8,381,-27,381],
sm284=[0,-4,0,-4,0,-5,382,-3,382,-11,382,-5,382,382,-20,382,-5,382],
sm285=[0,-1,2,3,4,0,-4,0,-9,383,-7,174,-35,208],
sm286=[0,-4,0,-4,0,-9,384],
sm287=[0,-4,0,-4,0,-5,385,-3,385,-11,385,-27,385],
sm288=[0,-4,0,-4,0,-49,386],
sm289=[0,-4,0,-4,0,-5,387,-3,387,-11,387,-5,387,387,-20,387,-5,387],
sm290=[0,-4,0,-4,0,-5,388,-43,388],
sm291=[0,-2,3,-1,0,-4,0,-5,170,-2,140,-8,141,-31,389,-3,210],
sm292=[0,-4,0,-4,0,-21,390,-27,390],
sm293=[0,-4,0,-4,0,-5,391,-3,391,-11,391,-27,391],
sm294=[0,-1,2,3,4,0,-4,0,-8,107,-3,392,-1,7,8,-1,108,-2,11,-8,16,-18,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm295=[0,-4,0,-4,0,-5,49,-6,393],
sm296=[0,-1,2,3,4,0,-4,0,-8,107,-5,7,8,-1,108,-2,11,394,-7,16,-18,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm297=[0,-4,0,-4,0,-5,201,-6,395],
sm298=[0,-4,0,-4,0,-27,396,397],
sm299=[0,-4,0,-4,0,-5,204,-6,204,-14,398,398,-26,205],
sm300=[0,-4,0,-4,0,-27,398,398,-26,205],
sm301=[0,-4,0,-4,0,-5,49,-6,399],
sm302=[0,-1,2,3,4,0,-4,0,-8,107,-5,7,8,-1,108,-2,11,400,-7,16,-18,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm303=[0,-4,0,-4,0,-27,401,401],
sm304=[0,-4,0,-4,0,-28,402],
sm305=[0,-4,0,-4,0,-28,403],
sm306=[0,-4,0,-4,0,-8,404],
sm307=[0,405,405,405,405,0,-4,0,-8,405,405,-2,405,405,405,405,405,405,-1,405,405,-1,405,405,405,405,405,-2,405,405,405,405,405,405,405,405,-1,405,-2,405,405,-5,405,-2,405,-2,405,-31,405,405,-3,405,405,405,405,405,405,405,-2,405,405,405],
sm308=[0,406,406,406,406,0,-4,0,-8,406,406,-2,406,406,406,406,406,406,-1,406,406,-1,406,406,406,406,406,-2,406,406,406,406,406,406,406,406,-1,406,-2,406,406,-5,406,-2,406,-2,406,-31,406,406,-3,406,406,406,406,406,406,406,-2,406,406,406],
sm309=[0,-4,0,-4,0,-9,407],
sm310=[0,408,408,408,408,0,-4,0,-5,408,408,-1,408,408,-2,408,408,408,408,408,408,-1,408,408,408,-1,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,-2,408,408,-5,408,408,408,408,-2,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,-2,408,408,408],
sm311=[0,409,409,409,409,0,-4,0,-5,409,409,-1,409,409,-2,409,409,409,409,409,409,-1,409,409,409,-1,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,-2,409,409,-5,409,409,409,409,-2,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,-2,409,409,409],
sm312=[0,-1,410,410,410,0,-4,0,-9,410,-2,410,-4,410,-27,410,410,410],
sm313=[0,-1,411,411,411,0,-4,0,-9,411,-2,411,-4,411,-27,411,411,411],
sm314=[0,-4,0,-4,0,-8,412],
sm315=[0,-2,3,-1,0,-4,0,-8,140,-8,141,-3,413,-31,210],
sm316=[0,-4,0,-4,0,-21,414],
sm317=[0,-4,0,-4,0,-5,415,-6,415],
sm318=[0,-4,0,-4,0,-5,416,-3,416,-2,416,-8,416,-15,416,-11,416],
sm319=[0,-4,0,-4,0,-5,417,417,-1,417,417,-2,417,-4,417,-2,417,417,-5,417,417,-8,417,-11,417,417,-4,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,-5,417,417],
sm320=[0,-4,0,-4,0,-5,418,-43,418],
sm321=[0,-1,2,3,4,0,-4,0,-5,264,-2,107,-5,7,8,-1,108,-2,11,-8,16,-18,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm322=[0,-4,0,-4,0,-5,419,419,-1,419,419,-2,419,-4,419,-2,419,419,-5,419,419,-8,419,-11,419,419,-4,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,-5,419,419],
sm323=[0,-4,0,-4,0,-5,420,-3,420],
sm324=[0,-4,0,-4,0,-21,421],
sm325=[0,-4,0,-4,0,-21,422],
sm326=[0,-4,0,-4,0,-5,423,-3,423],
sm327=[0,-4,0,-4,0,-20,424,-16,424],
sm328=[0,-4,0,-4,0,-21,425],
sm329=[0,-4,0,-4,0,-5,426,426,-1,426,426,-2,426,-4,426,-2,426,426,-5,426,426,-8,426,-11,426,426,-4,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,-5,426,426],
sm330=[0,-4,0,-4,0,-5,427,-15,427],
sm331=[0,-4,0,-4,0,-21,428],
sm332=[0,-4,0,-4,0,-21,429],
sm333=[0,-4,0,-4,0,-5,430,-3,430,-2,430,-8,430,-15,430,-11,430],
sm334=[0,-4,0,-4,0,-9,431],
sm335=[0,-4,0,-4,0,-5,432,-3,432,-11,432,-5,432,432,-20,432,-5,432],
sm336=[0,-4,0,-4,0,-5,433,-3,433],
sm337=[0,-4,0,-4,0,-5,434,-3,434],
sm338=[0,-4,0,-4,0,-5,435,-3,435,-11,435,-5,435,435,-20,435,-5,435],
sm339=[0,-2,3,-1,0,-4,0,-5,264,-2,140,-8,141,-31,436,-3,210],
sm340=[0,-4,0,-4,0,-49,437],
sm341=[0,-4,0,-4,0,-5,438,-43,438],
sm342=[0,439,439,439,439,0,-4,0,-8,439,439,-2,439,439,439,439,439,439,-1,439,439,-1,440,439,439,439,439,-2,439,439,439,439,439,439,439,439,-1,439,-2,439,439,-5,439,-2,439,-2,439,-31,439,439,-3,439,439,439,439,439,439,439,-2,439,439,439],
sm343=[0,-4,0,-4,0,-5,49,-15,441],
sm344=[0,442,442,442,442,0,-4,0,-8,442,442,-2,442,442,442,442,442,442,-1,442,442,-1,442,442,442,442,442,-2,442,442,442,442,442,442,442,442,-1,442,-2,442,442,-5,442,-2,442,-2,442,-31,442,442,-3,442,442,442,442,442,442,442,-2,442,442,442],
sm345=[0,-4,0,-4,0,-5,49,-6,443],
sm346=[0,-1,2,3,4,0,-4,0,-8,107,-5,7,8,-1,108,-2,11,444,-7,16,-18,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm347=[0,-4,0,-4,0,-5,49,-15,445],
sm348=[0,-1,2,3,4,0,-4,0,-8,107,-3,446,-1,7,8,-1,108,-2,11,-8,16,-18,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm349=[0,-1,2,3,4,0,-4,0,-8,107,-5,7,8,-1,108,-2,11,447,-7,16,-18,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm350=[0,-4,0,-4,0,-5,49,-15,448],
sm351=[0,-4,0,-4,0,-5,49,-15,449],
sm352=[0,-4,0,-4,0,-21,450],
sm353=[0,-4,0,-4,0,-5,49,-15,451],
sm354=[0,-4,0,-4,0,-21,452],
sm355=[0,-4,0,-4,0,-28,453],
sm356=[0,-4,0,-4,0,-28,398],
sm357=[0,454,454,454,454,0,-4,0,-8,454,454,-2,454,454,454,454,454,454,-1,454,454,-1,454,454,454,454,454,-2,454,454,454,454,454,454,454,454,-1,454,-2,454,454,-5,454,-2,454,-2,454,-31,454,454,-3,454,454,454,454,454,454,454,-2,454,454,454],
sm358=[0,-4,0,-4,0,-9,455,-3,456,-22,457],
sm359=[0,458,458,458,458,0,-4,0,-8,458,458,-2,458,458,458,458,458,458,-1,458,458,-1,458,458,458,458,458,-2,458,458,458,458,458,458,458,458,-1,458,-2,458,458,-5,458,-2,458,-2,458,-31,458,458,-3,458,458,458,458,458,458,458,-2,458,458,458],
sm360=[0,-4,0,-4,0,-21,459],
sm361=[0,-4,0,-4,0,-21,460],
sm362=[0,461,461,461,461,0,-4,0,-5,461,461,-1,461,461,-2,461,461,461,461,461,461,-1,461,461,461,-1,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,-2,461,461,-5,461,461,461,461,-2,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,-2,461,461,461],
sm363=[0,-1,2,3,4,0,-4,0,-8,5,462,-2,6,-1,7,8,9,-2,10,11,-2,12,13,14,15,-2,16,17,18,19,20,21,22,-2,23,-2,24,25,-5,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm364=[0,-4,0,-4,0,-21,463],
sm365=[0,-4,0,-4,0,-5,464,-15,464],
sm366=[0,-4,0,-4,0,-8,465],
sm367=[0,-4,0,-4,0,-5,466,-43,466],
sm368=[0,-4,0,-4,0,-8,467],
sm369=[0,-4,0,-4,0,-8,468],
sm370=[0,-4,0,-4,0,-21,469],
sm371=[0,-4,0,-4,0,-21,470],
sm372=[0,-4,0,-4,0,-5,471,-15,471],
sm373=[0,-4,0,-4,0,-5,472,472,-1,472,472,-2,472,-4,472,-2,472,472,-5,472,472,-8,472,-5,472,-5,472,472,-4,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,472,-5,472,472],
sm374=[0,-4,0,-4,0,-5,473,-3,473,-11,473,-5,473,473,-20,473,-5,473],
sm375=[0,-4,0,-4,0,-5,474,-3,474,-11,474,-5,474,474,-20,474,-5,474],
sm376=[0,-4,0,-4,0,-49,475],
sm377=[0,-4,0,-4,0,-12,476],
sm378=[0,-1,2,3,4,0,-4,0,-8,107,-5,7,8,-1,108,-2,11,477,-7,16,-18,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm379=[0,-4,0,-4,0,-5,49,-15,478],
sm380=[0,-4,0,-4,0,-5,49,-15,479],
sm381=[0,480,480,480,480,0,-4,0,-8,480,480,-2,480,480,480,480,480,480,-1,480,480,-1,480,480,480,480,480,-2,480,480,480,480,480,480,480,480,-1,480,-2,480,480,-5,480,-2,480,-2,480,-31,480,480,-3,480,480,480,480,480,480,480,-2,480,480,480],
sm382=[0,-4,0,-4,0,-5,49,-6,481],
sm383=[0,-1,2,3,4,0,-4,0,-8,107,-5,7,8,-1,108,-2,11,482,-7,16,-18,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm384=[0,-4,0,-4,0,-5,49,-15,483],
sm385=[0,-4,0,-4,0,-21,484],
sm386=[0,-4,0,-4,0,-5,49,-15,485],
sm387=[0,486,486,486,486,0,-4,0,-8,486,486,-2,486,486,486,486,486,486,-1,486,486,-1,486,486,486,486,486,-2,486,486,486,486,486,486,486,486,-1,486,-2,486,486,-5,486,-2,486,-2,486,-31,486,486,-3,486,486,486,486,486,486,486,-2,486,486,486],
sm388=[0,-4,0,-4,0,-21,487],
sm389=[0,-4,0,-4,0,-21,488],
sm390=[0,489,489,489,489,0,-4,0,-8,489,489,-2,489,489,489,489,489,489,-1,489,489,-1,489,489,489,489,489,-2,489,489,489,489,489,489,489,489,-1,489,-2,489,489,-5,489,-2,489,-2,489,-31,489,489,-3,489,489,489,489,489,489,489,-2,489,489,489],
sm391=[0,-4,0,-4,0,-9,490,-3,456,-22,457],
sm392=[0,-4,0,-4,0,-9,491,-26,457],
sm393=[0,-4,0,-4,0,-9,492,-3,492,-22,492],
sm394=[0,-4,0,-4,0,-9,493,-26,493,494],
sm395=[0,-4,0,-4,0,-9,495],
sm396=[0,-4,0,-4,0,-9,496],
sm397=[0,-4,0,-4,0,-8,497],
sm398=[0,-4,0,-4,0,-5,498,-3,498,-11,498,-5,498,498,-20,498,-5,498],
sm399=[0,499,499,499,499,0,-4,0,-8,499,499,-2,499,499,499,499,499,499,-1,499,499,-1,499,499,499,499,499,-2,499,499,499,499,499,499,499,499,-1,499,-2,499,499,-5,499,-2,499,-2,499,-31,499,499,-3,499,499,499,499,499,499,499,-2,499,499,499],
sm400=[0,500,500,500,500,0,-4,0,-8,500,500,-2,500,500,500,500,500,500,-1,500,500,-1,500,500,500,500,500,-2,500,500,500,500,500,500,500,500,-1,500,-2,500,500,-5,500,-2,500,-2,500,-31,500,500,-3,500,500,500,500,500,500,500,-2,500,500,500],
sm401=[0,-4,0,-4,0,-5,49,-15,501],
sm402=[0,502,502,502,502,0,-4,0,-8,502,502,-2,502,502,502,502,502,502,-1,502,502,-1,502,502,502,502,502,-2,502,502,502,502,502,502,502,502,-1,502,-2,502,502,-5,502,-2,502,-2,502,-31,502,502,-3,502,502,502,502,502,502,502,-2,502,502,502],
sm403=[0,503,503,503,503,0,-4,0,-8,503,503,-2,503,503,503,503,503,503,-1,503,503,-1,503,503,503,503,503,-2,503,503,503,503,503,503,503,503,-1,503,-2,503,503,-5,503,-2,503,-2,503,-31,503,503,-3,503,503,503,503,503,503,503,-2,503,503,503],
sm404=[0,-1,2,3,4,0,-4,0,-8,107,-5,7,8,-1,108,-2,11,504,-7,16,-18,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm405=[0,-4,0,-4,0,-5,49,-15,505],
sm406=[0,506,506,506,506,0,-4,0,-8,506,506,-2,506,506,506,506,506,506,-1,506,506,-1,506,506,506,506,506,-2,506,506,506,506,506,506,506,506,-1,506,-2,506,506,-5,506,-2,506,-2,506,-31,506,506,-3,506,506,506,506,506,506,506,-2,506,506,506],
sm407=[0,507,507,507,507,0,-4,0,-8,507,507,-2,507,507,507,507,507,507,-1,507,507,-1,507,507,507,507,507,-2,507,507,507,507,507,507,507,507,-1,507,-2,507,507,-5,507,-2,507,-2,507,-31,507,507,-3,507,507,507,507,507,507,507,-2,507,507,507],
sm408=[0,508,508,508,508,0,-4,0,-8,508,508,-2,508,508,508,508,508,508,-1,508,508,-1,508,508,508,508,508,-2,508,508,508,508,508,508,508,508,-1,508,-2,508,508,-5,508,-2,508,-2,508,-31,508,508,-3,508,508,508,508,508,508,508,-2,508,508,508],
sm409=[0,509,509,509,509,0,-4,0,-8,509,509,-2,509,509,509,509,509,509,-1,509,509,-1,509,509,509,509,509,-2,509,509,509,509,509,509,509,509,-1,509,-2,509,509,-5,509,-2,509,-2,509,-31,509,509,-3,509,509,509,509,509,509,509,-2,509,509,509],
sm410=[0,-4,0,-4,0,-21,510],
sm411=[0,-4,0,-4,0,-9,511,-26,457],
sm412=[0,512,512,512,512,0,-4,0,-8,512,512,-2,512,512,512,512,512,512,-1,512,512,-1,512,512,512,512,512,-2,512,512,512,512,512,512,512,512,-1,512,-2,512,512,-5,512,-2,512,-2,512,-31,512,512,-3,512,512,512,512,512,512,512,-2,512,512,512],
sm413=[0,-4,0,-4,0,-9,513,-3,513,-22,513],
sm414=[0,-4,0,-4,0,-9,514,-26,457],
sm415=[0,-4,0,-4,0,-5,49,-31,515],
sm416=[0,516,516,516,516,0,-4,0,-8,516,516,-2,516,516,516,516,516,516,-1,516,516,-1,516,516,516,516,516,-2,516,516,516,516,516,516,516,516,-1,516,-1,516,516,516,-5,516,-2,516,-2,516,-31,516,516,-3,516,516,516,516,516,516,516,-2,516,516,516],
sm417=[0,517,517,517,517,0,-4,0,-5,517,517,-1,517,517,-2,517,517,517,517,517,517,-1,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,-2,517,517,-5,517,517,517,517,-2,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,517,-2,517,517,517],
sm418=[0,-4,0,-4,0,-9,518],
sm419=[0,-4,0,-4,0,-9,519],
sm420=[0,-4,0,-4,0,-9,520],
sm421=[0,521,521,521,521,0,-4,0,-8,521,521,-2,521,521,521,521,521,521,-1,521,521,-1,521,521,521,521,521,-2,521,521,521,521,521,521,521,521,-1,521,-2,521,521,-5,521,-2,521,-2,521,-31,521,521,-3,521,521,521,521,521,521,521,-2,521,521,521],
sm422=[0,522,522,522,522,0,-4,0,-8,522,522,-2,522,522,522,522,522,522,-1,522,522,-1,522,522,522,522,522,-2,522,522,522,522,522,522,522,522,-1,522,-2,522,522,-5,522,-2,522,-2,522,-31,522,522,-3,522,522,522,522,522,522,522,-2,522,522,522],
sm423=[0,523,523,523,523,0,-4,0,-8,523,523,-2,523,523,523,523,523,523,-1,523,523,-1,523,523,523,523,523,-2,523,523,523,523,523,523,523,523,-1,523,-2,523,523,-5,523,-2,523,-2,523,-31,523,523,-3,523,523,523,523,523,523,523,-2,523,523,523],
sm424=[0,-4,0,-4,0,-5,49,-15,524],
sm425=[0,525,525,525,525,0,-4,0,-8,525,525,-2,525,525,525,525,525,525,-1,525,525,-1,525,525,525,525,525,-2,525,525,525,525,525,525,525,525,-1,525,-2,525,525,-5,525,-2,525,-2,525,-31,525,525,-3,525,525,525,525,525,525,525,-2,525,525,525],
sm426=[0,526,526,526,526,0,-4,0,-8,526,526,-2,526,526,526,526,526,526,-1,526,526,-1,526,526,526,526,526,-2,526,526,526,526,526,526,526,526,-1,526,-2,526,526,-5,526,-2,526,-2,526,-31,526,526,-3,526,526,526,526,526,526,526,-2,526,526,526],
sm427=[0,527,527,527,527,0,-4,0,-8,527,527,-2,527,527,527,527,527,527,-1,527,527,-1,527,527,527,527,527,-2,527,527,527,527,527,527,527,527,-1,527,-2,527,527,-5,527,-2,527,-2,527,-31,527,527,-3,527,527,527,527,527,527,527,-2,527,527,527],
sm428=[0,528,528,528,528,0,-4,0,-8,528,528,-2,528,528,528,528,528,528,-1,528,528,-1,528,528,528,528,528,-2,528,528,528,528,528,528,528,528,-1,528,-2,528,528,-5,528,-2,528,-2,528,-31,528,528,-3,528,528,528,528,528,528,528,-2,528,528,528],
sm429=[0,529,529,529,529,0,-4,0,-8,529,529,-2,529,529,529,529,529,529,-1,529,529,-1,529,529,529,529,529,-2,529,529,529,529,529,529,529,529,-1,529,-2,529,529,-5,529,-2,529,-2,529,-31,529,529,-3,529,529,529,529,529,529,529,-2,529,529,529],
sm430=[0,-4,0,-4,0,-9,530],
sm431=[0,531,531,531,531,0,-4,0,-8,531,531,-2,531,531,531,531,531,531,-1,531,531,-1,531,531,531,531,531,-2,531,531,531,531,531,531,531,531,-1,531,-2,531,531,-5,531,-2,531,-2,531,-31,531,531,-3,531,531,531,531,531,531,531,-2,531,531,531],
sm432=[0,-1,2,3,4,0,-4,0,-8,5,532,-2,6,532,7,8,9,-2,10,11,-2,12,13,14,15,-2,16,17,18,19,20,21,22,532,-1,23,-2,24,25,-5,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm433=[0,-1,2,3,4,0,-4,0,-8,5,533,-2,6,-1,7,8,9,-2,10,11,-2,12,13,14,15,-2,16,17,18,19,20,21,22,533,-1,23,-2,24,25,-5,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm434=[0,534,534,534,534,0,-4,0,-5,534,534,-1,534,534,-2,534,534,534,534,534,534,-1,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,-2,534,534,-5,534,534,534,534,-2,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,-2,534,534,534],
sm435=[0,-1,535,535,535,0,-4,0,-5,535,-3,535,-2,535,-4,535,-27,535,535,535],
sm436=[0,-1,536,536,536,0,-4,0,-5,536,-3,536,-2,536,-4,536,-27,536,536,536],
sm437=[0,-4,0,-4,0,-9,537],
sm438=[0,538,538,538,538,0,-4,0,-8,538,538,-2,538,538,538,538,538,538,-1,538,538,-1,538,538,538,538,538,-2,538,538,538,538,538,538,538,538,-1,538,-2,538,538,-5,538,-2,538,-2,538,-31,538,538,-3,538,538,538,538,538,538,538,-2,538,538,538],
sm439=[0,539,539,539,539,0,-4,0,-8,539,539,-2,539,539,539,539,539,539,-1,539,539,-1,539,539,539,539,539,-2,539,539,539,539,539,539,539,539,-1,539,-2,539,539,-5,539,-2,539,-2,539,-31,539,539,-3,539,539,539,539,539,539,539,-2,539,539,539],
sm440=[0,540,540,540,540,0,-4,0,-8,540,540,-2,540,540,540,540,540,540,-1,540,540,-1,540,540,540,540,540,-2,540,540,540,540,540,540,540,540,-1,540,-2,540,540,-5,540,-2,540,-2,540,-31,540,540,-3,540,540,540,540,540,540,540,-2,540,540,540],
sm441=[0,541,541,541,541,0,-4,0,-8,541,541,-2,541,541,541,541,541,541,-1,541,541,-1,541,541,541,541,541,-2,541,541,541,541,541,541,541,541,-1,541,-2,541,541,-5,541,-2,541,-2,541,-31,541,541,-3,541,541,541,541,541,541,541,-2,541,541,541],
sm442=[0,542,542,542,542,0,-4,0,-8,542,542,-2,542,542,542,542,542,542,-1,542,542,-1,542,542,542,542,542,-2,542,542,542,542,542,542,542,542,-1,542,-2,542,542,-5,542,-2,542,-2,542,-31,542,542,-3,542,542,542,542,542,542,542,-2,542,542,542],
sm443=[0,-1,2,3,4,0,-4,0,-8,5,543,-2,6,543,7,8,9,-2,10,11,-2,12,13,14,15,-2,16,17,18,19,20,21,22,543,-1,23,-2,24,25,-5,26,-2,27,-2,28,-31,29,30,-3,31,32,33,34,35,36,37,-2,38,39,40],
sm444=[0,-1,544,544,544,0,-4,0,-5,544,-3,544,-2,544,-4,544,-27,544,544,544],
sm445=[0,545,545,545,545,0,-4,0,-8,545,545,-2,545,545,545,545,545,545,-1,545,545,-1,545,545,545,545,545,-2,545,545,545,545,545,545,545,545,-1,545,-2,545,545,-5,545,-2,545,-2,545,-31,545,545,-3,545,545,545,545,545,545,545,-2,545,545,545],

    // Symbol Lookup map
    lu$1 = new Map([[1,1],[2,2],[4,3],[8,4],[16,5],[32,6],[64,7],[128,8],[256,9],[512,10],[3,11],[264,11],["any",13],["import",14],[",",15],["*",16],["as",17],["{",18],["}",19],["from",20],["export",21],[";",22],["default",23],["function",24],["class",25],["let",26],["[",27],["async",28],["if",29],["(",30],[")",31],["else",32],["do",33],["while",34],["for",35],["var",36],["in",37],["of",38],["await",39],["continue",40],["break",41],["return",42],["throw",43],["with",44],["switch",45],["case",46],[":",47],["try",48],["catch",49],["finally",50],["debugger",51],["const",52],["=>",53],["extends",54],["static",55],["get",56],["set",57],["new",58],["]",59],[".",60],["super",61],["target",62],["...",63],["this",64],["=",65],["*=",66],["/=",67],["%=",68],["+=",69],["-=",70],["<<=",71],[">>=",72],[">>>=",73],["&=",74],["^=",75],["|=",76],["**=",77],["?",78],["||",79],["&&",80],["|",81],["^",82],["&",83],["==",84],["!=",85],["===",86],["!==",87],["<",88],[">",89],["<=",90],[">=",91],["instanceof",92],["<<",93],[">>",94],[">>>",95],["+",96],["-",97],["/",98],["%",99],["**",100],["delete",101],["void",102],["typeof",103],["~",104],["!",105],["++",106],["--",107],[null,2],["null",110],["true",111],["false",112]]),

    //Reverse Symbol Lookup map
    rlu$1 = new Map([[1,1],[2,2],[3,4],[4,8],[5,16],[6,32],[7,64],[8,128],[9,256],[10,512],[11,3],[11,264],[13,"any"],[14,"import"],[15,","],[16,"*"],[17,"as"],[18,"{"],[19,"}"],[20,"from"],[21,"export"],[22,";"],[23,"default"],[24,"function"],[25,"class"],[26,"let"],[27,"["],[28,"async"],[29,"if"],[30,"("],[31,")"],[32,"else"],[33,"do"],[34,"while"],[35,"for"],[36,"var"],[37,"in"],[38,"of"],[39,"await"],[40,"continue"],[41,"break"],[42,"return"],[43,"throw"],[44,"with"],[45,"switch"],[46,"case"],[47,":"],[48,"try"],[49,"catch"],[50,"finally"],[51,"debugger"],[52,"const"],[53,"=>"],[54,"extends"],[55,"static"],[56,"get"],[57,"set"],[58,"new"],[59,"]"],[60,"."],[61,"super"],[62,"target"],[63,"..."],[64,"this"],[65,"="],[66,"*="],[67,"/="],[68,"%="],[69,"+="],[70,"-="],[71,"<<="],[72,">>="],[73,">>>="],[74,"&="],[75,"^="],[76,"|="],[77,"**="],[78,"?"],[79,"||"],[80,"&&"],[81,"|"],[82,"^"],[83,"&"],[84,"=="],[85,"!="],[86,"==="],[87,"!=="],[88,"<"],[89,">"],[90,"<="],[91,">="],[92,"instanceof"],[93,"<<"],[94,">>"],[95,">>>"],[96,"+"],[97,"-"],[98,"/"],[99,"%"],[100,"**"],[101,"delete"],[102,"void"],[103,"typeof"],[104,"~"],[105,"!"],[106,"++"],[107,"--"],[2,null],[110,"null"],[111,"true"],[112,"false"]]),

    // States 
    state$1 = [sm0$1,
sm1$1,
sm2$1,
sm3$1,
sm4$1,
sm5$1,
sm6$1,
sm6$1,
sm7$1,
sm7$1,
sm7$1,
sm7$1,
sm7$1,
sm7$1,
sm7$1,
sm7$1,
sm7$1,
sm7$1,
sm7$1,
sm7$1,
sm7$1,
sm7$1,
sm8$1,
sm9$1,
sm10$1,
sm11$1,
sm12$1,
sm12$1,
sm13$1,
sm14$1,
sm15$1,
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
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm28$1,
sm27$1,
sm27$1,
sm29$1,
sm30$1,
sm31$1,
sm32$1,
sm33$1,
sm33$1,
sm33$1,
sm34$1,
sm35$1,
sm35$1,
sm35$1,
sm35$1,
sm36$1,
sm37$1,
sm38$1,
sm39$1,
sm40$1,
sm40$1,
sm40$1,
sm40$1,
sm41$1,
sm41$1,
sm42$1,
sm43$1,
sm44$1,
sm45$1,
sm46$1,
sm47$1,
sm48,
sm48,
sm27$1,
sm49,
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
sm27$1,
sm64,
sm65,
sm66,
sm66,
sm66,
sm67,
sm68,
sm69,
sm52,
sm70,
sm71,
sm72,
sm73,
sm74,
sm27$1,
sm27$1,
sm27$1,
sm75,
sm76,
sm77,
sm77,
sm77,
sm77,
sm77,
sm77,
sm77,
sm77,
sm77,
sm77,
sm77,
sm77,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm78,
sm28$1,
sm79,
sm80,
sm81,
sm35$1,
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
sm94,
sm95,
sm96,
sm27$1,
sm97,
sm27$1,
sm95,
sm98,
sm99,
sm31$1,
sm100,
sm101,
sm102,
sm103,
sm52,
sm104,
sm95,
sm27$1,
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
sm115,
sm116,
sm117,
sm27$1,
sm118,
sm27$1,
sm119,
sm120,
sm27$1,
sm121,
sm122,
sm123,
sm124,
sm125,
sm126,
sm127,
sm27$1,
sm128,
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
sm113,
sm113,
sm140,
sm141,
sm142,
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
sm168,
sm169,
sm170,
sm171,
sm172,
sm172,
sm27$1,
sm173,
sm174,
sm175,
sm176,
sm177,
sm178,
sm177,
sm27$1,
sm179,
sm180,
sm180,
sm181,
sm182,
sm182,
sm27$1,
sm183,
sm183,
sm184,
sm185,
sm186,
sm187,
sm188,
sm27$1,
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
sm200,
sm9$1,
sm201,
sm202,
sm202,
sm203,
sm52,
sm204,
sm27$1,
sm204,
sm205,
sm206,
sm207,
sm95,
sm208,
sm209,
sm210,
sm211,
sm212,
sm213,
sm214,
sm215,
sm52,
sm216,
sm217,
sm218,
sm219,
sm220,
sm221,
sm222,
sm223,
sm224,
sm52,
sm225,
sm226,
sm227,
sm52,
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
sm64,
sm238,
sm239,
sm240,
sm241,
sm242,
sm243,
sm244,
sm245,
sm244,
sm246,
sm247,
sm248,
sm249,
sm250,
sm251,
sm252,
sm253,
sm254,
sm136,
sm255,
sm52,
sm256,
sm256,
sm27$1,
sm257,
sm258,
sm259,
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
sm136,
sm27$1,
sm269,
sm270,
sm271,
sm272,
sm273,
sm274,
sm275,
sm276,
sm277,
sm52,
sm278,
sm278,
sm279,
sm280,
sm281,
sm282,
sm283,
sm284,
sm284,
sm285,
sm286,
sm52,
sm287,
sm288,
sm289,
sm290,
sm289,
sm289,
sm291,
sm292,
sm292,
sm293,
sm56,
sm27$1,
sm56,
sm294,
sm295,
sm296,
sm297,
sm298,
sm299,
sm300,
sm301,
sm302,
sm27$1,
sm27$1,
sm27$1,
sm27$1,
sm303,
sm300,
sm300,
sm304,
sm52,
sm305,
sm52,
sm306,
sm56,
sm307,
sm52,
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
sm320,
sm320,
sm321,
sm322,
sm323,
sm324,
sm325,
sm326,
sm327,
sm328,
sm52,
sm329,
sm330,
sm27$1,
sm331,
sm332,
sm333,
sm334,
sm335,
sm336,
sm337,
sm338,
sm338,
sm339,
sm340,
sm341,
sm342,
sm343,
sm344,
sm345,
sm346,
sm27$1,
sm347,
sm56,
sm348,
sm27$1,
sm27$1,
sm349,
sm350,
sm56,
sm351,
sm352,
sm353,
sm354,
sm27$1,
sm355,
sm356,
sm356,
sm27$1,
sm357,
sm358,
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
sm373,
sm374,
sm375,
sm376,
sm375,
sm56,
sm377,
sm378,
sm379,
sm56,
sm380,
sm56,
sm381,
sm382,
sm383,
sm384,
sm385,
sm386,
sm56,
sm56,
sm387,
sm56,
sm56,
sm56,
sm56,
sm388,
sm27$1,
sm389,
sm390,
sm391,
sm392,
sm393,
sm27$1,
sm394,
sm64,
sm395,
sm396,
sm363,
sm363,
sm363,
sm397,
sm398,
sm399,
sm400,
sm401,
sm56,
sm56,
sm402,
sm56,
sm403,
sm404,
sm405,
sm56,
sm56,
sm56,
sm56,
sm406,
sm407,
sm408,
sm409,
sm408,
sm409,
sm56,
sm410,
sm56,
sm411,
sm412,
sm413,
sm414,
sm412,
sm415,
sm9$1,
sm416,
sm417,
sm418,
sm419,
sm420,
sm363,
sm56,
sm421,
sm422,
sm423,
sm424,
sm56,
sm56,
sm425,
sm426,
sm427,
sm428,
sm429,
sm56,
sm429,
sm430,
sm431,
sm431,
sm432,
sm433,
sm434,
sm435,
sm436,
sm437,
sm438,
sm56,
sm439,
sm440,
sm441,
sm442,
sm443,
sm444,
sm445],

/************ Functions *************/

    max$1 = Math.max,

    //Error Functions
    e$2 = (tk, env, output, lex, prv_lex) => {            /*USED for ASI*/            if (env.ASI && lex.tx !== ")" && !lex.END) {                let ENCOUNTERED_NL = (lex.tx == "}" || lex.END);                while (!ENCOUNTERED_NL && !prv_lex.END && prv_lex.off < lex.off) {                    prv_lex.next();                    if (prv_lex.ty == prv_lex.types.nl)                        ENCOUNTERED_NL = true;                }            if (ENCOUNTERED_NL)                return ";";            }            if(lex.END)            return ";";            return null;        }, 
    eh$1 = [e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
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
    nf$1 = ()=>-1, 

    //Environment Functions
    
redv$1 = (ret, fn, plen, ln, t, e, o, l, s) => {        ln = max$1(o.length - plen, 0);        o[ln] = fn(o.slice(-plen), e, l, s);        o.length = ln + 1;        return ret;    },
rednv$1 = (ret, Fn, plen, ln, t, e, o, l, s) => {        ln = max$1(o.length - plen, 0);        o[ln] = new Fn(o.slice(-plen), e, l, s);        o.length = ln + 1;        return ret;    },
redn$1 = (ret, t, e, o) => (o.push(null), ret),
shftf$1 = (ret, fn, t, e, o, l, s) => (fn(o, e, l, s), ret),
R0_S=function (sym,env,lex,state) {return sym[0]},
R0_statement_list=function (sym,env,lex,state) {return [sym[0]]},
R1_statement_list=function (sym,env,lex,state) {return (sym[0].push(sym[1]), sym[0]);},
C0_empty_statement=function (sym,env,lex,state) {this.type = "empty";},
R0_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_stmt(sym[2], sym[4], sym[6], sym[8]))},
I1_iteration_statement=function (sym,env,lex,state) {env.ASI = false;},
I2_iteration_statement=function (sym,env,lex,state) {env.ASI = true;},
R3_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_stmt(null, sym[4], sym[6], sym[8]))},
R4_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_stmt(sym[2], null, sym[6], sym[8]))},
R5_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_stmt(sym[2], sym[4], null, sym[8]))},
R6_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_stmt(null, null, sym[4], sym[6]))},
R7_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_stmt(sym[2], null, null, sym[8]))},
R8_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_stmt(null, null, null, sym[5]))},
R9_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_stmt(sym[3], sym[5], sym[7], sym[9]))},
R10_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_stmt(sym[3], sym[5], null, sym[9]))},
R11_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_stmt(sym[3], null, sym[7], sym[9]))},
R12_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_stmt(sym[3], null , null, sym[9]))},
R13_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_stmt(sym[2], sym[3], null, sym[6]))},
R14_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_stmt(sym[2], null, sym[5], sym[6]))},
R15_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_stmt(sym[2], null, null, sym[5]))},
R16_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_in_stmt(sym[2], sym[4], sym[6]))},
R17_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_in_stmt(sym[3], sym[5], sym[7]))},
R18_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_of_stmt(sym[2], sym[4], sym[6]))},
R19_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_of_stmt(sym[3], sym[5], sym[7], true))},
R20_iteration_statement=function (sym,env,lex,state) {return (new env.functions.for_of_stmt(sym[4], sym[6], sym[8], true))},
R0_continue_statement=function (sym,env,lex,state) {return (new env.functions.continue_stmt(sym[1]))},
R0_break_statement=function (sym,env,lex,state) {return (new env.functions.break_stmt(sym[1]))},
R0_return_statement=function (sym,env,lex,state) {return (new env.functions.return_stmt([]))},
R0_case_block=function (sym,env,lex,state) {return []},
R1_case_block=function (sym,env,lex,state) {return sym[1].concat(sym[2].concat(sym[3]))},
R2_case_block=function (sym,env,lex,state) {return sym[1].concat(sym[2])},
R3_case_block=function (sym,env,lex,state) {return sym[1]},
R0_case_clauses=function (sym,env,lex,state) {return sym[0].concat(sym[1])},
R0_case_clause=function (sym,env,lex,state) {return (new env.functions.case_stmt(sym[1], sym[3]))},
R1_case_clause=function (sym,env,lex,state) {return (new env.functions.case_stmt(sym[1]))},
R0_default_clause=function (sym,env,lex,state) {return (new env.functions.default_case_stmt(sym[2]))},
R1_default_clause=function (sym,env,lex,state) {return (new env.functions.default_case_stmt())},
R0_try_statement=function (sym,env,lex,state) {return (new env.functions.try_stmt(sym[1],sym[2]))},
R1_try_statement=function (sym,env,lex,state) {return (new env.functions.try_stmt(sym[1],null ,sym[2]))},
R2_try_statement=function (sym,env,lex,state) {return (new env.functions.try_stmt(sym[1], sym[2], sym[3]))},
R0_variable_declaration_list=function (sym,env,lex,state) {return sym[0].push(sym[2])},
R0_let_or_const=function (sym,env,lex,state) {return "let"},
R1_let_or_const=function (sym,env,lex,state) {return "const"},
R0_function_declaration=function (sym,env,lex,state) {return new env.functions.funct_decl(null, sym[2], sym[5])},
R1_function_declaration=function (sym,env,lex,state) {return new env.functions.funct_decl(sym[1], sym[3], sym[6])},
R0_formal_parameters=function (sym,env,lex,state) {return (sym[0].push(sym[2]), sym[0])},
R0_arrow_function=function (sym,env,lex,state) {return new env.functions.funct_decl(null, sym[0], sym[2])},
R0_class_tail=function (sym,env,lex,state) {return new env.functions.class_tail(sym)},
R1_class_tail=function (sym,env,lex,state) {return new env.functions.class_tail([null, ... sym[0]])},
R2_class_tail=function (sym,env,lex,state) {return new env.functions.class_tail([sym[0], null, null])},
R3_class_tail=function (sym,env,lex,state) {return null},
R0_class_element_list=function (sym,env,lex,state) {return (sym[0].push(sym[1]))},
R0_class_element=function (sym,env,lex,state) {return (sym[1].static = true, sym[1])},
R0_expression=function (sym,env,lex,state) {return Array.isArray(sym[0]) ? (sym[0].push(sym[2]) , sym[0]) : [sym[0], sym[2]];},
R0_arguments=function (sym,env,lex,state) {return [];},
R0_argument_list=function (sym,env,lex,state) {return (sym[0].push(new env.functions.spread_expr(env, sym.slice(2,4))), env[0])},
C0_property_definition=function (sym,env,lex,state) {this.id = sym[0];},
C0_colon_assignment=function (sym,env,lex,state) {this.id = sym[0]; this.expr = sym[1];},
R0_array_literal=function (sym,env,lex,state) {return [ ]},
R0_element_list=function (sym,env,lex,state) {return [sym[1]]},
R1_element_list=function (sym,env,lex,state) {return (sym[0].push(sym[2]),sym[0])},
R0_cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state) {return null;},
R1_cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state) {return new env.functions.spread_expr(env, sym.slice(1,3))},
R2_cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state) {return Array.isArray(sym[0]) ? (sym[1].push(new env.functions.spread_expr(env, sym.slice(3,5))) , sym[1]) : [sym[0], new env.functions.spread_expr(env, sym.slice(3,5))];},

    //Sparse Map Lookup
    lsm$1 = (index, map) => {    if (map[0] == 0xFFFFFFFF) return map[index+1];    for (let i = 1, ind = 0, l = map.length, n = 0; i < l && ind <= index; i++) {        if (ind !== index) {            if ((n = map[i]) > -1) ind++;            else ind += -n;        } else return map[i];    }    return -1;},

    //State Action Functions
    state_funct$1 = [(...v)=>((redn$1(20483,...v))),
()=>(306),
()=>(270),
()=>(302),
()=>(94),
()=>(350),
()=>(430),
()=>(422),
()=>(438),
()=>(354),
()=>(310),
()=>(366),
()=>(370),
()=>(374),
()=>(346),
()=>(330),
()=>(382),
()=>(386),
()=>(390),
()=>(398),
()=>(394),
()=>(378),
()=>(402),
()=>(406),
()=>(442),
()=>(222),
()=>(314),
()=>(238),
()=>(182),
()=>(186),
()=>(170),
()=>(174),
()=>(178),
()=>(190),
()=>(194),
()=>(202),
()=>(206),
()=>(298),
()=>(290),
()=>(294),
(...v)=>(redv$1(5,R0_S,1,0,...v)),
(...v)=>(redv$1(1031,R0_S,1,0,...v)),
(...v)=>(redv$1(20487,R0_S,1,0,...v)),
(...v)=>(rednv$1(21511,fn$1.stmts,1,0,...v)),
(...v)=>(redv$1(22535,R0_statement_list,1,0,...v)),
()=>(23559),
()=>(24583),
()=>(28679),
()=>(458),
()=>(454),
(...v)=>(redv$1(88071,R0_S,1,0,...v)),
()=>(114695),
()=>(130055),
()=>(462),
()=>(478),
()=>(482),
()=>(486),
()=>(490),
()=>(494),
()=>(498),
()=>(502),
()=>(506),
()=>(510),
()=>(514),
()=>(518),
()=>(522),
()=>(470),
()=>(474),
()=>(116743),
()=>(526),
()=>(530),
()=>(117767),
()=>(534),
()=>(118791),
()=>(538),
()=>(119815),
()=>(542),
()=>(120839),
()=>(546),
()=>(121863),
()=>(550),
()=>(554),
()=>(558),
()=>(562),
()=>(122887),
()=>(586),
()=>(566),
()=>(570),
()=>(574),
()=>(578),
()=>(582),
()=>(123911),
()=>(590),
()=>(594),
()=>(598),
()=>(124935),
()=>(602),
()=>(606),
()=>(125959),
()=>(610),
()=>(614),
()=>(618),
()=>(126983),
()=>(128007),
()=>(129031),
()=>(622),
()=>(658),
()=>(654),
()=>(89095),
()=>(710),
()=>(714),
()=>(702),
()=>(90119),
()=>(718),
()=>(722),
()=>(738),
()=>(742),
()=>(91143),
(...v)=>(rednv$1(99335,fn$1.this_expr,1,0,...v)),
()=>(99335),
()=>(72711),
()=>(150535),
()=>(149511),
()=>(151559),
()=>(152583),
(...v)=>(rednv$1(153607,fn$1.identifier,1,0,...v)),
()=>(144391),
(...v)=>(rednv$1(148487,fn$1.bool_literal,1,0,...v)),
(...v)=>(rednv$1(147463,fn$1.null_literal,1,0,...v)),
(...v)=>(rednv$1(145415,fn$1.string_literal,1,0,...v)),
(...v)=>(rednv$1(146439,fn$1.numeric_literal,1,0,...v)),
()=>(746),
()=>(754),
()=>(766),
()=>(762),
()=>(93191),
()=>(95239),
()=>(778),
()=>(786),
()=>(818),
()=>(822),
(...v)=>(rednv$1(30727,C0_empty_statement,1,0,...v)),
()=>(826),
()=>(27655),
()=>(834),
(...v)=>(shftf$1(838,I1_iteration_statement,...v)),
()=>(842),
()=>(846),
()=>(850),
()=>(862),
()=>(870),
()=>(878),
()=>(890),
()=>(25607),
()=>(906),
()=>(910),
()=>(26631),
()=>(914),
(...v)=>(redv$1(59399,R0_let_or_const,1,0,...v)),
(...v)=>(redv$1(59399,R1_let_or_const,1,0,...v)),
(...v)=>(redv$1(22539,R1_statement_list,2,0,...v)),
()=>(938),
(...v)=>(redv$1(31755,R0_S,2,0,...v)),
(...v)=>(rednv$1(130059,fn$1.post_inc_expr,2,0,...v)),
(...v)=>(rednv$1(130059,fn$1.post_dec_expr,2,0,...v)),
()=>(115719),
(...v)=>(rednv$1(129035,fn$1.delete_expr,2,0,...v)),
(...v)=>(rednv$1(99335,fn$1.array_literal,1,0,...v)),
(...v)=>(rednv$1(99335,fn$1.object,1,0,...v)),
()=>(1066),
()=>(1054),
()=>(1078),
()=>(1082),
()=>(1138),
()=>(1142),
()=>(1146),
()=>(1110),
()=>(62471),
()=>(78855),
(...v)=>(rednv$1(129035,fn$1.void_expr,2,0,...v)),
(...v)=>(rednv$1(129035,fn$1.typeof_expr,2,0,...v)),
(...v)=>(rednv$1(129035,fn$1.plus_expr,2,0,...v)),
(...v)=>(rednv$1(129035,fn$1.negate_expr,2,0,...v)),
(...v)=>(rednv$1(129035,fn$1.unary_or_expr,2,0,...v)),
(...v)=>(rednv$1(129035,fn$1.unary_not_expr,2,0,...v)),
(...v)=>(rednv$1(130059,fn$1.pre_inc_expr,2,0,...v)),
(...v)=>(rednv$1(130059,fn$1.pre_dec_expr,2,0,...v)),
(...v)=>(rednv$1(95243,fn$1.call_expr,2,0,...v)),
()=>(1158),
()=>(1170),
(...v)=>(rednv$1(77835,fn$1.call_expr,2,0,...v)),
(...v)=>(rednv$1(90123,fn$1.new_expr,2,0,...v)),
()=>(1186),
(...v)=>(redv$1(132107,R0_cover_parenthesized_expression_and_arrow_parameter_list,2,0,...v)),
()=>(1194),
()=>(1190),
()=>(96267),
(...v)=>(rednv$1(131083,fn$1.await_expr,2,0,...v)),
()=>(1222),
(...v)=>(rednv$1(47115,fn$1.label_stmt,2,0,...v)),
()=>(1242),
()=>(1238),
(...v)=>(redv$1(56327,R0_statement_list,1,0,...v)),
(...v)=>(rednv$1(57351,fn$1.binding,1,0,...v)),
()=>(1250),
()=>(133127),
()=>(1258),
()=>(1270),
()=>(1290),
()=>(1306),
()=>(1330),
()=>(1342),
()=>(1346),
()=>(1366),
(...v)=>(rednv$1(36875,fn$1.continue_stmt,2,0,...v)),
()=>(1374),
(...v)=>(rednv$1(37899,fn$1.break_stmt,2,0,...v)),
()=>(1378),
(...v)=>(redv$1(38923,R0_return_statement,2,0,...v)),
()=>(1382),
()=>(1390),
()=>(1402),
()=>(1406),
(...v)=>(rednv$1(54283,fn$1.debugger_stmt,2,0,...v)),
(...v)=>(rednv$1(79883,fn$1.class_stmt,2,0,...v)),
()=>(1414),
()=>(1422),
()=>(1442),
()=>(1438),
(...v)=>((redn$1(65539,...v))),
()=>(1482),
()=>(1490),
()=>(1486),
(...v)=>(redv$1(60423,R0_statement_list,1,0,...v)),
(...v)=>(rednv$1(29711,fn$1.block,3,0,...v)),
(...v)=>(redv$1(88079,R0_expression,3,0,...v)),
(...v)=>(rednv$1(114703,fn$1.assign,3,0,...v)),
()=>(1502),
(...v)=>(rednv$1(117775,fn$1.or,3,0,...v)),
(...v)=>(rednv$1(118799,fn$1.and,3,0,...v)),
(...v)=>(rednv$1(119823,fn$1.bit_or,3,0,...v)),
(...v)=>(rednv$1(120847,fn$1.bit_xor,3,0,...v)),
(...v)=>(rednv$1(121871,fn$1.bit_and,3,0,...v)),
(...v)=>(rednv$1(122895,fn$1.eq,3,0,...v)),
(...v)=>(rednv$1(122895,fn$1.neq,3,0,...v)),
(...v)=>(rednv$1(122895,fn$1.strict_eq,3,0,...v)),
(...v)=>(rednv$1(122895,fn$1.strict_neq,3,0,...v)),
(...v)=>(rednv$1(123919,fn$1.lt,3,0,...v)),
(...v)=>(rednv$1(123919,fn$1.gt,3,0,...v)),
(...v)=>(rednv$1(123919,fn$1.lteq,3,0,...v)),
(...v)=>(rednv$1(123919,fn$1.gteq,3,0,...v)),
(...v)=>(rednv$1(123919,fn$1.instanceof_expr,3,0,...v)),
(...v)=>(rednv$1(123919,fn$1.in,3,0,...v)),
(...v)=>(rednv$1(124943,fn$1.l_shift,3,0,...v)),
(...v)=>(rednv$1(124943,fn$1.r_shift,3,0,...v)),
(...v)=>(rednv$1(124943,fn$1.r_shift_fill,3,0,...v)),
(...v)=>(rednv$1(125967,fn$1.add,3,0,...v)),
(...v)=>(rednv$1(125967,fn$1.sub,3,0,...v)),
(...v)=>(rednv$1(126991,fn$1.mult,3,0,...v)),
(...v)=>(rednv$1(126991,fn$1.div,3,0,...v)),
(...v)=>(rednv$1(126991,fn$1.mod,3,0,...v)),
(...v)=>(rednv$1(128015,fn$1.exp,3,0,...v)),
(...v)=>(redv$1(110603,R0_array_literal,2,0,...v)),
()=>(1510),
()=>(1506),
()=>(1530),
()=>(1522),
()=>(112647),
(...v)=>(redv$1(111623,R0_statement_list,1,0,...v)),
(...v)=>(redv$1(100363,R3_class_tail,2,0,...v)),
()=>(1542),
()=>(1538),
(...v)=>(redv$1(101383,R0_statement_list,1,0,...v)),
()=>(102407),
(...v)=>(rednv$1(102407,C0_property_definition,1,0,...v)),
()=>(1558),
()=>(1562),
()=>(105479),
()=>(106503),
(...v)=>(rednv$1(95247,fn$1.call_expr,3,0,...v)),
()=>(1578),
(...v)=>(redv$1(97291,R0_arguments,2,0,...v)),
()=>(1586),
()=>(1582),
(...v)=>(redv$1(98311,R0_statement_list,1,0,...v)),
()=>(1594),
(...v)=>(rednv$1(91151,fn$1.member,3,0,...v)),
(...v)=>(rednv$1(91151,fn$1.new_member_stmt,3,0,...v)),
(...v)=>(rednv$1(94223,fn$1.new_target_expr,3,0,...v)),
(...v)=>(redv$1(132111,R3_case_block,3,0,...v)),
()=>(1598),
()=>(1602),
()=>(1606),
()=>(1610),
(...v)=>(rednv$1(92175,fn$1.supper_expr,3,0,...v)),
()=>(1614),
(...v)=>(redv$1(71695,R0_arrow_function,3,0,...v)),
()=>(73735),
(...v)=>(redv$1(48139,R3_case_block,2,0,...v)),
()=>(49159),
(...v)=>(rednv$1(55311,fn$1.var_stmt,3,0,...v)),
(...v)=>(rednv$1(57355,fn$1.binding,2,0,...v)),
()=>(134155),
()=>(1634),
()=>(1642),
()=>(1638),
()=>(137223),
()=>(140295),
()=>(1650),
()=>(142343),
()=>(135179),
()=>(1662),
()=>(1670),
()=>(1678),
()=>(1674),
()=>(138247),
()=>(139271),
()=>(141319),
()=>(1694),
()=>(1698),
()=>(1702),
()=>(1706),
()=>(1714),
()=>(1738),
()=>(1742),
()=>(1746),
()=>(1750),
()=>(1754),
()=>(1774),
()=>(1786),
(...v)=>(redv$1(36879,R0_continue_statement,3,0,...v)),
(...v)=>(redv$1(37903,R0_break_statement,3,0,...v)),
(...v)=>(rednv$1(38927,fn$1.return_stmt,3,0,...v)),
()=>(1790),
(...v)=>(rednv$1(39951,fn$1.throw_stmt,3,0,...v)),
(...v)=>(redv$1(50191,R0_try_statement,3,0,...v)),
(...v)=>(redv$1(50191,R1_try_statement,3,0,...v)),
()=>(1798),
(...v)=>(rednv$1(79887,fn$1.class_stmt,3,0,...v)),
()=>(1810),
()=>(1814),
(...v)=>(redv$1(80907,R3_class_tail,2,0,...v)),
()=>(82951),
(...v)=>(redv$1(83975,R0_statement_list,1,0,...v)),
()=>(84999),
(...v)=>(redv$1(81931,R3_case_block,2,0,...v)),
()=>(1826),
()=>(65543),
()=>(1830),
()=>(67591),
(...v)=>(redv$1(66567,R0_statement_list,1,0,...v)),
()=>(68615),
(...v)=>(rednv$1(58383,fn$1.lexical,3,0,...v)),
(...v)=>(rednv$1(61451,fn$1.binding,2,0,...v)),
(...v)=>(redv$1(110607,R0_array_literal,3,0,...v)),
()=>(112651),
(...v)=>(redv$1(111627,R0_element_list,2,0,...v)),
(...v)=>(redv$1(110607,R3_case_block,3,0,...v)),
()=>(1846),
(...v)=>(rednv$1(113675,fn$1.spread_expr,2,0,...v)),
(...v)=>(redv$1(100367,R3_case_block,3,0,...v)),
()=>(1862),
()=>(108555),
(...v)=>(rednv$1(102411,fn$1.spread_expr,2,0,...v)),
(...v)=>(rednv$1(103435,C0_colon_assignment,2,0,...v)),
()=>(1882),
()=>(1886),
()=>(1890),
(...v)=>(rednv$1(95251,fn$1.call_expr,4,0,...v)),
(...v)=>(redv$1(97295,R3_case_block,3,0,...v)),
()=>(1894),
()=>(1902),
(...v)=>(rednv$1(98315,fn$1.spread_expr,2,0,...v)),
(...v)=>(rednv$1(91155,fn$1.member,4,0,...v)),
(...v)=>(redv$1(132115,R3_case_block,4,0,...v)),
(...v)=>(redv$1(132115,R1_cover_parenthesized_expression_and_arrow_parameter_list,4,0,...v)),
(...v)=>(rednv$1(92179,fn$1.supper_expr,4,0,...v)),
()=>(1914),
()=>(70663),
(...v)=>(redv$1(56335,R0_variable_declaration_list,3,0,...v)),
(...v)=>(redv$1(109579,R3_case_block,2,0,...v)),
()=>(134159),
()=>(1922),
()=>(136203),
()=>(142347),
()=>(1934),
()=>(135183),
()=>(139275),
()=>(1938),
()=>(143371),
()=>(141323),
()=>(1970),
()=>(1974),
()=>(1982),
()=>(1986),
()=>(1990),
()=>(1994),
()=>(35847),
()=>(1998),
()=>(2006),
()=>(34827),
()=>(2026),
()=>(2042),
()=>(2050),
(...v)=>(redv$1(50195,R2_try_statement,4,0,...v)),
(...v)=>(rednv$1(52235,fn$1.finally_stmt,2,0,...v)),
()=>(2070),
(...v)=>(redv$1(80911,R2_class_tail,3,0,...v)),
(...v)=>(redv$1(80911,R1_class_tail,3,0,...v)),
(...v)=>(redv$1(83979,R0_class_element_list,2,0,...v)),
(...v)=>(redv$1(85003,R0_class_element,2,0,...v)),
()=>(2074),
(...v)=>(redv$1(65547,R0_S,2,0,...v)),
()=>(2086),
(...v)=>(redv$1(60431,R0_variable_declaration_list,3,0,...v)),
(...v)=>(rednv$1(116759,fn$1.condition_expr,5,0,...v)),
(...v)=>(redv$1(110611,R3_case_block,4,0,...v)),
(...v)=>(redv$1(111631,R1_element_list,3,0,...v)),
(...v)=>(redv$1(100371,R3_case_block,4,0,...v)),
(...v)=>(redv$1(101391,R0_formal_parameters,3,0,...v)),
()=>(2094),
()=>(64519),
(...v)=>(redv$1(104459,R3_case_block,2,0,...v)),
()=>(107535),
()=>(2098),
(...v)=>(redv$1(97299,R3_case_block,4,0,...v)),
(...v)=>(redv$1(98319,R0_formal_parameters,3,0,...v)),
()=>(2114),
()=>(2118),
(...v)=>(redv$1(73743,R3_case_block,3,0,...v)),
()=>(2122),
()=>(134163),
()=>(137231),
()=>(140303),
()=>(135187),
()=>(2126),
()=>(2134),
()=>(138255),
(...v)=>(rednv$1(32791,fn$1.if_stmt,5,0,...v)),
()=>(2138),
()=>(2142),
(...v)=>(rednv$1(33815,fn$1.while_stmt,5,0,...v)),
()=>(2146),
()=>(2154),
()=>(2162),
()=>(2174),
()=>(2190),
()=>(2194),
()=>(2202),
()=>(2206),
()=>(2210),
()=>(2214),
()=>(2222),
(...v)=>(rednv$1(42007,fn$1.switch_stmt,5,0,...v)),
()=>(2230),
()=>(2250),
()=>(2246),
(...v)=>(rednv$1(40983,fn$1.with_stmt,5,0,...v)),
()=>(2254),
()=>(53255),
(...v)=>(redv$1(80915,R0_class_tail,4,0,...v)),
(...v)=>((redn$1(69635,...v))),
(...v)=>(redv$1(65551,R0_formal_parameters,3,0,...v)),
(...v)=>(redv$1(66575,R0_formal_parameters,3,0,...v)),
()=>(2266),
(...v)=>(redv$1(111635,R1_element_list,4,0,...v)),
()=>(2270),
()=>(2274),
()=>(2278),
()=>(87047),
(...v)=>(redv$1(98323,R0_argument_list,4,0,...v)),
(...v)=>(redv$1(132123,R2_cover_parenthesized_expression_and_arrow_parameter_list,6,0,...v)),
()=>(134167),
()=>(135191),
()=>(2282),
()=>(2290),
()=>(2298),
()=>(2302),
()=>(2310),
(...v)=>(redv$1(33819,R8_iteration_statement,6,0,...v)),
()=>(2318),
()=>(2326),
()=>(2330),
()=>(2334),
()=>(2338),
(...v)=>(redv$1(33819,R15_iteration_statement,6,0,...v)),
()=>(2366),
()=>(2374),
(...v)=>(redv$1(43019,R0_case_block,2,0,...v)),
()=>(2382),
()=>(2394),
(...v)=>(redv$1(44039,R0_statement_list,1,0,...v)),
(...v)=>(redv$1(46087,R1_default_clause,1,0,...v)),
()=>(2402),
()=>(2410),
()=>(69639),
()=>(2426),
()=>(135195),
(...v)=>(rednv$1(32799,fn$1.if_stmt,7,0,...v)),
(...v)=>(rednv$1(33823,fn$1.do_while_stmt,7,0,...v)),
(...v)=>(shftf$1(2430,I2_iteration_statement,...v)),
(...v)=>(redv$1(33823,R7_iteration_statement,7,0,...v)),
(...v)=>(redv$1(33823,R6_iteration_statement,7,0,...v)),
()=>(2450),
()=>(2454),
(...v)=>(redv$1(33823,R13_iteration_statement,7,0,...v)),
(...v)=>(redv$1(33823,R14_iteration_statement,7,0,...v)),
(...v)=>(redv$1(33823,R16_iteration_statement,7,0,...v)),
(...v)=>(redv$1(33823,R18_iteration_statement,7,0,...v)),
()=>(2478),
()=>(2490),
(...v)=>(redv$1(43023,R3_case_block,3,0,...v)),
(...v)=>(redv$1(44043,R0_case_clauses,2,0,...v)),
()=>(2494),
()=>(2498),
(...v)=>(rednv$1(51223,fn$1.catch_stmt,5,0,...v)),
(...v)=>(redv$1(63519,R0_function_declaration,7,0,...v)),
()=>(2506),
()=>(2510),
()=>(2514),
(...v)=>(redv$1(33827,R5_iteration_statement,8,0,...v)),
(...v)=>(redv$1(33827,R4_iteration_statement,8,0,...v)),
(...v)=>(redv$1(33827,R3_iteration_statement,8,0,...v)),
()=>(2526),
(...v)=>(redv$1(33827,R12_iteration_statement,8,0,...v)),
(...v)=>(redv$1(33827,R17_iteration_statement,8,0,...v)),
(...v)=>(redv$1(33827,R18_iteration_statement,8,0,...v)),
(...v)=>(redv$1(33827,R0_iteration_statement,8,0,...v)),
(...v)=>(redv$1(33827,R19_iteration_statement,8,0,...v)),
()=>(2542),
(...v)=>(redv$1(43027,R2_case_block,4,0,...v)),
(...v)=>(redv$1(45071,R1_case_clause,3,0,...v)),
(...v)=>(redv$1(46095,R0_default_clause,3,0,...v)),
(...v)=>(redv$1(63523,R1_function_declaration,8,0,...v)),
(...v)=>(rednv$1(86047,fn$1.class_method,7,0,...v)),
(...v)=>(rednv$1(86047,fn$1.class_get_method,7,0,...v)),
()=>(2550),
(...v)=>(redv$1(33831,R0_iteration_statement,9,0,...v)),
(...v)=>(redv$1(33831,R10_iteration_statement,9,0,...v)),
(...v)=>(redv$1(33831,R11_iteration_statement,9,0,...v)),
(...v)=>(redv$1(33831,R20_iteration_statement,9,0,...v)),
(...v)=>(redv$1(43031,R1_case_block,5,0,...v)),
(...v)=>(redv$1(45075,R0_case_clause,4,0,...v)),
(...v)=>(rednv$1(86051,fn$1.class_set_method,8,0,...v)),
(...v)=>(redv$1(33835,R9_iteration_statement,10,0,...v))],

    //Goto Lookup Functions
    goto$1 = [v=>lsm$1(v,gt0$1),
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
v=>lsm$1(v,gt2$1),
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
v=>lsm$1(v,gt15),
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
v=>lsm$1(v,gt16),
v=>lsm$1(v,gt17),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt18),
nf$1,
nf$1,
v=>lsm$1(v,gt19),
v=>lsm$1(v,gt20),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt21),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt22),
v=>lsm$1(v,gt23),
v=>lsm$1(v,gt24),
nf$1,
v=>lsm$1(v,gt25),
v=>lsm$1(v,gt26),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt27),
nf$1,
v=>lsm$1(v,gt28),
v=>lsm$1(v,gt29),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt1$1),
nf$1,
v=>lsm$1(v,gt30),
v=>lsm$1(v,gt31),
v=>lsm$1(v,gt32),
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
v=>lsm$1(v,gt33),
v=>lsm$1(v,gt34),
v=>lsm$1(v,gt35),
v=>lsm$1(v,gt36),
v=>lsm$1(v,gt37),
v=>lsm$1(v,gt38),
v=>lsm$1(v,gt39),
v=>lsm$1(v,gt40),
v=>lsm$1(v,gt41),
v=>lsm$1(v,gt42),
v=>lsm$1(v,gt43),
v=>lsm$1(v,gt44),
v=>lsm$1(v,gt45),
v=>lsm$1(v,gt46),
v=>lsm$1(v,gt47),
v=>lsm$1(v,gt48),
v=>lsm$1(v,gt49),
v=>lsm$1(v,gt50),
v=>lsm$1(v,gt51),
v=>lsm$1(v,gt52),
v=>lsm$1(v,gt53),
v=>lsm$1(v,gt54),
v=>lsm$1(v,gt55),
v=>lsm$1(v,gt56),
v=>lsm$1(v,gt57),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt58),
v=>lsm$1(v,gt59),
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
v=>lsm$1(v,gt60),
nf$1,
v=>lsm$1(v,gt61),
v=>lsm$1(v,gt62),
v=>lsm$1(v,gt63),
v=>lsm$1(v,gt64),
nf$1,
nf$1,
v=>lsm$1(v,gt65),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt66),
nf$1,
v=>lsm$1(v,gt67),
v=>lsm$1(v,gt68),
nf$1,
nf$1,
v=>lsm$1(v,gt69),
nf$1,
v=>lsm$1(v,gt70),
nf$1,
nf$1,
v=>lsm$1(v,gt71),
v=>lsm$1(v,gt72),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt73),
v=>lsm$1(v,gt74),
v=>lsm$1(v,gt75),
nf$1,
v=>lsm$1(v,gt76),
v=>lsm$1(v,gt77),
nf$1,
v=>lsm$1(v,gt78),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt79),
nf$1,
v=>lsm$1(v,gt80),
nf$1,
v=>lsm$1(v,gt81),
nf$1,
nf$1,
v=>lsm$1(v,gt82),
v=>lsm$1(v,gt83),
v=>lsm$1(v,gt84),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt85),
v=>lsm$1(v,gt86),
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
nf$1,
v=>lsm$1(v,gt87),
v=>lsm$1(v,gt88),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt89),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt90),
nf$1,
v=>lsm$1(v,gt91),
v=>lsm$1(v,gt92),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt93),
v=>lsm$1(v,gt94),
v=>lsm$1(v,gt95),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt96),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt30),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt97),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt98),
nf$1,
v=>lsm$1(v,gt99),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt100),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt101),
nf$1,
v=>lsm$1(v,gt102),
nf$1,
nf$1,
v=>lsm$1(v,gt103),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt104),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt105),
v=>lsm$1(v,gt106),
v=>lsm$1(v,gt107),
v=>lsm$1(v,gt3$1),
nf$1,
v=>lsm$1(v,gt108),
v=>lsm$1(v,gt109),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt110),
nf$1,
nf$1,
v=>lsm$1(v,gt111),
nf$1,
v=>lsm$1(v,gt112),
nf$1,
nf$1,
v=>lsm$1(v,gt113),
nf$1,
nf$1,
v=>lsm$1(v,gt114),
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
v=>lsm$1(v,gt115),
nf$1,
v=>lsm$1(v,gt116),
nf$1,
nf$1,
v=>lsm$1(v,gt117),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt118),
nf$1,
nf$1,
v=>lsm$1(v,gt119),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt120),
v=>lsm$1(v,gt121),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt122),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt123),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt1$1),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt124),
nf$1,
v=>lsm$1(v,gt125),
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
v=>lsm$1(v,gt128),
v=>lsm$1(v,gt129),
v=>lsm$1(v,gt130),
nf$1,
v=>lsm$1(v,gt131),
nf$1,
nf$1,
v=>lsm$1(v,gt71),
v=>lsm$1(v,gt72),
nf$1,
v=>lsm$1(v,gt132),
v=>lsm$1(v,gt133),
v=>lsm$1(v,gt134),
v=>lsm$1(v,gt135),
v=>lsm$1(v,gt136),
nf$1,
v=>lsm$1(v,gt85),
v=>lsm$1(v,gt86),
nf$1,
v=>lsm$1(v,gt137),
nf$1,
v=>lsm$1(v,gt138),
v=>lsm$1(v,gt139),
v=>lsm$1(v,gt140),
nf$1,
v=>lsm$1(v,gt141),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt142),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt143),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt144),
nf$1,
nf$1,
v=>lsm$1(v,gt145),
nf$1,
nf$1,
nf$1,
nf$1,
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
v=>lsm$1(v,gt148),
nf$1,
v=>lsm$1(v,gt149),
v=>lsm$1(v,gt150),
v=>lsm$1(v,gt151),
v=>lsm$1(v,gt152),
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
v=>lsm$1(v,gt156),
nf$1,
v=>lsm$1(v,gt157),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt158),
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
v=>lsm$1(v,gt159),
nf$1,
v=>lsm$1(v,gt160),
nf$1,
v=>lsm$1(v,gt161),
nf$1,
v=>lsm$1(v,gt162),
nf$1,
nf$1,
v=>lsm$1(v,gt163),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt164),
v=>lsm$1(v,gt165),
nf$1,
v=>lsm$1(v,gt166),
v=>lsm$1(v,gt167),
v=>lsm$1(v,gt168),
v=>lsm$1(v,gt169),
nf$1,
v=>lsm$1(v,gt170),
nf$1,
nf$1,
v=>lsm$1(v,gt171),
v=>lsm$1(v,gt172),
nf$1,
v=>lsm$1(v,gt173),
nf$1,
v=>lsm$1(v,gt174),
nf$1,
nf$1,
v=>lsm$1(v,gt175),
v=>lsm$1(v,gt176),
v=>lsm$1(v,gt177),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt178),
v=>lsm$1(v,gt179),
nf$1,
v=>lsm$1(v,gt180),
nf$1,
v=>lsm$1(v,gt181),
nf$1,
v=>lsm$1(v,gt182),
v=>lsm$1(v,gt183),
v=>lsm$1(v,gt184),
v=>lsm$1(v,gt185),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt186),
nf$1,
v=>lsm$1(v,gt187),
v=>lsm$1(v,gt188),
nf$1,
nf$1,
v=>lsm$1(v,gt189),
nf$1,
nf$1,
v=>lsm$1(v,gt190),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt191),
v=>lsm$1(v,gt192),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt193),
v=>lsm$1(v,gt194),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt195),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt196),
v=>lsm$1(v,gt1$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt197),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt1$1),
nf$1,
nf$1];

function getToken$1(l, SYM_LU) {
    if (l.END) return 0; /*2*/

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

                const recovery_token = eh$1[ss[sp]](tk, e, o, l, p, ss[sp]);

                if (RECOVERING > 0 && typeof(recovery_token) == "string") {
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
    console.log(time);
    return o[0];
};

var types = {
		object:1,
		null:2,
		stmts:3,
		object:4,
		number:5,
		string:6,
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
		equal:36,
		or:37,
		and:38,
		bit_or:39,
		bit_and:40,
		id:41,
		member:42,
		call:43,
		return:44,
		if:45,
		post_inc:46,
		post_dec:47,
		pre_inc:48,
		pre_dec:49,
		condition:50,
		class:51,
		negate:52,
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
class identifier$1 extends base{
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
        this.id.getRootIds(ids,closure);
        this.args.forEach(e => e.getRootIds(ids,closure));
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	yield * this.id.traverseDepthFirst();
        for(let arg of this.args)
            yield * arg.traverseDepthFirst();
	 	yield this;
	 }
     get name () {return this.id.name}
     get type () { return types.call }
     render(){        return `${this.id.render()}(${this.args.map(a=>a.render()).join(",")})`}
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
class stmts extends base {
    constructor(sym) {
        super();
        this.stmts = sym[0];
    }

    getRootIds(ids, closure) {
        this.stmts.forEach(s=>s.getRootIds(ids, closure));
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	for(let stmt of this.stmts)
	 		yield * stmt.traverseDepthFirst();
	 	yield this;
	 }

     get type () { return types.stmts }

     render(){return `${this.stmts.map(s=>s.render()).join(";")}`};
}

/** BLOCK **/
class block extends stmts {

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
    	if(this.init) this.init.getRootIds(ids, closure);
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	yield * this.id.traverseDepthFirst();
	 	yield * this.init.traverseDepthFirst();
	 	yield this;
	 }

     render(){return `${this.id}${this.init ? ` = ${this.init.render()}` : ""}`}
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

/** STRING **/

class string$1 extends base{
	 constructor (sym){super(); this.val = sym[0];}
	 getRootIds(ids, closuere){if(!closuere.has(this.val))ids.add(this.val);}

     get type () { return types.string }

     render(){return this.val}

}

/** NULL **/
class null_ extends base{
	 constructor (sym){super();}
	 get type () { return types.null }

	 render(){return "null"}
}

/** NUMBER **/
class number$1 extends base{
	 constructor (sym){super();this.val = parseFloat(sym); this.ty = "num";}
	 get type () { return types.number }
	 render(){return this.val}
}

/** BOOLEAN **/

class bool extends base{
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

const env$1 =  {
	table:{},
	ASI:true,
	functions:{
		for_stmt,
		call_expr,
		identifier: identifier$1,
		catch_stmt,
		try_stmt,
		stmts,
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
		negate_expr:negate,
		if_stmt:function(sym){this.bool = sym[2]; this.body = sym[4]; this.else = sym[6];},
		while_stmt:function(sym){this.bool = sym[1]; this.body = sym[3];},
		return_stmt:function(sym){this.expr = sym[1];},
		class_stmt: function(sym){this.id = sym[1], this.tail= sym[2];},
		class_tail:function(sym){this.heritage = sym[0]; this.body = sym[2];},
		debugger_stmt: base,
		lex_stmt: function(sym){this.ty = sym[0]; this.declarations = sym[1];},
		var_stmt: function(sym){this.declarations = sym[1], console.log(sym);},
		member_expr: function(sym){this.id = sym[0]; this.expr = sym[2];},
		add_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "ADD";},
		or_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "OR";},
		and_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "AND";},
		sub_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "SUB";},
		mult_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "MUL";},
		div_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "DIV";},
		mod_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "MOD";},
		lt_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "LT";},
		gt_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "GT";},
		lte_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "LTE";},
		gte_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "GTE";},
		eq_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "EQ";},
		seq_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "STRICT_EQ";},
		neq_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "NEQ";},
		sneq_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "STRICT_NEQ";},
		unary_not_expr : function (sym){this.expr = sym[1]; this.ty = "NOT";},
		unary_plus : function (sym){this.expr = sym[1]; this.ty = "PRE INCR";},
		unary_minus : function (sym){this.expr = sym[1]; this.ty = "PRE INCR";},
		pre_inc_expr : function (sym){this.expr = sym[1]; this.ty = "PRE INCR";},
		pre_dec_expr : function (sym){this.expr = sym[1]; this.ty = "PRE DEC";},
		post_inc_expr : function (sym){this.expr = sym[0]; this.ty = "POST INCR";},
		post_dec_expr : function (sym){this.expr = sym[0]; this.ty = "POST DEC";},
		condition_expr : function (sym){this.condition = sym[0]; this.le = sym[2]; this.re = sym[4];},
		null_literal :null_,
		numeric_literal : number$1,
		bool_literal : bool,
		string_literal : string$1,
		label_stmt : function(sym){this.label =sym[0]; this.stmt = sym[1];},
		funct_decl: function(id,args,body){this.id = id || "Anonymous"; this.args = args; this.body = body, this.scope = false;},
		this_expr: function(){},
		defaultError: (tk, env, output, lex, prv_lex) => {
            /*USED for ASI*/
            if (env.ASI && lex.tx !== ")" && !lex.END) {
                let ENCOUNTERED_NL = (lex.tx == "}" || lex.END);

                while (!ENCOUNTERED_NL && !prv_lex.END && prv_lex.off < lex.off) {
                    prv_lex.next();
                    if (prv_lex.ty == prv_lex.types.nl)
                        ENCOUNTERED_NL = true;
                }

	            if (ENCOUNTERED_NL)
	                return ";";
            }

            if(lex.END)
            	return ";";

            return null;
        }

	},


	options : {
		integrate : false,
		onstart : ()=>{
			console.log("SDFS");
			env$1.table = {};
        	env$1.ASI = true;	
        }
	}
};

// This is a variadic function that accepts objects, string, and urls, 
//  and compiles data from the argument sources into a wick component. 

// If compilation fails, failure component is generated that provides 
// error information. 

//(data, presets)
async function compiler (...data){

	if(data.length === 0)
		throw new Error("This function requires arguments. Refere to wick docs on what arguments may be passed to this function.");

	// The presets object provides global values to this component
	// and all its derivatives and descendents. 
	let presets = {}; 
	
	if(data.length > 1)
		presets = data.slice(-1); 
	
	const component_data = data[0];

	switch(typeof component_data){
		case "string": 
		/* Need to determine if string is:
			   URL to component resource
			   HTML data
			   JS data
			   or incompatible data that should throw.
		*/
		const ast = parser(whind(component_data), env);
		console.dir(ast, true);
		break;
		case "object":
			// Extract properties from the object that relate to wick component attributes. 
		break;

	}

	return {}
}

const wick = compiler;

exports.default = wick;
