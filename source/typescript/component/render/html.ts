import { bidirectionalTraverse, TraverseState } from "@candlefw/conflagrate";
import { getStaticValue } from "../../common/binding.js";
import { html_void_tags } from "../../common/html.js";
import Presets from "../../common/presets.js";
import { rt } from "../../runtime/global.js";
import { ComponentData } from "../../types/component";
import { IntermediateHook } from "../../types/hook.js";
import { ContainerDomLiteral, DOMLiteral, htmlState, TempHTMLNode } from "../../types/html";
import { runHTMLHookHandlers } from "../compile/compile.js";

/**
 * Compile component HTML information (including child component and slot information), into a string containing the components html
 * tree and template html elements for components referenced in containers. 
 * 
 * @param comp 
 * @param presets 
 */
export function componentDataToHTML(
    comp: ComponentData,
    presets: Presets = rt.presets,
): { html: string, template_map: Map<string, TempHTMLNode>; } {

    const { html: [html], template_map } = componentDataToTempAST(comp, presets);

    const html_string = htmlTemplateDataToString(html);

    return { html: html_string, template_map: template_map };
}


/**
 * Return an HTML string from a TempHTMLNode AST object
 */
export function htmlTemplateDataToString(html: TempHTMLNode) {
    for (const { node, meta: { depth, parent, traverse_state } } of bidirectionalTraverse(html, "children")) {

        const depth_str = " ".repeat(depth);

        if (traverse_state == TraverseState.LEAF) {
            if (node.tagName) {
                let string = `<${node.tagName}`;

                for (const [key, val] of node.attributes.entries())
                    if (val === "")
                        string += ` ${key}`;

                    else
                        string += ` ${key}="${val}"`;

                if (html_void_tags.has(node.tagName.toLowerCase()))
                    node.strings.push(string + "/>");
                else
                    node.strings.push(string + `></${node.tagName}>`);

            }
            else
                node.strings.push(...node.data.split("\n"));

            if (parent)
                parent.strings.push(...node.strings.map(s => depth_str + s));
        } else if (traverse_state == TraverseState.ENTER) {
            let string = `<${node.tagName}`;

            for (const [key, val] of node.attributes.entries())
                if (val === "")
                    string += ` ${key}`;

                else
                    string += ` ${key}="${val}"`;

            node.strings.push(string + ">");
        } else {

            node.strings.push(`</${node.tagName}>`);

            if (parent)
                parent.strings.push(...node.strings.map(s => depth_str + s));
        }
    };

    return html.strings.join("\n");
}

/**
 * Compile component HTML information (including child component and slot information), into a string containing the components html
 * tree and template html elements for components referenced in containers. 
 * 
 * @param comp 
 * @param presets 
 * @param template_map 
 * @param html 
 * @param root 
 */
