import {
    SchemaType
} from "./schema_type.js"

let STRING = new(class extends SchemaType {
    
    parse(value) {
        return value + "";
    }

    verify(value, result) {
        result.valid = true;
    }

    filter(identifier, filters) {
        for (let i = 0, l = filters.length; i < l; i++) {
            if (identifier.match(filters[i]+""))
                return true;
        }
        return false;
    }

})()

export {
    STRING
};