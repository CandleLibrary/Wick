import { SourceBase } from "../base"

export class Pipe extends SourceBase {

    constructor(parent, data, presets) {
        super(parent, data, presets);
    }

    down(data) {
        return { value: `<b>${data.value}</b>` }
    }
}

Pipe.ADDS_TAGS = true;
Pipe.CAN_BE_STATIC = true;