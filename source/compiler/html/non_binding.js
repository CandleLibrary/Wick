
import ElementNode from "./element.js";
import Scope from "../component/runtime/scope.js";

export default class NonBinding extends ElementNode{
	mount(element, scope, presets, slots, pinned, RETURN_ELEMENT = false) {

		let ele = null;
		if (!scope){
            scope = new Scope(null, presets || this.presets, null, this);
            ele = super.mount(element, scope, presets, slots, pinned, true);
            scope.ele = ele;
		}else
			ele = super.mount(element, scope, presets, slots, pinned, true);

        ele.innerHTML = this.innerToString();

        return (RETURN_ELEMENT) ? ele : scope;
    }
}
