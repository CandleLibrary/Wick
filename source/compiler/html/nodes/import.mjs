
import ElementNode from "./element.mjs";

export default class Import extends ElementNode{
	constructor(attribs, presets){
		super("import", null, attribs, presets);
		this.url = this.getAttribute("url");
	}

	load(){
		debugger
	}
}