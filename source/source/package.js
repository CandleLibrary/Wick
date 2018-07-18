import { EL, OB, DOC, cN, aC } from "../common/short_names"

import { SourceManager } from "./manager"

import { CompileSource } from "./compiler"

import { Presets } from "../common/presets"

import { SourceBase } from "./base";

/**
 * SourcePackages store compiled Wick components and provide a way to bind Model data to the DOM in a reusable manner. 
 * Stores as set of {@link SourceSkeletons}
 * 
 * @property    {Array}    skeletons        
 * @property    {Array}    styles       
 * @property    {Array}    scripts      
 * @property    {Array}    style_core    
 * 
 * @param      {external:HTMLElement}  element      The element
 * @param      {Presets}  presets      The presets
 * @param      {external:HTMLElement}  WORKING_DOM  The working dom
 * @return     {SourcePackage}  If a SourcePackage has already been constructed for the given element, that will be returned instead of new one being created.
 * @memberof module:wick.core.source
 * @alias SourcePackage  
 */
class SourcePackage {

    constructor(element, presets, WORKING_DOM = DOC) {

        presets = (presets instanceof Presets) ? presets : new Presets(presets);

        //element must be an HTMLElement. 
        if (!(element instanceof EL)) return undefined;

        //If a package exists for the element already, it will be bound to __wick__package__. That will be returned.
        if (element.__wick__package__) return element.__wick__package__;

        //When set to true indicates that the package is ready to be mounted to the DOM.
        this.READY = false;

        //Preset the properties.
        this.skeletons = [];
        this.styles = [];
        this.scripts = [];
        this.pms = [];
        this.errors = [];

        //Start the compiling of the component.
        CompileSource(this, presets, element, WORKING_DOM);

        OB.seal(this);
    }

    /**
     * Called if template compilation fails.
     * 
     * TODO: Generates an error message that is displayed instead of the intended component.
     * 
     * @protected
     */
    _rj_() {

    }

    /**
     * Called when template compilation completes. 
     * 
     * Sets SourcePackage#READY to true, send the pending mounts back through SourcePackage#mount, and freezes itself.
     * 
     * @protected
     */
    _cp_() {
        this.READY = true;

        for (let m, i = 0, l = this.pms.length; i < l; i++)
            m = this.pms[i], this.mount(m.e, m.m, m.usd, m.mgr);

        this.pms.length = 0;

        this._fz_();
    }

    /**
     * Adds Error message to the errors array.
     *
     * @param      {external:String}  error_message     the error message to add.
     * 
     * @protected
     */
    _aE_(error_message) {
        this.errors.push(error_message);
    }

    /**
     * Freezes properties.
     * 
     * @protected 
     */
    _fz_() {

        OB.freeze(this.READY);
        OB.freeze(this.skeletons);
        OB.freeze(this.styles);
        OB.freeze(this.pms);
        OB.freeze(this.errors);
        OB.freeze(this);
    }

    /**
     * Pushes pending mounts to the pms array.
     *
     * @param      {external:HTMLElement}  element         The element
     * @param      {Model}  model           The model
     * @param      {Boolean}  USE_SHADOW_DOM  The use shadow dom
     * @param      {Object}  manager         The manager
     * 
     * @protected
     */
    _pM_(element, model, USE_SHADOW_DOM, manager) {

        if (this.READY)
            return this.mount(element, model, USE_SHADOW_DOM, manager);

        this.pms.push({ e: element, m: model, usd: USE_SHADOW_DOM, mgr: manager });
    }

    /**
     * Generates new components and appends them to the element
     *
     * @param  {external:HTMLElement} element         - The element
     * @param  {Model}       model           - The model
     * @param  {boolean}      USE_SHADOW_DOM  - The use shadow dom
     * @param  {Object}      manager         - The manager
     */
    mount(element, model, USE_SHADOW_DOM, manager) {

        if (!this.READY)
            return this._pM_(element, model, USE_SHADOW_DOM, manager);

        if (!(element instanceof EL)) return null;

        let Manager = manager || new SourceManager(),
            sources = [],
            i = 0,
            l = 0;

        if (!Manager.sources)
            Manager.sources = [];

        if (USE_SHADOW_DOM) {

            let shadow_root = element.attachShadow({ mode: "open" });

            element = shadow_root;

            l

            for (i = 0, l = this.styles.length; i < l; i++) {
                let style = cN(this.styles[i], true);
                aC(element, style);
            }
        }

        for (i = 0, l = this.skeletons.length; i < l; i++) {
            let source = this.skeletons[i].flesh(model);
            Manager.sources.push(source);
            aC(element, source.ele);
        }

        return manager;
    }
}

export { SourcePackage }