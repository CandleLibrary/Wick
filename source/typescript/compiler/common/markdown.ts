import { Token } from '@candlelib/hydrocarbon';
import { HTMLNode, HTMLNodeType, HTMLNodeClass, HTMLElementNode } from "../../types/all.js";
import { escape_html_string } from './html.js';

const MD_Attribute = { type: HTMLNodeType.HTMLAttribute, name: "m:d", value: "" };
export function convertMarkdownToHTMLNodes(markdown_content): HTMLNode {

    const output: HTMLNode[] = [];

    let previous_object = null;

    const data = markdown_content.data;

    for (let i = 0; i < data.length; i++) {

        const [header, content, pos] = data[i];

        switch (header.type) {

            case "header":

                output.push({
                    type: [
                        HTMLNodeType.HTML_H1, HTMLNodeType.HTML_H2,
                        HTMLNodeType.HTML_H3, HTMLNodeType.HTML_H4,
                        HTMLNodeType.HTML_H5, HTMLNodeType.HTML_H6,
                    ][header.length - 1],
                    tag: [
                        "H1", "H2", "H3", "H4", "H5", "H6",
                    ][header.length - 1],
                    nodes: [...convertLineContent(content)],
                    attributes: [],
                    pos
                });
                previous_object = null;
                break;

            case "code":
                output.push({
                    type: HTMLNodeType.HTML_PRE,
                    tag: "PRE",
                    attributes: header.data ? [{
                        type: HTMLNodeType.HTMLAttribute,
                        name: "code-type",
                        value: header.data.pos.slice()
                    }] : [],
                    nodes: content.map(({ data, pos }) => ({
                        type: HTMLNodeType.HTML_CODE,
                        tag: "CODE",
                        attributes: [MD_Attribute],
                        pos: pos,
                        nodes: [{
                            type: HTMLNodeType.HTMLText,
                            data: escape_html_string(data),
                            pos,
                        }]
                    })),
                    pos,

                });
                break;

            case "ul":
            case "ol": {

                let line = {
                    type: HTMLNodeType.HTML_LI,
                    tag: "LI",
                    attributes: [MD_Attribute],
                    nodes: [...convertLineContent(content)],
                    pos
                };
                let node = {
                    type: HTMLNodeType.HTML_UL,
                    tag: "UL",
                    attributes: [MD_Attribute],
                    nodes: [line],
                    pos
                };

                if (previous_object?.type == HTMLNodeType.HTML_UL) {

                    let depth = (header.offset / 2) | 0;

                    let child = previous_object.nodes.slice(-1)[0];

                    let last = previous_object;

                    while (depth > 0 && child && child.nodes) {
                        if (child.type == HTMLNodeType.HTML_UL)
                            depth--;
                        last = child;

                        child = child.nodes.slice(-1)[0];
                    }

                    if (last.type == HTMLNodeType.HTML_UL)
                        last.nodes.push(line);
                    else
                        last.nodes.push(node);

                } else {
                    output.push(node);
                    previous_object = node;
                }

            } break;

            default:

                if (!content || content.length == 0) {
                    /* if (previous_object?.type != HTMLNodeType.HTML_BR) {
                        previous_object = {
                            type: HTMLNodeType.HTML_BR,
                            tag: "BR",
                            nodes: [],
                            attributes: [],
                            pos
                        };
                        output.push(previous_object);
                    } */
                    previous_object = null;
                    break;
                }

                let modified_content = content.slice();
                let j = i + 1;
                while (j < data.length - 1) {
                    const [type, content, pos] = data[j];

                    if (content && !type && content.length > 0) {
                        modified_content.push(...content);
                        j++;
                        continue;
                    }

                    break;
                }

                i = j - 1;

                const node = {
                    type: HTMLNodeType.HTML_P,
                    tag: "P",
                    nodes: [...convertLineContent(modified_content)],
                    attributes: [MD_Attribute],
                    pos
                };

                if (previous_object?.type == HTMLNodeType.HTML_UL) {

                    let depth = Infinity;

                    let child = previous_object.nodes.slice(-1)[0];

                    let last = previous_object;

                    while (
                        depth > 0 &&
                        child && (
                            child.type == HTMLNodeType.HTML_UL
                            ||
                            child.type == HTMLNodeType.HTML_LI
                        )) {

                        last = child;

                        child = child.nodes.slice(-1)[0];
                    }

                    if (last.type == HTMLNodeType.HTML_LI) {
                        last.nodes.push({
                            type: HTMLNodeType.HTML_BR,
                            tag: "BR",
                            nodes: [],
                            attributes: [MD_Attribute],
                            pos
                        }, ...node.nodes);
                        continue;
                    }
                } else if (previous_object?.type != HTMLNodeType.HTML_P) {
                    previous_object = node;
                    output.push(previous_object);
                } else {
                    previous_object.nodes.push(...node.nodes);
                }
                break;
        }
    }

    return {
        type: HTMLNodeType.HTML_DIV,
        tag: "DIV",
        nodes: output,
        attributes: [MD_Attribute],
        pos: markdown_content.pos
    };
}

