import { traverse } from "@candlefw/conflagrate";
import { matchAll } from "@candlefw/css";
import { exp, JSCallExpression, JSNode, JSNodeClass, JSNodeType, renderCompressed, stmt } from "@candlefw/js";
import { Lexer } from "@candlefw/wind";
import { getComponentBinding, getCompiledBindingVariableName, Expression_Is_Static, getStaticValue } from "../../common/binding.js";
import { getFirstReferenceName, setPos } from "../../common/common.js";
import { css_selector_helpers } from "../../common/css.js";
import { BINDING_FLAG } from "../../types/binding";
import { CompiledComponentClass } from "../../types/class_information";
import { ComponentData } from "../../types/component";
import { FunctionFrame } from "../../types/function_frame";
import { HookProcessor, HOOK_TYPE, HOOK_SELECTOR, ProcessedHook } from "../../types/hook";
import { ContainerDomLiteral, DOMLiteral, TemplateHTMLNode } from "../../types/html";
import { HTMLNode, Node, WickBindingNode } from "../../types/wick_ast";
import { postProcessFunctionDeclarationSync } from "../parse/parse.js";
import { componentDataToTempAST } from "./html.js";


export const hook_processors: HookProcessor[] = [];

function registerActivatedFrameMethod(frame: FunctionFrame, class_information: CompiledComponentClass) {
    if (!frame.index) {

        const { nodes } = class_information
            .nluf_public_variables;

        frame.index = nodes.length;

        nodes.push(setPos(exp(`c.f${frame.index}`), frame.ast.pos));
    }
}

export function loadHookProcessor(handler: HookProcessor) {
    if (/*handler_meets_prerequisite*/ true) {
        hook_processors.push(handler);
        hook_processors.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }
}

export function createHookObject(type: HOOK_TYPE, priority: number = 0, pos: Lexer): ProcessedHook {
    return <ProcessedHook>{
        DEBUG: false,
        annotate: "",
        component_variables: new Map,
        type,
        cleanup_ast: null,
        read_ast: null,
        write_ast: null,
        priority,
        pos
    };
}
/**
 * (has side effects)
 * @param function_node 
 * @param component 
 * @param presets 
 * @param class_data 
 * @returns 
 */
function addNewMethodFrame(function_node: JSNode, component: ComponentData, presets, class_data) {
    const frame = postProcessFunctionDeclarationSync(function_node, component, presets);
    class_data.frames.push(frame);
    return frame;
}

function getFrameFromName(name: string, component: ComponentData) {
    return component.frames.filter(({ name: n }) => n == name)[0] || null;
}

/**
 * Updates binding variables
 * @param root_node 
 * @param component 
 * @param hook 
 * @returns 
 */
export function setIdentifierReferenceVariables(root_node: JSNode, component: ComponentData, hook: ProcessedHook = null): JSNode {

    const receiver = { ast: null }, component_names = component.root_frame.binding_variables;

    for (const { node, meta: { replace, parent } } of traverse(root_node, "nodes")
        .makeReplaceable()
        .extract(receiver)) {

        if (node.type == JSNodeType.IdentifierReference || node.type == JSNodeType.IdentifierBinding) {

            const val = node.value;

            if (!component_names.has(<string>val))
                continue;

            replace(Object.assign({}, node, { value: getCompiledBindingVariableName(node.value, component) }));

            //Pop any binding names into the binding information container. 
            if (hook)
                setBindingVariable(<string>val, parent && parent.type == JSNodeType.MemberExpression, hook);
        }
    }

    return receiver.ast;
}


function setBindingVariable(name: string, IS_OBJECT: boolean = false, hook: ProcessedHook) {

    if (hook.component_variables.has(name)) {
        const variable = hook.component_variables.get(name);
        variable.IS_OBJECT = !!(+variable.IS_OBJECT | +IS_OBJECT);
    } else {
        hook.component_variables.set(name, {
            name,
            IS_OBJECT
        });
    }
}

/*************************************************************************************
* ██████   █████  ████████  █████      ███████ ██       ██████  ██     ██ 
* ██   ██ ██   ██    ██    ██   ██     ██      ██      ██    ██ ██     ██ 
* ██   ██ ███████    ██    ███████     █████   ██      ██    ██ ██  █  ██ 
* ██   ██ ██   ██    ██    ██   ██     ██      ██      ██    ██ ██ ███ ██ 
* ██████  ██   ██    ██    ██   ██     ██      ███████  ██████   ███ ███  
*/

