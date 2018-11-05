import {
    Lexer
} from "../../string_parsing/lexer";

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
        if (typeof(l) == "string" && !isNaN(parseInt(l)) && !l.includes("%")) return true;
        return false;
    }

    constructor(v, u = "") {
        
        if (typeof(v) == "string") {
            let lex = new Lexer(v);
            let val = CSS_Length._parse_(lex);
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

export class PXLength extends CSS_Length {
    get unit(){return "px";}
}
export class MMLength extends CSS_Length {
    get unit(){return "mm";}
}
export class CMLength extends CSS_Length {
    get unit(){return "cm";}
}
export class INLength extends CSS_Length {
    get unit(){return "in";}
}
export class PTLength extends CSS_Length {
    get unit(){return "pt";}
}
export class PCLength extends CSS_Length {
    get unit(){return "pc";}
}
export class CHLength extends CSS_Length {
    get unit(){return "ch";}
}
export class EMLength extends CSS_Length {
    get unit(){return "em";}
}
export class EXLength extends CSS_Length {
    get unit(){return "ex";}
}
export class REMLength extends CSS_Length {
    get unit(){return "rem";}
}
export class VHLength extends CSS_Length {
    get unit(){return "vh";}
}
export class VWLength extends CSS_Length {
    get unit(){return "vw";}
}
export class VMINLength extends CSS_Length {
    get unit(){return "vmin";}
}
export class VMAXLength extends CSS_Length {
    get unit(){return "vmax";}
}
export class DEGLength extends CSS_Length {
    get unit(){return "deg";}
}