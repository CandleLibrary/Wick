import { JSNodeType, JSNode, exp, stmt } from "@candlefw/js";
import { copy, createSourceMap, createSourceMapJSON } from "@candlefw/conflagrate";

import Presets from "../presets.js";
import { processBindings } from "./component_process_bindings.js";
import { ComponentClassStrings } from "../types/component_class_strings";
import { VARIABLE_REFERENCE_TYPE } from "../types/variable_reference_types";
import { FunctionFrame } from "../types/function_frame";
import { ComponentData } from "../types/component_data";
import { getPropertyAST, getGenericMethodNode } from "./component_js_ast_tools.js";
import { getComponentVariableName } from "./component_set_component_variable.js";
import { WickRTComponent } from "../runtime/runtime_component.js";
import { componentDataToCSS } from "./component_data_to_css.js";
import { createErrorComponent } from "./component_create_component.js";
import { renderWithFormattingAndSourceMap, renderWithFormatting } from "../render/render.js";
import { setPos } from "./component_common.js";
import { DOMLiteral } from "../wick.js";

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
 * Update global variables in ast after all globals have been identified
 */
function makeComponentMethod(frame: FunctionFrame, component: ComponentData, class_information) {

    const ast = frame.ast;

    //registerActivatedFrameMethod(frame, class_information);

    if (ast) {


        const updated_names = new Set();

        for (const { index, node: { pos, value: name }, parent } of frame.binding_ref_identifiers) {
            if (!component.root_frame.binding_type.has(<string>name))
                throw pos.errorMessage(`Undefined reference to ${name}`);

            const id = exp(getComponentVariableName(name, component));

            parent.nodes[index] = setPos(id, pos);
        }


        const cpy = copy(ast);

        cpy.type = JSNodeType.Method;

        if (!frame.IS_ROOT) {

            let id_indices = [];


            for (const name of frame.output_names.values())
                if (!updated_names.has(name)) {

                    const { type, class_index, pos }
                        = component.root_frame.binding_type.get(name);

                    if (type == VARIABLE_REFERENCE_TYPE.INTERNAL_VARIABLE)
                        id_indices.push(class_index);
                }

            const st = stmt(`this.u(${frame.name[0] == "$" ? "0,c," : "0,0,"} ${id_indices.sort()});`);

            cpy.nodes[2].nodes.push(setPos(st, frame.ast.pos));

            if (frame.index != undefined)
                cpy.nodes[0].value = `f${frame.index}`;

            cpy.function_type = "method";
        } else
            cpy.function_type = "root";

        switch (frame.IS_ROOT) {
            case true:
                class_information.binding_init_statements.push(...cpy.nodes.filter(n => n.type != JSNodeType.EmptyStatement));
                break;
            default:
                class_information.methods.push(cpy);
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
    INCLUDE_CSS = true
): typeof WickRTComponent {

    const class_string = componentDataToClassString(component, presets, INCLUDE_HTML, INCLUDE_CSS);

    return componentStringToJS(class_string, component, presets);
}

export function componentDataToJSStringCached(
    component: ComponentData,
    presets: Presets,
    INCLUDE_HTML: boolean = true,
    INCLUDE_CSS = true
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
    INCLUDE_CSS = true
): ComponentClassStrings {

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

        let HAVE_LU_DATA = false;

        if (!component.global_model)
            component_class.nodes.length = 2;

        re_stmts.length = 0;
        bi_stmts.length = 0;

        //Javascript Information.
        if (component.HAS_ERRORS === false && component.root_frame) {

            //setPos(component_class, component.root_frame.ast.pos);

            const
                cleanup_element_method = getGenericMethodNode("cu", "", "const c = this;"),
                [, , { nodes: cu_stmts }] = cleanup_element_method.nodes,
                public_prop_lookup = {},
                nlu = stmt("c.nlu = {};"), nluf = stmt("c.lookup_function_table = [];"),
                { nodes: [{ nodes: [, lu_functions] }] } = nluf,
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

                lu_functions.nodes.push(nluf_array);

                public_prop_lookup[internal_name] = nlu_index;

                HAVE_LU_DATA = true;

                class_information.nlu_index++;
            }

            class_information.nluf_public_variables = lu_functions;

            processBindings(component, class_information, presets);

            class_information.class_initializer_statements.unshift(nlu, nluf);

            for (const function_block of component.frames) {
                makeComponentMethod(function_block, component, class_information);
            }
        }

        //HTML INFORMATION
        if (component.HTML && INCLUDE_HTML) {

            const ele_create_method = setPos(getGenericMethodNode("ce", "", "return this.me(a);"), component.HTML.pos),

                [, , { nodes: [r_stmt] }] = ele_create_method.nodes;

            r_stmt.nodes[0].nodes[1].nodes[0] = DOMLiteralToJSNode(component.HTML);

            // Setup element
            class_information.methods.push(ele_create_method);
        }

        //CSS INFORMATION
        let style;

        if (INCLUDE_CSS && (style = componentDataToCSS(component))) {
            re_stmts.push(stmt(`this.setCSS()`));
            class_information.methods.push(setPos(getGenericMethodNode("getCSS", "", `return \`${style}\`;`), component.CSS[0].pos));
        }

        if (class_information.binding_init_statements.length > 0)
            class_information.methods.push(binding_values_init_method);

        if (class_information.class_initializer_statements.length > 2 || HAVE_LU_DATA)
            class_information.methods.push(register_elements_method);

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

        return { class_string: cl + `\n/* ${component.location} */\n`, source_map: sm };

    } catch (e) {
        console.warn(`Error found in component ${component.name} while converting to a class. location: ${component.location}.`);
        console.error(e);
        return componentDataToClassString(createErrorComponent([e], component.source, component.location + "", component), presets);
    }
}

