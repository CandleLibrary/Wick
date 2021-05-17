import URL from "@candlefw/url";
import { Lexer } from "@candlefw/wind";

import { createNameHash } from "./hash_name.js";
import { IntermediateHook } from "../types/hook";
import { ComponentData } from "../types/component";
import { DOMLiteral } from "../types/html";


export function createErrorComponent(errors: Error[], src: string, location: URL, component: ComponentData = createComponentData(src, location)) {

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

export function createComponentData(source_string: string, location: URL): ComponentData {

    const component: ComponentData = <ComponentData>{

        name: createNameHash(source_string),

        container_count: 0,

        global_model_name: "",
        
        source: source_string,
        //Local names of imported components that are referenced in HTML expressions. 
        local_component_names: new Map,

        location: new URL(location),

        root_frame: null,

        HTML: null,

        HAS_ERRORS: false,

        names: [],

        frames: [],

        HTML_HEAD: [],

        CSS: [],

        hooks: [],

        children: [],

        errors: [],

        root_ele_claims: []
    };
    return component;
}
