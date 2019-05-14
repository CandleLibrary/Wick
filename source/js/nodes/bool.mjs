/** BOOLEAN **/

import base from "./base.mjs";

import types from "../types.mjs";

export default class extends base{
	 constructor (sym){super();this.val = sym[0].slice(1) == "true"}

     get type () { return types.bool }

}
