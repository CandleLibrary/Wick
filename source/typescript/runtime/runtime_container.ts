import { cfw } from "@candlefw/cfw";
import { Transition } from "@candlefw/glow";
import spark, { Sparky } from "@candlefw/spark";
import { WickRTComponent } from "./runtime_component.js";
import { ObservableModel, ObservableWatcher } from "../types/observable_model";

function getColumnRow(index, offset, set_size) {
    const adjusted_index = index - offset * set_size;
    const row = Math.floor(adjusted_index / set_size);
    const col = (index) % (set_size);
    return { row, col };
}

//Poly fill for transitions if glow is not included
function createTransition(val?: boolean) {
    if (!cfw.glow) {
        const trs = { add: () => null, addEventListener: (n, v) => v() };
        return {
            in: trs, out: trs, play: () => null, addEventListener: (n, v) => v()
        };
    }
    else return cfw.glow.createTransition(val);
}

interface WindowData {
    limit: number;
    offset: number;
    active_window_start: number;
    output_length: number,
    upper_bound: number;
    direction: number,
    DESCENDING: boolean;
}


type ContainerComponent = WickRTComponent & { index: number; container_model: any; _TRANSITION_STATE_: boolean; par: ContainerComponent; };

const component_attributes_default: [string?, string?][][] = [[[]]];

/**
 * ScopeContainer provide the mechanisms for dealing with lists and sets of components. 
 *
 * @param      {Scope}  parent   The Scope parent object.
 * @param      {Object}  data     The data object hosting attribute properties from the HTML template. 
 * @param      {Object}  presets  The global presets object.
 * @param      {HTMLElement}  element  The element that the Scope will _bind_ to. 
 */
export class WickContainer implements Sparky, ObservableWatcher {

    /**
     * Scrub offset
     */

    /**
     * The index of the first active component when multiplied with shift_amount
     *  
     * The index of the first component in a window will be 
     * offset * shift
     */
    offset: number;

    /**
     * The number of component that will be skipped per unit of offset
     */
    shift_amount: number;
    // Scrubbing only
    offset_diff: number;
    // Scrubbing only
    offset_fractional: number;
    // Scrubbing only
    scrub_velocity: number;
    drag: number;


    max: number;

    _SCHD_: number;

    /**
     * Number of components to display from full active set
     */
    limit: number;

    /**
     * HTML Element bound to the container. 
     */
    ele: HTMLElement;

    /**
     * Components that meet the filtering requirements and can be
     * mounted to the DOM on demand. 
     */
    activeComps: ContainerComponent[];

    /**
     * Components that are currently mounted to the DOM
     */
    dom_comp: ContainerComponent[];

    /**
     * Components that have been created from model array data. 
     */
    comps: ContainerComponent[];

    dom_dn: ContainerComponent[];
    dom_up: ContainerComponent[];

    filters: any[];

    comp_constructors: typeof WickRTComponent[];
    comp_attributes: [string?, string?][][];

    evaluators: ((m: any) => boolean)[];

    /**
     * Glow transition for elements with low index values increasing to high index values.
     */
    trs_ascending: any;

    /**
     * Glow transition for elements with high index values decreasing to low index values.
     */
    trs_descending: any;

    /**
     * True if any sub-component ele has been mounted to the DOM.
     */
    ELEMENT_CONNECTED: boolean;
    UPDATE_FILTER: boolean;
    DOM_UP_APPENDED: boolean;
    DOM_DN_APPENDED: boolean;
    AUTO_SCRUB: boolean;
    LOADED: boolean;
    SCRUBBING: boolean;

    //Replaces the element with sub-component elements if true.
    REPLACE_ELEMENT: boolean;

    parent: WickRTComponent;

    container: any | ObservableModel;

    filter: (...args) => boolean;
    sort: (...args) => number;

    /**
     * Used with element-less containers. The first component element mounted to the DOM.
     * null if no components are mounted
     */
    first_dom_element: Element;
    /**
     * Used with element-less containers. The last component element mounted to the DOM
     * null if no components are mounted
     */
    last_dom_element: Element;

