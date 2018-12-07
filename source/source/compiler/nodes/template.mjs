import { RootNode } from "./root";
import { _appendChild_, createElement } from "../../../short_names";
import { Source } from "../../source";
import { SourceTemplate } from "../../template";
import { Template } from "../template/template_bindings";
import { barrier_a_start, barrier_b_start } from "../../../barriers";
import { FilterIO } from "../../io/filter_io";
import { FilterNode } from "./filter";
import { PackageNode } from "./package";

export class SourceTemplateNode extends RootNode {
    constructor(lex) {
        super();
        this.BUILD_LIST = [];
        this.filters = [];
        this._property_bind_ = null;
        this._package_ = null;
    }

    build(element, source, presets, errors, taps) {

        source = source || new Source(null, presets, element, this);

        if (this.HAS_TAPS)
            taps = source.linkTaps(this.tap_list);
        if (this._property_bind_ && this._package_) {

            let ele = createElement(this.getAttribute("element") || "ul");
            
            this.class.split(" ").map(c=> c ? ele.classList.add(c):{});

            if(this._badge_name_)
                source.badges[this._badge_name_] = ele;
            

            let me = new SourceTemplate(source, presets, ele);
            me._package_ = this._package_;
            me.prop = this._property_bind_._bind_(source, errors, taps, me);

            _appendChild_(element, ele);

            for (let node = this.fch; node; node = this.getNextChild(node)) {
                //All filter nodes here
                
                let on = node.getAttrib("on");
                let sort = node.getAttrib("sort");
                let filter = node.getAttrib("filter");
                let limit = node.getAttrib("limit");
                let offset = node.getAttrib("offset");
                let scrub = node.getAttrib("scrub");
                let shift = node.getAttrib("shift");

                if(limit && limit.binding.type == 1){
                    me.limit = parseInt(limit.value);
                    limit = null;
                }

                if(shift && shift.binding.type == 1){
                    me.shift = parseInt(shift.value);
                    shift = null;
                }

                if (sort || filter || limit || offset || scrub || shift) //Only create Filter node if it has a sorting bind or a filter bind
                    me._filters_.push(new FilterIO(source, errors, taps, me, on, sort, filter, limit, offset, scrub, shift));
            }
        }else{
            errors.push(new Error(`Missing source for template bound to "${this._property_bind_._bindings_[0].tap_name}"`));
        }

        return source;
    }

    /******************************************* HOOKS ****************************************************/

    endOfElementHook() {}

    _ignoreTillHook_() {}

    
createHTMLNodeHook(tag, start) {
        
        switch (tag) {
            case "f":
                return new FilterNode(); //This node is used to 
            default:
                return new PackageNode(start); //This node is used to build packages
        }
    }

    processTextNodeHook(lex) {
        if (!this._property_bind_) {
            let cp = lex.copy();
            lex.IWS = true;
            cp.tl = 0;
            if (cp.n.ch == barrier_a_start && (cp.n.ch == barrier_a_start || cp.ch == barrier_b_start)) {
                let binding = Template(lex);
                if (binding)
                    this._property_bind_ = this.processTapBinding(binding);
            }
        }
    }
}