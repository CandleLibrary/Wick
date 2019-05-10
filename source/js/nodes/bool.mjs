/** BOOLEAN **/

import base from "./base.mjs";

export default class extends base{
	 constructor (sym){super();this.val = sym[0].slice(1) == "true"}
}
