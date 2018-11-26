export class CSS_Id extends String {
    static parse(l, rule, r) {
        if (l.ty == l.types.id) {
            let tx = l.tx;
            l.n;
            return new CSS_Id(tx);
        }
        return null;
    }
}