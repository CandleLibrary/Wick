/** FOR **/

import base from "./base.mjs";
import types from "../types.mjs";
export default class extends base{
	constructor(init,bool,iter, body){super();this.init = init; this.bool = bool, this.iter=iter, this.body = body}
	
	getRootIds(ids, closure){
		
		closure = new Set([...closure.values()])

		if(this.bool) this.bool.getRootIds(ids,closure);
		if(this.iter) this.iter.getRootIds(ids,closure);
		if(this.body) this.body.getRootIds(ids,closure);
	}

	*traverseDepthFirst (){ 
	 	yield this;
	 	if(this.init) yield * this.init.traverseDepthFirst();
	 	if(this.bool) yield * this.bool.traverseDepthFirst();
	 	if(this.iter) yield * this.iter.traverseDepthFirst();
	 	if(this.body) yield * this.body.traverseDepthFirst();
	 	yield this;
	 }

	 get type () { return types.for }

	 render(){
	 	let init, bool, iter, body;
	 	
	 	if(this.init) init = this.init.render();
	 	if(this.bool) bool = this.bool.render();
	 	if(this.iter) iter = this.iter.render();
	 	if(this.body) body = this.body.render();

	 	return `for(${init};${bool};${iter})${body}`}
}
