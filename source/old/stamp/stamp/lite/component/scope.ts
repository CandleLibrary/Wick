import {
	KEEP,
	IMPORT,
	EXPORT,
	PUT
} from "../../../compiler/component/tap/tap.js.js";

import spark from "@candlefw/spark";

/* Given an argument list of element indices, returns the element at the last index location.  */
function getElement(ele, indices) {
	if (indices.length == 1)
		return ele;
	else
		return getElement(ele.children[indices[1]], indices.slice(1));
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

export default class liteScopeConstructor {

	constructor(e, wl, ...ele_ids) {
		this.m = e;
		this.wl = wl;
		this.el = ele_ids.map(id => getElement(e, id));
		this.n = [];
		this.v = [];
		this.f = [];
		this.g = [];
		this.scopes = [];
		this.gates = [];
		this.pen = new Set;
		this.gf = 0; // Global Flag
		this.parent = null;
		this.model = null;
		this.model_name = "";
		this.scheme_name = "";
		this.PENDING_LOADS = 0;
		this.DESTROYED = false;
	}

	destroy() {
		if (this.DESTROYED) return;

		for (const scope of this.scopes)
			scope.destroy();

		this.scopes = null;
		this.nm = null;
		this.gates = null;
		this.vals = null;
		this.pen = null;
		this.DESTROYED = true;
		this.LOADED = false;

		if (this.model && this.model.removeObserver)
			this.model.removeObserver(this);
	}




	/**
        Makes the scope a observer of the given Model. 
        If no model passed, then the scope will bind to another model depending on its `scheme` or 
        `model` attributes and availabity of such an item within the presets object. 
    */
	load(model) {

		//Called before model is loaded
		this.update({ loading: true }); //Lifecycle Events: Loading <====================================================================== 

		let
			m = null,
			SchemedConstructor = null;

		const
			presets = this.wl.presets,
			model_name = this.model_name,
			scheme_name = this.scheme_name;

		if (model_name && presets.models)
			m = presets.models[model_name];
		if (scheme_name && presets.schemas) {
			SchemedConstructor = presets.schemas[scheme_name];
		}

		if (m)
			model = m;
		else if (SchemedConstructor)
			model = new SchemedConstructor();

		for (const scope of this.scopes)
			scope.load(model);

		if (model) {

			if (model.addObserver)
				model.addObserver(this);

			this.model = model;

			//Called before model properties are disseminated
			this.e({ model_loaded: true }); //Lifecycle Events: Model Loaded <====================================================================== 
			this.update(this.model);
		}

		//Allow one tick to happen before acknowledging load
		setTimeout(this.loadAcknowledged.bind(this), 1);
	}

	loadAcknowledged() {

		//This is called when all elements of responded with a loaded signal.
		if (!this.LOADED && --this.PENDING_LOADS <= 0) {

			this.LOADED = true;

			this.update({ loaded: true }); //Lifecycle Events: Loaded <======================================================================

			if (this.parent && this.parent.loadAcknowledged)
				this.parent.loadAcknowledged();
		}
	}

	addScope(scope) {
		if (scope.parent == this)
			return;
		scope.parent = this;

		this.scopes.push(scope);

		this.PENDING_LOADS++;

		const payload = {};

		for (let i = 0; i < this.v.length; i++) {
			if (this.v[i])
				payload[this.n[i]] = this.v[i];
		}

		scope.down(payload);
	}

	addToParent(parent) {
		if (parent)
			parent.addScope(this);
	}

	get element() {
		return this.m;
	}

	set element(e) {}


	/*************** DATA HANDLING CODE **************************************/
	e(data) {
		//Check gates and see if the item needs to go up. 
		const l = this.g.length,
			exp = {},
			include = {};

		let EXPORT_DATA = false;

		for (let i = 0; i < l; i++) {

			const
				name = this.n[i],
				d = data[name],
				gate = this.g[i];

			if (d !== undefined) {


				if (gate & EXPORT) EXPORT_DATA = true, exp[name] = d;
				else
					include[name] = d;

				if (gate & PUT)
					this.model[name] = d;
			}
		}

		if (EXPORT_DATA && this.parent) this.parent.e(exp);

		this.update(include);
	}

	down(data) {
		if (this.NO_IMPORT) return;

		const l = this.g.length,
			imp = {};

		let IMPORT_DATA = false;

		for (let i = 0; i < l; i++) {

			const
				name = this.n[i],
				d = data[name],
				gate = this.g[i];

			if (d !== undefined) {

				if (gate & IMPORT) IMPORT_DATA = true, imp[name] = d;

				if (gate & PUT)
					this.model[name] = d;
			}

		}

		if (IMPORT_DATA) this.update(imp);
	}

	update(data, meta) {
		if (this.DESTROYED) return;

		if (meta)
			this.update(meta);

		const o = this,
			v = o.v,
			n = o.n,
			p = o.pen,
			flag = getNameFlags(data, n, v);

		let gf = (o.gf |= flag);

		/******************
		// *.r = required
		// *.a = activate
		******************/

		for (const fn of o.f) {
			const r = fn.r,
				a = fn.a;
			if (fn.S) {
				if ((a & flag) > 0 || p.has(fn)) {
					const prop = n[fn.o];

					if (typeof data[prop] == "object")
						gf |= getNameFlags(data[prop], n, v);

					if ((r & gf) == r) {
						if (meta && meta.IMMEDIATE) {
							o.callFN(fn);
						} else {
							fn.P = 1;
							spark.queueUpdate(this);
						}
					} else
						p.add(fn);
				}
			} else if ((r & flag) > 0 && (gf & r) == r){
				fn.f.call(o, o);
			}
		}

		o.gf |= gf;

		for (const scope of this.scopes)
			scope.down(data);
	}

	/** called by spark when the scope has a set of actions to perform. Cycles through actions and calls ones that scheduled to be called. */
	scheduledUpdate() {
		for (const fn of this.f) 
			if (fn.P == 1) this.callFN(fn);
	}

	callFN(fn) {
		const o = this,
			p = o.pen;
		fn.f.call(o);
		fn.P = 0;
		if (p.has(fn)) p.delete(fn);
	}

	/*************** DOM CODE ****************************/

	removeFromDOM() {
		//Prevent erroneous removal of scope.
		if (this.CONNECTED == true) return;

		//Lifecycle Events: Disconnecting <======================================================================
		this.update({ disconnecting: true });

		if (this.element && this.element.parentElement)
			this.element.parentElement.removeChild(this.element);

		//Lifecycle Events: Disconnected <======================================================================
		this.update({ disconnected: true });
	}

	appendToDOM(element, before_element) {
		//Lifecycle Events: Connecting <======================================================================
		this.update({ connecting: true });

		this.CONNECTED = true;

		if (before_element)
			element.insertBefore(this.element, before_element);
		else
			element.appendChild(this.element);

		//Lifecycle Events: Connected <======================================================================
		this.update({ connected: true });
	}

	/*************** TRANSITION CODE ****************************/

	transitionIn(transition, transition_name = "trs_in") {
		if (transition)
			this.update({
				[transition_name]: transition
			},{ IMMEDIATE: true });

		this.TRANSITIONED_IN = true;
	}

	transitionOut(transition, DESTROY_AFTER_TRANSITION = false, transition_name = "trs_out") {

		this.CONNECTED = false;

		if (this.TRANSITIONED_IN === false) {
			this.removeFromDOM();
			if (DESTROY_AFTER_TRANSITION) this.destroy();
			return;
		}

		let transition_time = 0;

		if (transition) {
			this.update({
				[transition_name]: transition
			}, { IMMEDIATE: true });

			if (transition.trs)
				transition_time = transition.trs.out_duration;
			else
				transition_time = transition.out_duration;
		}

		this.TRANSITIONED_IN = false;

		transition_time = Math.max(transition_time, 0);

		setTimeout(() => {
			this.removeFromDOM();
			if (DESTROY_AFTER_TRANSITION) this.destroy();
		}, transition_time + 2);

		return transition_time;
	}
}
