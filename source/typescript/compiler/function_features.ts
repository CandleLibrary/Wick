import { copy, traverse } from '@candlelib/conflagrate';
import { JSFormalParameters, JSIdentifier, JSNode, JSNodeType } from '@candlelib/js';
import {
    BINDING_VARIABLE_TYPE, HTMLNodeType, IndirectHook, WickBindingNode
} from "../types/all.js";
import { registerFeature } from './build_system.js';
import { Name_Is_A_Binding_Variable, Variable_Is_Declared_In_Closure } from './common/binding.js';
import { getFirstReferenceName, getSetOfEnvironmentGlobalNames } from './common/common.js';

registerFeature(

    "CandleLibrary WICK: JS Functions",
    (build_system) => {

        const AutoCallFunction = build_system.registerHookType("auto-call-function-hook", HTMLNodeType.HTMLAttribute);

        // ###################################################################
        // Function Declaration
        // 
        // Root scoped functions are transformed into methods.
        // 
        build_system.registerJSParserHandler(
            {
                priority: 1,

                async prepareJSNode(node, parent_node, skip, component, presets, frame) {

                    const
                        [name_node] = node.nodes;

                    let
                        name = (<JSIdentifier>name_node).value,
                        root_name = name;

                    if (!frame.IS_ROOT)
                        build_system.addNameToDeclaredVariables(name, frame);
                    else
                        build_system.addBindingVariable(frame, name, node.pos, BINDING_VARIABLE_TYPE.METHOD_VARIABLE);

                    /**
                     * Automatic event handler for root element
                     */
                    if (name.slice(0, 2) == "on") {
                        /**
                         * Any method that is directly called by the component 
                         * runtime system should be mapped here to common names 
                         * that exist for that internal method. 
                         * 
                         * If internal_method_name is defined, then DO NOT create a
                         * event listener call.
                         */
                        const internal_method_name = {
                            "ontransitionin": "oTI",
                            "ontrsin": "oTI",
                            "ontransitionout": "oTO",
                            "ontrsout": "oTO",
                            "onarrange": "aRR",
                            "onload": "onload",
                        }[name.toLocaleLowerCase()] ?? "";

                        if (internal_method_name != "") {
                            // This should be an internally called method
                            (<JSIdentifier>name_node).value = internal_method_name;
                        } else {

                            //For use with DOM on* methods
                            build_system.addHook(component, {
                                selector: name,
                                hook_value: <WickBindingNode>{
                                    type: HTMLNodeType.WickBinding,
                                    primary_ast: Object.assign(
                                        {},
                                        name_node,
                                        { type: JSNodeType.IdentifierReference }
                                    ),
                                    value: name.slice(2),
                                    IS_BINDING: true
                                },
                                host_node: node,
                                html_element_index: 0,
                                pos: node.pos
                            });
                        }
                    } else if (name[0] == "$") {

                        if (frame.IS_ROOT) {
                            // hoist binding references to the parameters of the function 
                            // and convert back to normal variables. 

                            const function_frame = await build_system.processFunctionDeclaration(<JSNode>node, component, presets, root_name);

                            //Grab references to the binding variables
                            const candidate_params = [
                                ...new Map(
                                    function_frame
                                        .binding_ref_identifiers.filter(({ value }) => {
                                            const global_names = getSetOfEnvironmentGlobalNames();
                                            return !global_names.has(value);
                                        })
                                        .map(id => [id.value, id])).values()
                            ];

                            console.log(candidate_params);

                            const call_ids = candidate_params.map(copy);

                            // Reset the binding identifiers to plain old references and 
                            // clear them from the function frame.

                            const name_map = new Map();
                            const param_ids = candidate_params.map(copy).map(id => {
                                if (!name_map.has(id.value))
                                    name_map.set(id.value, "$$" + name_map.size);

                                id.value = name_map.get(id.value);

                                return id;
                            });
                            //  function_frame.binding_ref_identifiers.forEach(id => {
                            //      id.type = JSNodeType.IdentifierReference;
                            //      if (name_map.has(id.value))
                            //          id.value = name_map.get(id.value);
                            //  });
                            //
                            //  function_frame.binding_ref_identifiers.length = 0;

                            const name = function_frame.ast.nodes[0].value;

                            // Insert plain old versions of the references into the 
                            // parameters list of the function frame ast. 

                            // This WILL REPLACE any existing parameters of 
                            // the function. 

                            function_frame.ast.nodes[1] = <JSFormalParameters>{
                                type: JSNodeType.FormalParameters,
                                nodes: [
                                    { type: JSNodeType.IdentifierBinding, value: "c" },
                                ],
                                pos: function_frame.ast.pos
                            };

                            function_frame.ast.nodes[2].nodes.unshift(build_system.js.stmt(`if(c>0) return;`));

                            // Create a new ast node that will server as the caller to the function 
                            // when bindings are updated and insert into an indirect hook. 

                            const call = build_system.js.stmt(`this.${name}(c)`);


                            // Push the origin binding ref identifiers into the 
                            // arguments of the new ast call
                            // @ts-ignore
                            call.nodes[0].nodes[1].nodes.push(...call_ids);

                            console.dir({ call }, { depth: null });

                            build_system.addIndirectHook(component, AutoCallFunction, call, 0, false);

                            return null;
                        }
                    }

                    skip(1);

                    return new Promise(async res => {
                        await build_system.processFunctionDeclaration(<JSNode>node, component, presets, root_name);
                        res(null);
                    });
                }

            }, JSNodeType.FunctionDeclaration, JSNodeType.FunctionExpression
        );

        build_system.registerHookHandler<IndirectHook<JSNode>, JSNode | void>({

            name: "Automatically Calls Function on binding updates",

            types: [AutoCallFunction],

            verify: () => true,

            buildJS: (node, comp, presets, element_index, addOnBindingUpdate, addInitBindingInit) => {
                // extract the nodes that are binding references

                const call_stmt = node.nodes[0];

                const refs = call_stmt.nodes[0].nodes[1].nodes.slice(1);

                call_stmt.nodes[0].nodes[1].nodes.length = 1;

                addOnBindingUpdate(call_stmt, ...refs);

                return null;
            },

            buildHTML: () => null
        });
        /* ###################################################################
         * ARROW EXPRESSION
         */
        build_system.registerJSParserHandler(
            {
                priority: 1,

                async prepareJSNode(node, parent_node, skip, component, presets, frame) {

                    const { ast } = await build_system.processJSNode(
                        <JSNode>node, component, presets, null, frame, true
                    );

                    skip();

                    return <JSNode>ast;
                }

            }, JSNodeType.ArrowFunction
        );

        /*############################################################
        * FORMAL PARAMETERS
        */
        build_system.registerJSParserHandler(
            {
                priority: 1,

                prepareJSNode(node, parent_node, skip, component, presets, frame) {

                    if (parent_node == frame.ast) {
                        for (const { node: binding, meta } of traverse(node, "nodes", 4)
                            .filter("type", JSNodeType.IdentifierBinding, JSNodeType.IdentifierReference)
                        ) {
                            build_system.addNameToDeclaredVariables(<string>binding.value, frame);
                        }
                    }
                }

            }, JSNodeType.FormalParameters
        );

        // ###################################################################
        // Call Expression Identifiers
        //
        // If the identifier is used as the target of a call expression, add the call
        // expression node to the variable's references list.
        build_system.registerJSParserHandler(
            {
                priority: 1,

                async prepareJSNode(node, parent_node, skip, component, presets, frame) {

                    node = await build_system.processNodeAsync(<JSNode>node, frame, component, presets, true);

                    const
                        [id] = node.nodes,
                        name = <string>getFirstReferenceName(<JSNode>id);//.value;

                    if (!Variable_Is_Declared_In_Closure(name, frame)
                        && Name_Is_A_Binding_Variable(name, frame)) {

                        build_system.addBindingReference(
                            <JSNode>id,
                            <JSNode>node,
                            frame);

                        build_system.addReadFlagToBindingVariable(name, frame);

                        skip(1);
                    }

                    return <JSNode>node;
                }
            }, JSNodeType.CallExpression
        );

    }

);