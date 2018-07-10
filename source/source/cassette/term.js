import {
    Cassette
} from "./cassette"

class Term extends Cassette {
	
    constructor(parent, element, p, d) {
        super(parent, element, p, d)
        this.value = null;
    }

    update(data) {

        //apply a filter object to the parent
        if(data[this.prop] && data[this.prop] != this.value){
            this.value = data[this.prop];
            this.ele.innerHTML = data[this.prop]
            this.parent.revise();

            return true;
        }

        return false;
    }

    get term() {
        return this.ele.innerHTML;
        
    }

    set term(e){

    }
}

export {
    Term
}