    constructor(
        component_constructors: typeof WickRTComponent[],
        component_attributes: [string, string][][],
        element: HTMLElement,
        parent_comp: WickRTComponent
    ) {

        this.ele = element;

        this.comp_constructors = component_constructors;
        this.comp_attributes = component_attributes || component_attributes_default;

        this.activeComps = [];
        this.dom_comp = [];
        this.filters = [];
        this.comps = [];

        this.first_dom_element = null;
        this.last_dom_element = null;

        this.dom_dn = [];
        this.dom_up = [];
        this.evaluators = [];

        this._SCHD_ = 0;
        this.shift_amount = 1;
        this.limit = 0;
        this.offset = 0;
        this.offset_diff = 0;
        this.offset_fractional = 0;
        this.scrub_velocity = 0;
        this.drag = 0.5;

        this.trs_ascending = null;
        this.trs_descending = null;
        this.REPLACE_ELEMENT = this.ele.tagName == "NULL";
        this.ELEMENT_CONNECTED = false;
        this.UPDATE_FILTER = false;
        this.DOM_UP_APPENDED = false;
        this.DOM_DN_APPENDED = false;
        this.AUTO_SCRUB = false;
        this.LOADED = false;

        this.container = null;

        this.parent = parent_comp;

        this.filter = null;//m1 => true;
        this.sort = null;//() => 0;
    }

    destructor() {

        this.filter_new_items();

        for (const fltr of this.filters)
            fltr.destroy();

        if (this.container && this.container.OBSERVABLE)
            this.container.unsubscribe(this);

    }


    /**
     * Called by component when container data should be set.
     * @param container 
     */
    sd(container: any[] | ObservableModel) {

        if (!container) return;

        //@ts-ignore
        if (container.OBSERVABLE) {

            const ctr: ObservableModel = <ObservableModel>container;

            ctr.subscribe(this);
        } else {
            if (Array.isArray(container))
                this.filter_new_items(container);
            else
                this.filter_new_items(container.data);
        }

        this.loadAcknowledged();
    }

    onModelUpdate(container) { this.filter_new_items(container); }

    update(container) {
        throw new Error("IS this being used?");

        if (container.CFW_DATA_STRUCTURE) container = container.get(undefined, []);

        if (!container) return;

        if (Array.isArray(container))
            this.filter_new_items(container);
        else
            this.filter_new_items(container.data);
    }

    loadAcknowledged() {
        if (!this.LOADED) {
            this.LOADED = true;
            //    this.parent.loadAcknowledged();
        }
    }

    forceMount() {
        const
            active_window_size = this.limit,
            offset = this.offset,
            min = Math.min(offset + this.offset_diff, offset) * this.shift_amount,
            max = Math.max(offset + this.offset_diff, offset) * this.shift_amount + active_window_size,
            output_length = this.activeComps.length;

        let i = min;

        this.ele.innerHTML = "";
        this.dom_comp.length = 0;

        while (i < max && i < output_length) {
            const node = this.activeComps[i++];
            this.dom_comp.push(node);
            this.append(node);
        }
    }

