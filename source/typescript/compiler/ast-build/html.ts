import { rt } from "../../runtime/global.js";
import {
    HTMLContainerNode,
    HTMLElementNode,
    HTMLNode,
    htmlState,
    IndirectHook,
    STATIC_RESOLUTION_TYPE,
    TemplateHTMLNode,
    TemplatePackage,
    WickBindingNode
} from "../../types/all.js";
import * as b_sys from "../build_system.js";
import { ComponentData } from '../common/component.js';
import { Context } from '../common/context.js';
import { getExpressionStaticResolutionType, getStaticValue } from "../data/static_resolution.js";
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
import { processHookForHTML } from "./hooks.js";

enum HTMLAnnotationMode {
    /** 
     * Remove All Wick Attribute Annotations 
     *
     * Useful when the output is not expected
     * to be used with hydrated runtime components.
     */
    PURE,

    /**
     * Annotate Binding Elements Only
     * 
     * Only provide annotations for elements
     * that will be modified in some way by
     * a Wick runtime component.
     */

    MINIMAL,

    /**
     * Annotate Anything And Everything
     * 
     * Do not remove any annotation attribute.
     * Needed by Flame edit system to correctly
     * synchronize changes between browser and 
     * backend edit server.
     */
    VERBOSE,
}


/**
 * Compile component HTML information (including child component and slot information), into a string containing the components html
 * tree and template html elements for components referenced in containers.
 *
 * @param comp
 * @param context
 * @param template_map
 * @param html
 * @param root
 */
