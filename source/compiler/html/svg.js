
import ElementNode from "./element.js";

export default class svg extends ElementNode{
	constructor(env, tag, children, attribs, presets){
		super(env, "svg", children, attribs, presets);
	}
}