
import ElementNode from "./element.js";

export default class slt extends ElementNode{
	finalize(){
		this.name = this.getAttribute("name");
		return this;
	}

	mount(element, scope, presets, slots, pinned){
		if(slots && slots[this.name]){
			let ele = slots[this.name];
			slots[this.name] = null;
			ele(element, scope, presets, slots, pinned);
		}
	}
}
