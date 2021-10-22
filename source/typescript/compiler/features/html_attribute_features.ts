
import { JSNode, JSNodeType } from '@candlelib/js';
import {
    HTMLNode,
    HTMLAttribute, HTMLNodeType,
    IndirectHook,
    STATIC_RESOLUTION_TYPE,
    BINDING_FLAG
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

                async prepareHTMLNode(attr, host_node, host_element, index, skip, component, context) {


                    if (attr.IS_BINDING) {

                        const ast = await build_system.processBindingAsync(attr.value, component, context);

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

            buildJS: (node, sdp, element_index, addWrite, addInit) => {

                const { name, nodes: [ast] } = node.value[0];

                // If the element in question belongs to another component AND that 
                // component has defined an attribute import for the particular
                // attribute, then update the child components value instead if updating
                // the attribute value.

                const ele = <HTMLNode><any>build_system.getElementAtIndex(sdp.self, element_index);

                if (ele.component_name) {

                    const comp_name = ele.component_name;

                    const child_comp = sdp.context.components.get(comp_name);

                    const child_binding = build_system.getBindingFromExternalName(name, child_comp);

                    const child_comp_id = ele.child_component_index;

                    if (child_binding) {

                        const exp = build_system.js.stmt(`this.ch[${child_comp_id}]
                            .update({ "${child_binding.external_name}":1}, ${BINDING_FLAG.FROM_PARENT});`);

                        exp.nodes[0].nodes[1].nodes[0].nodes[0].nodes[1] = ast;

                        addWrite(<any>exp);

                        return;
                    }
                }

                const s = build_system.js.expr(`this.sa(${element_index},"${name}",e)`);

                s.nodes[1].nodes[2] = ast;

                addWrite(s);
            },

            async buildHTML(hook, sdp) {

                const ast = hook.value[0].nodes[0];


                if (
                    build_system.getExpressionStaticResolutionType(ast, sdp)
                    !==
                    STATIC_RESOLUTION_TYPE.INVALID
                ) {

                    const { value } = await build_system.getStaticValue(ast, sdp);

                    if (value)
                        return <any>{
                            html: { attributes: [[hook.value[0].name, value]] }

                        };
                }
            }
        });

    }

);