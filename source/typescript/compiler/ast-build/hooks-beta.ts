import { bidirectionalTraverse, copy, traverse, TraverseState } from "@candlelib/conflagrate";
import { exp, JSExpressionStatement, JSNode, JSNodeType, stmt } from "@candlelib/js";
import { BindingVariable, BINDING_FLAG, BINDING_VARIABLE_TYPE, CompiledComponentClass, ComponentData, HookTemplatePackage, IndirectHook, Node, PresetOptions } from "../../types/all.js";
import { getComponentBinding, Name_Is_A_Binding_Variable } from "../common/binding.js";
import { BindingIdentifierBinding, BindingIdentifierReference } from "../common/js_hook_types.js";
import { appendStmtToFrame, createBuildFrame, Frame_Has_Statements, getStatementsFromFrame } from "../common/frame.js";
import { ErrorHash } from "../common/hash_name.js";
import { Expression_Contains_Await, getPropertyAST } from "../common/js.js";
import { Binding_Var_Is_Directly_Accessed } from "./build.js";
import { ExtendedType } from "../../types/hook";
import { convertAtLookupToElementRef } from "./hooks.js";
export type ExtendedType = CSSNodeType | JSNodeType | HTMLNodeType | number;

interface filterFunction {
    (node: JSNode | CSSNode | HTMLNode | HookNode): boolean;
}


interface buildJSFunction {
    (
        node: JSNode | CSSNode | HTMLNode | HookNode,
        comp: ComponentData,
        /**
         * The index number of the ele the hook belongs
         * to, or -1 if the hook has no association with
         * an existing element.
         */
        ele_index: number,
        /**
         * Code that should execute when one or more 
         * binding variable values are modified
         * @param ast 
         */
        addOnUpdateAST: (ast: JSNode) => void,
        /**
         * Code that should execute when one or more 
         * binding variable values are modified
         * @param ast 
         */
        addOnInitAST: (ast: JSNode) => void,
        /**
         * Code that should execute when one or more 
         * binding variable values are modified
         * @param ast 
         */
        addOnDestroy: (ast: JSNode) => void,
    ): (JSNode | CSSNode | HTMLNode | HookNode | undefined | null);
}

interface buildHTMLFunction {
    (node: JSNode | CSSNode | HTMLNode | HookNode, comp: ComponentData, model: any): (HookTemplatePackage | Promise<HookTemplatePackage>);
}

