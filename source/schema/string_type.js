import {
    SchemaType
} from "./schemas.js"

let STRING = new(class extends SchemaType {
    
    parse(value) {
        return value + "";
    }

    verify(value, result) {
        result.valid = true;

        if (value.length > 20) {
            result.valid = false;
            result.reason = "Too Many Characters";
        }
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