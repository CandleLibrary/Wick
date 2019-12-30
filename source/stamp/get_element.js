/* Returns an array that respresents the index position of a given element and it's ancestor nodes. */
function getRootOffset(ele, array = []) {
    let i = 0;

    const parent = ele.parentElement;

    if (!parent) {
        return array;
    }

    while (ele != parent.firstChild) {
        i++;
        ele = ele.previousSibling;
    }

    array.unshift(i);

    return getRootOffset(parent, array);

}

export default function getElement(ele, mapped_elements) {

    if (mapped_elements.has(ele))
        return mapped_elements.get(ele).name;

    let offset = null;

    if (ele instanceof Text) {
        const span = document.createElement("span");
        span.innerHTML = ele.data;
        ele.parentElement.insertBefore(span, ele);
        ele.parentElement.removeChild(ele);
        offset = getRootOffset(span);
    } else {
        offset = getRootOffset(ele);
    }

    mapped_elements.set(ele, { name: `e_${mapped_elements.size}`, offset });

    return getElement(ele, mapped_elements);
}