export function componentDataToTempAST(
    comp: ComponentData,
    presets: Presets = rt.presets,
    model = null,
    template_map = new Map,
    html: DOMLiteral = comp.HTML,
    state: htmlState = htmlState.IS_ROOT | htmlState.IS_COMPONENT,
    extern_children: { USED: boolean, child: DOMLiteral, id: number; }[] = [],
    parent_component: ComponentData[] = null,
    comp_data = [comp.name],
): { html: TempHTMLNode[], template_map: Map<string, TempHTMLNode>; } {

    let node: TempHTMLNode = {
        tagName: "",
        data: "",
        attributes: new Map(),
        children: [],
        strings: [],
    };

    //if (html)
    //html = on_ele_hook(html);

    if (html) {
        //Convert html to string 
        const {
            tag_name: tag_name = "",
            attributes: attributes = [],
            children: c = [],
            data: data,
            is_bindings: IS_BINDING,
            component_name: component_name,
            slot_name: slot_name,
            namespace_id
        }: DOMLiteral = html,
            children = c.map(i => ({ USED: false, child: i, id: comp_data.length - 1 }));
        if (namespace_id)
            node.namespace = namespace_id;

        if (html.is_container == true)

            addContainer(
                <ContainerDomLiteral>html,
                comp,
                presets,
                state,
                comp_data,
                template_map,
                node,
                model,
                parent_component
            );

        else if (component_name && presets.components.has(component_name)) {

            ({ node, state } =
                addComponent(presets,
                    component_name,
                    state,
                    node,
                    template_map,
                    extern_children,
                    children,
                    comp,
                    comp_data,
                    model
                )
            );

        } else if (tag_name) {

            if (tag_name == "SLOT" && extern_children.length > 0) {

                let r_ = { html: [], template_map };

                if (slot_name != "") {

                    for (let i = 0; i < extern_children.length; i++) {

                        const pkg = extern_children[i];

                        if (pkg.child.slot_name == slot_name && !pkg.USED) {
                            pkg.USED = true;
                            pkg.child.host_component_index = pkg.id;
                            r_.html.push(...componentDataToTempAST(
                                parent_component,
                                presets,
                                model,
                                template_map,
                                pkg.child,
                                htmlState.IS_SLOT_REPLACEMENT,
                            ).html);
                        }
                    }

                } else {

                    for (let i = 0; i < extern_children.length; i++) {

                        const pkg = extern_children[i];

                        if (!pkg.child.slot_name && !pkg.USED) {
                            pkg.USED = true;
                            pkg.child.host_component_index = pkg.id;
                            r_.html.push(...componentDataToTempAST(
                                parent_component,
                                presets,
                                model,
                                template_map,
                                pkg.child,
                                htmlState.IS_SLOT_REPLACEMENT,
                            ).html);
                        }
                    }
                }

                if (r_.html.length > 0)
                    return r_;
            }

            processHooks(html, comp, presets, model, node);

            const COMPONENT_IS_ROOT_ELEMENT = comp.HTML == html;

            node.tagName = tag_name.toLocaleLowerCase();

            if (state & htmlState.IS_SLOT_REPLACEMENT)
                node.attributes.set("w:r", (html.host_component_index * 50 + html.element_index) + "");

            const HAVE_CLASS = processAttributes(html, comp, state, comp_data, node);

            if (COMPONENT_IS_ROOT_ELEMENT) {
                node.attributes.set("w:c", "");
                if (!HAVE_CLASS) {
                    const class_names = (COMPONENT_IS_ROOT_ELEMENT
                        ? ((state & htmlState.IS_INTERLEAVED) > 0)
                            ? comp_data.join(" ")
                            : comp_data[comp_data.length - 1]
                        : "");
                    node.attributes.set("class", class_names);
                }
            }

            if ((state & htmlState.IS_INTERLEAVED) > 0) {
                node.attributes.set("w:own", "" + comp_data.indexOf(comp.name));
            }

        } else if (IS_BINDING)
            addBindingElement(html, state, node, comp_data, comp, model);
        else {
            node.data = data;
        }

        const child_state = (((state) & (htmlState.IS_INTERLEAVED | htmlState.IS_COMPONENT))
            == (htmlState.IS_INTERLEAVED | htmlState.IS_COMPONENT))
            ? htmlState.IS_INTERLEAVED : 0;

        for (const { child } of children.filter(n => !n.USED)) {

            const { html } = componentDataToTempAST(
                comp,
                presets,
                model,
                template_map,
                child,
                child_state,
                extern_children,
                parent_component,
                comp_data
            );
            node.children.push(...html);
        }

    }

    return { html: [node], template_map };
}

function processAttributes(
    html: DOMLiteral,
    comp: ComponentData,
    state: htmlState,
    comp_data: string[],
    node: TempHTMLNode
) {

    let HAVE_CLASS: boolean = false;
    const COMPONENT_IS_ROOT_ELEMENT = comp.HTML == html;

    for (const [key, val] of html?.attributes?.values() ?? [])

        if (key.toLocaleLowerCase() == "class") {

            HAVE_CLASS = COMPONENT_IS_ROOT_ELEMENT || HAVE_CLASS;

            const class_names = (COMPONENT_IS_ROOT_ELEMENT
                ? ((state & htmlState.IS_INTERLEAVED) > 0)
                    ? comp_data.join(" ")
                    : comp_data[comp_data.length - 1]
                : "");

            node.attributes.set("class", class_names + ` ${val}`);
        } else
            node.attributes.set(key, val);

    return HAVE_CLASS;
}

