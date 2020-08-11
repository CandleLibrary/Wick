import { Component, VARIABLE_REFERENCE_TYPE, FunctionFrame, DATA_FLOW_FLAG } from "../types/types.js";
import { acquireComponentASTFromRemoteSource, compileComponent } from "./component.js";
import { componentDataToJSCached } from "./component_data_to_js.js";
import Presets from "../presets.js";
import { addBindingVariable, addWrittenBindingVariableName } from "./component_binding_common.js";
import { MinTreeNode, MinTreeNodeType } from "@candlefw/js";
import { traverse } from "@candlefw/conflagrate";

/**
 * Take the data from the source component and merge it into the destination component.
 * @param destination_component 
 * @param source_component 
 */
export function mergeComponentData(destination_component: Component, source_component: Component) {

    if (source_component.CSS) destination_component.CSS.push(...source_component.CSS);

    if (!destination_component.HTML)
        destination_component.HTML = source_component.HTML;
    else
        console.warn("TODO: Loss of HTML in merged component.");

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

        if (!comp_data.HTML)
            mergeComponentData(component, comp_data);

    } catch (e) {
        console.log("TODO: Replace with a temporary warning component.", e);
    }

}

export async function importResource(
    from_value: string,
    component: Component,
    presets: Presets,
    node,
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

        addBindingVariable({
            pos: null,
            external_name: external || local,
            internal_name: local,
            class_index: -1,
            type: ref_type,
            flags: flag
        }, frame);

        addWrittenBindingVariableName(local, frame);

        //setComponentVariable(ref_type, local, component, external || local, flag, <MinTreeNode>node);
    }
}

export function createFrame(parent_frame: any, TEMPORARY: boolean = false, component: Component) {

    const function_frame = <FunctionFrame>{
        ast: null,
        declared_variables: new Set(),
        input_names: new Set(),
        output_names: new Set(),
        binding_ref_identifiers: [],
        prev: parent_frame,
        IS_ROOT: !parent_frame,
        IS_TEMP_CLOSURE: TEMPORARY,
        binding_type: (!parent_frame) ? new Map : null,
    };

    if (!parent_frame) component.root_frame = function_frame;

    if (!TEMPORARY) component.frames.push(function_frame);


    return function_frame;
}

/** JS COMMON */
export function getFirstReferenceNode(node: MinTreeNode): MinTreeNode {
    for (const { node: id } of traverse(node, "nodes").filter("type", MinTreeNodeType.IdentifierReference))
        return id;
    return null;
}

export function getFirstReferenceName(node: MinTreeNode): string {

    const ref = getFirstReferenceNode(node);

    if (ref)
        return <string>ref.value;
    return "";
}