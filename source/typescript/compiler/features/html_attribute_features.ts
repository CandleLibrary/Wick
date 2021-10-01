import { JSNode, JSNodeType } from '@candlelib/js';
import {
    HTMLAttribute, HTMLNodeType,
    IndirectHook,
    STATIC_RESOLUTION_TYPE
} from "../../types/all.js";
import { registerFeature } from './../build_system.js';

registerFeature(

    "CandleLibrary WICK: HTML Basic Attributes",
    (build_system) => {

        const AttributeHook = build_system.registerHookType("attribute-hook", JSNodeType.StringLiteral);


        /** ##########################################################
         * BINDING ATTRIBUTE VALUE 
         */
        build_system.registerHTMLParserHandler<HTMLAttribute>(
            {
                priority: -100000000, // <- Truly meant to be overridden

                async prepareHTMLNode(attr, host_node, host_element, index, skip, component, presets) {

                    if (attr.IS_BINDING) {

                        const ast = await build_system.processBindingAsync(attr.value, component, presets);

                        // Create an indirect hook for container data attribute

                        build_system.addIndirectHook(component, AttributeHook, { name: attr.name, nodes: [ast] }, index, true);

                        return null;
                    }
                }
            }, HTMLNodeType.HTMLAttribute
        );

        build_system.registerHookHandler<IndirectHook<{ name: string; nodes: [JSNode]; }>, JSNode | void>({

            name: "General Attribute Hook",

            types: [AttributeHook],

            verify: () => true,

            buildJS: (node, comp, presets, element_index, addWrite, addInit) => {

                const { name, nodes: [ast] } = node.value[0];

                const s = build_system.js.expr(`$$ele${element_index}.setAttribute("${name}",e)`);

                s.nodes[1].nodes[1] = ast;

                addWrite(s);
            },

            async buildHTML(hook, comp, presets, model, parents) {

                const ast = hook.value[0].nodes[0];


                if (
                    build_system.getExpressionStaticResolutionType(ast, comp, presets)
                    !==
                    STATIC_RESOLUTION_TYPE.INVALID
                ) {

                    return <any>{
                        html: { attributes: [[hook.value[0].name, await build_system.getStaticValue(ast, comp, presets, model, parents)]] }

                    };
                }
            }
        });

    }

);