import { rt, WickRuntime } from "./runtime_global.js";
import { WickContainer } from "./runtime_container.js";

import Presets from "../presets";
import { makeElement, integrateElement } from "./runtime_html.js";
import { DATA_FLOW_FLAG } from "../types/types.js";
import spark, { Sparky } from "@candlefw/spark";
import { ObservableModel, ObservableWatcher } from "../types/observable_model.js";

type BindingUpdateFunction = () => void;

const enum DATA_DIRECTION {
    DOWN = 1,
    UP = 2
}

const empty_array = [];


export class WickRTComponent implements Sparky, ObservableWatcher {

    ele: HTMLElement;

    elu: HTMLElement[];

    CONNECTED: boolean;

    presets: Presets;

    nlu: object;

    lookup_function_table: BindingUpdateFunction[];

    //Children
    ch: WickRTComponent[];

    //Parent Component
    par: WickRTComponent;

    ct: WickContainer[];
    /**
     * Identifier of interval watcher for non-dynamic models.
     */
    polling_id?: number;

    model: any;

    /**
     * Methods that will be called during the update period
     * of the component. 
     */
    call_set: Map<number, Array<any>>;

    binding_call_set: Array<any>;

    name: string;

    protected wrapper?: WickRTComponent;

    TRANSITIONED_IN: boolean;
    DESTROY_ON_TRANSITION: boolean;

    out_trs: any;

    pui: any[];
    nui: any[];

    ie: typeof integrateElement;
    me: typeof makeElement;

    _SCHD_: number;

    constructor(
        model = null,
        existing_element = null,
        wrapper = null,
        parent: WickRTComponent = null,
        default_model_name = "",
        presets = rt.presets,
    ) {

        this.name = this.constructor.name;



        this.nlu = {};
        this.ch = [];
        this.lookup_function_table = [];
        this.elu = [];
        this.ct = [];
        this.pui = [];
        this.nui = [];
        this.model = null;
        this.call_set = new Map();
        this.binding_call_set = [];

        this.me = makeElement;
        this.ie = integrateElement;

        //@ts-ignore
        this.up = this.updateParent;
        //@ts-ignore
        this.uc = this.updateChildren;
        //@ts-ignore
        this.spm = this.syncParentMethod;
        //@ts-ignore
        this.pup = this.updateFromChild;
        //@ts-ignore
        this.ufp = this.updateFromParent;

        this._SCHD_ = 0;
        this.polling_id = -1;
        this.presets = presets;

        if (parent) parent.addChild(this);

        if (existing_element)
            this.ele = <HTMLElement>this.ie(existing_element);
        else
            this.ele = this.ce();

        if (this.ele)
            //@ts-ignore
            this.ele.wick_component = this;

        //Create or assign global model whose name matches the default_model_name;
        if (default_model_name) {
            if (!presets.models[default_model_name])
                presets.models[default_model_name] = {};
            model = presets.models[default_model_name];
        }

        // Hydration --------------------------------
        this.CONNECTED = true;
        this.model = model; // Soft set of model, to handle access defined in source files.
        this.re(this);
        this.setModel(model); //Hard set of model, with proper updating and polling.
        this.CONNECTED = false;
        // End Hydration ----------------------------

        if (wrapper) {
            this.wrapper = wrapper;
            this.ele.appendChild(this.wrapper.ele);
            this.wrapper.setModel({ comp: this });
        } else if (presets.wrapper && this.name !== presets.wrapper.name /*Prevent recursion, which will be infinite */) {
            this.wrapper = new (presets.component_class.get(presets.wrapper.name))({ comp: this });
            this.ele.appendChild(this.wrapper.ele);
        }

        try {
            this.c();
        } catch (e) {
            console.error(e);
        }

        this.onLoad();

        rt.OVERRIDABLE_onComponentCreate(this);
    }

    destructor() {

        if (this.polling_id > -1)
            clearInterval(this.polling_id);

        if (this.model) {
            if (this.model.unsubscribe)
                this.model.unsubscribe(this);
            this.model = null;
        }

        if (this.wrapper)
            this.wrapper.destructor();

        if (this.par)
            this.par.removeChild(this);

        this.removeCSS();
    }

