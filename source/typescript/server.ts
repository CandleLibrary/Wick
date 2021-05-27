import URL from "@candlelib/url";
export interface WickServer {
    /**
    */
    server: () => Promise<void>;
}

let ACTIVATION_GUARD = false;
export const srv: WickServer = {

    server: async function () {

        if (ACTIVATION_GUARD) return;

        ACTIVATION_GUARD = true;

        //Polyfill document data
        await URL.server();

        await (await import("@candlelib/html")).default.server();
    }
};
