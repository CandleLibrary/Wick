import {
    BasicReporter, compileTestsFromAST, createTestFrame,
    createTestSuite
} from "@candlelib/cure";
import { JSNode, JSNodeType } from '@candlelib/js';
import { Logger } from "@candlelib/log";
import { addCLIConfig } from "@candlelib/paraffin";
import URI from '@candlelib/uri';
import { ComponentData } from 'source/typescript/compiler/common/component.js';
import { createCompiledComponentClass, finalizeBindingExpression, processInlineHooks } from '../../compiler/ast-build/build.js';
import { componentDataToJSStringCached } from "../../compiler/ast-render/js.js";
import { getDependentComponents } from "../../compiler/ast-render/webpage.js";
import { Context } from "../../compiler/common/context.js";
import { parse_component } from '../../compiler/source-code-parse/parse.js';
import { loadComponentsFromDirectory } from '../../server/load_directory.js';
import { config_arg_properties } from "./config_arg_properties.js";

export const test_logger = Logger.get("wick").get("test").activate();


const config_arg = addCLIConfig("test", config_arg_properties);

addCLIConfig("test", {
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

            const test_sources = [];
            const suites = [];
            const test_frame = createTestFrame({
                WATCH: false,
                BROWSER_HEADLESS: true,
                number_of_workers: 1,
            });

            await test_frame.init();

            test_frame.setReporter(new BasicReporter);

            let i = 0;

            for (const [, component] of context.components) {

                if (context.test_rig_sources.has(component)) {
                    test_logger.log("Compiling tests for:\n   ->" + component.location + "");

                    const test_suite = createTestSuite(
                        component.location + "",
                        i++,
                    );

                    test_suite.name = component.name + ` tests`;

                    suites.push(test_suite);

                    let source_string = context.test_rig_sources.get(component);

                    const components = getDependentComponents(component, context);

                    const component_strings = [];

                    for (const comp of components) {

                        const { class_string } = await componentDataToJSStringCached(
                            comp, context, true, true, "wick.rt.C"
                        );

                        component_strings.push(`wick.rt.rC(${class_string})`);
                    }

                    const comp_class = await createCompiledComponentClass(component, context, false, false);

                    const test_source = test_script_template(component_strings, component);

                    const source = <JSNode>parse_component(test_source).ast;

                    const ast: JSNode = {
                        type: JSNodeType.Module,
                        nodes: [...source_string],
                        pos: component.root_frame.ast.pos
                    };

                    await processInlineHooks(component, context, ast, comp_class);

                    const test_source_ast = (await finalizeBindingExpression(
                        ast,
                        component,
                        comp_class,
                        context,
                        "comp"
                    )).ast;

                    //@ts-ignore
                    source.nodes.push(...test_source_ast.nodes);

                    compileTestsFromAST(source, test_suite, test_frame.globals);

                    for (const test of test_suite.tests) {
                        test.BROWSER = true;
                    }
                }
            }

            if (suites.length > 0) {
                test_logger.log("Running tests:");
                await test_frame.start(suites);
            } else
                test_logger.log("No tests were found. Exiting");
        }
    );

function test_script_template(component_strings: any[], component: ComponentData) {
    return `
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
`;
}
