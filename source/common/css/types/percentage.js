export class CSS_Percentage extends Number {
    static _parse_(l, rule, r) {
        let tx = l.tx;
        if(l.ty == l.types.num){
            if(l.pk.tx == "%"){
                l.sync().n();
                return new CSS_Percentage(tx);
            }
        }
        return null;
    }
}