    /**
     * Scrub provides a mechanism to scroll through components of a container that have been limited through the limit filter.
     * @param  {Number} scrub_amount [description]
     */
    scrub(scrub_delta, SCRUBBING = true) {

        const w_data = this.getWindowData();

        if (w_data.limit == 0) {
            this.SCRUBBING = false;
            return;
        }

        // scrub_delta is the relative amount of change from the previous offset. 

        if (!this.SCRUBBING)
            this.arrangeScrub(w_data, this.activeComps);


        this.SCRUBBING = true;

        if (this.AUTO_SCRUB && !SCRUBBING && scrub_delta != Infinity) {
            this.scrub_velocity = 0;
            this.AUTO_SCRUB = false;
        }

        let delta_offset = scrub_delta + this.offset_fractional;

        if (scrub_delta !== Infinity) {

            if (Math.abs(delta_offset) > 1) {
                if (delta_offset > 0) {
                    delta_offset = delta_offset % 1;
                    this.offset_fractional = delta_offset;
                    this.scrub_velocity = scrub_delta;

                    if (this.offset < this.max)
                        this.trs_ascending.step(1);

                    this.offset++;
                    this.offset_diff = 1;

                    this.mutateDOM(this.getWindowData(), null, this.activeComps, true, false).step(1).issueStopped();
                    this.arrangeScrub(w_data, this.activeComps);
                } else {
                    delta_offset = delta_offset % 1;
                    this.offset_fractional = delta_offset;
                    this.scrub_velocity = scrub_delta;

                    if (this.offset >= 1)
                        this.trs_descending.step(1);
                    this.offset--;
                    this.offset_diff = -1;

                    this.mutateDOM(this.getWindowData(), null, this.activeComps, true, false).step(1).issueStopped();
                    this.arrangeScrub(w_data, this.activeComps);
                }

            }

            //Make Sure the the transition animation is completed before moving on to new animation sequences.

            if (delta_offset > 0) {

                if (this.offset + delta_offset >= this.max - 1) delta_offset = 0;

                if (!this.DOM_UP_APPENDED) {

                    for (let i = 0; i < this.dom_up.length; i++) {
                        this.append(this.dom_up[i]);
                        this.dom_up[i].index = -1;
                        this.dom_comp.push(this.dom_up[i]);
                    }

                    this.DOM_UP_APPENDED = true;
                }

                this.trs_ascending.play(delta_offset);
            } else {

                if (this.offset < 1) delta_offset = 0;

                if (!this.DOM_DN_APPENDED) {

                    for (let i = 0; i < this.dom_dn.length; i++) {
                        this.append(this.dom_dn[i], this.dom_comp[0].ele);
                        this.dom_dn[i].index = -1;
                    }

                    this.dom_comp = this.dom_dn.concat(this.dom_comp);

                    this.DOM_DN_APPENDED = true;
                }

                this.trs_descending.step(-delta_offset);
            }

            this.offset_fractional = delta_offset;
            this.scrub_velocity = scrub_delta;

            return true;
        } else {

            // Velocity Physics

            if (Math.abs(this.scrub_velocity) > 0.0001) {
                const sign = Math.sign(this.scrub_velocity);

                if (Math.abs(this.scrub_velocity) < 0.1) this.scrub_velocity = this.drag * 0.2 * sign;
                if (Math.abs(this.scrub_velocity) > 0.5) this.scrub_velocity = this.drag * sign;

                this.AUTO_SCRUB = true;

                //Determine the distance traveled with normal drag decay
                let dist = this.scrub_velocity * (1 / (-this.drag + 1));

                //get the distance to nearest page given the distance traveled
                let nearest = (this.offset + this.offset_fractional + dist);

                nearest = (this.scrub_velocity > 0) ? Math.min(this.max, Math.ceil(nearest)) : Math.max(0, Math.floor(nearest));

                //get the ratio of the distance from the current position and distance to the nearest 
                let nearest_dist = nearest - (this.offset + this.offset_fractional);
                let drag = Math.abs(1 - (1 / (nearest_dist / this.scrub_velocity)));

                this.drag = drag;
                this.scrub_velocity = this.scrub_velocity;
                this.SCRUBBING = true;
                spark.queueUpdate(this);
                return true;
            } else {
                this.offset += Math.round(this.offset_fractional);
                this.scrub_velocity = 0;
                this.offset_fractional = 0;
                this.mutateDOM(this.getWindowData(), null, this.activeComps, true).step(1).issueStopped();
                this.SCRUBBING = false;
                return false;
            }
        }
    }

    arrangeScrub(w_data: WindowData, output = this.activeComps) {

        let { limit, offset, output_length, active_window_start } = w_data,
            active_window_size = this.limit;

        if (active_window_size > 0) {

            this.shift_amount = Math.max(1, Math.min(active_window_size, this.shift_amount));

            let
                i = 0,
                oa = 0;

            const
                ein = [],
                shift_points = Math.ceil(output_length / this.shift_amount);

            this.max = shift_points - 1;
            offset = Math.max(0, Math.min(shift_points - 1, offset));

            // Two transitions to support scrubbing from an offset in either direction
            this.trs_ascending = createTransition(false);
            this.trs_descending = createTransition(false);

            //
            this.dom_dn.length = 0;
            this.dom_up.length = 0;
            this.DOM_UP_APPENDED = false;
            this.DOM_DN_APPENDED = false;

            // Scopes proceeding the transition window
            while (i < active_window_start - this.shift_amount) output[i++].index = -2;

            //Scopes entering the transition window ascending
            while (i < active_window_start) {
                this.dom_dn.push(output[i]);
                const { row, col } = getColumnRow(i, offset - 1, this.shift_amount);
                output[i].transitionIn(row, col, true, this.trs_descending);
                output[i++].index = -2;
            }

            //Scopes in the transition window
            while (i < active_window_start + active_window_size && i < output_length) {
                //Scopes on the descending edge of the transition window
                if (oa < this.shift_amount && ++oa) {
                    const { row, col } = getColumnRow(i, offset + 1, this.shift_amount);
                    output[i].transitionOut(row, col, true, this.trs_descending);
                } else {
                    const { row, col } = getColumnRow(i, offset + 1, this.shift_amount);
                    output[i].transitionIn(row, col, false, this.trs_ascending);
                }

                //Scopes on the ascending edge of the transition window
                if (i >= active_window_start + active_window_size - this.shift_amount) {
                    const { row, col } = getColumnRow(i, offset - 1, this.shift_amount);
                    output[i].transitionOut(row, col, true, this.trs_descending);
                }
                else {
                    const { row, col } = getColumnRow(i, offset - 1, this.shift_amount);
                    output[i].arrange(row, col, this.trs_descending);
                }

                output[i].index = i;
                ein.push(output[i++]);
            }

            //Scopes entering the transition window while offset is descending
            while (i < active_window_start + active_window_size + this.shift_amount && i < output_length) {
                this.dom_up.push(output[i]);
                const { row, col } = getColumnRow(i, offset + 1, this.shift_amount);
                output[i].transitionIn(row, col, false, this.trs_ascending);
                output[i++].index = -3;
            }

            //Scopes following the transition window
            while (i < output_length) output[i++].index = -3;

            output = ein;
            output_length = ein.length;
        } else {
            this.max = 0;
            this.limit = 0;
        }
    }




