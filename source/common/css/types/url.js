export class CSS_URL extends String {
    static parse(l, rule, r) {
        if (l.tx == "url" || l.tx == "uri") {
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
            return new CSS_URL(v);
        }
        return null;
    }
}