export function codeContent(raw_content: any[]) {

    const content = [];

    for (let i = 0; i < raw_content.length; i++) {

        if (raw_content[i].type == "inline_code") {

            var d = tryCodeBlock(raw_content[i], raw_content, content, i, raw_content.length);

            if (d != i) {
                i = d;
                continue;
            };

            raw_content[i].type = "text";

            content.push(raw_content[i]);

            continue;
        }

        content.push(raw_content[i]);
    }

    return content;
}

export function convertLineContent(raw_content) {
    return convertOuterContent(codeContent(raw_content));
}

export function convertOuterContent(raw_content: any[], offset = 0, length = raw_content.length) {

    const content = [];

    let last_content = null;

    for (let i = offset; i < length; i++) {

        const obj = raw_content[i];

        if (obj.type == "fmA" || obj.type == "fmB") {
            var d = tryFormat(obj.type, raw_content, content, i, length);
            if (d != i) { i = d; last_content = null; continue; };
        }

        if ((+obj.type) & HTMLNodeClass.HTML_ELEMENT) {
            content.push(obj);
            last_content = null;
        } else if (!last_content) {
            last_content = {
                type: HTMLNodeType.HTMLText,
                data: obj.pos.slice(),
                pos: obj.pos
            };
            content.push(last_content);
        } else {
            last_content.pos = Token.fromRange(last_content.pos, obj.pos);
            last_content.data += obj.pos.slice();
        }

    }

    return content;
}

function tryFormat(type, raw_content, content, offset, length) {

    let start = offset + 1;
    let search_size = 1;

    for (let i = start; i < length; i++)
        if (raw_content[i].type !== type) { start = i; break; };

    search_size = start - offset;

    if (search_size > 2 || search_size == 1)
        search_size = 1;
    else
        search_size = 2;

    if (raw_content[start] == " ")
        return offset;

    let matches = [];

    for (let i = start; i < length; i++) {

        if (raw_content[i].type == type && raw_content[i - 1] !== " ") {

            let j = i + 1;

            while (j < length && raw_content[j].type == type) { j++; };

            let diff = j - i;

            if (diff >= search_size) {

                matches.push(j);

                if (diff == search_size) { break; }
            }

            i += diff;
        }
    }

    if (matches.length > 0) {
        const end = matches.pop();

        content.push({
            type: search_size > 1
                ? HTMLNodeType.HTML_B
                : HTMLNodeType.HTML_I,
            tag: search_size > 1
                ? "B"
                : "I",
            nodes: convertOuterContent(
                raw_content,
                offset + search_size,
                end - search_size,
            )
        });

        return end - 1;
    }

    return offset;
}

function tryCodeBlock(obj, raw_content, content, offset, length) {

    let start = offset + 1;

    if (raw_content[start] == " ")
        return offset;


    for (let i = start; i < length; i++) {

        if (raw_content[i - 1] == " ")
            continue;

        if (raw_content[i].type == "inline_code") {
            const tok = Token.fromRange(obj.pos, raw_content[i].pos);

            content.push(<HTMLElementNode>{
                type: HTMLNodeType.HTML_CODE,
                tag: "CODE",
                attributes: [MD_Attribute],
                nodes: [{
                    type: HTMLNodeType.HTMLText,
                    data: escape_html_string(tok.slice().slice(1, -1)).trim(),
                    pos: tok
                }]
            });

            return i;
        }
    }

    return offset;
}


