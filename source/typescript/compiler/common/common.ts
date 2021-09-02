import { traverse } from "@candlelib/conflagrate";
import { JSIdentifierClass, JSNode, JSNodeType } from "@candlelib/js";
import URI from '@candlelib/uri';
import { Lexer } from "@candlelib/wind";
import { BINDING_FLAG, BINDING_VARIABLE_TYPE, ComponentData, FunctionFrame, HTMLNode, PresetOptions } from "../../types/all.js";
import { parseSource } from "../ast-parse/source.js";
import { componentDataToJSCached } from "../ast-render/js.js";
import { addBindingVariable, addWriteFlagToBindingVariable } from "./binding.js";
import { GlobalVariables } from "./global_variables.js";
import { ModuleHash } from "./hash_name.js";

/**
 * Set the givin Lexer as the pos val for each node
 * @param node 
 * @param pos 
 */
export function setPos<T>(node: T, pos: Lexer | any): T {

    if (!pos) {

        console.warn("[pos] is null - this node will not render source maps correctly.");

    } else
        //@ts-ignore
        for (const { node: n } of traverse(node, "nodes"))
            //@ts-ignore
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
/**
 * Attempts to import a component from a URI. Returns true if the resource
 * is a wick component that could be parsed, false otherwise.
 * @param new_component_url 
 * @param component 
 * @param presets 
 * @param local_name 
 * @returns 
 */
export async function importComponentData(new_component_url, component, presets, local_name: string): Promise<boolean> {

    try {

        const new_comp_data = await parseSource(new URI(new_component_url), presets, component.location);

        if (new_comp_data.HAS_ERRORS)
            return false;

        //const { ast, string, resolved_url } = await acquireComponentASTFromRemoteSource(new URI(new_component_url), component.location);

        // If the ast is an HTML_NODE with a single style element, then integrate the 
        // css data into the current component. 

        //const comp_data = await compileComponent(ast, string, resolved_url, presets);

        componentDataToJSCached(new_comp_data, presets);

        if (local_name) component.local_component_names.set(local_name.toUpperCase(), new_comp_data.name);

        if (!new_comp_data.HTML) mergeComponentData(component, new_comp_data);

        return true;

    } catch (e) {
        console.log("TODO: Replace with a temporary warning component.", e);
    }

    return false;

}

export async function importResource(
    from_value: string,
    component: ComponentData,
    presets: PresetOptions,
    node: HTMLNode | JSNode,
    default_name: string = "",
    names: { local: string, external: string; }[] = [],
    frame: FunctionFrame
): Promise<void> {

    let flag: BINDING_FLAG = null, ref_type: BINDING_VARIABLE_TYPE = null;

    const [url, meta] = from_value.split(":");

    const uri = new URI(url);

    switch (url + "") {
        default:
            // Read file and determine if we have a component, a script or some other resource. 

            //Compile Component Data
            if (
                !(uri.ext == "wick" || uri.ext == "html")
                ||
                !(await importComponentData(
                    from_value,
                    component,
                    presets,
                    default_name
                ))
            ) {
                let external_name = "";

                if (!presets.repo.has(from_value.trim()))
                    external_name = addPendingModuleToPresets(presets, from_value);

                for (const name of names)
                    name.external = external_name;



                if (default_name)
                    addBindingVariable(frame, default_name, node.pos, BINDING_VARIABLE_TYPE.MODULE_VARIABLE, external_name, flag);

                ref_type = BINDING_VARIABLE_TYPE.MODULE_MEMBER_VARIABLE; flag = BINDING_FLAG.FROM_OUTSIDE;
                break;
            }

            return;
        case "@radiate":
            // Opts the component into the wick-radiate client side router system. The component must be 
            // at the root of the component tree for this to work.
            component.RADIATE = true;
            return;

        case "@registered":
            const comp_name = default_name.toUpperCase();
            if (default_name && presets.named_components.has(comp_name))
                component.local_component_names.set(comp_name, presets.named_components.get(comp_name).name);
            return;

        case "@parent":
            /* all ids within this node are imported binding_variables from parent */
            //Add all elements to global scope
            ref_type = BINDING_VARIABLE_TYPE.PARENT_VARIABLE; flag = BINDING_FLAG.FROM_PARENT;
            break;

        case "@api":
            ref_type = BINDING_VARIABLE_TYPE.MODULE_VARIABLE; flag = BINDING_FLAG.FROM_OUTSIDE;
            break;

        case "@global":
            ref_type = BINDING_VARIABLE_TYPE.GLOBAL_VARIABLE; flag = BINDING_FLAG.FROM_OUTSIDE;
            break;

        case "@model":
            if (meta) component.global_model_name = meta.trim();
            ref_type = BINDING_VARIABLE_TYPE.MODEL_VARIABLE; flag = BINDING_FLAG.ALLOW_UPDATE_FROM_MODEL;
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

function addPendingModuleToPresets(presets: PresetOptions, from_value: string): string {

    const url = from_value.toString().trim();

    const hash = ModuleHash(url);

    presets.repo.set(url, {
        url: url,
        hash: hash,
        module: null
    });

    return hash;
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

/* DOM Common */

let SET_ONCE_environment_globals = null;
/**
 * Return a set of global variables names
 * @returns 
 */
export function getSetOfEnvironmentGlobalNames(): Set<string> {
    //Determine what environment we have pull and out the global object. 
    if (!SET_ONCE_environment_globals)
        SET_ONCE_environment_globals = new Set(GlobalVariables);
    return SET_ONCE_environment_globals;
}

/**
 * Return the section source string corresponding to the given node
 * @param component - The component which contains the AST in which the node is a member.
 * @param node - Any AST node generated by the Wick parser.
 * @returns 
 */
export function componentNodeSource(component: ComponentData, node: any): string {
    const { pos } = node;
    return component.source.slice(pos.off, pos.off + pos.tl);
}