loadHookProcessor({
    priority: -Infinity,

    canProcessHook(hook_selector, node_type) {
        return true;
    },

    processHook(hook_selector, hook_node
        , host_node, element_index, component) {

        const
            hook = createHookObject(HOOK_TYPE.WRITE_ONLY, 0, hook_node.pos),
            { primary_ast } = hook_node;


        if (primary_ast) {

            const
                ast = setIdentifierReferenceVariables(primary_ast, component, hook),
                expression = exp(`this.e${element_index}.setAttribute("${hook_selector}")`);

            setPos(expression, primary_ast.pos);

            expression.nodes[1].nodes.push(ast);

            hook.write_ast = expression;
        }

        return hook;
    },

    async getDefaultHTMLValue(hook, comp, presets, model) {

        const tag_name = hook.selector;

        const value = hook.hook_value;

        if (Expression_Is_Static(value, comp, presets)) {

            const static_value = await getStaticValue(hook.hook_value, comp, presets, model);

            if (static_value)
                return {
                    attributes: new Map([[tag_name, static_value + ""]])
                };
        }

        return null;
    }
});

loadHookProcessor({
    priority: -1,

    canProcessHook(hook_selector, node_type) {
        return hook_selector == HOOK_SELECTOR.IMPORT_FROM_CHILD;
    },

    processHook(hook_selector, hook_node
        , host_node, element_index, component, presets) {

        const
            hook = createHookObject(HOOK_TYPE.READONLY, 0, hook_node.pos),
            { local, extern } = hook_node,
            index = (<HTMLNode>host_node).child_id,
            child_comp = (<HTMLNode>host_node).component;

        if (child_comp) {

            const
                root = child_comp.root_frame,
                cv = root.binding_variables.get(extern);

            if (cv && cv.flags == BINDING_FLAG.ALLOW_EXPORT_TO_PARENT && component.root_frame.binding_variables.get(local)) {

                hook.read_ast = stmt(`this.ch[${index}].spm(${cv.class_index}, ${component.root_frame.binding_variables.get(local).class_index}, ${index})`);

                setPos(hook.read_ast.pos, host_node.pos);

                setBindingVariable(<string>local, false, hook);

                return hook;
            }

        } return null;
    },
    getDefaultHTMLValue(hook_node, host_node, element_index, component) { return null; }
});

loadHookProcessor({
    priority: -1,

    canProcessHook(hook_selector, node_type) {
        return hook_selector == HOOK_SELECTOR.EXPORT_TO_CHILD;
    },

    processHook(hook_selector, hook_node
        , host_node, element_index, component, presets) {

        const
            hook = createHookObject(HOOK_TYPE.WRITE, 0, hook_node.pos),
            { local, extern } = hook_node,
            index = (<HTMLNode>host_node).child_id,
            comp = (<HTMLNode>host_node).component;

        if (comp) {

            const cv = comp.root_frame.binding_variables.get(extern);

            if (cv && cv.flags & BINDING_FLAG.FROM_PARENT) {

                const comp_var = component.root_frame.binding_variables.get(<string>local);

                hook.write_ast = stmt(`this.ch[${index}].ufp(${cv.class_index}, this[${comp_var.class_index}], f);`);

                setPos(hook.write_ast, host_node.pos);

                setBindingVariable(<string>local, false, hook);
            }

            return hook;
        }
        return null;
    },
    getDefaultHTMLValue(hook_node, host_node, element_index, component) { return null; }
});

/***********************************************
 * 
 * 
 *  'on'* event handler bindings.
 * 
 */
