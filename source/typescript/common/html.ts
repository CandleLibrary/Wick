export const html_void_tags = new Set([
    "area",
    "base", "br",
    "col", "command",
    "embed",
    "hr",
    "img", "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
]);

export const html_non_void_tags = new Set([
    "a", "abbr", "acronym", "address",
    "b", "bdo", "big", "blockquote", "body", "button",
    "caption", "cite", "code", "colgroup",
    "dd", "del", "dfn", "div", "dl", "dt",
    "em",
    "fieldset", "form",
    "h1", "h2", "h3", "h4", "h5", "h6", "head", "html",
    "i", "import", "ins",
    "kbd",
    "label", "legend", "li",
    "map",
    "noscript", "object", "ol", "optgroup", "option",
    "p", "param", "pre",
    "q",
    "samp", "script", "select", "small", "span", "strong", "style", "sup", "svg",
    "table", "tbody", "td", "text", "textarea", "tfoot", "th", "thead", "title", "tr", "tt",
    "ul",
    "var"
]);

export const html_tags = new Set([...html_non_void_tags.values(), ...html_void_tags.values()]);

export const html_input_types = new Set([
    "button",
    "checkbox",
    "color",
    "date",
    "datetime",
    "email",
    "file",
    "hidden",
    "image",
    "month",
    "number",
    "password",
    "radio",
    "range",
    "reset",
    "search",
    "submit",
    "tel",
    "text",
    "time",
    "url",
    "week",
]);

export const html_button_types = new Set([
    "button",
    "reset",
    "submit",
]);

export const html_command_types = new Set([
    "command",
    "radio",
    "checkbox",
]);

export function Is_Tag_From_HTML_Spec(tag_name: string): boolean { return html_tags.has(tag_name.toLowerCase()); }



