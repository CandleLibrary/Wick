/* https://www.w3.org/TR/css-shapes-1/#typedef-basic-shape */

export class CSS_Shape extends Array {
    static _parse_(l, rule, r) {
        if (l.tx == "inset" || l.tx == "circle" || l.tx == "ellipse" || l.tx == "polygon") {
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