//Target actual package file to prevent recursive references
import URL from "@candlelib/uri";
import { PresetOptions } from "../../types/all.js";
import { rt } from "../../runtime/global.js";
import { ComponentData } from "../../types/component";
import { createCompiledComponentClass } from "../ast-build/build.js";
import { renderCompressed } from "../source-code-render/render.js";
import { componentDataToCSS } from "./css.js";
import { componentDataToHTML, htmlTemplateToString } from "./html.js";

// Load current wick package name and version

import { createClassStringObject } from "./js.js";

await URL.server();

const base = await URL.resolveRelative("@candlelib/wick");

const { version, name }: any = await (URL.resolveRelative("../package.json", base)).fetchJSON();

type PageRenderHooks = {
    /**
     * Default:
     * ```js
     * import w from "/@cl/wick.runtime/"
     *
     * w.setPresets({})
     *
     * component_class_declarations...
     * ```
     */
    init_script_render: (component_class_declarations: string, presets: PresetOptions) => string;
};

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
export async function RenderPage(
    comp: ComponentData,
    presets: PresetOptions = rt.presets,
    hooks: PageRenderHooks = {
        init_script_render: (component_class_declarations, presets) => {
            return `
            import w from "/@cl/wick-rt/";
            w.setPresets(${renderPresets(presets)});
            w.rt.init();
            ${component_class_declarations}
            `;
        }
    }
): Promise<{
    /**
     * A string of template elements that comprise components that are rendered
     * within containers. 
     */
    templates: string,
    /**
     * The main component rendered with static data
     */
    html: string,
    /**
     * All head elements gathered from all components
     */
    head: string,
    /**
     * All component class code
     */
    script: string,
    /**
     * All component CSS style data
     */
    style: string;
    /**
     * A deploy ready page string
     */
    page: string;
}> {

    if (!comp) return null;

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
     * incompatible component code. Handle this with care
     */

    const
        { html, template_map } = await componentDataToHTML(comp, presets),

        templates = [...template_map.values()].map(htmlTemplateToString).join("\n");

    let script = "", style = "", head = "";

    for (const comp of components_to_process) {

        const class_info = await createCompiledComponentClass(comp, presets, false, false);

        const { class_string } = createClassStringObject(comp, class_info, presets);

        if (comp.HTML_HEAD.length > 0) {
            for (const node of comp.HTML_HEAD) {
                head += renderCompressed(node);
            }
        }

        script += "\n" + `w.rt.rC(${class_string});`;

        style += "\n" + componentDataToCSS(comp);
    }

    const page = renderPageString(presets, templates, html, head, script, style, hooks);

    return { templates, html, head, script, style, page };
}

function renderPageString(
    presets: PresetOptions,
    templates: string,
    html: string,
    head: string,
    script: string,
    style: string,
    hooks: PageRenderHooks
): string {
    return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="generator" content="${name}-${version}"> 
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${head.split("\n").join("\n    ")}
        <style>
        ${style.split("\n").join("\n            ")}
        </style>
    </head>
    <body>
        ${html.split("\n").join("\n        ")}
        ${templates.split("\n").join("\n        ")}
        <script type=module>
            ${hooks.init_script_render(script.split("\n").join("\n            "), presets)}
        </script>
    </body>
</html>`;
}

function renderPresets(presets: PresetOptions) {
    const out_value = {
        repo: [...presets.repo.values()].map(repo => [repo.hash, repo.url])
    };
    return JSON.stringify(out_value);
}