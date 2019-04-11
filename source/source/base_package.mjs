import { SourceManager } from "./manager";

export class BasePackage{
    constructor(){
        /**
         * When set to true indicates that the package is ready to be mounted to the DOM.
         */
        this.READY = false;

        /**
         * An array of SourceSkeleton objects.
         */
        this.skeletons = [];

        /**
         * An array objects to store pending calls to BasePackage#mount
         */
        this.pms = [];

        /**
         * An Array of error messages received during compilation of template.
         */
        this.errors = [];

        /**
         * An Array of style trees.
         */
        this.styles = [];


        /**
         * Flag to indicate BasePackage was compiled with errors
         */
        this.HAVE_ERRORS = false;

        this.links = [];

    }

    /**
     * Called when template compilation completes.
     *
     * Sets BasePackage#READY to true, send the pending mounts back through BasePackage#mount, and freezes itself.
     *
     * @protected
     */
    complete() {
        this.READY = true;

        for (let m, i = 0, l = this.pms.length; i < l; i++)
            (m = this.pms[i], this.mount(m.e, m.m, m.usd, m.mgr));


        this.pms.length = 0;

        this.freeze();

        return this;
    }

    
    // Adds Error message to the errors array.
    // ~dissuade-public
    addError(error_message) {
        this.HAVE_ERRORS = true;
        //Create error skeleton and push to skeletons
        this.errors.push(error_message);
    }

    // Freezes properties.
    // ~dissuade-public
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
    mount(element, model, USE_SHADOW_DOM = false, manager = new SourceManager(model, element), parent = manager) {

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

            if(this.styles)
                for (i = 0, l = this.styles.length; i < l; i++) {
                    let style = cloneNode(this.styles[i], true);
                    appendChild(element, style);
                }
        }


        for (i = 0, l = this.skeletons.length; i < l; i++) {
            let source = this.skeletons[i].flesh(element, model, parent);
            manager.sources.push(source);
        }

        if (manager.sourceLoaded) manager.sourceLoaded();

        return manager;
    }

    toString(){
        let str = "";

        for(let i = 0; i < this.links.length; i++)
            str += this.links[i];

        for(let i = 0; i < this.skeletons.length; i++)
            str += this.skeletons[i].tree;

        return str;
    }
}
