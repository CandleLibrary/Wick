import { copy, traverse } from "@candlelib/conflagrate";
import {
    exp, JSCallExpression,

    JSFunctionDeclaration,
    JSMethod,
    JSNode,
    JSNodeType as JST,

    stmt
} from "@candlelib/js";
import {
    BindingVariable,
    BINDING_VARIABLE_TYPE, CompiledComponentClass, ComponentData, FunctionFrame, HookTemplatePackage, HTMLNode,
    HTMLNodeTypeLU, IntermediateHook,
    PresetOptions, ProcessedHook
} from "../../types/all.js";
import { componentDataToCSS } from "../ast-render/css.js";
import {
    htmlTemplateToString
} from "../ast-render/html.js";
import {
    Binding_Var_Is_Internal_Variable,
    getCompiledBindingVariableName,
    getComponentBinding,
    Name_Is_A_Binding_Variable
} from "../common/binding.js";
import { setPos } from "../common/common.js";
import { createErrorComponent } from "../common/component.js";
import {
    appendStmtToFrame,
    createBuildFrame,
    Frame_Has_Statements,
    getStatementsFromRootFrame,
    prependStmtToFrame
} from "../common/frame.js";
import {
    BindingIdentifierBinding,
    BindingIdentifierReference
} from "../common/js_hook_types.js";
import { processHookASTs, processHookForClass, processIndirectHook } from "./hooks/hooks-beta.js";
import {
    hook_processors
} from "./hooks.js";
import { componentDataToTempAST, createComponentTemplate } from "./html.js";


export function processFunctionFrameHook(
    comp: ComponentData,
    presets: PresetOptions,
    frame: FunctionFrame,
    class_info: CompiledComponentClass,
) {
    const ast = processHookForClass(frame.ast, comp, presets, class_info, -1);
    //console.log(renderWithFormatting(ast));
}

export async function createCompiledComponentClass(
    comp: ComponentData,
    presets: PresetOptions,
    INCLUDE_HTML: boolean = true,
    INCLUDE_CSS: boolean = true
): Promise<CompiledComponentClass> {

    try {

        const info = createClassInfoObject();

        //HTML INFORMATION
        if (INCLUDE_HTML)
            await processHTML(comp, info, presets);

        //CSS INFORMATION
        if (INCLUDE_CSS)
            processCSS(comp, info, presets);

        //Javascript Information.
        if (comp.HAS_ERRORS === false && comp.root_frame) {

            const {
                nlu,
                nluf
            } = createLookupTables(info);

            for (const hook of comp.indirect_hooks)
                await processIndirectHook(comp, presets, hook, info);

            for (const frame of comp.frames)
                await processFunctionFrameHook(comp, presets, frame, info);

            processHookASTs(comp, info);

            if (info.lfu_table_entries.length > 0)
                prependStmtToFrame(info.init_frame, nlu);

            if (info.lfu_table_entries.length > 0)
                prependStmtToFrame(info.init_frame, nluf);

            processMethods(comp, info);
        }

        // Remove methods 
        return info;

    } catch (e) {
        throw e;
        console.log(`Error found in component ${comp.name} while converting to a class. location: ${comp.location}.`);
        console.log(e);
        return createCompiledComponentClass(createErrorComponent([e], comp.source, comp.location, comp), presets);
    }
}



function createLookupTables(class_info: CompiledComponentClass) {
    const
        binding_lu = stmt("c.nlu = {};"),
        binding_function_lu = stmt("c.lookup_function_table = [];"),
        { nodes: [{ nodes: [, lu_functions] }] } = binding_function_lu,
        { nodes: [{ nodes: [, lu_public_variables] }] } = binding_lu;

    class_info.nluf_public_variables = <any>lu_functions;

    class_info.lfu_table_entries = <any[]>lu_functions.nodes;

    class_info.lu_public_variables = <any[]>lu_public_variables.nodes;

    return { nlu: binding_lu, nluf: binding_function_lu };
}

export function createClassInfoObject(): CompiledComponentClass {

    const
        binding_setup_frame = createBuildFrame("c", ""),
        init_frame = createBuildFrame("init", "c"),
        async_init_frame = createBuildFrame("async_init"),
        terminate_frame = createBuildFrame("terminate"),
        class_info: CompiledComponentClass = {
            methods: <any>[],
            binding_setup_frame,
            init_frame,
            async_init_frame,
            terminate_frame,
            nluf_public_variables: null,
            lfu_table_entries: [],
            lu_public_variables: [],
            write_records: [],
            binding_records: new Map(),
            method_frames: [async_init_frame, init_frame, binding_setup_frame],
            nlu_index: 0,
        };

    async_init_frame.IS_ASYNC = true;

    return class_info;
}


