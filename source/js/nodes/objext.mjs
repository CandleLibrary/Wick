/** ASSIGNEMENT EXPRESSION **/

import base from "./base.mjs";

export default class extends base {
    constructor(sym) {
        super();
        this.id = sym[0];
        this.op = sym[1];
        this.expr = sym[2];
    }

    getRootIds(ids, closure) {
    	this.expr.getRootIds(closure, closure);
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	yield * this.id.traverseDepthFirst();
	 	yield * this.op.traverseDepthFirst();
	 	yield * this.expr.traverseDepthFirst();
	 	return this;
	 }

}
