//Target actual package file to prevent recursive references
import { getPackageJsonObject } from "@candlelib/paraffin";
import URL from "@candlelib/uri";
import { rt } from "../../runtime/global.js";
import { PresetOptions } from "../../types/all.js";
import { ComponentData } from "../../types/component";
import { createCompiledComponentClass } from "../ast-build/build.js";
import { renderCompressed } from "../source-code-render/render.js";
import { componentDataToCSS } from "./css.js";
import { componentDataToHTML, htmlTemplateToString } from "./html.js";
import { createClassStringObject } from "./js.js";


await URL.server();

// Load current wick package name and version
const { package: { version, name } } = await getPackageJsonObject(URL.getEXEURL(import.meta));

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
    init_components_render: (component_class_declarations: string, presets: PresetOptions) => string;
};


function renderBasicWickPageInit(component_class_declarations, presets) {
    return `
    import w from "/@cl/wick-rt/";

    w.hydrate();
`;
}

function renderRadiatePageInit(component_class_declarations, presets) {
    console.log("Rendering Wick-Radiate Page");
    return `
    import init_router from "/@cl/wick-radiate/";

    init_router();
`;
}

function renderComponentInit(component_class_declarations, presets) {
    console.log("Rendering Components Page");
    return `
    const w = wick;

    await w.appendPresets(${renderPresets(presets)});

    ${component_class_declarations}
    `;
}


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
        init_script_render: comp.RADIATE
            ? renderRadiatePageInit
            : renderBasicWickPageInit,
        init_components_render: renderComponentInit
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
    /**hoo
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

        const { class_string } = createClassStringObject(comp, class_info, presets, "w.rt.C");

        if (comp.HTML_HEAD.length > 0) {
            for (const node of comp.HTML_HEAD) {
                head += renderCompressed(node);
            }
        }

        script += "\n" + `w.rt.rC(${class_string});`;

        style += "\n" + componentDataToCSS(comp);
    }

    const page = comp.RADIATE
        ? renderRadiatePageString(presets, templates, html, head, script, style, hooks)
        : renderWickPageString(presets, templates, html, head, script, style, hooks);

    return { templates, html, head, script, style, page };
}

function renderWickPageString(
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
        <style id="wick-app-style">
        ${style.split("\n").join("\n            ")}
        </style>       

    </head>
    <body>
        ${html.split("\n").join("\n        ")}
        ${templates.split("\n").join("\n        ")}
        <script type=module id="wick-init-script">
            ${hooks.init_script_render(script.split("\n").join("\n            "), presets)}
        </script>
        <script type=module id="wick-component-script">
            ${hooks.init_components_render(script.split("\n").join("\n            "), presets)}
        </script>
    </body>
</html>`;
}

function renderRadiatePageString(
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

        <style id="wick-boiler-plate">

            body {
                position:absolute; top:0;
                left:0; width:100%;
                height:100%; padding:0;
                margin:0; border:none;
            }

            li { 
                list-style:none
            }

            a {
                text-decoration:none
            }

        </style>
        <style id="wick-app-style">
        ${style.split("\n").join("\n            ")}
        </style>

        <style id="radiate">
            radiate-modals {
                position:fixed;
                top:0;
                left:0;
            }

            radiate-modal {

            }

            radiate-modals iframe{
                border: none;
                width:100vh;
                height:100vh;
            }
        </style>
    </head>
    <body>
        <script> document.body.hidden = true; </script>
        ${html.split("\n").join("\n        ")}
        ${templates.split("\n").join("\n        ")}
        <script type=module id="wick-init-script">
            ${hooks.init_script_render(script.split("\n").join("\n            "), presets)}
        </script>
        <script type=module id="wick-component-script">
            ${hooks.init_components_render(script.split("\n").join("\n            "), presets)}
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