loadHookProcessor({
    priority: -1,

    canProcessHook(hook_selector, node_type) {
        return (hook_selector.slice(0, 2) == "on");
    },

    processHook(hook_selector, hook_node
        , host_node, element_index, component, presets, class_data) {

        const
            hook = createHookObject(HOOK_TYPE.READONLY, 0, hook_node.pos),
            { primary_ast } = hook_node;

        if (primary_ast) {

            const ast = primary_ast;

            let expression = null;
            let name = null;

            if (ast.type == JSNodeType.IdentifierReference) {

                name = <string>ast.value;

                const frame = getFrameFromName(name, component);

                if (frame && frame.index)
                    name = "f" + frame.index;

                frame.ATTRIBUTE = true;
            } else {


                name = "n" + element_index;

                //Create new function method for the component
                const fn = stmt(`function ${name}(){;};`);

                //need to make sure the 

                fn.nodes[2].nodes = [{
                    type: JSNodeType.ExpressionStatement,
                    nodes: [ast],
                    pos: ast.pos
                }];

                const frame = addNewMethodFrame(fn, component, presets, class_data);
            }

            expression = stmt(`this.e${element_index}.addEventListener("${hook_selector.slice(2)}",this.${name}.bind(this));`);

            setPos(expression, primary_ast.pos);

            hook.read_ast = expression;

            hook.cleanup_ast = null;
        }

        return hook;
    },
    getDefaultHTMLValue(hook_node, host_node, element_index, component) { return null; }
});


loadHookProcessor({
    priority: 2,

    canProcessHook(hook_selector, node_type) {
        return (hook_selector.slice(0, 2) == "on" && hook_selector.slice(-7) == "_window");
    },

    processHook(hook_selector, hook_node
        , host_node, element_index, component, presets, class_data) {

        const
            hook = createHookObject(HOOK_TYPE.READONLY, 0, hook_node.pos),
            { primary_ast } = hook_node;

        if (primary_ast) {

            const ast = primary_ast;

            let expression = null;
            let name = null;

            if (ast.type == JSNodeType.IdentifierReference) {

                name = <string>ast.value;

                const frame = getFrameFromName(name, component);

                if (frame && frame.index)
                    name = "f" + frame.index;

                frame.ATTRIBUTE = true;
            } else {

                name = "n" + element_index;

                //Create new function method for the component
                const fn = stmt(`function ${name}(){;};`);

                //need to make sure the 

                fn.nodes[2].nodes = [{
                    type: JSNodeType.ExpressionStatement,
                    nodes: [ast],
                    pos: ast.pos
                }];

                const frame = addNewMethodFrame(fn, component, presets, class_data);
            }

            expression = stmt(`window.addEventListener("${hook_selector.slice(2, -7)}",this.${name}.bind(this));`);

            setPos(expression, primary_ast.pos);

            hook.read_ast = expression;

            hook.cleanup_ast = null;
        }

        return hook;
    },
    getDefaultHTMLValue(hook_node, host_node, element_index, component) { return null; }
});

/***********************************************
███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████ 
██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██      
█████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██ 
██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████                                              
 * 
 * 
 *  Bound function activation bindings.
 * 
 */
loadHookProcessor({
    priority: -1,

    canProcessHook(hook_selector, node_type) {
        return hook_selector == HOOK_SELECTOR.WATCHED_FRAME_METHOD_CALL;
    },

    processHook(hook_selector, hook_node
        , host_node, element_index, component, presets, class_data) {

        const
            [, { nodes: [frame_id, ...other_id] }] = hook_node.nodes,
            frame = getFrameFromName(frame_id.value, component),
            hook = createHookObject(HOOK_TYPE.READ_WRITE, 0, hook_node.pos);

        if (!frame) frame_id.pos.throw(`Cannot find function for reference ${frame_id.value}`);

        if (frame.ATTRIBUTE) return null;

        for (const id of other_id) setBindingVariable(<string>id.value, false, hook);

        for (const id of frame.input_names) setBindingVariable(id, false, hook);

        registerActivatedFrameMethod(frame, class_data);

        hook.write_ast = exp(`this.call(${frame.index})`);

        setPos(hook.write_ast, hook_node.pos);

        return hook;
    },
    getDefaultHTMLValue(hook_node, host_node, element_index, component) { return null; }
});

