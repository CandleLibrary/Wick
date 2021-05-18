import { bidirectionalTraverse, copy } from "@candlefw/conflagrate";
import { exp, JSCallExpression, JSNodeType, stmt } from "@candlefw/js";
import { getComponentBinding, getCompiledBindingVariableName } from "../../common/binding.js";
import { setPos } from "../../common/common.js";
import { createErrorComponent } from "../../common/component.js";
import { DOMLiteralToJSNode } from "../../common/html.js";
import { getGenericMethodNode, getPropertyAST } from "../../common/js.js";
import Presets from "../../common/presets.js";
import { BINDING_VARIABLE_TYPE, BINDING_FLAG } from "../../types/binding";
import { CompiledComponentClass } from "../../types/class_information";
import { ComponentData } from "../../types/component";
import { FunctionFrame } from "../../types/function_frame";
import { HOOK_TYPE, IntermediateHook, ProcessedHook } from "../../types/hook";
import { TempHTMLNode } from "../../types/html.js";
import { HTMLNode, HTMLNodeTypeLU } from "../../types/wick_ast.js";
import { BindingVariable, Component } from "../../wick.js";
import { componentDataToCSS } from "../render/css.js";
import { componentDataToTempAST } from "./html.js";
import { hook_processors, setIdentifierReferenceVariables } from "./hooks.js";


function createBindingName(binding_index_pos: number) {
    return `b${binding_index_pos.toString(36)}`;
}

