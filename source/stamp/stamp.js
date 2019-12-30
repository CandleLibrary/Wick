import lite from "../wick_lite.js";
import insertData from "./insert_data.js";
import getContainer from "./get_container.js";
import getElement from "./get_element.js"
import buildIO from "./build_io.js"


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

    console.log(scope);

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
                actions.splice(j,1);
                j--;
                act1.str += ";" + act2.str;
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
var ${[...conditions.keys()].map(e=>`${e}`).join()}, gf = 0;

const ${[...mapped_elements.values()].map(v=>`${v.name}=wl.ge(ele, ${v.offset.join(",")})`).join(",")}
${
    containers.size > 0 ? `, ${
        [...containers.values()].map(c=>`${c.name}=wl.ctr(${c.ele},"${
            c.comp.stamp().hash}" ${
                c.filters ? "," +c.filters.map(f=>`{action:${f.fn_str},type:"${f.type}"}`).join(",") : ""
            })`).join(",")
    };` : ";"
}


function emit(name, val){output.update({[name]:val});}

const u = undefined, output = {
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
}

${event_str}

return output;
`;

    const output = {
        js: component_script,
        html: component_html,
        hash: ((component_script.length ^ component_html.length) * 0x456) + ""
    };

    // Add component internal store. This can later be used to genereate a 
    // component graph that can be used in final applications.
    lite.addComponent(output);

    console.log(output.js)

    return output;
}