    removeChild(cp: WickRTComponent) {
        if (cp.par == this) {
            this.ch = this.ch.filter(c => c !== cp);
            cp.par = null;
        }
    }


    addChild(cp: WickRTComponent) {
        for (const ch of this.ch)
            if (ch == cp) continue;

        cp.par = this;

        this.ch.push(cp);
    }

    connect() {
        this.CONNECTED = true;
        for (const child of this.ch)
            child.connect();
    }

    disconnect() {
        for (const child of this.ch)
            child.disconnect();
        this.CONNECTED = false;
    }

    /** 
     * ██████   ██████  ███    ███         ██     ██   ██ ████████ ███    ███ ██      
     * ██   ██ ██    ██ ████  ████        ██      ██   ██    ██    ████  ████ ██      
     * ██   ██ ██    ██ ██ ████ ██       ██       ███████    ██    ██ ████ ██ ██      
     * ██   ██ ██    ██ ██  ██  ██      ██        ██   ██    ██    ██  ██  ██ ██      
     * ██████   ██████  ██      ██     ██         ██   ██    ██    ██      ██ ███████                                                                                                                                                          
     */


    ce(): HTMLElement {

        if (document && document.getElementById) {

            const template: HTMLTemplateElement = <HTMLTemplateElement>document.getElementById(this.name);

            if (template) {
                const
                    doc = template.content.cloneNode(true),
                    ele = <HTMLElement>doc.firstChild;

                return <HTMLElement>this.ie(ele);
            } else {
                console.warn("NO template element for component: " + this.name);
            }
        }
    }

    removeCSS() {

        const cache = this.presets.css_cache[this.name];

        if (cache) {
            cache.count--;
            if (cache.count <= 0) {
                cache.css_ele.parentElement.removeChild(cache.css_ele);
                this.presets.css_cache[this.name] = null;
            }
        }
    }

    setCSS(style_string = this.getCSS()) {

        if (style_string) {

            if (!this.presets.css_cache[this.name]) {

                const { window: { document }, css_cache } = this.presets,
                    css_ele = document.createElement("style");

                css_ele.innerHTML = style_string;

                document.head.appendChild(css_ele);

                css_cache[this.name] = { css_ele, count: 1 };
            } else
                this.presets.css_cache[this.name].count++;



            this.ele.classList.add(this.name);
        }
    }

    appendToDOM(element: HTMLElement, before_element: HTMLElement = null) {

        //Lifecycle Events: Connecting <======================================================================
        this.connect();

        this.update({ connecting: true });

        if (before_element)
            element.insertBefore(this.ele, before_element);
        else
            element.appendChild(this.ele);

        //Lifecycle Events: Connected <======================================================================
        this.update({ connected: true });
    }

    removeFromDOM() {
        //Prevent erroneous removal of scope.
        if (this.CONNECTED == false) return;

        //Lifecycle Events: Disconnecting <======================================================================
        this.update({ disconnecting: true });

        if (this.ele && this.ele.parentElement)
            this.ele.parentElement.removeChild(this.ele);

        //Lifecycle Events: Disconnected <======================================================================
        this.update({ disconnected: true });

        this.disconnect();

    }

    /***
     * ████████ ██████   █████  ███    ██ ███████ ██ ████████ ██  ██████  ███    ██ ███████ 
     *    ██    ██   ██ ██   ██ ████   ██ ██      ██    ██    ██ ██    ██ ████   ██ ██      
     *    ██    ██████  ███████ ██ ██  ██ ███████ ██    ██    ██ ██    ██ ██ ██  ██ ███████ 
     *    ██    ██   ██ ██   ██ ██  ██ ██      ██ ██    ██    ██ ██    ██ ██  ██ ██      ██ 
     *    ██    ██   ██ ██   ██ ██   ████ ███████ ██    ██    ██  ██████  ██   ████ ███████
     */

