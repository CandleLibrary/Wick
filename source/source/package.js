import { EL, OB, _cloneNode_, _appendChild_ } from "../common/short_names";
import { SourceManager } from "./manager";
import { CompileSource } from "./compiler/compiler";
import { Lexer } from "../common/string_parsing/lexer";
import { Skeleton } from "./skeleton";
import { RootNode } from "./compiler/nodes/root";

/**
 * SourcePackages stores compiled {@link SourceSkeleton}s and provide a way to _bind_ Model data to the DOM in a reusable manner. * 
 * @property    {Array}    _skeletons_        
 * @property    {Array}    styles       
 * @property    {Array}    scripts      
 * @property    {Array}    style_core    
 * @readonly
 * @callback   If `RETURN_PROMISE` is set to `true`, a new Promise is returned, which will asynchronously return a SourcePackage instance if compilation is successful.
 * @param      {HTMLElement}  element      The element
 * @param      {Presets}  presets      The global Presets object.
 * @param      {boolean}  [RETURN_PROMISE=false]  If `true` a Promise will be returned, otherwise the SourcePackage instance is returned. 
 * @return     {SourcePackage | Promise}  If a SourcePackage has already been constructed for the given element, that will be returned instead of new one being created. If 
 * @memberof module:wick.core.source
 * @alias SourcePackage  
 */
class SourcePackage {

    constructor(element, presets, RETURN_PROMISE = false) {

        //If a package exists for the element already, it will be bound to __wick__package__. That will be returned.
        if (element.__wick__package__) {
            if (RETURN_PROMISE)
                return new Promise((res) => res(element.__wick__package__));
            return element.__wick__package__;
        }


        /**
         * When set to true indicates that the package is ready to be mounted to the DOM.
         */
        this._READY_ = false;

        /**
         * An array of SourceSkeleton objects.
         */
        this._skeletons_ = [];

        /**
         * An array objects to store pending calls to SourcePackage#mount
         */
        this.pms = [];

        /**
         * An Array of error messages received during compilation of template.
         */
        this._errors_ = [];

        /**
         * Flag to indicate SourcePackage was compiled with errors
         */
        this._HAVE_ERRORS_ = false;

        if (element instanceof Promise) {
            element.then((data) => CompileSource(this, presets, data));
            if (RETURN_PROMISE) return element;
            return this;
        } else if (element instanceof RootNode) {
            //already a HTMLtree, just package into a skeleton and return.
            this._skeletons_.push(new Skeleton(element, presets));
            this._complete_();
            return;
        } else if (!(element instanceof EL) && typeof(element) !== "string" && !(element instanceof Lexer)) {
            let err = new Error("Could not create package. element is not an HTMLElement");
            this._addError_(err);
            this._complete_();
            if (RETURN_PROMISE)
                return new Promise((res, rej) => rej(err));
            return;
        }

        //Start the compiling of the component.
        let promise = CompileSource(this, presets, element);

        OB.seal(this);

        if (RETURN_PROMISE)
            return promise;
        else
            return this;

    }

    /**
     * Called when template compilation completes. 
     * 
     * Sets SourcePackage#_READY_ to true, send the pending mounts back through SourcePackage#mount, and freezes itself.
     * 
     * @protected
     */
    _complete_() {
        this._READY_ = true;

        for (let m, i = 0, l = this.pms.length; i < l; i++)
            (m = this.pms[i], this.mount(m.e, m.m, m.usd, m.mgr));


        this.pms.length = 0;

        this._fz_();
    }

    /**
     * Adds Error message to the errors array.
     *
     * @param      {String}  error_message     the error message to add.
     * 
     * @protected
     */
    _addError_(error_message) {
        this._HAVE_ERRORS_ = true;
        //Create error skeleton and push to _skeletons_
        this._errors_.push(error_message);
        console.error(error_message);
    }

    /**
     * Freezes properties.
     * @protected 
     */
    _fz_() {
        return;
        OB.freeze(this._READY_);
        OB.freeze(this._skeletons_);
        OB.freeze(this.styles);
        OB.freeze(this.pms);
        OB.freeze(this._errors_);
        OB.freeze(this);
    }

    /**
     * Pushes pending mounts to the pms array.
     *
     * @param      {HTMLElement}  element         The element
     * @param      {Model}  model           The model
     * @param      {Boolean}  USE_SHADOW_DOM  The use shadow dom
     * @param      {Object}  manager         The manager
     * 
     * @protected
     */
    _pushPendingMount_(element, model, USE_SHADOW_DOM, manager) {

        if (this._READY_)
            return this.mount(element, model, USE_SHADOW_DOM, manager);

        this.pms.push({
            e: element,
            m: model,
            usd: USE_SHADOW_DOM,
            mgr: manager
        });

        return manager;
    }

    /**
     * Generates new instance of component and appends it to the input element.
     * @param  {HTMLElement} element         - The element
     * @param  {Model}   model           - The model
     * @param  {boolean} USE_SHADOW_DOM  - If `true`, appends the component to the element's ShadowDOM.
     * @param  {Object}  manager         - The manager
     */
    mount(element, model, USE_SHADOW_DOM = false, manager = new SourceManager(model, element)) {

        if (!this._READY_)
            return this._pushPendingMount_(element, model, USE_SHADOW_DOM, manager);

        //if (!(element instanceof EL)) return null;

        if (this._HAVE_ERRORS_) {
            //Process
            console.warn("TODO - Package has errors, pop an error widget on this element!");
        }
        let i = 0,
            l = 0;

        if (!manager.sources)
            manager.sources = [];

        if (USE_SHADOW_DOM) {

            let shadow_root = element.attachShadow({
                mode: "open"
            });

            element = shadow_root;

            for (i = 0, l = this.styles.length; i < l; i++) {
                let style = _cloneNode_(this.styles[i], true);
                _appendChild_(element, style);
            }
        }

        for (i = 0, l = this._skeletons_.length; i < l; i++) {
            let source = this._skeletons_[i].flesh(element, model);
            source.parent = manager;
            manager.sources.push(source);
        }

        if (manager.sourceLoaded) manager.sourceLoaded();

        return manager;
    }
}

import { PackageNode } from "./compiler/nodes/package";

PackageNode.prototype.SourcePackage = SourcePackage;

export { SourcePackage };