export function runHTMLHookHandlers(
    intermediate_hook: IntermediateHook,
    component: ComponentData,
    presets: Presets,
    model: any = null,
    parent_component: ComponentData
): TempHTMLNode {
    for (const handler of hook_processors) {

        let html_element = null;

        if (handler.canProcessHook(
            intermediate_hook.selector,
            HTMLNodeTypeLU[intermediate_hook.host_node.type]
        ))
            html_element = handler.getDefaultHTMLValue(
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

        let hook = null;

        if (handler.canProcessHook(
            intermediate_hook.selector,
            HTMLNodeTypeLU[intermediate_hook.host_node.type]
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

        return { hook, intermediate_hook };
    }
    return { hook: null, intermediate_hook };
}

export function processHooks(component: ComponentData, class_info: CompiledComponentClass, presets: Presets) {

    const
        {
            hooks: intermediate_hooks,
            root_frame: { binding_variables: binding_type }
        } = component,

        {
            methods,
            teardown_stmts: clean_stmts,
            setup_stmts: initialize_stmts,
            nluf_public_variables
        } = class_info,

        registered_elements: Set<number> = new Set,

        processed_hooks = intermediate_hooks
            .map(b => runClassHookHandlers(b, component, presets, class_info))
            .sort((a, b) => a.hook.priority > b.hook.priority ? -1 : 1),
        /**
         * All component variables that have been assigned a value
         */
        initialized_internal_variables: Set<number> = new Set;

    let hook_count = 0;

    for (const { hook, intermediate_hook } of processed_hooks) {

        hook.name = createBindingName(hook_count++);

        const { html_element_index: index } = intermediate_hook,
            {
                read_ast, write_ast,
                initialize_ast, cleanup_ast,
                type,
                component_variables,
                name: binding_name
            } = hook;

        /**
         * register this binding's element if it has not already been done.
         */
        if (index > -1 && !registered_elements.has(index)) {
            initialize_stmts.unshift(stmt(`this.e${index}=this.elu[${index}]`));
            registered_elements.add(index);
        }

        if (type & HOOK_TYPE.WRITE && write_ast) {


            /**
             * Add a binding update function reference to the function lookup
             * table
             */

            if (component_variables.size > 1) {

                //Create binding update method.

                hook.name = nluf_public_variables.nodes.length + "";
                //@ts-ignore
                nluf_public_variables.nodes.push(<any>exp(`c.b${hook.name}`));

                const method = getGenericMethodNode("b" + hook.name, "c=0", ";"),
                    [, , body] = method.nodes,
                    { nodes } = body;

                nodes.length = 0;

                const check_ids = [];

                for (const { name } of component_variables.values()) {

                    if (!component.root_frame.binding_variables.has(name))
                        throw (hook.pos.errorMessage(`missing binding variable for ${name}`));

                    const { class_index, type } = component.root_frame.binding_variables.get(name);

                    if (type & (BINDING_VARIABLE_TYPE.DIRECT_ACCESS
                        | BINDING_VARIABLE_TYPE.METHOD_VARIABLE)
                    ) continue;

                    check_ids.push(class_index);
                }

                if (check_ids.length > 0)
                    //@ts-ignore
                    nodes.push(<any>stmt(`if(!this.check(${check_ids.sort()}))return 0;`));

                body.nodes.push(write_ast);

                methods.push(<any>method);
            }
        }

        if (type & HOOK_TYPE.READ && read_ast)
            initialize_stmts.push(read_ast);

        if (initialize_ast) {

            initialize_stmts.push({
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
            clean_stmts.push(cleanup_ast);
    }

    const write_bindings = processed_hooks.filter(b => (b.hook.type & HOOK_TYPE.WRITE) && !!b.hook.write_ast);


    for (const { internal_name, class_index, flags, type } of component.root_frame.binding_variables.values()) {

        if (type & BINDING_VARIABLE_TYPE.DIRECT_ACCESS)
            continue;

        if (true || flags & BINDING_FLAG.WRITTEN) {

            const method = getGenericMethodNode("u" + class_index, "f,c", ";"),

                [, , body] = method.nodes;

            body.nodes.length = 0;


            for (const { hook } of write_bindings) {

                if (hook.component_variables.has(internal_name)) {

                    const { IS_OBJECT } = hook.component_variables.get(internal_name);

                    // TODO: Sort bindings and their input outputs to make sure dependencies are met. 

                    if (hook.component_variables.size <= 1) {

                        if (IS_OBJECT) {
                            const s = stmt(`if(${getCompiledBindingVariableName(internal_name, component)});`);
                            s.nodes[1] = {
                                type: <any>JSNodeType.ExpressionStatement,
                                nodes: [hook.write_ast],
                                pos: <any>hook.pos
                            };
                            body.nodes.push(s);
                        } else
                            body.nodes.push({
                                type: JSNodeType.ExpressionStatement,
                                nodes: [hook.write_ast],
                                pos: hook.pos
                            });
                    } else
                        body.nodes.push(setPos(stmt(`this.call(${hook.name}, c)`), hook.pos));
                }
            }

            if (flags & BINDING_FLAG.ALLOW_EXPORT_TO_PARENT)
                body.nodes.push(stmt(`/*if(!(f&${BINDING_FLAG.FROM_PARENT}))*/c.pup(${class_index}, v, f);`));

            if (body.nodes.length > 0)
                methods.push(<any>method);
        }
    }
}


/**
 * Create new AST that has all undefined references converted to binding
 * lookups or static values.
 */
function makeComponentMethod(frame: FunctionFrame, component: ComponentData, ci: CompiledComponentClass) {

    const ast = frame.ast;

    if (ast) {

        const cpy = copy(ast);

        for (const { node, meta: { mutate, traverse_state } } of bidirectionalTraverse(cpy, "nodes")
            .filter("type",
                JSNodeType.PostExpression,
                JSNodeType.PreExpression,
                JSNodeType.AssignmentExpression,
                JSNodeType.IdentifierReference,
                JSNodeType.IdentifierBinding)
            .makeMutable()) {

            if (traverse_state > 0) {

                switch (node.type) {
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

                            new_node.IS_BINDING_REF = name;

                            mutate(new_node);
                        }
                        break;

                    case JSNodeType.PreExpression:
                    case JSNodeType.PostExpression:
                        //@ts-ignore
                        if (node.nodes[0].IS_BINDING_REF) {

                            const
                                ref = node.nodes[0],
                                //@ts-ignore
                                name = <string>ref.IS_BINDING_REF,
                                comp_var: BindingVariable = getComponentBinding(name, component),
                                comp_var_name: string = getCompiledBindingVariableName(name, component),
                                assignment: JSCallExpression = <any>exp(`this.ua(${comp_var.class_index})`),
                                exp_ = exp(`${comp_var_name}${node.symbol[0]}1`);

                            assignment.nodes[1].nodes.push(<any>exp_);

                            if (node.type == JSNodeType.PreExpression)
                                assignment.nodes[1].nodes.push(exp("true"));

                            mutate(setPos(assignment, node.pos));
                        }
                        break;

                    case JSNodeType.AssignmentExpression:
                        //@ts-ignore
                        if (node.nodes[0].IS_BINDING_REF) {
                            const
                                ref = node.nodes[0],
                                //@ts-ignore
                                name = <string>ref.IS_BINDING_REF,
                                comp_var: BindingVariable = getComponentBinding(name, component),
                                assignment: JSCallExpression = <any>exp(`this.ua(${comp_var.class_index})`);

                            if (node.symbol == "=") {
                                assignment.nodes[1].nodes.push(node.nodes[1]);
                            } else {
                                //@ts-ignore
                                node.symbol = node.symbol.slice(0, 1);
                                assignment.nodes[1].nodes.push(node);
                            }

                            mutate(setPos(assignment, node.pos));
                        }
                        break;
                }
            }
        }

        const updated_names = new Set();

        cpy.type = JSNodeType.Method;

        if (!frame.IS_ROOT) {

            let id_indices = [];

            for (const name of frame.output_names.values()) {
                if (!updated_names.has(name)) {

                    const { type, class_index, pos } = component.root_frame.binding_variables.get(name);

                    if (type == BINDING_VARIABLE_TYPE.INTERNAL_VARIABLE)
                        id_indices.push(class_index);
                }
            }

            if (frame.index != undefined)
                //@ts-ignore
                cpy.nodes[0].value = `f${frame.index}`;
            //@ts-ignore
            cpy.function_type = "method";
        }
        else
            //@ts-ignore
            cpy.function_type = "root";


        switch (frame.IS_ROOT) {
            case true:
                //@ts-ignore
                ci.binding_setup_stmts.push(...cpy.nodes.filter(n => n.type != JSNodeType.EmptyStatement));
                break;
            default:
                ci.methods.push(cpy);
        }
    }
}

export function createCompiledComponentClass(
    component: ComponentData,
    presets: Presets,
    INCLUDE_HTML: boolean = true,
    INCLUDE_CSS: boolean = true
): CompiledComponentClass {

    try {

        const
            binding_values_init_method = getGenericMethodNode("c", "", ";"),
            register_elements_method = getGenericMethodNode("re", "c", ";"),
            [, , { nodes: bi_stmts }] = binding_values_init_method.nodes,
            [, , { nodes: re_stmts }] = register_elements_method.nodes,
            class_info: CompiledComponentClass = {
                methods: <any>[],
                binding_setup_stmts: <any>bi_stmts,
                setup_stmts: <any>re_stmts,
                teardown_stmts: [],
                nluf_public_variables: null,
                nlu_index: 0,
            };

        re_stmts.length = 0;
        bi_stmts.length = 0;

        class_info.methods.push(<any>binding_values_init_method);

        class_info.methods.push(<any>register_elements_method);

        //Javascript Information.
        if (component.HAS_ERRORS === false && component.root_frame) {

            processBindingVariables(component, class_info, presets);

            processHooks(component, class_info, presets);

            processMethods(class_info, component);
        }

        //HTML INFORMATION
        if (INCLUDE_HTML)
            processHTML(component, class_info, presets);

        //CSS INFORMATION
        if (INCLUDE_CSS)
            processCSS(component, class_info, presets);


        // Remove methods 
        return class_info;

    } catch (e) {
        console.log(e);
        console.warn(`Error found in component ${component.name} while converting to a class. location: ${component.location}.`);
        console.error(e);
        return null; createCompiledComponentClass(createErrorComponent([e], component.source, component.location, component), presets);
    }
}
function processCSS(
    component: ComponentData,
    class_info: CompiledComponentClass,
    presets: Presets
) {

    let style;

    if (style = componentDataToCSS(component)) {
        class_info.setup_stmts.push(<any>stmt(`this.setCSS()`));
        class_info.methods.push(
            setPos(getGenericMethodNode("getCSS", "", `return \`${style}\`;`),
                component.CSS[0].data.pos)
        );
    }
}
function processHTML(
    component: ComponentData,
    class_info: CompiledComponentClass,
    presets: Presets
) {

    if (component.HTML) {

        const ele_create_method = setPos(getGenericMethodNode("ce", "", "return this.makeElement(a);"), component.HTML.pos),

            [, , { nodes: [r_stmt] }] = ele_create_method.nodes;

        const html = componentDataToTempAST(component, presets).html.pop();

        r_stmt.nodes[0].nodes[1].nodes[0] = DOMLiteralToJSNode(html);

        // Setup element
        class_info.methods.push(ele_create_method);
    }
}
function processMethods(class_info: CompiledComponentClass, component: ComponentData) {
    for (const function_block of component.frames)
        makeComponentMethod(function_block, component, class_info);
}
function processBindingVariables(component: Component, class_info: CompiledComponentClass, presets: Presets) {
    const
        nlu = stmt("c.nlu = {};"), nluf = stmt("c.lookup_function_table = [];"),
        { nodes: [{ nodes: [, lu_functions] }] } = nluf,
        { nodes: [{ nodes: [, lu_public_variables] }] } = nlu;

    class_info.nluf_public_variables = <any>lu_functions;

    class_info.setup_stmts.unshift(nlu, nluf);

    for (const binding_variable of component.root_frame.binding_variables.values()) {

        addBindingInitialization(binding_variable, class_info, component, presets);

        binding_variable.class_index = class_info.nlu_index;

        const
            { nlu_index } = class_info,
            { external_name, flags, class_index, internal_name, type } = binding_variable,
            nluf_array = exp(`c.u${class_index}`);

        if (type & BINDING_VARIABLE_TYPE.DIRECT_ACCESS)
            continue;

        lu_public_variables.nodes.push(getPropertyAST(external_name, ((flags << 24) | nlu_index) + ""));

        lu_functions.nodes.push(nluf_array);

        class_info.nlu_index++;
    }
}
function addBindingInitialization(
    { default_val, class_index }: BindingVariable,
    class_info: CompiledComponentClass,
    component: Component,
    presets: Presets
) {
    if (default_val) {

        const expr = exp(`this.ua(${class_index})`);

        expr.nodes[1].nodes.push(<any>default_val);

        const converted_expression = setIdentifierReferenceVariables(expr, component);

        class_info.setup_stmts.push(converted_expression);

    }
}
