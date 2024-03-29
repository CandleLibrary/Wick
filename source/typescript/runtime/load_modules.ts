import URI from '@candlelib/uri';
import { Context, UserPresets } from '../compiler/common/context.js';

/**
 * Loads ES6 modules from a source path. 
 * @param incoming_options 
 * @param extant_presets 
 */
export async function loadModules(incoming_options: UserPresets, extant_presets: Context) {

    for (const [id, url] of incoming_options?.repo ?? []) {

        if (!extant_presets.api[id]) {

            try {

                const uri = new URI(url);

                const
                    mod = await import(uri + "");

                extant_presets.api[id] = {
                    default: mod.default ?? null,
                    module: mod
                };

            } catch (e) {
                console.warn(new Error(`Could not load module ${url}`));
                console.error(e);
            }
        }
    }
}
