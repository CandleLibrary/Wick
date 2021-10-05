
import { HTMLNodeType } from "../../types/all.js";
import { convertMarkdownToHTMLNodes } from '../common/markdown.js';
import { registerFeature } from './../build_system.js';

registerFeature(

    "CandleLibrary WICK: Markdown Features",
    (build_system) => {

        /** ##########################################################
         *  Markdown Elements
         */
        build_system.registerHTMLParserHandler(
            {
                priority: -99999,

                async prepareHTMLNode(node, host_node, host_element, index, skip, component, context) {
                    return convertMarkdownToHTMLNodes(node.nodes[0]);
                }

            }, HTMLNodeType.MARKDOWN
        );
    }
);