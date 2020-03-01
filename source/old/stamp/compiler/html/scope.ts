import Scope from "../component/runtime/scope.js.js.js.js";
import ElementNode from "./element.js.js.js.js";
import {
    KEEP,
    IMPORT,
    EXPORT,
    PUT
} from "../component/tap/tap.js.js.js.js";
import {
    appendChild,
    createElement
} from "../../../../typescript/types/short_names.js";

export default class scp extends ElementNode {

    constructor(env, presets, tag, children, attribs) {

        super(env, presets, "scope", children, attribs);

        this.HAS_TAPS = false;
        this.tap_list = [];

        this.loadAttribs(this);
    }

    loadAttribs(n) {
        (n.getAttribObject("put").value || "").split(" ").forEach(e => this.checkTapMethod("put", e));
        (n.getAttribObject("export").value || "").split(" ").forEach(e => this.checkTapMethod("export", e));
        (n.getAttribObject("import").value || "").split(" ").forEach(e => this.checkTapMethod("import", e));

        this.model_name = this.model_name || n.getAttribObject("model").value;
        this.schema_name = this.schema_name || n.getAttribObject("scheme").value;

        if (this.schema_name)
            this.getAttribObject("scheme").RENDER = false;

        if (this.model_name)
            this.getAttribObject("model").RENDER = false;

        if (this.getAttribObject("put"))
            this.getAttribObject("put").RENDER = false;

        if (this.getAttribObject("import"))
            this.getAttribObject("import").RENDER = false;

        if (this.getAttribObject("export"))
            this.getAttribObject("export").RENDER = false;

        if (this.getAttribObject("component"))
            this.getAttribObject("component").RENDER = false;

        if (this.getAttribObject("element"))
            this.getAttribObject("element").RENDER = false;
        
        this.tag = n.getAttribObject("element").value || "div";
    }

    merge(node, merged_node) {
        const merged = super.merge(node, merged_node);

        if (!(node instanceof scp))
            merged.loadAttribs(node);

        return merged;
    }

    getTap(tap_name) {

        this.HAS_TAPS = true;

        const l = this.tap_list.length;

        for (let i = 0; i < l; i++)
            if (this.tap_list[i].name == tap_name)
                return this.tap_list[i];

        const tap = {
            name: tap_name,
            id: l,
            modes: 0
        };

        this.tap_list.push(tap);

        return tap;
    }

    checkTapMethod(type, name) {

        if (!name) return;

        const extern = name.split(":")[0],
            intern = name.split(":")[1] || extern;

        let tap_mode = KEEP;

        let SET_TAP_METHOD = false;

        switch (type) {
            case "import": // Imports data updates, messages - valid on scope and top level objects.
                SET_TAP_METHOD = true;
                tap_mode |= IMPORT;
                break;
            case "export": // Exports data updates, messages - valid on scopes and top level objects.
                SET_TAP_METHOD = true;
                tap_mode |= EXPORT;
                break;
            case "put": // Pushes updates to model
                SET_TAP_METHOD = true;
                tap_mode |= PUT;
        }


        if (SET_TAP_METHOD) {
            
            if (extern !== intern)
                this.checkTapMethod("", intern);

            const tap = this.getTap(extern);

            tap.modes |= tap_mode;

            tap.redirect = (extern !== intern) ? intern : "";

            return true;
        }
    }

    createRuntimeTaplist(scope) {

        const tap_list = this.tap_list;

        for (const tap of tap_list) 
            scope.getTap(tap.name, tap.redirect).modes = tap.modes;
    }

    createElement(scope) {
        if (!scope.ele || this.getAttribute("element")) {
            const ele = createElement(this.tag || "div");

            if (scope.ele) {
                appendChild(scope.ele, ele);
                scope.ele = ele;
            }

            return ele;
        }

        return scope.ele;
    }

    mount(par_element, outer_scope, presets = this.presets, slots = {}, pinned = {}) {

        const HAVE_OUTER_SCOPE = !!outer_scope,
            scope = new Scope(
                outer_scope,
                presets,

                // If there is no higher level scope, 
                // then bind to the element that the component is attaching to. 
                !HAVE_OUTER_SCOPE ? par_element : null,
                this
            );

        if (this.HAS_TAPS)
            this.createRuntimeTaplist(scope);

        //Reset pinned
        const s = super.mount(HAVE_OUTER_SCOPE ? par_element : null, scope, presets, slots, {});

        if (this.pinned)
            pinned[this.pinned] = s.ele;

        return s;
    }

    toString(...v) {
        const tag = this.tag;
        this.tag = "scope";
        const val = super.toString(...v);
        this.tag = tag;
        return val;
    }
}