import { JSNode, JSNodeType } from '@candlelib/js';
import {
    BINDING_VARIABLE_TYPE, ContainerDomLiteral, HTMLAttribute, HTMLNodeType, IndirectHook,
    STATIC_RESOLUTION_TYPE
} from "../../types/all.js";
import { registerFeature } from './../build_system.js';
import { getElementAtIndex } from './../common/html.js';
import { BindingIdentifierBinding, BindingIdentifierReference } from './../common/js_hook_types.js';

registerFeature(

    "CandleLibrary WICK: HTML Inputs",
    (build_system) => {

        const TextInputValueHook = build_system.registerHookType("text-input-value-hook", HTMLNodeType.HTMLAttribute);
        const CheckboxInputValueHook = build_system.registerHookType("checkbox-input-value-hook", HTMLNodeType.HTMLAttribute);

        /** ###########################################################
         *  Input Text Value Attribute
         */
        build_system.registerHTMLParserHandler<HTMLAttribute>(
            {
                priority: -10,

                async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

                    if (node.name == "value" && (host_node.tag == "INPUT" || host_node.tag == "TEXTAREA")) {

                        if (host_node.tag == "TEXTAREA") {


                            // Process the primary expression for Binding Refs and static
                            // data
                            const ast = await build_system.processBindingAsync(node.value, component, presets);

                            // Create an indirect hook for container data attribute

                            build_system.addIndirectHook(component, TextInputValueHook, ast, index);

                            // Remove the attribute from the container element

                            return null;
                        }

                        if (host_node.attributes.some(val => val.value == "text")) {


                            // Process the primary expression for Binding Refs and static
                            // data
                            const ast = await build_system.processBindingAsync(node.value, component, presets);

                            // Create an indirect hook for container data attribute

                            build_system.addIndirectHook(component, TextInputValueHook, ast, index);

                            // Remove the attribute from the container element

                            return null;
                        }

                        if (host_node.attributes.some(val => val.value == "checkbox")) {


                            // Process the primary expression for Binding Refs and static
                            // data
                            const ast = await build_system.processBindingAsync(node.value, component, presets);

                            // Create an indirect hook for container data attribute

                            build_system.addIndirectHook(component, CheckboxInputValueHook, ast, index);

                            // Remove the attribute from the container element

                            return null;
                        }
                    }

                }
            }, HTMLNodeType.HTMLAttribute
        );

        build_system.registerHookHandler<IndirectHook<JSNode>, JSNode | void>({

            name: "Text Input Value Handler",

            types: [TextInputValueHook],

            verify: () => true,

            buildJS: (node, comp, presets, element_index, addOnBindingUpdate, addInitBindingInit) => {
                const { expr, stmt } = build_system.js;

                const
                    ele_name = "$$ele" + element_index,
                    expression = node.value[0],
                    root_type = expression.type,
                    READONLY = build_system.getElementAtIndex(comp, element_index)
                        ?.attributes
                        ?.some(([v]) => v.toLowerCase() == "readonly");
                // Determine whether the expression is trivial, simple, or complex.
                // Trivial expressions are built in types. Number, Boolean, and String (and templates without bindings).
                // Simple expression are single identifiers
                // Complex expression are anything else
                if (
                    root_type == JSNodeType.NumericLiteral ||
                    root_type == JSNodeType.BigIntLiteral ||
                    root_type == JSNodeType.StringLiteral
                ) {
                    //This will have been directly assigned to static html, discard
                    return;
                }

                // The expression will at least produce an output that will be assigned

                const s = stmt(`${ele_name}.value = 1`);
                s.nodes[0].nodes[1] = (expression);
                addOnBindingUpdate(s);

                if (
                    (
                        root_type == BindingIdentifierBinding ||
                        root_type == BindingIdentifierReference
                    ) && !READONLY

                ) {
                    // The expression is a potentially bi-directional attachment
                    // to a binding variable. This applies if the binding is:
                    // - UNDECLARED ( Defaults to model attachment )
                    // - MODEL_VARIABLE
                    // - INTERNAL_VARIABLE
                    // - METHOD_VARIABLE (The method will be called with value of the input)

                    const binding = build_system.getComponentBinding(expression.value, comp);

                    if (
                        binding.type == BINDING_VARIABLE_TYPE.UNDECLARED
                        ||
                        binding.type == BINDING_VARIABLE_TYPE.MODEL_VARIABLE
                        ||
                        binding.type == BINDING_VARIABLE_TYPE.INTERNAL_VARIABLE
                        ||
                        binding.type == BINDING_VARIABLE_TYPE.PARENT_VARIABLE
                    ) {
                        const e = expr(`a=$$ele${element_index}.value`);
                        e.nodes[0] = expression;
                        const s = stmt(`this.attachListener(${element_index}, "input",  _=>a)`);
                        s.nodes[0].nodes[1].nodes[2].nodes[1] = e;
                        addInitBindingInit(s);
                    } else if (binding.type == BINDING_VARIABLE_TYPE.METHOD_VARIABLE) {
                        const e = expr(`this.${binding.internal_name}(v)`);
                        e.nodes[1].nodes[0] = expression;
                        const s = stmt(`this.attachListener(${element_index}, "input",  _=>a)`);
                        s.nodes[0].nodes[1].nodes[2].nodes[1] = e;
                        addInitBindingInit(s);
                    }
                }
            },

            buildHTML: async (hook, comp, presets, model, parents) => {

                const ele: ContainerDomLiteral = <any>getElementAtIndex(comp, hook.ele_index);

                if (
                    build_system.getExpressionStaticResolutionType(<JSNode>hook.value[0], comp, presets)
                    !==
                    STATIC_RESOLUTION_TYPE.INVALID
                ) {

                    const { value } = await build_system.getStaticValue(hook.value[0], comp, presets, model, parents);

                    if (value !== null)
                        return <any>{
                            html: { attributes: [["value", value]] }
                        };
                }
            }
        });


        build_system.registerHookHandler<IndirectHook<JSNode>, JSNode | void>({

            name: "Checkbox Input Value Handler",

            types: [CheckboxInputValueHook],

            verify: () => true,

            buildJS: (node, comp, presets, element_index, addOnBindingUpdate, addInitBindingInit) => {
                const { expr, stmt } = build_system.js,
                    ele_name = "$$ele" + element_index,
                    expression = node.value[0],
                    root_type = expression.type,
                    READONLY = getElementAtIndex(comp, element_index)
                        .attributes
                        .some(([v]) => v.toLowerCase() == "readonly");
                // Determine whether the expression is trivial, simple, or complex.
                // Trivial expressions are built in types. Number, Boolean, and String (and templates without bindings).
                // Simple expression are single identifiers
                // Complex expression are anything else
                if (
                    root_type == JSNodeType.NumericLiteral ||
                    root_type == JSNodeType.BigIntLiteral ||
                    root_type == JSNodeType.StringLiteral
                ) {
                    //This will have been directly assigned to static html, discard
                    return;
                }

                // The expression will at least produce an output that will be assigned

                const s = stmt(`${ele_name}.checked = !!(1)`);
                s.nodes[0].nodes[1].nodes[0].nodes[0] = (expression);
                addOnBindingUpdate(s);

                if (
                    (
                        root_type == BindingIdentifierBinding ||
                        root_type == BindingIdentifierReference
                    ) && !READONLY

                ) {
                    // The expression is a potentially bi-directional attachment
                    // to a binding variable. This applies if the binding is:
                    // - UNDECLARED ( Defaults to model attachment )
                    // - MODEL_VARIABLE
                    // - INTERNAL_VARIABLE
                    // - METHOD_VARIABLE (The method will be called with value of the input)

                    const binding = build_system.getComponentBinding(expression.value, comp);

                    if (
                        binding.type == BINDING_VARIABLE_TYPE.UNDECLARED
                        ||
                        binding.type == BINDING_VARIABLE_TYPE.MODEL_VARIABLE
                        ||
                        binding.type == BINDING_VARIABLE_TYPE.INTERNAL_VARIABLE
                    ) {
                        const e = expr(`a=$$ele${element_index}.checked`);
                        e.nodes[0] = expression;
                        const s = stmt(`this.attachListener(${element_index}, "input",  _=>a)`);
                        s.nodes[0].nodes[1].nodes[2].nodes[1] = e;
                        addInitBindingInit(s);
                    } else if (binding.type == BINDING_VARIABLE_TYPE.METHOD_VARIABLE) {
                        const e = expr(`this.${binding.internal_name}(v)`);
                        e.nodes[1].nodes[0] = expression;
                        const s = stmt(`this.attachListener(${element_index}, "input",  _=>a)`);
                        s.nodes[0].nodes[1].nodes[2].nodes[1] = e;
                        addInitBindingInit(s);
                    }
                }
            },

            buildHTML: async (hook, comp, presets, model, parents) => {


                const ele: ContainerDomLiteral = <any>getElementAtIndex(comp, hook.ele_index);

                if (
                    build_system.getExpressionStaticResolutionType(<JSNode>hook.value[0], comp, presets)
                    !==
                    STATIC_RESOLUTION_TYPE.INVALID
                ) {

                    const { value } = await build_system.getStaticValue(hook.value[0], comp, presets, model, parents);

                    if (value !== null)
                        return <any>{
                            html: { attributes: [["checked", !!value]] }

                        };
                }
            }
        });
    }

);