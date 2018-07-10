import { NumberSchemaConstructor } from "./number.js"

class TimeSchemaConstructor extends NumberSchemaConstructor {

    parse(value) {
        if (!isNaN(value))
            return parseInt(value);
        try {
            var hour = parseInt(value.split(":")[0]);
            var min = parseInt(value.split(":")[1].split(" ")[0]);
            var half = (value.split(":")[1].split(" ")[1].toLowerSource() == "pm");
        } catch (e) {
            var hour = 0;
            var min = 0;
            var half = 0;
        }

        return parseFloat((hour + ((half) ? 12 : 0) + (min / 60)));
    }

    verify(value, result) {
        this.parse(value);
        super.verify(value, result);
    }

    filter(identifier, filters) {
        return true
    }

    string(value) {
        return (new Date(value)) + "";
    }
}

let time = new TimeSchemaConstructor()

export { time, TimeSchemaConstructor }