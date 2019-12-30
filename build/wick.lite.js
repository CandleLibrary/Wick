var wick = (function () {
    'use strict';

    /**
     * Used to call the Scheduler after a JavaScript runtime tick.
     *
     * Depending on the platform, caller will either map to requestAnimationFrame or it will be a setTimout.
     */
     
    const caller = (typeof(window) == "object" && window.requestAnimationFrame) ? window.requestAnimationFrame : (f) => {
        setTimeout(f, 1);
    };

    const perf = (typeof(performance) == "undefined") ? { now: () => Date.now() } : performance;


    /**
     * Handles updating objects. It does this by splitting up update cycles, to respect the browser event model. 
     *    
     * If any object is scheduled to be updated, it will be blocked from scheduling more updates until the next ES VM tick.
     */
    class Spark {
        /**
         * Constructs the object.
         */
        constructor() {

            this.update_queue_a = [];
            this.update_queue_b = [];

            this.update_queue = this.update_queue_a;

            this.queue_switch = 0;

            this.callback = ()=>{};


            if(typeof(window) !== "undefined"){
                window.addEventListener("load",()=>{
                    this.callback = () => this.update();
                    caller(this.callback);
                });
            }else{
                this.callback = () => this.update();
            }


            this.frame_time = perf.now();

            this.SCHEDULE_PENDING = false;
        }

        /**
         * Given an object that has a _SCHD_ Boolean property, the Scheduler will queue the object and call its .update function 
         * the following tick. If the object does not have a _SCHD_ property, the Scheduler will persuade the object to have such a property.
         * 
         * If there are currently no queued objects when this is called, then the Scheduler will user caller to schedule an update.
         */
        queueUpdate(object, timestart = 1, timeend = 0) {

            if (object._SCHD_ || object._SCHD_ > 0) {
                if (this.SCHEDULE_PENDING)
                    return;
                else
                    return caller(this.callback);
            }

            object._SCHD_ = ((timestart & 0xFFFF) | ((timeend) << 16));

            this.update_queue.push(object);

            if (this._SCHD_)
                return;

            this.frame_time = perf.now() | 0;


            if(!this.SCHEDULE_PENDING){
                this.SCHEDULE_PENDING = true;
                caller(this.callback);
            }
        }

        removeFromQueue(object){

            if(object._SCHD_)
                for(let i = 0, l = this.update_queue.length; i < l; i++)
                    if(this.update_queue[i] === object){
                        this.update_queue.splice(i,1);
                        object._SCHD_ = 0;

                        if(l == 1)
                            this.SCHEDULE_PENDING = false;

                        return;
                    }
        }

        /**
         * Called by the caller function every tick. Calls .update on any object queued for an update. 
         */
        update() {

            this.SCHEDULE_PENDING = false;

            const uq = this.update_queue;
            const time = perf.now() | 0;
            const diff = Math.ceil(time - this.frame_time) | 1;
            const step_ratio = (diff * 0.06); //  step_ratio of 1 = 16.66666666 or 1000 / 60 for 60 FPS

            this.frame_time = time;
            
            if (this.queue_switch == 0)
                (this.update_queue = this.update_queue_b, this.queue_switch = 1);
            else
                (this.update_queue = this.update_queue_a, this.queue_switch = 0);

            for (let i = 0, l = uq.length, o = uq[0]; i < l; o = uq[++i]) {
                let timestart = ((o._SCHD_ & 0xFFFF)) - diff;
                let timeend = ((o._SCHD_ >> 16) & 0xFFFF);

                o._SCHD_ = 0;
                
                if (timestart > 0) {
                    this.queueUpdate(o, timestart, timeend);
                    continue;
                }

                timestart = 0;

                if (timeend > 0) 
                    this.queueUpdate(o, timestart, timeend - diff);

                /** 
                    To ensure on code path doesn't block any others, 
                    scheduledUpdate methods are called within a try catch block. 
                    Errors by default are printed to console. 
                **/
                try {
                    o.scheduledUpdate(step_ratio, diff);
                } catch (e) {
                    console.error(e);
                }
            }

            uq.length = 0;
        }
    }

    const spark = new Spark();

    /**
     * Global Document instance short name
     * @property DOC
     * @package
     * @memberof module:wick~internals
     * @type 	{Document}
     */
    const DOC = (typeof(document) !== "undefined") ? document : ()=>{};

    /**
     * Global Window Instance short name
     * @property WIN
     * @package
     * @memberof module:wick~internals
     * @type 	{Window}
     */
    const WIN = (typeof(window) !== "undefined") ? window : ()=>{};

    /**
     * Global HTMLElement class short name
     * @property EL
     * @package
     * @memberof module:wick~internals
     * @type 	{HTMLElement}
     */
    const EL = (typeof(HTMLElement) !== "undefined") ? HTMLElement : ()=>{};

    /**
     * Global Object class short name
     * @property OB
     * @package
     * @memberof module:wick~internals
     * @type Object
     */
    const OB = Object;

    /**
     * Global String class short name
     * @property STR
     * @package
     * @memberof module:wick~internals
     * @type String
     */
    const STR = String;

    /**
     * Global Array class short name
     * @property AR
     * @package
     * @memberof module:wick~internals
     * @type 	{Array}
     */
    const AR = Array;

    /**
     * Global Number class short name
     * @property NUM
     * @package
     * @memberof module:wick~internals
     * @type 	{Number}
     */
    const NUM = Number;

    /**
     * Global Date class short name
     * @property DT
     * @package
     * @memberof module:wick~internals
     * @type 	{Date}
     */
    const DT = Date;

    /**
     * Global Boolean class short name
     * @property BO
     * @package
     * @memberof module:wick~internals
     * @type 	{Boolean}
     */
    const BO = Boolean;

    /***************** Functions ********************/

    /**
     *  Global document.createElement short name function.
     * @method DOC
     * @package
     * @memberof module:wick~internals
     * @param 	{String}  		e   - tagname of element to create. 
     * @return  {HTMLElement}  		- HTMLElement instance generated by the document. 
     */
    const createElement = (e) => document.createElement(e);

    /**
     *  Element.prototype.appendChild short name wrapper.
     * @method appendChild
     * @package
     * @memberof module:wick~internals
     * @param 	{HTMLElement}  		el  	- parent HTMLElement.
     * @return  {HTMLElement | HTMLNode}  		ch_el 	- child HTMLElement or HTMLNode. 
     */
    const appendChild = (el, ch_el) => el && el.appendChild(ch_el);

    /**
     *  Element.prototype.cloneNode short name wrapper.
     * @method cloneNode
     * @package
     * @memberof module:wick~internals
     * @param 	{HTMLElement}  		el   - HTMLElement to clone.
     * @return  {Boolean}  			bool - Switch for deep clone
     */
    const cloneNode = (el, bool) => el.cloneNode(bool);

    /**
     *  Element.prototype.getElementsByTagName short name wrapper.
     * @method _getElementByTag_
     * @package
     * @memberof module:wick~internals
     * @param 	{HTMLElement}  		el   - HTMLElement to find tags on.
     * @return  {String}  			tag - tagnames of elements to find.
     */
    const _getElementByTag_ = (el, tag) => el.getElementsByTagName(tag);

    /**
     *  Shortname for `instanceof` expression
     * @method _instanceOf_
     * @package
     * @param      {object}  inst    The instance
     * @param      {object}  constr  The constructor
     * @return     {boolean}  the result of `inst instanceof constr`
     */
    const _instanceOf_ = (inst, constr) => inst instanceof constr;

    const _SealedProperty_ = (object, name, value) => OB.defineProperty(object, name, {value, configurable: false, enumerable: false, writable: true});
    const _FrozenProperty_ = (object, name, value) => OB.defineProperty(object, name, {value, configurable: false, enumerable: false, writable: false});

    /**
     * The base class which all Model classes extend.
     * @memberof module:wick~internal .model
     * @alias ModelBase
     */
    class ModelBase {
        constructor(root = null, address = []) {
            _SealedProperty_(this, "_cv_", []);
            _SealedProperty_(this, "fv", null);
            _SealedProperty_(this, "par", null);
            _SealedProperty_(this, "MUTATION_ID", 0);
            _SealedProperty_(this, "address", address);
            _SealedProperty_(this, "root", root || this);
            _SealedProperty_(this, "prop_name", "");
        }


        /**
         *   Remove all references to any objects still held by this object.
         *   @protected
         *   @instance
         */
        destroy() {

            //inform observers of the models demise
            var observer = this.fv;

            while (observer) {
                let nx = observer.nx;
                observer.unsetModel();
                observer = nx;
            }

            this._cv_ = null;
        }

        setHook(prop_name, data) { return data; }

        getHook(prop_name, data) { return data; }


        /**
         * Called by a class that extends ModelBase when on of its property values changes.
         * @param      {string}  changed_value  The changed value
         * @private
         */
        scheduleUpdate(changed_value) {
            if (!this.fv)
                return;


            this._cv_.push(changed_value);

            spark.queueUpdate(this);
        }


        getChanged(prop_name) {


            for (let i = 0, l = this._cv_.length; i < l; i++)
                if (this._cv_[i] == prop_name)
                    return this[prop_name];

            return null;
        }

        addListener(listener) {
            return this.addObserver(listener);
        }


        /**
         * Adds a observer to the linked list of observers on the model. argument observer MUST be an instance of View. 
         * @param {View} observer - The observer to _bind_ to the ModelBase
         * @throws {Error} throws an error if the value of `observer` is not an instance of {@link View}.
         */
        addObserver(observer) {
            if (observer.model)
                if (observer.model !== this) {
                    observer.model.removeView(observer);
                } else return;

            if (this.fv) this.fv.pv = observer;
            observer.nx = this.fv;
            this.fv = observer;

            observer.pv = null;
            observer.model = this;
            observer.update(this);
        }

        removeObserver(observer) {
            this.removeView(observer);
        }

        /**
         * Removes observer from set of observers if the passed in observer is a member of model. 
         * @param {View} observer - The observer to unbind from ModelBase
         */
        removeView(observer) {


            if (observer.model == this) {
                if (observer == this.fv)
                    this.fv = observer.nx;

                if (observer.nx)
                    observer.nx.pv = observer.pv;
                if (observer.pv)
                    observer.pv.nx = observer.nx;

                observer.nx = null;
                observer.pv = null;
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
                        return this[prop_name];

            return null;
        }



        /**
         * Called by the {@link spark} when if the ModelBase is scheduled for an update
         * @param      {number}  step    The step
         */
        scheduledUpdate(step) { this.updateViews(); }



        /**
         * Calls View#update on every bound View, passing the current state of the ModelBase.
         */
        updateViews() {

            let o = {};

            for (let p = null, i = 0, l = this._cv_.length; i < l; i++)
                (p = this._cv_[i], o[p] = this[p]);

            this._cv_.length = 0;

            var observer = this.fv;

            while (observer) {

                observer.update(this, o);
                observer = observer.nx;
            }

            return;
        }



        /**
         * Updates observers with a list of models that have been removed. 
         * Primarily used in conjunction with container based observers, such as Templates.
         * @private
         */
        updateViewsRemoved(data) {

            var observer = this.fv;

            while (observer) {

                observer.removed(data);

                observer = observer.nx;
            }
        }



        /** MUTATION FUNCTIONS **************************************************************************************/



        _deferUpdateToRoot_(data, MUTATION_ID = this.MUTATION_ID) {

            if (!this.root)
                return this;

            return this.root._setThroughRoot_(data, this.address, 0, this.address.length, MUTATION_ID);
        }



        _setThroughRoot_(data, address, index, len, m_id) {

            if (index >= len) {

                if (m_id !== this.MUTATION_ID) {
                    let clone = this.clone();
                    clone.set(data, true);
                    clone.MUTATION_ID = (this.par) ? this.par.MUTATION_ID : this.MUTATION_ID + 1;
                    return clone;
                }

                this.set(data, true);
                return this;
            }

            let i = address[index++];

            let model_prop = this.prop_array[i];

            if (model_prop.MUTATION_ID !== this.MUTATION_ID) {

                model_prop = model_prop.clone();

                model_prop.MUTATION_ID = this.MUTATION_ID;
            }

            this.prop_array[i] = model_prop;

            return model_prop._setThroughRoot_(data, address, index, len, model_prop.MUTATION_ID);
        }

        seal() {

            let clone = this._deferUpdateToRoot_(null, this.MUTATION_ID + 1);

            return clone;
        }

        clone() {

            let clone = new this.constructor(this);

            clone.prop_name = this.prop_name;
            clone._cv_ = this._cv_;
            clone.fv = this.fv;
            clone.par = this.par;
            clone.MUTATION_ID = this.MUTATION_ID;
            clone.address = this.address;
            clone.prop_name = this.prop_name;

            clone.root = (this.root == this) ? clone : this.root;

            return clone;
        }

        /**
         * Updates observers with a list of models that have been added. 
         * Primarily used in conjunction with container based observers, such as Templates.
         * @private
         */
        updateViewsAdded(data) {

            var observer = this.fv;

            while (observer) {

                observer.added(data);

                observer = observer.nx;
            }
        }

        toJSON() { return JSON.stringify(this, null, '\t'); }


        /**
         * This will update the branch state of the data tree with a new branch if the MUTATION_ID is higher or lower than the current branch's parent level.
         * In this case, the new branch will stem from the root node, and all ancestor nodes from the originating child will be cloned.
         *
         * @param      {Object}         child_obj    The child object
         * @param      {(Object|number)}  MUTATION_ID  The mutation id
         * @return     {Object}         { description_of_the_return_value }
         */
        setMutation(child_obj, MUTATION_ID = child_obj.MUTATION_ID) {
            let clone = child_obj,
                result = this;

            if (MUTATION_ID == this.MUTATION_ID) return child_obj;

            if (this.par)
                result = this.par.setMutation(this, MUTATION_ID);

            if (MUTATION_ID > this.MUTATION_ID) {
                result = this.clone();
                result.MUTATION_ID = this.MUTATION_ID + 1;
            }

            clone = child_obj.clone();
            clone.MUTATION_ID = result.MUTATION_ID;
            result[clone.prop_name] = clone;

            return clone;
        }
    }

    /**
        Schema type. Handles the parsing, validation, and filtering of Model data properties. 
    */
    class SchemeConstructor {

        constructor() {

            this.start_value = undefined;
        }

        /**
            Parses value returns an appropriate transformed value
        */
        parse(value) {

            return value;
        }

        /**

        */
        verify(value, result) {

            result.valid = true;
        }

        filter(id, filters) {
            for (let i = 0, l = filters.length; i < l; i++)
                if (id === filters[i]) return true;
            return false;
        }

        string(value) {

            return value + "";
        }
    }

    class MCArray extends Array {

        constructor() {
            super();
        }

        push(...item) {
            item.forEach(item => {
                if (item instanceof Array)
                    item.forEach((i) => {
                        super.push(i);
                    });
                else
                    super.push(item);
            });
        }

        //For compatibility
        __setFilters__() {

        }

        getChanged() {

        }

        toJSON() { return this; }

        toJson() { return JSON.stringify(this, null, '\t'); }
    }

    // A no op function
    let EmptyFunction = () => {};
    let EmptyArray = [];

    class ModelContainerBase extends ModelBase {

        constructor(root = null, address = []) {

            super(root, address);

            _SealedProperty_(this, "scope", null);
            _SealedProperty_(this, "first_link", null);

            //For keeping the container from garbage collection.
            _SealedProperty_(this, "pin", EmptyFunction);

            //For Linking to original 
            _SealedProperty_(this, "next", null);
            _SealedProperty_(this, "prev", null);

            //Filters are a series of strings or number selectors used to determine if a model should be inserted into or retrieved from the container.
            _SealedProperty_(this, "_filters_", null);

            this.validator = new SchemeConstructor();

            return this;
        }

        setByIndex(index) { /* NO OP **/ }

        getByIndex(index, value) { /* NO OP **/ }

        destroy() {


            this._filters_ = null;

            if (this.scope) {
                this.scope.__unlink__(this);
            }

            super.destroy();
        }

        /**
            Get the number of Models held in this._mContainerBase

            @returns {Number}
        */
        get length() { return 0; }

        set length(e) { /* NO OP */ }

        /** 
            Returns a ModelContainerBase type to store the results of a get().
        */
        __defaultReturn__(USE_ARRAY) {
            if (USE_ARRAY) return new MCArray;

            let n = new this.constructor();

            n.key = this.key;
            n.validator = this.validator;
            n.model = this.model;

            this.__link__(n);

            return n;
        }

        /**
            Array emulating kludge

            @returns The result of calling this.insert
        */
        push(...item) {
            item.forEach(item => {
                if (this.scope) {
                    if (item instanceof Array)
                        item.forEach((i) => {
                            this.insert(i, true, true);
                        });
                    else
                        this.insert(item, true, true);

                } else {
                    if (item instanceof Array)
                        item.forEach((i) => {
                            this.insert(i);
                        });
                    else
                        this.insert(item);

                }
            });
        }

        /**
            Retrieves a list of items that match the term/terms. 

            @param {(Array|SearchTerm)} term - A single term or a set of terms to look for in the ModelContainerBase. 
            @param {Array} __return_data__ - Set to true by a scope Container if it is calling a SubContainer insert function. 

            @returns {(ModelContainerBase|Array)} Returns a Model container or an Array of Models matching the search terms. 
        */
        get(term = this._filters_, __return_data__ = null) {

            let out = null;

            term = this.getHook("term", term);

            let USE_ARRAY = (__return_data__ === null) ? false : true;

            if (term) {

                if (__return_data__) {
                    out = __return_data__;
                } else {

                    if (!this.scope)
                        USE_ARRAY = false;

                    out = this.__defaultReturn__(USE_ARRAY);
                    out.__setFilters__(term);
                }
            } else
                out = (__return_data__) ? __return_data__ : this.__defaultReturn__(USE_ARRAY);

            if (!term)
                this.__getAll__(out);
            else {

                let terms = term;

                if (!Array.isArray(term))
                    terms = [term];

                //Need to convert terms into a form that will work for the identifier type
                terms = terms.map(t => this.validator.parse(t));

                this.__get__(terms, out);
            }

            return out;
        }

        set(item, from_root = false) {
            if (!from_root)
                return this._deferUpdateToRoot_(item).insert(item, true);
            else
                this.insert(item, true);
        }

        /**
            Inserts an item into the container. If the item is not a {Model}, an attempt will be made to convert the data in the Object into a Model.
            If the item is an array of objects, each object in the array will be considered separately. 

            @param {Object} item - An Object to insert into the container. On of the properties of the object MUST have the same name as the ModelContainerBase's 
            @param {Array} item - An array of Objects to insert into the container.
            @param {Boolean} __FROM_SCOPE__ - Set to true by a scope Container if it is calling a SubContainer insert function. 

            @returns {Boolean} Returns true if an insertion into the ModelContainerBase occurred, false otherwise.
        */
        insert(item, from_root = false, __FROM_SCOPE__ = false) {


            item = this.setHook("", item);

            if (!from_root)
                return this._deferUpdateToRoot_(item).insert(item, true);

            let add_list = (this.fv) ? [] : null;

            let out_data = false;

            if (!__FROM_SCOPE__ && this.scope)
                return this.scope.insert(item);


            if (item instanceof Array) {
                for (var i = 0; i < item.length; i++)
                    if (this.__insertSub__(item[i], out_data, add_list))
                        out_data = true;
            } else if (item)
                out_data = this.__insertSub__(item, out_data, add_list);


            if (out_data) {
                if (this.par)
                    this.par.scheduleUpdate(this.prop_name);


                if (add_list && add_list.length > 0) {
                    this.updateViewsAdded(add_list);
                    this.scheduleUpdate();
                }
            }

            return out_data;
        }

        /**
            A subset of the insert function. Handles the testing of presence of an identifier value, the conversion of an Object into a Model, and the calling of the implementation specific __insert__ function.
        */
        __insertSub__(item, out, add_list) {

            let model = item;

            var identifier = this._gI_(item);

            if (identifier !== undefined) {

                if (!(model instanceof ModelBase)) {
                    model = new this.model(item);
                    model.MUTATION_ID = this.MUTATION_ID;
                }

                identifier = this._gI_(model, this._filters_);

                if (identifier !== undefined) {
                    out = this.__insert__(model, add_list, identifier);
                    this.__linksInsert__(model);
                }
            }

            return out;
        }

        delete(term, from_root = false) {
            if (!from_root)
                return this._deferUpdateToRoot_(term).remove(term);
            else
                this.remove(term);
        }

        /**
            Removes an item from the container. 
        */
        remove(term, from_root = false, __FROM_SCOPE__ = false) {

            if (!from_root)
                return this._deferUpdateToRoot_(term).remove(term, true);

            //term = this.getHook("term", term);

            if (!__FROM_SCOPE__ && this.scope) {

                if (!term)
                    return this.scope.remove(this._filters_);
                else
                    return this.scope.remove(term);
            }

            let out_container = [];

            if (!term)
                this.__removeAll__();

            else {

                let terms = (Array.isArray(term)) ? term : [term];

                //Need to convert terms into a form that will work for the identifier type
                terms = terms.map(t => (t instanceof ModelBase) ? t : this.validator.parse(t));

                this.__remove__(terms, out_container);
            }

            if (out_container.length > 0) {
                if (this.par)
                    this.par.scheduleUpdate(this.prop_name);


                if (out_container && out_container.length > 0) {
                    this.updateViewsRemoved(out_container);
                    this.scheduleUpdate();
                }
            }

            return out_container;
        }

        /**
            Removes a ModelContainerBase from list of linked containers. 

            @param {ModelContainerBase} container - The ModelContainerBase instance to remove from the set of linked containers. Must be a member of the linked containers. 
        */
        __unlink__(container) {

            if (container instanceof ModelContainerBase && container.scope == this) {

                if (container == this.first_link)
                    this.first_link = container.next;

                if (container.next)
                    container.next.prev = container.prev;

                if (container.prev)
                    container.prev.next = container.next;

                container.scope = null;
            }
        }

        /**
            Adds a container to the list of tracked containers. 

            @param {ModelContainerBase} container - The ModelContainerBase instance to add the set of linked containers.
        */
        __link__(container) {
            if (container instanceof ModelContainerBase && !container.scope) {

                container.scope = this;

                container.next = this.first_link;

                if (this.first_link)
                    this.first_link.prev = container;

                this.first_link = container;

                container.pin = ((container) => {
                    let id = setTimeout(() => {
                        container.__unlink__();
                    }, 50);

                    return () => {
                        clearTimeout(id);
                        if (!container.scope)
                            console.warn("failed to clear the destruction of container in time!");
                    };
                })(container);
            }
        }

        /**
         * Remove items from linked ModelContainers according to the terms provided.
         * @param      {Array}  terms   Array of terms.
         * @private
         */
        __linksRemove__(item) {
            let a = this.first_link;
            while (a) {
                for (let i = 0; i < item.length; i++)
                    if (a._gI_(item[i], a._filters_)) {
                        a.scheduleUpdate();
                        a.__linksRemove__(item);
                        break;
                    }

                a = a.next;
            }
        }

        /**
         * Add items to linked ModelContainers.
         * @param      {Model}  item   Item to add.
         * @private
         */
        __linksInsert__(item) {
            let a = this.first_link;
            while (a) {
                if (a._gI_(item, a._filters_))
                    a.scheduleUpdate();
                a = a.next;
            }
        }

        /**
            Removes any items in the ModelConatiner not included in the array "items", and adds any item in `items` not already in the ModelContainerBase.
            @param {Array} items - An array of identifiable Models or objects. 
        */
        cull(items) {

            let hash_table = {};
            let existing_items = __getAll__([], true);

            let loadHash = (item) => {
                if (item instanceof Array)
                    return item.forEach((e) => loadHash(e));

                let identifier = this._gI_(item);

                if (identifier !== undefined)
                    hash_table[identifier] = item;

            };

            loadHash(items);

            for (let i = 0; i < existing_items.lenth; i++) {
                let e_item = existing_items[i];
                if (!existing_items[this._gI_(e_item)])
                    this.__remove__(e_item);
            }

            this.insert(items);
        }

        __setFilters__(term) {

            if (!this._filters_) this._filters_ = [];

            if (Array.isArray(term))
                this._filters_ = this._filters_.concat(term.map(t => this.validator.parse(t)));
            else
                this._filters_.push(this.validator.parse(term));

        }

        /**
            Returns true if the identifier matches a predefined filter pattern, which is evaluated by this.parser. If a 
            parser was not present the ModelContainers schema, then the function will return true upon every evaluation.
        */
        __filterIdentifier__(identifier, filters) {
            if (filters.length > 0) {
                return this.validator.filter(identifier, filters);
            }
            return true;
        }

        _gIf_(item, term) {
            let t = this._gI_(item, this.filters);
        }

        /**
            Returns the Identifier property value if it exists in the item. If an array value for filters is passed, then undefined is returned if the identifier value does not pass filtering criteria.
            @param {(Object|Model)} item
            @param {Array} filters - An array of filter terms to test whether the identifier meets the criteria to be handled by the ModelContainerBase.
        */
        _gI_(item, filters = null) {

            let identifier;

            if (typeof(item) == "object" && this.key)
                identifier = item[this.key];
            else
                identifier = item;

            if (identifier && this.validator)
                identifier = this.validator.parse(identifier);

            if (filters && identifier)
                return (this.__filterIdentifier__(identifier, filters)) ? identifier : undefined;

            return identifier;
        }

        /** 
            OVERRIDE SECTION ********************************************************************
            
            All of these functions should be overridden by inheriting classes
        */

        __insert__() { return this; }

        __get__(item, __return_data__) { return __return_data__; }

        __getAll__(__return_data__) { return __return_data__; }

        __removeAll__() { return []; }

        __remove__() { return []; }

        clone() {
            let clone = super.clone();
            clone.key = this.key;
            clone.model = this.model;
            clone.validator = this.validator;
            clone.first_link = this.first_link;
            return clone;
        }

        // END OVERRIDE *************************************************************************
    }

    const proto = ModelContainerBase.prototype;
    _SealedProperty_(proto, "model", null);
    _SealedProperty_(proto, "key", "");
    _SealedProperty_(proto, "validator", null);

    //import glow from "@candlefw/glow";

    function getColumnRow(index, offset, set_size) {
    	const adjusted_index = index - offset * set_size;
    	const row = Math.floor(adjusted_index / set_size);
    	const col = (index) % (set_size);
    	return { row, col };
    }

    /* Given an argument list of element indices, returns the element at the last index location.  */
    function ge(ele, ...indices) {
    	if (indices.length == 0)
    		return ele;
    	else
    		return ge(ele.childNodes[indices[0]], ...(indices.slice(1)));
    }
    /* Update container scopes. */

    function ctr_upd(ctr, data_objs) {
    	if (!data_objs) return;

    	if (data_objs instanceof ModelContainerBase) {
    		data_objs.pin();
    		data_objs.addObserver(ctr);
    		return;
    	}

    	if (Array.isArray(data_objs)) cull(ctr, data_objs);
    	else cull(ctr, data_objs.data);
    }


    const component_map = new Map();

    /* Create a wick container */
    function ctr(ele, component) {

    	const ctr = {
    		component: { mount: (ele, data) => createComponent(component, data) },
    		ele,
    		SCRUBBING: false,
    		scopes: [],
    		active_scopes: [],
    		dom_scopes: [],
    		filters:[],
    		scrub_velocity: 0,
    		shift_amount: 1,
    		limit: 0,
    		offset: 0,
    		offset_diff: 0,

    		offset_fractional: 0,
    		scheduledUpdate() {
    			if (ctr.SCRUBBING) {

    				if (!ctr.AUTO_SCRUB) { return (ctr.SCRUBBING = false) }

    				if (Math.abs(ctr.scrub_velocity) > 0.0001) {
    					if (scrub(ctr, ctr.scrub_velocity)) {

    						ctr.scrub_velocity *= (ctr.drag);

    						const pos = ctr.offset + ctr.scrub_velocity;

    						if (pos < 0 || pos > ctr.max)
    							ctr.scrub_velocity = 0;

    						spark.queueUpdate(ctr);
    					}

    				} else {
    					ctr.scrub_velocity = 0;
    					scrub(ctr, Infinity);
    					ctr.SCRUBBING = false;
    				}
    			} else {
    				forceMount(ctr);
    				arrange(ctr);
    				render(ctr);
    				ctr.offset_diff = 0;
    			}
    		}
    	};

    	return ctr;
    }

    function createComponent(name, data) {
    	if (component_map.has(name)) {
    		const component_constructor = component_map.get(name);

    		const ele = document.importNode(component_constructor.template.content, true);

    		const obj = component_constructor.fn(ele, wick_lite);

    		if (data)
    			obj.update(data);

    		return obj;
    	}

    	return null;
    }

    const wick_lite = {
    	ge,
    	ctr,
    	ctr_upd,
    	createComponent,
    	addComponent(obj) {
    		if (obj.html && obj.js) {
    			const template = document.createElement("template");
    			template.innerHTML = obj.html;
    			component_map.set(obj.hash, { fn: new Function("ele", "wl", obj.js), template });
    		}
    	}
    };


    function cull(ctr, new_items = []) {
    	const transition = glow.createTransition();

    	if (new_items.length == 0) {

    		const sl = ctr.scopes.length;

    		for (let i = 0; i < sl; i++) ctr.scopes[i].transitionOut(transition, "", true);

    		ctr.scopes.length = 0;
    		ctr.active_scopes.length = 0;
    		/*
    		ctr.parent.upImport("template_count_changed", {
    			displayed: 0,
    			offset: 0,
    			count: 0,
    			pages: 0,
    			ele: ctr.ele,
    			template: ctr,
    			trs: transition.in
    		});
    		*/

    		if (!ctr.SCRUBBING)
    			transition.start();

    	} else {

    		const
    			exists = new Map(new_items.map(e => [e, true])),
    			out = [];

    		for (let i = 0, l = ctr.active_scopes.length; i < l; i++)
    			if (exists.has(ctr.active_scopes[i].model))
    				exists.set(ctr.active_scopes[i].model, false);


    		for (let i = 0, l = ctr.scopes.length; i < l; i++)
    			if (!exists.has(ctr.scopes[i].model)) {
    				ctr.scopes[i].transitionOut(transition, "dismounting", true);
    				ctr.scopes[i].index = -1;
    				ctr.scopes.splice(i, 1);
    				l--;
    				i--;
    			} else
    				exists.set(ctr.scopes[i].model, false);

    		exists.forEach((v, k) => { if (v) out.push(k); });

    		if (out.length > 0) {
    			// Wrap models into components
    			added(ctr, out, transition);

    		} else {
    			for (let i = 0, j = 0, l = ctr.active_scopes.length; i < l; i++, j++) {

    				if (ctr.active_scopes[i]._TRANSITION_STATE_) {
    					if (j !== i) {
    						ctr.active_scopes[i].update({
    							arrange: {
    								pos: getColumnRow(i, ctr.offset, ctr.shift_amount),
    								trs: transition.in
    							}
    						});
    					}
    				} else
    					ctr.active_scopes.splice(i, 1), i--, l--;
    			}
    		}

    		filterUpdate(ctr);
    		limitExpressionUpdate(ctr, transition);
    	}
    }

    function filterUpdate(ctr) {

    	let output = ctr.scopes.slice();

    	if (output.length < 1) return;

    	for (let i = 0, l = ctr.filters.length; i < l; i++) {
    		const filter = ctr.filters[i];

    		if (filter.ARRAY_ACTION)
    			output = filter.action(output);
    	}

    	ctr.active_scopes = output;

    	ctr.UPDATE_FILTER = false;

    	return output;
    }

    function limitExpressionUpdate(ctr, transition = glow.createTransition()) {

    	//Preset the positions of initial components. 
    	arrange(ctr);
    	render(ctr, transition);

    	// If scrubbing is currently occuring, if the transition were to auto play then the results 
    	// would interfere with the expected behavior of scrubbing. So the transition
    	// is instead set to it's end state, and scrub is called to set intermittent 
    	// position. 
    	if (!ctr.SCRUBBING)
    		transition.start();
    }

    function arrange(ctr, output = ctr.active_scopes) {

    	//Arranges active scopes according to their arrange handler.
    	const
    		limit = ctr.limit,
    		offset = ctr.offset,
    		transition = glow.createTransition(),
    		output_length = output.length,
    		active_window_start = offset * ctr.shift_amount;



    	let i = 0;

    	//Scopes on the ascending edge of the transition window
    	while (i < active_window_start && i < output_length)
    		output[i].update({ trs_asc_out: { trs: transition.in, pos: getColumnRow(i, offset, ctr.shift_amount) } }), i++;

    	//Scopes in the transtion window
    	while (i < active_window_start + limit && i < output_length)
    		output[i].update({ arrange: { trs: transition.in, pos: getColumnRow(i, offset, ctr.shift_amount) } }), i++;

    	//Scopes on the descending edge of the transition window
    	while (i < output_length)
    		output[i].update({ trs_dec_out: { trs: transition.in, pos: getColumnRow(i, offset, ctr.shift_amount) } }), i++;

    	transition.play(1);

    }


    function render(ctr, transition, output = ctr.active_scopes, NO_TRANSITION = false) {


    	const
    		active_window_size = ctr.limit,
    		active_length = ctr.dom_scopes.length;

    	let
    		j = 0,
    		direction = 1,
    		offset = ctr.offset,
    		output_length = output.length,
    		OWN_TRANSITION = false;

    	if (!transition) transition = glow.createTransition(), OWN_TRANSITION = true;

    	offset = Math.max(0, offset);

    	const active_window_start = offset * ctr.shift_amount;

    	direction = Math.sign(ctr.offset_diff);

    	if (active_window_size > 0) {

    		ctr.shift_amount = Math.max(1, Math.min(active_window_size, ctr.shift_amount));

    		let
    			i = 0,
    			oa = 0;

    		const
    			ein = [],
    			shift_points = Math.ceil(output_length / ctr.shift_amount);

    		ctr.max = shift_points - 1;
    		ctr.offset = Math.max(0, Math.min(shift_points - 1, offset));

    		//Two transitions to support scrubbing from an offset in either direction
    		ctr.trs_ascending = glow.createTransition(false);
    		ctr.trs_descending = glow.createTransition(false);

    		ctr.dom_dn.length = 0;
    		ctr.dom_up.length = 0;
    		ctr.dom_up_appended = false;
    		ctr.dom_dn_appended = false;

    		//Scopes preceeding the transition window
    		while (i < active_window_start - ctr.shift_amount) output[i++].index = -2;

    		//Scopes entering the transition window ascending
    		while (i < active_window_start) {
    			ctr.dom_dn.push(output[i]);
    			output[i].update({ trs_dec_in: { trs: ctr.trs_descending.in, pos: getColumnRow(i, ctr.offset - 1, ctr.shift_amount) } });
    			output[i++].index = -2;
    		}

    		//Scopes in the transition window
    		while (i < active_window_start + active_window_size && i < output_length) {
    			//Scopes on the descending edge of the transition window
    			if (oa < ctr.shift_amount && ++oa) {
    				//console.log("pos",i, getColumnRow(i, ctr.offset+1, ctr.shift_amount), output[i].scopes[0].ele.style.transform)
    				output[i].update({ trs_asc_out: { trs: ctr.trs_ascending.out, pos: getColumnRow(i, ctr.offset + 1, ctr.shift_amount) } });
    			} else
    				output[i].update({ arrange: { trs: ctr.trs_ascending.in, pos: getColumnRow(i, ctr.offset + 1, ctr.shift_amount) } });


    			//Scopes on the ascending edge of the transition window
    			if (i >= active_window_start + active_window_size - ctr.shift_amount)
    				output[i].update({ trs_dec_out: { trs: ctr.trs_descending.out, pos: getColumnRow(i, ctr.offset - 1, ctr.shift_amount) } });
    			else
    				output[i].update({ arrange: { trs: ctr.trs_descending.in, pos: getColumnRow(i, ctr.offset - 1, ctr.shift_amount) } });


    			output[i].index = i;
    			ein.push(output[i++]);
    		}

    		//Scopes entering the transition window while offset is descending
    		while (i < active_window_start + active_window_size + ctr.shift_amount && i < output_length) {
    			ctr.dom_up.push(output[i]);
    			output[i].update({
    				trs_asc_in: {
    					pos: getColumnRow(i, ctr.offset + 1, ctr.shift_amount),
    					trs: ctr.trs_ascending.in
    				}
    			});
    			output[i++].index = -3;
    		}

    		//Scopes following the transition window
    		while (i < output_length) output[i++].index = -3;

    		output = ein;
    		output_length = ein.length;
    	} else {
    		ctr.max = 0;
    		ctr.limit = 0;
    	}

    	const
    		trs_in = { trs: transition.in, index: 0 },
    		trs_out = { trs: transition.out, index: 0 };

    	for (let i = 0; i < output_length; i++) output[i].index = i;

    	for (let i = 0; i < active_length; i++) {

    		const as = ctr.dom_scopes[i];

    		if (as.index > j) {
    			while (j < as.index && j < output_length) {
    				const os = output[j];
    				os.index = -1;
    				trs_in.pos = getColumnRow(j, ctr.offset, ctr.shift_amount);

    				os.appendToDOM(ctr.ele, as.ele);
    				os.transitionIn(trs_in, (direction) ? "trs_asc_in" : "trs_dec_in");
    				j++;
    			}
    		} else if (as.index < 0) {

    			trs_out.pos = getColumnRow(i, 0, ctr.shift_amount);

    			if (!NO_TRANSITION) {
    				switch (as.index) {
    					case -2:
    					case -3:
    						as.transitionOut(trs_out, (direction > 0) ? "trs_asc_out" : "trs_dec_out");
    						break;
    					default:
    						as.transitionOut(trs_out);
    				}
    			} else
    				as.transitionOut();

    			continue;
    		}
    		trs_in.pos = getColumnRow(j++, 0, ctr.shift_amount);

    		as.update({ arrange: trs_in }, null, false, { IMMEDIATE: true });

    		as._TRANSITION_STATE_ = true;
    		as.index = -1;
    	}

    	while (j < output.length) {
    		ctr.ele.appendChild(output[j].ele);
    		output[j].index = -1;
    		trs_in.pos = getColumnRow(j, ctr.offset, ctr.shift_amount);
    		output[j].transitionIn(trs_in, (direction) ? "arrange" : "arrange");

    		j++;
    	}

    	//ctr.ele.style.position = ctr.ele.style.position;

    	ctr.dom_scopes = output.slice();

    	/*
    	ctr.parent.update({
    		"template_count_changed": {

    			displayed: output_length,
    			offset: offset,
    			count: ctr.active_scopes.length,
    			pages: ctr.max,
    			ele: ctr.ele,
    			template: ctr,
    			trs: transition.in
    		}
    	});
    	*/

    	if (OWN_TRANSITION) {
    		if (NO_TRANSITION)
    			return transition;
    		transition.start();
    	}

    	return transition;
    }

    function forceMount(ctr) {
    	const active_window_size = ctr.limit;
    	const offset = ctr.offset;


    	const min = Math.min(offset + ctr.offset_diff, offset) * ctr.shift_amount;
    	const max = Math.max(offset + ctr.offset_diff, offset) * ctr.shift_amount + active_window_size;


    	let i = min;

    	ctr.ele.innerHTML = "";
    	const output_length = ctr.active_scopes.length;
    	ctr.dom_scopes.length = 0;

    	while (i < max && i < output_length) {
    		const node = ctr.active_scopes[i++];
    		ctr.dom_scopes.push(node);
    		ctr.ele.appendChild(node.ele);
    	}
    }

    /**
     * Scrub provides a mechanism to scroll through components of a container that have been limited through the limit filter.
     * @param  {Number} scrub_amount [description]
     */
    function scrub(ctr, scrub_delta, SCRUBBING = true) {
    	// scrub_delta is the relative ammunt of change from the previous offset. 

    	if (!ctr.SCRUBBING)
    		render(ctr, null, ctr.active_scopes, true);

    	ctr.SCRUBBING = true;

    	if (ctr.AUTO_SCRUB && !SCRUBBING && scrub_delta != Infinity) {
    		ctr.scrub_velocity = 0;
    		ctr.AUTO_SCRUB = false;
    	}

    	let delta_offset = scrub_delta + ctr.offset_fractional;

    	if (scrub_delta !== Infinity) {

    		if (Math.abs(delta_offset) > 1) {
    			if (delta_offset > 1) {

    				delta_offset = delta_offset % 1;
    				ctr.offset_fractional = delta_offset;
    				ctr.scrub_velocity = scrub_delta;

    				if (ctr.offset < ctr.max)
    					ctr.trs_ascending.play(1);

    				ctr.offset++;
    				ctr.offset_diff = 1;
    				render(ctr, null, ctr.active_scopes, true).play(1);
    			} else {
    				delta_offset = delta_offset % 1;
    				ctr.offset_fractional = delta_offset;
    				ctr.scrub_velocity = scrub_delta;

    				if (ctr.offset >= 1)
    					ctr.trs_descending.play(1);
    				ctr.offset--;
    				ctr.offset_diff = -1;

    				render(ctr, null, ctr.active_scopes, true).play(1);
    			}

    		}

    		//Make Sure the the transition animation is completed before moving on to new animation sequences.

    		if (delta_offset > 0) {

    			if (ctr.offset + delta_offset >= ctr.max - 1) delta_offset = 0;

    			if (!ctr.dom_up_appended) {

    				for (let i = 0; i < ctr.dom_up.length; i++) {
    					ctr.dom_up[i].appendToDOM(ctr.ele);
    					ctr.dom_up[i].index = -1;
    					ctr.dom_scopes.push(ctr.dom_up[i]);
    				}

    				ctr.dom_up_appended = true;
    			}

    			ctr.trs_ascending.play(delta_offset);
    		} else {

    			if (ctr.offset < 1) delta_offset = 0;

    			if (!ctr.dom_dn_appended) {

    				for (let i = 0; i < ctr.dom_dn.length; i++) {
    					ctr.dom_dn[i].appendToDOM(ctr.ele, ctr.dom_scopes[0].ele);
    					ctr.dom_dn[i].index = -1;
    				}

    				ctr.dom_scopes = ctr.dom_dn.concat(ctr.dom_scopes);

    				ctr.dom_dn_appended = true;
    			}

    			ctr.trs_descending.play(-delta_offset);
    		}

    		ctr.offset_fractional = delta_offset;
    		ctr.scrub_velocity = scrub_delta;

    		return true;
    	} else {

    		if (Math.abs(ctr.scrub_velocity) > 0.0001) {
    			const sign = Math.sign(ctr.scrub_velocity);

    			if (Math.abs(ctr.scrub_velocity) < 0.1) ctr.scrub_velocity = 0.1 * sign;
    			if (Math.abs(ctr.scrub_velocity) > 0.5) ctr.scrub_velocity = 0.5 * sign;

    			ctr.AUTO_SCRUB = true;

    			//Determine the distance traveled with normal drag decay of 0.5
    			let dist = ctr.scrub_velocity * (1 / (-0.5 + 1));
    			//get the distance to nearest page given the distance traveled
    			let nearest = (ctr.offset + ctr.offset_fractional + dist);
    			nearest = (ctr.scrub_velocity > 0) ? Math.min(ctr.max, Math.ceil(nearest)) : Math.max(0, Math.floor(nearest));
    			//get the ratio of the distance from the current position and distance to the nearest 
    			let nearest_dist = nearest - (ctr.offset + ctr.offset_fractional);
    			let drag = Math.abs(1 - (1 / (nearest_dist / ctr.scrub_velocity)));

    			ctr.drag = drag;
    			ctr.SCRUBBING = true;
    			spark.queueUpdate(ctr);
    			return true;
    		} else {
    			ctr.offset += Math.round(ctr.offset_fractional);
    			ctr.scrub_velocity = 0;
    			ctr.offset_fractional = 0;
    			render(ctr, null, ctr.active_scopes, true).play(1);
    			ctr.SCRUBBING = false;
    			return false;
    		}
    	}
    }

    /**
     * Called by the ModelContainer when Models have been added to its set.
     *
     * @param      {Array}  items   An array of new items now stored in the ModelContainer. 
     */
    function added(ctr, items, transition) {
    	let OWN_TRANSITION = false;

    	if (!transition)
    		transition = glow.createTransition(), OWN_TRANSITION = true;

    	for (let i = 0; i < items.length; i++) {
    		const scope = ctr.component.mount(null, items[i]);

    		//TODO: Make sure both of there references are removed when the scope is destroyed.
    		ctr.scopes.push(scope);
    		//ctr.parent.addScope(scope);

    		scope.update({ loaded: true });
    	}



    	if (OWN_TRANSITION)
    		filterExpressionUpdate(ctr, transition);
    }

    return wick_lite;

}());
