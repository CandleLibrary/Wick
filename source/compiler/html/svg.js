
import ElementNode from "./element.js";

export default class svg extends ElementNode{
	constructor(env, tag, children, attribs, presets){
		super(env, tag, children, attribs, presets);
	}


	createElement(){
		return document.createElementNS("http://www.w3.org/2000/svg",this.tag);
	}
}
