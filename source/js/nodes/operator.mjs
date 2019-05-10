/** OPERATOR **/

import base from "./base.mjs";

export default class extends base {

    constructor(sym) {
        super();
        this.left = sym[0]
        this.right = sym[2]
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	yield * this.left.traverseDepthFirst();
	 	yield * this.right.traverseDepthFirst();
	 	return this;
	 }
}
