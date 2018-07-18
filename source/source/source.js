import { SourceBase } from "./base"

import { ModelBase } from "../model/base"

import { Getter } from "../network/getter"

export class Source extends SourceBase {

    /**
     *   In the Wick dynamic template system, Sources serve as the primary access to Model data. They, along with {@link SourceTemplate}s, are the only types of objects the directly bind to a Model. When a Model is updated, the Source will transmit the updated data to their descendants, which are comprised of {@link Tap}s and {@link SourceTemplate}s.
     *   A Source will also bind to an HTML element. It has no methodes to update the element, but it's descendants, primarily instances of the {@link IO} class, can update attributes and values of then element and its sub-elements.
     *   @param {Source} parent - The parent {@link Source}, used internally to build a hierarchy of Sources.
     *   @param {Object} data - An object containing HTMLELement attribute values and any other values produced by the template parser.
     *   @param {Presets} presets - An instance of the {@link Presets} object.
     *   @param {external:HTMLElement} element - The HTMLElement the Source will bind to.
     *   @memberof module:wick~internals.source
     *   @alias Source
     *   @extends SourceBase
     */
    constructor(parent = null, data, presets, element) {

        super(parent, data, presets, element)

        /**
         *@type {Boolean} 
         *@protected
         */
        this.USE_SECURE = presets.USE_HTTPS;
        this.named_elements = {};
        this.template = null;
        this.prop = null;
        this.presets = presets;
        this.receiver = null;
        this.query = {};
        this.REQUESTING = false;
        this.exports = null;
        this.schema = null;
        this._m = null;

        if (data.schema)
            this.schema = presets.schemas[data.schema];
        if (data._m)
            this._m = presets.models[data._m]

        this.filter_list = [];
        this.templates = [];
        this.filters = [];

    }

    destroy() {

        this.parent = null;

        if (this.receiver)
            this.receiver.destroy();

        for (let i = 0, l = this.templates.length; i < l; i++)
            this.templates[i].destroy();

        super.destroy();
    }

    /**
        Sets up Model connection or creates a new Model from a schema.
    */
    load(model) {

        this.ACTIVE = true;

        if (this.data.url) {
            //import query info from the wurl
            let str = this.data.url;
            let cassettes = str.split(";");
            this.data.url = cassettes[0];

            for (var i = 1; i < cassettes.length; i++) {
                let cassette = cassettes[i];

                switch (cassette[0]) {
                    case "p":
                        //TODO
                        this.url_parent_import = cassette.slice(1)
                        break;
                    case "q":
                        this.url_query = cassette.slice(1);
                        break;
                    case "<":
                        this.url_return = cassette.slice(1);
                }
            }
        }

        this.prop = this.data.prop;

        if (this.data.export) this.exports = this.data.export;

        if (this._m) {
            model = this._m;
            this._m = null;
        }

        if (model && model instanceof ModelBase) {

            if (this.schema) {
                /* Opinionated Source - Only accepts Models that are of the same type as its schema.*/
                if (model.constructor != this.schema) {
                    //throw new Error(`Model Schema ${this._m.schema} does not match Source Schema ${presets.schemas[this.data.schema].schema}`)
                } else
                    this.schema = null;

            }
            this._m = null;
        }

        if (this.schema)
            model = new this.schema();

        model.addView(this);

        if (this._m) {
            if (this.data.url) {
                this.receiver = new Getter(this.data.url, this.url_return);
                this.receiver.setModel(model);
                this.____request____();
            }
        } else
            throw new Error(`No Model could be found for Source constructor! Source schema "${this.data.schema}", "${this.presets.schemas[this.data.schema]}"; Source model "${this.data._m}", "${this.presets.models[this.data._m]}";`);

        for (var i = 0; i < this.children.length; i++)
            this.children[i].load(this._m);


    }

    ____request____(query) {

        this.receiver.get(query, null, this.USE_SECURE).then(() => {
            this.REQUESTING = false;
        });
        this.REQUESTING = true;
    }

    export (exports) {

        this.updateSubs(this.children, exports, true);

        super.export(exports);
    }

    up(data) {
        this._m.add(data);
    }

    update(data, changed_values) {
        if (this.ACTIVE)
            this.__down__(data, changed_values);
    }

    transitionIn(index = 0) {

        super.transitionIn(index)
        return

        let transition_time = 0;

        for (let i = 0, l = this.templates.length; i < l; i++)
            transition_time = Math.max(transition_time, this.templates[i].transitionIn(index));

        transition_time = Math.max(transition_time, super.transitionIn(index));

        this.updateDimensions();

        return transition_time;
    }

    /**
        Takes as an input a list of transition objects that can be used
    */
    transitionOut(index = 0, DESTROY = false) {

        let transition_time = 0;

        for (let i = 0, l = this.templates.length; i < l; i++)
            transition_time = Math.max(transition_time, this.templates[i].transitionOut(index));

        transition_time = Math.max(transition_time, super.transitionOut(index, DESTROY));

        return transition_time;
    }

    finalizeTransitionOut() {

        for (let i = 0, l = this.templates.length; i < l; i++)
            this.templates[i].finalizeTransitionOut();

        super.finalizeTransitionOut();
    }

    setActivating() {
        if (this.parent)
            this.parent.setActivating();
    }

    getNamedElements(named_elements) {
        for (let comp_name in this.named_elements)
            named_elements[comp_name] = this.named_elements[comp_name];
    }
}