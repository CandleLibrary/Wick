import { bidirectionalTraverse, copy, traverse, TraverseState } from "@candlelib/conflagrate";
import { matchAll } from "@candlelib/css";
import { exp, JSExpressionStatement, JSNode, JSNodeType, JSStringLiteral, stmt } from "@candlelib/js";
import { BindingVariable, BINDING_FLAG, BINDING_VARIABLE_TYPE, CompiledComponentClass, ComponentData, DOMLiteral, HookTemplatePackage, IndirectHook, Node, PresetOptions } from "../../types/all.js";
import { ExtendedType } from "../../types/hook";
import { getComponentBinding, Name_Is_A_Binding_Variable } from "../common/binding.js";
import { css_selector_helpers } from "../common/css.js";
import { appendStmtToFrame, createBuildFrame, Frame_Has_Statements, getStatementsFromFrame } from "../common/frame.js";
import { ErrorHash } from "../common/hash_name.js";
import { Expression_Contains_Await, getPropertyAST } from "../common/js.js";
import { BindingIdentifierBinding, BindingIdentifierReference } from "../common/js_hook_types.js";
import { Binding_Var_Is_Directly_Accessed } from "./build.js";
import { getHookHandlers } from "./hooks/hook-handler.js";

export function convertAtLookupToElementRef(string_node: JSStringLiteral, component: ComponentData) {

    const css_selector = string_node.value.slice(1); //remove "@"

    let html_nodes = null, expression = null;

    switch (css_selector.toLowerCase()) {
        case "ctxWebGPU":
            html_nodes = matchAll<DOMLiteral>("canvas", component.HTML, css_selector_helpers)[0];

            if (html_nodes)
                expression = exp(`this.elu[${html_nodes.element_index}].getContext("gpupresent")`);

            break;
        case "ctx3d":
            html_nodes = matchAll<DOMLiteral>("canvas", component.HTML, css_selector_helpers)[0];

            if (html_nodes)
                expression = exp(`this.elu[${html_nodes.element_index}].getContext("3d")`);

            break;

        case "ctx2d":
            html_nodes = matchAll<DOMLiteral>("canvas", component.HTML, css_selector_helpers)[0];

            if (html_nodes)
                expression = exp(`this.elu[${html_nodes.element_index}].getContext("2d")`);

            break;

        default:
            html_nodes = matchAll<DOMLiteral>(css_selector, component.HTML, css_selector_helpers);

            if (html_nodes.length > 0)

                expression = (html_nodes.length == 1)
                    ? exp(`this.elu[${html_nodes[0].element_index}]; `)
                    : exp(`[${html_nodes.map(e => `this.elu[${e.element_index}]`).join(",")}]`);

    }

    return expression;
}


export function addIndirectHook(comp: ComponentData, type: ExtendedType, ast: Node, ele_index: number) {
    comp.indirect_hooks.push({ type, nodes: [ast], ele_index });
}

/**
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

export async function processIndirectHook(
    comp: ComponentData,
    presets: PresetOptions,
    indirect_hook: IndirectHook,
    class_info: CompiledComponentClass
) {
    await processHookForClass(indirect_hook, comp, presets, class_info, indirect_hook.ele_index);
}

export async function processHookForHTML(
    indirect_hook: IndirectHook,
    comp: ComponentData,
    presets: PresetOptions,
    model: any,
    parent_components: ComponentData[]

): Promise<HookTemplatePackage | any> {

    var pkg: HookTemplatePackage | any = null;
    //@ts-ignore

    for (const handler of getHookHandlers()) {

        if (handler.types.includes(indirect_hook.type) && handler.verify(indirect_hook)) {

            let
                result = handler.buildHTML(copy(indirect_hook), comp, presets, model, parent_components);


            if (result instanceof Promise)
                result = await result;

            if (result === undefined)
                continue;

            pkg = result;

            break;
        }
    }


    return pkg;
}

export async function processHookForClass(
    ast: Node | IndirectHook,

    component: ComponentData,

    presets: PresetOptions,

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
    for (const { node, meta } of bidirectionalTraverse(copy(ast), "nodes")
        .makeMutable()
        .makeSkippable()
        .extract(extract)
    ) {

        if (meta.traverse_state == TraverseState.LEAF || meta.traverse_state == TraverseState.EXIT)

            for (const handler of getHookHandlers()) {

                if (handler.types.includes(node.type) && handler.verify(node)) {

                    let
                        result = await handler.buildJS(node, component, presets, element_index, addOnBindingUpdateAst, addInitAST, addDestroyAST);

                    if (result instanceof Promise)
                        result = await result;

                    if (result === undefined)
                        continue;

                    if (result != node)
                        meta.mutate(<any>result);

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

        if (record.NO_LOCAL_BINDINGS /*&& Runtime_Required */) {

            //Push record to init
            if (record.HAS_ASYNC)
                appendStmtToFrame(comp_info.async_init_frame, record.ast);
            else
                appendStmtToFrame(comp_info.init_frame, record.ast);
        } else {
            const hash = ErrorHash("" + record.HAS_ASYNC + record.NO_LOCAL_BINDINGS + record.component_variables.join());

            if (!hash_groups.has(hash))
                hash_groups.set(hash, []);

            hash_groups.get(hash).push(record);
        }
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

            const ids = representative.component_variables.map(v => comp_info.binding_records.get(v).index).sort();

            appendStmtToFrame(frame, stmt(`if(!this.check(${ids}))return 0;`));

            for (const member of group)
                appendStmtToFrame(frame, member.ast);

            comp_info.method_frames.push(frame);

            for (const { nodes } of representative.component_variables.map(n => comp_info.binding_records.get(n)))
                nodes.push(stmt(`this.call(${binding_join_index}, c)`));

            //Add function name to lookup function table

            comp_info.lfu_table_entries[binding_join_index] = (exp("this." + name));

            binding_join_index++;
        }
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

        //create an update function for the binding variable 
        const frame = createBuildFrame("u" + index, "f,c");

        appendStmtToFrame(frame, ...nodes);

        if (flags & BINDING_FLAG.ALLOW_EXPORT_TO_PARENT)
            appendStmtToFrame(frame, stmt(`/*if(!(f&${BINDING_FLAG.FROM_PARENT}))*/c.pup(${class_index}, v, f);`));


        if (Frame_Has_Statements(frame)) {

            //Const variables,

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

    const nluf_array_entry = exp(`c.u${index}`);

    class_info.lu_public_variables.push(<any>getPropertyAST(external_name, ((flags << 24) | index) + ""));

    class_info.lfu_table_entries[index] = (nluf_array_entry);
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

