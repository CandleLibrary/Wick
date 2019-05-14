/** IDENTIFIER **/

import base from "./base.mjs";
import types from "../types.mjs";
export default class extends base{
	 constructor (sym){super(); this.val = sym[0]; this.root = true;}
	 getRootIds(ids, closuere){if(!closuere.has(this.val))ids.add(this.val)}
	 *traverseDepthFirst (){ 
	 	yield this;
	 }

	 get name () {return this.val}

	 get type () { return types.id }

	 render  () { return this.val}
}