    arrange(w_data: WindowData, output = this.activeComps, transition = createTransition()) {

        const { limit, offset, output_length, active_window_start, upper_bound, DESCENDING } = w_data;

        //Arranges active scopes according to their arrange handler.

        let i = 0;

        while (i < active_window_start && i < output_length) {

            if (output[i].CONNECTED) {

                const { row, col } = getColumnRow(i, offset, this.shift_amount);

                output[i].transitionOut(row, col, DESCENDING, transition);
            }

            i++;
        }

        while (i < upper_bound) {

            const { row, col } = getColumnRow(i, offset, this.shift_amount);

            if (output[i].CONNECTED)
                output[i].arrange(row, col, transition);
            else
                output[i].transitionIn(row, col, DESCENDING, transition);
            i++;
        }

        while (i < output_length) {

            if (output[i].CONNECTED) {
                const { row, col } = getColumnRow(i, offset, this.shift_amount);
                output[i].transitionOut(row, col, DESCENDING, transition);
            }
            i++;
        }
    }

    private updateRefs(w_data: WindowData, output: ContainerComponent[]) {

        const { limit, offset, output_length, active_window_start, upper_bound, direction } = w_data;

        this.ele.style.position = this.ele.style.position;


        if (this.REPLACE_ELEMENT && this.ELEMENT_CONNECTED && upper_bound - active_window_start == 0) {
            this.dom_comp[0].ele.parentElement.insertBefore(this.ele, this.dom_comp[0].ele);
            this.ELEMENT_CONNECTED = false;
        }

        this.dom_comp.length = 0;

        for (let i = active_window_start; i < upper_bound; i++)
            this.dom_comp.push(output[i]);

        if (this.REPLACE_ELEMENT && this.dom_comp.length > 0) {
            this.first_dom_element = this.dom_comp[0].ele;
            this.last_dom_element = this.dom_comp[this.dom_comp.length - 1].ele;
        }
    }

    /**
     * Appends elements to the DOM
     */
    append(appending_comp: WickRTComponent, append_before_ele?: HTMLElement) {
        if (this.REPLACE_ELEMENT) {
            if (!this.ELEMENT_CONNECTED) {

                appending_comp.appendToDOM(this.ele.parentElement, this.ele, false);

                this.ele.parentElement.removeChild(this.ele);

                this.first_dom_element = appending_comp.ele;
                this.last_dom_element = appending_comp.ele;

                this.ELEMENT_CONNECTED = true;
            } else {
                if (!append_before_ele) {

                    append_before_ele = this.last_dom_element;

                    this.last_dom_element = appending_comp.ele;

                    appending_comp.appendToDOM(this.parent.ele, append_before_ele, true);
                } else {
                    appending_comp.appendToDOM(this.parent.ele, append_before_ele);
                }
            }
        } else {
            appending_comp.appendToDOM(this.ele, append_before_ele);
        }
    }

