import whind from "@candlefw/whind";

import { EL, OB, cloneNode, appendChild } from "../../short_names";

import { RootNode } from "../compiler/nodes/root.mjs";
import { HTMLCompiler } from "../compiler/html.mjs";
import { PackageNode } from "../compiler/nodes/package.mjs";
import { BasePackage } from "./base_package.mjs"

class ScopePackage extends BasePackage {

    constructor(element, presets, RETURN_PROMISE = false, url = "", win = window) {

        //If a package exists for the element already, it will be bound to __wick_package_. That will be returned.
        if (element && element.__wick_package_) {
            if (RETURN_PROMISE)
                return new Promise((res) => res(element.__wick_package_));
            return element.__wick_package_;
        }

        super();

        if (element instanceof Promise) {
            element.then((data) => HTMLCompiler(this, presets, data, url, win));
            if (RETURN_PROMISE) return element;
            return this;
        } else if (element instanceof RootNode) {

            // Already a ComponentASTTree.
            this.asts.push(element);
            this.complete();
            return;
        } else if (!(element instanceof HTMLElement) && typeof(element) !== "string" && !(element instanceof whind.constructor)) {
            let err = new Error("Could not create package. element is not an HTMLElement");
            this.addError(err);
            this.complete();
            if (RETURN_PROMISE)
                return new Promise((res, rej) => rej(err));
            return;
        }

        //Start the compiling of the component.
        let promise = HTMLCompiler(this, presets, element, url, win);

        OB.seal(this);

        if (RETURN_PROMISE)
            return promise;
        else
            return this;

    }
}

PackageNode.prototype.ScopePackage = ScopePackage;

export { ScopePackage };
