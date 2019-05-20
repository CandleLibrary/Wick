
import ElementNode from "./element.mjs";

export default class svg extends ElementNode{
	constructor(children, attribs){
		super("svg", children, attribs);
	}
}