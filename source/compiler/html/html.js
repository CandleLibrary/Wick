let fn = {}; const 
/************** Maps **************/

    /* Symbols To Inject into the Lexer */
    symbols = ["</"],

    /* Goto lookup maps */
    gt0 = [0,-1,1,-1,2,3],
gt1 = [0,-5,6,-7,5,8,-3,7],
gt2 = [0,-9,26,29,30,-2,8,-3,33],
gt3 = [0,-9,34,29,30,-2,8,-3,33],
gt4 = [0,-15,39,37,38],
gt5 = [0,-10,48,30,-2,8,-3,33],
gt6 = [0,-4,54,-1,51,49,52,-10,55,53,56],
gt7 = [0,-14,8,-3,66],
gt8 = [0,-14,8,-3,68],
gt9 = [0,-15,75,-1,74],
gt10 = [0,-4,54,-1,51,76,52,-10,55,53,56],
gt11 = [0,-13,80,8,-3,7],
gt12 = [0,-4,54,-3,81,-10,55,53,56],
gt13 = [0,-21,82],
gt14 = [0,-12,83,-1,8,-3,85,-3,84],
gt15 = [0,-5,92],
gt16 = [0,-13,94,8,-3,7],
gt17 = [0,-13,95,8,-3,7],
gt18 = [0,-23,99,98,97,100],
gt19 = [0,-23,99,98,108,100],
gt20 = [0,-5,109],
gt21 = [0,-13,111,8,-3,7],
gt22 = [0,-23,115,-2,100],

    // State action lookup maps
    sm0=[0,-4,0,-4,0,-5,1],
