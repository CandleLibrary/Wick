import { RootNode, par_list } from "./root";
import { appendChild, createElement } from "../../../short_names";
import { Source } from "../../source";
import { SourceContainer } from "../../container.mjs";
import { Template } from "../template/template_bindings";
import { barrier_a_start, barrier_b_start } from "../../../barriers";
import { FilterIO } from "../../io/filter_io";
import { FilterNode } from "./filter";
import { PackageNode } from "./package";
import { SlotNode } from "./slot";
import { BasePackage } from "../../base_package.mjs"
import { Skeleton } from "../../skeleton.mjs"

export class SourceContainerNode extends RootNode {

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

    build(element, source, presets, errors, taps, statics) {

        source = source || new Source(null, presets, element, this);

        if (this.HAS_TAPS)
            taps = source.linkTaps(this.tap_list);

        let pckg = this.package;

        if (!pckg) {

            // See if there is a slot node that can be used to pull data from the statics

            // Package cannot be cached in this case, since the container may be used in different 
            // components that assign different source tree's to the slot. 
            if (statics.slots) {
                let slot = null;

                let children = this.children;

                for (let i = 0, v = null; i < children.length; i++)
                    if (children[i].tag == "slot") {
                        if (statics.slots[children[i].name]) {
                            const
                                ele = statics.slots[children[i].name],
                                sk = new Skeleton(ele, this.presets);
                                
                            pckg = new BasePackage()
                            pckg.skeletons.push(sk);
                            pckg.READY = true;

                            //Exit loop on first successful match.
                            break;
                        }
                    }

            }
        }

        if (this.property_bind && pckg) {

            let ele = createElement(this.getAttribute("element") || "ul");

            this.class.split(" ").map(c => c ? ele.classList.add(c) : {});

            if (this._badge_name_)
                source.badges[this._badge_name_] = ele;

            let me = new SourceContainer(source, presets, ele);

            me.package = pckg;

            if (!me.package.skeletons[0].tree.url)
                me.package.skeletons[0].tree.url = this.getURL();

            me.prop = this.property_bind._bind_(source, errors, taps, me);

            appendChild(element, ele);

            for (let node = this.fch; node; node = this.getNextChild(node)) {

                let on = node.getAttrib("on");
                let sort = node.getAttrib("sort");
                let filter = node.getAttrib("filter");
                let limit = node.getAttrib("limit");
                let offset = node.getAttrib("offset");
                let scrub = node.getAttrib("scrub");
                let shift = node.getAttrib("shift");

                if (limit && limit.binding.type == 1) {
                    me.limit = parseInt(limit.value);
                    limit = null;
                }

                if (shift && shift.binding.type == 1) {
                    me.shift_amount = parseInt(shift.value);
                    shift = null;
                }

                if (sort || filter || limit || offset || scrub || shift) //Only create Filter node if it has a sorting bind or a filter bind
                    me.filters.push(new FilterIO(source, errors, taps, me, on, sort, filter, limit, offset, scrub, shift));
            }
        } else {
            if (this.property_bind)
                //If there is no package at all then abort build of this element. TODO, throw an appropriate warning.
                errors.push(new Error(`Missing source for container bound to "${this.property_bind.bindings[0].tap_name}"`));
            else
                errors.push(new Error(`Missing property binding for this node.`));
        }

        return source;
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
                return new PackageNode(start); //This node is used to build packages
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