/** CONDITION EXPRESSIONS **/

import base from "./base.mjs";
import types from "./types.mjs";
export default class extends base {
    constructor(sym) {
        super();

        this.bool = sym[0];
        this.left = sym[2];
        this.right = sym[4]
    }

    getRootIds(ids, closure) {
        this.bool.getRootIds(ids, closure);
        this.left.getRootIds(ids, closure);
        this.right.getRootIds(ids, closure);
    }

    * traverseDepthFirst() {
        yield this;
        yield* this.bool.traverseDepthFirst();
        yield* this.left.traverseDepthFirst();
        yield* this.right.traverseDepthFirst();
    }

    get type() { return types.condition }

    render() {
        let
            bool = this.bool.render(),
            left = this.left.render(),
            right = this.right.render();

        return `${bool} ? ${left} : ${right}`
    }
}
