import lite from "../lite/lite.js";
import insertData from "./insert_data.js";
import getContainer from "./get_container.js";
import getElement from "./get_element.js";
import buildIO from "./build_io.js";
import { statements, class_declaration, assignment_expression, types, identifier, member_expression, call_expression, string, parenthasized, this_literal, expression_list, parse as JSParse } from "@candlefw/js";

function replaceDataPoints(ast, dps) {
    const tvrs = ast.traverseDepthFirst();
    let node = null;

    while ((node = tvrs.next().value)) {
        if (
            node.type == types.identifier &&
            node.parent &&
            node.parent.type == types.member_expression &&
            node.parent.id.type == types.this_literal
        ) {
            console.log(node.name)
            if (dps.has(node.name)) {
                const dp = dps.get(node.name);
                node.replace(JSParse(`uc[${dp.id}]`).vals[0].vals[0]);
                // /debugger 
            }
        }
    };

    return ast;
}

function getCondition(condition, conditions) {
    if (conditions.has(condition))
        return conditions.get(condition);

    conditions.set(condition, 1 << conditions.size);

    return getCondition(condition, conditions);
}

function createGate(conditions, str, condition_map, flag_name = "f") {
    const val = [...conditions.values()].map(c => getCondition(c, condition_map)).reduce((r, v) => r | v, 0);
    if (val == 0)
        return str;
    return `if((${flag_name} & ${val}) == ${val}){${str}}`;
}

export default function stamp(ast) {

    const scope = ast.mount(null),
        mapped_elements = new Map(),
        containers = new Map(),
        data_points = new Map(),
        actions = [],
        output_ast = JSParse("class component extends wick.sc {constructor(e,w){super(e);;} destroy(){;;}}").vals[0];

    //pull out tap and io data and build a dependency graph
    let dp_offset = 0;

    for (const io of scope.ios) {
        const ele = buildIO(io, { mapped_elements, containers });

        let flag = 0;

        for (const dp of ele.args.values()) {
            if (!data_points.has(dp))
                data_points.set(dp, { flag: 1 << (dp_offset), name: dp, id: dp_offset++ });
            flag |= data_points.get(dp).flag;
        }

        ele.flag = flag;

        actions.push(ele);
    }

    /* for each data point add an class member */
    let update_code = "let flag = 0",
        fun_id = 0;
    const update_groups = [],
        bound = [];

    for (const dp of data_points.values()) {
        //output_ast.body[0].body.vals.push(JSParse("this.d"  + dp.id + " = null").vals[0]);
        update_groups[dp.id] = dp.name;
    }

    
    output_ast.body[0].body.vals.push(JSParse(`this.uc = [${update_groups.map(e=>`null`)}]`).vals[0]);
    output_ast.body[0].body.vals.push(JSParse(`this.ug = [${update_groups.map(e=>`"${e}"`)}]`).vals[0]);
    //*
    //combine actions if we can
    for (let i = 0; i < actions.length; i++) {
        const act1 = actions[i];
        for (let j = 0; j < actions.length; j++) {
            if (j == i)
                continue;

            const act2 = actions[j];

            if (act1.flag == act2.flag && (act1.type & act2.type)) {
                //compress
                actions.splice(j, 1);
                j--;

                const t = types.expression_statement,
                    list = ((act2.expr.type == t) ? [act2.expr] : act2.expr.vals);

                if (act1.expr.type == t) {
                    act1.expr = new statements([[act1.expr, ...list]]);
                } else {
                    act1.expr.vals.push(...list);
                }
            }
        }

        const action = actions[i];
        let ele = null;
        let fun = null;
        switch (action.type) {
            case 1: // Input
            case 2: // Event
                //Create event listener in constructor
                ele = getElement(action.ele, mapped_elements);
                fun = fun_id++;
                output_ast.body[0].body.vals.push(...JSParse(`
                        this.b${fun} = this.f${fun}.bind(this); 
                        this.${ele}.addEventListener("${action.event}", this.b${fun})`).vals[0].vals);
                output_ast.body[1].body.vals.push(JSParse(`this.${ele}.removeEventListener("input", this.b${fun})`).vals[0]);
                output_ast.body.push(JSParse(`class{f${fun}(e){${replaceDataPoints(action.expr, data_points)}}}`).vals[0].body[0]);
                break;
                /*                event_str +=
                                    `\nfunction a_${i}(e){${createGate(action.cds, action.str, conditions, "gf")}};
                ${getElement(action.ele, mapped_elements)}.addEventListener("${action.event}", a_${i})`;*/

            case 4: // Element prop
            case 8: // Text node;
            case 12: // Scripts & Expressions
            case 16: //Container
                fun = fun_id++;
                bound.push({ f: action.flag, fn: fun })
                output_ast.body.push(JSParse(`class{f${fun}(){${replaceDataPoints(action.expr, data_points)}}}`).vals[0].body[0]);
                break;
        }
    }

    output_ast.body[0].body.vals.push(JSParse(`this.uf = [${bound.map(e=>`{f:${e.f},m:this.f${e.fn}.bind(this)}`)}]`).vals[0]);
    output_ast.body[0].body.vals.splice(1,0,...JSParse(`${[...mapped_elements.values()].map(v=>`this.${v.name}=w.ge(e ${v.offset.length >  0 ? ","+v.offset.join(",") : ""})`).join(";")};;`).vals[0].vals);
    for (const ctr of containers.values()) {
        output_ast.body[0].body.vals.push(JSParse(`this.${ctr.name}= w.ctr(this.${ctr.ele},"${
            ctr.comp.stamp().hash}" ${
                ctr.filters ? "," +ctr.filters.map(f=>`{action:${replaceDataPoints(f.expr, data_points)},type:"${f.type}"}`).join(",") : ""
            })`).vals[0]);
        output_ast.body[1].body.vals.push(JSParse(`this.${ctr.name}.destroy()`).vals[0]);
    }
    //build the rest of the functions
    //*/
    /* Add condition values to constructor function */
    const component_html = scope.ele.outerHTML;

    const hash = ((output_ast.render().length ^ component_html.length) * 0x456) + "";

    console.log(output_ast.render());

    output_ast.vals[0] = null;

    const output = {
        js: output_ast,
        html: scope.ele.outerHTML,
        hash
    };

    // Add component internal store. This can later be used to genereate a 
    // component graph that can be used in final applications.
    lite.addComponentTemplate(hash, output);

    return output;
}