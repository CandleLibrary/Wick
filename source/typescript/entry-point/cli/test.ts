import {
    createTestFrame,
    createTestSuite,
    loadTests,
    BasicReporter
} from "@candlelib/cure";
import { Logger } from "@candlelib/log";
import { addCLIConfig } from "@candlelib/paraffin";
import URI from '@candlelib/uri';
import { Context } from "../../compiler/common/context.js";
import { loadComponentsFromDirectory } from '../../server/load_directory.js';
import { config_arg_properties } from "./config_arg_properties.js";
import { componentDataToJSStringCached } from "../../compiler/ast-render/js.js"
import { getDependentComponents } from "../../compiler/ast-render/webpage.js"
import { processBindingASTAsync } from "source/typescript/compiler/ast-parse/html.js";

export const test_logger = Logger.get("wick").get("test").activate();

const config_arg = addCLIConfig("test", config_arg_properties);

addCLIConfig<URI>("test", {
    key: "test",
    help_brief: `
Test components that have been defined with the \`@test\` synthetic import
`
}).callback = (
        async (args) => {

            const input_path = URI.resolveRelative(args.trailing_arguments.pop() ?? "./");
            const root_directory = URI.resolveRelative(input_path);
            const config = config_arg.value;


            test_logger
                .debug(`Input root path:                [ ${input_path + ""} ]`);

            //Find all components
            //Build wick and radiate files 
            //Compile a list of entry components
            const context = new Context();

            context.assignGlobals(config.globals ?? {});

            test_logger
                .log(`Loading resources from:         [ ${root_directory + ""} ]`);

            await loadComponentsFromDirectory(
                root_directory, context, config.endpoint_mapper
            );

            const test_sources = []
            const suites = [];
            const test_frame = createTestFrame({
                watch: false,
                BROWSER_HEADLESS: true,
                number_of_workers: 1,

            });

            await test_frame.init();

            test_frame.setReporter(new BasicReporter)

            let i = 0;

            for (const [, component] of context.components) {

                if (context.test_rig_sources.has(component)) {

                    const test_suite = createTestSuite(
                        component.location + "",
                        i++,
                    )

                    test_suite.name = component.name + ` tests`;

                    suites.push(test_suite);

                    let source_string = context.test_rig_sources.get(component).join("\n\n");

                    const components = getDependentComponents(component, context);

                    const component_strings = [];

                    for (const comp of components) {

                        const { class_string } = await componentDataToJSStringCached(
                            comp, context, true, true, "wick.rt.C"
                        );

                        component_strings.push(`wick.rt.rC(${class_string})`);
                    }

                    const test_source = `
import spark from "@candlelib/spark";

import wick from "@candlelib/wick";

await wick.appendPresets({});

${component_strings.join("\n")};

const comp = new (wick.rt.gC("${component.name}"))();

comp.hydrate();

comp.initialize();

const component = comp;
const ele = comp.ele;
const root = comp.ele;

comp.appendToDOM(document.body);

await spark.sleep(10);

${source_string}
`
                    loadTests(test_source, test_suite, test_frame.globals);

                    for (const test of test_suite.tests) {
                        test.BROWSER = true;
                    }
                }
            }

            await test_frame.start(suites);
        }
    );
