import { JSNode, JSNodeType, stmt } from '@candlelib/js';
import {
    HTMLAttribute, HTMLNodeType,
    IndirectHook
} from "../types/all.js";
import { registerFeature } from './build_system.js';

registerFeature(

    "CandleLibrary WICK: HTML on<Event> Attributes",
    (build_system) => {

        const OnEventHook = build_system.registerHookType("on-event-hook", JSNodeType.StringLiteral);

        build_system.registerHTMLParserHandler<HTMLAttribute>(
            {
                priority: 10,

                async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

                    if (node.name.slice(0, 2) == "on") {

                        // Process the primary expression for Binding Refs and static
                        // data
                        const ast = await build_system.processBindingAsync(node.value, component, presets);

                        // Create an indirect hook for container data attribute

                        build_system.addIndirectHook(component, OnEventHook, { action: node.name, nodes: [ast] }, index);

                        // Remove the attribute from the container element

                        return null;

                    }
                }
            }, HTMLNodeType.HTMLAttribute
        );


        build_system.registerHookHandler<IndirectHook<{ nodes: [JSNode], action: string; }>, JSNode | void>({

            name: "On Event Hook",

            types: [OnEventHook],

            verify: () => true,

            buildJS: (node, comp, presets, element_index, _1, addInit) => {
                // Replace the value with a 
                // Get the on* attribute name
                const
                    { action, nodes: [ast] } = node.nodes[0],

                    ele_name = "$$ele" + element_index,

                    s = stmt(`${ele_name}.addEventListener("${action.slice(2)}", v=>a)`);

                s.nodes[0].nodes[1].nodes[1].nodes[1] = ast;

                addInit(s);
            },

            buildHTML: (node, comp, presets, model) => null
        });
    }
);