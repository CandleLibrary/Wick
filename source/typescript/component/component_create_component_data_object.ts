import URL from "@candlefw/url";
import { Lexer } from "@candlefw/wind";
import { createNameHash } from "./component_create_hash_name.js";
import { PendingBinding } from "../types/binding";
import { ComponentData } from "../types/component_data";
import { DOMLiteral } from "../types/dom_literal.js";


export function createErrorComponent(errors: Error[], src: string, location: string, component: ComponentData = createComponentData(src, location)) {

    const error_data = [location + "", ...errors
        .flatMap(e => (e.stack + "")
            .split("\n"))
        .map(s => s.replace(/\ /g, "\u00A0"))]
        .map(e => <DOMLiteral>{
            tag_name: "p",
            children: [
                {
                    tag_name: "",
                    data: e
                }
            ]
        });

    const pos = new Lexer(component.source);

    component.errors.push(...errors);

    component.HTML = {
        tag_name: "ERROR",
        lookup_index: 0,
        attributes: [
            ["style", "font-family:monospace"]
        ],
        children: [
            {
                tag_name: "div",
                children: error_data,
                pos
            }
        ],
        pos
    };

    component.HAS_ERRORS = true;

    return component;
}

export function createComponentData(source_string: string, location: string): ComponentData {
    const component: ComponentData = <ComponentData>{

        name: createNameHash(source_string),

        global_model: "",

        names: [],

        location: new URL(location),

        source: source_string,

        root_frame: null,

        frames: [],

        HTML: null,

        HTML_HEAD: [],

        CSS: [],

        bindings: [],

        children: [],

        HAS_ERRORS: false,

        errors: [],

        container_count: 0,

        //OLD STUFFS
        addBinding: (pending_binding: PendingBinding) => component.bindings.push(pending_binding),

        //Local names of imported components that are referenced in HTML expressions. 
        local_component_names: new Map,

    };
    return component;
}
