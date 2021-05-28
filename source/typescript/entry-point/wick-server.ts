import URL from "@candlelib/url";
import HTML from "@candlelib/html";
import { RenderPage } from "../compiler/ast-render/webpage.js";
import { WickLibrary } from "./wick-full.js";

import wick from "./wick-full.js";

export interface WickServer {

    utils: {
        /**[API]
         * Builds a single page from a wick component, with the
         * designated component serving as the root element of the
         * DOM tree. Can be used to build a hydratable page.
         *
         * Optionally hydrates with data from an object serving as a virtual preset.
         *
         * Returns HTML markup and an auxillary script strings that
         * stores and registers hydration information.
         */
        RenderPage: typeof RenderPage;
    };
}

type WickServerLibrary = WickServer & WickLibrary;


const wick_server: WickServerLibrary = Object.assign(wick, <WickServer>{

    utils: {
        RenderPage: RenderPage
    }

});


// Initialize server version of dependencies
await URL.server();

await HTML.server();

export * from "./wick-full.js";

export default wick_server;