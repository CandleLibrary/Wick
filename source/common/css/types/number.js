export class CSS_Number extends Number {
    static _parse_(l, rule, r) {
        let tx = l.tx;
        if(l.ty == l.types.num){
            l.n();
            return new CSS_Number(tx);
        }
        return null;
    }
}