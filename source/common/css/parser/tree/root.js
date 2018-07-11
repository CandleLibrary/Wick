import {CSSNode, CSSValue} from "./base.js"

export class CSSRootNode extends CSSNode {
	
	constructor(){
		super("css_root");
	}

	parse(lexer){
		let id = this.id(lexer)
		if(lexer.tx == "")

	}
}