import whind from "@candlefw/whind";

import { EL, OB, cloneNode, appendChild } from "../short_names";
import { SourceManager } from "./manager";
import { CompileSource } from "./compiler/compiler";
import { Skeleton } from "./skeleton";
import { RootNode } from "./compiler/nodes/root";


/**
 * SourcePackages stores compiled {@link SourceSkeleton}s and provide a way to _bind_ Model data to the DOM in a reusable manner. *
 * @property    {Array}    skeletons
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

    constructor(element, presets, RETURN_PROMISE = false, url = "", win = window) {

        //If a package exists for the element already, it will be bound to __wick_package_. That will be returned.
        if (element.__wick_package_) {
            if (RETURN_PROMISE)
                return new Promise((res) => res(element.__wick_package_));
            return element.__wick_package_;
        }


        /**
         * When set to true indicates that the package is ready to be mounted to the DOM.
         */
        this.READY = false;

        /**
         * An array of SourceSkeleton objects.
         */
        this.skeletons = [];

        /**
         * An array objects to store pending calls to SourcePackage#mount
         */
        this.pms = [];

        /**
         * An Array of error messages received during compilation of template.
         */
        this.errors = [];

        /**
         * Flag to indicate SourcePackage was compiled with errors
         */
        this.HAVE_ERRORS = false;

        if (element instanceof Promise) {
            element.then((data) => CompileSource(this, presets, data, url, win));
            if (RETURN_PROMISE) return element;
            return this;
        } else if (element instanceof RootNode) {
            //already an HTMLtree, just package into a skeleton and return.
            this.skeletons.push(new Skeleton(element, presets));
            this.complete();
            return;
        } else if (!(element instanceof HTMLElement) && typeof(element) !== "string" && !(element instanceof whind.constructor)) {
            let err = new Error("Could not create package. element is not an HTMLElement");
            this.addError(err);
            this.complete();
            if (RETURN_PROMISE)
                return new Promise((res, rej) => rej(err));
            return;
        }

        //Start the compiling of the component.
        let promise = CompileSource(this, presets, element, url, win);

        OB.seal(this);

        if (RETURN_PROMISE)
            return promise;
        else
            return this;

    }

    /**
     * Called when template compilation completes.
     *
     * Sets SourcePackage#READY to true, send the pending mounts back through SourcePackage#mount, and freezes itself.
     *
     * @protected
     */
    complete() {
        this.READY = true;

        for (let m, i = 0, l = this.pms.length; i < l; i++)
            (m = this.pms[i], this.mount(m.e, m.m, m.usd, m.mgr));


        this.pms.length = 0;

        this.freeze();
    }

    /**
     * Adds Error message to the errors array.
     *
     * @param      {String}  error_message     the error message to add.
     *
     * @protected
     */
    addError(error_message) {
        this.HAVE_ERRORS = true;
        //Create error skeleton and push to skeletons
        this.errors.push(error_message);
        console.error(error_message);
    }

    /**
     * Freezes properties.
     * @protected
     */
    freeze() {
        return;
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
     * @param      {HTMLElement}  element         The element
     * @param      {Model}  model           The model
     * @param      {Boolean}  USE_SHADOW_DOM  The use shadow dom
     * @param      {Object}  manager         The manager
     *
     * @protected
     */
    pushPendingMount(element, model, USE_SHADOW_DOM, manager) {

        if (this.READY)
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
     * Generates new instance of component and appends it to the input element. If the compilation of the component is not complete by the time this method is called,
     the arguments are stored in a temporary buffer and later run through this method again when compilation is completed.
     * @param  {HTMLElement} element         - The element
     * @param  {Model}   model           - The model the source component will bind to. Binding only occurs if `model` or `schema` attributes are undefined in the component decleration, the `schema` attribute type matches the model type, or `schema` is set to "any".
     * @param  {boolean} USE_SHADOW_DOM  - If `true`, appends the component to the element's ShadowDOM.
     * @param  {Object}  manager         - A custom manager that stores built source components. If not defined then a SourceManager is created and returned.
     */
    mount(element, model, USE_SHADOW_DOM = false, manager = new SourceManager(model, element)) {

        if (!this.READY)
            return this.pushPendingMount(element, model, USE_SHADOW_DOM, manager);

        //if (!(element instanceof EL)) return null;

        if (this.HAVE_ERRORS) {
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
                let style = cloneNode(this.styles[i], true);
                appendChild(element, style);
            }
        }

        for (i = 0, l = this.skeletons.length; i < l; i++) {
            let source = this.skeletons[i].flesh(element, model);
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
