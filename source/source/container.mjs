import glow from "@candlefw/glow";
import spark from "@candlefw/spark";

import { ModelContainerBase } from "../model/container/base";
import { MultiIndexedContainer } from "../model/container/multi";
import { View } from "../view";
import { Tap } from "./tap/tap.mjs";

/**
 * SourceContainer provide the mechanisms for dealing with lists and sets of components. 
 *
 * @param      {Source}  parent   The Source parent object.
 * @param      {Object}  data     The data object hosting attribute properties from the HTML template. 
 * @param      {Object}  presets  The global presets object.
 * @param      {HTMLElement}  element  The element that the Source will _bind_ to. 
 */
export class SourceContainer extends View {

    constructor(parent, presets, element) {

        super();

        this.ele = element;
        this.parent = null;
        this.activeSources = [];
        this.dom_sources = [];
        this.filters = [];
        this.ios = [];
        this.terms = [];
        this.sources = [];
        this.range = null;
        this._SCHD_ = 0;
        this.prop = null;
        this.package = null;
        this.transition_in = 0;
        this.limit = 0;
        this.shift_amount = 1;
        this.dom_dn = [];
        this.dom_up = [];
        this.trs_up = null;
        this.trs_dn = null;
        this.UPDATE_FILTER = false;
        this.dom_up_appended = false;
        this.dom_dn_appended = false;
        this.root = 0;
        this.AUTO_SCRUB = false;
        this.taps = {};

        this.scrub_velocity = 0;
        this.offset = 0;
        this.offset_fractional = 0;

        parent.addTemplate(this);
    }

    get data() {}
    set data(container) {

        if (container instanceof ModelContainerBase) {
            container.pin();
            container.addView(this);
            return;
        }
        if (!container) return;
        if (Array.isArray(container)) this.cull(container);
        else this.cull(container.data);
    }

    update(container) {
        if (container instanceof ModelContainerBase) container = container.get();
        if (!container) return;
        //let results = container.get(this.getTerms());
        // if (container.length > 0) {
        if (Array.isArray(container)) this.cull(container);
        else this.cull(container.data);
        // }
    }


    /**
     * Called by Spark when a change is made to the Template HTML structure. 
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
                this.scrub(this.scrub_velocity);
                this.scrub_velocity *= (this.drag);

                let pos = this.offset + this.scrub_velocity;

                if (pos < 0 || pos > this.max)
                    this.scrub_velocity = 0;

                spark.queueUpdate(this);

            } else {
                this.scrub_velocity = 0;
                this.scrub(Infinity);
                this.SCRUBBING = false;
            }
        } else if (this.UPDATE_FILTER) {
            this.filterUpdate();
        } else {
            this.limitUpdate();
        }
    }

    /**
     * Scrub provides a mechanism to scroll through components of a container that have been limited through the limit filter.
     * @param  {Number} scrub_amount [description]
     */
    scrub(scrub_delta, SCRUBBING = true) {

        // scrub_delta is the relative ammount of change from the previous offset. 

        this.SCRUBBING = true;

        if (this.AUTO_SCRUB && !SCRUBBING && scrub_delta != Infinity) {
            this.scrub_velocity = 0;
            this.AUTO_SCRUB = false;
        }

        let delta_offset = scrub_delta + this.offset_fractional;

        if (scrub_delta !== Infinity) {

            if (Math.abs(delta_offset) > 1) {
                if (delta_offset > 1) {
                    if (this.offset < this.max)
                        this.trs_up.play(1);
                    this.render(null, this.activeSources, this.limit, this.offset + 1, true);
                } else {
                    if (this.offset >= 1)
                        this.trs_dn.play(1);
                    this.render(null, this.activeSources, this.limit, this.offset - 1, true);
                }
                delta_offset = delta_offset % 1;
            }

            //Make Sure the the transition animation is completed before moving on to new animation sequences.

            if (delta_offset > 0) {

                if (this.offset + delta_offset >= this.max) delta_offset = 0;

                if (!this.dom_up_appended) {

                    for (let i = 0; i < this.dom_up.length; i++) {
                        this.dom_up[i].appendToDOM(this.ele);
                        this.dom_up[i].index = -1;
                        this.dom_sources.push(this.dom_up[i]);
                    }

                    this.dom_up_appended = true;
                }

                this.trs_up.play(delta_offset);
            } else {

                if (this.offset < 1 && delta_offset < 0) delta_offset = 0;

                if (!this.dom_dn_appended) {

                    for (let i = 0; i < this.dom_dn.length; i++) {
                        this.dom_dn[i].appendToDOM(this.ele, this.dom_sources[0].ele);
                        this.dom_dn[i].index = -1;
                    }

                    this.dom_sources = this.dom_dn.concat(this.dom_sources);

                    this.dom_dn_appended = true;
                }

                this.trs_dn.play(-delta_offset);
            }

            this.offset_fractional = delta_offset;
            this.scrub_velocity = scrub_delta;
        } else {

            if (Math.abs(this.scrub_velocity) > 0.00001) {
                const sign = Math.sign(this.scrub_velocity);

                if (Math.abs(this.scrub_velocity) < 0.01) this.scrub_velocity = 0.01 * sign;
                if (Math.abs(this.scrub_velocity) > 0.2) this.scrub_velocity = 0.2 * sign;

                this.AUTO_SCRUB = true;

                //Determine the distance traveled with normal drag decay of 0.5
                let dist = this.scrub_velocity * (1 / (-0.5 + 1));
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
            } else {
                this.render(null, this.activeSources, this.limit, this.offset + Math.round(this.offset_fractional), true).play(1);
                this.scrub_velocity = 0;
                this.offset_fractional = 0;
            }
        }
    }

