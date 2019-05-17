/** MEMBER **/

import base from "./base.mjs";
import types from "../types.mjs";

export default class mem extends base {
    constructor(sym) { super();
        this.id = sym[0];
        this.mem = sym[2];
        this.root = true;
        this.mem.root = false 
    }

    getRootIds(ids, closuere) {
        this.id.getRootIds(ids, closuere);
    }

    * traverseDepthFirst() {
        yield this;
        yield* this.id.traverseDepthFirst();
        yield* this.mem.traverseDepthFirst();
        //yield this;
    }

    get name() { return this.id.name }
    get type() { return types.member }

    render() { return `${this.id.render()}.${this.mem.render()}` }
}