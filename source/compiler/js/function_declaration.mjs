import base from "./base.mjs";
import identifier from "./identifier.mjs"
import types from "./types.mjs";

export default class extends base {
    constructor(id, args, body) {

        super();

        this.id = id;

        //This is a declaration and id cannot be a closure variable. 
        this.id.root = false;

        this.args = args || [];
        this.body = body || [];
    }

    getRootIds(ids, closure) {
        this.id.getRootIds(ids, closure);
        this.args.forEach(e => e.getRootIds(ids, closure));
    }

    *traverseDepthFirst (){ 
        yield this;
        
        yield * this.id.traverseDepthFirst();
        
        for(let arg of this.args)
            yield * arg.traverseDepthFirst();

        for(let arg of this.body)
            yield * arg.traverseDepthFirst();
     }

    get name() { return this.id.name }
    
    get type() { return types.function_declaration }

    render() { return `function ${this.id.render()}(${this.args.map(a=>a.render()).join(",")}){${this.body.render()}}` }
}