function sanitizeString(str: string) {
    return str.replace(/\n/g, "\\n").replace(/"/g, `\\"`);
}

function propLiteral(name: string, val: any) {
    return exp(`({${name}:${val}})`).nodes[0].nodes[0];
}

function propString(name: string, val: string) {
    return exp(`({${name}:"${sanitizeString(val)}"})`).nodes[0].nodes[0];
}

function propArray(name: string, children) {
    const d = exp(`({${name}:[]})`).nodes[0].nodes[0];
    d.nodes[1].nodes = children;
    return d;
}

function DOMAttributeToJSNode([key, val]: [string, string]) {
    return {
        type: JSNodeType.ArrayLiteral,
        nodes: [
            { type: JSNodeType.StringLiteral, quote_type: "\"", value: key },
            { type: JSNodeType.StringLiteral, quote_type: "\"", value: val ? sanitizeString(val) : "" }
        ]
    };
};


function DOMLiteralToJSNode(node: DOMLiteral): JSNode {

    //  console.log(node);
    const out = {
        type: JSNodeType.ObjectLiteral,
        nodes: [propLiteral("lookup_index", node.lookup_index),],
        pos: node.pos
    };

    if (!node.tag_name)
        out.nodes.push(propString("data", node.data || ""));
    else
        out.nodes.push(propString("tag_name", node.tag_name));

    if (node.children)
        out.nodes.push(propArray("children", node.children.map(DOMLiteralToJSNode)));

    if (node.attributes)
        out.nodes.push(propArray("attributes", node.attributes.map(DOMAttributeToJSNode)));

    if (node.is_container)
        out.nodes.push(propLiteral("is_container", true));

    if (node.component_name)
        out.nodes.push(propString("component_name", node.component_name));

    if (node.component_names)
        out.nodes.push(propArray("component_names", node.component_names.map(n => exp(`"${n}"`))));

    if (node.component_attribs)
        out.nodes.push(propArray("component_attribs", node.component_attribs.map(DOMAttributeToJSNode)));

    if (node.namespace_id)
        out.nodes.push(propLiteral("component_name", node.namespace_id));


    return out;
    <JSNode>{ type: JSNodeType.Identifier, value: `${JSON.stringify(component.HTML)}`, pos: component.HTML.pos };
}