    /**
     * Call when the component is about to be removed from the DOM. 
     * 
     * Called by RuntimeContainer
     * @param transition 
     * @param DESTROY_AFTER_TRANSITION 
     * @param transition_name 
     */

    transitionOut(transition?, DESTROY_AFTER_TRANSITION = false, transition_name = "trs_out") {

        this.DESTROY_ON_TRANSITION = DESTROY_AFTER_TRANSITION;

        this.TRANSITIONED_IN = false;

        let transition_time = 0;

        if (this.out_trs)
            this.out_trs.trs.removeEventListener("stopped", this.out_trs.fn);

        if (transition) {
            this.update({
                [transition_name]: transition
            }/*, null, false, { IMMEDIATE: true }*/);

            const trs = transition.trs || transition;

            this.out_trs = { trs, fn: this.outTransitionStop.bind(this) };

            transition_time = trs.out_duration;

            trs.addEventListener("stopped", this.out_trs.fn);

        } else {
            if (!this.out_trs)
                this.outTransitionStop();
        }

        transition_time = Math.max(transition_time, 0);

        return transition_time;
    }

    outTransitionStop() {

        if (!this.TRANSITIONED_IN) {
            this.removeFromDOM();
            if (this.DESTROY_ON_TRANSITION) this.destructor();
            this.DESTROY_ON_TRANSITION = false;
        }

        this.out_trs = null;

        return false;
    }

    transitionIn(transition, transition_name = "trs_in") {
        if (transition)
            this.update({
                [transition_name]: transition
            }/*, null, false, { IMMEDIATE: true }*/);

        this.TRANSITIONED_IN = true;
    }

    /***
     * ███    ███  ██████  ██████  ███████ ██      
     * ████  ████ ██    ██ ██   ██ ██      ██      
     * ██ ████ ██ ██    ██ ██   ██ █████   ██      
     * ██  ██  ██ ██    ██ ██   ██ ██      ██      
     * ██      ██  ██████  ██████  ███████ ███████ 
     */


    setModel(model: ObservableModel | any) {

        if (this.model) {
            if (this.polling_id > 0) {
                clearInterval(this.polling_id);
                this.polling_id = 0;
            }

            if (this.model.unsubscribe)
                this.model.unsubscribe(this);

            this.model = null;
        }

        if (model) {

            this.model = model;

            if (model.subscribe) {
                model.subscribe(this);
            } else {

                //Create a polling monitor
                if (this.polling_id <= 0)
                    this.polling_id = <number><unknown>setInterval(this.onModelUpdate.bind(this), 1000 / 30);

            }

            this.onModelUpdate.call(this);
        }
    }
    /**
     * ██    ██ ██████  ██████   █████  ████████ ███████ 
     * ██    ██ ██   ██ ██   ██ ██   ██    ██    ██      
     * ██    ██ ██████  ██   ██ ███████    ██    █████   
     * ██    ██ ██      ██   ██ ██   ██    ██    ██      
     *  ██████  ██      ██████  ██   ██    ██    ███████ 
     */

    u(flags: DATA_DIRECTION, call_depth: number, ...pending_function_indices: number[]) {

        for (const index of pending_function_indices) {
            if (this.lookup_function_table[index])
                this.call_set.set(index, [flags, call_depth]);
        }

        cfw.spark.queueUpdate(this);
    }

    call(pending_function_index: number, call_depth: number = 0) {

        if (call_depth >= 1) return;

        for (const [index] of this.binding_call_set)
            if (index == pending_function_index)
                return;

        this.binding_call_set.push([pending_function_index, call_depth]);

        cfw.spark.queueUpdate(this);
    }

    callFrame(pending_function_index: number, call_depth) {

        if (call_depth >= 1) return;

        for (const [index] of this.binding_call_set)
            if (index == pending_function_index)
                return;

        this.binding_call_set.push([pending_function_index, call_depth]);

        cfw.spark.queueUpdate(this);
    }

    /**
     * Check to see of the index locations are defined
     * @param ids 
     */
    check(...ids) {
        for (const id of ids)
            if (typeof this[id] == "undefined") return false;
        return true;
    }

