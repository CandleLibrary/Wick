import { SchemaConstructor } from "../constructor.js"

class BoolSchemaConstructor extends SchemaConstructor {

    constructor() {

        super();

        this.start_value = false;
    }

    parse(value) {

        return (value) ? true : false;
    }

    verify(value, result) {

        result.valid = true;

        if (!value instanceof Boolean) {
            result.valid = false;
            result.reason = " Value is not a Boolean."
        }
    }

    filter(identifier, filters) {

        if (value instanceof Boolean)
            return true;

        return false;
    }
}

let bool = new BoolSchemaConstructor ()

export { bool, BoolSchemaConstructor };