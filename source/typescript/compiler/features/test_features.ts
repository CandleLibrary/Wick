import { JSNodeType, JSExpressionStatement } from '@candlelib/js';
import { registerFeature } from './../build_system.js';
import { BINDING_VARIABLE_TYPE } from '../../types/all.js';
import { tools } from '@candlelib/js';
import { renderNew, renderNewFormatted } from '../source-code-render/render.js';

registerFeature(

    "CandleLibrary WICK: Cure Testing Features",
    (build_system) => {


        /*############################################################3
        * Extract Assert statements from the component;
        */
        build_system.registerJSParserHandler(
            {
                priority: 1,

                prepareJSNode<JSExpressionStatement>(node, parent_node, skip, component, context, frame) {

                    if (node.nodes[1].type == JSNodeType.BlockStatement) {

                        const name = tools.getIdentifierName(node.nodes[0]);

                        const binding = build_system.getComponentBinding(name, component);

                        if (binding && binding.type == BINDING_VARIABLE_TYPE.CURE_TEST) {

                            // Get binding variables and other information necessary to properly 
                            // test this component. 

                            // The interior of the block statement will serve as the basis 
                            // for the test rig

                            if (!context.test_rig_sources.has(component)) {
                                context.test_rig_sources.set(component, [])
                            }

                            context.test_rig_sources.get(component)
                                .push(renderNewFormatted(node.nodes[1]));

                            return null;
                        }
                    }
                }
            }, JSNodeType.LabeledStatement
        );
    }
);