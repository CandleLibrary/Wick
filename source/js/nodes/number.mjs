/** NUMBER **/

import base from "./base.mjs";
import types from "../types.mjs";
export default class extends base{
	 constructor (sym){super();this.val = parseFloat(sym); this.ty = "num"}
	 get type () { return types.number }
}
