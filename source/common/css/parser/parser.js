import {Lexer} from "../../string_parsing/lexer"

import {CSSRootNode} from "./tree/root.js"

/**
	CSS Parser

	Builds a CSS object graph that stores information pulled from a css formatted string. 

*/
export function CSSParser (css_string){
	let r = null;

	try{

		let lex = new Lexer(css_string, true);

		r = new CSSRootNode();

		r.parse(lex)

	} catch(e){
		return null;
	}

	return r
}