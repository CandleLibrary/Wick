
import ElementNode from "./element.js";

export default class a extends ElementNode{
	constructor(env,presets, tag, children, attribs ){
		super(env,presets, "a", children, attribs );
	}

	createElement(){
        const element = document.createElement("a");
        this.presets.processLink(element);
        return element;
    }
}
