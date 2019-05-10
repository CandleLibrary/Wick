/** FOR **/

import base from "./base.mjs";

export default class extends base{
	constructor(set,bool,iter, body){super();this.set = set; this.bool = bool, this.iter=iter, this.body = body}
	
	getRootIds(ids, closure){
		
		closure = new Set([...closure.values()])

		if(this.bool) this.bool.getRootIds(ids,closure);
		if(this.iter) this.iter.getRootIds(ids,closure);
		if(this.body) this.body.getRootIds(ids,closure);
	}

	*traverseDepthFirst (){ 
	 	yield this;
	 	yield * this.bool.traverseDepthFirst();
	 	yield * this.iter.traverseDepthFirst();
	 	yield * this.body.traverseDepthFirst();
	 	return this;
	 }
}
