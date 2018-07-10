import {
    Cassette
} from "./cassette"

class Exists extends Cassette {
    constructor(parent, element, d, p) {
        super(parent, element, d, p);
        this.defualt = element.getStyle("display");
        this.temp = document.createElement("span");

    }

    update(data) {
        if (data) {

            if (data[this.prop]) {
                if (this.temp.parentElement)
                    this.temp.parentElement.replaceChild(this.ele, this.temp);
            } else {
                if (this.ele.parentElement)
                    this.ele.parentElement.replaceChild(this.temp, this.ele);
            }
        }
    }
}

class NotExists extends Cassette {
    constructor(parent, element, d, p) {
        super(parent, element, d, p);
        this.defualt = element.getStyle("display");
        this.temp = document.createElement("span");

    }

    update(data) {
        if (data) {

            if (data[this.prop]) {
                if (this.ele.parentElement)
                    this.ele.parentElement.replaceChild(this.temp, this.ele);
            } else {
                if (this.temp.parentElement)
                    this.temp.parentElement.replaceChild(this.ele, this.temp);
            }
        }
    }
}

export {
    Exists,
    NotExists
}