
import { JSNode, stmt } from '@candlelib/js';
import {
    BINDING_VARIABLE_TYPE,
    HTMLAttribute, HTMLNode, HTMLNodeType
} from "../../types/all.js";
import { convertMarkdownToHTMLNodes } from '../common/markdown.js';
import { registerFeature } from './../build_system.js';
import { ComponentHash } from './../common/hash_name.js';

registerFeature(

    "CandleLibrary WICK: Markdown Features",
    (build_system) => {

        /** ##########################################################
         *  Markdown Elements
         */
        build_system.registerHTMLParserHandler(
            {
                priority: -99999,

                async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {


                    return convertMarkdownToHTMLNodes(node.nodes[0]);
                }

            }, HTMLNodeType.MARKDOWN
        );


    }
);