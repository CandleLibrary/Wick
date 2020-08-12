import URL from "@candlefw/url";
import { createNameHash } from "./component_create_hash_name.js";
import { PendingBinding } from "../types/binding";
import { Component } from "../types/types";
import { DOMLiteral } from "../wick.js";
import { Lexer } from "@candlefw/wind";


export function createErrorComponent(errors: ExceptionInformation[], src: string, location: string, component: Component = createComponent(src, location)) {

    const error_data = [location + "", ...errors
        .flatMap(e => (e + "")
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

    component.ERRORS = true;

    return component;
}

export function createComponent(source_string: string, location: string): Component {
    const component: Component = <Component>{
        ERRORS: false,

        source: source_string,

        selector_map: new Map(),

        container_count: 0,

        children: [],

        global_model: "",

        location: new URL(location),

        bindings: [],

        frames: [],

        CSS: [],

        HTML: null,

        names: [],

        name: createNameHash(source_string),

        //OLD STUFFS
        addBinding: (pending_binding: PendingBinding) => component.bindings.push(pending_binding),

        //Local names of imported components that are referenced in HTML expressions. 
        local_component_names: new Map,

        root_frame: null
    };
    return component;
}
