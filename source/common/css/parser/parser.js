import { Lexer } from "../../string_parsing/lexer"

import { CSSRootNode } from "./tree/root.js"

/**
	CSS Parser

	Builds a CSS object graph that stores information pulled from a CSS string. 
    
    @memberof module:wick~internals
*/
export function CSSParser(css_string, root = null) {

    try {

        let lex = new Lexer(css_string, true);

        if (!root || !(root instanceof CSSRootNode)) root = new CSSRootNode();

        root.parse(lex)

    } catch (e) {
        console.error(e)
        return null;
    }

    return root
}