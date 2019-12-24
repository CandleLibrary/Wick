/* Turns a wick compnent into a self contained html component  */
const wickStub  = function(){
    
    let active_component = null;

    return{
        registerTextExpression(){}
    }
}

function scope(){
    let html = "", script = "", id = [-1], top = 0,
    id_activation = new Set(), id_map = new Map();

    return {
        get HTML(){return html},
        get SCRIPT(){return `const ${[...id_activation.values()].join(";")};${script}`},
        get ID(){
            const public_id = `_s${id.join("")}_`;
            id_activation.add(`const ${public_id} = ge(${id})`);
            return public_id;
        },
        writeHTML(text){
            html += text;
        },
        writeScript(text){
            script += text;
        },
        incrementID(){
            id[top]++;
        },
        pushID(){
            top++;
            id.push(0);
            id[top] = -1;
        },
        popID(){
            id.pop();
        }
    }
}

export default async function stamp(component, options = { type: "html" }) {
    /*
        Collect all elements. Mark all element transform. Either output an html script with embeded ID's and scripting,
        or output some javascript.
    */

    await component.pending;

    const ast = component.ast;

    switch (options.type) {
        case "html":
            const s = scope();
            ast.stamp(s)
            console.log(s.HTML)
            console.log(s.SCRIPT)
            return "";
    }
}