sm1=[0,2,-3,0,-4,0],
sm2=[0,3,-3,0,-4,0],
sm3=[0,4,-3,0,-4,0],
sm4=[0,-2,5,-1,0,-4,0,-10,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
sm5=[0,-2,5,-1,0,-4,0,-7,22,23,-31,24,25],
sm6=[0,-2,5,-1,0,-4,0,-7,26,27,-31,24,25],
sm7=[0,-2,28,-1,0,-4,0,-7,28,28,-31,28,28],
sm8=[0,-2,29,-1,30,-4,31,-7,32,32,-17,32,-3,33,34,35,-7,32,32],
sm9=[0,-2,36,-1,36,-4,36,-7,36,36,-17,36,-3,36,36,36,-7,36,36],
sm10=[0,-2,37,-1,0,-4,0,-7,37,37,-31,37,37],
sm11=[0,-2,5,-1,0,-4,0,-7,38,39,-31,24,25],
sm12=[0,-1,40,41,-1,42,43,44,45,46,0,-5,1,-3,47],
sm13=[0,-4,0,-4,0,-8,48],
sm14=[0,-2,49,-1,0,-4,0,-7,49,49,-31,49,49],
sm15=[0,-2,50,-1,0,-4,0,-7,50,50,-17,51,-13,50,50],
sm16=[0,-2,5,-1,0,-4,0,-41,52],
sm17=[0,-2,5,-1,0,-4,0,-40,53],
sm18=[0,-2,54,-1,0,-4,0,-7,54,54,-17,54,-13,54,54],
sm19=[0,-2,5,-1,0,-4,0,-7,55,56,-31,24,25],
sm20=[0,57,57,57,-1,57,57,57,57,57,0,-5,57,-3,58],
sm21=[0,-4,0,-4,0,-8,59],
sm22=[0,-2,29,-1,30,-4,31,-7,60,60,-17,60,-3,33,34,35,-7,60,60],
sm23=[0,-2,61,-1,0,-4,0,-7,61,61,-17,61,-13,61,61],
sm24=[0,-2,62,-1,62,-4,62,-7,62,62,-17,62,-3,62,62,62,-7,62,62],
sm25=[0,-2,63,-1,63,-4,63,-7,63,63,-17,63,-3,63,63,63,-7,63,63],
sm26=[0,-2,64,-1,0,-4,0,-7,64,64,-17,64,-13,64,64],
sm27=[0,-1,40,41,-1,42,43,44,45,46,0,-5,1,-3,65],
sm28=[0,-4,0,-4,0,-8,66],
sm29=[0,-2,67,-1,0,-4,0,-7,67,67,-31,67,67],
sm30=[0,-4,0,-4,0,-9,68],
sm31=[0,-2,5,-1,0,-4,0],
sm32=[0,-1,40,41,-1,42,43,44,45,46,0,-5,1,-3,69],
sm33=[0,-1,70,70,-1,70,70,70,70,70,0,-5,70,-3,70],
sm34=[0,-1,71,71,-1,71,71,71,71,71,0,-5,71,-3,71],
sm35=[0,-1,40,41,-1,42,43,44,45,46,0,-5,72,-3,72],
sm36=[0,-1,73,73,-1,73,73,73,73,73,0,-5,73,-3,73],
sm37=[0,-1,74,74,-1,74,74,74,74,74,0,-5,74,-3,74],
sm38=[0,75,75,75,-1,75,75,75,75,75,0,-5,75,-3,75],
sm39=[0,-2,5,-1,0,-4,0,-40,76,77],
sm40=[0,-4,0,-4,0,-41,78],
sm41=[0,-2,79,-1,0,-4,0,-7,79,79,-17,79,-13,79,79],
sm42=[0,-4,0,-4,0,-40,80],
sm43=[0,81,81,81,-1,81,81,81,81,81,0,-5,81,-3,82],
sm44=[0,-4,0,-4,0,-8,83],
sm45=[0,-4,0,-4,0,-10,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
sm46=[0,-2,84,-1,0,-4,0,-7,84,84,-17,84,-13,84,84],
sm47=[0,-2,85,-1,85,-4,85,-7,85,85,-17,85,-3,85,85,85,-7,85,85],
sm48=[0,-4,0,-4,0,-9,86],
sm49=[0,87,87,87,-1,87,87,87,87,87,0,-5,87,-3,87],
sm50=[0,-4,0,-4,0,-8,88],
sm51=[0,-1,89,89,-1,89,89,89,89,89,0,-5,89,-3,89],
sm52=[0,-1,90,90,-1,90,90,90,90,90,0,-5,90,-3,90],
sm53=[0,-2,91,-1,0,-4,0,-7,91,91,-31,91,91],
sm54=[0,-2,92,-1,0,-4,0,-7,92,92,-31,92,92],
sm55=[0,-2,93,-1,94,95,96,97,98,0,-3,99],
sm56=[0,-2,100,-1,0,-4,0,-7,100,100,-17,100,-13,100,100],
sm57=[0,-4,0,-4,0,-8,101],
sm58=[0,-4,0,-4,0,-8,102],
sm59=[0,-4,0,-4,0,-8,103],
sm60=[0,104,104,104,-1,104,104,104,104,104,0,-5,104,-3,104],
sm61=[0,-4,0,-4,0,-40,105],
sm62=[0,-2,93,-1,94,95,96,97,98,0,-3,99,-36,106,106],
sm63=[0,-2,107,-1,107,107,107,107,107,0,-3,107,-36,107,107],
sm64=[0,-2,108,-1,108,108,108,108,108,0,-3,108,-36,108,108],
sm65=[0,-2,109,-1,109,109,109,109,109,0,-3,109,-36,109,109],
sm66=[0,-4,0,-4,0,-41,110],
sm67=[0,-4,0,-4,0,-8,111],
sm68=[0,112,112,112,-1,112,112,112,112,112,0,-5,112,-3,112],
sm69=[0,-4,0,-4,0,-8,113],
sm70=[0,114,114,114,-1,114,114,114,114,114,0,-5,114,-3,114],
sm71=[0,115,115,115,-1,115,115,115,115,115,0,-5,115,-3,115],
sm72=[0,-2,116,-1,0,-4,0,-7,116,116,-31,116,116],
sm73=[0,-2,117,-1,117,117,117,117,117,0,-3,117,-36,117,117],
sm74=[0,118,118,118,-1,118,118,118,118,118,0,-5,118,-3,118],
sm75=[0,119,119,119,-1,119,119,119,119,119,0,-5,119,-3,119],

    // Symbol Lookup map
    lu = new Map([[1,1],[2,2],[4,3],[8,4],[16,5],[32,6],[64,7],[128,8],[256,9],[512,10],[3,11],[264,11],[200,13],[201,14],["<",15],["import",16],["/",17],[">",18],["</",19],["input",20],["area",21],["base",22],["br",23],["col",24],["command",25],["embed",26],["hr",27],["img",28],["keygen",29],["link",30],["meta",31],["param",32],["source",33],["track",34],["wbr",35],["=",36],["'",51],["\"",50],[null,13],["-",40],["_",41],[":",42]]),

    //Reverse Symbol Lookup map
    rlu = new Map([[1,1],[2,2],[3,4],[4,8],[5,16],[6,32],[7,64],[8,128],[9,256],[10,512],[11,3],[11,264],[13,200],[14,201],[15,"<"],[16,"import"],[17,"/"],[18,">"],[19,"</"],[20,"input"],[21,"area"],[22,"base"],[23,"br"],[24,"col"],[25,"command"],[26,"embed"],[27,"hr"],[28,"img"],[29,"keygen"],[30,"link"],[31,"meta"],[32,"param"],[33,"source"],[34,"track"],[35,"wbr"],[36,"="],[51,"'"],[50,"\""],[13,null],[40,"-"],[41,"_"],[42,":"]]),

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
sm20,
sm21,
sm22,
sm23,
sm24,
sm25,
sm25,
sm25,
sm25,
sm26,
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
sm35,
sm36,
sm37,
sm37,
sm37,
sm37,
sm37,
sm37,
sm37,
sm38,
sm39,
sm40,
sm41,
sm42,
sm41,
sm43,
sm44,
sm45,
sm38,
sm46,
sm47,
sm48,
sm31,
sm49,
sm31,
sm50,
sm51,
sm52,
sm53,
sm54,
sm54,
sm55,
sm55,
sm56,
sm56,
sm45,
sm49,
sm57,
sm31,
sm58,
sm59,
sm60,
sm61,
sm62,
sm63,
sm64,
sm65,
sm65,
sm65,
sm65,
sm65,
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
sm72,
sm74,
sm75],

/************ Functions *************/

    max = Math.max, min = Math.min,

    //Error Functions
    e = (...d)=>fn.defaultError(...d), 
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
    
redv = (ret, fn, plen, ln, t, e, o, l, s) => {        ln = max(o.length - plen, 0);        const slice = o.slice(-plen);        o.length = ln + 1;        o[ln] = fn(slice, e, l, s, o, plen);        return ret;    },
rednv = (ret, Fn, plen, ln, t, e, o, l, s) => {        ln = max(o.length - plen, 0);        const slice = o.slice(-plen);        o.length = ln + 1;        o[ln] = new Fn(slice, e, l, s, o, plen);        return ret;    },
redn = (ret, plen, t, e, o) => {        if (plen > 0) {            let ln = max(o.length - plen, 0);            o[ln] = o[o.length - 1];            o.length = ln + 1;        }        return ret;    },
shftf = (ret, fn, t, e, o, l, s) => (fn(o, e, l, s), ret),
R40_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],sym[4],env,lex)},
R41_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],null,env,lex)},
R42_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],sym[3],env,lex)},
R43_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,sym[3],env,lex)},
R44_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,null,env,lex)},
R45_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,sym[2],env,lex)},
R60_TAG_BODY_ITEM_list=function (sym,env,lex,state,output,len) {return ((sym[1] !== null) ? sym[0].push(sym[1]) : null,sym[0])},
R61_TAG_BODY_ITEM_list=function (sym,env,lex,state,output,len) {return (sym[0] !== null) ? [sym[0]] : []},
R90_ATTRIBUTES=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[1]),sym[0])},
R91_ATTRIBUTES=function (sym,env,lex,state,output,len) {return [sym[0]]},
R110_ATTRIBUTE_HEAD=function (sym,env,lex,state,output,len) {return sym[1]},
R160_identifier4204_group_list=function (sym,env,lex,state,output,len) {return sym[0] + sym[1]},
R161_identifier4204_group_list=function (sym,env,lex,state,output,len) {return sym[0] + ""},
R180_identifier=function (sym,env,lex,state,output,len) {return sym[0]},

    //Sparse Map Lookup
    lsm = (index, map) => {    if (map[0] == 0xFFFFFFFF) return map[index + 1];    for (let i = 1, ind = 0, l = map.length, n = 0; i < l && ind <= index; i++) {        if (ind !== index) {            if ((n = map[i]) > -1) ind++;            else ind += -n;        } else return map[i];    }    return -1;},

    //State Action Functions
    state_funct = [()=>(18),
(...v)=>(redn(5,1,...v)),
(...v)=>(redn(1031,1,...v)),
(...v)=>(redn(3079,1,...v)),
()=>(38),
()=>(42),
()=>(46),
()=>(50),
()=>(54),
()=>(58),
()=>(62),
()=>(66),
()=>(70),
()=>(74),
()=>(78),
()=>(82),
()=>(86),
()=>(90),
()=>(94),
()=>(98),
()=>(102),
()=>(114),
()=>(110),
()=>(130),
()=>(126),
()=>(146),
()=>(142),
(...v)=>(redn(13319,1,...v)),
()=>(162),
()=>(178),
()=>(182),
(...v)=>(redv(18439,R180_identifier,1,0,...v)),
()=>(166),
()=>(170),
()=>(174),
(...v)=>(redn(14343,1,...v)),
(...v)=>(redn(5127,1,...v)),
()=>(190),
()=>(186),
()=>(254),
()=>(230),
()=>(234),
()=>(246),
()=>(250),
()=>(242),
()=>(238),
()=>(202),
()=>(258),
(...v)=>(redv(9223,R91_ATTRIBUTES,1,0,...v)),
(...v)=>(rednv(10247,fn.attribute,1,0,...v)),
()=>(262),
()=>(270),
()=>(278),
(...v)=>(redn(11271,1,...v)),
()=>(286),
()=>(282),
(...v)=>(redv(4111,R44_TAG,3,0,...v)),
()=>(290),
()=>(294),
(...v)=>(redv(18443,R160_identifier4204_group_list,2,0,...v)),
(...v)=>(redv(18443,R180_identifier,2,0,...v)),
(...v)=>(redv(16391,R161_identifier4204_group_list,1,0,...v)),
(...v)=>(redn(15367,1,...v)),
(...v)=>(redn(17415,1,...v)),
()=>(310),
()=>(314),
(...v)=>(redv(9227,R90_ATTRIBUTES,2,0,...v)),
()=>(318),
(...v)=>(redn(7175,1,...v)),
(...v)=>(redv(6151,R61_TAG_BODY_ITEM_list,1,0,...v)),
(...v)=>(redn(8199,1,...v)),
(...v)=>(rednv(20487,fn.text,1,0,...v)),
(...v)=>(redv(19463,R161_identifier4204_group_list,1,0,...v)),
(...v)=>(redn(21511,1,...v)),
(...v)=>(redv(4115,R44_TAG,4,0,...v)),
()=>(346),
()=>(350),
()=>(354),
(...v)=>(redv(11275,R110_ATTRIBUTE_HEAD,2,0,...v)),
()=>(358),
(...v)=>(redv(4115,R41_TAG,4,0,...v)),
()=>(362),
()=>(366),
(...v)=>(redv(18447,R160_identifier4204_group_list,3,0,...v)),
(...v)=>(redv(16395,R160_identifier4204_group_list,2,0,...v)),
()=>(374),
(...v)=>(redv(4119,R41_TAG,5,0,...v)),
()=>(386),
(...v)=>(redv(6155,R60_TAG_BODY_ITEM_list,2,0,...v)),
(...v)=>(redv(19467,R160_identifier4204_group_list,2,0,...v)),
(...v)=>(rednv(10255,fn.attribute,3,0,...v)),
(...v)=>(redn(12295,1,...v)),
()=>(406),
()=>(410),
()=>(430),
()=>(426),
()=>(422),
()=>(418),
()=>(414),
(...v)=>(redv(11279,R110_ATTRIBUTE_HEAD,3,0,...v)),
()=>(442),
()=>(450),
()=>(454),
(...v)=>(redv(4123,R44_TAG,6,0,...v)),
()=>(458),
(...v)=>(redn(25607,1,...v)),
(...v)=>(redv(24583,R161_identifier4204_group_list,1,0,...v)),
(...v)=>(redn(23559,1,...v)),
(...v)=>(redn(26631,1,...v)),
()=>(466),
()=>(470),
(...v)=>(redv(4123,R45_TAG,6,0,...v)),
()=>(474),
(...v)=>(redv(4127,R41_TAG,7,0,...v)),
(...v)=>(redv(4127,R43_TAG,7,0,...v)),
(...v)=>(redv(22543,R110_ATTRIBUTE_HEAD,3,0,...v)),
(...v)=>(redv(24587,R160_identifier4204_group_list,2,0,...v)),
(...v)=>(redv(4127,R42_TAG,7,0,...v)),
(...v)=>(redv(4131,R40_TAG,8,0,...v))],

    //Goto Lookup Functions
    goto = [v=>lsm(v,gt0),
nf,
nf,
nf,
v=>lsm(v,gt1),
v=>lsm(v,gt2),
v=>lsm(v,gt3),
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
v=>lsm(v,gt5),
v=>lsm(v,gt6),
nf,
nf,
nf,
v=>lsm(v,gt7),
v=>lsm(v,gt8),
nf,
v=>lsm(v,gt5),
nf,
nf,
v=>lsm(v,gt9),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt10),
nf,
nf,
nf,
v=>lsm(v,gt11),
v=>lsm(v,gt12),
nf,
nf,
nf,
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
v=>lsm(v,gt14),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt15),
nf,
nf,
nf,
nf,
v=>lsm(v,gt16),
nf,
v=>lsm(v,gt17),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt18),
v=>lsm(v,gt19),
nf,
nf,
v=>lsm(v,gt20),
nf,
nf,
v=>lsm(v,gt21),
nf,
nf,
nf,
nf,
v=>lsm(v,gt22),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
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
        symbols.forEach(s => { l.addSymbol(s) });
        l.tl = 0;
        l.next();
    }

    const recovery_chain = [];

    const o = [],
        ss = [0, 0];

    let time = 1000000,
        RECOVERING = 100,
        RESTARTED = true,
        tk = getToken(l, lu),
        p = l.copy(),
        sp = 1,
        len = 0,
        reduceStack = (e.reduceStack = []),
        ROOT = 10000,
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
                    /* REDUCE */
                    RESTARTED = true;

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
                                item.action(output)
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
}; export default parser;
