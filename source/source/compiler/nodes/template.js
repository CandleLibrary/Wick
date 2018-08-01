import { RootNode } from "./root";
import { _appendChild_, _createElement_ } from "../../../common/short_names";
import { Source } from "../../source";
import { SourceTemplate } from "../../template";
import { Template } from "../template/template_bindings";
import { barrier_a_start, barrier_b_start } from "../../../root/config/global";
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

    _build_(element, source, presets, errors, model, taps) {

        source = source || new Source(null, presets, element, this);

        if (this.HAS_TAPS)
            taps = source._linkTaps_(this.tap_list);

        if (this._property_bind_ && this._package_) {

            let ele = _createElement_("ul");
            let me = new SourceTemplate(source, presets, ele);
            me._package_ = this._package_;
            me.prop = this._property_bind_._bind_(source, errors, taps, me);

            _appendChild_(element, ele);

            for (let node = this.fch; node; node = this.getN(node)) {
                //All filter nodes here
                let on = node.getAttrib("on");
                let sort = node.getAttrib("sort");
                let filter = node.getAttrib("filter");

                if (sort || filter) //Only create Filter node is it has a sorting bind or a filter bind
                    me._filters_.push(new FilterIO(source, errors, taps, me, on, sort, filter));
            }
        }

        return source;
    }

    /******************************************* HOOKS ****************************************************/

    _endOfElementHook_() {}

    _ignoreTillHook_() {}

    _createHTMLNodeHook_(tag, start) {
        switch (tag) {
            case "f":
                return new FilterNode(); //This node is used to 
            default:
                return new PackageNode(start); //This node is used to build packages
        }
    }

    _processTextNodeHook_(lex) {
        if (!this._property_bind_) {
            let cp = lex.copy();
            lex.IWS = true;
            cp.tl = 0;
            if (cp.n().ch == barrier_a_start && (cp.n().ch == barrier_a_start || cp.ch == barrier_b_start)) {
                let binding = Template(lex);
                if (binding)
                    this._property_bind_ = this._processTapBinding_(binding);
            }
        }
    }
}