    private appendToDOM(w_data: WindowData, output: ContainerComponent[], transition: any) {

        const { limit, offset, output_length, active_window_start } = w_data;

        let j = active_window_start;
        //Insert elements
        // Index the active items
        let upper_bound = Math.min(active_window_start + limit, output_length);
        let i = Math.min(active_window_start, output_length);

        while (i < upper_bound)
            output[i].index = i++;

        // Integrate new items with those already on the DOM


        for (let i = 0; i < this.dom_comp.length && j < upper_bound; i++) {

            const as = this.dom_comp[i];

            while (j < upper_bound && output[j].CONNECTED) j++;

            while (j < as.index && j < upper_bound) {
                const os = output[j];
                os.index = -1;
                this.append(os, as.ele);
                j++;
            }

        }

        // Append any remaining items to the DOM
        while (j < upper_bound) {
            this.append(output[j]);
            output[j].index = -1;
            //const { row, col } = getColumnRow(j, offset, this.shift_amount);
            //output[j].arrange(row, col, transition);
            j++;
        }
        return j;
    }

    mutateDOM(w_data: WindowData, transition?, output = this.activeComps, NO_TRANSITION = false, USE_ARRANGE_SCRUB = false) {

        let
            OWN_TRANSITION = false;

        if (!transition) transition = createTransition(), OWN_TRANSITION = true;

        // if (USE_ARRANGE_SCRUB)
        //     this.arrangeScrub(w_data, output);
        // else
        this.arrange(w_data, output, transition);

        this.appendToDOM(w_data, output, transition);

        this.updateRefs(w_data, output);

        if (OWN_TRANSITION) {
            if (NO_TRANSITION)
                return transition;
            else
                transition.play();
        }

        return transition;
    }


    private getWindowData(output = this.activeComps): WindowData {

        const
            limit = this.limit,
            offset = this.offset,
            output_length = output.length,
            active_window_start = Math.max(0, offset * this.shift_amount),
            upper_bound = Math.min(active_window_start + limit, output_length),
            direction = Math.sign(this.offset_diff),
            DESCENDING = direction < 0;

        return {
            limit,
            offset,
            output_length,
            active_window_start,
            upper_bound,
            direction,
            DESCENDING
        };
    }

    limitExpressionUpdate(transition: Transition = createTransition()) {

        //Preset the positions of initial components. 

        this.mutateDOM(this.getWindowData(), transition);

        // If scrubbing is currently occurring, if the transition were to auto play then the results 
        // would interfere with the expected behavior of scrubbing. So the transition
        // is instead set to it's end state, and scrub is called to set intermittent 
        // position. 
        if (!this.SCRUBBING)
            transition.play();

        this.offset_diff = 0;
    }

    filterExpressionUpdate(transition = createTransition()) {
        // Filter the current components. 
        this.updateFilter();
        this.limitExpressionUpdate(transition);
    }

    /**
     * Filters stored Scopes with search terms and outputs an array of passing scopes.
     * 
     * @protected
     */
    updateFilter() {

        let output = this.comps.slice();

        if (this.filter)
            output = this.comps.filter(comp => this.filter(comp.container_model));

        if (this.sort)
            output.sort(this.sort);

        this.activeComps = output;

        this.UPDATE_FILTER = false;

        return output;
    }

    updateScrub(value: number) {
        if (typeof value == "number" && value != 0)
            this.scrub(value);
        else if (value === null && this.SCRUBBING) {
            this.AUTO_SCRUB = true;
            this.scheduledUpdate();
        }
    }

    updateLimit(value: number) {
        if (typeof value == "number" && this.limit != value) {
            this.limit = value;
            this.scheduledUpdate();
        }
    }

    updateShift(value: number) {
        if (typeof value == "number" && this.shift_amount != value) {
            this.shift_amount = value;
            this.scheduledUpdate();
        }
    }

    updateOffset(value: number) {
        if (typeof value == "number" && this.offset != value) {
            this.offset = value;
            this.scheduledUpdate();
        }
    }

    /**
     * Called by Spark. 
     * 
     * @protected
     */
    scheduledUpdate() {
        if (this.SCRUBBING) {

            if (!this.AUTO_SCRUB) {
                this.SCRUBBING = false;
                return;
            }

            if (
                Math.abs(this.scrub_velocity) > 0.0001
            ) {
                if (this.scrub(this.scrub_velocity)) {

                    this.scrub_velocity *= (this.drag);

                    let pos = this.offset + this.scrub_velocity;

                    if (pos < 0 || pos > this.max)
                        this.scrub_velocity = 0;

                    spark.queueUpdate(this);
                }

            } else {
                this.scrub_velocity = 0;
                this.scrub(Infinity);
                this.SCRUBBING = false;
            }
        } else {

            this.filterExpressionUpdate();
        }
    }