loadHookProcessor({

    priority: -2,

    canProcessHook(hook_selector, node_type) {
        return hook_selector == HOOK_SELECTOR.METHOD_CALL;
    },

    processHook(hook_selector, hook_node
        , host_node, element_index, component) {

        const hook = createHookObject(HOOK_TYPE.WRITE_ONLY, 0, <any>host_node.pos),
            { primary_ast } = hook_node;

        const receiver = { ast: null }, component_names = component.root_frame.binding_variables;

        for (const { node, meta: { replace, parent } } of traverse(host_node, "nodes")
            .makeReplaceable()
            .extract(receiver)) {

            if (node.type == JSNodeType.CallExpression) {
                const name = getFirstReferenceName(node);
                const frame = getFrameFromName(name, component);
                if (frame) {

                    for (const input of frame.input_names.values()) {
                        if (component_names.has(<string>input))
                            setBindingVariable(<string>input, false, hook);
                    }
                }
            }

            if (node.type == JSNodeType.IdentifierReference || node.type == JSNodeType.IdentifierBinding) {

                const val = node.value;

                if (!component_names.has(<string>val))
                    continue;

                replace(Object.assign({}, node, { value: getCompiledBindingVariableName(node.value, component) }));

                //Pop any binding names into the binding information container. 
                setBindingVariable(<string>val, parent && parent.type == JSNodeType.MemberExpression, hook);
            }
        }

        setIdentifierReferenceVariables(<JSNode>host_node, component, hook);
        hook.write_ast = setPos(primary_ast, host_node.pos);


        return hook;
    },
    getDefaultHTMLValue(hook_node, host_node, element_index, component) { return null; }
});

loadHookProcessor({
    priority: 0,

    canProcessHook(hook_selector, node_type) {
        return hook_selector == HOOK_SELECTOR.INPUT_VALUE;
    },

    processHook(hook_selector, hook_node
        , host_node, element_index, component) {

        const hook = createHookObject(HOOK_TYPE.READ_WRITE, 0, hook_node.pos),
            { primary_ast } = hook_node;

        if (primary_ast) {

            const ast = setIdentifierReferenceVariables(primary_ast, component, hook);

            //Pop any binding names into the binding information container. 

            hook.write_ast = setPos(
                exp(`this.e${element_index}.value = 1`),
                primary_ast.pos
            );

            hook.read_ast = setPos(
                exp(`this.e${element_index}.value = 1`),
                primary_ast.pos
            );

            hook.read_ast.nodes[1] = ast;

            hook.write_ast.nodes[1] = ast;

            hook.cleanup_ast = null;

            if (primary_ast.type == JSNodeType.IdentifierReference) {
                let name = <string>primary_ast.value;
                const frame = getFrameFromName(name, component);
                if (frame) {
                    if (frame && frame.index) name = "f" + frame.index;

                    hook.initialize_ast = setPos(
                        stmt(`this.e${element_index}.addEventListener("input",this.$${name}.bind(this));`),
                        primary_ast.pos
                    );
                } else {

                    const
                        { class_index } = getComponentBinding(name, component),
                        exprA = hook.write_ast,
                        exprB = exp(`this.e${element_index}.addEventListener("input",e=>{${renderCompressed(ast)}= e.target.value; this.ua(${class_index})})`);


                    hook.initialize_ast = setPos(
                        exprB,
                        primary_ast.pos
                    );
                }
            }
        }

        return hook;
    },
    getDefaultHTMLValue(hook_node, host_node, element_index, component) { return null; }
});
/**********************
 * 
 * Inline text bindings 
 * 
 */
loadHookProcessor({
    priority: -2,

    canProcessHook(hook_selector, node_type) {
        return !hook_selector;
    },

    processHook(hook_selector, hook_node
        , host_node, element_index, component) {

        const hook = createHookObject(HOOK_TYPE.WRITE_ONLY, 0, hook_node.pos),
            component_names = component.root_frame.binding_variables,
            { primary_ast, secondary_ast } = hook_node;

        if (primary_ast) {

            const
                ast = setIdentifierReferenceVariables(primary_ast, component, hook),
                expression = exp("a=b");

            expression.nodes[0] = <any>exp(`this.e${element_index}.data`);

            expression.nodes[1] = ast;

            setPos(expression, primary_ast.pos);

            hook.write_ast = expression;
        }

        return hook;
    },
    getDefaultHTMLValue(hook, component, presets, model) {
        return null;
    }
});

/*********************************************
 *  ██████  ██████  ███    ██ ████████  █████  ██ ███    ██ ███████ ██████  
 * ██      ██    ██ ████   ██    ██    ██   ██ ██ ████   ██ ██      ██   ██ 
 * ██      ██    ██ ██ ██  ██    ██    ███████ ██ ██ ██  ██ █████   ██████  
 * ██      ██    ██ ██  ██ ██    ██    ██   ██ ██ ██  ██ ██ ██      ██   ██ 
 *  ██████  ██████  ██   ████    ██    ██   ██ ██ ██   ████ ███████ ██   ██ 
 */

