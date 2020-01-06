import { ctr, ctr_upd, ctr_fltr } from "./component/container.js";
import createComponent from "./component/component.js";



/* Given an argument list of element indices, returns the element at the last index location.  */
function ge(ele, ...indices) {
	if (indices.length == 0)
		return ele;
	else
		return ge(ele.children[indices[0]], ...(indices.slice(1)));
}

class liteScope {
	constructor(e) {
		this.wl = wick_lite;
		this.ele = e;
		this.scopes = [];
	}

	emit(name, obj) {
		this.update({
			[name]: obj
		});
	}

	update(data) {
		let flag = 0;

		for (let i = 0, l = this.ug.length; i < l; i++) {
			const name = this.ug[i];
			if (data[name] !== undefined) {
				this.uc[i] = data[name];
				flag |= 1 << (i);
			}
		}

		this.global_flag |= flag;

		if (flag > 0) {
			for (let i = 0; i < this.uf.length; i++) {
				const uf = this.uf[i].f;
				if ((uf & this.global_flag) == uf)
					this.uf[i].m();
			}
		}
	}
}

const wick_lite = {
	ge,
	ctr,
	ctr_upd,
	ctr_fltr,
	createComponent,
	sc: liteScope,
	component_map: new Map(),
	component_templates: new Map(),
	addComponentTemplate(name, obj) {
		this.component_templates.set(name, obj);
	},
	gt(id){
		return document.getElementById(id);
	},
	lc(name, template, component_class) {
		this.component_map.set(name, { class: component_class, template });
	},
	cc(name) {
		if (this.component_map.has(name)) {
			const comp_blueprint = this.component_map.get(name);

			const ele = document.importNode(comp_blueprint.template.content.firstChild, true);

			return new comp_blueprint.class(ele, this);
		}
		return null;
	}
};

createComponent.lite = wick_lite;

export default wick_lite;