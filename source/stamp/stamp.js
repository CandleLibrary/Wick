import { EventIO, InputIO, ContainerLinkIO } from "../compiler/component/io/io.js";
import ScriptIO from "../compiler/component/io/script_io.js";
import { Tap } from "../compiler/component/tap/tap.js";
import lite from "../wick_lite.mjs";

function insertData(template_str, str) {
    if (template_str.includes("%%%%"))
        return template_str.replace("%%%%", str);
    return template_str + str;
}

/* Returns an array that respresents the index position of a given element and it's ancestor nodes. */
function getRootOffset(ele, array = []) {
    let i = 0;

    const parent = ele.parentElement;

    if (!parent) {
        return array;
    }

    while (ele != parent.firstChild) {
        i++;
        ele = ele.previousSibling;
    }

    array.unshift(i);

    return getRootOffset(parent, array);
}

function getElement(ele, mapped_elements) {

    if (mapped_elements.has(ele))
        return mapped_elements.get(ele).name;

    let offset = null;

    if (ele instanceof Text) {
        const span = document.createElement("span");
        span.innerHTML = ele.data;
        ele.parentElement.insertBefore(span, ele);
        ele.parentElement.removeChild(ele);
        offset = getRootOffset(span);
    } else {
        offset = getRootOffset(ele);
    }

    mapped_elements.set(ele, { name: `e_${mapped_elements.size}`, offset });

    return getElement(ele, mapped_elements);
}

function getContainer(ctr,  containers, mapped_elements){

    if (containers.has(ctr))
        return containers.get(ctr).name;

    let offset = getRootOffset(ctr);   

    containers.set(ctr, { name: `c_${containers.size}`, offset, ele : getElement(ctr.ele, mapped_elements), comp: ctr.component });

    return getElement(ctr, containers, mapped_elements);
}

// Activation conditions. {tap, or_prop}
function buildIO(io, ctx, obj = { cds: new Set, str: "", type: 0 }) {
    if (io instanceof ScriptIO) {
        if (!obj.type)
            obj.type = 12;

        if (io.script.ast.type == 47)
            obj.str = insertData(obj.str, io.script.ast.expr.render());
        else
            obj.str = insertData(obj.str, io.script.ast.render());

        for (const arg_name in io.arg_ios) {
            obj.cds.add(arg_name);
            //const arg = io.io.arg_ios[arg_name];
            //str = buildIO(createIONode(arg), str)
        }

        if (io.parent)
            obj.cds.add(io.parent.prop);

    } else if (io instanceof EventIO) {

        const type = 2;

        obj.cds.add(io.up_tap.prop);
        obj.type = type;
        obj.str += `emit("${io.up_tap.prop}", ${io.up_tap.prop}); `;

        if (!(io.parent instanceof Tap))
            buildIO(io.parent, ctx, obj);

        obj.event = io.event_name;
        obj.ele = io.ele;
        obj.str = `${obj.str}`;

    } else if (io instanceof InputIO) {
        const type = 1;
        //obj.cds.add(io.up_tap.prop);
        obj.type = type;
        obj.str += `emit("${io.up_tap.prop}", e.target.value); `;

        if (!(io.parent instanceof Tap))
            buildIO(io.parent, ctx, obj);

        obj.event = io.event_name;
        obj.ele = io.ele;
        obj.str = `${obj.str}`;

    } else if (io instanceof ContainerLinkIO) {
        if (!obj.type) obj.type = 16;
        obj.str += `wl.ctr_upd(${getContainer(io.ele, ctx.containers, ctx.mapped_elements)},%%%%)`;

        if (!(io.parent instanceof Tap)) {
            return buildIO(io.parent, ctx, obj);
        } else {
            obj.str = insertData(obj.str, io.parent.prop);
        }

        obj.cds.add(io.parent.prop);
    } else {
        if (io.ele instanceof Element) {
            if (!obj.type) obj.type = 4;
            obj.str += `${getElement(io.ele, ctx.mapped_elements)}.${io.attrib} =`;
        } else if (io.ele instanceof Text) {
            if (!obj.type) obj.type = 8;
            obj.str += `${getElement(io.ele, ctx.mapped_elements)}.innerHTML =`;
        } else {
            if (!obj.type) obj.type = 4;
            obj.cds.add(io.parent.prop);
        }

        if (!(io.parent instanceof Tap)) {
            return buildIO(io.parent, ctx, obj);
        } else {
            obj.str += io.parent.prop;
        }

        obj.cds.add(io.parent.prop);
    }
    return obj;
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
        actions = [];

    //pull out tap and io data and build a dependency graph
    for (const io of scope.ios) {
        const ele = buildIO(io, { mapped_elements, containers });
        ele.id = [...ele.cds.values()].sort((a, b) => a < b ? -1 : 1).join("");
        actions.push(ele);
    }

    //combine actions if we can
    for (let i = 0; i < actions.length; i++) {
        const act1 = actions[i];
        for (let j = 0; j < actions.length; j++) {
            if (j == i)
                continue;
            const act2 = actions[j];

            if (act1.id == act2.id && (act1.type & act2.type)) {
                //compress
                debugger;
            }
        }
    }

    const conditions = new Map();

    actions.sort((a, b) => (a.type < b.type) ? -1 : 1);

    let event_str = "",
        element_str = "";

    for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        switch (action.type) {
            case 1: // Input
                event_str +=
                    `\nfunction a_${i}(e){${createGate(action.cds, action.str, conditions, "gf")}};
${getElement(action.ele, mapped_elements)}.addEventListener("input", a_${i})`;
                break;
            case 2: // Event
                event_str +=
                    `\nfunction a_${i}(e){${createGate(action.cds, action.str, conditions, "gf")}};
${getElement(action.ele, mapped_elements)}.addEventListener("${action.event}", a_${i})`;
                break;
            case 4: // Element prop
            case 8: // Text node;
            case 12: // Scripts & Expressions
            case 16: //Container
                element_str += `\n${createGate(action.cds, action.str, conditions)};`;
                break;
        }
    }

    const component_html = scope.ele.outerHTML;
    const component_script = `
const ${[...mapped_elements.values()].map(v=>`${v.name}=wl.ge(ele, ${v.offset.join(",")})`).join(",")};
${containers.size > 0 ? `${[...containers.values()].map(c=>`${c.name}=wl.ctr(${c.ele},"${c.comp.stamp().hash}")`).join(",")};` : ""}
var ${[...conditions.keys()].map(e=>`${e}`).join()}, gf = 0;


function emit(name, val){
    output.update({[name]:val});
}

const u = undefined;

output = {
    update : function(data){
        f = ${[...conditions.entries()].map(e=>`+((data.${e[0]} != u && !void (${e[0]} = data.${e[0]}))${(e[1] > 1) ? "<<" + Math.log(e[1])/Math.log(2): ""})`).join("|")};
        ${element_str};
        gf |= f;
    },
    destroy : function(){

    },
    get ele(){
        return ele;
    },
    transitionIn(){},
    transitionOut(){}
}

${event_str}

return output;
`;

    const output = { js: component_script, html: component_html, hash: ((component_script.length ^ component_html.length) * 0x456) +"" };
    
    lite.addComponent(output);

    return output;
}