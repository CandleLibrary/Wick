import { traverse } from "@candlelib/conflagrate";
import { Lexer } from "@candlelib/wind";
import { Node } from "../../types/all.js";
import { ComponentData } from './component.js';
import { ModuleHash } from "./hash_name.js";
import { Context } from './context.js';

/**
 * Set the givin Lexer as the pos val for each node
 * @param node 
 * @param pos 
 */
export function setPos<T>(node: T, pos: Lexer | any): T {

    if (!pos) {

        //console.warn("[pos] is null - this node will not render source maps correctly.");

    } else
        //@ts-ignore
        for (const { node: n } of traverse(node, "nodes"))
            //@ts-ignore
            n.pos = pos;

    return node;
}


export function addPendingModuleToPresets(context: Context, from_value: string): string {

    const url = from_value.toString().trim();

    const hash = ModuleHash(url);

    context.repo.set(url, {
        url: url,
        hash: hash,
        module: null
    });

    return hash;
}

/** JS COMMON */
/**
 * Return the section source string corresponding to the given node
 * @param component - The component which contains the AST in which the node is a member.
 * @param node - Any AST node generated by the Wick parser.
 * @returns 
 */
export function getComponentSourceString(component: ComponentData, node: Node): string {

    const { pos } = node;

    //@ts-ignore
    return pos.slice();
}