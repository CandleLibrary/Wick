import { Argument } from "@candlelib/paraffin";
import URI from '@candlelib/uri';
import { WickCompileConfig } from "../../types/config";
import { mapEndpoints } from '../../server/load_directory.js';
import { Logger } from "@candlelib/log";

export const compile_logger = Logger.get("wick").activate().get("compile");

export const default_config: WickCompileConfig = {
    globals: [],
    RESOLVE_HREF_ENDPOINTS: true,
    endpoint_mapper: mapEndpoints
}

export const config_arg_properties: Argument<any> = {
    key: "config",
    REQUIRES_VALUE: true,
    default: default_config,
    transform: async (arg) => {

        let path: URI = URI.resolveRelative("./wickonfig.js");

        if (typeof arg == "string")
            path = URI.resolveRelative(arg);

        let config = default_config;

        if (await path.DOES_THIS_EXIST()) {
            try {

                const user_config = (await import(path + "")).default || null;

                if (!user_config)
                    compile_logger.warn(`Unable to load config object from [ ${path + ""} ]:`);
                else
                    config = Object.assign(config, user_config);

            }
            catch (e) {
                compile_logger.error(`Unable to load config script [ ${path + ""} ]:`);
                throw e;
            }

            compile_logger.debug(`Loaded user wickonfig at:       [ ${path + ""} ]`);
        }

        return config;
        //Look for a wickconfig.js file in the current directory 	
    },
    help_brief: `
A path to a wick-config.js file. If this argument is not present then Wick will 
search the CWD for a wick-config.js file. If this file is not present the wick
will use command line arguments and default values.
`
};
