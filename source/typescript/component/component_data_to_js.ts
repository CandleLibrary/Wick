import { MinTreeNodeType, MinTreeNode, exp, stmt } from "@candlefw/js";
import { renderWithFormatting, copy } from "@candlefw/conflagrate";

import Presets from "../presets.js";
import { processBindings } from "./component_process_bindings.js";
import { Component, FunctionFrame, VARIABLE_REFERENCE_TYPE, } from "../types/types";
import { getPropertyAST, getGenericMethodNode } from "./component_js_ast_tools.js";
import { getComponentVariableName } from "./component_set_component_variable.js";
import { renderers, format_rules } from "../format_rules.js";
import { WickRTComponent } from "../runtime/runtime_component.js";
import { componentDataToCSS } from "./component_data_to_css.js";
import { createErrorComponent } from "./component.js";


function registerActivatedFrameMethod(frame: FunctionFrame, class_information) {
    if (frame.index) class_information.nluf_public_variables.nodes.push(exp(`c.f${frame.index}`));
}

const componentStringToJS =
    (class_string: string, component: Component, presets: Presets) => (Function("c", "return " + class_string)(component));

/**
 * Update global variables in ast after all globals have been identified
 */
function makeComponentMethod(frame: FunctionFrame, component: Component, class_information) {

    const ast = frame.ast;

    registerActivatedFrameMethod(frame, class_information);

    if (ast) {


        const updated_names = new Set();

        for (const { index, node: { pos, value: name }, parent } of frame.binding_ref_identifiers) {
            if (!component.root_frame.binding_type.has(<string>name))
                throw pos.errorMessage(`Undefined reference to ${name}`);

            parent.nodes[index] = exp(getComponentVariableName(name, component));
        }


        const cpy = copy(ast);

        cpy.type = MinTreeNodeType.Method;

        if (!frame.IS_ROOT) {

            for (const name of frame.output_names.values())
                if (!updated_names.has(name)) {

                    const { type, class_index }
                        = component.root_frame.binding_type.get(name);

                    if (type == VARIABLE_REFERENCE_TYPE.INTERNAL_VARIABLE)
                        cpy.nodes[2].nodes.push(stmt(`this.u${class_index}(this[${class_index}]);`));

                }


            if (frame.index != undefined)
                cpy.nodes[0].value = `f${frame.index}`;

            cpy.function_type = "method";
        } else
            cpy.function_type = "root";

        switch (frame.IS_ROOT) {
            case true:
                class_information.binding_init_statements.push(...cpy.nodes.filter(n => n.type != MinTreeNodeType.EmptyStatement));
                break;
            default:
                class_information.methods.push(cpy);
        }
    }
}

export function componentDataToJSCached(component: Component, presets: Presets, INCLUDE_HTML: boolean = true, INCLUDE_CSS = true): typeof WickRTComponent {

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

export function componentDataToJS(component: Component, presets: Presets, INCLUDE_HTML: boolean = true, INCLUDE_CSS = true): typeof WickRTComponent {

    const class_string = componentDataToClassString(component, presets, INCLUDE_HTML, INCLUDE_CSS);

    return componentStringToJS(class_string, component, presets);
}

export function componentDataToJSStringCached(component: Component, presets: Presets, INCLUDE_HTML: boolean = true, INCLUDE_CSS = true): string {

    const name = component.name;

    let str: string = presets.component_class_string.get(name);

    if (!str) {

        str = componentDataToClassString(component, presets, INCLUDE_HTML, INCLUDE_CSS);

        presets.component_class_string.set(name, str);
    }

    return str;
}

export function componentDataToClassString(component: Component, presets: Presets, INCLUDE_HTML: boolean = true, INCLUDE_CSS = true): string {

    try {

        const
            component_class = stmt(`class ${component.name || "temp"} extends cfw.wick.rt.C {constructor(m,e,p,w){super(m,e,p,w,"${component.global_model || ""}");}}`),
            binding_values_init_method = getGenericMethodNode("c", "", ";"),
            register_elements_method = getGenericMethodNode("re", "c", ";"),
            [, , { nodes: bi_stmts }] = binding_values_init_method.nodes,
            [, , { nodes: re_stmts }] = register_elements_method.nodes,
            class_information = {
                methods: component_class.nodes,
                binding_init_statements: bi_stmts,
                class_initializer_statements: re_stmts,
                class_cleanup_statements: [],
                nluf_arrays: [],
                compiled_ast: null,
                nluf_public_variables: null,
                nlu_index: 0,
            };

        if (!component.global_model)
            component_class.nodes.length = 2;

        re_stmts.length = 0;
        bi_stmts.length = 0;

        //Javascript Information.
        if (component.ERRORS === false && component.root_frame) {

            const
                cleanup_element_method = getGenericMethodNode("cu", "", "const c = this;"),
                [, , { nodes: cu_stmts }] = cleanup_element_method.nodes,
                public_prop_lookup = {},
                nlu = stmt("c.nlu = {};"), nluf = stmt("c.lookup_function_table = [];"),
                { nodes: [{ nodes: [, nluf_public_variables] }] } = nluf,
                { nodes: [{ nodes: [, lu_public_variables] }] } = nlu;

            class_information.class_cleanup_statements = cu_stmts;

            for (const comp_var of component.root_frame.binding_type.values()) {

                comp_var.class_index = class_information.nlu_index;

                const { nlu_index } = class_information,
                    { external_name, flags, class_index, internal_name, type } = comp_var,
                    nluf_array = exp(`c.u${class_index}`);

                if (type & VARIABLE_REFERENCE_TYPE.DIRECT_ACCESS)
                    continue;

                lu_public_variables.nodes.push(getPropertyAST(external_name, ((flags << 24) | nlu_index) + ""));

                nluf_public_variables.nodes.push(nluf_array);

                public_prop_lookup[internal_name] = nlu_index;

                class_information.nlu_index++;
            }

            class_information.nluf_public_variables = nluf_public_variables;

            processBindings(component, class_information, presets);

            class_information.class_initializer_statements.unshift(nlu, nluf);

            for (const function_block of component.frames) {
                makeComponentMethod(function_block, component, class_information);
            }
        }

        //HTML INFORMATION
        if (component.HTML && INCLUDE_HTML) {

            const ele_create_method = getGenericMethodNode("ce", "", "return this.me(a);"),

                [, , { nodes: [r_stmt] }] = ele_create_method.nodes;

            r_stmt.nodes[0].nodes[1].nodes[0] = <MinTreeNode>{ type: MinTreeNodeType.Identifier, value: `${JSON.stringify(component.HTML)}`, pos: r_stmt.nodes[0].nodes[1].pos };

            // Setup element
            class_information.methods.push(ele_create_method);
        }

        //CSS INFORMATION
        let style;

        if (INCLUDE_CSS && (style = componentDataToCSS(component)))
            re_stmts.push(stmt(`this.setCSS(\`${style}\`)`));

        if (class_information.binding_init_statements.length > 0)
            class_information.methods.push(binding_values_init_method);

        if (class_information.class_initializer_statements.length > 3)
            class_information.methods.push(register_elements_method);

        class_information.compiled_ast = component_class;

        return renderWithFormatting(class_information.compiled_ast, renderers, format_rules) + `\n/* ${component.location} */\n`;

    } catch (e) {
        console.warn(`Error found in component ${component.name} while converting to a class. location: ${component.location}.`);
        console.error(e);
        return componentDataToClassString(createErrorComponent([e], component.source, component.location + "", component), presets);
    }
}