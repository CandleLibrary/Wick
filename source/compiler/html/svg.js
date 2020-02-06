
import ElementNode from "./element.js";

/* Converts all child nodes createElement function to the svg version to make sure Elements are created within the svg namespace*/
function convertNameSpace(nodes = []){
	for(const node of nodes){
		node.createElement = svg.prototype.createElement;
		convertNameSpace(node.children);
	}
}

export default class svg extends ElementNode{

	constructor(env, tag, children, attribs, presets){
		super(env, tag, children, attribs, presets);
		if(children)
		convertNameSpace(children);
	}


	createElement(){
		return document.createElementNS("http://www.w3.org/2000/svg", this.tag);
	}
}
