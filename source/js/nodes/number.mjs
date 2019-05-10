/** NUMBER **/

import base from "./base.mjs";

export default class extends base{
	 constructor (sym){super();this.val = parseFloat(sym); this.ty = "num"}
}
