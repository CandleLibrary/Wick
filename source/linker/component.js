import {
    View
} from "../view"
import {
    Getter
} from "../getter"
import {
    Rivet
} from "../case/rivet"
import {
    TurnDataIntoQuery
} from "../common"
import {
    DataTemplate
} from "./data_template"

import {
    Transitioneer
} from "../animation/transition/transitioneer"


/**
    Handles the transition of separate elements.
*/
class BasicCase extends Rivet {
    constructor(element) {
        super(null, element, {}, {});
        this.anchor = null;
        this.LOADED = false;

        this.transitioneer = new Transitioneer();
        this.transitioneer.set(this.element)
    }

    getNamedElements(named_elements) {
        let children = this.element.children;

        for (var i = 0; i < children.length; i++) {
            let child = children[i];

            if (child.dataset.transition) {
                named_elements[child.dataset.transition] = child;
            }
        }
    }
}

/**
    This is a fallback component if constructing a CaseComponent or normal Component throws an error.
*/

class FailedCase extends Rivet {
    constructor(error_message, presets) {
        var div = document.createElement("div");
        div.innerHTML = `<h3> This Wick component has failed!</h3> <h4>Error Message:</h4><p>${error_message.stack}</p><p>Please contact the website maintainers to address the problem.</p> <p>${presets.error_contact}</p>`;
        super(null, div, {}, {});

         this.transitioneer = new Transitioneer();
        this.transitioneer.set(this.element)
    }
}

export {
    BasicCase,
    FailedCase
}