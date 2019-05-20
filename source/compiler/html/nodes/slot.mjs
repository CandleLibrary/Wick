
import ElementNode from "./element.mjs";

export default class slt extends ElementNode{
	constructor(children, attribs){
		super("slot", children, attribs);
	}
}