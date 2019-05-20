import whind from "@candlefw/whind";
import URL from "@candlefw/url";

import { Presets } from "../presets.mjs";
import wick_compile from "./wick.mjs";
import env from "./env.mjs";
import proto from "./component_prototype.mjs";

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

                    var url;

                    if ((url = URL.resolveRelative(component_data, "")))
                        string_data = await url.fetchText();
                    break;

                case "object":
                    if (component_data instanceof URL) {

                    } else if (component_data instanceof HTMLElement) {

                        if (component_data.tagName == "TEMPLATE")
                            if (component_data.tagName == "TEMPLATE") {
                                const temp = document.createElement("div");
                                temp.appendChild(component_data.content);
                                component_data = temp;
                            }

                        string_data = component_data.innerHTML;
                    }
                    // Extract properties from the object that relate to wick component attributes. 
                    break;
            }

            env.pushPresets(presets);

            try {

                ast = wick_compile(whind(string_data), env);

            } catch (err) {
                console.error(err);
            }

            env.popPresets();

            return ast;
        },


        // This is a variadic function that accepts objects, string, and urls, 
        //  and compiles data from the argument sources into a wick component. 
        Component = function(...data) {
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

                compileAST(component_data, presets).then(ast => {
                    this.READY = true;
                    this.ast = ast;

                    if (!this.name)
                        this.name = this.ast.getAttrib("component").value || "undefined-component";
                });

                this.ast = null;

                this.READY = false;

                this.presets = data[1] || default_presets;

                //Reference to the component name. Used with the Web Component API
                this.name = "";

                if (this.constructor !== Component) {
                    //Go through chain and extract functions that have names starting with $. Add them to the ast.  
                }

            } else {
                return new Component(...data);
            }
        };

Component.prototype = proto.prototype;

//TODO: Fancy schmancy to string method.
Component.toString = function() {
    return "WICK 2019";
};

export default Component;
