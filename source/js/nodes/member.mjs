/** IDENTIFIER **/

import base from "./base.mjs";

export default class extends base{
	 constructor (sym){super(); this.id = sym[0];  this.mem = sym[2]}
	 getRootIds(ids, closuere){
	 	this.id.getRootIds(ids, closuere);
	 }

	 *traverseDepthFirst (){ 
	 	yield this;
	 	yield * this.id.traverseDepthFirst();
	 	yield * this.mem.traverseDepthFirst();
	 	return this;
	 }
}
