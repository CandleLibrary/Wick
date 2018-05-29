//Stores EM_Days
import {ArrayModelContainer, BinaryTreeModelContainer} from "./model_container"

class DateModelContainer extends BinaryTreeModelContainer {
    constructor(schema, date) {
        
        if(schema && !schema.identifier){
            schema.identifier = "date";
        }

        date = date || Date();

        var d = new Date(date);
        d.setDate(1);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);

        var start = d.valueOf();
        d.setMonth(d.getMonth() + 1);
        d.setSeconds(-1);
        var end = d.valueOf();

        super(schema, start, end);

        this.days = new Day_Container(schema, this.min + (this.max-this.min) * 0.5); ///set as the middle of the month
    }

    __getItem__(item) {
        this.days.get(item);
    }

    __insertItem__(item) {
        return this.days.insert(item);
    }

    __getAllItems__(start, end){
        return this.days.__getAll__(start, end);
    }

    getNext(){
        var d = (new Date(this.max))
        d.setMonth(d.getMonth() + 1);
        return d.valueOf();
    }

    getPrev(){
        var d = (new Date(this.min))
        d.setMonth(d.getMonth() - 1);
        return d.valueOf();
    }
}

//Stores Event Models 
class Day_Container extends BinaryTreeModelContainer {
    constructor(schema, date) {
        var d1 = new Date(date || Date());
        d1.setHours(0);
        d1.setMinutes(0);
        d1.setSeconds(0);
        d1.setMilliseconds(0)
        
        var d2 = new Date(d1);
        d2.setDate(d2.getDate() + 1);
        d2.setSeconds(-1);

        super(schema, d1.valueOf(), d2.valueOf());

        this.models = new ArrayModelContainer(schema.unique_schema || schema);
    }

    destructor(){
        this.models.destructor();
        tis.models = null;
        super.destructor();
    }

    __getItem__(start_date, end_date) {
        return this.models.get(item);
    }

    __getAllItems__(){
        return { data : this.models.get(), date: this.min};
    }

    __insertItem__(item) {
        return this.models.insert(item);
    }

    getNext(){
        var d = (new Date(this.max))
        d.setDate(d.getDate() + 1);
        return d.valueOf();
    }

    getPrev(){
        var d = (new Date(this.max))
        d.setDate(d.getDate() - 1);
        return d.valueOf();
    }
}

export {DateModelContainer}