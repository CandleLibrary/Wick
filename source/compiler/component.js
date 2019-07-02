import whind from "@candlefw/whind";
import URL from "@candlefw/url";

import { Presets } from "../presets.js";
import wick_compile from "./wick.js";
import CompilerEnv from "./compiler_env.js";
import env from "./env.js";
import proto from "./component_prototype.js";

import JS from "./js/tools.js";
import { types } from "@candlefw/js";
import Script from "./html/script.js";
import Attribute from "./html/attribute.js";
import Binding from "./html/binding.js";
import error from "../utils/error.js";

const

    default_presets = new Presets,

    // If compilation fails, failure component is generated that provides 
    // error information. Should be fancy though.

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

                    var url, IS_URL = (
                        component_data[0] !== "<" &&
                        component_data[0] !== " "
                    );

                    if (IS_URL && (url = URL.resolveRelative(component_data, ""))) {
                        try {
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

            const compiler_env = new CompilerEnv(presets, env);

            try {

                return await (new Promise(res => {
                    compiler_env.pending++;


                    compiler_env.pendingResolvedFunction = () => { res(ast) };

                    ast = wick_compile(whind(string_data), compiler_env);

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

            if (data.length > 1) {
                presets = (data[1] instanceof Presets) ? data[1] : new Presets(data[1]);
            }


            if (data.length === 0)
                throw new Error("This function requires arguments. Please Refere to wick docs on what arguments may be passed to this function.");

            const component_data = data[0];


            // If this function is an operand of the new operator, run an alternative 
            // compiler on the calgling object.
            if (new.target) {

                this.ast = null;

                this.READY = false;

                this.presets = data[1] || default_presets;

                //Reference to the component name. Used with the Web Component API
                this.name = "";

                const extrascripts = [];

                this.pending = ((async () => {

                    const ast = await compileAST(component_data, presets);

                    ast.children.push(...extrascripts);

                    this.READY = true;
                    this.ast = ast;
                    this.ast.finalize();

                    if (!this.name)
                        this.name = this.ast.getAttrib("component").value || "undefined-component";

                    if (this.__pending) {
                        this.__pending.forEach(e => e[3](this.mount(...e.slice(0, 3))));
                        this.__pending = null;
                    }

                    return this;
                })());

                if (this.constructor.prototype !== Component.prototype) {

                    //Go through prototype chain and extract functions that have names starting with $. Add them to the ast.

                    for (const a of Object.getOwnPropertyNames(this.constructor.prototype)) {
                        if (a == "constructor") continue;

                        const r = this.constructor.prototype[a];

                        if (typeof r == "function") {

                            //extract and process function information. 
                            const c_env = new CompilerEnv(presets, env),
                                js_ast = wick_compile(whind("function " + r.toString().trim() + ";"), c_env),
                                func_ast = JS.getFirst(js_ast, types.function_declaration);
                                
                            //const HAS_CLOSURE = (ids.filter(a => !args.includes(a))).length > 0;

                            const binding = new Binding([null, func_ast.id], { presets, start: 0 }, whind("ddddd"));
                            const attrib = new Attribute(["on", null, binding], presets);
                            const stmt = func_ast.body;

                            let script = new Script({}, null, stmt, [attrib], presets);

                            script.finalize();

                            extrascripts.push(script);
                        }
                    }
                }
            } else {
                const comp = new Component(...data);

                return comp;
            }
        };

Component.prototype = proto.prototype;

//TODO: Fancy schmancy to string method.
Component.toString = function() {
    return "WICK 2019";
};

export default Component;
