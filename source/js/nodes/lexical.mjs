/** LEXICAL DECLARATION **/

import base from "./base.mjs";

export default class extends base {
    constructor(sym) {

    	super();
    	this.type = sym[0];
        this.bindings = sym[1];
    }

    getRootIds(ids, closure) {
    	this.bindings.forEach(b=>b.getRootIds(ids, closure))
    }
}
