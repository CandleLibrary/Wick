/** ASSIGNEMENT EXPRESSION **/

import base from "./base.mjs";

import types from "../types.mjs";

export default class extends base {
    constructor(sym) {
        super();
        this.id = sym[0];
        this.op = sym[1];
        this.expr = sym[2];
    }

    getRootIds(ids, closure) {
    	this.id.getRootIds(ids, closure);
    	this.expr.getRootIds(ids, closure);
    }

    *traverseDepthFirst (){ 
        yield this;
        yield * this.id.traverseDepthFirst();
        yield * this.expr.traverseDepthFirst();
        //yield this;
     }

     get type () { return types.assign }

    render(){return `${this.id.render()} ${this.op} ${this.expr.render()}`}
}
