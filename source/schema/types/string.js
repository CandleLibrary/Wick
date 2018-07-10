import { SchemaConstructor } from "../constructor.js"

class StringSchemaConstructor extends SchemaConstructor {
    
    constructor() {

        super();

        this.start_value = ""
    }
    parse(value) {

        return value + "";
    }

    verify(value, result) {

        result.valid = true;
    }

    filter(identifier, filters) {

        for (let i = 0, l = filters.length; i < l; i++)
            if (identifier.match(filters[i] + ""))
                return true;

        return false;
    }
}

let string = new StringSchemaConstructor()

export { string, StringSchemaConstructor };