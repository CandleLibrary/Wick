import { addCLIConfig } from "@candlelib/paraffin";
import URI from '@candlelib/uri';
import { Logger } from "@candlelib/log";
import { config_arg_properties } from "./config_arg_properties.js";

export const compile_logger = Logger.get("wick").activate().get("compile");

const config_arg = addCLIConfig("test", config_arg_properties);

addCLIConfig<URI>("test", {
    key: "test",
    help_brief: `
Test components using the \`@test\` synthetic import
`
}).callback = (
        async (args) => {
            console.log(config_arg)
            compile_logger.log("SHOULD BE TESTING NOW");
        }
    );
