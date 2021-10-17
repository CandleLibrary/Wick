import { Argument } from "@candlelib/paraffin";
import URI from '@candlelib/uri';
import { WickCompileConfig } from "../../types/config";
import { mapEndpoints } from '../../server/load_directory.js';
import { Logger } from "@candlelib/log";

export const compile_logger = Logger.get("wick").get("config").activate();

export const default_config: WickCompileConfig = {
    globals: [],
    RESOLVE_HREF_ENDPOINTS: true,
    endpoint_mapper: mapEndpoints
};

export const config_arg_properties: Argument<WickCompileConfig> = {
    key: "config",
    REQUIRES_VALUE: true,
    default: default_config,
    transform: async (arg) => {

        let js_path: URI = URI.resolveRelative("./wickonfig.js");
        let json_path: URI = URI.resolveRelative("./wickonfig.json");

        if (typeof arg == "string") {

            const uri = new URI(arg);

            if (uri.ext == "json")
                json_path = URI.resolveRelative(uri);
            else
                js_path = URI.resolveRelative(uri);
        }

        let config = default_config;

        if (await js_path.DOES_THIS_EXIST()) {
            try {

                const user_config = (await import(js_path + "")).default || {};

                if (!user_config)
                    compile_logger.warn(`Unable to load config object from [ ${js_path + ""} ]:`);
                else
                    config = Object.assign({}, config, user_config);

            }
            catch (e) {
                compile_logger.error(`Unable to load config script [ ${js_path + ""} ]:`, e.message);
                throw e;
            }

            compile_logger.debug(`Loaded user wickonfig at:       [ ${js_path + ""} ]`);

        } else if (await json_path.DOES_THIS_EXIST()) {
            try {

                const user_config = await json_path.fetchJSON();

                if (!user_config)
                    compile_logger.warn(`Unable to load config object from [ ${json_path + ""} ]:`);
                else
                    config = Object.assign({}, config, user_config);

            }
            catch (e) {
                compile_logger.error(`Unable to load config script [ ${json_path + ""} ]:`);
                throw e;
            }

            compile_logger.debug(`Loaded user wickonfig at:       [ ${json_path + ""} ]`);
        }

        return config;
        //Look for a wickconfig.js file in the current directory 	
    },
    help_brief: `
A path to a wickonfig.js or wickonfig.json file. If this argument is not present then Wick will 
search the CWD for a wickonfig[ .js | .json ] file. If again not present, Wick
will use default built-in values.`
};
