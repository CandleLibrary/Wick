import { copy, traverse } from "@candlelib/conflagrate";
import {
    exp, JSCallExpression,
    JSFunctionDeclaration,
    JSMethod,
    JSNode,
    JSNodeType as JST,
    stmt,
    renderCompressed
} from "@candlelib/js";
import {
    BindingVariable,
    CompiledComponentClass,
    ComponentData,
    FunctionFrame,
    PresetOptions
} from "../../types/all.js";
import { componentDataToCSS } from "../ast-render/css.js";
import {
    htmlTemplateToString
} from "../ast-render/html.js";
import {
    Binding_Var_Is_Internal_Variable,
    getCompiledBindingVariableNameFromString,
    getComponentBinding
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
import {
    addBindingRecord,
    processHookASTs as processResolvedHooks,
    processHookForClass,
    processIndirectHook
} from "./hooks.js";
import { componentDataToTempAST, createComponentTemplate } from "./html.js";
import * as b_sys from "../build_system.js";

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

/**
 * Produces a compiled component class from 
 * @param component 
 * @param presets 
 * @param INCLUDE_HTML 
 * @param INCLUDE_CSS 
 * @returns 
 */
export async function createCompiledComponentClass(
    component: ComponentData,
    presets: PresetOptions,
    INCLUDE_HTML: boolean = true,
    INCLUDE_CSS: boolean = true
): Promise<CompiledComponentClass> {

    b_sys.enableBuildFeatures();

    try {

        const class_info = createClassInfoObject();


        //HTML INFORMATION
        if (INCLUDE_HTML)
            await processHTML(component, class_info, presets);

        //CSS INFORMATION
        if (INCLUDE_CSS)
            processCSS(component, class_info, presets);

        //Javascript Information.
        if (component.HAS_ERRORS === false && component.root_frame) {

            const {
                nlu,
                nluf
            } = createLookupTables(class_info);

            for (const hook of component.indirect_hooks)
                await processIndirectHook(component, presets, hook, class_info);

            for (const frame of component.frames)
                await processFunctionFrameHook(component, presets, frame, class_info);

            processResolvedHooks(component, class_info);

            if (class_info.lfu_table_entries.length > 0)
                prependStmtToFrame(class_info.init_frame, nlu);

            if (class_info.lfu_table_entries.length > 0)
                prependStmtToFrame(class_info.init_frame, nluf);


            // check for any onload frames. This will be converted to the async_init frame. Any
            // statements defined in async_init will prepended to the frames statements. Create
            // a new frame if onload is not present
            const onload_frame: FunctionFrame = component.frames.filter(s => s.method_name.toLowerCase() == "onload")[0],
                { root_frame } = component;

            const out_frames = [...class_info.method_frames, ...component.frames.filter(
                f => (f != onload_frame) && (f != root_frame)
            )];

            if (onload_frame)
                prependStmtToFrame(class_info.async_init_frame, ...onload_frame.ast.nodes[2].nodes);

            if (root_frame.IS_ASYNC)
                appendStmtToFrame(class_info.async_init_frame, ...getStatementsFromRootFrame(root_frame));
            else
                appendStmtToFrame(class_info.init_frame, ...getStatementsFromRootFrame(root_frame));

            //Ensure there is an async init method
            for (const function_block of out_frames)
                await makeComponentMethod(function_block, component, class_info, presets);

        }

        // Remove methods 
        return class_info;

    } catch (e) {
        console.log(e);
        throw e;
        console.log(`Error found in component ${component.name} while converting to a class. location: ${component.location}.`);
        return createCompiledComponentClass(createErrorComponent([e], component.source, component.location, component), presets);
    } finally {
        b_sys.disableBuildFeatures();
    }
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

export async function processFunctionFrameHook(
    comp: ComponentData,
    presets: PresetOptions,
    frame: FunctionFrame,
    class_info: CompiledComponentClass,
) {
    for (const { node, meta: { mutate, skip } } of traverse(frame.ast, "nodes")
        .makeMutable()
        .makeSkippable()
    ) {
        if (
            //@ts-ignore
            node.type == BindingIdentifierBinding
            ||
            //@ts-ignore
            node.type == BindingIdentifierReference
        ) {

            await addBindingRecord(class_info, node.value, comp, presets);

        } else if (node.type > 0xFFFFFFFF) {

            const new_node = await processHookForClass(node, comp, presets, class_info, -1, false);

            if (new_node != node)
                mutate(new_node);

            skip();

            continue;
        }
    }
}

function Node_Is_Binding_Identifier(node: JSNode) {
    return node.type == BindingIdentifierBinding || node.type == BindingIdentifierReference;
}

/**
 * Create new AST that has all undefined references converted to binding
 * lookups or static values.
 */
async function makeComponentMethod(
    frame: FunctionFrame,
    component: ComponentData,
    ci: CompiledComponentClass,
    presets: PresetOptions
) {

    if (frame.ast && !frame.IS_ROOT) {

        ////Do not create empty functions
        if (!Frame_Has_Statements(frame))
            return;

        const cpy: JSFunctionDeclaration | JSMethod = <any>copy(frame.ast);



        const { NEED_ASYNC } = await finalizeBindingExpression(cpy, component, ci, presets);

        cpy.ASYNC = NEED_ASYNC || frame.IS_ASYNC || cpy.ASYNC;

        cpy.type = JST.Method;

        if (frame.index != undefined)
            //@ts-ignore
            cpy.nodes[0].value = `f${frame.index}`;


        ci.methods.push(cpy);
    }
}



/**
 * Converts ComponentBinding expressions and identifers into class based reference expressions.
 * 
 * @param mutated_node 
 * @param component 
 */
export async function finalizeBindingExpression(
    mutated_node: JSNode,
    component: ComponentData,
    comp_info: CompiledComponentClass,
    presets: PresetOptions
): Promise<{
    ast: JSNode,
    NEED_ASYNC: boolean;
}> {
    const lz = { ast: null };
    let NEED_ASYNC = false;
    for (const { node, meta: { mutate, skip } } of traverse(mutated_node, "nodes")
        .extract(lz)
        .makeMutable()
        .makeSkippable()
    ) {
        switch (node.type) {

            case JST.IdentifierBinding: case JST.IdentifierReference:
                /**
                 * Convert convenience names to class property accessors
                 */
                if (node.value.slice(0, 5) == ("$$ele")) {
                    mutate(<any>exp(`this.elu[${node.value.slice(5)}]`));
                    skip();
                } else if (node.value.slice(0, 5) == ("$$ctr")) {
                    mutate(<any>exp(`this.ctr[${node.value.slice(5)}]`));
                    skip();
                } else if (node.value.slice(0, 4) == ("$$ch")) {
                    mutate(<any>exp(`this.ch[${node.value.slice(4)}]`));
                    skip();
                } else if (node.value.slice(0, 4) == "$$bi") {
                    const binding = getComponentBinding(node.value.slice(4), component);
                    mutate(<any>exp(`${binding.class_index}`));
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
                    id = exp(getCompiledBindingVariableNameFromString(name, component, comp_info)),
                    new_node = setPos(id, node.pos);

                if (!component.root_frame.binding_variables.has(<string>name))
                    //ts-ignore
                    throw node.pos.returnError(`Undefined reference to ${name}`);

                mutate(<any>new_node);

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

                            index = comp_info.binding_records.get(name).index,

                            comp_var_name: string =
                                getCompiledBindingVariableNameFromString(name, component, comp_info),

                            assignment: JSCallExpression = <any>exp(`this.ua(${index})`),

                            exp_ = exp(`${comp_var_name}${node.symbol[0]}1`),

                            { ast, NEED_ASYNC: NA } =
                                await finalizeBindingExpression(ref, component, comp_info, presets);

                        NEED_ASYNC = NA || NEED_ASYNC;

                        exp_.nodes[0] = ast;

                        assignment.nodes[1].nodes.push(<any>exp_);

                        if (node.type == JST.PreExpression)
                            assignment.nodes[1].nodes.push(
                                <any>exp("true")
                            );

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

                        const index = comp_info.binding_records.get(name).index,

                            assignment: JSCallExpression = <any>exp(`this.ua(${index})`),

                            { ast: a1, NEED_ASYNC: NA1 } =
                                await finalizeBindingExpression(ref, component, comp_info, presets),

                            { ast: a2, NEED_ASYNC: NA2 } =
                                await finalizeBindingExpression(value, component, comp_info, presets);

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