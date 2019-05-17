function web_component_constructor(wick_component, bound_data) {
    return class extends HTMLElement {
        constructor() {
            super();
            wick_component.mount(this, bound_data);
        }
    }
}

/* Component 
	The base container of component data. 
	Provides methods to compile actual HTML for 
		RUNTIME
		PRECOMPILED COMPONENT FILE
*/
let component = (class {

    constructor(name, ast, presets) {
        this.ast = ast;
        this.presets = presets;
        this.name = name || "" //Reference to the component name. Used with the Web Component API

        //Do not allow this componnet to be modified once created. 
        Object.freeze(this);
    }


    // Compiles the component to a HTML file. 
    // Returns a string representing the file data.
    compileToHTML(bound_data_object) {

    }

    // Compiles the component to a JS file
    // Returns a string representing the file data.
    compileToJS(bound_data_object) {

    }

    //Registers the component as a Web Component.
    //Herafter the Web Component API will be used to mount this component. 
    register(bound_data_object) {

        if (!this.name)
            throw new Error("This component has not been defined with a name. Unable to register it as a Web Component.");

        if (customElements.get(this.name))
            console.trace(`Web Component for name ${this.name} has already been defined. It is now being redefined.`)

        customElements.define(
            this.name,
            web_component_constructor(this, bound_data_object), {}
        );
    }

    //Mounts component data to new HTMLElement object.
    mount(HTMLElement_, bound_data_object) {

        if (!(HTMLElement_ instanceof HTMLElement_))
            throw new Error("HTMLElement_ argument is not an instance of HTMLElement. Cannot mount component");

        const shadow = HTMLElement_.attachShadow({mode: 'open'});

        this.ast.mount(shadow, bound_data_object);
    }
})

export default component;