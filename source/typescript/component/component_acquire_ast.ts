import URL from "@candlefw/url";
import parseStringReturnAST from "../parser/parse.js";

export async function acquireComponentASTFromRemoteSource(url_source: URL | string, root_url?: URL) {

    const url = URL.resolveRelative(url_source + "", root_url || URL.GLOBAL),
        error = [];

    let ast = null,
        string = "";

    if (!url)
        throw new Error("Could not load URL: " + url_source + "");

    string = <string>await url.fetchText(false);
    //TODO: Can throw
    try {

        // HACK -- if the source data is a css file, then wrap the source string into a <style></style> element string to enable 
        // the wick parser to parser the data correctly. 
        if (url.ext == "css")
            string = `<style>${string}</style>`;

        ast = parseStringReturnAST(string, url.toString());

    }
    catch (e) {
        error.push(e);
    }

    return { ast, string, resolved_url: url.toString(), error };
}
