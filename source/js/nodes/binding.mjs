/** BINDING DECLARATION **/

import base from "./base.mjs";
import types from "../types.mjs";
export default class extends base {
    constructor(sym) {
    	super();
    	this.id = sym[0];
        this.id.root = false;
        this.init = sym[1] ? sym[1] : null;
    }

    getRootIds(ids, closure) {
    	this.id.getRootIds(closure, closure);
    	if(this.init) this.init.getRootIds(ids, closure);
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	yield * this.id.traverseDepthFirst();
	 	yield * this.init.traverseDepthFirst();
	 	yield this;
	 }

     render(){return `${this.id}${this.init ? ` = ${this.init.render()}` : ""}`}
}
