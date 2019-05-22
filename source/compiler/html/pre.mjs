
import ElementNode from "./element.mjs";

export default class pre extends ElementNode{
	constructor(env, tag, children, attribs, presets){
		super(env, "pre", children, attribs, presets);
	}
}