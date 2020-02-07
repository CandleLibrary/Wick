
import ElementNode from "./element.js";

export default class NonBinding extends ElementNode{
	mount(element, scope, presets, slots, pinned, RETURN_ELEMENT) {

		const ele = super.mount(element, scope, presets, slots, pinned, true);

        ele.innerHTML = this.innerToString();

        return (RETURN_ELEMENT) ? ele : scope;
    }
}
