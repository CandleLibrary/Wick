export default function insertData(template_str, str) {
    if (template_str.includes("%%%%"))
        return template_str.replace("%%%%", str);
    return template_str + str;
}