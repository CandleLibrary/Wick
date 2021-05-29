import { JSNode, JSStatementClass } from "@candlelib/js";
import { Lexer } from "@candlelib/wind";
import { CompiledComponentClass } from "./class_information";
import { ComponentData } from "./component";
import { HookTemplatePackage } from "./html.js";
import { PresetOptions } from "./presets.js";
import { HTMLNode, Node, WickBindingNode } from "./wick_ast.js";

/**
 * Any variable within a component that is defined a GLOBAL value that
 * may be produced as the result of the following declaration/references:
 *  - a: Declared within the top most scope of component in a var statement.
 *  - b: Declared within a components import or export statements.
 *  - c: Declared within a components data flow statements describing flow between
 *       a component and its relatives.
 *  - d: Referenced within a binding expression.
 */


export const enum HOOK_TYPE {
    READ = 1,
    WRITE = 2,
    READONLY = 1,
    WRITE_ONLY = 2,
    READ_WRITE = 3
}

export const enum HOOK_SELECTOR {
    ELEMENT_SELECTOR_STRING = "esl",
    WATCHED_FRAME_METHOD_CALL = "wfm",
    METHOD_CALL = "mc",
    IMPORT_FROM_CHILD = "ifc",
    EXPORT_TO_CHILD = "etc",
    IMPORT_FROM_PARENT = "ifp",
    EXPORT_TO_PARENT = "etp",
    INPUT_VALUE = "imp",
    CHECKED_VALUE = "chk",
    CONTAINER_USE_IF = "cui",
    CONTAINER_USE_EMPTY = "cue"
}
/**
 * A hook is a dynamic expressions that handles
 * the update of various objects based on changes
 * to binding variables and hooked objects
 */
export interface IntermediateHook {
    html_element_index: number;
    selector: string;
    host_node: HTMLNode | JSNode;
    hook_value: WickBindingNode | any;
}


export interface ProcessedHook {
    component_variables: Map<string, { name: string; IS_OBJECT: boolean; }>;
    initialize_ast?: JSStatementClass;
    /**
     * Code that accesses the binding value
     */
    read_ast?: JSStatementClass;
    /**
     * Code that assigns a value to the binding
     */
    write_ast?: JSStatementClass;
    cleanup_ast?: JSStatementClass;

    type: HOOK_TYPE;

    pos: Lexer;

    name?: string;

    priority: number;

    IS_ASYNC?: boolean;
}

const enum ProcessedHookType {
    /**
     * Assigns this hooks AST to the initialization 
     * function of the runtime component.
     */
    INITIALIZE = 0,

    /**
     * Assigns this hooks AST to the async initialization 
     * function of the runtime component.
     */
    ASYNC_INITIALIZE = 1,

    /**
     * Assigns this hooks AST to an event driven
     * functions.  This AST may be joined with other 
     * hook ASTs of this type if they bear multiple 
     * dependencies 
     */
    VAR_UPDATE = 2,

    /**
     * Assigns this hooks AST to the de-initialize 
     * function of the runtime component
     */
    DESTROY = 4,
}

export interface ProcessedHookBeta {
    /**
     * The type of the hook. Used to determine the pipeline
     * which will render this hook.
     */
    type: ProcessedHookType;
    ast: JSNode;
}

export interface HookProcessor {
    priority: number;
    canProcessHook(hook_selector: HOOK_SELECTOR | string, node_type: string): boolean;

    processHook(
        hook_selector: HOOK_SELECTOR | string,
        hook_node: WickBindingNode,
        host_ast_node: Node,
        element_index: number,
        component: ComponentData,
        presets?: PresetOptions,
        class_info?: CompiledComponentClass
    ): ProcessedHook;

    getDefaultHTMLValue(
        hook: IntermediateHook,
        component: ComponentData,
        presets: PresetOptions,
        model: any,
        parent_component: ComponentData[],
    ): (HookTemplatePackage | Promise<HookTemplatePackage>);
}
