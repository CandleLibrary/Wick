
import ElementNode from "./element.mjs";

export default class a extends ElementNode{
	constructor(env, tag, children, attribs, presets){
		super(env, "a", children, attribs, presets);
	}
}