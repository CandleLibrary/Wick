import { Model } from "../model/model_revised";
import { Tap } from "./tap/tap";
import { View } from "../view/view";


export class Source extends View {

    /**
     *   In the Wick dynamic template system, Sources serve as the primary access to Model data. They, along with {@link SourceTemplate}s, are the only types of objects the directly _bind_ to a Model. When a Model is updated, the Source will transmit the updated data to their descendants, which are comprised of {@link Tap}s and {@link SourceTemplate}s.
     *   A Source will also _bind_ to an HTML element. It has no methodes to _update_ the element, but it's descendants, primarily instances of the {@link IO} class, can _update_ attributes and values of then element and its sub-elements.
     *   @param {Source} parent - The parent {@link Source}, used internally to build a hierarchy of Sources.
     *   @param {Object} data - An object containing HTMLELement attribute values and any other values produced by the template parser.
     *   @param {Presets} presets - An instance of the {@link Presets} object.
     *   @param {HTMLElement} element - The HTMLElement the Source will _bind_ to.
     *   @memberof module:wick~internals.source
     *   @alias Source
     *   @extends SourceBase
     */
    constructor(parent, presets, element, ast) {
        super();

        this.ast = ast;
        /**
         *@type {Boolean} 
         *@protected
         */
        this.DESTROYED = false;

        this.parent = parent;
        this.ele = element;
        this._presets_ = presets;
        this._model_ = null;
        this._statics_ = null;

        this.taps = {};
        this.children = [];
        this.sources = [];
        this._ios_ = [];
        this._templates_ = [];
        this.hooks = [];

        this._model_name_ = "";
        this._schema_name_ = "";

        this.addToParent();
    }

    _destroy_() {

        this.DESTROYED = true;

        if (this.LOADED) {


            let t = this.transitionOut();

            for (let i = 0, l = this.children.length; i < l; i++) {
                let child = this.children[i];

                t = Math.max(t, child.transitionOut());
            }

            if (t > 0)
                setTimeout(() => { this._destroy_(); }, t * 1000 + 5);


        } else {
            //this.finalizeTransitionOut();
            this.children.forEach((c) => c._destroy_());
            this.children.length = 0;
            this.data = null;

            if (this.ele && this.ele.parentElement)
                this.ele.parentElement.removeChild(this.ele);

            this.ele = null;

            for (let i = 0, l = this.sources.length; i < l; i++)
                this.sources[i]._destroy_();


            super._destroy_();
        }
    }

    addToParent() {
        if (this.parent)
            this.parent.sources.push(this);
    }

    addTemplate(template) {
        template.parent = this;
        this._templates_.push(template);
    }

    addSource(source) {
        if (source.parent == this)
            return;
        source.parent = this;
        this.sources.push(source);
    }

    getTap(name) {
        let tap = this.taps[name];
        if (!tap)
            tap = this.taps[name] = new Tap(this, name);
        return tap;
    }

    /**
     * Return an array of Tap objects that
     * match the input array.
     */

    _linkTaps_(tap_list) {
        let out_taps = [];
        for (let i = 0, l = tap_list.length; i < l; i++) {
            let tap = tap_list[i];
            let name = tap.name;
            if (this.taps[name])
                out_taps.push(this.taps[name]);
            else {
                this.taps[name] = new Tap(this, name, tap._modes_);
                out_taps.push(this.taps[name]);
            }
        }

        return out_taps;
    }

    /**
        Sets up Model connection or creates a new Model from a schema.
    */
    load(model) {

        let m = this._presets_.models[this._model_name_];
        
        let s = this._presets_.schemas[this._schema_name_];

        if (m)
            model = m;
        else if (s)
            model = new s(model);
        else if (!model)
            model = new Model(model);

        for (let i = 0, l = this.sources.length; i < l; i++)
            this.sources[i].load(model);

        model.addView(this);

        for (let name in this.taps)
            this.taps[name].load(this._model_, false);
    }

    _down_(data, changed_values) {
        this._update_(data, changed_values, true);
    }

    _up_(tap, data, meta) {
        if (this.parent)
            this.parent._upImport_(tap._prop_, data, meta);
    }

    _upImport_(prop_name, data, meta) {
        if (this.taps[prop_name])
            this.taps[prop_name]._up_(data, meta);
    }

    _update_(data, changed_values, IMPORTED = false) {

        if (changed_values) {
            for (let name in changed_values)
                if (this.taps[name])
                    this.taps[name]._down_(data, IMPORTED);
        } else
            for (let name in this.taps)
                this.taps[name]._down_(data, IMPORTED);

        for (let i = 0, l = this.sources.length; i < l; i++)
            this.sources[i]._down_(data, changed_values);
    }
}