    syncParentMethod(this_index, parent_method_index, child_index) {

        this.ci = child_index;

        this.pui[this_index] = this.par["u" + parent_method_index];
    }

    updateParent(data) {
        if (this.par)
            this.updateFromChild.call(this.par, data);
    }

    updateFromParent(local_index, v, flags) {

        if (flags >> 24 == this.ci + 1)
            return;

        this.u(v, DATA_FLOW_FLAG.FROM_PARENT | flags, local_index);
    }


    updateFromChild(local_index, val, flags) {

        const method = this.pui[local_index];

        if (typeof method == "function")
            method.call(this.par, val, flags | DATA_FLOW_FLAG.FROM_CHILD | ((this.ci + 1) << 24));

    };

    /**
     * @param model - The data model that has been updated 
     * @param changed_names - An iterable list of property names on the model that have been modified 
     */

    onModelUpdate(model: any = this.model, changed_names?: Iterable<string>) {
        // Go through the model's props and test whether they are different then the 
        // currently cached variables

        if (!this.CONNECTED) return;

        if (model) {

            if (changed_names) {
                for (const name in changed_names) {
                    const flag_id = this.nlu[name];
                    if (flag_id && (flag_id >>> 24) & DATA_FLOW_FLAG.FROM_MODEL) {
                        const index = flag_id & 0xFFFFFF,
                            v = this[index],
                            m = model[name];

                        if (m !== v) {
                            this[index] = m;
                            this.u(0, 0, index);
                        }
                    }
                }


            } else {

                for (const name in this.nlu) {

                    if ((this.nlu[name] >>> 24) & DATA_FLOW_FLAG.FROM_MODEL) {
                        const
                            index = this.nlu[name] & 0xFFFFFF,
                            v = this[index],
                            m = model[name];

                        if (m !== undefined && m !== v) {
                            this[index] = m;
                            this.u(0, 0, index);
                        }
                    }
                }
            }

            for (const [call_id, args] of this.clearActiveCalls())
                this.lookup_function_table[call_id].call(this, ...args);
        }
    }

    update(data, flags: number = 0, IMMEDIATE: boolean = false) {

        if (!this.CONNECTED) return;

        const update_indices: Set<number> = new Set;

        for (const name in data) {

            if (typeof (data[name]) !== "undefined") {

                const val = this.nlu[name];

                if (((val >> 24) & flags)) {

                    const index = val & 0xFFFFFF;


                    this[index] = data[name];

                    this.u(0, 0, index);

                    let i = 0;
                }
            }
        }

        for (const [call_id, args] of this.clearActiveCalls())
            this.lookup_function_table[call_id].call(this, ...args);
    }

    updateChildren(data, flags) {

        for (const name in data) {

            if (typeof data[name] == "undefined") {

                let i = 0;

                for (const chup of this.chups) {

                    if (chup[name])
                        this.ch[i].update({ [chup[name]]: data[name] }, flags | DATA_FLOW_FLAG.FROM_PARENT);
                    i++;
                }
            }
        }
    }

    scheduledUpdate(step_ratio, diff) {

        for (const [calls_id, depth] of this.clearActiveBindingCalls())
            this.lookup_function_table[calls_id].call(this, depth);

        for (const [call_id, args] of this.clearActiveCalls())
            this.lookup_function_table[call_id].call(this, ...args);



    }

    clearActiveBindingCalls() {
        if (this.binding_call_set.length == 0) return empty_array;

        const data = this.binding_call_set.slice();
        this.binding_call_set.length = 0;
        return data;
    }

    clearActiveCalls() {
        if (this.call_set.size == 0) return empty_array;
        const data = [...this.call_set.entries()];
        this.call_set.clear();
        return data;
    }

    runActiveCalls() {

    }

    /**************** Abstract Functions *********************/
    // Replaced by inheriting class.
    //=========================================================
    //=========================================================
    //=========================================================
    //=========================================================
    c() { }
    onLoad() { }
    onMounted() { }
    re(c: any) { }
    getCSS() { return ""; }

    //=========================================================
    //=========================================================
    //=========================================================
    //=========================================================
}
