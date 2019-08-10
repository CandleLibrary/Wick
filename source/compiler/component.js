import whind from "@candlefw/whind";
import URL from "@candlefw/url";

import { Presets } from "../presets.js";
import wick_compile from "./wick.js";
import CompilerEnv from "./compiler_env.js";
import env from "./env.js";
import proto from "./component_prototype.js";

import JS from "./js/tools.js";
import processJSComponent from "./js/compiler.js";
import { types, module } from "@candlefw/js";
import Script from "./html/script.js";
import Attribute from "./html/attribute.js";
import Binding from "./html/binding.js";
import error from "../utils/error.js";

const

    default_presets = new Presets,

    compile = async (component_data, presets, compiler_env) => {

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
                    const first_char = component_data[0];
                    var url, IS_POTENTIAL_URL = (
                        (first_char !== "<" &&
                            first_char !== " ") || (
                            first_char == "/" ||
                            first_char == "."
                        )
                    );

                    //Not sure if the string is a URL, but we can try fetching as a resource, and suppress erros if it comes up short.
                    if (IS_POTENTIAL_URL && (url = URL.resolveRelative(component_data, ""))) {
                        try {
                            if (url.ext == "mjs" || url.ext == "js") {

                                const module = await import(url + "")

                                let comp = null;

                                if (module.default)
                                    comp = await (new module.default(presets).pending);

                                return comp;
                            }

                            string_data = await url.fetchText();

                        } catch (e) {
                            console.log(e);
                        }
                    }

                    break;

                case "object":
                    if (component_data instanceof URL) {
                        string_data = await url.fetchText();
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



           try {

                return await (new Promise(res => {

                    compiler_env.pending++;

                    compiler_env.pendingResolvedFunction = () => { res(ast) };

                    ast = wick_compile(whind(string_data), compiler_env);

                    if (ast instanceof module)
                        ast = processJSComponent(ast);

                    compiler_env.resolve();
                }));

            } catch (e) {
                throw error(error.COMPONENT_PARSE_FAILURE, e, compiler_env);
            }
        },


        // This is a variadic function that accepts objects, string, and urls, 
        //  and compiles data from the argument sources into a wick component. 
        Component = function(...data) {

            // The presets object provides global values to this component
            // and all its derivatives and descendents. 
            let presets = default_presets;

            if (data.length > 1)
                presets = (data[1] instanceof Presets) ? data[1] : new Presets(data[1]);

            if (data.length === 0)
                throw new Error("This function requires arguments. Please refer to wick docs on what arguments may be passed to this function.");

            const component_data = data[0];

            // If this function is an operand of the new operator, run an alternative 
            // compiler on the calling object.
            if (new.target) {

                this.ast = null;

                this.READY = false;

                this.presets = data[1] || default_presets;

                //Reference to the component name. Used with the Web Component API
                this.name = "";

                

                this.pending = ((async ()=>{
                    var obj;

                    const
                        compiler_env = new CompilerEnv(presets, env),
                        return_obj = this;

                        try{
                            obj = await compile(component_data, presets, compiler_env);
                        }catch(e){
                            throw(e)
                        }


                    if (obj instanceof proto) {

                        this.ast = obj.ast;

                        if (!this.name)
                            this.name = obj.name;

                        integrate(this, this, presets, compiler_env);

                    } else {

                        const ast = obj;

                        const constructor_name = this.constructor.name;

                        if (constructor_name !== "default" || constructor_name !== "Anonymous") 
                            presets.components[constructor_name] = ast;
                        
                        this.ast = ast;
                        this.ast.finalize();

                        if (!this.name)
                            this.name = this.ast.getAttrib("component").value || "undefined-component";

                        integrate(this, this, presets, compiler_env)
                    }

                    this.READY = true;

                    if (this.__pending) {
                        this.__pending.forEach(e => e[3](this.mount(...e.slice(0, 3))));
                        this.__pending = null;
                    }

                    return (return_obj);
                })());



            } else
                return new Component(...data);
        },

        // If compilation fails, failure component is generated that provides 
        // error information. Should be fancy though.
        integrate = function(this_obj, from_obj = this_obj, presets, env) {

            const extrascripts = [];

            if (this_obj.ast && from_obj.constructor.prototype !== Component.prototype) {

                //Go through prototype chain and extract functions that have names starting with $. Add them to the ast.

                for (const a of Object.getOwnPropertyNames(from_obj.constructor.prototype)) {
                    if (a == "constructor") continue;

                    const r = from_obj.constructor.prototype[a];

                    if (typeof r == "function") {

                        //extract and process function information. 

                        const
                            js_ast = wick_compile(whind("function " + r.toString().trim() + ";"), env),
                            func_ast = JS.getFirst(js_ast, types.function_declaration),
                            binding = new Binding(func_ast.id, undefined, env, whind("whin")),
                            attrib = new Attribute(["on", null, binding], presets),
                            stmt = func_ast.body;

                        const script = new Script({}, "script", [stmt], [attrib], presets);

                        script.finalize();

                        this_obj.ast.children.push(script);
                    }
                }
            }
        };

Component.prototype = proto.prototype;

//TODO: Fancy schmancy to string method.
Component.toString = function() {
    return "WICK 2019";
};

export default Component;