async function processHTML(
    component: ComponentData,
    class_info: CompiledComponentClass,
    presets: PresetOptions
) {

    if (component.HTML) {
        const
            frame = createBuildFrame("ce"),
            return_stmt = stmt("return this.makeElement(a);"),
            { html: [html] } = (await componentDataToTempAST(component, presets));

        return_stmt.nodes[0].nodes[1].nodes[0] = exp(`\`${htmlTemplateToString(html).replace(/(\`)/g, "\\\`")}\``);

        appendStmtToFrame(frame, return_stmt);

        class_info.method_frames.push(frame);
    }
}

export async function createComponentTemplates(
    presets: PresetOptions,
    template_container: Map<string, HTMLElement> = new Map
) {

    const components = presets.components;

    if (typeof document != undefined && document.createElement)

        for (const [name, component] of components.entries()) {

            const template = await createComponentTemplate(component, presets);

            if (!template_container.has(name)) {

                const ele = document.createElement("div");

                ele.innerHTML = htmlTemplateToString(template);

                template_container.set(name, <HTMLElement>ele.firstElementChild);
            }
        }
}


export async function runHTMLHookHandlers(
    intermediate_hook: IntermediateHook,
    component: ComponentData,
    presets: PresetOptions,
    model: any = null,
    parent_component: ComponentData
): Promise<HookTemplatePackage> {
    for (const handler of hook_processors) {

        let
            val: HookTemplatePackage = null;

        if (handler.canProcessHook(
            intermediate_hook.selector,
            HTMLNodeTypeLU[intermediate_hook.host_node.type]
        ))
            val = await handler.getDefaultHTMLValue(
                intermediate_hook,
                component,
                presets,
                model,
                parent_component
            );

        if (!val) continue;

        return val;
    }

    return null;
}
/**
 * Updates binding variables
 * @param root_node 
 * @param component 
 * @param hook 
 * @returns 
 */
export function collectBindingReferences(root_node: JSNode, component: ComponentData, hook: ProcessedHook = null) {

    for (const { node, meta: { parent } } of traverse(root_node, "nodes")) {

        if (node.type == JST.IdentifierReference || node.type == JST.IdentifierBinding) {

            if (!Name_Is_A_Binding_Variable(node.value, component.root_frame))
                continue;

            if (node.IS_BINDING_REF) {
                //Pop any binding names into the binding information container. 
                setBindingVariable(node.value, parent && parent.type == JST.MemberExpression, hook);
            }
        }
    }
}

function setBindingVariable(name: string, IS_OBJECT: boolean = false, hook: ProcessedHook) {

    if (hook.component_variables.has(name)) {
        const variable = hook.component_variables.get(name);
        variable.IS_OBJECT = IS_OBJECT || variable.IS_OBJECT;
    } else {
        hook.component_variables.set(name, {
            name,
            IS_OBJECT
        });
    }
}

export function runClassHookHandlers(
    intermediate_hook: IntermediateHook,
    component: ComponentData,
    presets: PresetOptions,
    class_info: CompiledComponentClass
): {
    hook: ProcessedHook,
    intermediate_hook: IntermediateHook;
} {
    for (const handler of hook_processors) {

        let hook: ProcessedHook = null;

        if (handler.canProcessHook(
            intermediate_hook.selector,
            (intermediate_hook.host_node
                ? HTMLNodeTypeLU[intermediate_hook.host_node.type]
                : "")
        ))
            hook = handler.processHook(
                intermediate_hook.selector,
                intermediate_hook.hook_value,
                <HTMLNode>intermediate_hook.host_node,
                intermediate_hook.html_element_index,
                component,
                presets,
                class_info
            );

        if (!hook) continue;

        // Add any binding variables to the hooks component_variable set
        for (const ast of [hook.cleanup_ast, hook.initialize_ast, hook.write_ast, hook.read_ast])
            if (ast)
                collectBindingReferences(ast, component, hook);

        return { hook, intermediate_hook };
    }
    return { hook: null, intermediate_hook };
}