    arrange(output = this.activeSources, limit = this.limit, offset = this.offset) {
        //Arranges active sources according to their arrange handler.
        const
            transition = glow.createTransition(),
            output_length = output.length,
            shift_points = Math.ceil(output_length / this.shift_amount),
            active_window_start = offset * this.shift_amount;

        offset = Math.max(0, Math.min(shift_points - 1, offset));

        let i = 0,
            ip = 0;

        while (i < active_window_start && i < output_length) {
            //Sources on the descending edge of the transition window
            output[i++].update({ prearrange: { trs: transition.in, index: ip++ } });
        }
        ip = 0;
        //Sources in the transtion window
        while (i < active_window_start + limit && i < output_length) {
            //Sources on the descending edge of the transition window
            output[i++].update({ arrange: { trs: transition.in, index: ip++ } });
        }
        ip = 0;
        while (i< output_length) {
            //Sources on the descending edge of the transition window
            output[i++].update({ postarrange: { trs: transition.in, index: ip++ } });
        }

        transition.play(1);
        transition.play(1);
    }

    render(transition, output = this.activeSources, active_window_size = this.limit, offset = this.offset, NO_TRANSITION = false) {
        let
            j = 0,
            output_length = output.length,
            active_length = this.dom_sources.length,
            direction = 1,
            OWN_TRANSITION = false;

        if (!transition) transition = glow.createTransition(), OWN_TRANSITION = true;

        offset = Math.max(0, offset);

        direction = Math.sign(offset - this.offset);

        if (active_window_size > 0) {

            this.shift_amount = Math.max(1, Math.min(active_window_size, this.shift_amount));

            let
                i = 0,
                ip = 0,
                oa = 0,
                ein = [],
                shift_points = Math.ceil(output_length / this.shift_amount),
                active_window_start = offset * this.shift_amount;

            this.max = shift_points - 1;
            this.offset = Math.max(0, Math.min(shift_points - 1, offset));

            //Two transitions to support scrubbing from an offset in either direction
            this.trs_up = glow.createTransition(false);
            this.trs_dn = glow.createTransition(false);

            this.dom_dn.length = 0;
            this.dom_up.length = 0;
            this.dom_up_appended = false;
            this.dom_dn_appended = false;

            //Sources preceeding the transition window
            while (i < active_window_start - this.shift_amount) output[i++].index = -2;

            //Sources entering the transition window ascending
            while (i < active_window_start) {
                this.dom_dn.push(output[i]);
                output[i].update({ trs_in_dn: { index: ip++, trs: this.trs_dn.in } });
                output[i++].index = -2;
            }

            //Sources in the transtion window
            while (i < active_window_start + active_window_size && i < output_length) {
                //Sources on the descending edge of the transition window
                if (oa < this.shift_amount) {
                    oa++;
                    output[i].update({ trs_out_up: { trs: this.trs_up.out, index: 0 } });
                } else {
                    output[i].update({ arrange: { trs: this.trs_up.in, index: (i) - active_window_start - this.shift_amount } });
                }

                //Sources on the ascending edge of the transition window
                if (i >= active_window_start + active_window_size - this.shift_amount) {
                    ip++;
                    output[i].update({ trs_out_dn: { trs: this.trs_dn.out, index: 0 } });
                } else {
                    output[i].update({ arrange: { trs: this.trs_dn.in, index: ip++ } });
                }

                output[i].index = i;
                ein.push(output[i++]);
            }

            //Sources entering the transition window descending
            while (i < active_window_start + active_window_size + this.shift_amount && i < output_length) {
                this.dom_up.push(output[i]);
                output[i].update({
                    trs_in_up: {
                        index: (i) - active_window_start - this.shift_amount,
                        trs: this.trs_up.in
                    }
                });
                output[i++].index = -3;
            }

            //Sources following the transition window
            while (i < output_length) output[i++].index = -3;

            output = ein;
            output_length = ein.length;
            this.limit = active_window_size;
        } else {
            this.max = 0;
            this.limit = 0;
        }

        let trs_in = { trs: transition.in, index: 0 };
        let trs_out = { trs: transition.out, index: 0 };

        for (let i = 0; i < output_length; i++) output[i].index = i;

        for (let i = 0; i < active_length; i++) {
            let as = this.dom_sources[i];

            if (as.index > j) {
                while (j < as.index && j < output_length) {
                    let os = output[j];
                    os.index = j;
                    trs_in.index = j;
                    os.appendToDOM(this.ele, as.element);
                    os.transitionIn(trs_in, (direction) ? "trs_in_up" : "trs_in_dn");
                    j++;
                }
            } else if (as.index < 0) {
                if (!NO_TRANSITION) {
                    switch (as.index) {
                        case -2:
                        case -3:
                            as.transitionOut(trs_out, (direction) ? "trs_out_up" : "trs_out_dn");
                            break;
                        default:
                            as.transitionOut(trs_out);
                    }
                } else
                    as.transitionOut();

                continue;
            }
            trs_in.index = j++;
            as.update({ arrange: trs_in });
            as._TRANSITION_STATE_ = true;
            as.index = -1;
        }

        while (j < output.length) {
            output[j].appendToDOM(this.ele);
            output[j].index = -1;
            trs_in.index = j;
            output[j].transitionIn(trs_in, (direction) ? "arrange" : "arrange");
            j++;
        }

        this.ele.style.position = this.ele.style.position;
        this.dom_sources = output;

        this.parent.upImport("template_count_changed", {
            displayed: output_length,
            offset: offset,
            count: this.activeSources.length,
            pages: this.max,
            ele: this.ele,
            template: this,
            trs: transition.in
        });

        if (OWN_TRANSITION) {
            if (NO_TRANSITION)
                return transition;
            transition.start();
        }

        return transition;
    }

