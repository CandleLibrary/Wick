import {ctr, ctr_upd, ctr_fltr} from "./component/container.js";
import createComponent from "./component/component.js";



/* Given an argument list of element indices, returns the element at the last index location.  */
function ge(ele, ...indices) {
	if (indices.length == 0)
		return ele;
	else
		return ge(ele.childNodes[indices[0]], ...(indices.slice(1)));
}
const wick_lite = {
	ge,
	ctr,
	ctr_upd,
	ctr_fltr,
	createComponent,
	addComponent(obj) {
		if (obj.html && obj.js) {
			const template = document.createElement("template");
			template.innerHTML = obj.html;
			createComponent.map.set(obj.hash, { fn: new Function("ele", "wl", obj.js), template });
		}
	},
	load(template, fn){
		return createComponent.map.set(template.id, { fn: fn, template });
	}
};

createComponent.lite = wick_lite;

export default wick_lite;