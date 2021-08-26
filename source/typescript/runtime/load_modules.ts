import URI from '@candlelib/uri';
import { PresetOptions, UserPresets } from "../types/presets.js";


export async function loadModules(incoming_options: UserPresets, extant_presets: PresetOptions) {

    for (const [id, url] of incoming_options.repo) {

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
            }
        }
    }
}
