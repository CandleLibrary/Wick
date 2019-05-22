
import ElementNode from "./element.mjs";

export default class slt extends ElementNode{
	finalize(){
		this.name = this.getAttribute("name");
		return this;
	}

	mount(element, scope, statics, presets){
		if(statics && statics[this.name]){
			let ele = statics[this.name];
			statics[this.name] = null;
			ele(element, scope, statics, presets);
		}
	}
}