import spark from "@candlefw/spark";

import { appendChild, createElement } from "../../../short_names.mjs";
import { barrier_a_start, barrier_b_start } from "../../../barriers.mjs";
import { FilterIO } from "../../io/filter_io.mjs";
import { Template } from "../template/template_bindings.mjs";

//Nodes
import { RootNode, par_list } from "./root";
import { FilterNode } from "./filter.mjs";
import { PackageNode } from "./package.mjs";
import { SlotNode } from "./slot.mjs";

//Runtime 
import { Scope } from "../../runtime/scope.mjs";
import { ScopeContainer } from "../../runtime/container.mjs";
import { BasePackage } from "../../runtime/base_package.mjs"
import { ScopeManager } from "../../runtime/manager.mjs"

export class ScopeContainerNode extends RootNode {

    constructor(lex) {
        super(lex);
        this.BUILD_LIST = [];
        this.filters = [];
        this.property_bind = null;
        this.property_bind_text = "";
        this.package = null;
        this.MERGED = false;
    }

    merge(node) {
        const merged_node = super.merge(node);
        merged_nodes.BUILD_LIST = this.BUILD_LIST;
        merged_nodes.filters = this.filters;
        merged_nodes.property_bind = this.property_bind;
        merged_nodes.property_bind_text = this.property_bind_text;
        merged_nodes.package = this.package;
        merged_nodes.MERGED = true;
        return merged_node;
    }

    build(element, scope, presets, errors, taps, statics) {

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

        for (let node = this.fch; node; node = this.getNextChild(node)) {

            if (node.tag == "f") {
                
                let
                    on = node.getAttrib("on"),
                    sort = node.getAttrib("sort"),
                    filter = node.getAttrib("filter"),
                    limit = node.getAttrib("limit"),
                    offset = node.getAttrib("offset"),
                    scrub = node.getAttrib("scrub"),
                    shift = node.getAttrib("shift");

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
        }

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

    /******************************************* HOOKS ****************************************************/

    endOfElementHook() { return this }

    _ignoreTillHook_() {}


    createHTMLNodeHook(tag, start) {

        switch (tag) {
            case "slot":
                return new SlotNode();
            case "f":
                return new FilterNode(); //This node is used to 
            default:
                if (this.property_bind)
                    return new PackageNode(start); //This node is used to build packages
                return super.createHTMLNodeHook(tag, start);
        }

    }

    processTextNodeHook(lex) {
        if (!this.property_bind) {
            this.property_bind_text = lex.slice().trim();

            let cp = lex.copy().trim();
            cp.IWS = true;
            cp.tl = 0;
            cp.next();


            if (cp.ch == barrier_a_start && (cp.pk.ch == barrier_a_start || cp.pk.ch == barrier_b_start)) {
                let binding = Template(cp);
                if (binding) {
                    this.property_bind = this.processTapBinding(binding);
                }
            }
        }

        return null;
    }

    innerToString(off) {
        //Insert temp child node for the property_bind
        let str = this.property_bind_text;

        str += super.innerToString(off);

        return str;
    }
}
