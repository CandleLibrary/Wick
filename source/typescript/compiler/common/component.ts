import URL from "@candlelib/uri";
import { Lexer } from "@candlelib/wind";
import { PresetOptions } from "source/typescript/types/presets";
import { WickRTComponent } from "../../runtime/component.js";
import { ComponentData } from "../../types/component";
import { DOMLiteral } from "../../types/html";
import { createCompiledComponentClass } from '../ast-build/build.js';
import { createClassStringObject } from '../ast-render/js.js';
import { addBindingVariable } from './binding.js';
import { ComponentHash } from "./hash_name.js";

export function createErrorComponent(
    errors: Error[],
    src: string,
    location: URL,
    component: ComponentData = createComponentData(src, location)
) {

    const error_data = [...errors
        .map(
            e => (e.stack + "")
            //.split("\n")
        )
        //.map(s => s.replace(/\ /g, "\u00A0"))
    ]
        .map(e => <DOMLiteral>{
            tag_name: "p",
            nodes: [
                {
                    tag_name: "",
                    data: e.replace(/>/g, "&gt;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/\n/g, "<br/>")
                        .replace(/\s/g, "&#8199;")
                }
            ]
        });

    const pos = new Lexer(component.source);

    component.errors.push(...errors);

    component.HTML = {
        tag_name: "ERROR",
        element_index: 0,
        attributes: [
            ["style", "font-family:monospace"]
        ],
        nodes: [
            {
                tag_name: "div",
                nodes: [{
                    tag_name: "p",
                    nodes: [
                        {
                            tag_name: "",
                            data: `Error in ${location}:`,
                            //@ts-ignore
                            pos: {}
                        }
                    ]
                }, ...error_data],
                pos
            }
        ],
        pos
    };

    component.HAS_ERRORS = true;

    return component;
}

export class ComponentDataClass implements ComponentData {

    RADIATE: ComponentData["RADIATE"];
    TEMPLATE: ComponentData["TEMPLATE"];
    name: ComponentData["name"];
    container_count: ComponentData["container_count"];
    global_model_name: ComponentData["global_model_name"];
    source: ComponentData["source"];
    local_component_names: ComponentData["local_component_names"];
    location: ComponentData["location"];
    root_frame: ComponentData["root_frame"];
    HAS_ERRORS: ComponentData["HAS_ERRORS"];
    names: ComponentData["names"];
    frames: ComponentData["frames"];
    HTML: ComponentData["HTML"];
    HTML_HEAD: ComponentData["HTML_HEAD"];
    INLINE_HTML: ComponentData["INLINE_HTML"];
    CSS: ComponentData["CSS"];
    hooks: ComponentData["hooks"];
    children: ComponentData["children"];
    errors: ComponentData["errors"];
    root_ele_claims: ComponentData["root_ele_claims"];
    template: ComponentData["template"];
    indirect_hooks: ComponentData["indirect_hooks"];
    templates: ComponentData["templates"];
    element_counter: ComponentData["element_counter"];
    element_index_remap: ComponentData["element_index_remap"];
    presets: PresetOptions;

    constructor(source_string: string, location: URL) {

        this.name = ComponentHash(source_string);

        this.container_count = 0;

        this.global_model_name = "";

        this.source = source_string;
        //Local names of imported components that are referenced in HTML expressions. 
        this.local_component_names = new Map;

        this.location = new URL(location);

        this.root_frame = null;

        this.HTML = null;

        this.HAS_ERRORS = false;

        this.TEMPLATE = false;

        this.RADIATE = false;

        this.names = [];

        this.frames = [];

        this.HTML_HEAD = [];

        this.CSS = [];

        this.INLINE_HTML = [];

        this.children = [];

        this.errors = [];

        this.root_ele_claims = [];

        this.indirect_hooks = [];

        this.template = null;

        this.presets = null;

        this.element_counter = -1;

        this.element_index_remap = new Map;
    }

    get class(): typeof WickRTComponent {
        return this.presets.component_class.get(this.name);
    }

    get class_with_integrated_css() {
        return this.presets.component_class.get(this.name);
    }

    get class_string() {
        return this.presets.component_class_string.get(this.name);
    }

    createInstance(model: any = null): WickRTComponent {
        return new this.class(model);
    }

    mount(model: any, ele: HTMLElement): WickRTComponent {
        const comp_inst = this.createInstance(model);
        comp_inst.appendToDOM(ele);
        return comp_inst;
    }
}

export function createComponentData(source_string: string, location: URL): ComponentData {
    return new ComponentDataClass(source_string, location);
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