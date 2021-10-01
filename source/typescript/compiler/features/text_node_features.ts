import { JSExpressionClass, JSExpressionStatement, JSNode } from '@candlelib/js';
import {
    HTMLNode, HTMLNodeType,
    IndirectHook, WickBindingNode
} from "../../types/all.js";
import { registerFeature } from './../build_system.js';

registerFeature(

    "CandleLibrary WICK: HTML Text Nodes",
    (build_system) => {

        const TextNodeHookType = build_system.registerHookType("text-node-hook", HTMLNodeType.HTMLText);
        /** ##########################################################
         * Text Node Binding
         */
        build_system.registerHTMLParserHandler({

            priority: 1,

            async prepareHTMLNode(node: WickBindingNode, _, _1, index, _2, component, presets) {

                const ast = await build_system.processBindingAsync(node, component, presets);

                build_system.addIndirectHook(component, TextNodeHookType, ast, index + 1);

                // Skip processing this node in the outer scope, 
                // it will be replaced with a CompiledBinding node.

                return <HTMLNode>{
                    type: HTMLNodeType.HTML_BINDING_ELEMENT,
                    IS_BINDING: true,
                    value: "",
                    pos: node.pos
                };
            }
        }, HTMLNodeType.WickBinding);


        /**
         * Hook Type for Text Node
         */
        build_system.registerHookHandler<IndirectHook<JSExpressionClass>, JSExpressionStatement>({

            name: "Text Node Binding Hook",

            types: [TextNodeHookType],

            verify: () => true,

            buildJS: (node, comp, presets, element_index, addOnBindingUpdate) => {

                const st = build_system.js.stmt<JSExpressionStatement>(`$$ele${element_index}.data = 0`);

                st.nodes[0].nodes[1] = <JSNode>node.nodes[0];

                addOnBindingUpdate(st);

                return null;
            },

            buildHTML: (node, comp, presets, model) => null
        });

    }

);