    /**
     * Removes stored Scopes that do not match the ModelContainer contents. 
     *
     * @param      {Array}  new_items  Array of Models that are currently stored in the ModelContainer. 
     * 
     * @protected
     */
    filter_new_items(new_items = []) {

        const transition = createTransition();

        if (new_items.length == 0) {

            const sl = this.activeComps.length;

            let trs = { trs: transition, pos: null };

            for (let i = 0; i < sl; i++) {
                const { row, col } = getColumnRow(i, this.offset, this.shift_amount);
                this.activeComps[i].transitionOut(row, col, trs, false, true);
            }

            this.comps.length = 0;
            this.activeComps.length = 0;

            if (!this.SCRUBBING)
                transition.play();

        } else {

            const
                exists = new Map(new_items.map(e => [e, true])),
                out = [];


            for (let i = 0, l = this.activeComps.length; i < l; i++)
                if (exists.has(this.activeComps[i].container_model))
                    exists.set(this.activeComps[i].container_model, false);


            for (let i = 0, l = this.comps.length; i < l; i++)
                if (!exists.has(this.comps[i].container_model)) {
                    this.comps[i].transitionOut(true, transition, true);
                    this.comps[i].index = -1;
                    this.comps.splice(i, 1);
                    l--;
                    i--;
                } else
                    exists.set(this.comps[i].container_model, false);

            exists.forEach((v, k) => { if (v) out.push(k); });

            if (out.length > 0) {
                // Wrap models into components
                this._add(out, transition);

            } else {
                for (let i = 0, j = 0, l = this.activeComps.length; i < l; i++, j++) {

                    if (this.activeComps[i]._TRANSITION_STATE_) {
                        if (j !== i) {
                            const { row, col } = getColumnRow(i, this.offset, this.shift_amount);
                            this.activeComps[i].arrange(row, col, transition);
                        }
                    } else
                        this.activeComps.splice(i, 1), i--, l--;
                }
            }

            cfw.spark.queueUpdate(this);

            //this.filterExpressionUpdate(transition);
        }
    }
    addEvaluator(evalator: (a: any) => boolean) { this.evaluators.push(evalator); }

    /**
     * Called by the ModelContainer when Models have been added to it.
     *
     * @param      {Array}  items   An array of new items now stored in the ModelContainer. 
     */
    _add(items, transition) {

        let OWN_TRANSITION = false, cstr_l = this.comp_constructors.length;

        if (!transition)
            transition = createTransition(), OWN_TRANSITION = true;

        for (const item of items) {

            let component: ContainerComponent = null;

            if (item instanceof WickRTComponent) {
                component = <ContainerComponent>item;
            } else {

                for (let j = 0; j < cstr_l; j++) {

                    const evaluator = this.evaluators[j];

                    if (j == cstr_l - 1 || (evaluator && evaluator(item))) {

                        component = <ContainerComponent>new this.comp_constructors[j](item);

                        const attrib_list = this.comp_attributes[j];

                        if (attrib_list)
                            for (const [key, value] of attrib_list) {

                                if (!key) continue;

                                if (key == "class")
                                    component.ele.classList.add(...value.split(" "));
                                else
                                    component.ele.setAttribute(key, value);
                            }

                        component.container_model = item;

                        break;
                    }
                }
            }

            component.par = <ContainerComponent>this.parent;

            this.comps.push(component);

            component.onLoad();
        }

        if (OWN_TRANSITION) this.filterExpressionUpdate(transition);
    }

    /**
     * Called by the ModelContainer when Models have been removed from it.
     *
     * @param {Array}  items   An array of items no longer stored in the ModelContainer. 
    
    remove(items, transition = createTransition()) {
        for (const item of items) {
            for (let j = 0; j < this.comps.length; j++) {
                let component = this.comps[j];
                if (component.model == item) {
                    this.comps.splice(j, 1);
                    component.transitionOut(0, 0, transition, true, true);
                    break;
                }
            }
        }

        this.filterExpressionUpdate(transition);
    }

    down(data, changed_values) {
        for (let i = 0, l = this.activeComps.length; i < l; i++) this.activeComps[i].update(data);
    }
     */
}