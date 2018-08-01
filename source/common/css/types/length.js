export class CSS_Length extends Number {
    static _parse_(l, rule, r) {
        let tx = l.tx;
        if(l.ty == l.types.num){
            if(l.pk.ty == l.types.id){
                let id = l.sync().tx;
                l.n();
                return new CSS_Length(tx, id);
            }
        }
        return null;
    }

    constructor(v,u){
        super(v);
        this.unit = u;
    }

    get milliseconds(){
        switch(this.unit){
            case("s"):
                return parseFloat(this) * 1000;
        }

        return parseFloat(this);
    }

    toString(radix){
        return super.toString(radix) + "" + this.unit;
    }

    toJSON(){
        return super.toString() + "" + this.unit;
    }

    get str() {
        return this.toString();
    }
}