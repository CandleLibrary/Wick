import element_selector from "./element_selector.js";
import {types} from "@candlefw/js";
export default class js_wick_node{

	constructor(element){

		this.node = element;

		this.root = true;
		
		this._id = "comp"+((Math.random()*1236584)|0);

		var presets = this.node.presets;
		
		this.node.presets.components[this._id] = this.node;
	}

	* traverseDepthFirst(){
		yield this;
	}


	getRootIds(ids, closure) {
		ids.add("wickNodeExpression");	
	}

	get name(){
		return "wickNodeExpression";
	}

	get type(){
		return types.identifier;
	}

	get val() { return "wickNodeExpression" }

	render(){
		return `wickNodeExpression(this,"${this._id}")`;
	}
}
