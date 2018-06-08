/**
 *	Converts links into Javacript enabled buttons that will be handled within the current Active page.
 *
 * @param {HTMLElement} element - Parent Element that contains the <a> elements to be evaulated by function.
 * @param {function} __function__ - A function the link will call when it is clicked by user. If it returns false, the link will act like a normal <a> element and cause the browser to navigate to the "href" value.
 *
 * If the <a> element has a data-ignore_link attribute set to a truthy value, then this function will not change the way that link operates.
 * Likewise, if the <a> element has a href that points another domain, then the link will remain unaffected.
 */
function setLinks(element, __function__) {
    let links = element.getElementsByTagName("a");
    for (let i = 0, l = links.length, temp, href; i < l; i++) {
        let temp = links[i];

        if (temp.dataset.ignore_link) continue;

        if (temp.origin !== location.origin) continue;

        if (!temp.onclick) temp.onclick = ((href, a, __function__) => (e) => {
            e.preventDefault();
            if (__function__(href, a)) e.preventDefault();
        })(temp.href, temp, __function__);
    }
};

export {setLinks}
