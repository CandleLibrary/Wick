import {
    JSNodeType
} from '@candlelib/js';
import { renderCompressed } from "../source-code-render/render.js";
import {
    BINDING_VARIABLE_TYPE,
    HTMLNodeType
} from "../../types/all.js";
import { registerFeature } from '../build_system.js';
import { getExtendTypeVal } from "../common/extended_types.js";
import { AsyncFunction } from '../data/AsyncFunction.js';
import * as utils from "../common/utils.js";


export const ContainerDataHook = getExtendTypeVal("container-data-hook", HTMLNodeType.HTMLAttribute);

registerFeature(

    "CandleLibrary WICK: Server Side Templating",
    (build_system) => {

        /** ##########################################################
         *  Container Elements
         */
        build_system.registerJSParserHandler(
            {
                priority: 99999999999,

                async prepareJSNode(node, par, skip, comp, context, frame) {

                    if (comp.TEMPLATE) {

                        const [call] = node.nodes;

                        if (call.type == JSNodeType.CallExpression) {

                            const id = call.nodes[0]?.value;

                            const binding = build_system.getBindingFromExternalName(id, comp);

                            if (binding && binding.type == BINDING_VARIABLE_TYPE.TEMPLATE_INITIALIZER) {

                                build_system.addNameToDeclaredVariables(call.nodes[0].value, frame);

                                const [arg, ...other] = call.nodes[1]?.nodes ?? [];

                                if (!arg || other.length > 0 || (arg.type != JSNodeType.ArrowFunction && arg.type != JSNodeType.FunctionExpression))
                                    call.pos.throw("Expecting a callable literal as the only argument to define_ids", comp.location.toString());

                                const initializer = AsyncFunction(`return (${renderCompressed(arg)})(...arguments)`);

                                utils.set_working_directory(comp.location);

                                const ids = await initializer(utils);

                                utils.reset_working_directory();

                                if (!Array.isArray(ids))
                                    arg.pos.throw("Expecting return value to be an array ", comp.location.toString());

                                context.template_data.set(comp, ids);

                                return null;
                            }
                        }
                    }
                }

            }, JSNodeType.ExpressionStatement
        );
    }
);
