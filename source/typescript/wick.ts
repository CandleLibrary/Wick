import { addModuleToCFW } from "@candlefw/cfw";
import { CSSTreeNodeType, CSSTreeNode, CSSRuleNode } from "@candlefw/css";
import { MinTreeNodeType, MinTreeNode } from "@candlefw/js";
import { renderWithFormatting } from "@candlefw/conflagrate";
import URL from "@candlefw/url";

import Presets from "./presets.js";
import makeComponent from "./component/component.js";
import { WickRTComponent, class_strings } from "./runtime/runtime_component.js";
import { rt } from "./runtime/runtime_global.js";
import { PresetOptions } from "./types/preset_options.js";
import {
    componentDataToJS,
    componentDataToJSCached,
    componentDataToJSStringCached,
    componentDataToClassString,
} from "./component/component_data_to_js.js";
import { componentDataToCSS } from "./component/component_data_to_css.js";
import { Component, VARIABLE_REFERENCE_TYPE, BindingVariable } from "./types/types.js";
import { DOMLiteral } from "./types/dom_literal.js";
import { ExtendedComponent } from "./types/extended_component";
import { componentDataToHTML } from "./component/component_data_to_html.js";
import parser from "./parser/parser.js";
import { WickASTNodeType, WickASTNodeClass, WickASTNode } from "./types/wick_ast_node_types.js";
import { renderers, format_rules } from "./format_rules.js";
import { ObservableModel, ObservableWatcher } from "./types/observable_model.js";
import { createNameHash } from "./component/component_create_hash_name.js";
import { css_selector_helpers } from "./component/css_selector_helpers.js";



/**
 * Creates a Wick component. test
 */
function wick(input: string | URL, presets: Presets = rt.presets): ExtendedComponent {

    // Ensure there is a presets object attached to this component.
    if (!presets)
        presets = new Presets();

    if (!rt.presets)
        rt.presets = presets;

    const
        promise = new Promise(async res => {
            const comp = await makeComponent(input, presets);
            Object.assign(component, comp);
            componentDataToJSCached(component, presets, true, false);
            componentDataToJSStringCached(component, presets, true, false);
            res(component);
        }),

        component = <ExtendedComponent><unknown>{
            get class() { return componentDataToJSCached(component, presets, true, false); },
            get classWithIntegratedCSS() { return componentDataToJS(component, presets, true, true); },
            get class_string() { return componentDataToJSStringCached(component, presets, true, false); },
            pending: promise,
            mount: async (model: any, ele: HTMLElement) => {

                await this.pending;

                const comp_inst = new this.class(model);

                ele.appendChild(comp_inst.ele);

                return comp_inst;
            }
        };

    Object.defineProperties(component, {

        /**
         * Create an instance of the component.
         */
        createInstance: {
            configurable: false,
            writable: false,
            value: function (model = null): ExtendedComponent {
                return <ExtendedComponent>new this.class(model);
            }
        },
    });

    return component;
}

Object.assign(wick, rt);

Object.defineProperty(wick, "class_strings", {
    value: class_strings,
    writable: false
});

Object.defineProperty(wick, "componentToClass", {
    value: componentDataToJS,
    writable: false
});

Object.defineProperty(wick, "componentToClassString", {
    value: componentDataToClassString,
    writable: false
});


/**
 * Wrapper is a special sudo element that allows interception,
 * injection, and modification of existing components by wrapping
 * it in another component that has full access to the original 
 * component. This can be used to create adhoc component editors.
 */
Object.defineProperty(wick, "setWrapper", {
    value: async function (url) {
        //create new component

        if (!rt.presets)
            rt.presets = new Presets();

        rt.presets.wrapper = wick(url);

        const comp = await rt.presets.wrapper.pending;

        componentDataToJSCached(comp, rt.presets);
    }
});

//Allow a component to be replaced inline
Object.defineProperty(WickRTComponent.prototype, "replace", {
    value:
        /**
         * Replace this component with the one passed in. 
         * The new component inherits the old one's element and model.
         */
        function (component: Component) {

            const comp_class = componentDataToJS(component, this.presets);

            const comp = new comp_class(this.model, this.wrapper);

            this.ele.replaceWith(comp.ele);

            this.wrapper = null;

            this.destructor();

            return comp;
        }
});

/**
 * Configure wick to run server side.
 */
Object.defineProperty(wick, "server", {
    value: async function (preset_options: PresetOptions) {
        await URL.polyfill();
    }
});

/**
 * Sets the presets object.
 */
Object.defineProperty(wick, "rt", {
    value: rt,
    writable: false,
});

addModuleToCFW(wick, "wick");

interface wickOutput {
    parse: {
        parser: typeof parser;
        render: (ast: MinTreeNode | WickASTNode | CSSTreeNode) => string;
    };
    Presets: typeof Presets;

    WickRTComponent: typeof WickRTComponent;

    componentDataToClassString: typeof componentDataToClassString,

    componentDataToClass: typeof componentDataToJS,

    types: {
        DOMLiteral: DOMLiteral,
        BindingVariable: BindingVariable,
        MinTreeNode: MinTreeNode,
        WickASTNode: WickASTNode,
        CSSTreeNode: CSSTreeNode,
        MinTreeNodeType: typeof MinTreeNodeType;
        CSSTreeNodeType: typeof CSSTreeNodeType;
        WickASTNodeType: typeof WickASTNodeType;
        WickASTNodeClass: typeof WickASTNodeClass;
        VARIABLE_REFERENCE_TYPE: typeof VARIABLE_REFERENCE_TYPE;
    };
}

Object.assign(wick, {
    parse: {
        css_selector_helpers: css_selector_helpers,
        createNameHash: createNameHash,
        parser,
        render: (ast) => renderWithFormatting(ast, renderers, format_rules, (str, name, node: any): string => {
            if (node.type == CSSTreeNodeType.Rule && name !== "@full_render")
                return `{${Array.from((<CSSRuleNode>node).props.values()).map(n => n + "").join(";\n")}}`;
            return str;
        })
    },

    css_selector_helpers,

    types: {
        MinTreeNodeType,
        CSSTreeNodeType,
        WickASTNodeType
    },
    Presets,
    WickRTComponent,
    componentDataToHTML,
    componentDataToCSS,
    componentDataToJSCached: componentDataToJSCached,
    componentDataToClass: componentDataToJS,
    componentDataToClassString,
});

export default wick;



export {
    ObservableModel,
    createNameHash,
    ObservableWatcher,
    wick,
    wickOutput,
    parser,
    Presets,
    Component,
    WickRTComponent,
    WickRTComponent as RuntimeComponent,
    componentDataToHTML,
    componentDataToCSS,
    componentDataToJS as componentDataToClass,
    componentDataToClassString,

    //Types
    DOMLiteral,
    BindingVariable,
    MinTreeNode,
    WickASTNode,
    CSSTreeNode,
    MinTreeNodeType,
    CSSTreeNodeType,
    WickASTNodeType,
    WickASTNodeClass,
    VARIABLE_REFERENCE_TYPE
};