// container_data
loadHookProcessor({

    priority: 100,

    canProcessHook: (hook_selector, node_type) => hook_selector == "data",

    processHook(hook_selector, hook_node
        , host_node, element_index, component, presets) {

        if (!getElementAtIndex(component, element_index).is_container) return;

        const

            container_id = getElementAtIndex(component, element_index).container_id,

            hook = createHookObject(HOOK_TYPE.WRITE_ONLY, 0, hook_node.pos),

            { primary_ast } = hook_node;

        if (primary_ast) {

            const

                ast = setIdentifierReferenceVariables(primary_ast, component, hook),

                expression = exp(`this.ct[${container_id}].sd(0)`);

            setPos(expression, primary_ast.pos);

            expression.nodes[1].nodes = [ast];

            hook.write_ast = expression;
        }

        return hook;
    },

    async getDefaultHTMLValue(hook, component, presets, model, parent_component) {

        const node: TemplateHTMLNode = {
            children: []
        };

        const html: ContainerDomLiteral = <any>getElementAtIndex(component, hook.html_element_index);

        if (
            Expression_Is_Static(hook.hook_value, component, presets)
            &&
            html.component_names.length > 0
        ) {

            const

                comp_name = html.component_names[0],

                child_comp = presets.components.get(comp_name),

                models = await getStaticValue(hook.hook_value, component, presets, model, parent_component);

               
            if (models && child_comp) {

                for (const model of models) {

                    const result = await componentDataToTempAST(child_comp, presets, model);

                    node.children.push(result.html[0]);
                }
            }
        }

        return node;
    }
});

// container_data
loadHookProcessor({
    priority: 100,

    canProcessHook: (hook_selector, node_type) => hook_selector == "filter",

    processHook(hook_selector, hook_node
        , host_node, element_index, component, presets) {

        if (!getElementAtIndex(component, element_index).is_container) return;

        const hook = createHookObject(HOOK_TYPE.READ_WRITE, 1000, hook_node.pos),
            component_names = component.root_frame.binding_variables,
            { primary_ast, secondary_ast } = hook_node
            ;

        if (primary_ast) {

            const
                ast = setIdentifierReferenceVariables(primary_ast, component, hook),
                expression = setPos(exp(`m1 => (1)`), primary_ast.pos);

            expression.nodes[1] = ast;

            setPos(expression, primary_ast.pos);

            const stmt_ = setPos(stmt(`this.ct[${(<HTMLNode>host_node).container_id}].filter = a`), primary_ast.pos);

            stmt_.nodes[0].nodes[1] = expression;

            hook.read_ast = stmt_;

            hook.write_ast = exp(`this.ct[${(<HTMLNode>host_node).container_id}].filterExpressionUpdate()`);
        }

        return hook;
    },
    getDefaultHTMLValue(hook_node, host_node, element_index, component) { return null; }
});

loadHookProcessor({
    priority: 100,

    canProcessHook: (hook_selector, node_type) => hook_selector == "limit",

    processHook(hook_selector, hook_node
        , host_node, element_index, component, presets) {

        if (!getElementAtIndex(component, element_index).is_container) return;

        const
            container_id = getElementAtIndex(component, element_index).container_id,
            hook = createHookObject(HOOK_TYPE.READ_WRITE, 1000, hook_node.pos),
            { primary_ast, secondary_ast } = hook_node;

        if (primary_ast) {

            if (primary_ast.type == JSNodeType.NumericLiteral) {
                hook.read_ast = stmt(`this.ct[${container_id}].updateLimit(${primary_ast.value})`);
            } else if (primary_ast.type & (JSNodeClass.EXPRESSION | JSNodeClass.IDENTIFIER)) {

                const
                    ast = setIdentifierReferenceVariables(primary_ast, component, hook),
                    stmt_ = <JSCallExpression>setPos(stmt(`this.ct[${container_id}].updateLimit(a)`), primary_ast.pos);

                stmt_.nodes[0].nodes[1].nodes[0] = <any>ast;

                hook.write_ast = stmt_;
            }
        }

        return hook;
    },
    getDefaultHTMLValue(hook_node, host_node, element_index, component) { return null; }
});

