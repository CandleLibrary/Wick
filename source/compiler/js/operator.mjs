/** OPERATOR **/

import base from "./base.mjs";
import types from "./types.mjs";
export default class extends base {

    constructor(sym) {
        super();
        this.left = sym[0]
        this.right = sym[2]
        this.op = ""
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	yield * this.left.traverseDepthFirst();
	 	yield * this.right.traverseDepthFirst();
	 	yield this;
	 }

     render(){return `${this.left.render()} ${this.op} ${this.right.render()}` }
}
