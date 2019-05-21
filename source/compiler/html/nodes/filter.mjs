
import ElementNode from "./element.mjs";

export default class fltr extends ElementNode{
	constructor(env, tag, children, attribs, presets){
		super(env, "f", null, attribs, presets);
	}

	mount(scope, container){
		return this.attribs[0].value.bind(scope, container);
	}
}
