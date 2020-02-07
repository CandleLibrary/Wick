import ElementNode from "./html/element.js";

export default class extends ElementNode {

	constructor(env) {
		super();
		console.log(env);
		debugger;
	}

	finalize() {
		return this;
	}

	mount(scope, ele) {
		return scope;
	}
}