import { EventIO, InputIO, ContainerLinkIO } from "../compiler/component/io/io.js";
import ScriptIO from "../compiler/component/io/script_io.js";
import { Tap } from "../compiler/component/tap/tap.js";

import insertData from "./insert_data.js";
import getContainer from "./get_container.js";
import {setContainerSortFN} from "./get_container.js";
import getElement from "./get_element.js"

// Activation conditions. {tap, or_prop}
export default function buildIO(io, ctx, obj = { cds: new Set, str: "", type: 0 }) {

    switch (io.type) {
        case "ContainerIO":
            const ctr = getContainer(io.container, ctx.containers, ctx.mapped_elements);

            `wick_lite.ctr_upd("filter", value)`
            if (!obj.type)
                obj.type = 16;

            let action = "",
                name_length = 0;

            switch (io.filter_type) {
                case "sort":
                    action = `(%%%%)=>${io.script.ast.expr.render()}`;
                    obj.str = `wl.ctr_fltr(${ctr}, "so")`;
                    name_length = 2;
                    break;
                case "filter":
                    action = `(%%%%)=>${io.script.ast.expr.render()}`;
                    obj.str = `wl.ctr_fltr(${ctr}, "fi")`;
                    name_length = 1;
                    break;
                case "scrub":
                    obj.str = `wl.ctr_fltr(${ctr}, "sc", ${io.script.ast.render()})`;
                    break;
                case "offset":
                    obj.str = `wl.ctr_fltr(${ctr}, "of", ${io.script.ast.render()})`;
                    break;
                case "limit":
                    obj.str = `wl.ctr_fltr(${ctr}, "li", ${io.script.ast.render()})`;
                    break;
                case "shift_amount":
                    obj.str = `wl.ctr_fltr(${ctr}, "sa", ${io.script.ast.render()})`;
                    break;
            }

            const arg_names = [];

            let i = 0;

            for (const arg_name in io.arg_ios)
                if (i++ < name_length)
                    arg_names.push(arg_name);
                else
                    obj.cds.add(arg_name);
            
            if (name_length > 0)
                action = insertData(action, arg_names.join(","));

            if (io.parent)
                obj.cds.add(io.parent.prop);

            if(io.filter_type == "filter")
                setContainerSortFN(io.container, ctx.containers,"filter", action);
            if(io.filter_type == "sort")
                setContainerSortFN(io.container, ctx.containers,"sort", action);

            break;
        case "ScriptIO":
        case "ExpressionIO":
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
            break;
        case "EventIO":
            obj.cds.add(io.up_tap.prop);
            obj.type = 2;
            obj.str += `emit("${io.up_tap.prop}", ${io.parent.prop}); `;

            if (!(io.parent instanceof Tap))
                buildIO(io.parent, ctx, obj);

            obj.event = io.event_name;
            obj.ele = io.ele;
            obj.str = `${obj.str}`;
            break;
        case "InputIO":
            //obj.cds.add(io.up_tap.prop);
            obj.type = 1;
            obj.str += `emit("${io.up_tap.prop}", e.target.value); `;

            if (!(io.parent instanceof Tap))
                buildIO(io.parent, ctx, obj);

            obj.event = io.event_name;
            obj.ele = io.ele;
            obj.str = `${obj.str}`;
            break;
        case "ContainerLinkIO":
            if (!obj.type) obj.type = 12;
            obj.str += `wl.ctr_upd(${getContainer(io.ele, ctx.containers, ctx.mapped_elements)},%%%%)`;

            if (!(io.parent instanceof Tap)) {
                return buildIO(io.parent, ctx, obj);
            } else {
                obj.str = insertData(obj.str, io.parent.prop);
            }

            obj.cds.add(io.parent.prop);
            break;
        default:
            if (io.ele instanceof Element) {
                if (!obj.type) obj.type = 12;
                obj.str += `${getElement(io.ele, ctx.mapped_elements)}.${io.attrib} =`;
            } else if (io.ele instanceof Text) {
                if (!obj.type) obj.type = 12;
                obj.str += `${getElement(io.ele, ctx.mapped_elements)}.innerHTML =`;
            } else {
                if (!obj.type) obj.type = 12;
                obj.cds.add(io.parent.prop);
            }

            if (!(io.parent instanceof Tap)) {
                return buildIO(io.parent, ctx, obj);
            } else {
                obj.str += io.parent.prop;
            }

            obj.cds.add(io.parent.prop);
            break;
    }
    return obj;
}