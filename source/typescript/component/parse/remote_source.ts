import URL from "@candlefw/url";
import parse from "../../source_code/parse.js";

export async function acquireComponentASTFromRemoteSource(url: URL) {

    const
        errors = [];

    let ast = null,
        comments = null,
        string = "";

    if (!url)
        throw new Error("Could not load URL: " + url + "");


    //TODO: Can throw
    try {
        string = <string>await url.fetchText(false);

        // HACK -- if the source data is a css file, then wrap the source string into a <style></style> element string to enable 
        // the wick parser to parser the data correctly. 
        if (url.ext == "css")
            string = `<style>${string}</style>`;

        const { ast: a, comments: c, error } = parse(string, url.toString());

        ast = a;
        comments = c;

        if (error)
            errors.push(error);

    } catch (e) {
        errors.push(e);
    }

    return { ast, string, resolved_url: url.toString(), errors, comments };
}
