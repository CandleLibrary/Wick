import whind from "@candlefw/whind";
import URL from "@candlefw/url";

import { Presets } from "../presets.mjs";
import wick_compile from "./wick.mjs";
import CompilerEnv from "./compiler_env.mjs";
import env from "./env.mjs";
import proto from "./component_prototype.mjs";

import JS from "./js/tools.mjs";
import {types, statements} from "../../node_modules/@candlefw/hydrocarbon/source/grammar/js/exports.mjs";
import Script from "./html/script.mjs";
import Attribute from "./html/attribute.mjs";
import Binding from "./html/binding.mjs";

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

                    var url;

                    if ((url = URL.resolveRelative(component_data, ""))){
                        try{
                            string_data = await url.fetchText();
                        }catch(e){
                            console.log(e);
                        }
                    }

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

            try {

                return await (new Promise(res => {
                    const compiler_env = new CompilerEnv(presets, env);
                    compiler_env.pending++;


                    compiler_env.pendingResolvedFunction = () => { res(ast) };

                    ast = wick_compile(whind(string_data), compiler_env);

                    compiler_env.resolve();
                }));

            } catch (err) {
                console.error(err);
            }

            return ast;
        },


        // This is a variadic function that accepts objects, string, and urls, 
        //  and compiles data from the argument sources into a wick component. 
        Component = function(...data) {
            // The presets object provides global values to this component
            // and all its derivatives and descendents. 
            let presets = default_presets;

            if (data.length > 1)
                presets = new Presets(data[1]);

            if (data.length === 0)
                throw new Error("This function requires arguments. Please Refere to wick docs on what arguments may be passed to this function.");

            const component_data = data[0];

            // If this function is an operand of the new operator, run an alternative 
            // compiler on the calling object.
            if (new.target) {

                this.ast = null;

                this.READY = false;

                this.presets = data[1] || default_presets;

                //Reference to the component name. Used with the Web Component API
                this.name = "";
                
                this.pending = new Promise(res => {
                    compileAST(component_data, presets).then(ast => {

                        if (this.constructor.prototype !== Component.prototype) {
                                                
                            //Go through prototype chain and extract functions that have names starting with $. Add them to the ast.

                            for(const a of Object.getOwnPropertyNames(this.constructor.prototype)){
                                if(a == "constructor") continue;

                                const r = this.constructor.prototype[a];

                                if(typeof r == "function"){

                                    //extract and process function information. 
                                    let c_env = new CompilerEnv(presets, env);
                                    
                                    let js_ast = wick_compile(whind("function " + r.toString().trim()+";"), c_env)

                                    let func_ast = JS.getFirst(js_ast, types.function_declaration);
                                    let ids = JS.getClosureVariableNames(func_ast);
                                    let args = JS.getFunctionDeclarationArgumentNames(js_ast); // Function arguments in wick class component definitions are treated as TAP variables. 
                                    const HAS_CLOSURE = (ids.filter(a=>!args.includes(a))).length > 0;

                                    const binding = new Binding([null, func_ast.id], {presets, start:0}, whind("ddddd"));
                                    const attrib = new Attribute(["on", null, binding], presets);
                                    const stmt = func_ast.body;
                            
                                    let script = new Script({}, null, stmt, [attrib], presets);

                                    script.finalize();

                                    ast.children.push(script);

                                    //Create and attach a script IO to the HTML ast. 


                                    //Checking for variable leaks. 
                                    //if all closure variables match all argument variables, then the function is self contained and can be completely enclosed by the 
                                }
                            }
                        }

                        this.READY = true;
                        this.ast = ast;
                        this.ast.finalize();

                        if (!this.name)
                            this.name = this.ast.getAttrib("component").value || "undefined-component";

                        if(this.__pending){
                            this.__pending.forEach(e=>e[2](this.mount(...e.slice(0,2))));
                            this.__pending = null;
                        }

                        return res(this)
                    });
                })
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
