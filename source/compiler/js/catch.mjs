/** CATCH **/

import base from "./base.mjs";
import types from "./types.mjs";
export default class extends base {
    constructor(sym) {
        super();
        this.param = sym[2];
        this.body = sym[4];
    }

    getRootIds(ids,closure) {
        if (this.body) this.body.getRootIds(ids,closure);
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	yield * this.param.traverseDepthFirst();
	 	yield * this.body.traverseDepthFirst();
	 	yield this;
	 }

     get type () { return types.catch }
}
