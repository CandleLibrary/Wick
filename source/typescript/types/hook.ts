import { CSSNode, CSSNodeType } from "@candlelib/css";
import { JSNode, JSNodeType, JSStatementClass } from "@candlelib/js";
import { Lexer } from "@candlelib/wind";
import { ComponentData, HookTemplatePackage, HTMLNode, HTMLNodeType, PresetOptions } from "./all.js";
import { CompiledComponentClass } from "./class_information";
import { Node, WickBindingNode } from "./wick_ast.js";

export type ExtendedType = CSSNodeType | JSNodeType | HTMLNodeType | number;

interface filterFunction {
    (node: JSNode | CSSNode | HTMLNode | IndirectHook): boolean;
}

type DefaultJSHandlerNodeType = (JSNode | CSSNode | HTMLNode | IndirectHook | undefined | null);

interface buildJSFunction<T, U> {
    description?: string;

    (
        /**
         * The root AST node containing the expression 
         * of the binding hook
         */
        node: T,
        /**
         * Component Data Object
         */
        comp: ComponentData,
        presets: PresetOptions,
        /**
         * The index number of the ele the hook belongs
         * to, or -1 if the hook has no association with
         * an existing element.
         */
        ele_index: number,

        /**
         * Add code that should execute when one or more
         * binding variable values are modified
         * @param ast
         */
        addOnUpdateAST: (ast: T) => void,
        /**
         * Add code that should execute when the component
         * is initialized, such as event listeners and
         * context lookups.
         * @param ast
         */
        addOnInitAST: (ast: T) => void,
        /**
         * Add code that should execute when the component 
         * instance is destroyed, as in the case when 
         * the component is evacuated from a container
         * @param ast
         */
        addOnDestroy: (ast: T) => void
    ): (U | T) | Promise<(U | T)>;
}

interface buildHTMLFunction {
    (
        hook: IndirectHook,
        comp: ComponentData,
        presets: PresetOptions,
        model: any,
        /**
         * A FIFO stack of the current component's parent 
         * and ancestor components
         */
        parent_components: ComponentData[]
    ): (HookTemplatePackage | Promise<HookTemplatePackage>);
}

export interface HookHandlerPackage<T = DefaultJSHandlerNodeType, U = DefaultJSHandlerNodeType> {
    description?: string,
    types: ExtendedType[];
    name: string;
    verify: filterFunction;
    /**
     * Build expression to meet the requirements
     * of the hook value and optionally assign
     * expressions to the Init, Deinit, and Update
     * code paths.
     */
    buildJS: buildJSFunction<T, U>;
    /**
     * Attempt to resolve the value of the hook
     * expression and assign the evaluated value
     * of the expression to the appropriate HTML
     * binding point ( text.data, ele.attribute );
     *
     * Return an HookTemplatePackage or Promise
     * that resolves to a HookTemplatePackage, or
     * null or Promise that resolves to null.
     */
    buildHTML: buildHTMLFunction;
}


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


export interface IndirectHook<T = Node> {

    type: ExtendedType,

    nodes: T[];

    ele_index: number;

    /**
     * Allow the const static resolution of this 
     * hook to replace any dynamic code that may
     * be generated. This requires the static
     * resolution can occur without 
     * referencing any binding variables that 
     * have values that could change within a
     * runtime environnement.
     */
    ALLOW_STATIC_REPLACE: boolean;
}