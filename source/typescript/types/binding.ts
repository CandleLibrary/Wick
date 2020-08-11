import { Lexer } from "@candlefw/wind";
import { JSNode } from "@candlefw/js";

import { VARIABLE_REFERENCE_TYPE, DATA_FLOW_FLAG } from "./types";
import { WickNode, WickBindingNode } from "./wick_ast_node_types.js";
import Presets from "../presets.js";
import { Component } from "./types";

/**
 * Any variable within a component that is defined a GLOBAL value that
 * may be produced as the result of the following declaration/references:
 *  - a: Declared within the top most scope of component in a var statement.
 *  - b: Declared within a components import or export statements.
 *  - c: Declared within a components data flow statements describing flow between
 *       a component and its relatives.
 *  - d: Referenced within a binding expression.
 */



export interface BindingVariable {
    /* Name used for references within the component*/
    internal_name: string;

    /* Name used to access the imported object */
    external_name: string;

    /* Type of reference */
    type: VARIABLE_REFERENCE_TYPE;

    /* */
    class_index: number;
    flags: DATA_FLOW_FLAG;
    pos: Lexer;
}


export const enum BindingType {
    READ = 1,
    WRITE = 2,
    READONLY = 1,
    WRITEONLY = 2,

    READWRITE = 3
}

export interface BindingObject {
    component_variables: Map<string, { name: string; IS_OBJECT: boolean; }>;
    initialize_ast?: JSNode;
    read_ast?: JSNode;
    write_ast?: JSNode;
    cleanup_ast?: JSNode;
    DEBUG: boolean;
    //TODO - Determine form of an
    annotate: string;
    type: BindingType;

    pos?: Lexer;

    name?: string;

    priority: number;
}

export interface PendingBinding {
    html_element_index: number;
    attribute_name: string;
    host_node: WickNode | JSNode;
    binding_val: WickBindingNode | any;
}

export interface BindingHandler {
    priority: number;
    canHandleBinding(attribute_name: string, node_type: string): boolean;

    prepareBindingObject(attribute_name: string, binding_node: WickBindingNode, host_ast_node: WickNode, element_index: number, component: Component, presets?: Presets): BindingObject;
}
