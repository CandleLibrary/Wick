import { getStaticValue } from "../../common/binding.js";
import Presets from "../../common/presets.js";
import { rt } from "../../runtime/global.js";
import { ComponentData } from "../../types/component";
import { IntermediateHook } from "../../types/hook.js";
import { ContainerDomLiteral, DOMLiteral, htmlState, TemplateHTMLNode, TemplatePackage } from "../../types/html";
import { runHTMLHookHandlers } from "./compile.js";

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
export async function componentDataToTempAST(
    comp: ComponentData,
    presets: Presets = rt.presets,
    model = null,
    template_map: TemplatePackage["templates"] = new Map,
    html: DOMLiteral = comp.HTML,
    state: htmlState = htmlState.IS_ROOT | htmlState.IS_COMPONENT,
    extern_children: { USED: boolean; child: DOMLiteral; id: number; }[] = [],
    parent_component: ComponentData[] = null,
    comp_data = [comp.name]
): Promise<TemplatePackage> {

    let node: TemplateHTMLNode = {
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
            await addContainer(
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
                await addComponent(
                    html,
                    presets,
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

                let r_ = await processSlot(template_map, slot_name, extern_children, parent_component, presets, model);

                if (r_.html.length > 0)
                    return r_;
            }

            await processElement(html, comp, presets, model, node, parent_component, tag_name, state, comp_data, template_map);

        } else if (IS_BINDING)
            await addBindingElement(html, state, node, comp_data, comp, presets, model);
        else
            processTextNode(node, data);

        const child_state = (((state) & (htmlState.IS_INTERLEAVED | htmlState.IS_COMPONENT))
            == (htmlState.IS_INTERLEAVED | htmlState.IS_COMPONENT))
            ? htmlState.IS_INTERLEAVED : 0;

        for (const { child } of children.filter(n => !n.USED)) {

            const { html } = await componentDataToTempAST(
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

    return { html: [node], templates: template_map };
}


function processTextNode(node: TemplateHTMLNode, data: string) {
    node.data = data;
}

async function processElement(html: DOMLiteral,
    comp: ComponentData,
    presets: Presets,
    model: any,
    node: TemplateHTMLNode,
    parent_component: ComponentData[],
    tag_name: string,
    state: htmlState,
    comp_data: string[],
    template_map: TemplatePackage["templates"]
) {
    await processHooks(html, comp, presets, model, node, parent_component, template_map);

    const COMPONENT_IS_ROOT_ELEMENT = comp.HTML == html;

    node.tagName = tag_name.toLocaleLowerCase();

    setScopeAssignment(state, node, html);

    const HAVE_CLASS = processAttributes(html.attributes, comp, state, comp_data, node, comp.HTML == html);

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
}

function setScopeAssignment(state: htmlState, node: TemplateHTMLNode, html: DOMLiteral) {
    if (state & htmlState.IS_SLOT_REPLACEMENT)
        node.attributes.set("w:r", (html.host_component_index * 50 + html.element_index) + "");
}

async function processSlot(
    template_map: TemplatePackage["templates"],
    slot_name: string,
    extern_children: { USED: boolean; child: DOMLiteral; id: number; }[],
    parent_component: ComponentData[],
    presets: Presets,
    model: any
) {
    let r_ = { html: [], template_map };

    if (slot_name != "") {

        for (let i = 0; i < extern_children.length; i++) {

            const pkg = extern_children[i];

            if (pkg.child.slot_name == slot_name && !pkg.USED) {
                pkg.USED = true;
                pkg.child.host_component_index = pkg.id;
                r_.html.push(...(await componentDataToTempAST(
                    parent_component,
                    presets,
                    model,
                    template_map,
                    pkg.child,
                    htmlState.IS_SLOT_REPLACEMENT
                )).html);
            }
        }

    } else {

        for (let i = 0; i < extern_children.length; i++) {

            const pkg = extern_children[i];

            if (!pkg.child.slot_name && !pkg.USED) {
                pkg.USED = true;
                pkg.child.host_component_index = pkg.id;
                r_.html.push(...(await componentDataToTempAST(
                    parent_component,
                    presets,
                    model,
                    template_map,
                    pkg.child,
                    htmlState.IS_SLOT_REPLACEMENT
                )).html);
            }
        }
    }
    return r_;
}

function processAttributes(
    attributes: DOMLiteral["attributes"],
    comp: ComponentData,
    state: htmlState,
    comp_data: string[],
    node: TemplateHTMLNode,
    COMPONENT_IS_ROOT_ELEMENT: boolean
) {

    if (!attributes)
        return false;

    let HAVE_CLASS: boolean = false;

    for (const [key, val] of attributes?.values() ?? [])
        if (key.toLocaleLowerCase() == "class") {

            HAVE_CLASS = COMPONENT_IS_ROOT_ELEMENT || HAVE_CLASS;

            const class_names = (COMPONENT_IS_ROOT_ELEMENT
                ? ((state & htmlState.IS_INTERLEAVED) > 0)
                    ? comp_data.join(" ")
                    : comp_data[comp_data.length - 1]
                : "");

            if (node.attributes.has("class")) {
                node.attributes.set("class", node.attributes.get("class") + " " + class_names + ` ${val}`);
            } else
                node.attributes.set("class", class_names + ` ${val}`);
        }
        else
            node.attributes.set(key, val);

    return HAVE_CLASS;
}


async function addComponent(
    html: DOMLiteral,
    presets: Presets,
    component_name: string,
    state: htmlState,
    node: TemplateHTMLNode,
    template_map: TemplatePackage["templates"],
    extern_children: { USED: boolean; child: DOMLiteral; id: number; }[],
    children: { USED: boolean; child: DOMLiteral; id: number; }[],
    comp: ComponentData,
    comp_data: string[],
    model: any = null
) {
    const c_comp = presets.components.get(component_name);

    if (htmlState.IS_COMPONENT & state)
        state |= htmlState.IS_INTERLEAVED;

    ({ html: [node] } = await componentDataToTempAST(
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

    //Merge node attribute data with host entry data, overwrite if necessary

    processAttributes(
        html.attributes,
        comp,
        state,
        comp_data,
        node,
        comp.HTML == html
    );

    return { state, node };
}

async function addContainer(
    html: ContainerDomLiteral,
    component: ComponentData,
    presets: Presets,
    state: htmlState,
    comp_data: string[],
    template_map: TemplatePackage["templates"],
    node: TemplateHTMLNode,
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

        if (!template_map.has(comp.name)) {

            const template = await createComponentTemplate(comp, presets, template_map);

            template_map.set(comp.name, comp.template);
        }
    }

    node.tagName = html.tag_name.toLowerCase();

    node.attributes.set("w:ctr", w_ctr);

    node.attributes.set("w:ctr-atr", w_ctr_atr);

    setScopeAssignment(state, node, html);

    //get data hook 
    await processHooks(html, component, presets, model, node, parent_component, template_map);

    processAttributes(html.attributes, component, state, comp_data, node, component.HTML == html);
}


export async function createComponentTemplate(
    comp: ComponentData,
    presets: Presets,
    template_map: Map<string, TemplateHTMLNode> = new Map
): Promise<TemplateHTMLNode> {
    if (!comp.template) {

        const { html } = await componentDataToTempAST(comp, presets, null, template_map);

        comp.template = {
            tagName: "template",
            data: "",
            strings: [],
            attributes: new Map([["w:c", ""], ["id", comp.name]]),
            children: [...html]
        };
    }

    return comp.template;
}

async function processHooks(
    html: DOMLiteral,
    component: ComponentData,
    presets: Presets,
    model: any,
    node: TemplateHTMLNode,
    parent_component: ComponentData,
    template_map: TemplatePackage["templates"],
) {

    for (const hook of getHookFromElement(html, component)) {

        const { html, templates } = (await runHTMLHookHandlers(hook, component, presets, model, parent_component) || {});

        if (html) {
            if (html.attributes)
                for (const [k, v] of html.attributes.entries())
                    node.attributes.set(k, v);

            if (html.children)
                node.children.push(...html.children);

            if (html.data)
                node.data += html.data;
        } if (templates) {

            for (const [key, val] of templates.entries())
                if (!template_map.has(key)) {
                    template_map.set(key, val);
                }
        }
    }
}


async function addBindingElement(
    html: DOMLiteral,
    state: htmlState,
    node: TemplateHTMLNode,
    comp_data: string[],
    comp: ComponentData,
    presets: Presets,
    model: any = null
) {

    const
        hook = getHookFromElement(html, comp)[0],
        val = await getStaticValue(hook.hook_value, comp, presets, model);

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
