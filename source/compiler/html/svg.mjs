
import ElementNode from "./element.mjs";

export default class svg extends ElementNode{
	constructor(env, tag, children, attribs, presets){
		super(env, "svg", children, attribs, presets);
	}
}