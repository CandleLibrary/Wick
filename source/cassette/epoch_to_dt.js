import {Cassette} from "./cassette"

class EpochToDateTime extends Cassette {
    constructor(parent, element) {
        super(parent, element);
    }

    update(data) {
        if (data[this.prop]) {
            let epoch = data[this.prop]

            this.element.innerHTML = new Date(epoch);
        }
    }
}

export {
    EpochToDateTime
}