import ElementNode from "./html/element.js";

export default class extends ElementNode {

	constructor(env) {
		super(env, env.presets, "errors");
		this.env = env;
	}

	finalize() {
		return this;
	}

	createElement(){
		const div = document.createElement("div");

		div.innerHTML = this.env.errors.map(e=>e.msg.replace(/\ /g, "&nbsp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\n/g, "<br/>") + "").join("<br/>");

		div.classList.add("wick-error");

		return div;
	}
}