/* Turns a wick compnent into a self contained html component  */


export default async function stamp(component, options = { type: "html" }) {
    /*
        Collect all elements. Mark all element transform. Either output an html script with embeded ID's and scripting,
        or output some javascript.
    */

    await component.pending;

    const ast = component.ast;

    switch (options.type) {
        case "html":
            const id = Math.random() * 0x34FA2Af5;
            const result = stampHTML(ast);
            console.log(result);
            return result;
            break;
    }
}

function stampHTML(ast, output = "", script = "") {

    if (ast.tag == "text") {
        if(ast.IS_BINDING){
            var d = textBinding(ast);
            output += d.output;
            script += d.script;
        }else
            output += ast.data;
    } else {
        output += `<${ast.tag}`;

        const id = "random_name";

        if (ast.attribs) {
            for (const attr of ast.attribs.values()) {
                output += ` ${writeAttribute(attr, id)}`;
                script += ` ${writeAttributeScript(attr, id)}`;
            }
        }

        output += `>`;

        if (ast.children) {
            for (const child of ast.children) {
                var d = stampHTML(child);
                output += d.output;
                script += d.script;
            }
        }

        output += `</${ast.tag}>`;

    }
        return { output, script };
}

function writeAttribute(attr, script = "") {
    //on attributes are handled by script. 
    //bound attributes are modified by script. 
    if (attr.name.slice(0, 2) == "on" || attr.isBINDING)
        return "";

    return `${attr.name} = "${attr.value}"`;

    console.log(attr);
}

function writeAttributeScript(attr, id) {
    let script = "";

    if (attr.isBINDING) {
        script += `registerEvent(ele1, ()=>output({${attr.value.val}:${true})})`;
        console.log(attr);
    }

    return script;
}

function textBinding(ast, output = "", script = ""){
    return {output, script};
}

`
registerComponent(comp)
registerEvent();
`