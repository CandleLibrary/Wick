import { View } from "../view/view"

import { Scheduler } from "../common/scheduler"

/**
 * The base class which all Model classes extend.
 * @memberof module:wick~internal._m
 * @alias ModelBase
 */
class ModelBase {
    constructor() {
        /**
         * An Array of the names of all changed properties since the last call to ModelBase#_update_
         * @type {array}
         * @instance
         */
        this._cv_ = [];

        /**
         * A reference to the first view bound to this model in a linked list.
         * @type {Object}
         * @instance
         */
        this.fv = null;
    };

    /**
     *   Remove all references to any objects still held by this object.
     *   @protected
     *   @instance
     */
    _destroy_() {

        //inform views of the models demise
        var view = this.fv;

        while (view) {
            let nx = view.nx;
            view.unsetModel();
            view = nx;
        }

        this._cv_ = null;
    }
    get() {
        return this;
    }

    /**
     * Called by a class that extends ModelBase when on of its property values changes.
     * @param      {string}  changed_value  The changed value
     * @private
     */
    scheduleUpdate(changed_value) {

        if (!this.fv)
            return;

        this._cv_.push(changed_value);

        Scheduler.queueUpdate(this);
    }

    getChanged(prop_name) {


        for (let i = 0, l = this._cv_.length; i < l; i++)
            if (this._cv_[i] == prop_name)
                return this[prop_name];

        return null;
    }

    /**
     * Adds a view to the linked list of views on the model. argument view MUST be an instance of View. 
     * @param {View} view - The view to _bind_ to the ModelBase
     * @throws {Error} throws an error if the value of `view` is not an instance of {@link View}.
     */
    addView(view) {

        if (view instanceof View) {

            if (view._m)
                if (view._m !== this) {
                    view._m.removeView(view);
                } else return;

            if (this.fv) this.fv.pv = view;
            view.nx = this.fv;
            this.fv = view;

            view.pv = null;
            view._m = this;

            view._update_(this)

        } else
            throw new Exception("Passed in view is not an instance of wick.core.view.View.");
    }

    /**
     * Removes view from set of views if the passed in view is a member of model. 
     * @param {View} view - The view to unbind from ModelBase
     */
    removeView(view) {

        if (view._m == this) {
            if (view == this.fv)
                this.fv = view.nx;

            if (view.nx)
                view.nx.pv = view.pv;
            if (view.pv)
                view.pv.nx = view.nx;

            view.nx = null;
            view.pv = null;
        }
    }



    /**
        Should return the value of the property if it is in the model and has been updated since the last cycle. Null otherwise.
        This should be overridden by a more efficient version by inheriting objects
    */
    isUpdated(prop_name) {

        let changed_properties = this._cv_;

        for (var i = 0, l = changed_properties.length; i < l; i++)
            if (changed_properties[i] == prop_name)
                if (this[prop_name] !== undefined)
                    return this[prop_name]

        return null;
    }
    /**
     * Called by the {@link Scheduler} when if the ModelBase is scheduled for an _update_
     * @param      {number}  step    The step
     */
    _scheduledUpdate_(step) {

        this.updateViews();
    }

    /**
     * Calls View#_update_ on every bound View, passing the current state of the ModelBase.
     */
    updateViews() {

        let o = {};

        for (let p = null, i = 0, l = this._cv_.length; i < l; i++)
            (p = this._cv_[i], o[p] = this[p])

        this._cv_.length = 0;

        var view = this.fv;

        while (view) {

            view._update_(this, o);
            view = view.nx;
        }

        return;
    }

    /**
     * Updates views with a list of models that have been removed. 
     * Primarily used in conjunction with container based views, such as Templates.
     * @private
     */
    updateViewsRemoved(data) {

        var view = this.fv;

        while (view) {

            view.removed(data);

            view = view.nx;
        }
    }

    /**
     * Updates views with a list of models that have been added. 
     * Primarily used in conjunction with container based views, such as Templates.
     * @private
     */
    updateViewsAdded(data) {

        var view = this.fv;

        while (view) {

            view.added(data);

            view = view.nx;
        }
    }

    toJson() {
        return JSON.stringify(this, null, '\t');
    }
}

export { ModelBase }

Object.freeze(ModelBase.prototype);