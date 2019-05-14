/** ASSIGNEMENT EXPRESSION **/

import base from "./base.mjs";

import types from "../types.mjs";

export default class extends base {
    constructor(sym) {
        super();
        this.props = sym[0] || [];
    }

    * traverseDepthFirst (){ 
	 	yield this;
	 	for(let prop of this.props)
	 		yield * prop.traverseDepthFirst();
	 	return this;
	 }

	 get type () { return types.string }
}
