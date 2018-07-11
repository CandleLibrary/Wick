import { PipeBase } from "./base"

export class Pipe extends PipeBase {

    constructor(parent, data, presets) {
        super(parent, data, presets);
        this.ele = null;
    }

    down(data) {
        
        if (!this.ele){
            this.ele = document.createElement("b");
            data.o_el = this.ele;  
        } 
        
        return data
    }
}

Pipe.ADDS_TAGS = true;
Pipe.CAN_BE_STATIC = true;