function addComponent(presets: Presets,
    component_name: string,
    state: htmlState,
    node: TempHTMLNode,
    template_map: Map<any, any>,
    extern_children: { USED: boolean; child: DOMLiteral; id: number; }[],
    children: { USED: boolean; child: DOMLiteral; id: number; }[],
    comp: ComponentData,
    comp_data: string[],
    model: any = null
) {
    const c_comp = presets.components.get(component_name);

    if (htmlState.IS_COMPONENT & state)
        state |= htmlState.IS_INTERLEAVED;

    ({ html: [node] } = componentDataToTempAST(
        c_comp,
        presets,
        model,
        template_map,
        c_comp.HTML,
        state,
        extern_children.concat(children),
        comp,
        [...comp_data, c_comp.name]
    ));

    return { state, node };
}

function addContainer(
    html: ContainerDomLiteral,
    component: ComponentData,
    presets: Presets,
    state: htmlState,
    comp_data: string[],
    template_map: Map<any, any>,
    node: TempHTMLNode,
    model: any = null,
    parent_component: ComponentData = null
) {
    const {
        component_attribs,
        component_names
    } = <ContainerDomLiteral>html,
        w_ctr = component_names.join(" "),
        w_ctr_atr = component_attribs.map(s => s.map(a => a.join(("=").replace(/\"/g, ""))).join(";")).join(":");

    for (const name of component_names) {

        const comp = presets.components.get(name);

        if (!template_map.has(comp.name))
            template_map.set(comp.name, {
                tagName: "template",
                data: "",
                strings: [],
                attributes: new Map([["w:c", ""], ["class", comp.name]]),
                children: [...componentDataToTempAST(comp, presets, model, template_map).html]
            });
    }

    node.tagName = html.tag_name.toLowerCase();

    node.attributes.set("w:ctr", w_ctr);
    node.attributes.set("w:ctr-atr", w_ctr_atr);

    //get data hook 
    processHooks(html, component, presets, model, node, parent_component);

    processAttributes(html, component, state, comp_data, node);
}

function processHooks(
    html: DOMLiteral,
    component: ComponentData,
    presets: Presets,
    model: any,
    node: TempHTMLNode,
    parent_component: ComponentData
) {

    for (const hook of getHookFromElement(html, component)) {

        const ele = runHTMLHookHandlers(hook, component, presets, model, parent_component);

        if (ele) {
            if (ele.attributes)
                for (const [k, v] of ele.attributes.entries())
                    node.attributes.set(k, v);

            if (ele.children)
                node.children.push(...ele.children);

            if (ele.data)
                node.data += ele.data;
        }
    }
}

function addBindingElement(
    html: DOMLiteral,
    state: htmlState,
    node: TempHTMLNode,
    comp_data: string[],
    comp: ComponentData,
    model: any = null
) {

    const
        hook = getHookFromElement(html, comp)[0],
        val = getStaticValue(hook.hook_value, comp, model);

    if ((state & htmlState.IS_INTERLEAVED) > 0)
        node.attributes.set("w:own", "" + comp_data.indexOf(comp.name));

    node.tagName = "w-b";

    if (val) {
        node.children.push({
            data: val + "",
            children: [],
            strings: [],
            attributes: null,
            tagName: null,
        });
    }

    node.data = html.data || "";

}

function getHookFromElement(ele: DOMLiteral, comp: ComponentData): IntermediateHook[] {

    let hooks = [];

    for (const hook of comp.hooks) {
        if (hook.html_element_index == ele.element_index)
            hooks.push(hook);
    }

    return hooks;
}