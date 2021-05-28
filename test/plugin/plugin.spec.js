import { assert } from "console";
import Presets from "../../build/library/compiler/common/presets.js";
import { addPlugin, PluginStore } from "../../build/library/plugin/plugin.js";


assert_group("Base Plugin Function", () => {



    assert_group("Rejects invalid plugin specs", sequence, () => {
        assert("Invalid Type", !PluginStore.addSpec({ type: "anonymous" }));
        assert("No Type", !PluginStore.addSpec({}));
        assert("Invalid validateSpecifier function return type ", !PluginStore.addSpec({ type: "element-render-hook", validateSpecifier: () => 1 }));
        assert("Invalid validateSpecifier type", !PluginStore.addSpec({ type: "element-render-hook", validateSpecifier: null }));
        assert("Missing validateSpecifier", !PluginStore.addSpec({ type: "element-render-hook" }));
        assert("Missing requires array", !PluginStore.addSpec({ type: "element-render-hook", validateSpecifier: (str) => true }));
        assert("Missing defaultRecover function", !PluginStore.addSpec({ type: "element-render-hook", validateSpecifier: (str) => true, requires: ["serverHandler"] }));
        assert("Valid Spec", PluginStore.addSpec({ type: "element-render-hook", validateSpecifier: (str) => true, requires: ["serverHandler"], defaultRecover: async () => true }));
    });

    assert_group("Rejects invalid plugins", sequence, () => {
        const p = new Presets();

        PluginStore.addSpec({
            type: "test-hook",
            validateSpecifier: (str) => str == "tested",
            requires: ["clientHandler", "serverHandler"],
            defaultRecover: async () => true
        });
        assert("Invalid empty object", !addPlugin(p, {}));
        assert("Invalid array", !addPlugin(p, []));
        assert("Invalid plugin type: non string", !addPlugin(p, { type: null }));
        assert("Invalid plugin type: non existing plugin type", !addPlugin(p, { type: "non-exist" }));
        assert("Invalid specifier: no specifier", !addPlugin(p, { type: "test-hook" }));
        assert("Invalid specifier: wrong specifier type", !addPlugin(p, { type: "test-hook", specifier: 2 }));
        assert("Invalid specifier: missing requirement", !addPlugin(p, { type: "test-hook", specifier: "tested" }));
        assert("Valid Plugin", addPlugin(p, { type: "test-hook", specifier: "tested", async clientHandler() { }, async serverHandler() { } }));
    });

    assert_group("Handles plugin errors", sequence, () => {
        const p = new Presets();

        PluginStore.addSpec({
            type: "test-hook",
            validateSpecifier: (str) => str == "tested",
            requires: ["clientHandler", "serverHandler"],
            defaultRecover: async () => "default-val"
        });

        addPlugin(p, {
            type: "test-hook", specifier: "tested",

            clientHandler(data) {
                if (data != "data")
                    throw new Error("Throw for testing");
                return "client-val-" + data;
            },
            async serverHandler() { }
        });
        assert("Directly called plugin will crash", !p.plugins.getPlugin("test-hook", "tested").clientHandler(p, "test-hook", "tested", "data"));
        assert("Regular plugin functionality", "default-val" == await p.plugins.runClientPlugin(p, "test-hook", "tested", "data"));
        assert("Handles plugins that crash", "default-val" == await p.plugins.runClientPlugin(p, "test-hook", "tested", "datas"));
    });

});