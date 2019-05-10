/** BLOCK **/

import stmts from "./stmts.mjs";

export default class extends stmts {

    constructor(sym,clsr) {
        super([sym[1]]);
    }

    getRootIds(ids, closure) {
    	super.getRootIds(ids, new Set([...closure.values()]))
    }
}
