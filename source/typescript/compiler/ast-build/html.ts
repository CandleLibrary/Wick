import { JSNode } from "source/typescript/entry-point/wick-full.js";
import { rt } from "../../runtime/global.js";
import { ComponentData, ContainerDomLiteral, DOMLiteral, htmlState, IndirectHook, PresetOptions, TemplateHTMLNode, TemplatePackage } from "../../types/all.js";
import { getStaticValue } from "../data/static_resolution.js";
import { processHookForHTML } from "./hooks.js";
import {
    ContainerDataHook,
    ContainerFilterHook,
    ContainerLimitHook,
    ContainerOffsetHook,
    ContainerScrubHook,
    ContainerShiftHook,
    ContainerSortHook,
    ContainerUseIfHook
} from "../features/container_features.js";
import * as b_sys from "../build_system.js";
import { buildExportableDOMNode } from '../common/html.js';

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
export async function componentDataToCompiledHTML(
    comp: ComponentData,
    presets: PresetOptions = rt.presets,
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

    if (html) {
        //Convert html to string 
        const {
            tag_name: tag_name = "",
            nodes: c = [],
            data: data,
            IS_BINDING: IS_BINDING,
            component_name: component_name,
            slot_name: slot_name,
            name_space: namespace_id
        }: DOMLiteral = html,
            children = c.map(i => ({ USED: false, child: i, id: comp_data.length - 1 }));

        if (html.id != undefined) {
            comp.element_index_remap.set(html.id, comp.element_counter);
            node.attributes.set("w:u", html.id + "");
        }

        if (namespace_id)
            node.namespace = namespace_id;

        if (html.IS_CONTAINER == true)
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
            node = await resolveHTMLBinding(html, state, node, comp_data, comp, presets, model, parent_component);
        else
            processTextNode(node, data);

        const child_state = (((state) & (htmlState.IS_INTERLEAVED | htmlState.IS_COMPONENT))
            == (htmlState.IS_INTERLEAVED | htmlState.IS_COMPONENT))
            ? htmlState.IS_INTERLEAVED : 0;

        if (html.id != undefined) {
            comp.element_counter += 1;
        }



        for (const { child } of children.filter(n => !n.USED)) {

            const { html } = await componentDataToCompiledHTML(
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

    node.data ||= "";

    return { html: [node], templates: template_map };
}


function processTextNode(node: TemplateHTMLNode, data: string) {
    node.data = data;
}

async function processElement(html: DOMLiteral,
    comp: ComponentData,
    presets: PresetOptions,
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
    presets: PresetOptions,
    model: any
) {
    let r_ = { html: [], template_map };

    if (slot_name != "") {

        for (let i = 0; i < extern_children.length; i++) {

            const pkg = extern_children[i];

            if (pkg.child.slot_name == slot_name && !pkg.USED) {
                pkg.USED = true;
                pkg.child.host_component_index = pkg.id;
                r_.html.push(...(await componentDataToCompiledHTML(
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
                r_.html.push(...(await componentDataToCompiledHTML(
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
    presets: PresetOptions,
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

    ({ html: [node] } = await componentDataToCompiledHTML(
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
    presets: PresetOptions,
    state: htmlState,
    comp_data: string[],
    template_map: TemplatePackage["templates"],
    node: TemplateHTMLNode,
    model: any = null,
    parent_components: ComponentData[] = null
) {
    const {
        component_attributes: component_attribs,
        component_names
    } = <ContainerDomLiteral>html,
        w_ctr = component_names.join(" "),
        w_ctr_atr = component_attribs.map(s => s.map(a => a.join(("=").replace(/\"/g, ""))).join(";")).join(":");

    for (const name of component_names) {

        const comp = presets.components.get(name);

        if (!template_map.has(comp.name) && comp.name != component.name) {

            await ensureComponentHasTemplates(comp, presets);

            for (const name of comp.templates)
                template_map.set(name, presets.components.get(name).template);

            template_map.set(comp.name, comp.template);

        }
    }

    node.tagName = html.tag_name.toLowerCase();

    node.attributes.set("w:ctr", w_ctr);

    node.attributes.set("w:ctr-atr", w_ctr_atr);

    setScopeAssignment(state, node, html);

    //get data hook 
    await processHooks(html, component, presets, model, node, parent_components, template_map);

    await processContainerHooks(html, component, presets, model, node, parent_components, template_map);

    processAttributes(html.attributes, component, state, comp_data, node, component.HTML == html);
}


export async function ensureComponentHasTemplates(
    comp: ComponentData,
    presets: PresetOptions
): Promise<TemplateHTMLNode> {
    if (!comp.template) {

        comp.template = {
            tagName: "template",
            data: "",
            strings: [],
            attributes: new Map([["w:c", ""], ["id", comp.name]]),
            children: []
        };

        comp.templates = new Set();

        b_sys.enableBuildFeatures();

        const { html, templates } = await componentDataToCompiledHTML(comp, presets);

        comp.template.children.push(...html);

        comp.templates = new Set([comp.name, ...templates.keys()]);

        b_sys.disableBuildFeatures();
    }

    return comp.template;
}

async function processContainerHooks(
    html: ContainerDomLiteral,
    component: ComponentData,
    presets: PresetOptions,
    model: any,
    node: TemplateHTMLNode,
    parent_components: ComponentData[],
    template_map: TemplatePackage["templates"],
) {
    const
        hooks = getHookFromElement(html, component),
        data_hook = hooks.find(t => t.type == ContainerDataHook),
        filter_hook = hooks.find(t => t.type == ContainerFilterHook),
        sort_hook = hooks.find(t => t.type == ContainerSortHook),
        limit_hook = hooks.find(t => t.type == ContainerLimitHook),
        offset_hook = hooks.find(t => t.type == ContainerOffsetHook),
        shift_hook = hooks.find(t => t.type == ContainerShiftHook),
        use_if_hooks = hooks.filter(t => t.type == ContainerUseIfHook);

    if (data_hook) {

        let data = await processHookForHTML(data_hook, component, presets, model, parent_components);

        if (Array.isArray(data) && data.length > 0) {

            let limit = data.length, offset = 0, shift = 1;

            if (filter_hook) {
                const arrow_filter = await processHookForHTML(filter_hook, component, presets, model, parent_components);

                if (arrow_filter)
                    data = data.filter(arrow_filter);
            }

            if (sort_hook) {
                const sort_filter = await processHookForHTML(sort_hook, component, presets, model, parent_components);

                if (sort_filter)
                    data = data.sort(sort_filter);
            }

            if (limit_hook) {
                const pending_limit = await processHookForHTML(limit_hook, component, presets, model, parent_components);

                if (typeof pending_limit == "number")
                    limit = Math.max(0, Math.min(pending_limit, data.length));
            }

            if (shift_hook) {
                const pending_shift = await processHookForHTML(shift_hook, component, presets, model, parent_components);

                if (typeof pending_shift == "number")
                    shift = Math.max(1, pending_shift);
            }

            if (offset_hook) {
                const pending_offset = await processHookForHTML(offset_hook, component, presets, model, parent_components);

                if (typeof pending_offset == "number")
                    offset = Math.max(0, Math.min(pending_offset, data.length));
            }

            data = data.slice(offset * shift, offset * shift + limit);

            if (data.length > 0) {

                const

                    comp_name = html.component_names[0],

                    child_comp = presets.components.get(comp_name);

                //Don't forget use-if hooks which may be present in the above component types.

                for (const model of data) {

                    const result = await componentDataToCompiledHTML(child_comp, presets, model, template_map);

                    node.children.push(result.html[0]);
                }
            }
        }
    }
}

async function processHooks(
    html: DOMLiteral,
    component: ComponentData,
    presets: PresetOptions,
    model: any,
    node: TemplateHTMLNode,
    parent_components: ComponentData[],
    template_map: TemplatePackage["templates"],
) {
    for (const hook of getHookFromElement(html, component)
        .filter(
            h => (
                /**
                 * Container hooks are handled by processContainerHooks,
                 * which should be called only on container html elements
                 */
                h.type != ContainerDataHook &&
                h.type != ContainerFilterHook &&
                h.type != ContainerSortHook &&
                h.type != ContainerLimitHook &&
                h.type != ContainerOffsetHook &&
                h.type != ContainerScrubHook &&
                h.type != ContainerShiftHook
            )
        )
    ) {

        const { html, templates } = (await processHookForHTML(hook, component, presets, model, parent_components) || {});

        if (html) {
            if (html.attributes)
                for (const [k, v] of html.attributes)
                    if (v !== undefined)
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


async function resolveHTMLBinding(
    html: DOMLiteral,
    state: htmlState,
    node: TemplateHTMLNode,
    comp_data: string[],
    comp: ComponentData,
    presets: PresetOptions,
    model: any = null,
    parent_component: ComponentData[]
): Promise<TemplateHTMLNode> {
    //*
    const
        hook = getHookFromElement(html, comp)[0],
        { value, html: child_html } = hook
            ? await getStaticValue(<JSNode>hook.value[0], comp, presets, model, parent_component)
            : null;

    console.log({ html, b: hook.value, value });

    node.tagName = "w-b";

    if (child_html) {
        node.tagName = "w-e";
        const converted_node = buildExportableDOMNode(child_html);
        console.log({ converted_node });

        const { html } = await componentDataToCompiledHTML(
            comp,
            presets,
            model,
            undefined,
            converted_node
        );
        node.children.push(html[0]);

    } else if (value != undefined) {

        node.children.push({
            data: value + "",
            children: [],
            strings: [],
            attributes: null,
            tagName: null,
        });
    } else if (html.data) {
        node.data = html.data || "";
    }

    if ((state & htmlState.IS_INTERLEAVED) > 0)
        node.attributes.set("w:own", "" + comp_data.indexOf(comp.name));

    return node;
}

function getHookFromElement(ele: DOMLiteral, comp: ComponentData): IndirectHook[] {
    let hooks = [];

    for (const hook of comp.indirect_hooks) {
        if (hook.ele_index == ele.element_index)
            hooks.push(hook);
    }

    return hooks;
}
