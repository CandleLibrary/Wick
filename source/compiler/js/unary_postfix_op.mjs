/** OPERATOR **/

import base from "./base.mjs";
import types from "./types.mjs";
export default class extends base {

    constructor(sym) {
        super();
        this.expr = sym[0];
        this.op = ""
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	yield * this.expr.traverseDepthFirst();
	 	yield this;
	 }

     render(){return `${this.expr.render()}${this.op}` }
}
