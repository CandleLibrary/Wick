import whind from "@candlefw/whind";

import { EL, OB, cloneNode, appendChild } from "../short_names";

import { CompileSource } from "./compiler/compiler";
import { Skeleton } from "./skeleton";
import { RootNode } from "./compiler/nodes/root";
import { BasePackage } from "./base_package.mjs"
/**
 * SourcePackages stores compiled {@link SourceSkeleton}s and provide a way to _bind_ Model data to the DOM in a reusable manner. *
 * @property    {Array}    skeletons
 * @property    {Array}    styles
 * @property    {Array}    scripts
 * @property    {Array}    style_core
 * @readonly
 * @callback   If `RETURN_PROMISE` is set to `true`, a new Promise is returned, which will asynchronously return a SourcePackage instance if compilation is successful.
 * @param      {HTMLElement}  element      The element
 * @param      {Presets}  presets      The global Presets object.
 * @param      {boolean}  [RETURN_PROMISE=false]  If `true` a Promise will be returned, otherwise the SourcePackage instance is returned.
 * @return     {SourcePackage | Promise}  If a SourcePackage has already been constructed for the given element, that will be returned instead of new one being created. If
 * @memberof module:wick.core.source
 * @alias SourcePackage
 */
class SourcePackage extends BasePackage {

    constructor(element, presets, RETURN_PROMISE = false, url = "", win = window) {

        //If a package exists for the element already, it will be bound to __wick_package_. That will be returned.
        if (element && element.__wick_package_) {
            if (RETURN_PROMISE)
                return new Promise((res) => res(element.__wick_package_));
            return element.__wick_package_;
        }

        super();

        if (element instanceof Promise) {
            element.then((data) => CompileSource(this, presets, data, url, win));
            if (RETURN_PROMISE) return element;
            return this;
        } else if (element instanceof RootNode) {
            //already an HTMLtree, just package into a skeleton and return.
            this.skeletons.push(new Skeleton(element, presets));
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
        let promise = CompileSource(this, presets, element, url, win);

        OB.seal(this);

        if (RETURN_PROMISE)
            return promise;
        else
            return this;

    }
}

import { PackageNode } from "./compiler/nodes/package";

PackageNode.prototype.SourcePackage = SourcePackage;

export { SourcePackage };