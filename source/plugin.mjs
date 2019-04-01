import whind from "@candlefw/whind";

const extensionParse = {
    name: "extensionParse",

    handlers: new Map(),

    load: function(in_ext, out_ext, fun) {
        extensionParse.handlers.set(in_ext, async (d) => ({ ext: out_ext, data: await fun(d) }));
    },

    plugin: async function(in_ext, data) {

        const handler = extensionParse.handlers.get(in_ext);

        if (handler)
            return await handler(data);

        return { ext: in_ext, data: data }
    }
}


const parseInnerHTMLOnTag = {
    name: "parseInnerHTMLOnTag",

    handlers: new Map(),

    load: function(tag_name, fun) {
        parseInnerHTMLOnTag.handlers.set(tag_name, fun);
    },

    plugin: async function(tag_name, calling_node, lex) {

        const handler = parseInnerHTMLOnTag.handlers.get(tag_name);

        if (handler) {

            //Search for the closing tag and extract a copy of lex that is fenced between the start and points.
            let level = 1;

            const cpy = lex.copy();

            let end = 0;

            while (level > 0 && !cpy.END) {
                //*
                if (cpy.ch == "<") {
                    if (cpy.pk.tx == tag_name) {
                        cpy.next();
                        level++;
                    } else if (cpy.pk.ch == "/" && cpy.pk.pk.tx == tag_name) {
                        level--;
                        end = cpy.off;
                        cpy.sync();
                    }
                }

                cpy.next();
                //*/
            };

            if(cpy.END)
                throw cpy.throw("Unexpected end of input");

            cpy.off = end;

            const out = lex.copy().fence(cpy); 

            lex.sync(cpy);

            lex.tl = 0; // reset lexer token

            lex.next(); // should be <

            const newHTML = await handler(out.trim().slice(), calling_node);

            if (typeof(newHTML) == "string")
                await calling_node.parseRunner(whind(newHTML), true);

            return true;
        }

        return false;
    }
}

const parseHTMLonTag = {
    name: "parseHTMLonTag",

    handlers: new Map(),

    load: function(tag_name, fun) {
        //Should dissallow common tags to prevent recursion. 
        //Test: Make sure recurssion does no occure, or if it does, detect and report.
        parseHTMLonTag.handlers.set(tag_name, fun);
    },

    plugin: async function(tag_name, calling_node, lex) {

        const handler = parseHTMLonTag.handlers.get(tag_name);

        if (handler) {

            lex.IWS = true;

            let level = 1;

            while (lex.next().ch != ">" && !lex.END);

            const cpy = lex.copy();

            lex.a(">", `Expecting an > end brace for opening tag ${tag_name}`);

            let end = 0;

            while (level > 0 && !cpy.END) {
                //*
                if (cpy.ch == "/" && ((end = cpy.off) && cpy.pk.tx == tag_name)) {
                    cpy.next();
                    level--;
                } else if (cpy.ch == "<" && cpy.pk.tx == tag_name) {
                    cpy.next();
                    level++;
                }

                cpy.next();
                //*/
            };

            cpy.a(">", `Expecting a matching closing tag for ${tag_name}`);

            const off = cpy.off;

            cpy.off = end - 1;

            const newHTML = await handler(lex.copy().fence(cpy).trim().slice(), calling_node);

            cpy.off = off;

            lex.sync(cpy);

            if (typeof(newHTML) == "string")
                await calling_node.parseRunner(whind(newHTML), true)

            lex.IWS = false;

            return true;
        }

        return false;
    }
}


//Houses handlers for all extension
export const Plugin = ((...plugins) => {

    const plugin_map = new Map(plugins.map(p => [p.name, p.load]))

    async function plugin(name, ...data) {

        const plugin = plugin_map.get(name);

        if (plugin)
            await plugin(...data);
    }

    plugins.forEach(e => {
        plugin[e.name] = e.plugin;
    })

    Object.freeze(plugin);

    return plugin;
})(extensionParse, parseInnerHTMLOnTag, parseHTMLonTag);
