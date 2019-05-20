import Scope from "../../component/runtime/scope.mjs";
import Container from "../../component/runtime/container.mjs";
import ElementNode from "./element.mjs";
import {
    appendChild,
    createElement
} from "../../../short_names.mjs";

export default class ctr extends ElementNode{
	constructor(children, attribs){
		super("container", children, attribs);

		this.filters = null;
		this.property_bind = null;
		this.scope_children = null;
	}

	mount(element, scope, statics, presets){

        scope = scope || new Scope(null, presets, element, this);

        let
            pckg = this.package,
            HAS_STATIC_SCOPES = false

        const
            ele = createElement(this.getAttribute("element") || "ul"),
            me = new ScopeContainer(scope, presets, ele);

        appendChild(element, ele);

        this.class.split(" ").map(c => c ? ele.classList.add(c) : {});

        if (this.HAS_TAPS)
            taps = scope.linkTaps(this.tap_list);

        if (this._badge_name_)
            scope.badges[this._badge_name_] = ele;

        if (this.property_bind)
            me.prop = this.property_bind._bind_(scope, errors, taps, me);
        /*
        for (let node = this.fch; node; node = this.getNextChild(node)) {

            if (node.tag == "f") {
                
                let
                    on = node.getAttribute("on"),
                    sort = node.getAttribute("sort"),
                    filter = node.getAttribute("filter"),
                    limit = node.getAttribute("limit"),
                    offset = node.getAttribute("offset"),
                    scrub = node.getAttribute("scrub"),
                    shift = node.getAttribute("shift");

                if (limit && limit.binding.type == 1) {
                    me.limit = parseInt(limit.value);
                    limit = null;
                }

                if (shift && shift.binding.type == 1) {
                    me.shift_amount = parseInt(shift.value);
                    shift = null;
                }

                if (sort || filter || limit || offset || scrub || shift) //Only create Filter node if it has a sorting bind or a filter bind
                    me.filters.push(new FilterIO(scope, errors, taps, me, on, sort, filter, limit, offset, scrub, shift));

            } else if (node.tag == "slot" && !pckg && statics.slots) {
                if (statics.slots[node.name]) {
                    const ele = statics.slots[node.name];
                    ele.__presets__ = this.presets;
                    pckg = new BasePackage()
                    pckg.asts.push(ele);
                    pckg.READY = true;
                }
            } else {
                //pack node into source manager
                const mgr = new ScopeManager();
                mgr.scopes.push(node.build(null, scope, presets, errors, statics));
                mgr.READY = true;
                me.scopes.push(mgr);
                HAS_STATIC_SCOPES = true;
            }
        }*/

        if (this.property_bind && pckg) {
            me.package = pckg;

            if (!me.package.asts[0].url)
                me.package.asts[0].url = this.getURL();

        } else if (HAS_STATIC_SCOPES) {
            spark.queueUpdate(me);
        } else {
            if (this.property_bind)
                //If there is no package at all then abort build of this element. TODO, throw an appropriate warning.
                errors.push(new Error(`Missing scope for container bound to "${this.property_bind.bindings[0].tap_name}"`));
            else
                errors.push(new Error(`Missing property binding for this node.`));
        }

        return scope;
	}
}