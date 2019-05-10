/** STATEMENTS **/

import base from "./base.mjs";

export default class extends base {
    constructor(sym) {
        super();
        this.stmts = sym[0];
    }

    getRootIds(ids, closure) {
        this.stmts.forEach(s=>s.getRootIds(ids, closure))
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	for(let stmt of this.stmts)
	 		yield * stmt.traverseDepthFirst();
	 	return this;
	 }
}
