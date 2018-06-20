import {
    Cassette
} from "./cassette"

class Exists extends Cassette {
    constructor(parent, element, controller) {
        super(parent, element, controller);
        this.defualt = element.getStyle("display");
        this.temp = document.createElement("span");

    }

    update(data) {
        if (data) {

            if (data[this.prop]) {
            	if(this.temp.parentElement)
            		this.temp.parentElement.replaceChild(this.element, this.temp);
            }else{
            	if(this.element.parentElement)
            		this.element.parentElement.replaceChild(this.temp, this.element);
            }
        }
    }
}

class NotExists extends Cassette {
    constructor(parent, element, controller) {
        super(parent, element, controller);
        this.defualt = element.getStyle("display");
        this.temp = document.createElement("span");

    }

    update(data) {
        if (data) {

            if (data[this.prop]) {
                if(this.element.parentElement)
                    this.element.parentElement.replaceChild(this.temp, this.element);
            }else{
                if(this.temp.parentElement)
                    this.temp.parentElement.replaceChild(this.element, this.temp);
            }
        }
    }
}

export {
    Exists, NotExists
}