interface HookHandlerPackage {
    types: ExtendedType[],
    name: string;
    verify: filterFunction;
    /**
     * Build expression to meet the requirements 
     * of the hook value and optionally assign
     * expressions to the Init, Deinit, and Update
     * code paths.
     */
    buildJS: buildJSFunction;
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

const extended_types = new Map();
/**
 * Registers an extended type name and/or retrieve its type value, 
 * which is an integer in the range 1<<32 - (21^2-1)<<32. 
 * 
 * This value can be used to replace a node's type value with the
 * custom type value while parsing, and used as reference when building
 * hooks resolvers. 
 * 
 * @param type_name 
 * @returns 
 */
export function getExtendTypeVal<T>(type_name: string, original_type: T): ExtendedType & T {
    const universal_name = type_name.toLocaleLowerCase();


    if (extended_types.has(universal_name))
        return extended_types.get(universal_name);
    else {
        const VA = (((extended_types.size + 1) * (0xFFFFFFFF + 1)));
        const VB = (+original_type);
        const VC = VA + VB;
        extended_types.set(universal_name, VC);

        return <T & ExtendedType>getExtendTypeVal(type_name, original_type);
    }
}

export function Is_Extend_Type(type: ExtendedType): type is ExtendedType {
    return (0xFFFFFFFF & type) != type;
}

export function getOriginalTypeOfExtendedType<T>(type: T & ExtendedType): T {
    return <any>(0xFFFFFFFF & +type);
}

const registered_hook_handlers = new Map();

export function registerHookHandler(hook_handler_obj: HookHandlerPackage) {
    //Verify Basic functions
    if (!hook_handler_obj)
        throw new Error("Missing Argument For hook_handler_obj");

    if (!Array.isArray(hook_handler_obj.types) || !hook_handler_obj.types.every(t => typeof t == "number"))
        throw new Error("hook_handler_obj.types should be an array of ExtendedType numbers");

    if (typeof hook_handler_obj.name != "string")
        throw new Error("Missing name string for hook_handler_obj");

    if (typeof hook_handler_obj.verify != "function")
        throw new Error("Missing verify function");

    if (typeof hook_handler_obj.buildJS != "function")
        throw new Error("Missing buildJS function");

    if (typeof hook_handler_obj.buildHTML != "function")
        throw new Error("Missing buildHTML function");

    registered_hook_handlers.set(hook_handler_obj.name, hook_handler_obj);
}


/* 
*   Returns an array of active hookHandlerPackages 
*/
export function getHookHandlers(): HookHandlerPackage[] {
    return [...registered_hook_handlers.values()];
};


export async function processHooksInHTML_AST(ast: Node) {

};


export function addIndirectHook(comp: ComponentData, type: ExtendedType, ast: Node, ele_index: number) {

    comp.indirect_hooks.push({
        ast: {
            type,
            nodes: [ast]
        },
        ele_index
    });
}

export const TextNodeHookType = getExtendTypeVal("text-node-hook", HTMLNodeType.HTMLText);
registerHookHandler({
    name: "Text Node Binding",
    types: [TextNodeHookType],
    verify: () => true,
    buildJS: (node, comp, element_index, addOnBindingUpdate) => {

        const st = <JSExpressionStatement>stmt(`$$ele${element_index}.data = 0`);

        st.nodes[0].nodes[1] = <JSNode>node.nodes[0];

        addOnBindingUpdate(st);

        return null;
    },
    buildHTML: (node, comp, model) => null
});
/**
 * 
 * 
 * Updates binding variables
 * @param root_node 
 * @param component 
 * @param hook 
 * @returns 
 */
export function collectBindingReferences(ast: JSNode, component: ComponentData): string[] {

    const bindings: Set<string> = new Set;

    for (const { node, meta: { parent } } of traverse(ast, "nodes")) {

        if (node.type == BindingIdentifierBinding || node.type == BindingIdentifierReference) {

            if (!Name_Is_A_Binding_Variable(node.value, component.root_frame))
                continue;

            bindings.add(<string>node.value);
        }
    }

    return [...bindings.values()].sort();
}

export function processIndirectHook(
    comp: ComponentData,
    indirect_hook: IndirectHook,
    class_info: CompiledComponentClass,
) {
    const ast = processHooksInJS_AST(indirect_hook.ast, comp, class_info, indirect_hook.ele_index);

    //console.log(renderWithFormatting(ast.nodes[0]));
}

export function processHooksInJS_AST(
    ast: Node | HookNode,

    component: ComponentData,
    class_info: CompiledComponentClass,
    /**
     * The index of the component element which the hook ast affects. 
     */
    element_index: number = -1
) {

    const extract = { ast: null };


    /**
     * Code that should execute when one or more 
     * binding variable values are modified
     * @param ast 
     */
    function addOnBindingUpdateAst(ast: JSNode) {
        //Extract binding information from the ast. 
        const
            component_variables = collectBindingReferences(ast, component),

            NO_LOCAL_BINDINGS = component_variables.map(v => component.root_frame.binding_variables.get(v))
                .every(Binding_Var_Is_Directly_Accessed),

            HAS_ASYNC = Expression_Contains_Await(ast),

            // Create BendingDepend AST Node, set the index and add to list of binding depends
            // Update pending binding records 

            index = class_info.write_records.length;

        class_info.write_records.push({ ast, component_variables, HAS_ASYNC, NO_LOCAL_BINDINGS });

        for (const name of component_variables)
            if (!class_info.binding_records.has(name))
                class_info.binding_records.set(
                    name,
                    { index: class_info.binding_records.size, nodes: [] }
                );
    }

    /**
     * Code that should execute when one or more 
     * binding variable values are modified
     * @param ast 
     */
    function addInitAST(ast: JSNode) {

    }

    /**
     * Code that should execute when one or more 
     * binding variable values are modified
     * @param ast 
     */
    function addDestroyAST(ast: JSNode) {

    }


    //@ts-ignore
    for (const { node, meta } of bidirectionalTraverse(ast, "nodes")
        .makeReplaceable()
        .makeSkippable()
        .extract(extract)
    ) {

        if (meta.traverse_state == TraverseState.LEAF || meta.traverse_state == TraverseState.EXIT)

            for (const handler of getHookHandlers()) {

                if (handler.types.includes(node.type) && handler.verify(node)) {

                    const
                        result = handler.buildJS(node, component, element_index, addOnBindingUpdateAst, addInitAST, addDestroyAST);

                    if (result === undefined)
                        continue;
                    else if (result != node)
                        meta.replace(<any>result);
                    break;
                }
            }
    }

    return extract.ast;
};

export function processHookASTs(comp: ComponentData, comp_info: CompiledComponentClass) {

    const hash_groups: Map<string, CompiledComponentClass["write_records"][0][]> = new Map();

    let binding_join_index = comp_info.binding_records.size;

    for (const record of comp_info.write_records) {

        const hash = ErrorHash("" + record.HAS_ASYNC + record.NO_LOCAL_BINDINGS + record.component_variables.join());

        if (!hash_groups.has(hash))
            hash_groups.set(hash, []);

        hash_groups.get(hash).push(record);
    }

    for (const group of hash_groups.values()) {

        const representative = group[0];

        if (representative.component_variables.length <= 1) {
            //Add statements directly to binding variable

            for (const { nodes } of representative.component_variables.map(n => comp_info.binding_records.get(n)))
                for (const member of group)
                    nodes.push(member.ast);

        } else {
            // Create a group function that will auto update when every 
            // dependent binding variable has value
            const name = "b" + binding_join_index;
            const frame = createBuildFrame(name, "c");

            frame.IS_ASYNC = !!representative.HAS_ASYNC;

            const ids = representative.component_variables.map(v => 0).sort();

            appendStmtToFrame(frame, stmt(`if(!this.check(${ids}))return 0;`));

            for (const member of group)
                appendStmtToFrame(frame, member.ast);

            comp_info.method_frames.push(frame);

            for (const { nodes } of representative.component_variables.map(n => comp_info.binding_records.get(n)))
                nodes.push(stmt(`this.call(${binding_join_index}, c)`));

            binding_join_index++;
        }


        //console.log(0, 2, group, comp_info.binding_records);
    }


    processBindingRecords(comp_info, comp);
}

function processBindingRecords(comp_info: CompiledComponentClass, comp: ComponentData) {

    const { methods, method_frames, init_frame } = comp_info;

    for (const [name, { nodes, index }] of comp_info.binding_records.entries()) {

        const binding = getComponentBinding(name, comp),
            { internal_name, class_index, flags, type } = binding;

        processBindingVariables(binding, comp_info, comp, index);

        addBindingInitialization(binding, comp_info, comp, index);

        //create a function for the binding variable 
        const frame = createBuildFrame("u" + index, "f,c");

        appendStmtToFrame(frame, ...nodes);

        if (flags & BINDING_FLAG.ALLOW_EXPORT_TO_PARENT)
            appendStmtToFrame(frame, stmt(`/*if(!(f&${BINDING_FLAG.FROM_PARENT}))*/c.pup(${class_index}, v, f);`));


        if (Frame_Has_Statements(frame)) {

            const IS_DIRECT_ACCESS = (type & BINDING_VARIABLE_TYPE.DIRECT_ACCESS) > 0;

            if (IS_DIRECT_ACCESS)
                // Direct access variables ( API & GLOBALS ) are assigned 
                // at at component initialization start. This allows these 
                // variables to accessed within the component initialization
                // function  
                appendStmtToFrame(init_frame, ...getStatementsFromFrame(frame));
            else
                method_frames.push(frame);

        }
    }
}


function processBindingVariables(
    { type, flags, external_name }: BindingVariable,
    class_info: CompiledComponentClass,
    component: ComponentData,
    index: number
): void {

    if (type & BINDING_VARIABLE_TYPE.DIRECT_ACCESS)
        return;

    const nluf_array = exp(`c.u${index}`);

    class_info.lu_public_variables.push(<any>getPropertyAST(external_name, ((flags << 24) | index) + ""));

    class_info.lfu_table_entries.push(nluf_array);
}

function addBindingInitialization(
    { default_val }: BindingVariable,
    class_info: CompiledComponentClass,
    component: ComponentData,
    index: number
) {
    if (default_val) {

        const expr = <JSExpressionStatement>stmt(`this.ua(${index})`);

        if (default_val.type == JSNodeType.StringLiteral && default_val.value[0] == "@") {
            const val = convertAtLookupToElementRef(default_val, component);
            expr.nodes[0].nodes[1].nodes.push(<any>(val || default_val));
        } else
            expr.nodes[0].nodes[1].nodes.push(<any>default_val);

        appendStmtToFrame(class_info.init_frame, expr);
    }
}

