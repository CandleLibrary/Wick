import { traverse } from "@candlefw/conflagrate";
import { JSIdentifierClass, JSNode, JSNodeType } from "@candlefw/js";
import URL from "@candlefw/url";
import { Lexer } from "@candlefw/wind";
import { parseSource } from "../component/parse/source_parser.js";
import { componentDataToJSCached } from "../component/render/js.js";
import { DATA_FLOW_FLAG, BINDING_VARIABLE_TYPE } from "../types/binding";
import { ComponentData } from "../types/component";
import { FunctionFrame } from "../types/function_frame";
import { HTMLNode } from "../types/wick_ast";
import { addBindingVariable, addWriteFlagToBindingVariable } from "./binding.js";
import Presets from "./presets.js";




/**
 * Set the givin Lexer as the pos val for each node
 * @param node 
 * @param pos 
 */
export function setPos(node, pos: Lexer | any) {

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
export function mergeComponentData(destination_component: ComponentData, source_component: ComponentData) {

    if (source_component.CSS) destination_component.CSS.push(...source_component.CSS);

    if (!destination_component.HTML)
        destination_component.HTML = source_component.HTML;
    else
        throw new Error(`Cannot combine components. The source component ${source_component.location} contains a default HTML export that conflicts with the destination component ${destination_component.location}`);

    for (const [, { external_name, flags, internal_name, pos, type }] of source_component.root_frame.binding_variables.entries())
        addBindingVariable(destination_component.root_frame, internal_name, pos, type, external_name, flags);

    for (const name of source_component.names)
        destination_component.names.push(name);

    destination_component.frames.push(...source_component.frames);
}

export async function importComponentData(new_component_url, component, presets, local_name: string) {

    try {

        const comp_data = await parseSource(new URL(new_component_url), presets, component.location);

        //const { ast, string, resolved_url } = await acquireComponentASTFromRemoteSource(new URL(new_component_url), component.location);

        // If the ast is an HTML_NODE with a single style element, then integrate the 
        // css data into the current component. 

        //const comp_data = await compileComponent(ast, string, resolved_url, presets);

        componentDataToJSCached(comp_data, presets);

        if (local_name) component.local_component_names.set(local_name.toUpperCase(), comp_data.name);

        if (!comp_data.HTML) mergeComponentData(component, comp_data);


    } catch (e) {
        console.log("TODO: Replace with a temporary warning component.", e);
    }

}

export async function importResource(
    from_value: string,
    component: ComponentData,
    presets: Presets,
    node: HTMLNode | JSNode,
    local_name: string = "",
    names: { local: string, external: string; }[] = [],
    frame: FunctionFrame
): Promise<void> {

    let flag: DATA_FLOW_FLAG = null, ref_type: BINDING_VARIABLE_TYPE = null;

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
            ref_type = BINDING_VARIABLE_TYPE.PARENT_VARIABLE; flag = DATA_FLOW_FLAG.FROM_PARENT;
            break;

        case "@api":
            ref_type = BINDING_VARIABLE_TYPE.API_VARIABLE; flag = DATA_FLOW_FLAG.FROM_PRESETS;
            break;

        case "@global":
            ref_type = BINDING_VARIABLE_TYPE.GLOBAL_VARIABLE; flag = DATA_FLOW_FLAG.FROM_OUTSIDE;
            break;

        case "@model":
            if (meta) component.global_model_name = meta.trim();
            ref_type = BINDING_VARIABLE_TYPE.MODEL_VARIABLE; flag = DATA_FLOW_FLAG.FROM_MODEL;
            break;

        case "@presets":
            /* all ids within this node are imported form the presets object */
            break;
    }

    for (const { local, external } of names) {

        if (!addBindingVariable(frame, local, node.pos, ref_type, external || local, flag))
            //@ts-ignore
            node.pos.throw(`Import variable [${local}] already declared`);

        addWriteFlagToBindingVariable(local, frame);
    }
}

/** JS COMMON */
export function getFirstReferenceNode(node: JSNode): JSIdentifierClass {
    for (const { node: id } of traverse(node, "nodes").filter("type", JSNodeType.IdentifierReference))
        return <JSIdentifierClass>id;
    return null;
}

export function getFirstReferenceName(node: JSNode): string {

    const ref = getFirstReferenceNode(node);

    if (ref)
        return <string>ref.value;
    return "";
}