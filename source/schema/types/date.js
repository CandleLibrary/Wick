import { NumberSchemaConstructor } from "./number.js"

import { Lex } from "../../common/common"

let scape_date = new Date();
scape_date.setHours(0);
scape_date.setMilliseconds(0);
scape_date.setSeconds(0);
scape_date.setTime(0);

class DateSchemaConstructor extends NumberSchemaConstructor {

    parse(value) {

        if(!value)
            return undefined;

        if (!isNaN(value))
            return parseInt(value);

        let lex = Lex(value);

        let year = parseInt(lex.text)

        if (year) {

            scape_date.setHours(0);
            scape_date.setMilliseconds(0);
            scape_date.setSeconds(0);
            scape_date.setTime(0);

            lex.next();
            lex.next();
            let month = parseInt(lex.text) - 1;
            lex.next();
            lex.next();
            let day = parseInt(lex.text)
            scape_date.setFullYear(year);
            scape_date.setDate(day);
            scape_date.setMonth(month);

            lex.next()

            if (lex.pos > -1) {

                let hours = parseInt(lex.text)
                lex.next()
                lex.next()
                let minutes = parseInt(lex.text)

                scape_date.setHours(hours);
                scape_date.setMinutes(minutes);
            }

            return scape_date.valueOf();
        } else
            return (new Date(value)).valueOf();
    }

    /**
     
     */
    verify(value, result) {

        value = this.parse(value);

        super.verify(value, result);
    }

    filter(identifier, filters) {

        if (filters.length > 1) {

            for (let i = 0, l = filters.length - 1; i < l; i += 2) {
                let start = filters[i];
                let end = filters[i + 1];

                if (start <= identifier && identifier <= end) {
                    return true;
                }
            }
        }

        return false;
    }

    string(value) {
        
        return (new Date(value)) + "";
    }
}

let date = new DateSchemaConstructor()

export { date, DateSchemaConstructor }