    limitUpdate(transition, output) {

        let limit = this.limit,
            offset = 0;

        for (let i = 0, l = this.filters.length; i < l; i++) {
            let filter = this.filters[i];
            if (filter.CAN_USE) {
                if (filter._CAN_LIMIT_) limit = filter._value_;
                if (filter._CAN_OFFSET_) offset = filter._value_;
                if (filter._CAN_SHIFT_) this.shift_amount = filter._value_;
            }
        }

        this.SCRUBBING = false;
        this.scrub_velocity = 0;
        this.arrange();
        this.render(transition, output, limit, offset);
    }
    /**
     * Filters stored Sources with search terms and outputs the matching Sources to the DOM.
     * 
     * @protected
     */
    filterUpdate(transition) {
        let output = this.sources.slice();
        if (output.length < 1) return;
        for (let i = 0, l = this.filters.length; i < l; i++) {
            let filter = this.filters[i];
            if (filter.CAN_USE) {
                if (filter.CAN_FILTER) output = output.filter(filter.filter_function._filter_expression_);
                if (filter.CAN_SORT) output = output.sort(filter._sort_function_);
            }
        }
        this.activeSources = output;
        this.limitUpdate(transition, output);
        this.UPDATE_FILTER = false;
    }
    /**
     * Removes stored Sources that do not match the ModelContainer contents. 
     *
     * @param      {Array}  new_items  Array of Models that are currently stored in the ModelContainer. 
     * 
     * @protected
     */
    cull(new_items = []) {

        const transition = glow.createTransition();

        if (new_items.length == 0) {
            let sl = this.sources.length;
            for (let i = 0; i < sl; i++) this.sources[i].transitionOut(transition, "", true);
            this.sources.length = 0;
            this.parent.upImport("template_count_changed", {
                displayed: 0,
                offset: 0,
                count: 0,
                pages: 0,
                ele: this.ele,
                template: this,
                trs: transition.in
            });
        } else {
            let exists = new Map(new_items.map(e => [e, true]));
            var out = [];
            for (let i = 0, l = this.activeSources.length; i < l; i++)
                if (exists.has(this.activeSources[i].model)) {
                    exists.set(this.activeSources[i].model, false);
                }
            for (let i = 0, l = this.sources.length; i < l; i++)
                if (!exists.has(this.sources[i].model)) {
                    this.sources[i].transitionOut(transition, "", true);
                    this.sources[i].index = -1;
                    this.sources.splice(i, 1);
                    l--;
                    i--;
                } else exists.set(this.sources[i].model, false);
            exists.forEach((v, k, m) => {
                if (v) out.push(k);
            });
            if (out.length > 0) {
                this.added(out, transition);
            } else {
                for (let i = 0, j = 0, l = this.activeSources.length; i < l; i++, j++) {
                    if (this.activeSources[i]._TRANSITION_STATE_) {
                        if (j !== i) {
                            this.activeSources[i].update({
                                arrange: {
                                    index: i,
                                    trs: transition.in
                                }
                            });
                        }
                    } else {
                        this.activeSources.splice(i, 1), i--, l--;
                    }
                }

                this.filterUpdate(transition);
            }
        }

        transition.start();
    }
    /**
     * Called by the ModelContainer when Models have been removed from its set.
     *
     * @param      {Array}  items   An array of items no longer stored in the ModelContainer. 
     */
    removed(items, transition = glow.createTransition()) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            for (let j = 0; j < this.sources.length; j++) {
                let Source = this.sources[j];
                if (Source.model == item) {
                    this.sources.splice(j, 1);
                    Source.transitionOut(transition, "", true);
                    break;
                }
            }
        }
        this.filterUpdate(transition);
    }
    /**
     * Called by the ModelContainer when Models have been added to its set.
     *
     * @param      {Array}  items   An array of new items now stored in the ModelContainer. 
     */
    added(items, transition = glow.createTransition()) {
        for (let i = 0; i < items.length; i++) {
            let mgr = this.package.mount(null, items[i], false, undefined, this.parent);
            //mgr.sources.forEach((s) => {
            //    s.parent = this.parent;
            //});
            this.sources.push(mgr);
        }
        for (let i = 0; i < this.sources.length; i++) {
            //this.parent.addSource(this.sources[i]);
        }
        this.filterUpdate(transition);
    }
    revise() {
        if (this.cache) this.update(this.cache);
    }
    getTerms() {
        let out_terms = [];
        for (let i = 0, l = this.terms.length; i < l; i++) {
            let term = this.terms[i].term;
            if (term) out_terms.push(term);
        }
        if (out_terms.length == 0) return null;
        return out_terms;
    }
    get() {
        if (this.model instanceof MultiIndexedContainer) {
            if (this.data.index) {
                let index = this.data.index;
                let query = {};
                query[index] = this.getTerms();
                return this.model.get(query)[index];
            } else console.warn("No index value provided for MultiIndexedContainer!");
        } else {
            let source = this.model.source;
            let terms = this.getTerms();
            if (source) {
                this.model.destroy();
                let model = source.get(terms, null);
                model.pin();
                model.addView(this);
            }
            return this.model.get(terms);
        }
        return [];
    }
    down(data, changed_values) {
        for (let i = 0, l = this.activeSources.length; i < l; i++) this.activeSources[i].down(data, changed_values);
    }
    transitionIn(transition) {
        return;
        for (let i = 0, l = this.activeSources.length; i < l; i++) {
            this.ele.appendChild(this.activeSources[i].element);
            this.activeSources[i].transitionIn(transition);
            this.activeSources[i].update({
                arrange: {
                    index: i,
                    trs: transition.trs_in
                }
            });
        }
    }
    transitionOut(transition) {
        return;
        for (let i = 0, l = this.activeSources.length; i < l; i++) this.activeSources[i].transitionOut(transition);
    }
}

SourceContainer.prototype.removeIO = Tap.prototype.removeIO;
SourceContainer.prototype.addIO = Tap.prototype.addIO;
