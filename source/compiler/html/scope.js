import Scope from "../component/runtime/scope.js";
import ElementNode from "./element.js";
import {
    Tap,
    UpdateTap,
    KEEP,
    IMPORT,
    EXPORT,
    PUT
} from "../component/tap/tap.js";
import {
    appendChild,
    createElement
} from "../../short_names.js";

export default class scp extends ElementNode {

    constructor(env, tag, children, attribs, presets) {

        super(env, "scope", children, attribs, presets);

        this.HAS_TAPS = false;
        this.tap_list = [];

        (this.getAttrib("put").value || "").split(" ").forEach(e => this.checkTapMethod("put", e));
        (this.getAttrib("export").value || "").split(" ").forEach(e => this.checkTapMethod("export", e));
        (this.getAttrib("import").value || "").split(" ").forEach(e => this.checkTapMethod("import", e));

        this.model_name = this.getAttrib("model").value;
        this.schema_name = this.getAttrib("scheme").value;

        if (this.schema_name)
            this.getAttrib("scheme").RENDER = false;

        if (this.model_name)
            this.getAttrib("model").RENDER = false;

        if (this.getAttrib("put"))
            this.getAttrib("put").RENDER = false;

        if (this.getAttrib("import"))
            this.getAttrib("import").RENDER = false;

        if (this.getAttrib("export"))
            this.getAttrib("export").RENDER = false;

        this.tag = this.getAttrib("element").value || "div";
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
            this.getTap(name).modes |= tap_mode;
            return true;
        }
    }

    createRuntimeTaplist(scope) {

        const tap_list = this.tap_list,
            taps = scope.taps;

        for (let i = 0, l = tap_list.length; i < l; i++) {
            const tap = tap_list[i],
                name = tap.name,
                bool = name == "update";

            if (scope.taps.has(name)) continue;

            scope.taps.set(name,
                bool ?
                (scope.update_tap = scope.taps[name],
                    new UpdateTap(scope, name, tap.modes)) :
                new Tap(scope, name, tap.modes)
            );

            if (bool)
            ;
        }
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
        pinned = {};

        return super.mount(HAVE_OUTER_SCOPE ? par_element : null, scope, presets, slots, pinned);
    }

    toString() {
        const tag = this.tag;
        this.tag = "scope";
        const val = super.toString();
        this.tag = tag;
        return val;
    }
}
