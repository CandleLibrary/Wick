import getElement from "./get_element.js";

export default function getContainer(ctr, containers, mapped_elements) {

    if (containers.has(ctr))
        return containers.get(ctr).name;

    //let offset = getRootOffset(ctr);

    containers.set(ctr, { name: `c${containers.size}`, ele: getElement(ctr.ele, mapped_elements), comp: ctr.component });

    return getContainer(ctr, containers, mapped_elements);
}

export function setContainerSortFN(ctr, containers, type, expr){
	if(containers.has(ctr)){
		const c = containers.get(ctr);
		if(!c.filters)
			c.filters = [];
		c.filters.push({type, expr});
	}else
		return setContainerSortFN(getContainer(ctr),containers);
}