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
import { getExpressionStaticResolutionType, getStaticValue, StaticDataPack } from "../data/static_resolution.js";
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


export async function componentDataToCompiledHTML(
    comp: ComponentData,
    context: Context = rt.context,
    model = null,
) {
    const static_data_pack: StaticDataPack = {
        context,
        self: comp,
        model: model,
        root_element: comp.HTML,
        prev: null
    };

    return __componentDataToCompiledHTML__(
        comp.HTML,
        static_data_pack,
    );
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
export async function __componentDataToCompiledHTML__(
    html: HTMLNode,
    static_data_pack: StaticDataPack,
    template_map: TemplatePackage["templates"] = new Map,
    state: htmlState = htmlState.IS_ROOT | htmlState.IS_COMPONENT,
    extern_children: { USED: boolean; child: HTMLNode; id: number; }[] = [],
    comp_data = [static_data_pack.self.name]
): Promise<TemplatePackage> {

    const {
        context,
    } = static_data_pack;

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
                static_data_pack,
                state,
                comp_data,
                template_map,
                node
            );

        else if (component_name && context.components.has(component_name)) {


            ({ node, state } =
                await addComponent(
                    html,
                    static_data_pack,
                    component_name,
                    state,
                    node,
                    template_map,
                    extern_children,
                    children,
                    comp_data,
                )
            );

        } else if (tag_name) {

            if (tag_name == "SLOT" && extern_children.length > 0) {

                let r_ = await processSlot(
                    static_data_pack,
                    template_map,
                    slot_name,
                    extern_children,
                );

                if (r_.html.length > 0)
                    return r_;
            }

            await processElement(html, static_data_pack, node, tag_name, state, comp_data, template_map);

        } else if ("IS_BINDING" in html)
            node = await resolveHTMLBinding(html, static_data_pack, state, node, comp_data);
        else if ("data" in html)
            processTextNode(node, html.data);

        const child_state = (((state) & (htmlState.IS_INTERLEAVED | htmlState.IS_COMPONENT))
            == (htmlState.IS_INTERLEAVED | htmlState.IS_COMPONENT))
            ? htmlState.IS_INTERLEAVED : 0;

        for (const { child } of children.filter(n => !n.USED)) {

            const { html } = await __componentDataToCompiledHTML__(
                child,
                static_data_pack,
                template_map,
                child_state,
                extern_children,
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
    static_data_pack: StaticDataPack,
    node: TemplateHTMLNode,
    tag_name: string,
    state: htmlState,
    comp_data: string[],
    template_map: TemplatePackage["templates"]
) {
    await processHooks(html, static_data_pack, node, template_map);

    const COMPONENT_IS_ROOT_ELEMENT = static_data_pack.self.HTML == html;

    node.tagName = tag_name.toLocaleLowerCase();

    setScopeAssignment(state, node, html);

    const HAVE_CLASS = processAttributes(html.attributes, state, comp_data, node, static_data_pack.self.HTML == html);

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
        node.attributes.set("w:own", "" + comp_data.indexOf(static_data_pack.self.name));
    }
}

function setScopeAssignment(state: htmlState, node: TemplateHTMLNode, html: HTMLElementNode) {
    if (state & htmlState.IS_SLOT_REPLACEMENT)
        node.attributes.set("w:r", (html.host_component_index * 50 + html.id) + "");
}

async function processSlot(
    static_data_pack: StaticDataPack,
    template_map: TemplatePackage["templates"],
    slot_name: string,
    extern_children: { USED: boolean; child: HTMLNode; id: number; }[],
): Promise<TemplatePackage> {
    let r_: TemplatePackage = { html: [], templates: template_map };

    if (slot_name != "") {

        for (let i = 0; i < extern_children.length; i++) {

            const pkg = extern_children[i];

            if (pkg.child.slot_name == slot_name && !pkg.USED) {
                pkg.USED = true;
                pkg.child.host_component_index = pkg.id;
                r_.html.push(...(await __componentDataToCompiledHTML__(
                    pkg.child,
                    static_data_pack,
                    template_map,
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
                r_.html.push(...(await __componentDataToCompiledHTML__(
                    pkg.child,
                    static_data_pack,
                    template_map,
                    htmlState.IS_SLOT_REPLACEMENT
                )).html);
            }
        }
    }
    return r_;
}

function processAttributes(
    attributes: HTMLElementNode["attributes"],
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
    static_data_pack: StaticDataPack,
    component_name: string,
    state: htmlState,
    node: TemplateHTMLNode,
    template_map: TemplatePackage["templates"],
    extern_children: { USED: boolean; child: HTMLNode; id: number; }[],
    children: { USED: boolean; child: HTMLNode; id: number; }[],
    comp_data: string[],
) {

    const { context, self: comp, model } = static_data_pack;

    const c_comp = context.components.get(component_name);

    if (htmlState.IS_COMPONENT & state)
        state |= htmlState.IS_INTERLEAVED;

    const new_static_data_pack: StaticDataPack = {
        root_element: html || c_comp.HTML,
        self: c_comp,
        model: null,
        context: context,
        prev: static_data_pack
    };

    ({ html: [node] } = await __componentDataToCompiledHTML__(
        c_comp.HTML,
        new_static_data_pack,
        template_map,
        state,
        extern_children.concat(children),
        [...comp_data, c_comp.name]
    ));

    //Merge node attribute data with host entry data, overwrite if necessary

    processAttributes(
        html.attributes,
        state,
        comp_data,
        node,
        comp.HTML == html
    );

    return { state, node };
}

async function addContainer(
    html: HTMLContainerNode,
    static_data_pack: StaticDataPack,
    state: htmlState,
    comp_data: string[],
    template_map: TemplatePackage["templates"],
    node: TemplateHTMLNode,
) {
    const {
        self: component,
        context,
    } = static_data_pack;
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

    const name = html.tag.toLowerCase();

    if (name == "container")
        node.tagName = "div";
    else
        node.tagName = name;

    node.attributes.set("w:ctr", w_ctr);

    node.attributes.set("w:ctr-atr", w_ctr_atr);

    setScopeAssignment(state, node, html);

    //get data hook 
    await processHooks(html, static_data_pack, node, template_map);

    await processContainerHooks(html, static_data_pack, node, template_map);

    processAttributes(html.attributes, state, comp_data, node, component.HTML == html);
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
    static_data_pack: StaticDataPack,
    node: TemplateHTMLNode,
    template_map: TemplatePackage["templates"],
) {
    const
        hooks = getHookFromElement(html, static_data_pack.self),
        data_hook = hooks.find(t => t.type == ContainerDataHook),
        filter_hook = hooks.find(t => t.type == ContainerFilterHook),
        sort_hook = hooks.find(t => t.type == ContainerSortHook),
        limit_hook = hooks.find(t => t.type == ContainerLimitHook),
        offset_hook = hooks.find(t => t.type == ContainerOffsetHook),
        shift_hook = hooks.find(t => t.type == ContainerShiftHook),
        use_if_hooks = hooks.filter(t => t.type == ContainerUseIfHook);




    if (data_hook) {

        let { value: data } = await processHookForHTML(data_hook, static_data_pack);

        if (Array.isArray(data) && data.length > 0) {


            let limit = data.length, offset = 0, shift = 1;

            if (filter_hook) {
                const { value: arrow_filter } = await processHookForHTML(filter_hook, static_data_pack);

                if (arrow_filter)
                    data = data.filter(arrow_filter);
            }

            if (sort_hook) {
                const { value: sort_filter } = await processHookForHTML(sort_hook, static_data_pack);

                if (sort_filter)
                    data = data.sort(sort_filter);
            }

            if (limit_hook) {
                const { value: pending_limit } = await processHookForHTML(limit_hook, static_data_pack);

                if (typeof pending_limit == "number")
                    limit = Math.max(0, Math.min(pending_limit, data.length));
            }

            if (shift_hook) {
                const { value: pending_shift } = await processHookForHTML(shift_hook, static_data_pack);

                if (typeof pending_shift == "number")
                    shift = Math.max(1, pending_shift);
            }

            if (offset_hook) {
                const { value: pending_offset } = await processHookForHTML(offset_hook, static_data_pack);

                if (typeof pending_offset == "number")
                    offset = Math.max(0, Math.min(pending_offset, data.length));
            }

            data = data.slice(offset * shift, offset * shift + limit);

            if (data.length > 0) {

                const

                    comp_name = html.component_names[0],

                    child_comp = static_data_pack.context.components.get(comp_name);

                //Don't forget use-if hooks which may be present in the above component types.

                for (const model of data) {

                    const new_static_data_pack: StaticDataPack = {
                        self: child_comp,
                        root_element: child_comp.HTML,
                        context: static_data_pack.context,
                        model: model,
                        prev: static_data_pack
                    };

                    const result = await __componentDataToCompiledHTML__(child_comp.HTML, new_static_data_pack, template_map);

                    node.children.push(result.html[0]);
                }
            }
        }
    }
}

async function processHooks(
    html: HTMLNode,
    static_data_pack: StaticDataPack,
    node: TemplateHTMLNode,
    template_map: TemplatePackage["templates"],
) {
    for (const hook of getHookFromElement(html, static_data_pack.self)
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

        const { html, templates } = (await processHookForHTML(hook, static_data_pack) || {});

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
    static_data_pack: StaticDataPack,
    state: htmlState,
    node: TemplateHTMLNode,
    comp_data: string[],
): Promise<TemplateHTMLNode> {
    //*
    const
        hook = getHookFromElement(html, static_data_pack.self)[0],
        type = getExpressionStaticResolutionType(hook.value[0], static_data_pack),
        { value, html: child_html } = hook
            ? await getStaticValue(<any>hook.value[0], static_data_pack)
            : null;

    node.tagName = "w-b";

    if (child_html) {
        node.tagName = "w-e";

        const { html } = await __componentDataToCompiledHTML__(
            child_html,
            static_data_pack
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
        node.attributes.set("w:own", "" + comp_data.indexOf(static_data_pack.self.name));

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
