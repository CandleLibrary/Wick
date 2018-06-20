import {Cassette} from "./cassette"
import * as Common from "../common"

let day_of_week = Common.dow;
let months = Common.months;

/**
    Outputs day of the week name in the element innerHTML, provided the data-prop value is a valid epoch timestamp.

    data attributes:
        
        uppercase : if this is true than the output will be in all caps. Otherwise the output is camel-case.
        limit : will limit the output name to n characters, where n is a number from 0 - Infinity. 
                If the value is 0 or undefined, then the full name of the day will be provided.
*/
class EpochDay extends Cassette {

    constructor(parent, element) {
        super(parent, element);
        this.TO_UPPERCASE = (this.data.uppercase == "true") ? true : false;
        this.limit = (parseInt(this.data.limit) > 0) ? parseInt(this.data.limit) : 0;
    }

    update(data) {
        let date = data[this.prop];
        let epoch_date = new Date(date);
        
        if(data && epoch_date){
            let day_name = day_of_week[epoch_date.getDay()];

            day_name = (this.limit > 0) ? day_name.slice(0, this.limit) : day_name;
            day_name = (this.TO_UPPERCASE) ? day_name.toUpperCase() : day_name;

            this.element.innerHTML = day_name;
        }
    }
}

/**
    Outputs the month name in the element innerHTML, provided the data-prop value is a valid epoch timestamp.

    data attributes:
        
        uppercase : if this is true than the output will be in all caps. Otherwise the output is camel-case.
        limit : will limit thouput to n characters, where n is a number from 0 - Infinity. 
                If the value is 0 or undefined, then the full name of the day will be provided
*/
class EpochMonth extends Cassette {

    constructor(parent, element) {
        super(parent, element);
        this.TO_UPPERCASE = (this.data.uppercase == "true") ? true : false;
        this.limit = (parseInt(this.data.limit) > 0) ? parseInt(this.data.limit) : 0;
    }

    update(data) {
        let date = data[this.prop];
        let epoch_date = new Date(date);
        
        if(data && epoch_date){
            let month_name = months[epoch_date.getMonth()].name;

            month_name = (this.limit > 0) ? month_name.slice(0, this.limit) : month_name;
            month_name = (this.TO_UPPERCASE) ? month_name.toUpperCase() : month_name;

            this.element.innerHTML = month_name;
        }
    }
}

/**
    Outputs the numerical date provided the data-prop value is a valid epoch timestamp.
*/
class EpochDate extends Cassette {

    constructor(parent, element) {
        super(parent, element);
    }

    update(data) {
        let date = data[this.prop];
        let epoch_date = new Date(date);
        
        if(data && epoch_date)
            this.element.innerHTML = epoch_date.getDate();
    }
}

/**
    Outputs the year provided the data-prop value is a valid epoch timestamp.
*/
class EpochYear extends Cassette {

    constructor(parent, element) {
        super(parent, element);
    }

    update(data) {
        let date = data[this.prop];
        let epoch_date = new Date(date);
        
        if(data && epoch_date)
            this.element.innerHTML = epoch_date.getYear();
    }
}

/**
    Outputs the toString() value of a Date object provided the data-prop value is a valid epoch timestamp.
*/
class EpochToDateTime extends Cassette {
    constructor(parent, element) {
        super(parent, element);
    }

    update(data) {
        let date = data[this.prop];
        let epoch_date = new Date(date);
        
        if(data && epoch_date)
            this.element.innerHTML = epoch_date;
    }
}

export {
    EpochDay, EpochDate, EpochMonth, EpochYear, EpochToDateTime
}
