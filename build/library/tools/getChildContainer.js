export function getChildContainer(node, children_key) {
    if (node[children_key] && Array.isArray(node[children_key])) {
        return node[children_key];
    }
    return [];
}
