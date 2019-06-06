import JS from "../js/tools.mjs";
import glow from "@candlefw/glow";
import {types, identifier, member_expression} from "@candlefw/js";
const defaults = { glow };

export function GetOutGlobals(ast, presets) {

    return JS.getClosureVariableNames(ast).map(out => {
        const out_object = { name: out, val: null, IS_TAPPED: false, IS_ELEMENT : false};

        if (presets.custom[out])
            out_object.val = presets.custom[out];
        else if (presets[out])
            out_object.val = presets[out];
        else if (defaults[out])
            out_object.val = defaults[out];
        else if (out[out.length -1] == "$"){
            out_object.IS_ELEMENT = true;
            //out_object.name = out.slice(0,-1);
        } else {
            out_object.IS_TAPPED = true;
        }

        return out_object;
    });
}

export function AddEmit(ast, presets, ignore) {
    JS.processType(types.assignment_expression, ast, assign => {
        const k = assign.id.name;

        if ((window[k] && !(window[k] instanceof HTMLElement)) || presets.custom[k] || presets[k] || defaults[k] || ignore.includes(k))
            return;
        
        assign.connect.id.replace(new member_expression([new identifier(["emit"]), null, assign.id]));
    });
}