loadHookProcessor({
    priority: 100,

    canProcessHook: (hook_selector, node_type) => hook_selector == "sort",

    processHook(hook_selector, hook_node
        , host_node, element_index, component, presets) {

        if (!getElementAtIndex(component, element_index).is_container) return;

        const
            container_id = getElementAtIndex(component, element_index).container_id,
            hook = createHookObject(HOOK_TYPE.READ_WRITE, 1000, hook_node.pos),
            { primary_ast, secondary_ast } = hook_node;

        if (primary_ast) {

            if (primary_ast.type == JSNodeType.NumericLiteral) {
                hook.read_ast = stmt(`this.ct[${container_id}].updateLimit(${primary_ast.value})`);
            } else if (primary_ast.type & (JSNodeClass.EXPRESSION | JSNodeClass.IDENTIFIER)) {

                const
                    ast = setIdentifierReferenceVariables(primary_ast, component, hook),
                    stmt_ = <JSCallExpression>setPos(stmt(`this.ct[${container_id}].updateLimit(a)`), primary_ast.pos);

                stmt_.nodes[0].nodes[1].nodes[0] = <any>ast;

                hook.write_ast = stmt_;
            }
        }

        return hook;
    },
    getDefaultHTMLValue(hook_node, host_node, element_index, component) { return null; }
});

loadHookProcessor({
    priority: 100,

    canProcessHook: (hook_selector, node_type) => hook_selector == "scrub",

    processHook(hook_selector, hook_node
        , host_node, element_index, component, presets) {

        if (!getElementAtIndex(component, element_index).is_container) return;

        const
            container_id = getElementAtIndex(component, element_index).container_id,
            hook = createHookObject(HOOK_TYPE.READ_WRITE, 1000, hook_node.pos),
            { primary_ast, secondary_ast } = hook_node;

        if (primary_ast) {

            if (primary_ast.type == JSNodeType.NumericLiteral) {
                hook.read_ast = stmt(`this.ct[${container_id}].updateScrub(${primary_ast.value})`);
            } else if (primary_ast.type & (JSNodeClass.EXPRESSION | JSNodeClass.IDENTIFIER)) {

                const
                    ast = setIdentifierReferenceVariables(primary_ast, component, hook),
                    stmt_ = <JSCallExpression>setPos(stmt(`this.ct[${container_id}].updateScrub(a)`), primary_ast.pos);

                stmt_.nodes[0].nodes[1].nodes[0] = <any>ast;

                hook.write_ast = stmt_;
            }
        }

        return hook;
    },
    getDefaultHTMLValue(hook_node, host_node, element_index, component) { return null; }
});

loadHookProcessor({
    priority: 100,

    canProcessHook: (hook_selector, node_type) => hook_selector == "shift",

    processHook(hook_selector, hook_node
        , host_node, element_index, component, presets) {

        if (!getElementAtIndex(component, element_index).is_container) return;

        const
            container_id = getElementAtIndex(component, element_index).container_id,
            hook = createHookObject(HOOK_TYPE.READ_WRITE, 1000, hook_node.pos),
            { primary_ast, secondary_ast } = hook_node;

        if (primary_ast) {

            if (primary_ast.type == JSNodeType.NumericLiteral) {
                hook.read_ast = stmt(`this.ct[${container_id}].updateShift(${primary_ast.value})`);
            } else if (primary_ast.type & JSNodeClass.EXPRESSION | JSNodeClass.IDENTIFIER) {

                const
                    ast = setIdentifierReferenceVariables(primary_ast, component, hook),
                    stmt_ = <JSCallExpression>setPos(stmt(`this.ct[${container_id}].updateShift(a)`), primary_ast.pos);

                stmt_.nodes[0].nodes[1].nodes[0] = <any>ast;

                hook.write_ast = stmt_;
            }
        }

        return hook;
    },
    getDefaultHTMLValue(hook_node, host_node, element_index, component) { return null; }
});

