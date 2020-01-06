import { EventIO, InputIO, ContainerLinkIO } from "../compiler/component/io/io.js";
import ScriptIO from "../compiler/component/io/script_io.js";
import { Tap } from "../compiler/component/tap/tap.js";

import { assignment_expression, types, identifier, member_expression, call_expression, string, parenthasized, this_literal, expression_list, parse as JSParse } from "@candlefw/js";

import insertData from "./insert_data.js";
import getContainer from "./get_container.js";
import { setContainerSortFN } from "./get_container.js";
import getElement from "./get_element.js";

import tools from "../compiler/js/tools.js";

/* Returns the first expression statment node in the resultant ast of the parse tree of string argument. */
function buildExpression(string) {
    const js_ast = JSParse(string);
    return js_ast.vals[0];
}

/* Should return a deep of the ast node */
function cloneAST(ast) {
    console.log(JSParse(ast.render()).vals[0].vals[0].connect, ast)
    return JSParse(ast.render()).vals[0].vals[0].connect;
}

function createIONode(io, ctx, obj = { args: new Set, expr: [], type: 0 }) {
    const expr = obj.expr;

    switch (io.type) {
        case "ContainerIO":

            const ctr = getContainer(io.container, ctx.containers, ctx.mapped_elements);

            if (!obj.type)
                obj.type = 12;

            let action = "",
                name_length = 0;

            switch (io.filter_type) {
                case "sort":
                    action = io.script.ast;
                    expr.push(buildExpression(`this.wl.ctr_fltr(this.${ctr}, "so")`));
                    name_length = 2;
                    break;
                case "filter":
                    action = io.script.ast;
                    expr.push(buildExpression(`this.wl.ctr_fltr(this.${ctr}, "fi")`));
                    name_length = 1;
                    break;
                case "scrub":
                    expr.push(buildExpression(`this.wl.ctr_fltr(this.${ctr}, "sc", ${io.script.ast.render()})`));
                    break;
                case "offset":
                    expr.push(buildExpression(`this.wl.ctr_fltr(this.${ctr}, "of", ${io.script.ast.render()})`));
                    break;
                case "limit":
                    expr.push(buildExpression(`this.wl.ctr_fltr(this.${ctr}, "li", ${io.script.ast.render()})`));
                    break;
                case "shift_amount":
                    expr.push(buildExpression(`this.wl.ctr_fltr(this.${ctr}, "sa", ${io.script.ast.render()})`));
                    break;
            }

            const arg_names = [];
            let i = 0;

            for (const arg_name in io.arg_ios)
                if (i++ < name_length)
                    arg_names.push(arg_name);
                else
                    obj.args.add(arg_name);

            if (name_length > 0) {
                tools.getClosureVariableNames(action, ...arg_names).forEach(e => {
                    e.replace(new member_expression(new this_literal, e));
                });

                action = JSParse(`((${arg_names})=>${action.expr}).bind(this)`).vals[0].vals[0];
            }

            if (io.parent)
                obj.args.add(io.parent.prop);

            if (io.filter_type == "filter")
                setContainerSortFN(io.container, ctx.containers, "filter", action);
            if (io.filter_type == "sort")
                setContainerSortFN(io.container, ctx.containers, "sort", action);

            break;
        case "ScriptIO":
        case "ExpressionIO":
            if (!obj.type)
                obj.type = 12;

            const ast = (io.script.ast.type == 47) ? cloneAST(io.script.ast.expr) : cloneAST(io.script.ast);

            tools.getClosureVariableNames(ast).forEach(e => {
                e.replace(new member_expression(new this_literal, e));
            });

            if (expr.length > 0) {
                const last = expr.length - 1,
                    assign = new assignment_expression([null, "=", null]);
                assign.vals[0] = expr[last].vals[0]; // Extract expression from expression statement
                expr[last].vals[0] = assign;


                //replace the last expression with an assignment expression
                if (io.script.ast.type == 47) {
                    assign.vals[1] = ast;
                } else {
                    assign.vals[1] = ast;
                }

                for (const arg_name in io.arg_ios) {
                    obj.args.add(arg_name);
                    //const arg = io.io.arg_ios[arg_name];
                    //str = createIONode(createIONode(arg), str)
                }
            } else {
                expr.push(ast);
            }

            if (io.parent)
                obj.args.add(io.parent.prop);
            break;
        case "EventIO":
            obj.args.add(io.up_tap.prop);
            obj.type = 2;
            expr.push(buildExpression(`this.emit("${io.up_tap.prop}", this.${io.parent.prop});`));

            if (!(io.parent instanceof Tap))
                createIONode(io.parent, ctx, obj);

            obj.event = io.event_name;
            obj.ele = io.ele;
            //expr.push(`${obj.str}`);
            break;
        case "InputIO":
            //obj.args.add(io.up_tap.prop);
            obj.type = 1;
            expr.push(buildExpression(`this.emit("${io.up_tap.prop}", e.target.value);`));

            if (!(io.parent instanceof Tap))
                createIONode(io.parent, ctx, obj);

            obj.event = "input";
            obj.ele = io.ele;
            //expr.push(`${obj.str}`);
            break;
        case "ContainerLinkIO":
            if (!obj.type) obj.type = 12;

            const ctr_expr = buildExpression(`this.w.ctr_upd(this.${getContainer(io.ele, ctx.containers, ctx.mapped_elements)})`);

            expr.push(ctr_expr);

            if (!(io.parent instanceof Tap)) {
                return createIONode(io.parent, ctx, obj);
            } else {
                const last = expr.length - 1;
                expr[last].expression.args.vals.push(buildExpression("this." + io.parent.prop).expression);
            }

            obj.args.add(io.parent.prop);
            break;
        default:
            if (io.ele instanceof Element) {
                if (!obj.type) obj.type = 12;
                expr.push(buildExpression(`this.${getElement(io.ele, ctx.mapped_elements)}.${io.attrib}`));
            } else if (io.ele instanceof Text) {
                if (!obj.type) obj.type = 12;
                expr.push(buildExpression(`this.${getElement(io.ele, ctx.mapped_elements)}.innerHTML`));
            } else {
                if (!obj.type) obj.type = 12;
                obj.args.add(io.parent.prop);
            }

            if (!(io.parent instanceof Tap)) {
                return createIONode(io.parent, ctx, obj);
            } else {
                const last = expr.length - 1,
                    assign = new assignment_expression([null, "=", null]);
                assign.vals[0] = expr[last].vals[0]; // Extract expression from expression statement
                expr[last].vals[0] = assign;
                assign.vals[1] = buildExpression("this." + io.parent.prop).expression;
            }

            obj.args.add(io.parent.prop);
            break;
    }
    return obj;
}

/* Converts IO object hiearchies into self contained nodes with js ast structures defining the io logic. */
export default function(io, ctx) {

    const node = createIONode(io, ctx);

    node.expr = new expression_list([node.expr]);

    console.log(node.expr.render());


    return node;
}