import { copy, traverse } from "@candlefw/conflagrate";
import { exp, JSCallExpression, JSExpressionStatement, JSFunctionDeclaration, JSMethod, JSNode, JSNodeType, renderCompressed, stmt } from "@candlefw/js";
import { Binding_Var_Is_Internal_Variable, getCompiledBindingVariableName, getComponentBinding, Name_Is_A_Binding_Variable } from "../../common/binding.js";
import { setPos } from "../../common/common.js";
import { createErrorComponent } from "../../common/component.js";
import { appendStmtToFrame, createCompileFrame, Frame_Has_Statements, getStatementsFromFrame, getStatementsFromRootFrame, prependStmtToFrame } from "../../common/frame.js";
import { DOMLiteralToJSNode } from "../../common/html.js";
import { Expression_Contains_Await, getPropertyAST } from "../../common/js.js";
import Presets from "../../common/presets.js";
import { rt } from "../../runtime/global.js";
import { BINDING_FLAG, BINDING_VARIABLE_TYPE } from "../../types/binding";
import { CompiledComponentClass } from "../../types/class_information";
import { ComponentData } from "../../types/component";
import { FunctionFrame } from "../../types/function_frame";
import { HOOK_TYPE, IntermediateHook, ProcessedHook } from "../../types/hook";
import { TemplateHTMLNode } from "../../types/html.js";
import { HTMLNode, HTMLNodeTypeLU } from "../../types/wick_ast.js";
import { BindingVariable, Component } from "../../wick.js";
import { componentDataToCSS } from "../render/css.js";
import { htmlTemplateToString } from "../render/html.js";
import { convertAtLookupToElementRef, hook_processors } from "./hooks.js";
import { componentDataToTempAST } from "./html.js";


function createBindingName(binding_index_pos: number) {
    return `b${binding_index_pos.toString(36)}`;
}

export async function runHTMLHookHandlers(
    intermediate_hook: IntermediateHook,
    component: ComponentData,
    presets: Presets,
    model: any = null,
    parent_component: ComponentData
): Promise<TemplateHTMLNode> {
    for (const handler of hook_processors) {

        let html_element = null;

        if (handler.canProcessHook(
            intermediate_hook.selector,
            HTMLNodeTypeLU[intermediate_hook.host_node.type]
        ))
            html_element = await handler.getDefaultHTMLValue(
                intermediate_hook,
                component,
                presets,
                model,
                parent_component
            );

        if (!html_element) continue;

        return html_element;
    }

    return null;
}
/**
 * 
 * 
 * Updates binding variables
 * @param root_node 
 * @param component 
 * @param hook 
 * @returns 
 */
