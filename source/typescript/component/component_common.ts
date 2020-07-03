import { Component } from "../types/types.js";
import { setComponentVariable } from "./component_set_component_variable.js";
import { acquireComponentASTFromRemoteSource, compileComponent } from "./component.js";
import { componentDataToClassCached } from "./component_data_to_class.js";


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

    for (const [, data] of source_component.binding_variables.entries())
        setComponentVariable(data.type, data.local_name, destination_component, data.external_name, data.flags);

    for (const name of source_component.names)
        destination_component.names.push(name);

    destination_component.function_blocks.push(...source_component.function_blocks);
}

export async function importComponentData(new_component_url, component, presets, local_name: string) {
    try {

        const { ast, string, resolved_url } = await acquireComponentASTFromRemoteSource(new_component_url, component.location);

        // If the ast is an HTML_NODE with a single style element, then integrate the 
        // css data into the current component. 

        const comp_data = await compileComponent(ast, string, resolved_url, presets);

        componentDataToClassCached(comp_data, presets);

        if (local_name) component.local_component_names.set(local_name.toUpperCase(), comp_data.name);

        if (!comp_data.HTML)
            mergeComponentData(component, comp_data);

    } catch (e) {
        console.log("TODO: Replace with a temporary warning component."/*, e*/);
    }

}