import Presets from "../../presets";
import { noop } from "../../render/noop.js";
import { renderCompressed } from "../../render/render.js";
import { rt } from "../../runtime/runtime_global.js";
import { ComponentData } from "../../types/component_data.js";
import { DOMLiteral } from "../../wick.js";
import { componentDataToCSS } from "../compile/component_data_to_css.js";
import { componentDataToHTML } from "../compile/component_data_to_html.js";
import { componentDataToClassString } from "../compile/component_data_to_js.js";

/**[API]
 * Builds a single page from a wick component, with the
 * designated component serving as the root element of the
 * DOM tree. Can be used to build a hydratable page.
 *
 * Optionally hydrates with data from an object serving as a virtual preset.
 *
 * Returns HTML markup and an auxillary script strings that
 * stores and registers hydration information.
 */
export function RenderPage(
    comp: ComponentData,
    presets: Presets = rt.presets,
    hooks: {
        on_element: (arg: DOMLiteral) => DOMLiteral | null | undefined;
    } = {
            on_element: noop
        }) {

    if (!comp) return {};

    const applicable_components = new Set([comp.name]);

    // Identify all components that are directly or 
    // indirectly related to this component
    const candidate_components = [comp], components_to_process: ComponentData[] = [];

    while (candidate_components.length > 0) {

        const comp = candidate_components.shift();

        if (comp) {

            components_to_process.push(comp);

            for (const comp_name of comp.local_component_names.values()) {

                if (!applicable_components.has(comp_name)) {

                    applicable_components.add(comp_name);

                    candidate_components.push(presets.components.get(comp_name));
                }

            };
        }
    }

    //Optionally transform HTML before rendering to string 

    /** WARNING!!
     * Transforming a components html structure can lead to 
     * incompatible component code. Handle this with eyes wide
     * open.
     */

    const
        { html, template_map } = componentDataToHTML(comp, hooks.on_element, presets),
        templates = [...template_map.values()].join("\n");

    let script = "", style = "", head = "";

    for (const comp of components_to_process) {

        const { class_string } = componentDataToClassString(comp, presets, false, false);

        if (comp.HTML_HEAD.length > 0) {
            for (const node of comp.HTML_HEAD) {
                head += renderCompressed(node);
            }
        }

        script += "\n" + `w.rt.rC(${class_string});`;

        style += "\n" + componentDataToCSS(comp);
    }

    const page = renderPage(presets, templates, html, head, script, style);

    return { templates, html, head, script, style, page };
}

function renderPage(
    presets: Presets,
    templates: string,
    html: string,
    head: string,
    script: string,
    style: string,
): string {
    return `<!DOCTYPE html>
<html>
    <head>
        ${head.split("\n").join("\n    ")}
        <style>
        ${style.split("\n").join("\n            ")}
        </style>
        <script type="module" src="${presets.options.url.wickrt}"></script>
        <script type="module" src="${presets.options.url.glow}"></script>
    </head>
    <body>
        ${html.split("\n").join("\n        ")}
        ${templates.split("\n").join("\n        ")}
        <script type=module>
            import w from "${presets.options.url.wickrt}";
            w.setPresets({});
            ${script.split("\n").join("\n            ")}
        </script>
    </body>
</html>`;
}