
import ElementNode from "./element.mjs";
//import css from "@candlefw/css";

export default class sty extends ElementNode{
	constructor(env, tag, children, attribs, presets){
		//css;

		let data = (children[0]) ? children[0].data : "";
		/*
		css(data).then(css=>{
			debugger
		});
		*/
		super(env, "style", children, attribs, presets);
	}

	finalize(){return this}
	render(){}
	mount(){}
}