export function Binding_Var_Is_Directly_Accessed(binding_var: BindingVariable) {
    return (binding_var.type & (BINDING_VARIABLE_TYPE.DIRECT_ACCESS)) > 0;
}
/*
function compileBindingVariables(
    component: ComponentData,
    class_info: CompiledComponentClass,
    write_bindings: { hook: ProcessedHook; intermediate_hook: IntermediateHook; }[]
) {

    const { methods, method_frames, init_frame } = class_info;

    for (const { internal_name, class_index, flags, type } of component.root_frame.binding_variables.values()) {

        const IS_DIRECT_ACCESS = (type & BINDING_VARIABLE_TYPE.DIRECT_ACCESS) > 0;

        if (flags & BINDING_FLAG.WRITTEN) {

            const frame = createBuildFrame("u" + (class_index >= 0 ? class_index : 9999), "f,c");

            for (const { hook } of write_bindings) {

                if (hook.component_variables.has(internal_name)) {

                    ##################################

                    Need to review below to make sure
                    IS_OBJECT needs to be converted
                    to new wick processing form

                    ##################################

                    const { IS_OBJECT } = hook.component_variables.get(internal_name);

                    // TODO: Sort bindings and their input outputs to make sure dependencies are met. 
                    if (hook.component_variables.size <= 1) {

                        frame.IS_ASYNC = Expression_Contains_Await(hook.write_ast) || frame.IS_ASYNC;

                        if (IS_OBJECT) {
                            const s = stmt(`if(${getCompiledBindingVariableName(internal_name, component, class_info)});`);
                            s.nodes[1] = {
                                type: <any>JST.ExpressionStatement,
                                nodes: [hook.write_ast],
                                pos: <any>hook.pos
                            };
                            appendStmtToFrame(frame, s);
                        } else
                            appendStmtToFrame(frame, <any>{
                                type: JST.ExpressionStatement,
                                nodes: [hook.write_ast],
                                pos: <any>hook.pos
                            });
                    }
                    else
                        appendStmtToFrame(frame, setPos(stmt(`this.call(${hook.index}, c)`), hook.pos));
                }
            }
...
*/
/**
 * Converts ComponentBinding expressions and identifers into class based reference expressions.
 * 
 * @param mutated_node 
 * @param component 
 */
export function finalizeBindingExpression(
    mutated_node: JSNode,
    component: ComponentData,
    comp_info: CompiledComponentClass
): {
    ast: JSNode,
    NEED_ASYNC: boolean;
} {
    const lz = { ast: null };
    let NEED_ASYNC = false;
    for (const { node, meta: { mutate, skip } } of traverse(mutated_node, "nodes")
        .extract(lz)
        .filter("type",
            JST.AwaitExpression, JST.PostExpression, JST.PreExpression, JST.AssignmentExpression,
            BindingIdentifierBinding, BindingIdentifierReference,
            JST.IdentifierBinding, JST.IdentifierReference)
        .makeMutable()
        .makeSkippable()
    ) {

        switch (node.type) {

            case JST.IdentifierBinding: case JST.IdentifierReference:
                /**
                 * Convert convenience names to class property accessors
                 */
                if (node.value.slice(0, 5) == ("$$ele")) {
                    mutate(exp(`this.elu[${node.value.slice(5)}]`));
                    skip();
                } else if (node.value.slice(0, 5) == ("$$ctr")) {
                    mutate(exp(`this.ctr[${node.value.slice(5)}]`));
                    skip();
                } else if (node.value.slice(0, 4) == ("$$ch")) {
                    mutate(exp(`this.ch[${node.value.slice(4)}]`));
                    skip();
                }
                break;
            case JST.AwaitExpression:
                NEED_ASYNC = true;
                break;
            //case JSNodeType.ComponentBindingIdentifier
            case BindingIdentifierBinding: case BindingIdentifierReference:
                //@ts-ignore
                const
                    name = <string>node.value,
                    id = exp(getCompiledBindingVariableName(name, component, comp_info)),
                    new_node = setPos(id, node.pos);

                if (!component.root_frame.binding_variables.has(<string>name))
                    //ts-ignore
                    throw node.pos.errorMessage(`Undefined reference to ${name}`);

                mutate(new_node);

                break;

            case JST.PreExpression: case JST.PostExpression:
                //@ts-ignore
                if (Node_Is_Binding_Identifier(node.nodes[0])) {

                    const
                        [ref] = node.nodes,
                        //@ts-ignore
                        name = <string>ref.value,
                        comp_var: BindingVariable = getComponentBinding(name, component);

                    if (Binding_Var_Is_Internal_Variable(comp_var)) {
                        const
                            comp_var_name: string = getCompiledBindingVariableName(name, component, comp_info),
                            assignment: JSCallExpression = <any>exp(`this.ua(${comp_var.class_index})`),
                            exp_ = exp(`${comp_var_name}${node.symbol[0]}1`);

                        const { ast, NEED_ASYNC: NA } = finalizeBindingExpression(ref, component, comp_info);

                        NEED_ASYNC = NA || NEED_ASYNC;

                        exp_.nodes[0] = ast;

                        assignment.nodes[1].nodes.push(<any>exp_);

                        if (node.type == JST.PreExpression)
                            assignment.nodes[1].nodes.push(exp("true"));

                        mutate(setPos(assignment, node.pos));

                        skip();
                    }
                }
                break;

            case JST.AssignmentExpression:
                //@ts-ignore
                if (Node_Is_Binding_Identifier(node.nodes[0])) {
                    const
                        [ref, value] = node.nodes,
                        //@ts-ignore
                        name = <string>ref.value,
                        comp_var: BindingVariable = getComponentBinding(name, component);

                    //Directly assign new value to model variables
                    if (Binding_Var_Is_Internal_Variable(comp_var)) {

                        const assignment: JSCallExpression = <any>exp(`this.ua(${comp_var.class_index})`);
                        const { ast: a1, NEED_ASYNC: NA1 } = finalizeBindingExpression(ref, component, comp_info);
                        const { ast: a2, NEED_ASYNC: NA2 } = finalizeBindingExpression(value, component, comp_info);

                        NEED_ASYNC = NA1 || NA2 || NEED_ASYNC;

                        node.nodes = [a1, a2];

                        if (node.symbol == "=") {
                            assignment.nodes[1].nodes.push(node.nodes[1]);
                        } else {

                            //@ts-ignore
                            node.symbol = node.symbol.slice(0, 1);
                            assignment.nodes[1].nodes.push(node);
                        }

                        mutate(setPos(assignment, node.pos));

                        skip();
                    }
                }
                break;
        }
    }

    return { ast: lz.ast, NEED_ASYNC };
}

