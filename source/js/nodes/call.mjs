import base from "./base.mjs";
import identifier from "./identifier.mjs"
import types from "../types.mjs";

export default class extends base {
    constructor(sym) {
        super();
        this.id = sym[0];
        this.args = sym[1];
    }

    getRootIds(ids, closure) {
        this.id.getRootIds(ids,closure)
        this.args.forEach(e => e.getRootIds(ids,closure));
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	yield * this.id.traverseDepthFirst();
        for(let arg of this.args)
            yield * arg.traverseDepthFirst();
	 	yield this;
	 }
     get name () {return this.id.name}
     get type () { return types.call }
     render(){        return `${this.id.render()}(${this.args.map(a=>a.render()).join(",")})`}
}
