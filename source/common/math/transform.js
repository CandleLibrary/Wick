import {
    Lexer
} from "../string_parsing/lexer";

function getValue(lex, attribute) {
    let v = parseInt(lex.tx);
    lex.n();
    if (lex.ch !== ")" && lex.ch !== ",") {
        switch (lex.tx) {
            case "%":
                break;
            case "deg":
                v *=  Math.PI / 180;
                break;
        }
        lex.n();
    }
    return v;
}

function ParseString(string, transform) {
    var lex = new Lexer(string);
    while (!lex.END) {
    	let tx = lex.tx;
    	lex.n();
        switch (tx) {
            case "matrix":
            	let a = getValue(lex.a("("));
            	let b = getValue(lex.a(","));
            	let c = getValue(lex.a(","));
            	let d = getValue(lex.a(","));

            	let cos = Math.acos(a);

            	transform[0] = getValue(lex.a(","));
            	transform[1] = getValue(lex.a(","));
            	lex.a(")")
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
                lex.a(",");
                transform.sy = getValue(lex, "left");
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
        lex.n();
    }
}
// A 2D transform compisition of 2D position, 2D scale, and 1D rotation.
export class Transform2D extends Float64Array {
    static ToString(pos = [0, 0], scl = [1, 1], rot = 0) {
        var px = 0,
            py = 0,
            sx = 1,
            sy = 1,
            r = 0;
        if (pos.length == 5) {
            px = pos[0];
            py = pos[1];
            sx = pos[2];
            sy = pos[3];
            r = pos[4]
        } else {
            px = pos[0];
            py = pos[1];
            sx = scl[0];
            sy = scl[1];
            r = rot
        }
        let cos = Math.cos(r);
        let sin = Math.sin(r);
        return `matrix(${cos * sx}, ${-sin * sx}, ${sy * sin}, ${sy * cos}, ${px}, ${py})`
    }
    constructor(px, py, sx, sy, r) {
        super(5)
        this.sx = 1;
        this.sy = 1;
        if (px) {
            if (px instanceof Transform2D) {
            	this[0] = px[0]
            	this[1] = px[1]
            	this[2] = px[2]
            	this[3] = px[3]
            	this[4] = px[4]
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
    lerp(to, t) {
        let out = new Transform2D();
        for (let i = 0; i < 5; i++) out[i] = this[i] + (to[i] - this[i]) * t;
        return out;
    }
    toString() {
        return Transform2D.ToString(this);
    }

    copy(v){
    	let copy = new Transform2D(this);

    	
    	if(typeof(v) == "string")
    		ParseString(v, copy)
    	
    	return copy;
    }
}