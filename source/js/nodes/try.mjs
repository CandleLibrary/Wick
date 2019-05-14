/** TRY **/

import base from "./base.mjs";
import types from "../types.mjs";
export default class extends base {
    constructor(body, _catch, _finally) {
        super();
        this.catch = _catch;
        this.body = body;
        this.finally = _finally
    }

    getRootIds(ids,clsr) {
        this.body.getRootIds(ids,clsr);
        if (this.catch) this.catch.getRootIds(ids,clsr);
        if (this.finally) this.finally.getRootIds(ids,clsr);
    }

    *traverseDepthFirst (){ 
        yield this;
        if(this.body) yield * this.body.traverseDepthFirst();
        if(this.catch) yield * this.catch.traverseDepthFirst();
        if(this.finally) yield * this.finally.traverseDepthFirst();
        return this;
     }
}
