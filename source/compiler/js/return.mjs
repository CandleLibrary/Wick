/** RETURN STATMENT  **/

import base from "./base.mjs";
import types from "./types.mjs";



export default class extends base {
    constructor(sym) {
        super();
        this.expr = (sym.length > 2) ? sym[1] : null;
    }

    getRootIds(ids,closure) {
        if (this.expr) this.expr.getRootIds(ids,closure);
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	yield * this.expr.traverseDepthFirst();
	 }

     get type () { return types.return }

     render  () { return `return ${(this.expr) ? this.expr.render() : ""};`}
}
