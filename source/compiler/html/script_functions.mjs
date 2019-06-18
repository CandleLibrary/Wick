import JS from "../js/tools.mjs";
import glow from "@candlefw/glow";
import { types, identifier, member_expression } from "@candlefw/js";
const defaults = { glow };

export function GetOutGlobals(ast, presets) {
    const args = [];
    const ids = [];
    const arg_lu = new Set();

    JS.getClosureVariableNames(ast).forEach(out => {

        const name = out.name;

        if (!arg_lu.has(name)) {
            arg_lu.add(name)

            const out_object = { name, val: null, IS_TAPPED: false, IS_ELEMENT: false };

            if (presets.custom[name])
                out_object.val = presets.custom[name];
            else if (presets[name])
                out_object.val = presets[name];
            else if (defaults[name])
                out_object.val = defaults[name];
            else if (name[name.length - 1] == "$") {
                out_object.IS_ELEMENT = true;
                //out_object.name = out.slice(0,-1);
            } else {
                out_object.IS_TAPPED = true;
            }
            args.push(out_object);
        }
        ids.push(out);
    });

    return { args, ids };
}

export function AddEmit(ast, presets, ignore) {
    ast.forEach( node => {

        if(node.parent && node.parent.type == types.assignment_expression){
            const assign = node.parent;

            const k = node.name;

            if ((window[k] && !(window[k] instanceof HTMLElement)) || presets.custom[k] || presets[k] || defaults[k] || ignore.includes(k))
                return;

            node.replace(new member_expression([new identifier(["emit"]), null, node]));
        }
    });
}
