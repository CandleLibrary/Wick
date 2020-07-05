import { MinTreeNodeType, MinTreeNode, exp, stmt } from "@candlefw/js";
import { renderWithFormatting } from "@candlefw/conflagrate";

import Presets from "../presets.js";
import { processBindings } from "./component_process_bindings.js";
import { Component, FunctionFrame, } from "../types/types";
import { getPropertyAST, getGenericMethodNode } from "./component_js_ast_tools.js";
import { setVariableName } from "./component_set_component_variable.js";
import { renderers, format_rules } from "../format_rules.js";
import { WickRTComponent } from "../runtime/runtime_component.js";
import { componentDataToCSS } from "./component_data_to_css.js";

/**
 * Update global variables in ast after all globals have been identified
 */
function makeComponentMethod(frame: FunctionFrame, component: Component, class_information) {

    const ast = frame.ast;

    for (const pack of frame.binding_ref_identifiers) {

        const { index, node, parent } = pack;

        parent.nodes[index] = exp(setVariableName(node.value, component));
    }

    if (frame.type == "method")
        ast.function_type = "method";
    else
        ast.function_type = "root";

    switch (ast.function_type) {
        case "root":
            class_information.binding_init_statements.push(...ast.nodes);
            break;
        default:
            class_information.methods.push(ast);
    }
}

function componentStringToJS(class_string: string, component: Component, presets: Presets) {
    return (Function("c", "return " + class_string)(component));
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

        const class_information = {
            binding_init_statements: [],
            class_initializer_statements: [],
            class_cleanup_statements: [],
            compiled_ast: null,
            methods: <MinTreeNode[]>[],
            nluf_arrays: []
        };

        //Convert scripts into a class object 
        const
            component_class = stmt(`class ${component.name || "temp"} extends cfw.wick.rt.C {constructor(m,e,p,w){super(m,e,p,w,"${component.global_model || ""}");}}`);

        if (!component.global_model)
            component_class.nodes.length = 2;


        class_information.methods = component_class.nodes;

        //Binding value statements Method
        const binding_values_init_method = getGenericMethodNode("c", "", ";"),

            [, , { nodes: bi_stmts }] = binding_values_init_method.nodes;

        bi_stmts.length = 0;

        class_information.binding_init_statements = bi_stmts;


        //Initializer Method
        const register_elements_method = getGenericMethodNode("re", "", "const c = this;"),

            [, , { nodes: re_stmts }] = register_elements_method.nodes;

        class_information.class_initializer_statements = re_stmts;

        //Cleanup Method
        const cleanup_element_method = getGenericMethodNode("cu", "", "const c = this;"),

            [, , { nodes: cu_stmts }] = cleanup_element_method.nodes;

        class_information.class_cleanup_statements = cu_stmts;

        processBindings(component, class_information, presets);

        /* ---------------------------------------
        * -- Create LU table for public variables
        */

        const
            public_prop_lookup = {},
            nlu = stmt("c.nlu = {};"), nluf = stmt("c.nluf = [];"),
            nluf_arrays = class_information.nluf_arrays,
            { nodes: [{ nodes: [, nluf_public_variables] }] } = nluf,
            { nodes: [{ nodes: [, lu_public_variables] }] } = nlu;

        let nlu_index = 0;

        for (const component_variable of component.binding_variables.values()) {

            if (true /* some check for component_variable property of binding*/) {

                lu_public_variables.nodes.push(
                    getPropertyAST(
                        component_variable.external_name,
                        ((component_variable.usage_flags << 24) | nlu_index) + "")
                );

                const nluf_array = exp(`c.u${component_variable.class_name}`);

                nluf_arrays.push(nluf_array.nodes);

                nluf_public_variables.nodes.push(nluf_array);

                public_prop_lookup[component_variable.original_name] = nlu_index;

                component_variable.nlui = nlu_index++;
            }
        }

        class_information.class_initializer_statements.push(nlu, nluf);

        //Compile scripts into methods

        for (const function_block of component.frames)
            makeComponentMethod(function_block, component, class_information);

        if (component.HTML && INCLUDE_HTML) {

            const ele_create_method = getGenericMethodNode("ce", "", "return this.me(a);"),

                [, , { nodes: [r_stmt] }] = ele_create_method.nodes;

            r_stmt.nodes[0].nodes[1].nodes[0] = <MinTreeNode>{ type: MinTreeNodeType.Identifier, value: `${JSON.stringify(component.HTML)}`, pos: r_stmt.nodes[0].nodes[1].pos };

            //Setup element
            class_information.methods.push(ele_create_method);
        }

        let style;

        if (INCLUDE_CSS && (style = componentDataToCSS(component))) {
            re_stmts.push(stmt(`this.setCSS(\`${style}\`)`));
        }

        if (class_information.binding_init_statements.length > 0)
            class_information.methods.push(binding_values_init_method);

        if (class_information.class_initializer_statements.length > 3)
            class_information.methods.push(register_elements_method);

        class_information.compiled_ast = component_class;

        return renderWithFormatting(class_information.compiled_ast, renderers, format_rules);

    } catch (e) {
        console.error(
            `Error found in component ${component.name} while
    converting to a class.
    location: ${component.location}.
    `, e);
    }
}