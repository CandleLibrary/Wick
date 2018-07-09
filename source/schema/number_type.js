import {
    SchemaType
} from "./schema_type.js"

let NUMBER = new(class NumberSchema extends SchemaType {
    
    constructor(){
        super();
        this.start_value = 0;
    }

    parse(value) {
        return parseFloat(value);
    }

    verify(value, result) {
        result.valid = true;

        if(value == NaN || value == undefined){
            result.valid = false;
            result.reason = "Invalid number type.";
        }
    }

    filter(identifier, filters) {
        for (let i = 0, l = filters.length; i < l; i++) {
            if (identifier == filters[i])
                return true;
        }
        return false;
    }

})()

export {
    NUMBER
};