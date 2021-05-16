import { bidirectionalTraverse, copy, createSourceMap, createSourceMapJSON } from "@candlefw/conflagrate";
import { exp, JSCallExpression, JSNodeType, stmt } from "@candlefw/js";
import { getComponentBinding, getComponentVariableName } from "../../common/binding.js";
import { setPos } from "../../common/common.js";
import { createErrorComponent } from "../../common/component.js";
import { DOMLiteralToJSNode } from "../../common/html.js";
import { getGenericMethodNode, getPropertyAST } from "../../common/js.js";
import Presets from "../../common/presets.js";
import { renderWithFormatting, renderWithFormattingAndSourceMap } from "../../render/render.js";
import { WickRTComponent } from "../../runtime/component.js";
import { BINDING_VARIABLE_TYPE } from "../../types/binding";
import { ClassInformation } from "../../types/class_information.js";
import { ComponentClassStrings, ComponentData } from "../../types/component";
import { FunctionFrame } from "../../types/function_frame";
import { BindingVariable } from "../../wick.js";
import { processHooks } from "../compile/compile.js";
import { componentDataToCSS } from "./css.js";
import { componentDataToTempAST } from "./html.js";


const StrToBase64 = (typeof btoa != "undefined") ? btoa : str => Buffer.from(str, 'binary').toString('base64');

const componentStringToJS =
    ({ class_string: cls, source_map }: ComponentClassStrings, component: ComponentData, presets: Presets) => (
        (
            eval(
                "c=>" + cls + (presets.options.GENERATE_SOURCE_MAPS ? `\n${source_map}` : "")
            )
        )(component)
    );

/**
 * Create new AST that has all undefined references converted to binding 
 * lookups or static values.
 */
function makeComponentMethod(frame: FunctionFrame, component: ComponentData, ci: ClassInformation) {

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
            .makeMutable()
        ) {

            if (traverse_state > 0) {

                switch (node.type) {
                    case JSNodeType.IdentifierBinding:
                    case JSNodeType.IdentifierReference:
                        //@ts-ignore
                        if (node.IS_BINDING_REF) {

                            const
                                name = <string>node.value,
                                id = exp(getComponentVariableName(name, component)),
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
                                comp_var_name: string = getComponentVariableName(name, component),
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

                    const { type, class_index, pos }
                        = component.root_frame.binding_variables.get(name);

                    if (type == BINDING_VARIABLE_TYPE.INTERNAL_VARIABLE)
                        id_indices.push(class_index);
                }
            }

            if (frame.index != undefined)
                //@ts-ignore
                cpy.nodes[0].value = `f${frame.index}`;
            //@ts-ignore
            cpy.function_type = "method";
        } else
            //@ts-ignore
            cpy.function_type = "root";


        switch (frame.IS_ROOT) {
            case true:
                //@ts-ignore
                ci.binding_init_statements.push(...cpy.nodes.filter(n => n.type != JSNodeType.EmptyStatement));
                break;
            default:
                ci.methods.push(cpy);
        }
    }
}

export function componentDataToJSCached(
    component: ComponentData,
    presets: Presets,
    INCLUDE_HTML: boolean = true,
    INCLUDE_CSS = true
): typeof WickRTComponent {

    const name = component.name;

    let comp: typeof WickRTComponent = presets.component_class.get(name);

    if (!comp) {

        const str = componentDataToJSStringCached(component, presets, INCLUDE_HTML, INCLUDE_CSS);

        comp = componentStringToJS(str, component, presets);

        presets.component_class.set(name, comp);

        for (const comp of component.local_component_names.values()) {
            if (!presets.component_class_string.has(comp))
                componentDataToJSCached(presets.components.get(comp), presets, INCLUDE_HTML, INCLUDE_CSS);
        }
    }

    return comp;
}

export function componentDataToJS(
    component: ComponentData,
    presets: Presets,
    INCLUDE_HTML: boolean = true,
    INCLUDE_CSS: boolean = true
): typeof WickRTComponent {

    const class_string = componentDataToClassString(component, presets, INCLUDE_HTML, INCLUDE_CSS);

    return componentStringToJS(class_string, component, presets);
}

export function componentDataToJSStringCached(
    component: ComponentData,
    presets: Presets,
    INCLUDE_HTML: boolean = true,
    INCLUDE_CSS: boolean = true
): ComponentClassStrings {

    const name = component.name;

    let str: ComponentClassStrings = presets.component_class_string.get(name);

    if (!str) {

        str = componentDataToClassString(component, presets, INCLUDE_HTML, INCLUDE_CSS);

        presets.component_class_string.set(name, str);
    }

    return str;
}

