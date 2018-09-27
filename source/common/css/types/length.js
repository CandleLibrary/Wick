import { Lexer } from "../../string_parsing/lexer";
export class CSS_Length extends Number {
    static _parse_(l, rule, r) {
        let tx = l.tx,
            pky = l.pk.ty;

        if (l.ty == l.types.num || tx == "-" && pky == l.types.num) {
            let mult = 1;

            if (l.ch == "-") {
                mult = -1;
                tx = l.p.tx;
                l.p.n();
            }

            if (l.p.ty == l.types.id) {
                let id = l.sync().tx;
                l.n();
                return new CSS_Length(parseFloat(tx) * mult, id);
            }
        }
        return null;
    }

    static _verify_(l) {
        if (typeof(l) == "string" && !isNaN(parseInt(l)) && !l.includes("%"))
            return true;
        return false;
    }

    constructor(v, u = "") {

        if (typeof(v) == "string") {
            let lex = new Lexer(v);
            let val = CSS_Length._parse_(lex);
            if (val) 
                return val;
        }

        super(v);

        this.unit = u;
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
}