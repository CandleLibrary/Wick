
import ElementNode from "./element.mjs";

export default class pre extends ElementNode{
	constructor(children, attribs){
		super("pre", children, attribs);
	}
}