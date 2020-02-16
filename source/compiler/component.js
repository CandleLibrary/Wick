import whind from "@candlefw/whind";
import URL from "@candlefw/url";
import { types, module } from "@candlefw/js";

import Presets from "../presets.js";
import parseWickSyntax from "./parser.js";
import compiler_env from "./compiler_environment.js";

import ComponentEnvironment from "./component_environment.js";
import proto from "./component_prototype.js";

import JS from "./js/tools.js";
import processJSComponent from "./js/compiler.js";
import Script from "./html/script.js";
import Attribute from "./html/attribute.js";
import Binding from "./html/binding.js";
import error from "../utils/error.js";
import ErrorNode from "./error_node.js";

const

    default_presets = new Presets,

    compile = async function(component_data, presets, component_env) {

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
                    if (IS_POTENTIAL_URL && (url = URL.resolveRelative(component_data))) {

                        try {
                            if (url.ext == "mjs" || url.ext == "js") {

                                const module = await import(url + "");

                                let comp = null;

                                if (module.default)
                                    comp = await (new module.default(presets).pending);

                                return comp;
                            }

                            string_data = await url.fetchText();

                            component_env.url = url;

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

                component_env.incrementPendingLoads();

                const output = parseWickSyntax(whind(string_data), component_env);

                if (output.error){
                    if(presets.options.THROW_ON_ERRORS)
                        component_env.throw();

                    ast = new ErrorNode(component_env);
                }
                else
                    ast = output.result;


                if (ast instanceof module)
                    ast = processJSComponent(ast);

                component_env.resolve();

                await component_env.pending;


                return ast;

            } catch (e) {
                throw error(error.COMPONENT_PARSE_FAILURE, e, component_env);
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

                this.pending = ((async () => {
                    var obj;

                    const
                        component_env = new ComponentEnvironment(presets, compiler_env),
                        return_obj = this;

                    try {
                        obj = await compile(component_data, presets, component_env);
                    } catch (e) {
                        throw (e)
                    }

                    if (obj instanceof proto) {

                        this.ast = obj.ast;

                        if (!this.name)
                            this.name = obj.name;

                        integrate(this, this, presets, component_env);

                    } else {

                        const ast = obj;



                        if (!ast.finalize){
                            console.log({ast,component_data})
                            throw error(error.COMPONENT_PARSE_FAILURE, new Error("Component blueprint is not html"), component_env);
                        }

                        const constructor_name = this.constructor.name;

                        if (constructor_name !== "default" || constructor_name !== "Anonymous")
                            presets.components[constructor_name] = ast;

                        this.ast = ast;
                        this.ast.finalize();

                        if (!this.name)
                            this.name = this.ast.getAttribObject("component").value || "undefined-component";

                        integrate(this, this, presets, component_env)
                    }

                    this.READY = true;

                    if (this.__pending) {
                        this.__pending.forEach(e => e[0] ? e[4](this.stamp(...e.slice(1, 4))) : e[5](this.mount(...e.slice(1, 5))));
                        this.__pending = null;
                    }

                    return (return_obj);
                })());



            } else
                return new Component(...data);
        },

        // If compilation fails, failure component is generated that provides 
        // error information. Should be fancy though.
        integrate = function(this_obj, from_obj = this_obj, presets, component_env) {

            const extrascripts = [];

            if (this_obj.ast && from_obj.constructor.prototype !== Component.prototype) {

                //Go through prototype chain and extract functions that have names starting with $. Add them to the ast.

                for (const a of Object.getOwnPropertyNames(from_obj.constructor.prototype)) {
                    if (a == "constructor") continue;

                    const r = from_obj.constructor.prototype[a];

                    if (typeof r == "function") {

                        //extract and process function information. 

                        const
                            js_ast = parseWickSyntax(whind("function " + r.toString().trim() + ";"), compiler_env),
                            func_ast = JS.getFirst(js_ast, types.function_declaration),
                            binding = new Binding(func_ast.id, undefined, component_env, whind("whin")),
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


Component.toString = function() {
    return `
 
      / _|        | |  | |_   _/  __ \\| | / /
  ___| |___      _| |  | | | | | /  \\/| |/ / 
 / __|  _\\ \\ /\\ / / |/\\| | | | | |    |    \\ 
| (__| |  \\ V  V /\\  /\\  /_| |_| \\__/\\| |\\  \\
 \\___|_|   \\_/\\_(_)\\/  \\/ \\___/ \\____/\\_| \\_/


2020 v0.8.11

Copyright (c) MMXX Anthony C Weathersby

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

logo courtesy of http://patorjk.com/software/taag

Font:
DOOM by Frans P. de Vries <fpv@xymph.iaf.nl>  18 Jun 1996
based on Big by Glenn Chappell 4/93 -- based on Standard
figlet release 2.1 -- 12 Aug 1994
Permission is hereby given to modify this font, as long as the
modifier's name is placed on a comment line.`;
};

export default Component;