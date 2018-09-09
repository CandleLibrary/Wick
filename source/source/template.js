import { ModelContainerBase } from "../model/container/base";

import { MultiIndexedContainer } from "../model/container/multi";

import { Scheduler } from "../common/scheduler";

import { View } from "../view/view";

import { Transitioneer } from "../animation/transitioneer";


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

        //super(parent, presets, element);
        this.ele = element;
        this.parent = null;
        this.activeSources = [];
        this._filters_ = [];
        this._ios_ = [];
        this.terms = [];
        this.sources = [];
        this.range = null;
        this._SCHD_ = 0;
        this._prop_ = null;
        this._package_ = null;
        this.transition_in = 0;

        parent.addTemplate(this);
    }

    get data() {}
    set data(container) {

        if (container instanceof ModelContainerBase) {
            container.pin();
            container.addView(this);
            //this._update_(container);
            return;
        }


        if (!container) return;

        //if (container.length > 0) {
        if (Array.isArray(container))
            this.cull(container);
        else
            this.cull(container.data);
        //}

    }

    _update_(container) {

        if (container instanceof ModelContainerBase)
            container = container.get();
        
        if (!container) return;

        //let results = container.get(this.getTerms());
        // if (container.length > 0) {
        if (Array.isArray(container))
            this.cull(container);
        else
            this.cull(container.data);
        // }
    }

    /**
     * Called by Scheduler when a change is made to the Template HTML structure. 
     * 
     * @protected
     */
    _scheduledUpdate_() {
        for (let i = 0; i < this.activeSources.length; i++)
            this.activeSources[i]._transitionIn_(i);
    }

    /**
     * Filters stored Sources with search terms and outputs the matching Sources to the DOM.
     * 
     * @protected
     */
    filterUpdate() {
        let output = this.sources.slice();

        if (output.length < 1) return;

        let transition = Transitioneer.createTransition();
        let trs_in = transition.in;
        let trs_out = transition.out;

        for (let i = 0, l = this._filters_.length; i < l; i++) {
            let filter = this._filters_[i];

            if (filter._CAN_USE_) {

                if (filter._CAN_FILTER_)
                    output = output.filter(filter._filter_function_._filter_expression_);

                if (filter._CAN_SORT_)
                    output = output.filter(filter._sort_function_);
            }
        }

        let j = 0,
            ol = output.length;

        for (let i = 0; i < ol; i++)
            output[i].index = i;

        for (let i = 0; i < this.activeSources.length; i++) {
            let as = this.activeSources[i];
            if (as.index > j) {
                let ele = as.element;
                while (j < as.index && j < ol) {
                    let os = output[j];
                    os.index = -1;
                    this.ele.insertBefore(os.element, ele);
                    os._transitionIn_(trs_in);
                    os._update_({arrange:{index:j, trs: trs_in}});
                    j++;
                }
                j++;
            } else if (as.index < 0) {
                as._transitionOut_(trs_out);
            } else {
                as._update_({arrange:{index:j, trs: trs_in}});
                j++;
            }
            as.index = -1;
        }

        while (j < output.length) {
            this.ele.appendChild(output[j].element);
            output[j].index = -1;
            output[j]._transitionIn_(trs_in);
            output[j]._update_({arrange:{index:j, trs: trs_in}});
            j++;
        }

        this.ele.style.position = this.ele.style.position;

        this.activeSources = output;

        this.parent._upImport_("t_limit", output.length);

        Scheduler.queueUpdate(this);

        transition.start();
    }

    /**
     * Removes stored Sources that do not match the ModelContainer contents. 
     *
     * @param      {Array}  new_items  Array of Models that are currently stored in the ModelContainer. 
     * 
     * @protected
     */
    cull(new_items) {

        if (!new_items) return;

        if (new_items.length == 0) {
            for (let i = 0, l = this.sources.length; i < l; i++)
                this.sources[i]._transitionOut_(true);

            this.sources.length = 0;

            this.parent._upImport_("t_limit", 0);
        } else {

            let exists = new Map(new_items.map(e => [e, true]));

            var out = [];

            for (let i = 0, l = this.activeSources.length; i < l; i++)
                if (exists.has(this.activeSources[i].model))
                    exists.set(this.activeSources[i].model, false);

            for (let i = 0, l = this.sources.length; i < l; i++)
                if (!exists.has(this.sources[i].model)) {
                    this.sources[i]._transitionOut_(true);
                    this.sources.splice(i, 1);
                    l--;
                    i--;
                } else
                    exists.set(this.sources[i].model, false);

            exists.forEach((v, k, m) => { if (v) out.push(k); });

            if (out.length > 0)
                this.added(out);

        }
    }

    /**
     * Called by the ModelContainer when Models have been removed from its set.
     *
     * @param      {Array}  items   An array of items no longer stored in the ModelContainer. 
     */
    removed(items) {

        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            for (let j = 0; j < this.sources.length; j++) {
                let Source = this.sources[j];

                if (Source._model_ == item) {
                    this.sources.splice(j, 1);
                    Source.dissolve();
                    break;
                }
            }
        }

        this.filterUpdate();
    }

    /**
     * Called by the ModelContainer when Models have been added to its set.
     *
     * @param      {Array}  items   An array of new items now stored in the ModelContainer. 
     */
    added(items) {

        for (let i = 0; i < items.length; i++) {

            let mgr = this._package_.mount(null, items[i], false);

            mgr.sources.forEach((s) => { s.parent = this.parent; });

            this.sources.push(mgr);
        }

        for (let i = 0; i < this.sources.length; i++) {
            this.parent.addSource(this.sources[i]);
        }

        this.filterUpdate();
    }

    revise() {
        if (this.cache)
            this._update_(this.cache);
    }


    getTerms() {

        let out_terms = [];

        for (let i = 0, l = this.terms.length; i < l; i++) {
            let term = this.terms[i].term;
            if (term) out_terms.push(term);

        }


        if (out_terms.length == 0)
            return null;

        return out_terms;
    }

    get() {
        if (this._model_ instanceof MultiIndexedContainer) {
            if (this.data.index) {
                let index = this.data.index;

                let query = {};

                query[index] = this.getTerms();

                return this._model_.get(query)[index];
            } else
                console.warn("No index value provided for MultiIndexedContainer!");
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

    _transitionIn_(transition){        
        for (let i = 0, l = this.activeSources.length; i < l; i++){
            this.activeSources[i]._transitionIn_(transition.trs_in);
            this.activeSources[i]._update_({arrange:{index:i, trs: transition.trs_in}});
        }
    }

    _transitionOut_(transition){
        for (let i = 0, l = this.activeSources.length; i < l; i++)
            this.activeSources[i]._transitionOut_(transition.trs_out);
    }
}