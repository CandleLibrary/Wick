import { JSNodeType, tools } from '@candlelib/js';
import { Context } from '../common/context.js';
import { BINDING_VARIABLE_TYPE } from '../../types/all.js';
import { registerFeature } from './../build_system.js';
import { createBuildFrame, createParseFrame } from '../common/frame.js';
import { addNameToDeclaredVariables } from '../common/binding.js';

registerFeature(

    "CandleLibrary WICK: Cure Testing Features",
    (build_system) => {


        /*############################################################3
        * Extract Assert statements from the component;
        */
        build_system.registerJSParserHandler(
            {
                priority: 1,

                async prepareJSNode<JSNode>(node, parent_node, skip, component, context: Context, frame) {

                    if (node.nodes[1].type == JSNodeType.BlockStatement) {

                        const name = tools.getIdentifierName(node.nodes[0]);

                        const binding = build_system.getComponentBinding(name, component);

                        if (binding && binding.type == BINDING_VARIABLE_TYPE.CURE_TEST) {

                            // Get binding variables and other information necessary to properly 
                            // test this component. 

                            // The interior of the block statement will serve as the basis 
                            // for the test rig

                            if (!context.test_rig_sources.has(component)) {
                                context.test_rig_sources.set(component, []);
                            }

                            const temp_frame = createParseFrame(frame, component, true, true);

                            //add the built in assert and assert_group names

                            temp_frame.prev = frame;

                            addNameToDeclaredVariables("assert", temp_frame);
                            addNameToDeclaredVariables("assert_group", temp_frame);

                            const out_node = await build_system.processNodeAsync(
                                node.nodes[1], temp_frame, component, context
                            );

                            context.test_rig_sources.get(component).push(out_node);

                            return null;
                        }
                    }
                }
            }, JSNodeType.LabeledStatement
        );
    }
);