import { _createElement_, _instanceOf_ } from "../common/short_names";

import { MCArray, ModelContainerBase } from "../model/container/base";

import { MultiIndexedContainer } from "../model/container/multi";

import { Scheduler } from "../common/scheduler";

import { View } from "../view/view";


/**
 * Class for template.
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
        this._SCHD_ = false;
        this._prop_ = null;
        this._package_ = null;
        this.transition_in = 0;

        parent.addTemplate(this);
    }

    get data() {}
    set data(v) {
        //New data record from prop expression. Out with old, in with the new.
        //debugger
        let container = v;

        if (container && (_instanceOf_(container, ModelContainerBase) || container._slf_)) {

            this.cache = v;

            let own_container = container.get(this.getTerms(), null);

            if (_instanceOf_(own_container, ModelContainerBase)) {
                own_container.pin();
                own_container.addView(this);
                this.cull(this.get());
            } else if (_instanceOf_(own_container, MCArray)) {
                this.cull(own_container);
            }

        }
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

        let output = this.sources;

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
                let ele = as.ele;
                while (j < as.index && j < ol) {
                    let os = output[j];
                    os.index = -1;
                    this.ele.insertBefore(os.ele, ele);
                    j++;
                }
                j++;
            } else if (as.index < 0) {
                as._transitionOut_();
            } else{
                j++;
            }
            as.index = -1;
        }

        while (j < output.length) {
            this.ele.appendChild(output[j].ele);
            output[j].index = -1;
            j++;
        }

        this.ele.style.position = this.ele.style.position;

        this.activeSources = output;

        Scheduler.queueUpdate(this);
    }

    /**
     * Removes stored Sources that do not match the ModelContainer contents. 
     *
     * @param      {Array}  new_items  Array of Models that are currently stored in the ModelContainer. 
     * 
     * @protected
     */
    cull(new_items) {

        if (new_items.length == 0) {

            for (let i = 0, l = this.sources.length; i < l; i++)
                this.sources[i]._destroy_();

            this.sources.length = 0;

        } else {

            let exists = new Map(new_items.map(e => [e, true]));

            var out = [];

            for (let i = 0, l = this.sources.length; i < l; i++)
                if (!exists.has(this.sources[i].model)) {
                    this.sources[i]._destroy_();
                    this.sources.splice(i, 1);
                    l--;
                    i--;
                } else
                    exists.set(this.sources[i].model, false);


            exists.forEach((v, k, m) => {
                if (v) out.push(k);
            });

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

                if (Source._m == item) {
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
            let ele = _createElement_("li");
            let mgr = this._package_.mount(ele, items[i], false);
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
        if (this._m instanceof MultiIndexedContainer) {
            if (this.data.index) {
                let index = this.data.index;

                let query = {};

                query[index] = this.getTerms();

                return this._m.get(query)[index];
            } else
                console.warn("No index value provided for MultiIndexedContainer!");
        } else {
            let source = this._m.source;
            let terms = this.getTerms();

            if (source) {
                this._m._destroy_();

                let model = source.get(terms, null);

                model.pin();
                model.addView(this);
            }

            return this._m.get(terms);
        }
        return [];
    }
}