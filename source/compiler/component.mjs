//import html_compiler from "./html/html.mjs";
//import html_env from "./html/env.mjs";
import whind from "@candlefw/whind";
import { Presets } from "../presets.mjs";
//import js_compiler from "./js/js.mjs";
//import js_env from "./js/env.mjs";
import wick_compile from "./wick.mjs";
import env from "./env.mjs";
//import Component from "./component/component.mjs"


function web_component_constructor(wick_component, bound_data) {
    return class extends HTMLElement {
        constructor() {
            super();
            wick_component.mount(this, bound_data);
        }
    }
}

const

    default_presets = new Presets,

    // This is to allow components to import data from remote resources


    // If compilation fails, failure component is generated that provides 
    // error information. 

    compileAST = async (component_data, presets) => {
        var 
            ast = null,
            string_data = "";

        switch (typeof component_data) {

            case "string":
                /* Need to determine if string is:
                	   URL to component resource
                	   HTML data
                	   JS data
                	   or incompatible data that should throw.
                */

                string_data = component_data;
                
                let url; 

                if((url = URL.resolveRelative(component_data, ""))){
                	let string = await url.fetchText();
                	string_data = string;
                }

                break;

            case "object":
            	if(component_data instanceof URL){

            	}else if (component_data instanceof HTMLElement) {
                    
                    if (component_data.tagName == "TEMPLATE")
			            if (component_data.tagName == "TEMPLATE") {
			            let temp = document.createElement("div");
			            temp.appendChild(component_data.content);
			            component_data = temp;
			        }

			        string_data = component_data.innerHTML;
                }
                // Extract properties from the object that relate to wick component attributes. 
                break;
        }

        env.pushPresets(presets)

        try {
         
            ast = wick_compile(whind(string_data), env);
        
        } catch (err) {

            console.error(err)
        }

        env.popPresets();

        return ast;
    },

    // This is a variadic function that accepts objects, string, and urls, 
    //  and compiles data from the argument sources into a wick component. 
    component = function(...data) {
        // The presets object provides global values to this component
        // and all its derivatives and descendents. 
        let presets = default_presets;

        if (data.length > 1)
            presets = data.slice(-1);

        if (data.length === 0)
            throw new Error("This function requires arguments. Refer to wick docs on what arguments may be passed to this function.");

        const component_data = data[0];

        // If this function is an operand of the new operator, run an alternative 
        // compiler on the calling object.
        if (new.target) {

            compileAST(component_data, presets).then(ast=>{
                this.READY = true;
                this.ast = ast;
                
                if(!this.name)
                    this.name = this.ast.getAttrib("component").value || "undefined-component";
            });

            this.ast = null;

            this.READY = false;

            this.presets = data[1] || default_presets;

            //Reference to the component name. Used with the Web Component API
            this.name = ""; 

            if (this.constructor !== component) {
                //Go through chain and extract functions that have names starting with $. Add them to the ast.  
            }

        } else {
            return new component(...data);
        }
    }

// Compiles the component to a HTML file. 
// Returns a string representing the file data.
component.prototype.compileToHTML = function(bound_data_object) {

}

// Compiles the component to a JS file
// Returns a string representing the file data.
component.prototype.compileToJS = function(bound_data_object) {

}

//Registers the component as a Web Component.
//Herafter the Web Component API will be used to mount this component. 
component.prototype.register = function(bound_data_object) {

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
component.prototype.mount = function(HTMLElement_, bound_data_object) {

    if (!(HTMLElement_ instanceof HTMLElement))
        throw new Error("HTMLElement_ argument is not an instance of HTMLElement. Cannot mount component");

    const shadow = HTMLElement_.attachShadow({ mode: 'open' });

    const scope = this.ast.mount(shadow);

    if (bound_data_object)
        scope.load(bound_data_object)

    return scope;
}

component.prototype.connect = function(h, b) { return this.mount(h, b); }


component.toString = function() {
    return "WICK 2019"
}

export default component;