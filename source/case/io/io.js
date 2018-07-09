import {
    Rivet
} from "../rivet"

export class IO extends Rivet{
	constructor(parent, data, presets){
		super(parent, data, presets)
		this.prop = data.prop
	}

	down(data){
		this.element.innerHTML = data.value;
	}
}