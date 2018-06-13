import {
    View
} from "../view"

import {
    ModelContainer,
    MultiIndexedContainer
} from "./model_container"

import {
    ArrayModelContainer
} from "./array_container"

import {
    BinaryTreeModelContainer
} from "./binary_container"

import {
    DateModelContainer
} from "./date_model_container"

class Model {
    constructor(data) {
        this.first_view = null;

        this.schema = this.constructor.schema || {
            identifier: "__"
        };

        this.data = {};
        this._temp_data_ = null;
        this.export_data = [];
        this.index = null;

        if (!this.schema.identifier) {
            console.error("identifier property name needed in schema!", this.schema, this)
            return;
        }

        for (var a in this.schema) {

            let scheme = this.schema[a];

            if (a == "identifier") continue;

            if (scheme instanceof Array) {
                if (scheme[0] instanceof ModelContainer) {
                    this.data[a] = new scheme[0].constructor();
                    this.export_data.push({
                        name: a,
                        type: "ModelContainer",
                        exportable: false
                    })
                } else if (scheme[0].container && scheme[0].schema) {
                    this.data[a] = new scheme[0].container(scheme[0].schema);
                    this.export_data.push({
                        name: a,
                        type: "ModelContainer",
                        exportable: false
                    })
                } else {

                    console.error(`Schema cannot contain an array that does not contain a single object constructor of type ModelContainer or {schema:schema, container: ModelContainer}.`);
                }
            } else if (scheme instanceof Model) {
                this.data[a] = new scheme.constructor();
                this.export_data.push({
                    name: a,
                    type: "Model",
                    exportable: false
                })
            } else {
                this.export_data.push({
                    name: a,
                    type: this.schema[a].name,
                    exportable: true
                })
            }
        }

        if (data)
            this.add(data);
    }

    destructor() {

        //inform views of the models demise
        var view = this.first_view;

        while (view) {
            view.unsetModel();
            view = view.next;
        }

        this.first_view = null;

        for (let a in this.data) {
            if (typeof(this.data[a]) == "object") {
                this.data[a].destructor();
            } else {
                this.data[a] = null;
            }
        }

        this.data = null;
    }

    addView(view) {
        if (view instanceof View) {
            if (view.model)
                view.model.removeView(view);

            var child_view = this.first_view;

            while (child_view) {
                if (view == child_view) return;
                child_view = child_view.next;
            }

            view.model = this;
            view.next = this.first_view;
            this.first_view = view;

            view.model = this;

            if (!this._temp_data_)
                this._temp_data_ = this.get();
            view.setModel(this);
            view.update(this._temp_data_);
        }
    }

    removeView(view) {
        if (view instanceof View) {
            var child_view = this.first_view;
            var prev_child = null;

            while (child_view) {
                if (view == child_view) {

                    if (prev_child) {
                        prev_child.next = view.next;
                    } else {
                        this.first_view = view.next;
                    }

                    view.next = null
                    view.model = null;
                    view.reset();
                    return;
                };

                prev_child = child_view;
                child_view = child_view.next;
            }

            //debugger
            console.warn("View not a member of Model!", view);
        }
    }

    updateViews() {
        var view = this.first_view;

        while (view) {
            view.update(this.data);
            view = view.next;
        }
    }

    add(data) {
        var NEED_UPDATE = false;

        if (data instanceof Model) {

            if (data.identifier == this.identifier) {
                data = data.data;

            } else {
                console.trace("Only models with matching unique id's can be merged!", this, data);
                return;
            }
        }

        for (var a in data) {
            var datum = data[a];
            var scheme = this.schema[a];
            if (scheme) {
                if (scheme instanceof Array) {
                    NEED_UPDATE = (this.insertDataIntoContainer(this.data[a], data[a])) ? true : NEED_UPDATE;
                } else if (scheme instanceof Model) {
                    if (!this.data[a])
                        this.data[a] = new scheme();

                    if (this.data[a].add(data[a])) {
                        NEED_UPDATE = true;
                    }
                } else {
                    var prev = this.data[a];

                    this.data[a] = scheme(data[a]);

                    if (prev !== this.data[a])
                        NEED_UPDATE = true;
                }
            }
        }
        if (NEED_UPDATE) {
            this._temp_data_ = null; //Invalidate the current cache.
            this.updateViews();
        }

        return NEED_UPDATE;
    }

    get identifier() {
        return this.data[this.schema.identifier];
    }

    set identifier(a) {

    }

    __createCacheData__() {

    }

    /**
        Returns values that match the data properties. 
    */

    get(data) {
        var out_data = {};
        if (!data) {
            if (!this._temp_data_) {

                this._temp_data_ = {
                    addView: view => this.addView(view),
                    get: data => this.get(data),
                    identifier: () => this.identifier
                };

                for (var i = 0; i < this.export_data.length; i++) {
                    var id = this.export_data[i];

                    if (id.exportable)
                        this._temp_data_[id.name] = this.data[id.name];
                    else
                        this._temp_data_[id.name] = ((that, name) => {
                            return {
                                get(data) {
                                    return that.getDataFromContainer(that.data[name], data);
                                },

                                addView(view) {
                                    this.data[name].addView(view);
                                }
                            }

                        })(this, id.name)
                }
            }

            out_data = this._temp_data_;
        } else {

            for (var a in data) {
                var scheme = this.schema[a];
                if (scheme)
                    if (scheme instanceof Array) {
                        out_data[a] = this.getDataFromContainer(this.data[a], data[a]);
                    } else if (scheme instanceof Model)
                    out_data[a] = this.data[a].getData(data[a]);
            }
        }
        return out_data;
    }

    /**
        Removes items in containers based on matching index.
    */

    remove(data) {
        var out_data = {};
        for (var a in data) {
            var scheme = this.schema[a];
            if (scheme)
                if (scheme instanceof Array) {
                    out_data[a] = this.removeDataFromContainer(this.data[a], data[a]);
                } else if (scheme instanceof Model)
                out_data[a] = this.data[a].remove(data[a]);
        }

        return out_data;
    }

    insertDataIntoContainer(container, item) {
        return container.insert(item);
    }

    getDataFromContainer(container, item) {
        return container.get(item);
    }

    removeDataFromContainer(container, item) {
        return container.remove(item);
    }

    toString() {
        let str = "{\n"

        for (var i = 0; i < this.export_data.length; i++) {
            var id = this.export_data[i];

            if (id.exportable)
                str += `"${id.name}":${this.data[id.name].toString()},\n`;
            else
                str += `"${id.name}":[${this.data[id.name].toString()}],\n`;
        }

        str = str.slice(0, -2) + "\n";

        return str += "}";
    }
}

export {
    Model,
    ModelContainer,
    ArrayModelContainer,
    MultiIndexedContainer,
    BinaryTreeModelContainer,
    DateModelContainer
}