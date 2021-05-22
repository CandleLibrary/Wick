import { createSourceMap, createSourceMapJSON } from "@candlefw/conflagrate";
import { stmt } from "@candlefw/js";
import Presets from "../../common/presets.js";
import { renderWithFormatting, renderWithFormattingAndSourceMap } from "../../render/render.js";
import { WickRTComponent } from "../../runtime/component.js";
import { CompiledComponentClass } from "../../types/class_information.js";
import { ComponentClassStrings, ComponentData } from "../../types/component";
import { createCompiledComponentClass } from "../compile/compile.js";


const

    StrToBase64 = (typeof btoa != "undefined")
        ? btoa
        : str => Buffer.from(str, 'binary').toString('base64'),

    componentStringToJS =
        ({ class_string: cls, source_map }: ComponentClassStrings, component: ComponentData, presets: Presets) => (
            (
                eval(
                    "c=>" + cls + (presets.options.GENERATE_SOURCE_MAPS ? `\n${source_map}` : "")
                )
            )(component)
        );
export async function componentDataToJSCached(
    component: ComponentData,
    presets: Presets,
    INCLUDE_HTML: boolean = true,
    INCLUDE_CSS: boolean = true
): typeof WickRTComponent {

    const name = component.name;

    let comp: typeof WickRTComponent = presets.component_class.get(name);

    if (!comp) {

        const comp_class = await createCompiledComponentClass(component, presets, INCLUDE_HTML, INCLUDE_CSS);

        const class_strings = createClassStringObject(component, comp_class, presets);

        comp = componentStringToJS(class_strings, component, presets);

        presets.component_class.set(name, comp);

        for (const comp of component.local_component_names.values()) {
            if (!presets.component_class_string.has(comp) && presets.components.has(comp))
                await componentDataToJSCached(presets.components.get(comp), presets, INCLUDE_HTML, INCLUDE_CSS);
        }
    }

    return comp;
}

export async function componentDataToJS(
    component: ComponentData,
    presets: Presets,
    INCLUDE_HTML: boolean = true,
    INCLUDE_CSS: boolean = true
): typeof WickRTComponent {

    const comp_class = await createCompiledComponentClass(component, presets, INCLUDE_HTML, INCLUDE_CSS);

    const class_strings = createClassStringObject(component, comp_class, presets);

    return componentStringToJS(class_strings, component, presets);
}

export async function componentDataToJSStringCached(
    component: ComponentData,
    presets: Presets,
    INCLUDE_HTML: boolean = true,
    INCLUDE_CSS: boolean = true
): ComponentClassStrings {

    const name = component.name;

    let class_strings: ComponentClassStrings = presets.component_class_string.get(name);

    if (!class_strings) {

        const comp_class = await createCompiledComponentClass(component, presets, INCLUDE_HTML, INCLUDE_CSS);

        class_strings = createClassStringObject(component, comp_class, presets);

        presets.component_class_string.set(name, class_strings);
    }

    return class_strings;
}

export function createClassStringObject(
    component: ComponentData,
    class_info: CompiledComponentClass,
    presets: Presets
): ComponentClassStrings {

    let cl = "", sm = "";

    let component_class = null;

    const name = component.name || "temp";

    if (component.global_model_name)
        component_class = stmt(`class ${name} extends 
        cfw.wick.rt.C {constructor(m,e,p,w){super(m,e,p,w,"${component.global_model_name}");}}`);
    else
        component_class = stmt(`class ${name} extends cfw.wick.rt.C {}`);

    //@ts-ignore
    component_class.nodes.push(...class_info.methods.filter(m => m.nodes[2].nodes.length > 0));

    if (presets.options.GENERATE_SOURCE_MAPS) {

        const
            map = [],
            names = new Map();

        cl = renderWithFormattingAndSourceMap(component_class, undefined, undefined, map, 0, names);

        const source_map = createSourceMap(map, component.location.file, component.location.dir, [component.location.file], [], [component.source]);

        sm = "//# sourceMappingURL=data:application/json;base64," + StrToBase64(createSourceMapJSON(source_map));
    }
    else
        cl = renderWithFormatting(component_class);

    return {
        class_string: cl + (presets.options.INCLUDE_SOURCE_URI ? +`\n/* ${component.location} */\n` : ""),
        source_map: sm
    };
}


