import Scope from "../component/runtime/scope.mjs";
import ElementNode from "./element.mjs";
import {
    Tap,
    UpdateTap,
    KEEP,
    IMPORT,
    EXPORT,
    PUT
} from "../component/tap/tap.mjs";
import {
    appendChild,
    createElement
} from "../../short_names.mjs";

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

    createElement(scope) {
        if (!scope.ele || this.getAttribute("element")){
            const ele =  createElement(this.element || "div");

            if(scope.ele){
                appendChild(scope.ele, ele);
                scope.ele = ele;
            }

            return ele;
        } 

        return  scope.ele;
    }

    mount(own_element, outer_scope, presets = this.presets, slots = {}, pinned = {}) {

        const scope = new Scope(outer_scope, presets, own_element, this);

        if (this.HAS_TAPS) {
            const tap_list = this.tap_list;

            for (let i = 0, l = tap_list.length; i < l; i++) {
                const tap = tap_list[i],
                    name = tap.name,
                    bool = name == "update";

                scope.taps[name] = bool ? new UpdateTap(scope, name, tap.modes) : new Tap(scope, name, tap.modes);

                if (bool)
                    scope.update_tap = scope.taps[name];
            }
        }

        scope._model_name_ = this.model_name;
        scope._schema_name_ = this.schema_name;

        //Reset pinned
        pinned = {};

        return super.mount(null, scope, presets, slots, pinned);
    }
}
