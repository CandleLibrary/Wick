import Scope from "../component/runtime/scope.mjs";
import ElementNode from "./element.mjs";
import {
    appendChild,
    createElement
} from "../../short_names.mjs";

export default class scp extends ElementNode{

	constructor(env, tag, children, attribs, presets){
        
		super(env, "scope", children, attribs, presets);

		this.import = this.getAttrib("import").value;
		this.export = this.getAttrib("export").value;
		this.put = this.getAttrib("put").value;
		this.model_name = this.getAttrib("model").value;
		this.schema_name = this.getAttrib("schema").value;
        this.element = this.getAttrib("element").value;
	}

    createElement() {
        return createElement(this.element || "div");
    }

	mount(element, scope, presets = this.presets, slots = {}, pinned = {}){

        let me = new Scope(scope, presets, element, this);

        if(this.slots)
            slots = Object.assign({}, slots, this.slots);

        //Reset pinned
        pinned = {};

        if(this.pinned)
            pinned[this.pinned] = me.ele;
        

        me._model_name_ = this.model_name;
        me._schema_name_ = this.schema_name;

        /**
         * To keep the layout of the output HTML predictable, Wick requires that a "real" HTMLElement be defined before a scope object is created. 
         * If this is not the case, then a new element, defined by the "element" attribute of the scope virtual tag (defaulted to a "div"), 
         * will be created to allow the scope object to bind to an actual HTMLElement. 
         */
        if (!element || this.getAttrib("element").value) {

            let ele = this.createElement();

            this.class.split(" ").map(c => c ? ele.classList.add(c) : {});

            if (this.getAttribute("id"))
                ele.id = this.getAttribute("id");

            if (this.getAttribute("style"))
                ele.style = this.getAttribute("style");

            me.ele = ele;

            if (element) {
                appendChild(element, ele);
            }

            element = ele;

            if (this._badge_name_)
                me.badges[this._badge_name_] = element;
        }

        for (let i = 0, l = this.attribs.length; i < l; i++)
            this.attribs[i].bind(element, scope, pinned)

        for(let i = 0; i < this.children.length; i++){
            const node = this.children[i];
            node.mount(element, me, presets, slots, pinned);
        }

        return me;
	}
}
