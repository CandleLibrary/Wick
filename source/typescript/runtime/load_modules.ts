import { PresetOptions } from "../types/presets.js";


export async function loadModules(presets: PresetOptions) {

    for (const repo of presets.repo.values()) {

        if (!repo.module) {

            try {

                const
                    mod = await import(repo.url);

                presets.api[repo.hash] = {
                    default: mod.default ?? null,
                    module: mod
                };

            } catch (e) {

                console.log(e);

            }
        }
    }
}
