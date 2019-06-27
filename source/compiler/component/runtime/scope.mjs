import { Model } from "../../../model/model.mjs";
import { Tap, UpdateTap } from "../tap/tap.mjs";
import Observer from "../../../observer/observer.mjs";


export default class Scope extends Observer {

    /**
     *   In the Wick dynamic template system, Scopes serve as the primary access to Model data. They, along with {@link ScopeContainer}s, are the only types of objects the directly _bind_ to a Model. When a Model is updated, the Scope will transmit the updated data to their descendants, which are comprised of {@link Tap}s and {@link ScopeContainer}s.
     *   A Scope will also _bind_ to an HTML element. It has no methodes to update the element, but it's descendants, primarily instances of the {@link IO} class, can update attributes and values of then element and its sub-elements.
     *   @param {Scope} parent - The parent {@link Scope}, used internally to build a hierarchy of Scopes.
     *   @param {Object} data - An object containing HTMLELement attribute values and any other values produced by the template parser.
     *   @param {Presets} presets - An instance of the {@link Presets} object.
     *   @param {HTMLElement} element - The HTMLElement the Scope will _bind_ to.
     *   @memberof module:wick~internals.scope
     *   @alias Scope
     *   @extends ScopeBase
     */
    constructor(parent, presets, element, ast) {
 
        super();

        this.ast = ast;
        this.ele = element;
        
        //this.presets = presets;
        //this.statics = null;
        this.parent = null;
        this.model = null;
        this.update_tap = null;

        //this.children = [];
        //this.badges = {};
        //this.hooks = [];

        this.ios = [];
        this.taps = {};
        this.scopes = [];
        this.containers = [];
        this.css = [];

        this.DESTROYED = false;
        this.LOADED = false;
        this.CONNECTED = false;
        this.TRANSITIONED_IN = false;
        this.PENDING_LOADS = 1; //set to one for self

        this.addToParent(parent);
    }

    destroy() {

        this.update({destroying:true}); //Lifecycle Events: Destroying <======================================================================

        this.DESTROYED = true;
        this.LOADED = false;

        if (this.parent && this.parent.removeScope)
            this.parent.removeScope(this);

        //this.children.forEach((c) => c.destroy());
        //this.children.length = 0;
        this.data = null;

        if (this.ele && this.ele.parentElement)
            this.ele.parentElement.removeChild(this.ele);

        //for(const io of this.ios)
        //    io.destroy();

        for(const tap in this.taps)
            this.taps[tap].destroy();

        this.taps = null;
        //this.ios = null;
        this.ele = null;

        while (this.scopes[0])
            this.scopes[0].destroy();

        super.destroy();
    }

    addToParent(parent) {
        if (parent)
            parent.addScope(this);        
    }

    addTemplate(template) {
        template.parent = this;
        this.PENDING_LOADS++;
        this.containers.push(template);
    }

    addScope(scope) {
        if (scope.parent == this)
            return;
        scope.parent = this;
        this.scopes.push(scope);
        this.PENDING_LOADS++;
        scope.linkImportTaps(this);
    }

    removeScope(scope) {
        if (scope.parent !== this)
            return;

        for (let i = 0; i < this.scopes.length; i++)
            if (this.scopes[i] == scope)
                return (this.scopes.splice(i, 1), scope.parent = null);
    }

    linkImportTaps(parent_scope){
        for(const tap in this.taps){
            this.taps[tap].linkImport(parent_scope);
        }
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
        Makes the scope a observer of the given Model. If no model passed, then the scope will bind to another model depending on its `scheme` or `model` attributes. 
    */
    load(model) {

        let
            m = null,
            SchemedConstructor = null,
            presets = this.ast.presets,
            model_name = this.ast.model_name,
            scheme_name = this.ast.scheme_name;
            
        if (model_name && this.presets.models)
            m = presets.models[model_name];
        if (scheme_name && presets.schemas){
            SchemedConstructor = presets.schemas[scheme_name];
        }

        if (m)
            model = m;
        else if (SchemedConstructor) {
            model = new SchemedConstructor();
        } else if (!model)
            model = new Model(model);

        if(this.css.length>0)
            this.loadCSS();

        for (let i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].load(model);
            this.scopes[i].getBadges(this);
        }

        if (model.addObserver)
            model.addObserver(this);

        this.model = model;

        for (const tap in this.taps)
            this.taps[tap].load(this.model, false);
        
        this.update({loading:true});  //Lifecycle Events: Loading <======================================================================
        //this.update({loaded:true});  //Lifecycle Events: Loaded <======================================================================
        //this.LOADED = true

        //Allow one tick to happen before acknowledging load
        setTimeout(this.loadAcknowledged.bind(this),1);
    }

