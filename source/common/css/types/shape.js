export class CSS_Shape extends Array {
    static parse(l, rule, r) {
        if (l.tx == "url") {
            l.n().a("(");
            let v = "";
            if (l.ty == l.types.str) {
                v = l.tx.slice(1,-1);
                l.n().a(")");
            } else {
                let p = l.p;
                while (!p.END && p.n().tx !== ")") { /* NO OP */ }
                v = p.slice(l);
                l.sync().a(")");
            }
            return new CSS_Shape(v);
        }
        return null;
    }
}