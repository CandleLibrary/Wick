var wick = (function (exports) {
    'use strict';

    var null_token = {
        type: "",
        text: ""
    };

    class Lexer {
        constructor(tokenizer) {
            this.tk = tokenizer;

            this.token = tokenizer.next();

            this.hold = null;

            while (this.token && (this.token.type === "new_line" || this.token.type === "white_space" || this.token.type === "generic")) {
                this.token = this.tk.next();
            }
        }

        reset(){
            this.tk.reset();
            this.token = this.tk.next();
            this.hold = null;
        }

        next() {
            if (this.hold !== null) {
                this.token = this.hold;
                this.hold = null;
                return this.token;
            }

            if (!this.token) return null;
            do {
                this.token = this.tk.next();
            } while (this.token && (this.token.type === "new_line" || this.token.type === "white_space" || this.token.type === "generic"));

            if (this.token) {
                return this.token;
            }
            return null;
        }

        assert(text) {
            if (!this.token) throw new Error(`Expecting ${text} got null`);

            var bool = this.token.text == text;


            if (bool) {
                this.next();
            }else{
                throw new Error(`Expecting "${text}" got "${this.token.text}"`)
            }

            return bool;
        }

        peek() {
            if (this.hold) {
                return this.hold;
            }

            this.hold = this.tk.next();

            if (!this.hold) return null_token;

            while (this.hold && (this.hold.type === "new_line" || this.hold.type === "white_space" || this.hold.type === "generic")) {
                this.hold = this.tk.next();
            }

            if (this.hold) {
                return this.hold;
            }

            return null_token;
        }

        get text() {
            if (this.token)
                return this.token.text;
            return null;
        }

        get type() {
            if (this.token)
                return this.token.type;
            return "";
        }

        get pos(){
            if (this.token)
                return this.token.pos;
            return -1;
        }

        slice(start) {
            if (this.token)
                return this.tk.string.slice(start, this.token.pos)
            return this.tk.string.slice(start)
        }
    }

    //Compares code with argument list and returns true if match is found, otherwise false is returned
    function compareCode(code) {
        var list = arguments;
        for (var i = 1, l = list.length; i < l; i++) {
            if (list[i] === code) return true;
        }
        return false;
    }

    //Returns true if code lies between the other two arguments
    function inRange(code) {
        return (code > arguments[1] && code < arguments[2]);
    }

    //The resulting array is used while parsing and tokenizing token strings
    var string_parse_and_format_functions = (function() {
        var array = [{
                type: "number",
                //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
                check(code, text, offset) {
                    if (inRange(code, 47, 58)) {
                        code = text.charCodeAt(1 + offset);
                        if (compareCode(code, 66, 98, 88, 120, 79, 111)) {
                            return 2;
                        }
                        return 1;
                    } else if (code == 46) {
                        code = text.charCodeAt(1 + offset);
                        if (inRange(code, 47, 58)) {
                            return 2;
                        }
                    }
                    return 0;
                },
                // Scan for end of token. Return false if character not part of token
                scanToEnd(code) {
                    return (inRange(code, 47, 58) || code === 46) ? -1 : 0;
                },
                format(token) {
                    token.color = "rgb(20,40,180)";
                }

            }, {
                type: "identifier",
                //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
                check(code) {
                    return (inRange(code, 64, 91) || inRange(code, 96, 123)) ? 1 : 0;
                },
                // Scan for end of token. Return false if character not part of token
                scanToEnd(code) {
                    return (inRange(code, 47, 58) || inRange(code, 64, 91) || inRange(code, 96, 123) || compareCode(code, 35, 36, 45, 95)) ? -1 : 0;
                },
                format(token) {

                    //token.color = randomColor();
                }

            },/* {
                type: "comment",
                //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
                check(code, text) {
                    return ((code === 47) && (text.charCodeAt(1) === 47)) ? 2 : 0;
                },
                // Scan for end of token. Return false if character not part of token
                scanToEnd(code) {
                    return (inRange(code, 32, 128) || code === 32 || code === 9) ? -1 : 0;
                },
                format(token) {
                    //console.log(token)
                }

            }, */{
                type: "string",
                //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
                check(code, text) {
                    return (code === 34) ? 1 : 0;
                },
                // Scan for end of token. Return false if character not part of token
                scanToEnd(code) {
                    return (code === 34) ? 1 : -1;
                },

                format(token) {
                    //console.log(token)
                }

            }, {
                type: "white_space",
                //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
                check(code) {
                    return (code === 32 || code === 9) ? 1 : 0;
                },
                // Scan for end of token. Return false if character not part of token
                scanToEnd(code) {
                    return (code === 32 || code === 9) ? -1 : 0;
                },
                format(token) {
                    //console.log(token)
                }

            }, {
                type: "new_line",
                //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
                check(code) {
                    return (code === 10) ? 1 : 0;
                },
                // Scan for end of token. Return false if character not part of token
                scanToEnd(code) {
                    return 0;
                },
                format(token) {
                    //console.log(token)
                }
            }, {
                type: "open_bracket",
                //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
                check(code) {
                    return compareCode(code, 123, 40, 91) ? 1 : 0;
                },
                // Scan for end of token. Return false if character not part of token
                scanToEnd(code) {
                    //Single character, end comes immediatly
                    return 0;
                },
                format(token) {
                    token.color = "rgb(100,100,100)";
                }

            }, {
                type: "close_bracket",
                //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
                check(code) {
                    return compareCode(code, 125, 41, 93) ? 1 : 0;
                },
                // Scan for end of token. Return false if character not part of token
                scanToEnd(code) {
                    //Single character, end comes immediatly
                    return 0;
                },
                format(token) {
                    token.color = "rgb(100,100,100)";
                }

            },

            {
                type: "Operator",
                //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
                check(code) {
                    return compareCode(code, 42, 43, 60, 61, 62, 92, 38, 37, 33, 94, 124, 58) ? 1 : 0;
                },
                // Scan for end of token. Return false if character not part of token
                scanToEnd(code) {
                    //Single character, end comes immediatly
                    return 0;
                },
                format(token) {
                    token.color = "rgb(205,120,0)";
                }

            }, {
                type: "Symbol", //Everything else should be generic symbols
                check(code) {
                    return 1;
                },
                // Scan for end of token. Return false if character not part of token
                scanToEnd(code) {
                    //Generic will capture ANY remainder character sets.
                    return 0;
                },
                format(token) {
                    token.color = "red";
                }
            }
        ];

        //This allows for creation custom parsers and formatters based upon this object.
        array.clone = function() {
            return string_parse_and_format_functions();
        };

        return array;
    });

    var SPF = string_parse_and_format_functions();
    var SPF_length = SPF.length;

    class Tokenizer {
        constructor(string) {
        	this.h = null;
    	    this.line = 0;
    	    this.char = 0;
    	    this.offset = 0;
    	    this.string = string;
        }

        reset(){
            this.line = 0;
            this.char = 0;
            this.offset = 0;
        }

        hold(token) {
            this.h = token;
        }

        next() {

            var token_length = 0;

            if (this.h) {
                var t = this.h;
                this.h = null;
                return t;
            }

            if (this.string.length < 1) return null;

            let offset = this.offset;
            
            if (offset >= this.string.length) return null;

            var code = this.string.charCodeAt(offset);
            let SPF_function;
            for (var i = 0; i < SPF_length; i++) {
                SPF_function = SPF[i];
                let test_index = SPF_function.check(code, this.string, offset);
                if (test_index > 0) {
                    this.type = SPF_function.type;
                    var e = 0;
                    for (i = test_index; i < this.string.length; i++) {
                        e = SPF_function.scanToEnd(this.string.charCodeAt(i + offset));
                        if (e > -1) break;
                        e = 0;
                    }
                    token_length = i + e;
                    break;
                }
            }

            var temp = this.string.slice(offset, offset + token_length);

            if (SPF_function.type === "new_line") {
                this.char = 0;
                this.line++;
            }

            var out = {
                type: SPF_function.type,
                text: temp,
                pos: this.offset,
                length: token_length,
                char: this.char,
                line: this.line
            };

            this.offset += token_length;
            this.char += token_length;

            return out;
        }
    }

    /**
    URL Query Syntax

    root => [root_class] [& [classes]]
         => [classes]

    root_class = key_list

    class_list [class [& class_list]]

    class => name & key_list

    key_list => [key_val [& key_list]]

    key_val => name = val

    name => ALPHANUMERIC_ID

    val => NUMBER
        => ALPHANUMERIC_ID
    */
    function QueryStringToQueryMap(query){

      let mapped_object = new Map;

      if(!query instanceof String){
        console.warn("query argument provided is not a string!");
        return mapped_object;
      }

      if(query[0] == "?") query = query.slice(1);

      let lex = new Lexer(new Tokenizer(query));

      function key_val_list(lex, map){
        let token;
        while((token = lex.token) && token.text !== "&"){
          if(lex.peek().text == "="){
            let key = token.text;
            lex.next();
            lex.next();
            let val = lex.token;
            map.set(key, (val.type == "number")?parseFloat(val.text):val.text);
            lex.next();
            lex.next();
            continue;
          }
          return;
        }
      }

      function class_(lex, map){

        let token;

        if((token = lex.peek()) && token.text == "&"){

          token = lex.token;

          lex.next();lex.next();
          map.set(token.text, new Map());
          key_val_list(lex,map.get(token.text));

          return true;
        }

        return false;
      }

      function root(lex,map){
           map.set(null, new Map());

          if(lex.peek().text == "&"){
              class_(lex, map);
          }else{
              key_val_list(lex, map.get(null));
          }



        while(lex.token && lex.token.text =="&"){
          lex.next();
          class_(lex, map);
        }
      }

      root(lex, mapped_object);
      return mapped_object;
    }

    function QueryMapToQueryString(map){
        let null_class,str ="";
        if((null_class = map.get(null))){
            if(null_class.length > 0){
                for(let [key,val] of null_class.entries()){
                    str += `&${key}=${val}`;
                }
            }
            for(let [key,class_] of map.entries()){
                if(key == null) continue;
                str += `&${key}`;
                for(let [key,val] of class_.entries()){
                    str += `&${key}=${val}`;
                }
            }
            return str.slice(1);
        }
        return str;
    }
    function TurnDataIntoQuery(data) {
        var str = "";

        if (arguments.length > 1)
            for (var i = 0; i < arguments.length; i++) {
                data = arguments[i];

                if (data.component) {
                    var new_str = `${data.component}&`;

                    for (var a in data)
                        new_str += (a != "component") ? `${a}=${data[a]}\&` : "";

                    str += new_str.slice(0, -1) + ".";
                }
            }
        else
            for (var a in data)
                str += `${a}=${data[a]}\&`;

        return str.slice(0, -1);
    }

    function TurnQueryIntoData(query) {
        var out = {};

        let t = query.split(".");

        if (t.length > 0)
            t.forEach((a) => {
                var t = {};
                if (a.length > 1) {
                    a.split("&").forEach((a, i) => {
                        if (i < 1) out[a] = t;
                        else {
                            let b = a.split("=");
                            out[b[0]] = b[1];
                        }
                    });
                }
            });
        else {
            query.split("&").forEach((a) => {
                let b = a.split("=");
                out[b[0]] = b[1];
            });
        }



        return out;
    }

    class WURL {
        constructor(location){
            //parse the url into different sections
            this.path = location.pathname;
            this.host = location.hostname;
            this.query = QueryStringToQueryMap(location.search.slice(1));
        }

        setPath(path){
            this.path = path;
            this.setLocation();
        }

        setLocation(){
            history.replaceState({},"replaced state",`${this}`);
            window.onpopstate();
        }

        toString(){
            return `${this.path}?${QueryMapToQueryString(this.query)}`;
        }

        getClass(class_name){

            if(!class_name) class_name = null;
            
            let out = {}, class_;

            if(class_ = this.query.get(class_name)){
                for(let [key, val] of class_.entries()){
                    out[key] = val;
                }
            }

            return out;
        }

        set(class_name, key_name, value){

            if(!class_name) class_name = null;

            if(!this.query.has(class_name)) this.query.set(class_name, new Map());

            let class_ = this.query.get(class_name);

            class_.set(key_name, value);

            this.setLocation();
        }

        get(class_name, key_name){
            if(!class_name) class_name = null;

            let class_ = this.query.get(class_name);


            return (class_) ? class_.get(key_name) : null;  
        }

    }

    //Updates UI
    //Updated By Model

    class View{
    	constructor(){
    		this.next = null;
    		this.model = null;
    	}

    	destructor(){
    		if(this.model){
    			this.model.removeView(this);
    		}
    	}	
    	/**
    		Called a Model when its data has changed.
    	*/
    	update(data){

    	}
    	/**
    		Called by a ModelContainer when an item has been removed.
    	*/
    	removed(data){

    	}

    	/**
    		Called by a ModelContainer when an item has been added.
    	*/
    	added(data){

    	}
    	setModel(model){
    	}

    	reset(){
    		
    	}
    	unsetModel(){
    		this.next = null;
    		this.model = null;
    	}
    }

    const caller = (window && window.requestAnimationFrame) ? window.requestAnimationFrame : (f) => {
        setTimeout(f, 1);
    };
    /** 
        The Scheduler handles updating objects. It does this by splitting up update cycles, 
        to respect the browser event model. 

        If any object is scheduled to be updated, it will be blocked from scheduling more updates 
        until its own update method is called.
    */

    const Scheduler = new(class {

        constructor() {

            this.update_queue_a = new Array();
            this.update_queue_b = new Array();

            this.update_queue = this.update_queue_a;

            this.queue_switch = 0;


            this.callback = () => this.update();

            this.frame_time = performance.now();

            this.____SCHEDULED____ = false;
        }

        queueUpdate(object) {

            if (object.____SCHEDULED____ || !object.update instanceof Function)
                if (this.____SCHEDULED____)
                    return;
                else
                    return caller(this.callback);

            object.____SCHEDULED____ = true;

            this.update_queue.push(object);


            if (this.____SCHEDULED____)
                return;

            this.____SCHEDULED____ = true;

            caller(this.callback);
        }

        update() {

            this.____SCHEDULED____ = false;

            let uq = this.update_queue;

            if(this.queue_switch == 0)
                (this.update_queue = this.update_queue_b, this.queue_switch = 1);
            else
                (this.update_queue = this.update_queue_a, this.queue_switch = 0);

            let time = performance.now();

            let diff = time - this.frame_time;

            this.frame_time = time;

            let step_ratio = (diff * 0.06); //  step_ratio of 1 = 16.66666666 or 1000 / 60 for 60 FPS

            for (let i = 0, l = uq.length, o = uq[0]; i < l; o = uq[++i]){
                o.____SCHEDULED____ = false;
                o.update(step_ratio);
            }

            uq.length = 0;
        }
    })();

    class ModelBase {
    	constructor() {
       		this.____changed_values____ = [];
    	};

    	destructor() {
    		debugger
            //inform views of the models demise
            var view = this.first_view;

            while (view) {
                view.unsetModel();
                view = view.next;
            }

            //this.first_view = null;

            this.____changed_values____ = null;
    	}

    	get (){
    		return this;
    	}


    	/**
    		
    	*/

        scheduleUpdate(changed_value) {
        	if(!this.first_view)
        		return;

        	this.____changed_values____.push(changed_value);

            Scheduler.queueUpdate(this);
        }

        getChanged(prop_name) {

            for (let i = 0, l = this.____changed_values____.length; i < l; i++)
                if (this.____changed_values____[i] == prop_name)
                    return this[prop_name];

            return null;
        }

        update(step) {

            this.updateViews(this);

            this.____changed_values____.length = 0;
        }

    	/**
    		Adds a view to the linked list of views on the model. argument view MUST be an instance of View. 
    	*/
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

    			view.setModel(this);
    			view.update(this.get());
    		}else{
    			throw new Exception("Passed in view is not an instance of wick.View!");
    		}
    	}

    	/**
    		Removes view from set of views if the passed in view is a member of model. 
    	*/
    	removeView(view) {
    		if (view instanceof View && view.model == this) {
    			var child_view = this.first_view;
    			var prev_child = null;

    			while (child_view) {
    				if (view == child_view) {

    					if (prev_child) {
    						prev_child.next = view.next;
    					} else {
    						this.first_view = view.next;
    					}

    					view.next = null;
    					view.model = null;
    					view.reset();
    					return;
    				}
    				prev_child = child_view;
    				child_view = child_view.next;
    			}

    			//debugger
    		}
    		console.warn("View not a member of Model!", view);
    	}
    	/**
    		Calls update() on every view object, passing the current state of the Model.
    	*/	
    	updateViews() {
    		var view = this.first_view;

    		while (view) {
    			
    			view.update(this, this.____changed_values____);

    			
    			view = view.next;
    		}
    		
    		this.____changed_values____.length = 0;
    	}

    	/**
    		Updates views with a list of models that have been removed. 
    		Primarily used in conjunction with container based views, such as CaseTemplates.
    	*/
    	updateViewsRemoved(data) {
    		var view = this.first_view;

    		while (view) {
    			
    			view.removed(data);
    			
    			view = view.next;
    		}
    	}

    	/**
    		Updates views with a list of models that have been added. 
    		Primarily used in conjunction with container based views, such as CaseTemplates.
    	*/
    	updateViewsAdded(data) {
    		var view = this.first_view;

    		while (view) {
    			
    			view.added(data);
    			
    			view = view.next;
    		}
    	}

        toJson() {
            return JSON.stringify(this,null, '\t');
        }
    }

    Object.defineProperty(ModelBase.prototype, "first_view", {
    	writable : true,
    	configurable : false,
    	enumerable : false,
    });

    Object.defineProperty(ModelBase.prototype, "____changed_values____", {
    	writable : true,
    	configurable : false,
    	enumerable : false,
    });


    Object.seal(ModelBase.prototype);

    /**
    	Schema type. Handles the parsing, validation, and filtering of Model data properties. 
    */
    class SchemaType {
    	
    	constructor(){
    		this.start_value = undefined;
    	}
    	
    	/**
    		Parses value returns an appropriate transformed value
    	*/
    	parse(value){
    		return value;
    	}

    	/**

    	*/
    	verify(value, result){
    		result.valid = true;
    	}

    	filter(){
    		return true;
    	}

    	string(value){
    		return value + "";
    	}
    }

    class MCArray extends Array {
        constructor() {
            super();
        }

        push(item) {
            if (item instanceof Array)
                item.forEach((i) => {
                    this.push(i);
                });
            else
                super.push(item);
        }

        //For compatibility
        __setFilters__() {

        }
        getChanged() {

        }

        toJSON() {
            return this;
        }

        toJson() {
            return JSON.stringify(this, null, '\t');
        }
    }

    // A "null" function
    let EmptyFunction = () => {};
    let EmptyArray = [];



    class ModelContainer extends ModelBase {

        constructor(schema) {

            super();

            //For Linking to original 
            this.source = null;
            this.first_link = null;
            this.next = null;
            this.prev = null;

            //For keeping the container from automatic deletion.
            this.pin = EmptyFunction;

            //Filters are a series of strings or number selectors used to determine if a model should be inserted into or retrieved from the container.
            this.__filters__ = EmptyArray;

            this.schema = schema || this.constructor.schema || {};

            //The parser will handle the evaluation of identifiers according to the criteria set by the __filters__ list. 

            if (this.schema.parser && this.schema.parser instanceof SchemaType) {
                this.parser = this.schema.parser;
            } else {
                this.parser = new SchemaType();
            }

            this.id = "";

            if (this.schema.identifier && typeof(this.schema.identifier) == "string") {
                this.id = this.schema.identifier;
            }
            return this
            return new Proxy(this, {
                get: (obj, prop, val) => (prop in obj) ? obj[prop] : obj.get(val)
            })
        }

        destructor() {
            this.schema = null;

            this.__filters__ = null;

            if (this.source) {
                this.source.__unlink__(this);
            }

            super.destructor();
        }

        /**
            Get the number of Models held in this ModelContainer

            @returns {Number}
        */
        get length() {
            return 0;
        }

        set length(e) {
            //NULL function. Do Not Override!
        }

        /** 
            Returns a ModelContainer type to store the results of a get().
        */
        __defaultReturn__(USE_ARRAY) {
            if (USE_ARRAY) return new MCArray;

            let n = new this.constructor(this.schema);

            this.__link__(n);

            return n;
        }

        /**
            Array emulating kludge

            @returns The result of calling this.insert
        */
        push(item) {
            return this.insert(item, true);
        }

        /**
            Retrieves a list of items that match the term/terms. 

            @param {(Array|SearchTerm)} term - A single term or a set of terms to look for in the ModelContainer. 
            @param {Array} __return_data__ - Set to true by a source Container if it is calling a SubContainer insert function. 

            @returns {(ModelContainer|Array)} Returns a Model container or an Array of Models matching the search terms. 
        */
        get(term, __return_data__) {

            let out = null;

            let USE_ARRAY = true;

            if (term) {




                if (__return_data__) {
                    out = __return_data__;
                } else {

                    if (__return_data__ === null)
                        USE_ARRAY = false;

                    if (!this.source)
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

                if (!term instanceof Array)
                    terms = [term];

                //Need to convert terms into a form that will work for the identifier type
                terms = terms.map(t => this.parser.parse(t));


                this.__get__(terms, out);
            }

            return out
        }

        /**
            Inserts an item into the container. If the item is not a {Model}, an attempt will be made to convert the data in the Object into a Model.
            If the item is an array of objects, each object in the array will be considered separately. 

            @param {Object} item - An Object to insert into the container. On of the properties of the object MUST have the same name as the ModelContainer's 
            @param {Array} item - An array of Objects to insert into the container.
            @param {Boolean} __FROM_SOURCE__ - Set to true by a source Container if it is calling a SubContainer insert function. 

            @returns {Boolean} Returns true if an insertion into the ModelContainer occurred, false otherwise.
        */
        insert(item, __FROM_SOURCE__ = false) {

            let add_list = (this.first_view) ? [] : null;

            let out = false;

            if (!__FROM_SOURCE__ && this.source)
                return this.source.insert(item);

            if (item instanceof Array) {
                for (var i = 0; i < item.length; i++)
                    if (this.__insertSub__(item[i], out, add_list))
                        out = true;
            } else if (item)
                out = this.__insertSub__(item, out, add_list);


            if (add_list && add_list.length > 0)
                this.updateViewsAdded(add_list);

            return out;
        }

        /**
            A subset of the insert function. Handles the test of identifier, the conversion of an Object into a Model, and the calling of the internal __insert__ function.
        */
        __insertSub__(item, out, add_list) {

            let model = item;

            var identifier = this.__getIdentifier__(item);

            if (identifier != undefined) {

                if (!(model instanceof this.schema.model) && !(model = model.____self____)) {
                    model = new this.schema.model();
                    model.add(item);
                }

                identifier = this.__getIdentifier__(model, this.__filters__);

                if (identifier) {
                    out = this.__insert__(model, add_list, identifier);
                    this.__linksInsert__(model);
                }
            }

            return out;
        }


        /**
            Removes an item from the container. 
        */
        remove(term, __FROM_SOURCE__ = false) {

            let terms = term;

            if (!__FROM_SOURCE__ && this.source) {

                if (!term)
                    return this.source.remove(this.__filters__);
                else
                    return this.source.remove(term);
            }

            let out_container = [];

            if (!term)
                this.__removeAll__();
            else {
                if (!term instanceof Array) {
                    terms = [term];
                }

                //Need to convert terms into a form that will work for the identifier type
                terms = terms.map(t => this.parser.parse(t));

                this.__remove__(terms, out_container);
            }

            this.__linksRemove__(terms);

            return out_container;
        }

        /**
            Removes a ModelContainer from list of linked containers. 

            @param {ModelContainer} container - The ModelContainer instance to remove from the set of linked containers. Must be a member of the linked containers. 
        */
        __unlink__(container) {

            if (container instanceof ModelContainer && container.source == this) {

                if (container == this.first_link)
                    this.first_link = container.next;

                if (container.next)
                    container.next.prev = container.prev;

                if (container.prev)
                    container.prev.next = container.next;

                container.source = null;
            }
        }

        /**
            Adds a container to the list of tracked containers. 

            @param {ModelContainer} container - The ModelContainer instance to add the set of linked containers.
        */
        __link__(container) {
            if (container instanceof ModelContainer && !container.source) {

                container.source = this;

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
                        if (!container.source)
                            console.warn("failed to clear the destruction of container in time!");
                    }
                })(container);
            }
        }

        __linksRemove__(terms) {
            let a = this.first_link;
            while (a) {
                a.remove(terms, true);
                a = a.next;
            }
        }

        __linksInsert__(item) {
            let a = this.first_link;
            while (a) {
                a.insert(item, true);
                a = a.next;
            }
        }

        /**
            Removes any items in the model not included in the array "items", and adds any items in items not already in the ModelContainer.

            @param {Array} items - An array of identifiable Models or objects. 
        */
        cull(items) {
            let existing_items = __getAll__([], true);

            let loadHash = (item) => {
                if (item instanceof Array)
                    return item.forEach((e) => loadHash(e));

                let identifier = this.__getIdentifier__(item);

            };

            loadHash(items);

            for (let i = 0; i < existing_items.lenth; i++) {
                let e_item = existing_items[i];
                if (!existing_items[this.__getIdentifier__(e_item)])
                    this.__remove__(e_item);
            }

            this.insert(items);
        }

        __setFilters__(term) {
            if (term instanceof Array)
                this.__filters__ = this.__filters__.concat(term.map(t => this.parser.parse(t)));
            else
                this.__filters__.push(this.parser.parse(term));

        }

        /**
            Returns true if the identifier matches a predefined filter pattern, which is evaluated by this.parser. If a 
            parser was not present the ModelContainers schema, then the function will return true upon every evaluation.
        */
        __filterIdentifier__(identifier, filters) {
            if (filters.length > 0) {
                return this.parser.filter(identifier, filters);
            }
            return true;
        }

        /**
            Returns the Identifier property value if it exists in the item. If an array value for filters is passed, then undefined is returned if the identifier value does not pass filtering criteria.
            @param {(Object|Model)} item
            @param {Array} filters - An array of filter terms to test whether the identifier meets the criteria to be handled by the ModelContainer.
        */
        __getIdentifier__(item, filters = null) {

            let identifier = null;

            if (typeof(item) == "object")
                identifier = item[this.schema.identifier];
            else
                identifier = item;

            if (identifier)
                identifier = this.parser.parse(identifier);

            if (filters && identifier)
                return (this.__filterIdentifier__(identifier, filters)) ? identifier : undefined;

            return identifier;
        }

        /** 
            OVERRIDE SECTION ********************************************************************
            
            All of these functions should be overridden by inheriting classes
        */

        __insert__(item, add_list, identifier) {
            return false;
        }

        __get__(item, __return_data__) {
            return __return_data__;
        }

        __getAll__(__return_data__) {
            return __return_data__;
        }

        __removeAll__() {
            return [];
        }

        __remove__(item) {
            return [];
        }

        // END OVERRIDE *************************************************************************

    }

    class MultiIndexedContainer extends ModelContainer {
        constructor(schema) {

            super({
                identifier: "indexed",
                model: schema.model
            });

            this.schema = schema;
            this.indexes = {};
            this.first_index = null;

            this.addIndex(schema.index);
        }

        /**
            Returns the length of the first index in this container. 
        */
        get length() {
            return this.first_index.length;
        }

        /**
            Insert a new ModelContainer into the index through the schema.  
        */
        addIndex(index_schema) {

            for (let name in index_schema) {
                let scheme = index_schema[name];

                if (scheme.container && !this.indexes[name]) {
                    this.indexes[name] = new scheme.container(scheme.schema);

                    if (this.first_index)
                        this.indexes[name].insert(this.first_index.__getAll__());
                    else
                        this.first_index = this.indexes[name];
                }
            }
        }

        get(item, __return_data__) {

            let out = {};

            if (item) {
                for (let name in item)
                    if (this.indexes[name])
                        out[name] = this.indexes[name].get(item[name], __return_data__);
            } else

                out = this.first_index.get(null);


            return out;
        }

        remove(item) {

            var out = [];

            for (let a in item)
                if (this.indexes[a])
                    out = out.concat(this.indexes[a].remove(item[a]));

            /* Replay items against indexes to insure all items have been removed from all indexes */

            for (var j = 0; j < this.indexes.length; j++)
                for (var i = 0; i < out.length; i++)
                    this.indexes[j].remove(out[i]);

            //Update all views
            if (out.length > 0)
                this.updateViewsRemoved(out);

            return out;
        }

        __insert__(model, add_list, identifier) {

            let out = false;

            for (let name in this.indexes) {

                let index = this.indexes[name];

                if (index.insert(model))
                    out = true;
                //else
                //    console.warn(`Indexed container ${a} ${index} failed to insert:`, model);
            }

            if (out)
                this.updateViews(this.first_index.get());

            return out;
        }
        /**
            @private 
        */
        __remove__(item) {

            let out = false;

            for (let name in this.indexes) {
                let index = this.indexes[name];
                if (index.remove(item))
                    out = true;
            }

            return out;
        }

        __removeAll__() {

            let out = false;

            for (let name in this.indexes) {
                if (index.__removeAll__())
                    out = true;
            }

            return out;
        }


        /**
            Overrides Model container default __getIdentifier__ to force item to pass.
            @private 
        */
        __getIdentifier__(item, filters = null) {
            return true;
        }

        toJSON() {
            return "[]";
        }
    }

    /**
     */
    class ArrayModelContainer extends ModelContainer {

        constructor(schema) {
            super(schema);
            this.data = [];
        }

        destructor() {

            this.data = null;

            super.destructor();
        }

        get length() {
            return this.data.length;
        }

        __defaultReturn__() {
            if (this.source) return new MCArray;

            let n = new ArrayModelContainer(this.schema);

            this.__link__(n);

            return n;
        }

        __insert__(model, add_list, identifier) {

            for (var i = 0, l = this.data.length; i < l; i++) {

                var obj = this.data[i];

                if (this.__getIdentifier__(obj) == identifier) {

                    obj.add(model);

                    return false; //Model not added to Container. Model just updated.
                }
            }

            this.data.push(model);

            if (add_list) add_list.push(model);

            return true; // Model added to Container.
        }

        __get__(term, return_data) {

            let terms = null;

            if (term)
                if (term instanceof Array) {
                    terms = term;
                } else
                    terms = [term];



            for (let i = 0, l = this.data.length; i < l; i++) {
                let obj = this.data[i];
                if (this.__getIdentifier__(obj, terms)) {
                    return_data.push(obj);
                }
            }

            return return_data;
        }

        __getAll__(return_data) {

            this.data.forEach((m) => {
                return_data.push(m);
            });

            return return_data;
        }

        __removeAll__() {
            let items = this.data.map(d => d) || [];

            this.data.length = 0;

            return items;
        }

        __remove__(term, out_container) {
            let result = false;
            for (var i = 0, l = this.data.length; i < l; i++) {
                var obj = this.data[i];

                if (this.__getIdentifier__(obj, term)) {

                    result = true;

                    this.data.splice(i, 1);

                    l--;
                    i--;

                    out_container.push(obj);
                }
            }

            return result;
        }

        toJSON() {

            return this.data;
        }
    }

    class BTreeModelContainer extends ModelContainer {

        constructor(schema) {

            super(schema);

            this.root = null;
            this.min = 10;
            this.max = 20;
            this.size = 0;
        }

        destructor() {
            if (this.root)
                this.root.destructor();

            super.destructor();
        }

        get length() {
            return this.size;
        }

        __insert__(model, add_list, identifier) {

            let result = {
                added: false
            };

            if (!this.root)
                this.root = new BtreeNode(true);

            this.root = this.root.insert(identifier, model, this.max, true, result).newnode;

            if (add_list) add_list.push(model);

            if (result.added)
                this.size++;

            return result.added;
        }

        __get__(terms, __return_data__) {

            if (this.root && terms.length > 0) {
                if (terms.length == 1) {
                    this.root.get(parseFloat(terms[0]), parseFloat(terms[0]), __return_data__);
                } else if (terms.length < 3) {
                    this.root.get(parseFloat(terms[0]), parseFloat(terms[1]), __return_data__);
                } else {
                    for (let i = 0, l = terms.length - 1; i > l; i += 2)
                        this.root.get(parseFloat(terms[i]), parseFloat(terms[i + 1]), __return_data__);
                }
            }

            return __return_data__;
        }

        __remove__(terms, out_container) {
            let result = 0;

            if (this.root && terms.length > 0) {
                if (terms.length == 1) {
                    let o = this.root.remove(terms[0], terms[0], true, this.min, out_container);
                    result = o.out;
                    this.root = o.out_node;
                } else if (terms.length < 3) {
                    let o = this.root.remove(terms[0], terms[1], true, this.min, out_container);
                    result =o.out;
                    this.root = o.out_node;
                } else {
                    for (let i = 0, l = terms.length - 1; i > l; i += 2) {
                        let o = this.root.remove(terms[i], terms[i + 1], true, this.min, out_container);
                        result = o.out;
                        this.root = o.out_node;
                    }
                }
            }

            this.size -= result;

            return result !== 0;
        }

        __getAll__(__return_data__) {
            if (this.root)
                this.root.get(-Infinity, Infinity, __return_data__);
            return __return_data__;
        }

        __removeAll__() {
            if (this.root)
                this.root.destructor();
            this.root = null;
        }

        toJSON() {
            let out_data = [];

            if (this.root) {

                this.root.get(-Infinity, Infinity, out_data);
            }

            return out_data;
        }
    }

    class BtreeNode {
        constructor(IS_LEAF = false) {
            this.LEAF = IS_LEAF;
            this.nodes = [];
            this.keys = [];
            this.items = 0;
        }

        destructor() {

            this.nodes = null;
            this.keys = null;

            if (!this.LEAF) {
                for (let i = 0, l = this.nodes.length; i < l; i++)
                    this.nodes[i].destructor();
            }

        }

        balanceInsert(max_size, IS_ROOT = false) {
            if (this.keys.length >= max_size) {
                //need to split this up!

                let newnode = new BtreeNode(this.LEAF);

                let split = (max_size >> 1) | 0;

                let key = this.keys[split];

                let left_keys = this.keys.slice(0, split);
                let left_nodes = this.nodes.slice(0, (this.LEAF) ? split : split + 1);

                let right_keys = this.keys.slice((this.LEAF) ? split : split + 1);
                let right_nodes = this.nodes.slice((this.LEAF) ? split : split + 1);

                newnode.keys = right_keys;
                newnode.nodes = right_nodes;

                this.keys = left_keys;
                this.nodes = left_nodes;

                if (IS_ROOT) {

                    let root = new BtreeNode();

                    root.keys.push(key);
                    root.nodes.push(this, newnode);

                    return {
                        newnode: root,
                        key: key
                    };
                }

                return {
                    newnode: newnode,
                    key: key
                }
            }

            return {
                newnode: this,
                key: 0
            };
        }

        /**
            Inserts model into the tree, sorted by identifier. 
        */
        insert(identifier, model, max_size, IS_ROOT = false, result) {

            let l = this.keys.length;

            if (!this.LEAF) {

                for (var i = 0; i < l; i++) {

                    let key = this.keys[i];

                    if (identifier < key) {
                        let node = this.nodes[i];

                        let o = node.insert(identifier, model, max_size, false, result);
                        let keyr = o.key;
                        let newnode = o.newnode;

                        if (keyr == undefined) debugger

                        if (newnode != node) {
                            this.keys.splice(i, 0, keyr);
                            this.nodes.splice(i + 1, 0, newnode);
                        }

                        return this.balanceInsert(max_size, IS_ROOT);
                    }
                }

                let node = this.nodes[i];

                let {
                    newnode,
                    key
                } = node.insert(identifier, model, max_size, false, result);

                if (key == undefined) debugger

                if (newnode != node) {
                    this.keys.push(key);
                    this.nodes.push(newnode);
                }

                return this.balanceInsert(max_size, IS_ROOT);

            } else {

                for (let i = 0, l = this.keys.length; i < l; i++) {
                    let key = this.keys[i];

                    if (identifier == key) {
                        this.nodes[i].add(key);

                        result.added = false;

                        return {
                            newnode: this,
                            key: identifier
                        };
                    } else if (identifier < key) {

                        this.keys.splice(i, 0, identifier);
                        this.nodes.splice(i, 0, model);

                        result.added = true;

                        return this.balanceInsert(max_size, IS_ROOT);
                    }
                }

                this.keys.push(identifier);
                this.nodes.push(model);

                result.added = true;

                return this.balanceInsert(max_size, IS_ROOT);
            }

            return {
                newnode: this,
                key: identifier,
            };
        }

        balanceRemove(index, min_size) {
            let left = this.nodes[index - 1];
            let right = this.nodes[index + 1];
            let node = this.nodes[index];

            //Left rotate
            if (left && left.keys.length > min_size) {

                let lk = left.keys.length;
                let ln = left.nodes.length;

                node.keys.unshift((node.LEAF) ? left.keys[lk - 1] : this.keys[index - 1]);
                node.nodes.unshift(left.nodes[ln - 1]);

                this.keys[index - 1] = left.keys[lk - 1];

                left.keys.length = lk - 1;
                left.nodes.length = ln - 1;

                return false;
            } else
            //Right rotate
            if (right && right.keys.length > min_size) {

                node.keys.push((node.LEAF) ? right.keys[0] : this.keys[index]);
                node.nodes.push(right.nodes[0]);

                right.keys.splice(0, 1);
                right.nodes.splice(0, 1);

                this.keys[index] = (node.LEAF) ? right.keys[1] : right.keys[0];

                return false;

            } else {

                //Left or Right Merge
                if (!left) {
                    index++;
                    left = node;
                    node = right;
                }

                let key = this.keys[index - 1];
                this.keys.splice(index - 1, 1);
                this.nodes.splice(index, 1);

                left.nodes = left.nodes.concat(node.nodes);
                if (!left.LEAF) left.keys.push(key);
                left.keys = left.keys.concat(node.keys);


                if (left.LEAF)
                    for (let i = 0; i < left.keys.length; i++)
                        if (left.keys[i] != left.nodes[i].id)
                            debugger;

                return true;
            }

        }

        remove(start, end, IS_ROOT = false, min_size, out_container) {
            let l = this.keys.length,
                out = 0,
                out_node = this;

            if (!this.LEAF) {

                for (var i = 0; i < l; i++) {

                    let key = this.keys[i];

                    if (start <= key)
                        out += this.nodes[i].remove(start, end, false, min_size, out_container).out;
                }
                
                out += this.nodes[i].remove(start, end, false, min_size, out_container).out;

                for (var i = 0; i < this.nodes.length; i++) {
                    if (this.nodes[i].keys.length < min_size) {
                        if (this.balanceRemove(i, min_size)) {
                            l--;
                            i--;
                        }                }            }

                if (this.nodes.length == 1)
                    out_node = this.nodes[0];

            } else {

                for (let i = 0, l = this.keys.length; i < l; i++) {
                    let key = this.keys[i];

                    if (key <= end && key >= start) {
                        out_container.push(this.nodes[i]);
                        out++;
                        this.keys.splice(i, 1);
                        this.nodes.splice(i, 1);
                        l--;
                        i--;
                    }
                }
            }

            return {
                out_node,
                out
            };
        }

        get(start, end, out_container) {

            if (!start || !end)
                return false;

            if (!this.LEAF) {

                for (var i = 0, l = this.keys.length; i < l; i++) {

                    let key = this.keys[i];

                    if (start <= key)
                        this.nodes[i].get(start, end, out_container);
                }

                this.nodes[i].get(start, end, out_container, );

            } else {

                for (let i = 0, l = this.keys.length; i < l; i++) {
                    let key = this.keys[i];

                    if (key <= end && key >= start)
                        out_container.push(this.nodes[i]);
                }
            }
        }
    }

    let NUMBER = new(class NumberSchema extends SchemaType {
        
        constructor(){
            super();
            this.start_value = 0;
        }

        parse(value) {
            return parseFloat(value);
        }

        verify(value, result) {
            result.valid = true;

            if(value == NaN || value == undefined){
                result.valid = false;
                result.reason = "Invalid number type.";
            }
        }

        filter(identifier, filters) {
            for (let i = 0, l = filters.length; i < l; i++) {
                if (identifier == filters[i])
                    return true;
            }
            return false;
        }

    })();

    const months = [{
        name: "January",
        days: 31,
        day_offset: 0,
        day_offse_leapt: 0
    }, {
        name: "February",
        days: 28,
        day_offset: 31,
        day_offset_leap: 31
    }, {
        name: "March",
        days: 31,
        day_offset: 59,
        day_offset_leap: 60
    }, {
        name: "April",
        days: 30,
        day_offset: 90,
        day_offset_leap: 91
    }, {
        name: "May",
        days: 31,
        day_offset: 120,
        day_offset_leap: 121
    }, {
        name: "June",
        days: 30,
        day_offset: 151,
        day_offset_leap: 152
    }, {
        name: "July",
        days: 31,
        day_offset: 181,
        day_offset_leap: 182
    }, {
        name: "August",
        days: 31,
        day_offset: 212,
        day_offset_leap: 213
    }, {
        name: "September",
        days: 30,
        day_offset: 243,
        day_offset_leap: 244
    }, {
        name: "October",
        days: 31,
        day_offset: 273,
        day_offset_leap: 274
    }, {
        name: "November",
        days: 30,
        day_offset: 304,
        day_offset_leap: 305
    }, {
        name: "December",
        days: 31,
        day_offset: 33,
        day_offse_leapt: 335
    }];

    var dow = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    function GetDayStartAndEnd(date) {
        var rval = {
            start: 0,
            end: 0
        };

        if (date instanceof Date || typeof(date) == "number" ) {
            var d = new Date(date);

            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            d.setMilliseconds(0);

            rval.start = d.valueOf();
            d.setDate(d.getDate() + 1);
            d.setSeconds(-1);
            rval.end = d.valueOf();
        }

        return rval;
    }

    function float24to12ModTime(time, CAPITAL) {
        var IS_PM = time >= 12 && time < 24;
        var minutes = ((time % 1) * 60) | 0;
        var hours = (((time | 0) % 12) != 0) ? (time | 0) % 12 : 12;

        return (hours + ":" + ("0" + minutes).slice(-2)) + ((IS_PM) ? (CAPITAL) ? "PM" :"pm" : (CAPITAL) ? "AM" : "am");
    }

    class Point2D extends Float64Array{
    	
    	constructor(x, y) {
    		super(2);

    		if (typeof(x) == "number") {
    			this[0] = x;
    			this[1] = y;
    			return;
    		}

    		if (x instanceof Array) {
    			this[0] = x[0];
    			this[1] = x[1];
    		}
    	}

    	draw(ctx, s = 1){
    		ctx.beginPath();
    		ctx.moveTo(this.x*s,this.y*s);
    		ctx.arc(this.x*s, this.y*s, s*0.01, 0, 2*Math.PI);
    		ctx.stroke();
    	}

    	get x (){ return this[0]}
    	set x (v){if(typeof(v) !== "number") return; this[0] = v;}

    	get y (){ return this[1]}
    	set y (v){if(typeof(v) !== "number") return; this[1] = v;}
    }

    function posOnCurve(t, p1, p2, p3) {
        var ti = 1 - t;
        return ti * ti * p1 + 2 * ti * t * p2 + t * t * p3;
    }

    function splitCurve(bp, t) {
        var left = [];
        var right = [];

        function drawCurve(bp, t) {
            if (bp.length == 2) {
                left.push(bp[0], bp[1]);
                right.push(bp[0], bp[1]);
            } else {
                var new_bp = []; //bp.slice(0,-2);
                for (var i = 0; i < bp.length - 2; i += 2) {
                    if (i == 0) {
                        left.push(bp[i], bp[i + 1]);
                    }
                    if (i == bp.length - 4) {
                        right.push(bp[i + 2], bp[i + 3]);
                    }
                    new_bp.push((1 - t) * bp[i] + t * bp[i + 2]);
                    new_bp.push((1 - t) * bp[i + 1] + t * bp[i + 3]);
                }
                drawCurve(new_bp, t);
            }
        }

        drawCurve(bp, t);

        return {
            x: new QBezier(right),
            y: new QBezier(left)
        };
    }

    function curveIntersections(p1, p2, p3) {
        var intersections = {
            a: Infinity,
            b: Infinity
        };

        var a = p1 - 2 * p2 + p3;

        var b = 2 * (p2 - p1);

        var c = p1;

        if (b == 0) ; else if (Math.abs(a) < 0.00000000005) {
            intersections.a = (-c / b); //c / b;
        } else {

            intersections.a = ((-b - Math.sqrt((b * b) - 4 * a * c)) / (2 * a));
            intersections.b = ((-b + Math.sqrt((b * b) - 4 * a * c)) / (2 * a));
        }
        return intersections
    }

    class QBezier {
        constructor(x1, y1, x2, y2, x3, y3) {
            this.x1 = 0;
            this.x2 = 0;
            this.x3 = 0;
            this.y1 = 0;
            this.y2 = 0;
            this.y3 = 0;

            if (typeof(x1) == "number") {
                this.x1 = x1;
                this.x2 = x2;
                this.x3 = x3;
                this.y1 = y1;
                this.y2 = y2;
                this.y3 = y3;
                return;
            }

            if (x1 instanceof QBezier) {
                this.x1 = x1.x1;
                this.x2 = x1.x2;
                this.x3 = x1.x3;
                this.y1 = x1.y1;
                this.y2 = x1.y2;
                this.y3 = x1.y3;
                return;
            }

            if (x1 instanceof Array) {
                this.x1 = x1[0];
                this.y1 = x1[1];
                this.x2 = x1[2];
                this.y2 = x1[3];
                this.x3 = x1[4];
                this.y3 = x1[5];
                return;
            }
        }

        reverse() {
            return new QBezier(
                this.x3,
                this.y3,
                this.x2,
                this.y2,
                this.x1,
                this.y1
            )
        }

        point(t) {
            return new Point2D(
                posOnCurve(t, this.x1, this.x2, this.x3),
                posOnCurve(t, this.y1, this.y2, this.y3))

        }

        tangent(t) {
            var tan = {
                x: 0,
                y: 0
            };

            var px1 = this.x2 - this.x1;
            var py1 = this.y2 - this.y1;

            var px2 = this.x3 - this.x2;
            var py2 = this.y3 - this.y2;

            tan.x = (1 - t) * px1 + t * px2;
            tan.y = (1 - t) * py1 + t * py2;

            return tan;
        }

        toArray() {
            return [this.x1, this.y1, this.x2, this.y2, this.x3, this.y3];
        }

        split(t) {
            return splitCurve(this.toArray(), t);
        }

        rootsX (){
        	return this.roots(
        		this.x1, 
        		this.x2,
        		this.x3
        		)
        	
        }

        roots(p1, p2, p3) {
            var curve = this.toArray();

            var c = p1 - (2*p2) + p3;
            var b = 2*(p2 - p1);
            var a = p1;
            var a2 = a*2;
            console.log(c ," c");
            var sqrt = Math.sqrt(b*b - (a * 4 *c));
            console.log(sqrt, b, a2, p3);
            var t1 = (-b + sqrt) / a2;
            var t2 = (-b - sqrt) / a2;

            return [ t1 , t2 ];
        } 

        rootsa() {
            var curve = this.toArray();

            var p1 = curve[1];
            var p2 = curve[3];
            var p3 = curve[5];
            var x1 = curve[0];
            var x2 = curve[2];
            var x3 = curve[4];

            var py1d = 2 * (p2 - p1);
            var py2d = 2 * (p3 - p2);
            var ad1 = -py1d + py2d;
            var bd1 = py1d;

            var px1d = 2 * (x2 - x1);
            var px2d = 2 * (x3 - x2);
            var ad2 = -px1d + px2d;
            var bd2 = px1d;

            var t1 = -bd1 / ad1;
            var t2 = -bd2 / ad2;

            return [ t1 , t2 ];
        }

        boundingBox() {
            var x1 = curve[0];
            var y1 = curve[1];
            var x2 = curve[2];
            var y2 = curve[3];
            var x3 = curve[4];
            var y3 = curve[5];
            var roots = getRootsClamped(curve);
            var min_x = Math.min(x1, x2, x3, roots.y[0] || Infinity, roots.x[0] || Infinity);
            var min_y = Math.min(y1, y2, y3, roots.y[1] || Infinity, roots.x[1] || Infinity);
            var max_x = Math.max(x1, x2, x3, roots.y[0] || -Infinity, roots.x[0] || -Infinity);
            var max_y = Math.max(y1, y2, y3, roots.y[1] || -Infinity, roots.x[1] || -Infinity);

            return {
                min: {
                    x: min_x,
                    y: min_y
                },
                max: {
                    x: max_x,
                    y: max_y
                }
            };
        }

        rotate(angle, offset) {
            angle = (angle / 180) * Math.PI;

            var new_curve = this.toArray();

            for (var i = 0; i < 6; i += 2) {
                var x = curve[i] - offset.x;
                var y = curve[i + 1] - offset.y;
                new_curve[i] = ((x * Math.cos(angle) - y * Math.sin(angle))) + offset.x;
                new_curve[i + 1] = ((x * Math.sin(angle) + y * Math.cos(angle))) + offset.y;
            }

            return new QBezier(new_curve);
        }

        intersects() {
            return {
                x: curveIntersections(this.x1, this.x2, this.x3),
                y: curveIntersections(this.y1, this.y2, this.y3)
            }
        }

        add(x, y) {
            if (typeof(x) == "number") {
                return new QBezier(
                    this.x1 + x,
                    this.y1 + y,
                    this.x2 + x,
                    this.y2 + y,
                    this.x3 + x,
                    this.y3 + y,
                )
            }
        }
    }

    const sqrt = Math.sqrt;
    const cos = Math.cos;
    const acos = Math.acos;
    const PI = Math.PI;

    // A real-cuberoots-only function:
    function cuberoot(v) {
      if(v<0) return -Math.pow(-v,1/3);
      return Math.pow(v,1/3);
    }



    function point(t, p1, p2, p3, p4) {
    	var ti = 1 - t;
    	var ti2 = ti * ti;
    	var t2 = t * t;

    	return ti * ti2 * p1 + 3 * ti2 * t * p2 + t2 * 3 * ti * p3 + t2 * t * p4;
    }


    class CBezier extends Float64Array{
    	constructor(x1, y1, x2, y2, x3, y3, x4, y4) {
    		super(8);

    		//Map P1 and P2 to {0,0,1,1} if only four arguments are provided; for use with animations
    		if(arguments.length == 4){
    			this[0] = 0;
    			this[1] = 0;
    			this[2] = x1;
    			this[3] = y1;
    			this[4] = x2;
    			this[5] = y2;
    			this[6] = 1;
    			this[7] = 1;
    			return;
    		}
    		
    		if (typeof(x1) == "number") {
    			this[0] = x1;
    			this[1] = y1;
    			this[2] = x2;
    			this[3] = y2;
    			this[4] = x3;
    			this[5] = y3;
    			this[6] = x4;
    			this[7] = y4;
    			return;
    		}

    		if (x1 instanceof Array) {
    			this[0] = x1[0];
    			this[1] = x1[1];
    			this[2] = x1[2];
    			this[3] = x1[3];
    			this[4] = x1[4];
    			this[5] = x1[5];
    			this[6] = x1[6];
    			this[7] = x1[4];
    			return;
    		}
    	}

    	get x1 (){ return this[0]}
    	set x1 (v){this[0] = v;}
    	get x2 (){ return this[2]}
    	set x2 (v){this[2] = v;}
    	get x3 (){ return this[4]}
    	set x3 (v){this[4] = v;}
    	get x4 (){ return this[6]}
    	set x4 (v){this[6] = v;}
    	get y1 (){ return this[1]}
    	set y1 (v){this[1] = v;}
    	get y2 (){ return this[3]}
    	set y2 (v){this[3] = v;}
    	get y3 (){ return this[5]}
    	set y3 (v){this[5] = v;}
    	get y4 (){ return this[7]}
    	set y4 (v){this[7] = v;}

    	add(x,y = 0){
    		return new CCurve(
    			this[0] + x,
    			this[1] + y,
    			this[2] + x,
    			this[3] + y,
    			this[4] + x,
    			this[5] + y,
    			this[6] + x,
    			this[7] + y
    		)
    	}

    	valY(t){
    		return point(t, this[1], this[3], this[5], this[7]);
    	}

    	valX(t){
    		return point(t, this[0], this[2], this[4], this[6]);
    	}

    	point(t) {
    		return new Point2D(
    			point(t, this[0], this[2], this[4], this[6]),
    			point(t, this[1], this[3], this[5], this[7])
    		)
    	}
    	
    	/** 
    		Aquired from : https://pomax.github.io/bezierinfo/
    		Author:  Mike "Pomax" Kamermans
    		GitHub: https://github.com/Pomax/
    	*/

    	roots(p1,p2,p3,p4) {
    		var d = (-p1 + 3 * p2 - 3 * p3 + p4),
    			a = (3 * p1 - 6 * p2 + 3 * p3) / d,
    			b = (-3 * p1 + 3 * p2) / d,
    			c = p1 / d;

    		var p = (3 * b - a * a) / 3,
    			p3 = p / 3,
    			q = (2 * a * a * a - 9 * a * b + 27 * c) / 27,
    			q2 = q / 2,
    			discriminant = q2 * q2 + p3 * p3 * p3;

    		// and some variables we're going to use later on:
    		var u1, v1, root1, root2, root3;

    		// three possible real roots:
    		if (discriminant < 0) {
    			var mp3 = -p / 3,
    				mp33 = mp3 * mp3 * mp3,
    				r = sqrt(mp33),
    				t = -q / (2 * r),
    				cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
    				phi = acos(cosphi),
    				crtr = cuberoot(r),
    				t1 = 2 * crtr;
    			root1 = t1 * cos(phi / 3) - a / 3;
    			root2 = t1 * cos((phi + 2 * PI) / 3) - a / 3;
    			root3 = t1 * cos((phi + 4 * PI) / 3) - a / 3;
    			return [root3, root1, root2]
    		}

    		// three real roots, but two of them are equal:
    		if (discriminant === 0) {
    			u1 = q2 < 0 ? cuberoot(-q2) : -cuberoot(q2);
    			root1 = 2 * u1 - a / 3;
    			root2 = -u1 - a / 3;
    			return [root2, root1]
    		}

    		// one real root, two complex roots
    		var sd = sqrt(discriminant);
    		u1 = cuberoot(sd - q2);
    		v1 = cuberoot(sd + q2);
    		root1 = u1 - v1 - a / 3;
    		return [root1]
    	}

    	rootsY() {
    		return this.roots(this[1],this[3],this[5],this[7])
    	}

    	rootsX() {
    		return this.roots(this[0],this[2],this[4],this[6])
    	}
    	
    	getYatX(x){
    		var x1 = this[0] - x, x2 = this[2] - x, x3 = this[4] - x, x4 = this[6] - x,
    			x2_3 = x2 * 3, x1_3 = x1 *3, x3_3 = x3 * 3,
    			d = (-x1 + x2_3 - x3_3 + x4), di = 1/d, i3 = 1/3,
    			a = (x1_3 - 6 * x2 + x3_3) * di,
    			b = (-x1_3 + x2_3) * di,
    			c = x1 * di,
    			p = (3 * b - a * a) * i3,
    			p3 = p * i3,
    			q = (2 * a * a * a - 9 * a * b + 27 * c) * (1/27),
    			q2 = q * 0.5,
    			discriminant = q2 * q2 + p3 * p3 * p3;

    		// and some variables we're going to use later on:
    		var u1, v1, root;

    		//Three real roots can never happen if p1(0,0) and p4(1,1);

    		// three real roots, but two of them are equal:
    		if (discriminant < 0) {
    			var mp3 = -p / 3,
    				mp33 = mp3 * mp3 * mp3,
    				r = sqrt(mp33),
    				t = -q / (2 * r),
    				cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
    				phi = acos(cosphi),
    				crtr = cuberoot(r),
    				t1 = 2 * crtr;
    			root = t1 * cos((phi + 4 * PI) / 3) - a / 3;
    		}else if (discriminant === 0) {
    			u1 = q2 < 0 ? cuberoot(-q2) : -cuberoot(q2);
    			root = -u1 - a * i3;
    		}else{
    			var sd = sqrt(discriminant);
    			// one real root, two complex roots
    			u1 = cuberoot(sd - q2);
    			v1 = cuberoot(sd + q2);
    			root = u1 - v1 - a * i3;	
    		}

    		return point(root, this[1], this[3], this[5], this[7]);
    	}
    	/**
    		Given a Canvas 2D context object and scale value, strokes a cubic bezier curve.
    	*/
    	draw(ctx, s = 1){
    		ctx.beginPath();
    		ctx.moveTo(this[0]*s, this[1]*s);
    		ctx.bezierCurveTo(
    			this[2]*s, this[3]*s,
    			this[4]*s, this[5]*s,
    			this[6]*s, this[7]*s
    			);
    		ctx.stroke();
    	}
    }

    /**
    	JavaScript implementation of a touch scrolling interface using touch events
    */
    class TouchScroller {
        /** 
            Constructs a touch object around a given dom element. Functions listeners can be bound to this object using
            this addEventListener method.
        */
        constructor(element, drag = 0.02, touchid = 0) {
            
            this.origin_x = 0;
            this.origin_y = 0;
            this.velocity_x = 0;
            this.velocity_y = 0;
            this.GO = true;
            this.drag = (drag > 0) ? drag : 0.02;
            this.element = element;

            if (!touchid instanceof Number)
                touchid = 0;

            let time_old = 0;

            let frame = (dx, dy, steps, ratio = 1) => {

                let drag_val = this.drag;

                dx -= dx * drag_val * steps * ratio;
                dy -= dy * drag_val * steps * ratio;

                let dm = Math.max(Math.abs(dy), Math.abs(dy));

                let end = !(steps > 0 && dm > 0.1 && this.GO);

                if (!end) {
                    requestAnimationFrame(() => {
                        frame(dx, dy, 1);
                    });
                }

                end = end && steps != 0;

                for (var i = 0, l = this.listeners.length; i < l; i++) {

                    if (this.listeners[i]({
                            dx,
                            dy,
                            end
                        })) {
                        this.GO = false;
                    } 
                }
            };

            this.event_b = (e) => {

                time_old = performance.now();

                var touch = e.touches[touchid];

                this.velocity_x = this.origin_x - touch.clientX;
                this.velocity_y = this.origin_y - touch.clientY;

                this.origin_x = touch.clientX;
                this.origin_y = touch.clientY;

                frame(this.velocity_x, this.velocity_y, 0, 0);
            };

            this.event_c = (e) => {

                let time_new = performance.now();

                let diff = time_new - time_old;

                let steps = Math.min(diff / 8.6666666, 1 / this.drag); // 60 FPS

                this.GO = true;

                frame(this.velocity_x, this.velocity_y, steps);

                this.velocity_x = 0;
                this.velocity_y = 0;

                window.removeEventListener("touchmove", this.event_b);
                window.removeEventListener("touchend", this.event_c);
            };

            this.event_a = (e) => {

                if(!this.GO){
                    e.preventDefualt();
                    e.stopPropagation();
                    return false;
                }

                time_old = performance.now();

                this.GO = false;

                var touch = e.touches[touchid];

                if (!touch)
                    return;

                this.origin_y = touch.clientY;
                this.origin_x = touch.clientX;

                window.addEventListener("touchmove", this.event_b);
                window.addEventListener("touchend", this.event_c);
            };

            this.element.addEventListener("touchstart", this.event_a);

            this.listeners = [];

        }

        destructor() {
            this.listeners = null;
            this.element.removeEventListener("touchstart", this.event_a);
        }



        addEventListener(callback) {
            if (callback instanceof Function) {

                for (var i = 0; i < this.listeners.length; i++) {
                    if (this.listeners[i] == callback) return
                }

                this.listeners.push(callback);
            }
        }

        removeEventListener(callback) {
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i] == callback) {
                    this.listeners.splice(i, 1);
                    return;
                }
            }
        }
    }

    /*********** String Parsing Basic Function ************************/
    /**
    	If a string object is passed, creates a lexer that tokenize the input string. 
    */
    function Lex(string){
    	if(typeof(string) !== "string"){
    		console.warn("Cannot create a lexer on a non-string object!");
    		return null;
    	}

    	return new Lexer(new Tokenizer(string));
    }

    /****** Global Object Extenders *************/
    //*
    Element.prototype.getWindowTop = function(){
        return (this.offsetTop + ((this.parentElement) ? this.parentElement.getWindowTop() : 0));
    };

    Element.prototype.getWindowLeft = function(){
        return (this.offsetLeft + ((this.parentElement) ? this.parentElement.getWindowLeft() : 0));
    };

    Element.prototype.getParentWindowTop = function(bool = false){
        return (((bool ? this.offsetTop : 0))+((this.parentElement) ? this.parentElement.getParentWindowTop(true) : 0));
    };

    Element.prototype.getParentWindowLeft = function(bool = false){
        return (((bool ? this.offsetLeft : 0))+((this.parentElement) ? this.parentElement.getWindowLeft(true) : 0));
    };

    Element.prototype.getStyle = function(style_name){
    	return window.getComputedStyle(this,null).getPropertyValue(style_name);
    };
    //*/

    var common = /*#__PURE__*/Object.freeze({
        Lex: Lex,
        Lexer: Lexer,
        Tokenizer: Tokenizer,
        months: months,
        dow: dow,
        QBezier: QBezier,
        CBezier: CBezier,
        TurnQueryIntoData: TurnQueryIntoData,
        TurnDataIntoQuery: TurnDataIntoQuery,
        GetDayStartAndEnd: GetDayStartAndEnd,
        TouchScroller: TouchScroller,
        float24to12ModTime: float24to12ModTime
    });

    let scape_date = new Date();
    scape_date.setHours(0);
    scape_date.setMilliseconds(0);
    scape_date.setSeconds(0);
    scape_date.setTime(0);

    let DATE = new(class DateSchema extends NUMBER.constructor {
        parse(value) {

            if (!isNaN(value))
                return parseInt(value);

            let lex = Lex(value);

            let year = parseInt(lex.token.text);

            if (year) {

                scape_date.setHours(0);
                scape_date.setMilliseconds(0);
                scape_date.setSeconds(0);
                scape_date.setTime(0);

                lex.next();
                lex.next();
                let month = parseInt(lex.token.text) - 1;
                lex.next();
                lex.next();
                let day = parseInt(lex.token.text);
                scape_date.setFullYear(year);
                scape_date.setDate(day);
                scape_date.setMonth(month);

                lex.next();
                if (lex.token) {
                    let hours = parseInt(lex.token.text);
                    lex.next();
                    lex.next();
                    let minutes = parseInt(lex.token.text);

                    scape_date.setHours(hours);
                    scape_date.setMinutes(minutes);
                }

                return scape_date.valueOf();
            } else {
                return (new Date(value)).valueOf();
            }
        }

        /**
         
         */
        verify(value, result) {
            this.parse(value);
            super.verify(value, result);
        }

        filter(identifier, filters) {

            if (filters.length > 1) {

                for (let i = 0, l = filters.length - 1; i < l; i += 2) {
                    let start = filters[i];
                    let end = filters[i + 1];

                    if (start <= identifier && identifier <= end) {
                        return true;
                    }
                }
            }

            return false;
        }

        string(value) {
            return (new Date(value)) + "";
        }
    });

    let TIME = new(class TimeSchema extends NUMBER.constructor {

        parse(value) {
            if (!isNaN(value))
                return parseInt(value);
            try {
                var hour = parseInt(value.split(":")[0]);
                var min = parseInt(value.split(":")[1].split(" ")[0]);
                var half = (value.split(":")[1].split(" ")[1].toLowerCase() == "pm");
            } catch (e) {
                var hour = 0;
                var min = 0;
                var half = 0;
            }

            return parseFloat((hour + ((half) ? 12 : 0) + (min / 60)));
        }

        verify(value, result) {
            this.parse(value);
            super.verify(value, result);
        }

        filter(identifier, filters) {
            return true
        }

        string(value) {
            return (new Date(value)) + "";
        }
    })();

    let STRING = new(class StringSchema extends SchemaType {
        constructor(){
            super();
            this.start_value = "";
        }
        parse(value) {
            return value + "";
        }

        verify(value, result) {
            result.valid = true;
        }

        filter(identifier, filters) {
            for (let i = 0, l = filters.length; i < l; i++) {
                if (identifier.match(filters[i]+""))
                    return true;
            }
            return false;
        }

    })();

    let BOOL = new(class BoolSchema extends SchemaType {
        constructor(){
            super();
            this.start_value = false;
        }

        parse(value) {
            return (value) ? true : false; 
        }

        verify(value, result) {
            result.valid = true;
            if(!value instanceof Boolean){
                result.valid = false;
                result.reason = " Value is not a Boolean.";
            }
        }

        filter(identifier, filters) {
            if(value instanceof BOOL)
                return true;
            return false;
        }

    })();

    let schema = {
    	DATE,
    	STRING,
    	NUMBER,
    	BOOL,
    	TIME
    };

    /**
        This is used by NModel to create custom property getter and setters 
        on non-ModelContainer and non-Model properties of the NModel constructor.
    */

    function CreateSchemedProperty(constructor, scheme, schema_name) {

        if (constructor.prototype[schema_name])
            return;

        let __shadow_name__ = `__${schema_name}__`;


        Object.defineProperty(constructor.prototype, __shadow_name__, {
            writable: true,
            configurable: false,
            enumerable: false,
            value: scheme.start_value || undefined
        });

        Object.defineProperty(constructor.prototype, schema_name, {
            configurable: false,
            enumerable: true,
            get: function() {
                return this[__shadow_name__];
            },

            set: function(value) {

                let result = {
                    valid: false
                };

                let val = scheme.parse(value);

                scheme.verify(val, result);

                if (result.valid && this[__shadow_name__] != val)
                    (this[__shadow_name__] = val, this.scheduleUpdate(schema_name));
            }
        });
    }

    /**
        This is used by NModel to create custom property getter and setters 
        on Schemed ModelContainer properties of the NModel constructor.
    */

    function CreateMCSchemedProperty(constructor, scheme, schema_name) {

        let schema$$1 = scheme.schema;

        let mc_constructor = scheme.container;

        let __shadow_name__ = `__${schema_name}__`;

        Object.defineProperty(constructor.prototype, __shadow_name__, {
            enumerable: false,
            writable: true,
            value: null
        });

        Object.defineProperty(constructor.prototype, schema_name, {
            configurable: false,
            enumerable: true,
            get: function() {

                if (!this[__shadow_name__])
                    this[__shadow_name__] = new mc_constructor(scheme.schema);

                return this[__shadow_name__];
            },

            set: function(value) {

                let MC = this[__shadow_name__];
                let data = null;

                if (typeof(value) == "string")
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        console.log(e);
                        return;
                    }

                if (value instanceof Array) {
                    data = value;
                    MC = new mc_constructor(scheme.schema);
                    this[__shadow_name__] = MC;
                    MC.insert(data);
                    this.scheduleUpdate(schema_name);
                } else if (value instanceof mc_constructor) {
                    this[__shadow_name__] = value;
                    console.log(schema_name);
                    this.scheduleUpdate(schema_name);
                }
            }
        });
    }

    /**
        This is used by NModel to create custom property getter and setters 
        on Model properties of the NModel constructor.
    */

    function CreateModelProperty(constructor, scheme, schema_name) {

        let schema$$1 = scheme.schema;

        Object.defineProperty(constructor.prototype, schema_name, {
            configurable: false,
            enumerable: true,

            get: function() {
                Object.defineProperty(this, schema_name, {
                    configurable: false,
                    enumerable: true,
                    writable: false,
                    value: new scheme()
                });
                return this[schema_name];
            },

            set: function(value) {}
        });
    }

    class Model extends ModelBase {
        /**
         
         */
        constructor(data) {

            super();
            //The schema is stored directly on the constructor. If it is not there, then consider this model type to "ANY"
            let schema$$1 = this.constructor.schema;

            if (schema$$1) {
                let __FinalConstructor__ = schema$$1.__FinalConstructor__;

                let constructor = this.constructor;

                Object.defineProperty(constructor.prototype, "schema", {
                    writable: false,
                    enumerable: false,
                    configurable: false,
                    value: schema$$1
                });

                if (!__FinalConstructor__) {
                    for (let schema_name in schema$$1) {
                        let scheme = schema$$1[schema_name];

                        if (scheme instanceof Array) {
                            if (scheme[0] && scheme[0].container && scheme[0].schema) {
                                CreateMCSchemedProperty(constructor, scheme[0], schema_name);
                            } else if (scheme[0] instanceof ModelContainer) {
                                CreateModelProperty(constructor, scheme[0].constructor, schema_name);
                            }
                        } else if (scheme instanceof Model)
                            CreateModelProperty(constructor, scheme[0].constructor, schema_name);
                        else if (scheme instanceof SchemaType)
                            CreateSchemedProperty(constructor, scheme, schema_name);
                        else
                            console.warn(`Could not create property ${schema_name}.`);

                    }

                    Object.seal(constructor);


                    Object.defineProperty(schema$$1, "__FinalConstructor__", {
                            writable: false,
                            enumerable: false,
                            configurable: false,
                            value: constructor
                        });
                        //schema.__FinalConstructor__ = constructor;


                    //Start the process over with a newly minted Model that has the properties defined in the Schema
                    return new constructor(data);
                }
            } else {
                /* This will be an ANY Model */
                return new AnyModel(data);
            }

            if (data)
                this.add(data);
        }

        /**
            Removes all held references and calls unsetModel on all listening views.
        */
        destructor() {

            this.schema = null;

            for (let a in this) {
                let prop = this[a];
                if (typeof(prop) == "object" && prop.destructor instanceof Function)
                    prop.destructor();
                else
                    this[a] = null;
            }

            super.destructor();
            //debugger
        }

        /**
            Given a key, returns an object that represents the status of the value contained, if it is valid or not, according to the schema for that property. 
        */
        verify(key) {

            let out_data = {
                valid: true,
                reason: ""
            };

            var scheme = this.schema[key];

            if (scheme) {
                if (scheme instanceof Array) ; else if (scheme instanceof Model) ; else {
                    scheme.verify(this[key], out_data);
                }
            }

            return out_data
        }

        /**
            Returns a parsed value based on the key 
        */
        string(key) {

            if (key) {
                var scheme = this.schema[key];

                if (scheme) {
                    if (scheme instanceof Array) {
                        this[key].string();
                    } else if (scheme instanceof Model) {
                        this[key].string();
                    } else {
                        return scheme.string(this[key]);
                    }
                }
            }
        }

        /**
            @param data : An object containing key value pairs to insert into the model. 
        */
        add(data) {
            for (let a in data)
                if (a in this) this[a] = data[a];
        }


        get(data) {
            var out_data = {};

            if (!data)
                return this;
            else
                for (var a in data)
                    if (a in this) out_data[a] = this[a];

            return out_data;
        }

        toJSON() {
            let out = {};

            let schema$$1 = this.schema;

            for (let prop in schema$$1) {

                let scheme = schema$$1[prop];

                out[prop] = this[prop];
            }

            return out;
        }
    }

    function AnyModelProxySet(obj, prop, val) {
        if (prop in obj && obj[prop] == val)
            return true

        obj[prop] = val;

        obj.scheduleUpdate(prop);

        return true;
    }

    class AnyModel extends ModelBase {

        constructor(data) {

            super();

            if (data) {
                for (let prop_name in data) {

                    this[prop_name] = data[prop_name];
                }
            }

            return new Proxy(this, {
                set: AnyModelProxySet
            })
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
            super.destructor();
        }

        add(data) {
            for (var a in data)
                this[a] = data[a];
        }

        get(data) {
            var out_data = {};

            if (!data) {
                return this;
            } else {
                for (var a in data) {
                    let prop = this[a];
                    if (prop) {
                        out_data[a] = prop;
                    }
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

        toJSON() {
            let out = {};


            for (let prop in this) {

                if (prop == "first_view" ||
                    prop == "changed_values" ||
                    prop == "____SCHEDULED____")
                    continue;

                out[prop] = this[prop];
            }

            return out;
        }

        toJsonString() {
            return this.data + "";
        }
    }

    class Controller{
    	
    	constructor(){
    		this.model = null;
    	}

    	destructor(){
    		this.model = null;
    	}

    	setModel(model){
    		if(model instanceof Model){
    			this.model = model;
    		}
    	}

    	set(data){
    		if(this.model)
    			this.model.add(data);
    		
    	}
    }

    /**
     * This Class is responsible for handling requests to the server. It can act as a controller to specifically pull data down from the server and push into data members.
     *
     * {name} Getter
     */
    class Getter extends Controller {
        constructor(url, process_data) {
            super();
            this.url = url;
            this.FETCH_IN_PROGRESS = false;
            this.rurl = process_data;
        }

        destructor() {
            super.destructor();
        }

        get(request_object, store_object, secure = true) {
            //if(this.FETCH_IN_PROGRESS)
            //    return null;
            this.FETCH_IN_PROGRESS = true;

            var url = ((secure) ? "https://" : "http://") + window.location.host + this.url + ( (request_object) ? ("?" + this.__process_url__(request_object)) : "");

            return ((store) => fetch(url,
            {
                credentials: "same-origin", // Sends cookies back to server with request
                method: 'GET'
            }).then((response)=>{
                this.FETCH_IN_PROGRESS = false;
                (response.json().then((j)=>{
                    this.__process_response__(j, store);
                }));
            }).catch((error)=>{
                this.FETCH_IN_PROGRESS = false;
                this.__rejected_reponse__(store);
                console.warn(`Unable to process response for request made to: ${this.url}. Response: ${error}. Error Received: ${error}`);
            })) (store_object)
        }

        parseJson(in_json){
            return in_json;
        }

        __process_url__(data) {
            var str = "";
            for (var a in data) {
                str += `${a}=${data[a]}\&`;
            }

            return str.slice(0, -1);
        }

        __rejected_reponse__(store){
            if(store)
                console.error("Unprocessed stored data in getter.");
        }   

        __process_response__(json, store) {

            if(this.rurl && json){
                var watch_points = this.rurl.split("<");
                
                for(var i = 0; i < watch_points.length && json; i++){
                    json = json[parseInt(watch_points[i])?parseInt(watch_points[i]):watch_points[i]];
                } 

                console.log("json", json);
            }

            //result(request);
                if (this.model){
                //should be able to pipe responses as objects created from well formulated data directly into the model.
                    this.set(this.parseJson(json, store));
                }
                else
                    console.warn(`Unable to process response for request made to: ${this.url}. There is no model attached to this request controller!`);

        }
    }

    /**
     * This Class is responsible for handling requests to the server. It can act as a controller to specifically pull data down from the server and push into data members.
     *
     * {name} Requester
     */
    class Setter extends View {
        constructor(url) {
            super();
            this.url = url;
        }

        destructor() {
            super.destructor();
        }

        set(request_object) {

            var url = "http://" + window.location.host + this.url + ( (request_object) ? ("?" + this.__process_url__(request_object)) : "");

            fetch(url, 
            { 
                credentials: "same-origin", // Sends cookies back to server with request
                method: 'POST'
            }).then((response)=>{
                (response.json().then((j)=>{
                    this.__process_response__(j);
                }));
            }).catch((error)=>{
                console.warn(`Unable to process response for request made to: ${this.url}. Response: ${error}. Error Received: ${error}`);
            });
        }

        parseJson(in_json){
            return in_json;
        }

        __process_url__(data) {
            var str = "";
            for (var a in data) {
                str += `${a}=${data[a]}\&`;
            }

            return str.slice(0, -1);
        }

        __process_response__(json) {

            //result(request);
                if (this.model){

                //should be able to pipe responses as objects created from well formulated data directly into the model.
                    this.set(this.parseJson(json));
                    console.log(this.model);
                }
                else
                    console.warn(`Unable to process response for request made to: ${this.url}. There is no model attached to this request controller!`);
            
        }
    }

    /*
    	Handles the parsing and loading of components for a particular page.
    */
    class PageView {

        constructor(URL, app_page) {
            this.url = URL;
            this.elements = [];
            this.finalizing_view = null;
            this.type = "normal";
            if (!app_page) debugger
            this.element = app_page;
            this.element_backer = null;
            this.LOADED = false;
        }

        destructor() {
            for (var i = 0; i < this.elements.length; i++) {
                let element = this.elements[i];
                element.destructor();
            }

            this.elements = null;
            this.element = null;
        }

        unload(transitions) {

            this.LOADED = false;
            
            for (var i = 0; i < this.elements.length; i++) {
                let element = this.elements[i];
                element.getTransformTo(transitions);
                element.unloadComponents();
            }
        }

        transitionOut(transitions) {

            let time = 0;

            for (var i = 0; i < this.elements.length; i++) {
                time = Math.max(time, this.elements[i].transitionOut(transitions));
            }

            return time;
        }

        finalize() {
            if(this.LOADED) return;

            for (var i = 0; i < this.elements.length; i++) {
                let element = this.elements[i];
                element.finalize();
            }

            if (this.element.parentElement)
                this.element.parentElement.removeChild(this.element);
        }

        load(app_element, wurl) {

            this.LOADED = true;
            
            for (var i = 0; i < this.elements.length; i++) {
                let element = this.elements[i];
                element.loadComponents(wurl);
            }

            app_element.appendChild(this.element);

            var t = this.element.style.opacity;
        }

        transitionIn(transitions) {

            if (this.type == "modal") {
                if (!this.element_backer) {
                    this.element_backer = document.createElement("div");
                    this.element_backer.classList.add("modal_backer");
                    this.element.appendChild(this.element_backer);
                }
                setTimeout(() => {
                    this.element.style.opacity = 1;
                }, 50);
            }

            for (var i = 0; i < this.elements.length; i++) {
                let element = this.elements[i];
                element.parent = this;
                element.setTransformTo(transitions);
                element.transitionIn();
            }        
        }

        getNamedElements(named_elements) {
            for (var i = 0; i < this.elements.length; i++) {
                let element = this.elements[i];
                element.getNamedElements(named_elements);
            }
        }

        compareComponents() {
            //This will transition objects
        }

        setType(type) {
            this.type = type || "normal";
        }
    }

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
        for (let i = 0, l = links.length; i < l; i++) {
            let temp = links[i];

            if (temp.dataset.ignore_link) continue;

            if (temp.origin !== location.origin) continue;

            if (!temp.onclick) temp.onclick = ((href, a, __function__) => (e) => {
                e.preventDefault();
                if (__function__(href, a)) e.preventDefault();
            })(temp.href, temp, __function__);
        }
    }

    class Color extends Float64Array{

    	constructor(r,g,b,a = 0){
    		super(4);

    		this.r = 0;
    		this.g = 0;
    		this.b = 0;
    		this.a = 1;

    		if(typeof(r) == "string"){
    			this.fromString(r);
    		}else{
    			this.r = r; //Math.max(Math.min(Math.round(r),255),-255);
    			this.g = g; //Math.max(Math.min(Math.round(g),255),-255);
    			this.b = b; //Math.max(Math.min(Math.round(b),255),-255);
    			this.a = a; //Math.max(Math.min(a,1),-1);
    		}
    	}

    	get r(){
    		return this[0];
    	}

    	set r(r){
    		this[0] = r;
    	}

    	get g(){
    		return this[1];
    	}

    	set g(g){
    		this[1] = g;
    	}

    	get b(){
    		return this[2];
    	}

    	set b(b){
    		this[2] = b;
    	}

    	get a(){
    		return this[3];
    	}

    	set a(a){
    		this[3] = a;
    	}

    	set(color){
    		this.r = color.r;
    		this.g = color.g;
    		this.b = color.b;
    		this.a = (color.a != undefined) ? color.a : this.a;
    	}

    	add(color){
    		return new Color(
    			color.r + this.r,
    			color.g + this.g,
    			color.b + this.b,
    			color.a + this.a
    		)
    	}

    	mult(color){
    		if(typeof(color) == "number"){
    			return new Color(
    				this.r * color,
    				this.g * color,
    				this.b * color,
    				this.a * color
    			)
    		}else{
    			return new Color(
    				this.r * color.r,
    				this.g * color.g,
    				this.b * color.b,
    				this.a * color.a
    			)
    		}
    	}

    	sub(color){
    		return new Color(
    			 this.r - color.r,
    			 this.g - color.g,
    			 this.b - color.b,
    			 this.a - color.a
    		)
    	}

    	toString(){
    		return `rgba(${this.r|0}, ${this.g|0}, ${this.b|0}, ${this.a})`;
    	}

    	fromString(string){
    		
    		let lexer = Lex(string);

    		let r,g,b,a;
    		switch(lexer.token.text){


    			case "rgb":
    				lexer.next(); // (
    				r = parseInt(lexer.next().text);
    				lexer.next(); // ,
    				g = parseInt(lexer.next().text);
    				lexer.next(); // ,
    				b = parseInt(lexer.next().text);
    				this.set({r,g,b});
    			break;

    			case "rgba":
    				lexer.next(); // (
    				r = parseInt(lexer.next().text);
    				lexer.next(); // ,
    				g = parseInt(lexer.next().text);
    				lexer.next(); // ,
    				b = parseInt(lexer.next().text);
    				lexer.next(); // ,
    				a = parseFloat(lexer.next().text);
    				this.set({r,g,b,a});
    			break;

    			case "#":
    				var value = lexer.next().text;
    			break;

    			default:

    				if(Color.colors[string])
    					this.set(Color.colors[string]  || new Color(255, 255, 255, 0.0001));
    			break;
    		}
    	}
    }

    Color.colors = {
    	"transparent" : new Color(255, 255, 255, 0.0001),
    	"clear" : new Color(255, 255, 255, 0.0001),
    	"red" : new Color(255, 0, 0),
    	"green" : new Color(0, 255, 0),
    	"blue" : new Color(0, 0, 255),
    	"Black": new Color(0,0,0),
     	"White": new Color(255,255,255),
     	"white": new Color(255,255,255),
     	"Red": new Color(255,0,0),
     	"Lime": new Color(0,255,0),
     	"Blue": new Color(0,0,255),
     	"Yellow": new Color(255,255,0),
     	"Cyan": new Color(0,255,255),
     	"Aqua": new Color(0,255,255),
     	"Magenta": new Color(255,0,255) ,
     	"Fuchsia": new Color(255,0,255),
     	"Silver": new Color(192,192,192),
     	"Gray": new Color(128,128,128),
     	"Maroon": new Color(128,0,0),
     	"Olive": new Color(128,128,0),
     	"Green": new Color(0,128,0),
     	"Purple": new Color(128,0,128),
     	"Teal": new Color(0,128,128),
     	"Navy": new Color(0,0,128),
     	"maroon": new Color(128,0,0),
     	"dark red": new Color(139,0,0),
     	"brown": new Color(165,42,42),
     	"firebrick": new Color(178,34,34),
     	"crimson": new Color(220,20,60),
     	"red": new Color(255,0,0),
     	"tomato": new Color(255,99,71),
     	"coral": new Color(255,127,80),
     	"indian red": new Color(205,92,92),
     	"light coral": new Color(240,128,128),
     	"dark salmon": new Color(233,150,122),
     	"salmon": new Color(250,128,114),
     	"light salmon": new Color(255,160,122),
     	"orange red": new Color(255,69,0),
     	"dark orange": new Color(255,140,0),
     	"orange": new Color(255,165,0),
     	"gold": new Color(255,215,0),
     	"dark golden rod": new Color(184,134,11),
     	"golden rod": new Color(218,165,32),
     	"pale golden rod": new Color(238,232,170),
     	"dark khaki": new Color(189,183,107),
     	"khaki": new Color(240,230,140),
     	"olive": new Color(128,128,0),
     	"yellow": new Color(255,255,0),
     	"yellow green": new Color(154,205,50),
     	"dark olive green": new Color(85,107,47),
     	"olive drab": new Color(107,142,35),
     	"lawn green": new Color(124,252,0),
     	"chart reuse": new Color(127,255,0),
     	"green yellow": new Color(173,255,47),
     	"dark green": new Color(0,100,0),
     	"green": new Color(0,128,0),
     	"forest green": new Color(34,139,34),
     	"lime": new Color(0,255,0),
     	"lime green": new Color(50,205,50),
     	"light green": new Color(144,238,144),
     	"pale green": new Color(152,251,152),
     	"dark sea green": new Color(143,188,143),
     	"medium spring green": new Color(0,250,154),
     	"spring green": new Color(0,255,127),
     	"sea green": new Color(46,139,87),
     	"medium aqua marine": new Color(102,205,170),
     	"medium sea green": new Color(60,179,113),
     	"light sea green": new Color(32,178,170),
     	"dark slate gray": new Color(47,79,79),
     	"teal": new Color(0,128,128),
     	"dark cyan": new Color(0,139,139),
     	"aqua": new Color(0,255,255),
     	"cyan": new Color(0,255,255),
     	"light cyan": new Color(224,255,255),
     	"dark turquoise": new Color(0,206,209),
     	"turquoise": new Color(64,224,208),
     	"medium turquoise": new Color(72,209,204),
     	"pale turquoise": new Color(175,238,238),
     	"aqua marine": new Color(127,255,212),
     	"powder blue": new Color(176,224,230),
     	"cadet blue": new Color(95,158,160),
     	"steel blue": new Color(70,130,180),
     	"corn flower blue": new Color(100,149,237),
     	"deep sky blue": new Color(0,191,255),
     	"dodger blue": new Color(30,144,255),
     	"light blue": new Color(173,216,230),
     	"sky blue": new Color(135,206,235),
     	"light sky blue": new Color(135,206,250),
     	"midnight blue": new Color(25,25,112),
     	"navy": new Color(0,0,128),
     	"dark blue": new Color(0,0,139),
     	"medium blue": new Color(0,0,205),
     	"blue": new Color(0,0,255),
     	"royal blue": new Color(65,105,225),
     	"blue violet": new Color(138,43,226),
     	"indigo": new Color(75,0,130),
     	"dark slate blue": new Color(72,61,139),
     	"slate blue": new Color(106,90,205),
     	"medium slate blue": new Color(123,104,238),
     	"medium purple": new Color(147,112,219),
     	"dark magenta": new Color(139,0,139),
     	"dark violet": new Color(148,0,211),
     	"dark orchid": new Color(153,50,204),
     	"medium orchid": new Color(186,85,211),
     	"purple": new Color(128,0,128),
     	"thistle": new Color(216,191,216),
     	"plum": new Color(221,160,221),
     	"violet": new Color(238,130,238),
     	"magenta": new Color(255,0,255),
     	"fuchsia": new Color(255,0,255),
     	"orchid": new Color(218,112,214),
     	"medium violet red": new Color(199,21,133),
     	"pale violet red": new Color(219,112,147),
     	"deep pink": new Color(255,20,147),
     	"hot pink": new Color(255,105,180),
     	"light pink": new Color(255,182,193),
     	"pink": new Color(255,192,203),
     	"antique white": new Color(250,235,215),
     	"beige": new Color(245,245,220),
     	"bisque": new Color(255,228,196),
     	"blanched almond": new Color(255,235,205),
     	"wheat": new Color(245,222,179),
     	"corn silk": new Color(255,248,220),
     	"lemon chiffon": new Color(255,250,205),
     	"light golden rod yellow": new Color(250,250,210),
     	"light yellow": new Color(255,255,224),
     	"saddle brown": new Color(139,69,19),
     	"sienna": new Color(160,82,45),
     	"chocolate": new Color(210,105,30),
     	"peru": new Color(205,133,63),
     	"sandy brown": new Color(244,164,96),
     	"burly wood": new Color(222,184,135),
     	"tan": new Color(210,180,140),
     	"rosy brown": new Color(188,143,143),
     	"moccasin": new Color(255,228,181),
     	"navajo white": new Color(255,222,173),
     	"peach puff": new Color(255,218,185),
     	"misty rose": new Color(255,228,225),
     	"lavender blush": new Color(255,240,245),
     	"linen": new Color(250,240,230),
     	"old lace": new Color(253,245,230),
     	"papaya whip": new Color(255,239,213),
     	"sea shell": new Color(255,245,238),
     	"mint cream": new Color(245,255,250),
     	"slate gray": new Color(112,128,144),
     	"light slate gray": new Color(119,136,153),
     	"light steel blue": new Color(176,196,222),
     	"lavender": new Color(230,230,250),
     	"floral white": new Color(255,250,240),
     	"alice blue": new Color(240,248,255),
     	"ghost white": new Color(248,248,255),
     	"honeydew": new Color(240,255,240),
     	"ivory": new Color(255,255,240),
     	"azure": new Color(240,255,255),
     	"snow": new Color(255,250,250),
     	"black": new Color(0,0,0),
     	"dim gray": new Color(105,105,105),
     	"dim grey": new Color(105,105,105),
     	"gray": new Color(128,128,128),
     	"grey": new Color(128,128,128),
     	"dark gray": new Color(169,169,169),
     	"dark grey": new Color(169,169,169),
     	"silver": new Color(192,192,192),
     	"light gray": new Color(211,211,211),
     	"light grey": new Color(211,211,211),
     	"gainsboro": new Color(220,220,220),
     	"white smoke": new Color(245,245,245),
     	"white": new Color(255,255,255)
    };

    var ease_out = new CBezier(0.5, 0.2, 0, 1);

    if (!requestAnimationFrame)
        requestAnimationFrame = (e) => {
            setTimeout(e, 1000);
        };

    class TT_From {
        constructor(element) {
            //extracted animatable components
            var rect = element.getBoundingClientRect();

            this.color = new Color(window.getComputedStyle(element, null).getPropertyValue("background-color"));
            this.height = parseFloat(window.getComputedStyle(element, null).getPropertyValue("height"));
            this.width = parseFloat(window.getComputedStyle(element, null).getPropertyValue("width"));

            //*if(!this.height || !this.width){
            this.height = rect.height;
            this.width = rect.width;
            //}*/


            this.left = parseFloat(rect.left);
            this.top = parseFloat(rect.top);

            this.element = element;

        }

        destructor() {
            this.element = null;
            this.color = null;
        }

        start() {
            this.element.style.opacity = 0;
        }

        end() {
            this.element.style.opacity = 1;
        }
    }

    class TT_To extends TT_From {
        constructor(element, from) {
            super(element);

            this.from = from;

            this.res = ((element.style.top) && (element.style.left));

            this.rt = (element.style.top) ? (element.style.top) : null;
            this.rl = element.style.left ? element.style.left : null;


            //get the relative offset of this object
            var offset_x = 0; - element.getParentWindowLeft();
            var offset_y = 0; - element.getParentWindowTop();

            var offset_x = parseFloat(window.getComputedStyle(element, null).getPropertyValue("left"));
            var offset_y = parseFloat(window.getComputedStyle(element, null).getPropertyValue("top"));
            //And adjust start to respect the elements own parental offsets
            var diffx = this.left - this.from.left;
            this.left = offset_x;
            this.from.left = this.left - diffx;

            var diffy = this.top - this.from.top;
            this.top = offset_y;
            this.from.top = this.top - diffy;

            this.time = 60 * .35;
            this.s = 0;
            this.color_o = window.getComputedStyle(element, null).getPropertyValue("background-color");
            this.height_o = element.style.width;
            this.width_o = element.style.height;
            this.top_o = this.top;
            this.left_o = this.left;
            this.pos = window.getComputedStyle(element, null).getPropertyValue("position");


        }

        destructor() {
            this.end(); //Restore everything back to it's original type;
            this.from = null;
            this.s = Infinity;
            this.element = null;
            super.destructor();
        }

        start() {
            this.element.style.opacity = 1;
            this.element.style.top = this.from.top + "px";
            this.element.style.left = this.from.left + "px";
            this.element.style.width = this.from.width + "px";
            this.element.style.height = this.from.height + "px";
        }

        step() {
            this.s++;

                var t = this.s / this.time;

            if (t > 1) return false;

            var ratio = ease_out.getYatX(t);

            if (ratio > 1) ratio = 1;

            this.element.style.top = Math.round((this.top - this.from.top) * ratio + this.from.top) + "px";
            this.element.style.left = Math.round((this.left - this.from.left) * ratio + this.from.left) + "px";
            this.element.style.width = ((this.width - this.from.width) * ratio + this.from.width) + "px";
            this.element.style.height = ((this.height - this.from.height) * ratio + this.from.height) + "px";
            this.element.style.backgroundColor = (this.color.sub(this.from.color).mult(ratio).add(this.from.color)) + "";

            return (t < 0.9999995);
        }

        end() {
            this.element.style.backgroundColor = null;
            this.element.style.height = this.height_o;
            this.element.style.width = this.width_o;
            this.element.style.top = this.rt;
            this.element.style.left = this.rl;
        }
    }


    class TTPair {
        constructor(e_to, e_from) {
            this.b = (e_from instanceof TT_From) ? e_from : new TT_From(e_from);
            this.a = new TT_To(e_to, this.b);

            if (this.a.element.__TT__)
                this.a.element.__TT__.destructor();

            if (this.b.element.__TT__)
                this.b.element.__TT__.destructor();

            this.a.element.__TT__ = this;
            this.b.element.__TT__ = this;

            this.destroyed = false;

            this.start();
        }

        destructor() {
            if (this.destroyed) return
            if (this.b.element)
                this.b.element.__TT__ = null;
            if (this.a.element)
                this.a.element.__TT__ = null;
            this.a.destructor();
            this.destroyed = true;
        }

        start() {
            this.b.start();
            this.a.start();
        }

        step() {
            return this.a.step();
        }
    }

    const TransformRunner = new (class{
        constructor() {
            this.pairs = [];
            this.____SCHEDULED____ = false;
        }

        pushPair(pair) {
            this.pairs.push(pair);
            Scheduler.queueUpdate(this);
        }

        update(ratio) {
            let rp = this.pairs;

            if(rp.length > 0)
                Scheduler.queueUpdate(this);

            for (var i = 0; i < rp.length; i++) {
                var _rp = rp[i];
                if (!_rp.step(ratio)) {
                    _rp.destructor();
                    rp.splice(i, 1);
                    i--;
                }        }

            
        }
    })();


    /**
        Transform one element from another back to itself
    */
    function TransformTo(element_from, element_to, HIDE_OTHER) {


        if (!element_to) {

            let a = (from) => (element_to, HIDE_OTHER) => {
                let pair = new TTPair(element_to, from);
                TransformRunner.pushPair(pair);
            };

            let b = a(new TT_From(element_from));

            return b;
        }

        var pair = new TTPair(element_to, element_from);

        TransformRunner.pushPair(pair);

        pair.start();
    }

    class AnimCore{
    	constructor() {
    		this.anim_group = {};
    		this.running_animations = [];
    	}

    	step(step_multiplier) {
    		var l = this.running_animations.lenght;
    		if (l > 0) {
    			for (var i = 0; i < l; i++) {

    				var ab = this.running_animations[i];

    				if (ab && !ab.step(step_multiplier)) {
    					ab.destructor();
    					this.running_animations[i] = null;
    				}
    			}
    		}
    	}

    	addBloc(anim_bloc) {
    	}
    }

    var animation = /*#__PURE__*/Object.freeze({
        AnimCore: AnimCore,
        TransformTo: TransformTo,
        Color: Color
    });

    class Transitioneer {
        constructor() {

        }

        set(element, data) {
            element.style.transition = "opacity 0.5s";
            element.style.opacity = 0;
        }

        set_in(element, data, index = 0) {
        	element.style.transition = `opacity ${0.8*index+0.5}s`;
            element.style.opacity = 1;
            return 0.8;
        }

        set_out(element, data, index = 0) {
            element.style.opacity = 0;
            return 0.8;
        }

        finalize_out(element) {
        	element.style.opacity = 0;
        }
    }

    let PresetTransitioneers = {
        base: Transitioneer
    };

    class Rivet extends View {

        constructor(parent = null, data = {}, presets = {}) {

            super();

            this.parent = parent;
            this.element = null;
            this.children = [];
            this.data = data;
            this.named_elements = null;
            this.active = false;
            this.export_val = null;

            this.DESTROYED = false;

            //Setting the transitioner
            this.transitioneer = null;

            if (data.trs) {
                if (presets.transitions && presets.transitions[data.trs])
                    this.transitioneer = new presets.transitions[data.trs]();
                else if (PresetTransitioneers[data.trs])
                    this.transitioneer = new PresetTransitioneers[data.trs]();

                this.transitioneer.set(this.element);
            }

            this.addToParent();
        }

        addToParent() {
            if (this.parent) this.parent.children.push(this);
        }

        destructor() {

            this.DESTROYED = true;

            if (this.LOADED) {


                let t = this.transitionOut();

                for (let i = 0, l = this.children.length; i < l; i++) {
                    let child = this.children[i];

                    t = Math.max(t, child.transitionOut());
                }
                if (t > 0) {
                    setTimeout(() => {
                        this.destructor();
                    }, t * 1000 + 5);
                }
            } else {
                this.finalizeTransitionOut();
                this.children.forEach((c) => c.destructor());
                this.children.length = 0;
                this.data = null;

                if (this.element && this.element.parentElement)
                    this.element.parentElement.removeChild(this.element);

                this.element = null;

                super.destructor();
            }
        }

        bubbleLink(link_url, child, trs_ele = {}) {
            if (this.parent) {

                if (this.data.transition)
                    trs_ele[this.data.transition] = this.element;

                for (var i = 0, l = this.children.length; i < l; i++) {
                    let ch = this.children[i];

                    if (ch !== child)
                        ch.gatherTransitionElements(trs_ele);

                }

                this.parent.bubbleLink(link_url, this, trs_ele);
            } else {
                history.pushState({}, "ignored title", link_url);
                window.onpopstate();
            }
        }

        getNamedElements(named_elements) {}

        gatherTransitionElements(trs_ele) {

            if (this.data.transition && !trs_ele[this.data.transition])
                trs_ele[this.data.transition] = this.element;

            this.children.forEach((e) => {
                if (e.is == 1)
                    e.gatherTransitionElements(trs_ele);
            });
        }

        copy(element, index) {
            let out_object = {};

            if (!element) {
                element = this.element.cloneNode(true);
            }

            if (this.children) {
                out_object.element = element.children[this.element];
                out_object.children = new Array(this.children.length);

                for (var i = 0, l = this.children.length; i < l; i++) {
                    let child = this.children[i];
                    out_object.children[i] = child.copy(out_object.element);
                }
            }

            return out_object;
        }

        handleUrlUpdate(wurl) {}

        finalizeTransitionOut() {
            for (let i = 0, l = this.children.length; i < l; i++)
                this.children[i].finalizeTransitionOut();

            if (this.transitioneer) {
                this.transitioneer.finalize_out(this.element);
            }

            this.hide();
        }


        /**
          @returns {number} Time in milliseconds that the transition will take to complete.
        */
        transitionIn(index = 0) {

            this.show();

            let transition_time = 0;

            this.LOADED = true;

            for (let i = 0, l = this.children.length; i < l; i++)
                transition_time = Math.max(transition_time, this.children[i].transitionIn(index));

            if (this.transitioneer) {
                transition_time = Math.max(transition_time, this.transitioneer.set_in(this.element, this.data, index));
            }




            return transition_time;
        }

        /**
            Takes as an input a list of transition objects that can be used
        */
        transitionOut(index = 0, DESTROY = false) {

            let transition_time = 0;

            this.LOADED = false;

            if (this.transitioneer) {
                transition_time = Math.max(transition_time, this.transitioneer.set_out(this.element, this.data, index));
            }

            for (let i = 0, l = this.children.length; i < l; i++)
                transition_time = Math.max(transition_time, this.children[i].transitionOut(index));

            if (DESTROY) {
                setTimeout(() => {
                    this.finalizeTransitionOut();
                    this.destructor();
                }, transition_time * 1000);
            }

            return transition_time;
        }

        updateDimensions() {
            for (var i = 0; i < this.children.length; i++)
                this.children[i].updateDimensions();
        }

        /**
            Called by  parent when data is update and passed down from further up the graph. 
            @param {(Object | Model)} data - Data that has been updated and is to be read. 
            @param {Array} changed_properties - An array of property names that have been updated. 
            @param {Boolean} IMPORTED - True if the data did not originate from the model watched by the parent Case. False otherwise.
        */
        __down__(data, changed_properties = null, IMPORTED = false) {
            let r_val = this.down(data, changed_properties, IMPORTED);
            if (r_val)(data = r_val, IMPORTED = true);
            for (let i = 0, l = this.children.length; i < l; i++) {
                this.children[i].__down__(data, changed_properties, IMPORTED);
            }
        }
        down(data, changed_properties = null, IMPORTED) {}

        /**
            Called by  parent when data is update and passed up from a leaf. 
            @param {(Object | Model)} data - Data that has been updated and is to be read. 
            @param {Array} changed_properties - An array of property names that have been updated. 
            @param {Boolean} IMPORTED - True if the data did not originate from the model watched by the parent Case. False otherwise.
        */
        __up__(data) {
            if (this.parent)
                this.parent(up);
        }
        
        up(data) {
            if(data)
                this.__up__(data);
        }

        __update__(data, FROM_PARENT = false) {

            let r_data = this.update(data, FROM_PARENT);

            for (let i = 0, l = this.children.length; i < l; i++) {
                this.children[i].__update__(r_data || data, true);
            }
        }

        load(model) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].load(model);
            }
        }

        hide() {
            if (this.element) {
                this.display = this.element.style.display;
                this.element.style.display = "none";
            }
        }

        show() {
            if (this.element) {
                if (this.element.style.display == "none")
                    this.element.style.display = this.display;
            }
        }

        __updateExports__(data) {
            if (this.data.export && data[this.data.export])
                this.export_val = data[this.data.export];
        }

        __getExports__(exports) {
            if (this.export_val)
                exports[this.data.export] = this.export_val;
        }

        /**
            Exports data stored from updateExports() into a an Object exports and calls it's parent's export function, passing exports
        */
        export (exports = new AnyModel) {

            if (this.parent && this.parent.export) {


                this.__getExports__(exports);

                for (let i = 0, l = this.children.length; i < l; i++)
                    this.children[i].__getExports__(exports);

                this.parent.export(exports);
            }
        }

        import (data) {

            if (this.model)
                this.model.add(data);

            this.export(data);
        }

        updateExports(data) {
            if (this.data.export && data[this.data.export])
                this.export = data[this.data.export];
        }

        add(value) {
            if (this.model) {
                this.model.add(value);
                this.export(this.model);
            } else if (this.parent && this.parent.add)
                this.parent.add(value);
        }
    }

    /**
        Handles the transition of separate elements.
    */
    class BasicCase extends Rivet {
        constructor(element) {
            super(null, element, {}, {});
            this.anchor = null;
            this.LOADED = false;

            this.transitioneer = new Transitioneer();
            this.transitioneer.set(this.element);
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
            this.transitioneer.set(this.element);
        }
    }

    /**
        Deals with specific properties on a model. 
    */

    class Cassette extends Rivet {
        constructor(parent, element, presets, data) {

            super(parent, element, presets, data);

            this.prop = this.data.prop;

            this.width = 0;
            this.height = 0;
            this.top = 0;
            this.left = 0;
            this.lvl = 0;
            this.is = 1;
            this.data_cache = null;
            this.children = [];

            if (this.element.tagName == "A")
                this.processLink(this.element);
        }

        destructor() {

            if (this.element.tagName == "A")
                this.destroyLink(this.element);

            this.data_cache = null;

            super.destructor();
        }

        /**
            This will attach a function to the link element to intercept and process data from the cassette.
        */
        processLink(element, link) {

            if (element.origin !== location.origin) return;

            if (!element.onclick) element.onclick = ((href, a, __function__) => (e) => {
                e.preventDefault();
                if (__function__(href, a)) e.preventDefault();
            })(element.href, element, (href, a) => {

                let SAME_LOCALE = (location.pathname == a.pathname);

                let hashtag = href.includes("#");

                let real_href = "";

                let lex = Lex(href);

                while (lex.token) {

                    if (lex.token.text == "{") {
                        lex.next();
                        let prop = lex.token.text;
                        lex.next();
                        real_href += this[prop] || this.data_cache[prop];

                        if (lex.token.text != "}")
                            console.warn(`incorrect value found in url ${href}`);
                    } else {
                        real_href += lex.token.text;
                    }

                    lex.next();
                }

                if (hashtag)
                    this.export();

                if(!SAME_LOCALE)
                    this.bubbleLink(real_href);

                return true;
            });

            element.onmouseover = (() => {

                let href = element.href;

                let real_href = "";

                let lex = Lex(href);

                while (lex.token) {
                    if (lex.token.text == "{") {
                        lex.next();
                        let prop = lex.token.text;
                        lex.next();

                        real_href += this[prop] || this.data_cache[prop];

                        if (lex.token.text != "}")
                            console.warn(`incorrect value found in url ${href}`);
                    } else {
                        real_href += lex.token.text;
                    }

                    lex.next();
                }
            });
        }

        destroyLink(element) {

            element.onclick = null;
            element.onmouseover = null;
        }


        update(data, __FROM_PARENT__ = false) {

            super.__updateExports__(data);

            if (data) {

                if (this.prop) {
                    this.element.innerHTML = data[this.prop];
                    this[this.prop] = data[this.prop];
                } else {
                    this.data_cache = data;
                }
            }
        }

        import (data) {

        }

        load(model) {

            this.children.forEach((e) => {
                e.load(model);
            });

            if (this.data.model)
                model.addView(this);
        }

        updateDimensions() {

            var d = this.element.getBoundingClientRect();

            this.width = d.width;
            this.height = d.height;
            this.top = d.top;
            this.left = d.left;

            super.updateDimensions();
        }
    }

    class Case extends Rivet {

        /**
            Case constructor. Builds a Case object.
            @params [DOMElement] element - A DOM <template> element that contains a <case> element.
            @params [LinkerPresets] presets
            @params [Case] parent - The parent Case object, used internally to build Case's in a hierarchy
            @params [Model] model - A model that can be passed to the case instead of having one created or pulled from presets. 
            @params [DOM]  WORKING_DOM - The DOM object that contains templates to be used to build the case objects. 
        */
        constructor(parent = null, data, presets) {

            super(parent, data, presets);

            this.USE_SECURE = presets.USE_HTTPS;
            this.named_elements = {};
            this.template = null;
            this.prop = null;
            this.url = null;
            this.presets = presets;
            this.receiver = null;
            this.query = {};
            this.REQUESTING = false;
            this.exports = null;


            this.filter_list = [];
            this.templates = [];
            this.filters = [];
            this.is = 0;
        }

        destructor() {

            this.parent = null;

            if (this.receiver)
                this.receiver.destructor();

            for (let i = 0, l = this.templates.length; i < l; i++)
                this.templates[i].destructor();

            super.destructor();
        }

        /**
            Sets up Model connection or creates a new Model from a schema.
        */
        load(model) {
            if (this.data.url) {
                //import query info from the wurl
                let str = this.data.url;
                let cassettes = str.split(";");
                this.data.url = cassettes[0];

                for (var i = 1; i < cassettes.length; i++) {
                    let cassette = cassettes[i];

                    switch (cassette[0]) {
                        case "p":
                            //TODO
                            this.url_parent_import = cassette.slice(1);
                            break;
                        case "q":
                            this.url_query = cassette.slice(1);
                            break;
                        case "<":
                            this.url_return = cassette.slice(1);
                    }
                }
            }

            this.prop = this.data.prop;

            if (this.data.export) this.exports = this.data.export;

            if (this.model) {
                model = this.model;
                this.model = null;
            }

            if (model && model instanceof Model) {

                if (this.schema) {
                    /* Opinionated Case - Only accepts Models that are of the same type as its schema.*/
                    if (model.constructor != this.schema) ;else{
                        this.schema = null;
                    }
                }
                this.model = null;
            } 

            if (this.schema) 
                model = new this.schema();
            
            model.addView(this);

            if (this.model) {
                if (this.data.url) {
                    this.receiver = new Getter(this.data.url, this.url_return);
                    this.receiver.setModel(model);
                    this.____request____();
                }
            } else {
                throw new Error(`No Model could be found for Case constructor! Case schema "${this.data.schema}", "${this.presets.schemas[this.data.schema]}"; Case model "${this.data.model}", "${this.presets.models[this.data.model]}";`);
            }


            for (var i = 0; i < this.children.length; i++) {
                this.children[i].load(this.model);
            }
        }

        ____request____(query) {

            this.receiver.get(query, null, this.USE_SECURE).then(() => {
                this.REQUESTING = false;
            });
            this.REQUESTING = true;
        }

        export (exports) {

            this.updateSubs(this.children, exports, true);

            super.export(exports);
        }

        updateSubs(cassettes, data, IMPORT = false) {

            for (var i = 0, l = cassettes.length; i < l; i++) {
                let cassette = cassettes[i];
                if (cassette instanceof Case)
                    cassette.update(data, true);
                else {
                    let r_val;

                    if (IMPORT) {

                        if (cassette.data.import && data[cassette.data.import]) {
                            r_val = cassette.update(data, true);

                            if (r_val) {
                                this.updateSubs(cassette.children, r_val);
                                continue;
                            }
                        }
                    } else {
                        /** 
                            Overriding the model data happens when a cassette returns an object instead of undefined. This is assigned to the "r_val" variable
                            Any child cassette of the returning cassette will be fed "r_val" instead of "data".
                        */

                        r_val = cassette.update(data, true);
                    }


                    this.updateSubs(cassette.children, r_val || data, IMPORT);
                }
            }
        }

        up(data){
            this.model.add(data);
        }

        update(data, changed_values) {
            this.__down__(data, changed_values);
            return;
        }


        handleUrlUpdate(wurl) {
            let query_data = null;
            /* 
                This part of the function will import data into the model that is obtained from the query string 
            */
            if (wurl && this.data.import) {
                query_data = {};
                if (this.data.import == "null") {
                    query_data = wurl.getClass();
                    console.log(query_data);
                } else {
                    var l = this.data.import.split(";");
                    for (var i = 0; i < l.length; i++) {
                        let n = l[i].split(":");

                        let class_name = n[0];
                        let p = n[1].split("=>");
                        var key_name = p[0];
                        var import_name = p[1];
                        if (class_name == "root") class_name = null;
                        query_data[import_name] = wurl.get(class_name, key_name);
                    }
                }
            }

            if (wurl && this.data.url) {

                let query_data = {};
                if (this.url_query) {
                    var l = this.url_query.split(";");
                    for (var i = 0; i < l.length; i++) {
                        let n = l[i].split(":");
                        let class_name = n[0];
                        let p = n[1].split("=>");
                        var key_name = p[0];
                        var import_name = p[1];
                        if (class_name == "root") class_name = null;
                        query_data[import_name] = wurl.get(class_name, key_name);
                    }
                }

                this.____request____(query_data);
            }

            if (!this.model) {

                this.model = new this.model_constructor();


                if (this.getter)
                    this.getter.setModel(this.model);

                this.model.addView(this);
            }

            if (query_data) {
                if (!this.model.add(query_data)) {
                    this.update(this.model.get());
                }
            } else
                this.update(this.model.get());
        }

        transitionIn(index = 0) {

            let transition_time = 0;

            for (let i = 0, l = this.templates.length; i < l; i++)
                transition_time = Math.max(transition_time, this.templates[i].transitionIn(index));

            transition_time = Math.max(transition_time, super.transitionIn(index));

           this.updateDimensions();

            return transition_time;
        }

        /**
            Takes as an input a list of transition objects that can be used
        */
        transitionOut(index = 0, DESTROY = false) {

            let transition_time = 0;

            for (let i = 0, l = this.templates.length; i < l; i++)
                transition_time = Math.max(transition_time, this.templates[i].transitionOut(index));

            transition_time = Math.max(transition_time, super.transitionOut(index, DESTROY));

            return transition_time;
        }

        finalizeTransitionOut() {

            for (let i = 0, l = this.templates.length; i < l; i++)
                this.templates[i].finalizeTransitionOut();

            super.finalizeTransitionOut();
        }

        setActivating() {
            if (this.parent)
                this.parent.setActivating();
        }

        getNamedElements(named_elements) {
            for (let comp_name in this.named_elements) {
                named_elements[comp_name] = this.named_elements[comp_name];
            }
        }
    }

    class CustomCase extends Case {
        constructor(element, data = {}, presets = {}) {
            super(null, element, data, presets);
        }
    }

    class Filter extends Cassette {
    	
        constructor(parent, element, d, p) {

            super(parent, element, d, p);

            parent.filter_list.push((data) => this.filter(data));

            this.element.addEventListener("input", () => {
                this.parent.update();
            });
        }

        update(data) {
            //apply a filter object to the parent
            return false;
        }

        filter(data) {
            return false;
        }
    }

    class CaseTemplate extends Case {

        /**
            CaseTemplate constructor. Builds a CaseTemplate object.
        */

        constructor(parent = null, data, presets) {

            super(parent, data, presets);

            this.cases = [];
            this.activeCases = [];
            
            this.templates = [];
            this.filters = [];
            this.terms = [];
            
            this.range = null;

            this.prop_elements = [];
        }

        filterUpdate() {

            let output = this.cases.slice();

            for (let l = this.filters.length, i = 0; i < l; i++) {
                output = this.filters[i].filter(output);
            }

            for (var i = 0; i < this.activeCases.length; i++) {
                this.element.removeChild(this.activeCases[i].element);
            }

            for (var i = 0; i < output.length; i++) {
                this.element.appendChild(output[i].element);
            }

            this.element.style.position = this.element.style.position;

            for (var i = 0; i < output.length; i++)
                output[i].transitionIn(i);

            this.activeCases = output;
            //Sort and filter the output to present the results on screen.
        }

        cull(new_items) {

            if (new_items.length == 0) {

                for (let i = 0, l = this.cases.length; i < l; i++)
                    this.cases[i].destructor();

                this.cases.length = 0;

            } else {

                let exists = new Map(new_items.map(e => [e, true]));

                var out = [];

                for (let i = 0, l = this.cases.length; i < l; i++)
                    if (!exists.has(this.cases[i].model)) {
                        this.cases[i].destructor();
                        this.cases.splice(i, 1);
                        l--;
                        i--;
                    } else
                        exists.set(this.cases[i].model, false);


                exists.forEach((v, k, m) => {
                    if (v) out.push(k);
                });

                if (out.length > 0)
                    this.added(out);
            }
        }

        load(model) {}

        removed(items) {
            for (let i = 0; i < items.length; i++) {
                let item = items[i];

                for (let j = 0; j < this.cases.length; j++) {
                    let Case$$1 = this.cases[j];

                    if (Case$$1.model == item) {
                        this.cases.splice(j, 1);
                        Case$$1.dissolve();
                        break;
                    }
                }
            }

            this.filterUpdate();
        }

        added(items) {

            for (let i = 0; i < items.length; i++) {
                let Case$$1 = this.templates[0].flesh(items[i]);
                Case$$1.parent = this;
                this.cases.push(Case$$1);
            }

            this.filterUpdate();
        }

        revise() {
            if (this.cache)
                this.update(this.cache);
        }


        getTerms() {

            let out_terms = [];

            for (let i = 0, l = this.terms.length; i < l; i++)
                out_terms.push(this.terms[i].term);


            if (out_terms.length == 0)
                return null;

            return out_terms;
        }

        update(data, IMPORT = false) {

            console.log(data.toJson());

            let container = data.getChanged(this.prop);

            if (IMPORT) {

                let UPDATE = false;

                for (let i = 0, l = this.terms.length; i < l; i++) {
                    if (this.terms[i].update(data))
                        UPDATE = true;
                }

                if (UPDATE && this.model)
                    this.cull(this.get());


                for (let i = 0, l = this.filters.length; i < l; i++)
                    if (this.filters[i].update(data))
                        UPDATE = true;

                if (UPDATE)
                    this.filterUpdate();

            }

            if (container && (container instanceof ModelContainer || container.____self____)) {

                this.cache = data;

                let own_container = container.get(this.getTerms(), null);

                if (own_container instanceof ModelContainer) {
                    own_container.pin();
                    own_container.addView(this);
                    this.cull(this.get());
                } else if (own_container instanceof MCArray) {
                    this.cull(own_container);
                } else {
                    own_container = data.____self____.data[this.prop];
                    if (own_container instanceof ModelContainer) {
                        own_container.addView(this);
                        this.cull(this.get());
                    }
                }
            }
        }

        get() {
            if (this.model instanceof MultiIndexedContainer) {
                if (this.data.index) {
                    let index = this.data.index;

                    let query = {};

                    query[index] = this.getTerms();

                    return this.model.get(query)[index];
                } else
                    console.warn("No index value provided for MultiIndexedContainer!");
            } else {
                let source = this.model.source;
                let terms = this.getTerms();

                if (source) {
                    this.model.destructor();

                    let model = source.get(terms, null);

                    model.pin();
                    model.addView(this);
                }

                return this.model.get(terms);
            }
            return [];
        }

        transitionIn(elements, wurl) {

            let transition_time = 0;

            for (let i = 0, l = this.templates.length; i < l; i++)
                transition_time = Math.max(transition_time, this.templates[i].transitionIn(elements, wurl));

            Math.max(transition_time, super.transitionIn());

            return transition_time;
        }

        /**
            Takes as an input a list of transition objects that can be used
        */
        transitionOut(transition_time = 0, DESTROY = false) {

            for (let i = 0, l = this.templates.length; i < l; i++)
                transition_time = Math.max(transition_time, this.templates[i].transitionOut());

            Math.max(transition_time, super.transitionOut(transition_time, DESTROY));

            return transition_time;
        }

    }

    class Indexer {
        constructor(element) {
            this.lexer = new Lex(element.innerHTML);
            this.element = element;
            this.stack = [];
            this.sp = 0;
        }

        get(index, REDO = false) {
            let lex = this.lexer;

            if (REDO) {
                lex.reset();
                this.stack.length = 0;
                this.sp = 0;
            }

            while (true) {
                if (!lex.text) {
                    if (REDO)
                        return null;
                    else
                        return this.get(index, true);
                }

                switch (lex.text) {
                    case "<":
                        if (lex.peek().text == "/") {
                            lex.next(); // <
                            lex.next(); // /
                            lex.next(); // tagname
                            lex.next(); // >
                            if(--this.sp < 0) return null;
                            this.stack.length = this.sp + 1;
                            this.stack[this.sp]++;
                        } else {
                            lex.next(); // <
                            lex.next(); // tagname
                            while (lex.text !== ">" && lex.text !== "/") {
                                lex.next(); // attrib name
                                if (lex.text == "=")
                                    (lex.next(), lex.next());
                            }
                            if (lex.text == "/") {
                                lex.next(); // / 
                                lex.next(); // >
                                break;
                            }
                            lex.next(); // >

                            (this.stack.push(0), this.sp++);

                            if (lex.text == "#") {
                                lex.next();
                                if (lex.text == "#") {
                                    lex.next();
                                    if (lex.text == ":") {
                                        lex.next();
                                        if (lex.type == "number") {
                                            let number = parseInt(lex.text);
                                            if (number == index) return this.getElement();
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    default:
                        lex.next();
                }
            }
        }
        getElement() {
            let element = this.element;
            for (let i = 0; i < this.sp; i++) {
                element = element.children[this.stack[i]];
            }
            return element;
        }
    }

    /*
        Case skeleton
            Model pointer OR schema pointer
                IF schema, then the skeleton will create a new Model when it is copied, UNLESS a model is given to the skeleton copy Constructor. 
                Other wise, the skeleton will automatically assign the Model to the case object. 

            The model will automatically copy it's element data into the copy, zipping the data down as the Constructor builds the Case's children.

    */
    class CaseSkeleton {

        constructor(element, constructor, data, presets, index) {
            this.element = element;
            this.Constructor = constructor;
            this.children = [];
            this.templates = [];
            this.filters = [];
            this.terms = [];
            this.data = data;
            this.presets = presets;
            this.index = index;
        }

        /**
        
        */
        flesh(Model = null) {
            let Case = this.____copy____(null, null, null);

            Case.load(Model);

            return Case;
        }

        /**
            Constructs a new object, attaching to elements hosted by a case. If the component to construct is a Case, then the 
            parent_element gets swapped out by a cloned element that is hosted by the newly constructed Case.
        */
        ____copy____(parent_element, parent, indexer) {

            let element, CLAIMED_ELEMENT = false;

            if (this.index > 0) {
                element = indexer.get(this.index);
                CLAIMED_ELEMENT = true;
            }

            if (this.element) {
                parent_element = this.element.cloneNode(true);

                if (parent_element.parentElement) {
                    parent_element.parentElement.replaceNode(parent_element, element);
                }
                console.log(parent_element.innerHTML);

                indexer = new Indexer(parent_element);
            }

            let out_object;
            if (this.Constructor) {
                out_object = new this.Constructor(parent, this.data, this.presets);
                if (CLAIMED_ELEMENT)
                    out_object.element = element;
            } else if (!parent) {
                out_object = this.children[0].____copy____(parent_element, null, indexer);
                out_object.element = parent_element;
                return out_object;
            } else
                out_object = parent;


            if (this.children.length > 0)
                for (var i = 0, l = this.children.length; i < l; i++)
                    this.children[i].____copy____(parent_element, out_object, indexer);

            if (this.templates.length > 0) {

                if (this.terms.length > 0)
                    for (var i = 0, l = this.terms.length; i < l; i++)
                        out_object.terms.push(this.terms[i].____copy____(parent_element, null, indexer));

                if (this.filters.length > 0)
                    for (var i = 0, l = this.filters.length; i < l; i++)
                        out_object.filters.push(this.filters[i].____copy____(parent_element, null, indexer));

                for (var i = 0, l = this.templates.length; i < l; i++)
                    out_object.templates.push(this.templates[i]);
            }

            return out_object;
        }
    }

    let GLOBAL = (()=>{
    	let linker = null;
    	return {
    		get linker(){
    			return linker;
    		},
    		set linker(l){
    			if(!linker)
    				linker = l;
    		}
    	}
    });

    class Input extends Cassette {
        constructor(parent, element, d, p) {
            //Scan the element and look for inputs that can be mapped to the
            super(parent, element, d, p);

            //Inputs in forms are automatically hidden.
            this.element.display = "none";

            this.element.addEventListener("input", () => {
                var data = {};
                data[this.prop] = this.element.value;
                this.add(data);
            });
        }

        update(data) {

            if (!data[this.prop]) return;

            this.val = data[this.prop];

            switch (this.element.type) {
                case "date":
                    this.element.value = (new Date(parseInt(data[this.prop]))).toISOString().split("T")[0];
                    break;
                case "time":
                    this.element.value = `${("00"+(data[this.prop] | 0)).slice(-2)}:${("00"+((data[this.prop]%1)*60)).slice(-2)}:00.000`;
                    break;
                case "text":
                    this.element.value = (data[this.prop] != undefined) ? data[this.prop] : "";
                    break;
                default:

                    var t = this.element.classList[0];

                    switch (t) {
                        case "modulo_time":
                            var time = data[this.prop];
                            var IS_PM = (time / 12 > 1);
                            var minutes = ((time % 1) * 60) | 0;
                            var hours = (((time | 0) % 12) != 0) ? (time | 0) % 12 : 12;

                            this.element.value = (hours + ":" + ("0" + minutes).slice(-2)) + ((IS_PM) ? " PM" : " AM");
                            break;

                        default:
                            this.element.value = (data[this.prop] != undefined) ? data[this.prop] : "";
                    }
                    break;
            }
        }
    }

    class Form extends Cassette {
        constructor(parent, element, d, p) {
            //Scan the element and look for inputs that can be mapped to the 
            super(parent, element, d, p);

            this.submitted = false;
            this.schema = null;

            element.addEventListener("submit", (e) => {
                console.log(e.target, this, parent);

                if (!this.submitted)
                    this.submit();

                this.submitted = true;

                e.preventDefault();

                return false;
            });
        }

        destructor() {

        }

        accepted(result) {
            result.text().then((e) => {
                debugger
                GLOBAL.linker.loadPage(
                    GLOBAL.linker.loadNewPage(result.url, (new DOMParser()).parseFromString(e, "text/html")),
                    false
                );
            });
        }

        rejected(result) {
            result.text().then((e) => {
                debugger
                GLOBAL.linker.loadPage(
                    GLOBAL.linker.loadNewPage(result.url, (new DOMParser()).parseFromString(e, "text/html")),
                    false
                );
            });
        }

        load(model) {

            if (model)
                this.schema = model.schema;

            super.load(model);
        }

        update(data) {

        }

        submit() {

            let url = this.element.action;

            var form_data = (new FormData(this.element));
            if (this.schema) {
                for (let i = 0, l = this.children.length; i < l; i++) {
                    let child = this.children[i];

                    if (child instanceof Input) {
                        let name = child.element.name;
                        let prop = child.prop;
                        let scheme = this.schema[prop];
                        if (scheme && prop) {
                            let val = scheme.string(child.val);
                            form_data.set(name, val);
                            console.log(prop, name, val, child.val);
                        }
                    }
                }
            }

            debugger
            fetch(url, {
                method: "post",
                credentials: "same-origin",
                body: form_data,
            }).then((result) => {

                if (result.status != 200)
                    this.rejected(result);
                else
                    this.accepted(result);

            }).catch((e) => {
                this.rejected(e);
            });



            console.log("Wick Form Submitted", url, form_data);


        }
    }

    class Tap extends Rivet {

        constructor(parent, data, presets) {
            super(parent, data, presets);
            this.prop = data.prop;
        }

        down(data, changed_properties = null, imported) {
            if (changed_properties) {
                for (var i = 0, l = changed_properties.length; i < l; i++) {
                    if (changed_properties[i] == this.prop)
                        break;

                    if (i == l - 1)
                        return null;
                }
            } else {
                if (data[this.prop] !== undefined)
                    return { value: data[this.prop] }
            }
        }

        /**
            See Definition in Rivet 
      	*/
        __down__(data, changed_properties = null, IMPORTED = false) {
            let r_val = this.down(data, changed_properties, IMPORTED);
            if (r_val)
                for (let i = 0, l = this.children.length; i < l; i++)
                    this.children[i].__down__(r_val, [this.prop], IMPORTED);
        }

        up(data) {

            if (data.value !== undefined) {
                let out = {};
                out[this.prop] = data.value;
                return out;
            }

            return null;
        }
    }

    class Pipe extends Rivet {

        static Static(data, html) {
            return `<${data.tagname}>${html}</${data.tagname}>`
        }

        constructor(parent, data, presets) {
            super(parent, data, presets);
        }

        down(data){
        	return {value:`<b>${data.value}</b>`}
        }
    }

    Pipe.ADDS_TAGS = true;
    Pipe.CAN_BE_STATIC = true;

    class IO extends Rivet{
    	constructor(parent, data, presets){
    		super(parent, data, presets);
    		this.prop = data.prop;
    	}

    	down(data){
    		this.element.innerHTML = data.value;
    	}
    }

    /*
        Boring Case stuff
    */

    class Root {
        constructor() {
            this.html = "";
            this.children = [];
            this.tag_index = 1;
        };

        addChild(child) {
            child.parent = this;
            this.children.push(child);
        }

        constructSkeleton(presets) {
            let element = document.createElement("div");
            element.innerHTML = this.html;
            let root_skeleton = new CaseSkeleton(element);
            for (let i = 0, l = this.children.length; i < l; i++)
                this.children[i].constructSkeleton(root_skeleton, presets);
            return root_skeleton;
        }

        getIndex() {
            return this.tag_index++;
        }

        toJSON() {
            return {
                children: this.children,
                html: this.html
            }
        }

        offset(increase = 0) {
            let out = this.tag_count;
            this.tag_count += increase;
            return out;
        }
    }

    class GenericNode {

        constructor(tagname, attributes, parent) {
            this.parent = null;
            this.tagname = tagname;
            this.attributes = attributes || {};
            this.IS_NULL = false;
            this.CONSUMES_TAG = true;
            this.CONSUMES_SAME = false;
            this.children = [];
            this.prop_name = null;
            this.html = "";
            this.open_tag = "";
            this.close_tag = "";
            this.tag_index = 0;
            this.index = 0;
            if (parent)
                parent.addChild(this);
        };



        finalize(ctx) {
            ctx.html += this.open_tag + this.html + this.close_tag;
        }

        replaceChild(child, new_child) {
            for (let i = 0; i < this.children.length; i++)
                if (this.children[i] == child) {
                    this.children[i] = new_child;
                    new_child.parent = this;
                    child.parent = null;
                    return
                }
        }

        removeChild(child) {
            for (let i = 0; i < this.children.length; i++)
                if (this.children[i] == child)
                    return this.children.splice(i, 1);
        }

        addChild(child) {

            if (child instanceof TapNode && !(this instanceof CaseNode)) {
                return this.parent.addChild(child);
            }

            child.parent = this;
            this.children.push(child);
        }

        parseAttributes() {
            let out = {};
            out.prop = this.prop_name;
            this.attributes;
            return out;
        }

        addProp(lexer, prop_name, parseFunction, presets) {
            if (this.prop_name !== prop_name)
                this.split(new IONode(prop_name, this.attributes, null, this, this.getIndex()), prop_name);
            else
                new IONode(prop_name, this.attributes, this, this, this.getIndex());
        }

        toJSON() {
            return {
                children: this.children,
                tagname: this.tagname,
                tag_count: this.tag_count,
                tag: { open_tag: this.open_tag, close_tag: this.close_tag },
                html: this.html,
            }
        }

        split(node, prop_name) {
            if (node) {
                if (this.prop_name) {
                    if (prop_name == this.prop_name) {
                        this.addChild(node);
                    } else {
                        let r = new this.constructor(this.tagname, this.attributes, null);
                        r.CONSUMES_SAME = (r.CONSUMES_TAG) ? (!(r.CONSUMES_TAG = !1)) : !1;
                        r.prop_name = prop_name;
                        r.addChild(node);
                        return this.parent.split(r, prop_name);
                    }
                } else {
                    this.addChild(node);
                    this.prop_name = prop_name;
                    this.parent.removeChild(this);
                    return this.parent.split(this, prop_name);
                }
            } else {
                debugger
                if (this.prop_name) {
                    if (prop_name == this.prop_name) ; else {
                        let r = new this.constructor(this.tagname, this.attributes, null);
                        r.prop_name = prop_name;
                        return this.parent.split(r, prop_name);
                    }
                } else {
                    this.parent.removeChild(this);
                    return this.parent.split(this, prop_name);
                }
            }

            return -1;
        }



        getIndex() {
            if(this.tag_index > 0) return this.tag_index++;
            if (this.parent) return this.parent.getIndex();
        }

        constructSkeleton(parent_skeleton, presets) {

            let skeleton = this.createSkeletonConstructor(presets);

            parent_skeleton.children.push(skeleton);

            for (let i = 0; i < this.children.length; i++)
                this.children[i].constructSkeleton(skeleton, presets);
        }

        createSkeletonConstructor(presets) {
            let skeleton = new CaseSkeleton(this.getElement(), this.getConstructor(presets), this.parseAttributes(), presets, this.index);
            return skeleton;
        }

        getConstructor() {
            return null;
        }

        getElement() {
            return null;
        }
    }

    class CaseNode extends GenericNode {
        constructor(tagname, attributes, parent) {
            super(tagname, attributes, parent);
        };

        finalize(ctx) {
            ctx.html += this.html;
        }

        addProp(lexer, prop_name, parseFunction, presets) {
            if (lexer.text == "(" && lexer.peek().text == "(") {
                lexer.assert("(");
                lexer.assert("(");
                let template = new TemplateNode("list", this.attributes, this, this);
                template.parse(lexer, parseFunction, presets);
                lexer.assert(")");
                let out = lexer.pos + 1;
                lexer.assert(")");
                return out;
            }
        }

        getConstructor() {
            return Case;
        }

        split(node, prop_name) {
            if (node) this.addChild(node);
        }
    }

    class TemplateNode extends GenericNode {
        constructor(tagname, attributes, parent, ctx) {
            super(tagname, attributes, parent);
            this.index = this.getIndex();
            ctx.html += `<list>##:${this.index}</list>`;
            this.filters = [];
            this.terms = [];
            this.templates = [];
        };

        addChild(child) {
            if (child instanceof FilterNode)
                this.filters.push(child);
            else if (child instanceof TermNode)
                this.terms.push(child);
            else if (child instanceof CaseNode) {
                if (this.templates.length > 0) throw new Error("Only one Case allowed in a Template.");
                this.templates.push(child);
                child.tag_index = 1;
                this.html = child.html;
            } else throw new Error("Templates only support Filter, Term or Case elements.")
        }

        constructSkeleton(parent_skeleton, presets) {
            let element = document.createElement("div");
            element.innerHTML = this.html;
            let skeleton = new CaseSkeleton(this.getElement(), CaseTemplate, this.parseAttributes(), presets, this.index);
            skeleton.filters = this.filters.map((filter) => filter.createSkeletonConstructor(presets));
            skeleton.terms = this.terms.map((term) => term.createSkeletonConstructor(presets));
            skeleton.templates = this.templates.map((template) => {
                let skl = template.createSkeletonConstructor(presets);
                skl.element = element;
                return skl;
            });
            parent_skeleton.children.push(skeleton);
        }

        getElement() {
            let div = document.createElement("list");
            return div;
        }

        addProp(lexer, prop_name, parseFunction, presets) {
            //ctx.html += prop_name;
        }

        parse(lexer, parseFunction, presets) {
            while (lexer.text !== ")" && lexer.peek().text !== ")") {
                if (!lexer.text) throw new Error("Unexpected end of Output. Missing '))' ");
                let out = parseFunction(lexer, this, presets);
                if (out instanceof CaseNode)
                    this.html = out.html;
            }
        }

        split(node, prop_name) {

            if (node)
                this.addChild(node);

            return this.tag_count;
        }
    }

    class TapNode extends GenericNode {
        constructor(tagname, attributes, parent) {
            super(tagname, attributes, parent);
        };

        finalize(ctx) {
            ctx.html += this.html;
        }

        getConstructor(presets) {
            return Tap;
        }
    }


    class FilterNode extends GenericNode {
        constructor(tagname, attributes, parent) {
            super(tagname, attributes, parent);
            this.CONSUMES_TAG = false;
        };

        finalize(ctx) {}

        getConstructor(presets) {
            return Tap;
        }

        addProp(lexer, prop_name, parseFunction, presets) {
            this.attributes.prop = prop_name;
        }
    }


    class TermNode extends GenericNode {
        constructor(tagname, attributes, parent) {
            super(tagname, attributes, parent);
        };

        finalize(ctx) {}

        getConstructor(presets) {
            return Tap;
        }

        addProp(lexer, prop_name, parseFunction, presets) {
            this.attributes.prop = prop_name;
        }
    }



    class PipeNode extends GenericNode {
        constructor(tagname, attributes, parent) {
            super(tagname, attributes, parent);
        };

        finalize(ctx, presets) {
            ctx.html += this.html;
        }

        getConstructor(presets, finalizing = false) {
            let constructor = Pipe;
            return constructor;
        }

        split(node, prop_name) {
            if (!(this.parent instanceof PipeNode) &&
                !(this.parent instanceof TapNode)
            ) {
                //Need a TapNode to complete the pipeline
                let tap = new TapNode("", {}, null);
                this.prop_name = this.prop_name;
                this.parent.replaceChild(this, tap);
                tap.addChild(this);
            }

            super.split(node, prop_name);
        }
    }

    class IONode extends GenericNode {
        constructor(prop_name, attributes, parent, ctx, index) {
            super("", null, parent);
            this.index = index;
            console.log(index);
            ctx.html += `<io prop="${prop_name}">##:${index}</io>`;
            this.prop_name = prop_name;
            this.CONSUMES_TAG = true;
        };

        getConstructor(presets) {
            return IO;
        }
    }

    /*
        This function's role is to construct a case skeleton given a template, a list of presets, and 
        and optionally a working DOM. This will return Case Skeleton that can be cloned into a new Case object. 

        @param {HTMLElement} Template
        @param {Presets} presets 
        @param {DOMElement} WORKING_DOM
    */
    function CaseConstructor(Template, Presets, WORKING_DOM) {

        let skeleton;

        if (!Template)
            return null;

        if (Template.skeleton)
            return Template.skeleton;


        //TEmplate Filtration handled here.
        //Import the 
        let element = document.importNode(Template, true);

        skeleton = ComponentConstructor(element, Presets, WORKING_DOM);

        if (!skeleton)
            return null;

        Template.skeleton = ((skeleton) => (model) => skeleton.flesh(model))(skeleton);

        return Template.skeleton;
    }

    function ComponentConstructor(element, presets, WORKING_DOM) {

        if (element.tagName === "TEMPLATE") {
            let component_name = element.id;
            let input = element.innerHTML;
            let lexer = Lex(input);

            //Make sure we are starting with a case object. 

            if (lexer.text == "<") {
                //off to a good start
                let root = new Root();
                ParseTag(lexer, root, presets);
                console.log(root);
                return root.constructSkeleton(presets);
            }
        }
        return null;
    }

    /**
        Handles the selection of AST nodes based on tagname;
        
        @param {Lexer} lexer - The lexical parser 
        @param {String} tagname - The elements tagname
        @param {Object} attributes - 
        @param {Object} ctx
        @param {CCAstNode} parent
    */
    function Dispatch(lexer, tagname, attributes, parent) {
        let ast;
        switch (tagname) {
            /* Taps */
            case "w":
            case "w-a":
            case "w_a":
                ast = new TapNode(tagname, attributes, parent);
                return ast;
            case "w-filter":
                ast = new FilterNode(tagname, attributes, parent);
                return ast;
            case "w-term":
                ast = new TermNode(tagname, attributes, parent);
                return ast;
            case "w-c":
            case "w_c":
            case "w-case":
            case "w_case":
                ast = new CaseNode(tagname, attributes, parent);
                return ast;
            default:
                if (tagname[0] == "w") {
                    ast = new PipeNode(tagname, attributes, parent);
                    return ast;
                }
                break;
        }
        ast = new GenericNode(tagname, attributes, parent);
        return ast;
    }

    /**
        Handles the parsing of HTML tags and content
        @param {String} tagname
        @param {Object} ctx
        @param {CCAstNode} parent
    */
    function ParseTag(lexer, parent, presets) {
        let start = lexer.pos;
        let attributes = {};
        
        lexer.assert("<");
        
        let tagname = lexer.text;
        
        if (lexer.type == "identifier") {
            lexer.next();
            GetAttributes(lexer, attributes);
        } else throw new Error(`Expected tag-name identifier, got ${lexer.text}`);

        let ele = Dispatch(lexer, tagname, attributes, parent);

        ele.open_tag += lexer.slice(start);

        start = lexer.token.pos;

        while (true) {

            if (!lexer.text)
                throw ("Unexpected end of output");

            switch (lexer.text) {
                case "<":
                    if (lexer.peek().text == "/") {

                        ele.html += lexer.slice(start);

                        start = lexer.pos;

                        //Should be closing it's own tag.
                        lexer.assert("<");
                        lexer.assert("/");
                        lexer.assert(tagname);

                        let out = lexer.pos + 1;
                        
                        lexer.assert(">");

                        ele.close_tag = lexer.slice(start);

                        ele.finalize(parent || {html:""}, presets);

                        return out;
                    } else
                        start = ParseTag(lexer, ele);
                    break;
                case "[":
                    ele.html += lexer.slice(start);
                    lexer.next();
                    let prop_name = lexer.text;
                    lexer.next();
                    start = lexer.pos + 1;
                    lexer.assert("]");
                    start = ele.addProp(lexer, prop_name, ParseTag, presets) || start;
                    break;
                default:
                    lexer.next();
                    break;
            }
        }
    }

    /**
        Returns all attributes in an element as a key-value object.

        @param {Lexer} lexer - The lexical parser  
        @param {Object} attibs - An object which will receive the attribute keys and values. 
    */
    function GetAttributes(lexer, attribs) {
        while (lexer.text !== ">" && lexer.text !== "/") {
            if (!lexer.text) throw Error("Unexpected end of input.");
            let attrib_name = lexer.text;
            let attrib_val = null;
            lexer.next();
            if (lexer.text == "=") {
                lexer.next();
                if (lexer.token.type == "string") {
                    attrib_val = lexer.text.slice(1, -1);
                    lexer.next();
                } else
                    throw new Error("Expecting attribute definition.");

            }
            attribs[attrib_name] = attrib_val;
        }

        if (lexer.text == "/") // Void Nodes
            lexer.assert("/");
        lexer.assert(">");
    }

    /**
        The main container of Cases. Represents an area of interest on the client view.
    */
    class Element$1 {
        /**
         
         */
        constructor(element) {
            this.id = (element.classList) ? element.classList[0] : element.id;
            this.components = [];
            this.bubbled_elements = null;
            this.wraps = [];

            //The original element container.
            //this.parent_element = parent_element;

            //Content that is wrapped in an ele_wrap
            this.element = element;
        }


        unloadComponents() {
            for (var i = 0; i < this.components.length; i++)
                this.components[i].LOADED = false;
        }

        transitionOut() {

            let t = 0;

            for (var i = 0; i < this.components.length; i++) {

                let component = this.components[i];

                if (!component.LOADED) {

                    component.parent = null;

                    t = Math.max(component.transitionOut(), t);
                }
            }
            return t;
        }

        finalize() {

            for (var i = 0; i < this.components.length; i++) {

                let component = this.components[i];

                if (!component.LOADED && component.parentElement) {
                    component.finalizeTransitionOut();
                    this.wraps[i].removeChild(component.element);
                }

                component.LOADED = false;
            }
        }

        loadComponents(wurl) {

            for (let i = 0; i < this.components.length; i++) {

                let component = this.components[i];

                component.parent = this;

                if (component.element.parentElement)
                    component.element.parentElement.removeChild(component.element);

                this.wraps[i].appendChild(component.element);

                component.handleUrlUpdate(wurl);

                this.components[i].LOADED = true;
            }    }

        transitionIn() {

            // This is to force a document repaint, which should cause all elements to report correct positioning hereafter

            let t = this.element.style.top;
            this.element.style.top = t;

            for (let i = 0; i < this.components.length; i++) {
                let component = this.components[i];

                component.transitionIn();

            }
        }

        bubbleLink(link_url, child, trs_ele = {}) {

            this.bubbled_elements = trs_ele;

            history.pushState({}, "ignored title", link_url);

            window.onpopstate();
        }

        getTransformTo(transitions) {
            if (transitions) {
                let own_elements = {};

                this.getNamedElements(own_elements);

                for (let name in own_elements) {
                    transitions[name] = TransformTo(own_elements[name]);
                }
            }
        }

        setTransformTo(transitions) {
            if (transitions) {
                let own_elements = {};

                this.getNamedElements(own_elements);


                for (let name in own_elements) {
                    let to, from = transitions[name];
                    if ((to = own_elements[name]) && from) {
                        from(to, false);
                    }
                }
            }
        }

        getNamedElements(named_elements) {
            if (this.bubbled_elements) {
                let t = this.bubbled_elements;

                for (let t in this.bubbled_elements)
                    named_elements[t] = this.bubbled_elements[t];

                //this.bubbled_elements = null;

                return;
            }

            let children = this.element.children;

            for (var i = 0; i < children.length; i++) {
                let child = children[i];

                if (child.dataset.transition) {
                    named_elements[child.dataset.transition] = child;
                }
            }

            for (var i = 0; i < this.components.length; i++) {
                let component = this.components[i];
                component.getNamedElements(named_elements);
            }
        }

        setComponents(App_Components, Model_Constructors, Component_Constructors, presets, DOM, wurl) {
            //if there is a component inside the element, register that component if it has not already been registered
            var components = Array.prototype.map.call(this.element.getElementsByTagName("component"), (a) => a);

            setLinks(this.element, (href, e) => {
                history.pushState({}, "ignored title", href);
                window.onpopstate();
                return true;
            });

            if (components.length < 1) {
                //Create a wrapped component for the elements inside the <element>
                let component = document.createElement("div");
                component.classList.add("comp_wrap");

                //Straight up string copy of the element's DOM.
                component.innerHTML = this.element.innerHTML;
            }

            var templates = DOM.getElementsByTagName("template");


            for (var i = 0; i < components.length; i++) {
                let app_case = null;
                let component = components[i];

                try {
                    /**
                        Replace the component with a component wrapper to help preserve DOM arrangement
                    */

                    let comp_wrap = document.createElement("div");
                    comp_wrap.classList.add("comp_wrap");
                    this.wraps.push(comp_wrap);
                    component.parentElement.replaceChild(comp_wrap, component);

                    var id = component.classList[0],
                        comp;
                    /**
                      We must ensure that components act as template "landing spots". In order for that to happen we must check for:
                      (1) The component has, as it's first class name, an id that (2) matches the id of a template. If either of these prove to be not true, we should reject the adoption of the component as a Wick
                      component and instead treat it as a normal "pass through" element.
                    */
                    if (!id) {
                        /*setLinks(component, (href, e) => {
                            history.pushState({}, "ignored title", href);
                            window.onpopstate();
                            return true;
                        })*/

                        app_case = new BasicCase(component);

                    } else {

                        if (!App_Components[id]) {
                            if (comp = Component_Constructors[id]) {

                                app_case = new comp.constructor(templates, presets, component, DOM);

                                if (comp.model_name && Model_Constructors[comp.model_name]) {
                                    var model = Model_Constructors[comp.model_name];
                                    if (model.getter)
                                        model.getter.get();
                                    model.addView(app_case);
                                }

                                app_case.id = id;

                                App_Components[id] = app_case;
                            } else {
                                var template = templates[id];

                                if (template) {
                                    app_case = CaseConstructor(template, presets, DOM)(); //new CaseComponent(template, presets, Model_Constructors, null, DOM);
                                } else {
                                    let constructor = CaseConstructor(component, presets, DOM);

                                    if (!constructor)
                                        constructor = CaseConstructor(component.children[0], presets, DOM);
                                    if (!constructor)
                                        app_case = new BasicCase(component);
                                    else
                                        app_case = constructor();
                                }
                            }

                            if (!app_case) {
                                console.warn("App Component not constructed");
                                /** TODO: If there is a fallback <no-script> section use that instead. */
                                app_case = new FailedCase();
                            } else {
                                App_Components[id] = app_case;
                            }
                        } else {
                            app_case = App_Components[id];
                        }

                        app_case.handleUrlUpdate(wurl);
                    }
                } catch (e) {
                    console.log(e);
                    app_case = new FailedCase(e, presets);
                }

                this.components.push(app_case);
            }
        }
    }

    let URL_HOST = {
        wurl: null
    };
    let URL = (function() {

                return {
                    /**
                        Changes the URL to the one provided, prompts page update. overwrites current URL.
                    */
                    set: function(a, b, c) {
                        if (URL_HOST.wurl)
                            URL_HOST.wurl.set(a, b, c);
                    },
                    /**
                                Returns a Query entry if it exists in the query string. 
                            */
                    get: function(a, b) {
                        if (URL_HOST.wurl)
                            return URL_HOST.wurl.set(a, b);
                        return null;
                    },
                    /**
                                Changes the URL state to the one provided and prompts the Browser to respond o the change. 
                            */
                    goto: function(a, b) {
                            history.pushState({}, "ignored title", `${a}${ ((b) ? `?${TurnDataIntoQuery(b)}` : "") }`);
                window.onpopstate();
            }
        }
    })();

    function getModalContainer() {
        let modal_container = document.getElementsByTagName("modals")[0];

        if (!modal_container) {

            modal_container = document.createElement("modals");

            var dom_app = document.getElementsByTagName("app")[0];

            if (dom_app)
                dom_app.parentElement.insertBefore(modal_container, dom_app);
            else
                document.body.appendChild(modal_container);
        }

        return modal_container
    }

    /** @namespace linker */

    /**
     *  Responsible for loading pages and presenting them in the main DOM.
     */
    class Linker {
        /**
         *  This (inker.Linker) is responsible for loading pages dynamically, handling the transition of page components, and monitoring and reacting to URL changes
         *
         *
         *  @param {LinkerPresets} presets - A preset based object that will be used by Wick for handling custom components. Is validated according to the definition of a LinkerPreset
         */
        constructor(presets) {
            this.pages = {};
            this.components = {};
            this.component_constructors = {};
            this.models_constructors = {};
            this.presets = presets;
            this.current_url = null;
            this.current_query;
            this.current_view = null;
            this.finalizing_pages = [];

            GLOBAL.linker = this;

            /*
              The static field in presets are all Component-like objects contructors that are defined by the client
              to be used by Wick for custom components.

              The constructors must support several Component based methods in ordered ot be accepted for use. These methodes include:
                transitionIn
                transitionOut
                setModel
                unsetModel
            */
            if (presets.static) {
                for (let component_name in presets.static) {

                    let component = presets.static[component_name];

                    let a = 0,
                        b = 0,
                        c = 0,
                        d = 0;

                    if ((a = (component.prototype.transitionIn && component.prototype.transitionIn instanceof Function)) &&
                        (b = (component.prototype.transitionOut && component.prototype.transitionOut instanceof Function)) &&
                        (c = (component.prototype.setModel && component.prototype.setModel instanceof Function)) &&
                        (d = (component.prototype.unsetModel && component.prototype.unsetModel instanceof Function)))
                        this.addStatic(component_name, component);
                    else
                        console.warn(`Static component ${component_name} lacks correct component methods, \nHas transitionIn function:${a}\nHas transitionOut functon:${b}\nHas set model function:${c}\nHas unsetModel function:${d}`);
                }
            }

            /** TODO
                @define PageParser

                A page parser will parse templates before passing that data to the Case handler.
            */
            if (presets.parser) {
                for (let parser_name in presets.page_parser) {
                    let parser = presets.page_parser[parser_name];
                }
            }

            /**
                Schemas provide the constructors for models
            */
            if (presets.schemas) {

                presets.schemas.any = AnyModel;

            } else {
                presets.schemas = {
                    any : AnyModel
                };
            }

            /**
                Modals are the global models that can be accessed by any Case
            */
            if (presets.models) ; else {
                presets.models = {};
            }

            /**
              TODO Validate that every schama is a Model constructor
            */

            /* */
            this.modal_stack = [];

            window.onpopstate = () => {
                this.parseURL(document.location);
            };
        }

        /*
            This function will parse a URL and determine what Page needs to be loaded into the current view.
        */
        parseURL(location) {

            let url = location.pathname;

            let IS_SAME_PAGE = (this.current_url == url),
                page = null,
                wurl = new WURL(location);

            this.current_url = url;

            if ((page = this.pages[url])) {
                if (IS_SAME_PAGE) {
                    URL_HOST.wurl = wurl;

                    return page.transitionIn(
                        (page.type == "modal") ? getModalContainer() : document.getElementsByTagName("app")[0], 
                        null, wurl, IS_SAME_PAGE);
                }
                return this.loadPage(page, wurl, IS_SAME_PAGE);
            }

            if (location)
                fetch(location.href, {
                    credentials: "same-origin", // Sends cookies back to server with request
                    method: 'GET'
                }).then((response) => {
                    (response.text().then((html) => {
                        var DOM = (new DOMParser()).parseFromString(html, "text/html");
                        this.loadPage(
                            this.loadNewPage(url, DOM, wurl),
                            wurl,
                            IS_SAME_PAGE
                        );
                    }));
                }).catch((error) => {
                    console.warn(`Unable to process response for request made to: ${this.url}. Response: ${error}. Error Received: ${error}`);
                });
        }

        finalizePages() {

            if(this.armed){
                let a = this.armed;
              //  a.p.transitionIn(a.e, this.current_view, a.wurl, a.SP, a.te);
                this.armed = null;
            }
            
            for (var i = 0, l = this.finalizing_pages.length; i < l; i++) {
                
                var page = this.finalizing_pages[i];
                page.finalize();
            }

            this.finalizing_pages.length = 0;
        }

        /**
            Loads pages from server, or from local cache, and sends it to the page parser.

          @param {string} url - The URL id of the cached page to load.
          @param {string} query -
          @param {Bool} IS_SAME_PAGE -
        */
        loadPage(page, wurl = new WURL(document.location), IS_SAME_PAGE) {


            URL_HOST.wurl = wurl;

            let transition_length = 0;

            let app_ele = document.getElementsByTagName("app")[0];

            //Finalize any existing page transitions;
            // this.finalizePages();

            let transition_elements = {};

            if (page.type == "modal") {
                
                //trace modal stack and see if the modal already exists
                if (IS_SAME_PAGE) {
                    page.transitionIn();
                    return;
                }

                let UNWIND = 0;

                for (var i = 0, l = this.modal_stack.length; i < l; i++) {
                    let modal = this.modal_stack[i];

                    if (UNWIND == 0) {
                        if (modal == page) {
                            UNWIND = i + 1;
                        }
                    } else {
                        let trs = 0;
                        modal.unload();

                        if (trs = modal.transitionOut()) {
                            transition_length = Math.max(trs, transition_length);
                            this.finalizing_pages.push(modal);
                        } else 
                            modal.finalize();
                    }
                }

                if (UNWIND > 0) {
                    this.modal_stack.length = UNWIND;
                    page.load(getModalContainer(), wurl);
                    page.transitionIn();
                } else {
                    //create new modal
                    this.modal_stack.push(page);
                    page.load(getModalContainer(), wurl);
                    page.transitionIn();
                }

            } else {

                for (var i = 0, l = this.modal_stack.length; i < l; i++) {
                    let modal = this.modal_stack[i];
                    let trs = 0;
                    
                    modal.unload();

                    if (trs = modal.transitionOut()) {
                        transition_length = Math.max(trs, transition_length);
                        this.finalizing_pages.push(modal);
                    } else 
                        modal.finalize();
                    
                }

                this.modal_stack.length = 0;


                if (this.current_view && this.current_view != page) {
                    this.current_view.unload(transition_elements);
                    
                    page.load(app_ele, wurl);
                   
                    let t = this.current_view.transitionOut();
                    
                    window.requestAnimationFrame(()=>{
                        page.transitionIn(transition_elements);
                    });

                    transition_length = Math.max(t, transition_length);
                    
                    this.finalizing_pages.push(this.current_view);
                } else if(!this.current_view){
                    page.load(app_ele, wurl);

                    window.requestAnimationFrame(()=>{
                        page.transitionIn(transition_elements);
                    });
                }

                this.current_view = page;
            }

            setTimeout(() => {
                this.finalizePages();
            }, (transition_length*1000) + 1);
        }

        /**
            Pre-loads a custom constructor for an element with the specified id and provides a model to that constructor when it is called.
            The constructor must have Component in its inheritance chain.
        */
        addStatic(element_id, constructor, model) {
            this.component_constructors[element_id] = {
                constructor,
                model_name: model
            };

        }

        addModel(model_name, modelConstructor) {
            this.models_constructors[model_name] = modelConstructor;
        }
        /**
            Creates a new iframe object that acts as a modal that will sit ontop of everything else.
        */
        loadNonWickPage(URL) {
            let iframe = document.createElement("iframe");
            iframe.src = URL;
            iframe.classList.add("modal", "comp_wrap");
            var page = new PageView(URL, iframe);
            page.type = "modal";
            this.pages[URL] = page; //new Modal(page, iframe, getModalContainer());
            return this.pages[URL];
        }
        /**
            Takes the DOM of another page and strips it, looking for component and app elements to use to integrate into the SPA system.
            If it is unable to find these elements, then it will pass the DOM to loadNonWickPage to handle wrapping the page body into a wick app element.
        */
        loadNewPage(URL, DOM, wurl) {
            //look for the app section.

            /**
                If the page should not be reused, as in cases where the server does all the rendering for a dynamic page and we're just presenting the results,
                then having NO_BUFFER set to true will cause the linker to not save the page to the hashtable of existing pages, forcing a request to the server every time the page is visited.
            */
            let NO_BUFFER = false;


            /* 
                App elements: There should only be one. 
            */
            let app_list = DOM.getElementsByTagName("app");

            if (app_list.length > 1) {
                console.warn(`Wick is designed to work with just one <app> element in a page. There are ${app_list.length} apps elements in ${url}. Wick will proceed with the first <app> element in the DOM. Unexpected behavior may occur.`);
            }

            let app_source = app_list[0];

            /**
              If there is no <app> element within the DOM, then we must handle this case carefully. This likely indicates a page delivered from the same origin that has not been converted to work with the Wick system.
              The entire contents of the page can be wrapped into a <iframe>, that will be could set as a modal on top of existing pages.
            */
            if (!app_source) {
                console.trace("Page does not have an <app> element!");
                return this.loadNonWickPage(URL);
            }

            var app_page = document.createElement("apppage");
            app_page.innerHTML = app_source.innerHTML;

            var app = app_source.cloneNode(true);


            var dom_app = document.getElementsByTagName("app")[0];

            var page = new PageView(URL, app_page);
            if (app_source) {

                if (app_source.dataset.modal == "true") {
                    page.setType("modal");
                    let modal = document.createElement("modal");
                    modal.innerHTML = app.innerHTML;
                    app.innerHTML = "";
                    app = modal;

                    /*
                        If the DOM is the same element as the actual document, then we shall rebuild the existing <app> element, clearing it of it's contents.
                    */
                    if (DOM == document && dom_app) {
                        let new_app = document.createElement("app");
                        document.body.replaceChild(new_app, dom_app);
                        dom_app = new_app;
                    }
                }

                if (app.dataset.no_buffer == "true")
                    NO_BUFFER = true;

                var elements = app_page.getElementsByTagName("element");

                for (var i = 0; i < elements.length; i++) {

                    let ele = elements[i],
                        wick_element;


                    let element_id = ele.id;

                    if (page.type !== "modal") {

                        wick_element = new Element$1(ele);

                    } else {
                        let element = document.createElement("div");
                        element.innerHTML = ele.innerHTML;
                        element.classList.add("ele_wrap");

                        wick_element = new Element$1(ele);
                    }

                    page.elements.push(wick_element);

                    if (!this.components[element_id])
                        this.components[element_id] = {};

                    wick_element.setComponents(this.components[element_id], this.models_constructors, this.component_constructors, this.presets, DOM, wurl);
                }

                if (document == DOM)
                    dom_app.innerHTML = "";

                let result = page;

                if (!NO_BUFFER) this.pages[URL] = result;

                return result;

            }
        }
    }

    /**
    	Light it up!
    */

    let wick_vanity = "\ \(\ \ \(\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \)\n\ \)\\\)\)\(\ \ \ \'\ \(\ \ \ \ \ \ \ \ \ \ \(\ \/\(\n\(\(\_\)\(\)\\\ \)\ \ \)\\\ \ \ \ \(\ \ \ \ \)\\\(\)\)\n\_\(\(\)\)\\\_\)\(\)\(\(\_\)\ \ \ \)\\\ \ \(\(\_\)\\\n\\\ \\\(\(\_\)\/\ \/\ \(\_\)\ \ \(\(\_\)\ \|\ \|\(\_\)\n\ \\\ \\\/\\\/\ \/\ \ \|\ \|\ \/\ \_\|\ \ \|\ \/\ \/\n\ \ \\\_\/\\\_\/\ \ \ \|\_\|\ \\\_\_\|\ \ \|\_\\\_\\\n";

    let LINKER_LOADED = false;

    /**
     *    Creates a new {Linker} instance, passing any presets from the client.
     *    It will then wait for the document to load, and once loaded, will start the linker and load the current page into the linker.
     *
     *    Note: This function should only be called once. Any subsequent calls will not do anything.
     *
     *    @param {LinkerPresets} presets - An object of user defined Wick objects.
     */

    function light(presets) {
        console.log(presets);

        if (LINKER_LOADED) return;

        LINKER_LOADED = true;

        //Pass in the presets or a plain object if presets is undefined.

        let link = new Linker(presets || {});

        window.addEventListener("load", () => {
            link.loadPage(
                link.loadNewPage(document.location.pathname, document),
                new WURL(document.location),
                false
            );
        });

        console.log(`${wick_vanity}Copyright 2018 Anthony C Weathersby\nhttps://gitlab.com/anthonycweathersby/wick`);
    }

    exports.URL = URL;
    exports.Animation = animation;
    exports.ArrayModelContainer = ArrayModelContainer;
    exports.BTreeModelContainer = BTreeModelContainer;
    exports.MultiIndexedContainer = MultiIndexedContainer;
    exports.Controller = Controller;
    exports.CustomCase = CustomCase;
    exports.Rivet = Rivet;
    exports.CaseConstructor = CaseConstructor;
    exports.Cassette = Cassette;
    exports.Form = Form;
    exports.Filter = Filter;
    exports.Common = common;
    exports.Getter = Getter;
    exports.Linker = Linker;
    exports.Model = Model;
    exports.AnyModel = AnyModel;
    exports.ModelContainer = ModelContainer;
    exports.Setter = Setter;
    exports.View = View;
    exports.light = light;
    exports.SchemaType = SchemaType;
    exports.schema = schema;

    return exports;

}({}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ljay1kZXYuanMiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9jb21tb24vc3RyaW5nX3BhcnNpbmcvbGV4ZXIuanMiLCIuLi9zb3VyY2UvY29tbW9uL3N0cmluZ19wYXJzaW5nL3Rva2VuaXplci5qcyIsIi4uL3NvdXJjZS9jb21tb24vdXJsL3VybC5qcyIsIi4uL3NvdXJjZS9saW5rZXIvd3VybC5qcyIsIi4uL3NvdXJjZS92aWV3LmpzIiwiLi4vc291cmNlL3NjaGVkdWxlci5qcyIsIi4uL3NvdXJjZS9tb2RlbC9tb2RlbF9iYXNlLmpzIiwiLi4vc291cmNlL3NjaGVtYS9zY2hlbWFfdHlwZS5qcyIsIi4uL3NvdXJjZS9tb2RlbC9tb2RlbF9jb250YWluZXIuanMiLCIuLi9zb3VyY2UvbW9kZWwvYXJyYXlfY29udGFpbmVyLmpzIiwiLi4vc291cmNlL21vZGVsL2J0cmVlX2NvbnRhaW5lci5qcyIsIi4uL3NvdXJjZS9zY2hlbWEvbnVtYmVyX3R5cGUuanMiLCIuLi9zb3VyY2UvY29tbW9uL2RhdGVfdGltZS9tb250aHMuanMiLCIuLi9zb3VyY2UvY29tbW9uL2RhdGVfdGltZS9kYXlzX29mX3dlZWsuanMiLCIuLi9zb3VyY2UvY29tbW9uL2RhdGVfdGltZS9kYXlfc3RhcnRfYW5kX2VuZF9lcG9jaC5qcyIsIi4uL3NvdXJjZS9jb21tb24vZGF0ZV90aW1lL3RpbWUuanMiLCIuLi9zb3VyY2UvY29tbW9uL21hdGgvcG9pbnQyRC5qcyIsIi4uL3NvdXJjZS9jb21tb24vbWF0aC9xdWFkcmF0aWNfYmV6aWVyLmpzIiwiLi4vc291cmNlL2NvbW1vbi9tYXRoL2NvbnN0cy5qcyIsIi4uL3NvdXJjZS9jb21tb24vbWF0aC9jdWJpY19iZXppZXIuanMiLCIuLi9zb3VyY2UvY29tbW9uL2V2ZW50L3RvdWNoX3Njcm9sbGVyLmpzIiwiLi4vc291cmNlL2NvbW1vbi5qcyIsIi4uL3NvdXJjZS9zY2hlbWEvZGF0ZV90eXBlLmpzIiwiLi4vc291cmNlL3NjaGVtYS90aW1lX3R5cGUuanMiLCIuLi9zb3VyY2Uvc2NoZW1hL3N0cmluZ190eXBlLmpzIiwiLi4vc291cmNlL3NjaGVtYS9ib29sX3R5cGUuanMiLCIuLi9zb3VyY2Uvc2NoZW1hL3NjaGVtYXMuanMiLCIuLi9zb3VyY2UvbW9kZWwvbW9kZWwuanMiLCIuLi9zb3VyY2UvY29udHJvbGxlci5qcyIsIi4uL3NvdXJjZS9nZXR0ZXIuanMiLCIuLi9zb3VyY2Uvc2V0dGVyLmpzIiwiLi4vc291cmNlL2xpbmtlci9wYWdlLmpzIiwiLi4vc291cmNlL2xpbmtlci9zZXRsaW5rcy5qcyIsIi4uL3NvdXJjZS9hbmltYXRpb24vY29sb3IuanMiLCIuLi9zb3VyY2UvYW5pbWF0aW9uL3RyYW5zZm9ybXRvLmpzIiwiLi4vc291cmNlL2FuaW1hdGlvbi9hbmltYXRpb24uanMiLCIuLi9zb3VyY2UvYW5pbWF0aW9uL3RyYW5zaXRpb24vdHJhbnNpdGlvbmVlci5qcyIsIi4uL3NvdXJjZS9jYXNlL3JpdmV0LmpzIiwiLi4vc291cmNlL2xpbmtlci9jb21wb25lbnQuanMiLCIuLi9zb3VyY2UvY2FzZS9jYXNzZXR0ZS9jYXNzZXR0ZS5qcyIsIi4uL3NvdXJjZS9jYXNlL2Nhc2UuanMiLCIuLi9zb3VyY2UvY2FzZS9jYXNzZXR0ZS9maWx0ZXIuanMiLCIuLi9zb3VyY2UvY2FzZS9jYXNlX3RlbXBsYXRlLmpzIiwiLi4vc291cmNlL2Nhc2UvY2FzZV9za2VsZXRvbi5qcyIsIi4uL3NvdXJjZS9nbG9iYWwuanMiLCIuLi9zb3VyY2UvY2FzZS9jYXNzZXR0ZS9pbnB1dC5qcyIsIi4uL3NvdXJjZS9jYXNlL2Nhc3NldHRlL2Zvcm0uanMiLCIuLi9zb3VyY2UvY2FzZS90YXBzL3RhcC5qcyIsIi4uL3NvdXJjZS9jYXNlL3BpcGVzL3BpcGUuanMiLCIuLi9zb3VyY2UvY2FzZS9pby9pby5qcyIsIi4uL3NvdXJjZS9jYXNlL2Nhc2VfY29uc3RydWN0b3JfYXN0LmpzIiwiLi4vc291cmNlL2Nhc2UvY2FzZV9jb25zdHJ1Y3Rvci5qcyIsIi4uL3NvdXJjZS9saW5rZXIvZWxlbWVudC5qcyIsIi4uL3NvdXJjZS9saW5rZXIvbGlua2VyLmpzIiwiLi4vc291cmNlL3dpY2suanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIG51bGxfdG9rZW4gPSB7XHJcbiAgICB0eXBlOiBcIlwiLFxyXG4gICAgdGV4dDogXCJcIlxyXG59O1xyXG5cclxuY2xhc3MgTGV4ZXIge1xyXG4gICAgY29uc3RydWN0b3IodG9rZW5pemVyKSB7XHJcbiAgICAgICAgdGhpcy50ayA9IHRva2VuaXplcjtcclxuXHJcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuaXplci5uZXh0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuaG9sZCA9IG51bGw7XHJcblxyXG4gICAgICAgIHdoaWxlICh0aGlzLnRva2VuICYmICh0aGlzLnRva2VuLnR5cGUgPT09IFwibmV3X2xpbmVcIiB8fCB0aGlzLnRva2VuLnR5cGUgPT09IFwid2hpdGVfc3BhY2VcIiB8fCB0aGlzLnRva2VuLnR5cGUgPT09IFwiZ2VuZXJpY1wiKSkge1xyXG4gICAgICAgICAgICB0aGlzLnRva2VuID0gdGhpcy50ay5uZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0KCl7XHJcbiAgICAgICAgdGhpcy50ay5yZXNldCgpO1xyXG4gICAgICAgIHRoaXMudG9rZW4gPSB0aGlzLnRrLm5leHQoKTtcclxuICAgICAgICB0aGlzLmhvbGQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaG9sZCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRva2VuID0gdGhpcy5ob2xkO1xyXG4gICAgICAgICAgICB0aGlzLmhvbGQgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy50b2tlbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICB0aGlzLnRva2VuID0gdGhpcy50ay5uZXh0KCk7XHJcbiAgICAgICAgfSB3aGlsZSAodGhpcy50b2tlbiAmJiAodGhpcy50b2tlbi50eXBlID09PSBcIm5ld19saW5lXCIgfHwgdGhpcy50b2tlbi50eXBlID09PSBcIndoaXRlX3NwYWNlXCIgfHwgdGhpcy50b2tlbi50eXBlID09PSBcImdlbmVyaWNcIikpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50b2tlbikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgYXNzZXJ0KHRleHQpIHtcclxuICAgICAgICBpZiAoIXRoaXMudG9rZW4pIHRocm93IG5ldyBFcnJvcihgRXhwZWN0aW5nICR7dGV4dH0gZ290IG51bGxgKTtcclxuXHJcbiAgICAgICAgdmFyIGJvb2wgPSB0aGlzLnRva2VuLnRleHQgPT0gdGV4dDtcclxuXHJcblxyXG4gICAgICAgIGlmIChib29sKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGluZyBcIiR7dGV4dH1cIiBnb3QgXCIke3RoaXMudG9rZW4udGV4dH1cImApXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYm9vbDtcclxuICAgIH1cclxuXHJcbiAgICBwZWVrKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhvbGQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaG9sZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaG9sZCA9IHRoaXMudGsubmV4dCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaG9sZCkgcmV0dXJuIG51bGxfdG9rZW47XHJcblxyXG4gICAgICAgIHdoaWxlICh0aGlzLmhvbGQgJiYgKHRoaXMuaG9sZC50eXBlID09PSBcIm5ld19saW5lXCIgfHwgdGhpcy5ob2xkLnR5cGUgPT09IFwid2hpdGVfc3BhY2VcIiB8fCB0aGlzLmhvbGQudHlwZSA9PT0gXCJnZW5lcmljXCIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaG9sZCA9IHRoaXMudGsubmV4dCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaG9sZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ob2xkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGxfdG9rZW47XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHRleHQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudG9rZW4pXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VuLnRleHQ7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHR5cGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudG9rZW4pXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VuLnR5cGU7XHJcbiAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHBvcygpe1xyXG4gICAgICAgIGlmICh0aGlzLnRva2VuKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbi5wb3M7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuICAgIHNsaWNlKHN0YXJ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMudG9rZW4pXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRrLnN0cmluZy5zbGljZShzdGFydCwgdGhpcy50b2tlbi5wb3MpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGsuc3RyaW5nLnNsaWNlKHN0YXJ0KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBMZXhlciB9IiwiLy9Db21wYXJlcyBjb2RlIHdpdGggYXJndW1lbnQgbGlzdCBhbmQgcmV0dXJucyB0cnVlIGlmIG1hdGNoIGlzIGZvdW5kLCBvdGhlcndpc2UgZmFsc2UgaXMgcmV0dXJuZWRcclxuZnVuY3Rpb24gY29tcGFyZUNvZGUoY29kZSkge1xyXG4gICAgdmFyIGxpc3QgPSBhcmd1bWVudHM7XHJcbiAgICBmb3IgKHZhciBpID0gMSwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGxpc3RbaV0gPT09IGNvZGUpIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vL1JldHVybnMgdHJ1ZSBpZiBjb2RlIGxpZXMgYmV0d2VlbiB0aGUgb3RoZXIgdHdvIGFyZ3VtZW50c1xyXG5mdW5jdGlvbiBpblJhbmdlKGNvZGUpIHtcclxuICAgIHJldHVybiAoY29kZSA+IGFyZ3VtZW50c1sxXSAmJiBjb2RlIDwgYXJndW1lbnRzWzJdKTtcclxufVxyXG5cclxuLy9UaGUgcmVzdWx0aW5nIGFycmF5IGlzIHVzZWQgd2hpbGUgcGFyc2luZyBhbmQgdG9rZW5pemluZyB0b2tlbiBzdHJpbmdzXHJcbnZhciBzdHJpbmdfcGFyc2VfYW5kX2Zvcm1hdF9mdW5jdGlvbnMgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgYXJyYXkgPSBbe1xyXG4gICAgICAgICAgICB0eXBlOiBcIm51bWJlclwiLFxyXG4gICAgICAgICAgICAvL0luaXRpYWwgY2hlY2sgZnVuY3Rpb24uIFJldHVybiBpbmRleCBvZmZzZXQgdG8gc3RhcnQgZm9yIHNjYW4uIElmIDAgaXMgcmV0dXJuZWQgdGhlbiB0aGUgcGFyc2VyIHdpbGwgbW92ZSBvbiB0byB0aGUgbmV4dCBjaGVjayBmdW5jdGlvblxyXG4gICAgICAgICAgICBjaGVjayhjb2RlLCB0ZXh0LCBvZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpblJhbmdlKGNvZGUsIDQ3LCA1OCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2RlID0gdGV4dC5jaGFyQ29kZUF0KDEgKyBvZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wYXJlQ29kZShjb2RlLCA2NiwgOTgsIDg4LCAxMjAsIDc5LCAxMTEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29kZSA9PSA0Nikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvZGUgPSB0ZXh0LmNoYXJDb2RlQXQoMSArIG9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluUmFuZ2UoY29kZSwgNDcsIDU4KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGluUmFuZ2UoY29kZSwgNDcsIDU4KSB8fCBjb2RlID09PSA0NikgPyAtMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4uY29sb3IgPSBcInJnYigyMCw0MCwxODApXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcImlkZW50aWZpZXJcIixcclxuICAgICAgICAgICAgLy9Jbml0aWFsIGNoZWNrIGZ1bmN0aW9uLiBSZXR1cm4gaW5kZXggb2Zmc2V0IHRvIHN0YXJ0IGZvciBzY2FuLiBJZiAwIGlzIHJldHVybmVkIHRoZW4gdGhlIHBhcnNlciB3aWxsIG1vdmUgb24gdG8gdGhlIG5leHQgY2hlY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgY2hlY2soY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChpblJhbmdlKGNvZGUsIDY0LCA5MSkgfHwgaW5SYW5nZShjb2RlLCA5NiwgMTIzKSkgPyAxIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGluUmFuZ2UoY29kZSwgNDcsIDU4KSB8fCBpblJhbmdlKGNvZGUsIDY0LCA5MSkgfHwgaW5SYW5nZShjb2RlLCA5NiwgMTIzKSB8fCBjb21wYXJlQ29kZShjb2RlLCAzNSwgMzYsIDQ1LCA5NSkpID8gLTEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3Rva2VuLmNvbG9yID0gcmFuZG9tQ29sb3IoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LC8qIHtcclxuICAgICAgICAgICAgdHlwZTogXCJjb21tZW50XCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUsIHRleHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoKGNvZGUgPT09IDQ3KSAmJiAodGV4dC5jaGFyQ29kZUF0KDEpID09PSA0NykpID8gMiA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChpblJhbmdlKGNvZGUsIDMyLCAxMjgpIHx8IGNvZGUgPT09IDMyIHx8IGNvZGUgPT09IDkpID8gLTEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9rZW4pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwgKi97XHJcbiAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUsIHRleHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoY29kZSA9PT0gMzQpID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChjb2RlID09PSAzNCkgPyAxIDogLTE7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9rZW4pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcIndoaXRlX3NwYWNlXCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoY29kZSA9PT0gMzIgfHwgY29kZSA9PT0gOSkgPyAxIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGNvZGUgPT09IDMyIHx8IGNvZGUgPT09IDkpID8gLTEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9rZW4pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcIm5ld19saW5lXCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoY29kZSA9PT0gMTApID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0b2tlbilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJvcGVuX2JyYWNrZXRcIixcclxuICAgICAgICAgICAgLy9Jbml0aWFsIGNoZWNrIGZ1bmN0aW9uLiBSZXR1cm4gaW5kZXggb2Zmc2V0IHRvIHN0YXJ0IGZvciBzY2FuLiBJZiAwIGlzIHJldHVybmVkIHRoZW4gdGhlIHBhcnNlciB3aWxsIG1vdmUgb24gdG8gdGhlIG5leHQgY2hlY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgY2hlY2soY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmVDb2RlKGNvZGUsIDEyMywgNDAsIDkxKSA/IDEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIC8vU2luZ2xlIGNoYXJhY3RlciwgZW5kIGNvbWVzIGltbWVkaWF0bHlcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLmNvbG9yID0gXCJyZ2IoMTAwLDEwMCwxMDApXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcImNsb3NlX2JyYWNrZXRcIixcclxuICAgICAgICAgICAgLy9Jbml0aWFsIGNoZWNrIGZ1bmN0aW9uLiBSZXR1cm4gaW5kZXggb2Zmc2V0IHRvIHN0YXJ0IGZvciBzY2FuLiBJZiAwIGlzIHJldHVybmVkIHRoZW4gdGhlIHBhcnNlciB3aWxsIG1vdmUgb24gdG8gdGhlIG5leHQgY2hlY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgY2hlY2soY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmVDb2RlKGNvZGUsIDEyNSwgNDEsIDkzKSA/IDEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIC8vU2luZ2xlIGNoYXJhY3RlciwgZW5kIGNvbWVzIGltbWVkaWF0bHlcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLmNvbG9yID0gXCJyZ2IoMTAwLDEwMCwxMDApXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiBcIk9wZXJhdG9yXCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wYXJlQ29kZShjb2RlLCA0MiwgNDMsIDYwLCA2MSwgNjIsIDkyLCAzOCwgMzcsIDMzLCA5NCwgMTI0LCA1OCkgPyAxIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvL1NpbmdsZSBjaGFyYWN0ZXIsIGVuZCBjb21lcyBpbW1lZGlhdGx5XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi5jb2xvciA9IFwicmdiKDIwNSwxMjAsMClcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiU3ltYm9sXCIsIC8vRXZlcnl0aGluZyBlbHNlIHNob3VsZCBiZSBnZW5lcmljIHN5bWJvbHNcclxuICAgICAgICAgICAgY2hlY2soY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgLy9HZW5lcmljIHdpbGwgY2FwdHVyZSBBTlkgcmVtYWluZGVyIGNoYXJhY3RlciBzZXRzLlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4uY29sb3IgPSBcInJlZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXTtcclxuXHJcbiAgICAvL1RoaXMgYWxsb3dzIGZvciBjcmVhdGlvbiBjdXN0b20gcGFyc2VycyBhbmQgZm9ybWF0dGVycyBiYXNlZCB1cG9uIHRoaXMgb2JqZWN0LlxyXG4gICAgYXJyYXkuY2xvbmUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gc3RyaW5nX3BhcnNlX2FuZF9mb3JtYXRfZnVuY3Rpb25zKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBhcnJheTtcclxufSk7XHJcblxyXG52YXIgU1BGID0gc3RyaW5nX3BhcnNlX2FuZF9mb3JtYXRfZnVuY3Rpb25zKCk7XHJcbnZhciBTUEZfbGVuZ3RoID0gU1BGLmxlbmd0aDtcclxuXHJcbmNsYXNzIFRva2VuaXplciB7XHJcbiAgICBjb25zdHJ1Y3RvcihzdHJpbmcpIHtcclxuICAgIFx0dGhpcy5oID0gbnVsbDtcclxuXHQgICAgdGhpcy5saW5lID0gMDtcclxuXHQgICAgdGhpcy5jaGFyID0gMDtcclxuXHQgICAgdGhpcy5vZmZzZXQgPSAwO1xyXG5cdCAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpe1xyXG4gICAgICAgIHRoaXMubGluZSA9IDA7XHJcbiAgICAgICAgdGhpcy5jaGFyID0gMDtcclxuICAgICAgICB0aGlzLm9mZnNldCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgaG9sZCh0b2tlbikge1xyXG4gICAgICAgIHRoaXMuaCA9IHRva2VuO1xyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKSB7XHJcblxyXG4gICAgICAgIHZhciB0b2tlbl9sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5oKSB7XHJcbiAgICAgICAgICAgIHZhciB0ID0gdGhpcy5oO1xyXG4gICAgICAgICAgICB0aGlzLmggPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0cmluZy5sZW5ndGggPCAxKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IG9mZnNldCA9IHRoaXMub2Zmc2V0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChvZmZzZXQgPj0gdGhpcy5zdHJpbmcubGVuZ3RoKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgdmFyIGNvZGUgPSB0aGlzLnN0cmluZy5jaGFyQ29kZUF0KG9mZnNldCk7XHJcbiAgICAgICAgbGV0IFNQRl9mdW5jdGlvbjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IFNQRl9sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBTUEZfZnVuY3Rpb24gPSBTUEZbaV07XHJcbiAgICAgICAgICAgIGxldCB0ZXN0X2luZGV4ID0gU1BGX2Z1bmN0aW9uLmNoZWNrKGNvZGUsIHRoaXMuc3RyaW5nLCBvZmZzZXQpO1xyXG4gICAgICAgICAgICBpZiAodGVzdF9pbmRleCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9IFNQRl9mdW5jdGlvbi50eXBlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGUgPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gdGVzdF9pbmRleDsgaSA8IHRoaXMuc3RyaW5nLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZSA9IFNQRl9mdW5jdGlvbi5zY2FuVG9FbmQodGhpcy5zdHJpbmcuY2hhckNvZGVBdChpICsgb2Zmc2V0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgPiAtMSkgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0b2tlbl9sZW5ndGggPSBpICsgZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdGVtcCA9IHRoaXMuc3RyaW5nLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgdG9rZW5fbGVuZ3RoKTtcclxuXHJcbiAgICAgICAgaWYgKFNQRl9mdW5jdGlvbi50eXBlID09PSBcIm5ld19saW5lXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFyID0gMDtcclxuICAgICAgICAgICAgdGhpcy5saW5lKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgb3V0ID0ge1xyXG4gICAgICAgICAgICB0eXBlOiBTUEZfZnVuY3Rpb24udHlwZSxcclxuICAgICAgICAgICAgdGV4dDogdGVtcCxcclxuICAgICAgICAgICAgcG9zOiB0aGlzLm9mZnNldCxcclxuICAgICAgICAgICAgbGVuZ3RoOiB0b2tlbl9sZW5ndGgsXHJcbiAgICAgICAgICAgIGNoYXI6IHRoaXMuY2hhcixcclxuICAgICAgICAgICAgbGluZTogdGhpcy5saW5lXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vZmZzZXQgKz0gdG9rZW5fbGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuY2hhciArPSB0b2tlbl9sZW5ndGg7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7VG9rZW5pemVyfVxyXG4iLCJpbXBvcnQge0xleGVyfSBmcm9tIFwiLi4vc3RyaW5nX3BhcnNpbmcvbGV4ZXJcIlxyXG5pbXBvcnQge1Rva2VuaXplcn0gZnJvbSBcIi4uL3N0cmluZ19wYXJzaW5nL3Rva2VuaXplclwiXHJcblxyXG4vKipcclxuVVJMIFF1ZXJ5IFN5bnRheFxyXG5cclxucm9vdCA9PiBbcm9vdF9jbGFzc10gWyYgW2NsYXNzZXNdXVxyXG4gICAgID0+IFtjbGFzc2VzXVxyXG5cclxucm9vdF9jbGFzcyA9IGtleV9saXN0XHJcblxyXG5jbGFzc19saXN0IFtjbGFzcyBbJiBjbGFzc19saXN0XV1cclxuXHJcbmNsYXNzID0+IG5hbWUgJiBrZXlfbGlzdFxyXG5cclxua2V5X2xpc3QgPT4gW2tleV92YWwgWyYga2V5X2xpc3RdXVxyXG5cclxua2V5X3ZhbCA9PiBuYW1lID0gdmFsXHJcblxyXG5uYW1lID0+IEFMUEhBTlVNRVJJQ19JRFxyXG5cclxudmFsID0+IE5VTUJFUlxyXG4gICAgPT4gQUxQSEFOVU1FUklDX0lEXHJcbiovXHJcbmZ1bmN0aW9uIFF1ZXJ5U3RyaW5nVG9RdWVyeU1hcChxdWVyeSl7XHJcblxyXG4gIGxldCBtYXBwZWRfb2JqZWN0ID0gbmV3IE1hcDtcclxuXHJcbiAgaWYoIXF1ZXJ5IGluc3RhbmNlb2YgU3RyaW5nKXtcclxuICAgIGNvbnNvbGUud2FybihcInF1ZXJ5IGFyZ3VtZW50IHByb3ZpZGVkIGlzIG5vdCBhIHN0cmluZyFcIilcclxuICAgIHJldHVybiBtYXBwZWRfb2JqZWN0O1xyXG4gIH1cclxuXHJcbiAgaWYocXVlcnlbMF0gPT0gXCI/XCIpIHF1ZXJ5ID0gcXVlcnkuc2xpY2UoMSk7XHJcblxyXG4gIGxldCBsZXggPSBuZXcgTGV4ZXIobmV3IFRva2VuaXplcihxdWVyeSkpO1xyXG5cclxuICBmdW5jdGlvbiBrZXlfdmFsX2xpc3QobGV4LCBtYXApe1xyXG4gICAgbGV0IHRva2VuO1xyXG4gICAgd2hpbGUoKHRva2VuID0gbGV4LnRva2VuKSAmJiB0b2tlbi50ZXh0ICE9PSBcIiZcIil7XHJcbiAgICAgIGlmKGxleC5wZWVrKCkudGV4dCA9PSBcIj1cIil7XHJcbiAgICAgICAgbGV0IGtleSA9IHRva2VuLnRleHQ7XHJcbiAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgIGxldCB2YWwgPSBsZXgudG9rZW47XHJcbiAgICAgICAgbWFwLnNldChrZXksICh2YWwudHlwZSA9PSBcIm51bWJlclwiKT9wYXJzZUZsb2F0KHZhbC50ZXh0KTp2YWwudGV4dCk7XHJcbiAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNsYXNzXyhsZXgsIG1hcCl7XHJcblxyXG4gICAgbGV0IHRva2VuO1xyXG5cclxuICAgIGlmKCh0b2tlbiA9IGxleC5wZWVrKCkpICYmIHRva2VuLnRleHQgPT0gXCImXCIpe1xyXG5cclxuICAgICAgdG9rZW4gPSBsZXgudG9rZW47XHJcblxyXG4gICAgICBsZXgubmV4dCgpO2xleC5uZXh0KCk7XHJcbiAgICAgIG1hcC5zZXQodG9rZW4udGV4dCwgbmV3IE1hcCgpKTtcclxuICAgICAga2V5X3ZhbF9saXN0KGxleCxtYXAuZ2V0KHRva2VuLnRleHQpKTtcclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJvb3QobGV4LG1hcCl7XHJcbiAgICAgICBtYXAuc2V0KG51bGwsIG5ldyBNYXAoKSk7XHJcblxyXG4gICAgICBpZihsZXgucGVlaygpLnRleHQgPT0gXCImXCIpe1xyXG4gICAgICAgICAgY2xhc3NfKGxleCwgbWFwKVxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAgIGtleV92YWxfbGlzdChsZXgsIG1hcC5nZXQobnVsbCkpO1xyXG4gICAgICB9XHJcblxyXG5cclxuXHJcbiAgICB3aGlsZShsZXgudG9rZW4gJiYgbGV4LnRva2VuLnRleHQgPT1cIiZcIil7XHJcbiAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgIGNsYXNzXyhsZXgsIG1hcClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJvb3QobGV4LCBtYXBwZWRfb2JqZWN0KTtcclxuICByZXR1cm4gbWFwcGVkX29iamVjdDtcclxufVxyXG5cclxuZnVuY3Rpb24gUXVlcnlNYXBUb1F1ZXJ5U3RyaW5nKG1hcCl7XHJcbiAgICBsZXQgY2xhc3NfLCBudWxsX2NsYXNzLHN0ciA9XCJcIjtcclxuICAgIGlmKChudWxsX2NsYXNzID0gbWFwLmdldChudWxsKSkpe1xyXG4gICAgICAgIGlmKG51bGxfY2xhc3MubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgW2tleSx2YWxdIG9mIG51bGxfY2xhc3MuZW50cmllcygpKXtcclxuICAgICAgICAgICAgICAgIHN0ciArPSBgJiR7a2V5fT0ke3ZhbH1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgW2tleSxjbGFzc19dIG9mIG1hcC5lbnRyaWVzKCkpe1xyXG4gICAgICAgICAgICBpZihrZXkgPT0gbnVsbCkgY29udGludWU7XHJcbiAgICAgICAgICAgIHN0ciArPSBgJiR7a2V5fWBcclxuICAgICAgICAgICAgZm9yKGxldCBba2V5LHZhbF0gb2YgY2xhc3NfLmVudHJpZXMoKSl7XHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gYCYke2tleX09JHt2YWx9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RyLnNsaWNlKDEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0cjtcclxufVxyXG5mdW5jdGlvbiBUdXJuRGF0YUludG9RdWVyeShkYXRhKSB7XHJcbiAgICB2YXIgc3RyID0gXCJcIjtcclxuXHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZGF0YSA9IGFyZ3VtZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXRhLmNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld19zdHIgPSBgJHtkYXRhLmNvbXBvbmVudH0mYDtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhIGluIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3X3N0ciArPSAoYSAhPSBcImNvbXBvbmVudFwiKSA/IGAke2F9PSR7ZGF0YVthXX1cXCZgIDogXCJcIjtcclxuXHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gbmV3X3N0ci5zbGljZSgwLCAtMSkgKyBcIi5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIGVsc2VcclxuICAgICAgICBmb3IgKHZhciBhIGluIGRhdGEpXHJcbiAgICAgICAgICAgIHN0ciArPSBgJHthfT0ke2RhdGFbYV19XFwmYDtcclxuXHJcbiAgICByZXR1cm4gc3RyLnNsaWNlKDAsIC0xKTtcclxufVxyXG5cclxuZnVuY3Rpb24gVHVyblF1ZXJ5SW50b0RhdGEocXVlcnkpIHtcclxuICAgIHZhciBvdXQgPSB7fTtcclxuXHJcbiAgICBsZXQgdCA9IHF1ZXJ5LnNwbGl0KFwiLlwiKTtcclxuXHJcbiAgICBpZiAodC5sZW5ndGggPiAwKVxyXG4gICAgICAgIHQuZm9yRWFjaCgoYSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgdCA9IHt9O1xyXG4gICAgICAgICAgICBpZiAoYS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBhLnNwbGl0KFwiJlwiKS5mb3JFYWNoKChhLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCAxKSBvdXRbYV0gPSB0O1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYiA9IGEuc3BsaXQoXCI9XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRbYlswXV0gPSBiWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcXVlcnkuc3BsaXQoXCImXCIpLmZvckVhY2goKGEpID0+IHtcclxuICAgICAgICAgICAgbGV0IGIgPSBhLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgb3V0W2JbMF1dID0gYlsxXVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmV0dXJuIG91dDtcclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFR1cm5RdWVyeUludG9EYXRhLFxyXG4gICAgVHVybkRhdGFJbnRvUXVlcnksXHJcbiAgICBRdWVyeU1hcFRvUXVlcnlTdHJpbmcsXHJcbiAgICBRdWVyeVN0cmluZ1RvUXVlcnlNYXBcclxufVxyXG4iLCJpbXBvcnQge1xyXG4gICAgVHVyblF1ZXJ5SW50b0RhdGEsXHJcbiAgICBUdXJuRGF0YUludG9RdWVyeSxcclxuICAgIFF1ZXJ5U3RyaW5nVG9RdWVyeU1hcCxcclxuICAgIFF1ZXJ5TWFwVG9RdWVyeVN0cmluZ1xyXG59IGZyb20gXCIuLi9jb21tb24vdXJsL3VybFwiXHJcblxyXG5jbGFzcyBXVVJMIHtcclxuICAgIGNvbnN0cnVjdG9yKGxvY2F0aW9uKXtcclxuICAgICAgICAvL3BhcnNlIHRoZSB1cmwgaW50byBkaWZmZXJlbnQgc2VjdGlvbnNcclxuICAgICAgICB0aGlzLnBhdGggPSBsb2NhdGlvbi5wYXRobmFtZTtcclxuICAgICAgICB0aGlzLmhvc3QgPSBsb2NhdGlvbi5ob3N0bmFtZTtcclxuICAgICAgICB0aGlzLnF1ZXJ5ID0gUXVlcnlTdHJpbmdUb1F1ZXJ5TWFwKGxvY2F0aW9uLnNlYXJjaC5zbGljZSgxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UGF0aChwYXRoKXtcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgICAgIHRoaXMuc2V0TG9jYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMb2NhdGlvbigpe1xyXG4gICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKHt9LFwicmVwbGFjZWQgc3RhdGVcIixgJHt0aGlzfWApO1xyXG4gICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gYCR7dGhpcy5wYXRofT8ke1F1ZXJ5TWFwVG9RdWVyeVN0cmluZyh0aGlzLnF1ZXJ5KX1gO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENsYXNzKGNsYXNzX25hbWUpe1xyXG5cclxuICAgICAgICBpZighY2xhc3NfbmFtZSkgY2xhc3NfbmFtZSA9IG51bGw7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG91dCA9IHt9LCBjbGFzc187XHJcblxyXG4gICAgICAgIGlmKGNsYXNzXyA9IHRoaXMucXVlcnkuZ2V0KGNsYXNzX25hbWUpKXtcclxuICAgICAgICAgICAgZm9yKGxldCBba2V5LCB2YWxdIG9mIGNsYXNzXy5lbnRyaWVzKCkpe1xyXG4gICAgICAgICAgICAgICAgb3V0W2tleV0gPSB2YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0KGNsYXNzX25hbWUsIGtleV9uYW1lLCB2YWx1ZSl7XHJcblxyXG4gICAgICAgIGlmKCFjbGFzc19uYW1lKSBjbGFzc19uYW1lID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYoIXRoaXMucXVlcnkuaGFzKGNsYXNzX25hbWUpKSB0aGlzLnF1ZXJ5LnNldChjbGFzc19uYW1lLCBuZXcgTWFwKCkpO1xyXG5cclxuICAgICAgICBsZXQgY2xhc3NfID0gdGhpcy5xdWVyeS5nZXQoY2xhc3NfbmFtZSk7XHJcblxyXG4gICAgICAgIGNsYXNzXy5zZXQoa2V5X25hbWUsIHZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRMb2NhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChjbGFzc19uYW1lLCBrZXlfbmFtZSl7XHJcbiAgICAgICAgaWYoIWNsYXNzX25hbWUpIGNsYXNzX25hbWUgPSBudWxsO1xyXG5cclxuICAgICAgICBsZXQgY2xhc3NfID0gdGhpcy5xdWVyeS5nZXQoY2xhc3NfbmFtZSk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gKGNsYXNzXykgPyBjbGFzc18uZ2V0KGtleV9uYW1lKSA6IG51bGw7ICBcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5leHBvcnQge1xyXG4gICAgV1VSTFxyXG59XHJcbiIsIi8vVXBkYXRlcyBVSVxyXG4vL1VwZGF0ZWQgQnkgTW9kZWxcclxuXHJcbmNsYXNzIFZpZXd7XHJcblx0Y29uc3RydWN0b3IoKXtcclxuXHRcdHRoaXMubmV4dCA9IG51bGw7XHJcblx0XHR0aGlzLm1vZGVsID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdGRlc3RydWN0b3IoKXtcclxuXHRcdGlmKHRoaXMubW9kZWwpe1xyXG5cdFx0XHR0aGlzLm1vZGVsLnJlbW92ZVZpZXcodGhpcyk7XHJcblx0XHR9XHJcblx0fVx0XHJcblx0LyoqXHJcblx0XHRDYWxsZWQgYSBNb2RlbCB3aGVuIGl0cyBkYXRhIGhhcyBjaGFuZ2VkLlxyXG5cdCovXHJcblx0dXBkYXRlKGRhdGEpe1xyXG5cclxuXHR9XHJcblx0LyoqXHJcblx0XHRDYWxsZWQgYnkgYSBNb2RlbENvbnRhaW5lciB3aGVuIGFuIGl0ZW0gaGFzIGJlZW4gcmVtb3ZlZC5cclxuXHQqL1xyXG5cdHJlbW92ZWQoZGF0YSl7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0XHRDYWxsZWQgYnkgYSBNb2RlbENvbnRhaW5lciB3aGVuIGFuIGl0ZW0gaGFzIGJlZW4gYWRkZWQuXHJcblx0Ki9cclxuXHRhZGRlZChkYXRhKXtcclxuXHJcblx0fVxyXG5cdHNldE1vZGVsKG1vZGVsKXtcclxuXHR9XHJcblxyXG5cdHJlc2V0KCl7XHJcblx0XHRcclxuXHR9XHJcblx0dW5zZXRNb2RlbCgpe1xyXG5cdFx0dGhpcy5uZXh0ID0gbnVsbDtcclxuXHRcdHRoaXMubW9kZWwgPSBudWxsO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0e1ZpZXd9IiwiY29uc3QgY2FsbGVyID0gKHdpbmRvdyAmJiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSA/IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgOiAoZikgPT4ge1xyXG4gICAgc2V0VGltZW91dChmLCAxKVxyXG59O1xyXG4vKiogXHJcbiAgICBUaGUgU2NoZWR1bGVyIGhhbmRsZXMgdXBkYXRpbmcgb2JqZWN0cy4gSXQgZG9lcyB0aGlzIGJ5IHNwbGl0dGluZyB1cCB1cGRhdGUgY3ljbGVzLCBcclxuICAgIHRvIHJlc3BlY3QgdGhlIGJyb3dzZXIgZXZlbnQgbW9kZWwuIFxyXG5cclxuICAgIElmIGFueSBvYmplY3QgaXMgc2NoZWR1bGVkIHRvIGJlIHVwZGF0ZWQsIGl0IHdpbGwgYmUgYmxvY2tlZCBmcm9tIHNjaGVkdWxpbmcgbW9yZSB1cGRhdGVzIFxyXG4gICAgdW50aWwgaXRzIG93biB1cGRhdGUgbWV0aG9kIGlzIGNhbGxlZC5cclxuKi9cclxuXHJcbmNvbnN0IFNjaGVkdWxlciA9IG5ldyhjbGFzcyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlX3F1ZXVlX2EgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZV9xdWV1ZV9iID0gbmV3IEFycmF5KCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlX3F1ZXVlID0gdGhpcy51cGRhdGVfcXVldWVfYTtcclxuXHJcbiAgICAgICAgdGhpcy5xdWV1ZV9zd2l0Y2ggPSAwO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9ICgpID0+IHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZnJhbWVfdGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuICAgICAgICB0aGlzLl9fX19TQ0hFRFVMRURfX19fID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcXVldWVVcGRhdGUob2JqZWN0KSB7XHJcblxyXG4gICAgICAgIGlmIChvYmplY3QuX19fX1NDSEVEVUxFRF9fX18gfHwgIW9iamVjdC51cGRhdGUgaW5zdGFuY2VvZiBGdW5jdGlvbilcclxuICAgICAgICAgICAgaWYgKHRoaXMuX19fX1NDSEVEVUxFRF9fX18pXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsZXIodGhpcy5jYWxsYmFjayk7XHJcblxyXG4gICAgICAgIG9iamVjdC5fX19fU0NIRURVTEVEX19fXyA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlX3F1ZXVlLnB1c2gob2JqZWN0KTtcclxuXHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9fX19TQ0hFRFVMRURfX19fKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuX19fX1NDSEVEVUxFRF9fX18gPSB0cnVlO1xyXG5cclxuICAgICAgICBjYWxsZXIodGhpcy5jYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9fX19TQ0hFRFVMRURfX19fID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCB1cSA9IHRoaXMudXBkYXRlX3F1ZXVlO1xyXG5cclxuICAgICAgICBpZih0aGlzLnF1ZXVlX3N3aXRjaCA9PSAwKVxyXG4gICAgICAgICAgICAodGhpcy51cGRhdGVfcXVldWUgPSB0aGlzLnVwZGF0ZV9xdWV1ZV9iLCB0aGlzLnF1ZXVlX3N3aXRjaCA9IDEpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgKHRoaXMudXBkYXRlX3F1ZXVlID0gdGhpcy51cGRhdGVfcXVldWVfYSwgdGhpcy5xdWV1ZV9zd2l0Y2ggPSAwKTtcclxuXHJcbiAgICAgICAgbGV0IHRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgbGV0IGRpZmYgPSB0aW1lIC0gdGhpcy5mcmFtZV90aW1lO1xyXG5cclxuICAgICAgICB0aGlzLmZyYW1lX3RpbWUgPSB0aW1lO1xyXG5cclxuICAgICAgICBsZXQgc3RlcF9yYXRpbyA9IChkaWZmICogMC4wNik7IC8vICBzdGVwX3JhdGlvIG9mIDEgPSAxNi42NjY2NjY2NiBvciAxMDAwIC8gNjAgZm9yIDYwIEZQU1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHVxLmxlbmd0aCwgbyA9IHVxWzBdOyBpIDwgbDsgbyA9IHVxWysraV0pe1xyXG4gICAgICAgICAgICBvLl9fX19TQ0hFRFVMRURfX19fID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG8udXBkYXRlKHN0ZXBfcmF0aW8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXEubGVuZ3RoID0gMDtcclxuICAgIH1cclxufSkoKVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFNjaGVkdWxlclxyXG59IiwiaW1wb3J0IHtcclxuXHRWaWV3XHJcbn0gZnJvbSBcIi4uL3ZpZXdcIlxyXG5pbXBvcnQge1xyXG5cdFNjaGVkdWxlclxyXG59IGZyb20gXCIuLi9zY2hlZHVsZXJcIlxyXG5cclxuXHJcbmNsYXNzIE1vZGVsQmFzZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcbiAgIFx0XHR0aGlzLl9fX19jaGFuZ2VkX3ZhbHVlc19fX18gPSBbXTtcclxuXHR9O1xyXG5cclxuXHRkZXN0cnVjdG9yKCkge1xyXG5cdFx0ZGVidWdnZXJcclxuICAgICAgICAvL2luZm9ybSB2aWV3cyBvZiB0aGUgbW9kZWxzIGRlbWlzZVxyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcy5maXJzdF92aWV3O1xyXG5cclxuICAgICAgICB3aGlsZSAodmlldykge1xyXG4gICAgICAgICAgICB2aWV3LnVuc2V0TW9kZWwoKTtcclxuICAgICAgICAgICAgdmlldyA9IHZpZXcubmV4dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdGhpcy5maXJzdF92aWV3ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdGdldCAoKXtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdFx0XHJcblx0Ki9cclxuXHJcbiAgICBzY2hlZHVsZVVwZGF0ZShjaGFuZ2VkX3ZhbHVlKSB7XHJcbiAgICBcdGlmKCF0aGlzLmZpcnN0X3ZpZXcpXHJcbiAgICBcdFx0cmV0dXJuO1xyXG5cclxuICAgIFx0dGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fLnB1c2goY2hhbmdlZF92YWx1ZSk7XHJcblxyXG4gICAgICAgIFNjaGVkdWxlci5xdWV1ZVVwZGF0ZSh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDaGFuZ2VkKHByb3BfbmFtZSkge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fXy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9fX19jaGFuZ2VkX3ZhbHVlc19fX19baV0gPT0gcHJvcF9uYW1lKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNbcHJvcF9uYW1lXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKHN0ZXApIHtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3cyh0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcblxyXG5cdC8qKlxyXG5cdFx0QWRkcyBhIHZpZXcgdG8gdGhlIGxpbmtlZCBsaXN0IG9mIHZpZXdzIG9uIHRoZSBtb2RlbC4gYXJndW1lbnQgdmlldyBNVVNUIGJlIGFuIGluc3RhbmNlIG9mIFZpZXcuIFxyXG5cdCovXHJcblx0YWRkVmlldyh2aWV3KSB7XHJcblx0XHRpZiAodmlldyBpbnN0YW5jZW9mIFZpZXcpIHtcclxuXHRcdFx0aWYgKHZpZXcubW9kZWwpXHJcblx0XHRcdFx0dmlldy5tb2RlbC5yZW1vdmVWaWV3KHZpZXcpO1xyXG5cclxuXHRcdFx0dmFyIGNoaWxkX3ZpZXcgPSB0aGlzLmZpcnN0X3ZpZXc7XHJcblxyXG5cdFx0XHR3aGlsZSAoY2hpbGRfdmlldykge1xyXG5cdFx0XHRcdGlmICh2aWV3ID09IGNoaWxkX3ZpZXcpIHJldHVybjtcclxuXHRcdFx0XHRjaGlsZF92aWV3ID0gY2hpbGRfdmlldy5uZXh0O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2aWV3Lm1vZGVsID0gdGhpcztcclxuXHRcdFx0dmlldy5uZXh0ID0gdGhpcy5maXJzdF92aWV3O1xyXG5cdFx0XHR0aGlzLmZpcnN0X3ZpZXcgPSB2aWV3O1xyXG5cclxuXHRcdFx0dmlldy5zZXRNb2RlbCh0aGlzKTtcclxuXHRcdFx0dmlldy51cGRhdGUodGhpcy5nZXQoKSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0dGhyb3cgbmV3IEV4Y2VwdGlvbihcIlBhc3NlZCBpbiB2aWV3IGlzIG5vdCBhbiBpbnN0YW5jZSBvZiB3aWNrLlZpZXchXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0XHRSZW1vdmVzIHZpZXcgZnJvbSBzZXQgb2Ygdmlld3MgaWYgdGhlIHBhc3NlZCBpbiB2aWV3IGlzIGEgbWVtYmVyIG9mIG1vZGVsLiBcclxuXHQqL1xyXG5cdHJlbW92ZVZpZXcodmlldykge1xyXG5cdFx0aWYgKHZpZXcgaW5zdGFuY2VvZiBWaWV3ICYmIHZpZXcubW9kZWwgPT0gdGhpcykge1xyXG5cdFx0XHR2YXIgY2hpbGRfdmlldyA9IHRoaXMuZmlyc3RfdmlldztcclxuXHRcdFx0dmFyIHByZXZfY2hpbGQgPSBudWxsO1xyXG5cclxuXHRcdFx0d2hpbGUgKGNoaWxkX3ZpZXcpIHtcclxuXHRcdFx0XHRpZiAodmlldyA9PSBjaGlsZF92aWV3KSB7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHByZXZfY2hpbGQpIHtcclxuXHRcdFx0XHRcdFx0cHJldl9jaGlsZC5uZXh0ID0gdmlldy5uZXh0O1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5maXJzdF92aWV3ID0gdmlldy5uZXh0O1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZpZXcubmV4dCA9IG51bGxcclxuXHRcdFx0XHRcdHZpZXcubW9kZWwgPSBudWxsO1xyXG5cdFx0XHRcdFx0dmlldy5yZXNldCgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdHByZXZfY2hpbGQgPSBjaGlsZF92aWV3O1xyXG5cdFx0XHRcdGNoaWxkX3ZpZXcgPSBjaGlsZF92aWV3Lm5leHQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vZGVidWdnZXJcclxuXHRcdH1cclxuXHRcdGNvbnNvbGUud2FybihcIlZpZXcgbm90IGEgbWVtYmVyIG9mIE1vZGVsIVwiLCB2aWV3KTtcclxuXHR9XHJcblx0LyoqXHJcblx0XHRDYWxscyB1cGRhdGUoKSBvbiBldmVyeSB2aWV3IG9iamVjdCwgcGFzc2luZyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgTW9kZWwuXHJcblx0Ki9cdFxyXG5cdHVwZGF0ZVZpZXdzKCkge1xyXG5cdFx0dmFyIHZpZXcgPSB0aGlzLmZpcnN0X3ZpZXc7XHJcblxyXG5cdFx0d2hpbGUgKHZpZXcpIHtcclxuXHRcdFx0XHJcblx0XHRcdHZpZXcudXBkYXRlKHRoaXMsIHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fXyk7XHJcblxyXG5cdFx0XHRcclxuXHRcdFx0dmlldyA9IHZpZXcubmV4dDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fLmxlbmd0aCA9IDA7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHRcdFVwZGF0ZXMgdmlld3Mgd2l0aCBhIGxpc3Qgb2YgbW9kZWxzIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQuIFxyXG5cdFx0UHJpbWFyaWx5IHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBjb250YWluZXIgYmFzZWQgdmlld3MsIHN1Y2ggYXMgQ2FzZVRlbXBsYXRlcy5cclxuXHQqL1xyXG5cdHVwZGF0ZVZpZXdzUmVtb3ZlZChkYXRhKSB7XHJcblx0XHR2YXIgdmlldyA9IHRoaXMuZmlyc3RfdmlldztcclxuXHJcblx0XHR3aGlsZSAodmlldykge1xyXG5cdFx0XHRcclxuXHRcdFx0dmlldy5yZW1vdmVkKGRhdGEpO1xyXG5cdFx0XHRcclxuXHRcdFx0dmlldyA9IHZpZXcubmV4dDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdFx0VXBkYXRlcyB2aWV3cyB3aXRoIGEgbGlzdCBvZiBtb2RlbHMgdGhhdCBoYXZlIGJlZW4gYWRkZWQuIFxyXG5cdFx0UHJpbWFyaWx5IHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBjb250YWluZXIgYmFzZWQgdmlld3MsIHN1Y2ggYXMgQ2FzZVRlbXBsYXRlcy5cclxuXHQqL1xyXG5cdHVwZGF0ZVZpZXdzQWRkZWQoZGF0YSkge1xyXG5cdFx0dmFyIHZpZXcgPSB0aGlzLmZpcnN0X3ZpZXc7XHJcblxyXG5cdFx0d2hpbGUgKHZpZXcpIHtcclxuXHRcdFx0XHJcblx0XHRcdHZpZXcuYWRkZWQoZGF0YSk7XHJcblx0XHRcdFxyXG5cdFx0XHR2aWV3ID0gdmlldy5uZXh0O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbiAgICB0b0pzb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMsbnVsbCwgJ1xcdCcpO1xyXG4gICAgfVxyXG59XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kZWxCYXNlLnByb3RvdHlwZSwgXCJmaXJzdF92aWV3XCIsIHtcclxuXHR3cml0YWJsZSA6IHRydWUsXHJcblx0Y29uZmlndXJhYmxlIDogZmFsc2UsXHJcblx0ZW51bWVyYWJsZSA6IGZhbHNlLFxyXG59KVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZGVsQmFzZS5wcm90b3R5cGUsIFwiX19fX2NoYW5nZWRfdmFsdWVzX19fX1wiLCB7XHJcblx0d3JpdGFibGUgOiB0cnVlLFxyXG5cdGNvbmZpZ3VyYWJsZSA6IGZhbHNlLFxyXG5cdGVudW1lcmFibGUgOiBmYWxzZSxcclxufSlcclxuXHJcblxyXG5PYmplY3Quc2VhbChNb2RlbEJhc2UucHJvdG90eXBlKTtcclxuXHJcblxyXG5leHBvcnQge1xyXG5cdE1vZGVsQmFzZVxyXG59IiwiLyoqXHJcblx0U2NoZW1hIHR5cGUuIEhhbmRsZXMgdGhlIHBhcnNpbmcsIHZhbGlkYXRpb24sIGFuZCBmaWx0ZXJpbmcgb2YgTW9kZWwgZGF0YSBwcm9wZXJ0aWVzLiBcclxuKi9cclxuY2xhc3MgU2NoZW1hVHlwZSB7XHJcblx0XHJcblx0Y29uc3RydWN0b3IoKXtcclxuXHRcdHRoaXMuc3RhcnRfdmFsdWUgPSB1bmRlZmluZWQ7XHJcblx0fVxyXG5cdFxyXG5cdC8qKlxyXG5cdFx0UGFyc2VzIHZhbHVlIHJldHVybnMgYW4gYXBwcm9wcmlhdGUgdHJhbnNmb3JtZWQgdmFsdWVcclxuXHQqL1xyXG5cdHBhcnNlKHZhbHVlKXtcclxuXHRcdHJldHVybiB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cclxuXHQqL1xyXG5cdHZlcmlmeSh2YWx1ZSwgcmVzdWx0KXtcclxuXHRcdHJlc3VsdC52YWxpZCA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRmaWx0ZXIoKXtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0c3RyaW5nKHZhbHVlKXtcclxuXHRcdHJldHVybiB2YWx1ZSArIFwiXCI7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQge1NjaGVtYVR5cGV9OyAiLCJpbXBvcnQge1xyXG4gICAgTW9kZWxCYXNlLFxyXG59IGZyb20gXCIuL21vZGVsX2Jhc2UuanNcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIFNjaGVtYVR5cGVcclxufSBmcm9tIFwiLi4vc2NoZW1hL3NjaGVtYV90eXBlXCJcclxuXHJcbmNsYXNzIE1DQXJyYXkgZXh0ZW5kcyBBcnJheSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1c2goaXRlbSkge1xyXG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkpXHJcbiAgICAgICAgICAgIGl0ZW0uZm9yRWFjaCgoaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoKGkpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdXBlci5wdXNoKGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vRm9yIGNvbXBhdGliaWxpdHlcclxuICAgIF9fc2V0RmlsdGVyc19fKCkge1xyXG5cclxuICAgIH1cclxuICAgIGdldENoYW5nZWQoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICB0b0pzb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMsIG51bGwsICdcXHQnKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gQSBcIm51bGxcIiBmdW5jdGlvblxyXG5sZXQgRW1wdHlGdW5jdGlvbiA9ICgpID0+IHt9O1xyXG5sZXQgRW1wdHlBcnJheSA9IFtdO1xyXG5cclxuXHJcblxyXG5jbGFzcyBNb2RlbENvbnRhaW5lciBleHRlbmRzIE1vZGVsQmFzZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NoZW1hKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vRm9yIExpbmtpbmcgdG8gb3JpZ2luYWwgXHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmlyc3RfbGluayA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5uZXh0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnByZXYgPSBudWxsO1xyXG5cclxuICAgICAgICAvL0ZvciBrZWVwaW5nIHRoZSBjb250YWluZXIgZnJvbSBhdXRvbWF0aWMgZGVsZXRpb24uXHJcbiAgICAgICAgdGhpcy5waW4gPSBFbXB0eUZ1bmN0aW9uO1xyXG5cclxuICAgICAgICAvL0ZpbHRlcnMgYXJlIGEgc2VyaWVzIG9mIHN0cmluZ3Mgb3IgbnVtYmVyIHNlbGVjdG9ycyB1c2VkIHRvIGRldGVybWluZSBpZiBhIG1vZGVsIHNob3VsZCBiZSBpbnNlcnRlZCBpbnRvIG9yIHJldHJpZXZlZCBmcm9tIHRoZSBjb250YWluZXIuXHJcbiAgICAgICAgdGhpcy5fX2ZpbHRlcnNfXyA9IEVtcHR5QXJyYXk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZW1hID0gc2NoZW1hIHx8IHRoaXMuY29uc3RydWN0b3Iuc2NoZW1hIHx8IHt9O1xyXG5cclxuICAgICAgICAvL1RoZSBwYXJzZXIgd2lsbCBoYW5kbGUgdGhlIGV2YWx1YXRpb24gb2YgaWRlbnRpZmllcnMgYWNjb3JkaW5nIHRvIHRoZSBjcml0ZXJpYSBzZXQgYnkgdGhlIF9fZmlsdGVyc19fIGxpc3QuIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5zY2hlbWEucGFyc2VyICYmIHRoaXMuc2NoZW1hLnBhcnNlciBpbnN0YW5jZW9mIFNjaGVtYVR5cGUpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZXIgPSB0aGlzLnNjaGVtYS5wYXJzZXJcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlciA9IG5ldyBTY2hlbWFUeXBlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmlkID0gXCJcIjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2NoZW1hLmlkZW50aWZpZXIgJiYgdHlwZW9mKHRoaXMuc2NoZW1hLmlkZW50aWZpZXIpID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IHRoaXMuc2NoZW1hLmlkZW50aWZpZXI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gdGhyb3cgKGBXcm9uZyBzY2hlbWEgaWRlbnRpZmllciB0eXBlIGdpdmVuIHRvIE1vZGVsQ29udGFpbmVyLiBFeHBlY3RlZCB0eXBlIFN0cmluZywgZ290OiAke3R5cGVvZih0aGlzLnNjaGVtYS5pZGVudGlmaWVyKX0hYCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh0aGlzLCB7XHJcbiAgICAgICAgICAgIGdldDogKG9iaiwgcHJvcCwgdmFsKSA9PiAocHJvcCBpbiBvYmopID8gb2JqW3Byb3BdIDogb2JqLmdldCh2YWwpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuc2NoZW1hID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5fX2ZpbHRlcnNfXyA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNvdXJjZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNvdXJjZS5fX3VubGlua19fKHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEdldCB0aGUgbnVtYmVyIG9mIE1vZGVscyBoZWxkIGluIHRoaXMgTW9kZWxDb250YWluZXJcclxuXHJcbiAgICAgICAgQHJldHVybnMge051bWJlcn1cclxuICAgICovXHJcbiAgICBnZXQgbGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBsZW5ndGgoZSkge1xyXG4gICAgICAgIC8vTlVMTCBmdW5jdGlvbi4gRG8gTm90IE92ZXJyaWRlIVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAgICBSZXR1cm5zIGEgTW9kZWxDb250YWluZXIgdHlwZSB0byBzdG9yZSB0aGUgcmVzdWx0cyBvZiBhIGdldCgpLlxyXG4gICAgKi9cclxuICAgIF9fZGVmYXVsdFJldHVybl9fKFVTRV9BUlJBWSkge1xyXG4gICAgICAgIGlmIChVU0VfQVJSQVkpIHJldHVybiBuZXcgTUNBcnJheTtcclxuXHJcbiAgICAgICAgbGV0IG4gPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnNjaGVtYSk7XHJcblxyXG4gICAgICAgIHRoaXMuX19saW5rX18obik7XHJcblxyXG4gICAgICAgIHJldHVybiBuO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEFycmF5IGVtdWxhdGluZyBrbHVkZ2VcclxuXHJcbiAgICAgICAgQHJldHVybnMgVGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoaXMuaW5zZXJ0XHJcbiAgICAqL1xyXG4gICAgcHVzaChpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0KGl0ZW0sIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJldHJpZXZlcyBhIGxpc3Qgb2YgaXRlbXMgdGhhdCBtYXRjaCB0aGUgdGVybS90ZXJtcy4gXHJcblxyXG4gICAgICAgIEBwYXJhbSB7KEFycmF5fFNlYXJjaFRlcm0pfSB0ZXJtIC0gQSBzaW5nbGUgdGVybSBvciBhIHNldCBvZiB0ZXJtcyB0byBsb29rIGZvciBpbiB0aGUgTW9kZWxDb250YWluZXIuIFxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IF9fcmV0dXJuX2RhdGFfXyAtIFNldCB0byB0cnVlIGJ5IGEgc291cmNlIENvbnRhaW5lciBpZiBpdCBpcyBjYWxsaW5nIGEgU3ViQ29udGFpbmVyIGluc2VydCBmdW5jdGlvbi4gXHJcblxyXG4gICAgICAgIEByZXR1cm5zIHsoTW9kZWxDb250YWluZXJ8QXJyYXkpfSBSZXR1cm5zIGEgTW9kZWwgY29udGFpbmVyIG9yIGFuIEFycmF5IG9mIE1vZGVscyBtYXRjaGluZyB0aGUgc2VhcmNoIHRlcm1zLiBcclxuICAgICovXHJcbiAgICBnZXQodGVybSwgX19yZXR1cm5fZGF0YV9fKSB7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBudWxsO1xyXG5cclxuICAgICAgICBsZXQgVVNFX0FSUkFZID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKHRlcm0pIHtcclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIGlmIChfX3JldHVybl9kYXRhX18pIHtcclxuICAgICAgICAgICAgICAgIG91dCA9IF9fcmV0dXJuX2RhdGFfXztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoX19yZXR1cm5fZGF0YV9fID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIFVTRV9BUlJBWSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zb3VyY2UpXHJcbiAgICAgICAgICAgICAgICAgICAgVVNFX0FSUkFZID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgb3V0ID0gdGhpcy5fX2RlZmF1bHRSZXR1cm5fXyhVU0VfQVJSQVkpO1xyXG4gICAgICAgICAgICAgICAgb3V0Ll9fc2V0RmlsdGVyc19fKHRlcm0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIG91dCA9IChfX3JldHVybl9kYXRhX18pID8gX19yZXR1cm5fZGF0YV9fIDogdGhpcy5fX2RlZmF1bHRSZXR1cm5fXyhVU0VfQVJSQVkpO1xyXG5cclxuICAgICAgICBpZiAoIXRlcm0pXHJcbiAgICAgICAgICAgIHRoaXMuX19nZXRBbGxfXyhvdXQpO1xyXG4gICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgbGV0IHRlcm1zID0gdGVybTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGVybSBpbnN0YW5jZW9mIEFycmF5KVxyXG4gICAgICAgICAgICAgICAgdGVybXMgPSBbdGVybV07XHJcblxyXG4gICAgICAgICAgICAvL05lZWQgdG8gY29udmVydCB0ZXJtcyBpbnRvIGEgZm9ybSB0aGF0IHdpbGwgd29yayBmb3IgdGhlIGlkZW50aWZpZXIgdHlwZVxyXG4gICAgICAgICAgICB0ZXJtcyA9IHRlcm1zLm1hcCh0ID0+IHRoaXMucGFyc2VyLnBhcnNlKHQpKTtcclxuXHJcblxyXG4gICAgICAgICAgICB0aGlzLl9fZ2V0X18odGVybXMsIG91dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgSW5zZXJ0cyBhbiBpdGVtIGludG8gdGhlIGNvbnRhaW5lci4gSWYgdGhlIGl0ZW0gaXMgbm90IGEge01vZGVsfSwgYW4gYXR0ZW1wdCB3aWxsIGJlIG1hZGUgdG8gY29udmVydCB0aGUgZGF0YSBpbiB0aGUgT2JqZWN0IGludG8gYSBNb2RlbC5cclxuICAgICAgICBJZiB0aGUgaXRlbSBpcyBhbiBhcnJheSBvZiBvYmplY3RzLCBlYWNoIG9iamVjdCBpbiB0aGUgYXJyYXkgd2lsbCBiZSBjb25zaWRlcmVkIHNlcGFyYXRlbHkuIFxyXG5cclxuICAgICAgICBAcGFyYW0ge09iamVjdH0gaXRlbSAtIEFuIE9iamVjdCB0byBpbnNlcnQgaW50byB0aGUgY29udGFpbmVyLiBPbiBvZiB0aGUgcHJvcGVydGllcyBvZiB0aGUgb2JqZWN0IE1VU1QgaGF2ZSB0aGUgc2FtZSBuYW1lIGFzIHRoZSBNb2RlbENvbnRhaW5lcidzIFxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IGl0ZW0gLSBBbiBhcnJheSBvZiBPYmplY3RzIHRvIGluc2VydCBpbnRvIHRoZSBjb250YWluZXIuXHJcbiAgICAgICAgQHBhcmFtIHtCb29sZWFufSBfX0ZST01fU09VUkNFX18gLSBTZXQgdG8gdHJ1ZSBieSBhIHNvdXJjZSBDb250YWluZXIgaWYgaXQgaXMgY2FsbGluZyBhIFN1YkNvbnRhaW5lciBpbnNlcnQgZnVuY3Rpb24uIFxyXG5cclxuICAgICAgICBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFuIGluc2VydGlvbiBpbnRvIHRoZSBNb2RlbENvbnRhaW5lciBvY2N1cnJlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxyXG4gICAgKi9cclxuICAgIGluc2VydChpdGVtLCBfX0ZST01fU09VUkNFX18gPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBsZXQgYWRkX2xpc3QgPSAodGhpcy5maXJzdF92aWV3KSA/IFtdIDogbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoIV9fRlJPTV9TT1VSQ0VfXyAmJiB0aGlzLnNvdXJjZSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlLmluc2VydChpdGVtKTtcclxuXHJcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW0ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fX2luc2VydFN1Yl9fKGl0ZW1baV0sIG91dCwgYWRkX2xpc3QpKVxyXG4gICAgICAgICAgICAgICAgICAgIG91dCA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpdGVtKVxyXG4gICAgICAgICAgICBvdXQgPSB0aGlzLl9faW5zZXJ0U3ViX18oaXRlbSwgb3V0LCBhZGRfbGlzdCk7XHJcblxyXG5cclxuICAgICAgICBpZiAoYWRkX2xpc3QgJiYgYWRkX2xpc3QubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaWV3c0FkZGVkKGFkZF9saXN0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBBIHN1YnNldCBvZiB0aGUgaW5zZXJ0IGZ1bmN0aW9uLiBIYW5kbGVzIHRoZSB0ZXN0IG9mIGlkZW50aWZpZXIsIHRoZSBjb252ZXJzaW9uIG9mIGFuIE9iamVjdCBpbnRvIGEgTW9kZWwsIGFuZCB0aGUgY2FsbGluZyBvZiB0aGUgaW50ZXJuYWwgX19pbnNlcnRfXyBmdW5jdGlvbi5cclxuICAgICovXHJcbiAgICBfX2luc2VydFN1Yl9fKGl0ZW0sIG91dCwgYWRkX2xpc3QpIHtcclxuXHJcbiAgICAgICAgbGV0IG1vZGVsID0gaXRlbTtcclxuXHJcbiAgICAgICAgdmFyIGlkZW50aWZpZXIgPSB0aGlzLl9fZ2V0SWRlbnRpZmllcl9fKGl0ZW0pO1xyXG5cclxuICAgICAgICBpZiAoaWRlbnRpZmllciAhPSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghKG1vZGVsIGluc3RhbmNlb2YgdGhpcy5zY2hlbWEubW9kZWwpICYmICEobW9kZWwgPSBtb2RlbC5fX19fc2VsZl9fX18pKSB7XHJcbiAgICAgICAgICAgICAgICBtb2RlbCA9IG5ldyB0aGlzLnNjaGVtYS5tb2RlbCgpO1xyXG4gICAgICAgICAgICAgICAgbW9kZWwuYWRkKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZGVudGlmaWVyID0gdGhpcy5fX2dldElkZW50aWZpZXJfXyhtb2RlbCwgdGhpcy5fX2ZpbHRlcnNfXyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllcikge1xyXG4gICAgICAgICAgICAgICAgb3V0ID0gdGhpcy5fX2luc2VydF9fKG1vZGVsLCBhZGRfbGlzdCwgaWRlbnRpZmllcilcclxuICAgICAgICAgICAgICAgIHRoaXMuX19saW5rc0luc2VydF9fKG1vZGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmVtb3ZlcyBhbiBpdGVtIGZyb20gdGhlIGNvbnRhaW5lci4gXHJcbiAgICAqL1xyXG4gICAgcmVtb3ZlKHRlcm0sIF9fRlJPTV9TT1VSQ0VfXyA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGxldCB0ZXJtcyA9IHRlcm07XHJcblxyXG4gICAgICAgIGlmICghX19GUk9NX1NPVVJDRV9fICYmIHRoaXMuc291cmNlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRlcm0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2UucmVtb3ZlKHRoaXMuX19maWx0ZXJzX18pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2UucmVtb3ZlKHRlcm0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG91dF9jb250YWluZXIgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKCF0ZXJtKVxyXG4gICAgICAgICAgICB0aGlzLl9fcmVtb3ZlQWxsX18oKTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCF0ZXJtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHRlcm1zID0gW3Rlcm1dO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL05lZWQgdG8gY29udmVydCB0ZXJtcyBpbnRvIGEgZm9ybSB0aGF0IHdpbGwgd29yayBmb3IgdGhlIGlkZW50aWZpZXIgdHlwZVxyXG4gICAgICAgICAgICB0ZXJtcyA9IHRlcm1zLm1hcCh0ID0+IHRoaXMucGFyc2VyLnBhcnNlKHQpKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX19yZW1vdmVfXyh0ZXJtcywgb3V0X2NvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9fbGlua3NSZW1vdmVfXyh0ZXJtcyk7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfY29udGFpbmVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJlbW92ZXMgYSBNb2RlbENvbnRhaW5lciBmcm9tIGxpc3Qgb2YgbGlua2VkIGNvbnRhaW5lcnMuIFxyXG5cclxuICAgICAgICBAcGFyYW0ge01vZGVsQ29udGFpbmVyfSBjb250YWluZXIgLSBUaGUgTW9kZWxDb250YWluZXIgaW5zdGFuY2UgdG8gcmVtb3ZlIGZyb20gdGhlIHNldCBvZiBsaW5rZWQgY29udGFpbmVycy4gTXVzdCBiZSBhIG1lbWJlciBvZiB0aGUgbGlua2VkIGNvbnRhaW5lcnMuIFxyXG4gICAgKi9cclxuICAgIF9fdW5saW5rX18oY29udGFpbmVyKSB7XHJcblxyXG4gICAgICAgIGlmIChjb250YWluZXIgaW5zdGFuY2VvZiBNb2RlbENvbnRhaW5lciAmJiBjb250YWluZXIuc291cmNlID09IHRoaXMpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb250YWluZXIgPT0gdGhpcy5maXJzdF9saW5rKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJzdF9saW5rID0gY29udGFpbmVyLm5leHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGFpbmVyLm5leHQpXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIubmV4dC5wcmV2ID0gY29udGFpbmVyLnByZXY7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGFpbmVyLnByZXYpXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHJldi5uZXh0ID0gY29udGFpbmVyLm5leHQ7XHJcblxyXG4gICAgICAgICAgICBjb250YWluZXIuc291cmNlID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQWRkcyBhIGNvbnRhaW5lciB0byB0aGUgbGlzdCBvZiB0cmFja2VkIGNvbnRhaW5lcnMuIFxyXG5cclxuICAgICAgICBAcGFyYW0ge01vZGVsQ29udGFpbmVyfSBjb250YWluZXIgLSBUaGUgTW9kZWxDb250YWluZXIgaW5zdGFuY2UgdG8gYWRkIHRoZSBzZXQgb2YgbGlua2VkIGNvbnRhaW5lcnMuXHJcbiAgICAqL1xyXG4gICAgX19saW5rX18oY29udGFpbmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbnRhaW5lciBpbnN0YW5jZW9mIE1vZGVsQ29udGFpbmVyICYmICFjb250YWluZXIuc291cmNlKSB7XHJcblxyXG4gICAgICAgICAgICBjb250YWluZXIuc291cmNlID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5uZXh0ID0gdGhpcy5maXJzdF9saW5rO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZmlyc3RfbGluaylcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RfbGluay5wcmV2ID0gY29udGFpbmVyO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5maXJzdF9saW5rID0gY29udGFpbmVyO1xyXG5cclxuICAgICAgICAgICAgY29udGFpbmVyLnBpbiA9ICgoY29udGFpbmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuX191bmxpbmtfXygpO1xyXG4gICAgICAgICAgICAgICAgfSwgNTApXHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghY29udGFpbmVyLnNvdXJjZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiZmFpbGVkIHRvIGNsZWFyIHRoZSBkZXN0cnVjdGlvbiBvZiBjb250YWluZXIgaW4gdGltZSFcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKGNvbnRhaW5lcilcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX19saW5rc1JlbW92ZV9fKHRlcm1zKSB7XHJcbiAgICAgICAgbGV0IGEgPSB0aGlzLmZpcnN0X2xpbms7XHJcbiAgICAgICAgd2hpbGUgKGEpIHtcclxuICAgICAgICAgICAgYS5yZW1vdmUodGVybXMsIHRydWUpO1xyXG4gICAgICAgICAgICBhID0gYS5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfX2xpbmtzSW5zZXJ0X18oaXRlbSkge1xyXG4gICAgICAgIGxldCBhID0gdGhpcy5maXJzdF9saW5rO1xyXG4gICAgICAgIHdoaWxlIChhKSB7XHJcbiAgICAgICAgICAgIGEuaW5zZXJ0KGl0ZW0sIHRydWUpO1xyXG4gICAgICAgICAgICBhID0gYS5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZW1vdmVzIGFueSBpdGVtcyBpbiB0aGUgbW9kZWwgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheSBcIml0ZW1zXCIsIGFuZCBhZGRzIGFueSBpdGVtcyBpbiBpdGVtcyBub3QgYWxyZWFkeSBpbiB0aGUgTW9kZWxDb250YWluZXIuXHJcblxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IGl0ZW1zIC0gQW4gYXJyYXkgb2YgaWRlbnRpZmlhYmxlIE1vZGVscyBvciBvYmplY3RzLiBcclxuICAgICovXHJcbiAgICBjdWxsKGl0ZW1zKSB7XHJcblxyXG4gICAgICAgIGxldCBoYXNoX3RhYmxlID0ge307XHJcbiAgICAgICAgbGV0IGV4aXN0aW5nX2l0ZW1zID0gX19nZXRBbGxfXyhbXSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIGxldCBsb2FkSGFzaCA9IChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5mb3JFYWNoKChlKSA9PiBsb2FkSGFzaChlKSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaWRlbnRpZmllciA9IHRoaXMuX19nZXRJZGVudGlmaWVyX18oaXRlbSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllcilcclxuICAgICAgICAgICAgICAgIGhhc2hfdGFibGVbaWRlbnRpZmllcl0gPSBpdGVtO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxvYWRIYXNoKGl0ZW1zKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleGlzdGluZ19pdGVtcy5sZW50aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlX2l0ZW0gPSBleGlzdGluZ19pdGVtc1tpXTtcclxuICAgICAgICAgICAgaWYgKCFleGlzdGluZ19pdGVtc1t0aGlzLl9fZ2V0SWRlbnRpZmllcl9fKGVfaXRlbSldKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fX3JlbW92ZV9fKGVfaXRlbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluc2VydChpdGVtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgX19zZXRGaWx0ZXJzX18odGVybSkge1xyXG4gICAgICAgIGlmICh0ZXJtIGluc3RhbmNlb2YgQXJyYXkpXHJcbiAgICAgICAgICAgIHRoaXMuX19maWx0ZXJzX18gPSB0aGlzLl9fZmlsdGVyc19fLmNvbmNhdCh0ZXJtLm1hcCh0ID0+IHRoaXMucGFyc2VyLnBhcnNlKHQpKSlcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuX19maWx0ZXJzX18ucHVzaCh0aGlzLnBhcnNlci5wYXJzZSh0ZXJtKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJldHVybnMgdHJ1ZSBpZiB0aGUgaWRlbnRpZmllciBtYXRjaGVzIGEgcHJlZGVmaW5lZCBmaWx0ZXIgcGF0dGVybiwgd2hpY2ggaXMgZXZhbHVhdGVkIGJ5IHRoaXMucGFyc2VyLiBJZiBhIFxyXG4gICAgICAgIHBhcnNlciB3YXMgbm90IHByZXNlbnQgdGhlIE1vZGVsQ29udGFpbmVycyBzY2hlbWEsIHRoZW4gdGhlIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRydWUgdXBvbiBldmVyeSBldmFsdWF0aW9uLlxyXG4gICAgKi9cclxuICAgIF9fZmlsdGVySWRlbnRpZmllcl9fKGlkZW50aWZpZXIsIGZpbHRlcnMpIHtcclxuICAgICAgICBpZiAoZmlsdGVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlci5maWx0ZXIoaWRlbnRpZmllciwgZmlsdGVycyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJldHVybnMgdGhlIElkZW50aWZpZXIgcHJvcGVydHkgdmFsdWUgaWYgaXQgZXhpc3RzIGluIHRoZSBpdGVtLiBJZiBhbiBhcnJheSB2YWx1ZSBmb3IgZmlsdGVycyBpcyBwYXNzZWQsIHRoZW4gdW5kZWZpbmVkIGlzIHJldHVybmVkIGlmIHRoZSBpZGVudGlmaWVyIHZhbHVlIGRvZXMgbm90IHBhc3MgZmlsdGVyaW5nIGNyaXRlcmlhLlxyXG4gICAgICAgIEBwYXJhbSB7KE9iamVjdHxNb2RlbCl9IGl0ZW1cclxuICAgICAgICBAcGFyYW0ge0FycmF5fSBmaWx0ZXJzIC0gQW4gYXJyYXkgb2YgZmlsdGVyIHRlcm1zIHRvIHRlc3Qgd2hldGhlciB0aGUgaWRlbnRpZmllciBtZWV0cyB0aGUgY3JpdGVyaWEgdG8gYmUgaGFuZGxlZCBieSB0aGUgTW9kZWxDb250YWluZXIuXHJcbiAgICAqL1xyXG4gICAgX19nZXRJZGVudGlmaWVyX18oaXRlbSwgZmlsdGVycyA9IG51bGwpIHtcclxuXHJcbiAgICAgICAgbGV0IGlkZW50aWZpZXIgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mKGl0ZW0pID09IFwib2JqZWN0XCIpXHJcbiAgICAgICAgICAgIGlkZW50aWZpZXIgPSBpdGVtW3RoaXMuc2NoZW1hLmlkZW50aWZpZXJdO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgaWRlbnRpZmllciA9IGl0ZW07XHJcblxyXG4gICAgICAgIGlmIChpZGVudGlmaWVyKVxyXG4gICAgICAgICAgICBpZGVudGlmaWVyID0gdGhpcy5wYXJzZXIucGFyc2UoaWRlbnRpZmllcik7XHJcblxyXG4gICAgICAgIGlmIChmaWx0ZXJzICYmIGlkZW50aWZpZXIpXHJcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5fX2ZpbHRlcklkZW50aWZpZXJfXyhpZGVudGlmaWVyLCBmaWx0ZXJzKSkgPyBpZGVudGlmaWVyIDogdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICByZXR1cm4gaWRlbnRpZmllcjtcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgICAgT1ZFUlJJREUgU0VDVElPTiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgIFxyXG4gICAgICAgIEFsbCBvZiB0aGVzZSBmdW5jdGlvbnMgc2hvdWxkIGJlIG92ZXJyaWRkZW4gYnkgaW5oZXJpdGluZyBjbGFzc2VzXHJcbiAgICAqL1xyXG5cclxuICAgIF9faW5zZXJ0X18oaXRlbSwgYWRkX2xpc3QsIGlkZW50aWZpZXIpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgX19nZXRfXyhpdGVtLCBfX3JldHVybl9kYXRhX18pIHtcclxuICAgICAgICByZXR1cm4gX19yZXR1cm5fZGF0YV9fO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0QWxsX18oX19yZXR1cm5fZGF0YV9fKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fcmV0dXJuX2RhdGFfXztcclxuICAgIH1cclxuXHJcbiAgICBfX3JlbW92ZUFsbF9fKCkge1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICBfX3JlbW92ZV9fKGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRU5EIE9WRVJSSURFICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbn1cclxuXHJcbmNsYXNzIE11bHRpSW5kZXhlZENvbnRhaW5lciBleHRlbmRzIE1vZGVsQ29udGFpbmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHNjaGVtYSkge1xyXG5cclxuICAgICAgICBzdXBlcih7XHJcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IFwiaW5kZXhlZFwiLFxyXG4gICAgICAgICAgICBtb2RlbDogc2NoZW1hLm1vZGVsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZW1hID0gc2NoZW1hO1xyXG4gICAgICAgIHRoaXMuaW5kZXhlcyA9IHt9O1xyXG4gICAgICAgIHRoaXMuZmlyc3RfaW5kZXggPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmFkZEluZGV4KHNjaGVtYS5pbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoZSBmaXJzdCBpbmRleCBpbiB0aGlzIGNvbnRhaW5lci4gXHJcbiAgICAqL1xyXG4gICAgZ2V0IGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5maXJzdF9pbmRleC5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgSW5zZXJ0IGEgbmV3IE1vZGVsQ29udGFpbmVyIGludG8gdGhlIGluZGV4IHRocm91Z2ggdGhlIHNjaGVtYS4gIFxyXG4gICAgKi9cclxuICAgIGFkZEluZGV4KGluZGV4X3NjaGVtYSkge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBuYW1lIGluIGluZGV4X3NjaGVtYSkge1xyXG4gICAgICAgICAgICBsZXQgc2NoZW1lID0gaW5kZXhfc2NoZW1hW25hbWVdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNjaGVtZS5jb250YWluZXIgJiYgIXRoaXMuaW5kZXhlc1tuYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleGVzW25hbWVdID0gbmV3IHNjaGVtZS5jb250YWluZXIoc2NoZW1lLnNjaGVtYSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlyc3RfaW5kZXgpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleGVzW25hbWVdLmluc2VydCh0aGlzLmZpcnN0X2luZGV4Ll9fZ2V0QWxsX18oKSk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdF9pbmRleCA9IHRoaXMuaW5kZXhlc1tuYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQoaXRlbSwgX19yZXR1cm5fZGF0YV9fKSB7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBpdGVtKVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXhlc1tuYW1lXSlcclxuICAgICAgICAgICAgICAgICAgICBvdXRbbmFtZV0gPSB0aGlzLmluZGV4ZXNbbmFtZV0uZ2V0KGl0ZW1bbmFtZV0sIF9fcmV0dXJuX2RhdGFfXyk7XHJcbiAgICAgICAgfSBlbHNlXHJcblxyXG4gICAgICAgICAgICBvdXQgPSB0aGlzLmZpcnN0X2luZGV4LmdldChudWxsKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlKGl0ZW0pIHtcclxuXHJcbiAgICAgICAgdmFyIG91dCA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBhIGluIGl0ZW0pXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmluZGV4ZXNbYV0pXHJcbiAgICAgICAgICAgICAgICBvdXQgPSBvdXQuY29uY2F0KHRoaXMuaW5kZXhlc1thXS5yZW1vdmUoaXRlbVthXSkpO1xyXG5cclxuICAgICAgICAvKiBSZXBsYXkgaXRlbXMgYWdhaW5zdCBpbmRleGVzIHRvIGluc3VyZSBhbGwgaXRlbXMgaGF2ZSBiZWVuIHJlbW92ZWQgZnJvbSBhbGwgaW5kZXhlcyAqL1xyXG5cclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuaW5kZXhlcy5sZW5ndGg7IGorKylcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvdXQubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ZXNbal0ucmVtb3ZlKG91dFtpXSk7XHJcblxyXG4gICAgICAgIC8vVXBkYXRlIGFsbCB2aWV3c1xyXG4gICAgICAgIGlmIChvdXQubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaWV3c1JlbW92ZWQob3V0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBfX2luc2VydF9fKG1vZGVsLCBhZGRfbGlzdCwgaWRlbnRpZmllcikge1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gZmFsc2VcclxuXHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLmluZGV4ZXMpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuaW5kZXhlc1tuYW1lXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbmRleC5pbnNlcnQobW9kZWwpKVxyXG4gICAgICAgICAgICAgICAgb3V0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgLy9lbHNlXHJcbiAgICAgICAgICAgIC8vICAgIGNvbnNvbGUud2FybihgSW5kZXhlZCBjb250YWluZXIgJHthfSAke2luZGV4fSBmYWlsZWQgdG8gaW5zZXJ0OmAsIG1vZGVsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvdXQpXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlld3ModGhpcy5maXJzdF9pbmRleC5nZXQoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAgICBAcHJpdmF0ZSBcclxuICAgICovXHJcbiAgICBfX3JlbW92ZV9fKGl0ZW0pIHtcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBuYW1lIGluIHRoaXMuaW5kZXhlcykge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmluZGV4ZXNbbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChpbmRleC5yZW1vdmUoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICBvdXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBfX3JlbW92ZUFsbF9fKCkge1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gdGhpcy5pbmRleGVzKSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleC5fX3JlbW92ZUFsbF9fKCkpXHJcbiAgICAgICAgICAgICAgICBvdXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgT3ZlcnJpZGVzIE1vZGVsIGNvbnRhaW5lciBkZWZhdWx0IF9fZ2V0SWRlbnRpZmllcl9fIHRvIGZvcmNlIGl0ZW0gdG8gcGFzcy5cclxuICAgICAgICBAcHJpdmF0ZSBcclxuICAgICovXHJcbiAgICBfX2dldElkZW50aWZpZXJfXyhpdGVtLCBmaWx0ZXJzID0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpIHtcclxuICAgICAgICByZXR1cm4gXCJbXVwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgTUNBcnJheSxcclxuICAgIE1vZGVsQ29udGFpbmVyLFxyXG4gICAgTXVsdGlJbmRleGVkQ29udGFpbmVyLFxyXG4gICAgYXJyYXlfY29udGFpbmVyXHJcbn07IiwiaW1wb3J0IHtcclxuICAgIE1vZGVsQ29udGFpbmVyLFxyXG4gICAgTUNBcnJheVxyXG59IGZyb20gXCIuL21vZGVsX2NvbnRhaW5lclwiXHJcblxyXG5cclxuLyoqXHJcbiAqL1xyXG5jbGFzcyBBcnJheU1vZGVsQ29udGFpbmVyIGV4dGVuZHMgTW9kZWxDb250YWluZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjaGVtYSkge1xyXG4gICAgICAgIHN1cGVyKHNjaGVtYSk7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhID0gbnVsbDtcclxuXHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsZW5ndGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgX19kZWZhdWx0UmV0dXJuX18oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc291cmNlKSByZXR1cm4gbmV3IE1DQXJyYXk7XHJcblxyXG4gICAgICAgIGxldCBuID0gbmV3IEFycmF5TW9kZWxDb250YWluZXIodGhpcy5zY2hlbWEpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbGlua19fKG4pO1xyXG5cclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuXHJcbiAgICBfX2luc2VydF9fKG1vZGVsLCBhZGRfbGlzdCwgaWRlbnRpZmllcikge1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuZGF0YS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBvYmogPSB0aGlzLmRhdGFbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fX2dldElkZW50aWZpZXJfXyhvYmopID09IGlkZW50aWZpZXIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBvYmouYWRkKG1vZGVsKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vTW9kZWwgbm90IGFkZGVkIHRvIENvbnRhaW5lci4gTW9kZWwganVzdCB1cGRhdGVkLlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRhdGEucHVzaChtb2RlbCk7XHJcblxyXG4gICAgICAgIGlmIChhZGRfbGlzdCkgYWRkX2xpc3QucHVzaChtb2RlbCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlOyAvLyBNb2RlbCBhZGRlZCB0byBDb250YWluZXIuXHJcbiAgICB9XHJcblxyXG4gICAgX19nZXRfXyh0ZXJtLCByZXR1cm5fZGF0YSkge1xyXG5cclxuICAgICAgICBsZXQgdGVybXMgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAodGVybSlcclxuICAgICAgICAgICAgaWYgKHRlcm0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgdGVybXMgPSB0ZXJtO1xyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIHRlcm1zID0gW3Rlcm1dO1xyXG5cclxuXHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5kYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgb2JqID0gdGhpcy5kYXRhW2ldO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fX2dldElkZW50aWZpZXJfXyhvYmosIHRlcm1zKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuX2RhdGEucHVzaChvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmV0dXJuX2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgX19nZXRBbGxfXyhyZXR1cm5fZGF0YSkge1xyXG5cclxuICAgICAgICB0aGlzLmRhdGEuZm9yRWFjaCgobSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm5fZGF0YS5wdXNoKG0pXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuIHJldHVybl9kYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcmVtb3ZlQWxsX18oKSB7XHJcbiAgICAgICAgbGV0IGl0ZW1zID0gdGhpcy5kYXRhLm1hcChkID0+IGQpIHx8IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmRhdGEubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcmVtb3ZlX18odGVybSwgb3V0X2NvbnRhaW5lcikge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuZGF0YS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG9iaiA9IHRoaXMuZGF0YVtpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9fZ2V0SWRlbnRpZmllcl9fKG9iaiwgdGVybSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zcGxpY2UoaSwgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbC0tO1xyXG4gICAgICAgICAgICAgICAgaS0tO1xyXG5cclxuICAgICAgICAgICAgICAgIG91dF9jb250YWluZXIucHVzaChvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIEFycmF5TW9kZWxDb250YWluZXJcclxufSIsImltcG9ydCB7XHJcbiAgICBNb2RlbENvbnRhaW5lcixcclxuICAgIE1DQXJyYXlcclxufSBmcm9tIFwiLi9tb2RlbF9jb250YWluZXJcIlxyXG5cclxuY2xhc3MgQlRyZWVNb2RlbENvbnRhaW5lciBleHRlbmRzIE1vZGVsQ29udGFpbmVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY2hlbWEpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoc2NoZW1hKTtcclxuXHJcbiAgICAgICAgdGhpcy5yb290ID0gbnVsbDtcclxuICAgICAgICB0aGlzLm1pbiA9IDEwO1xyXG4gICAgICAgIHRoaXMubWF4ID0gMjA7XHJcbiAgICAgICAgdGhpcy5zaXplID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJvb3QpXHJcbiAgICAgICAgICAgIHRoaXMucm9vdC5kZXN0cnVjdG9yKCk7XHJcblxyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgX19pbnNlcnRfXyhtb2RlbCwgYWRkX2xpc3QsIGlkZW50aWZpZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHtcclxuICAgICAgICAgICAgYWRkZWQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnJvb3QpXHJcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IG5ldyBCdHJlZU5vZGUodHJ1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMucm9vdCA9IHRoaXMucm9vdC5pbnNlcnQoaWRlbnRpZmllciwgbW9kZWwsIHRoaXMubWF4LCB0cnVlLCByZXN1bHQpLm5ld25vZGU7XHJcblxyXG4gICAgICAgIGlmIChhZGRfbGlzdCkgYWRkX2xpc3QucHVzaChtb2RlbCk7XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHQuYWRkZWQpXHJcbiAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0LmFkZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0X18odGVybXMsIF9fcmV0dXJuX2RhdGFfXykge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yb290ICYmIHRlcm1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgaWYgKHRlcm1zLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QuZ2V0KHBhcnNlRmxvYXQodGVybXNbMF0pLCBwYXJzZUZsb2F0KHRlcm1zWzBdKSwgX19yZXR1cm5fZGF0YV9fKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0ZXJtcy5sZW5ndGggPCAzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QuZ2V0KHBhcnNlRmxvYXQodGVybXNbMF0pLCBwYXJzZUZsb2F0KHRlcm1zWzFdKSwgX19yZXR1cm5fZGF0YV9fKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGVybXMubGVuZ3RoIC0gMTsgaSA+IGw7IGkgKz0gMilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QuZ2V0KHBhcnNlRmxvYXQodGVybXNbaV0pLCBwYXJzZUZsb2F0KHRlcm1zW2kgKyAxXSksIF9fcmV0dXJuX2RhdGFfXyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBfX3JldHVybl9kYXRhX187XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVfXyh0ZXJtcywgb3V0X2NvbnRhaW5lcikge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSAwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yb290ICYmIHRlcm1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgaWYgKHRlcm1zLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbyA9IHRoaXMucm9vdC5yZW1vdmUodGVybXNbMF0sIHRlcm1zWzBdLCB0cnVlLCB0aGlzLm1pbiwgb3V0X2NvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBvLm91dDtcclxuICAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IG8ub3V0X25vZGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGVybXMubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG8gPSB0aGlzLnJvb3QucmVtb3ZlKHRlcm1zWzBdLCB0ZXJtc1sxXSwgdHJ1ZSwgdGhpcy5taW4sIG91dF9jb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID1vLm91dDtcclxuICAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IG8ub3V0X25vZGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRlcm1zLmxlbmd0aCAtIDE7IGkgPiBsOyBpICs9IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbyA9IHRoaXMucm9vdC5yZW1vdmUodGVybXNbaV0sIHRlcm1zW2kgKyAxXSwgdHJ1ZSwgdGhpcy5taW4sIG91dF9jb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IG8ub3V0O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IG8ub3V0X25vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2l6ZSAtPSByZXN1bHQ7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQgIT09IDA7XHJcbiAgICB9XHJcblxyXG4gICAgX19nZXRBbGxfXyhfX3JldHVybl9kYXRhX18pIHtcclxuICAgICAgICBpZiAodGhpcy5yb290KVxyXG4gICAgICAgICAgICB0aGlzLnJvb3QuZ2V0KC1JbmZpbml0eSwgSW5maW5pdHksIF9fcmV0dXJuX2RhdGFfXyk7XHJcbiAgICAgICAgcmV0dXJuIF9fcmV0dXJuX2RhdGFfXztcclxuICAgIH1cclxuXHJcbiAgICBfX3JlbW92ZUFsbF9fKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJvb3QpXHJcbiAgICAgICAgICAgIHRoaXMucm9vdC5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgdGhpcy5yb290ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgbGV0IG91dF9kYXRhID0gW107XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJvb3QpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucm9vdC5nZXQoLUluZmluaXR5LCBJbmZpbml0eSwgb3V0X2RhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dF9kYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBCdHJlZU5vZGUge1xyXG4gICAgY29uc3RydWN0b3IoSVNfTEVBRiA9IGZhbHNlKSB7XHJcbiAgICAgICAgdGhpcy5MRUFGID0gSVNfTEVBRjtcclxuICAgICAgICB0aGlzLm5vZGVzID0gW107XHJcbiAgICAgICAgdGhpcy5rZXlzID0gW107XHJcbiAgICAgICAgdGhpcy5pdGVtcyA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5rZXlzID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLkxFQUYpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm5vZGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZXNbaV0uZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYmFsYW5jZUluc2VydChtYXhfc2l6ZSwgSVNfUk9PVCA9IGZhbHNlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMua2V5cy5sZW5ndGggPj0gbWF4X3NpemUpIHtcclxuICAgICAgICAgICAgLy9uZWVkIHRvIHNwbGl0IHRoaXMgdXAhXHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3bm9kZSA9IG5ldyBCdHJlZU5vZGUodGhpcy5MRUFGKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcGxpdCA9IChtYXhfc2l6ZSA+PiAxKSB8IDA7XHJcblxyXG4gICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5rZXlzW3NwbGl0XTtcclxuXHJcbiAgICAgICAgICAgIGxldCBsZWZ0X2tleXMgPSB0aGlzLmtleXMuc2xpY2UoMCwgc3BsaXQpO1xyXG4gICAgICAgICAgICBsZXQgbGVmdF9ub2RlcyA9IHRoaXMubm9kZXMuc2xpY2UoMCwgKHRoaXMuTEVBRikgPyBzcGxpdCA6IHNwbGl0ICsgMSlcclxuXHJcbiAgICAgICAgICAgIGxldCByaWdodF9rZXlzID0gdGhpcy5rZXlzLnNsaWNlKCh0aGlzLkxFQUYpID8gc3BsaXQgOiBzcGxpdCArIDEpO1xyXG4gICAgICAgICAgICBsZXQgcmlnaHRfbm9kZXMgPSB0aGlzLm5vZGVzLnNsaWNlKCh0aGlzLkxFQUYpID8gc3BsaXQgOiBzcGxpdCArIDEpO1xyXG5cclxuICAgICAgICAgICAgbmV3bm9kZS5rZXlzID0gcmlnaHRfa2V5cztcclxuICAgICAgICAgICAgbmV3bm9kZS5ub2RlcyA9IHJpZ2h0X25vZGVzO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5rZXlzID0gbGVmdF9rZXlzO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGVzID0gbGVmdF9ub2RlcztcclxuXHJcbiAgICAgICAgICAgIGlmIChJU19ST09UKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJvb3QgPSBuZXcgQnRyZWVOb2RlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcm9vdC5rZXlzLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgICAgIHJvb3Qubm9kZXMucHVzaCh0aGlzLCBuZXdub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld25vZGU6IHJvb3QsXHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXlcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBuZXdub2RlOiBuZXdub2RlLFxyXG4gICAgICAgICAgICAgICAga2V5OiBrZXlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmV3bm9kZTogdGhpcyxcclxuICAgICAgICAgICAga2V5OiAwXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBJbnNlcnRzIG1vZGVsIGludG8gdGhlIHRyZWUsIHNvcnRlZCBieSBpZGVudGlmaWVyLiBcclxuICAgICovXHJcbiAgICBpbnNlcnQoaWRlbnRpZmllciwgbW9kZWwsIG1heF9zaXplLCBJU19ST09UID0gZmFsc2UsIHJlc3VsdCkge1xyXG5cclxuICAgICAgICBsZXQgbCA9IHRoaXMua2V5cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5MRUFGKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgPCBrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXMubm9kZXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBvID0gbm9kZS5pbnNlcnQoaWRlbnRpZmllciwgbW9kZWwsIG1heF9zaXplLCBmYWxzZSwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQga2V5ciA9IG8ua2V5O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdub2RlID0gby5uZXdub2RlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ciA9PSB1bmRlZmluZWQpIGRlYnVnZ2VyXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdub2RlICE9IG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5rZXlzLnNwbGljZShpLCAwLCBrZXlyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2Rlcy5zcGxpY2UoaSArIDEsIDAsIG5ld25vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFsYW5jZUluc2VydChtYXhfc2l6ZSwgSVNfUk9PVCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlID0gdGhpcy5ub2Rlc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGxldCB7XHJcbiAgICAgICAgICAgICAgICBuZXdub2RlLFxyXG4gICAgICAgICAgICAgICAga2V5XHJcbiAgICAgICAgICAgIH0gPSBub2RlLmluc2VydChpZGVudGlmaWVyLCBtb2RlbCwgbWF4X3NpemUsIGZhbHNlLCByZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGtleSA9PSB1bmRlZmluZWQpIGRlYnVnZ2VyXHJcblxyXG4gICAgICAgICAgICBpZiAobmV3bm9kZSAhPSBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtleXMucHVzaChrZXkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2Rlcy5wdXNoKG5ld25vZGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iYWxhbmNlSW5zZXJ0KG1heF9zaXplLCBJU19ST09UKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5rZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaWRlbnRpZmllciA9PSBrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVzW2ldLmFkZChrZXkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQuYWRkZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3bm9kZTogdGhpcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBpZGVudGlmaWVyXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaWRlbnRpZmllciA8IGtleSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmtleXMuc3BsaWNlKGksIDAsIGlkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZXMuc3BsaWNlKGksIDAsIG1vZGVsKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFsYW5jZUluc2VydChtYXhfc2l6ZSwgSVNfUk9PVCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMua2V5cy5wdXNoKGlkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGVzLnB1c2gobW9kZWwpO1xyXG5cclxuICAgICAgICAgICAgcmVzdWx0LmFkZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJhbGFuY2VJbnNlcnQobWF4X3NpemUsIElTX1JPT1QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmV3bm9kZTogdGhpcyxcclxuICAgICAgICAgICAga2V5OiBpZGVudGlmaWVyLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYmFsYW5jZVJlbW92ZShpbmRleCwgbWluX3NpemUpIHtcclxuICAgICAgICBsZXQgbGVmdCA9IHRoaXMubm9kZXNbaW5kZXggLSAxXTtcclxuICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLm5vZGVzW2luZGV4ICsgMV07XHJcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGVzW2luZGV4XTtcclxuXHJcbiAgICAgICAgLy9MZWZ0IHJvdGF0ZVxyXG4gICAgICAgIGlmIChsZWZ0ICYmIGxlZnQua2V5cy5sZW5ndGggPiBtaW5fc2l6ZSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IGxrID0gbGVmdC5rZXlzLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGxuID0gbGVmdC5ub2Rlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBub2RlLmtleXMudW5zaGlmdCgobm9kZS5MRUFGKSA/IGxlZnQua2V5c1tsayAtIDFdIDogdGhpcy5rZXlzW2luZGV4IC0gMV0pO1xyXG4gICAgICAgICAgICBub2RlLm5vZGVzLnVuc2hpZnQobGVmdC5ub2Rlc1tsbiAtIDFdKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMua2V5c1tpbmRleCAtIDFdID0gbGVmdC5rZXlzW2xrIC0gMV07XHJcblxyXG4gICAgICAgICAgICBsZWZ0LmtleXMubGVuZ3RoID0gbGsgLSAxO1xyXG4gICAgICAgICAgICBsZWZ0Lm5vZGVzLmxlbmd0aCA9IGxuIC0gMTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAvL1JpZ2h0IHJvdGF0ZVxyXG4gICAgICAgIGlmIChyaWdodCAmJiByaWdodC5rZXlzLmxlbmd0aCA+IG1pbl9zaXplKSB7XHJcblxyXG4gICAgICAgICAgICBub2RlLmtleXMucHVzaCgobm9kZS5MRUFGKSA/IHJpZ2h0LmtleXNbMF0gOiB0aGlzLmtleXNbaW5kZXhdKTtcclxuICAgICAgICAgICAgbm9kZS5ub2Rlcy5wdXNoKHJpZ2h0Lm5vZGVzWzBdKTtcclxuXHJcbiAgICAgICAgICAgIHJpZ2h0LmtleXMuc3BsaWNlKDAsIDEpO1xyXG4gICAgICAgICAgICByaWdodC5ub2Rlcy5zcGxpY2UoMCwgMSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmtleXNbaW5kZXhdID0gKG5vZGUuTEVBRikgPyByaWdodC5rZXlzWzFdIDogcmlnaHQua2V5c1swXTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIC8vTGVmdCBvciBSaWdodCBNZXJnZVxyXG4gICAgICAgICAgICBpZiAoIWxlZnQpIHtcclxuICAgICAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICBsZWZ0ID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIG5vZGUgPSByaWdodDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tpbmRleCAtIDFdO1xyXG4gICAgICAgICAgICB0aGlzLmtleXMuc3BsaWNlKGluZGV4IC0gMSwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICAgICAgICAgIGxlZnQubm9kZXMgPSBsZWZ0Lm5vZGVzLmNvbmNhdChub2RlLm5vZGVzKTtcclxuICAgICAgICAgICAgaWYgKCFsZWZ0LkxFQUYpIGxlZnQua2V5cy5wdXNoKGtleSlcclxuICAgICAgICAgICAgbGVmdC5rZXlzID0gbGVmdC5rZXlzLmNvbmNhdChub2RlLmtleXMpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmIChsZWZ0LkxFQUYpXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlZnQua2V5cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGVmdC5rZXlzW2ldICE9IGxlZnQubm9kZXNbaV0uaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICByZW1vdmUoc3RhcnQsIGVuZCwgSVNfUk9PVCA9IGZhbHNlLCBtaW5fc2l6ZSwgb3V0X2NvbnRhaW5lcikge1xyXG4gICAgICAgIGxldCBsID0gdGhpcy5rZXlzLmxlbmd0aCxcclxuICAgICAgICAgICAgb3V0ID0gMCxcclxuICAgICAgICAgICAgb3V0X25vZGUgPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuTEVBRikge1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5rZXlzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzdGFydCA8PSBrZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IHRoaXMubm9kZXNbaV0ucmVtb3ZlKHN0YXJ0LCBlbmQsIGZhbHNlLCBtaW5fc2l6ZSwgb3V0X2NvbnRhaW5lcikub3V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBvdXQgKz0gdGhpcy5ub2Rlc1tpXS5yZW1vdmUoc3RhcnQsIGVuZCwgZmFsc2UsIG1pbl9zaXplLCBvdXRfY29udGFpbmVyKS5vdXQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm5vZGVzW2ldLmtleXMubGVuZ3RoIDwgbWluX3NpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5iYWxhbmNlUmVtb3ZlKGksIG1pbl9zaXplKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZXMubGVuZ3RoID09IDEpXHJcbiAgICAgICAgICAgICAgICBvdXRfbm9kZSA9IHRoaXMubm9kZXNbMF07XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMua2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA8PSBlbmQgJiYga2V5ID49IHN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0X2NvbnRhaW5lci5wdXNoKHRoaXMubm9kZXNbaV0pXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5rZXlzLnNwbGljZShpLCAxKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGwtLTtcclxuICAgICAgICAgICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG91dF9ub2RlLFxyXG4gICAgICAgICAgICBvdXRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGdldChzdGFydCwgZW5kLCBvdXRfY29udGFpbmVyKSB7XHJcblxyXG4gICAgICAgIGlmICghc3RhcnQgfHwgIWVuZClcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuTEVBRikge1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPD0ga2V5KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZXNbaV0uZ2V0KHN0YXJ0LCBlbmQsIG91dF9jb250YWluZXIpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMubm9kZXNbaV0uZ2V0KHN0YXJ0LCBlbmQsIG91dF9jb250YWluZXIsIClcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBvdXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5rZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5IDw9IGVuZCAmJiBrZXkgPj0gc3RhcnQpXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0X2NvbnRhaW5lci5wdXNoKHRoaXMubm9kZXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgQlRyZWVNb2RlbENvbnRhaW5lclxyXG59IiwiaW1wb3J0IHtcclxuICAgIFNjaGVtYVR5cGVcclxufSBmcm9tIFwiLi9zY2hlbWFfdHlwZS5qc1wiXHJcblxyXG5sZXQgTlVNQkVSID0gbmV3KGNsYXNzIE51bWJlclNjaGVtYSBleHRlbmRzIFNjaGVtYVR5cGUge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdGFydF92YWx1ZSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2UodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmVyaWZ5KHZhbHVlLCByZXN1bHQpIHtcclxuICAgICAgICByZXN1bHQudmFsaWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZih2YWx1ZSA9PSBOYU4gfHwgdmFsdWUgPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgcmVzdWx0LnZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJlc3VsdC5yZWFzb24gPSBcIkludmFsaWQgbnVtYmVyIHR5cGUuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcihpZGVudGlmaWVyLCBmaWx0ZXJzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBmaWx0ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllciA9PSBmaWx0ZXJzW2ldKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbn0pKClcclxuXHJcbmV4cG9ydCB7XHJcbiAgICBOVU1CRVJcclxufTsiLCJjb25zdCBtb250aHMgPSBbe1xyXG4gICAgbmFtZTogXCJKYW51YXJ5XCIsXHJcbiAgICBkYXlzOiAzMSxcclxuICAgIGRheV9vZmZzZXQ6IDAsXHJcbiAgICBkYXlfb2Zmc2VfbGVhcHQ6IDBcclxufSwge1xyXG4gICAgbmFtZTogXCJGZWJydWFyeVwiLFxyXG4gICAgZGF5czogMjgsXHJcbiAgICBkYXlfb2Zmc2V0OiAzMSxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogMzFcclxufSwge1xyXG4gICAgbmFtZTogXCJNYXJjaFwiLFxyXG4gICAgZGF5czogMzEsXHJcbiAgICBkYXlfb2Zmc2V0OiA1OSxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogNjBcclxufSwge1xyXG4gICAgbmFtZTogXCJBcHJpbFwiLFxyXG4gICAgZGF5czogMzAsXHJcbiAgICBkYXlfb2Zmc2V0OiA5MCxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogOTFcclxufSwge1xyXG4gICAgbmFtZTogXCJNYXlcIixcclxuICAgIGRheXM6IDMxLFxyXG4gICAgZGF5X29mZnNldDogMTIwLFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiAxMjFcclxufSwge1xyXG4gICAgbmFtZTogXCJKdW5lXCIsXHJcbiAgICBkYXlzOiAzMCxcclxuICAgIGRheV9vZmZzZXQ6IDE1MSxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogMTUyXHJcbn0sIHtcclxuICAgIG5hbWU6IFwiSnVseVwiLFxyXG4gICAgZGF5czogMzEsXHJcbiAgICBkYXlfb2Zmc2V0OiAxODEsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDE4MlxyXG59LCB7XHJcbiAgICBuYW1lOiBcIkF1Z3VzdFwiLFxyXG4gICAgZGF5czogMzEsXHJcbiAgICBkYXlfb2Zmc2V0OiAyMTIsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDIxM1xyXG59LCB7XHJcbiAgICBuYW1lOiBcIlNlcHRlbWJlclwiLFxyXG4gICAgZGF5czogMzAsXHJcbiAgICBkYXlfb2Zmc2V0OiAyNDMsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDI0NFxyXG59LCB7XHJcbiAgICBuYW1lOiBcIk9jdG9iZXJcIixcclxuICAgIGRheXM6IDMxLFxyXG4gICAgZGF5X29mZnNldDogMjczLFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiAyNzRcclxufSwge1xyXG4gICAgbmFtZTogXCJOb3ZlbWJlclwiLFxyXG4gICAgZGF5czogMzAsXHJcbiAgICBkYXlfb2Zmc2V0OiAzMDQsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDMwNVxyXG59LCB7XHJcbiAgICBuYW1lOiBcIkRlY2VtYmVyXCIsXHJcbiAgICBkYXlzOiAzMSxcclxuICAgIGRheV9vZmZzZXQ6IDMzLFxyXG4gICAgZGF5X29mZnNlX2xlYXB0OiAzMzVcclxufV1cclxuXHJcbmV4cG9ydCB7bW9udGhzfSIsIlxyXG52YXIgZG93ID0gW1wiU3VuZGF5XCIsIFwiTW9uZGF5XCIsIFwiVHVlc2RheVwiLCBcIldlZG5lc2RheVwiLCBcIlRodXJzZGF5XCIsIFwiRnJpZGF5XCIsIFwiU2F0dXJkYXlcIl07XHJcblxyXG5leHBvcnQge2Rvd30iLCJmdW5jdGlvbiBHZXREYXlTdGFydEFuZEVuZChkYXRlKSB7XHJcbiAgICB2YXIgcnZhbCA9IHtcclxuICAgICAgICBzdGFydDogMCxcclxuICAgICAgICBlbmQ6IDBcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGRhdGUgaW5zdGFuY2VvZiBEYXRlIHx8IHR5cGVvZihkYXRlKSA9PSBcIm51bWJlclwiICkge1xyXG4gICAgICAgIHZhciBkID0gbmV3IERhdGUoZGF0ZSk7XHJcblxyXG4gICAgICAgIGQuc2V0SG91cnMoMCk7XHJcbiAgICAgICAgZC5zZXRNaW51dGVzKDApO1xyXG4gICAgICAgIGQuc2V0U2Vjb25kcygwKTtcclxuICAgICAgICBkLnNldE1pbGxpc2Vjb25kcygwKVxyXG5cclxuICAgICAgICBydmFsLnN0YXJ0ID0gZC52YWx1ZU9mKCk7XHJcbiAgICAgICAgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgZC5zZXRTZWNvbmRzKC0xKTtcclxuICAgICAgICBydmFsLmVuZCA9IGQudmFsdWVPZigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBydmFsO1xyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgR2V0RGF5U3RhcnRBbmRFbmRcclxufSIsImZ1bmN0aW9uIGZsb2F0MjR0bzEyTW9kVGltZSh0aW1lLCBDQVBJVEFMKSB7XHJcbiAgICB2YXIgSVNfUE0gPSB0aW1lID49IDEyICYmIHRpbWUgPCAyNDtcclxuICAgIHZhciBtaW51dGVzID0gKCh0aW1lICUgMSkgKiA2MCkgfCAwO1xyXG4gICAgdmFyIGhvdXJzID0gKCgodGltZSB8IDApICUgMTIpICE9IDApID8gKHRpbWUgfCAwKSAlIDEyIDogMTI7XHJcblxyXG4gICAgcmV0dXJuIChob3VycyArIFwiOlwiICsgKFwiMFwiICsgbWludXRlcykuc2xpY2UoLTIpKSArICgoSVNfUE0pID8gKENBUElUQUwpID8gXCJQTVwiIDpcInBtXCIgOiAoQ0FQSVRBTCkgPyBcIkFNXCIgOiBcImFtXCIpO1xyXG59XHJcblxyXG5leHBvcnQge2Zsb2F0MjR0bzEyTW9kVGltZX0iLCJjbGFzcyBQb2ludDJEIGV4dGVuZHMgRmxvYXQ2NEFycmF5e1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKHgsIHkpIHtcclxuXHRcdHN1cGVyKDIpXHJcblxyXG5cdFx0aWYgKHR5cGVvZih4KSA9PSBcIm51bWJlclwiKSB7XHJcblx0XHRcdHRoaXNbMF0gPSB4O1xyXG5cdFx0XHR0aGlzWzFdID0geTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh4IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuXHRcdFx0dGhpc1swXSA9IHhbMF07XHJcblx0XHRcdHRoaXNbMV0gPSB4WzFdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZHJhdyhjdHgsIHMgPSAxKXtcclxuXHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdGN0eC5tb3ZlVG8odGhpcy54KnMsdGhpcy55KnMpO1xyXG5cdFx0Y3R4LmFyYyh0aGlzLngqcywgdGhpcy55KnMsIHMqMC4wMSwgMCwgMipNYXRoLlBJKTtcclxuXHRcdGN0eC5zdHJva2UoKTtcclxuXHR9XHJcblxyXG5cdGdldCB4ICgpeyByZXR1cm4gdGhpc1swXX1cclxuXHRzZXQgeCAodil7aWYodHlwZW9mKHYpICE9PSBcIm51bWJlclwiKSByZXR1cm47IHRoaXNbMF0gPSB2fVxyXG5cclxuXHRnZXQgeSAoKXsgcmV0dXJuIHRoaXNbMV19XHJcblx0c2V0IHkgKHYpe2lmKHR5cGVvZih2KSAhPT0gXCJudW1iZXJcIikgcmV0dXJuOyB0aGlzWzFdID0gdn1cclxufVxyXG5cclxuZXhwb3J0IHtQb2ludDJEfSIsImltcG9ydCB7XHJcbiAgICBQb2ludDJEXHJcbn0gZnJvbSBcIi4vcG9pbnQyRFwiXHJcblxyXG5mdW5jdGlvbiBjdXJ2ZVBvaW50KGN1cnZlLCB0KSB7XHJcbiAgICB2YXIgcG9pbnQgPSB7XHJcbiAgICAgICAgeDogMCxcclxuICAgICAgICB5OiAwXHJcbiAgICB9O1xyXG4gICAgcG9pbnQueCA9IHBvc09uQ3VydmUodCwgY3VydmVbMF0sIGN1cnZlWzJdLCBjdXJ2ZVs0XSk7XHJcbiAgICBwb2ludC55ID0gcG9zT25DdXJ2ZSh0LCBjdXJ2ZVsxXSwgY3VydmVbM10sIGN1cnZlWzVdKTtcclxuICAgIHJldHVybiBwb2ludDtcclxufVxyXG5cclxuZnVuY3Rpb24gcG9zT25DdXJ2ZSh0LCBwMSwgcDIsIHAzKSB7XHJcbiAgICB2YXIgdGkgPSAxIC0gdDtcclxuICAgIHJldHVybiB0aSAqIHRpICogcDEgKyAyICogdGkgKiB0ICogcDIgKyB0ICogdCAqIHAzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzcGxpdEN1cnZlKGJwLCB0KSB7XHJcbiAgICB2YXIgbGVmdCA9IFtdO1xyXG4gICAgdmFyIHJpZ2h0ID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gZHJhd0N1cnZlKGJwLCB0KSB7XHJcbiAgICAgICAgaWYgKGJwLmxlbmd0aCA9PSAyKSB7XHJcbiAgICAgICAgICAgIGxlZnQucHVzaChicFswXSwgYnBbMV0pO1xyXG4gICAgICAgICAgICByaWdodC5wdXNoKGJwWzBdLCBicFsxXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIG5ld19icCA9IFtdIC8vYnAuc2xpY2UoMCwtMik7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnAubGVuZ3RoIC0gMjsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdC5wdXNoKGJwW2ldLCBicFtpICsgMV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gYnAubGVuZ3RoIC0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0LnB1c2goYnBbaSArIDJdLCBicFtpICsgM10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbmV3X2JwLnB1c2goKDEgLSB0KSAqIGJwW2ldICsgdCAqIGJwW2kgKyAyXSk7XHJcbiAgICAgICAgICAgICAgICBuZXdfYnAucHVzaCgoMSAtIHQpICogYnBbaSArIDFdICsgdCAqIGJwW2kgKyAzXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZHJhd0N1cnZlKG5ld19icCwgdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdDdXJ2ZShicCwgdCk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB4OiBuZXcgUUJlemllcihyaWdodCksXHJcbiAgICAgICAgeTogbmV3IFFCZXppZXIobGVmdClcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGN1cnZlSW50ZXJzZWN0aW9ucyhwMSwgcDIsIHAzKSB7XHJcbiAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHtcclxuICAgICAgICBhOiBJbmZpbml0eSxcclxuICAgICAgICBiOiBJbmZpbml0eVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgYSA9IHAxIC0gMiAqIHAyICsgcDM7XHJcblxyXG4gICAgdmFyIGIgPSAyICogKHAyIC0gcDEpO1xyXG5cclxuICAgIHZhciBjID0gcDE7XHJcblxyXG4gICAgaWYgKGIgPT0gMCkge30gZWxzZSBpZiAoTWF0aC5hYnMoYSkgPCAwLjAwMDAwMDAwMDA1KSB7XHJcbiAgICAgICAgaW50ZXJzZWN0aW9ucy5hID0gKC1jIC8gYik7IC8vYyAvIGI7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBpbnRlcnNlY3Rpb25zLmEgPSAoKC1iIC0gTWF0aC5zcXJ0KChiICogYikgLSA0ICogYSAqIGMpKSAvICgyICogYSkpO1xyXG4gICAgICAgIGludGVyc2VjdGlvbnMuYiA9ICgoLWIgKyBNYXRoLnNxcnQoKGIgKiBiKSAtIDQgKiBhICogYykpIC8gKDIgKiBhKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW50ZXJzZWN0aW9uc1xyXG59XHJcblxyXG5jbGFzcyBRQmV6aWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHgxLCB5MSwgeDIsIHkyLCB4MywgeTMpIHtcclxuICAgICAgICB0aGlzLngxID0gMDtcclxuICAgICAgICB0aGlzLngyID0gMDtcclxuICAgICAgICB0aGlzLngzID0gMDtcclxuICAgICAgICB0aGlzLnkxID0gMDtcclxuICAgICAgICB0aGlzLnkyID0gMDtcclxuICAgICAgICB0aGlzLnkzID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZih4MSkgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICB0aGlzLngxID0geDE7XHJcbiAgICAgICAgICAgIHRoaXMueDIgPSB4MjtcclxuICAgICAgICAgICAgdGhpcy54MyA9IHgzO1xyXG4gICAgICAgICAgICB0aGlzLnkxID0geTE7XHJcbiAgICAgICAgICAgIHRoaXMueTIgPSB5MjtcclxuICAgICAgICAgICAgdGhpcy55MyA9IHkzO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoeDEgaW5zdGFuY2VvZiBRQmV6aWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueDEgPSB4MS54MTtcclxuICAgICAgICAgICAgdGhpcy54MiA9IHgxLngyO1xyXG4gICAgICAgICAgICB0aGlzLngzID0geDEueDM7XHJcbiAgICAgICAgICAgIHRoaXMueTEgPSB4MS55MTtcclxuICAgICAgICAgICAgdGhpcy55MiA9IHgxLnkyO1xyXG4gICAgICAgICAgICB0aGlzLnkzID0geDEueTM7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh4MSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIHRoaXMueDEgPSB4MVswXTtcclxuICAgICAgICAgICAgdGhpcy55MSA9IHgxWzFdO1xyXG4gICAgICAgICAgICB0aGlzLngyID0geDFbMl07XHJcbiAgICAgICAgICAgIHRoaXMueTIgPSB4MVszXTtcclxuICAgICAgICAgICAgdGhpcy54MyA9IHgxWzRdO1xyXG4gICAgICAgICAgICB0aGlzLnkzID0geDFbNV07XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV2ZXJzZSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFFCZXppZXIoXHJcbiAgICAgICAgICAgIHRoaXMueDMsXHJcbiAgICAgICAgICAgIHRoaXMueTMsXHJcbiAgICAgICAgICAgIHRoaXMueDIsXHJcbiAgICAgICAgICAgIHRoaXMueTIsXHJcbiAgICAgICAgICAgIHRoaXMueDEsXHJcbiAgICAgICAgICAgIHRoaXMueTFcclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgcG9pbnQodCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQyRChcclxuICAgICAgICAgICAgcG9zT25DdXJ2ZSh0LCB0aGlzLngxLCB0aGlzLngyLCB0aGlzLngzKSxcclxuICAgICAgICAgICAgcG9zT25DdXJ2ZSh0LCB0aGlzLnkxLCB0aGlzLnkyLCB0aGlzLnkzKSlcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdGFuZ2VudCh0KSB7XHJcbiAgICAgICAgdmFyIHRhbiA9IHtcclxuICAgICAgICAgICAgeDogMCxcclxuICAgICAgICAgICAgeTogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBweDEgPSB0aGlzLngyIC0gdGhpcy54MTtcclxuICAgICAgICB2YXIgcHkxID0gdGhpcy55MiAtIHRoaXMueTE7XHJcblxyXG4gICAgICAgIHZhciBweDIgPSB0aGlzLngzIC0gdGhpcy54MjtcclxuICAgICAgICB2YXIgcHkyID0gdGhpcy55MyAtIHRoaXMueTI7XHJcblxyXG4gICAgICAgIHRhbi54ID0gKDEgLSB0KSAqIHB4MSArIHQgKiBweDI7XHJcbiAgICAgICAgdGFuLnkgPSAoMSAtIHQpICogcHkxICsgdCAqIHB5MjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRhbjtcclxuICAgIH1cclxuXHJcbiAgICB0b0FycmF5KCkge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy54MSwgdGhpcy55MSwgdGhpcy54MiwgdGhpcy55MiwgdGhpcy54MywgdGhpcy55M107XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQodCkge1xyXG4gICAgICAgIHJldHVybiBzcGxpdEN1cnZlKHRoaXMudG9BcnJheSgpLCB0KTtcclxuICAgIH1cclxuXHJcbiAgICByb290c1ggKCl7XHJcbiAgICBcdHJldHVybiB0aGlzLnJvb3RzKFxyXG4gICAgXHRcdHRoaXMueDEsIFxyXG4gICAgXHRcdHRoaXMueDIsXHJcbiAgICBcdFx0dGhpcy54M1xyXG4gICAgXHRcdClcclxuICAgIFx0XHJcbiAgICB9XHJcblxyXG4gICAgcm9vdHMocDEsIHAyLCBwMykge1xyXG4gICAgICAgIHZhciBjdXJ2ZSA9IHRoaXMudG9BcnJheSgpO1xyXG5cclxuICAgICAgICB2YXIgYyA9IHAxIC0gKDIqcDIpICsgcDM7XHJcbiAgICAgICAgdmFyIGIgPSAyKihwMiAtIHAxKTtcclxuICAgICAgICB2YXIgYSA9IHAxO1xyXG4gICAgICAgIHZhciBhMiA9IGEqMjtcclxuICAgICAgICBjb25zb2xlLmxvZyhjICxcIiBjXCIpXHJcbiAgICAgICAgdmFyIHNxcnQgPSBNYXRoLnNxcnQoYipiIC0gKGEgKiA0ICpjKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coc3FydCwgYiwgYTIsIHAzKVxyXG4gICAgICAgIHZhciB0MSA9ICgtYiArIHNxcnQpIC8gYTI7XHJcbiAgICAgICAgdmFyIHQyID0gKC1iIC0gc3FydCkgLyBhMjtcclxuXHJcbiAgICAgICAgcmV0dXJuIFsgdDEgLCB0MiBdO1xyXG4gICAgfSBcclxuXHJcbiAgICByb290c2EoKSB7XHJcbiAgICAgICAgdmFyIGN1cnZlID0gdGhpcy50b0FycmF5KCk7XHJcblxyXG4gICAgICAgIHZhciBwMSA9IGN1cnZlWzFdO1xyXG4gICAgICAgIHZhciBwMiA9IGN1cnZlWzNdO1xyXG4gICAgICAgIHZhciBwMyA9IGN1cnZlWzVdO1xyXG4gICAgICAgIHZhciB4MSA9IGN1cnZlWzBdO1xyXG4gICAgICAgIHZhciB4MiA9IGN1cnZlWzJdO1xyXG4gICAgICAgIHZhciB4MyA9IGN1cnZlWzRdO1xyXG5cclxuICAgICAgICB2YXIgcHkxZCA9IDIgKiAocDIgLSBwMSk7XHJcbiAgICAgICAgdmFyIHB5MmQgPSAyICogKHAzIC0gcDIpO1xyXG4gICAgICAgIHZhciBhZDEgPSAtcHkxZCArIHB5MmQ7XHJcbiAgICAgICAgdmFyIGJkMSA9IHB5MWQ7XHJcblxyXG4gICAgICAgIHZhciBweDFkID0gMiAqICh4MiAtIHgxKTtcclxuICAgICAgICB2YXIgcHgyZCA9IDIgKiAoeDMgLSB4Mik7XHJcbiAgICAgICAgdmFyIGFkMiA9IC1weDFkICsgcHgyZDtcclxuICAgICAgICB2YXIgYmQyID0gcHgxZDtcclxuXHJcbiAgICAgICAgdmFyIHQxID0gLWJkMSAvIGFkMTtcclxuICAgICAgICB2YXIgdDIgPSAtYmQyIC8gYWQyO1xyXG5cclxuICAgICAgICByZXR1cm4gWyB0MSAsIHQyIF07XHJcbiAgICB9XHJcblxyXG4gICAgYm91bmRpbmdCb3goKSB7XHJcbiAgICAgICAgdmFyIHgxID0gY3VydmVbMF07XHJcbiAgICAgICAgdmFyIHkxID0gY3VydmVbMV07XHJcbiAgICAgICAgdmFyIHgyID0gY3VydmVbMl07XHJcbiAgICAgICAgdmFyIHkyID0gY3VydmVbM107XHJcbiAgICAgICAgdmFyIHgzID0gY3VydmVbNF07XHJcbiAgICAgICAgdmFyIHkzID0gY3VydmVbNV07XHJcbiAgICAgICAgdmFyIHJvb3RzID0gZ2V0Um9vdHNDbGFtcGVkKGN1cnZlKTtcclxuICAgICAgICB2YXIgbWluX3ggPSBNYXRoLm1pbih4MSwgeDIsIHgzLCByb290cy55WzBdIHx8IEluZmluaXR5LCByb290cy54WzBdIHx8IEluZmluaXR5KTtcclxuICAgICAgICB2YXIgbWluX3kgPSBNYXRoLm1pbih5MSwgeTIsIHkzLCByb290cy55WzFdIHx8IEluZmluaXR5LCByb290cy54WzFdIHx8IEluZmluaXR5KTtcclxuICAgICAgICB2YXIgbWF4X3ggPSBNYXRoLm1heCh4MSwgeDIsIHgzLCByb290cy55WzBdIHx8IC1JbmZpbml0eSwgcm9vdHMueFswXSB8fCAtSW5maW5pdHkpO1xyXG4gICAgICAgIHZhciBtYXhfeSA9IE1hdGgubWF4KHkxLCB5MiwgeTMsIHJvb3RzLnlbMV0gfHwgLUluZmluaXR5LCByb290cy54WzFdIHx8IC1JbmZpbml0eSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG1pbjoge1xyXG4gICAgICAgICAgICAgICAgeDogbWluX3gsXHJcbiAgICAgICAgICAgICAgICB5OiBtaW5feVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtYXg6IHtcclxuICAgICAgICAgICAgICAgIHg6IG1heF94LFxyXG4gICAgICAgICAgICAgICAgeTogbWF4X3lcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRlKGFuZ2xlLCBvZmZzZXQpIHtcclxuICAgICAgICBhbmdsZSA9IChhbmdsZSAvIDE4MCkgKiBNYXRoLlBJO1xyXG5cclxuICAgICAgICB2YXIgbmV3X2N1cnZlID0gdGhpcy50b0FycmF5KCk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gY3VydmVbaV0gLSBvZmZzZXQueDtcclxuICAgICAgICAgICAgdmFyIHkgPSBjdXJ2ZVtpICsgMV0gLSBvZmZzZXQueTtcclxuICAgICAgICAgICAgbmV3X2N1cnZlW2ldID0gKCh4ICogTWF0aC5jb3MoYW5nbGUpIC0geSAqIE1hdGguc2luKGFuZ2xlKSkpICsgb2Zmc2V0Lng7XHJcbiAgICAgICAgICAgIG5ld19jdXJ2ZVtpICsgMV0gPSAoKHggKiBNYXRoLnNpbihhbmdsZSkgKyB5ICogTWF0aC5jb3MoYW5nbGUpKSkgKyBvZmZzZXQueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUUJlemllcihuZXdfY3VydmUpO1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyc2VjdHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogY3VydmVJbnRlcnNlY3Rpb25zKHRoaXMueDEsIHRoaXMueDIsIHRoaXMueDMpLFxyXG4gICAgICAgICAgICB5OiBjdXJ2ZUludGVyc2VjdGlvbnModGhpcy55MSwgdGhpcy55MiwgdGhpcy55MylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKHgsIHkpIHtcclxuICAgICAgICBpZiAodHlwZW9mKHgpID09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBRQmV6aWVyKFxyXG4gICAgICAgICAgICAgICAgdGhpcy54MSArIHgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnkxICsgeSxcclxuICAgICAgICAgICAgICAgIHRoaXMueDIgKyB4LFxyXG4gICAgICAgICAgICAgICAgdGhpcy55MiArIHksXHJcbiAgICAgICAgICAgICAgICB0aGlzLngzICsgeCxcclxuICAgICAgICAgICAgICAgIHRoaXMueTMgKyB5LFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgUUJlemllclxyXG59IiwiY29uc3Qgc3FydCA9IE1hdGguc3FydDtcclxuY29uc3QgY29zID0gTWF0aC5jb3M7XHJcbmNvbnN0IGFjb3MgPSBNYXRoLmFjb3M7XHJcbmNvbnN0IFBJID0gTWF0aC5QSTtcclxuY29uc3Qgc2luID0gTWF0aC5zaW47XHJcblxyXG5leHBvcnR7XHJcblx0c3FydCxcclxuXHRjb3MsXHJcblx0c2luLFxyXG5cdGFjb3MsXHJcblx0YWNvczIsXHJcblx0UElcclxufSIsImltcG9ydCB7UG9pbnQyRH0gZnJvbSBcIi4vcG9pbnQyRFwiXHJcbmltcG9ydCB7c3FydCxjb3MsYWNvcyxQSX0gZnJvbSBcIi4vY29uc3RzXCJcclxuXHJcbi8vIEEgaGVscGVyIGZ1bmN0aW9uIHRvIGZpbHRlciBmb3IgdmFsdWVzIGluIHRoZSBbMCwxXSBpbnRlcnZhbDpcclxuZnVuY3Rpb24gYWNjZXB0KHQpIHtcclxuICByZXR1cm4gMDw9dCAmJiB0IDw9MTtcclxufVxyXG5cclxuLy8gQSByZWFsLWN1YmVyb290cy1vbmx5IGZ1bmN0aW9uOlxyXG5mdW5jdGlvbiBjdWJlcm9vdCh2KSB7XHJcbiAgaWYodjwwKSByZXR1cm4gLU1hdGgucG93KC12LDEvMyk7XHJcbiAgcmV0dXJuIE1hdGgucG93KHYsMS8zKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBwb2ludCh0LCBwMSwgcDIsIHAzLCBwNCkge1xyXG5cdHZhciB0aSA9IDEgLSB0O1xyXG5cdHZhciB0aTIgPSB0aSAqIHRpO1xyXG5cdHZhciB0MiA9IHQgKiB0O1xyXG5cclxuXHRyZXR1cm4gdGkgKiB0aTIgKiBwMSArIDMgKiB0aTIgKiB0ICogcDIgKyB0MiAqIDMgKiB0aSAqIHAzICsgdDIgKiB0ICogcDQ7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBDQmV6aWVyIGV4dGVuZHMgRmxvYXQ2NEFycmF5e1xyXG5cdGNvbnN0cnVjdG9yKHgxLCB5MSwgeDIsIHkyLCB4MywgeTMsIHg0LCB5NCkge1xyXG5cdFx0c3VwZXIoOClcclxuXHJcblx0XHQvL01hcCBQMSBhbmQgUDIgdG8gezAsMCwxLDF9IGlmIG9ubHkgZm91ciBhcmd1bWVudHMgYXJlIHByb3ZpZGVkOyBmb3IgdXNlIHdpdGggYW5pbWF0aW9uc1xyXG5cdFx0aWYoYXJndW1lbnRzLmxlbmd0aCA9PSA0KXtcclxuXHRcdFx0dGhpc1swXSA9IDA7XHJcblx0XHRcdHRoaXNbMV0gPSAwO1xyXG5cdFx0XHR0aGlzWzJdID0geDE7XHJcblx0XHRcdHRoaXNbM10gPSB5MTtcclxuXHRcdFx0dGhpc1s0XSA9IHgyO1xyXG5cdFx0XHR0aGlzWzVdID0geTI7XHJcblx0XHRcdHRoaXNbNl0gPSAxO1xyXG5cdFx0XHR0aGlzWzddID0gMTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZiAodHlwZW9mKHgxKSA9PSBcIm51bWJlclwiKSB7XHJcblx0XHRcdHRoaXNbMF0gPSB4MTtcclxuXHRcdFx0dGhpc1sxXSA9IHkxO1xyXG5cdFx0XHR0aGlzWzJdID0geDI7XHJcblx0XHRcdHRoaXNbM10gPSB5MjtcclxuXHRcdFx0dGhpc1s0XSA9IHgzO1xyXG5cdFx0XHR0aGlzWzVdID0geTM7XHJcblx0XHRcdHRoaXNbNl0gPSB4NDtcclxuXHRcdFx0dGhpc1s3XSA9IHk0O1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHgxIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuXHRcdFx0dGhpc1swXSA9IHgxWzBdO1xyXG5cdFx0XHR0aGlzWzFdID0geDFbMV07XHJcblx0XHRcdHRoaXNbMl0gPSB4MVsyXTtcclxuXHRcdFx0dGhpc1szXSA9IHgxWzNdO1xyXG5cdFx0XHR0aGlzWzRdID0geDFbNF07XHJcblx0XHRcdHRoaXNbNV0gPSB4MVs1XTtcclxuXHRcdFx0dGhpc1s2XSA9IHgxWzZdO1xyXG5cdFx0XHR0aGlzWzddID0geDFbNF07XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdldCB4MSAoKXsgcmV0dXJuIHRoaXNbMF19XHJcblx0c2V0IHgxICh2KXt0aGlzWzBdID0gdn1cclxuXHRnZXQgeDIgKCl7IHJldHVybiB0aGlzWzJdfVxyXG5cdHNldCB4MiAodil7dGhpc1syXSA9IHZ9XHJcblx0Z2V0IHgzICgpeyByZXR1cm4gdGhpc1s0XX1cclxuXHRzZXQgeDMgKHYpe3RoaXNbNF0gPSB2fVxyXG5cdGdldCB4NCAoKXsgcmV0dXJuIHRoaXNbNl19XHJcblx0c2V0IHg0ICh2KXt0aGlzWzZdID0gdn1cclxuXHRnZXQgeTEgKCl7IHJldHVybiB0aGlzWzFdfVxyXG5cdHNldCB5MSAodil7dGhpc1sxXSA9IHZ9XHJcblx0Z2V0IHkyICgpeyByZXR1cm4gdGhpc1szXX1cclxuXHRzZXQgeTIgKHYpe3RoaXNbM10gPSB2fVxyXG5cdGdldCB5MyAoKXsgcmV0dXJuIHRoaXNbNV19XHJcblx0c2V0IHkzICh2KXt0aGlzWzVdID0gdn1cclxuXHRnZXQgeTQgKCl7IHJldHVybiB0aGlzWzddfVxyXG5cdHNldCB5NCAodil7dGhpc1s3XSA9IHZ9XHJcblxyXG5cdGFkZCh4LHkgPSAwKXtcclxuXHRcdHJldHVybiBuZXcgQ0N1cnZlKFxyXG5cdFx0XHR0aGlzWzBdICsgeCxcclxuXHRcdFx0dGhpc1sxXSArIHksXHJcblx0XHRcdHRoaXNbMl0gKyB4LFxyXG5cdFx0XHR0aGlzWzNdICsgeSxcclxuXHRcdFx0dGhpc1s0XSArIHgsXHJcblx0XHRcdHRoaXNbNV0gKyB5LFxyXG5cdFx0XHR0aGlzWzZdICsgeCxcclxuXHRcdFx0dGhpc1s3XSArIHlcclxuXHRcdClcclxuXHR9XHJcblxyXG5cdHZhbFkodCl7XHJcblx0XHRyZXR1cm4gcG9pbnQodCwgdGhpc1sxXSwgdGhpc1szXSwgdGhpc1s1XSwgdGhpc1s3XSk7XHJcblx0fVxyXG5cclxuXHR2YWxYKHQpe1xyXG5cdFx0cmV0dXJuIHBvaW50KHQsIHRoaXNbMF0sIHRoaXNbMl0sIHRoaXNbNF0sIHRoaXNbNl0pO1xyXG5cdH1cclxuXHJcblx0cG9pbnQodCkge1xyXG5cdFx0cmV0dXJuIG5ldyBQb2ludDJEKFxyXG5cdFx0XHRwb2ludCh0LCB0aGlzWzBdLCB0aGlzWzJdLCB0aGlzWzRdLCB0aGlzWzZdKSxcclxuXHRcdFx0cG9pbnQodCwgdGhpc1sxXSwgdGhpc1szXSwgdGhpc1s1XSwgdGhpc1s3XSlcclxuXHRcdClcclxuXHR9XHJcblx0XHJcblx0LyoqIFxyXG5cdFx0QXF1aXJlZCBmcm9tIDogaHR0cHM6Ly9wb21heC5naXRodWIuaW8vYmV6aWVyaW5mby9cclxuXHRcdEF1dGhvcjogIE1pa2UgXCJQb21heFwiIEthbWVybWFuc1xyXG5cdFx0R2l0SHViOiBodHRwczovL2dpdGh1Yi5jb20vUG9tYXgvXHJcblx0Ki9cclxuXHJcblx0cm9vdHMocDEscDIscDMscDQpIHtcclxuXHRcdHZhciBkID0gKC1wMSArIDMgKiBwMiAtIDMgKiBwMyArIHA0KSxcclxuXHRcdFx0YSA9ICgzICogcDEgLSA2ICogcDIgKyAzICogcDMpIC8gZCxcclxuXHRcdFx0YiA9ICgtMyAqIHAxICsgMyAqIHAyKSAvIGQsXHJcblx0XHRcdGMgPSBwMSAvIGQ7XHJcblxyXG5cdFx0dmFyIHAgPSAoMyAqIGIgLSBhICogYSkgLyAzLFxyXG5cdFx0XHRwMyA9IHAgLyAzLFxyXG5cdFx0XHRxID0gKDIgKiBhICogYSAqIGEgLSA5ICogYSAqIGIgKyAyNyAqIGMpIC8gMjcsXHJcblx0XHRcdHEyID0gcSAvIDIsXHJcblx0XHRcdGRpc2NyaW1pbmFudCA9IHEyICogcTIgKyBwMyAqIHAzICogcDM7XHJcblxyXG5cdFx0Ly8gYW5kIHNvbWUgdmFyaWFibGVzIHdlJ3JlIGdvaW5nIHRvIHVzZSBsYXRlciBvbjpcclxuXHRcdHZhciB1MSwgdjEsIHJvb3QxLCByb290Miwgcm9vdDM7XHJcblxyXG5cdFx0Ly8gdGhyZWUgcG9zc2libGUgcmVhbCByb290czpcclxuXHRcdGlmIChkaXNjcmltaW5hbnQgPCAwKSB7XHJcblx0XHRcdHZhciBtcDMgPSAtcCAvIDMsXHJcblx0XHRcdFx0bXAzMyA9IG1wMyAqIG1wMyAqIG1wMyxcclxuXHRcdFx0XHRyID0gc3FydChtcDMzKSxcclxuXHRcdFx0XHR0ID0gLXEgLyAoMiAqIHIpLFxyXG5cdFx0XHRcdGNvc3BoaSA9IHQgPCAtMSA/IC0xIDogdCA+IDEgPyAxIDogdCxcclxuXHRcdFx0XHRwaGkgPSBhY29zKGNvc3BoaSksXHJcblx0XHRcdFx0Y3J0ciA9IGN1YmVyb290KHIpLFxyXG5cdFx0XHRcdHQxID0gMiAqIGNydHI7XHJcblx0XHRcdHJvb3QxID0gdDEgKiBjb3MocGhpIC8gMykgLSBhIC8gMztcclxuXHRcdFx0cm9vdDIgPSB0MSAqIGNvcygocGhpICsgMiAqIFBJKSAvIDMpIC0gYSAvIDM7XHJcblx0XHRcdHJvb3QzID0gdDEgKiBjb3MoKHBoaSArIDQgKiBQSSkgLyAzKSAtIGEgLyAzO1xyXG5cdFx0XHRyZXR1cm4gW3Jvb3QzLCByb290MSwgcm9vdDJdXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdGhyZWUgcmVhbCByb290cywgYnV0IHR3byBvZiB0aGVtIGFyZSBlcXVhbDpcclxuXHRcdGlmIChkaXNjcmltaW5hbnQgPT09IDApIHtcclxuXHRcdFx0dTEgPSBxMiA8IDAgPyBjdWJlcm9vdCgtcTIpIDogLWN1YmVyb290KHEyKTtcclxuXHRcdFx0cm9vdDEgPSAyICogdTEgLSBhIC8gMztcclxuXHRcdFx0cm9vdDIgPSAtdTEgLSBhIC8gMztcclxuXHRcdFx0cmV0dXJuIFtyb290Miwgcm9vdDFdXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb25lIHJlYWwgcm9vdCwgdHdvIGNvbXBsZXggcm9vdHNcclxuXHRcdHZhciBzZCA9IHNxcnQoZGlzY3JpbWluYW50KTtcclxuXHRcdHUxID0gY3ViZXJvb3Qoc2QgLSBxMik7XHJcblx0XHR2MSA9IGN1YmVyb290KHNkICsgcTIpO1xyXG5cdFx0cm9vdDEgPSB1MSAtIHYxIC0gYSAvIDM7XHJcblx0XHRyZXR1cm4gW3Jvb3QxXVxyXG5cdH1cclxuXHJcblx0cm9vdHNZKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMucm9vdHModGhpc1sxXSx0aGlzWzNdLHRoaXNbNV0sdGhpc1s3XSlcclxuXHR9XHJcblxyXG5cdHJvb3RzWCgpIHtcclxuXHRcdHJldHVybiB0aGlzLnJvb3RzKHRoaXNbMF0sdGhpc1syXSx0aGlzWzRdLHRoaXNbNl0pXHJcblx0fVxyXG5cdFxyXG5cdGdldFlhdFgoeCl7XHJcblx0XHR2YXIgeDEgPSB0aGlzWzBdIC0geCwgeDIgPSB0aGlzWzJdIC0geCwgeDMgPSB0aGlzWzRdIC0geCwgeDQgPSB0aGlzWzZdIC0geCxcclxuXHRcdFx0eDJfMyA9IHgyICogMywgeDFfMyA9IHgxICozLCB4M18zID0geDMgKiAzLFxyXG5cdFx0XHRkID0gKC14MSArIHgyXzMgLSB4M18zICsgeDQpLCBkaSA9IDEvZCwgaTMgPSAxLzMsXHJcblx0XHRcdGEgPSAoeDFfMyAtIDYgKiB4MiArIHgzXzMpICogZGksXHJcblx0XHRcdGIgPSAoLXgxXzMgKyB4Ml8zKSAqIGRpLFxyXG5cdFx0XHRjID0geDEgKiBkaSxcclxuXHRcdFx0cCA9ICgzICogYiAtIGEgKiBhKSAqIGkzLFxyXG5cdFx0XHRwMyA9IHAgKiBpMyxcclxuXHRcdFx0cSA9ICgyICogYSAqIGEgKiBhIC0gOSAqIGEgKiBiICsgMjcgKiBjKSAqICgxLzI3KSxcclxuXHRcdFx0cTIgPSBxICogMC41LFxyXG5cdFx0XHRkaXNjcmltaW5hbnQgPSBxMiAqIHEyICsgcDMgKiBwMyAqIHAzO1xyXG5cclxuXHRcdC8vIGFuZCBzb21lIHZhcmlhYmxlcyB3ZSdyZSBnb2luZyB0byB1c2UgbGF0ZXIgb246XHJcblx0XHR2YXIgdTEsIHYxLCByb290O1xyXG5cclxuXHRcdC8vVGhyZWUgcmVhbCByb290cyBjYW4gbmV2ZXIgaGFwcGVuIGlmIHAxKDAsMCkgYW5kIHA0KDEsMSk7XHJcblxyXG5cdFx0Ly8gdGhyZWUgcmVhbCByb290cywgYnV0IHR3byBvZiB0aGVtIGFyZSBlcXVhbDpcclxuXHRcdGlmIChkaXNjcmltaW5hbnQgPCAwKSB7XHJcblx0XHRcdHZhciBtcDMgPSAtcCAvIDMsXHJcblx0XHRcdFx0bXAzMyA9IG1wMyAqIG1wMyAqIG1wMyxcclxuXHRcdFx0XHRyID0gc3FydChtcDMzKSxcclxuXHRcdFx0XHR0ID0gLXEgLyAoMiAqIHIpLFxyXG5cdFx0XHRcdGNvc3BoaSA9IHQgPCAtMSA/IC0xIDogdCA+IDEgPyAxIDogdCxcclxuXHRcdFx0XHRwaGkgPSBhY29zKGNvc3BoaSksXHJcblx0XHRcdFx0Y3J0ciA9IGN1YmVyb290KHIpLFxyXG5cdFx0XHRcdHQxID0gMiAqIGNydHI7XHJcblx0XHRcdHJvb3QgPSB0MSAqIGNvcygocGhpICsgNCAqIFBJKSAvIDMpIC0gYSAvIDM7XHJcblx0XHR9ZWxzZSBpZiAoZGlzY3JpbWluYW50ID09PSAwKSB7XHJcblx0XHRcdHUxID0gcTIgPCAwID8gY3ViZXJvb3QoLXEyKSA6IC1jdWJlcm9vdChxMik7XHJcblx0XHRcdHJvb3QgPSAtdTEgLSBhICogaTM7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0dmFyIHNkID0gc3FydChkaXNjcmltaW5hbnQpO1xyXG5cdFx0XHQvLyBvbmUgcmVhbCByb290LCB0d28gY29tcGxleCByb290c1xyXG5cdFx0XHR1MSA9IGN1YmVyb290KHNkIC0gcTIpO1xyXG5cdFx0XHR2MSA9IGN1YmVyb290KHNkICsgcTIpO1xyXG5cdFx0XHRyb290ID0gdTEgLSB2MSAtIGEgKiBpMztcdFxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBwb2ludChyb290LCB0aGlzWzFdLCB0aGlzWzNdLCB0aGlzWzVdLCB0aGlzWzddKTtcclxuXHR9XHJcblx0LyoqXHJcblx0XHRHaXZlbiBhIENhbnZhcyAyRCBjb250ZXh0IG9iamVjdCBhbmQgc2NhbGUgdmFsdWUsIHN0cm9rZXMgYSBjdWJpYyBiZXppZXIgY3VydmUuXHJcblx0Ki9cclxuXHRkcmF3KGN0eCwgcyA9IDEpe1xyXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0Y3R4Lm1vdmVUbyh0aGlzWzBdKnMsIHRoaXNbMV0qcylcclxuXHRcdGN0eC5iZXppZXJDdXJ2ZVRvKFxyXG5cdFx0XHR0aGlzWzJdKnMsIHRoaXNbM10qcyxcclxuXHRcdFx0dGhpc1s0XSpzLCB0aGlzWzVdKnMsXHJcblx0XHRcdHRoaXNbNl0qcywgdGhpc1s3XSpzXHJcblx0XHRcdClcclxuXHRcdGN0eC5zdHJva2UoKVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IHtDQmV6aWVyfSIsIi8qKlxyXG5cdEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgYSB0b3VjaCBzY3JvbGxpbmcgaW50ZXJmYWNlIHVzaW5nIHRvdWNoIGV2ZW50c1xyXG4qL1xyXG5jbGFzcyBUb3VjaFNjcm9sbGVyIHtcclxuICAgIC8qKiBcclxuICAgICAgICBDb25zdHJ1Y3RzIGEgdG91Y2ggb2JqZWN0IGFyb3VuZCBhIGdpdmVuIGRvbSBlbGVtZW50LiBGdW5jdGlvbnMgbGlzdGVuZXJzIGNhbiBiZSBib3VuZCB0byB0aGlzIG9iamVjdCB1c2luZ1xyXG4gICAgICAgIHRoaXMgYWRkRXZlbnRMaXN0ZW5lciBtZXRob2QuXHJcbiAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgZHJhZyA9IDAuMDIsIHRvdWNoaWQgPSAwKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5vcmlnaW5feCA9IDA7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5feSA9IDA7XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eV94ID0gMDtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5X3kgPSAwO1xyXG4gICAgICAgIHRoaXMuR08gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZHJhZyA9IChkcmFnID4gMCkgPyBkcmFnIDogMC4wMjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAoIXRvdWNoaWQgaW5zdGFuY2VvZiBOdW1iZXIpXHJcbiAgICAgICAgICAgIHRvdWNoaWQgPSAwO1xyXG5cclxuICAgICAgICBsZXQgdGltZV9vbGQgPSAwO1xyXG5cclxuICAgICAgICBsZXQgZnJhbWUgPSAoZHgsIGR5LCBzdGVwcywgcmF0aW8gPSAxKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgZHJhZ192YWwgPSB0aGlzLmRyYWc7XHJcblxyXG4gICAgICAgICAgICBkeCAtPSBkeCAqIGRyYWdfdmFsICogc3RlcHMgKiByYXRpbztcclxuICAgICAgICAgICAgZHkgLT0gZHkgKiBkcmFnX3ZhbCAqIHN0ZXBzICogcmF0aW87XHJcblxyXG4gICAgICAgICAgICBsZXQgZG0gPSBNYXRoLm1heChNYXRoLmFicyhkeSksIE1hdGguYWJzKGR5KSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZW5kID0gIShzdGVwcyA+IDAgJiYgZG0gPiAwLjEgJiYgdGhpcy5HTyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWVuZCkge1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBmcmFtZShkeCwgZHksIDEpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZW5kID0gZW5kICYmIHN0ZXBzICE9IDA7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGlzdGVuZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpc3RlbmVyc1tpXSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkdPID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmV2ZW50X2IgPSAoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgdGltZV9vbGQgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b3VjaCA9IGUudG91Y2hlc1t0b3VjaGlkXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHlfeCA9IHRoaXMub3JpZ2luX3ggLSB0b3VjaC5jbGllbnRYO1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5X3kgPSB0aGlzLm9yaWdpbl95IC0gdG91Y2guY2xpZW50WTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luX3ggPSB0b3VjaC5jbGllbnRYO1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbl95ID0gdG91Y2guY2xpZW50WTtcclxuXHJcbiAgICAgICAgICAgIGZyYW1lKHRoaXMudmVsb2NpdHlfeCwgdGhpcy52ZWxvY2l0eV95LCAwLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZXZlbnRfYyA9IChlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdGltZV9uZXcgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBkaWZmID0gdGltZV9uZXcgLSB0aW1lX29sZDtcclxuXHJcbiAgICAgICAgICAgIGxldCBzdGVwcyA9IE1hdGgubWluKGRpZmYgLyA4LjY2NjY2NjYsIDEgLyB0aGlzLmRyYWcpOyAvLyA2MCBGUFNcclxuXHJcbiAgICAgICAgICAgIHRoaXMuR08gPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgZnJhbWUodGhpcy52ZWxvY2l0eV94LCB0aGlzLnZlbG9jaXR5X3ksIHN0ZXBzKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHlfeCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHlfeSA9IDA7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLmV2ZW50X2IpO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMuZXZlbnRfYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmV2ZW50X2EgPSAoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYoIXRoaXMuR08pe1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmdWFsdCgpO1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGltZV9vbGQgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuR08gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b3VjaCA9IGUudG91Y2hlc1t0b3VjaGlkXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdG91Y2gpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbl95ID0gdG91Y2guY2xpZW50WTtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5feCA9IHRvdWNoLmNsaWVudFg7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLmV2ZW50X2IpO1xyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMuZXZlbnRfYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy5ldmVudF9hKTtcclxuXHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMuZXZlbnRfYSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhZGRFdmVudExpc3RlbmVyKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKGNhbGxiYWNrIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpc3RlbmVyc1tpXSA9PSBjYWxsYmFjaykgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVFdmVudExpc3RlbmVyKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpc3RlbmVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnNbaV0gPT0gY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFRvdWNoU2Nyb2xsZXJcclxufSIsImltcG9ydCB7TGV4ZXJ9IGZyb20gXCIuL2NvbW1vbi9zdHJpbmdfcGFyc2luZy9sZXhlclwiXHJcbmltcG9ydCB7VG9rZW5pemVyfSBmcm9tIFwiLi9jb21tb24vc3RyaW5nX3BhcnNpbmcvdG9rZW5pemVyXCJcclxuXHJcbi8vVGltZVxyXG5pbXBvcnQge21vbnRoc30gZnJvbSBcIi4vY29tbW9uL2RhdGVfdGltZS9tb250aHNcIlxyXG5pbXBvcnQge2Rvd30gZnJvbSBcIi4vY29tbW9uL2RhdGVfdGltZS9kYXlzX29mX3dlZWtcIlxyXG5pbXBvcnQge0dldERheVN0YXJ0QW5kRW5kfSBmcm9tIFwiLi9jb21tb24vZGF0ZV90aW1lL2RheV9zdGFydF9hbmRfZW5kX2Vwb2NoXCJcclxuaW1wb3J0IHtmbG9hdDI0dG8xMk1vZFRpbWV9IGZyb20gXCIuL2NvbW1vbi9kYXRlX3RpbWUvdGltZS5qc1wiXHJcblxyXG4vL01hdGhcclxuaW1wb3J0IHtRQmV6aWVyfSBmcm9tIFwiLi9jb21tb24vbWF0aC9xdWFkcmF0aWNfYmV6aWVyXCJcclxuaW1wb3J0IHtDQmV6aWVyfSBmcm9tIFwiLi9jb21tb24vbWF0aC9jdWJpY19iZXppZXJcIlxyXG5pbXBvcnQge1R1cm5RdWVyeUludG9EYXRhLCBUdXJuRGF0YUludG9RdWVyeX0gZnJvbSBcIi4vY29tbW9uL3VybC91cmxcIlxyXG5pbXBvcnQge1RvdWNoU2Nyb2xsZXJ9IGZyb20gXCIuL2NvbW1vbi9ldmVudC90b3VjaF9zY3JvbGxlclwiXHJcblxyXG5cclxuLyoqKioqKioqKioqIFN0cmluZyBQYXJzaW5nIEJhc2ljIEZ1bmN0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKi9cclxuLyoqXHJcblx0SWYgYSBzdHJpbmcgb2JqZWN0IGlzIHBhc3NlZCwgY3JlYXRlcyBhIGxleGVyIHRoYXQgdG9rZW5pemUgdGhlIGlucHV0IHN0cmluZy4gXHJcbiovXHJcbmZ1bmN0aW9uIExleChzdHJpbmcpe1xyXG5cdGlmKHR5cGVvZihzdHJpbmcpICE9PSBcInN0cmluZ1wiKXtcclxuXHRcdGNvbnNvbGUud2FybihcIkNhbm5vdCBjcmVhdGUgYSBsZXhlciBvbiBhIG5vbi1zdHJpbmcgb2JqZWN0IVwiKTtcclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIG5ldyBMZXhlcihuZXcgVG9rZW5pemVyKHN0cmluZykpO1xyXG59XHJcblxyXG5leHBvcnQge1xyXG5cdExleCxcclxuXHRMZXhlciwgXHJcblx0VG9rZW5pemVyLFxyXG5cdG1vbnRocyxcclxuXHRkb3csXHJcblx0UUJlemllcixcclxuXHRDQmV6aWVyLFxyXG5cdFR1cm5RdWVyeUludG9EYXRhLFxyXG5cdFR1cm5EYXRhSW50b1F1ZXJ5LFxyXG5cdEdldERheVN0YXJ0QW5kRW5kLFxyXG5cdFRvdWNoU2Nyb2xsZXIsXHJcblx0ZmxvYXQyNHRvMTJNb2RUaW1lXHJcbn07XHJcblxyXG4vKioqKioqIEdsb2JhbCBPYmplY3QgRXh0ZW5kZXJzICoqKioqKioqKioqKiovXHJcbi8vKlxyXG5FbGVtZW50LnByb3RvdHlwZS5nZXRXaW5kb3dUb3AgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuICh0aGlzLm9mZnNldFRvcCArICgodGhpcy5wYXJlbnRFbGVtZW50KSA/IHRoaXMucGFyZW50RWxlbWVudC5nZXRXaW5kb3dUb3AoKSA6IDApKTtcclxufVxyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuZ2V0V2luZG93TGVmdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gKHRoaXMub2Zmc2V0TGVmdCArICgodGhpcy5wYXJlbnRFbGVtZW50KSA/IHRoaXMucGFyZW50RWxlbWVudC5nZXRXaW5kb3dMZWZ0KCkgOiAwKSk7XHJcbn1cclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmdldFBhcmVudFdpbmRvd1RvcCA9IGZ1bmN0aW9uKGJvb2wgPSBmYWxzZSl7XHJcbiAgICByZXR1cm4gKCgoYm9vbCA/IHRoaXMub2Zmc2V0VG9wIDogMCkpKygodGhpcy5wYXJlbnRFbGVtZW50KSA/IHRoaXMucGFyZW50RWxlbWVudC5nZXRQYXJlbnRXaW5kb3dUb3AodHJ1ZSkgOiAwKSk7XHJcbn1cclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmdldFBhcmVudFdpbmRvd0xlZnQgPSBmdW5jdGlvbihib29sID0gZmFsc2Upe1xyXG4gICAgcmV0dXJuICgoKGJvb2wgPyB0aGlzLm9mZnNldExlZnQgOiAwKSkrKCh0aGlzLnBhcmVudEVsZW1lbnQpID8gdGhpcy5wYXJlbnRFbGVtZW50LmdldFdpbmRvd0xlZnQodHJ1ZSkgOiAwKSk7XHJcbn1cclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmdldFN0eWxlID0gZnVuY3Rpb24oc3R5bGVfbmFtZSl7XHJcblx0cmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMsbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShzdHlsZV9uYW1lKTtcclxufVxyXG4vLyovIiwiaW1wb3J0IHtcclxuICAgIE5VTUJFUlxyXG59IGZyb20gXCIuL251bWJlcl90eXBlLmpzXCJcclxuaW1wb3J0IHtcclxuICAgIExleFxyXG59IGZyb20gXCIuLi9jb21tb25cIlxyXG5cclxubGV0IHNjYXBlX2RhdGUgPSBuZXcgRGF0ZSgpO1xyXG5zY2FwZV9kYXRlLnNldEhvdXJzKDApO1xyXG5zY2FwZV9kYXRlLnNldE1pbGxpc2Vjb25kcygwKTtcclxuc2NhcGVfZGF0ZS5zZXRTZWNvbmRzKDApO1xyXG5zY2FwZV9kYXRlLnNldFRpbWUoMCk7XHJcblxyXG5sZXQgREFURSA9IG5ldyhjbGFzcyBEYXRlU2NoZW1hIGV4dGVuZHMgTlVNQkVSLmNvbnN0cnVjdG9yIHtcclxuICAgIHBhcnNlKHZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICghaXNOYU4odmFsdWUpKVxyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUpO1xyXG5cclxuICAgICAgICBsZXQgbGV4ID0gTGV4KHZhbHVlKTtcclxuXHJcbiAgICAgICAgbGV0IHllYXIgPSBwYXJzZUludChsZXgudG9rZW4udGV4dClcclxuXHJcbiAgICAgICAgaWYgKHllYXIpIHtcclxuXHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0SG91cnMoMCk7XHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0TWlsbGlzZWNvbmRzKDApO1xyXG4gICAgICAgICAgICBzY2FwZV9kYXRlLnNldFNlY29uZHMoMCk7XHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0VGltZSgwKTtcclxuXHJcbiAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIGxldCBtb250aCA9IHBhcnNlSW50KGxleC50b2tlbi50ZXh0KSAtIDE7XHJcbiAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIGxldCBkYXkgPSBwYXJzZUludChsZXgudG9rZW4udGV4dClcclxuICAgICAgICAgICAgc2NhcGVfZGF0ZS5zZXRGdWxsWWVhcih5ZWFyKTtcclxuICAgICAgICAgICAgc2NhcGVfZGF0ZS5zZXREYXRlKGRheSk7XHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0TW9udGgobW9udGgpO1xyXG5cclxuICAgICAgICAgICAgbGV4Lm5leHQoKVxyXG4gICAgICAgICAgICBpZiAobGV4LnRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaG91cnMgPSBwYXJzZUludChsZXgudG9rZW4udGV4dClcclxuICAgICAgICAgICAgICAgIGxleC5uZXh0KClcclxuICAgICAgICAgICAgICAgIGxleC5uZXh0KClcclxuICAgICAgICAgICAgICAgIGxldCBtaW51dGVzID0gcGFyc2VJbnQobGV4LnRva2VuLnRleHQpXHJcblxyXG4gICAgICAgICAgICAgICAgc2NhcGVfZGF0ZS5zZXRIb3Vycyhob3Vycyk7XHJcbiAgICAgICAgICAgICAgICBzY2FwZV9kYXRlLnNldE1pbnV0ZXMobWludXRlcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzY2FwZV9kYXRlLnZhbHVlT2YoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gKG5ldyBEYXRlKHZhbHVlKSkudmFsdWVPZigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICBcclxuICAgICAqL1xyXG4gICAgdmVyaWZ5KHZhbHVlLCByZXN1bHQpIHtcclxuICAgICAgICB0aGlzLnBhcnNlKHZhbHVlKTtcclxuICAgICAgICBzdXBlci52ZXJpZnkodmFsdWUsIHJlc3VsdCk7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyKGlkZW50aWZpZXIsIGZpbHRlcnMpIHtcclxuXHJcbiAgICAgICAgaWYgKGZpbHRlcnMubGVuZ3RoID4gMSkge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBmaWx0ZXJzLmxlbmd0aCAtIDE7IGkgPCBsOyBpICs9IDIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzdGFydCA9IGZpbHRlcnNbaV07XHJcbiAgICAgICAgICAgICAgICBsZXQgZW5kID0gZmlsdGVyc1tpICsgMV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0IDw9IGlkZW50aWZpZXIgJiYgaWRlbnRpZmllciA8PSBlbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0cmluZyh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiAobmV3IERhdGUodmFsdWUpKSArIFwiXCI7XHJcbiAgICB9XHJcbn0pXHJcblxyXG5leHBvcnQge1xyXG4gICAgREFURVxyXG59IiwiaW1wb3J0IHtcclxuICAgIE5VTUJFUlxyXG59IGZyb20gXCIuL251bWJlcl90eXBlLmpzXCJcclxuXHJcbmxldCBUSU1FID0gbmV3KGNsYXNzIFRpbWVTY2hlbWEgZXh0ZW5kcyBOVU1CRVIuY29uc3RydWN0b3Ige1xyXG5cclxuICAgIHBhcnNlKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCFpc05hTih2YWx1ZSkpXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIGhvdXIgPSBwYXJzZUludCh2YWx1ZS5zcGxpdChcIjpcIilbMF0pO1xyXG4gICAgICAgICAgICB2YXIgbWluID0gcGFyc2VJbnQodmFsdWUuc3BsaXQoXCI6XCIpWzFdLnNwbGl0KFwiIFwiKVswXSk7XHJcbiAgICAgICAgICAgIHZhciBoYWxmID0gKHZhbHVlLnNwbGl0KFwiOlwiKVsxXS5zcGxpdChcIiBcIilbMV0udG9Mb3dlckNhc2UoKSA9PSBcInBtXCIpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdmFyIGhvdXIgPSAwO1xyXG4gICAgICAgICAgICB2YXIgbWluID0gMDtcclxuICAgICAgICAgICAgdmFyIGhhbGYgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoKGhvdXIgKyAoKGhhbGYpID8gMTIgOiAwKSArIChtaW4gLyA2MCkpKTtcclxuICAgIH1cclxuXHJcbiAgICB2ZXJpZnkodmFsdWUsIHJlc3VsdCkge1xyXG4gICAgICAgIHRoaXMucGFyc2UodmFsdWUpO1xyXG4gICAgICAgIHN1cGVyLnZlcmlmeSh2YWx1ZSwgcmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXIoaWRlbnRpZmllciwgZmlsdGVycykge1xyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgc3RyaW5nKHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIChuZXcgRGF0ZSh2YWx1ZSkpICsgXCJcIjtcclxuICAgIH1cclxufSkoKVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFRJTUVcclxufSIsImltcG9ydCB7XHJcbiAgICBTY2hlbWFUeXBlXHJcbn0gZnJvbSBcIi4vc2NoZW1hX3R5cGUuanNcIlxyXG5cclxubGV0IFNUUklORyA9IG5ldyhjbGFzcyBTdHJpbmdTY2hlbWEgZXh0ZW5kcyBTY2hlbWFUeXBlIHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnN0YXJ0X3ZhbHVlID0gXCJcIlxyXG4gICAgfVxyXG4gICAgcGFyc2UodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gdmFsdWUgKyBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIHZlcmlmeSh2YWx1ZSwgcmVzdWx0KSB7XHJcbiAgICAgICAgcmVzdWx0LnZhbGlkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXIoaWRlbnRpZmllciwgZmlsdGVycykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIubWF0Y2goZmlsdGVyc1tpXStcIlwiKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG59KSgpXHJcblxyXG5leHBvcnQge1xyXG4gICAgU1RSSU5HXHJcbn07IiwiaW1wb3J0IHtcclxuICAgIFNjaGVtYVR5cGVcclxufSBmcm9tIFwiLi9zY2hlbWFfdHlwZS5qc1wiXHJcblxyXG5sZXQgQk9PTCA9IG5ldyhjbGFzcyBCb29sU2NoZW1hIGV4dGVuZHMgU2NoZW1hVHlwZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdGFydF92YWx1ZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlKHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuICh2YWx1ZSkgPyB0cnVlIDogZmFsc2U7IFxyXG4gICAgfVxyXG5cclxuICAgIHZlcmlmeSh2YWx1ZSwgcmVzdWx0KSB7XHJcbiAgICAgICAgcmVzdWx0LnZhbGlkID0gdHJ1ZTtcclxuICAgICAgICBpZighdmFsdWUgaW5zdGFuY2VvZiBCb29sZWFuKXtcclxuICAgICAgICAgICAgcmVzdWx0LnZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJlc3VsdC5yZWFzb24gPSBcIiBWYWx1ZSBpcyBub3QgYSBCb29sZWFuLlwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcihpZGVudGlmaWVyLCBmaWx0ZXJzKSB7XHJcbiAgICAgICAgaWYodmFsdWUgaW5zdGFuY2VvZiBCT09MKVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG59KSgpXHJcblxyXG5leHBvcnQge1xyXG4gICAgQk9PTFxyXG59OyIsImltcG9ydCB7U2NoZW1hVHlwZX0gZnJvbSBcIi4vc2NoZW1hX3R5cGVcIlxyXG5pbXBvcnQge0RBVEV9IGZyb20gXCIuL2RhdGVfdHlwZVwiXHJcbmltcG9ydCB7VElNRX0gZnJvbSBcIi4vdGltZV90eXBlXCJcclxuaW1wb3J0IHtTVFJJTkd9IGZyb20gXCIuL3N0cmluZ190eXBlXCJcclxuaW1wb3J0IHtOVU1CRVJ9IGZyb20gXCIuL251bWJlcl90eXBlXCJcclxuaW1wb3J0IHtCT09MfSBmcm9tIFwiLi9ib29sX3R5cGVcIlxyXG5cclxubGV0IHNjaGVtYSA9IHtcclxuXHREQVRFLFxyXG5cdFNUUklORyxcclxuXHROVU1CRVIsXHJcblx0Qk9PTCxcclxuXHRUSU1FXHJcbn1cclxuXHJcbmV4cG9ydCB7U2NoZW1hVHlwZSwgc2NoZW1hfTsgIiwiaW1wb3J0IHtcclxuICAgIE1vZGVsQmFzZVxyXG59IGZyb20gXCIuL21vZGVsX2Jhc2UuanNcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIE1vZGVsQ29udGFpbmVyLFxyXG4gICAgTXVsdGlJbmRleGVkQ29udGFpbmVyXHJcbn0gZnJvbSBcIi4vbW9kZWxfY29udGFpbmVyXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBBcnJheU1vZGVsQ29udGFpbmVyXHJcbn0gZnJvbSBcIi4vYXJyYXlfY29udGFpbmVyXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBCVHJlZU1vZGVsQ29udGFpbmVyXHJcbn0gZnJvbSBcIi4vYnRyZWVfY29udGFpbmVyXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBTY2hlbWFUeXBlXHJcbn0gZnJvbSBcIi4uL3NjaGVtYS9zY2hlbWFzXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBTY2hlZHVsZXJcclxufSBmcm9tIFwiLi4vc2NoZWR1bGVyXCJcclxuXHJcblxyXG4vKipcclxuICAgIFRoaXMgaXMgdXNlZCBieSBOTW9kZWwgdG8gY3JlYXRlIGN1c3RvbSBwcm9wZXJ0eSBnZXR0ZXIgYW5kIHNldHRlcnMgXHJcbiAgICBvbiBub24tTW9kZWxDb250YWluZXIgYW5kIG5vbi1Nb2RlbCBwcm9wZXJ0aWVzIG9mIHRoZSBOTW9kZWwgY29uc3RydWN0b3IuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBDcmVhdGVTY2hlbWVkUHJvcGVydHkoY29uc3RydWN0b3IsIHNjaGVtZSwgc2NoZW1hX25hbWUpIHtcclxuXHJcbiAgICBpZiAoY29uc3RydWN0b3IucHJvdG90eXBlW3NjaGVtYV9uYW1lXSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgbGV0IF9fc2hhZG93X25hbWVfXyA9IGBfXyR7c2NoZW1hX25hbWV9X19gO1xyXG5cclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBfX3NoYWRvd19uYW1lX18sIHtcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgIHZhbHVlOiBzY2hlbWUuc3RhcnRfdmFsdWUgfHwgdW5kZWZpbmVkXHJcbiAgICB9KVxyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHNjaGVtYV9uYW1lLCB7XHJcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzW19fc2hhZG93X25hbWVfX107XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHtcclxuICAgICAgICAgICAgICAgIHZhbGlkOiBmYWxzZVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IHZhbCA9IHNjaGVtZS5wYXJzZSh2YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICBzY2hlbWUudmVyaWZ5KHZhbCwgcmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQudmFsaWQgJiYgdGhpc1tfX3NoYWRvd19uYW1lX19dICE9IHZhbClcclxuICAgICAgICAgICAgICAgICh0aGlzW19fc2hhZG93X25hbWVfX10gPSB2YWwsIHRoaXMuc2NoZWR1bGVVcGRhdGUoc2NoZW1hX25hbWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICAgIFRoaXMgaXMgdXNlZCBieSBOTW9kZWwgdG8gY3JlYXRlIGN1c3RvbSBwcm9wZXJ0eSBnZXR0ZXIgYW5kIHNldHRlcnMgXHJcbiAgICBvbiBTY2hlbWVkIE1vZGVsQ29udGFpbmVyIHByb3BlcnRpZXMgb2YgdGhlIE5Nb2RlbCBjb25zdHJ1Y3Rvci5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIENyZWF0ZU1DU2NoZW1lZFByb3BlcnR5KGNvbnN0cnVjdG9yLCBzY2hlbWUsIHNjaGVtYV9uYW1lKSB7XHJcblxyXG4gICAgbGV0IHNjaGVtYSA9IHNjaGVtZS5zY2hlbWE7XHJcblxyXG4gICAgbGV0IG1jX2NvbnN0cnVjdG9yID0gc2NoZW1lLmNvbnRhaW5lcjtcclxuXHJcbiAgICBsZXQgX19zaGFkb3dfbmFtZV9fID0gYF9fJHtzY2hlbWFfbmFtZX1fX2A7XHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgX19zaGFkb3dfbmFtZV9fLCB7XHJcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgdmFsdWU6IG51bGxcclxuICAgIH0pXHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgc2NoZW1hX25hbWUsIHtcclxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpc1tfX3NoYWRvd19uYW1lX19dKVxyXG4gICAgICAgICAgICAgICAgdGhpc1tfX3NoYWRvd19uYW1lX19dID0gbmV3IG1jX2NvbnN0cnVjdG9yKHNjaGVtZS5zY2hlbWEpXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1tfX3NoYWRvd19uYW1lX19dO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBNQyA9IHRoaXNbX19zaGFkb3dfbmFtZV9fXTtcclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZih2YWx1ZSkgPT0gXCJzdHJpbmdcIilcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBNQyA9IG5ldyBtY19jb25zdHJ1Y3RvcihzY2hlbWUuc2NoZW1hKTtcclxuICAgICAgICAgICAgICAgIHRoaXNbX19zaGFkb3dfbmFtZV9fXSA9IE1DO1xyXG4gICAgICAgICAgICAgICAgTUMuaW5zZXJ0KGRhdGEpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlVXBkYXRlKHNjaGVtYV9uYW1lKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIG1jX2NvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzW19fc2hhZG93X25hbWVfX10gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNjaGVtYV9uYW1lKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZVVwZGF0ZShzY2hlbWFfbmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICAgIFRoaXMgaXMgdXNlZCBieSBOTW9kZWwgdG8gY3JlYXRlIGN1c3RvbSBwcm9wZXJ0eSBnZXR0ZXIgYW5kIHNldHRlcnMgXHJcbiAgICBvbiBNb2RlbCBwcm9wZXJ0aWVzIG9mIHRoZSBOTW9kZWwgY29uc3RydWN0b3IuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBDcmVhdGVNb2RlbFByb3BlcnR5KGNvbnN0cnVjdG9yLCBzY2hlbWUsIHNjaGVtYV9uYW1lKSB7XHJcblxyXG4gICAgbGV0IHNjaGVtYSA9IHNjaGVtZS5zY2hlbWE7XHJcblxyXG4gICAgbGV0IF9fc2hhZG93X25hbWVfXyA9IGBfXyR7c2NoZW1hX25hbWV9X19gO1xyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHNjaGVtYV9uYW1lLCB7XHJcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG5cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgc2NoZW1hX25hbWUsIHtcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IG5ldyBzY2hlbWUoKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1tzY2hlbWFfbmFtZV07XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge31cclxuICAgIH0pXHJcbn1cclxuXHJcbmNsYXNzIE1vZGVsIGV4dGVuZHMgTW9kZWxCYXNlIHtcclxuICAgIC8qKlxyXG4gICAgIFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy9UaGUgc2NoZW1hIGlzIHN0b3JlZCBkaXJlY3RseSBvbiB0aGUgY29uc3RydWN0b3IuIElmIGl0IGlzIG5vdCB0aGVyZSwgdGhlbiBjb25zaWRlciB0aGlzIG1vZGVsIHR5cGUgdG8gXCJBTllcIlxyXG4gICAgICAgIGxldCBzY2hlbWEgPSB0aGlzLmNvbnN0cnVjdG9yLnNjaGVtYTtcclxuXHJcbiAgICAgICAgaWYgKHNjaGVtYSkge1xyXG4gICAgICAgICAgICBsZXQgX19GaW5hbENvbnN0cnVjdG9yX18gPSBzY2hlbWEuX19GaW5hbENvbnN0cnVjdG9yX187XHJcblxyXG4gICAgICAgICAgICBsZXQgY29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xyXG5cclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgXCJzY2hlbWFcIiwge1xyXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHNjaGVtYVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgaWYgKCFfX0ZpbmFsQ29uc3RydWN0b3JfXykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgc2NoZW1hX25hbWUgaW4gc2NoZW1hKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNjaGVtZSA9IHNjaGVtYVtzY2hlbWFfbmFtZV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY2hlbWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2NoZW1lWzBdICYmIHNjaGVtZVswXS5jb250YWluZXIgJiYgc2NoZW1lWzBdLnNjaGVtYSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ3JlYXRlTUNTY2hlbWVkUHJvcGVydHkoY29uc3RydWN0b3IsIHNjaGVtZVswXSwgc2NoZW1hX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjaGVtZVswXSBpbnN0YW5jZW9mIE1vZGVsQ29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVNb2RlbFByb3BlcnR5KGNvbnN0cnVjdG9yLCBzY2hlbWVbMF0uY29uc3RydWN0b3IsIHNjaGVtYV9uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2NoZW1lIGluc3RhbmNlb2YgTW9kZWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZU1vZGVsUHJvcGVydHkoY29uc3RydWN0b3IsIHNjaGVtZVswXS5jb25zdHJ1Y3Rvciwgc2NoZW1hX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNjaGVtZSBpbnN0YW5jZW9mIFNjaGVtYVR5cGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZVNjaGVtZWRQcm9wZXJ0eShjb25zdHJ1Y3Rvciwgc2NoZW1lLCBzY2hlbWFfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYENvdWxkIG5vdCBjcmVhdGUgcHJvcGVydHkgJHtzY2hlbWFfbmFtZX0uYClcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgT2JqZWN0LnNlYWwoY29uc3RydWN0b3IpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2NoZW1hLCBcIl9fRmluYWxDb25zdHJ1Y3Rvcl9fXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAvL3NjaGVtYS5fX0ZpbmFsQ29uc3RydWN0b3JfXyA9IGNvbnN0cnVjdG9yO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAvL1N0YXJ0IHRoZSBwcm9jZXNzIG92ZXIgd2l0aCBhIG5ld2x5IG1pbnRlZCBNb2RlbCB0aGF0IGhhcyB0aGUgcHJvcGVydGllcyBkZWZpbmVkIGluIHRoZSBTY2hlbWFcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgY29uc3RydWN0b3IoZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvKiBUaGlzIHdpbGwgYmUgYW4gQU5ZIE1vZGVsICovXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQW55TW9kZWwoZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF0YSlcclxuICAgICAgICAgICAgdGhpcy5hZGQoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmVtb3ZlcyBhbGwgaGVsZCByZWZlcmVuY2VzIGFuZCBjYWxscyB1bnNldE1vZGVsIG9uIGFsbCBsaXN0ZW5pbmcgdmlld3MuXHJcbiAgICAqL1xyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zY2hlbWEgPSBudWxsO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBhIGluIHRoaXMpIHtcclxuICAgICAgICAgICAgbGV0IHByb3AgPSB0aGlzW2FdO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mKHByb3ApID09IFwib2JqZWN0XCIgJiYgcHJvcC5kZXN0cnVjdG9yIGluc3RhbmNlb2YgRnVuY3Rpb24pXHJcbiAgICAgICAgICAgICAgICBwcm9wLmRlc3RydWN0b3IoKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpc1thXSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgLy9kZWJ1Z2dlclxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEdpdmVuIGEga2V5LCByZXR1cm5zIGFuIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgdGhlIHN0YXR1cyBvZiB0aGUgdmFsdWUgY29udGFpbmVkLCBpZiBpdCBpcyB2YWxpZCBvciBub3QsIGFjY29yZGluZyB0byB0aGUgc2NoZW1hIGZvciB0aGF0IHByb3BlcnR5LiBcclxuICAgICovXHJcbiAgICB2ZXJpZnkoa2V5KSB7XHJcblxyXG4gICAgICAgIGxldCBvdXRfZGF0YSA9IHtcclxuICAgICAgICAgICAgdmFsaWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHJlYXNvbjogXCJcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBzY2hlbWUgPSB0aGlzLnNjaGVtYVtrZXldO1xyXG5cclxuICAgICAgICBpZiAoc2NoZW1lKSB7XHJcbiAgICAgICAgICAgIGlmIChzY2hlbWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzY2hlbWUgaW5zdGFuY2VvZiBNb2RlbCkge1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNjaGVtZS52ZXJpZnkodGhpc1trZXldLCBvdXRfZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfZGF0YVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJldHVybnMgYSBwYXJzZWQgdmFsdWUgYmFzZWQgb24gdGhlIGtleSBcclxuICAgICovXHJcbiAgICBzdHJpbmcoa2V5KSB7XHJcbiAgICAgICAgbGV0IG91dF9kYXRhID0ge1xyXG4gICAgICAgICAgICB2YWxpZDogdHJ1ZSxcclxuICAgICAgICAgICAgcmVhc29uOiBcIlwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKGtleSkge1xyXG4gICAgICAgICAgICB2YXIgc2NoZW1lID0gdGhpcy5zY2hlbWFba2V5XTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzY2hlbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzY2hlbWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XS5zdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2NoZW1lIGluc3RhbmNlb2YgTW9kZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0uc3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY2hlbWUuc3RyaW5nKHRoaXNba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQHBhcmFtIGRhdGEgOiBBbiBvYmplY3QgY29udGFpbmluZyBrZXkgdmFsdWUgcGFpcnMgdG8gaW5zZXJ0IGludG8gdGhlIG1vZGVsLiBcclxuICAgICovXHJcbiAgICBhZGQoZGF0YSkge1xyXG4gICAgICAgIGZvciAobGV0IGEgaW4gZGF0YSlcclxuICAgICAgICAgICAgaWYgKGEgaW4gdGhpcykgdGhpc1thXSA9IGRhdGFbYV07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldChkYXRhKSB7XHJcbiAgICAgICAgdmFyIG91dF9kYXRhID0ge307XHJcblxyXG4gICAgICAgIGlmICghZGF0YSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBmb3IgKHZhciBhIGluIGRhdGEpXHJcbiAgICAgICAgICAgICAgICBpZiAoYSBpbiB0aGlzKSBvdXRfZGF0YVthXSA9IHRoaXNbYV07XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgbGV0IG91dCA9IHt9O1xyXG5cclxuICAgICAgICBsZXQgc2NoZW1hID0gdGhpcy5zY2hlbWE7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHByb3AgaW4gc2NoZW1hKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2NoZW1lID0gc2NoZW1hW3Byb3BdO1xyXG5cclxuICAgICAgICAgICAgb3V0W3Byb3BdID0gdGhpc1twcm9wXVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAgICBUaGlzIGlzIHVzZWQgYnkgTk1vZGVsIHRvIGNyZWF0ZSBjdXN0b20gcHJvcGVydHkgZ2V0dGVyIGFuZCBzZXR0ZXJzIFxyXG4gICAgb24gbm9uLU1vZGVsQ29udGFpbmVyIGFuZCBub24tTW9kZWwgcHJvcGVydGllcyBvZiB0aGUgTk1vZGVsIGNvbnN0cnVjdG9yLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gQ3JlYXRlR2VuZXJpY1Byb3BlcnR5KGNvbnN0cnVjdG9yLCBwcm9wX3ZhbCwgcHJvcF9uYW1lLCBtb2RlbCkge1xyXG5cclxuICAgIGlmIChjb25zdHJ1Y3Rvci5wcm90b3R5cGVbcHJvcF9uYW1lXSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgbGV0IF9fc2hhZG93X25hbWVfXyA9IGBfXyR7cHJvcF9uYW1lfV9fYDtcclxuXHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgX19zaGFkb3dfbmFtZV9fLCB7XHJcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICB2YWw6IHByb3BfdmFsXHJcbiAgICB9KVxyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3BfbmFtZSwge1xyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbX19zaGFkb3dfbmFtZV9fXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQudmFsaWQgJiYgdGhpc1tfX3NoYWRvd19uYW1lX19dICE9IHZhbClcclxuICAgICAgICAgICAgICAgICh0aGlzW19fc2hhZG93X25hbWVfX10gPSB2YWwsIG1vZGVsLnNjaGVkdWxlVXBkYXRlKHByb3BfbmFtZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIEFueU1vZGVsUHJveHlTZXQob2JqLCBwcm9wLCB2YWwpIHtcclxuICAgIGlmIChwcm9wIGluIG9iaiAmJiBvYmpbcHJvcF0gPT0gdmFsKVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcblxyXG4gICAgb2JqW3Byb3BdID0gdmFsO1xyXG5cclxuICAgIG9iai5zY2hlZHVsZVVwZGF0ZShwcm9wKTtcclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuY2xhc3MgQW55TW9kZWwgZXh0ZW5kcyBNb2RlbEJhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcHJvcF9uYW1lIGluIGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzW3Byb3BfbmFtZV0gPSBkYXRhW3Byb3BfbmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodGhpcywge1xyXG4gICAgICAgICAgICBzZXQ6IEFueU1vZGVsUHJveHlTZXRcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEFsaWFzIGZvciBkZXN0cnVjdG9yXHJcbiAgICAqL1xyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmVtb3ZlcyBhbGwgaGVsZCByZWZlcmVuY2VzIGFuZCBjYWxscyB1bnNldE1vZGVsIG9uIGFsbCBsaXN0ZW5pbmcgdmlld3MuXHJcbiAgICAqL1xyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKGRhdGEpIHtcclxuICAgICAgICBmb3IgKHZhciBhIGluIGRhdGEpXHJcbiAgICAgICAgICAgIHRoaXNbYV0gPSBkYXRhW2FdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChkYXRhKSB7XHJcbiAgICAgICAgdmFyIG91dF9kYXRhID0ge307XHJcblxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBhIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwcm9wID0gdGhpc1thXTtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0X2RhdGFbYV0gPSBwcm9wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0X2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmVtb3ZlcyBpdGVtcyBpbiBjb250YWluZXJzIGJhc2VkIG9uIG1hdGNoaW5nIGluZGV4LlxyXG4gICAgKi9cclxuXHJcbiAgICByZW1vdmUoZGF0YSkge1xyXG4gICAgICAgIHJldHVybiB7fTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgbGV0IG91dCA9IHt9O1xyXG5cclxuXHJcbiAgICAgICAgZm9yIChsZXQgcHJvcCBpbiB0aGlzKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJvcCA9PSBcImZpcnN0X3ZpZXdcIiB8fFxyXG4gICAgICAgICAgICAgICAgcHJvcCA9PSBcImNoYW5nZWRfdmFsdWVzXCIgfHxcclxuICAgICAgICAgICAgICAgIHByb3AgPT0gXCJfX19fU0NIRURVTEVEX19fX1wiKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBvdXRbcHJvcF0gPSB0aGlzW3Byb3BdXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSnNvblN0cmluZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhICsgXCJcIjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIE1vZGVsLFxyXG4gICAgQW55TW9kZWwsXHJcbiAgICBNb2RlbENvbnRhaW5lcixcclxuICAgIEFycmF5TW9kZWxDb250YWluZXIsXHJcbiAgICBNdWx0aUluZGV4ZWRDb250YWluZXIsXHJcbiAgICBCVHJlZU1vZGVsQ29udGFpbmVyXHJcbn0iLCJpbXBvcnQge01vZGVsfSBmcm9tIFwiLi9tb2RlbC9tb2RlbFwiXHJcblxyXG5jbGFzcyBDb250cm9sbGVye1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKCl7XHJcblx0XHR0aGlzLm1vZGVsID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdGRlc3RydWN0b3IoKXtcclxuXHRcdHRoaXMubW9kZWwgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0c2V0TW9kZWwobW9kZWwpe1xyXG5cdFx0aWYobW9kZWwgaW5zdGFuY2VvZiBNb2RlbCl7XHJcblx0XHRcdHRoaXMubW9kZWwgPSBtb2RlbDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNldChkYXRhKXtcclxuXHRcdGlmKHRoaXMubW9kZWwpXHJcblx0XHRcdHRoaXMubW9kZWwuYWRkKGRhdGEpO1xyXG5cdFx0XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnR7Q29udHJvbGxlcn0iLCJpbXBvcnQge1xyXG4gICAgQ29udHJvbGxlclxyXG59IGZyb20gXCIuL2NvbnRyb2xsZXJcIlxyXG4vKipcclxuICogVGhpcyBDbGFzcyBpcyByZXNwb25zaWJsZSBmb3IgaGFuZGxpbmcgcmVxdWVzdHMgdG8gdGhlIHNlcnZlci4gSXQgY2FuIGFjdCBhcyBhIGNvbnRyb2xsZXIgdG8gc3BlY2lmaWNhbGx5IHB1bGwgZGF0YSBkb3duIGZyb20gdGhlIHNlcnZlciBhbmQgcHVzaCBpbnRvIGRhdGEgbWVtYmVycy5cclxuICpcclxuICoge25hbWV9IEdldHRlclxyXG4gKi9cclxuY2xhc3MgR2V0dGVyIGV4dGVuZHMgQ29udHJvbGxlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1cmwsIHByb2Nlc3NfZGF0YSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5GRVRDSF9JTl9QUk9HUkVTUyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucnVybCA9IHByb2Nlc3NfZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQocmVxdWVzdF9vYmplY3QsIHN0b3JlX29iamVjdCwgc2VjdXJlID0gdHJ1ZSkge1xyXG4gICAgICAgIC8vaWYodGhpcy5GRVRDSF9JTl9QUk9HUkVTUylcclxuICAgICAgICAvLyAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB0aGlzLkZFVENIX0lOX1BST0dSRVNTID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdmFyIHVybCA9ICgoc2VjdXJlKSA/IFwiaHR0cHM6Ly9cIiA6IFwiaHR0cDovL1wiKSArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgdGhpcy51cmwgKyAoIChyZXF1ZXN0X29iamVjdCkgPyAoXCI/XCIgKyB0aGlzLl9fcHJvY2Vzc191cmxfXyhyZXF1ZXN0X29iamVjdCkpIDogXCJcIik7XHJcblxyXG4gICAgICAgIHJldHVybiAoKHN0b3JlKSA9PiBmZXRjaCh1cmwsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCAvLyBTZW5kcyBjb29raWVzIGJhY2sgdG8gc2VydmVyIHdpdGggcmVxdWVzdFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnXHJcbiAgICAgICAgfSkudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgIHRoaXMuRkVUQ0hfSU5fUFJPR1JFU1MgPSBmYWxzZTtcclxuICAgICAgICAgICAgKHJlc3BvbnNlLmpzb24oKS50aGVuKChqKT0+e1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fX3Byb2Nlc3NfcmVzcG9uc2VfXyhqLCBzdG9yZSk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9KS5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgIHRoaXMuRkVUQ0hfSU5fUFJPR1JFU1MgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fX3JlamVjdGVkX3JlcG9uc2VfXyhzdG9yZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgVW5hYmxlIHRvIHByb2Nlc3MgcmVzcG9uc2UgZm9yIHJlcXVlc3QgbWFkZSB0bzogJHt0aGlzLnVybH0uIFJlc3BvbnNlOiAke2Vycm9yfS4gRXJyb3IgUmVjZWl2ZWQ6ICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgfSkpIChzdG9yZV9vYmplY3QpXHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VKc29uKGluX2pzb24pe1xyXG4gICAgICAgIHJldHVybiBpbl9qc29uO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcHJvY2Vzc191cmxfXyhkYXRhKSB7XHJcbiAgICAgICAgdmFyIHN0ciA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgIHN0ciArPSBgJHthfT0ke2RhdGFbYV19XFwmYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdHIuc2xpY2UoMCwgLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcmVqZWN0ZWRfcmVwb25zZV9fKHN0b3JlKXtcclxuICAgICAgICBpZihzdG9yZSlcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlVucHJvY2Vzc2VkIHN0b3JlZCBkYXRhIGluIGdldHRlci5cIik7XHJcbiAgICB9ICAgXHJcblxyXG4gICAgX19wcm9jZXNzX3Jlc3BvbnNlX18oanNvbiwgc3RvcmUpIHtcclxuXHJcbiAgICAgICAgaWYodGhpcy5ydXJsICYmIGpzb24pe1xyXG4gICAgICAgICAgICB2YXIgd2F0Y2hfcG9pbnRzID0gdGhpcy5ydXJsLnNwbGl0KFwiPFwiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB3YXRjaF9wb2ludHMubGVuZ3RoICYmIGpzb247IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBqc29uID0ganNvbltwYXJzZUludCh3YXRjaF9wb2ludHNbaV0pP3BhcnNlSW50KHdhdGNoX3BvaW50c1tpXSk6d2F0Y2hfcG9pbnRzW2ldXTtcclxuICAgICAgICAgICAgfSBcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwianNvblwiLCBqc29uKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHJlc3BvbnNlID0ge31cclxuICAgICAgICB2YXIgcmVxdWVzdCA9IHJlc3BvbnNlLnRhcmdldDtcclxuXHJcbiAgICAgICAgLy9yZXN1bHQocmVxdWVzdCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1vZGVsKXtcclxuICAgICAgICAgICAgLy9zaG91bGQgYmUgYWJsZSB0byBwaXBlIHJlc3BvbnNlcyBhcyBvYmplY3RzIGNyZWF0ZWQgZnJvbSB3ZWxsIGZvcm11bGF0ZWQgZGF0YSBkaXJlY3RseSBpbnRvIHRoZSBtb2RlbC5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHRoaXMucGFyc2VKc29uKGpzb24sIHN0b3JlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmFibGUgdG8gcHJvY2VzcyByZXNwb25zZSBmb3IgcmVxdWVzdCBtYWRlIHRvOiAke3RoaXMudXJsfS4gVGhlcmUgaXMgbm8gbW9kZWwgYXR0YWNoZWQgdG8gdGhpcyByZXF1ZXN0IGNvbnRyb2xsZXIhYClcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBHZXR0ZXJcclxufVxyXG4iLCJpbXBvcnQge1xyXG4gICAgVmlld1xyXG59IGZyb20gXCIuL3ZpZXdcIlxyXG4vKipcclxuICogVGhpcyBDbGFzcyBpcyByZXNwb25zaWJsZSBmb3IgaGFuZGxpbmcgcmVxdWVzdHMgdG8gdGhlIHNlcnZlci4gSXQgY2FuIGFjdCBhcyBhIGNvbnRyb2xsZXIgdG8gc3BlY2lmaWNhbGx5IHB1bGwgZGF0YSBkb3duIGZyb20gdGhlIHNlcnZlciBhbmQgcHVzaCBpbnRvIGRhdGEgbWVtYmVycy5cclxuICpcclxuICoge25hbWV9IFJlcXVlc3RlclxyXG4gKi9cclxuY2xhc3MgU2V0dGVyIGV4dGVuZHMgVmlldyB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1cmwpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldChyZXF1ZXN0X29iamVjdCkge1xyXG5cclxuICAgICAgICB2YXIgdXJsID0gXCJodHRwOi8vXCIgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIHRoaXMudXJsICsgKCAocmVxdWVzdF9vYmplY3QpID8gKFwiP1wiICsgdGhpcy5fX3Byb2Nlc3NfdXJsX18ocmVxdWVzdF9vYmplY3QpKSA6IFwiXCIpO1xyXG5cclxuICAgICAgICBmZXRjaCh1cmwsIFxyXG4gICAgICAgIHsgXHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIC8vIFNlbmRzIGNvb2tpZXMgYmFjayB0byBzZXJ2ZXIgd2l0aCByZXF1ZXN0XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnXHJcbiAgICAgICAgfSkudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgIChyZXNwb25zZS5qc29uKCkudGhlbigoaik9PntcclxuICAgICAgICAgICAgICAgIHRoaXMuX19wcm9jZXNzX3Jlc3BvbnNlX18oaik7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9KS5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgVW5hYmxlIHRvIHByb2Nlc3MgcmVzcG9uc2UgZm9yIHJlcXVlc3QgbWFkZSB0bzogJHt0aGlzLnVybH0uIFJlc3BvbnNlOiAke2Vycm9yfS4gRXJyb3IgUmVjZWl2ZWQ6ICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZUpzb24oaW5fanNvbil7XHJcbiAgICAgICAgcmV0dXJuIGluX2pzb247XHJcbiAgICB9XHJcblxyXG4gICAgX19wcm9jZXNzX3VybF9fKGRhdGEpIHtcclxuICAgICAgICB2YXIgc3RyID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciBhIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgc3RyICs9IGAke2F9PSR7ZGF0YVthXX1cXCZgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN0ci5zbGljZSgwLCAtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgX19wcm9jZXNzX3Jlc3BvbnNlX18oanNvbikge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciByZXNwb25zZSA9IHt9XHJcbiAgICAgICAgdmFyIHJlcXVlc3QgPSByZXNwb25zZS50YXJnZXQ7XHJcblxyXG4gICAgICAgIC8vcmVzdWx0KHJlcXVlc3QpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tb2RlbCl7XHJcblxyXG4gICAgICAgICAgICAvL3Nob3VsZCBiZSBhYmxlIHRvIHBpcGUgcmVzcG9uc2VzIGFzIG9iamVjdHMgY3JlYXRlZCBmcm9tIHdlbGwgZm9ybXVsYXRlZCBkYXRhIGRpcmVjdGx5IGludG8gdGhlIG1vZGVsLlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQodGhpcy5wYXJzZUpzb24oanNvbikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5tb2RlbClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFVuYWJsZSB0byBwcm9jZXNzIHJlc3BvbnNlIGZvciByZXF1ZXN0IG1hZGUgdG86ICR7dGhpcy51cmx9LiBUaGVyZSBpcyBubyBtb2RlbCBhdHRhY2hlZCB0byB0aGlzIHJlcXVlc3QgY29udHJvbGxlciFgKVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgU2V0dGVyXHJcbn0iLCIvKlxyXG5cdEhhbmRsZXMgdGhlIHBhcnNpbmcgYW5kIGxvYWRpbmcgb2YgY29tcG9uZW50cyBmb3IgYSBwYXJ0aWN1bGFyIHBhZ2UuXHJcbiovXHJcbmNsYXNzIFBhZ2VWaWV3IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihVUkwsIGFwcF9wYWdlKSB7XHJcbiAgICAgICAgdGhpcy51cmwgPSBVUkw7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZmluYWxpemluZ192aWV3ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnR5cGUgPSBcIm5vcm1hbFwiO1xyXG4gICAgICAgIGlmICghYXBwX3BhZ2UpIGRlYnVnZ2VyXHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gYXBwX3BhZ2U7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50X2JhY2tlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlbWVudHNbaV07XHJcbiAgICAgICAgICAgIGVsZW1lbnQuZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50cyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB1bmxvYWQodHJhbnNpdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBlbGVtZW50LmdldFRyYW5zZm9ybVRvKHRyYW5zaXRpb25zKTtcclxuICAgICAgICAgICAgZWxlbWVudC51bmxvYWRDb21wb25lbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25PdXQodHJhbnNpdGlvbnMpIHtcclxuXHJcbiAgICAgICAgbGV0IHRpbWUgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGltZSA9IE1hdGgubWF4KHRpbWUsIHRoaXMuZWxlbWVudHNbaV0udHJhbnNpdGlvbk91dCh0cmFuc2l0aW9ucykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmluYWxpemUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5MT0FERUQpIHJldHVybjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgZWxlbWVudC5maW5hbGl6ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50KVxyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWQoYXBwX2VsZW1lbnQsIHd1cmwpIHtcclxuXHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSB0cnVlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlbWVudHNbaV07XHJcbiAgICAgICAgICAgIGVsZW1lbnQubG9hZENvbXBvbmVudHMod3VybCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhcHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xyXG5cclxuICAgICAgICB2YXIgdCA9IHRoaXMuZWxlbWVudC5zdHlsZS5vcGFjaXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25Jbih0cmFuc2l0aW9ucykge1xyXG4gICAgICAgIGxldCBmaW5hbF90aW1lID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBcIm1vZGFsXCIpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnRfYmFja2VyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRfYmFja2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF9iYWNrZXIuY2xhc3NMaXN0LmFkZChcIm1vZGFsX2JhY2tlclwiKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudF9iYWNrZXIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICAgICAgICAgIH0sIDUwKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICBlbGVtZW50LnNldFRyYW5zZm9ybVRvKHRyYW5zaXRpb25zKTtcclxuICAgICAgICAgICAgZWxlbWVudC50cmFuc2l0aW9uSW4oKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgZWxlbWVudC5nZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29tcGFyZUNvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgLy9UaGlzIHdpbGwgdHJhbnNpdGlvbiBvYmplY3RzXHJcbiAgICB9XHJcblxyXG4gICAgc2V0VHlwZSh0eXBlKSB7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZSB8fCBcIm5vcm1hbFwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgUGFnZVZpZXdcclxufSIsIi8qKlxyXG4gKlx0Q29udmVydHMgbGlua3MgaW50byBKYXZhY3JpcHQgZW5hYmxlZCBidXR0b25zIHRoYXQgd2lsbCBiZSBoYW5kbGVkIHdpdGhpbiB0aGUgY3VycmVudCBBY3RpdmUgcGFnZS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFBhcmVudCBFbGVtZW50IHRoYXQgY29udGFpbnMgdGhlIDxhPiBlbGVtZW50cyB0byBiZSBldmF1bGF0ZWQgYnkgZnVuY3Rpb24uXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IF9fZnVuY3Rpb25fXyAtIEEgZnVuY3Rpb24gdGhlIGxpbmsgd2lsbCBjYWxsIHdoZW4gaXQgaXMgY2xpY2tlZCBieSB1c2VyLiBJZiBpdCByZXR1cm5zIGZhbHNlLCB0aGUgbGluayB3aWxsIGFjdCBsaWtlIGEgbm9ybWFsIDxhPiBlbGVtZW50IGFuZCBjYXVzZSB0aGUgYnJvd3NlciB0byBuYXZpZ2F0ZSB0byB0aGUgXCJocmVmXCIgdmFsdWUuXHJcbiAqXHJcbiAqIElmIHRoZSA8YT4gZWxlbWVudCBoYXMgYSBkYXRhLWlnbm9yZV9saW5rIGF0dHJpYnV0ZSBzZXQgdG8gYSB0cnV0aHkgdmFsdWUsIHRoZW4gdGhpcyBmdW5jdGlvbiB3aWxsIG5vdCBjaGFuZ2UgdGhlIHdheSB0aGF0IGxpbmsgb3BlcmF0ZXMuXHJcbiAqIExpa2V3aXNlLCBpZiB0aGUgPGE+IGVsZW1lbnQgaGFzIGEgaHJlZiB0aGF0IHBvaW50cyBhbm90aGVyIGRvbWFpbiwgdGhlbiB0aGUgbGluayB3aWxsIHJlbWFpbiB1bmFmZmVjdGVkLlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0TGlua3MoZWxlbWVudCwgX19mdW5jdGlvbl9fKSB7XHJcbiAgICBsZXQgbGlua3MgPSBlbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKTtcclxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gbGlua3MubGVuZ3RoLCB0ZW1wLCBocmVmOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHRlbXAgPSBsaW5rc1tpXTtcclxuXHJcbiAgICAgICAgaWYgKHRlbXAuZGF0YXNldC5pZ25vcmVfbGluaykgY29udGludWU7XHJcblxyXG4gICAgICAgIGlmICh0ZW1wLm9yaWdpbiAhPT0gbG9jYXRpb24ub3JpZ2luKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgaWYgKCF0ZW1wLm9uY2xpY2spIHRlbXAub25jbGljayA9ICgoaHJlZiwgYSwgX19mdW5jdGlvbl9fKSA9PiAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGlmIChfX2Z1bmN0aW9uX18oaHJlZiwgYSkpIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9KSh0ZW1wLmhyZWYsIHRlbXAsIF9fZnVuY3Rpb25fXyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQge3NldExpbmtzfVxyXG4iLCJpbXBvcnQge0xleH0gZnJvbSBcIi4uL2NvbW1vblwiXHJcblxyXG5jbGFzcyBDb2xvciBleHRlbmRzIEZsb2F0NjRBcnJheXtcclxuXHJcblx0Y29uc3RydWN0b3IocixnLGIsYSA9IDApe1xyXG5cdFx0c3VwZXIoNClcclxuXHJcblx0XHR0aGlzLnIgPSAwO1xyXG5cdFx0dGhpcy5nID0gMDtcclxuXHRcdHRoaXMuYiA9IDA7XHJcblx0XHR0aGlzLmEgPSAxO1xyXG5cclxuXHRcdGlmKHR5cGVvZihyKSA9PSBcInN0cmluZ1wiKXtcclxuXHRcdFx0dGhpcy5mcm9tU3RyaW5nKHIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHRoaXMuciA9IHIgLy9NYXRoLm1heChNYXRoLm1pbihNYXRoLnJvdW5kKHIpLDI1NSksLTI1NSk7XHJcblx0XHRcdHRoaXMuZyA9IGcgLy9NYXRoLm1heChNYXRoLm1pbihNYXRoLnJvdW5kKGcpLDI1NSksLTI1NSk7XHJcblx0XHRcdHRoaXMuYiA9IGIgLy9NYXRoLm1heChNYXRoLm1pbihNYXRoLnJvdW5kKGIpLDI1NSksLTI1NSk7XHJcblx0XHRcdHRoaXMuYSA9IGEgLy9NYXRoLm1heChNYXRoLm1pbihhLDEpLC0xKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdldCByKCl7XHJcblx0XHRyZXR1cm4gdGhpc1swXTtcclxuXHR9XHJcblxyXG5cdHNldCByKHIpe1xyXG5cdFx0dGhpc1swXSA9IHI7XHJcblx0fVxyXG5cclxuXHRnZXQgZygpe1xyXG5cdFx0cmV0dXJuIHRoaXNbMV07XHJcblx0fVxyXG5cclxuXHRzZXQgZyhnKXtcclxuXHRcdHRoaXNbMV0gPSBnO1xyXG5cdH1cclxuXHJcblx0Z2V0IGIoKXtcclxuXHRcdHJldHVybiB0aGlzWzJdO1xyXG5cdH1cclxuXHJcblx0c2V0IGIoYil7XHJcblx0XHR0aGlzWzJdID0gYjtcclxuXHR9XHJcblxyXG5cdGdldCBhKCl7XHJcblx0XHRyZXR1cm4gdGhpc1szXTtcclxuXHR9XHJcblxyXG5cdHNldCBhKGEpe1xyXG5cdFx0dGhpc1szXSA9IGE7XHJcblx0fVxyXG5cclxuXHRzZXQoY29sb3Ipe1xyXG5cdFx0dGhpcy5yID0gY29sb3IucjtcclxuXHRcdHRoaXMuZyA9IGNvbG9yLmc7XHJcblx0XHR0aGlzLmIgPSBjb2xvci5iO1xyXG5cdFx0dGhpcy5hID0gKGNvbG9yLmEgIT0gdW5kZWZpbmVkKSA/IGNvbG9yLmEgOiB0aGlzLmE7XHJcblx0fVxyXG5cclxuXHRhZGQoY29sb3Ipe1xyXG5cdFx0cmV0dXJuIG5ldyBDb2xvcihcclxuXHRcdFx0Y29sb3IuciArIHRoaXMucixcclxuXHRcdFx0Y29sb3IuZyArIHRoaXMuZyxcclxuXHRcdFx0Y29sb3IuYiArIHRoaXMuYixcclxuXHRcdFx0Y29sb3IuYSArIHRoaXMuYVxyXG5cdFx0KVxyXG5cdH1cclxuXHJcblx0bXVsdChjb2xvcil7XHJcblx0XHRpZih0eXBlb2YoY29sb3IpID09IFwibnVtYmVyXCIpe1xyXG5cdFx0XHRyZXR1cm4gbmV3IENvbG9yKFxyXG5cdFx0XHRcdHRoaXMuciAqIGNvbG9yLFxyXG5cdFx0XHRcdHRoaXMuZyAqIGNvbG9yLFxyXG5cdFx0XHRcdHRoaXMuYiAqIGNvbG9yLFxyXG5cdFx0XHRcdHRoaXMuYSAqIGNvbG9yXHJcblx0XHRcdClcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gbmV3IENvbG9yKFxyXG5cdFx0XHRcdHRoaXMuciAqIGNvbG9yLnIsXHJcblx0XHRcdFx0dGhpcy5nICogY29sb3IuZyxcclxuXHRcdFx0XHR0aGlzLmIgKiBjb2xvci5iLFxyXG5cdFx0XHRcdHRoaXMuYSAqIGNvbG9yLmFcclxuXHRcdFx0KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3ViKGNvbG9yKXtcclxuXHRcdHJldHVybiBuZXcgQ29sb3IoXHJcblx0XHRcdCB0aGlzLnIgLSBjb2xvci5yLFxyXG5cdFx0XHQgdGhpcy5nIC0gY29sb3IuZyxcclxuXHRcdFx0IHRoaXMuYiAtIGNvbG9yLmIsXHJcblx0XHRcdCB0aGlzLmEgLSBjb2xvci5hXHJcblx0XHQpXHJcblx0fVxyXG5cclxuXHR0b1N0cmluZygpe1xyXG5cdFx0cmV0dXJuIGByZ2JhKCR7dGhpcy5yfDB9LCAke3RoaXMuZ3wwfSwgJHt0aGlzLmJ8MH0sICR7dGhpcy5hfSlgO1xyXG5cdH1cclxuXHJcblx0ZnJvbVN0cmluZyhzdHJpbmcpe1xyXG5cdFx0XHJcblx0XHRsZXQgbGV4ZXIgPSBMZXgoc3RyaW5nKVxyXG5cclxuXHRcdGxldCByLGcsYixhO1xyXG5cdFx0c3dpdGNoKGxleGVyLnRva2VuLnRleHQpe1xyXG5cclxuXHJcblx0XHRcdGNhc2UgXCJyZ2JcIjpcclxuXHRcdFx0XHRsZXhlci5uZXh0KCkgLy8gKFxyXG5cdFx0XHRcdHIgPSBwYXJzZUludChsZXhlci5uZXh0KCkudGV4dClcclxuXHRcdFx0XHRsZXhlci5uZXh0KCkgLy8gLFxyXG5cdFx0XHRcdGcgPSBwYXJzZUludChsZXhlci5uZXh0KCkudGV4dClcclxuXHRcdFx0XHRsZXhlci5uZXh0KCkgLy8gLFxyXG5cdFx0XHRcdGIgPSBwYXJzZUludChsZXhlci5uZXh0KCkudGV4dClcclxuXHRcdFx0XHR0aGlzLnNldCh7cixnLGJ9KTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlIFwicmdiYVwiOlxyXG5cdFx0XHRcdGxleGVyLm5leHQoKSAvLyAoXHJcblx0XHRcdFx0ciA9IHBhcnNlSW50KGxleGVyLm5leHQoKS50ZXh0KVxyXG5cdFx0XHRcdGxleGVyLm5leHQoKSAvLyAsXHJcblx0XHRcdFx0ZyA9IHBhcnNlSW50KGxleGVyLm5leHQoKS50ZXh0KVxyXG5cdFx0XHRcdGxleGVyLm5leHQoKSAvLyAsXHJcblx0XHRcdFx0YiA9IHBhcnNlSW50KGxleGVyLm5leHQoKS50ZXh0KVxyXG5cdFx0XHRcdGxleGVyLm5leHQoKSAvLyAsXHJcblx0XHRcdFx0YSA9IHBhcnNlRmxvYXQobGV4ZXIubmV4dCgpLnRleHQpXHJcblx0XHRcdFx0dGhpcy5zZXQoe3IsZyxiLGF9KTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlIFwiI1wiOlxyXG5cdFx0XHRcdHZhciB2YWx1ZSA9IGxleGVyLm5leHQoKS50ZXh0O1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGRlZmF1bHQ6XHJcblxyXG5cdFx0XHRcdGlmKENvbG9yLmNvbG9yc1tzdHJpbmddKVxyXG5cdFx0XHRcdFx0dGhpcy5zZXQoQ29sb3IuY29sb3JzW3N0cmluZ10gIHx8IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1LCAwLjAwMDEpKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5Db2xvci5jb2xvcnMgPSB7XHJcblx0XCJ0cmFuc3BhcmVudFwiIDogbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUsIDAuMDAwMSksXHJcblx0XCJjbGVhclwiIDogbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUsIDAuMDAwMSksXHJcblx0XCJyZWRcIiA6IG5ldyBDb2xvcigyNTUsIDAsIDApLFxyXG5cdFwiZ3JlZW5cIiA6IG5ldyBDb2xvcigwLCAyNTUsIDApLFxyXG5cdFwiYmx1ZVwiIDogbmV3IENvbG9yKDAsIDAsIDI1NSksXHJcblx0XCJCbGFja1wiOiBuZXcgQ29sb3IoMCwwLDApLFxyXG4gXHRcIldoaXRlXCI6IG5ldyBDb2xvcigyNTUsMjU1LDI1NSksXHJcbiBcdFwid2hpdGVcIjogbmV3IENvbG9yKDI1NSwyNTUsMjU1KSxcclxuIFx0XCJSZWRcIjogbmV3IENvbG9yKDI1NSwwLDApLFxyXG4gXHRcIkxpbWVcIjogbmV3IENvbG9yKDAsMjU1LDApLFxyXG4gXHRcIkJsdWVcIjogbmV3IENvbG9yKDAsMCwyNTUpLFxyXG4gXHRcIlllbGxvd1wiOiBuZXcgQ29sb3IoMjU1LDI1NSwwKSxcclxuIFx0XCJDeWFuXCI6IG5ldyBDb2xvcigwLDI1NSwyNTUpLFxyXG4gXHRcIkFxdWFcIjogbmV3IENvbG9yKDAsMjU1LDI1NSksXHJcbiBcdFwiTWFnZW50YVwiOiBuZXcgQ29sb3IoMjU1LDAsMjU1KSAsXHJcbiBcdFwiRnVjaHNpYVwiOiBuZXcgQ29sb3IoMjU1LDAsMjU1KSxcclxuIFx0XCJTaWx2ZXJcIjogbmV3IENvbG9yKDE5MiwxOTIsMTkyKSxcclxuIFx0XCJHcmF5XCI6IG5ldyBDb2xvcigxMjgsMTI4LDEyOCksXHJcbiBcdFwiTWFyb29uXCI6IG5ldyBDb2xvcigxMjgsMCwwKSxcclxuIFx0XCJPbGl2ZVwiOiBuZXcgQ29sb3IoMTI4LDEyOCwwKSxcclxuIFx0XCJHcmVlblwiOiBuZXcgQ29sb3IoMCwxMjgsMCksXHJcbiBcdFwiUHVycGxlXCI6IG5ldyBDb2xvcigxMjgsMCwxMjgpLFxyXG4gXHRcIlRlYWxcIjogbmV3IENvbG9yKDAsMTI4LDEyOCksXHJcbiBcdFwiTmF2eVwiOiBuZXcgQ29sb3IoMCwwLDEyOCksXHJcbiBcdFwibWFyb29uXCI6IG5ldyBDb2xvcigxMjgsMCwwKSxcclxuIFx0XCJkYXJrIHJlZFwiOiBuZXcgQ29sb3IoMTM5LDAsMCksXHJcbiBcdFwiYnJvd25cIjogbmV3IENvbG9yKDE2NSw0Miw0MiksXHJcbiBcdFwiZmlyZWJyaWNrXCI6IG5ldyBDb2xvcigxNzgsMzQsMzQpLFxyXG4gXHRcImNyaW1zb25cIjogbmV3IENvbG9yKDIyMCwyMCw2MCksXHJcbiBcdFwicmVkXCI6IG5ldyBDb2xvcigyNTUsMCwwKSxcclxuIFx0XCJ0b21hdG9cIjogbmV3IENvbG9yKDI1NSw5OSw3MSksXHJcbiBcdFwiY29yYWxcIjogbmV3IENvbG9yKDI1NSwxMjcsODApLFxyXG4gXHRcImluZGlhbiByZWRcIjogbmV3IENvbG9yKDIwNSw5Miw5MiksXHJcbiBcdFwibGlnaHQgY29yYWxcIjogbmV3IENvbG9yKDI0MCwxMjgsMTI4KSxcclxuIFx0XCJkYXJrIHNhbG1vblwiOiBuZXcgQ29sb3IoMjMzLDE1MCwxMjIpLFxyXG4gXHRcInNhbG1vblwiOiBuZXcgQ29sb3IoMjUwLDEyOCwxMTQpLFxyXG4gXHRcImxpZ2h0IHNhbG1vblwiOiBuZXcgQ29sb3IoMjU1LDE2MCwxMjIpLFxyXG4gXHRcIm9yYW5nZSByZWRcIjogbmV3IENvbG9yKDI1NSw2OSwwKSxcclxuIFx0XCJkYXJrIG9yYW5nZVwiOiBuZXcgQ29sb3IoMjU1LDE0MCwwKSxcclxuIFx0XCJvcmFuZ2VcIjogbmV3IENvbG9yKDI1NSwxNjUsMCksXHJcbiBcdFwiZ29sZFwiOiBuZXcgQ29sb3IoMjU1LDIxNSwwKSxcclxuIFx0XCJkYXJrIGdvbGRlbiByb2RcIjogbmV3IENvbG9yKDE4NCwxMzQsMTEpLFxyXG4gXHRcImdvbGRlbiByb2RcIjogbmV3IENvbG9yKDIxOCwxNjUsMzIpLFxyXG4gXHRcInBhbGUgZ29sZGVuIHJvZFwiOiBuZXcgQ29sb3IoMjM4LDIzMiwxNzApLFxyXG4gXHRcImRhcmsga2hha2lcIjogbmV3IENvbG9yKDE4OSwxODMsMTA3KSxcclxuIFx0XCJraGFraVwiOiBuZXcgQ29sb3IoMjQwLDIzMCwxNDApLFxyXG4gXHRcIm9saXZlXCI6IG5ldyBDb2xvcigxMjgsMTI4LDApLFxyXG4gXHRcInllbGxvd1wiOiBuZXcgQ29sb3IoMjU1LDI1NSwwKSxcclxuIFx0XCJ5ZWxsb3cgZ3JlZW5cIjogbmV3IENvbG9yKDE1NCwyMDUsNTApLFxyXG4gXHRcImRhcmsgb2xpdmUgZ3JlZW5cIjogbmV3IENvbG9yKDg1LDEwNyw0NyksXHJcbiBcdFwib2xpdmUgZHJhYlwiOiBuZXcgQ29sb3IoMTA3LDE0MiwzNSksXHJcbiBcdFwibGF3biBncmVlblwiOiBuZXcgQ29sb3IoMTI0LDI1MiwwKSxcclxuIFx0XCJjaGFydCByZXVzZVwiOiBuZXcgQ29sb3IoMTI3LDI1NSwwKSxcclxuIFx0XCJncmVlbiB5ZWxsb3dcIjogbmV3IENvbG9yKDE3MywyNTUsNDcpLFxyXG4gXHRcImRhcmsgZ3JlZW5cIjogbmV3IENvbG9yKDAsMTAwLDApLFxyXG4gXHRcImdyZWVuXCI6IG5ldyBDb2xvcigwLDEyOCwwKSxcclxuIFx0XCJmb3Jlc3QgZ3JlZW5cIjogbmV3IENvbG9yKDM0LDEzOSwzNCksXHJcbiBcdFwibGltZVwiOiBuZXcgQ29sb3IoMCwyNTUsMCksXHJcbiBcdFwibGltZSBncmVlblwiOiBuZXcgQ29sb3IoNTAsMjA1LDUwKSxcclxuIFx0XCJsaWdodCBncmVlblwiOiBuZXcgQ29sb3IoMTQ0LDIzOCwxNDQpLFxyXG4gXHRcInBhbGUgZ3JlZW5cIjogbmV3IENvbG9yKDE1MiwyNTEsMTUyKSxcclxuIFx0XCJkYXJrIHNlYSBncmVlblwiOiBuZXcgQ29sb3IoMTQzLDE4OCwxNDMpLFxyXG4gXHRcIm1lZGl1bSBzcHJpbmcgZ3JlZW5cIjogbmV3IENvbG9yKDAsMjUwLDE1NCksXHJcbiBcdFwic3ByaW5nIGdyZWVuXCI6IG5ldyBDb2xvcigwLDI1NSwxMjcpLFxyXG4gXHRcInNlYSBncmVlblwiOiBuZXcgQ29sb3IoNDYsMTM5LDg3KSxcclxuIFx0XCJtZWRpdW0gYXF1YSBtYXJpbmVcIjogbmV3IENvbG9yKDEwMiwyMDUsMTcwKSxcclxuIFx0XCJtZWRpdW0gc2VhIGdyZWVuXCI6IG5ldyBDb2xvcig2MCwxNzksMTEzKSxcclxuIFx0XCJsaWdodCBzZWEgZ3JlZW5cIjogbmV3IENvbG9yKDMyLDE3OCwxNzApLFxyXG4gXHRcImRhcmsgc2xhdGUgZ3JheVwiOiBuZXcgQ29sb3IoNDcsNzksNzkpLFxyXG4gXHRcInRlYWxcIjogbmV3IENvbG9yKDAsMTI4LDEyOCksXHJcbiBcdFwiZGFyayBjeWFuXCI6IG5ldyBDb2xvcigwLDEzOSwxMzkpLFxyXG4gXHRcImFxdWFcIjogbmV3IENvbG9yKDAsMjU1LDI1NSksXHJcbiBcdFwiY3lhblwiOiBuZXcgQ29sb3IoMCwyNTUsMjU1KSxcclxuIFx0XCJsaWdodCBjeWFuXCI6IG5ldyBDb2xvcigyMjQsMjU1LDI1NSksXHJcbiBcdFwiZGFyayB0dXJxdW9pc2VcIjogbmV3IENvbG9yKDAsMjA2LDIwOSksXHJcbiBcdFwidHVycXVvaXNlXCI6IG5ldyBDb2xvcig2NCwyMjQsMjA4KSxcclxuIFx0XCJtZWRpdW0gdHVycXVvaXNlXCI6IG5ldyBDb2xvcig3MiwyMDksMjA0KSxcclxuIFx0XCJwYWxlIHR1cnF1b2lzZVwiOiBuZXcgQ29sb3IoMTc1LDIzOCwyMzgpLFxyXG4gXHRcImFxdWEgbWFyaW5lXCI6IG5ldyBDb2xvcigxMjcsMjU1LDIxMiksXHJcbiBcdFwicG93ZGVyIGJsdWVcIjogbmV3IENvbG9yKDE3NiwyMjQsMjMwKSxcclxuIFx0XCJjYWRldCBibHVlXCI6IG5ldyBDb2xvcig5NSwxNTgsMTYwKSxcclxuIFx0XCJzdGVlbCBibHVlXCI6IG5ldyBDb2xvcig3MCwxMzAsMTgwKSxcclxuIFx0XCJjb3JuIGZsb3dlciBibHVlXCI6IG5ldyBDb2xvcigxMDAsMTQ5LDIzNyksXHJcbiBcdFwiZGVlcCBza3kgYmx1ZVwiOiBuZXcgQ29sb3IoMCwxOTEsMjU1KSxcclxuIFx0XCJkb2RnZXIgYmx1ZVwiOiBuZXcgQ29sb3IoMzAsMTQ0LDI1NSksXHJcbiBcdFwibGlnaHQgYmx1ZVwiOiBuZXcgQ29sb3IoMTczLDIxNiwyMzApLFxyXG4gXHRcInNreSBibHVlXCI6IG5ldyBDb2xvcigxMzUsMjA2LDIzNSksXHJcbiBcdFwibGlnaHQgc2t5IGJsdWVcIjogbmV3IENvbG9yKDEzNSwyMDYsMjUwKSxcclxuIFx0XCJtaWRuaWdodCBibHVlXCI6IG5ldyBDb2xvcigyNSwyNSwxMTIpLFxyXG4gXHRcIm5hdnlcIjogbmV3IENvbG9yKDAsMCwxMjgpLFxyXG4gXHRcImRhcmsgYmx1ZVwiOiBuZXcgQ29sb3IoMCwwLDEzOSksXHJcbiBcdFwibWVkaXVtIGJsdWVcIjogbmV3IENvbG9yKDAsMCwyMDUpLFxyXG4gXHRcImJsdWVcIjogbmV3IENvbG9yKDAsMCwyNTUpLFxyXG4gXHRcInJveWFsIGJsdWVcIjogbmV3IENvbG9yKDY1LDEwNSwyMjUpLFxyXG4gXHRcImJsdWUgdmlvbGV0XCI6IG5ldyBDb2xvcigxMzgsNDMsMjI2KSxcclxuIFx0XCJpbmRpZ29cIjogbmV3IENvbG9yKDc1LDAsMTMwKSxcclxuIFx0XCJkYXJrIHNsYXRlIGJsdWVcIjogbmV3IENvbG9yKDcyLDYxLDEzOSksXHJcbiBcdFwic2xhdGUgYmx1ZVwiOiBuZXcgQ29sb3IoMTA2LDkwLDIwNSksXHJcbiBcdFwibWVkaXVtIHNsYXRlIGJsdWVcIjogbmV3IENvbG9yKDEyMywxMDQsMjM4KSxcclxuIFx0XCJtZWRpdW0gcHVycGxlXCI6IG5ldyBDb2xvcigxNDcsMTEyLDIxOSksXHJcbiBcdFwiZGFyayBtYWdlbnRhXCI6IG5ldyBDb2xvcigxMzksMCwxMzkpLFxyXG4gXHRcImRhcmsgdmlvbGV0XCI6IG5ldyBDb2xvcigxNDgsMCwyMTEpLFxyXG4gXHRcImRhcmsgb3JjaGlkXCI6IG5ldyBDb2xvcigxNTMsNTAsMjA0KSxcclxuIFx0XCJtZWRpdW0gb3JjaGlkXCI6IG5ldyBDb2xvcigxODYsODUsMjExKSxcclxuIFx0XCJwdXJwbGVcIjogbmV3IENvbG9yKDEyOCwwLDEyOCksXHJcbiBcdFwidGhpc3RsZVwiOiBuZXcgQ29sb3IoMjE2LDE5MSwyMTYpLFxyXG4gXHRcInBsdW1cIjogbmV3IENvbG9yKDIyMSwxNjAsMjIxKSxcclxuIFx0XCJ2aW9sZXRcIjogbmV3IENvbG9yKDIzOCwxMzAsMjM4KSxcclxuIFx0XCJtYWdlbnRhXCI6IG5ldyBDb2xvcigyNTUsMCwyNTUpLFxyXG4gXHRcImZ1Y2hzaWFcIjogbmV3IENvbG9yKDI1NSwwLDI1NSksXHJcbiBcdFwib3JjaGlkXCI6IG5ldyBDb2xvcigyMTgsMTEyLDIxNCksXHJcbiBcdFwibWVkaXVtIHZpb2xldCByZWRcIjogbmV3IENvbG9yKDE5OSwyMSwxMzMpLFxyXG4gXHRcInBhbGUgdmlvbGV0IHJlZFwiOiBuZXcgQ29sb3IoMjE5LDExMiwxNDcpLFxyXG4gXHRcImRlZXAgcGlua1wiOiBuZXcgQ29sb3IoMjU1LDIwLDE0NyksXHJcbiBcdFwiaG90IHBpbmtcIjogbmV3IENvbG9yKDI1NSwxMDUsMTgwKSxcclxuIFx0XCJsaWdodCBwaW5rXCI6IG5ldyBDb2xvcigyNTUsMTgyLDE5MyksXHJcbiBcdFwicGlua1wiOiBuZXcgQ29sb3IoMjU1LDE5MiwyMDMpLFxyXG4gXHRcImFudGlxdWUgd2hpdGVcIjogbmV3IENvbG9yKDI1MCwyMzUsMjE1KSxcclxuIFx0XCJiZWlnZVwiOiBuZXcgQ29sb3IoMjQ1LDI0NSwyMjApLFxyXG4gXHRcImJpc3F1ZVwiOiBuZXcgQ29sb3IoMjU1LDIyOCwxOTYpLFxyXG4gXHRcImJsYW5jaGVkIGFsbW9uZFwiOiBuZXcgQ29sb3IoMjU1LDIzNSwyMDUpLFxyXG4gXHRcIndoZWF0XCI6IG5ldyBDb2xvcigyNDUsMjIyLDE3OSksXHJcbiBcdFwiY29ybiBzaWxrXCI6IG5ldyBDb2xvcigyNTUsMjQ4LDIyMCksXHJcbiBcdFwibGVtb24gY2hpZmZvblwiOiBuZXcgQ29sb3IoMjU1LDI1MCwyMDUpLFxyXG4gXHRcImxpZ2h0IGdvbGRlbiByb2QgeWVsbG93XCI6IG5ldyBDb2xvcigyNTAsMjUwLDIxMCksXHJcbiBcdFwibGlnaHQgeWVsbG93XCI6IG5ldyBDb2xvcigyNTUsMjU1LDIyNCksXHJcbiBcdFwic2FkZGxlIGJyb3duXCI6IG5ldyBDb2xvcigxMzksNjksMTkpLFxyXG4gXHRcInNpZW5uYVwiOiBuZXcgQ29sb3IoMTYwLDgyLDQ1KSxcclxuIFx0XCJjaG9jb2xhdGVcIjogbmV3IENvbG9yKDIxMCwxMDUsMzApLFxyXG4gXHRcInBlcnVcIjogbmV3IENvbG9yKDIwNSwxMzMsNjMpLFxyXG4gXHRcInNhbmR5IGJyb3duXCI6IG5ldyBDb2xvcigyNDQsMTY0LDk2KSxcclxuIFx0XCJidXJseSB3b29kXCI6IG5ldyBDb2xvcigyMjIsMTg0LDEzNSksXHJcbiBcdFwidGFuXCI6IG5ldyBDb2xvcigyMTAsMTgwLDE0MCksXHJcbiBcdFwicm9zeSBicm93blwiOiBuZXcgQ29sb3IoMTg4LDE0MywxNDMpLFxyXG4gXHRcIm1vY2Nhc2luXCI6IG5ldyBDb2xvcigyNTUsMjI4LDE4MSksXHJcbiBcdFwibmF2YWpvIHdoaXRlXCI6IG5ldyBDb2xvcigyNTUsMjIyLDE3MyksXHJcbiBcdFwicGVhY2ggcHVmZlwiOiBuZXcgQ29sb3IoMjU1LDIxOCwxODUpLFxyXG4gXHRcIm1pc3R5IHJvc2VcIjogbmV3IENvbG9yKDI1NSwyMjgsMjI1KSxcclxuIFx0XCJsYXZlbmRlciBibHVzaFwiOiBuZXcgQ29sb3IoMjU1LDI0MCwyNDUpLFxyXG4gXHRcImxpbmVuXCI6IG5ldyBDb2xvcigyNTAsMjQwLDIzMCksXHJcbiBcdFwib2xkIGxhY2VcIjogbmV3IENvbG9yKDI1MywyNDUsMjMwKSxcclxuIFx0XCJwYXBheWEgd2hpcFwiOiBuZXcgQ29sb3IoMjU1LDIzOSwyMTMpLFxyXG4gXHRcInNlYSBzaGVsbFwiOiBuZXcgQ29sb3IoMjU1LDI0NSwyMzgpLFxyXG4gXHRcIm1pbnQgY3JlYW1cIjogbmV3IENvbG9yKDI0NSwyNTUsMjUwKSxcclxuIFx0XCJzbGF0ZSBncmF5XCI6IG5ldyBDb2xvcigxMTIsMTI4LDE0NCksXHJcbiBcdFwibGlnaHQgc2xhdGUgZ3JheVwiOiBuZXcgQ29sb3IoMTE5LDEzNiwxNTMpLFxyXG4gXHRcImxpZ2h0IHN0ZWVsIGJsdWVcIjogbmV3IENvbG9yKDE3NiwxOTYsMjIyKSxcclxuIFx0XCJsYXZlbmRlclwiOiBuZXcgQ29sb3IoMjMwLDIzMCwyNTApLFxyXG4gXHRcImZsb3JhbCB3aGl0ZVwiOiBuZXcgQ29sb3IoMjU1LDI1MCwyNDApLFxyXG4gXHRcImFsaWNlIGJsdWVcIjogbmV3IENvbG9yKDI0MCwyNDgsMjU1KSxcclxuIFx0XCJnaG9zdCB3aGl0ZVwiOiBuZXcgQ29sb3IoMjQ4LDI0OCwyNTUpLFxyXG4gXHRcImhvbmV5ZGV3XCI6IG5ldyBDb2xvcigyNDAsMjU1LDI0MCksXHJcbiBcdFwiaXZvcnlcIjogbmV3IENvbG9yKDI1NSwyNTUsMjQwKSxcclxuIFx0XCJhenVyZVwiOiBuZXcgQ29sb3IoMjQwLDI1NSwyNTUpLFxyXG4gXHRcInNub3dcIjogbmV3IENvbG9yKDI1NSwyNTAsMjUwKSxcclxuIFx0XCJibGFja1wiOiBuZXcgQ29sb3IoMCwwLDApLFxyXG4gXHRcImRpbSBncmF5XCI6IG5ldyBDb2xvcigxMDUsMTA1LDEwNSksXHJcbiBcdFwiZGltIGdyZXlcIjogbmV3IENvbG9yKDEwNSwxMDUsMTA1KSxcclxuIFx0XCJncmF5XCI6IG5ldyBDb2xvcigxMjgsMTI4LDEyOCksXHJcbiBcdFwiZ3JleVwiOiBuZXcgQ29sb3IoMTI4LDEyOCwxMjgpLFxyXG4gXHRcImRhcmsgZ3JheVwiOiBuZXcgQ29sb3IoMTY5LDE2OSwxNjkpLFxyXG4gXHRcImRhcmsgZ3JleVwiOiBuZXcgQ29sb3IoMTY5LDE2OSwxNjkpLFxyXG4gXHRcInNpbHZlclwiOiBuZXcgQ29sb3IoMTkyLDE5MiwxOTIpLFxyXG4gXHRcImxpZ2h0IGdyYXlcIjogbmV3IENvbG9yKDIxMSwyMTEsMjExKSxcclxuIFx0XCJsaWdodCBncmV5XCI6IG5ldyBDb2xvcigyMTEsMjExLDIxMSksXHJcbiBcdFwiZ2FpbnNib3JvXCI6IG5ldyBDb2xvcigyMjAsMjIwLDIyMCksXHJcbiBcdFwid2hpdGUgc21va2VcIjogbmV3IENvbG9yKDI0NSwyNDUsMjQ1KSxcclxuIFx0XCJ3aGl0ZVwiOiBuZXcgQ29sb3IoMjU1LDI1NSwyNTUpXHJcbn1cclxuXHJcbmV4cG9ydCB7Q29sb3J9XHJcbiIsImltcG9ydCB7XHJcbiAgICBDb2xvclxyXG59IGZyb20gXCIuL2NvbG9yXCJcclxuaW1wb3J0IHtcclxuICAgIENCZXppZXJcclxufSBmcm9tIFwiLi4vY29tbW9uXCJcclxuaW1wb3J0IHtcclxuICAgIFNjaGVkdWxlclxyXG59IGZyb20gXCIuLi9zY2hlZHVsZXJcIlxyXG5cclxudmFyIGVhc2Vfb3V0ID0gbmV3IENCZXppZXIoMC41LCAwLjIsIDAsIDEpO1xyXG5cclxuaWYgKCFyZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSAoZSkgPT4ge1xyXG4gICAgICAgIHNldFRpbWVvdXQoZSwgMTAwMCk7XHJcbiAgICB9XHJcblxyXG5jbGFzcyBUVF9Gcm9tIHtcclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcclxuICAgICAgICAvL2V4dHJhY3RlZCBhbmltYXRhYmxlIGNvbXBvbmVudHNcclxuICAgICAgICB2YXIgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29sb3IgPSBuZXcgQ29sb3Iod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcImJhY2tncm91bmQtY29sb3JcIikpO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gcGFyc2VGbG9hdCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiaGVpZ2h0XCIpKTtcclxuICAgICAgICB0aGlzLndpZHRoID0gcGFyc2VGbG9hdCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwid2lkdGhcIikpO1xyXG5cclxuICAgICAgICAvLyppZighdGhpcy5oZWlnaHQgfHwgIXRoaXMud2lkdGgpe1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHJlY3Qud2lkdGg7XHJcbiAgICAgICAgLy99Ki9cclxuXHJcblxyXG4gICAgICAgIHRoaXMubGVmdCA9IHBhcnNlRmxvYXQocmVjdC5sZWZ0KTtcclxuICAgICAgICB0aGlzLnRvcCA9IHBhcnNlRmxvYXQocmVjdC50b3ApO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGVuZCgpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFRUX1RvIGV4dGVuZHMgVFRfRnJvbSB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBmcm9tKSB7XHJcbiAgICAgICAgc3VwZXIoZWxlbWVudCk7XHJcblxyXG4gICAgICAgIHRoaXMuZnJvbSA9IGZyb207XHJcblxyXG4gICAgICAgIHRoaXMucmVzID0gKChlbGVtZW50LnN0eWxlLnRvcCkgJiYgKGVsZW1lbnQuc3R5bGUubGVmdCkpO1xyXG5cclxuICAgICAgICB0aGlzLnJ0ID0gKGVsZW1lbnQuc3R5bGUudG9wKSA/IChlbGVtZW50LnN0eWxlLnRvcCkgOiBudWxsO1xyXG4gICAgICAgIHRoaXMucmwgPSBlbGVtZW50LnN0eWxlLmxlZnQgPyBlbGVtZW50LnN0eWxlLmxlZnQgOiBudWxsO1xyXG5cclxuXHJcbiAgICAgICAgLy9nZXQgdGhlIHJlbGF0aXZlIG9mZnNldCBvZiB0aGlzIG9iamVjdFxyXG4gICAgICAgIHZhciBvZmZzZXRfeCA9IDA7IC0gZWxlbWVudC5nZXRQYXJlbnRXaW5kb3dMZWZ0KCk7XHJcbiAgICAgICAgdmFyIG9mZnNldF95ID0gMDsgLSBlbGVtZW50LmdldFBhcmVudFdpbmRvd1RvcCgpO1xyXG5cclxuICAgICAgICB2YXIgb2Zmc2V0X3ggPSBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJsZWZ0XCIpKTtcclxuICAgICAgICB2YXIgb2Zmc2V0X3kgPSBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJ0b3BcIikpO1xyXG4gICAgICAgIC8vQW5kIGFkanVzdCBzdGFydCB0byByZXNwZWN0IHRoZSBlbGVtZW50cyBvd24gcGFyZW50YWwgb2Zmc2V0c1xyXG4gICAgICAgIHZhciBkaWZmeCA9IHRoaXMubGVmdCAtIHRoaXMuZnJvbS5sZWZ0O1xyXG4gICAgICAgIHRoaXMubGVmdCA9IG9mZnNldF94O1xyXG4gICAgICAgIHRoaXMuZnJvbS5sZWZ0ID0gdGhpcy5sZWZ0IC0gZGlmZng7XHJcblxyXG4gICAgICAgIHZhciBkaWZmeSA9IHRoaXMudG9wIC0gdGhpcy5mcm9tLnRvcDtcclxuICAgICAgICB0aGlzLnRvcCA9IG9mZnNldF95O1xyXG4gICAgICAgIHRoaXMuZnJvbS50b3AgPSB0aGlzLnRvcCAtIGRpZmZ5O1xyXG5cclxuICAgICAgICB0aGlzLnRpbWUgPSA2MCAqIC4zNTtcclxuICAgICAgICB0aGlzLnMgPSAwO1xyXG4gICAgICAgIHRoaXMuY29sb3JfbyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJiYWNrZ3JvdW5kLWNvbG9yXCIpO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0X28gPSBlbGVtZW50LnN0eWxlLndpZHRoO1xyXG4gICAgICAgIHRoaXMud2lkdGhfbyA9IGVsZW1lbnQuc3R5bGUuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMudG9wX28gPSB0aGlzLnRvcDtcclxuICAgICAgICB0aGlzLmxlZnRfbyA9IHRoaXMubGVmdDtcclxuICAgICAgICB0aGlzLnBvcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJwb3NpdGlvblwiKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbmQoKTsgLy9SZXN0b3JlIGV2ZXJ5dGhpbmcgYmFjayB0byBpdCdzIG9yaWdpbmFsIHR5cGU7XHJcbiAgICAgICAgdGhpcy5mcm9tID0gbnVsbDtcclxuICAgICAgICB0aGlzLnMgPSBJbmZpbml0eTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IHRoaXMuZnJvbS50b3AgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSB0aGlzLmZyb20ubGVmdCArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLmZyb20ud2lkdGggKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuZnJvbS5oZWlnaHQgKyBcInB4XCI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCgpIHtcclxuICAgICAgICB0aGlzLnMrK1xyXG5cclxuICAgICAgICAgICAgdmFyIHQgPSB0aGlzLnMgLyB0aGlzLnRpbWU7XHJcblxyXG4gICAgICAgIGlmICh0ID4gMSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICB2YXIgcmF0aW8gPSBlYXNlX291dC5nZXRZYXRYKHQpO1xyXG5cclxuICAgICAgICBpZiAocmF0aW8gPiAxKSByYXRpbyA9IDE7XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSBNYXRoLnJvdW5kKCh0aGlzLnRvcCAtIHRoaXMuZnJvbS50b3ApICogcmF0aW8gKyB0aGlzLmZyb20udG9wKSArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IE1hdGgucm91bmQoKHRoaXMubGVmdCAtIHRoaXMuZnJvbS5sZWZ0KSAqIHJhdGlvICsgdGhpcy5mcm9tLmxlZnQpICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9ICgodGhpcy53aWR0aCAtIHRoaXMuZnJvbS53aWR0aCkgKiByYXRpbyArIHRoaXMuZnJvbS53aWR0aCkgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICgodGhpcy5oZWlnaHQgLSB0aGlzLmZyb20uaGVpZ2h0KSAqIHJhdGlvICsgdGhpcy5mcm9tLmhlaWdodCkgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICh0aGlzLmNvbG9yLnN1Yih0aGlzLmZyb20uY29sb3IpLm11bHQocmF0aW8pLmFkZCh0aGlzLmZyb20uY29sb3IpKSArIFwiXCI7XHJcblxyXG4gICAgICAgIHJldHVybiAodCA8IDAuOTk5OTk5NSk7XHJcbiAgICB9XHJcblxyXG4gICAgZW5kKCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodF9vO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGhfbztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gdGhpcy5ydDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IHRoaXMucmw7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5jbGFzcyBUVFBhaXIge1xyXG4gICAgY29uc3RydWN0b3IoZV90bywgZV9mcm9tKSB7XHJcbiAgICAgICAgdGhpcy5iID0gKGVfZnJvbSBpbnN0YW5jZW9mIFRUX0Zyb20pID8gZV9mcm9tIDogbmV3IFRUX0Zyb20oZV9mcm9tKTtcclxuICAgICAgICB0aGlzLmEgPSBuZXcgVFRfVG8oZV90bywgdGhpcy5iKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYS5lbGVtZW50Ll9fVFRfXylcclxuICAgICAgICAgICAgdGhpcy5hLmVsZW1lbnQuX19UVF9fLmRlc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYi5lbGVtZW50Ll9fVFRfXylcclxuICAgICAgICAgICAgdGhpcy5iLmVsZW1lbnQuX19UVF9fLmRlc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hLmVsZW1lbnQuX19UVF9fID0gdGhpcztcclxuICAgICAgICB0aGlzLmIuZWxlbWVudC5fX1RUX18gPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHJldHVyblxyXG4gICAgICAgIGlmICh0aGlzLmIuZWxlbWVudClcclxuICAgICAgICAgICAgdGhpcy5iLmVsZW1lbnQuX19UVF9fID0gbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5hLmVsZW1lbnQpXHJcbiAgICAgICAgICAgIHRoaXMuYS5lbGVtZW50Ll9fVFRfXyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5hLmRlc3RydWN0b3IoKTtcclxuICAgICAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5iLnN0YXJ0KCk7XHJcbiAgICAgICAgdGhpcy5hLnN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hLnN0ZXAoKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVHJhbnNmb3JtUnVubmVyID0gbmV3IChjbGFzc3tcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucGFpcnMgPSBbXTtcclxuICAgICAgICB0aGlzLl9fX19TQ0hFRFVMRURfX19fID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVzaFBhaXIocGFpcikge1xyXG4gICAgICAgIHRoaXMucGFpcnMucHVzaChwYWlyKTtcclxuICAgICAgICBTY2hlZHVsZXIucXVldWVVcGRhdGUodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKHJhdGlvKSB7XHJcbiAgICAgICAgbGV0IHJwID0gdGhpcy5wYWlycztcclxuXHJcbiAgICAgICAgaWYocnAubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgU2NoZWR1bGVyLnF1ZXVlVXBkYXRlKHRoaXMpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBfcnAgPSBycFtpXTtcclxuICAgICAgICAgICAgaWYgKCFfcnAuc3RlcChyYXRpbykpIHtcclxuICAgICAgICAgICAgICAgIF9ycC5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgICAgICBycC5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgIH1cclxufSkoKVxyXG5cclxuXHJcbi8qKlxyXG4gICAgVHJhbnNmb3JtIG9uZSBlbGVtZW50IGZyb20gYW5vdGhlciBiYWNrIHRvIGl0c2VsZlxyXG4qL1xyXG5mdW5jdGlvbiBUcmFuc2Zvcm1UbyhlbGVtZW50X2Zyb20sIGVsZW1lbnRfdG8sIEhJREVfT1RIRVIpIHtcclxuXHJcblxyXG4gICAgaWYgKCFlbGVtZW50X3RvKSB7XHJcblxyXG4gICAgICAgIGxldCBhID0gKGZyb20pID0+IChlbGVtZW50X3RvLCBISURFX09USEVSKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBwYWlyID0gbmV3IFRUUGFpcihlbGVtZW50X3RvLCBmcm9tKTtcclxuICAgICAgICAgICAgVHJhbnNmb3JtUnVubmVyLnB1c2hQYWlyKHBhaXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGIgPSBhKG5ldyBUVF9Gcm9tKGVsZW1lbnRfZnJvbSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gYjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcGFpciA9IG5ldyBUVFBhaXIoZWxlbWVudF90bywgZWxlbWVudF9mcm9tKTtcclxuXHJcbiAgICBUcmFuc2Zvcm1SdW5uZXIucHVzaFBhaXIocGFpcik7XHJcblxyXG4gICAgcGFpci5zdGFydCgpO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBUcmFuc2Zvcm1Ub1xyXG59IiwiaW1wb3J0IHtcclxuXHRTdHlsZU1hcHBpbmdzXHJcbn0gZnJvbSBcIi4vc3R5bGVfbWFwcGluZ3NcIlxyXG5pbXBvcnQge0NvbG9yfSBmcm9tIFwiLi9jb2xvclwiIFxyXG5pbXBvcnQge1RyYW5zZm9ybVRvfSBmcm9tIFwiLi90cmFuc2Zvcm10b1wiXHJcblxyXG5jbGFzcyBTdHlsZUFuaW1CbG9jIHtcclxuXHRjb25zdHJ1Y3RvcihzdHlsZSwgdG9fdmFsLCBkdXJhdGlvbiwgZGVsYXkpIHtcclxuXHRcdHRoaXMuc3R5bGUgPSBzdHlsZTtcclxuXHRcdHRoaXMuZGVsYXkgPSBkZWxheTtcclxuXHRcdHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHRoaXMudG9fdmFsID0gdG9fdmFsO1xyXG5cdFx0dGhpcy5zdGVwID0gMDtcclxuXHRcdHRoaXMubmV4dCA9IG51bGw7XHJcblx0XHR0aGlzLnByZXYgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0ZGVzdHJ1Y3RvcigpIHtcclxuXHJcblx0fVxyXG5cclxuXHRzdGVwKHN0ZXBfbXVsdGlwbGllcikge1xyXG5cclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIFN0eWxlQW5pbUJsb2NQZXJjZW50YWdlIGV4dGVuZHMgU3R5bGVBbmltQmxvYyB7fVxyXG5jbGFzcyBTdHlsZUFuaW1CbG9jUGl4ZWwgZXh0ZW5kcyBTdHlsZUFuaW1CbG9jIHt9XHJcbmNsYXNzIFN0eWxlQW5pbUJsb2NFTSBleHRlbmRzIFN0eWxlQW5pbUJsb2Mge31cclxuY2xhc3MgU3R5bGVBbmltQmxvY0NvbG9yIGV4dGVuZHMgU3R5bGVBbmltQmxvYyB7fVxyXG5cclxuY2xhc3MgU3R5bGVLZXlGcmFtZWRBbmltQmxvYyBleHRlbmRzIFN0eWxlQW5pbUJsb2Mge1xyXG5cdGNvbnN0cnVjdG9yKHN0eWxlLCBrZXlfZnJhbWVzLCBkZWxheSkge1xyXG5cdFx0c3VwZXIoKVxyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgQW5pbUJ1ZGR5IHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50KSB7XHJcblx0XHR0aGlzLnN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCk7XHJcblx0XHR0aGlzLmZpcnN0X2FuaW1hdGlvbiA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRzZXRBbmltYXRpb24odmFscykge1xyXG5cdFx0bGV0IGFuaW1fYmxvYyA9IG51bGw7XHJcblx0XHRpZiAodmFscyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHR9XHJcblx0XHRpZihhbmltX2Jsb2Mpe1xyXG5cdFx0XHR0aGlzLl9faW5zZXJ0X18oYWIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X19pbnNlcnRfXyhhYikge1xyXG5cdFx0bGV0IGJsb2MgPSB0aGlzLmZpcnN0X2FuaW1hdGlvbjtcclxuXHJcblx0XHR3aGlsZSAoYmxvYykge1xyXG5cdFx0XHRpZiAoYmxvYy5zdHlsZSA9IGFiLnN0eWxlKSB7XHJcblx0XHRcdFx0YWIuZGVzdHJ1Y3RvcigpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGFiLm5leHQgPSB0aGlzLmZpcnN0X2FuaW1hdGlvbjtcclxuXHRcdGlmICh0aGlzLmZpcnN0X2FuaW1hdGlvbilcclxuXHRcdFx0dGhpcy5maXJzdF9hbmltYXRpb24ucHJldiA9IGFiO1xyXG5cdFx0dGhpcy5maXJzdF9hbmltYXRpb24gPSBhYjtcclxuXHR9XHJcblxyXG5cdHN0ZXAoc3RlcF9tdWx0aXBsaWVyKSB7XHJcblx0XHR2YXIgYW5pbV9ibG9jID0gdGhpcy5maXJzdF9hbmltYXRpb247XHJcblx0XHRpZiAoYW5pbV9ibG9jKVxyXG5cdFx0XHR3aGlsZSAoYW5pbV9ibG9jKVxyXG5cdFx0XHRcdGlmICghYW5pbV9ibG9jLnN0ZXAoc3RlcF9tdWx0aXBsaWVyKSkge1xyXG5cdFx0XHRcdFx0aWYgKCFhbmltX2Jsb2MucHJldilcclxuXHRcdFx0XHRcdFx0dGhpcy5maXJzdF9hbmltYXRpb24gPSBhbmltX2Jsb2MubmV4dDtcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0YW5pbV9ibG9jLnByZXYubmV4dCA9IGFuaW1fYmxvYy5uZXh0O1xyXG5cdFx0XHRcdFx0aWYgKGFuaW1fYmxvYy5uZXh0KVxyXG5cdFx0XHRcdFx0XHRhbmltX2Jsb2MubmV4dC5wcmV2ID0gYW5pbV9ibG9jLnByZXY7XHJcblxyXG5cdFx0XHRcdFx0bGV0IG5leHQgPSBhbmltX2Jsb2MubmV4dDtcclxuXHJcblx0XHRcdFx0XHRhbmltX2Jsb2MuZGVzdHJ1Y3RvcigpO1xyXG5cclxuXHRcdFx0XHRcdGFuaW1fYmxvYyA9IG5leHQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRhbmltX2Jsb2MgPSBhbmltX2Jsb2MubmV4dDtcclxuXHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0ZGVzdHJ1Y3RvcigpIHtcclxuXHJcblx0fVxyXG5cclxuXHRnZXRTdHlsZSgpIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0c2V0U3R5bGUodmFsdWUpIHtcclxuXHJcblx0fVxyXG5cclxuXHRvblJlc2l6ZSgpIHtcclxuXHRcdHRoaXMuZ2V0U3R5bGUoKVxyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgQW5pbUNvcmV7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmFuaW1fZ3JvdXAgPSB7fTtcclxuXHRcdHRoaXMucnVubmluZ19hbmltYXRpb25zID0gW107XHJcblx0fVxyXG5cclxuXHRzdGVwKHN0ZXBfbXVsdGlwbGllcikge1xyXG5cdFx0dmFyIGwgPSB0aGlzLnJ1bm5pbmdfYW5pbWF0aW9ucy5sZW5naHQ7XHJcblx0XHRpZiAobCA+IDApIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuXHJcblx0XHRcdFx0dmFyIGFiID0gdGhpcy5ydW5uaW5nX2FuaW1hdGlvbnNbaV07XHJcblxyXG5cdFx0XHRcdGlmIChhYiAmJiAhYWIuc3RlcChzdGVwX211bHRpcGxpZXIpKSB7XHJcblx0XHRcdFx0XHRhYi5kZXN0cnVjdG9yKCk7XHJcblx0XHRcdFx0XHR0aGlzLnJ1bm5pbmdfYW5pbWF0aW9uc1tpXSA9IG51bGw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhZGRCbG9jKGFuaW1fYmxvYykge1xyXG5cdFx0aWYgKGFuaW1fYmxvYyBpbnN0YW5jZW9mIEFuaW1CbG9jKSB7XHJcblx0XHRcdC8vYWRkIHRvIGdyb3VwIG9mIG9iamVjdFxyXG5cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCB7QW5pbUNvcmUsIFRyYW5zZm9ybVRvLCBDb2xvcn0iLCJjbGFzcyBUcmFuc2l0aW9uZWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZXQoZWxlbWVudCwgZGF0YSkge1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9IFwib3BhY2l0eSAwLjVzXCI7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRfaW4oZWxlbWVudCwgZGF0YSwgaW5kZXggPSAwKSB7XHJcbiAgICBcdGVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9IGBvcGFjaXR5ICR7MC44KmluZGV4KzAuNX1zYDtcclxuICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAxO1xyXG4gICAgICAgIHJldHVybiAwLjg7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0X291dChlbGVtZW50LCBkYXRhLCBpbmRleCA9IDApIHtcclxuICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgIHJldHVybiAwLjg7XHJcbiAgICB9XHJcblxyXG4gICAgZmluYWxpemVfb3V0KGVsZW1lbnQpIHtcclxuICAgIFx0ZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcclxuICAgIH1cclxufVxyXG5leHBvcnQge1xyXG4gICAgVHJhbnNpdGlvbmVlclxyXG59IiwiaW1wb3J0IHtcclxuICAgIFZpZXdcclxufSBmcm9tIFwiLi4vdmlld1wiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQW55TW9kZWxcclxufSBmcm9tIFwiLi4vbW9kZWwvbW9kZWxcIlxyXG5cclxuLypcclxuICAgIFRyYW5zaXRpb25lZXJzXHJcbiovXHJcblxyXG5pbXBvcnQge1xyXG4gICAgVHJhbnNpdGlvbmVlclxyXG59IGZyb20gXCIuLi9hbmltYXRpb24vdHJhbnNpdGlvbi90cmFuc2l0aW9uZWVyXCJcclxuXHJcbmxldCBQcmVzZXRUcmFuc2l0aW9uZWVycyA9IHtcclxuICAgIGJhc2U6IFRyYW5zaXRpb25lZXJcclxufVxyXG5cclxuY2xhc3MgUml2ZXQgZXh0ZW5kcyBWaWV3IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQgPSBudWxsLCBkYXRhID0ge30sIHByZXNldHMgPSB7fSkge1xyXG5cclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMubmFtZWRfZWxlbWVudHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5leHBvcnRfdmFsID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5ERVNUUk9ZRUQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy9TZXR0aW5nIHRoZSB0cmFuc2l0aW9uZXJcclxuICAgICAgICB0aGlzLnRyYW5zaXRpb25lZXIgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS50cnMpIHtcclxuICAgICAgICAgICAgaWYgKHByZXNldHMudHJhbnNpdGlvbnMgJiYgcHJlc2V0cy50cmFuc2l0aW9uc1tkYXRhLnRyc10pXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25lZXIgPSBuZXcgcHJlc2V0cy50cmFuc2l0aW9uc1tkYXRhLnRyc10oKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoUHJlc2V0VHJhbnNpdGlvbmVlcnNbZGF0YS50cnNdKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyID0gbmV3IFByZXNldFRyYW5zaXRpb25lZXJzW2RhdGEudHJzXSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyLnNldCh0aGlzLmVsZW1lbnQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFkZFRvUGFyZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkVG9QYXJlbnQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB0aGlzLnBhcmVudC5jaGlsZHJlbi5wdXNoKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuREVTVFJPWUVEID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuTE9BREVEKSB7XHJcblxyXG5cclxuICAgICAgICAgICAgbGV0IHQgPSB0aGlzLnRyYW5zaXRpb25PdXQoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baV07XHJcblxyXG4gICAgICAgICAgICAgICAgdCA9IE1hdGgubWF4KHQsIGNoaWxkLnRyYW5zaXRpb25PdXQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc3RydWN0b3IoKTtcclxuICAgICAgICAgICAgICAgIH0sIHQgKiAxMDAwICsgNSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmluYWxpemVUcmFuc2l0aW9uT3V0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoYykgPT4gYy5kZXN0cnVjdG9yKCkpO1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50ICYmIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBzdXBlci5kZXN0cnVjdG9yKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYnViYmxlTGluayhsaW5rX3VybCwgY2hpbGQsIHRyc19lbGUgPSB7fSkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS50cmFuc2l0aW9uKVxyXG4gICAgICAgICAgICAgICAgdHJzX2VsZVt0aGlzLmRhdGEudHJhbnNpdGlvbl0gPSB0aGlzLmVsZW1lbnQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2ggPSB0aGlzLmNoaWxkcmVuW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjaCAhPT0gY2hpbGQpXHJcbiAgICAgICAgICAgICAgICAgICAgY2guZ2F0aGVyVHJhbnNpdGlvbkVsZW1lbnRzKHRyc19lbGUpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuYnViYmxlTGluayhsaW5rX3VybCwgdGhpcywgdHJzX2VsZSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJpZ25vcmVkIHRpdGxlXCIsIGxpbmtfdXJsKTtcclxuICAgICAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZWRFbGVtZW50cyhuYW1lZF9lbGVtZW50cykge31cclxuXHJcbiAgICBnYXRoZXJUcmFuc2l0aW9uRWxlbWVudHModHJzX2VsZSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnRyYW5zaXRpb24gJiYgIXRyc19lbGVbdGhpcy5kYXRhLnRyYW5zaXRpb25dKVxyXG4gICAgICAgICAgICB0cnNfZWxlW3RoaXMuZGF0YS50cmFuc2l0aW9uXSA9IHRoaXMuZWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLmlzID09IDEpXHJcbiAgICAgICAgICAgICAgICBlLmdhdGhlclRyYW5zaXRpb25FbGVtZW50cyh0cnNfZWxlKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNvcHkoZWxlbWVudCwgaW5kZXgpIHtcclxuICAgICAgICBsZXQgb3V0X29iamVjdCA9IHt9O1xyXG5cclxuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMuZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBvdXRfb2JqZWN0LmVsZW1lbnQgPSBlbGVtZW50LmNoaWxkcmVuW3RoaXMuZWxlbWVudF07XHJcbiAgICAgICAgICAgIG91dF9vYmplY3QuY2hpbGRyZW4gPSBuZXcgQXJyYXkodGhpcy5jaGlsZHJlbi5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgIG91dF9vYmplY3QuY2hpbGRyZW5baV0gPSBjaGlsZC5jb3B5KG91dF9vYmplY3QuZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfb2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVVybFVwZGF0ZSh3dXJsKSB7fVxyXG5cclxuICAgIGZpbmFsaXplVHJhbnNpdGlvbk91dCgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uZWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbmVlci5maW5hbGl6ZV9vdXQodGhpcy5lbGVtZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAgQHJldHVybnMge251bWJlcn0gVGltZSBpbiBtaWxsaXNlY29uZHMgdGhhdCB0aGUgdHJhbnNpdGlvbiB3aWxsIHRha2UgdG8gY29tcGxldGUuXHJcbiAgICAqL1xyXG4gICAgdHJhbnNpdGlvbkluKGluZGV4ID0gMCkge1xyXG5cclxuICAgICAgICB0aGlzLnNob3coKTtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fdGltZSA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuTE9BREVEID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCB0aGlzLmNoaWxkcmVuW2ldLnRyYW5zaXRpb25JbihpbmRleCkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uZWVyKSB7XHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgdGhpcy50cmFuc2l0aW9uZWVyLnNldF9pbih0aGlzLmVsZW1lbnQsIHRoaXMuZGF0YSwgaW5kZXgpKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uX3RpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgVGFrZXMgYXMgYW4gaW5wdXQgYSBsaXN0IG9mIHRyYW5zaXRpb24gb2JqZWN0cyB0aGF0IGNhbiBiZSB1c2VkXHJcbiAgICAqL1xyXG4gICAgdHJhbnNpdGlvbk91dChpbmRleCA9IDAsIERFU1RST1kgPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBsZXQgdHJhbnNpdGlvbl90aW1lID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbmVlcikge1xyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMudHJhbnNpdGlvbmVlci5zZXRfb3V0KHRoaXMuZWxlbWVudCwgdGhpcy5kYXRhLCBpbmRleCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCB0aGlzLmNoaWxkcmVuW2ldLnRyYW5zaXRpb25PdXQoaW5kZXgpKTtcclxuXHJcbiAgICAgICAgaWYgKERFU1RST1kpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgIH0sIHRyYW5zaXRpb25fdGltZSAqIDEwMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25fdGltZTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEaW1lbnNpb25zKCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS51cGRhdGVEaW1lbnNpb25zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQ2FsbGVkIGJ5ICBwYXJlbnQgd2hlbiBkYXRhIGlzIHVwZGF0ZSBhbmQgcGFzc2VkIGRvd24gZnJvbSBmdXJ0aGVyIHVwIHRoZSBncmFwaC4gXHJcbiAgICAgICAgQHBhcmFtIHsoT2JqZWN0IHwgTW9kZWwpfSBkYXRhIC0gRGF0YSB0aGF0IGhhcyBiZWVuIHVwZGF0ZWQgYW5kIGlzIHRvIGJlIHJlYWQuIFxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IGNoYW5nZWRfcHJvcGVydGllcyAtIEFuIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIHRoYXQgaGF2ZSBiZWVuIHVwZGF0ZWQuIFxyXG4gICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gSU1QT1JURUQgLSBUcnVlIGlmIHRoZSBkYXRhIGRpZCBub3Qgb3JpZ2luYXRlIGZyb20gdGhlIG1vZGVsIHdhdGNoZWQgYnkgdGhlIHBhcmVudCBDYXNlLiBGYWxzZSBvdGhlcndpc2UuXHJcbiAgICAqL1xyXG4gICAgX19kb3duX18oZGF0YSwgY2hhbmdlZF9wcm9wZXJ0aWVzID0gbnVsbCwgSU1QT1JURUQgPSBmYWxzZSkge1xyXG4gICAgICAgIGxldCByX3ZhbCA9IHRoaXMuZG93bihkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMsIElNUE9SVEVEKTtcclxuICAgICAgICBpZiAocl92YWwpKGRhdGEgPSByX3ZhbCwgSU1QT1JURUQgPSB0cnVlKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uX19kb3duX18oZGF0YSwgY2hhbmdlZF9wcm9wZXJ0aWVzLCBJTVBPUlRFRCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZG93bihkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMgPSBudWxsLCBJTVBPUlRFRCkge31cclxuXHJcbiAgICAvKipcclxuICAgICAgICBDYWxsZWQgYnkgIHBhcmVudCB3aGVuIGRhdGEgaXMgdXBkYXRlIGFuZCBwYXNzZWQgdXAgZnJvbSBhIGxlYWYuIFxyXG4gICAgICAgIEBwYXJhbSB7KE9iamVjdCB8IE1vZGVsKX0gZGF0YSAtIERhdGEgdGhhdCBoYXMgYmVlbiB1cGRhdGVkIGFuZCBpcyB0byBiZSByZWFkLiBcclxuICAgICAgICBAcGFyYW0ge0FycmF5fSBjaGFuZ2VkX3Byb3BlcnRpZXMgLSBBbiBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyB0aGF0IGhhdmUgYmVlbiB1cGRhdGVkLiBcclxuICAgICAgICBAcGFyYW0ge0Jvb2xlYW59IElNUE9SVEVEIC0gVHJ1ZSBpZiB0aGUgZGF0YSBkaWQgbm90IG9yaWdpbmF0ZSBmcm9tIHRoZSBtb2RlbCB3YXRjaGVkIGJ5IHRoZSBwYXJlbnQgQ2FzZS4gRmFsc2Ugb3RoZXJ3aXNlLlxyXG4gICAgKi9cclxuICAgIF9fdXBfXyhkYXRhKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KVxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudCh1cCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHVwKGRhdGEpIHtcclxuICAgICAgICBpZihkYXRhKVxyXG4gICAgICAgICAgICB0aGlzLl9fdXBfXyhkYXRhKVxyXG4gICAgfVxyXG5cclxuICAgIF9fdXBkYXRlX18oZGF0YSwgRlJPTV9QQVJFTlQgPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBsZXQgcl9kYXRhID0gdGhpcy51cGRhdGUoZGF0YSwgRlJPTV9QQVJFTlQpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uX191cGRhdGVfXyhyX2RhdGEgfHwgZGF0YSwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvYWQobW9kZWwpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5sb2FkKG1vZGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSA9IHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5O1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzaG93KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09IFwibm9uZVwiKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSB0aGlzLmRpc3BsYXk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9fdXBkYXRlRXhwb3J0c19fKGRhdGEpIHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLmV4cG9ydCAmJiBkYXRhW3RoaXMuZGF0YS5leHBvcnRdKVxyXG4gICAgICAgICAgICB0aGlzLmV4cG9ydF92YWwgPSBkYXRhW3RoaXMuZGF0YS5leHBvcnRdO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0RXhwb3J0c19fKGV4cG9ydHMpIHtcclxuICAgICAgICBpZiAodGhpcy5leHBvcnRfdmFsKVxyXG4gICAgICAgICAgICBleHBvcnRzW3RoaXMuZGF0YS5leHBvcnRdID0gdGhpcy5leHBvcnRfdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEV4cG9ydHMgZGF0YSBzdG9yZWQgZnJvbSB1cGRhdGVFeHBvcnRzKCkgaW50byBhIGFuIE9iamVjdCBleHBvcnRzIGFuZCBjYWxscyBpdCdzIHBhcmVudCdzIGV4cG9ydCBmdW5jdGlvbiwgcGFzc2luZyBleHBvcnRzXHJcbiAgICAqL1xyXG4gICAgZXhwb3J0IChleHBvcnRzID0gbmV3IEFueU1vZGVsKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC5leHBvcnQpIHtcclxuXHJcblxyXG4gICAgICAgICAgICB0aGlzLl9fZ2V0RXhwb3J0c19fKGV4cG9ydHMpXHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5fX2dldEV4cG9ydHNfXyhleHBvcnRzKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LmV4cG9ydChleHBvcnRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW1wb3J0IChkYXRhKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1vZGVsKVxyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmFkZChkYXRhKTtcclxuXHJcbiAgICAgICAgdGhpcy5leHBvcnQoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRXhwb3J0cyhkYXRhKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5leHBvcnQgJiYgZGF0YVt0aGlzLmRhdGEuZXhwb3J0XSlcclxuICAgICAgICAgICAgdGhpcy5leHBvcnQgPSBkYXRhW3RoaXMuZGF0YS5leHBvcnRdO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZCh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLm1vZGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwuYWRkKHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5leHBvcnQodGhpcy5tb2RlbCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC5hZGQpXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LmFkZCh2YWx1ZSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFJpdmV0XHJcbn0iLCJpbXBvcnQge1xyXG4gICAgVmlld1xyXG59IGZyb20gXCIuLi92aWV3XCJcclxuaW1wb3J0IHtcclxuICAgIEdldHRlclxyXG59IGZyb20gXCIuLi9nZXR0ZXJcIlxyXG5pbXBvcnQge1xyXG4gICAgUml2ZXRcclxufSBmcm9tIFwiLi4vY2FzZS9yaXZldFwiXHJcbmltcG9ydCB7XHJcbiAgICBUdXJuRGF0YUludG9RdWVyeVxyXG59IGZyb20gXCIuLi9jb21tb25cIlxyXG5pbXBvcnQge1xyXG4gICAgRGF0YVRlbXBsYXRlXHJcbn0gZnJvbSBcIi4vZGF0YV90ZW1wbGF0ZVwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgVHJhbnNpdGlvbmVlclxyXG59IGZyb20gXCIuLi9hbmltYXRpb24vdHJhbnNpdGlvbi90cmFuc2l0aW9uZWVyXCJcclxuXHJcblxyXG4vKipcclxuICAgIEhhbmRsZXMgdGhlIHRyYW5zaXRpb24gb2Ygc2VwYXJhdGUgZWxlbWVudHMuXHJcbiovXHJcbmNsYXNzIEJhc2ljQ2FzZSBleHRlbmRzIFJpdmV0IHtcclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcclxuICAgICAgICBzdXBlcihudWxsLCBlbGVtZW50LCB7fSwge30pO1xyXG4gICAgICAgIHRoaXMuYW5jaG9yID0gbnVsbDtcclxuICAgICAgICB0aGlzLkxPQURFRCA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLnRyYW5zaXRpb25lZXIgPSBuZXcgVHJhbnNpdGlvbmVlcigpO1xyXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbmVlci5zZXQodGhpcy5lbGVtZW50KVxyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWVkRWxlbWVudHMobmFtZWRfZWxlbWVudHMpIHtcclxuICAgICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmVsZW1lbnQuY2hpbGRyZW47XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkID0gY2hpbGRyZW5baV07XHJcblxyXG4gICAgICAgICAgICBpZiAoY2hpbGQuZGF0YXNldC50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lZF9lbGVtZW50c1tjaGlsZC5kYXRhc2V0LnRyYW5zaXRpb25dID0gY2hpbGQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gICAgVGhpcyBpcyBhIGZhbGxiYWNrIGNvbXBvbmVudCBpZiBjb25zdHJ1Y3RpbmcgYSBDYXNlQ29tcG9uZW50IG9yIG5vcm1hbCBDb21wb25lbnQgdGhyb3dzIGFuIGVycm9yLlxyXG4qL1xyXG5cclxuY2xhc3MgRmFpbGVkQ2FzZSBleHRlbmRzIFJpdmV0IHtcclxuICAgIGNvbnN0cnVjdG9yKGVycm9yX21lc3NhZ2UsIHByZXNldHMpIHtcclxuICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXYuaW5uZXJIVE1MID0gYDxoMz4gVGhpcyBXaWNrIGNvbXBvbmVudCBoYXMgZmFpbGVkITwvaDM+IDxoND5FcnJvciBNZXNzYWdlOjwvaDQ+PHA+JHtlcnJvcl9tZXNzYWdlLnN0YWNrfTwvcD48cD5QbGVhc2UgY29udGFjdCB0aGUgd2Vic2l0ZSBtYWludGFpbmVycyB0byBhZGRyZXNzIHRoZSBwcm9ibGVtLjwvcD4gPHA+JHtwcmVzZXRzLmVycm9yX2NvbnRhY3R9PC9wPmA7XHJcbiAgICAgICAgc3VwZXIobnVsbCwgZGl2LCB7fSwge30pO1xyXG5cclxuICAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyID0gbmV3IFRyYW5zaXRpb25lZXIoKTtcclxuICAgICAgICB0aGlzLnRyYW5zaXRpb25lZXIuc2V0KHRoaXMuZWxlbWVudClcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIEJhc2ljQ2FzZSxcclxuICAgIEZhaWxlZENhc2VcclxufSIsImltcG9ydCB7XHJcbiAgICBzZXRMaW5rc1xyXG59IGZyb20gXCIuLi8uLi9saW5rZXIvc2V0bGlua3NcIlxyXG5pbXBvcnQge1xyXG4gICAgTGV4XHJcbn0gZnJvbSBcIi4uLy4uL2NvbW1vblwiXHJcbmltcG9ydCB7XHJcbiAgICBSaXZldFxyXG59IGZyb20gXCIuLi9yaXZldFwiXHJcblxyXG4vKipcclxuICAgIERlYWxzIHdpdGggc3BlY2lmaWMgcHJvcGVydGllcyBvbiBhIG1vZGVsLiBcclxuKi9cclxuXHJcbmNsYXNzIENhc3NldHRlIGV4dGVuZHMgUml2ZXQge1xyXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBlbGVtZW50LCBwcmVzZXRzLCBkYXRhKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKHBhcmVudCwgZWxlbWVudCwgcHJlc2V0cywgZGF0YSk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcCA9IHRoaXMuZGF0YS5wcm9wO1xyXG5cclxuICAgICAgICB0aGlzLndpZHRoID0gMDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDA7XHJcbiAgICAgICAgdGhpcy50b3AgPSAwO1xyXG4gICAgICAgIHRoaXMubGVmdCA9IDA7XHJcbiAgICAgICAgdGhpcy5sdmwgPSAwO1xyXG4gICAgICAgIHRoaXMuaXMgPSAxO1xyXG4gICAgICAgIHRoaXMuZGF0YV9jYWNoZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50LnRhZ05hbWUgPT0gXCJBXCIpXHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpbmsodGhpcy5lbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50LnRhZ05hbWUgPT0gXCJBXCIpXHJcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveUxpbmsodGhpcy5lbGVtZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhX2NhY2hlID0gbnVsbDtcclxuXHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFRoaXMgd2lsbCBhdHRhY2ggYSBmdW5jdGlvbiB0byB0aGUgbGluayBlbGVtZW50IHRvIGludGVyY2VwdCBhbmQgcHJvY2VzcyBkYXRhIGZyb20gdGhlIGNhc3NldHRlLlxyXG4gICAgKi9cclxuICAgIHByb2Nlc3NMaW5rKGVsZW1lbnQsIGxpbmspIHtcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnQub3JpZ2luICE9PSBsb2NhdGlvbi5vcmlnaW4pIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKCFlbGVtZW50Lm9uY2xpY2spIGVsZW1lbnQub25jbGljayA9ICgoaHJlZiwgYSwgX19mdW5jdGlvbl9fKSA9PiAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGlmIChfX2Z1bmN0aW9uX18oaHJlZiwgYSkpIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9KShlbGVtZW50LmhyZWYsIGVsZW1lbnQsIChocmVmLCBhKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgU0FNRV9MT0NBTEUgPSAobG9jYXRpb24ucGF0aG5hbWUgPT0gYS5wYXRobmFtZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaGFzaHRhZyA9IGhyZWYuaW5jbHVkZXMoXCIjXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJlYWxfaHJlZiA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGV4ID0gTGV4KGhyZWYpO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKGxleC50b2tlbikge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsZXgudG9rZW4udGV4dCA9PSBcIntcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3AgPSBsZXgudG9rZW4udGV4dDtcclxuICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWxfaHJlZiArPSB0aGlzW3Byb3BdIHx8IHRoaXMuZGF0YV9jYWNoZVtwcm9wXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxleC50b2tlbi50ZXh0ICE9IFwifVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYGluY29ycmVjdCB2YWx1ZSBmb3VuZCBpbiB1cmwgJHtocmVmfWApXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWxfaHJlZiArPSBsZXgudG9rZW4udGV4dDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaGFzaHRhZylcclxuICAgICAgICAgICAgICAgIHRoaXMuZXhwb3J0KCk7XHJcblxyXG4gICAgICAgICAgICBpZighU0FNRV9MT0NBTEUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ1YmJsZUxpbmsocmVhbF9ocmVmKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBlbGVtZW50Lm9ubW91c2VvdmVyID0gKCgpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCBocmVmID0gZWxlbWVudC5ocmVmO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJlYWxfaHJlZiA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGV4ID0gTGV4KGhyZWYpO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKGxleC50b2tlbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxleC50b2tlbi50ZXh0ID09IFwie1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcCA9IGxleC50b2tlbi50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlYWxfaHJlZiArPSB0aGlzW3Byb3BdIHx8IHRoaXMuZGF0YV9jYWNoZVtwcm9wXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxleC50b2tlbi50ZXh0ICE9IFwifVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYGluY29ycmVjdCB2YWx1ZSBmb3VuZCBpbiB1cmwgJHtocmVmfWApXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWxfaHJlZiArPSBsZXgudG9rZW4udGV4dDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95TGluayhlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIGVsZW1lbnQub25jbGljayA9IG51bGxcclxuICAgICAgICBlbGVtZW50Lm9ubW91c2VvdmVyID0gbnVsbDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdXBkYXRlKGRhdGEsIF9fRlJPTV9QQVJFTlRfXyA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIHN1cGVyLl9fdXBkYXRlRXhwb3J0c19fKGRhdGEpO1xyXG5cclxuICAgICAgICBpZiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IGRhdGFbdGhpcy5wcm9wXTtcclxuICAgICAgICAgICAgICAgIHRoaXNbdGhpcy5wcm9wXSA9IGRhdGFbdGhpcy5wcm9wXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YV9jYWNoZSA9IGRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW1wb3J0IChkYXRhKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGxvYWQobW9kZWwpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUubG9hZChtb2RlbCk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5tb2RlbClcclxuICAgICAgICAgICAgbW9kZWwuYWRkVmlldyh0aGlzKVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZURpbWVuc2lvbnMoKSB7XHJcblxyXG4gICAgICAgIHZhciBkID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgICAgICB0aGlzLndpZHRoID0gZC53aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGQuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMudG9wID0gZC50b3A7XHJcbiAgICAgICAgdGhpcy5sZWZ0ID0gZC5sZWZ0O1xyXG5cclxuICAgICAgICBzdXBlci51cGRhdGVEaW1lbnNpb25zKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIENsb3NlQ2Fzc2V0dGUgZXh0ZW5kcyBDYXNzZXR0ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApIHtcclxuICAgICAgICBzdXBlcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICAgICAgcGFyZW50LmhpZGUoKTsgLy9PciBVUkwgYmFjaztcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgQ2Fzc2V0dGUsXHJcbiAgICBDbG9zZUNhc3NldHRlLFxyXG4gICAgSW1wb3J0RGF0YUZyb21EYXRhU2V0XHJcbn0iLCJpbXBvcnQge1xyXG4gICAgUml2ZXRcclxufSBmcm9tIFwiLi9yaXZldFwiXHJcbmltcG9ydCB7XHJcbiAgICBNb2RlbFxyXG59IGZyb20gXCIuLi9tb2RlbC9tb2RlbFwiXHJcbmltcG9ydCB7XHJcbiAgICBDb250cm9sbGVyXHJcbn0gZnJvbSBcIi4uL2NvbnRyb2xsZXJcIlxyXG5pbXBvcnQge1xyXG4gICAgR2V0dGVyXHJcbn0gZnJvbSBcIi4uL2dldHRlclwiXHJcbmltcG9ydCB7XHJcbiAgICBDYXNzZXR0ZVxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2Nhc3NldHRlXCJcclxuXHJcbmNsYXNzIENhc2UgZXh0ZW5kcyBSaXZldCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQ2FzZSBjb25zdHJ1Y3Rvci4gQnVpbGRzIGEgQ2FzZSBvYmplY3QuXHJcbiAgICAgICAgQHBhcmFtcyBbRE9NRWxlbWVudF0gZWxlbWVudCAtIEEgRE9NIDx0ZW1wbGF0ZT4gZWxlbWVudCB0aGF0IGNvbnRhaW5zIGEgPGNhc2U+IGVsZW1lbnQuXHJcbiAgICAgICAgQHBhcmFtcyBbTGlua2VyUHJlc2V0c10gcHJlc2V0c1xyXG4gICAgICAgIEBwYXJhbXMgW0Nhc2VdIHBhcmVudCAtIFRoZSBwYXJlbnQgQ2FzZSBvYmplY3QsIHVzZWQgaW50ZXJuYWxseSB0byBidWlsZCBDYXNlJ3MgaW4gYSBoaWVyYXJjaHlcclxuICAgICAgICBAcGFyYW1zIFtNb2RlbF0gbW9kZWwgLSBBIG1vZGVsIHRoYXQgY2FuIGJlIHBhc3NlZCB0byB0aGUgY2FzZSBpbnN0ZWFkIG9mIGhhdmluZyBvbmUgY3JlYXRlZCBvciBwdWxsZWQgZnJvbSBwcmVzZXRzLiBcclxuICAgICAgICBAcGFyYW1zIFtET01dICBXT1JLSU5HX0RPTSAtIFRoZSBET00gb2JqZWN0IHRoYXQgY29udGFpbnMgdGVtcGxhdGVzIHRvIGJlIHVzZWQgdG8gYnVpbGQgdGhlIGNhc2Ugb2JqZWN0cy4gXHJcbiAgICAqL1xyXG4gICAgY29uc3RydWN0b3IocGFyZW50ID0gbnVsbCwgZGF0YSwgcHJlc2V0cykge1xyXG5cclxuICAgICAgICBzdXBlcihwYXJlbnQsIGRhdGEsIHByZXNldHMpXHJcblxyXG4gICAgICAgIHRoaXMuVVNFX1NFQ1VSRSA9IHByZXNldHMuVVNFX0hUVFBTO1xyXG4gICAgICAgIHRoaXMubmFtZWRfZWxlbWVudHMgPSB7fTtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlID0gbnVsbDtcclxuICAgICAgICB0aGlzLnByb3AgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudXJsID0gbnVsbDtcclxuICAgICAgICB0aGlzLnByZXNldHMgPSBwcmVzZXRzO1xyXG4gICAgICAgIHRoaXMucmVjZWl2ZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucXVlcnkgPSB7fTtcclxuICAgICAgICB0aGlzLlJFUVVFU1RJTkcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmV4cG9ydHMgPSBudWxsO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5maWx0ZXJfbGlzdCA9IFtdO1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0gW107XHJcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5pcyA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yZWNlaXZlcilcclxuICAgICAgICAgICAgdGhpcy5yZWNlaXZlci5kZXN0cnVjdG9yKCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlc1tpXS5kZXN0cnVjdG9yKCk7XHJcblxyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBTZXRzIHVwIE1vZGVsIGNvbm5lY3Rpb24gb3IgY3JlYXRlcyBhIG5ldyBNb2RlbCBmcm9tIGEgc2NoZW1hLlxyXG4gICAgKi9cclxuICAgIGxvYWQobW9kZWwpIHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLnVybCkge1xyXG4gICAgICAgICAgICAvL2ltcG9ydCBxdWVyeSBpbmZvIGZyb20gdGhlIHd1cmxcclxuICAgICAgICAgICAgbGV0IHN0ciA9IHRoaXMuZGF0YS51cmw7XHJcbiAgICAgICAgICAgIGxldCBjYXNzZXR0ZXMgPSBzdHIuc3BsaXQoXCI7XCIpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEudXJsID0gY2Fzc2V0dGVzWzBdO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBjYXNzZXR0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXNzZXR0ZSA9IGNhc3NldHRlc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGNhc3NldHRlWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInBcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9UT0RPXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXJsX3BhcmVudF9pbXBvcnQgPSBjYXNzZXR0ZS5zbGljZSgxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVybF9xdWVyeSA9IGNhc3NldHRlLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiPFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVybF9yZXR1cm4gPSBjYXNzZXR0ZS5zbGljZSgxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wcm9wID0gdGhpcy5kYXRhLnByb3A7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEuZXhwb3J0KSB0aGlzLmV4cG9ydHMgPSB0aGlzLmRhdGEuZXhwb3J0O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5tb2RlbCkge1xyXG4gICAgICAgICAgICBtb2RlbCA9IHRoaXMubW9kZWw7XHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1vZGVsICYmIG1vZGVsIGluc3RhbmNlb2YgTW9kZWwpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNjaGVtYSkge1xyXG4gICAgICAgICAgICAgICAgLyogT3BpbmlvbmF0ZWQgQ2FzZSAtIE9ubHkgYWNjZXB0cyBNb2RlbHMgdGhhdCBhcmUgb2YgdGhlIHNhbWUgdHlwZSBhcyBpdHMgc2NoZW1hLiovXHJcbiAgICAgICAgICAgICAgICBpZiAobW9kZWwuY29uc3RydWN0b3IgIT0gdGhpcy5zY2hlbWEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3Rocm93IG5ldyBFcnJvcihgTW9kZWwgU2NoZW1hICR7dGhpcy5tb2RlbC5zY2hlbWF9IGRvZXMgbm90IG1hdGNoIENhc2UgU2NoZW1hICR7cHJlc2V0cy5zY2hlbWFzW3RoaXMuZGF0YS5zY2hlbWFdLnNjaGVtYX1gKVxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlbWEgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBudWxsO1xyXG4gICAgICAgIH0gXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNjaGVtYSkgXHJcbiAgICAgICAgICAgIG1vZGVsID0gbmV3IHRoaXMuc2NoZW1hKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbW9kZWwuYWRkVmlldyh0aGlzKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS51cmwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVjZWl2ZXIgPSBuZXcgR2V0dGVyKHRoaXMuZGF0YS51cmwsIHRoaXMudXJsX3JldHVybik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlY2VpdmVyLnNldE1vZGVsKG1vZGVsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX19fX3JlcXVlc3RfX19fKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIE1vZGVsIGNvdWxkIGJlIGZvdW5kIGZvciBDYXNlIGNvbnN0cnVjdG9yISBDYXNlIHNjaGVtYSBcIiR7dGhpcy5kYXRhLnNjaGVtYX1cIiwgXCIke3RoaXMucHJlc2V0cy5zY2hlbWFzW3RoaXMuZGF0YS5zY2hlbWFdfVwiOyBDYXNlIG1vZGVsIFwiJHt0aGlzLmRhdGEubW9kZWx9XCIsIFwiJHt0aGlzLnByZXNldHMubW9kZWxzW3RoaXMuZGF0YS5tb2RlbF19XCI7YCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0ubG9hZCh0aGlzLm1vZGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX19fX3JlcXVlc3RfX19fKHF1ZXJ5KSB7XHJcblxyXG4gICAgICAgIHRoaXMucmVjZWl2ZXIuZ2V0KHF1ZXJ5LCBudWxsLCB0aGlzLlVTRV9TRUNVUkUpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLlJFUVVFU1RJTkcgPSBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLlJFUVVFU1RJTkcgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCAoZXhwb3J0cykge1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVN1YnModGhpcy5jaGlsZHJlbiwgZXhwb3J0cywgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHN1cGVyLmV4cG9ydChleHBvcnRzKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVTdWJzKGNhc3NldHRlcywgZGF0YSwgSU1QT1JUID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYXNzZXR0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBjYXNzZXR0ZSA9IGNhc3NldHRlc1tpXTtcclxuICAgICAgICAgICAgaWYgKGNhc3NldHRlIGluc3RhbmNlb2YgQ2FzZSlcclxuICAgICAgICAgICAgICAgIGNhc3NldHRlLnVwZGF0ZShkYXRhLCB0cnVlKTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcl92YWw7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKElNUE9SVCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2Fzc2V0dGUuZGF0YS5pbXBvcnQgJiYgZGF0YVtjYXNzZXR0ZS5kYXRhLmltcG9ydF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcl92YWwgPSBjYXNzZXR0ZS51cGRhdGUoZGF0YSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocl92YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU3VicyhjYXNzZXR0ZS5jaGlsZHJlbiwgcl92YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qKiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgT3ZlcnJpZGluZyB0aGUgbW9kZWwgZGF0YSBoYXBwZW5zIHdoZW4gYSBjYXNzZXR0ZSByZXR1cm5zIGFuIG9iamVjdCBpbnN0ZWFkIG9mIHVuZGVmaW5lZC4gVGhpcyBpcyBhc3NpZ25lZCB0byB0aGUgXCJyX3ZhbFwiIHZhcmlhYmxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFueSBjaGlsZCBjYXNzZXR0ZSBvZiB0aGUgcmV0dXJuaW5nIGNhc3NldHRlIHdpbGwgYmUgZmVkIFwicl92YWxcIiBpbnN0ZWFkIG9mIFwiZGF0YVwiLlxyXG4gICAgICAgICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJfdmFsID0gY2Fzc2V0dGUudXBkYXRlKGRhdGEsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN1YnMoY2Fzc2V0dGUuY2hpbGRyZW4sIHJfdmFsIHx8IGRhdGEsIElNUE9SVCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXAoZGF0YSl7XHJcbiAgICAgICAgdGhpcy5tb2RlbC5hZGQoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEsIGNoYW5nZWRfdmFsdWVzKSB7XHJcbiAgICAgICAgdGhpcy5fX2Rvd25fXyhkYXRhLCBjaGFuZ2VkX3ZhbHVlcyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBoYW5kbGVVcmxVcGRhdGUod3VybCkge1xyXG4gICAgICAgIGxldCBxdWVyeV9kYXRhID0gbnVsbDtcclxuICAgICAgICAvKiBcclxuICAgICAgICAgICAgVGhpcyBwYXJ0IG9mIHRoZSBmdW5jdGlvbiB3aWxsIGltcG9ydCBkYXRhIGludG8gdGhlIG1vZGVsIHRoYXQgaXMgb2J0YWluZWQgZnJvbSB0aGUgcXVlcnkgc3RyaW5nIFxyXG4gICAgICAgICovXHJcbiAgICAgICAgaWYgKHd1cmwgJiYgdGhpcy5kYXRhLmltcG9ydCkge1xyXG4gICAgICAgICAgICBxdWVyeV9kYXRhID0ge307XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuaW1wb3J0ID09IFwibnVsbFwiKSB7XHJcbiAgICAgICAgICAgICAgICBxdWVyeV9kYXRhID0gd3VybC5nZXRDbGFzcygpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocXVlcnlfZGF0YSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBsID0gdGhpcy5kYXRhLmltcG9ydC5zcGxpdChcIjtcIilcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuID0gbFtpXS5zcGxpdChcIjpcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc19uYW1lID0gblswXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IG5bMV0uc3BsaXQoXCI9PlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5X25hbWUgPSBwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbXBvcnRfbmFtZSA9IHBbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzX25hbWUgPT0gXCJyb290XCIpIGNsYXNzX25hbWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5X2RhdGFbaW1wb3J0X25hbWVdID0gd3VybC5nZXQoY2xhc3NfbmFtZSwga2V5X25hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAod3VybCAmJiB0aGlzLmRhdGEudXJsKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgcXVlcnlfZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy51cmxfcXVlcnkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsID0gdGhpcy51cmxfcXVlcnkuc3BsaXQoXCI7XCIpXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbiA9IGxbaV0uc3BsaXQoXCI6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc19uYW1lID0gblswXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IG5bMV0uc3BsaXQoXCI9PlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5X25hbWUgPSBwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbXBvcnRfbmFtZSA9IHBbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzX25hbWUgPT0gXCJyb290XCIpIGNsYXNzX25hbWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5X2RhdGFbaW1wb3J0X25hbWVdID0gd3VybC5nZXQoY2xhc3NfbmFtZSwga2V5X25hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9fX19yZXF1ZXN0X19fXyhxdWVyeV9kYXRhKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm1vZGVsKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbmV3IHRoaXMubW9kZWxfY29uc3RydWN0b3IoKTtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXR0ZXIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldHRlci5zZXRNb2RlbCh0aGlzLm1vZGVsKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwuYWRkVmlldyh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChxdWVyeV9kYXRhKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5tb2RlbC5hZGQocXVlcnlfZGF0YSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMubW9kZWwuZ2V0KCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMubW9kZWwuZ2V0KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25JbihpbmRleCA9IDApIHtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fdGltZSA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMudGVtcGxhdGVzW2ldLnRyYW5zaXRpb25JbihpbmRleCkpO1xyXG5cclxuICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHN1cGVyLnRyYW5zaXRpb25JbihpbmRleCkpO1xyXG5cclxuICAgICAgIHRoaXMudXBkYXRlRGltZW5zaW9ucygpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbl90aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFRha2VzIGFzIGFuIGlucHV0IGEgbGlzdCBvZiB0cmFuc2l0aW9uIG9iamVjdHMgdGhhdCBjYW4gYmUgdXNlZFxyXG4gICAgKi9cclxuICAgIHRyYW5zaXRpb25PdXQoaW5kZXggPSAwLCBERVNUUk9ZID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fdGltZSA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMudGVtcGxhdGVzW2ldLnRyYW5zaXRpb25PdXQoaW5kZXgpKTtcclxuXHJcbiAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCBzdXBlci50cmFuc2l0aW9uT3V0KGluZGV4LCBERVNUUk9ZKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uX3RpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmluYWxpemVUcmFuc2l0aW9uT3V0KCkge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVtcGxhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNbaV0uZmluYWxpemVUcmFuc2l0aW9uT3V0KCk7XHJcblxyXG4gICAgICAgIHN1cGVyLmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEFjdGl2YXRpbmcoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KVxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5zZXRBY3RpdmF0aW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZWRFbGVtZW50cyhuYW1lZF9lbGVtZW50cykge1xyXG4gICAgICAgIGZvciAobGV0IGNvbXBfbmFtZSBpbiB0aGlzLm5hbWVkX2VsZW1lbnRzKSB7XHJcbiAgICAgICAgICAgIG5hbWVkX2VsZW1lbnRzW2NvbXBfbmFtZV0gPSB0aGlzLm5hbWVkX2VsZW1lbnRzW2NvbXBfbmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBDdXN0b21DYXNlIGV4dGVuZHMgQ2FzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBkYXRhID0ge30sIHByZXNldHMgPSB7fSkge1xyXG4gICAgICAgIHN1cGVyKG51bGwsIGVsZW1lbnQsIGRhdGEsIHByZXNldHMpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBDYXNlLFxyXG4gICAgQ3VzdG9tQ2FzZVxyXG59IiwiaW1wb3J0IHtcclxuICAgIENhc3NldHRlXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGVcIlxyXG5cclxuY2xhc3MgRmlsdGVyIGV4dGVuZHMgQ2Fzc2V0dGUge1xyXG5cdFxyXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBlbGVtZW50LCBkLCBwKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKHBhcmVudCwgZWxlbWVudCwgZCwgcCk7XHJcblxyXG4gICAgICAgIHBhcmVudC5maWx0ZXJfbGlzdC5wdXNoKChkYXRhKSA9PiB0aGlzLmZpbHRlcihkYXRhKSk7XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC51cGRhdGUoKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkYXRhKSB7XHJcbiAgICAgICAgLy9hcHBseSBhIGZpbHRlciBvYmplY3QgdG8gdGhlIHBhcmVudFxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXIoZGF0YSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIEZpbHRlclxyXG59IiwiaW1wb3J0IHtcclxuICAgIENhc2VcclxufSBmcm9tIFwiLi9jYXNlXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBGaWx0ZXJcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9maWx0ZXJcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIFRlcm1cclxufSBmcm9tIFwiLi9jYXNzZXR0ZS90ZXJtXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBNQ0FycmF5LFxyXG4gICAgTW9kZWxDb250YWluZXIsXHJcbiAgICBNdWx0aUluZGV4ZWRDb250YWluZXJcclxufSBmcm9tIFwiLi4vbW9kZWwvbW9kZWxfY29udGFpbmVyXCJcclxuXHJcbmNsYXNzIENhc2VUZW1wbGF0ZSBleHRlbmRzIENhc2Uge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIENhc2VUZW1wbGF0ZSBjb25zdHJ1Y3Rvci4gQnVpbGRzIGEgQ2FzZVRlbXBsYXRlIG9iamVjdC5cclxuICAgICovXHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50ID0gbnVsbCwgZGF0YSwgcHJlc2V0cykge1xyXG5cclxuICAgICAgICBzdXBlcihwYXJlbnQsIGRhdGEsIHByZXNldHMpO1xyXG5cclxuICAgICAgICB0aGlzLmNhc2VzID0gW107XHJcbiAgICAgICAgdGhpcy5hY3RpdmVDYXNlcyA9IFtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0gW107XHJcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy50ZXJtcyA9IFtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucmFuZ2UgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BfZWxlbWVudHMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJVcGRhdGUoKSB7XHJcblxyXG4gICAgICAgIGxldCBvdXRwdXQgPSB0aGlzLmNhc2VzLnNsaWNlKCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGwgPSB0aGlzLmZpbHRlcnMubGVuZ3RoLCBpID0gMDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBvdXRwdXQgPSB0aGlzLmZpbHRlcnNbaV0uZmlsdGVyKG91dHB1dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYWN0aXZlQ2FzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuYWN0aXZlQ2FzZXNbaV0uZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG91dHB1dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQob3V0cHV0W2ldLmVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gdGhpcy5lbGVtZW50LnN0eWxlLnBvc2l0aW9uO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG91dHB1dC5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgb3V0cHV0W2ldLnRyYW5zaXRpb25JbihpKTtcclxuXHJcbiAgICAgICAgdGhpcy5hY3RpdmVDYXNlcyA9IG91dHB1dDtcclxuICAgICAgICAvL1NvcnQgYW5kIGZpbHRlciB0aGUgb3V0cHV0IHRvIHByZXNlbnQgdGhlIHJlc3VsdHMgb24gc2NyZWVuLlxyXG4gICAgfVxyXG5cclxuICAgIGN1bGwobmV3X2l0ZW1zKSB7XHJcblxyXG4gICAgICAgIGlmIChuZXdfaXRlbXMubGVuZ3RoID09IDApIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jYXNlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2ldLmRlc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FzZXMubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBleGlzdHMgPSBuZXcgTWFwKG5ld19pdGVtcy5tYXAoZSA9PiBbZSwgdHJ1ZV0pKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBvdXQgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jYXNlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICBpZiAoIWV4aXN0cy5oYXModGhpcy5jYXNlc1tpXS5tb2RlbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2ldLmRlc3RydWN0b3IoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhc2VzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBsLS07XHJcbiAgICAgICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RzLnNldCh0aGlzLmNhc2VzW2ldLm1vZGVsLCBmYWxzZSk7XHJcblxyXG5cclxuICAgICAgICAgICAgZXhpc3RzLmZvckVhY2goKHYsIGssIG0pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh2KSBvdXQucHVzaChrKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAob3V0Lmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZGVkKG91dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvYWQobW9kZWwpIHt9XHJcblxyXG4gICAgcmVtb3ZlZChpdGVtcykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSBpdGVtc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jYXNlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IENhc2UgPSB0aGlzLmNhc2VzW2pdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChDYXNlLm1vZGVsID09IGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhc2VzLnNwbGljZShqLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBDYXNlLmRpc3NvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZmlsdGVyVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkZWQoaXRlbXMpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgQ2FzZSA9IHRoaXMudGVtcGxhdGVzWzBdLmZsZXNoKGl0ZW1zW2ldKTtcclxuICAgICAgICAgICAgQ2FzZS5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmNhc2VzLnB1c2goQ2FzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmZpbHRlclVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldmlzZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5jYWNoZSlcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5jYWNoZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldFRlcm1zKCkge1xyXG5cclxuICAgICAgICBsZXQgb3V0X3Rlcm1zID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZXJtcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIG91dF90ZXJtcy5wdXNoKHRoaXMudGVybXNbaV0udGVybSk7XHJcblxyXG5cclxuICAgICAgICBpZiAob3V0X3Rlcm1zLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dF90ZXJtcztcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGF0YSwgSU1QT1JUID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YS50b0pzb24oKSlcclxuXHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRhdGEuZ2V0Q2hhbmdlZCh0aGlzLnByb3ApO1xyXG5cclxuICAgICAgICBpZiAoSU1QT1JUKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgVVBEQVRFID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVybXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXJtc1tpXS51cGRhdGUoZGF0YSkpXHJcbiAgICAgICAgICAgICAgICAgICAgVVBEQVRFID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKFVQREFURSAmJiB0aGlzLm1vZGVsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdWxsKHRoaXMuZ2V0KCkpXHJcblxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlsdGVyc1tpXS51cGRhdGUoZGF0YSkpXHJcbiAgICAgICAgICAgICAgICAgICAgVVBEQVRFID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChVUERBVEUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlclVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb250YWluZXIgJiYgKGNvbnRhaW5lciBpbnN0YW5jZW9mIE1vZGVsQ29udGFpbmVyIHx8IGNvbnRhaW5lci5fX19fc2VsZl9fX18pKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhY2hlID0gZGF0YTtcclxuXHJcbiAgICAgICAgICAgIGxldCBvd25fY29udGFpbmVyID0gY29udGFpbmVyLmdldCh0aGlzLmdldFRlcm1zKCksIG51bGwpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG93bl9jb250YWluZXIgaW5zdGFuY2VvZiBNb2RlbENvbnRhaW5lcikge1xyXG4gICAgICAgICAgICAgICAgb3duX2NvbnRhaW5lci5waW4oKTtcclxuICAgICAgICAgICAgICAgIG93bl9jb250YWluZXIuYWRkVmlldyh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VsbCh0aGlzLmdldCgpKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG93bl9jb250YWluZXIgaW5zdGFuY2VvZiBNQ0FycmF5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1bGwob3duX2NvbnRhaW5lcilcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG93bl9jb250YWluZXIgPSBkYXRhLl9fX19zZWxmX19fXy5kYXRhW3RoaXMucHJvcF1cclxuICAgICAgICAgICAgICAgIGlmIChvd25fY29udGFpbmVyIGluc3RhbmNlb2YgTW9kZWxDb250YWluZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvd25fY29udGFpbmVyLmFkZFZpZXcodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdWxsKHRoaXMuZ2V0KCkpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLm1vZGVsIGluc3RhbmNlb2YgTXVsdGlJbmRleGVkQ29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuZGF0YS5pbmRleDtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcXVlcnkgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICBxdWVyeVtpbmRleF0gPSB0aGlzLmdldFRlcm1zKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuZ2V0KHF1ZXJ5KVtpbmRleF07XHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiTm8gaW5kZXggdmFsdWUgcHJvdmlkZWQgZm9yIE11bHRpSW5kZXhlZENvbnRhaW5lciFcIilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgc291cmNlID0gdGhpcy5tb2RlbC5zb3VyY2U7XHJcbiAgICAgICAgICAgIGxldCB0ZXJtcyA9IHRoaXMuZ2V0VGVybXMoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwuZGVzdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBtb2RlbCA9IHNvdXJjZS5nZXQodGVybXMsIG51bGwpO1xyXG5cclxuICAgICAgICAgICAgICAgIG1vZGVsLnBpbigpO1xyXG4gICAgICAgICAgICAgICAgbW9kZWwuYWRkVmlldyh0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuZ2V0KHRlcm1zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25JbihlbGVtZW50cywgd3VybCkge1xyXG5cclxuICAgICAgICBsZXQgdHJhbnNpdGlvbl90aW1lID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnRlbXBsYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgdGhpcy50ZW1wbGF0ZXNbaV0udHJhbnNpdGlvbkluKGVsZW1lbnRzLCB3dXJsKSk7XHJcblxyXG4gICAgICAgIE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgc3VwZXIudHJhbnNpdGlvbkluKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbl90aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFRha2VzIGFzIGFuIGlucHV0IGEgbGlzdCBvZiB0cmFuc2l0aW9uIG9iamVjdHMgdGhhdCBjYW4gYmUgdXNlZFxyXG4gICAgKi9cclxuICAgIHRyYW5zaXRpb25PdXQodHJhbnNpdGlvbl90aW1lID0gMCwgREVTVFJPWSA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMudGVtcGxhdGVzW2ldLnRyYW5zaXRpb25PdXQoKSk7XHJcblxyXG4gICAgICAgIE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgc3VwZXIudHJhbnNpdGlvbk91dCh0cmFuc2l0aW9uX3RpbWUsIERFU1RST1kpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25fdGltZTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBDYXNlVGVtcGxhdGVcclxufSIsImltcG9ydCB7XHJcbiAgICBMZXhcclxufSBmcm9tIFwiLi4vY29tbW9uXCJcclxuXHJcbmNsYXNzIEluZGV4ZXIge1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMubGV4ZXIgPSBuZXcgTGV4KGVsZW1lbnQuaW5uZXJIVE1MKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIHRoaXMuc3RhY2sgPSBbXTtcclxuICAgICAgICB0aGlzLnNwID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoaW5kZXgsIFJFRE8gPSBmYWxzZSkge1xyXG4gICAgICAgIGxldCBsZXggPSB0aGlzLmxleGVyO1xyXG5cclxuICAgICAgICBpZiAoUkVETykge1xyXG4gICAgICAgICAgICBsZXgucmVzZXQoKTtcclxuICAgICAgICAgICAgdGhpcy5zdGFjay5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnNwID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgIGlmICghbGV4LnRleHQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChSRURPKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldChpbmRleCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAobGV4LnRleHQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCI8XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxleC5wZWVrKCkudGV4dCA9PSBcIi9cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpOyAvLyA8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7IC8vIC9cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gdGFnbmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpOyAvLyA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKC0tdGhpcy5zcCA8IDApIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YWNrLmxlbmd0aCA9IHRoaXMuc3AgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YWNrW3RoaXMuc3BdKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gPFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpOyAvLyB0YWduYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChsZXgudGV4dCAhPT0gXCI+XCIgJiYgbGV4LnRleHQgIT09IFwiL1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpOyAvLyBhdHRyaWIgbmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxleC50ZXh0ID09IFwiPVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChsZXgubmV4dCgpLCBsZXgubmV4dCgpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZXgudGV4dCA9PSBcIi9cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKSAvLyAvIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKSAvLyA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpOyAvLyA+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5zdGFjay5wdXNoKDApLCB0aGlzLnNwKyspXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGV4LnRleHQgPT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGV4LnRleHQgPT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZXgudGV4dCA9PSBcIjpcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGV4LnR5cGUgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG51bWJlciA9IHBhcnNlSW50KGxleC50ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChudW1iZXIgPT0gaW5kZXgpIHJldHVybiB0aGlzLmdldEVsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldEVsZW1lbnQoKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNwOyBpKyspIHtcclxuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuY2hpbGRyZW5bdGhpcy5zdGFja1tpXV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG59XHJcblxyXG4vKlxyXG4gICAgQ2FzZSBza2VsZXRvblxyXG4gICAgICAgIE1vZGVsIHBvaW50ZXIgT1Igc2NoZW1hIHBvaW50ZXJcclxuICAgICAgICAgICAgSUYgc2NoZW1hLCB0aGVuIHRoZSBza2VsZXRvbiB3aWxsIGNyZWF0ZSBhIG5ldyBNb2RlbCB3aGVuIGl0IGlzIGNvcGllZCwgVU5MRVNTIGEgbW9kZWwgaXMgZ2l2ZW4gdG8gdGhlIHNrZWxldG9uIGNvcHkgQ29uc3RydWN0b3IuIFxyXG4gICAgICAgICAgICBPdGhlciB3aXNlLCB0aGUgc2tlbGV0b24gd2lsbCBhdXRvbWF0aWNhbGx5IGFzc2lnbiB0aGUgTW9kZWwgdG8gdGhlIGNhc2Ugb2JqZWN0LiBcclxuXHJcbiAgICAgICAgVGhlIG1vZGVsIHdpbGwgYXV0b21hdGljYWxseSBjb3B5IGl0J3MgZWxlbWVudCBkYXRhIGludG8gdGhlIGNvcHksIHppcHBpbmcgdGhlIGRhdGEgZG93biBhcyB0aGUgQ29uc3RydWN0b3IgYnVpbGRzIHRoZSBDYXNlJ3MgY2hpbGRyZW4uXHJcblxyXG4qL1xyXG5leHBvcnQgY2xhc3MgQ2FzZVNrZWxldG9uIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBjb25zdHJ1Y3RvciwgZGF0YSwgcHJlc2V0cywgaW5kZXgpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIHRoaXMuQ29uc3RydWN0b3IgPSBjb25zdHJ1Y3RvcjtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmZpbHRlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLnRlcm1zID0gW107XHJcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICB0aGlzLnByZXNldHMgPSBwcmVzZXRzO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgIFxyXG4gICAgKi9cclxuICAgIGZsZXNoKE1vZGVsID0gbnVsbCkge1xyXG4gICAgICAgIGxldCBDYXNlID0gdGhpcy5fX19fY29weV9fX18obnVsbCwgbnVsbCwgbnVsbCk7XHJcblxyXG4gICAgICAgIENhc2UubG9hZChNb2RlbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBDYXNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIENvbnN0cnVjdHMgYSBuZXcgb2JqZWN0LCBhdHRhY2hpbmcgdG8gZWxlbWVudHMgaG9zdGVkIGJ5IGEgY2FzZS4gSWYgdGhlIGNvbXBvbmVudCB0byBjb25zdHJ1Y3QgaXMgYSBDYXNlLCB0aGVuIHRoZSBcclxuICAgICAgICBwYXJlbnRfZWxlbWVudCBnZXRzIHN3YXBwZWQgb3V0IGJ5IGEgY2xvbmVkIGVsZW1lbnQgdGhhdCBpcyBob3N0ZWQgYnkgdGhlIG5ld2x5IGNvbnN0cnVjdGVkIENhc2UuXHJcbiAgICAqL1xyXG4gICAgX19fX2NvcHlfX19fKHBhcmVudF9lbGVtZW50LCBwYXJlbnQsIGluZGV4ZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IGVsZW1lbnQsIENMQUlNRURfRUxFTUVOVCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pbmRleCA+IDApIHtcclxuICAgICAgICAgICAgZWxlbWVudCA9IGluZGV4ZXIuZ2V0KHRoaXMuaW5kZXgpXHJcbiAgICAgICAgICAgIENMQUlNRURfRUxFTUVOVCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHBhcmVudF9lbGVtZW50ID0gdGhpcy5lbGVtZW50LmNsb25lTm9kZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRfZWxlbWVudC5wYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRfZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlcGxhY2VOb2RlKHBhcmVudF9lbGVtZW50LCBlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwYXJlbnRfZWxlbWVudC5pbm5lckhUTUwpXHJcblxyXG4gICAgICAgICAgICBpbmRleGVyID0gbmV3IEluZGV4ZXIocGFyZW50X2VsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG91dF9vYmplY3Q7XHJcbiAgICAgICAgaWYgKHRoaXMuQ29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgb3V0X29iamVjdCA9IG5ldyB0aGlzLkNvbnN0cnVjdG9yKHBhcmVudCwgdGhpcy5kYXRhLCB0aGlzLnByZXNldHMpO1xyXG4gICAgICAgICAgICBpZiAoQ0xBSU1FRF9FTEVNRU5UKVxyXG4gICAgICAgICAgICAgICAgb3V0X29iamVjdC5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICB9IGVsc2UgaWYgKCFwYXJlbnQpIHtcclxuICAgICAgICAgICAgb3V0X29iamVjdCA9IHRoaXMuY2hpbGRyZW5bMF0uX19fX2NvcHlfX19fKHBhcmVudF9lbGVtZW50LCBudWxsLCBpbmRleGVyKTtcclxuICAgICAgICAgICAgb3V0X29iamVjdC5lbGVtZW50ID0gcGFyZW50X2VsZW1lbnQ7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXRfb2JqZWN0O1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBvdXRfb2JqZWN0ID0gcGFyZW50O1xyXG5cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uX19fX2NvcHlfX19fKHBhcmVudF9lbGVtZW50LCBvdXRfb2JqZWN0LCBpbmRleGVyKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudGVtcGxhdGVzLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRlcm1zLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMudGVybXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgIG91dF9vYmplY3QudGVybXMucHVzaCh0aGlzLnRlcm1zW2ldLl9fX19jb3B5X19fXyhwYXJlbnRfZWxlbWVudCwgbnVsbCwgaW5kZXhlcikpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZmlsdGVycy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgIG91dF9vYmplY3QuZmlsdGVycy5wdXNoKHRoaXMuZmlsdGVyc1tpXS5fX19fY29weV9fX18ocGFyZW50X2VsZW1lbnQsIG51bGwsIGluZGV4ZXIpKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgb3V0X29iamVjdC50ZW1wbGF0ZXMucHVzaCh0aGlzLnRlbXBsYXRlc1tpXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0X29iamVjdDtcclxuICAgIH1cclxufSIsImxldCBHTE9CQUwgPSAoKCk9PntcclxuXHRsZXQgbGlua2VyID0gbnVsbDtcclxuXHRyZXR1cm4ge1xyXG5cdFx0Z2V0IGxpbmtlcigpe1xyXG5cdFx0XHRyZXR1cm4gbGlua2VyO1xyXG5cdFx0fSxcclxuXHRcdHNldCBsaW5rZXIobCl7XHJcblx0XHRcdGlmKCFsaW5rZXIpXHJcblx0XHRcdFx0bGlua2VyID0gbDtcclxuXHRcdH1cclxuXHR9XHJcbn0pXHJcblxyXG5leHBvcnQge0dMT0JBTH0iLCJpbXBvcnQge1xyXG4gICAgQ2Fzc2V0dGVcclxufSBmcm9tIFwiLi9jYXNzZXR0ZVwiXHJcblxyXG5jbGFzcyBJbnB1dCBleHRlbmRzIENhc3NldHRlIHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgZWxlbWVudCwgZCwgcCkge1xyXG4gICAgICAgIC8vU2NhbiB0aGUgZWxlbWVudCBhbmQgbG9vayBmb3IgaW5wdXRzIHRoYXQgY2FuIGJlIG1hcHBlZCB0byB0aGVcclxuICAgICAgICBzdXBlcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApO1xyXG5cclxuICAgICAgICAvL0lucHV0cyBpbiBmb3JtcyBhcmUgYXV0b21hdGljYWxseSBoaWRkZW4uXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0ge31cclxuICAgICAgICAgICAgZGF0YVt0aGlzLnByb3BdID0gdGhpcy5lbGVtZW50LnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmFkZChkYXRhKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkYXRhKSB7XHJcblxyXG4gICAgICAgIGlmICghZGF0YVt0aGlzLnByb3BdKSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMudmFsID0gZGF0YVt0aGlzLnByb3BdO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKHRoaXMuZWxlbWVudC50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJkYXRlXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudmFsdWUgPSAobmV3IERhdGUocGFyc2VJbnQoZGF0YVt0aGlzLnByb3BdKSkpLnRvSVNPU3RyaW5nKCkuc3BsaXQoXCJUXCIpWzBdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0aW1lXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudmFsdWUgPSBgJHsoXCIwMFwiKyhkYXRhW3RoaXMucHJvcF0gfCAwKSkuc2xpY2UoLTIpfTokeyhcIjAwXCIrKChkYXRhW3RoaXMucHJvcF0lMSkqNjApKS5zbGljZSgtMil9OjAwLjAwMGA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInRleHRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC52YWx1ZSA9IChkYXRhW3RoaXMucHJvcF0gIT0gdW5kZWZpbmVkKSA/IGRhdGFbdGhpcy5wcm9wXSA6IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdCA9IHRoaXMuZWxlbWVudC5jbGFzc0xpc3RbMF07XHJcblxyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm1vZHVsb190aW1lXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aW1lID0gZGF0YVt0aGlzLnByb3BdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgSVNfUE0gPSAodGltZSAvIDEyID4gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtaW51dGVzID0gKCh0aW1lICUgMSkgKiA2MCkgfCAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaG91cnMgPSAoKCh0aW1lIHwgMCkgJSAxMikgIT0gMCkgPyAodGltZSB8IDApICUgMTIgOiAxMjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC52YWx1ZSA9IChob3VycyArIFwiOlwiICsgKFwiMFwiICsgbWludXRlcykuc2xpY2UoLTIpKSArICgoSVNfUE0pID8gXCIgUE1cIiA6IFwiIEFNXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnZhbHVlID0gKGRhdGFbdGhpcy5wcm9wXSAhPSB1bmRlZmluZWQpID8gZGF0YVt0aGlzLnByb3BdIDogXCJcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIElucHV0XHJcbn0iLCJpbXBvcnQge1xyXG4gICAgR0xPQkFMXHJcbn0gZnJvbSBcIi4uLy4uL2dsb2JhbFwiXHJcbmltcG9ydCB7XHJcbiAgICBJbnB1dFxyXG59IGZyb20gXCIuL2lucHV0XCJcclxuaW1wb3J0IHtcclxuICAgIENhc3NldHRlXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGVcIlxyXG5cclxuY2xhc3MgRm9ybSBleHRlbmRzIENhc3NldHRlIHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgZWxlbWVudCwgZCwgcCkge1xyXG4gICAgICAgIC8vU2NhbiB0aGUgZWxlbWVudCBhbmQgbG9vayBmb3IgaW5wdXRzIHRoYXQgY2FuIGJlIG1hcHBlZCB0byB0aGUgXHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBlbGVtZW50LCBkLCBwKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdWJtaXR0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNjaGVtYSA9IG51bGw7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlLnRhcmdldCwgdGhpcywgcGFyZW50KVxyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN1Ym1pdHRlZClcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VibWl0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhY2NlcHRlZChyZXN1bHQpIHtcclxuICAgICAgICByZXN1bHQudGV4dCgpLnRoZW4oKGUpID0+IHtcclxuICAgICAgICAgICAgZGVidWdnZXJcclxuICAgICAgICAgICAgR0xPQkFMLmxpbmtlci5sb2FkUGFnZShcclxuICAgICAgICAgICAgICAgIEdMT0JBTC5saW5rZXIubG9hZE5ld1BhZ2UocmVzdWx0LnVybCwgKG5ldyBET01QYXJzZXIoKSkucGFyc2VGcm9tU3RyaW5nKGUsIFwidGV4dC9odG1sXCIpKSxcclxuICAgICAgICAgICAgICAgIGZhbHNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZWplY3RlZChyZXN1bHQpIHtcclxuICAgICAgICByZXN1bHQudGV4dCgpLnRoZW4oKGUpID0+IHtcclxuICAgICAgICAgICAgZGVidWdnZXJcclxuICAgICAgICAgICAgR0xPQkFMLmxpbmtlci5sb2FkUGFnZShcclxuICAgICAgICAgICAgICAgIEdMT0JBTC5saW5rZXIubG9hZE5ld1BhZ2UocmVzdWx0LnVybCwgKG5ldyBET01QYXJzZXIoKSkucGFyc2VGcm9tU3RyaW5nKGUsIFwidGV4dC9odG1sXCIpKSxcclxuICAgICAgICAgICAgICAgIGZhbHNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBsb2FkKG1vZGVsKSB7XHJcblxyXG4gICAgICAgIGlmIChtb2RlbClcclxuICAgICAgICAgICAgdGhpcy5zY2hlbWEgPSBtb2RlbC5zY2hlbWE7XHJcblxyXG4gICAgICAgIHN1cGVyLmxvYWQobW9kZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkYXRhKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN1Ym1pdCgpIHtcclxuXHJcbiAgICAgICAgbGV0IHVybCA9IHRoaXMuZWxlbWVudC5hY3Rpb247XHJcblxyXG4gICAgICAgIHZhciBmb3JtX2RhdGEgPSAobmV3IEZvcm1EYXRhKHRoaXMuZWxlbWVudCkpO1xyXG4gICAgICAgIGlmICh0aGlzLnNjaGVtYSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIElucHV0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBjaGlsZC5lbGVtZW50Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3AgPSBjaGlsZC5wcm9wO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzY2hlbWUgPSB0aGlzLnNjaGVtYVtwcm9wXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2NoZW1lICYmIHByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbCA9IHNjaGVtZS5zdHJpbmcoY2hpbGQudmFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybV9kYXRhLnNldChuYW1lLCB2YWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByb3AsIG5hbWUsIHZhbCwgY2hpbGQudmFsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlYnVnZ2VyXHJcbiAgICAgICAgZmV0Y2godXJsLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXHJcbiAgICAgICAgICAgIGJvZHk6IGZvcm1fZGF0YSxcclxuICAgICAgICB9KS50aGVuKChyZXN1bHQpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzICE9IDIwMClcclxuICAgICAgICAgICAgICAgIHRoaXMucmVqZWN0ZWQocmVzdWx0KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hY2NlcHRlZChyZXN1bHQpXHJcblxyXG4gICAgICAgIH0pLmNhdGNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVqZWN0ZWQoZSk7XHJcbiAgICAgICAgfSlcclxuXHJcblxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIldpY2sgRm9ybSBTdWJtaXR0ZWRcIiwgdXJsLCBmb3JtX2RhdGEpXHJcblxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIEZvcm1cclxufSIsImltcG9ydCB7XHJcbiAgICBSaXZldFxyXG59IGZyb20gXCIuLi9yaXZldFwiXHJcbmV4cG9ydCBjbGFzcyBUYXAgZXh0ZW5kcyBSaXZldCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBkYXRhLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBkYXRhLCBwcmVzZXRzKTtcclxuICAgICAgICB0aGlzLnByb3AgPSBkYXRhLnByb3A7XHJcbiAgICB9XHJcblxyXG4gICAgZG93bihkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMgPSBudWxsLCBpbXBvcnRlZCkge1xyXG4gICAgICAgIGlmIChjaGFuZ2VkX3Byb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGFuZ2VkX3Byb3BlcnRpZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdlZF9wcm9wZXJ0aWVzW2ldID09IHRoaXMucHJvcClcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSBsIC0gMSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhW3RoaXMucHJvcF0gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBkYXRhW3RoaXMucHJvcF0gfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBTZWUgRGVmaW5pdGlvbiBpbiBSaXZldCBcclxuICBcdCovXHJcbiAgICBfX2Rvd25fXyhkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMgPSBudWxsLCBJTVBPUlRFRCA9IGZhbHNlKSB7XHJcbiAgICAgICAgbGV0IHJfdmFsID0gdGhpcy5kb3duKGRhdGEsIGNoYW5nZWRfcHJvcGVydGllcywgSU1QT1JURUQpO1xyXG4gICAgICAgIGlmIChyX3ZhbClcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uX19kb3duX18ocl92YWwsIFt0aGlzLnByb3BdLCBJTVBPUlRFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXAoZGF0YSkge1xyXG5cclxuICAgICAgICBpZiAoZGF0YS52YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxldCBvdXQgPSB7fTtcclxuICAgICAgICAgICAgb3V0W3RoaXMucHJvcF0gPSBkYXRhLnZhbHVlO1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge1xyXG4gICAgUml2ZXRcclxufSBmcm9tIFwiLi4vcml2ZXRcIlxyXG5leHBvcnQgY2xhc3MgUGlwZSBleHRlbmRzIFJpdmV0IHtcclxuXHJcbiAgICBzdGF0aWMgU3RhdGljKGRhdGEsIGh0bWwpIHtcclxuICAgICAgICByZXR1cm4gYDwke2RhdGEudGFnbmFtZX0+JHtodG1sfTwvJHtkYXRhLnRhZ25hbWV9PmBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIGRhdGEsIHByZXNldHMpIHtcclxuICAgICAgICBzdXBlcihwYXJlbnQsIGRhdGEsIHByZXNldHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvd24oZGF0YSl7XHJcbiAgICBcdHJldHVybiB7dmFsdWU6YDxiPiR7ZGF0YS52YWx1ZX08L2I+YH1cclxuICAgIH1cclxufVxyXG5cclxuUGlwZS5BRERTX1RBR1MgPSB0cnVlO1xyXG5QaXBlLkNBTl9CRV9TVEFUSUMgPSB0cnVlOyIsImltcG9ydCB7XHJcbiAgICBSaXZldFxyXG59IGZyb20gXCIuLi9yaXZldFwiXHJcblxyXG5leHBvcnQgY2xhc3MgSU8gZXh0ZW5kcyBSaXZldHtcclxuXHRjb25zdHJ1Y3RvcihwYXJlbnQsIGRhdGEsIHByZXNldHMpe1xyXG5cdFx0c3VwZXIocGFyZW50LCBkYXRhLCBwcmVzZXRzKVxyXG5cdFx0dGhpcy5wcm9wID0gZGF0YS5wcm9wXHJcblx0fVxyXG5cclxuXHRkb3duKGRhdGEpe1xyXG5cdFx0dGhpcy5lbGVtZW50LmlubmVySFRNTCA9IGRhdGEudmFsdWU7XHJcblx0fVxyXG59IiwiLypcclxuICAgIEJvcmluZyBDYXNlIHN0dWZmXHJcbiovXHJcbmltcG9ydCB7XHJcbiAgICBDYXNlLFxyXG59IGZyb20gXCIuL2Nhc2VcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIENhc2VUZW1wbGF0ZVxyXG59IGZyb20gXCIuL2Nhc2VfdGVtcGxhdGVcIlxyXG5pbXBvcnQge1xyXG4gICAgQ2FzZVNrZWxldG9uXHJcbn0gZnJvbSBcIi4vY2FzZV9za2VsZXRvblwiXHJcbi8qIFxyXG4gICAgQ2Fzc2V0dGVzXHJcbiovXHJcbmltcG9ydCB7XHJcbiAgICBGaWx0ZXJMaW1pdFxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2ZpbHRlcl9saW1pdFwiXHJcbmltcG9ydCB7XHJcbiAgICBDYXNzZXR0ZSxcclxuICAgIENsb3NlQ2Fzc2V0dGVcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9jYXNzZXR0ZVwiXHJcbmltcG9ydCB7XHJcbiAgICBGb3JtXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZm9ybVwiXHJcbmltcG9ydCB7XHJcbiAgICBJbnB1dFxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2lucHV0XCJcclxuaW1wb3J0IHtcclxuICAgIEZpbHRlclxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2ZpbHRlclwiXHJcbmltcG9ydCB7XHJcbiAgICBUZXJtXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvdGVybVwiXHJcbmltcG9ydCB7XHJcbiAgICBFeHBvcnRlclxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2V4cG9ydGVyXCJcclxuaW1wb3J0IHtcclxuICAgIEltcG9ydFF1ZXJ5XHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvaW1wb3J0X3F1ZXJ5XCJcclxuaW1wb3J0IHtcclxuICAgIERhdGFFZGl0XHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZGF0YV9lZGl0XCJcclxuaW1wb3J0IHtcclxuICAgIEV4aXN0cyxcclxuICAgIE5vdEV4aXN0c1xyXG59IGZyb20gXCIuL2Nhc3NldHRlL2V4aXN0c1wiXHJcbmltcG9ydCB7XHJcbiAgICBFcG9jaERheSxcclxuICAgIEVwb2NoVGltZSxcclxuICAgIEVwb2NoRGF0ZSxcclxuICAgIEVwb2NoTW9udGgsXHJcbiAgICBFcG9jaFllYXIsXHJcbiAgICBFcG9jaFRvRGF0ZVRpbWVcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9lcG9jaFwiXHJcblxyXG5sZXQgUHJlc2V0Q2Fzc2V0dGVzID0ge1xyXG4gICAgcmF3OiBDYXNzZXR0ZSxcclxuICAgIGNhc3NldHRlOiBDYXNzZXR0ZSxcclxuICAgIGZvcm06IEZvcm0sXHJcbiAgICBpbnB1dDogSW5wdXQsXHJcbiAgICBleHBvcnQ6IEV4cG9ydGVyLFxyXG4gICAgaXF1ZXJ5OiBJbXBvcnRRdWVyeSxcclxuICAgIGVkdDogRXBvY2hUb0RhdGVUaW1lLFxyXG4gICAgZXRpbWU6IEVwb2NoVGltZSxcclxuICAgIGVkYXk6IEVwb2NoRGF5LFxyXG4gICAgZWRhdGU6IEVwb2NoRGF0ZSxcclxuICAgIGV5ZWFyOiBFcG9jaFllYXIsXHJcbiAgICBlbW9udGg6IEVwb2NoTW9udGgsXHJcbiAgICBleGlzdHM6IEV4aXN0cyxcclxuICAgIG5vdF9leGlzdHM6IE5vdEV4aXN0cyxcclxuICAgIGRhdGFfZWRpdDogRGF0YUVkaXQsXHJcbiAgICB0ZXJtOiBUZXJtLFxyXG4gICAgbGltaXQ6IEZpbHRlckxpbWl0XHJcbn1cclxuXHJcbmltcG9ydCB7IFRhcCB9IGZyb20gXCIuL3RhcHMvdGFwXCJcclxuaW1wb3J0IHsgUGlwZSB9IGZyb20gXCIuL3BpcGVzL3BpcGVcIlxyXG5pbXBvcnQgeyBJTyB9IGZyb20gXCIuL2lvL2lvXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBSb290IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMudGFnX2luZGV4ID0gMTtcclxuICAgIH07XHJcblxyXG4gICAgYWRkQ2hpbGQoY2hpbGQpIHtcclxuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0U2tlbGV0b24ocHJlc2V0cykge1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy5odG1sO1xyXG4gICAgICAgIGxldCByb290X3NrZWxldG9uID0gbmV3IENhc2VTa2VsZXRvbihlbGVtZW50KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLmNvbnN0cnVjdFNrZWxldG9uKHJvb3Rfc2tlbGV0b24sIHByZXNldHMpO1xyXG4gICAgICAgIHJldHVybiByb290X3NrZWxldG9uO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEluZGV4KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRhZ19pbmRleCsrO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogdGhpcy5jaGlsZHJlbixcclxuICAgICAgICAgICAgaHRtbDogdGhpcy5odG1sXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9mZnNldChpbmNyZWFzZSA9IDApIHtcclxuICAgICAgICBsZXQgb3V0ID0gdGhpcy50YWdfY291bnQ7XHJcbiAgICAgICAgdGhpcy50YWdfY291bnQgKz0gaW5jcmVhc2U7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEdlbmVyaWNOb2RlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpIHtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy50YWduYW1lID0gdGFnbmFtZTtcclxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzIHx8IHt9O1xyXG4gICAgICAgIHRoaXMuSVNfTlVMTCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuQ09OU1VNRVNfVEFHID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLkNPTlNVTUVTX1NBTUUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgdGhpcy5wcm9wX25hbWUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5vcGVuX3RhZyA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jbG9zZV90YWcgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMudGFnX2luZGV4ID0gMDtcclxuICAgICAgICB0aGlzLmluZGV4ID0gMDtcclxuICAgICAgICBpZiAocGFyZW50KVxyXG4gICAgICAgICAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcyk7XHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgZmluYWxpemUoY3R4KSB7XHJcbiAgICAgICAgY3R4Lmh0bWwgKz0gdGhpcy5vcGVuX3RhZyArIHRoaXMuaHRtbCArIHRoaXMuY2xvc2VfdGFnO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcGxhY2VDaGlsZChjaGlsZCwgbmV3X2NoaWxkKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGlsZHJlbltpXSA9PSBjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXSA9IG5ld19jaGlsZDtcclxuICAgICAgICAgICAgICAgIG5ld19jaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQ2hpbGQoY2hpbGQpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoaWxkcmVuW2ldID09IGNoaWxkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZENoaWxkKGNoaWxkKSB7XHJcblxyXG4gICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFRhcE5vZGUgJiYgISh0aGlzIGluc3RhbmNlb2YgQ2FzZU5vZGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5hZGRDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VBdHRyaWJ1dGVzKCkge1xyXG4gICAgICAgIGxldCBvdXQgPSB7fTtcclxuICAgICAgICBvdXQucHJvcCA9IHRoaXMucHJvcF9uYW1lO1xyXG4gICAgICAgIHRoaXMuYXR0cmlidXRlcztcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFByb3AobGV4ZXIsIHByb3BfbmFtZSwgcGFyc2VGdW5jdGlvbiwgcHJlc2V0cykge1xyXG4gICAgICAgIGlmICh0aGlzLnByb3BfbmFtZSAhPT0gcHJvcF9uYW1lKVxyXG4gICAgICAgICAgICB0aGlzLnNwbGl0KG5ldyBJT05vZGUocHJvcF9uYW1lLCB0aGlzLmF0dHJpYnV0ZXMsIG51bGwsIHRoaXMsIHRoaXMuZ2V0SW5kZXgoKSksIHByb3BfbmFtZSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBuZXcgSU9Ob2RlKHByb3BfbmFtZSwgdGhpcy5hdHRyaWJ1dGVzLCB0aGlzLCB0aGlzLCB0aGlzLmdldEluZGV4KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogdGhpcy5jaGlsZHJlbixcclxuICAgICAgICAgICAgdGFnbmFtZTogdGhpcy50YWduYW1lLFxyXG4gICAgICAgICAgICB0YWdfY291bnQ6IHRoaXMudGFnX2NvdW50LFxyXG4gICAgICAgICAgICB0YWc6IHsgb3Blbl90YWc6IHRoaXMub3Blbl90YWcsIGNsb3NlX3RhZzogdGhpcy5jbG9zZV90YWcgfSxcclxuICAgICAgICAgICAgaHRtbDogdGhpcy5odG1sLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzcGxpdChub2RlLCBwcm9wX25hbWUpIHtcclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wX25hbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wX25hbWUgPT0gdGhpcy5wcm9wX25hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgciA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMudGFnbmFtZSwgdGhpcy5hdHRyaWJ1dGVzLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICByLkNPTlNVTUVTX1NBTUUgPSAoci5DT05TVU1FU19UQUcpID8gKCEoci5DT05TVU1FU19UQUcgPSAhMSkpIDogITE7XHJcbiAgICAgICAgICAgICAgICAgICAgci5wcm9wX25hbWUgPSBwcm9wX25hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgci5hZGRDaGlsZChub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuc3BsaXQociwgcHJvcF9uYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BfbmFtZSA9IHByb3BfbmFtZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnNwbGl0KHRoaXMsIHByb3BfbmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlclxyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wX25hbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wX25hbWUgPT0gdGhpcy5wcm9wX25hbWUpIHt9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy50YWduYW1lLCB0aGlzLmF0dHJpYnV0ZXMsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHIucHJvcF9uYW1lID0gcHJvcF9uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5zcGxpdChyLCBwcm9wX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuc3BsaXQodGhpcywgcHJvcF9uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgZ2V0SW5kZXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy50YWdfaW5kZXggPiAwKSByZXR1cm4gdGhpcy50YWdfaW5kZXgrKztcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHJldHVybiB0aGlzLnBhcmVudC5nZXRJbmRleCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdFNrZWxldG9uKHBhcmVudF9za2VsZXRvbiwgcHJlc2V0cykge1xyXG5cclxuICAgICAgICBsZXQgc2tlbGV0b24gPSB0aGlzLmNyZWF0ZVNrZWxldG9uQ29uc3RydWN0b3IocHJlc2V0cyk7XHJcblxyXG4gICAgICAgIHBhcmVudF9za2VsZXRvbi5jaGlsZHJlbi5wdXNoKHNrZWxldG9uKVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uY29uc3RydWN0U2tlbGV0b24oc2tlbGV0b24sIHByZXNldHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVNrZWxldG9uQ29uc3RydWN0b3IocHJlc2V0cykge1xyXG4gICAgICAgIGxldCBza2VsZXRvbiA9IG5ldyBDYXNlU2tlbGV0b24odGhpcy5nZXRFbGVtZW50KCksIHRoaXMuZ2V0Q29uc3RydWN0b3IocHJlc2V0cyksIHRoaXMucGFyc2VBdHRyaWJ1dGVzKCksIHByZXNldHMsIHRoaXMuaW5kZXgpO1xyXG4gICAgICAgIHJldHVybiBza2VsZXRvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFbGVtZW50KCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FzZU5vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpIHtcclxuICAgICAgICBzdXBlcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmaW5hbGl6ZShjdHgpIHtcclxuICAgICAgICBjdHguaHRtbCArPSB0aGlzLmh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUHJvcChsZXhlciwgcHJvcF9uYW1lLCBwYXJzZUZ1bmN0aW9uLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgaWYgKGxleGVyLnRleHQgPT0gXCIoXCIgJiYgbGV4ZXIucGVlaygpLnRleHQgPT0gXCIoXCIpIHtcclxuICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiKFwiKTtcclxuICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiKFwiKTtcclxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gbmV3IFRlbXBsYXRlTm9kZShcImxpc3RcIiwgdGhpcy5hdHRyaWJ1dGVzLCB0aGlzLCB0aGlzKTtcclxuICAgICAgICAgICAgdGVtcGxhdGUucGFyc2UobGV4ZXIsIHBhcnNlRnVuY3Rpb24sIHByZXNldHMpO1xyXG4gICAgICAgICAgICBsZXhlci5hc3NlcnQoXCIpXCIpO1xyXG4gICAgICAgICAgICBsZXQgb3V0ID0gbGV4ZXIucG9zICsgMTtcclxuICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiKVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgcmV0dXJuIENhc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQobm9kZSwgcHJvcF9uYW1lKSB7XHJcbiAgICAgICAgaWYgKG5vZGUpIHRoaXMuYWRkQ2hpbGQobm9kZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZU5vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQsIGN0eCkge1xyXG4gICAgICAgIHN1cGVyKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuZ2V0SW5kZXgoKTtcclxuICAgICAgICBjdHguaHRtbCArPSBgPGxpc3Q+IyM6JHt0aGlzLmluZGV4fTwvbGlzdD5gXHJcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy50ZXJtcyA9IFtdO1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0gW107XHJcbiAgICB9O1xyXG5cclxuICAgIGFkZENoaWxkKGNoaWxkKSB7XHJcbiAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgRmlsdGVyTm9kZSlcclxuICAgICAgICAgICAgdGhpcy5maWx0ZXJzLnB1c2goY2hpbGQpO1xyXG4gICAgICAgIGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgVGVybU5vZGUpXHJcbiAgICAgICAgICAgIHRoaXMudGVybXMucHVzaChjaGlsZCk7XHJcbiAgICAgICAgZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBDYXNlTm9kZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXMubGVuZ3RoID4gMCkgdGhyb3cgbmV3IEVycm9yKFwiT25seSBvbmUgQ2FzZSBhbGxvd2VkIGluIGEgVGVtcGxhdGUuXCIpO1xyXG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlcy5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgICAgY2hpbGQudGFnX2luZGV4ID0gMTtcclxuICAgICAgICAgICAgdGhpcy5odG1sID0gY2hpbGQuaHRtbDtcclxuICAgICAgICB9IGVsc2UgdGhyb3cgbmV3IEVycm9yKFwiVGVtcGxhdGVzIG9ubHkgc3VwcG9ydCBGaWx0ZXIsIFRlcm0gb3IgQ2FzZSBlbGVtZW50cy5cIilcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RTa2VsZXRvbihwYXJlbnRfc2tlbGV0b24sIHByZXNldHMpIHtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLmh0bWw7XHJcbiAgICAgICAgbGV0IHNrZWxldG9uID0gbmV3IENhc2VTa2VsZXRvbih0aGlzLmdldEVsZW1lbnQoKSwgQ2FzZVRlbXBsYXRlLCB0aGlzLnBhcnNlQXR0cmlidXRlcygpLCBwcmVzZXRzLCB0aGlzLmluZGV4KTtcclxuICAgICAgICBza2VsZXRvbi5maWx0ZXJzID0gdGhpcy5maWx0ZXJzLm1hcCgoZmlsdGVyKSA9PiBmaWx0ZXIuY3JlYXRlU2tlbGV0b25Db25zdHJ1Y3RvcihwcmVzZXRzKSlcclxuICAgICAgICBza2VsZXRvbi50ZXJtcyA9IHRoaXMudGVybXMubWFwKCh0ZXJtKSA9PiB0ZXJtLmNyZWF0ZVNrZWxldG9uQ29uc3RydWN0b3IocHJlc2V0cykpXHJcbiAgICAgICAgc2tlbGV0b24udGVtcGxhdGVzID0gdGhpcy50ZW1wbGF0ZXMubWFwKCh0ZW1wbGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2tsID0gdGVtcGxhdGUuY3JlYXRlU2tlbGV0b25Db25zdHJ1Y3RvcihwcmVzZXRzKTtcclxuICAgICAgICAgICAgc2tsLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgICAgICByZXR1cm4gc2tsO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcGFyZW50X3NrZWxldG9uLmNoaWxkcmVuLnB1c2goc2tlbGV0b24pXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RWxlbWVudCgpIHtcclxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpc3RcIik7XHJcbiAgICAgICAgcmV0dXJuIGRpdjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQcm9wKGxleGVyLCBwcm9wX25hbWUsIHBhcnNlRnVuY3Rpb24sIHByZXNldHMpIHtcclxuICAgICAgICAvL2N0eC5odG1sICs9IHByb3BfbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZShsZXhlciwgcGFyc2VGdW5jdGlvbiwgcHJlc2V0cykge1xyXG4gICAgICAgIGxldCBjdHggPSB7IGh0bWw6IFwiXCIgfTtcclxuICAgICAgICBsZXQgcm9vdCA9IG5ldyBSb290KCk7XHJcbiAgICAgICAgd2hpbGUgKGxleGVyLnRleHQgIT09IFwiKVwiICYmIGxleGVyLnBlZWsoKS50ZXh0ICE9PSBcIilcIikge1xyXG4gICAgICAgICAgICBpZiAoIWxleGVyLnRleHQpIHRocm93IG5ldyBFcnJvcihcIlVuZXhwZWN0ZWQgZW5kIG9mIE91dHB1dC4gTWlzc2luZyAnKSknIFwiKTtcclxuICAgICAgICAgICAgbGV0IG91dCA9IHBhcnNlRnVuY3Rpb24obGV4ZXIsIHRoaXMsIHByZXNldHMpO1xyXG4gICAgICAgICAgICBpZiAob3V0IGluc3RhbmNlb2YgQ2FzZU5vZGUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmh0bWwgPSBvdXQuaHRtbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQobm9kZSwgcHJvcF9uYW1lKSB7XHJcblxyXG4gICAgICAgIGlmIChub2RlKVxyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKG5vZGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50YWdfY291bnQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUYXBOb2RlIGV4dGVuZHMgR2VuZXJpY05vZGUge1xyXG4gICAgY29uc3RydWN0b3IodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgIH07XHJcblxyXG4gICAgZmluYWxpemUoY3R4KSB7XHJcbiAgICAgICAgY3R4Lmh0bWwgKz0gdGhpcy5odG1sO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbnN0cnVjdG9yKHByZXNldHMpIHtcclxuICAgICAgICByZXR1cm4gVGFwO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEZpbHRlck5vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpIHtcclxuICAgICAgICBzdXBlcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgICAgIHRoaXMuQ09OU1VNRVNfVEFHID0gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIGZpbmFsaXplKGN0eCkge31cclxuXHJcbiAgICBnZXRDb25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcbiAgICAgICAgcmV0dXJuIFRhcDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQcm9wKGxleGVyLCBwcm9wX25hbWUsIHBhcnNlRnVuY3Rpb24sIHByZXNldHMpIHtcclxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHJvcCA9IHByb3BfbmFtZTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBUZXJtTm9kZSBleHRlbmRzIEdlbmVyaWNOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCkge1xyXG4gICAgICAgIHN1cGVyKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGZpbmFsaXplKGN0eCkge31cclxuXHJcbiAgICBnZXRDb25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcbiAgICAgICAgcmV0dXJuIFRhcDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQcm9wKGxleGVyLCBwcm9wX25hbWUsIHBhcnNlRnVuY3Rpb24sIHByZXNldHMpIHtcclxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHJvcCA9IHByb3BfbmFtZTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUGlwZU5vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpIHtcclxuICAgICAgICBzdXBlcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmaW5hbGl6ZShjdHgsIHByZXNldHMpIHtcclxuICAgICAgICBjdHguaHRtbCArPSB0aGlzLmh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29uc3RydWN0b3IocHJlc2V0cywgZmluYWxpemluZyA9IGZhbHNlKSB7XHJcbiAgICAgICAgbGV0IGNvbnN0cnVjdG9yID0gUGlwZTtcclxuICAgICAgICByZXR1cm4gY29uc3RydWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQobm9kZSwgcHJvcF9uYW1lKSB7XHJcbiAgICAgICAgaWYgKCEodGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBQaXBlTm9kZSkgJiZcclxuICAgICAgICAgICAgISh0aGlzLnBhcmVudCBpbnN0YW5jZW9mIFRhcE5vZGUpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIC8vTmVlZCBhIFRhcE5vZGUgdG8gY29tcGxldGUgdGhlIHBpcGVsaW5lXHJcbiAgICAgICAgICAgIGxldCB0YXAgPSBuZXcgVGFwTm9kZShcIlwiLCB7fSwgbnVsbClcclxuICAgICAgICAgICAgdGhpcy5wcm9wX25hbWUgPSB0aGlzLnByb3BfbmFtZTtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVwbGFjZUNoaWxkKHRoaXMsIHRhcCk7XHJcbiAgICAgICAgICAgIHRhcC5hZGRDaGlsZCh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1cGVyLnNwbGl0KG5vZGUsIHByb3BfbmFtZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJT05vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wX25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCwgY3R4LCBpbmRleCkge1xyXG4gICAgICAgIHN1cGVyKFwiXCIsIG51bGwsIHBhcmVudCk7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGluZGV4KVxyXG4gICAgICAgIGN0eC5odG1sICs9IGA8aW8gcHJvcD1cIiR7cHJvcF9uYW1lfVwiPiMjOiR7aW5kZXh9PC9pbz5gXHJcbiAgICAgICAgdGhpcy5wcm9wX25hbWUgPSBwcm9wX25hbWU7XHJcbiAgICAgICAgdGhpcy5DT05TVU1FU19UQUcgPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBnZXRDb25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcbiAgICAgICAgcmV0dXJuIElPO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtcclxuICAgIExleFxyXG59IGZyb20gXCIuLi9jb21tb25cIlxyXG5cclxuaW1wb3J0ICogYXMgQVNUIGZyb20gXCIuL2Nhc2VfY29uc3RydWN0b3JfYXN0XCJcclxuXHJcbi8qXHJcbiAgICBUaGlzIGZ1bmN0aW9uJ3Mgcm9sZSBpcyB0byBjb25zdHJ1Y3QgYSBjYXNlIHNrZWxldG9uIGdpdmVuIGEgdGVtcGxhdGUsIGEgbGlzdCBvZiBwcmVzZXRzLCBhbmQgXHJcbiAgICBhbmQgb3B0aW9uYWxseSBhIHdvcmtpbmcgRE9NLiBUaGlzIHdpbGwgcmV0dXJuIENhc2UgU2tlbGV0b24gdGhhdCBjYW4gYmUgY2xvbmVkIGludG8gYSBuZXcgQ2FzZSBvYmplY3QuIFxyXG5cclxuICAgIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFRlbXBsYXRlXHJcbiAgICBAcGFyYW0ge1ByZXNldHN9IHByZXNldHMgXHJcbiAgICBAcGFyYW0ge0RPTUVsZW1lbnR9IFdPUktJTkdfRE9NXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBDYXNlQ29uc3RydWN0b3IoVGVtcGxhdGUsIFByZXNldHMsIFdPUktJTkdfRE9NKSB7XHJcblxyXG4gICAgbGV0IHNrZWxldG9uO1xyXG5cclxuICAgIGlmICghVGVtcGxhdGUpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgaWYgKFRlbXBsYXRlLnNrZWxldG9uKVxyXG4gICAgICAgIHJldHVybiBUZW1wbGF0ZS5za2VsZXRvbjtcclxuXHJcblxyXG4gICAgLy9URW1wbGF0ZSBGaWx0cmF0aW9uIGhhbmRsZWQgaGVyZS5cclxuICAgIC8vSW1wb3J0IHRoZSBcclxuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShUZW1wbGF0ZSwgdHJ1ZSk7XHJcblxyXG4gICAgc2tlbGV0b24gPSBDb21wb25lbnRDb25zdHJ1Y3RvcihlbGVtZW50LCBQcmVzZXRzLCBXT1JLSU5HX0RPTSk7XHJcblxyXG4gICAgaWYgKCFza2VsZXRvbilcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICBUZW1wbGF0ZS5za2VsZXRvbiA9ICgoc2tlbGV0b24pID0+IChtb2RlbCkgPT4gc2tlbGV0b24uZmxlc2gobW9kZWwpKShza2VsZXRvbik7XHJcblxyXG4gICAgcmV0dXJuIFRlbXBsYXRlLnNrZWxldG9uO1xyXG59XHJcblxyXG5mdW5jdGlvbiBSZXBsYWNlVGVtcGxhdGVXaXRoRWxlbWVudChUZW1wbGF0ZSkge1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gQ29tcG9uZW50Q29uc3RydWN0b3IoZWxlbWVudCwgcHJlc2V0cywgV09SS0lOR19ET00pIHtcclxuICAgIGxldCBhdHRyaWJ1dGVzID0gW107XHJcbiAgICBsZXQgcHJvcHMgPSBbXTtcclxuXHJcbiAgICBpZiAoZWxlbWVudC50YWdOYW1lID09PSBcIlRFTVBMQVRFXCIpIHtcclxuICAgICAgICBsZXQgY29tcG9uZW50X25hbWUgPSBlbGVtZW50LmlkO1xyXG4gICAgICAgIGxldCBpbnB1dCA9IGVsZW1lbnQuaW5uZXJIVE1MO1xyXG4gICAgICAgIGxldCBsZXhlciA9IExleChpbnB1dCk7XHJcblxyXG4gICAgICAgIC8vTWFrZSBzdXJlIHdlIGFyZSBzdGFydGluZyB3aXRoIGEgY2FzZSBvYmplY3QuIFxyXG5cclxuICAgICAgICBpZiAobGV4ZXIudGV4dCA9PSBcIjxcIikge1xyXG4gICAgICAgICAgICAvL29mZiB0byBhIGdvb2Qgc3RhcnRcclxuICAgICAgICAgICAgbGV0IHJvb3QgPSBuZXcgQVNULlJvb3QoKTtcclxuICAgICAgICAgICAgUGFyc2VUYWcobGV4ZXIsIHJvb3QsIHByZXNldHMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyb290KVxyXG4gICAgICAgICAgICByZXR1cm4gcm9vdC5jb25zdHJ1Y3RTa2VsZXRvbihwcmVzZXRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAgICBIYW5kbGVzIHRoZSBzZWxlY3Rpb24gb2YgQVNUIG5vZGVzIGJhc2VkIG9uIHRhZ25hbWU7XHJcbiAgICBcclxuICAgIEBwYXJhbSB7TGV4ZXJ9IGxleGVyIC0gVGhlIGxleGljYWwgcGFyc2VyIFxyXG4gICAgQHBhcmFtIHtTdHJpbmd9IHRhZ25hbWUgLSBUaGUgZWxlbWVudHMgdGFnbmFtZVxyXG4gICAgQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgLSBcclxuICAgIEBwYXJhbSB7T2JqZWN0fSBjdHhcclxuICAgIEBwYXJhbSB7Q0NBc3ROb2RlfSBwYXJlbnRcclxuKi9cclxuZnVuY3Rpb24gRGlzcGF0Y2gobGV4ZXIsIHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCkge1xyXG4gICAgbGV0IGFzdDtcclxuICAgIHN3aXRjaCAodGFnbmFtZSkge1xyXG4gICAgICAgIC8qIFRhcHMgKi9cclxuICAgICAgICBjYXNlIFwid1wiOlxyXG4gICAgICAgIGNhc2UgXCJ3LWFcIjpcclxuICAgICAgICBjYXNlIFwid19hXCI6XHJcbiAgICAgICAgICAgIGFzdCA9IG5ldyBBU1QuVGFwTm9kZSh0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXN0O1xyXG4gICAgICAgIGNhc2UgXCJ3LWZpbHRlclwiOlxyXG4gICAgICAgICAgICBhc3QgPSBuZXcgQVNULkZpbHRlck5vZGUodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFzdDtcclxuICAgICAgICBjYXNlIFwidy10ZXJtXCI6XHJcbiAgICAgICAgICAgIGFzdCA9IG5ldyBBU1QuVGVybU5vZGUodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFzdDtcclxuICAgICAgICBjYXNlIFwidy1jXCI6XHJcbiAgICAgICAgY2FzZSBcIndfY1wiOlxyXG4gICAgICAgIGNhc2UgXCJ3LWNhc2VcIjpcclxuICAgICAgICBjYXNlIFwid19jYXNlXCI6XHJcbiAgICAgICAgICAgIGFzdCA9IG5ldyBBU1QuQ2FzZU5vZGUodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFzdDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBpZiAodGFnbmFtZVswXSA9PSBcIndcIikge1xyXG4gICAgICAgICAgICAgICAgYXN0ID0gbmV3IEFTVC5QaXBlTm9kZSh0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGFzdCA9IG5ldyBBU1QuR2VuZXJpY05vZGUodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgIHJldHVybiBhc3Q7XHJcbn1cclxuXHJcbi8qKlxyXG4gICAgSGFuZGxlcyB0aGUgcGFyc2luZyBvZiBIVE1MIHRhZ3MgYW5kIGNvbnRlbnRcclxuICAgIEBwYXJhbSB7U3RyaW5nfSB0YWduYW1lXHJcbiAgICBAcGFyYW0ge09iamVjdH0gY3R4XHJcbiAgICBAcGFyYW0ge0NDQXN0Tm9kZX0gcGFyZW50XHJcbiovXHJcbmZ1bmN0aW9uIFBhcnNlVGFnKGxleGVyLCBwYXJlbnQsIHByZXNldHMpIHtcclxuICAgIGxldCBzdGFydCA9IGxleGVyLnBvcztcclxuICAgIGxldCBhdHRyaWJ1dGVzID0ge307XHJcbiAgICBcclxuICAgIGxleGVyLmFzc2VydChcIjxcIilcclxuICAgIFxyXG4gICAgbGV0IHRhZ25hbWUgPSBsZXhlci50ZXh0O1xyXG4gICAgXHJcbiAgICBpZiAobGV4ZXIudHlwZSA9PSBcImlkZW50aWZpZXJcIikge1xyXG4gICAgICAgIGxleGVyLm5leHQoKTtcclxuICAgICAgICBHZXRBdHRyaWJ1dGVzKGxleGVyLCBhdHRyaWJ1dGVzKTtcclxuICAgIH0gZWxzZSB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHRhZy1uYW1lIGlkZW50aWZpZXIsIGdvdCAke2xleGVyLnRleHR9YCk7XHJcblxyXG4gICAgbGV0IGVsZSA9IERpc3BhdGNoKGxleGVyLCB0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG5cclxuICAgIGVsZS5vcGVuX3RhZyArPSBsZXhlci5zbGljZShzdGFydCk7XHJcblxyXG4gICAgc3RhcnQgPSBsZXhlci50b2tlbi5wb3M7XHJcblxyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFsZXhlci50ZXh0KVxyXG4gICAgICAgICAgICB0aHJvdyAoXCJVbmV4cGVjdGVkIGVuZCBvZiBvdXRwdXRcIik7XHJcblxyXG4gICAgICAgIHN3aXRjaCAobGV4ZXIudGV4dCkge1xyXG4gICAgICAgICAgICBjYXNlIFwiPFwiOlxyXG4gICAgICAgICAgICAgICAgaWYgKGxleGVyLnBlZWsoKS50ZXh0ID09IFwiL1wiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGVsZS5odG1sICs9IGxleGVyLnNsaWNlKHN0YXJ0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBsZXhlci5wb3M7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vU2hvdWxkIGJlIGNsb3NpbmcgaXQncyBvd24gdGFnLlxyXG4gICAgICAgICAgICAgICAgICAgIGxleGVyLmFzc2VydChcIjxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiL1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXhlci5hc3NlcnQodGFnbmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBvdXQgPSBsZXhlci5wb3MgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGxleGVyLmFzc2VydChcIj5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGVsZS5jbG9zZV90YWcgPSBsZXhlci5zbGljZShzdGFydCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGVsZS5maW5hbGl6ZShwYXJlbnQgfHwge2h0bWw6XCJcIn0sIHByZXNldHMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBQYXJzZVRhZyhsZXhlciwgZWxlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiW1wiOlxyXG4gICAgICAgICAgICAgICAgZWxlLmh0bWwgKz0gbGV4ZXIuc2xpY2Uoc3RhcnQpO1xyXG4gICAgICAgICAgICAgICAgbGV4ZXIubmV4dCgpXHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvcF9uYW1lID0gbGV4ZXIudGV4dDtcclxuICAgICAgICAgICAgICAgIGxleGVyLm5leHQoKVxyXG4gICAgICAgICAgICAgICAgc3RhcnQgPSBsZXhlci5wb3MgKyAxO1xyXG4gICAgICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiXVwiKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gZWxlLmFkZFByb3AobGV4ZXIsIHByb3BfbmFtZSwgUGFyc2VUYWcsIHByZXNldHMpIHx8IHN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBsZXhlci5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gICAgUmV0dXJucyBhbGwgYXR0cmlidXRlcyBpbiBhbiBlbGVtZW50IGFzIGEga2V5LXZhbHVlIG9iamVjdC5cclxuXHJcbiAgICBAcGFyYW0ge0xleGVyfSBsZXhlciAtIFRoZSBsZXhpY2FsIHBhcnNlciAgXHJcbiAgICBAcGFyYW0ge09iamVjdH0gYXR0aWJzIC0gQW4gb2JqZWN0IHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgYXR0cmlidXRlIGtleXMgYW5kIHZhbHVlcy4gXHJcbiovXHJcbmZ1bmN0aW9uIEdldEF0dHJpYnV0ZXMobGV4ZXIsIGF0dHJpYnMpIHtcclxuICAgIHdoaWxlIChsZXhlci50ZXh0ICE9PSBcIj5cIiAmJiBsZXhlci50ZXh0ICE9PSBcIi9cIikge1xyXG4gICAgICAgIGlmICghbGV4ZXIudGV4dCkgdGhyb3cgRXJyb3IoXCJVbmV4cGVjdGVkIGVuZCBvZiBpbnB1dC5cIik7XHJcbiAgICAgICAgbGV0IGF0dHJpYl9uYW1lID0gbGV4ZXIudGV4dDtcclxuICAgICAgICBsZXQgYXR0cmliX3ZhbCA9IG51bGw7XHJcbiAgICAgICAgbGV4ZXIubmV4dCgpO1xyXG4gICAgICAgIGlmIChsZXhlci50ZXh0ID09IFwiPVwiKSB7XHJcbiAgICAgICAgICAgIGxleGVyLm5leHQoKTtcclxuICAgICAgICAgICAgaWYgKGxleGVyLnRva2VuLnR5cGUgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgYXR0cmliX3ZhbCA9IGxleGVyLnRleHQuc2xpY2UoMSwgLTEpO1xyXG4gICAgICAgICAgICAgICAgbGV4ZXIubmV4dCgpO1xyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGluZyBhdHRyaWJ1dGUgZGVmaW5pdGlvbi5cIik7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBhdHRyaWJzW2F0dHJpYl9uYW1lXSA9IGF0dHJpYl92YWw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGxleGVyLnRleHQgPT0gXCIvXCIpIC8vIFZvaWQgTm9kZXNcclxuICAgICAgICBsZXhlci5hc3NlcnQoXCIvXCIpO1xyXG4gICAgbGV4ZXIuYXNzZXJ0KFwiPlwiKTtcclxufSIsImltcG9ydCB7XHJcbiAgICBzZXRMaW5rc1xyXG59IGZyb20gXCIuL3NldGxpbmtzXCJcclxuaW1wb3J0IHtcclxuICAgIFRyYW5zZm9ybVRvXHJcbn0gZnJvbSBcIi4uL2FuaW1hdGlvbi9hbmltYXRpb25cIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIEJhc2ljQ2FzZSxcclxuICAgIEZhaWxlZENhc2VcclxufSBmcm9tIFwiLi9jb21wb25lbnRcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIENhc2VDb25zdHJ1Y3RvclxyXG59IGZyb20gXCIuLi9jYXNlL2Nhc2VfY29uc3RydWN0b3JcIlxyXG5cclxuLyoqXHJcbiAgICBUaGUgbWFpbiBjb250YWluZXIgb2YgQ2FzZXMuIFJlcHJlc2VudHMgYW4gYXJlYSBvZiBpbnRlcmVzdCBvbiB0aGUgY2xpZW50IHZpZXcuXHJcbiovXHJcbmNsYXNzIEVsZW1lbnQge1xyXG4gICAgLyoqXHJcbiAgICAgXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLmlkID0gKGVsZW1lbnQuY2xhc3NMaXN0KSA/IGVsZW1lbnQuY2xhc3NMaXN0WzBdIDogZWxlbWVudC5pZDtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBbXTtcclxuICAgICAgICB0aGlzLmJ1YmJsZWRfZWxlbWVudHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMud3JhcHMgPSBbXTtcclxuXHJcbiAgICAgICAgLy9UaGUgb3JpZ2luYWwgZWxlbWVudCBjb250YWluZXIuXHJcbiAgICAgICAgLy90aGlzLnBhcmVudF9lbGVtZW50ID0gcGFyZW50X2VsZW1lbnQ7XHJcblxyXG4gICAgICAgIC8vQ29udGVudCB0aGF0IGlzIHdyYXBwZWQgaW4gYW4gZWxlX3dyYXBcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1bmxvYWRDb21wb25lbnRzKCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHNbaV0uTE9BREVEID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNpdGlvbk91dCgpIHtcclxuXHJcbiAgICAgICAgbGV0IHQgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50LkxPQURFRCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wYXJlbnQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIHQgPSBNYXRoLm1heChjb21wb25lbnQudHJhbnNpdGlvbk91dCgpLCB0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmFsaXplKCkge1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50LkxPQURFRCAmJiBjb21wb25lbnQucGFyZW50RWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53cmFwc1tpXS5yZW1vdmVDaGlsZChjb21wb25lbnQuZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5MT0FERUQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZENvbXBvbmVudHMod3VybCkge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5wYXJlbnQgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5lbGVtZW50LnBhcmVudEVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGNvbXBvbmVudC5lbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3JhcHNbaV0uYXBwZW5kQ2hpbGQoY29tcG9uZW50LmVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgY29tcG9uZW50LmhhbmRsZVVybFVwZGF0ZSh3dXJsKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50c1tpXS5MT0FERUQgPSB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNpdGlvbkluKCkge1xyXG5cclxuICAgICAgICAvLyBUaGlzIGlzIHRvIGZvcmNlIGEgZG9jdW1lbnQgcmVwYWludCwgd2hpY2ggc2hvdWxkIGNhdXNlIGFsbCBlbGVtZW50cyB0byByZXBvcnQgY29ycmVjdCBwb3NpdGlvbmluZyBoZXJlYWZ0ZXJcclxuXHJcbiAgICAgICAgbGV0IHQgPSB0aGlzLmVsZW1lbnQuc3R5bGUudG9wO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSB0O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW2ldO1xyXG5cclxuICAgICAgICAgICAgY29tcG9uZW50LnRyYW5zaXRpb25JbigpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYnViYmxlTGluayhsaW5rX3VybCwgY2hpbGQsIHRyc19lbGUgPSB7fSkge1xyXG5cclxuICAgICAgICB0aGlzLmJ1YmJsZWRfZWxlbWVudHMgPSB0cnNfZWxlO1xyXG5cclxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJpZ25vcmVkIHRpdGxlXCIsIGxpbmtfdXJsKTtcclxuXHJcbiAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUcmFuc2Zvcm1Ubyh0cmFuc2l0aW9ucykge1xyXG4gICAgICAgIGlmICh0cmFuc2l0aW9ucykge1xyXG4gICAgICAgICAgICBsZXQgb3duX2VsZW1lbnRzID0ge307XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdldE5hbWVkRWxlbWVudHMob3duX2VsZW1lbnRzKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gb3duX2VsZW1lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uc1tuYW1lXSA9IFRyYW5zZm9ybVRvKG93bl9lbGVtZW50c1tuYW1lXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VHJhbnNmb3JtVG8odHJhbnNpdGlvbnMpIHtcclxuICAgICAgICBpZiAodHJhbnNpdGlvbnMpIHtcclxuICAgICAgICAgICAgbGV0IG93bl9lbGVtZW50cyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5nZXROYW1lZEVsZW1lbnRzKG93bl9lbGVtZW50cyk7XHJcblxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBvd25fZWxlbWVudHMpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0bywgZnJvbSA9IHRyYW5zaXRpb25zW25hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCh0byA9IG93bl9lbGVtZW50c1tuYW1lXSkgJiYgZnJvbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZyb20odG8sIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYnViYmxlZF9lbGVtZW50cykge1xyXG4gICAgICAgICAgICBsZXQgdCA9IHRoaXMuYnViYmxlZF9lbGVtZW50cztcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHQgaW4gdGhpcy5idWJibGVkX2VsZW1lbnRzKVxyXG4gICAgICAgICAgICAgICAgbmFtZWRfZWxlbWVudHNbdF0gPSB0aGlzLmJ1YmJsZWRfZWxlbWVudHNbdF07XHJcblxyXG4gICAgICAgICAgICAvL3RoaXMuYnViYmxlZF9lbGVtZW50cyA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmVsZW1lbnQuY2hpbGRyZW47XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkID0gY2hpbGRyZW5baV07XHJcblxyXG4gICAgICAgICAgICBpZiAoY2hpbGQuZGF0YXNldC50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lZF9lbGVtZW50c1tjaGlsZC5kYXRhc2V0LnRyYW5zaXRpb25dID0gY2hpbGQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbaV07XHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5nZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29tcG9uZW50cyhBcHBfQ29tcG9uZW50cywgTW9kZWxfQ29uc3RydWN0b3JzLCBDb21wb25lbnRfQ29uc3RydWN0b3JzLCBwcmVzZXRzLCBET00sIHd1cmwpIHtcclxuICAgICAgICAvL2lmIHRoZXJlIGlzIGEgY29tcG9uZW50IGluc2lkZSB0aGUgZWxlbWVudCwgcmVnaXN0ZXIgdGhhdCBjb21wb25lbnQgaWYgaXQgaGFzIG5vdCBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZFxyXG4gICAgICAgIHZhciBjb21wb25lbnRzID0gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImNvbXBvbmVudFwiKSwgKGEpID0+IGEpO1xyXG5cclxuICAgICAgICBzZXRMaW5rcyh0aGlzLmVsZW1lbnQsIChocmVmLCBlKSA9PiB7XHJcbiAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHt9LCBcImlnbm9yZWQgdGl0bGVcIiwgaHJlZik7XHJcbiAgICAgICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA8IDEpIHtcclxuICAgICAgICAgICAgLy9DcmVhdGUgYSB3cmFwcGVkIGNvbXBvbmVudCBmb3IgdGhlIGVsZW1lbnRzIGluc2lkZSB0aGUgPGVsZW1lbnQ+XHJcbiAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBjb21wb25lbnQuY2xhc3NMaXN0LmFkZChcImNvbXBfd3JhcFwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vU3RyYWlnaHQgdXAgc3RyaW5nIGNvcHkgb2YgdGhlIGVsZW1lbnQncyBET00uXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5pbm5lckhUTUwgPSB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHRlbXBsYXRlcyA9IERPTS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRlbXBsYXRlXCIpO1xyXG5cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBhcHBfY2FzZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSBjb21wb25lbnRzW2ldO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgIFJlcGxhY2UgdGhlIGNvbXBvbmVudCB3aXRoIGEgY29tcG9uZW50IHdyYXBwZXIgdG8gaGVscCBwcmVzZXJ2ZSBET00gYXJyYW5nZW1lbnRcclxuICAgICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNvbXBfd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgICAgICBjb21wX3dyYXAuY2xhc3NMaXN0LmFkZChcImNvbXBfd3JhcFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud3JhcHMucHVzaChjb21wX3dyYXApO1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnBhcmVudEVsZW1lbnQucmVwbGFjZUNoaWxkKGNvbXBfd3JhcCwgY29tcG9uZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBjb21wb25lbnQuY2xhc3NMaXN0WzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbXA7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgV2UgbXVzdCBlbnN1cmUgdGhhdCBjb21wb25lbnRzIGFjdCBhcyB0ZW1wbGF0ZSBcImxhbmRpbmcgc3BvdHNcIi4gSW4gb3JkZXIgZm9yIHRoYXQgdG8gaGFwcGVuIHdlIG11c3QgY2hlY2sgZm9yOlxyXG4gICAgICAgICAgICAgICAgICAoMSkgVGhlIGNvbXBvbmVudCBoYXMsIGFzIGl0J3MgZmlyc3QgY2xhc3MgbmFtZSwgYW4gaWQgdGhhdCAoMikgbWF0Y2hlcyB0aGUgaWQgb2YgYSB0ZW1wbGF0ZS4gSWYgZWl0aGVyIG9mIHRoZXNlIHByb3ZlIHRvIGJlIG5vdCB0cnVlLCB3ZSBzaG91bGQgcmVqZWN0IHRoZSBhZG9wdGlvbiBvZiB0aGUgY29tcG9uZW50IGFzIGEgV2lja1xyXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnQgYW5kIGluc3RlYWQgdHJlYXQgaXQgYXMgYSBub3JtYWwgXCJwYXNzIHRocm91Z2hcIiBlbGVtZW50LlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmICghaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKnNldExpbmtzKGNvbXBvbmVudCwgKGhyZWYsIGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiaWdub3JlZCB0aXRsZVwiLCBocmVmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBhcHBfY2FzZSA9IG5ldyBCYXNpY0Nhc2UoY29tcG9uZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIUFwcF9Db21wb25lbnRzW2lkXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcCA9IENvbXBvbmVudF9Db25zdHJ1Y3RvcnNbaWRdKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBuZXcgY29tcC5jb25zdHJ1Y3Rvcih0ZW1wbGF0ZXMsIHByZXNldHMsIGNvbXBvbmVudCwgRE9NKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcC5tb2RlbF9uYW1lICYmIE1vZGVsX0NvbnN0cnVjdG9yc1tjb21wLm1vZGVsX25hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1vZGVsID0gTW9kZWxfQ29uc3RydWN0b3JzW2NvbXAubW9kZWxfbmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsLmdldHRlcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwuZ2V0dGVyLmdldCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLmFkZFZpZXcoYXBwX2Nhc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlLmlkID0gaWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwX0NvbXBvbmVudHNbaWRdID0gYXBwX2Nhc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSB0ZW1wbGF0ZXNbaWRdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gQ2FzZUNvbnN0cnVjdG9yKHRlbXBsYXRlLCBwcmVzZXRzLCBET00pKCk7IC8vbmV3IENhc2VDb21wb25lbnQodGVtcGxhdGUsIHByZXNldHMsIE1vZGVsX0NvbnN0cnVjdG9ycywgbnVsbCwgRE9NKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnN0cnVjdG9yID0gQ2FzZUNvbnN0cnVjdG9yKGNvbXBvbmVudCwgcHJlc2V0cywgRE9NKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb25zdHJ1Y3RvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RydWN0b3IgPSBDYXNlQ29uc3RydWN0b3IoY29tcG9uZW50LmNoaWxkcmVuWzBdLCBwcmVzZXRzLCBET00pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29uc3RydWN0b3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gbmV3IEJhc2ljQ2FzZShjb21wb25lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBjb25zdHJ1Y3RvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFwcF9jYXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJBcHAgQ29tcG9uZW50IG5vdCBjb25zdHJ1Y3RlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKiBUT0RPOiBJZiB0aGVyZSBpcyBhIGZhbGxiYWNrIDxuby1zY3JpcHQ+IHNlY3Rpb24gdXNlIHRoYXQgaW5zdGVhZC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gbmV3IEZhaWxlZENhc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcF9Db21wb25lbnRzW2lkXSA9IGFwcF9jYXNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBBcHBfQ29tcG9uZW50c1tpZF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBhcHBfY2FzZS5oYW5kbGVVcmxVcGRhdGUod3VybCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgICAgICBhcHBfY2FzZSA9IG5ldyBGYWlsZWRDYXNlKGUsIHByZXNldHMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMucHVzaChhcHBfY2FzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgRWxlbWVudFxyXG59IiwiaW1wb3J0IHtcclxuICAgIFdVUkxcclxufSBmcm9tIFwiLi93dXJsXCJcclxuaW1wb3J0IHtcclxuICAgIEFueU1vZGVsXHJcbn1mcm9tIFwiLi4vbW9kZWwvbW9kZWxcIlxyXG5pbXBvcnQge1xyXG4gICAgUGFnZVZpZXdcclxufSBmcm9tIFwiLi9wYWdlXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBFbGVtZW50XHJcbn0gZnJvbSBcIi4vZWxlbWVudFwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgVHVybkRhdGFJbnRvUXVlcnlcclxufSBmcm9tIFwiLi4vY29tbW9uL3VybC91cmxcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIEdMT0JBTFxyXG59IGZyb20gXCIuLi9nbG9iYWxcIlxyXG5cclxubGV0IFVSTF9IT1NUID0ge1xyXG4gICAgd3VybDogbnVsbFxyXG59O1xyXG5sZXQgVVJMID0gKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgIENoYW5nZXMgdGhlIFVSTCB0byB0aGUgb25lIHByb3ZpZGVkLCBwcm9tcHRzIHBhZ2UgdXBkYXRlLiBvdmVyd3JpdGVzIGN1cnJlbnQgVVJMLlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24oYSwgYiwgYykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChVUkxfSE9TVC53dXJsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBVUkxfSE9TVC53dXJsLnNldChhLCBiLCBjKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJldHVybnMgYSBRdWVyeSBlbnRyeSBpZiBpdCBleGlzdHMgaW4gdGhlIHF1ZXJ5IHN0cmluZy4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoVVJMX0hPU1Qud3VybClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFVSTF9IT1NULnd1cmwuc2V0KGEsIGIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhbmdlcyB0aGUgVVJMIHN0YXRlIHRvIHRoZSBvbmUgcHJvdmlkZWQgYW5kIHByb21wdHMgdGhlIEJyb3dzZXIgdG8gcmVzcG9uZCBvIHRoZSBjaGFuZ2UuIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZ290bzogZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJpZ25vcmVkIHRpdGxlXCIsIGAke2F9JHsgKChiKSA/IGA/JHtUdXJuRGF0YUludG9RdWVyeShiKX1gIDogXCJcIikgfWApO1xyXG4gICAgICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuXHJcbmZ1bmN0aW9uIGdldE1vZGFsQ29udGFpbmVyKCkge1xyXG4gICAgbGV0IG1vZGFsX2NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibW9kYWxzXCIpWzBdO1xyXG5cclxuICAgIGlmICghbW9kYWxfY29udGFpbmVyKSB7XHJcblxyXG4gICAgICAgIG1vZGFsX2NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtb2RhbHNcIik7XHJcblxyXG4gICAgICAgIHZhciBkb21fYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhcHBcIilbMF07XHJcblxyXG4gICAgICAgIGlmIChkb21fYXBwKVxyXG4gICAgICAgICAgICBkb21fYXBwLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG1vZGFsX2NvbnRhaW5lciwgZG9tX2FwcCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1vZGFsX2NvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1vZGFsX2NvbnRhaW5lclxyXG59XHJcblxyXG4vKiogQG5hbWVzcGFjZSBsaW5rZXIgKi9cclxuXHJcbi8qKlxyXG4gKiAgUmVzcG9uc2libGUgZm9yIGxvYWRpbmcgcGFnZXMgYW5kIHByZXNlbnRpbmcgdGhlbSBpbiB0aGUgbWFpbiBET00uXHJcbiAqL1xyXG5jbGFzcyBMaW5rZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiAgVGhpcyAoaW5rZXIuTGlua2VyKSBpcyByZXNwb25zaWJsZSBmb3IgbG9hZGluZyBwYWdlcyBkeW5hbWljYWxseSwgaGFuZGxpbmcgdGhlIHRyYW5zaXRpb24gb2YgcGFnZSBjb21wb25lbnRzLCBhbmQgbW9uaXRvcmluZyBhbmQgcmVhY3RpbmcgdG8gVVJMIGNoYW5nZXNcclxuICAgICAqXHJcbiAgICAgKlxyXG4gICAgICogIEBwYXJhbSB7TGlua2VyUHJlc2V0c30gcHJlc2V0cyAtIEEgcHJlc2V0IGJhc2VkIG9iamVjdCB0aGF0IHdpbGwgYmUgdXNlZCBieSBXaWNrIGZvciBoYW5kbGluZyBjdXN0b20gY29tcG9uZW50cy4gSXMgdmFsaWRhdGVkIGFjY29yZGluZyB0byB0aGUgZGVmaW5pdGlvbiBvZiBhIExpbmtlclByZXNldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcbiAgICAgICAgdGhpcy5wYWdlcyA9IHt9O1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHt9O1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50X2NvbnN0cnVjdG9ycyA9IHt9O1xyXG4gICAgICAgIHRoaXMubW9kZWxzX2NvbnN0cnVjdG9ycyA9IHt9O1xyXG4gICAgICAgIHRoaXMucHJlc2V0cyA9IHByZXNldHM7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3VybCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3F1ZXJ5O1xyXG4gICAgICAgIHRoaXMuY3VycmVudF92aWV3ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpbmFsaXppbmdfcGFnZXMgPSBbXTtcclxuXHJcbiAgICAgICAgR0xPQkFMLmxpbmtlciA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICBUaGUgc3RhdGljIGZpZWxkIGluIHByZXNldHMgYXJlIGFsbCBDb21wb25lbnQtbGlrZSBvYmplY3RzIGNvbnRydWN0b3JzIHRoYXQgYXJlIGRlZmluZWQgYnkgdGhlIGNsaWVudFxyXG4gICAgICAgICAgdG8gYmUgdXNlZCBieSBXaWNrIGZvciBjdXN0b20gY29tcG9uZW50cy5cclxuXHJcbiAgICAgICAgICBUaGUgY29uc3RydWN0b3JzIG11c3Qgc3VwcG9ydCBzZXZlcmFsIENvbXBvbmVudCBiYXNlZCBtZXRob2RzIGluIG9yZGVyZWQgb3QgYmUgYWNjZXB0ZWQgZm9yIHVzZS4gVGhlc2UgbWV0aG9kZXMgaW5jbHVkZTpcclxuICAgICAgICAgICAgdHJhbnNpdGlvbkluXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25PdXRcclxuICAgICAgICAgICAgc2V0TW9kZWxcclxuICAgICAgICAgICAgdW5zZXRNb2RlbFxyXG4gICAgICAgICovXHJcbiAgICAgICAgaWYgKHByZXNldHMuc3RhdGljKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbXBvbmVudF9uYW1lIGluIHByZXNldHMuc3RhdGljKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHByZXNldHMuc3RhdGljW2NvbXBvbmVudF9uYW1lXTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgYSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgYiA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgYyA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgZCA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgZSA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKChhID0gKGNvbXBvbmVudC5wcm90b3R5cGUudHJhbnNpdGlvbkluICYmIGNvbXBvbmVudC5wcm90b3R5cGUudHJhbnNpdGlvbkluIGluc3RhbmNlb2YgRnVuY3Rpb24pKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChiID0gKGNvbXBvbmVudC5wcm90b3R5cGUudHJhbnNpdGlvbk91dCAmJiBjb21wb25lbnQucHJvdG90eXBlLnRyYW5zaXRpb25PdXQgaW5zdGFuY2VvZiBGdW5jdGlvbikpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGMgPSAoY29tcG9uZW50LnByb3RvdHlwZS5zZXRNb2RlbCAmJiBjb21wb25lbnQucHJvdG90eXBlLnNldE1vZGVsIGluc3RhbmNlb2YgRnVuY3Rpb24pKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChkID0gKGNvbXBvbmVudC5wcm90b3R5cGUudW5zZXRNb2RlbCAmJiBjb21wb25lbnQucHJvdG90eXBlLnVuc2V0TW9kZWwgaW5zdGFuY2VvZiBGdW5jdGlvbikpKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkU3RhdGljKGNvbXBvbmVudF9uYW1lLCBjb21wb25lbnQpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgU3RhdGljIGNvbXBvbmVudCAke2NvbXBvbmVudF9uYW1lfSBsYWNrcyBjb3JyZWN0IGNvbXBvbmVudCBtZXRob2RzLCBcXG5IYXMgdHJhbnNpdGlvbkluIGZ1bmN0aW9uOiR7YX1cXG5IYXMgdHJhbnNpdGlvbk91dCBmdW5jdG9uOiR7Yn1cXG5IYXMgc2V0IG1vZGVsIGZ1bmN0aW9uOiR7Y31cXG5IYXMgdW5zZXRNb2RlbCBmdW5jdGlvbjoke2R9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKiBUT0RPXHJcbiAgICAgICAgICAgIEBkZWZpbmUgUGFnZVBhcnNlclxyXG5cclxuICAgICAgICAgICAgQSBwYWdlIHBhcnNlciB3aWxsIHBhcnNlIHRlbXBsYXRlcyBiZWZvcmUgcGFzc2luZyB0aGF0IGRhdGEgdG8gdGhlIENhc2UgaGFuZGxlci5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGlmIChwcmVzZXRzLnBhcnNlcikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwYXJzZXJfbmFtZSBpbiBwcmVzZXRzLnBhZ2VfcGFyc2VyKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyc2VyID0gcHJlc2V0cy5wYWdlX3BhcnNlcltwYXJzZXJfbmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgICBTY2hlbWFzIHByb3ZpZGUgdGhlIGNvbnN0cnVjdG9ycyBmb3IgbW9kZWxzXHJcbiAgICAgICAgKi9cclxuICAgICAgICBpZiAocHJlc2V0cy5zY2hlbWFzKSB7XHJcblxyXG4gICAgICAgICAgICBwcmVzZXRzLnNjaGVtYXMuYW55ID0gQW55TW9kZWw7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHByZXNldHMuc2NoZW1hcyA9IHtcclxuICAgICAgICAgICAgICAgIGFueSA6IEFueU1vZGVsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgICAgTW9kYWxzIGFyZSB0aGUgZ2xvYmFsIG1vZGVscyB0aGF0IGNhbiBiZSBhY2Nlc3NlZCBieSBhbnkgQ2FzZVxyXG4gICAgICAgICovXHJcbiAgICAgICAgaWYgKHByZXNldHMubW9kZWxzKSB7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHByZXNldHMubW9kZWxzID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgIFRPRE8gVmFsaWRhdGUgdGhhdCBldmVyeSBzY2hhbWEgaXMgYSBNb2RlbCBjb25zdHJ1Y3RvclxyXG4gICAgICAgICovXHJcblxyXG4gICAgICAgIC8qICovXHJcbiAgICAgICAgdGhpcy5tb2RhbF9zdGFjayA9IFtdO1xyXG5cclxuICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZVVSTChkb2N1bWVudC5sb2NhdGlvbilcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAgICBUaGlzIGZ1bmN0aW9uIHdpbGwgcGFyc2UgYSBVUkwgYW5kIGRldGVybWluZSB3aGF0IFBhZ2UgbmVlZHMgdG8gYmUgbG9hZGVkIGludG8gdGhlIGN1cnJlbnQgdmlldy5cclxuICAgICovXHJcbiAgICBwYXJzZVVSTChsb2NhdGlvbikge1xyXG5cclxuICAgICAgICBsZXQgdXJsID0gbG9jYXRpb24ucGF0aG5hbWU7XHJcblxyXG4gICAgICAgIGxldCBJU19TQU1FX1BBR0UgPSAodGhpcy5jdXJyZW50X3VybCA9PSB1cmwpLFxyXG4gICAgICAgICAgICBwYWdlID0gbnVsbCxcclxuICAgICAgICAgICAgd3VybCA9IG5ldyBXVVJMKGxvY2F0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3VybCA9IHVybDtcclxuXHJcbiAgICAgICAgaWYgKChwYWdlID0gdGhpcy5wYWdlc1t1cmxdKSkge1xyXG4gICAgICAgICAgICBpZiAoSVNfU0FNRV9QQUdFKSB7XHJcbiAgICAgICAgICAgICAgICBVUkxfSE9TVC53dXJsID0gd3VybDtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFnZS50cmFuc2l0aW9uSW4oXHJcbiAgICAgICAgICAgICAgICAgICAgKHBhZ2UudHlwZSA9PSBcIm1vZGFsXCIpID8gZ2V0TW9kYWxDb250YWluZXIoKSA6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYXBwXCIpWzBdLCBcclxuICAgICAgICAgICAgICAgICAgICBudWxsLCB3dXJsLCBJU19TQU1FX1BBR0UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRQYWdlKHBhZ2UsIHd1cmwsIElTX1NBTUVfUEFHRSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobG9jYXRpb24pXHJcbiAgICAgICAgICAgIGZldGNoKGxvY2F0aW9uLmhyZWYsIHtcclxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIC8vIFNlbmRzIGNvb2tpZXMgYmFjayB0byBzZXJ2ZXIgd2l0aCByZXF1ZXN0XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnXHJcbiAgICAgICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAocmVzcG9uc2UudGV4dCgpLnRoZW4oKGh0bWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgRE9NID0gKG5ldyBET01QYXJzZXIoKSkucGFyc2VGcm9tU3RyaW5nKGh0bWwsIFwidGV4dC9odG1sXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkUGFnZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkTmV3UGFnZSh1cmwsIERPTSwgd3VybCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHd1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIElTX1NBTUVfUEFHRVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmFibGUgdG8gcHJvY2VzcyByZXNwb25zZSBmb3IgcmVxdWVzdCBtYWRlIHRvOiAke3RoaXMudXJsfS4gUmVzcG9uc2U6ICR7ZXJyb3J9LiBFcnJvciBSZWNlaXZlZDogJHtlcnJvcn1gKTtcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmaW5hbGl6ZVBhZ2VzKCkge1xyXG5cclxuICAgICAgICBpZih0aGlzLmFybWVkKXtcclxuICAgICAgICAgICAgbGV0IGEgPSB0aGlzLmFybWVkO1xyXG4gICAgICAgICAgLy8gIGEucC50cmFuc2l0aW9uSW4oYS5lLCB0aGlzLmN1cnJlbnRfdmlldywgYS53dXJsLCBhLlNQLCBhLnRlKTtcclxuICAgICAgICAgICAgdGhpcy5hcm1lZCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5maW5hbGl6aW5nX3BhZ2VzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmZpbmFsaXppbmdfcGFnZXNbaV07XHJcbiAgICAgICAgICAgIHBhZ2UuZmluYWxpemUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZmluYWxpemluZ19wYWdlcy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIExvYWRzIHBhZ2VzIGZyb20gc2VydmVyLCBvciBmcm9tIGxvY2FsIGNhY2hlLCBhbmQgc2VuZHMgaXQgdG8gdGhlIHBhZ2UgcGFyc2VyLlxyXG5cclxuICAgICAgQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSBVUkwgaWQgb2YgdGhlIGNhY2hlZCBwYWdlIHRvIGxvYWQuXHJcbiAgICAgIEBwYXJhbSB7c3RyaW5nfSBxdWVyeSAtXHJcbiAgICAgIEBwYXJhbSB7Qm9vbH0gSVNfU0FNRV9QQUdFIC1cclxuICAgICovXHJcbiAgICBsb2FkUGFnZShwYWdlLCB3dXJsID0gbmV3IFdVUkwoZG9jdW1lbnQubG9jYXRpb24pLCBJU19TQU1FX1BBR0UpIHtcclxuXHJcblxyXG4gICAgICAgIFVSTF9IT1NULnd1cmwgPSB3dXJsO1xyXG5cclxuICAgICAgICBsZXQgdHJhbnNpdGlvbl9sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICBsZXQgYXBwX2VsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYXBwXCIpWzBdO1xyXG5cclxuICAgICAgICAvL0ZpbmFsaXplIGFueSBleGlzdGluZyBwYWdlIHRyYW5zaXRpb25zO1xyXG4gICAgICAgIC8vIHRoaXMuZmluYWxpemVQYWdlcygpO1xyXG5cclxuICAgICAgICBsZXQgdHJhbnNpdGlvbl9lbGVtZW50cyA9IHt9O1xyXG5cclxuICAgICAgICBpZiAocGFnZS50eXBlID09IFwibW9kYWxcIikge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy90cmFjZSBtb2RhbCBzdGFjayBhbmQgc2VlIGlmIHRoZSBtb2RhbCBhbHJlYWR5IGV4aXN0c1xyXG4gICAgICAgICAgICBpZiAoSVNfU0FNRV9QQUdFKSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlLnRyYW5zaXRpb25JbigpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBVTldJTkQgPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLm1vZGFsX3N0YWNrLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1vZGFsID0gdGhpcy5tb2RhbF9zdGFja1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoVU5XSU5EID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobW9kYWwgPT0gcGFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBVTldJTkQgPSBpICsgMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0cnMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsLnVubG9hZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHJzID0gbW9kYWwudHJhbnNpdGlvbk91dCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25fbGVuZ3RoID0gTWF0aC5tYXgodHJzLCB0cmFuc2l0aW9uX2xlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluYWxpemluZ19wYWdlcy5wdXNoKG1vZGFsKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsLmZpbmFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChVTldJTkQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsX3N0YWNrLmxlbmd0aCA9IFVOV0lORDtcclxuICAgICAgICAgICAgICAgIHBhZ2UubG9hZChnZXRNb2RhbENvbnRhaW5lcigpLCB3dXJsKTtcclxuICAgICAgICAgICAgICAgIHBhZ2UudHJhbnNpdGlvbkluKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvL2NyZWF0ZSBuZXcgbW9kYWxcclxuICAgICAgICAgICAgICAgIHRoaXMubW9kYWxfc3RhY2sucHVzaChwYWdlKTtcclxuICAgICAgICAgICAgICAgIHBhZ2UubG9hZChnZXRNb2RhbENvbnRhaW5lcigpLCB3dXJsKTtcclxuICAgICAgICAgICAgICAgIHBhZ2UudHJhbnNpdGlvbkluKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5tb2RhbF9zdGFjay5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBtb2RhbCA9IHRoaXMubW9kYWxfc3RhY2tbaV07XHJcbiAgICAgICAgICAgICAgICBsZXQgdHJzID0gMDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbW9kYWwudW5sb2FkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRycyA9IG1vZGFsLnRyYW5zaXRpb25PdXQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25fbGVuZ3RoID0gTWF0aC5tYXgodHJzLCB0cmFuc2l0aW9uX2xlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbGl6aW5nX3BhZ2VzLnB1c2gobW9kYWwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsLmZpbmFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5tb2RhbF9zdGFjay5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICAgICAgbGV0IHRycyA9IDA7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudF92aWV3ICYmIHRoaXMuY3VycmVudF92aWV3ICE9IHBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudF92aWV3LnVubG9hZCh0cmFuc2l0aW9uX2VsZW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcGFnZS5sb2FkKGFwcF9lbGUsIHd1cmwpO1xyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCB0ID0gdGhpcy5jdXJyZW50X3ZpZXcudHJhbnNpdGlvbk91dCgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZS50cmFuc2l0aW9uSW4odHJhbnNpdGlvbl9lbGVtZW50cylcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbl9sZW5ndGggPSBNYXRoLm1heCh0LCB0cmFuc2l0aW9uX2xlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuZmluYWxpemluZ19wYWdlcy5wdXNoKHRoaXMuY3VycmVudF92aWV3KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmKCF0aGlzLmN1cnJlbnRfdmlldyl7XHJcbiAgICAgICAgICAgICAgICBwYWdlLmxvYWQoYXBwX2VsZSwgd3VybCk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2UudHJhbnNpdGlvbkluKHRyYW5zaXRpb25fZWxlbWVudHMpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfdmlldyA9IHBhZ2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5maW5hbGl6ZVBhZ2VzKCk7XHJcbiAgICAgICAgfSwgKHRyYW5zaXRpb25fbGVuZ3RoKjEwMDApICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUHJlLWxvYWRzIGEgY3VzdG9tIGNvbnN0cnVjdG9yIGZvciBhbiBlbGVtZW50IHdpdGggdGhlIHNwZWNpZmllZCBpZCBhbmQgcHJvdmlkZXMgYSBtb2RlbCB0byB0aGF0IGNvbnN0cnVjdG9yIHdoZW4gaXQgaXMgY2FsbGVkLlxyXG4gICAgICAgIFRoZSBjb25zdHJ1Y3RvciBtdXN0IGhhdmUgQ29tcG9uZW50IGluIGl0cyBpbmhlcml0YW5jZSBjaGFpbi5cclxuICAgICovXHJcbiAgICBhZGRTdGF0aWMoZWxlbWVudF9pZCwgY29uc3RydWN0b3IsIG1vZGVsKSB7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRfY29uc3RydWN0b3JzW2VsZW1lbnRfaWRdID0ge1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcixcclxuICAgICAgICAgICAgbW9kZWxfbmFtZTogbW9kZWxcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhZGRNb2RlbChtb2RlbF9uYW1lLCBtb2RlbENvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5tb2RlbHNfY29uc3RydWN0b3JzW21vZGVsX25hbWVdID0gbW9kZWxDb25zdHJ1Y3RvcjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICAgIENyZWF0ZXMgYSBuZXcgaWZyYW1lIG9iamVjdCB0aGF0IGFjdHMgYXMgYSBtb2RhbCB0aGF0IHdpbGwgc2l0IG9udG9wIG9mIGV2ZXJ5dGhpbmcgZWxzZS5cclxuICAgICovXHJcbiAgICBsb2FkTm9uV2lja1BhZ2UoVVJMKSB7XHJcbiAgICAgICAgbGV0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7XHJcbiAgICAgICAgaWZyYW1lLnNyYyA9IFVSTDtcclxuICAgICAgICBpZnJhbWUuY2xhc3NMaXN0LmFkZChcIm1vZGFsXCIsIFwiY29tcF93cmFwXCIpO1xyXG4gICAgICAgIHZhciBwYWdlID0gbmV3IFBhZ2VWaWV3KFVSTCwgaWZyYW1lKTtcclxuICAgICAgICBwYWdlLnR5cGUgPSBcIm1vZGFsXCI7XHJcbiAgICAgICAgdGhpcy5wYWdlc1tVUkxdID0gcGFnZSAvL25ldyBNb2RhbChwYWdlLCBpZnJhbWUsIGdldE1vZGFsQ29udGFpbmVyKCkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2VzW1VSTF07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAgICBUYWtlcyB0aGUgRE9NIG9mIGFub3RoZXIgcGFnZSBhbmQgc3RyaXBzIGl0LCBsb29raW5nIGZvciBjb21wb25lbnQgYW5kIGFwcCBlbGVtZW50cyB0byB1c2UgdG8gaW50ZWdyYXRlIGludG8gdGhlIFNQQSBzeXN0ZW0uXHJcbiAgICAgICAgSWYgaXQgaXMgdW5hYmxlIHRvIGZpbmQgdGhlc2UgZWxlbWVudHMsIHRoZW4gaXQgd2lsbCBwYXNzIHRoZSBET00gdG8gbG9hZE5vbldpY2tQYWdlIHRvIGhhbmRsZSB3cmFwcGluZyB0aGUgcGFnZSBib2R5IGludG8gYSB3aWNrIGFwcCBlbGVtZW50LlxyXG4gICAgKi9cclxuICAgIGxvYWROZXdQYWdlKFVSTCwgRE9NLCB3dXJsKSB7XHJcbiAgICAgICAgLy9sb29rIGZvciB0aGUgYXBwIHNlY3Rpb24uXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgICBJZiB0aGUgcGFnZSBzaG91bGQgbm90IGJlIHJldXNlZCwgYXMgaW4gY2FzZXMgd2hlcmUgdGhlIHNlcnZlciBkb2VzIGFsbCB0aGUgcmVuZGVyaW5nIGZvciBhIGR5bmFtaWMgcGFnZSBhbmQgd2UncmUganVzdCBwcmVzZW50aW5nIHRoZSByZXN1bHRzLFxyXG4gICAgICAgICAgICB0aGVuIGhhdmluZyBOT19CVUZGRVIgc2V0IHRvIHRydWUgd2lsbCBjYXVzZSB0aGUgbGlua2VyIHRvIG5vdCBzYXZlIHRoZSBwYWdlIHRvIHRoZSBoYXNodGFibGUgb2YgZXhpc3RpbmcgcGFnZXMsIGZvcmNpbmcgYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgZXZlcnkgdGltZSB0aGUgcGFnZSBpcyB2aXNpdGVkLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgbGV0IE5PX0JVRkZFUiA9IGZhbHNlO1xyXG5cclxuXHJcbiAgICAgICAgLyogXHJcbiAgICAgICAgICAgIEFwcCBlbGVtZW50czogVGhlcmUgc2hvdWxkIG9ubHkgYmUgb25lLiBcclxuICAgICAgICAqL1xyXG4gICAgICAgIGxldCBhcHBfbGlzdCA9IERPTS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFwcFwiKTtcclxuXHJcbiAgICAgICAgaWYgKGFwcF9saXN0Lmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBXaWNrIGlzIGRlc2lnbmVkIHRvIHdvcmsgd2l0aCBqdXN0IG9uZSA8YXBwPiBlbGVtZW50IGluIGEgcGFnZS4gVGhlcmUgYXJlICR7YXBwX2xpc3QubGVuZ3RofSBhcHBzIGVsZW1lbnRzIGluICR7dXJsfS4gV2ljayB3aWxsIHByb2NlZWQgd2l0aCB0aGUgZmlyc3QgPGFwcD4gZWxlbWVudCBpbiB0aGUgRE9NLiBVbmV4cGVjdGVkIGJlaGF2aW9yIG1heSBvY2N1ci5gKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGFwcF9zb3VyY2UgPSBhcHBfbGlzdFswXVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgIElmIHRoZXJlIGlzIG5vIDxhcHA+IGVsZW1lbnQgd2l0aGluIHRoZSBET00sIHRoZW4gd2UgbXVzdCBoYW5kbGUgdGhpcyBjYXNlIGNhcmVmdWxseS4gVGhpcyBsaWtlbHkgaW5kaWNhdGVzIGEgcGFnZSBkZWxpdmVyZWQgZnJvbSB0aGUgc2FtZSBvcmlnaW4gdGhhdCBoYXMgbm90IGJlZW4gY29udmVydGVkIHRvIHdvcmsgd2l0aCB0aGUgV2ljayBzeXN0ZW0uXHJcbiAgICAgICAgICBUaGUgZW50aXJlIGNvbnRlbnRzIG9mIHRoZSBwYWdlIGNhbiBiZSB3cmFwcGVkIGludG8gYSA8aWZyYW1lPiwgdGhhdCB3aWxsIGJlIGNvdWxkIHNldCBhcyBhIG1vZGFsIG9uIHRvcCBvZiBleGlzdGluZyBwYWdlcy5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGlmICghYXBwX3NvdXJjZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLnRyYWNlKFwiUGFnZSBkb2VzIG5vdCBoYXZlIGFuIDxhcHA+IGVsZW1lbnQhXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkTm9uV2lja1BhZ2UoVVJMKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBhcHBfcGFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhcHBwYWdlXCIpO1xyXG4gICAgICAgIGFwcF9wYWdlLmlubmVySFRNTCA9IGFwcF9zb3VyY2UuaW5uZXJIVE1MO1xyXG5cclxuICAgICAgICB2YXIgYXBwID0gYXBwX3NvdXJjZS5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgZG9tX2FwcCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYXBwXCIpWzBdO1xyXG5cclxuICAgICAgICB2YXIgcGFnZSA9IG5ldyBQYWdlVmlldyhVUkwsIGFwcF9wYWdlKTtcclxuICAgICAgICBpZiAoYXBwX3NvdXJjZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGFwcF9zb3VyY2UuZGF0YXNldC5tb2RhbCA9PSBcInRydWVcIikge1xyXG4gICAgICAgICAgICAgICAgcGFnZS5zZXRUeXBlKFwibW9kYWxcIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibW9kYWxcIik7XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5pbm5lckhUTUwgPSBhcHAuaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICAgICAgYXBwLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBhcHAgPSBtb2RhbDtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgIElmIHRoZSBET00gaXMgdGhlIHNhbWUgZWxlbWVudCBhcyB0aGUgYWN0dWFsIGRvY3VtZW50LCB0aGVuIHdlIHNoYWxsIHJlYnVpbGQgdGhlIGV4aXN0aW5nIDxhcHA+IGVsZW1lbnQsIGNsZWFyaW5nIGl0IG9mIGl0J3MgY29udGVudHMuXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKERPTSA9PSBkb2N1bWVudCAmJiBkb21fYXBwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld19hcHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXBwXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVwbGFjZUNoaWxkKG5ld19hcHAsIGRvbV9hcHApO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbV9hcHAgPSBuZXdfYXBwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoYXBwLmRhdGFzZXQubm9fYnVmZmVyID09IFwidHJ1ZVwiKVxyXG4gICAgICAgICAgICAgICAgTk9fQlVGRkVSID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGFwcF9wYWdlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZWxlbWVudFwiKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZWxlID0gZWxlbWVudHNbaV0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXF1aXZpbGFudF9lbGVtZW50X2Zyb21fbWFpbl9kb20gPSBlbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lja19lbGVtZW50O1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudF9pZCA9IGVsZS5pZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGFnZS50eXBlICE9PSBcIm1vZGFsXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2lja19lbGVtZW50ID0gbmV3IEVsZW1lbnQoZWxlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IGVsZS5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZWxlX3dyYXBcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpY2tfZWxlbWVudCA9IG5ldyBFbGVtZW50KGVsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcGFnZS5lbGVtZW50cy5wdXNoKHdpY2tfZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbXBvbmVudHNbZWxlbWVudF9pZF0pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzW2VsZW1lbnRfaWRdID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgd2lja19lbGVtZW50LnNldENvbXBvbmVudHModGhpcy5jb21wb25lbnRzW2VsZW1lbnRfaWRdLCB0aGlzLm1vZGVsc19jb25zdHJ1Y3RvcnMsIHRoaXMuY29tcG9uZW50X2NvbnN0cnVjdG9ycywgdGhpcy5wcmVzZXRzLCBET00sIHd1cmwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQgPT0gRE9NKVxyXG4gICAgICAgICAgICAgICAgZG9tX2FwcC5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHBhZ2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoIU5PX0JVRkZFUikgdGhpcy5wYWdlc1tVUkxdID0gcmVzdWx0O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgTGlua2VyLFxyXG4gICAgVVJMXHJcbn0iLCIvKipcclxuXHRMaWdodCBpdCB1cCFcclxuKi9cclxuaW1wb3J0IHtcclxuICAgIFdVUkxcclxufSBmcm9tIFwiLi9saW5rZXIvd3VybFwiXHJcbmltcG9ydCB7XHJcbiAgICBWaWV3XHJcbn0gZnJvbSBcIi4vdmlld1wiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQW55TW9kZWwsXHJcbiAgICBBcnJheU1vZGVsQ29udGFpbmVyLFxyXG4gICAgQlRyZWVNb2RlbENvbnRhaW5lcixcclxuICAgIE11bHRpSW5kZXhlZENvbnRhaW5lcixcclxuICAgIE1vZGVsLFxyXG4gICAgTW9kZWxDb250YWluZXJcclxufSBmcm9tIFwiLi9tb2RlbC9tb2RlbFwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQ29udHJvbGxlclxyXG59IGZyb20gXCIuL2NvbnRyb2xsZXJcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIEdldHRlclxyXG59IGZyb20gXCIuL2dldHRlclwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgU2V0dGVyXHJcbn0gZnJvbSBcIi4vc2V0dGVyXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBMaW5rZXIsXHJcbiAgICBVUkxcclxufSBmcm9tIFwiLi9saW5rZXIvbGlua2VyXCJcclxuXHJcbmltcG9ydCAqIGFzIEFuaW1hdGlvbiBmcm9tIFwiLi9hbmltYXRpb24vYW5pbWF0aW9uXCJcclxuXHJcbmltcG9ydCAqIGFzIENvbW1vbiBmcm9tIFwiLi9jb21tb25cIlxyXG5cclxubGV0IHdpY2tfdmFuaXR5ID0gXCJcXCBcXChcXCBcXCBcXChcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXClcXG5cXCBcXClcXFxcXFwpXFwpXFwoXFwgXFwgXFwgXFwnXFwgXFwoXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwoXFwgXFwvXFwoXFxuXFwoXFwoXFxfXFwpXFwoXFwpXFxcXFxcIFxcKVxcIFxcIFxcKVxcXFxcXCBcXCBcXCBcXCBcXChcXCBcXCBcXCBcXCBcXClcXFxcXFwoXFwpXFwpXFxuXFxfXFwoXFwoXFwpXFwpXFxcXFxcX1xcKVxcKFxcKVxcKFxcKFxcX1xcKVxcIFxcIFxcIFxcKVxcXFxcXCBcXCBcXChcXChcXF9cXClcXFxcXFxuXFxcXFxcIFxcXFxcXChcXChcXF9cXClcXC9cXCBcXC9cXCBcXChcXF9cXClcXCBcXCBcXChcXChcXF9cXClcXCBcXHxcXCBcXHxcXChcXF9cXClcXG5cXCBcXFxcXFwgXFxcXFxcL1xcXFxcXC9cXCBcXC9cXCBcXCBcXHxcXCBcXHxcXCBcXC9cXCBcXF9cXHxcXCBcXCBcXHxcXCBcXC9cXCBcXC9cXG5cXCBcXCBcXFxcXFxfXFwvXFxcXFxcX1xcL1xcIFxcIFxcIFxcfFxcX1xcfFxcIFxcXFxcXF9cXF9cXHxcXCBcXCBcXHxcXF9cXFxcXFxfXFxcXFxcblwiO1xyXG5cclxuaW1wb3J0IHtcclxuICAgIEN1c3RvbUNhc2VcclxufSBmcm9tIFwiLi9jYXNlL2Nhc2VcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIFJpdmV0XHJcbn0gZnJvbSBcIi4vY2FzZS9yaXZldFwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQ2FzZUNvbnN0cnVjdG9yXHJcbn0gZnJvbSBcIi4vY2FzZS9jYXNlX2NvbnN0cnVjdG9yXCJcclxuXHJcbmltcG9ydHtcclxuICAgIEZpbHRlclxyXG59IGZyb20gXCIuL2Nhc2UvY2Fzc2V0dGUvZmlsdGVyXCJcclxuXHJcbmltcG9ydHtcclxuICAgIEZvcm1cclxufSBmcm9tIFwiLi9jYXNlL2Nhc3NldHRlL2Zvcm1cIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIENhc3NldHRlXHJcbn0gZnJvbSBcIi4vY2FzZS9jYXNzZXR0ZS9jYXNzZXR0ZVwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgU2NoZW1hVHlwZSxcclxuICAgIHNjaGVtYVxyXG59IGZyb20gXCIuL3NjaGVtYS9zY2hlbWFzXCJcclxuXHJcbmxldCBMSU5LRVJfTE9BREVEID0gZmFsc2U7XHJcbmxldCBERUJVR0dFUiA9IHRydWU7XHJcblxyXG4vKipcclxuICogICAgQ3JlYXRlcyBhIG5ldyB7TGlua2VyfSBpbnN0YW5jZSwgcGFzc2luZyBhbnkgcHJlc2V0cyBmcm9tIHRoZSBjbGllbnQuXHJcbiAqICAgIEl0IHdpbGwgdGhlbiB3YWl0IGZvciB0aGUgZG9jdW1lbnQgdG8gbG9hZCwgYW5kIG9uY2UgbG9hZGVkLCB3aWxsIHN0YXJ0IHRoZSBsaW5rZXIgYW5kIGxvYWQgdGhlIGN1cnJlbnQgcGFnZSBpbnRvIHRoZSBsaW5rZXIuXHJcbiAqXHJcbiAqICAgIE5vdGU6IFRoaXMgZnVuY3Rpb24gc2hvdWxkIG9ubHkgYmUgY2FsbGVkIG9uY2UuIEFueSBzdWJzZXF1ZW50IGNhbGxzIHdpbGwgbm90IGRvIGFueXRoaW5nLlxyXG4gKlxyXG4gKiAgICBAcGFyYW0ge0xpbmtlclByZXNldHN9IHByZXNldHMgLSBBbiBvYmplY3Qgb2YgdXNlciBkZWZpbmVkIFdpY2sgb2JqZWN0cy5cclxuICovXHJcblxyXG5mdW5jdGlvbiBsaWdodChwcmVzZXRzKSB7XHJcbiAgICBpZiAoREVCVUdHRVIpIGNvbnNvbGUubG9nKHByZXNldHMpXHJcblxyXG4gICAgaWYgKExJTktFUl9MT0FERUQpIHJldHVybjtcclxuXHJcbiAgICBMSU5LRVJfTE9BREVEID0gdHJ1ZTtcclxuXHJcbiAgICAvL1Bhc3MgaW4gdGhlIHByZXNldHMgb3IgYSBwbGFpbiBvYmplY3QgaWYgcHJlc2V0cyBpcyB1bmRlZmluZWQuXHJcblxyXG4gICAgbGV0IGxpbmsgPSBuZXcgTGlua2VyKHByZXNldHMgfHwge30pO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XHJcbiAgICAgICAgbGluay5sb2FkUGFnZShcclxuICAgICAgICAgICAgbGluay5sb2FkTmV3UGFnZShkb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZSwgZG9jdW1lbnQpLFxyXG4gICAgICAgICAgICBuZXcgV1VSTChkb2N1bWVudC5sb2NhdGlvbiksXHJcbiAgICAgICAgICAgIGZhbHNlXHJcbiAgICAgICAgKTtcclxuICAgIH0pXHJcblxyXG4gICAgY29uc29sZS5sb2coYCR7d2lja192YW5pdHl9Q29weXJpZ2h0IDIwMTggQW50aG9ueSBDIFdlYXRoZXJzYnlcXG5odHRwczovL2dpdGxhYi5jb20vYW50aG9ueWN3ZWF0aGVyc2J5L3dpY2tgKVxyXG59XHJcblxyXG4vKioqIEV4cG9ydHMgKioqL1xyXG5cclxuZXhwb3J0IHtcclxuICAgIFVSTCxcclxuICAgIEFuaW1hdGlvbixcclxuICAgIEFycmF5TW9kZWxDb250YWluZXIsXHJcbiAgICBCVHJlZU1vZGVsQ29udGFpbmVyLFxyXG4gICAgTXVsdGlJbmRleGVkQ29udGFpbmVyLFxyXG4gICAgQ29udHJvbGxlcixcclxuICAgIEN1c3RvbUNhc2UsXHJcbiAgICBSaXZldCxcclxuICAgIENhc2VDb25zdHJ1Y3RvcixcclxuICAgIENhc3NldHRlLFxyXG4gICAgRm9ybSxcclxuICAgIEZpbHRlcixcclxuICAgIENvbW1vbixcclxuICAgIEdldHRlcixcclxuICAgIExpbmtlcixcclxuICAgIE1vZGVsLFxyXG4gICAgQW55TW9kZWwsXHJcbiAgICBNb2RlbENvbnRhaW5lcixcclxuICAgIFNldHRlcixcclxuICAgIFZpZXcsXHJcbiAgICBsaWdodCxcclxuICAgIFNjaGVtYVR5cGUsXHJcbiAgICBzY2hlbWFcclxufSJdLCJuYW1lcyI6WyJzY2hlbWEiLCJDYXNlIiwiQVNULlJvb3QiLCJBU1QuVGFwTm9kZSIsIkFTVC5GaWx0ZXJOb2RlIiwiQVNULlRlcm1Ob2RlIiwiQVNULkNhc2VOb2RlIiwiQVNULlBpcGVOb2RlIiwiQVNULkdlbmVyaWNOb2RlIiwiRWxlbWVudCJdLCJtYXBwaW5ncyI6Ijs7O0lBQUEsSUFBSSxVQUFVLEdBQUc7SUFDakIsSUFBSSxJQUFJLEVBQUUsRUFBRTtJQUNaLElBQUksSUFBSSxFQUFFLEVBQUU7SUFDWixDQUFDLENBQUM7O0lBRUYsTUFBTSxLQUFLLENBQUM7SUFDWixJQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUU7SUFDM0IsUUFBUSxJQUFJLENBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQzs7SUFFNUIsUUFBUSxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7SUFFdEMsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7SUFFekIsUUFBUSxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssVUFBVSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLGFBQWEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsRUFBRTtJQUNySSxZQUFZLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN4QyxTQUFTO0lBQ1QsS0FBSzs7SUFFTCxJQUFJLEtBQUssRUFBRTtJQUNYLFFBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN4QixRQUFRLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJ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QUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RixZQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRW5ELFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0lBRXJELFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN0QyxZQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7O0lBRXZDLFlBQVksT0FBTyxLQUFLLENBQUM7SUFDekIsU0FBUztJQUNUO0lBQ0EsUUFBUSxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLEVBQUU7O0lBRW5ELFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzNFLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUU1QyxZQUFZLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwQyxZQUFZLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7SUFFckMs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QUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxPQUFPLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3BILENBQUM7O0lDTkQsTUFBTSxPQUFPLFNBQVMsWUFBWTtJQUNsQztJQUNBLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbkIsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFDOztJQUVWLEVBQUUsSUFBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRTtJQUM3QixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixHQUFHLE9BQU87SUFDVixHQUFHOztJQUVILEVBQUUsSUFBSSxDQUFDLFlBQVksS0FBSyxFQUFFO0lBQzFCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEIsR0FBRztJQUNILEVBQUU7O0lBRUYsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakIsRUFBRSxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbEIsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFD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LElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLFFBQVEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUM7SUFDcEMsUUFBUSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7SUFDbEMsUUFBUSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7O0lBRWxDLFFBQVEsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztJQUMzQixLQUFLOztJQUVMLElBQUksTUFBTSxHQUFHO0lBQ2IsUUFBUSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7O0lBRW5DLFFBQVEsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLFFBQVEsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLFFBQVEsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLFFBQVEsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLFFBQVEsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLFFBQVEsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUUxQixRQUFRLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDakMsUUFBUSxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLFFBQVEsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQy9CLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDOztJQUV2QixRQUFRLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDakMsUUFBUSxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLFFBQVEsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQy9CLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDOztJQUV2QixRQUFRLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUM1QixRQUFRLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQzs7SUFFNUIsUUFBUSxPQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO0lBQzNCLEtBQUs7O0lBRUwsSUFBSSxXQUFXLEdBQUc7SUFDbEIsUUFBUSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsUUFBUSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsUUFBUSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsUUFBUSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsUUFBUSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsUUFBUSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsUUFBUSxJQUFJLEtBQUssR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0MsUUFBUSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUks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Q25CLEdBQUcsT0FBTztJQUNWLEdBQUc7SUFDSCxFQUFFOztJQUVGLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDO0lBQ3hCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDO0lBQ3hCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDO0lBQ3hCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDO0lBQ3hCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDO0lBQ3hCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDO0lBQ3hCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDO0lBQ3hCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDOztJQUV4QixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNiLEVBQUUsT0FBTyxJQUFJLE1BQU07SUFDbkIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNkLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDZCxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2QsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNkLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDZCxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2QsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNkLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDZCxHQUFHO0lBQ0gsRUFBRTs7SUFFRixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDUixFQUFFLE9BQU8sS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RCxFQUFFOztJQUVGLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNSLEVBQUUsT0FBTyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RELEVBQUU7O0lBRUYsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0lBQ1YsRUFBRSxPQUFPLElBQUksT0FBTztJQUNwQixHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsR0FBRztJQUNILEVBQUU7SUFDRjtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7O0lBRUEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3BCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUN0QyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7SUFDckMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO0lBQzdCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7O0lBRWQsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO0lBQzdCLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFO0lBQ2hELEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2IsR0FBRyxZQUFZLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQzs7SUFFekM7SUFDQSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQzs7SUFFbEM7SUFDQSxFQUFFLElBQUksWUFBWSxHQUFHLENBQUMsRUFBRTtJQUN4QixHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDbkIsSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO0lBQzFCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQixJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN4QyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3RCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDdEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUNsQixHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLEdBQUcsS0FBSyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hELEdBQUcsS0FBSyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hELEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO0lBQy9CLEdBQUc7O0lBRUg7SUFDQSxFQUFFLElBQUksWUFBWSxLQUFLLENBQUMsRUFBRTtJQUMxQixHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixHQUFHLEtBQUssR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7SUFDeEIsR0FBRzs7SUFFSDtJQUNBLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzlCLEVBQUUsRUFBRSxHQUFHLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekIsRUFBRSxFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN6QixFQUFFLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2hCLEVBQUU7O0lBRUYsQ0FBQyxNQUFNLEdBQUc7SUFDVixFQUFFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEQsRUFBRTs7SUFFRixDQUFDLE1BQU0sR0FBRztJQUNWLEVBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRCxFQUFFO0lBQ0Y7SUFDQSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDWCxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQzVFLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzdDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ25ELEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxJQUFJLEVBQUU7SUFDbEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtJQUMxQixHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTtJQUNkLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7SUFDM0IsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUU7SUFDZCxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDcEQsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUc7SUFDZixHQUFHLFlBQVksR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDOztJQUV6QztJQUNBLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQzs7SUFFbkI7O0lBRUE7SUFDQSxFQUFFLElBQUksWUFBWSxHQUFHLENBQUMsRUFBRTtJQUN4QixHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDbkIsSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO0lBQzFCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQixJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN4QyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3RCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDdEIsSUFB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LElBQUksQ0FBQyxFQUFFO0lBQ1IsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQixFQUFFOztJQUVGLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1QsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsRUFBRTs7SUFFRixDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ1IsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQixFQUFFOztJQUVGLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1QsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsRUFBRTs7SUFFRixDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ1IsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQixFQUFFOztJQUVGLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1QsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsRUFBRTs7SUFFRixDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ1IsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQixFQUFFOztJQUVGLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1QsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsRUFBRTs7SUFFRixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDWCxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNuQixFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNuQixFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNuQixFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJ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LEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUM5QixFQUFFLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUM5QixFQUFFLFNBQVMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNqQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNqQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNsQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNoQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixFQUFFLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMvQixFQUFFLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM3QixFQUFFLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNoQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUM5QixFQUFFLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUM1QixFQUFFLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixFQUFFLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUMvQixFQUFFLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNuQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNqQyxFQUFFLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixFQUFFLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNoQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUNoQyxFQUFFLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNwQyxFQUFFLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN2QyxFQUFFLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN2QyxFQUFFLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNsQyxFQUFFLGNBQWMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN4QyxFQUFFLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuQyxFQUFFLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNyQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENB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QVksRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNyQyxFQUFFLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNyQyxFQUFFLGtCQUFrQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQzVDLEVBQUUsZUFBZSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3ZDLEVBQUUsYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3RDLEVBQUUsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3RDLEVBQUUsVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3BDLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDMUMsRUFBRSxlQUFlLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDdkMsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDNUIsRUFBRSxXQUFXLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDakMsRUFBRSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDbkMsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDNUIsRUFBRSxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcs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RyxDQUFDO0lBQzNDLEVBQUUsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2pDLEVBQUUsV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3JDLEVBQUUsZUFBZSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3pDLEVBQUUseUJBQXlCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDbkQsRUFBRSxjQUFjLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDeEMsRUFBRSxjQUFjLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDdEMsRUFBRSxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDaEMsRUFBRSxXQUFXLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7SUFDcEMsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7SUFDL0IsRUFBRSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7SUFDdEMsRUFBRSxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDdEMsRUFBRSxLQUFLLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDL0IsRUFBRSxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDdEMsRUFBRSxVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDcEMsRUFBRSxjQUFjLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDeEMsRUFBRSxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDdEMsRUFBRSxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDdEMsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUMxQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNqQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNwQyxFQUFFLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN2QyxFQUFFLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNyQyxFQUFFLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN0QyxFQUFFLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN0QyxFQUFFLGtCQUFrQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQzVDLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDNUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDcEMsRUFBRSxjQUFjLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDeEMsRUFBRSxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDdEMsRUFBRSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDdkMsRUFBRSxVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDcEMsRUFBRSxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDakMsRUFBRSxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDakMsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDaEMsRUFBRSxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsRUFBRSxVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDcEMsRUFBRSxVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDcEMsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDaEMsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDaEMsRUFBRSxXQUFXLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDckMsRUFBRSxXQUFXLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFD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QyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3ZHLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztJQUMzRyxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO0lBQ3JHLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUM7SUFDekcsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7O0lBRXJILFFBQVEsUUFBUSxDQUFDLEdBQUcsU0FBUyxFQUFFO0lBQy9CLEtBQUs7O0lBRUws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QUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQzlCLFFBQVEsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDNUIsUUFBUSxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUMxQixRQUFRLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLEtBQUs7O0lBRUwsSUFBSSxVQUFVLEdBQUc7O0lBRWpCLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7O0lBRTNCLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUTtJQUN6QixZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7O0lBRXZDLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQzdELFlBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQzs7SUFFM0MsUUFBUSxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDM0IsS0FBSzs7SUFFTDtJQUNBO0lBQ0E7SUFDQSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7SUFDaEIsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO0lBQzNCO0lBQ0EsWUFBWSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNwQyxZQUFZLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0MsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRXpDLFlBQVksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDdkQsZ0JB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
