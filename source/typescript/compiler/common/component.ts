import URL from "@candlelib/uri";
import { Lexer } from "@candlelib/wind";
import { PresetOptions } from "source/typescript/types/presets";
import { WickRTComponent } from "../../runtime/component.js";
import { ComponentData } from "../../types/component";
import { DOMLiteral } from "../../types/html";
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
            children: [
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
        children: [
            {
                tag_name: "div",
                children: [{
                    tag_name: "p",
                    children: [
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
    name: ComponentData["name"];
    container_count: ComponentData["container_count"];
    global_model_name: ComponentData["global_model_name"];
    source: ComponentData["source"];
    local_component_names: ComponentData["local_component_names"];
    location: ComponentData["location"];
    root_frame: ComponentData["root_frame"];
    HTML: ComponentData["HTML"];
    HAS_ERRORS: ComponentData["HAS_ERRORS"];
    names: ComponentData["names"];
    frames: ComponentData["frames"];
    HTML_HEAD: ComponentData["HTML_HEAD"];
    CSS: ComponentData["CSS"];
    hooks: ComponentData["hooks"];
    children: ComponentData["children"];
    errors: ComponentData["errors"];
    root_ele_claims: ComponentData["root_ele_claims"];
    template: ComponentData["template"];
    indirect_hooks: ComponentData["indirect_hooks"];

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

        this.names = [];

        this.frames = [];

        this.HTML_HEAD = [];

        this.CSS = [];

        this.children = [];

        this.errors = [];

        this.root_ele_claims = [];

        this.indirect_hooks = [];

        this.template = null;

        this.presets = null;
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