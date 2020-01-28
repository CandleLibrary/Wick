import { ctr, ctr_upd, ctr_fltr } from "./component/container.js";

/* Given an argument list of element indices, returns the element at the last index location.  */
function getElement(ele, indices) {
	if (indices.length == 1)
		return ele;
	else
		return getElement(ele.children[indices[0]], indices.slice(1));
}

function getNameFlags(data, names, vals, IMPORTED) {
	let i = 0,
		flag = 0;
	for (const n of names) {
		if (data[n] !== undefined) {
			vals[i] = data[n];
			flag |= 1 << i;
		}
		i++;
	}
	return flag;
}

class liteScope {

	constructor(e, ...ele_ids) {
		this.m = e;
		this.wl = wicklite;
		this.el = ele_ids.map(id=>getElement(e,id));
		this.n = [];
		this.v = [];
		this.f = [];
		this.scopes = [];
		this.gates = [];
		this.pen = new Set;
		this.gf = 0; // Global Flag
		this.parent = null;
	}

	destroy(){
		for(const scope of this.scopes)
			scope.destroy();
		this.scopes = null;
		this.nm = null;
		this.gates = null;
		this.vals = null;
		this.pen = null;
	}

	get element (){
		return this.m;
	}

	set element(e){}

	e(obj) { this.down(obj) }

	up() {}

	down(data, IMPORTED = false) {
		const o = this,
			v = o.v,
			n = o.n,
			p = o.pen,
			flag = getNameFlags(data, n, v, IMPORTED);

		let gf = o.gf |= flag;
		
		/******************
		// *.r = required
		// *.a = activate
		******************/

		for (const fn of o.f) {
			const r = fn.r, a = fn.a;
			if (fn.S) {
				if ((a & flag) > 0 || p.has(fn)) {
					const prop = n[fn.o];
					
					if (typeof data[prop] == "object")
						gf |= getNameFlags(data[prop], n, v, IMPORTED);
					if ((r & gf) == r) {
						fn.f.call(o);
						if (p.has(fn))
							p.delete(fn);
					}else
						p.add(fn);
				}
			} else if ((r & flag) > 0 && (gf & r) == r)
				fn.f.call(o, o);
		}

		o.gf = gf;
	}

	update(data) {
		this.down(data, false);
	}
}

const wicklite = {
	ctr,
	ctr_upd,
	ctr_fltr,
	sc: liteScope,
	component_map: new Map(),

	//Get Template
	gt(id) {
		return document.getElementById(id);
	},
	//Load Component
	lc(name, template, component_class) {
		this.component_map.set(name, { class: component_class, template });
	},
	//Create Runtime Component
	cc(name) {
		if (this.component_map.has(name)) {
			const comp_blueprint = this.component_map.get(name);

			const ele = document.importNode(comp_blueprint.template.content.firstElementChild, true);

			return new comp_blueprint.class(ele, this);
		}
		return null;
	}
};

export default wicklite;