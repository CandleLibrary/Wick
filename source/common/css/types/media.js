import { CSS_Length } from "./length";

import { WIN } from "../../../common/short_names";

const $medh = (prefix) => ({
    _parse_: (l, r, a, n = 0) => (n = CSS_Length._parse_(l, r, a), (prefix > 0) ? ((prefix > 1) ? (win) => win.screen.height <= n : (win) => win.screen.height >= n) : (win) => win.screen.height == n)
});


const $medw = (prefix) => ({
    _parse_: (l, r, a, n = 0) => 
        (n = CSS_Length._parse_(l, r, a), (prefix > 0) ? ((prefix > 1) ? (win) => win.innerWidth >= n : (win) => win.innerWidth <= n) : (win) => win.screen.width == n)
});

function CSS_Media_handle(type, prefix) {
    switch (type) {
        case "h":
            return $medh(prefix);
        case "w":
            return $medw(prefix);
    }

    return {
        _parse_: function(a, b, c) {
            debugger;
        }
    };
}

export { CSS_Media_handle };