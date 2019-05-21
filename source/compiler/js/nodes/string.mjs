/** STRING **/

import base from "./base.mjs";

import types from "../types.mjs";

export default class extends base{
	 constructor (sym){super(); this.val = sym[0]}
	 getRootIds(ids, closuere){if(!closuere.has(this.val))ids.add(this.val)}

     get type () { return types.string }

     render(){return `"${this.val}"`}

}
