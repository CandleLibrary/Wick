import {
    Cassette
} from "./cassette"

class Term extends Cassette {
	
    constructor(parent, element, p, d) {
        super(parent, element, p, d)
    }

    update(data) {
        //apply a filter object to the parent
        if(data[this.prop]){
            this.element.innerHTML = data[this.prop]
            this.parent.revise();
        }


    }

    get term() {
        return this.element.innerHTML;
        
    }

    set term(e){

    }
}

export {
    Term
}