export function collectBindingReferences(root_node: JSNode, component: ComponentData, hook: ProcessedHook = null) {

    for (const { node, meta: { parent } } of traverse(root_node, "nodes")) {

        if (node.type == JSNodeType.IdentifierReference || node.type == JSNodeType.IdentifierBinding) {

            if (!Name_Is_A_Binding_Variable(node.value, component.root_frame))
                continue;

            if (node.IS_BINDING_REF) {
                //Pop any binding names into the binding information container. 
                setBindingVariable(node.value, parent && parent.type == JSNodeType.MemberExpression, hook);
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
    presets: Presets,
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

export function processHooks(component: ComponentData, class_info: CompiledComponentClass, presets: Presets) {

    const

        registered_elements: Set<number> = new Set,

        processed_hooks = component.hooks
            .map(b => runClassHookHandlers(b, component, presets, class_info))
            .sort((a, b) => a.hook.priority > b.hook.priority ? -1 : 1),
        /**
         * All component variables that have been assigned a value
         */
        initialized_internal_variables: Set<number> = new Set;

    compileHookFunctions(
        component,
        class_info,
        presets,
        processed_hooks,
        registered_elements,
        initialized_internal_variables
    );

    const write_bindings = processed_hooks.filter(b => (b.hook.type & HOOK_TYPE.WRITE) && !!b.hook.write_ast);

    compileBindingVariables(component, class_info, write_bindings);
}


function compileHookFunctions(
    component: ComponentData,
    class_info: CompiledComponentClass,
    presets: Presets,
    processed_hooks: { hook: ProcessedHook; intermediate_hook: IntermediateHook; }[],
    registered_elements: Set<number>,
    initialized_internal_variables: Set<number>,
) {
    let hook_count = 0;

    const
        {
            root_frame: { binding_variables: binding_type }
        } = component,

        {
            method_frames,
            terminate_frame,
            init_frame,
            async_init_frame,
            nluf_public_variables
        } = class_info;

    for (const { hook, intermediate_hook } of processed_hooks) {

        hook.name = createBindingName(hook_count++);

        const { html_element_index: index } = intermediate_hook,
            {
                read_ast, write_ast,
                initialize_ast,
                cleanup_ast,
                type,
                component_variables
            } = hook;

        /**
         * register this binding's element if it has not already been done.
         */
        if (index > -1 && !registered_elements.has(index)) {
            prependStmtToFrame(init_frame, stmt(`this.e${index}=this.elu[${index}]`));
            registered_elements.add(index);
        }

        if (type & HOOK_TYPE.WRITE && write_ast) {
            const
                HAS_ASYNC = Expression_Contains_Await(write_ast),
                NO_INDIRECT_VARIABLES = [...component_variables.values()]
                    .map(v => component.root_frame.binding_variables.get(v.name))
                    .every(Binding_Var_Is_Directly_Accessed);


            if (NO_INDIRECT_VARIABLES) {
                //This code can be included in component initialization
                if (HAS_ASYNC)
                    //Use onload method; Create method if necessary
                    appendStmtToFrame(async_init_frame, write_ast);
                else
                    //Use component init method
                    appendStmtToFrame(init_frame, write_ast);

            } else if (component_variables.size > 1) {

                const frame = createCompileFrame(hook.name, "c=0");

                //Create binding update method.
                hook.name = nluf_public_variables.nodes.length + "";
                //@ts-ignore
                nluf_public_variables.nodes.push(<any>exp(`c.b${hook.name}`));

                const unresolved_binding_references = [];

                for (const { name } of component_variables.values()) {

                    if (!component.root_frame.binding_variables.has(name))
                        throw (hook.pos.errorMessage(`missing binding variable for ${name}`));

                    const binding_var = component.root_frame.binding_variables.get(name);

                    if (Binding_Var_Is_Directly_Accessed(binding_var))
                        continue;

                    unresolved_binding_references.push(binding_var.class_index);
                }

                // Create a check call that will cause an early return to occur if any of the indirect 
                // bindings are undefined

                if (unresolved_binding_references.length > 0)
                    //@ts-ignore
                    appendStmtToFrame(frame, stmt(`if(!this.check(${unresolved_binding_references.sort()}))return 0;`));

                frame.IS_ASYNC = HAS_ASYNC || frame.IS_ASYNC;

                appendStmtToFrame(frame, write_ast);

                method_frames.push(frame);

            }
        }

        if (type & HOOK_TYPE.READ && read_ast)
            appendStmtToFrame(init_frame, read_ast);

        if (initialize_ast) {

            appendStmtToFrame(init_frame, {
                type: JSNodeType.ExpressionStatement,
                nodes: [<any>initialize_ast],
                pos: initialize_ast.pos
            });

            for (const [, { name }] of component_variables) {
                const type = binding_type.get(name);
                if (type && type.type == BINDING_VARIABLE_TYPE.INTERNAL_VARIABLE) {
                    initialized_internal_variables.add(type.class_index | 0);
                }
            }
        }

        if (cleanup_ast)
            prependStmtToFrame(terminate_frame, cleanup_ast);
    }
}

function Binding_Var_Is_Directly_Accessed(binding_var: BindingVariable) {
    return (binding_var.type & (BINDING_VARIABLE_TYPE.DIRECT_ACCESS)) > 0;
}

function compileBindingVariables(
    component: ComponentData,
    class_info: CompiledComponentClass,
    write_bindings: { hook: ProcessedHook; intermediate_hook: IntermediateHook; }[]
) {

    const { methods, method_frames, init_frame } = class_info;

    for (const { internal_name, class_index, flags, type } of component.root_frame.binding_variables.values()) {

        const IS_DIRECT_ACCESS = (type & BINDING_VARIABLE_TYPE.DIRECT_ACCESS) > 0;

        if (flags & BINDING_FLAG.WRITTEN) {

            const frame = createCompileFrame("u" + (class_index >= 0 ? class_index : 9999), "f,c");

            for (const { hook } of write_bindings) {

                if (hook.component_variables.has(internal_name)) {

                    const { IS_OBJECT } = hook.component_variables.get(internal_name);

                    // TODO: Sort bindings and their input outputs to make sure dependencies are met. 
                    if (hook.component_variables.size <= 1) {

                        frame.IS_ASYNC = Expression_Contains_Await(hook.write_ast) || frame.IS_ASYNC;

                        if (IS_OBJECT) {
                            const s = stmt(`if(${getCompiledBindingVariableName(internal_name, component)});`);
                            s.nodes[1] = {
                                type: <any>JSNodeType.ExpressionStatement,
                                nodes: [hook.write_ast],
                                pos: <any>hook.pos
                            };
                            appendStmtToFrame(frame, s);
                        } else
                            appendStmtToFrame(frame, <any>{
                                type: JSNodeType.ExpressionStatement,
                                nodes: [hook.write_ast],
                                pos: <any>hook.pos
                            });
                    }
                    else
                        appendStmtToFrame(frame, setPos(stmt(`this.call(${hook.name}, c)`), hook.pos));
                }
            }

            if (flags & BINDING_FLAG.ALLOW_EXPORT_TO_PARENT)
                appendStmtToFrame(frame, stmt(`/*if(!(f&${BINDING_FLAG.FROM_PARENT}))*/c.pup(${class_index}, v, f);`));

            if (Frame_Has_Statements(frame))

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

/**
 * Converts ComponentBinding expressions and identifers into class based reference expressions.
 * 
 * @param mutated_node 
 * @param component 
 */
export function finalizeBindingExpression(mutated_node: JSNode, component: ComponentData): { ast: JSNode, NEED_ASYNC: boolean; } {
    const lz = { ast: null };
    let NEED_ASYNC = false;
    for (const { node, meta: { mutate, skip } } of traverse(mutated_node, "nodes")
        .extract(lz)
        .filter("type",
            JSNodeType.AwaitExpression,
            JSNodeType.PostExpression,
            JSNodeType.PreExpression,
            JSNodeType.AssignmentExpression,
            JSNodeType.IdentifierReference,
            JSNodeType.IdentifierBinding)
        .makeMutable()
        .makeSkippable()
    ) {

        switch (node.type) {
            case JSNodeType.AwaitExpression:
                NEED_ASYNC = true;
                break;
            //case JSNodeType.ComponentBindingIdentifier
            case JSNodeType.IdentifierBinding:
            case JSNodeType.IdentifierReference:
                //@ts-ignore
                if (node.IS_BINDING_REF) {
                    const
                        name = <string>node.value,
                        id = exp(getCompiledBindingVariableName(name, component)),
                        new_node = setPos(id, node.pos);

                    if (!component.root_frame.binding_variables.has(<string>name))
                        //ts-ignore
                        throw node.pos.errorMessage(`Undefined reference to ${name}`);

                    mutate(new_node);
                }
                break;

            case JSNodeType.PreExpression:
            case JSNodeType.PostExpression:
                //@ts-ignore
                if (node.nodes[0].IS_BINDING_REF) {

                    const
                        [ref] = node.nodes,
                        //@ts-ignore
                        name = <string>ref.value,
                        comp_var: BindingVariable = getComponentBinding(name, component);

                    if (Binding_Var_Is_Internal_Variable(comp_var)) {
                        const
                            comp_var_name: string = getCompiledBindingVariableName(name, component),
                            assignment: JSCallExpression = <any>exp(`this.ua(${comp_var.class_index})`),
                            exp_ = exp(`${comp_var_name}${node.symbol[0]}1`);

                        const { ast, NEED_ASYNC: NA } = finalizeBindingExpression(ref, component);

                        NEED_ASYNC = NA || NEED_ASYNC;

                        exp_.nodes[0] = ast;

                        assignment.nodes[1].nodes.push(<any>exp_);

                        if (node.type == JSNodeType.PreExpression)
                            assignment.nodes[1].nodes.push(exp("true"));

                        mutate(setPos(assignment, node.pos));

                        skip();
                    }
                }
                break;

            case JSNodeType.AssignmentExpression:
                //@ts-ignore
                if (node.nodes[0].IS_BINDING_REF) {
                    const
                        [ref, value] = node.nodes,
                        //@ts-ignore
                        name = <string>ref.value,
                        comp_var: BindingVariable = getComponentBinding(name, component);

                    //Directly assign new value to model variables
                    if (Binding_Var_Is_Internal_Variable(comp_var)) {

                        const assignment: JSCallExpression = <any>exp(`this.ua(${comp_var.class_index})`);
                        const { ast: a1, NEED_ASYNC: NA1 } = finalizeBindingExpression(ref, component);
                        const { ast: a2, NEED_ASYNC: NA2 } = finalizeBindingExpression(value, component);

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



export function createClassInfoObject(): CompiledComponentClass {

    const
        binding_setup_frame = createCompileFrame("c", ""),
        init_frame = createCompileFrame("init", "c"),
        async_init_frame = createCompileFrame("async_init"),
        terminate_frame = createCompileFrame("terminate"),
        class_info: CompiledComponentClass = {
            methods: <any>[],
            binding_setup_frame,
            init_frame,
            async_init_frame,
            terminate_frame,
            nluf_public_variables: null,
            lfu_table_entries: [],
            lu_public_variables: [],
            method_frames: [async_init_frame, init_frame, binding_setup_frame],
            nlu_index: 0,
        };

    async_init_frame.IS_ASYNC = true;

    return class_info;
}

export async function createCompiledComponentClass(
    comp: ComponentData,
    presets: Presets,
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

            createLookupTables(info);

            setBindingVariableIndices(comp, info);

            processBindingVariables(comp, info, presets);

            processHooks(comp, info, presets);

            processMethods(comp, info);
        }

        // Remove methods 
        return info;

    } catch (e) {
        //throw e;
        console.log(`Error found in component ${comp.name} while converting to a class. location: ${comp.location}.`);
        console.log(e);
        return createCompiledComponentClass(createErrorComponent([e], comp.source, comp.location, comp), presets);
    }
}

function processCSS(
    component: ComponentData,
    class_info: CompiledComponentClass,
    presets: Presets
) {
    let style;

    if (style = componentDataToCSS(component)) {

        const frame = createCompileFrame("getCSS");
        class_info.method_frames.push(frame);
        appendStmtToFrame(frame, stmt(`return \`${style}\`;`));

        appendStmtToFrame(class_info.init_frame, stmt(`this.setCSS()`));
    }
}

async function processHTML(
    component: ComponentData,
    class_info: CompiledComponentClass,
    presets: Presets
) {

    if (component.HTML) {
        const
            frame = createCompileFrame("ce"),
            return_stmt = stmt("return this.makeElement(a);"),
            { html: [html], template_map } = (await componentDataToTempAST(component, presets));

        // Add templates to runtime template collection
        if (typeof document != undefined && document.createElement)

            for (const [template_name, template_node] of template_map.entries())

                if (!rt.templates.has(template_name)) {

                    const ele = document.createElement("div");

                    ele.innerHTML = htmlTemplateToString(template_node);

                    rt.templates.set(template_name, <HTMLElement>ele.firstElementChild);
                }

        return_stmt.nodes[0].nodes[1].nodes[0] = DOMLiteralToJSNode(html);

        appendStmtToFrame(frame, return_stmt);

        class_info.method_frames.push(frame);
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

        const { NEED_ASYNC } = finalizeBindingExpression(cpy, component);

        cpy.ASYNC = NEED_ASYNC || frame.IS_ASYNC || cpy.ASYNC;

        cpy.type = JSNodeType.Method;

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

function setBindingVariableIndices(component: Component, class_info: CompiledComponentClass) {

    for (const binding_variable of component.root_frame.binding_variables.values()) {

        if (binding_variable.type & BINDING_VARIABLE_TYPE.DIRECT_ACCESS)
            continue;
        binding_variable.class_index = class_info.nlu_index++;
    }
}

function createLookupTables(class_info: CompiledComponentClass) {
    const
        nlu = stmt("c.nlu = {};"), nluf = stmt("c.lookup_function_table = [];"),
        { nodes: [{ nodes: [, lu_functions] }] } = nluf,
        { nodes: [{ nodes: [, lu_public_variables] }] } = nlu;

    class_info.nluf_public_variables = <any>lu_functions;

    class_info.lfu_table_entries = <any[]>lu_functions.nodes;

    class_info.lu_public_variables = <any[]>lu_public_variables.nodes;

    prependStmtToFrame(class_info.init_frame, nlu, nluf);
}

function processBindingVariables(component: Component, class_info: CompiledComponentClass, presets: Presets): void {

    for (const binding_variable of component.root_frame.binding_variables.values()) {

        const
            { external_name, flags, class_index, internal_name, type } = binding_variable,
            nluf_array = exp(`c.u${class_index}`);

        addBindingInitialization(binding_variable, class_info, component, presets);

        if (type & BINDING_VARIABLE_TYPE.DIRECT_ACCESS)
            continue;

        class_info.lu_public_variables.push(<any>getPropertyAST(external_name, ((flags << 24) | class_index) + ""));

        class_info.lfu_table_entries.push(nluf_array);

    }
}

function addBindingInitialization(
    { default_val, class_index, ref_count }: BindingVariable,
    class_info: CompiledComponentClass,
    component: Component,
    presets: Presets
) {
    if (default_val && ref_count > 0) {

        const expr = <JSExpressionStatement>stmt(`this.ua(${class_index})`);

        if (default_val.type == JSNodeType.StringLiteral && default_val.value[0] == "@") {
            const val = convertAtLookupToElementRef(default_val, component);
            expr.nodes[0].nodes[1].nodes.push(<any>(val || default_val));
        } else
            expr.nodes[0].nodes[1].nodes.push(<any>default_val);

        appendStmtToFrame(class_info.init_frame, expr);
    }
}
