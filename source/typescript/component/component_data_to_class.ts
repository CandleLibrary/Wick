import { MinTreeNodeType, exp, stmt } from "@candlefw/js";
import { classSelector } from "@candlefw/css";
import { traverse, renderWithFormatting, renderCompressed } from "@candlefw/conflagrate";

import Presets from "../presets.js";
import { processBindings } from "./component_process_bindings.js";
import { Component, } from "../types/types";
import { getPropertyAST, getGenericMethodNode } from "./component_js_ast_tools.js";
import { setVariableName } from "./component_set_component_variable.js";
import { rt } from "../runtime/runtime_global.js";
import { renderers, format_rules } from "../format_rules.js";
import { WickRTComponent } from "../runtime/runtime_component.js";
import parser from "../parser/parser.js";



export function buildComponentStyleSheet(component): string {

    const cloned_stylesheets = component.CSS.map(s => parser(`<style>${s}</style>`).nodes[0]);

    for (const stylesheet of cloned_stylesheets) {

        const { rules } = stylesheet.ruleset;

        for (const rule of rules) {
            let HAS_ROOT = false;

            rule.selectors = rule.selectors.map(s => s.vals.map(s => {

                switch (s.type) {
                    case "type":
                        if (s.val == "root") {
                            HAS_ROOT = true;
                            return new classSelector([null, component.name]);
                        }
                        break;
                    case "compound":
                        if (s.tag.val == "root") {
                            HAS_ROOT = true;
                            s.tag = new classSelector([null, component.name]);
                        }
                        break;
                }

                return s;
            }));

            if (!HAS_ROOT)
                rule.selectors.unshift(new classSelector([null, component.name]));
        }
    }

    return cloned_stylesheets.join("\n");
}


/**
 * Update global variables in ast after all globals have been identified
 */
function makeComponentMethod(function_block, component: Component, class_information) {
    const
        { binding_variables: variables } = component,
        used_values = new Set();

    let { ast, root_name } = function_block;


    for (const { node, meta } of traverse(ast, "nodes")
        .makeMutable()
    ) {
        const { mutate, parent } = meta;

        if (node.type == MinTreeNodeType.AssignmentExpression) {

            const [left, right] = node.nodes;

            if (left.type == MinTreeNodeType.IdentifierReference) {

                const { value } = left;

                if (variables.has(value)) {

                    const global_val = variables.get(value),
                        mutate_node = exp(`this.u${global_val.class_name}()`);

                    global_val.ASSIGNED = 1;

                    node.nodes[0] = exp(setVariableName(value, component));

                    mutate_node.nodes[1].nodes = [node];

                    if (root_name == value)
                        mutate_node.nodes[1].nodes.push(exp("1"));

                    mutate(mutate_node);

                    used_values.add(value);
                }

            } else if (left.type == MinTreeNodeType.MemberExpression) {
                if (left == MinTreeNodeType.IdentifierReference) {
                    const { value } = node;
                    if (variables.has(value)) {
                        const global_val = variables.get(value);
                        mutate(exp(setVariableName(value, component)));
                    }
                }
            }
        }

        if (node.type == MinTreeNodeType.IdentifierReference) {
            const { value } = node;

            if (variables.has(value)) {

                const global_val = variables.get(value);
                mutate(exp(setVariableName(value, component)));
            }
        }
    }

    if (function_block.type == "method")
        ast.function_type = "method";
    else
        ast.function_type = "root";

    switch (ast.function_type) {
        case "root":
            class_information.binding_init_statements.push(...ast.nodes);
            //const method = exp("({c(){a}})").nodes[0].nodes[0];
            //method.nodes[2].nodes = ast.nodes;
            //ast = method;
            break;
        default:
            class_information.methods.push(ast);
    }
}

function componentStringToClass(class_string: string, component: Component, presets: Presets) {
    return (Function("c", "p", "rt", "return " + class_string)(component, presets, rt));
}

export function componentDataToClassCached(component: Component, presets: Presets, INCLUDE_HTML: boolean = true, INCLUDE_CSS = true): WickRTComponent {

    const name = component.name;

    let comp: WickRTComponent = presets.component_class.get(name);

    if (!comp) {
        const str = componentDataToClassStringCached(component, presets, INCLUDE_HTML, INCLUDE_CSS);
        comp = componentStringToClass(str, component, presets);
        presets.component_class.set(name, comp);
    }

    return comp;
}

export function componentDataToClass(component: Component, presets: Presets, INCLUDE_HTML: boolean = true, INCLUDE_CSS = true): string {

    const class_string = componentDataToClassString(component, presets, INCLUDE_HTML, INCLUDE_CSS);

    return componentStringToClass(class_string, component, presets);
}

export function componentDataToClassStringCached(component: Component, presets: Presets, INCLUDE_HTML: boolean = true, INCLUDE_CSS = true): string {

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
            nluf_arrays: []
        };

        //Convert scripts into a class object 
        const component_class = stmt(`class ${component.name || "temp"} extends cfw.wick.Component {constructor(m,e,w){super(c,p,m,e,w,"${component.global_model || ""}");}}`);

        component_class.nodes.length = 4;

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

                lu_public_variables.nodes.push(getPropertyAST(component_variable.external_name, (component_variable.usage_flags << 24) | nlu_index));

                const nluf_array = exp(`c.u${component_variable.class_name}`);

                nluf_arrays.push(nluf_array.nodes);

                nluf_public_variables.nodes.push(nluf_array);

                public_prop_lookup[component_variable.original_name] = nlu_index;

                component_variable.nlui = nlu_index++;
            }
        }

        class_information.class_initializer_statements.push(nlu, nluf);

        //Compile scripts into methods

        for (const function_block of component.function_blocks)
            makeComponentMethod(function_block, component, class_information);

        if (component.HTML && INCLUDE_HTML) {

            const ele_create_method = getGenericMethodNode("ce", "", "return this.me(a);"),

                [, , { nodes: [r_stmt] }] = ele_create_method.nodes;

            r_stmt.nodes[0].nodes[1].nodes[0] = { type: MinTreeNodeType.Identifier, value: `${JSON.stringify(component.HTML)}` };

            //Setup element
            class_information.methods.push(ele_create_method);
        }

        let style;
        if (INCLUDE_CSS && (style = buildComponentStyleSheet(component))) {
            re_stmts.push(stmt(`this.setCSS(\`${style}\`)`));
        }

        if (class_information.binding_init_statements.length > 0)
            class_information.methods.push(binding_values_init_method);

        class_information.methods.push(register_elements_method);

        class_information.compiled_ast = component_class;

        return renderCompressed(class_information.compiled_ast, renderers);

    } catch (e) {
        console.error(
            `Error found in component ${component.name} while
    converting to a class.
    location: ${component.location}.
    `, e);
    }
}