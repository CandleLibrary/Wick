/**
 * Module is used by the nodejs wick system to create static version of compiled templates which can be used to directly embed components into existing apps without the inclusion of the wick library.
 * This acheived by appending specific methods to the constructors of the AST nodes which are used to build a JS file for a given input component. 
 */
 
import {RootNode} from "../nodes/root.js"
import {ScopeNode} from "../nodes/root.js"

RootNode.prototype._buildStatic_ = function(
	element_string, 
	parent_element_var,
	element_var, 
	scope_var,){
	if(this.merged){

	}

	let own_element = "element";
	element_string += `${own_element} = dce("`${this.tag}`");`
	if(parent_element_var) element_string  += `${parent_element_var}.appendChild(${own_element})`;

	for (let node = this.fch; node; node = this.getNextChild(node))
        node._buildStatic_();
}

ScopeNode.prototype._buildStatic_ = function(){
	/* 
	Update(data){
		this.tap1.update(data)
		this.tap2.update(data)
		this.tap3.update(data)
		this.tap4.update(data)
		this.tap5.update(data)
		this.tap6.update(data)
	}
	*/
}



