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

        this.element = this.getAttrib("element").value;
    }

    createElement() {
        return createElement(this.element || "div");
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

    mount(element, scope, presets = this.presets, slots = {}, pinned = {}) {

        const runtime_scope = new Scope(scope, presets, element, this);

        if (this.slots)
            slots = Object.assign({}, slots, this.slots);

        //Reset pinned
        pinned = {};

        if (this.pinned)
            pinned[this.pinned] = runtime_scope.ele;

        runtime_scope._model_name_ = this.model_name;
        runtime_scope._schema_name_ = this.schema_name;

        if(this.HAS_TAPS){ 
            let tap_list = this.tap_list;

            for (let i = 0, l = tap_list.length; i < l; i++) {
                let tap = tap_list[i],
                    name = tap.name;

                let bool = name == "update";

                runtime_scope.taps[name] = bool ? new UpdateTap(runtime_scope, name, tap.modes) : new Tap(runtime_scope, name, tap.modes);

                if (bool)
                    runtime_scope.update_tap = runtime_scope.taps[name];

                //out_taps.push(runtime_scope.taps[name]);
            }
        }

        /**
         * To keep the layout of the output HTML predictable, Wick requires that a "real" HTMLElement be defined before a scope object is created. 
         * If this is not the case, then a new element, defined by the "element" attribute of the scope virtual tag (defaulted to a "div"), 
         * will be created to allow the scope object to bind to an actual HTMLElement. 
         */
        if (!element || this.getAttrib("element").value) {

            let ele = this.createElement();

            this.class.split(" ").map(c => c ? ele.classList.add(c) : {});

            if (this.getAttribute("id"))
                ele.id = this.getAttribute("id");

            if (this.getAttribute("style"))
                ele.style = this.getAttribute("style");

            runtime_scope.ele = ele;

            if (element) {
                appendChild(element, ele);
            }

            element = ele;

            if (this._badge_name_)
                runtime_scope.badges[this._badge_name_] = element;
        }

        for (let i = 0, l = this.attribs.length; i < l; i++){
            this.attribs[i].bind(element, runtime_scope, pinned);
        }

        for (let i = 0; i < this.children.length; i++) {
            const node = this.children[i];
            node.mount(element, runtime_scope, presets, slots, pinned);
        }

        return runtime_scope;
    }
}