function Node_Is_Binding_Identifier(node: JSNode) {
    return node.type == BindingIdentifierBinding || node.type == BindingIdentifierReference;
}

function processCSS(
    component: ComponentData,
    class_info: CompiledComponentClass,
    presets: PresetOptions
) {
    let style;

    if (style = componentDataToCSS(component)) {

        const frame = createBuildFrame("getCSS");
        class_info.method_frames.push(frame);
        appendStmtToFrame(frame, stmt(`return \`${style}\`;`));

        appendStmtToFrame(class_info.init_frame, stmt(`this.setCSS()`));
    }
}

/**
 * Create new AST that has all undefined references converted to binding
 * lookups or static values.
 */
function makeComponentMethod(frame: FunctionFrame, component: ComponentData, ci: CompiledComponentClass) {

    if (frame.ast && !frame.IS_ROOT) {

        ////Do not create empty functions
        if (!Frame_Has_Statements(frame))
            return;

        const cpy: JSFunctionDeclaration | JSMethod = <any>copy(frame.ast);

        const { NEED_ASYNC } = finalizeBindingExpression(cpy, component, ci);

        cpy.ASYNC = NEED_ASYNC || frame.IS_ASYNC || cpy.ASYNC;

        cpy.type = JST.Method;

        if (frame.index != undefined)
            //@ts-ignore
            cpy.nodes[0].value = `f${frame.index}`;


        ci.methods.push(cpy);
    }
}

export function processMethods(component: ComponentData, class_info: CompiledComponentClass) {
    // check for any onload frames. This will be converted to the async_init frame. Any
    // statements defined in async_init will prepended to the frames statements. Create
    // a new frame if onload is not present
    const onload_frame: FunctionFrame = component.frames.filter(s => s.method_name.toLowerCase() == "onload")[0],
        { root_frame } = component;

    if (onload_frame)
        prependStmtToFrame(class_info.async_init_frame, ...onload_frame.ast.nodes[2].nodes);

    const out_frames = [...class_info.method_frames, ...component.frames.filter(
        f => (f != onload_frame) && (f != root_frame)
    )];

    if (root_frame.IS_ASYNC)
        appendStmtToFrame(class_info.async_init_frame, ...getStatementsFromRootFrame(root_frame));
    else
        appendStmtToFrame(class_info.init_frame, ...getStatementsFromRootFrame(root_frame));

    //Ensure there is an async init method
    for (const function_block of out_frames)
        makeComponentMethod(function_block, component, class_info);
}

