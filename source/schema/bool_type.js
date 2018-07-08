import {
    SchemaType
} from "./schema_type.js"

let BOOL = new(class BoolSchema extends SchemaType {
    constructor(){
        super();
        this.start_value = false;
    }

    parse(value) {
        return (value) ? true : false; 
    }

    verify(value, result) {
        result.valid = true;
        if(!value instanceof Boolean){
            result.valid = false;
            result.reason = " Value is not a Boolean."
        }
    }

    filter(identifier, filters) {
        if(value instanceof BOOL)
            return true;
        return false;
    }

})()

export {
    BOOL
};