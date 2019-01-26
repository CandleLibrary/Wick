import { Model } from "../model/model";
import { Tap, UpdateTap } from "./tap/tap";
import { View } from "../view";


export class Source extends View {

    /**
     *   In the Wick dynamic template system, Sources serve as the primary access to Model data. They, along with {@link SourceTemplate}s, are the only types of objects the directly _bind_ to a Model. When a Model is updated, the Source will transmit the updated data to their descendants, which are comprised of {@link Tap}s and {@link SourceTemplate}s.
     *   A Source will also _bind_ to an HTML element. It has no methodes to update the element, but it's descendants, primarily instances of the {@link IO} class, can update attributes and values of then element and its sub-elements.
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

        this.ast = null;

        ast.setSource(this);
        
        /**
         *@type {Boolean} 
         *@protected
         */


        this.parent = parent;
        this.ele = element;
        this.presets = presets;
        this.model = null;
        this.statics = null;

        this.taps = {};
        this.update_tap = null;
        this.children = [];
        this.sources = [];
        this.badges = {};
        this.ios = [];
        this.templates = [];
        this.hooks = [];

        this._model_name_ = "";
        this._schema_name_ = "";

        this.DESTROYED = false;
        this.LOADED = false;

        this.addToParent();
    }

    destroy() {

        this.DESTROYED = true;

        this.update({ destroyed: true });

        if (this.LOADED) {
            this.LOADED = false;


            let t = 0; //this.transitionOut();
            /*
            for (let i = 0, l = this.children.length; i < l; i++) {
                let child = this.children[i];

                t = Math.max(t, child.transitionOut());
            }
            */
            if (t > 0)
                return setTimeout(() => { this.destroy(); }, t * 1000 + 5);
        }

        if (this.parent && this.parent.removeSource)
            this.parent.removeSource(this);
        //this.finalizeTransitionOut();
        this.children.forEach((c) => c.destroy());
        this.children.length = 0;
        this.data = null;

        if (this.ele && this.ele.parentElement)
            this.ele.parentElement.removeChild(this.ele);

        this.ele = null;

        for (let i = 0, l = this.sources.length; i < l; i++)
            this.sources[i].destroy();


        super.destroy();

    }

    getBadges(par) {
        for (let a in this.badges) {
            if (!par.badges[a])
                par.badges[a] = this.badges[a];
        }
    }

    addToParent() {
        if (this.parent)
            this.parent.sources.push(this);
    }

    addTemplate(template) {
        template.parent = this;
        this.templates.push(template);
    }

    addSource(source) {
        if (source.parent == this)
            return;
        source.parent = this;
        this.sources.push(source);
    }

    removeSource(source) {
        if (source.parent !== this)
            return;

        for (let i = 0; i < this.sources.length; i++)
            if (this.sources[i] == source)
                return (this.sources.splice(i, 1), source.parent = null);
    }

    removeIO(io) {
        for (let i = 0; i < this.ios.length; i++)
            if (this.ios[i] == io)
                return (this.ios.splice(i, 1), io.parent = null);
    }

    getTap(name) {
        let tap = this.taps[name];

        if (!tap) {
            if (name == "update")
                this.update_tap = new UpdateTap(this, name);
            else
                tap = this.taps[name] = new Tap(this, name);
        }
        return tap;
    }

    /**
     * Return an array of Tap objects that
     * match the input array.
     */

    linkTaps(tap_list) {
        let out_taps = [];
        for (let i = 0, l = tap_list.length; i < l; i++) {
            let tap = tap_list[i];
            let name = tap.name;
            if (this.taps[name])
                out_taps.push(this.taps[name]);
            else {
                let bool = name == "update";
                let t = bool ? new UpdateTap(this, name, tap.modes) : new Tap(this, name, tap.modes);

                if (bool)
                    this.update_tap = t;

                this.taps[name] = t;
                out_taps.push(this.taps[name]);
            }
        }

        return out_taps;
    }

    /**
        Makes the source a view of the given Model. If no model passed, then the source will bind to another model depending on its `scheme` or `model` attributes. 
    */
    load(model) {
        let m = null, s = null;

      if(this.presets.models)
            m = this.presets.models[this._model_name_];
        if(this.presets.schemas)
            s = this.presets.schemas[this._schema_name_];
        
        if (m)
            model = m;
        else if (s) {
            model = new s();
        } else if (!model)
            model = new Model(model);

        let LOADED = this.LOADED;

        this.LOADED = true;

        for (let i = 0, l = this.sources.length; i < l; i++) {
            this.sources[i].load(model);
            this.sources[i].getBadges(this);
        }

        if(model.addView)
            model.addView(this);

        this.model = model;
        

        for (let name in this.taps)
            this.taps[name].load(this.model, false);

        if(!LOADED)
            this.update({ created: true });
    }

    down(data, changed_values) {
        this.update(data, changed_values, true);
    }

    up(tap, data, meta) {
        if (this.parent)
            this.parent.upImport(tap.prop, data, meta, this);
    }

    upImport(prop_name, data, meta) {
        if (this.taps[prop_name])
            this.taps[prop_name].up(data, meta);
    }

    update(data, changed_values, IMPORTED = false) {

        if (this.update_tap)
            this.update_tap.downS(data, IMPORTED);

        if (changed_values) {

            for (let name in changed_values)
                if (this.taps[name])
                    this.taps[name].downS(data, IMPORTED);
        } else
            for (let name in this.taps)
                this.taps[name].downS(data, IMPORTED);

        //        for (let i = 0, l = this.sources.length; i < l; i++)
        //            this.sources[i].down(data, changed_values);

        for (let i = 0, l = this.templates.length; i < l; i++)
            this.templates[i].down(data, changed_values);
    }

    transitionIn(transition) {

        if (this.taps.trs_in)
            this.taps.trs_in.downS(transition);

        for (let i = 0, l = this.sources.length; i < l; i++)
            this.sources[i].transitionIn(transition);

        for (let i = 0, l = this.templates.length; i < l; i++)
            this.templates[i].transitionIn(transition);
    }

    transitionOut(transition) {
        if (this.taps.trs_out)
            this.taps.trs_out.downS(transition);

        for (let i = 0, l = this.sources.length; i < l; i++)
            this.sources[i].transitionOut(transition);


        for (let i = 0, l = this.templates.length; i < l; i++)
            this.templates[i].transitionOut(transition);
    }

    bubbleLink(child) {
        if (child)
            for (let a in child.badges)
                this.badges[a] = child.badges[a];
        if (this.parent)
            this.parent.bubbleLink(this);
    }
}
