import { JSNode, JSNodeType, JSStringLiteral } from '@candlelib/js';
import { ComponentData } from '../../entry-point/wick-full.js';
import { registerFeature } from './../build_system.js';

registerFeature(

    "CandleLibrary WICK: JS Strings",
    (build_system) => {

        const CSSSelectorHook = build_system.registerHookType("css-selector-hook", JSNodeType.StringLiteral);

        /**############################################################
         * STRING PRIMITIVE
         * 
         * String with identifiers for HTML Elements. 
         */
        build_system.registerJSParserHandler(
            {
                priority: 1,

                prepareJSNode(node, parent_node, skip, component, presets, frame) {

                    if ((<JSStringLiteral>node).value[0] == "@") {

                        return Object.assign({}, node, {
                            type: CSSSelectorHook
                        });
                    }

                    return <JSNode>node;
                }

            }, JSNodeType.StringLiteral
        );

        function convertAtLookupToElementRef(string_node: JSStringLiteral, component: ComponentData) {

            const css_selector = string_node.value.slice(1); //remove "@"

            let html_nodes = null, expression = null;

            switch (css_selector.toLowerCase()) {
                case "ctxwebgpu":
                    html_nodes = build_system.css.matchAll("canvas", component.HTML)[0];

                    if (html_nodes)
                        expression = build_system.js.expr(`$$ele${html_nodes.element_index}.getContext("gpupresent")`);

                    break;
                case "ctx3d":
                    html_nodes = build_system.css.matchAll("canvas", component.HTML)[0];

                    if (html_nodes)

                        expression = build_system.js.expr(`$$ele${html_nodes.element_index}.getContext("webgl2")`);

                    break;

                case "ctx2d":
                    html_nodes = build_system.css.matchAll("canvas", component.HTML)[0];

                    if (html_nodes)
                        expression = build_system.js.expr(`$$ele${html_nodes.element_index}.getContext("2d")`);

                    break;

                default:
                    html_nodes = build_system.css.matchAll(css_selector, component.HTML);

                    if (html_nodes.length > 0)

                        expression = (html_nodes.length == 1)
                            ? build_system.js.expr(`$$ele${html_nodes[0].element_index}; `)
                            : build_system.js.expr(`[${html_nodes.map(e => `$$ele${e.element_index}`).join(",")}]`);

            }

            return expression;
        }

        build_system.registerHookHandler<JSStringLiteral, JSStringLiteral>({

            name: "CSS Selector Reference",

            types: [CSSSelectorHook],

            verify: () => true,

            buildJS: (node, comp, presets, element_index, addOnBindingUpdate) => {
                //Replace the value with a 
                const exp = convertAtLookupToElementRef(node, comp);

                if (exp)
                    return exp;
            },

            buildHTML: (node, comp, presets, model) => null
        });


    }

);