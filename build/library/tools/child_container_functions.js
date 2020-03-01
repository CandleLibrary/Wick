export function getChildContainerLength(node, children_key) {
    if (node && node[children_key] && Array.isArray(node[children_key])) {
        return node[children_key].length;
    }
    return 0;
}
;
export function getChildContainer(node, children_key) {
    if (node && node[children_key] && Array.isArray(node[children_key])) {
        return node[children_key];
    }
    return [];
}
;
