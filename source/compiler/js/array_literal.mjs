import base from "./base.mjs";
import identifier from "./identifier.mjs";
import types from "./types.mjs";

export default class extends base {
    constructor(sym) {
        super();
        this.exprs = sym[0];
    }

    getRootIds(ids, closure) {
        this.exprs.forEach(e => e.getRootIds(ids, closure));
    }

    * traverseDepthFirst() {
        yield this;
        for (let expr of this.exprs)
            yield* expr.traverseDepthFirst();
    }

    get name() { return this.id.name }
    
    get type() { return types.array_literal }

    render() { return `[${this.exprs.map(a=>a.render()).join(",")}]` }
}
