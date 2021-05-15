import { Lexer } from "@candlefw/wind";
import { JSNode } from "@candlefw/js";

import { HTMLNode, WickBindingNode, Node } from "./wick_ast.js";
import Presets from "../common/presets.js";
import { ComponentData } from "./component";
import { ClassInformation } from "./class_information";

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
    pos: any | Lexer;
}


export const enum BindingType {
    READ = 1,
    WRITE = 2,
    READONLY = 1,
    WRITE_ONLY = 2,
    READ_WRITE = 3
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

    pos: Lexer;

    name?: string;

    priority: number;
}


export const enum BINDING_SELECTOR {
    ELEMENT_SELECTOR_STRING = "esl",
    WATCHED_FRAME_METHOD_CALL = "wfm",
    METHOD_CALL = "mc",
    IMPORT_FROM_CHILD = "ifc",
    EXPORT_TO_CHILD = "etc",
    IMPORT_FROM_PARENT = "ifp",
    EXPORT_TO_PARENT = "etp",
    INPUT_VALUE = "imp",
    CONTAINER_USE_IF = "cui",
    BINDING_INITIALIZATION = "bin",
    CONTAINER_USE_EMPTY = "cue"
}


export interface PendingBinding {
    html_element_index: number;
    binding_selector: string;
    host_node: HTMLNode | JSNode;
    binding_val: WickBindingNode | any;
}

export interface BindingHandler {
    priority: number;
    canHandleBinding(binding_selector: BINDING_SELECTOR | string, node_type: string): boolean;

    prepareBindingObject(
        binding_selector: BINDING_SELECTOR | string,
        binding_node: WickBindingNode,
        host_ast_node: Node,
        element_index: number,
        component: ComponentData,
        presets?: Presets,
        class_info?: ClassInformation
    ): BindingObject;
}

export const enum VARIABLE_REFERENCE_TYPE {
    INTERNAL_VARIABLE = 1,
    MODEL_VARIABLE = 16,
    API_VARIABLE = 4,
    PARENT_VARIABLE = 8,
    METHOD_VARIABLE = 2,
    GLOBAL_VARIABLE = 32,
    /**
     * Variables that are replaced with direct
     * property access on the associated object
     */
    DIRECT_ACCESS = 4 | 32
}

export const enum DATA_FLOW_FLAG {
    FROM_PARENT = 1,

    FROM_PRESETS = 2,

    FROM_OUTSIDE = 4,

    EXPORT_TO_CHILD = 8,

    EXPORT_TO_PARENT = 16,

    ALLOW_FROM_CHILD = 32,

    FROM_CHILD = 64,

    FROM_MODEL = 128,

    WRITTEN = 256
}
