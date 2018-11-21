export class CSS_String extends String {
    static _parse_(l, rule, r) {
        if (l.ty == l.types.str) {
            let tx = l.tx;
            l.n();
            return new CSS_String(tx);
        }
        return null;
    }
}