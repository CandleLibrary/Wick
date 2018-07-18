import { PipeBase } from "./base"


/**
 *   Intercepts data transmitted between a Tap and IO, and transforms based on preset criteria. 
 *   
 *   @param {Source} parent - The parent {@link Source}, used internally to build a hierarchy of Sources.
 *   @param {Object} data - An object containing HTMLELement attribute values and any other values produced by the template parser.
 *   @param {Presets} presets - An instance of the {@link Presets} object.
 *   @memberof module:wick.core.source
 *   @alias Pipe
 *   @extends PipeBase
 */
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