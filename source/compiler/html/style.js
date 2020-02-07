import { appendChild } from "../../short_names.js";
import ElementNode from "./element.js";

export default class sty extends ElementNode{
	constructor(env, presets, tag, children, attribs){
		super(env, presets,  "style", children, attribs);	
	}

	get data(){return this.children[0]}

	finalize(){return this}

	render(){}

	mount(element, scope, presets){

		if(presets.options.USE_SHADOWED_STYLE){

			const own_element = this.createElement(scope);

			own_element.innerHTML = this.data.toString();

			appendChild(element, own_element);
		}

		else
			scope.css.push(this.data);
	}
}
