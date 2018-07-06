import {
    SchemaType
} from "./schema_type.js"

let TIME = new(class extends SchemaType {
    parse(value) {
        if (!isNaN(value))
            return parseInt(value);
        try {
            var hour = parseInt(value.split(":")[0]);
            var min = parseInt(value.split(":")[1].split(" ")[0]);
            var half = (value.split(":")[1].split(" ")[1].toLowerCase() == "pm");
        } catch (e) {
            var hour = 0;
            var min = 0;
            var half = 0;
        }

        return parseFloat((hour + ((half) ? 12 : 0) + (min / 60)));
    }

    /**
     
     */
    verify(value, result) {
        result.valid = true;
    }

    filter(identifier, filters) {
        return true
    }

    string(value) {
        return (new Date(value)) + "";
    }
})

export {
    TIME
}