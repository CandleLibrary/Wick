/** BLOCK **/

import stmts from "./stmts.mjs";
import types from "../types.mjs";
export default class extends stmts {

    constructor(sym,clsr) {
        super([sym[1]]);
    }

    getRootIds(ids, closure) {
    	super.getRootIds(ids, new Set([...closure.values()]))
    }

    get type () { return types.block }
}
