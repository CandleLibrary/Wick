import {
    ModelBase
} from "./model_base.js"

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

class Model extends ModelBase {
    constructor(data) {

        super();

        this.schema = this.constructor.schema || {};

        this.data = {};
        this._temp_data_ = null;
        this.export_data = [];

        for (var a in this.schema) {

            let scheme = this.schema[a];

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

    /**
        Alias for destructor
    */

    destroy() {
        this.destructor();
    }

    /**
        Removes all held references and calls unsetModel on all listening views.
    */
    destructor() {


        this.schema = null;
        this.data = {};
        this._temp_data_ = null;
        this.export_data = null;

        for (let a in this.data) {
            if (typeof(this.data[a]) == "object") {
                this.data[a].destructor();
            } else {
                this.data[a] = null;
            }
        }

        this.data = null;

        super.destructor();
    }

    /**
        Given a key, returns an object that represents the status of the value contained, if it is valid or not, according to the schema for that property. 
    */

    getDataStatus(key) {

        let out_data = {
            valid: true,
            reason: ""
        };

        var scheme = this.schema[key];

        if (scheme) {
            if (scheme instanceof Array) {

            } else if (scheme instanceof Model) {

            } else {
                scheme(this.data[key], out_data);
            }
        }

        return out_data
    }

    add(data) {
        var NEED_UPDATE = false;

        if (data instanceof Model) {
            data = data.data;
        }

        for (var a in data) {
            var datum = data[a];
            var scheme = this.schema[a];
            if (scheme) {
                if (scheme instanceof Array) {
                    NEED_UPDATE = (this.____insertDataIntoContainer____(this.data[a], data[a])) ? true : NEED_UPDATE;
                } else if (scheme instanceof Model) {
                    if (!this.data[a])
                        this.data[a] = new scheme();

                    if (this.data[a].add(data[a])) {
                        NEED_UPDATE = true;
                    }
                } else {
                    var prev = this.data[a];

                    var next = scheme(data[a]);

                    if (next !== null && next !== prev) {
                        this.data[a] = next;
                        NEED_UPDATE = true;
                    }
                }
            }
        }
        if (NEED_UPDATE) {
            this._temp_data_ = null; //Invalidate the current cache.
            this.updateViews(this.get());
        }

        return NEED_UPDATE;
    }

    get(data) {
        var out_data = {};
        if (!data) {
            if (!this._temp_data_) {

                this._temp_data_ = {
                    addView: view => this.addView(view),
                    get: data => this.get(data),
                    getStatus: key => this.getDataStatus(key),
                    __________self: () => this,
                    get ____self____() {
                        return this.__________self();
                    }
                };

                for (var i = 0; i < this.export_data.length; i++) {
                    var id = this.export_data[i];

                    if (id.exportable)
                        this._temp_data_[id.name] = this.data[id.name];
                    else
                        this._temp_data_[id.name] = ((that, name) => {
                            return {
                                get(data) {
                                    return that.____getDataFromContainer____(that.data[name], data);
                                },
                                addView(view) {
                                    this.data[name].addView(view);
                                },
                                get ____self____() {
                                    return that;
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
                        out_data[a] = this.____getDataFromContainer____(this.data[a], data[a]);
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
                    out_data[a] = this.____removeDataFromContainer____(this.data[a], data[a]);
                } else if (scheme instanceof Model)
                out_data[a] = this.data[a].remove(data[a]);
        }

        return out_data;
    }

    ____insertDataIntoContainer____(container, item) {
        return container.insert(item);
    }

    ____getDataFromContainer____(container, item) {
        return container.get(item);
    }

    ____removeDataFromContainer____(container, item) {
        return container.remove(item);
    }

    toJsonString() {
        debugger;
        let str = "{\n"

        for (var i = 0; i < this.export_data.length; i++) {
            var id = this.export_data[i];

            if (id.exportable)
                str += `"${id.name}":"${this.data[id.name].toString()}",\n`;
            else
                str += `"${id.name}":[${this.data[id.name].toString()}],\n`;
        }

        str = str.slice(0, -2) + "\n";

        return str += "}";
    }
}

class AnyModel extends ModelBase {
     constructor(data) {

        super();

        this.data = {};
        this._temp_data_ = null;
    }

    /**
        Alias for destructor
    */

    destroy() {
        this.destructor();
    }

    /**
        Removes all held references and calls unsetModel on all listening views.
    */
    destructor() {

        this.data = null;

        super.destructor();
    }

    add(data) {
        var NEED_UPDATE = false;

        if (data instanceof Model) {
            data = data.data;
        }

        for (var a in data) {
            let original = this.data[a];

            if(original != data[a]){
                this.data[a] = data[a];
                NEED_UPDATE = true;
            }
        }

        if (NEED_UPDATE) {
            this._temp_data_ = null; //Invalidate the current cache.
            this.updateViews(this.get());
        }

        return NEED_UPDATE;
    }

    get(data) {
        var out_data = {};
        if (!data) {
            if (!this._temp_data_) {

                this._temp_data_ = {
                    addView: view => this.addView(view),
                    get: data => this.get(data),
                    getStatus: key => this.getDataStatus(key),
                    __________self: () => this,
                    get ____self____() {
                        return this.__________self();
                    }
                };

                for(let a in this.data){
                    this._temp_data_[a] = this.data[a];
                }
            }

            return this._temp_data_;
        } else {

            for (var a in data) {
                var scheme = this.schema[a];
                if (scheme)
                    if (scheme instanceof Array) {
                        out_data[a] = this.____getDataFromContainer____(this.data[a], data[a]);
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
        return {};
    }

    toJsonString() {
        return this.data + "";
    }
}

export {
    Model,
    AnyModel,
    ModelContainer,
    ArrayModelContainer,
    MultiIndexedContainer,
    BinaryTreeModelContainer,
    DateModelContainer
}