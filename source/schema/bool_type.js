import {
    SchemaType
} from "./schemas.js"

let BOOL = new(class extends SchemaType {
    
    parse(value) {
        return (value) ? true : false; 
    }

    verify(value, result) {
        result.valid = true;
        if(!value instanceof Boolean){
            result.valid = false;
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