import {Lexer as L} from "../../string_parsing/lexer"

import {CSSRootNode as R} from "./tree/root.js"

/**
	CSS Parser

	Builds a CSS object graph that stores information pulled from a css formatted string. 

*/
export function CSSParser (css_string){
	let r = null;

	try{

		let lex = new L(css_string, true);

		r = new R();

		r.parse(lex)

	} catch(e){
		return null;
	}

	return r
}