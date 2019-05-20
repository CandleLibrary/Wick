
import ElementNode from "./element.mjs";
import css from "@candlefw/css";

export default class sty extends ElementNode{
	constructor(children, attribs){
		css;
		
		let data = children[0].data;
		css(data).then(css=>{
			debugger
		});
		super("style", children, attribs);
	}
}