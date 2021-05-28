import html from "@candlelib/html";
import spark from "@candlelib/spark";

import { htmlTemplateToString } from "../../build/library/compiler/ast-render/html.js";
import { componentDataToTempAST } from "../../build/library/compiler/ast-compile/html.js";
import { hydrateComponentElements } from "../../build/library/runtime/html.js";
import Presets from "../../build/library/compiler/common/presets.js";
import { parseSource } from "../../build/library/compiler/ast-parse/source.js";
import { createCompiledComponentClass } from "../../build/library/compiler/ast-compile/compile.js";
import { createClassStringObject, componentDataToJS } from "../../build/library/compiler/ast-render/js.js";

export async function getInstanceHTML(comp, presets) {
    return (await componentDataToTempAST(comp, presets)).html[0];
}

export async function getRenderedHTML(comp, presets) {
    const html = (await componentDataToTempAST(comp, presets)).html[0];
    return htmlTemplateToString(html);
}

function ensurePresets(presets = new Presets) {
    return presets || new Presets;
}

export async function getHTMLString(source_string, presets) {
    presets = ensurePresets(presets);
    const component = await parseSource(source_string, presets);
    const html = (await componentDataToTempAST(component, presets)).html[0];
    return htmlTemplateToString(html);
}

export async function getClassString(source_string, presets) {
    presets = ensurePresets(presets);
    const component = await parseSource(source_string, presets);
    const comp_info = await createCompiledComponentClass(component, presets);
    return createClassStringObject(component, comp_info, presets).class_string;
}

export async function getCompInstance(source_string, model = null, presets = null) {
    presets = ensurePresets(presets);
    const component = await parseSource(source_string, presets);
    const comp_info = await createCompiledComponentClass(component, presets);
    return new (componentDataToJS(component, comp_info, presets))(presets, model);
}


export async function createComponentInstance(comp, presets, model = null) {
    const ele = html(await getRenderedHTML(comp, presets));

    const components = hydrateComponentElements([ele]);

    for (const r of components)
        r.hydrate();
    const runtime_component = components.pop();
    // spark.update();
    spark.update();

    return runtime_component;
}

function getAttribute(ele, k) {
    if (ele.getAttribute)
        return ele.getAttribute(k);

    if (ele.attributes) {
        if (ele.attributes instanceof Map)
            return ele.attributes.get(k);

        else if (Array.isArray(ele.attributes))
            for (const [key, v] of ele.attributes)
                if (k == key) return v;
    }
}

export function assertTree(tree, ele, prev_name = "") {
    let OPEN_TEST = false;
    try {


        if (tree.t) {
            if (prev_name)
                prev_name += "" + tree.t;
            else
                prev_name = tree.t;

            harness.pushTestResult();
            harness.pushName(`Expect ele tag [${ele?.tagName?.toLowerCase().trim()}] == [${prev_name}]`);
            harness.pushAndAssertValue(
                harness.shouldEqual(tree.t.toLowerCase().trim(), ele?.tagName?.toLowerCase().trim())
                && harness.shouldHaveProperty(ele, "tagName"));
            harness.popTestResult();
            harness.popName();
        } else if (prev_name)
            prev_name += "{}";
        else
            prev_name = "{}";

        if (tree.a)
            for (const [k, v] of tree.a)
                if (k) {
                    harness.pushTestResult();
                    harness.pushName(`Element attribute ${prev_name}::[${k}] is present`);
                    harness.pushAndAssertValue(harness.shouldNotEqual(getAttribute(ele, k), undefined));
                    harness.popTestResult();
                    harness.popName();
                    if (v) {
                        harness.pushTestResult();
                        harness.pushName(`Element attribute ${prev_name}::[${k}=${getAttribute(ele, k)}] == ${v} `);
                        harness.pushAndAssertValue(harness.shouldEqual(getAttribute(ele, k), v));
                        harness.popTestResult();
                        harness.popName();
                    }
                }

        if (tree.d || tree.d == "") {
            harness.pushTestResult();
            harness.pushName(`Expect [${prev_name}=="${ele.data.trim()}"] == "${tree.d.trim()}"`);
            harness.pushAndAssertValue(harness.shouldEqual(ele.data.trim(), tree.d.trim()));
            harness.popTestResult();
            harness.popName();
        }

        if (tree.c) {
            const children = ele.childNodes || ele.children;
            for (let i = 0; i < tree.c.length; i++) {
                if (tree.c[i])
                    assertTree(tree.c[i], children[i], prev_name + `>${1 + i}:`);
            }
        }

    } catch (e) {
        harness.pushTestResult();
        harness.pushName(`Error encountered when comparing ${JSON.stringify(tree)}`);
        harness.addException(e);
        harness.popTestResult();
        harness.popName();
    }

}