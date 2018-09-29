import {
    ModelContainerBase
} from "../model/container/base";
import {
    MultiIndexedContainer
} from "../model/container/multi";
import {
    Scheduler
} from "../common/scheduler";
import {
    View
} from "../view/view";
import {
    Transitioneer
} from "../animation/transitioneer";
/**
 * SourceTemplate provide the mechanisms for dealing with lists and sets of components. 
 *
 * @param      {Source}  parent   The Source parent object.
 * @param      {Object}  data     The data object hosting attribute properties from the HTML template. 
 * @param      {Object}  presets  The global presets object.
 * @param      {HTMLElement}  element  The element that the Source will _bind_ to. 
 */
export class SourceTemplate extends View {

    constructor(parent, presets, element) {

        super();

        this.ele = element;
        this.parent = null;
        this.activeSources = [];
        this.dom_sources = [];
        this._filters_ = [];
        this._ios_ = [];
        this.terms = [];
        this.sources = [];
        this.range = null;
        this._SCHD_ = 0;
        this._prop_ = null;
        this._package_ = null;
        this.transition_in = 0;
        this.offset = 0;
        this.limit = 0;
        this.dom_dn = [];
        this.dom_up = [];
        this.trs_up = null;
        this.trs_dn = null;
        this.scrub_v = 0;
        this.old_scrub = 0;
        this.scrub_offset = 0;
        this.UPDATE_FILTER = false;
        this.time = 0;
        this.dom_up_appended = false;
        this.dom_dn_appended = false;
        this.root = 0;
        this.sco = 0;
        this.AUTO_SCRUB = false;
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

    _update_(container) {
        if (container instanceof ModelContainerBase) container = container.get();
        if (!container) return;
        //let results = container.get(this.getTerms());
        // if (container.length > 0) {
        if (Array.isArray(container)) this.cull(container);
        else this.cull(container.data);
        // }
    }


    /**
     * Called by Scheduler when a change is made to the Template HTML structure. 
     * 
     * @protected
     */
    _scheduledUpdate_() {

        if (this.SCRUBBING) {
            if (!this.AUTO_SCRUB) {
                this.SCRUBBING = false;
                return;
            }

            if (
                Math.abs(this.sscr) > 0.0001
            ) {
                this.ssoc += this.sscr;
                this.scrub(this.ssoc);
                this.sscr *= (this.drag);

                let pos = this.old_scrub - this.scrub_offset + this.offset;

                if (!((this.sscr < 0 || pos < this.max) &&
                        (this.sscr > 0 || pos > 0))) {
                    this.sscr = 0;
                }
                Scheduler.queueUpdate(this);
            } else {
                this.scrub_v = 0;
                this.scrub(Infinity);
                this.old_scrub = 0;
                this.SCRUBBING = false;
            }
        } else if (this.UPDATE_FILTER) {
            this.filterUpdate();
        } else {
            this.limitUpdate();
        }
    }

    /**
     * Scrub provides a mechanism to scroll through pages of a container that has been limited through the limit filter.
     * @param  {Number} scrub_amount [description]
     */
    scrub(scrub_amount, SCRUBBING = true) {
        this.SCRUBBING = true;

        if (this.AUTO_SCRUB && !SCRUBBING && scrub_amount != Infinity) {
            this.root = this.offset;
            this.sco = this.old_scrub;
            this.old_scrub += scrub_amount;
            this.AUTO_SCRUB = false;
        }

        if (scrub_amount !== Infinity) {
            scrub_amount += this.sco;

            let s = scrub_amount - this.scrub_offset;

            if (s > 1) {
                //Make Sure the the transition animation is completed before moving on to new animation sequences.
                this.trs_up.play(1);
                this.scrub_offset++;
                s = scrub_amount - this.scrub_offset;
                this.render(null, this.activeSources, this.limit, this.offset + 1, true);
            } else if (s < -1) {
                this.trs_dn.play(1);
                this.scrub_offset--;
                s = scrub_amount - this.scrub_offset;
                this.render(null, this.activeSources, this.limit, this.offset - 1, true);
            }

            this.scrub_v = scrub_amount - this.old_scrub;
            this.old_scrub = scrub_amount;

            if (s > 0) {

                if (this.offset >= this.max) {
                    if (s > 0) s = 0;
                }


                if (!this.dom_up_appended) {

                    for (let i = 0; i < this.dom_up.length; i++) {
                        this.dom_up[i]._appendToDOM_(this.ele);
                        this.dom_up[i].index = -1;
                        this.dom_sources.push(this.dom_up[i]);
                    }
                    this.dom_up_appended = true;
                }

                this.time = this.trs_up.play(s);
            } else {

                if (this.offset < 1 && s < 0) {
                    s = 0;
                    this.scrub_v = 0;
                }

                if (!this.dom_dn_appended) {

                    for (let i = 0; i < this.dom_dn.length; i++) {
                        this.dom_dn[i]._appendToDOM_(this.ele, this.dom_sources[0].ele);
                        this.dom_dn[i].index = -1;
                    }

                    this.dom_sources = this.dom_dn.concat(this.dom_sources);


                    this.dom_dn_appended = true;
                }

                this.time = this.trs_dn.play(-s);
            }
        } else {
            this.sco = 0;

            if (Math.abs(this.scrub_v) > 0.000001) {

                if (Math.abs(this.scrub_v) < 0.05) this.scrub_v = 0.05 * Math.sign(this.scrub_v);
                if (Math.abs(this.scrub_v) > 0.2) this.scrub_v = 0.2 * Math.sign(this.scrub_v);

                this.AUTO_SCRUB = true;

                //Determine the distance traveled and normal drag decay of 0.5
                let dist = this.scrub_v * (1 / (-0.5 + 1));

                //get the distance to nearest page given the distance traveled
                let nearest = (this.root + this.old_scrub + dist - this.scrub_offset);

                nearest = (this.scrub_v > 0) ? Math.min(this.max, Math.ceil(nearest)) : Math.max(0, Math.floor(nearest));

                //get the ratio of the distance from the current position and distance to the nearest 
                let nearest_dist = nearest - (this.root + this.old_scrub - this.scrub_offset);
                let ratio = nearest_dist / this.scrub_v;
                let drag = Math.abs(1 - (1 / ratio));

                this.drag = drag;
                this.sscr = this.scrub_v;
                this.ssoc = this.old_scrub;
                this.SCRUBBING = true;
                Scheduler.queueUpdate(this);
            } else {
                let pos = Math.round(this.old_scrub - this.scrub_offset + this.offset);
                this.render(null, this.activeSources, this.limit, pos, true).play(1);
                this.scrub_offset = 0;
            }
        }
    }

    render(transition, output = this.activeSources, limit = this.limit, offset = this.offset, NO_TRANSITION = false) {
        let j = 0,
            ol = output.length,
            al = this.dom_sources.length;

        let direction = true;

        let OWN_TRANSITION = false;

        if (!transition) transition = Transitioneer.createTransition(), OWN_TRANSITION = true;

        offset = Math.max(0, offset);
        
        if (limit > 0) {

            direction = this.offset < offset;
            let ein = [];
            let pages = Math.ceil(ol / limit);
            this.max = pages - 1;
            this.offset = Math.max(0, Math.min(pages - 1, offset));
            this.root = this.offset;
            let off = this.offset * limit;

            this.trs_up = Transitioneer.createTransition(false);
            this.trs_dn = Transitioneer.createTransition(false);
            this.dom_dn.length = 0;
            this.dom_up.length = 0;
            this.dom_up_appended = false;
            this.dom_dn_appended = false;

            let i = 0;

            while (i < off - limit) output[i++].index = -2;

            while (i < off) {
                this.dom_dn.push(output[i]);
                output[i]._update_({
                    trs_in_dn: {
                        index: 0,
                        trs: this.trs_dn.in
                    }
                });
                output[i++].index = -2;
            }

            while (i < off + limit && i < ol) {
                output[i]._update_({
                    trs_out_dn: {
                        trs: this.trs_up.out,
                        index: 0
                    }
                });
                output[i]._update_({
                    trs_out_up: {
                        trs: this.trs_dn.out,
                        index: 0
                    }
                });
                output[i].index = 0, ein.push(output[i++]);
            }

            while (i < off + limit * 2 && i < ol) {
                this.dom_up.push(output[i]);
                output[i]._update_({
                    trs_in_up: {
                        index: 0,
                        trs: this.trs_up.in
                    }
                });
                output[i++].index = -3;
            }

            while (i < ol) output[i++].index = -3;

            output = ein;

            ol = ein.length;

            this.limit = limit;
        } else{
            this.max = 0;
            this.limit = 0;
        }

        let trs_in = {
            trs: transition.in,
            index: 0
        };

        let trs_out = {
            trs: transition.out,
            index: 0
        };


        for (let i = 0; i < ol; i++) output[i].index = i;
        for (let i = 0; i < ol; i++) output[i].index = i;

        for (let i = 0; i < al; i++) {
            let as = this.dom_sources[i];
            if (as.index > j) {
                let ele = as.element;
                while (j < as.index && j < ol) {
                    let os = output[j];
                    os.index = j;
                    os._appendToDOM_(this.ele, ele);
                    trs_in.index = j;
                    os.index = -1;
                    os._transitionIn_(trs_in, (direction) ? "trs_in_up" : "trs_in_dn");
                    j++;
                }
            } else if (as.index < 0) {
                if (!NO_TRANSITION) {
                    switch (as.index) {
                        case -2:
                        case -3:
                            as._transitionOut_(trs_out, (direction) ? "trs_out_dn" : "trs_out_up");
                            break;
                        default:
                            as._transitionOut_(trs_out);
                    }
                } else {
                    as._transitionOut_();
                }
            } else {
                //if (i !== j) 
                trs_in.index = j;
                as._update_({
                    arrange: trs_in
                });
                as._TRANSITION_STATE_ = true;
                j++;
            }
            as.index = -1;
        }

        while (j < output.length) {
            output[j]._appendToDOM_(this.ele);
            output[j].index = -1;
            trs_in.index = j;
            output[j]._transitionIn_(trs_in, (direction) ? "trs_in_up" : "trs_in_dn");
            j++;
        }

        this.ele.style.position = this.ele.style.position;

        this.dom_sources = output;

        if (OWN_TRANSITION)
            if (NO_TRANSITION) {
                return transition;
            } else {
                transition.start();
            }

        this.parent._upImport_("template_count_changed", {
            displayed: ol,
            count: this.activeSources.length,
            pages: this.max,
            ele: this.ele,
            template: this,
            trs: transition.in
        });


        return transition;
    }

    limitUpdate(transition, output) {

        let limit = this.limit,
            offset = 0;

        for (let i = 0, l = this._filters_.length; i < l; i++) {
            let filter = this._filters_[i];
            if (filter._CAN_USE_) {
                if (filter._CAN_LIMIT_) limit = filter._value_;
                if (filter._CAN_OFFSET_) offset = filter._value_;
            }
        }

        this.SCRUBBING = false;
        this.scrub_offset = 0;
        this.scrub_v = 0;

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
        for (let i = 0, l = this._filters_.length; i < l; i++) {
            let filter = this._filters_[i];
            if (filter._CAN_USE_) {
                if (filter._CAN_FILTER_) output = output.filter(filter._filter_function_._filter_expression_);
                if (filter._CAN_SORT_) output = output.sort(filter._sort_function_);
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
    cull(new_items) {
        if (!new_items) new_items = [];
        let transition = Transitioneer.createTransition();
        if (new_items.length == 0) {
            let sl = this.sources.length;
            for (let i = 0; i < sl; i++) this.sources[i]._transitionOut_(transition, "", true);
            this.sources.length = 0;
            if (sl > 0) this.parent._upImport_("template_empty", {
                template: this,
                ele: this.ele,
                trs: transition.out
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
                    this.sources[i]._transitionOut_(transition, "", true);
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
                            this.activeSources[i]._update_({
                                arrange: {
                                    index: i,
                                    trs: transition.in
                                }
                            });
                        }
                    } else this.activeSources.splice(i, 1), i--, l--;
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
    removed(items, transition = Transitioneer.createTransition()) {
        debugger
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            for (let j = 0; j < this.sources.length; j++) {
                let Source = this.sources[j];
                if (Source._model_ == item) {
                    this.sources.splice(j, 1);
                    Source._transitionOut_(transition, "", true);
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
    added(items, transition = Transitioneer.createTransition()) {
        for (let i = 0; i < items.length; i++) {
            let mgr = this._package_.mount(null, items[i], false);
            mgr.sources.forEach((s) => {
                s.parent = this.parent;
            });
            this.sources.push(mgr);
        }
        for (let i = 0; i < this.sources.length; i++) {
            //this.parent.addSource(this.sources[i]);
        }
        this.filterUpdate(transition);
    }
    revise() {
        if (this.cache) this._update_(this.cache);
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
        if (this._model_ instanceof MultiIndexedContainer) {
            if (this.data.index) {
                let index = this.data.index;
                let query = {};
                query[index] = this.getTerms();
                return this._model_.get(query)[index];
            } else console.warn("No index value provided for MultiIndexedContainer!");
        } else {
            let source = this._model_.source;
            let terms = this.getTerms();
            if (source) {
                this._model_._destroy_();
                let model = source.get(terms, null);
                model.pin();
                model.addView(this);
            }
            return this._model_.get(terms);
        }
        return [];
    }
    _down_(data, changed_values) {
        for (let i = 0, l = this.activeSources.length; i < l; i++) this.activeSources[i]._down_(data, changed_values);
    }
    _transitionIn_(transition) {
        return;
        for (let i = 0, l = this.activeSources.length; i < l; i++) {
            this.ele.appendChild(this.activeSources[i].element);
            this.activeSources[i]._transitionIn_(transition);
            this.activeSources[i]._update_({
                arrange: {
                    index: i,
                    trs: transition.trs_in
                }
            });
        }
    }
    _transitionOut_(transition) {
        return;
        for (let i = 0, l = this.activeSources.length; i < l; i++) this.activeSources[i]._transitionOut_(transition);
    }
}