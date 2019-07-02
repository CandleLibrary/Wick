
import ElementNode from "./element.js";
//import css from "@candlefw/css";

export default class sty extends ElementNode{
	constructor(env, tag, children, attribs, presets){

		super(env, "style", children, attribs, presets);	
	}

	get data(){return this.children[0]}

	finalize(){return this}
	render(){}
	mount(element, scope, presets, slots, pinned){
		scope.css.push(this.data);
	}
}
