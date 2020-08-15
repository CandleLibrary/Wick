import { traverse } from "@candlefw/conflagrate";
import { JSNode, JSNodeType } from "@candlefw/js";
import { Lexer } from "@candlefw/wind";

import Presets from "../presets.js";
import { compileComponent } from "./component.js";
import { Component, DATA_FLOW_FLAG, FunctionFrame, VARIABLE_REFERENCE_TYPE } from "../types/types.js";
import { HTMLNode } from "../wick.js";
import { acquireComponentASTFromRemoteSource } from "./component_acquire_ast.js";
import { addBindingVariable, addWrittenBindingVariableName } from "./component_binding_common.js";
import { componentDataToJSCached } from "./component_data_to_js.js";


/**
 * Set the givin Lexer as the pos val for each node
 * @param node 
 * @param pos 
 */
export function setPos(node, pos: Lexer) {

    if (!pos)
        throw new TypeError("[pos] is null - this node will not render source maps correctly.");

    for (const { node: n } of traverse(node, "nodes"))
        n.pos = pos;

    return node;
}

/**
 * Take the data from the source component and merge it into the destination component. Asserts
 * the source component has only CSS and Javascript data, and does not represent an HTML element.
 * @param destination_component 
 * @param source_component 
 */
export function mergeComponentData(destination_component: Component, source_component: Component) {

    if (source_component.CSS) destination_component.CSS.push(...source_component.CSS);


    if (!destination_component.HTML)
        destination_component.HTML = source_component.HTML;
    else
        throw new Error(`Cannot combine components. The source component ${source_component.location} contains a default HTML export that conflicts with the destination component ${destination_component.location}`);

    for (const [, data] of source_component.root_frame.binding_type.entries())
        addBindingVariable(data, destination_component.root_frame);

    for (const name of source_component.names)
        destination_component.names.push(name);

    destination_component.frames.push(...source_component.frames);
}

export async function importComponentData(new_component_url, component, presets, local_name: string) {

    try {

        const { ast, string, resolved_url } = await acquireComponentASTFromRemoteSource(new_component_url, component.location);

        // If the ast is an HTML_NODE with a single style element, then integrate the 
        // css data into the current component. 

        const comp_data = await compileComponent(ast, string, resolved_url, presets);

        componentDataToJSCached(comp_data, presets);

        if (local_name) component.local_component_names.set(local_name.toUpperCase(), comp_data.name);

        if (!comp_data.HTML) mergeComponentData(component, comp_data);


    } catch (e) {
        console.log("TODO: Replace with a temporary warning component.", e);
    }

}

export async function importResource(
    from_value: string,
    component: Component,
    presets: Presets,
    node: HTMLNode | JSNode,
    local_name: string = "",
    names: { local: string, external: string; }[] = [],
    frame: FunctionFrame
): Promise<void> {

    let flag: DATA_FLOW_FLAG = null, ref_type: VARIABLE_REFERENCE_TYPE = null;

    const [url, meta] = from_value.split(":");

    switch (url.trim()) {
        default:
            // Read file and determine if we have a component, a script or some other resource. REQUIRING
            // extensions would make this whole process 9001% easier. such .html for html components,
            // .wjs for js components, and any other extension type for other kinds of files.
            // Also could consider MIME type information for files that served through a web
            // server.

            //Compile Component Data
            await importComponentData(
                from_value,
                component,
                presets,
                local_name
            );

            return;

        case "@registered":
            const comp_name = local_name.toUpperCase();
            if (local_name && presets.named_components.has(comp_name))
                component.local_component_names.set(comp_name, presets.named_components.get(comp_name).name);
            return;

        case "@parent":
            /* all ids within this node are imported binding_variables from parent */
            //Add all elements to global scope
            ref_type = VARIABLE_REFERENCE_TYPE.PARENT_VARIABLE; flag = DATA_FLOW_FLAG.FROM_PARENT;
            break;

        case "@api":
            ref_type = VARIABLE_REFERENCE_TYPE.API_VARIABLE; flag = DATA_FLOW_FLAG.FROM_PRESETS;
            break;

        case "@global":
            ref_type = VARIABLE_REFERENCE_TYPE.GLOBAL_VARIABLE; flag = DATA_FLOW_FLAG.FROM_OUTSIDE;
            break;

        case "@model":
            if (meta) component.global_model = meta.trim();
            ref_type = VARIABLE_REFERENCE_TYPE.MODEL_VARIABLE; flag = DATA_FLOW_FLAG.FROM_MODEL;
            break;

        case "@presets":
            /* all ids within this node are imported form the presets object */
            break;
    }

    for (const { local, external } of names) {

        if (!addBindingVariable({
            pos: node.pos,
            external_name: external || local,
            internal_name: local,
            class_index: -1,
            type: ref_type,
            flags: flag
        }, frame))
            node.pos.throw(`Import variable [${local}] already declared`);

        addWrittenBindingVariableName(local, frame);

        //setComponentVariable(ref_type, local, component, external || local, flag, <JSNode>node);
    }
}

/** JS COMMON */
export function getFirstReferenceNode(node: JSNode): JSNode {
    for (const { node: id } of traverse(node, "nodes").filter("type", JSNodeType.IdentifierReference))
        return id;
    return null;
}

export function getFirstReferenceName(node: JSNode): string {

    const ref = getFirstReferenceNode(node);

    if (ref)
        return <string>ref.value;
    return "";
}