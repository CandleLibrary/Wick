
import ElementNode from "./element.mjs";

export default class a extends ElementNode{
	constructor(env, tag, children, attribs, presets){
		super(env, "a", children, attribs, presets);
	}

	createElement(){
        const element = document.createElement("a");
        this.presets.processLink(element);
        return element;
    }
}
