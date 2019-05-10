import base from "./base.mjs";
import identifier from "./identifier.mjs"

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
	 	return this;
	 }
}