    loadCSS(element = this.ele){
        
        for(let i = 0; i < this.css.length; i++){
            const css = this.css[i];

            const rules = css.getApplicableRules(element);

            element.style = (""+rules).slice(1,-1) + "";
        }

        for(let i = 0; i < element.children.length; i++)
            this.loadCSS(element.children[i]);
    }

    loadAcknowledged(){
        //This is called when all elements of responded with a loaded signal.

        if(!this.LOADED && --this.PENDING_LOADS <= 0){
            this.LOADED = true;
            this.update({loaded:true});  //Lifecycle Events: Loaded <======================================================================
            if(this.parent)
                this.parent.loadAcknowledged();
        }
    }

    /*************** DATA HANDLING CODE **************************************/

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

    update(data, changed_values, IMPORTED = false, meta = null) {

        if (this.update_tap)
            this.update_tap.downS(data, IMPORTED);

        if (changed_values) {
            for (let name in changed_values)
                if (this.taps[name])
                    this.taps[name].downS(data, IMPORTED, meta);
        } else{
            let map = new Map;

            for (let name in this.taps){
                map.set(name, this.taps[name]);
            }

            for(let name in data){
                if(map.has(name))
                    map.get(name).downS(data, IMPORTED, meta);
                //this.taps[name]
            }
        }

        for (let i = 0, l = this.containers.length; i < l; i++)
            this.containers[i].down(data, changed_values);
    }

    bubbleLink(child) {
        if (child)
            for (let a in child.badges)
                this.badges[a] = child.badges[a];
        if (this.parent)
            this.parent.bubbleLink(this);
    }

    /*************** DOM CODE ****************************/

    appendToDOM(element, before_element) {

        //Lifecycle Events: Connecting <======================================================================
        this.update({connecting:true});
        
        this.CONNECTED = true;

        if (before_element)
            element.insertBefore(this.ele, before_element);
        else
            element.appendChild(this.ele);

        //Lifecycle Events: Connected <======================================================================
        this.update({connected:true});
    }

    removeFromDOM() {
        //Prevent erroneous removal of scope.
        if (this.CONNECTED == true) return;
        
        //Lifecycle Events: Disconnecting <======================================================================
        this.update({disconnecting:true});
        
        if (this.ele && this.ele.parentElement)
            this.ele.parentElement.removeChild(this.ele);

        //Lifecycle Events: Disconnected <======================================================================
        this.update({disconnectied:true});
    }

    transitionIn(transition, transition_name = "trs_in") {
        
        if (transition) 
            this.update({trs:transition, [transition_name]:transition}, null, false, {IMMEDIATE:true});

        this.TRANSITIONED_IN = true;
    }

    transitionOut(transition, transition_name = "trs_out", DESTROY_AFTER_TRANSITION = false) {

        this.CONNECTED = false;

        if (this.TRANSITIONED_IN === false) {
            this.removeFromDOM();
            if (DESTROY_AFTER_TRANSITION) this.destroy();
            return;
        }

        let transition_time = 0;

        if (transition) {

            this.update({trs:transition, [transition_name]:transition}, null, false, {IMMEDIATE:true});

            if (transition.trs)
                transition_time = transition.trs.out_duration;
            else
                transition_time = transition.out_duration;
        }

        this.TRANSITIONED_IN = false;
        
        transition_time = Math.max(transition_time, 0);

        setTimeout(() => {
            this.removeFromDOM();
            if (DESTROY_AFTER_TRANSITION) this.destroy();
        }, transition_time + 2);

        return transition_time;
    }
}

Scope.prototype.removeIO = Tap.prototype.removeIO;
Scope.prototype.addIO = Tap.prototype.addIO;
