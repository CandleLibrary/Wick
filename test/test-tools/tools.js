import html from "@candlefw/html";
import spark from "@candlefw/spark";

import { componentDataToTempAST, componentDataToHTML } from "../../build/library/component/compile/component_data_to_html.js";
import { hydrateComponentElements } from "../../build/library/runtime/runtime_html.js";

export function getInstanceHTML(comp, presets) {
    return componentDataToTempAST(comp, presets).html[0];
}

export function getRenderedHTML(comp, presets) {
    return componentDataToHTML(comp, presets).html;
}

export function createComponentInstance(comp, presets, model = null) {
    const ele = html(getRenderedHTML(comp, presets));

    const components = hydrateComponentElements([ele]);

    for (const r of components)
        r.hydrate();
    const runtime_component = components.pop();
    // spark.update();
    spark.update();

    return runtime_component;
}

export function assertTree(tree, ele, prev_name = "") {
    try {


        if (tree.t) {
            if (prev_name)
                prev_name += ">" + tree.t;
            else
                prev_name = tree.t;

            harness.pushTestResult();
            harness.pushName(`Expect ele [${ele?.tagName?.toLowerCase().trim()}] == [${prev_name}]`);
            harness.pushAndAssertValue(
                harness.shouldEqual(tree.t.toLowerCase().trim(), ele.tagName.toLowerCase().trim())
                && harness.shouldHaveProperty(ele, "tagName"));
            harness.popTestResult();
            harness.popName();
        } else if (prev_name)
            prev_name += ">{}";
        else
            prev_name = "{}";

        if (tree.a)
            for (const [k, v] in tree.a)
                if (k) {
                    harness.pushTestResult();
                    harness.pushName(`Element attribute ${prev_name}::${k} is present`);
                    harness.pushAndAssertValue(harness.shouldEqual(ele.hasAttribute(k) == true));
                    harness.popTestResult();
                    harness.popName();
                    if (v) {
                        harness.pushTestResult();
                        harness.pushName(`Element attribute ${prev_name}::${k} is ${v}`);
                        harness.pushAndAssertValue(harness.shouldEqual(ele.getAttribute(k) == v));
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
            const children = ele.childNodes;
            for (let i = 0; i < tree.c.length; i++) {
                if (tree.c[i])
                    assertTree(tree.c[i], children[i], prev_name);
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