loadHookProcessor({
    priority: 100,

    canProcessHook: (hook_selector, node_type) => hook_selector == "offset",

    processHook(hook_selector, hook_node
        , host_node, element_index, component, presets) {

        if (!getElementAtIndex(component, element_index).is_container) return;

        const
            container_id = getElementAtIndex(component, element_index).container_id,
            hook = createHookObject(HOOK_TYPE.READ_WRITE, 1000, hook_node.pos),
            { primary_ast, secondary_ast } = hook_node;

        if (primary_ast) {

            if (primary_ast.type == JSNodeType.NumericLiteral) {
                hook.read_ast = stmt(`this.ct[${container_id}].updateOffset(${primary_ast.value})`);
            } else if (primary_ast.type & (JSNodeClass.EXPRESSION | JSNodeClass.IDENTIFIER)) {

                const
                    ast = setIdentifierReferenceVariables(primary_ast, component, hook),
                    stmt_ = <JSCallExpression>setPos(stmt(`this.ct[${container_id}].updateOffset(a)`), primary_ast.pos);

                stmt_.nodes[0].nodes[1].nodes[0] = <any>ast;

                hook.write_ast = stmt_;
            }
        }

        return hook;
    },
    getDefaultHTMLValue(hook_node, host_node, element_index, component) { return null; }
});

// Usage selectors
loadHookProcessor({

    priority: -1,

    canProcessHook: (hook_selector, node_type) => hook_selector == HOOK_SELECTOR.CONTAINER_USE_IF,

    processHook(hook_selector, hook_node
        , host_node, element_index, component, presets) {

        const
            hook = createHookObject(HOOK_TYPE.READONLY, 100, hook_node.pos),
            component_names = component.root_frame.binding_variables,
            { primary_ast } = hook_node;

        if (primary_ast) {

            const
                ast = setIdentifierReferenceVariables(primary_ast, component, hook),
                expression = exp(`m1 => (1)`);

            expression.nodes[1] = ast;

            setPos(expression, primary_ast.pos);

            const stmt_ = stmt(`this.ct[${(<HTMLNode>host_node).container_id}].addEvaluator(a)`);

            stmt_.nodes[0].nodes[1].nodes[0] = expression;

            hook.read_ast = stmt_;
        }

        return hook;
    },

    getDefaultHTMLValue(hook_node, host_node, element_index, component) { return null; }
});


loadHookProcessor({
    priority: 100,

    canProcessHook(hook_selector, node_type) {
        return hook_selector == HOOK_SELECTOR.ELEMENT_SELECTOR_STRING;
    },

    processHook(hook_selector, pending_hook_node, host_node, element_index, component, presets) {
        const css_selector = <string>pending_hook_node.value.slice(1); //remove "@"

        let html_nodes = null, index = host_node.nodes.indexOf(pending_hook_node);

        switch (css_selector) {

            case "ctx3D":
                html_nodes = matchAll<DOMLiteral>("canvas", component.HTML, css_selector_helpers)[0];

                if (html_nodes) {
                    const expression = exp(`this.elu[${html_nodes.lookup_index}].getContext("3d")`);
                    setPos(expression, host_node.pos);
                    (<JSNode><unknown>host_node).nodes[index] = expression;
                }
                break;

            case "ctx2D":
                html_nodes = matchAll<DOMLiteral>("canvas", component.HTML, css_selector_helpers)[0];

                if (html_nodes) {
                    const expression = exp(`this.elu[${html_nodes.lookup_index}].getContext("2d")`);
                    setPos(expression, host_node.pos);
                    (<JSNode><unknown>host_node).nodes[index] = expression;
                }
                break;

            default:
                html_nodes = matchAll<DOMLiteral>(css_selector, component.HTML, css_selector_helpers);

                if (html_nodes.length > 0) {

                    const expression = (html_nodes.length == 1)
                        ? exp(`this.elu[${html_nodes[0].lookup_index}]; `)
                        : exp(`[${html_nodes.map(e => `this.elu[${e.lookup_index}]`).join(",")}]`);

                    setPos(expression, host_node.pos);

                    (<JSNode><unknown>host_node).nodes[index] = expression;
                }
        }

        return null;
    },
    getDefaultHTMLValue(hook_node, host_node, element_index, component) { return null; }
});

function getElementAtIndex(comp: ComponentData, index: number, node: DOMLiteral = comp.HTML, counter = { i: 0 }): DOMLiteral {

    if (index == node.element_index) return node;

    //if (!node.data)
    //counter.i++;

    if (node.children) for (const child of node.children) {
        let out = null;
        if ((out = getElementAtIndex(comp, index, child, counter))) return out;
    }

    return null;
};