export async function componentDataToCompiledHTML(
    comp: ComponentData,
    context: Context = rt.context,
    model = null,
    template_map: TemplatePackage["templates"] = new Map,
    html: HTMLNode = comp.HTML,
    state: htmlState = htmlState.IS_ROOT | htmlState.IS_COMPONENT,
    extern_children: { USED: boolean; child: HTMLNode; id: number; }[] = [],
    parent_component: ComponentData = null,
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
            tag: tag_name = "",
            nodes: c = [],
            component_name: component_name,
            slot_name: slot_name,
            name_space: namespace_id
        }: HTMLNode = html,
            children = c.map(i => ({ USED: false, child: i, id: comp_data.length - 1 }));

        if (html.id !== undefined)
            node.attributes.set("w:u", html.id + "");

        if (namespace_id)
            node.namespace = namespace_id;

        if ("IS_CONTAINER" in html && html.IS_CONTAINER)
            await addContainer(
                html,
                comp,
                context,
                state,
                comp_data,
                template_map,
                node,
                model,
                parent_component
            );

        else if (component_name && context.components.has(component_name)) {

            ({ node, state } =
                await addComponent(
                    html,
                    context,
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

                let r_ = await processSlot(template_map, slot_name, extern_children, parent_component, context, model);

                if (r_.html.length > 0)
                    return r_;
            }

            await processElement(html, comp, context, model, node, parent_component, tag_name, state, comp_data, template_map);

        } else if ("IS_BINDING" in html)
            node = await resolveHTMLBinding(html, state, node, comp_data, comp, context, model, parent_component);
        else if ("data" in html)
            processTextNode(node, html.data);

        const child_state = (((state) & (htmlState.IS_INTERLEAVED | htmlState.IS_COMPONENT))
            == (htmlState.IS_INTERLEAVED | htmlState.IS_COMPONENT))
            ? htmlState.IS_INTERLEAVED : 0;

        for (const { child } of children.filter(n => !n.USED)) {

            const { html } = await componentDataToCompiledHTML(
                comp,
                context,
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

async function processElement(
    html: HTMLElementNode,
    comp: ComponentData,
    context: Context,
    model: any,
    node: TemplateHTMLNode,
    parent_component: ComponentData,
    tag_name: string,
    state: htmlState,
    comp_data: string[],
    template_map: TemplatePackage["templates"]
) {
    await processHooks(html, comp, context, model, node, parent_component, template_map);

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

function setScopeAssignment(state: htmlState, node: TemplateHTMLNode, html: HTMLElementNode) {
    if (state & htmlState.IS_SLOT_REPLACEMENT)
        node.attributes.set("w:r", (html.host_component_index * 50 + html.id) + "");
}

async function processSlot(
    template_map: TemplatePackage["templates"],
    slot_name: string,
    extern_children: { USED: boolean; child: HTMLNode; id: number; }[],
    parent_component: ComponentData,
    context: Context,
    model: any
): Promise<TemplatePackage> {
    let r_: TemplatePackage = { html: [], templates: template_map };

    if (slot_name != "") {

        for (let i = 0; i < extern_children.length; i++) {

            const pkg = extern_children[i];

            if (pkg.child.slot_name == slot_name && !pkg.USED) {
                pkg.USED = true;
                pkg.child.host_component_index = pkg.id;
                r_.html.push(...(await componentDataToCompiledHTML(
                    parent_component,
                    context,
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
                    context,
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
    attributes: HTMLElementNode["attributes"],
    comp: ComponentData,
    state: htmlState,
    comp_data: string[],
    node: TemplateHTMLNode,
    COMPONENT_IS_ROOT_ELEMENT: boolean
) {

    if (!attributes)
        return false;

    let HAVE_CLASS: boolean = false;

    for (const { name: key, value: val } of attributes ?? [])

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
            node.attributes.set(key, val.toString());

    return HAVE_CLASS;
}


async function addComponent(
    html: HTMLElementNode,
    context: Context,
    component_name: string,
    state: htmlState,
    node: TemplateHTMLNode,
    template_map: TemplatePackage["templates"],
    extern_children: { USED: boolean; child: HTMLNode; id: number; }[],
    children: { USED: boolean; child: HTMLNode; id: number; }[],
    comp: ComponentData,
    comp_data: string[],
    model: any = null
) {
    const c_comp = context.components.get(component_name);

    if (htmlState.IS_COMPONENT & state)
        state |= htmlState.IS_INTERLEAVED;

    ({ html: [node] } = await componentDataToCompiledHTML(
        c_comp,
        context,
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
    html: HTMLContainerNode,
    component: ComponentData,
    context: Context,
    state: htmlState,
    comp_data: string[],
    template_map: TemplatePackage["templates"],
    node: TemplateHTMLNode,
    model: any = null,
    parent_components: ComponentData = null
) {
    const {
        component_attributes: component_attribs,
        component_names
    } = html,
        w_ctr = component_names.join(" "),
        w_ctr_atr = component_attribs.map(s => s.map(a => a.join(("=").replace(/\"/g, ""))).join(";")).join(":");

    for (const name of component_names) {

        const comp = context.components.get(name);

        if (!template_map.has(comp.name) && comp.name != component.name) {

            await ensureComponentHasTemplates(comp, context);

            for (const name of comp.templates)
                template_map.set(name, context.components.get(name).template);

            template_map.set(comp.name, comp.template);

        }
    }

    node.tagName = html.tag.toLowerCase();

    node.attributes.set("w:ctr", w_ctr);

    node.attributes.set("w:ctr-atr", w_ctr_atr);

    setScopeAssignment(state, node, html);

    //get data hook 
    await processHooks(html, component, context, model, node, parent_components, template_map);

    await processContainerHooks(html, component, context, model, node, parent_components, template_map);

    processAttributes(html.attributes, component, state, comp_data, node, component.HTML == html);
}


export async function ensureComponentHasTemplates(
    comp: ComponentData,
    context: Context
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

        const { html, templates } = await componentDataToCompiledHTML(comp, context);

        comp.template.children.push(...html);

        comp.templates = new Set([comp.name, ...templates.keys()]);

        b_sys.disableBuildFeatures();
    }

    return comp.template;
}

async function processContainerHooks(
    html: HTMLContainerNode,
    component: ComponentData,
    context: Context,
    model: any,
    node: TemplateHTMLNode,
    parent_components: ComponentData,
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

        let data = await processHookForHTML(data_hook, component, context, model, parent_components);

        if (Array.isArray(data) && data.length > 0) {

            let limit = data.length, offset = 0, shift = 1;

            if (filter_hook) {
                const arrow_filter = await processHookForHTML(filter_hook, component, context, model, parent_components);

                if (arrow_filter)
                    data = data.filter(arrow_filter);
            }

            if (sort_hook) {
                const sort_filter = await processHookForHTML(sort_hook, component, context, model, parent_components);

                if (sort_filter)
                    data = data.sort(sort_filter);
            }

            if (limit_hook) {
                const pending_limit = await processHookForHTML(limit_hook, component, context, model, parent_components);

                if (typeof pending_limit == "number")
                    limit = Math.max(0, Math.min(pending_limit, data.length));
            }

            if (shift_hook) {
                const pending_shift = await processHookForHTML(shift_hook, component, context, model, parent_components);

                if (typeof pending_shift == "number")
                    shift = Math.max(1, pending_shift);
            }

            if (offset_hook) {
                const pending_offset = await processHookForHTML(offset_hook, component, context, model, parent_components);

                if (typeof pending_offset == "number")
                    offset = Math.max(0, Math.min(pending_offset, data.length));
            }

            data = data.slice(offset * shift, offset * shift + limit);

            if (data.length > 0) {

                const

                    comp_name = html.component_names[0],

                    child_comp = context.components.get(comp_name);

                //Don't forget use-if hooks which may be present in the above component types.

                for (const model of data) {

                    const result = await componentDataToCompiledHTML(child_comp, context, model, template_map);

                    node.children.push(result.html[0]);
                }
            }
        }
    }
}

async function processHooks(
    html: HTMLNode,
    component: ComponentData,
    context: Context,
    model: any,
    node: TemplateHTMLNode,
    parent_components: ComponentData,
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

        const { html, templates } = (await processHookForHTML(hook, component, context, model, parent_components) || {});

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
    html: WickBindingNode,
    state: htmlState,
    node: TemplateHTMLNode,
    comp_data: string[],
    comp: ComponentData,
    context: Context,
    model: any = null,
    parent_component: ComponentData
): Promise<TemplateHTMLNode> {
    //*
    const
        hook = getHookFromElement(html, comp)[0],
        type = getExpressionStaticResolutionType(hook.value[0], comp, context),
        { value, html: child_html } = hook
            ? await getStaticValue(<any>hook.value[0], comp, context, model, parent_component)
            : null;

    node.tagName = "w-b";

    if (child_html) {
        node.tagName = "w-e";

        const { html } = await componentDataToCompiledHTML(
            comp,
            context,
            model,
            undefined,
            child_html
        );
        node.children.push(html[0]);

    } else if (value != undefined) {
        if (type == STATIC_RESOLUTION_TYPE.CONSTANT_STATIC) {
            node = {
                data: value + "",
                children: [],
                strings: [],
                attributes: null,
                tagName: null,
            };
        } else {
            node.children.push({
                data: value + "",
                children: [],
                strings: [],
                attributes: null,
                tagName: null,
            });
        }
    } else if (html.data) {
        node.data = html.data || "";
    }

    if ((state & htmlState.IS_INTERLEAVED) > 0)
        node.attributes.set("w:own", "" + comp_data.indexOf(comp.name));

    return node;
}

function getHookFromElement(ele: HTMLNode, comp: ComponentData): IndirectHook<any>[] {
    let hooks = [];

    for (const hook of comp.indirect_hooks) {
        if (hook.ele_index == ele.id)
            hooks.push(hook);
    }

    return hooks;
}
