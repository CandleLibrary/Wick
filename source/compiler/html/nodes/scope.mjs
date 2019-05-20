import Scope from "../../component/runtime/scope.mjs";
import ElementNode from "./element.mjs";
import {
    appendChild,
    createElement
} from "../../../short_names.mjs";

export default class scp extends ElementNode{

	constructor(children, attribs){
		super("scope", children, attribs);

		this.import = this.getAttrib("import").value;
		this.export = this.getAttrib("export").value;
		this.put = this.getAttrib("put").value;
		this.model_name = this.getAttrib("model").value;
		this.schema_name = this.getAttrib("schema").value;
	}

	mount(element, scope, statics, presets){

        let data = {};

        let out_taps = [];

        let me = new Scope(scope, this.__presets__ || presets || this.presets, element, this);

        //this.pushChached(me);

        me._model_name_ = this.model_name;
        me._schema_name_ = this.schema_name;

        let tap_list = this.tap_list;

        /*
        for (let i = 0, l = tap_list.length; i < l; i++) {
            let tap = tap_list[i],
                name = tap.name;

            let bool = name == "update";

            me.taps[name] = bool ? new UpdateTap(me, name, tap.modes) : new Tap(me, name, tap.modes);

            if (bool)
                me.update_tap = me.taps[name];

            out_taps.push(me.taps[name]);
        }
        */

        /**
         * To keep the layout of the output HTML predictable, Wick requires that a "real" HTMLElement be defined before a scope object is created. 
         * If this is not the case, then a new element, defined by the "element" attribute of the scope virtual tag (defaulted to a "div"), 
         * will be created to allow the scope object to bind to an actual HTMLElement. 
         */
         debugger
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

            /*
            let hook = {
                attr: this.attributes,
                bindings: [],
                style: null,
                ele: element
            };
            for (let i = 0, l = this.bindings.length; i < l; i++) {
                let attr = this.bindings[i];
                let bind = attr.binding._bind_(me, errors, out_taps, element, attr.name);

                if (hook) {
                    if (attr.name == "style" || attr.name == "css")
                        hook.style = bind;

                    hook.bindings.push(bind);
                }
            }

            me.hooks.push(hook);
            */
        }
        /*
        for (let i = 0, l = this.attributes.length; i < l; i++) {
            let attr = this.attributes[i];

            if (!attr.value) {
                //let value = this.par.importAttrib()
                //if(value) data[attr.name];
            } else
                data[attr.name] = attr.value;
        }
`           
        if (this.url || this.__statics__) {
            statics = Object.assign(statics, this.__statics__);
            statics.url = this.url;
        }
        */
        /*
            par_list.push(this)
        */

        //par_list.push(this);
        for(let i = 0; i < this.children.length; i++){
            //for (let node = this.fch; node; node = this.getNextChild(node))
            const node = this.children[i];
                node.mount(element, me, statics, presets);
        }
        /*
            par_list.pop()
        */
        /*
        if (statics || this.__statics__) {
            let s = Object.assign({}, statics ? statics : {}, this.__statics__);
            me.statics = s;
            me.update(me.statics);
        }*/

        //this.popCached(me);

        return me;
	}
}