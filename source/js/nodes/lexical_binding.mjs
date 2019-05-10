/** LEXICAL DECLARATION **/

import base from "./base.mjs";

export default class extends base {
    constructor(sym) {
    	this.id = sym[0];
        this.init = sym[1] ? sym[i] : null;
    }

    getRootIds(ids, closure) {
    	this.ids.getRootIds(closure, closure);
    	if(this.init) this.init.getRootIds(ids, closure);
    }
}
