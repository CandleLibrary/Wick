import {
    appendChild,
    createElement
} from "../../../short_names";

export default class HTMLTag{
	
	constructor(sym, env){

		const 
			tag = sym[1],
			attribs = sym[2],
			children = sym[4];

		for(const child of children)
			child.parent = this;


		this.tag = tag;
		this.attribs = attribs;
		this.children = children;
		this.url = "";
	}

	createElement() {
        return createElement(this.tag);
    }

    toString(){

    }

	mount(element, scope, statics){
		let out_statics = statics;

        if (this.url || this.__statics__)
            out_statics = Object.assign({}, statics, this.__statics__, { url: this.getURL(par_list.length - 1) });

        const own_element = this.createElement(scope);

        if (!scope)
            scope = new Scope(null, presets || this.__presets__ || this.presets, own_element, this);

        if (this.HAS_TAPS)
            taps = scope.linkTaps(this.tap_list);

        if (own_element) {

            if (!scope.ele) scope.ele = own_element;

            if (this._badge_name_)
                scope.badges[this._badge_name_] = own_element;

            if (element) appendChild(element, own_element);

            for (let i = 0, l = this.bindings.length; i < l; i++) {
                let attr = this.bindings[i];
                attr.binding._bind_(scope, errors, taps, own_element, attr.name, this, statics);
            }
        }

        const ele = own_element ? own_element : element

        par_list.push(this);

        for (let node = this.fch; node; node = this.getNextChild(node))
            node.build(ele, scope, presets, errors, taps, out_statics);

        par_list.pop();

        return scope;
	}
}