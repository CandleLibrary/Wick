import {source, scheme, model, core, internals} from "./config/library";

const wick_vanity = "\ \(\ \ \(\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \)\n\ \)\\\)\)\(\ \ \ \'\ \(\ \ \ \ \ \ \ \ \ \ \(\ \/\(\n\(\(\_\)\(\)\\\ \)\ \ \)\\\ \ \ \ \(\ \ \ \ \)\\\(\)\)\n\_\(\(\)\)\\\_\)\(\)\(\(\_\)\ \ \ \)\\\ \ \(\(\_\)\\\n\\\ \\\(\(\_\)\/\ \/\ \(\_\)\ \ \(\(\_\)\ \|\ \|\(\_\)\n\ \\\ \\\/\\\/\ \/\ \ \|\ \|\ \/\ \_\|\ \ \|\ \/\ \/\n\ \ \\\_\/\\\_\/\ \ \ \|\_\|\ \\\_\_\|\ \ \|\_\\\_\\\n";


let LINKER_LOADED = false;


/**
 *    Creates a new Router instance, passing any presets from the client.
 *    It will then wait for the document to complete loading then starts the Router and loads the current page into the Router.
 *
 *    Note: This function should only be called once. Any subsequent calls will not do anything.
 *    @method startRouting
 *    @param {Object | Presets} presets - An object of configuration data to pass to the Presets. {@link Presets}.
 */
function startRouting(presets = {}) {

    if (LINKER_LOADED) return;

    LINKER_LOADED = true;

    let router = new core.network.router(core.presets(presets));

    window.addEventListener("load", () => {
        router.loadPage(
            new core.network.url(document.location),
            router.loadNewPage(document.location.pathname, document),
            false
        );
    });

    console.log(`${wick_vanity}Copyright 2018 Anthony C Weathersby\nhttps://gitlab.com/anthonycweathersby/wick`);

    return {presets, router};
}

export {source};
export {scheme};
export {model};
export {core};
export {internals};
export { startRouting };