export function componentDataToClassString(
    component: ComponentData,
    presets: Presets,
    INCLUDE_HTML: boolean = true,
    INCLUDE_CSS: boolean = true
): ComponentClassStrings {

    try {

        const
            component_class = stmt(`class ${component.name || "temp"} extends 
            cfw.wick.rt.C {constructor(m,e,p,w){super(m,e,p,w,"${component.global_model_name || ""}");}}`),
            binding_values_init_method = getGenericMethodNode("c", "", ";"),
            register_elements_method = getGenericMethodNode("re", "c", ";"),
            [, , { nodes: bi_stmts }] = binding_values_init_method.nodes,
            [, , { nodes: re_stmts }] = register_elements_method.nodes,
            class_information: ClassInformation = {
                frames: component.frames.slice(),
                methods: <any>component_class.nodes,
                binding_init_statements: <any>bi_stmts,
                class_initializer_statements: <any>re_stmts,
                class_cleanup_statements: [],
                nluf_arrays: [],
                compiled_ast: null,
                nluf_public_variables: null,
                nlu_index: 0,
            };

        let HAVE_LU_DATA = false;

        if (!component.global_model_name)
            component_class.nodes.length = 2;

        re_stmts.length = 0;
        bi_stmts.length = 0;

        //Javascript Information.
        if (component.HAS_ERRORS === false && component.root_frame) {

            const
                cleanup_element_method = getGenericMethodNode("cu", "", "const c = this;"),
                [, , { nodes: cu_stmts }] = cleanup_element_method.nodes,
                public_prop_lookup = {},
                nlu = stmt("c.nlu = {};"), nluf = stmt("c.lookup_function_table = [];"),
                { nodes: [{ nodes: [, lu_functions] }] } = nluf,
                { nodes: [{ nodes: [, lu_public_variables] }] } = nlu;

            class_information.class_cleanup_statements = <any>cu_stmts;

            for (const comp_var of component.root_frame.binding_variables.values()) {

                comp_var.class_index = class_information.nlu_index;

                const { nlu_index } = class_information,
                    { external_name, flags, class_index, internal_name, type } = comp_var,
                    nluf_array = exp(`c.u${class_index}`);

                if (type & BINDING_VARIABLE_TYPE.DIRECT_ACCESS)
                    continue;

                lu_public_variables.nodes.push(getPropertyAST(external_name, ((flags << 24) | nlu_index) + ""));

                lu_functions.nodes.push(nluf_array);

                public_prop_lookup[internal_name] = nlu_index;

                HAVE_LU_DATA = true;

                class_information.nlu_index++;
            }

            class_information.nluf_public_variables = <any>lu_functions;

            processHooks(component, class_information, presets);

            class_information.class_initializer_statements.unshift(nlu, nluf);

            for (const function_block of class_information.frames)
                makeComponentMethod(function_block, component, class_information);
        }

        //HTML INFORMATION
        if (component.HTML && INCLUDE_HTML) {

            const ele_create_method = setPos(getGenericMethodNode("ce", "", "return this.makeElement(a);"), component.HTML.pos),

                [, , { nodes: [r_stmt] }] = ele_create_method.nodes;

            const html = componentDataToTempAST(component, presets).html.pop();

            r_stmt.nodes[0].nodes[1].nodes[0] = DOMLiteralToJSNode(html);

            // Setup element
            class_information.methods.push(ele_create_method);
        }

        //CSS INFORMATION
        let style;

        if (INCLUDE_CSS && (style = componentDataToCSS(component))) {
            re_stmts.push(<any>stmt(`this.setCSS()`));
            class_information.methods.push(setPos(getGenericMethodNode("getCSS", "", `return \`${style}\`;`), component.CSS[0].data.pos));
        }

        if (class_information.binding_init_statements.length > 0)
            class_information.methods.push(<any>binding_values_init_method);

        if (class_information.class_initializer_statements.length > 2 || HAVE_LU_DATA)
            class_information.methods.push(<any>register_elements_method);

        class_information.compiled_ast = component_class;

        let cl = "", sm = "";

        if (presets.options.GENERATE_SOURCE_MAPS) {

            const
                map = [],
                names = new Map();

            cl = renderWithFormattingAndSourceMap(class_information.compiled_ast, undefined, undefined, map, 0, names);

            const source_map = createSourceMap(map, component.location.file, component.location.dir, [component.location.file], [], [component.source]);

            sm = "//# sourceMappingURL=data:application/json;base64," + StrToBase64(createSourceMapJSON(source_map));
        } else
            cl = renderWithFormatting(class_information.compiled_ast);

        return { class_string: cl + (presets.options.INCLUDE_SOURCE_URI ? + `\n/* ${component.location} */\n` : ""), source_map: sm };

    } catch (e) {
        console.warn(`Error found in component ${component.name} while converting to a class. location: ${component.location}.`);
        console.error(e);
        return null; componentDataToClassString(createErrorComponent([e], component.source, component.location, component), presets);
    }
}