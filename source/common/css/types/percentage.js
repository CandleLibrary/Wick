export class CSS_Percentage extends Number {
    static _parse_(l, rule, r) {

        let tx = l.tx;
        if (l.ty == l.types.num) {
            if (l.pk.tx == "%") {
                l.sync().n();
                return new CSS_Percentage(tx);
            }
        }

        return null;
    }
    static _verify_(l) {
        if(typeof(l) == "string" && l.includes("%"))
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
}