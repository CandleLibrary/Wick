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

                if (t > 0)
                    setTimeout(() => { this.destructor(); }, t * 1000 + 5);


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

            if (!element)
                element = this.element.cloneNode(true);

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

            if (this.transitioneer)
                this.transitioneer.finalize_out(this.element);

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

            if (this.transitioneer)
                transition_time = Math.max(transition_time, this.transitioneer.set_in(this.element, this.data, index));

            return transition_time;
        }

        /**
            Takes as an input a list of transition objects that can be used
        */
        transitionOut(index = 0, DESTROY = false) {

            let transition_time = 0;

            this.LOADED = false;

            if (this.transitioneer)
                transition_time = Math.max(transition_time, this.transitioneer.set_out(this.element, this.data, index));

            for (let i = 0, l = this.children.length; i < l; i++)
                transition_time = Math.max(transition_time, this.children[i].transitionOut(index));

            if (DESTROY)
                setTimeout(() => { this.finalizeTransitionOut();
                    this.destructor(); }, transition_time * 1000);

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

            for (let i = 0, l = this.children.length; i < l; i++)
                this.children[i].__down__(data, changed_properties, IMPORTED);
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

            if (data)
                this.__up__(data);
        }

        __update__(data, FROM_PARENT = false) {

            let r_data = this.update(data, FROM_PARENT);

            for (let i = 0, l = this.children.length; i < l; i++)
                this.children[i].__update__(r_data || data, true);
        }

        load(model) {
            for (var i = 0; i < this.children.length; i++)
                this.children[i].load(model);
        }

        hide() {

            if (this.element) {

                this.display = this.element.style.display;
                this.element.style.display = "none";
            }
        }

        show() {

            if (this.element)
                if (this.element.style.display == "none")
                    this.element.style.display = this.display;
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
                    if (model.constructor != this.schema) ;else
                        this.schema = null;
                    
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
            } else 
                throw new Error(`No Model could be found for Case constructor! Case schema "${this.data.schema}", "${this.presets.schemas[this.data.schema]}"; Case model "${this.data.model}", "${this.presets.models[this.data.model]}";`);

            for (var i = 0; i < this.children.length; i++) 
                this.children[i].load(this.model);
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
            for (let comp_name in this.named_elements) 
                named_elements[comp_name] = this.named_elements[comp_name];
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
                        if (data[this.prop] !== undefined)
                            return { value: data[this.prop] }

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
    		console.log(data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ljay1kZXYuanMiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9jb21tb24vc3RyaW5nX3BhcnNpbmcvbGV4ZXIuanMiLCIuLi9zb3VyY2UvY29tbW9uL3N0cmluZ19wYXJzaW5nL3Rva2VuaXplci5qcyIsIi4uL3NvdXJjZS9jb21tb24vdXJsL3VybC5qcyIsIi4uL3NvdXJjZS9saW5rZXIvd3VybC5qcyIsIi4uL3NvdXJjZS92aWV3LmpzIiwiLi4vc291cmNlL3NjaGVkdWxlci5qcyIsIi4uL3NvdXJjZS9tb2RlbC9tb2RlbF9iYXNlLmpzIiwiLi4vc291cmNlL3NjaGVtYS9zY2hlbWFfdHlwZS5qcyIsIi4uL3NvdXJjZS9tb2RlbC9tb2RlbF9jb250YWluZXIuanMiLCIuLi9zb3VyY2UvbW9kZWwvYXJyYXlfY29udGFpbmVyLmpzIiwiLi4vc291cmNlL21vZGVsL2J0cmVlX2NvbnRhaW5lci5qcyIsIi4uL3NvdXJjZS9zY2hlbWEvbnVtYmVyX3R5cGUuanMiLCIuLi9zb3VyY2UvY29tbW9uL2RhdGVfdGltZS9tb250aHMuanMiLCIuLi9zb3VyY2UvY29tbW9uL2RhdGVfdGltZS9kYXlzX29mX3dlZWsuanMiLCIuLi9zb3VyY2UvY29tbW9uL2RhdGVfdGltZS9kYXlfc3RhcnRfYW5kX2VuZF9lcG9jaC5qcyIsIi4uL3NvdXJjZS9jb21tb24vZGF0ZV90aW1lL3RpbWUuanMiLCIuLi9zb3VyY2UvY29tbW9uL21hdGgvcG9pbnQyRC5qcyIsIi4uL3NvdXJjZS9jb21tb24vbWF0aC9xdWFkcmF0aWNfYmV6aWVyLmpzIiwiLi4vc291cmNlL2NvbW1vbi9tYXRoL2NvbnN0cy5qcyIsIi4uL3NvdXJjZS9jb21tb24vbWF0aC9jdWJpY19iZXppZXIuanMiLCIuLi9zb3VyY2UvY29tbW9uL2V2ZW50L3RvdWNoX3Njcm9sbGVyLmpzIiwiLi4vc291cmNlL2NvbW1vbi5qcyIsIi4uL3NvdXJjZS9zY2hlbWEvZGF0ZV90eXBlLmpzIiwiLi4vc291cmNlL3NjaGVtYS90aW1lX3R5cGUuanMiLCIuLi9zb3VyY2Uvc2NoZW1hL3N0cmluZ190eXBlLmpzIiwiLi4vc291cmNlL3NjaGVtYS9ib29sX3R5cGUuanMiLCIuLi9zb3VyY2Uvc2NoZW1hL3NjaGVtYXMuanMiLCIuLi9zb3VyY2UvbW9kZWwvbW9kZWwuanMiLCIuLi9zb3VyY2UvY29udHJvbGxlci5qcyIsIi4uL3NvdXJjZS9nZXR0ZXIuanMiLCIuLi9zb3VyY2Uvc2V0dGVyLmpzIiwiLi4vc291cmNlL2xpbmtlci9wYWdlLmpzIiwiLi4vc291cmNlL2xpbmtlci9zZXRsaW5rcy5qcyIsIi4uL3NvdXJjZS9hbmltYXRpb24vY29sb3IuanMiLCIuLi9zb3VyY2UvYW5pbWF0aW9uL3RyYW5zZm9ybXRvLmpzIiwiLi4vc291cmNlL2FuaW1hdGlvbi9hbmltYXRpb24uanMiLCIuLi9zb3VyY2UvYW5pbWF0aW9uL3RyYW5zaXRpb24vdHJhbnNpdGlvbmVlci5qcyIsIi4uL3NvdXJjZS9jYXNlL3JpdmV0LmpzIiwiLi4vc291cmNlL2xpbmtlci9jb21wb25lbnQuanMiLCIuLi9zb3VyY2UvY2FzZS9jYXNzZXR0ZS9jYXNzZXR0ZS5qcyIsIi4uL3NvdXJjZS9jYXNlL2Nhc2UuanMiLCIuLi9zb3VyY2UvY2FzZS9jYXNzZXR0ZS9maWx0ZXIuanMiLCIuLi9zb3VyY2UvY2FzZS9jYXNlX3RlbXBsYXRlLmpzIiwiLi4vc291cmNlL2Nhc2UvY2FzZV9za2VsZXRvbi5qcyIsIi4uL3NvdXJjZS9nbG9iYWwuanMiLCIuLi9zb3VyY2UvY2FzZS9jYXNzZXR0ZS9pbnB1dC5qcyIsIi4uL3NvdXJjZS9jYXNlL2Nhc3NldHRlL2Zvcm0uanMiLCIuLi9zb3VyY2UvY2FzZS90YXBzL3RhcC5qcyIsIi4uL3NvdXJjZS9jYXNlL3BpcGVzL3BpcGUuanMiLCIuLi9zb3VyY2UvY2FzZS9pby9pby5qcyIsIi4uL3NvdXJjZS9jYXNlL2Nhc2VfY29uc3RydWN0b3JfYXN0LmpzIiwiLi4vc291cmNlL2Nhc2UvY2FzZV9jb25zdHJ1Y3Rvci5qcyIsIi4uL3NvdXJjZS9saW5rZXIvZWxlbWVudC5qcyIsIi4uL3NvdXJjZS9saW5rZXIvbGlua2VyLmpzIiwiLi4vc291cmNlL3dpY2suanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIG51bGxfdG9rZW4gPSB7XHJcbiAgICB0eXBlOiBcIlwiLFxyXG4gICAgdGV4dDogXCJcIlxyXG59O1xyXG5cclxuY2xhc3MgTGV4ZXIge1xyXG4gICAgY29uc3RydWN0b3IodG9rZW5pemVyKSB7XHJcbiAgICAgICAgdGhpcy50ayA9IHRva2VuaXplcjtcclxuXHJcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuaXplci5uZXh0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuaG9sZCA9IG51bGw7XHJcblxyXG4gICAgICAgIHdoaWxlICh0aGlzLnRva2VuICYmICh0aGlzLnRva2VuLnR5cGUgPT09IFwibmV3X2xpbmVcIiB8fCB0aGlzLnRva2VuLnR5cGUgPT09IFwid2hpdGVfc3BhY2VcIiB8fCB0aGlzLnRva2VuLnR5cGUgPT09IFwiZ2VuZXJpY1wiKSkge1xyXG4gICAgICAgICAgICB0aGlzLnRva2VuID0gdGhpcy50ay5uZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0KCl7XHJcbiAgICAgICAgdGhpcy50ay5yZXNldCgpO1xyXG4gICAgICAgIHRoaXMudG9rZW4gPSB0aGlzLnRrLm5leHQoKTtcclxuICAgICAgICB0aGlzLmhvbGQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaG9sZCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRva2VuID0gdGhpcy5ob2xkO1xyXG4gICAgICAgICAgICB0aGlzLmhvbGQgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy50b2tlbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICB0aGlzLnRva2VuID0gdGhpcy50ay5uZXh0KCk7XHJcbiAgICAgICAgfSB3aGlsZSAodGhpcy50b2tlbiAmJiAodGhpcy50b2tlbi50eXBlID09PSBcIm5ld19saW5lXCIgfHwgdGhpcy50b2tlbi50eXBlID09PSBcIndoaXRlX3NwYWNlXCIgfHwgdGhpcy50b2tlbi50eXBlID09PSBcImdlbmVyaWNcIikpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50b2tlbikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgYXNzZXJ0KHRleHQpIHtcclxuICAgICAgICBpZiAoIXRoaXMudG9rZW4pIHRocm93IG5ldyBFcnJvcihgRXhwZWN0aW5nICR7dGV4dH0gZ290IG51bGxgKTtcclxuXHJcbiAgICAgICAgdmFyIGJvb2wgPSB0aGlzLnRva2VuLnRleHQgPT0gdGV4dDtcclxuXHJcblxyXG4gICAgICAgIGlmIChib29sKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGluZyBcIiR7dGV4dH1cIiBnb3QgXCIke3RoaXMudG9rZW4udGV4dH1cImApXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYm9vbDtcclxuICAgIH1cclxuXHJcbiAgICBwZWVrKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhvbGQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaG9sZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaG9sZCA9IHRoaXMudGsubmV4dCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaG9sZCkgcmV0dXJuIG51bGxfdG9rZW47XHJcblxyXG4gICAgICAgIHdoaWxlICh0aGlzLmhvbGQgJiYgKHRoaXMuaG9sZC50eXBlID09PSBcIm5ld19saW5lXCIgfHwgdGhpcy5ob2xkLnR5cGUgPT09IFwid2hpdGVfc3BhY2VcIiB8fCB0aGlzLmhvbGQudHlwZSA9PT0gXCJnZW5lcmljXCIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaG9sZCA9IHRoaXMudGsubmV4dCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaG9sZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ob2xkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGxfdG9rZW47XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHRleHQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudG9rZW4pXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VuLnRleHQ7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHR5cGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudG9rZW4pXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VuLnR5cGU7XHJcbiAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHBvcygpe1xyXG4gICAgICAgIGlmICh0aGlzLnRva2VuKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbi5wb3M7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuICAgIHNsaWNlKHN0YXJ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMudG9rZW4pXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRrLnN0cmluZy5zbGljZShzdGFydCwgdGhpcy50b2tlbi5wb3MpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGsuc3RyaW5nLnNsaWNlKHN0YXJ0KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBMZXhlciB9IiwiLy9Db21wYXJlcyBjb2RlIHdpdGggYXJndW1lbnQgbGlzdCBhbmQgcmV0dXJucyB0cnVlIGlmIG1hdGNoIGlzIGZvdW5kLCBvdGhlcndpc2UgZmFsc2UgaXMgcmV0dXJuZWRcclxuZnVuY3Rpb24gY29tcGFyZUNvZGUoY29kZSkge1xyXG4gICAgdmFyIGxpc3QgPSBhcmd1bWVudHM7XHJcbiAgICBmb3IgKHZhciBpID0gMSwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGxpc3RbaV0gPT09IGNvZGUpIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vL1JldHVybnMgdHJ1ZSBpZiBjb2RlIGxpZXMgYmV0d2VlbiB0aGUgb3RoZXIgdHdvIGFyZ3VtZW50c1xyXG5mdW5jdGlvbiBpblJhbmdlKGNvZGUpIHtcclxuICAgIHJldHVybiAoY29kZSA+IGFyZ3VtZW50c1sxXSAmJiBjb2RlIDwgYXJndW1lbnRzWzJdKTtcclxufVxyXG5cclxuLy9UaGUgcmVzdWx0aW5nIGFycmF5IGlzIHVzZWQgd2hpbGUgcGFyc2luZyBhbmQgdG9rZW5pemluZyB0b2tlbiBzdHJpbmdzXHJcbnZhciBzdHJpbmdfcGFyc2VfYW5kX2Zvcm1hdF9mdW5jdGlvbnMgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgYXJyYXkgPSBbe1xyXG4gICAgICAgICAgICB0eXBlOiBcIm51bWJlclwiLFxyXG4gICAgICAgICAgICAvL0luaXRpYWwgY2hlY2sgZnVuY3Rpb24uIFJldHVybiBpbmRleCBvZmZzZXQgdG8gc3RhcnQgZm9yIHNjYW4uIElmIDAgaXMgcmV0dXJuZWQgdGhlbiB0aGUgcGFyc2VyIHdpbGwgbW92ZSBvbiB0byB0aGUgbmV4dCBjaGVjayBmdW5jdGlvblxyXG4gICAgICAgICAgICBjaGVjayhjb2RlLCB0ZXh0LCBvZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpblJhbmdlKGNvZGUsIDQ3LCA1OCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2RlID0gdGV4dC5jaGFyQ29kZUF0KDEgKyBvZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wYXJlQ29kZShjb2RlLCA2NiwgOTgsIDg4LCAxMjAsIDc5LCAxMTEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29kZSA9PSA0Nikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvZGUgPSB0ZXh0LmNoYXJDb2RlQXQoMSArIG9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluUmFuZ2UoY29kZSwgNDcsIDU4KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGluUmFuZ2UoY29kZSwgNDcsIDU4KSB8fCBjb2RlID09PSA0NikgPyAtMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4uY29sb3IgPSBcInJnYigyMCw0MCwxODApXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcImlkZW50aWZpZXJcIixcclxuICAgICAgICAgICAgLy9Jbml0aWFsIGNoZWNrIGZ1bmN0aW9uLiBSZXR1cm4gaW5kZXggb2Zmc2V0IHRvIHN0YXJ0IGZvciBzY2FuLiBJZiAwIGlzIHJldHVybmVkIHRoZW4gdGhlIHBhcnNlciB3aWxsIG1vdmUgb24gdG8gdGhlIG5leHQgY2hlY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgY2hlY2soY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChpblJhbmdlKGNvZGUsIDY0LCA5MSkgfHwgaW5SYW5nZShjb2RlLCA5NiwgMTIzKSkgPyAxIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGluUmFuZ2UoY29kZSwgNDcsIDU4KSB8fCBpblJhbmdlKGNvZGUsIDY0LCA5MSkgfHwgaW5SYW5nZShjb2RlLCA5NiwgMTIzKSB8fCBjb21wYXJlQ29kZShjb2RlLCAzNSwgMzYsIDQ1LCA5NSkpID8gLTEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3Rva2VuLmNvbG9yID0gcmFuZG9tQ29sb3IoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LC8qIHtcclxuICAgICAgICAgICAgdHlwZTogXCJjb21tZW50XCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUsIHRleHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoKGNvZGUgPT09IDQ3KSAmJiAodGV4dC5jaGFyQ29kZUF0KDEpID09PSA0NykpID8gMiA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChpblJhbmdlKGNvZGUsIDMyLCAxMjgpIHx8IGNvZGUgPT09IDMyIHx8IGNvZGUgPT09IDkpID8gLTEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9rZW4pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwgKi97XHJcbiAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUsIHRleHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoY29kZSA9PT0gMzQpID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChjb2RlID09PSAzNCkgPyAxIDogLTE7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9rZW4pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcIndoaXRlX3NwYWNlXCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoY29kZSA9PT0gMzIgfHwgY29kZSA9PT0gOSkgPyAxIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGNvZGUgPT09IDMyIHx8IGNvZGUgPT09IDkpID8gLTEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9rZW4pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcIm5ld19saW5lXCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoY29kZSA9PT0gMTApID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0b2tlbilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJvcGVuX2JyYWNrZXRcIixcclxuICAgICAgICAgICAgLy9Jbml0aWFsIGNoZWNrIGZ1bmN0aW9uLiBSZXR1cm4gaW5kZXggb2Zmc2V0IHRvIHN0YXJ0IGZvciBzY2FuLiBJZiAwIGlzIHJldHVybmVkIHRoZW4gdGhlIHBhcnNlciB3aWxsIG1vdmUgb24gdG8gdGhlIG5leHQgY2hlY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgY2hlY2soY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmVDb2RlKGNvZGUsIDEyMywgNDAsIDkxKSA/IDEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIC8vU2luZ2xlIGNoYXJhY3RlciwgZW5kIGNvbWVzIGltbWVkaWF0bHlcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLmNvbG9yID0gXCJyZ2IoMTAwLDEwMCwxMDApXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcImNsb3NlX2JyYWNrZXRcIixcclxuICAgICAgICAgICAgLy9Jbml0aWFsIGNoZWNrIGZ1bmN0aW9uLiBSZXR1cm4gaW5kZXggb2Zmc2V0IHRvIHN0YXJ0IGZvciBzY2FuLiBJZiAwIGlzIHJldHVybmVkIHRoZW4gdGhlIHBhcnNlciB3aWxsIG1vdmUgb24gdG8gdGhlIG5leHQgY2hlY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgY2hlY2soY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmVDb2RlKGNvZGUsIDEyNSwgNDEsIDkzKSA/IDEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIC8vU2luZ2xlIGNoYXJhY3RlciwgZW5kIGNvbWVzIGltbWVkaWF0bHlcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLmNvbG9yID0gXCJyZ2IoMTAwLDEwMCwxMDApXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiBcIk9wZXJhdG9yXCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wYXJlQ29kZShjb2RlLCA0MiwgNDMsIDYwLCA2MSwgNjIsIDkyLCAzOCwgMzcsIDMzLCA5NCwgMTI0LCA1OCkgPyAxIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvL1NpbmdsZSBjaGFyYWN0ZXIsIGVuZCBjb21lcyBpbW1lZGlhdGx5XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi5jb2xvciA9IFwicmdiKDIwNSwxMjAsMClcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiU3ltYm9sXCIsIC8vRXZlcnl0aGluZyBlbHNlIHNob3VsZCBiZSBnZW5lcmljIHN5bWJvbHNcclxuICAgICAgICAgICAgY2hlY2soY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgLy9HZW5lcmljIHdpbGwgY2FwdHVyZSBBTlkgcmVtYWluZGVyIGNoYXJhY3RlciBzZXRzLlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4uY29sb3IgPSBcInJlZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXTtcclxuXHJcbiAgICAvL1RoaXMgYWxsb3dzIGZvciBjcmVhdGlvbiBjdXN0b20gcGFyc2VycyBhbmQgZm9ybWF0dGVycyBiYXNlZCB1cG9uIHRoaXMgb2JqZWN0LlxyXG4gICAgYXJyYXkuY2xvbmUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gc3RyaW5nX3BhcnNlX2FuZF9mb3JtYXRfZnVuY3Rpb25zKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBhcnJheTtcclxufSk7XHJcblxyXG52YXIgU1BGID0gc3RyaW5nX3BhcnNlX2FuZF9mb3JtYXRfZnVuY3Rpb25zKCk7XHJcbnZhciBTUEZfbGVuZ3RoID0gU1BGLmxlbmd0aDtcclxuXHJcbmNsYXNzIFRva2VuaXplciB7XHJcbiAgICBjb25zdHJ1Y3RvcihzdHJpbmcpIHtcclxuICAgIFx0dGhpcy5oID0gbnVsbDtcclxuXHQgICAgdGhpcy5saW5lID0gMDtcclxuXHQgICAgdGhpcy5jaGFyID0gMDtcclxuXHQgICAgdGhpcy5vZmZzZXQgPSAwO1xyXG5cdCAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpe1xyXG4gICAgICAgIHRoaXMubGluZSA9IDA7XHJcbiAgICAgICAgdGhpcy5jaGFyID0gMDtcclxuICAgICAgICB0aGlzLm9mZnNldCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgaG9sZCh0b2tlbikge1xyXG4gICAgICAgIHRoaXMuaCA9IHRva2VuO1xyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKSB7XHJcblxyXG4gICAgICAgIHZhciB0b2tlbl9sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5oKSB7XHJcbiAgICAgICAgICAgIHZhciB0ID0gdGhpcy5oO1xyXG4gICAgICAgICAgICB0aGlzLmggPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0cmluZy5sZW5ndGggPCAxKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IG9mZnNldCA9IHRoaXMub2Zmc2V0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChvZmZzZXQgPj0gdGhpcy5zdHJpbmcubGVuZ3RoKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgdmFyIGNvZGUgPSB0aGlzLnN0cmluZy5jaGFyQ29kZUF0KG9mZnNldCk7XHJcbiAgICAgICAgbGV0IFNQRl9mdW5jdGlvbjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IFNQRl9sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBTUEZfZnVuY3Rpb24gPSBTUEZbaV07XHJcbiAgICAgICAgICAgIGxldCB0ZXN0X2luZGV4ID0gU1BGX2Z1bmN0aW9uLmNoZWNrKGNvZGUsIHRoaXMuc3RyaW5nLCBvZmZzZXQpO1xyXG4gICAgICAgICAgICBpZiAodGVzdF9pbmRleCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9IFNQRl9mdW5jdGlvbi50eXBlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGUgPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gdGVzdF9pbmRleDsgaSA8IHRoaXMuc3RyaW5nLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZSA9IFNQRl9mdW5jdGlvbi5zY2FuVG9FbmQodGhpcy5zdHJpbmcuY2hhckNvZGVBdChpICsgb2Zmc2V0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgPiAtMSkgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0b2tlbl9sZW5ndGggPSBpICsgZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdGVtcCA9IHRoaXMuc3RyaW5nLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgdG9rZW5fbGVuZ3RoKTtcclxuXHJcbiAgICAgICAgaWYgKFNQRl9mdW5jdGlvbi50eXBlID09PSBcIm5ld19saW5lXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFyID0gMDtcclxuICAgICAgICAgICAgdGhpcy5saW5lKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgb3V0ID0ge1xyXG4gICAgICAgICAgICB0eXBlOiBTUEZfZnVuY3Rpb24udHlwZSxcclxuICAgICAgICAgICAgdGV4dDogdGVtcCxcclxuICAgICAgICAgICAgcG9zOiB0aGlzLm9mZnNldCxcclxuICAgICAgICAgICAgbGVuZ3RoOiB0b2tlbl9sZW5ndGgsXHJcbiAgICAgICAgICAgIGNoYXI6IHRoaXMuY2hhcixcclxuICAgICAgICAgICAgbGluZTogdGhpcy5saW5lXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vZmZzZXQgKz0gdG9rZW5fbGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuY2hhciArPSB0b2tlbl9sZW5ndGg7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7VG9rZW5pemVyfVxyXG4iLCJpbXBvcnQge0xleGVyfSBmcm9tIFwiLi4vc3RyaW5nX3BhcnNpbmcvbGV4ZXJcIlxyXG5pbXBvcnQge1Rva2VuaXplcn0gZnJvbSBcIi4uL3N0cmluZ19wYXJzaW5nL3Rva2VuaXplclwiXHJcblxyXG4vKipcclxuVVJMIFF1ZXJ5IFN5bnRheFxyXG5cclxucm9vdCA9PiBbcm9vdF9jbGFzc10gWyYgW2NsYXNzZXNdXVxyXG4gICAgID0+IFtjbGFzc2VzXVxyXG5cclxucm9vdF9jbGFzcyA9IGtleV9saXN0XHJcblxyXG5jbGFzc19saXN0IFtjbGFzcyBbJiBjbGFzc19saXN0XV1cclxuXHJcbmNsYXNzID0+IG5hbWUgJiBrZXlfbGlzdFxyXG5cclxua2V5X2xpc3QgPT4gW2tleV92YWwgWyYga2V5X2xpc3RdXVxyXG5cclxua2V5X3ZhbCA9PiBuYW1lID0gdmFsXHJcblxyXG5uYW1lID0+IEFMUEhBTlVNRVJJQ19JRFxyXG5cclxudmFsID0+IE5VTUJFUlxyXG4gICAgPT4gQUxQSEFOVU1FUklDX0lEXHJcbiovXHJcbmZ1bmN0aW9uIFF1ZXJ5U3RyaW5nVG9RdWVyeU1hcChxdWVyeSl7XHJcblxyXG4gIGxldCBtYXBwZWRfb2JqZWN0ID0gbmV3IE1hcDtcclxuXHJcbiAgaWYoIXF1ZXJ5IGluc3RhbmNlb2YgU3RyaW5nKXtcclxuICAgIGNvbnNvbGUud2FybihcInF1ZXJ5IGFyZ3VtZW50IHByb3ZpZGVkIGlzIG5vdCBhIHN0cmluZyFcIilcclxuICAgIHJldHVybiBtYXBwZWRfb2JqZWN0O1xyXG4gIH1cclxuXHJcbiAgaWYocXVlcnlbMF0gPT0gXCI/XCIpIHF1ZXJ5ID0gcXVlcnkuc2xpY2UoMSk7XHJcblxyXG4gIGxldCBsZXggPSBuZXcgTGV4ZXIobmV3IFRva2VuaXplcihxdWVyeSkpO1xyXG5cclxuICBmdW5jdGlvbiBrZXlfdmFsX2xpc3QobGV4LCBtYXApe1xyXG4gICAgbGV0IHRva2VuO1xyXG4gICAgd2hpbGUoKHRva2VuID0gbGV4LnRva2VuKSAmJiB0b2tlbi50ZXh0ICE9PSBcIiZcIil7XHJcbiAgICAgIGlmKGxleC5wZWVrKCkudGV4dCA9PSBcIj1cIil7XHJcbiAgICAgICAgbGV0IGtleSA9IHRva2VuLnRleHQ7XHJcbiAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgIGxldCB2YWwgPSBsZXgudG9rZW47XHJcbiAgICAgICAgbWFwLnNldChrZXksICh2YWwudHlwZSA9PSBcIm51bWJlclwiKT9wYXJzZUZsb2F0KHZhbC50ZXh0KTp2YWwudGV4dCk7XHJcbiAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNsYXNzXyhsZXgsIG1hcCl7XHJcblxyXG4gICAgbGV0IHRva2VuO1xyXG5cclxuICAgIGlmKCh0b2tlbiA9IGxleC5wZWVrKCkpICYmIHRva2VuLnRleHQgPT0gXCImXCIpe1xyXG5cclxuICAgICAgdG9rZW4gPSBsZXgudG9rZW47XHJcblxyXG4gICAgICBsZXgubmV4dCgpO2xleC5uZXh0KCk7XHJcbiAgICAgIG1hcC5zZXQodG9rZW4udGV4dCwgbmV3IE1hcCgpKTtcclxuICAgICAga2V5X3ZhbF9saXN0KGxleCxtYXAuZ2V0KHRva2VuLnRleHQpKTtcclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJvb3QobGV4LG1hcCl7XHJcbiAgICAgICBtYXAuc2V0KG51bGwsIG5ldyBNYXAoKSk7XHJcblxyXG4gICAgICBpZihsZXgucGVlaygpLnRleHQgPT0gXCImXCIpe1xyXG4gICAgICAgICAgY2xhc3NfKGxleCwgbWFwKVxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAgIGtleV92YWxfbGlzdChsZXgsIG1hcC5nZXQobnVsbCkpO1xyXG4gICAgICB9XHJcblxyXG5cclxuXHJcbiAgICB3aGlsZShsZXgudG9rZW4gJiYgbGV4LnRva2VuLnRleHQgPT1cIiZcIil7XHJcbiAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgIGNsYXNzXyhsZXgsIG1hcClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJvb3QobGV4LCBtYXBwZWRfb2JqZWN0KTtcclxuICByZXR1cm4gbWFwcGVkX29iamVjdDtcclxufVxyXG5cclxuZnVuY3Rpb24gUXVlcnlNYXBUb1F1ZXJ5U3RyaW5nKG1hcCl7XHJcbiAgICBsZXQgY2xhc3NfLCBudWxsX2NsYXNzLHN0ciA9XCJcIjtcclxuICAgIGlmKChudWxsX2NsYXNzID0gbWFwLmdldChudWxsKSkpe1xyXG4gICAgICAgIGlmKG51bGxfY2xhc3MubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgW2tleSx2YWxdIG9mIG51bGxfY2xhc3MuZW50cmllcygpKXtcclxuICAgICAgICAgICAgICAgIHN0ciArPSBgJiR7a2V5fT0ke3ZhbH1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgW2tleSxjbGFzc19dIG9mIG1hcC5lbnRyaWVzKCkpe1xyXG4gICAgICAgICAgICBpZihrZXkgPT0gbnVsbCkgY29udGludWU7XHJcbiAgICAgICAgICAgIHN0ciArPSBgJiR7a2V5fWBcclxuICAgICAgICAgICAgZm9yKGxldCBba2V5LHZhbF0gb2YgY2xhc3NfLmVudHJpZXMoKSl7XHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gYCYke2tleX09JHt2YWx9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RyLnNsaWNlKDEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0cjtcclxufVxyXG5mdW5jdGlvbiBUdXJuRGF0YUludG9RdWVyeShkYXRhKSB7XHJcbiAgICB2YXIgc3RyID0gXCJcIjtcclxuXHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZGF0YSA9IGFyZ3VtZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXRhLmNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld19zdHIgPSBgJHtkYXRhLmNvbXBvbmVudH0mYDtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhIGluIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3X3N0ciArPSAoYSAhPSBcImNvbXBvbmVudFwiKSA/IGAke2F9PSR7ZGF0YVthXX1cXCZgIDogXCJcIjtcclxuXHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gbmV3X3N0ci5zbGljZSgwLCAtMSkgKyBcIi5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIGVsc2VcclxuICAgICAgICBmb3IgKHZhciBhIGluIGRhdGEpXHJcbiAgICAgICAgICAgIHN0ciArPSBgJHthfT0ke2RhdGFbYV19XFwmYDtcclxuXHJcbiAgICByZXR1cm4gc3RyLnNsaWNlKDAsIC0xKTtcclxufVxyXG5cclxuZnVuY3Rpb24gVHVyblF1ZXJ5SW50b0RhdGEocXVlcnkpIHtcclxuICAgIHZhciBvdXQgPSB7fTtcclxuXHJcbiAgICBsZXQgdCA9IHF1ZXJ5LnNwbGl0KFwiLlwiKTtcclxuXHJcbiAgICBpZiAodC5sZW5ndGggPiAwKVxyXG4gICAgICAgIHQuZm9yRWFjaCgoYSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgdCA9IHt9O1xyXG4gICAgICAgICAgICBpZiAoYS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBhLnNwbGl0KFwiJlwiKS5mb3JFYWNoKChhLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCAxKSBvdXRbYV0gPSB0O1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYiA9IGEuc3BsaXQoXCI9XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRbYlswXV0gPSBiWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcXVlcnkuc3BsaXQoXCImXCIpLmZvckVhY2goKGEpID0+IHtcclxuICAgICAgICAgICAgbGV0IGIgPSBhLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgb3V0W2JbMF1dID0gYlsxXVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmV0dXJuIG91dDtcclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFR1cm5RdWVyeUludG9EYXRhLFxyXG4gICAgVHVybkRhdGFJbnRvUXVlcnksXHJcbiAgICBRdWVyeU1hcFRvUXVlcnlTdHJpbmcsXHJcbiAgICBRdWVyeVN0cmluZ1RvUXVlcnlNYXBcclxufVxyXG4iLCJpbXBvcnQge1xyXG4gICAgVHVyblF1ZXJ5SW50b0RhdGEsXHJcbiAgICBUdXJuRGF0YUludG9RdWVyeSxcclxuICAgIFF1ZXJ5U3RyaW5nVG9RdWVyeU1hcCxcclxuICAgIFF1ZXJ5TWFwVG9RdWVyeVN0cmluZ1xyXG59IGZyb20gXCIuLi9jb21tb24vdXJsL3VybFwiXHJcblxyXG5jbGFzcyBXVVJMIHtcclxuICAgIGNvbnN0cnVjdG9yKGxvY2F0aW9uKXtcclxuICAgICAgICAvL3BhcnNlIHRoZSB1cmwgaW50byBkaWZmZXJlbnQgc2VjdGlvbnNcclxuICAgICAgICB0aGlzLnBhdGggPSBsb2NhdGlvbi5wYXRobmFtZTtcclxuICAgICAgICB0aGlzLmhvc3QgPSBsb2NhdGlvbi5ob3N0bmFtZTtcclxuICAgICAgICB0aGlzLnF1ZXJ5ID0gUXVlcnlTdHJpbmdUb1F1ZXJ5TWFwKGxvY2F0aW9uLnNlYXJjaC5zbGljZSgxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UGF0aChwYXRoKXtcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgICAgIHRoaXMuc2V0TG9jYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMb2NhdGlvbigpe1xyXG4gICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKHt9LFwicmVwbGFjZWQgc3RhdGVcIixgJHt0aGlzfWApO1xyXG4gICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gYCR7dGhpcy5wYXRofT8ke1F1ZXJ5TWFwVG9RdWVyeVN0cmluZyh0aGlzLnF1ZXJ5KX1gO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENsYXNzKGNsYXNzX25hbWUpe1xyXG5cclxuICAgICAgICBpZighY2xhc3NfbmFtZSkgY2xhc3NfbmFtZSA9IG51bGw7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG91dCA9IHt9LCBjbGFzc187XHJcblxyXG4gICAgICAgIGlmKGNsYXNzXyA9IHRoaXMucXVlcnkuZ2V0KGNsYXNzX25hbWUpKXtcclxuICAgICAgICAgICAgZm9yKGxldCBba2V5LCB2YWxdIG9mIGNsYXNzXy5lbnRyaWVzKCkpe1xyXG4gICAgICAgICAgICAgICAgb3V0W2tleV0gPSB2YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0KGNsYXNzX25hbWUsIGtleV9uYW1lLCB2YWx1ZSl7XHJcblxyXG4gICAgICAgIGlmKCFjbGFzc19uYW1lKSBjbGFzc19uYW1lID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYoIXRoaXMucXVlcnkuaGFzKGNsYXNzX25hbWUpKSB0aGlzLnF1ZXJ5LnNldChjbGFzc19uYW1lLCBuZXcgTWFwKCkpO1xyXG5cclxuICAgICAgICBsZXQgY2xhc3NfID0gdGhpcy5xdWVyeS5nZXQoY2xhc3NfbmFtZSk7XHJcblxyXG4gICAgICAgIGNsYXNzXy5zZXQoa2V5X25hbWUsIHZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRMb2NhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChjbGFzc19uYW1lLCBrZXlfbmFtZSl7XHJcbiAgICAgICAgaWYoIWNsYXNzX25hbWUpIGNsYXNzX25hbWUgPSBudWxsO1xyXG5cclxuICAgICAgICBsZXQgY2xhc3NfID0gdGhpcy5xdWVyeS5nZXQoY2xhc3NfbmFtZSk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gKGNsYXNzXykgPyBjbGFzc18uZ2V0KGtleV9uYW1lKSA6IG51bGw7ICBcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5leHBvcnQge1xyXG4gICAgV1VSTFxyXG59XHJcbiIsIi8vVXBkYXRlcyBVSVxyXG4vL1VwZGF0ZWQgQnkgTW9kZWxcclxuXHJcbmNsYXNzIFZpZXd7XHJcblx0Y29uc3RydWN0b3IoKXtcclxuXHRcdHRoaXMubmV4dCA9IG51bGw7XHJcblx0XHR0aGlzLm1vZGVsID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdGRlc3RydWN0b3IoKXtcclxuXHRcdGlmKHRoaXMubW9kZWwpe1xyXG5cdFx0XHR0aGlzLm1vZGVsLnJlbW92ZVZpZXcodGhpcyk7XHJcblx0XHR9XHJcblx0fVx0XHJcblx0LyoqXHJcblx0XHRDYWxsZWQgYSBNb2RlbCB3aGVuIGl0cyBkYXRhIGhhcyBjaGFuZ2VkLlxyXG5cdCovXHJcblx0dXBkYXRlKGRhdGEpe1xyXG5cclxuXHR9XHJcblx0LyoqXHJcblx0XHRDYWxsZWQgYnkgYSBNb2RlbENvbnRhaW5lciB3aGVuIGFuIGl0ZW0gaGFzIGJlZW4gcmVtb3ZlZC5cclxuXHQqL1xyXG5cdHJlbW92ZWQoZGF0YSl7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0XHRDYWxsZWQgYnkgYSBNb2RlbENvbnRhaW5lciB3aGVuIGFuIGl0ZW0gaGFzIGJlZW4gYWRkZWQuXHJcblx0Ki9cclxuXHRhZGRlZChkYXRhKXtcclxuXHJcblx0fVxyXG5cdHNldE1vZGVsKG1vZGVsKXtcclxuXHR9XHJcblxyXG5cdHJlc2V0KCl7XHJcblx0XHRcclxuXHR9XHJcblx0dW5zZXRNb2RlbCgpe1xyXG5cdFx0dGhpcy5uZXh0ID0gbnVsbDtcclxuXHRcdHRoaXMubW9kZWwgPSBudWxsO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0e1ZpZXd9IiwiY29uc3QgY2FsbGVyID0gKHdpbmRvdyAmJiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSA/IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgOiAoZikgPT4ge1xyXG4gICAgc2V0VGltZW91dChmLCAxKVxyXG59O1xyXG4vKiogXHJcbiAgICBUaGUgU2NoZWR1bGVyIGhhbmRsZXMgdXBkYXRpbmcgb2JqZWN0cy4gSXQgZG9lcyB0aGlzIGJ5IHNwbGl0dGluZyB1cCB1cGRhdGUgY3ljbGVzLCBcclxuICAgIHRvIHJlc3BlY3QgdGhlIGJyb3dzZXIgZXZlbnQgbW9kZWwuIFxyXG5cclxuICAgIElmIGFueSBvYmplY3QgaXMgc2NoZWR1bGVkIHRvIGJlIHVwZGF0ZWQsIGl0IHdpbGwgYmUgYmxvY2tlZCBmcm9tIHNjaGVkdWxpbmcgbW9yZSB1cGRhdGVzIFxyXG4gICAgdW50aWwgaXRzIG93biB1cGRhdGUgbWV0aG9kIGlzIGNhbGxlZC5cclxuKi9cclxuXHJcbmNvbnN0IFNjaGVkdWxlciA9IG5ldyhjbGFzcyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlX3F1ZXVlX2EgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZV9xdWV1ZV9iID0gbmV3IEFycmF5KCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlX3F1ZXVlID0gdGhpcy51cGRhdGVfcXVldWVfYTtcclxuXHJcbiAgICAgICAgdGhpcy5xdWV1ZV9zd2l0Y2ggPSAwO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9ICgpID0+IHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZnJhbWVfdGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuICAgICAgICB0aGlzLl9fX19TQ0hFRFVMRURfX19fID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcXVldWVVcGRhdGUob2JqZWN0KSB7XHJcblxyXG4gICAgICAgIGlmIChvYmplY3QuX19fX1NDSEVEVUxFRF9fX18gfHwgIW9iamVjdC51cGRhdGUgaW5zdGFuY2VvZiBGdW5jdGlvbilcclxuICAgICAgICAgICAgaWYgKHRoaXMuX19fX1NDSEVEVUxFRF9fX18pXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsZXIodGhpcy5jYWxsYmFjayk7XHJcblxyXG4gICAgICAgIG9iamVjdC5fX19fU0NIRURVTEVEX19fXyA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlX3F1ZXVlLnB1c2gob2JqZWN0KTtcclxuXHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9fX19TQ0hFRFVMRURfX19fKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuX19fX1NDSEVEVUxFRF9fX18gPSB0cnVlO1xyXG5cclxuICAgICAgICBjYWxsZXIodGhpcy5jYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9fX19TQ0hFRFVMRURfX19fID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCB1cSA9IHRoaXMudXBkYXRlX3F1ZXVlO1xyXG5cclxuICAgICAgICBpZih0aGlzLnF1ZXVlX3N3aXRjaCA9PSAwKVxyXG4gICAgICAgICAgICAodGhpcy51cGRhdGVfcXVldWUgPSB0aGlzLnVwZGF0ZV9xdWV1ZV9iLCB0aGlzLnF1ZXVlX3N3aXRjaCA9IDEpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgKHRoaXMudXBkYXRlX3F1ZXVlID0gdGhpcy51cGRhdGVfcXVldWVfYSwgdGhpcy5xdWV1ZV9zd2l0Y2ggPSAwKTtcclxuXHJcbiAgICAgICAgbGV0IHRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgbGV0IGRpZmYgPSB0aW1lIC0gdGhpcy5mcmFtZV90aW1lO1xyXG5cclxuICAgICAgICB0aGlzLmZyYW1lX3RpbWUgPSB0aW1lO1xyXG5cclxuICAgICAgICBsZXQgc3RlcF9yYXRpbyA9IChkaWZmICogMC4wNik7IC8vICBzdGVwX3JhdGlvIG9mIDEgPSAxNi42NjY2NjY2NiBvciAxMDAwIC8gNjAgZm9yIDYwIEZQU1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHVxLmxlbmd0aCwgbyA9IHVxWzBdOyBpIDwgbDsgbyA9IHVxWysraV0pe1xyXG4gICAgICAgICAgICBvLl9fX19TQ0hFRFVMRURfX19fID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG8udXBkYXRlKHN0ZXBfcmF0aW8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXEubGVuZ3RoID0gMDtcclxuICAgIH1cclxufSkoKVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFNjaGVkdWxlclxyXG59IiwiaW1wb3J0IHtcclxuXHRWaWV3XHJcbn0gZnJvbSBcIi4uL3ZpZXdcIlxyXG5pbXBvcnQge1xyXG5cdFNjaGVkdWxlclxyXG59IGZyb20gXCIuLi9zY2hlZHVsZXJcIlxyXG5cclxuXHJcbmNsYXNzIE1vZGVsQmFzZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcbiAgIFx0XHR0aGlzLl9fX19jaGFuZ2VkX3ZhbHVlc19fX18gPSBbXTtcclxuXHR9O1xyXG5cclxuXHRkZXN0cnVjdG9yKCkge1xyXG5cdFx0ZGVidWdnZXJcclxuICAgICAgICAvL2luZm9ybSB2aWV3cyBvZiB0aGUgbW9kZWxzIGRlbWlzZVxyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcy5maXJzdF92aWV3O1xyXG5cclxuICAgICAgICB3aGlsZSAodmlldykge1xyXG4gICAgICAgICAgICB2aWV3LnVuc2V0TW9kZWwoKTtcclxuICAgICAgICAgICAgdmlldyA9IHZpZXcubmV4dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdGhpcy5maXJzdF92aWV3ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdGdldCAoKXtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdFx0XHJcblx0Ki9cclxuXHJcbiAgICBzY2hlZHVsZVVwZGF0ZShjaGFuZ2VkX3ZhbHVlKSB7XHJcbiAgICBcdGlmKCF0aGlzLmZpcnN0X3ZpZXcpXHJcbiAgICBcdFx0cmV0dXJuO1xyXG5cclxuICAgIFx0dGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fLnB1c2goY2hhbmdlZF92YWx1ZSk7XHJcblxyXG4gICAgICAgIFNjaGVkdWxlci5xdWV1ZVVwZGF0ZSh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDaGFuZ2VkKHByb3BfbmFtZSkge1xyXG5cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLl9fX19jaGFuZ2VkX3ZhbHVlc19fX18ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fW2ldID09IHByb3BfbmFtZSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW3Byb3BfbmFtZV07XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShzdGVwKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlVmlld3ModGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fXy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuXHQvKipcclxuXHRcdEFkZHMgYSB2aWV3IHRvIHRoZSBsaW5rZWQgbGlzdCBvZiB2aWV3cyBvbiB0aGUgbW9kZWwuIGFyZ3VtZW50IHZpZXcgTVVTVCBiZSBhbiBpbnN0YW5jZSBvZiBWaWV3LiBcclxuXHQqL1xyXG5cdGFkZFZpZXcodmlldykge1xyXG5cdFx0XHJcblx0XHRpZiAodmlldyBpbnN0YW5jZW9mIFZpZXcpIHtcclxuXHRcdFx0aWYgKHZpZXcubW9kZWwpXHJcblx0XHRcdFx0dmlldy5tb2RlbC5yZW1vdmVWaWV3KHZpZXcpO1xyXG5cclxuXHRcdFx0dmFyIGNoaWxkX3ZpZXcgPSB0aGlzLmZpcnN0X3ZpZXc7XHJcblxyXG5cdFx0XHR3aGlsZSAoY2hpbGRfdmlldykge1xyXG5cdFx0XHRcdGlmICh2aWV3ID09IGNoaWxkX3ZpZXcpIHJldHVybjtcclxuXHRcdFx0XHRjaGlsZF92aWV3ID0gY2hpbGRfdmlldy5uZXh0O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2aWV3Lm1vZGVsID0gdGhpcztcclxuXHRcdFx0dmlldy5uZXh0ID0gdGhpcy5maXJzdF92aWV3O1xyXG5cdFx0XHR0aGlzLmZpcnN0X3ZpZXcgPSB2aWV3O1xyXG5cclxuXHRcdFx0dmlldy5zZXRNb2RlbCh0aGlzKTtcclxuXHRcdFx0dmlldy51cGRhdGUodGhpcy5nZXQoKSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0dGhyb3cgbmV3IEV4Y2VwdGlvbihcIlBhc3NlZCBpbiB2aWV3IGlzIG5vdCBhbiBpbnN0YW5jZSBvZiB3aWNrLlZpZXchXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0XHRSZW1vdmVzIHZpZXcgZnJvbSBzZXQgb2Ygdmlld3MgaWYgdGhlIHBhc3NlZCBpbiB2aWV3IGlzIGEgbWVtYmVyIG9mIG1vZGVsLiBcclxuXHQqL1xyXG5cdHJlbW92ZVZpZXcodmlldykge1xyXG5cdFx0aWYgKHZpZXcgaW5zdGFuY2VvZiBWaWV3ICYmIHZpZXcubW9kZWwgPT0gdGhpcykge1xyXG5cdFx0XHR2YXIgY2hpbGRfdmlldyA9IHRoaXMuZmlyc3RfdmlldztcclxuXHRcdFx0dmFyIHByZXZfY2hpbGQgPSBudWxsO1xyXG5cclxuXHRcdFx0d2hpbGUgKGNoaWxkX3ZpZXcpIHtcclxuXHRcdFx0XHRpZiAodmlldyA9PSBjaGlsZF92aWV3KSB7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHByZXZfY2hpbGQpIHtcclxuXHRcdFx0XHRcdFx0cHJldl9jaGlsZC5uZXh0ID0gdmlldy5uZXh0O1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5maXJzdF92aWV3ID0gdmlldy5uZXh0O1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZpZXcubmV4dCA9IG51bGxcclxuXHRcdFx0XHRcdHZpZXcubW9kZWwgPSBudWxsO1xyXG5cdFx0XHRcdFx0dmlldy5yZXNldCgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdHByZXZfY2hpbGQgPSBjaGlsZF92aWV3O1xyXG5cdFx0XHRcdGNoaWxkX3ZpZXcgPSBjaGlsZF92aWV3Lm5leHQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vZGVidWdnZXJcclxuXHRcdH1cclxuXHRcdGNvbnNvbGUud2FybihcIlZpZXcgbm90IGEgbWVtYmVyIG9mIE1vZGVsIVwiLCB2aWV3KTtcclxuXHR9XHJcblx0LyoqXHJcblx0XHRDYWxscyB1cGRhdGUoKSBvbiBldmVyeSB2aWV3IG9iamVjdCwgcGFzc2luZyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgTW9kZWwuXHJcblx0Ki9cdFxyXG5cdHVwZGF0ZVZpZXdzKCkge1xyXG5cdFx0dmFyIHZpZXcgPSB0aGlzLmZpcnN0X3ZpZXc7XHJcblxyXG5cdFx0d2hpbGUgKHZpZXcpIHtcclxuXHRcdFx0XHJcblx0XHRcdHZpZXcudXBkYXRlKHRoaXMsIHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fXyk7XHJcblxyXG5cdFx0XHRcclxuXHRcdFx0dmlldyA9IHZpZXcubmV4dDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fLmxlbmd0aCA9IDA7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHRcdFVwZGF0ZXMgdmlld3Mgd2l0aCBhIGxpc3Qgb2YgbW9kZWxzIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQuIFxyXG5cdFx0UHJpbWFyaWx5IHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBjb250YWluZXIgYmFzZWQgdmlld3MsIHN1Y2ggYXMgQ2FzZVRlbXBsYXRlcy5cclxuXHQqL1xyXG5cdHVwZGF0ZVZpZXdzUmVtb3ZlZChkYXRhKSB7XHJcblx0XHR2YXIgdmlldyA9IHRoaXMuZmlyc3RfdmlldztcclxuXHJcblx0XHR3aGlsZSAodmlldykge1xyXG5cdFx0XHRcclxuXHRcdFx0dmlldy5yZW1vdmVkKGRhdGEpO1xyXG5cdFx0XHRcclxuXHRcdFx0dmlldyA9IHZpZXcubmV4dDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdFx0VXBkYXRlcyB2aWV3cyB3aXRoIGEgbGlzdCBvZiBtb2RlbHMgdGhhdCBoYXZlIGJlZW4gYWRkZWQuIFxyXG5cdFx0UHJpbWFyaWx5IHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBjb250YWluZXIgYmFzZWQgdmlld3MsIHN1Y2ggYXMgQ2FzZVRlbXBsYXRlcy5cclxuXHQqL1xyXG5cdHVwZGF0ZVZpZXdzQWRkZWQoZGF0YSkge1xyXG5cdFx0dmFyIHZpZXcgPSB0aGlzLmZpcnN0X3ZpZXc7XHJcblxyXG5cdFx0d2hpbGUgKHZpZXcpIHtcclxuXHRcdFx0XHJcblx0XHRcdHZpZXcuYWRkZWQoZGF0YSk7XHJcblx0XHRcdFxyXG5cdFx0XHR2aWV3ID0gdmlldy5uZXh0O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbiAgICB0b0pzb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMsbnVsbCwgJ1xcdCcpO1xyXG4gICAgfVxyXG59XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kZWxCYXNlLnByb3RvdHlwZSwgXCJmaXJzdF92aWV3XCIsIHtcclxuXHR3cml0YWJsZSA6IHRydWUsXHJcblx0Y29uZmlndXJhYmxlIDogZmFsc2UsXHJcblx0ZW51bWVyYWJsZSA6IGZhbHNlLFxyXG59KVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZGVsQmFzZS5wcm90b3R5cGUsIFwiX19fX2NoYW5nZWRfdmFsdWVzX19fX1wiLCB7XHJcblx0d3JpdGFibGUgOiB0cnVlLFxyXG5cdGNvbmZpZ3VyYWJsZSA6IGZhbHNlLFxyXG5cdGVudW1lcmFibGUgOiBmYWxzZSxcclxufSlcclxuXHJcblxyXG5PYmplY3Quc2VhbChNb2RlbEJhc2UucHJvdG90eXBlKTtcclxuXHJcblxyXG5leHBvcnQge1xyXG5cdE1vZGVsQmFzZVxyXG59IiwiLyoqXHJcblx0U2NoZW1hIHR5cGUuIEhhbmRsZXMgdGhlIHBhcnNpbmcsIHZhbGlkYXRpb24sIGFuZCBmaWx0ZXJpbmcgb2YgTW9kZWwgZGF0YSBwcm9wZXJ0aWVzLiBcclxuKi9cclxuY2xhc3MgU2NoZW1hVHlwZSB7XHJcblx0XHJcblx0Y29uc3RydWN0b3IoKXtcclxuXHRcdHRoaXMuc3RhcnRfdmFsdWUgPSB1bmRlZmluZWQ7XHJcblx0fVxyXG5cdFxyXG5cdC8qKlxyXG5cdFx0UGFyc2VzIHZhbHVlIHJldHVybnMgYW4gYXBwcm9wcmlhdGUgdHJhbnNmb3JtZWQgdmFsdWVcclxuXHQqL1xyXG5cdHBhcnNlKHZhbHVlKXtcclxuXHRcdHJldHVybiB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cclxuXHQqL1xyXG5cdHZlcmlmeSh2YWx1ZSwgcmVzdWx0KXtcclxuXHRcdHJlc3VsdC52YWxpZCA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRmaWx0ZXIoKXtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0c3RyaW5nKHZhbHVlKXtcclxuXHRcdHJldHVybiB2YWx1ZSArIFwiXCI7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQge1NjaGVtYVR5cGV9OyAiLCJpbXBvcnQge1xyXG4gICAgTW9kZWxCYXNlLFxyXG59IGZyb20gXCIuL21vZGVsX2Jhc2UuanNcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIFNjaGVtYVR5cGVcclxufSBmcm9tIFwiLi4vc2NoZW1hL3NjaGVtYV90eXBlXCJcclxuXHJcbmNsYXNzIE1DQXJyYXkgZXh0ZW5kcyBBcnJheSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1c2goaXRlbSkge1xyXG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkpXHJcbiAgICAgICAgICAgIGl0ZW0uZm9yRWFjaCgoaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoKGkpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdXBlci5wdXNoKGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vRm9yIGNvbXBhdGliaWxpdHlcclxuICAgIF9fc2V0RmlsdGVyc19fKCkge1xyXG5cclxuICAgIH1cclxuICAgIGdldENoYW5nZWQoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICB0b0pzb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMsIG51bGwsICdcXHQnKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gQSBcIm51bGxcIiBmdW5jdGlvblxyXG5sZXQgRW1wdHlGdW5jdGlvbiA9ICgpID0+IHt9O1xyXG5sZXQgRW1wdHlBcnJheSA9IFtdO1xyXG5cclxuXHJcblxyXG5jbGFzcyBNb2RlbENvbnRhaW5lciBleHRlbmRzIE1vZGVsQmFzZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NoZW1hKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vRm9yIExpbmtpbmcgdG8gb3JpZ2luYWwgXHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmlyc3RfbGluayA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5uZXh0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnByZXYgPSBudWxsO1xyXG5cclxuICAgICAgICAvL0ZvciBrZWVwaW5nIHRoZSBjb250YWluZXIgZnJvbSBhdXRvbWF0aWMgZGVsZXRpb24uXHJcbiAgICAgICAgdGhpcy5waW4gPSBFbXB0eUZ1bmN0aW9uO1xyXG5cclxuICAgICAgICAvL0ZpbHRlcnMgYXJlIGEgc2VyaWVzIG9mIHN0cmluZ3Mgb3IgbnVtYmVyIHNlbGVjdG9ycyB1c2VkIHRvIGRldGVybWluZSBpZiBhIG1vZGVsIHNob3VsZCBiZSBpbnNlcnRlZCBpbnRvIG9yIHJldHJpZXZlZCBmcm9tIHRoZSBjb250YWluZXIuXHJcbiAgICAgICAgdGhpcy5fX2ZpbHRlcnNfXyA9IEVtcHR5QXJyYXk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZW1hID0gc2NoZW1hIHx8IHRoaXMuY29uc3RydWN0b3Iuc2NoZW1hIHx8IHt9O1xyXG5cclxuICAgICAgICAvL1RoZSBwYXJzZXIgd2lsbCBoYW5kbGUgdGhlIGV2YWx1YXRpb24gb2YgaWRlbnRpZmllcnMgYWNjb3JkaW5nIHRvIHRoZSBjcml0ZXJpYSBzZXQgYnkgdGhlIF9fZmlsdGVyc19fIGxpc3QuIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5zY2hlbWEucGFyc2VyICYmIHRoaXMuc2NoZW1hLnBhcnNlciBpbnN0YW5jZW9mIFNjaGVtYVR5cGUpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZXIgPSB0aGlzLnNjaGVtYS5wYXJzZXJcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlciA9IG5ldyBTY2hlbWFUeXBlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmlkID0gXCJcIjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2NoZW1hLmlkZW50aWZpZXIgJiYgdHlwZW9mKHRoaXMuc2NoZW1hLmlkZW50aWZpZXIpID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IHRoaXMuc2NoZW1hLmlkZW50aWZpZXI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gdGhyb3cgKGBXcm9uZyBzY2hlbWEgaWRlbnRpZmllciB0eXBlIGdpdmVuIHRvIE1vZGVsQ29udGFpbmVyLiBFeHBlY3RlZCB0eXBlIFN0cmluZywgZ290OiAke3R5cGVvZih0aGlzLnNjaGVtYS5pZGVudGlmaWVyKX0hYCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh0aGlzLCB7XHJcbiAgICAgICAgICAgIGdldDogKG9iaiwgcHJvcCwgdmFsKSA9PiAocHJvcCBpbiBvYmopID8gb2JqW3Byb3BdIDogb2JqLmdldCh2YWwpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuc2NoZW1hID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5fX2ZpbHRlcnNfXyA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNvdXJjZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNvdXJjZS5fX3VubGlua19fKHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEdldCB0aGUgbnVtYmVyIG9mIE1vZGVscyBoZWxkIGluIHRoaXMgTW9kZWxDb250YWluZXJcclxuXHJcbiAgICAgICAgQHJldHVybnMge051bWJlcn1cclxuICAgICovXHJcbiAgICBnZXQgbGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBsZW5ndGgoZSkge1xyXG4gICAgICAgIC8vTlVMTCBmdW5jdGlvbi4gRG8gTm90IE92ZXJyaWRlIVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAgICBSZXR1cm5zIGEgTW9kZWxDb250YWluZXIgdHlwZSB0byBzdG9yZSB0aGUgcmVzdWx0cyBvZiBhIGdldCgpLlxyXG4gICAgKi9cclxuICAgIF9fZGVmYXVsdFJldHVybl9fKFVTRV9BUlJBWSkge1xyXG4gICAgICAgIGlmIChVU0VfQVJSQVkpIHJldHVybiBuZXcgTUNBcnJheTtcclxuXHJcbiAgICAgICAgbGV0IG4gPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnNjaGVtYSk7XHJcblxyXG4gICAgICAgIHRoaXMuX19saW5rX18obik7XHJcblxyXG4gICAgICAgIHJldHVybiBuO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEFycmF5IGVtdWxhdGluZyBrbHVkZ2VcclxuXHJcbiAgICAgICAgQHJldHVybnMgVGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoaXMuaW5zZXJ0XHJcbiAgICAqL1xyXG4gICAgcHVzaChpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0KGl0ZW0sIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJldHJpZXZlcyBhIGxpc3Qgb2YgaXRlbXMgdGhhdCBtYXRjaCB0aGUgdGVybS90ZXJtcy4gXHJcblxyXG4gICAgICAgIEBwYXJhbSB7KEFycmF5fFNlYXJjaFRlcm0pfSB0ZXJtIC0gQSBzaW5nbGUgdGVybSBvciBhIHNldCBvZiB0ZXJtcyB0byBsb29rIGZvciBpbiB0aGUgTW9kZWxDb250YWluZXIuIFxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IF9fcmV0dXJuX2RhdGFfXyAtIFNldCB0byB0cnVlIGJ5IGEgc291cmNlIENvbnRhaW5lciBpZiBpdCBpcyBjYWxsaW5nIGEgU3ViQ29udGFpbmVyIGluc2VydCBmdW5jdGlvbi4gXHJcblxyXG4gICAgICAgIEByZXR1cm5zIHsoTW9kZWxDb250YWluZXJ8QXJyYXkpfSBSZXR1cm5zIGEgTW9kZWwgY29udGFpbmVyIG9yIGFuIEFycmF5IG9mIE1vZGVscyBtYXRjaGluZyB0aGUgc2VhcmNoIHRlcm1zLiBcclxuICAgICovXHJcbiAgICBnZXQodGVybSwgX19yZXR1cm5fZGF0YV9fKSB7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBudWxsO1xyXG5cclxuICAgICAgICBsZXQgVVNFX0FSUkFZID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKHRlcm0pIHtcclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIGlmIChfX3JldHVybl9kYXRhX18pIHtcclxuICAgICAgICAgICAgICAgIG91dCA9IF9fcmV0dXJuX2RhdGFfXztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoX19yZXR1cm5fZGF0YV9fID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIFVTRV9BUlJBWSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zb3VyY2UpXHJcbiAgICAgICAgICAgICAgICAgICAgVVNFX0FSUkFZID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgb3V0ID0gdGhpcy5fX2RlZmF1bHRSZXR1cm5fXyhVU0VfQVJSQVkpO1xyXG4gICAgICAgICAgICAgICAgb3V0Ll9fc2V0RmlsdGVyc19fKHRlcm0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIG91dCA9IChfX3JldHVybl9kYXRhX18pID8gX19yZXR1cm5fZGF0YV9fIDogdGhpcy5fX2RlZmF1bHRSZXR1cm5fXyhVU0VfQVJSQVkpO1xyXG5cclxuICAgICAgICBpZiAoIXRlcm0pXHJcbiAgICAgICAgICAgIHRoaXMuX19nZXRBbGxfXyhvdXQpO1xyXG4gICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgbGV0IHRlcm1zID0gdGVybTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGVybSBpbnN0YW5jZW9mIEFycmF5KVxyXG4gICAgICAgICAgICAgICAgdGVybXMgPSBbdGVybV07XHJcblxyXG4gICAgICAgICAgICAvL05lZWQgdG8gY29udmVydCB0ZXJtcyBpbnRvIGEgZm9ybSB0aGF0IHdpbGwgd29yayBmb3IgdGhlIGlkZW50aWZpZXIgdHlwZVxyXG4gICAgICAgICAgICB0ZXJtcyA9IHRlcm1zLm1hcCh0ID0+IHRoaXMucGFyc2VyLnBhcnNlKHQpKTtcclxuXHJcblxyXG4gICAgICAgICAgICB0aGlzLl9fZ2V0X18odGVybXMsIG91dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgSW5zZXJ0cyBhbiBpdGVtIGludG8gdGhlIGNvbnRhaW5lci4gSWYgdGhlIGl0ZW0gaXMgbm90IGEge01vZGVsfSwgYW4gYXR0ZW1wdCB3aWxsIGJlIG1hZGUgdG8gY29udmVydCB0aGUgZGF0YSBpbiB0aGUgT2JqZWN0IGludG8gYSBNb2RlbC5cclxuICAgICAgICBJZiB0aGUgaXRlbSBpcyBhbiBhcnJheSBvZiBvYmplY3RzLCBlYWNoIG9iamVjdCBpbiB0aGUgYXJyYXkgd2lsbCBiZSBjb25zaWRlcmVkIHNlcGFyYXRlbHkuIFxyXG5cclxuICAgICAgICBAcGFyYW0ge09iamVjdH0gaXRlbSAtIEFuIE9iamVjdCB0byBpbnNlcnQgaW50byB0aGUgY29udGFpbmVyLiBPbiBvZiB0aGUgcHJvcGVydGllcyBvZiB0aGUgb2JqZWN0IE1VU1QgaGF2ZSB0aGUgc2FtZSBuYW1lIGFzIHRoZSBNb2RlbENvbnRhaW5lcidzIFxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IGl0ZW0gLSBBbiBhcnJheSBvZiBPYmplY3RzIHRvIGluc2VydCBpbnRvIHRoZSBjb250YWluZXIuXHJcbiAgICAgICAgQHBhcmFtIHtCb29sZWFufSBfX0ZST01fU09VUkNFX18gLSBTZXQgdG8gdHJ1ZSBieSBhIHNvdXJjZSBDb250YWluZXIgaWYgaXQgaXMgY2FsbGluZyBhIFN1YkNvbnRhaW5lciBpbnNlcnQgZnVuY3Rpb24uIFxyXG5cclxuICAgICAgICBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFuIGluc2VydGlvbiBpbnRvIHRoZSBNb2RlbENvbnRhaW5lciBvY2N1cnJlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxyXG4gICAgKi9cclxuICAgIGluc2VydChpdGVtLCBfX0ZST01fU09VUkNFX18gPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBsZXQgYWRkX2xpc3QgPSAodGhpcy5maXJzdF92aWV3KSA/IFtdIDogbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoIV9fRlJPTV9TT1VSQ0VfXyAmJiB0aGlzLnNvdXJjZSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlLmluc2VydChpdGVtKTtcclxuXHJcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW0ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fX2luc2VydFN1Yl9fKGl0ZW1baV0sIG91dCwgYWRkX2xpc3QpKVxyXG4gICAgICAgICAgICAgICAgICAgIG91dCA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpdGVtKVxyXG4gICAgICAgICAgICBvdXQgPSB0aGlzLl9faW5zZXJ0U3ViX18oaXRlbSwgb3V0LCBhZGRfbGlzdCk7XHJcblxyXG5cclxuICAgICAgICBpZiAoYWRkX2xpc3QgJiYgYWRkX2xpc3QubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaWV3c0FkZGVkKGFkZF9saXN0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBBIHN1YnNldCBvZiB0aGUgaW5zZXJ0IGZ1bmN0aW9uLiBIYW5kbGVzIHRoZSB0ZXN0IG9mIGlkZW50aWZpZXIsIHRoZSBjb252ZXJzaW9uIG9mIGFuIE9iamVjdCBpbnRvIGEgTW9kZWwsIGFuZCB0aGUgY2FsbGluZyBvZiB0aGUgaW50ZXJuYWwgX19pbnNlcnRfXyBmdW5jdGlvbi5cclxuICAgICovXHJcbiAgICBfX2luc2VydFN1Yl9fKGl0ZW0sIG91dCwgYWRkX2xpc3QpIHtcclxuXHJcbiAgICAgICAgbGV0IG1vZGVsID0gaXRlbTtcclxuXHJcbiAgICAgICAgdmFyIGlkZW50aWZpZXIgPSB0aGlzLl9fZ2V0SWRlbnRpZmllcl9fKGl0ZW0pO1xyXG5cclxuICAgICAgICBpZiAoaWRlbnRpZmllciAhPSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghKG1vZGVsIGluc3RhbmNlb2YgdGhpcy5zY2hlbWEubW9kZWwpICYmICEobW9kZWwgPSBtb2RlbC5fX19fc2VsZl9fX18pKSB7XHJcbiAgICAgICAgICAgICAgICBtb2RlbCA9IG5ldyB0aGlzLnNjaGVtYS5tb2RlbCgpO1xyXG4gICAgICAgICAgICAgICAgbW9kZWwuYWRkKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZGVudGlmaWVyID0gdGhpcy5fX2dldElkZW50aWZpZXJfXyhtb2RlbCwgdGhpcy5fX2ZpbHRlcnNfXyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllcikge1xyXG4gICAgICAgICAgICAgICAgb3V0ID0gdGhpcy5fX2luc2VydF9fKG1vZGVsLCBhZGRfbGlzdCwgaWRlbnRpZmllcilcclxuICAgICAgICAgICAgICAgIHRoaXMuX19saW5rc0luc2VydF9fKG1vZGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmVtb3ZlcyBhbiBpdGVtIGZyb20gdGhlIGNvbnRhaW5lci4gXHJcbiAgICAqL1xyXG4gICAgcmVtb3ZlKHRlcm0sIF9fRlJPTV9TT1VSQ0VfXyA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGxldCB0ZXJtcyA9IHRlcm07XHJcblxyXG4gICAgICAgIGlmICghX19GUk9NX1NPVVJDRV9fICYmIHRoaXMuc291cmNlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRlcm0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2UucmVtb3ZlKHRoaXMuX19maWx0ZXJzX18pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2UucmVtb3ZlKHRlcm0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG91dF9jb250YWluZXIgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKCF0ZXJtKVxyXG4gICAgICAgICAgICB0aGlzLl9fcmVtb3ZlQWxsX18oKTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCF0ZXJtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHRlcm1zID0gW3Rlcm1dO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL05lZWQgdG8gY29udmVydCB0ZXJtcyBpbnRvIGEgZm9ybSB0aGF0IHdpbGwgd29yayBmb3IgdGhlIGlkZW50aWZpZXIgdHlwZVxyXG4gICAgICAgICAgICB0ZXJtcyA9IHRlcm1zLm1hcCh0ID0+IHRoaXMucGFyc2VyLnBhcnNlKHQpKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX19yZW1vdmVfXyh0ZXJtcywgb3V0X2NvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9fbGlua3NSZW1vdmVfXyh0ZXJtcyk7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfY29udGFpbmVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJlbW92ZXMgYSBNb2RlbENvbnRhaW5lciBmcm9tIGxpc3Qgb2YgbGlua2VkIGNvbnRhaW5lcnMuIFxyXG5cclxuICAgICAgICBAcGFyYW0ge01vZGVsQ29udGFpbmVyfSBjb250YWluZXIgLSBUaGUgTW9kZWxDb250YWluZXIgaW5zdGFuY2UgdG8gcmVtb3ZlIGZyb20gdGhlIHNldCBvZiBsaW5rZWQgY29udGFpbmVycy4gTXVzdCBiZSBhIG1lbWJlciBvZiB0aGUgbGlua2VkIGNvbnRhaW5lcnMuIFxyXG4gICAgKi9cclxuICAgIF9fdW5saW5rX18oY29udGFpbmVyKSB7XHJcblxyXG4gICAgICAgIGlmIChjb250YWluZXIgaW5zdGFuY2VvZiBNb2RlbENvbnRhaW5lciAmJiBjb250YWluZXIuc291cmNlID09IHRoaXMpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb250YWluZXIgPT0gdGhpcy5maXJzdF9saW5rKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJzdF9saW5rID0gY29udGFpbmVyLm5leHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGFpbmVyLm5leHQpXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIubmV4dC5wcmV2ID0gY29udGFpbmVyLnByZXY7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGFpbmVyLnByZXYpXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHJldi5uZXh0ID0gY29udGFpbmVyLm5leHQ7XHJcblxyXG4gICAgICAgICAgICBjb250YWluZXIuc291cmNlID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQWRkcyBhIGNvbnRhaW5lciB0byB0aGUgbGlzdCBvZiB0cmFja2VkIGNvbnRhaW5lcnMuIFxyXG5cclxuICAgICAgICBAcGFyYW0ge01vZGVsQ29udGFpbmVyfSBjb250YWluZXIgLSBUaGUgTW9kZWxDb250YWluZXIgaW5zdGFuY2UgdG8gYWRkIHRoZSBzZXQgb2YgbGlua2VkIGNvbnRhaW5lcnMuXHJcbiAgICAqL1xyXG4gICAgX19saW5rX18oY29udGFpbmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbnRhaW5lciBpbnN0YW5jZW9mIE1vZGVsQ29udGFpbmVyICYmICFjb250YWluZXIuc291cmNlKSB7XHJcblxyXG4gICAgICAgICAgICBjb250YWluZXIuc291cmNlID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5uZXh0ID0gdGhpcy5maXJzdF9saW5rO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZmlyc3RfbGluaylcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RfbGluay5wcmV2ID0gY29udGFpbmVyO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5maXJzdF9saW5rID0gY29udGFpbmVyO1xyXG5cclxuICAgICAgICAgICAgY29udGFpbmVyLnBpbiA9ICgoY29udGFpbmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuX191bmxpbmtfXygpO1xyXG4gICAgICAgICAgICAgICAgfSwgNTApXHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghY29udGFpbmVyLnNvdXJjZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiZmFpbGVkIHRvIGNsZWFyIHRoZSBkZXN0cnVjdGlvbiBvZiBjb250YWluZXIgaW4gdGltZSFcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKGNvbnRhaW5lcilcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX19saW5rc1JlbW92ZV9fKHRlcm1zKSB7XHJcbiAgICAgICAgbGV0IGEgPSB0aGlzLmZpcnN0X2xpbms7XHJcbiAgICAgICAgd2hpbGUgKGEpIHtcclxuICAgICAgICAgICAgYS5yZW1vdmUodGVybXMsIHRydWUpO1xyXG4gICAgICAgICAgICBhID0gYS5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfX2xpbmtzSW5zZXJ0X18oaXRlbSkge1xyXG4gICAgICAgIGxldCBhID0gdGhpcy5maXJzdF9saW5rO1xyXG4gICAgICAgIHdoaWxlIChhKSB7XHJcbiAgICAgICAgICAgIGEuaW5zZXJ0KGl0ZW0sIHRydWUpO1xyXG4gICAgICAgICAgICBhID0gYS5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZW1vdmVzIGFueSBpdGVtcyBpbiB0aGUgbW9kZWwgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheSBcIml0ZW1zXCIsIGFuZCBhZGRzIGFueSBpdGVtcyBpbiBpdGVtcyBub3QgYWxyZWFkeSBpbiB0aGUgTW9kZWxDb250YWluZXIuXHJcblxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IGl0ZW1zIC0gQW4gYXJyYXkgb2YgaWRlbnRpZmlhYmxlIE1vZGVscyBvciBvYmplY3RzLiBcclxuICAgICovXHJcbiAgICBjdWxsKGl0ZW1zKSB7XHJcblxyXG4gICAgICAgIGxldCBoYXNoX3RhYmxlID0ge307XHJcbiAgICAgICAgbGV0IGV4aXN0aW5nX2l0ZW1zID0gX19nZXRBbGxfXyhbXSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIGxldCBsb2FkSGFzaCA9IChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5mb3JFYWNoKChlKSA9PiBsb2FkSGFzaChlKSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaWRlbnRpZmllciA9IHRoaXMuX19nZXRJZGVudGlmaWVyX18oaXRlbSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllcilcclxuICAgICAgICAgICAgICAgIGhhc2hfdGFibGVbaWRlbnRpZmllcl0gPSBpdGVtO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxvYWRIYXNoKGl0ZW1zKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleGlzdGluZ19pdGVtcy5sZW50aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlX2l0ZW0gPSBleGlzdGluZ19pdGVtc1tpXTtcclxuICAgICAgICAgICAgaWYgKCFleGlzdGluZ19pdGVtc1t0aGlzLl9fZ2V0SWRlbnRpZmllcl9fKGVfaXRlbSldKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fX3JlbW92ZV9fKGVfaXRlbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluc2VydChpdGVtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgX19zZXRGaWx0ZXJzX18odGVybSkge1xyXG4gICAgICAgIGlmICh0ZXJtIGluc3RhbmNlb2YgQXJyYXkpXHJcbiAgICAgICAgICAgIHRoaXMuX19maWx0ZXJzX18gPSB0aGlzLl9fZmlsdGVyc19fLmNvbmNhdCh0ZXJtLm1hcCh0ID0+IHRoaXMucGFyc2VyLnBhcnNlKHQpKSlcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuX19maWx0ZXJzX18ucHVzaCh0aGlzLnBhcnNlci5wYXJzZSh0ZXJtKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJldHVybnMgdHJ1ZSBpZiB0aGUgaWRlbnRpZmllciBtYXRjaGVzIGEgcHJlZGVmaW5lZCBmaWx0ZXIgcGF0dGVybiwgd2hpY2ggaXMgZXZhbHVhdGVkIGJ5IHRoaXMucGFyc2VyLiBJZiBhIFxyXG4gICAgICAgIHBhcnNlciB3YXMgbm90IHByZXNlbnQgdGhlIE1vZGVsQ29udGFpbmVycyBzY2hlbWEsIHRoZW4gdGhlIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRydWUgdXBvbiBldmVyeSBldmFsdWF0aW9uLlxyXG4gICAgKi9cclxuICAgIF9fZmlsdGVySWRlbnRpZmllcl9fKGlkZW50aWZpZXIsIGZpbHRlcnMpIHtcclxuICAgICAgICBpZiAoZmlsdGVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlci5maWx0ZXIoaWRlbnRpZmllciwgZmlsdGVycyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJldHVybnMgdGhlIElkZW50aWZpZXIgcHJvcGVydHkgdmFsdWUgaWYgaXQgZXhpc3RzIGluIHRoZSBpdGVtLiBJZiBhbiBhcnJheSB2YWx1ZSBmb3IgZmlsdGVycyBpcyBwYXNzZWQsIHRoZW4gdW5kZWZpbmVkIGlzIHJldHVybmVkIGlmIHRoZSBpZGVudGlmaWVyIHZhbHVlIGRvZXMgbm90IHBhc3MgZmlsdGVyaW5nIGNyaXRlcmlhLlxyXG4gICAgICAgIEBwYXJhbSB7KE9iamVjdHxNb2RlbCl9IGl0ZW1cclxuICAgICAgICBAcGFyYW0ge0FycmF5fSBmaWx0ZXJzIC0gQW4gYXJyYXkgb2YgZmlsdGVyIHRlcm1zIHRvIHRlc3Qgd2hldGhlciB0aGUgaWRlbnRpZmllciBtZWV0cyB0aGUgY3JpdGVyaWEgdG8gYmUgaGFuZGxlZCBieSB0aGUgTW9kZWxDb250YWluZXIuXHJcbiAgICAqL1xyXG4gICAgX19nZXRJZGVudGlmaWVyX18oaXRlbSwgZmlsdGVycyA9IG51bGwpIHtcclxuXHJcbiAgICAgICAgbGV0IGlkZW50aWZpZXIgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mKGl0ZW0pID09IFwib2JqZWN0XCIpXHJcbiAgICAgICAgICAgIGlkZW50aWZpZXIgPSBpdGVtW3RoaXMuc2NoZW1hLmlkZW50aWZpZXJdO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgaWRlbnRpZmllciA9IGl0ZW07XHJcblxyXG4gICAgICAgIGlmIChpZGVudGlmaWVyKVxyXG4gICAgICAgICAgICBpZGVudGlmaWVyID0gdGhpcy5wYXJzZXIucGFyc2UoaWRlbnRpZmllcik7XHJcblxyXG4gICAgICAgIGlmIChmaWx0ZXJzICYmIGlkZW50aWZpZXIpXHJcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5fX2ZpbHRlcklkZW50aWZpZXJfXyhpZGVudGlmaWVyLCBmaWx0ZXJzKSkgPyBpZGVudGlmaWVyIDogdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICByZXR1cm4gaWRlbnRpZmllcjtcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgICAgT1ZFUlJJREUgU0VDVElPTiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgIFxyXG4gICAgICAgIEFsbCBvZiB0aGVzZSBmdW5jdGlvbnMgc2hvdWxkIGJlIG92ZXJyaWRkZW4gYnkgaW5oZXJpdGluZyBjbGFzc2VzXHJcbiAgICAqL1xyXG5cclxuICAgIF9faW5zZXJ0X18oaXRlbSwgYWRkX2xpc3QsIGlkZW50aWZpZXIpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgX19nZXRfXyhpdGVtLCBfX3JldHVybl9kYXRhX18pIHtcclxuICAgICAgICByZXR1cm4gX19yZXR1cm5fZGF0YV9fO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0QWxsX18oX19yZXR1cm5fZGF0YV9fKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fcmV0dXJuX2RhdGFfXztcclxuICAgIH1cclxuXHJcbiAgICBfX3JlbW92ZUFsbF9fKCkge1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICBfX3JlbW92ZV9fKGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRU5EIE9WRVJSSURFICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbn1cclxuXHJcbmNsYXNzIE11bHRpSW5kZXhlZENvbnRhaW5lciBleHRlbmRzIE1vZGVsQ29udGFpbmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHNjaGVtYSkge1xyXG5cclxuICAgICAgICBzdXBlcih7XHJcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IFwiaW5kZXhlZFwiLFxyXG4gICAgICAgICAgICBtb2RlbDogc2NoZW1hLm1vZGVsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZW1hID0gc2NoZW1hO1xyXG4gICAgICAgIHRoaXMuaW5kZXhlcyA9IHt9O1xyXG4gICAgICAgIHRoaXMuZmlyc3RfaW5kZXggPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmFkZEluZGV4KHNjaGVtYS5pbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoZSBmaXJzdCBpbmRleCBpbiB0aGlzIGNvbnRhaW5lci4gXHJcbiAgICAqL1xyXG4gICAgZ2V0IGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5maXJzdF9pbmRleC5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgSW5zZXJ0IGEgbmV3IE1vZGVsQ29udGFpbmVyIGludG8gdGhlIGluZGV4IHRocm91Z2ggdGhlIHNjaGVtYS4gIFxyXG4gICAgKi9cclxuICAgIGFkZEluZGV4KGluZGV4X3NjaGVtYSkge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBuYW1lIGluIGluZGV4X3NjaGVtYSkge1xyXG4gICAgICAgICAgICBsZXQgc2NoZW1lID0gaW5kZXhfc2NoZW1hW25hbWVdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNjaGVtZS5jb250YWluZXIgJiYgIXRoaXMuaW5kZXhlc1tuYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleGVzW25hbWVdID0gbmV3IHNjaGVtZS5jb250YWluZXIoc2NoZW1lLnNjaGVtYSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlyc3RfaW5kZXgpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleGVzW25hbWVdLmluc2VydCh0aGlzLmZpcnN0X2luZGV4Ll9fZ2V0QWxsX18oKSk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdF9pbmRleCA9IHRoaXMuaW5kZXhlc1tuYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQoaXRlbSwgX19yZXR1cm5fZGF0YV9fKSB7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBpdGVtKVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXhlc1tuYW1lXSlcclxuICAgICAgICAgICAgICAgICAgICBvdXRbbmFtZV0gPSB0aGlzLmluZGV4ZXNbbmFtZV0uZ2V0KGl0ZW1bbmFtZV0sIF9fcmV0dXJuX2RhdGFfXyk7XHJcbiAgICAgICAgfSBlbHNlXHJcblxyXG4gICAgICAgICAgICBvdXQgPSB0aGlzLmZpcnN0X2luZGV4LmdldChudWxsKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlKGl0ZW0pIHtcclxuXHJcbiAgICAgICAgdmFyIG91dCA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBhIGluIGl0ZW0pXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmluZGV4ZXNbYV0pXHJcbiAgICAgICAgICAgICAgICBvdXQgPSBvdXQuY29uY2F0KHRoaXMuaW5kZXhlc1thXS5yZW1vdmUoaXRlbVthXSkpO1xyXG5cclxuICAgICAgICAvKiBSZXBsYXkgaXRlbXMgYWdhaW5zdCBpbmRleGVzIHRvIGluc3VyZSBhbGwgaXRlbXMgaGF2ZSBiZWVuIHJlbW92ZWQgZnJvbSBhbGwgaW5kZXhlcyAqL1xyXG5cclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuaW5kZXhlcy5sZW5ndGg7IGorKylcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvdXQubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ZXNbal0ucmVtb3ZlKG91dFtpXSk7XHJcblxyXG4gICAgICAgIC8vVXBkYXRlIGFsbCB2aWV3c1xyXG4gICAgICAgIGlmIChvdXQubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaWV3c1JlbW92ZWQob3V0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBfX2luc2VydF9fKG1vZGVsLCBhZGRfbGlzdCwgaWRlbnRpZmllcikge1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gZmFsc2VcclxuXHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLmluZGV4ZXMpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuaW5kZXhlc1tuYW1lXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbmRleC5pbnNlcnQobW9kZWwpKVxyXG4gICAgICAgICAgICAgICAgb3V0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgLy9lbHNlXHJcbiAgICAgICAgICAgIC8vICAgIGNvbnNvbGUud2FybihgSW5kZXhlZCBjb250YWluZXIgJHthfSAke2luZGV4fSBmYWlsZWQgdG8gaW5zZXJ0OmAsIG1vZGVsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvdXQpXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlld3ModGhpcy5maXJzdF9pbmRleC5nZXQoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAgICBAcHJpdmF0ZSBcclxuICAgICovXHJcbiAgICBfX3JlbW92ZV9fKGl0ZW0pIHtcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBuYW1lIGluIHRoaXMuaW5kZXhlcykge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmluZGV4ZXNbbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChpbmRleC5yZW1vdmUoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICBvdXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBfX3JlbW92ZUFsbF9fKCkge1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gdGhpcy5pbmRleGVzKSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleC5fX3JlbW92ZUFsbF9fKCkpXHJcbiAgICAgICAgICAgICAgICBvdXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgT3ZlcnJpZGVzIE1vZGVsIGNvbnRhaW5lciBkZWZhdWx0IF9fZ2V0SWRlbnRpZmllcl9fIHRvIGZvcmNlIGl0ZW0gdG8gcGFzcy5cclxuICAgICAgICBAcHJpdmF0ZSBcclxuICAgICovXHJcbiAgICBfX2dldElkZW50aWZpZXJfXyhpdGVtLCBmaWx0ZXJzID0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpIHtcclxuICAgICAgICByZXR1cm4gXCJbXVwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgTUNBcnJheSxcclxuICAgIE1vZGVsQ29udGFpbmVyLFxyXG4gICAgTXVsdGlJbmRleGVkQ29udGFpbmVyLFxyXG4gICAgYXJyYXlfY29udGFpbmVyXHJcbn07IiwiaW1wb3J0IHtcclxuICAgIE1vZGVsQ29udGFpbmVyLFxyXG4gICAgTUNBcnJheVxyXG59IGZyb20gXCIuL21vZGVsX2NvbnRhaW5lclwiXHJcblxyXG5cclxuLyoqXHJcbiAqL1xyXG5jbGFzcyBBcnJheU1vZGVsQ29udGFpbmVyIGV4dGVuZHMgTW9kZWxDb250YWluZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjaGVtYSkge1xyXG4gICAgICAgIHN1cGVyKHNjaGVtYSk7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhID0gbnVsbDtcclxuXHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsZW5ndGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgX19kZWZhdWx0UmV0dXJuX18oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc291cmNlKSByZXR1cm4gbmV3IE1DQXJyYXk7XHJcblxyXG4gICAgICAgIGxldCBuID0gbmV3IEFycmF5TW9kZWxDb250YWluZXIodGhpcy5zY2hlbWEpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbGlua19fKG4pO1xyXG5cclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuXHJcbiAgICBfX2luc2VydF9fKG1vZGVsLCBhZGRfbGlzdCwgaWRlbnRpZmllcikge1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuZGF0YS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBvYmogPSB0aGlzLmRhdGFbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fX2dldElkZW50aWZpZXJfXyhvYmopID09IGlkZW50aWZpZXIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBvYmouYWRkKG1vZGVsKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vTW9kZWwgbm90IGFkZGVkIHRvIENvbnRhaW5lci4gTW9kZWwganVzdCB1cGRhdGVkLlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRhdGEucHVzaChtb2RlbCk7XHJcblxyXG4gICAgICAgIGlmIChhZGRfbGlzdCkgYWRkX2xpc3QucHVzaChtb2RlbCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlOyAvLyBNb2RlbCBhZGRlZCB0byBDb250YWluZXIuXHJcbiAgICB9XHJcblxyXG4gICAgX19nZXRfXyh0ZXJtLCByZXR1cm5fZGF0YSkge1xyXG5cclxuICAgICAgICBsZXQgdGVybXMgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAodGVybSlcclxuICAgICAgICAgICAgaWYgKHRlcm0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgdGVybXMgPSB0ZXJtO1xyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIHRlcm1zID0gW3Rlcm1dO1xyXG5cclxuXHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5kYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgb2JqID0gdGhpcy5kYXRhW2ldO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fX2dldElkZW50aWZpZXJfXyhvYmosIHRlcm1zKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuX2RhdGEucHVzaChvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmV0dXJuX2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgX19nZXRBbGxfXyhyZXR1cm5fZGF0YSkge1xyXG5cclxuICAgICAgICB0aGlzLmRhdGEuZm9yRWFjaCgobSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm5fZGF0YS5wdXNoKG0pXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuIHJldHVybl9kYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcmVtb3ZlQWxsX18oKSB7XHJcbiAgICAgICAgbGV0IGl0ZW1zID0gdGhpcy5kYXRhLm1hcChkID0+IGQpIHx8IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmRhdGEubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcmVtb3ZlX18odGVybSwgb3V0X2NvbnRhaW5lcikge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuZGF0YS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG9iaiA9IHRoaXMuZGF0YVtpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9fZ2V0SWRlbnRpZmllcl9fKG9iaiwgdGVybSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zcGxpY2UoaSwgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbC0tO1xyXG4gICAgICAgICAgICAgICAgaS0tO1xyXG5cclxuICAgICAgICAgICAgICAgIG91dF9jb250YWluZXIucHVzaChvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIEFycmF5TW9kZWxDb250YWluZXJcclxufSIsImltcG9ydCB7XHJcbiAgICBNb2RlbENvbnRhaW5lcixcclxuICAgIE1DQXJyYXlcclxufSBmcm9tIFwiLi9tb2RlbF9jb250YWluZXJcIlxyXG5cclxuY2xhc3MgQlRyZWVNb2RlbENvbnRhaW5lciBleHRlbmRzIE1vZGVsQ29udGFpbmVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY2hlbWEpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoc2NoZW1hKTtcclxuXHJcbiAgICAgICAgdGhpcy5yb290ID0gbnVsbDtcclxuICAgICAgICB0aGlzLm1pbiA9IDEwO1xyXG4gICAgICAgIHRoaXMubWF4ID0gMjA7XHJcbiAgICAgICAgdGhpcy5zaXplID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJvb3QpXHJcbiAgICAgICAgICAgIHRoaXMucm9vdC5kZXN0cnVjdG9yKCk7XHJcblxyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgX19pbnNlcnRfXyhtb2RlbCwgYWRkX2xpc3QsIGlkZW50aWZpZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHtcclxuICAgICAgICAgICAgYWRkZWQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnJvb3QpXHJcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IG5ldyBCdHJlZU5vZGUodHJ1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMucm9vdCA9IHRoaXMucm9vdC5pbnNlcnQoaWRlbnRpZmllciwgbW9kZWwsIHRoaXMubWF4LCB0cnVlLCByZXN1bHQpLm5ld25vZGU7XHJcblxyXG4gICAgICAgIGlmIChhZGRfbGlzdCkgYWRkX2xpc3QucHVzaChtb2RlbCk7XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHQuYWRkZWQpXHJcbiAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0LmFkZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0X18odGVybXMsIF9fcmV0dXJuX2RhdGFfXykge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yb290ICYmIHRlcm1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgaWYgKHRlcm1zLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QuZ2V0KHBhcnNlRmxvYXQodGVybXNbMF0pLCBwYXJzZUZsb2F0KHRlcm1zWzBdKSwgX19yZXR1cm5fZGF0YV9fKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0ZXJtcy5sZW5ndGggPCAzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QuZ2V0KHBhcnNlRmxvYXQodGVybXNbMF0pLCBwYXJzZUZsb2F0KHRlcm1zWzFdKSwgX19yZXR1cm5fZGF0YV9fKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGVybXMubGVuZ3RoIC0gMTsgaSA+IGw7IGkgKz0gMilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QuZ2V0KHBhcnNlRmxvYXQodGVybXNbaV0pLCBwYXJzZUZsb2F0KHRlcm1zW2kgKyAxXSksIF9fcmV0dXJuX2RhdGFfXyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBfX3JldHVybl9kYXRhX187XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVfXyh0ZXJtcywgb3V0X2NvbnRhaW5lcikge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSAwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yb290ICYmIHRlcm1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgaWYgKHRlcm1zLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbyA9IHRoaXMucm9vdC5yZW1vdmUodGVybXNbMF0sIHRlcm1zWzBdLCB0cnVlLCB0aGlzLm1pbiwgb3V0X2NvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBvLm91dDtcclxuICAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IG8ub3V0X25vZGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGVybXMubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG8gPSB0aGlzLnJvb3QucmVtb3ZlKHRlcm1zWzBdLCB0ZXJtc1sxXSwgdHJ1ZSwgdGhpcy5taW4sIG91dF9jb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID1vLm91dDtcclxuICAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IG8ub3V0X25vZGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRlcm1zLmxlbmd0aCAtIDE7IGkgPiBsOyBpICs9IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbyA9IHRoaXMucm9vdC5yZW1vdmUodGVybXNbaV0sIHRlcm1zW2kgKyAxXSwgdHJ1ZSwgdGhpcy5taW4sIG91dF9jb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IG8ub3V0O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IG8ub3V0X25vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2l6ZSAtPSByZXN1bHQ7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQgIT09IDA7XHJcbiAgICB9XHJcblxyXG4gICAgX19nZXRBbGxfXyhfX3JldHVybl9kYXRhX18pIHtcclxuICAgICAgICBpZiAodGhpcy5yb290KVxyXG4gICAgICAgICAgICB0aGlzLnJvb3QuZ2V0KC1JbmZpbml0eSwgSW5maW5pdHksIF9fcmV0dXJuX2RhdGFfXyk7XHJcbiAgICAgICAgcmV0dXJuIF9fcmV0dXJuX2RhdGFfXztcclxuICAgIH1cclxuXHJcbiAgICBfX3JlbW92ZUFsbF9fKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJvb3QpXHJcbiAgICAgICAgICAgIHRoaXMucm9vdC5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgdGhpcy5yb290ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgbGV0IG91dF9kYXRhID0gW107XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJvb3QpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucm9vdC5nZXQoLUluZmluaXR5LCBJbmZpbml0eSwgb3V0X2RhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dF9kYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBCdHJlZU5vZGUge1xyXG4gICAgY29uc3RydWN0b3IoSVNfTEVBRiA9IGZhbHNlKSB7XHJcbiAgICAgICAgdGhpcy5MRUFGID0gSVNfTEVBRjtcclxuICAgICAgICB0aGlzLm5vZGVzID0gW107XHJcbiAgICAgICAgdGhpcy5rZXlzID0gW107XHJcbiAgICAgICAgdGhpcy5pdGVtcyA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5rZXlzID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLkxFQUYpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm5vZGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZXNbaV0uZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYmFsYW5jZUluc2VydChtYXhfc2l6ZSwgSVNfUk9PVCA9IGZhbHNlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMua2V5cy5sZW5ndGggPj0gbWF4X3NpemUpIHtcclxuICAgICAgICAgICAgLy9uZWVkIHRvIHNwbGl0IHRoaXMgdXAhXHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3bm9kZSA9IG5ldyBCdHJlZU5vZGUodGhpcy5MRUFGKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcGxpdCA9IChtYXhfc2l6ZSA+PiAxKSB8IDA7XHJcblxyXG4gICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5rZXlzW3NwbGl0XTtcclxuXHJcbiAgICAgICAgICAgIGxldCBsZWZ0X2tleXMgPSB0aGlzLmtleXMuc2xpY2UoMCwgc3BsaXQpO1xyXG4gICAgICAgICAgICBsZXQgbGVmdF9ub2RlcyA9IHRoaXMubm9kZXMuc2xpY2UoMCwgKHRoaXMuTEVBRikgPyBzcGxpdCA6IHNwbGl0ICsgMSlcclxuXHJcbiAgICAgICAgICAgIGxldCByaWdodF9rZXlzID0gdGhpcy5rZXlzLnNsaWNlKCh0aGlzLkxFQUYpID8gc3BsaXQgOiBzcGxpdCArIDEpO1xyXG4gICAgICAgICAgICBsZXQgcmlnaHRfbm9kZXMgPSB0aGlzLm5vZGVzLnNsaWNlKCh0aGlzLkxFQUYpID8gc3BsaXQgOiBzcGxpdCArIDEpO1xyXG5cclxuICAgICAgICAgICAgbmV3bm9kZS5rZXlzID0gcmlnaHRfa2V5cztcclxuICAgICAgICAgICAgbmV3bm9kZS5ub2RlcyA9IHJpZ2h0X25vZGVzO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5rZXlzID0gbGVmdF9rZXlzO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGVzID0gbGVmdF9ub2RlcztcclxuXHJcbiAgICAgICAgICAgIGlmIChJU19ST09UKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJvb3QgPSBuZXcgQnRyZWVOb2RlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcm9vdC5rZXlzLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgICAgIHJvb3Qubm9kZXMucHVzaCh0aGlzLCBuZXdub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld25vZGU6IHJvb3QsXHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXlcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBuZXdub2RlOiBuZXdub2RlLFxyXG4gICAgICAgICAgICAgICAga2V5OiBrZXlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmV3bm9kZTogdGhpcyxcclxuICAgICAgICAgICAga2V5OiAwXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBJbnNlcnRzIG1vZGVsIGludG8gdGhlIHRyZWUsIHNvcnRlZCBieSBpZGVudGlmaWVyLiBcclxuICAgICovXHJcbiAgICBpbnNlcnQoaWRlbnRpZmllciwgbW9kZWwsIG1heF9zaXplLCBJU19ST09UID0gZmFsc2UsIHJlc3VsdCkge1xyXG5cclxuICAgICAgICBsZXQgbCA9IHRoaXMua2V5cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5MRUFGKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgPCBrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXMubm9kZXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBvID0gbm9kZS5pbnNlcnQoaWRlbnRpZmllciwgbW9kZWwsIG1heF9zaXplLCBmYWxzZSwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQga2V5ciA9IG8ua2V5O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdub2RlID0gby5uZXdub2RlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ciA9PSB1bmRlZmluZWQpIGRlYnVnZ2VyXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdub2RlICE9IG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5rZXlzLnNwbGljZShpLCAwLCBrZXlyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2Rlcy5zcGxpY2UoaSArIDEsIDAsIG5ld25vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFsYW5jZUluc2VydChtYXhfc2l6ZSwgSVNfUk9PVCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlID0gdGhpcy5ub2Rlc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGxldCB7XHJcbiAgICAgICAgICAgICAgICBuZXdub2RlLFxyXG4gICAgICAgICAgICAgICAga2V5XHJcbiAgICAgICAgICAgIH0gPSBub2RlLmluc2VydChpZGVudGlmaWVyLCBtb2RlbCwgbWF4X3NpemUsIGZhbHNlLCByZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGtleSA9PSB1bmRlZmluZWQpIGRlYnVnZ2VyXHJcblxyXG4gICAgICAgICAgICBpZiAobmV3bm9kZSAhPSBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtleXMucHVzaChrZXkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2Rlcy5wdXNoKG5ld25vZGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iYWxhbmNlSW5zZXJ0KG1heF9zaXplLCBJU19ST09UKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5rZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaWRlbnRpZmllciA9PSBrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVzW2ldLmFkZChrZXkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQuYWRkZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3bm9kZTogdGhpcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBpZGVudGlmaWVyXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaWRlbnRpZmllciA8IGtleSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmtleXMuc3BsaWNlKGksIDAsIGlkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZXMuc3BsaWNlKGksIDAsIG1vZGVsKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFsYW5jZUluc2VydChtYXhfc2l6ZSwgSVNfUk9PVCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMua2V5cy5wdXNoKGlkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGVzLnB1c2gobW9kZWwpO1xyXG5cclxuICAgICAgICAgICAgcmVzdWx0LmFkZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJhbGFuY2VJbnNlcnQobWF4X3NpemUsIElTX1JPT1QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmV3bm9kZTogdGhpcyxcclxuICAgICAgICAgICAga2V5OiBpZGVudGlmaWVyLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYmFsYW5jZVJlbW92ZShpbmRleCwgbWluX3NpemUpIHtcclxuICAgICAgICBsZXQgbGVmdCA9IHRoaXMubm9kZXNbaW5kZXggLSAxXTtcclxuICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLm5vZGVzW2luZGV4ICsgMV07XHJcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGVzW2luZGV4XTtcclxuXHJcbiAgICAgICAgLy9MZWZ0IHJvdGF0ZVxyXG4gICAgICAgIGlmIChsZWZ0ICYmIGxlZnQua2V5cy5sZW5ndGggPiBtaW5fc2l6ZSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IGxrID0gbGVmdC5rZXlzLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGxuID0gbGVmdC5ub2Rlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBub2RlLmtleXMudW5zaGlmdCgobm9kZS5MRUFGKSA/IGxlZnQua2V5c1tsayAtIDFdIDogdGhpcy5rZXlzW2luZGV4IC0gMV0pO1xyXG4gICAgICAgICAgICBub2RlLm5vZGVzLnVuc2hpZnQobGVmdC5ub2Rlc1tsbiAtIDFdKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMua2V5c1tpbmRleCAtIDFdID0gbGVmdC5rZXlzW2xrIC0gMV07XHJcblxyXG4gICAgICAgICAgICBsZWZ0LmtleXMubGVuZ3RoID0gbGsgLSAxO1xyXG4gICAgICAgICAgICBsZWZ0Lm5vZGVzLmxlbmd0aCA9IGxuIC0gMTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAvL1JpZ2h0IHJvdGF0ZVxyXG4gICAgICAgIGlmIChyaWdodCAmJiByaWdodC5rZXlzLmxlbmd0aCA+IG1pbl9zaXplKSB7XHJcblxyXG4gICAgICAgICAgICBub2RlLmtleXMucHVzaCgobm9kZS5MRUFGKSA/IHJpZ2h0LmtleXNbMF0gOiB0aGlzLmtleXNbaW5kZXhdKTtcclxuICAgICAgICAgICAgbm9kZS5ub2Rlcy5wdXNoKHJpZ2h0Lm5vZGVzWzBdKTtcclxuXHJcbiAgICAgICAgICAgIHJpZ2h0LmtleXMuc3BsaWNlKDAsIDEpO1xyXG4gICAgICAgICAgICByaWdodC5ub2Rlcy5zcGxpY2UoMCwgMSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmtleXNbaW5kZXhdID0gKG5vZGUuTEVBRikgPyByaWdodC5rZXlzWzFdIDogcmlnaHQua2V5c1swXTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIC8vTGVmdCBvciBSaWdodCBNZXJnZVxyXG4gICAgICAgICAgICBpZiAoIWxlZnQpIHtcclxuICAgICAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICBsZWZ0ID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIG5vZGUgPSByaWdodDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tpbmRleCAtIDFdO1xyXG4gICAgICAgICAgICB0aGlzLmtleXMuc3BsaWNlKGluZGV4IC0gMSwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICAgICAgICAgIGxlZnQubm9kZXMgPSBsZWZ0Lm5vZGVzLmNvbmNhdChub2RlLm5vZGVzKTtcclxuICAgICAgICAgICAgaWYgKCFsZWZ0LkxFQUYpIGxlZnQua2V5cy5wdXNoKGtleSlcclxuICAgICAgICAgICAgbGVmdC5rZXlzID0gbGVmdC5rZXlzLmNvbmNhdChub2RlLmtleXMpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmIChsZWZ0LkxFQUYpXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlZnQua2V5cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGVmdC5rZXlzW2ldICE9IGxlZnQubm9kZXNbaV0uaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICByZW1vdmUoc3RhcnQsIGVuZCwgSVNfUk9PVCA9IGZhbHNlLCBtaW5fc2l6ZSwgb3V0X2NvbnRhaW5lcikge1xyXG4gICAgICAgIGxldCBsID0gdGhpcy5rZXlzLmxlbmd0aCxcclxuICAgICAgICAgICAgb3V0ID0gMCxcclxuICAgICAgICAgICAgb3V0X25vZGUgPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuTEVBRikge1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5rZXlzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzdGFydCA8PSBrZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IHRoaXMubm9kZXNbaV0ucmVtb3ZlKHN0YXJ0LCBlbmQsIGZhbHNlLCBtaW5fc2l6ZSwgb3V0X2NvbnRhaW5lcikub3V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBvdXQgKz0gdGhpcy5ub2Rlc1tpXS5yZW1vdmUoc3RhcnQsIGVuZCwgZmFsc2UsIG1pbl9zaXplLCBvdXRfY29udGFpbmVyKS5vdXQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm5vZGVzW2ldLmtleXMubGVuZ3RoIDwgbWluX3NpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5iYWxhbmNlUmVtb3ZlKGksIG1pbl9zaXplKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZXMubGVuZ3RoID09IDEpXHJcbiAgICAgICAgICAgICAgICBvdXRfbm9kZSA9IHRoaXMubm9kZXNbMF07XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMua2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA8PSBlbmQgJiYga2V5ID49IHN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0X2NvbnRhaW5lci5wdXNoKHRoaXMubm9kZXNbaV0pXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5rZXlzLnNwbGljZShpLCAxKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGwtLTtcclxuICAgICAgICAgICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG91dF9ub2RlLFxyXG4gICAgICAgICAgICBvdXRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGdldChzdGFydCwgZW5kLCBvdXRfY29udGFpbmVyKSB7XHJcblxyXG4gICAgICAgIGlmICghc3RhcnQgfHwgIWVuZClcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuTEVBRikge1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPD0ga2V5KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZXNbaV0uZ2V0KHN0YXJ0LCBlbmQsIG91dF9jb250YWluZXIpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMubm9kZXNbaV0uZ2V0KHN0YXJ0LCBlbmQsIG91dF9jb250YWluZXIsIClcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBvdXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5rZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5IDw9IGVuZCAmJiBrZXkgPj0gc3RhcnQpXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0X2NvbnRhaW5lci5wdXNoKHRoaXMubm9kZXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgQlRyZWVNb2RlbENvbnRhaW5lclxyXG59IiwiaW1wb3J0IHtcclxuICAgIFNjaGVtYVR5cGVcclxufSBmcm9tIFwiLi9zY2hlbWFfdHlwZS5qc1wiXHJcblxyXG5sZXQgTlVNQkVSID0gbmV3KGNsYXNzIE51bWJlclNjaGVtYSBleHRlbmRzIFNjaGVtYVR5cGUge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdGFydF92YWx1ZSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2UodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmVyaWZ5KHZhbHVlLCByZXN1bHQpIHtcclxuICAgICAgICByZXN1bHQudmFsaWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZih2YWx1ZSA9PSBOYU4gfHwgdmFsdWUgPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgcmVzdWx0LnZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJlc3VsdC5yZWFzb24gPSBcIkludmFsaWQgbnVtYmVyIHR5cGUuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcihpZGVudGlmaWVyLCBmaWx0ZXJzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBmaWx0ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllciA9PSBmaWx0ZXJzW2ldKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbn0pKClcclxuXHJcbmV4cG9ydCB7XHJcbiAgICBOVU1CRVJcclxufTsiLCJjb25zdCBtb250aHMgPSBbe1xyXG4gICAgbmFtZTogXCJKYW51YXJ5XCIsXHJcbiAgICBkYXlzOiAzMSxcclxuICAgIGRheV9vZmZzZXQ6IDAsXHJcbiAgICBkYXlfb2Zmc2VfbGVhcHQ6IDBcclxufSwge1xyXG4gICAgbmFtZTogXCJGZWJydWFyeVwiLFxyXG4gICAgZGF5czogMjgsXHJcbiAgICBkYXlfb2Zmc2V0OiAzMSxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogMzFcclxufSwge1xyXG4gICAgbmFtZTogXCJNYXJjaFwiLFxyXG4gICAgZGF5czogMzEsXHJcbiAgICBkYXlfb2Zmc2V0OiA1OSxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogNjBcclxufSwge1xyXG4gICAgbmFtZTogXCJBcHJpbFwiLFxyXG4gICAgZGF5czogMzAsXHJcbiAgICBkYXlfb2Zmc2V0OiA5MCxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogOTFcclxufSwge1xyXG4gICAgbmFtZTogXCJNYXlcIixcclxuICAgIGRheXM6IDMxLFxyXG4gICAgZGF5X29mZnNldDogMTIwLFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiAxMjFcclxufSwge1xyXG4gICAgbmFtZTogXCJKdW5lXCIsXHJcbiAgICBkYXlzOiAzMCxcclxuICAgIGRheV9vZmZzZXQ6IDE1MSxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogMTUyXHJcbn0sIHtcclxuICAgIG5hbWU6IFwiSnVseVwiLFxyXG4gICAgZGF5czogMzEsXHJcbiAgICBkYXlfb2Zmc2V0OiAxODEsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDE4MlxyXG59LCB7XHJcbiAgICBuYW1lOiBcIkF1Z3VzdFwiLFxyXG4gICAgZGF5czogMzEsXHJcbiAgICBkYXlfb2Zmc2V0OiAyMTIsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDIxM1xyXG59LCB7XHJcbiAgICBuYW1lOiBcIlNlcHRlbWJlclwiLFxyXG4gICAgZGF5czogMzAsXHJcbiAgICBkYXlfb2Zmc2V0OiAyNDMsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDI0NFxyXG59LCB7XHJcbiAgICBuYW1lOiBcIk9jdG9iZXJcIixcclxuICAgIGRheXM6IDMxLFxyXG4gICAgZGF5X29mZnNldDogMjczLFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiAyNzRcclxufSwge1xyXG4gICAgbmFtZTogXCJOb3ZlbWJlclwiLFxyXG4gICAgZGF5czogMzAsXHJcbiAgICBkYXlfb2Zmc2V0OiAzMDQsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDMwNVxyXG59LCB7XHJcbiAgICBuYW1lOiBcIkRlY2VtYmVyXCIsXHJcbiAgICBkYXlzOiAzMSxcclxuICAgIGRheV9vZmZzZXQ6IDMzLFxyXG4gICAgZGF5X29mZnNlX2xlYXB0OiAzMzVcclxufV1cclxuXHJcbmV4cG9ydCB7bW9udGhzfSIsIlxyXG52YXIgZG93ID0gW1wiU3VuZGF5XCIsIFwiTW9uZGF5XCIsIFwiVHVlc2RheVwiLCBcIldlZG5lc2RheVwiLCBcIlRodXJzZGF5XCIsIFwiRnJpZGF5XCIsIFwiU2F0dXJkYXlcIl07XHJcblxyXG5leHBvcnQge2Rvd30iLCJmdW5jdGlvbiBHZXREYXlTdGFydEFuZEVuZChkYXRlKSB7XHJcbiAgICB2YXIgcnZhbCA9IHtcclxuICAgICAgICBzdGFydDogMCxcclxuICAgICAgICBlbmQ6IDBcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGRhdGUgaW5zdGFuY2VvZiBEYXRlIHx8IHR5cGVvZihkYXRlKSA9PSBcIm51bWJlclwiICkge1xyXG4gICAgICAgIHZhciBkID0gbmV3IERhdGUoZGF0ZSk7XHJcblxyXG4gICAgICAgIGQuc2V0SG91cnMoMCk7XHJcbiAgICAgICAgZC5zZXRNaW51dGVzKDApO1xyXG4gICAgICAgIGQuc2V0U2Vjb25kcygwKTtcclxuICAgICAgICBkLnNldE1pbGxpc2Vjb25kcygwKVxyXG5cclxuICAgICAgICBydmFsLnN0YXJ0ID0gZC52YWx1ZU9mKCk7XHJcbiAgICAgICAgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgZC5zZXRTZWNvbmRzKC0xKTtcclxuICAgICAgICBydmFsLmVuZCA9IGQudmFsdWVPZigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBydmFsO1xyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgR2V0RGF5U3RhcnRBbmRFbmRcclxufSIsImZ1bmN0aW9uIGZsb2F0MjR0bzEyTW9kVGltZSh0aW1lLCBDQVBJVEFMKSB7XHJcbiAgICB2YXIgSVNfUE0gPSB0aW1lID49IDEyICYmIHRpbWUgPCAyNDtcclxuICAgIHZhciBtaW51dGVzID0gKCh0aW1lICUgMSkgKiA2MCkgfCAwO1xyXG4gICAgdmFyIGhvdXJzID0gKCgodGltZSB8IDApICUgMTIpICE9IDApID8gKHRpbWUgfCAwKSAlIDEyIDogMTI7XHJcblxyXG4gICAgcmV0dXJuIChob3VycyArIFwiOlwiICsgKFwiMFwiICsgbWludXRlcykuc2xpY2UoLTIpKSArICgoSVNfUE0pID8gKENBUElUQUwpID8gXCJQTVwiIDpcInBtXCIgOiAoQ0FQSVRBTCkgPyBcIkFNXCIgOiBcImFtXCIpO1xyXG59XHJcblxyXG5leHBvcnQge2Zsb2F0MjR0bzEyTW9kVGltZX0iLCJjbGFzcyBQb2ludDJEIGV4dGVuZHMgRmxvYXQ2NEFycmF5e1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKHgsIHkpIHtcclxuXHRcdHN1cGVyKDIpXHJcblxyXG5cdFx0aWYgKHR5cGVvZih4KSA9PSBcIm51bWJlclwiKSB7XHJcblx0XHRcdHRoaXNbMF0gPSB4O1xyXG5cdFx0XHR0aGlzWzFdID0geTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh4IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuXHRcdFx0dGhpc1swXSA9IHhbMF07XHJcblx0XHRcdHRoaXNbMV0gPSB4WzFdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZHJhdyhjdHgsIHMgPSAxKXtcclxuXHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdGN0eC5tb3ZlVG8odGhpcy54KnMsdGhpcy55KnMpO1xyXG5cdFx0Y3R4LmFyYyh0aGlzLngqcywgdGhpcy55KnMsIHMqMC4wMSwgMCwgMipNYXRoLlBJKTtcclxuXHRcdGN0eC5zdHJva2UoKTtcclxuXHR9XHJcblxyXG5cdGdldCB4ICgpeyByZXR1cm4gdGhpc1swXX1cclxuXHRzZXQgeCAodil7aWYodHlwZW9mKHYpICE9PSBcIm51bWJlclwiKSByZXR1cm47IHRoaXNbMF0gPSB2fVxyXG5cclxuXHRnZXQgeSAoKXsgcmV0dXJuIHRoaXNbMV19XHJcblx0c2V0IHkgKHYpe2lmKHR5cGVvZih2KSAhPT0gXCJudW1iZXJcIikgcmV0dXJuOyB0aGlzWzFdID0gdn1cclxufVxyXG5cclxuZXhwb3J0IHtQb2ludDJEfSIsImltcG9ydCB7XHJcbiAgICBQb2ludDJEXHJcbn0gZnJvbSBcIi4vcG9pbnQyRFwiXHJcblxyXG5mdW5jdGlvbiBjdXJ2ZVBvaW50KGN1cnZlLCB0KSB7XHJcbiAgICB2YXIgcG9pbnQgPSB7XHJcbiAgICAgICAgeDogMCxcclxuICAgICAgICB5OiAwXHJcbiAgICB9O1xyXG4gICAgcG9pbnQueCA9IHBvc09uQ3VydmUodCwgY3VydmVbMF0sIGN1cnZlWzJdLCBjdXJ2ZVs0XSk7XHJcbiAgICBwb2ludC55ID0gcG9zT25DdXJ2ZSh0LCBjdXJ2ZVsxXSwgY3VydmVbM10sIGN1cnZlWzVdKTtcclxuICAgIHJldHVybiBwb2ludDtcclxufVxyXG5cclxuZnVuY3Rpb24gcG9zT25DdXJ2ZSh0LCBwMSwgcDIsIHAzKSB7XHJcbiAgICB2YXIgdGkgPSAxIC0gdDtcclxuICAgIHJldHVybiB0aSAqIHRpICogcDEgKyAyICogdGkgKiB0ICogcDIgKyB0ICogdCAqIHAzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzcGxpdEN1cnZlKGJwLCB0KSB7XHJcbiAgICB2YXIgbGVmdCA9IFtdO1xyXG4gICAgdmFyIHJpZ2h0ID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gZHJhd0N1cnZlKGJwLCB0KSB7XHJcbiAgICAgICAgaWYgKGJwLmxlbmd0aCA9PSAyKSB7XHJcbiAgICAgICAgICAgIGxlZnQucHVzaChicFswXSwgYnBbMV0pO1xyXG4gICAgICAgICAgICByaWdodC5wdXNoKGJwWzBdLCBicFsxXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIG5ld19icCA9IFtdIC8vYnAuc2xpY2UoMCwtMik7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnAubGVuZ3RoIC0gMjsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdC5wdXNoKGJwW2ldLCBicFtpICsgMV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gYnAubGVuZ3RoIC0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0LnB1c2goYnBbaSArIDJdLCBicFtpICsgM10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbmV3X2JwLnB1c2goKDEgLSB0KSAqIGJwW2ldICsgdCAqIGJwW2kgKyAyXSk7XHJcbiAgICAgICAgICAgICAgICBuZXdfYnAucHVzaCgoMSAtIHQpICogYnBbaSArIDFdICsgdCAqIGJwW2kgKyAzXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZHJhd0N1cnZlKG5ld19icCwgdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdDdXJ2ZShicCwgdCk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB4OiBuZXcgUUJlemllcihyaWdodCksXHJcbiAgICAgICAgeTogbmV3IFFCZXppZXIobGVmdClcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGN1cnZlSW50ZXJzZWN0aW9ucyhwMSwgcDIsIHAzKSB7XHJcbiAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHtcclxuICAgICAgICBhOiBJbmZpbml0eSxcclxuICAgICAgICBiOiBJbmZpbml0eVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgYSA9IHAxIC0gMiAqIHAyICsgcDM7XHJcblxyXG4gICAgdmFyIGIgPSAyICogKHAyIC0gcDEpO1xyXG5cclxuICAgIHZhciBjID0gcDE7XHJcblxyXG4gICAgaWYgKGIgPT0gMCkge30gZWxzZSBpZiAoTWF0aC5hYnMoYSkgPCAwLjAwMDAwMDAwMDA1KSB7XHJcbiAgICAgICAgaW50ZXJzZWN0aW9ucy5hID0gKC1jIC8gYik7IC8vYyAvIGI7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBpbnRlcnNlY3Rpb25zLmEgPSAoKC1iIC0gTWF0aC5zcXJ0KChiICogYikgLSA0ICogYSAqIGMpKSAvICgyICogYSkpO1xyXG4gICAgICAgIGludGVyc2VjdGlvbnMuYiA9ICgoLWIgKyBNYXRoLnNxcnQoKGIgKiBiKSAtIDQgKiBhICogYykpIC8gKDIgKiBhKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW50ZXJzZWN0aW9uc1xyXG59XHJcblxyXG5jbGFzcyBRQmV6aWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHgxLCB5MSwgeDIsIHkyLCB4MywgeTMpIHtcclxuICAgICAgICB0aGlzLngxID0gMDtcclxuICAgICAgICB0aGlzLngyID0gMDtcclxuICAgICAgICB0aGlzLngzID0gMDtcclxuICAgICAgICB0aGlzLnkxID0gMDtcclxuICAgICAgICB0aGlzLnkyID0gMDtcclxuICAgICAgICB0aGlzLnkzID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZih4MSkgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICB0aGlzLngxID0geDE7XHJcbiAgICAgICAgICAgIHRoaXMueDIgPSB4MjtcclxuICAgICAgICAgICAgdGhpcy54MyA9IHgzO1xyXG4gICAgICAgICAgICB0aGlzLnkxID0geTE7XHJcbiAgICAgICAgICAgIHRoaXMueTIgPSB5MjtcclxuICAgICAgICAgICAgdGhpcy55MyA9IHkzO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoeDEgaW5zdGFuY2VvZiBRQmV6aWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueDEgPSB4MS54MTtcclxuICAgICAgICAgICAgdGhpcy54MiA9IHgxLngyO1xyXG4gICAgICAgICAgICB0aGlzLngzID0geDEueDM7XHJcbiAgICAgICAgICAgIHRoaXMueTEgPSB4MS55MTtcclxuICAgICAgICAgICAgdGhpcy55MiA9IHgxLnkyO1xyXG4gICAgICAgICAgICB0aGlzLnkzID0geDEueTM7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh4MSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIHRoaXMueDEgPSB4MVswXTtcclxuICAgICAgICAgICAgdGhpcy55MSA9IHgxWzFdO1xyXG4gICAgICAgICAgICB0aGlzLngyID0geDFbMl07XHJcbiAgICAgICAgICAgIHRoaXMueTIgPSB4MVszXTtcclxuICAgICAgICAgICAgdGhpcy54MyA9IHgxWzRdO1xyXG4gICAgICAgICAgICB0aGlzLnkzID0geDFbNV07XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV2ZXJzZSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFFCZXppZXIoXHJcbiAgICAgICAgICAgIHRoaXMueDMsXHJcbiAgICAgICAgICAgIHRoaXMueTMsXHJcbiAgICAgICAgICAgIHRoaXMueDIsXHJcbiAgICAgICAgICAgIHRoaXMueTIsXHJcbiAgICAgICAgICAgIHRoaXMueDEsXHJcbiAgICAgICAgICAgIHRoaXMueTFcclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgcG9pbnQodCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQyRChcclxuICAgICAgICAgICAgcG9zT25DdXJ2ZSh0LCB0aGlzLngxLCB0aGlzLngyLCB0aGlzLngzKSxcclxuICAgICAgICAgICAgcG9zT25DdXJ2ZSh0LCB0aGlzLnkxLCB0aGlzLnkyLCB0aGlzLnkzKSlcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdGFuZ2VudCh0KSB7XHJcbiAgICAgICAgdmFyIHRhbiA9IHtcclxuICAgICAgICAgICAgeDogMCxcclxuICAgICAgICAgICAgeTogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBweDEgPSB0aGlzLngyIC0gdGhpcy54MTtcclxuICAgICAgICB2YXIgcHkxID0gdGhpcy55MiAtIHRoaXMueTE7XHJcblxyXG4gICAgICAgIHZhciBweDIgPSB0aGlzLngzIC0gdGhpcy54MjtcclxuICAgICAgICB2YXIgcHkyID0gdGhpcy55MyAtIHRoaXMueTI7XHJcblxyXG4gICAgICAgIHRhbi54ID0gKDEgLSB0KSAqIHB4MSArIHQgKiBweDI7XHJcbiAgICAgICAgdGFuLnkgPSAoMSAtIHQpICogcHkxICsgdCAqIHB5MjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRhbjtcclxuICAgIH1cclxuXHJcbiAgICB0b0FycmF5KCkge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy54MSwgdGhpcy55MSwgdGhpcy54MiwgdGhpcy55MiwgdGhpcy54MywgdGhpcy55M107XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQodCkge1xyXG4gICAgICAgIHJldHVybiBzcGxpdEN1cnZlKHRoaXMudG9BcnJheSgpLCB0KTtcclxuICAgIH1cclxuXHJcbiAgICByb290c1ggKCl7XHJcbiAgICBcdHJldHVybiB0aGlzLnJvb3RzKFxyXG4gICAgXHRcdHRoaXMueDEsIFxyXG4gICAgXHRcdHRoaXMueDIsXHJcbiAgICBcdFx0dGhpcy54M1xyXG4gICAgXHRcdClcclxuICAgIFx0XHJcbiAgICB9XHJcblxyXG4gICAgcm9vdHMocDEsIHAyLCBwMykge1xyXG4gICAgICAgIHZhciBjdXJ2ZSA9IHRoaXMudG9BcnJheSgpO1xyXG5cclxuICAgICAgICB2YXIgYyA9IHAxIC0gKDIqcDIpICsgcDM7XHJcbiAgICAgICAgdmFyIGIgPSAyKihwMiAtIHAxKTtcclxuICAgICAgICB2YXIgYSA9IHAxO1xyXG4gICAgICAgIHZhciBhMiA9IGEqMjtcclxuICAgICAgICBjb25zb2xlLmxvZyhjICxcIiBjXCIpXHJcbiAgICAgICAgdmFyIHNxcnQgPSBNYXRoLnNxcnQoYipiIC0gKGEgKiA0ICpjKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coc3FydCwgYiwgYTIsIHAzKVxyXG4gICAgICAgIHZhciB0MSA9ICgtYiArIHNxcnQpIC8gYTI7XHJcbiAgICAgICAgdmFyIHQyID0gKC1iIC0gc3FydCkgLyBhMjtcclxuXHJcbiAgICAgICAgcmV0dXJuIFsgdDEgLCB0MiBdO1xyXG4gICAgfSBcclxuXHJcbiAgICByb290c2EoKSB7XHJcbiAgICAgICAgdmFyIGN1cnZlID0gdGhpcy50b0FycmF5KCk7XHJcblxyXG4gICAgICAgIHZhciBwMSA9IGN1cnZlWzFdO1xyXG4gICAgICAgIHZhciBwMiA9IGN1cnZlWzNdO1xyXG4gICAgICAgIHZhciBwMyA9IGN1cnZlWzVdO1xyXG4gICAgICAgIHZhciB4MSA9IGN1cnZlWzBdO1xyXG4gICAgICAgIHZhciB4MiA9IGN1cnZlWzJdO1xyXG4gICAgICAgIHZhciB4MyA9IGN1cnZlWzRdO1xyXG5cclxuICAgICAgICB2YXIgcHkxZCA9IDIgKiAocDIgLSBwMSk7XHJcbiAgICAgICAgdmFyIHB5MmQgPSAyICogKHAzIC0gcDIpO1xyXG4gICAgICAgIHZhciBhZDEgPSAtcHkxZCArIHB5MmQ7XHJcbiAgICAgICAgdmFyIGJkMSA9IHB5MWQ7XHJcblxyXG4gICAgICAgIHZhciBweDFkID0gMiAqICh4MiAtIHgxKTtcclxuICAgICAgICB2YXIgcHgyZCA9IDIgKiAoeDMgLSB4Mik7XHJcbiAgICAgICAgdmFyIGFkMiA9IC1weDFkICsgcHgyZDtcclxuICAgICAgICB2YXIgYmQyID0gcHgxZDtcclxuXHJcbiAgICAgICAgdmFyIHQxID0gLWJkMSAvIGFkMTtcclxuICAgICAgICB2YXIgdDIgPSAtYmQyIC8gYWQyO1xyXG5cclxuICAgICAgICByZXR1cm4gWyB0MSAsIHQyIF07XHJcbiAgICB9XHJcblxyXG4gICAgYm91bmRpbmdCb3goKSB7XHJcbiAgICAgICAgdmFyIHgxID0gY3VydmVbMF07XHJcbiAgICAgICAgdmFyIHkxID0gY3VydmVbMV07XHJcbiAgICAgICAgdmFyIHgyID0gY3VydmVbMl07XHJcbiAgICAgICAgdmFyIHkyID0gY3VydmVbM107XHJcbiAgICAgICAgdmFyIHgzID0gY3VydmVbNF07XHJcbiAgICAgICAgdmFyIHkzID0gY3VydmVbNV07XHJcbiAgICAgICAgdmFyIHJvb3RzID0gZ2V0Um9vdHNDbGFtcGVkKGN1cnZlKTtcclxuICAgICAgICB2YXIgbWluX3ggPSBNYXRoLm1pbih4MSwgeDIsIHgzLCByb290cy55WzBdIHx8IEluZmluaXR5LCByb290cy54WzBdIHx8IEluZmluaXR5KTtcclxuICAgICAgICB2YXIgbWluX3kgPSBNYXRoLm1pbih5MSwgeTIsIHkzLCByb290cy55WzFdIHx8IEluZmluaXR5LCByb290cy54WzFdIHx8IEluZmluaXR5KTtcclxuICAgICAgICB2YXIgbWF4X3ggPSBNYXRoLm1heCh4MSwgeDIsIHgzLCByb290cy55WzBdIHx8IC1JbmZpbml0eSwgcm9vdHMueFswXSB8fCAtSW5maW5pdHkpO1xyXG4gICAgICAgIHZhciBtYXhfeSA9IE1hdGgubWF4KHkxLCB5MiwgeTMsIHJvb3RzLnlbMV0gfHwgLUluZmluaXR5LCByb290cy54WzFdIHx8IC1JbmZpbml0eSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG1pbjoge1xyXG4gICAgICAgICAgICAgICAgeDogbWluX3gsXHJcbiAgICAgICAgICAgICAgICB5OiBtaW5feVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtYXg6IHtcclxuICAgICAgICAgICAgICAgIHg6IG1heF94LFxyXG4gICAgICAgICAgICAgICAgeTogbWF4X3lcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRlKGFuZ2xlLCBvZmZzZXQpIHtcclxuICAgICAgICBhbmdsZSA9IChhbmdsZSAvIDE4MCkgKiBNYXRoLlBJO1xyXG5cclxuICAgICAgICB2YXIgbmV3X2N1cnZlID0gdGhpcy50b0FycmF5KCk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gY3VydmVbaV0gLSBvZmZzZXQueDtcclxuICAgICAgICAgICAgdmFyIHkgPSBjdXJ2ZVtpICsgMV0gLSBvZmZzZXQueTtcclxuICAgICAgICAgICAgbmV3X2N1cnZlW2ldID0gKCh4ICogTWF0aC5jb3MoYW5nbGUpIC0geSAqIE1hdGguc2luKGFuZ2xlKSkpICsgb2Zmc2V0Lng7XHJcbiAgICAgICAgICAgIG5ld19jdXJ2ZVtpICsgMV0gPSAoKHggKiBNYXRoLnNpbihhbmdsZSkgKyB5ICogTWF0aC5jb3MoYW5nbGUpKSkgKyBvZmZzZXQueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUUJlemllcihuZXdfY3VydmUpO1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyc2VjdHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogY3VydmVJbnRlcnNlY3Rpb25zKHRoaXMueDEsIHRoaXMueDIsIHRoaXMueDMpLFxyXG4gICAgICAgICAgICB5OiBjdXJ2ZUludGVyc2VjdGlvbnModGhpcy55MSwgdGhpcy55MiwgdGhpcy55MylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKHgsIHkpIHtcclxuICAgICAgICBpZiAodHlwZW9mKHgpID09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBRQmV6aWVyKFxyXG4gICAgICAgICAgICAgICAgdGhpcy54MSArIHgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnkxICsgeSxcclxuICAgICAgICAgICAgICAgIHRoaXMueDIgKyB4LFxyXG4gICAgICAgICAgICAgICAgdGhpcy55MiArIHksXHJcbiAgICAgICAgICAgICAgICB0aGlzLngzICsgeCxcclxuICAgICAgICAgICAgICAgIHRoaXMueTMgKyB5LFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgUUJlemllclxyXG59IiwiY29uc3Qgc3FydCA9IE1hdGguc3FydDtcclxuY29uc3QgY29zID0gTWF0aC5jb3M7XHJcbmNvbnN0IGFjb3MgPSBNYXRoLmFjb3M7XHJcbmNvbnN0IFBJID0gTWF0aC5QSTtcclxuY29uc3Qgc2luID0gTWF0aC5zaW47XHJcblxyXG5leHBvcnR7XHJcblx0c3FydCxcclxuXHRjb3MsXHJcblx0c2luLFxyXG5cdGFjb3MsXHJcblx0YWNvczIsXHJcblx0UElcclxufSIsImltcG9ydCB7UG9pbnQyRH0gZnJvbSBcIi4vcG9pbnQyRFwiXHJcbmltcG9ydCB7c3FydCxjb3MsYWNvcyxQSX0gZnJvbSBcIi4vY29uc3RzXCJcclxuXHJcbi8vIEEgaGVscGVyIGZ1bmN0aW9uIHRvIGZpbHRlciBmb3IgdmFsdWVzIGluIHRoZSBbMCwxXSBpbnRlcnZhbDpcclxuZnVuY3Rpb24gYWNjZXB0KHQpIHtcclxuICByZXR1cm4gMDw9dCAmJiB0IDw9MTtcclxufVxyXG5cclxuLy8gQSByZWFsLWN1YmVyb290cy1vbmx5IGZ1bmN0aW9uOlxyXG5mdW5jdGlvbiBjdWJlcm9vdCh2KSB7XHJcbiAgaWYodjwwKSByZXR1cm4gLU1hdGgucG93KC12LDEvMyk7XHJcbiAgcmV0dXJuIE1hdGgucG93KHYsMS8zKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBwb2ludCh0LCBwMSwgcDIsIHAzLCBwNCkge1xyXG5cdHZhciB0aSA9IDEgLSB0O1xyXG5cdHZhciB0aTIgPSB0aSAqIHRpO1xyXG5cdHZhciB0MiA9IHQgKiB0O1xyXG5cclxuXHRyZXR1cm4gdGkgKiB0aTIgKiBwMSArIDMgKiB0aTIgKiB0ICogcDIgKyB0MiAqIDMgKiB0aSAqIHAzICsgdDIgKiB0ICogcDQ7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBDQmV6aWVyIGV4dGVuZHMgRmxvYXQ2NEFycmF5e1xyXG5cdGNvbnN0cnVjdG9yKHgxLCB5MSwgeDIsIHkyLCB4MywgeTMsIHg0LCB5NCkge1xyXG5cdFx0c3VwZXIoOClcclxuXHJcblx0XHQvL01hcCBQMSBhbmQgUDIgdG8gezAsMCwxLDF9IGlmIG9ubHkgZm91ciBhcmd1bWVudHMgYXJlIHByb3ZpZGVkOyBmb3IgdXNlIHdpdGggYW5pbWF0aW9uc1xyXG5cdFx0aWYoYXJndW1lbnRzLmxlbmd0aCA9PSA0KXtcclxuXHRcdFx0dGhpc1swXSA9IDA7XHJcblx0XHRcdHRoaXNbMV0gPSAwO1xyXG5cdFx0XHR0aGlzWzJdID0geDE7XHJcblx0XHRcdHRoaXNbM10gPSB5MTtcclxuXHRcdFx0dGhpc1s0XSA9IHgyO1xyXG5cdFx0XHR0aGlzWzVdID0geTI7XHJcblx0XHRcdHRoaXNbNl0gPSAxO1xyXG5cdFx0XHR0aGlzWzddID0gMTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZiAodHlwZW9mKHgxKSA9PSBcIm51bWJlclwiKSB7XHJcblx0XHRcdHRoaXNbMF0gPSB4MTtcclxuXHRcdFx0dGhpc1sxXSA9IHkxO1xyXG5cdFx0XHR0aGlzWzJdID0geDI7XHJcblx0XHRcdHRoaXNbM10gPSB5MjtcclxuXHRcdFx0dGhpc1s0XSA9IHgzO1xyXG5cdFx0XHR0aGlzWzVdID0geTM7XHJcblx0XHRcdHRoaXNbNl0gPSB4NDtcclxuXHRcdFx0dGhpc1s3XSA9IHk0O1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHgxIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuXHRcdFx0dGhpc1swXSA9IHgxWzBdO1xyXG5cdFx0XHR0aGlzWzFdID0geDFbMV07XHJcblx0XHRcdHRoaXNbMl0gPSB4MVsyXTtcclxuXHRcdFx0dGhpc1szXSA9IHgxWzNdO1xyXG5cdFx0XHR0aGlzWzRdID0geDFbNF07XHJcblx0XHRcdHRoaXNbNV0gPSB4MVs1XTtcclxuXHRcdFx0dGhpc1s2XSA9IHgxWzZdO1xyXG5cdFx0XHR0aGlzWzddID0geDFbNF07XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdldCB4MSAoKXsgcmV0dXJuIHRoaXNbMF19XHJcblx0c2V0IHgxICh2KXt0aGlzWzBdID0gdn1cclxuXHRnZXQgeDIgKCl7IHJldHVybiB0aGlzWzJdfVxyXG5cdHNldCB4MiAodil7dGhpc1syXSA9IHZ9XHJcblx0Z2V0IHgzICgpeyByZXR1cm4gdGhpc1s0XX1cclxuXHRzZXQgeDMgKHYpe3RoaXNbNF0gPSB2fVxyXG5cdGdldCB4NCAoKXsgcmV0dXJuIHRoaXNbNl19XHJcblx0c2V0IHg0ICh2KXt0aGlzWzZdID0gdn1cclxuXHRnZXQgeTEgKCl7IHJldHVybiB0aGlzWzFdfVxyXG5cdHNldCB5MSAodil7dGhpc1sxXSA9IHZ9XHJcblx0Z2V0IHkyICgpeyByZXR1cm4gdGhpc1szXX1cclxuXHRzZXQgeTIgKHYpe3RoaXNbM10gPSB2fVxyXG5cdGdldCB5MyAoKXsgcmV0dXJuIHRoaXNbNV19XHJcblx0c2V0IHkzICh2KXt0aGlzWzVdID0gdn1cclxuXHRnZXQgeTQgKCl7IHJldHVybiB0aGlzWzddfVxyXG5cdHNldCB5NCAodil7dGhpc1s3XSA9IHZ9XHJcblxyXG5cdGFkZCh4LHkgPSAwKXtcclxuXHRcdHJldHVybiBuZXcgQ0N1cnZlKFxyXG5cdFx0XHR0aGlzWzBdICsgeCxcclxuXHRcdFx0dGhpc1sxXSArIHksXHJcblx0XHRcdHRoaXNbMl0gKyB4LFxyXG5cdFx0XHR0aGlzWzNdICsgeSxcclxuXHRcdFx0dGhpc1s0XSArIHgsXHJcblx0XHRcdHRoaXNbNV0gKyB5LFxyXG5cdFx0XHR0aGlzWzZdICsgeCxcclxuXHRcdFx0dGhpc1s3XSArIHlcclxuXHRcdClcclxuXHR9XHJcblxyXG5cdHZhbFkodCl7XHJcblx0XHRyZXR1cm4gcG9pbnQodCwgdGhpc1sxXSwgdGhpc1szXSwgdGhpc1s1XSwgdGhpc1s3XSk7XHJcblx0fVxyXG5cclxuXHR2YWxYKHQpe1xyXG5cdFx0cmV0dXJuIHBvaW50KHQsIHRoaXNbMF0sIHRoaXNbMl0sIHRoaXNbNF0sIHRoaXNbNl0pO1xyXG5cdH1cclxuXHJcblx0cG9pbnQodCkge1xyXG5cdFx0cmV0dXJuIG5ldyBQb2ludDJEKFxyXG5cdFx0XHRwb2ludCh0LCB0aGlzWzBdLCB0aGlzWzJdLCB0aGlzWzRdLCB0aGlzWzZdKSxcclxuXHRcdFx0cG9pbnQodCwgdGhpc1sxXSwgdGhpc1szXSwgdGhpc1s1XSwgdGhpc1s3XSlcclxuXHRcdClcclxuXHR9XHJcblx0XHJcblx0LyoqIFxyXG5cdFx0QXF1aXJlZCBmcm9tIDogaHR0cHM6Ly9wb21heC5naXRodWIuaW8vYmV6aWVyaW5mby9cclxuXHRcdEF1dGhvcjogIE1pa2UgXCJQb21heFwiIEthbWVybWFuc1xyXG5cdFx0R2l0SHViOiBodHRwczovL2dpdGh1Yi5jb20vUG9tYXgvXHJcblx0Ki9cclxuXHJcblx0cm9vdHMocDEscDIscDMscDQpIHtcclxuXHRcdHZhciBkID0gKC1wMSArIDMgKiBwMiAtIDMgKiBwMyArIHA0KSxcclxuXHRcdFx0YSA9ICgzICogcDEgLSA2ICogcDIgKyAzICogcDMpIC8gZCxcclxuXHRcdFx0YiA9ICgtMyAqIHAxICsgMyAqIHAyKSAvIGQsXHJcblx0XHRcdGMgPSBwMSAvIGQ7XHJcblxyXG5cdFx0dmFyIHAgPSAoMyAqIGIgLSBhICogYSkgLyAzLFxyXG5cdFx0XHRwMyA9IHAgLyAzLFxyXG5cdFx0XHRxID0gKDIgKiBhICogYSAqIGEgLSA5ICogYSAqIGIgKyAyNyAqIGMpIC8gMjcsXHJcblx0XHRcdHEyID0gcSAvIDIsXHJcblx0XHRcdGRpc2NyaW1pbmFudCA9IHEyICogcTIgKyBwMyAqIHAzICogcDM7XHJcblxyXG5cdFx0Ly8gYW5kIHNvbWUgdmFyaWFibGVzIHdlJ3JlIGdvaW5nIHRvIHVzZSBsYXRlciBvbjpcclxuXHRcdHZhciB1MSwgdjEsIHJvb3QxLCByb290Miwgcm9vdDM7XHJcblxyXG5cdFx0Ly8gdGhyZWUgcG9zc2libGUgcmVhbCByb290czpcclxuXHRcdGlmIChkaXNjcmltaW5hbnQgPCAwKSB7XHJcblx0XHRcdHZhciBtcDMgPSAtcCAvIDMsXHJcblx0XHRcdFx0bXAzMyA9IG1wMyAqIG1wMyAqIG1wMyxcclxuXHRcdFx0XHRyID0gc3FydChtcDMzKSxcclxuXHRcdFx0XHR0ID0gLXEgLyAoMiAqIHIpLFxyXG5cdFx0XHRcdGNvc3BoaSA9IHQgPCAtMSA/IC0xIDogdCA+IDEgPyAxIDogdCxcclxuXHRcdFx0XHRwaGkgPSBhY29zKGNvc3BoaSksXHJcblx0XHRcdFx0Y3J0ciA9IGN1YmVyb290KHIpLFxyXG5cdFx0XHRcdHQxID0gMiAqIGNydHI7XHJcblx0XHRcdHJvb3QxID0gdDEgKiBjb3MocGhpIC8gMykgLSBhIC8gMztcclxuXHRcdFx0cm9vdDIgPSB0MSAqIGNvcygocGhpICsgMiAqIFBJKSAvIDMpIC0gYSAvIDM7XHJcblx0XHRcdHJvb3QzID0gdDEgKiBjb3MoKHBoaSArIDQgKiBQSSkgLyAzKSAtIGEgLyAzO1xyXG5cdFx0XHRyZXR1cm4gW3Jvb3QzLCByb290MSwgcm9vdDJdXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdGhyZWUgcmVhbCByb290cywgYnV0IHR3byBvZiB0aGVtIGFyZSBlcXVhbDpcclxuXHRcdGlmIChkaXNjcmltaW5hbnQgPT09IDApIHtcclxuXHRcdFx0dTEgPSBxMiA8IDAgPyBjdWJlcm9vdCgtcTIpIDogLWN1YmVyb290KHEyKTtcclxuXHRcdFx0cm9vdDEgPSAyICogdTEgLSBhIC8gMztcclxuXHRcdFx0cm9vdDIgPSAtdTEgLSBhIC8gMztcclxuXHRcdFx0cmV0dXJuIFtyb290Miwgcm9vdDFdXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb25lIHJlYWwgcm9vdCwgdHdvIGNvbXBsZXggcm9vdHNcclxuXHRcdHZhciBzZCA9IHNxcnQoZGlzY3JpbWluYW50KTtcclxuXHRcdHUxID0gY3ViZXJvb3Qoc2QgLSBxMik7XHJcblx0XHR2MSA9IGN1YmVyb290KHNkICsgcTIpO1xyXG5cdFx0cm9vdDEgPSB1MSAtIHYxIC0gYSAvIDM7XHJcblx0XHRyZXR1cm4gW3Jvb3QxXVxyXG5cdH1cclxuXHJcblx0cm9vdHNZKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMucm9vdHModGhpc1sxXSx0aGlzWzNdLHRoaXNbNV0sdGhpc1s3XSlcclxuXHR9XHJcblxyXG5cdHJvb3RzWCgpIHtcclxuXHRcdHJldHVybiB0aGlzLnJvb3RzKHRoaXNbMF0sdGhpc1syXSx0aGlzWzRdLHRoaXNbNl0pXHJcblx0fVxyXG5cdFxyXG5cdGdldFlhdFgoeCl7XHJcblx0XHR2YXIgeDEgPSB0aGlzWzBdIC0geCwgeDIgPSB0aGlzWzJdIC0geCwgeDMgPSB0aGlzWzRdIC0geCwgeDQgPSB0aGlzWzZdIC0geCxcclxuXHRcdFx0eDJfMyA9IHgyICogMywgeDFfMyA9IHgxICozLCB4M18zID0geDMgKiAzLFxyXG5cdFx0XHRkID0gKC14MSArIHgyXzMgLSB4M18zICsgeDQpLCBkaSA9IDEvZCwgaTMgPSAxLzMsXHJcblx0XHRcdGEgPSAoeDFfMyAtIDYgKiB4MiArIHgzXzMpICogZGksXHJcblx0XHRcdGIgPSAoLXgxXzMgKyB4Ml8zKSAqIGRpLFxyXG5cdFx0XHRjID0geDEgKiBkaSxcclxuXHRcdFx0cCA9ICgzICogYiAtIGEgKiBhKSAqIGkzLFxyXG5cdFx0XHRwMyA9IHAgKiBpMyxcclxuXHRcdFx0cSA9ICgyICogYSAqIGEgKiBhIC0gOSAqIGEgKiBiICsgMjcgKiBjKSAqICgxLzI3KSxcclxuXHRcdFx0cTIgPSBxICogMC41LFxyXG5cdFx0XHRkaXNjcmltaW5hbnQgPSBxMiAqIHEyICsgcDMgKiBwMyAqIHAzO1xyXG5cclxuXHRcdC8vIGFuZCBzb21lIHZhcmlhYmxlcyB3ZSdyZSBnb2luZyB0byB1c2UgbGF0ZXIgb246XHJcblx0XHR2YXIgdTEsIHYxLCByb290O1xyXG5cclxuXHRcdC8vVGhyZWUgcmVhbCByb290cyBjYW4gbmV2ZXIgaGFwcGVuIGlmIHAxKDAsMCkgYW5kIHA0KDEsMSk7XHJcblxyXG5cdFx0Ly8gdGhyZWUgcmVhbCByb290cywgYnV0IHR3byBvZiB0aGVtIGFyZSBlcXVhbDpcclxuXHRcdGlmIChkaXNjcmltaW5hbnQgPCAwKSB7XHJcblx0XHRcdHZhciBtcDMgPSAtcCAvIDMsXHJcblx0XHRcdFx0bXAzMyA9IG1wMyAqIG1wMyAqIG1wMyxcclxuXHRcdFx0XHRyID0gc3FydChtcDMzKSxcclxuXHRcdFx0XHR0ID0gLXEgLyAoMiAqIHIpLFxyXG5cdFx0XHRcdGNvc3BoaSA9IHQgPCAtMSA/IC0xIDogdCA+IDEgPyAxIDogdCxcclxuXHRcdFx0XHRwaGkgPSBhY29zKGNvc3BoaSksXHJcblx0XHRcdFx0Y3J0ciA9IGN1YmVyb290KHIpLFxyXG5cdFx0XHRcdHQxID0gMiAqIGNydHI7XHJcblx0XHRcdHJvb3QgPSB0MSAqIGNvcygocGhpICsgNCAqIFBJKSAvIDMpIC0gYSAvIDM7XHJcblx0XHR9ZWxzZSBpZiAoZGlzY3JpbWluYW50ID09PSAwKSB7XHJcblx0XHRcdHUxID0gcTIgPCAwID8gY3ViZXJvb3QoLXEyKSA6IC1jdWJlcm9vdChxMik7XHJcblx0XHRcdHJvb3QgPSAtdTEgLSBhICogaTM7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0dmFyIHNkID0gc3FydChkaXNjcmltaW5hbnQpO1xyXG5cdFx0XHQvLyBvbmUgcmVhbCByb290LCB0d28gY29tcGxleCByb290c1xyXG5cdFx0XHR1MSA9IGN1YmVyb290KHNkIC0gcTIpO1xyXG5cdFx0XHR2MSA9IGN1YmVyb290KHNkICsgcTIpO1xyXG5cdFx0XHRyb290ID0gdTEgLSB2MSAtIGEgKiBpMztcdFxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBwb2ludChyb290LCB0aGlzWzFdLCB0aGlzWzNdLCB0aGlzWzVdLCB0aGlzWzddKTtcclxuXHR9XHJcblx0LyoqXHJcblx0XHRHaXZlbiBhIENhbnZhcyAyRCBjb250ZXh0IG9iamVjdCBhbmQgc2NhbGUgdmFsdWUsIHN0cm9rZXMgYSBjdWJpYyBiZXppZXIgY3VydmUuXHJcblx0Ki9cclxuXHRkcmF3KGN0eCwgcyA9IDEpe1xyXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0Y3R4Lm1vdmVUbyh0aGlzWzBdKnMsIHRoaXNbMV0qcylcclxuXHRcdGN0eC5iZXppZXJDdXJ2ZVRvKFxyXG5cdFx0XHR0aGlzWzJdKnMsIHRoaXNbM10qcyxcclxuXHRcdFx0dGhpc1s0XSpzLCB0aGlzWzVdKnMsXHJcblx0XHRcdHRoaXNbNl0qcywgdGhpc1s3XSpzXHJcblx0XHRcdClcclxuXHRcdGN0eC5zdHJva2UoKVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IHtDQmV6aWVyfSIsIi8qKlxyXG5cdEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgYSB0b3VjaCBzY3JvbGxpbmcgaW50ZXJmYWNlIHVzaW5nIHRvdWNoIGV2ZW50c1xyXG4qL1xyXG5jbGFzcyBUb3VjaFNjcm9sbGVyIHtcclxuICAgIC8qKiBcclxuICAgICAgICBDb25zdHJ1Y3RzIGEgdG91Y2ggb2JqZWN0IGFyb3VuZCBhIGdpdmVuIGRvbSBlbGVtZW50LiBGdW5jdGlvbnMgbGlzdGVuZXJzIGNhbiBiZSBib3VuZCB0byB0aGlzIG9iamVjdCB1c2luZ1xyXG4gICAgICAgIHRoaXMgYWRkRXZlbnRMaXN0ZW5lciBtZXRob2QuXHJcbiAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgZHJhZyA9IDAuMDIsIHRvdWNoaWQgPSAwKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5vcmlnaW5feCA9IDA7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5feSA9IDA7XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eV94ID0gMDtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5X3kgPSAwO1xyXG4gICAgICAgIHRoaXMuR08gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZHJhZyA9IChkcmFnID4gMCkgPyBkcmFnIDogMC4wMjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAoIXRvdWNoaWQgaW5zdGFuY2VvZiBOdW1iZXIpXHJcbiAgICAgICAgICAgIHRvdWNoaWQgPSAwO1xyXG5cclxuICAgICAgICBsZXQgdGltZV9vbGQgPSAwO1xyXG5cclxuICAgICAgICBsZXQgZnJhbWUgPSAoZHgsIGR5LCBzdGVwcywgcmF0aW8gPSAxKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgZHJhZ192YWwgPSB0aGlzLmRyYWc7XHJcblxyXG4gICAgICAgICAgICBkeCAtPSBkeCAqIGRyYWdfdmFsICogc3RlcHMgKiByYXRpbztcclxuICAgICAgICAgICAgZHkgLT0gZHkgKiBkcmFnX3ZhbCAqIHN0ZXBzICogcmF0aW87XHJcblxyXG4gICAgICAgICAgICBsZXQgZG0gPSBNYXRoLm1heChNYXRoLmFicyhkeSksIE1hdGguYWJzKGR5KSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZW5kID0gIShzdGVwcyA+IDAgJiYgZG0gPiAwLjEgJiYgdGhpcy5HTyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWVuZCkge1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBmcmFtZShkeCwgZHksIDEpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZW5kID0gZW5kICYmIHN0ZXBzICE9IDA7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGlzdGVuZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpc3RlbmVyc1tpXSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkdPID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmV2ZW50X2IgPSAoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgdGltZV9vbGQgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b3VjaCA9IGUudG91Y2hlc1t0b3VjaGlkXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHlfeCA9IHRoaXMub3JpZ2luX3ggLSB0b3VjaC5jbGllbnRYO1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5X3kgPSB0aGlzLm9yaWdpbl95IC0gdG91Y2guY2xpZW50WTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luX3ggPSB0b3VjaC5jbGllbnRYO1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbl95ID0gdG91Y2guY2xpZW50WTtcclxuXHJcbiAgICAgICAgICAgIGZyYW1lKHRoaXMudmVsb2NpdHlfeCwgdGhpcy52ZWxvY2l0eV95LCAwLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZXZlbnRfYyA9IChlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdGltZV9uZXcgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBkaWZmID0gdGltZV9uZXcgLSB0aW1lX29sZDtcclxuXHJcbiAgICAgICAgICAgIGxldCBzdGVwcyA9IE1hdGgubWluKGRpZmYgLyA4LjY2NjY2NjYsIDEgLyB0aGlzLmRyYWcpOyAvLyA2MCBGUFNcclxuXHJcbiAgICAgICAgICAgIHRoaXMuR08gPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgZnJhbWUodGhpcy52ZWxvY2l0eV94LCB0aGlzLnZlbG9jaXR5X3ksIHN0ZXBzKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHlfeCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHlfeSA9IDA7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLmV2ZW50X2IpO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMuZXZlbnRfYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmV2ZW50X2EgPSAoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYoIXRoaXMuR08pe1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmdWFsdCgpO1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGltZV9vbGQgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuR08gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b3VjaCA9IGUudG91Y2hlc1t0b3VjaGlkXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdG91Y2gpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbl95ID0gdG91Y2guY2xpZW50WTtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5feCA9IHRvdWNoLmNsaWVudFg7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLmV2ZW50X2IpO1xyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMuZXZlbnRfYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy5ldmVudF9hKTtcclxuXHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMuZXZlbnRfYSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhZGRFdmVudExpc3RlbmVyKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKGNhbGxiYWNrIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpc3RlbmVyc1tpXSA9PSBjYWxsYmFjaykgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVFdmVudExpc3RlbmVyKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpc3RlbmVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnNbaV0gPT0gY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFRvdWNoU2Nyb2xsZXJcclxufSIsImltcG9ydCB7TGV4ZXJ9IGZyb20gXCIuL2NvbW1vbi9zdHJpbmdfcGFyc2luZy9sZXhlclwiXHJcbmltcG9ydCB7VG9rZW5pemVyfSBmcm9tIFwiLi9jb21tb24vc3RyaW5nX3BhcnNpbmcvdG9rZW5pemVyXCJcclxuXHJcbi8vVGltZVxyXG5pbXBvcnQge21vbnRoc30gZnJvbSBcIi4vY29tbW9uL2RhdGVfdGltZS9tb250aHNcIlxyXG5pbXBvcnQge2Rvd30gZnJvbSBcIi4vY29tbW9uL2RhdGVfdGltZS9kYXlzX29mX3dlZWtcIlxyXG5pbXBvcnQge0dldERheVN0YXJ0QW5kRW5kfSBmcm9tIFwiLi9jb21tb24vZGF0ZV90aW1lL2RheV9zdGFydF9hbmRfZW5kX2Vwb2NoXCJcclxuaW1wb3J0IHtmbG9hdDI0dG8xMk1vZFRpbWV9IGZyb20gXCIuL2NvbW1vbi9kYXRlX3RpbWUvdGltZS5qc1wiXHJcblxyXG4vL01hdGhcclxuaW1wb3J0IHtRQmV6aWVyfSBmcm9tIFwiLi9jb21tb24vbWF0aC9xdWFkcmF0aWNfYmV6aWVyXCJcclxuaW1wb3J0IHtDQmV6aWVyfSBmcm9tIFwiLi9jb21tb24vbWF0aC9jdWJpY19iZXppZXJcIlxyXG5pbXBvcnQge1R1cm5RdWVyeUludG9EYXRhLCBUdXJuRGF0YUludG9RdWVyeX0gZnJvbSBcIi4vY29tbW9uL3VybC91cmxcIlxyXG5pbXBvcnQge1RvdWNoU2Nyb2xsZXJ9IGZyb20gXCIuL2NvbW1vbi9ldmVudC90b3VjaF9zY3JvbGxlclwiXHJcblxyXG5cclxuLyoqKioqKioqKioqIFN0cmluZyBQYXJzaW5nIEJhc2ljIEZ1bmN0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKi9cclxuLyoqXHJcblx0SWYgYSBzdHJpbmcgb2JqZWN0IGlzIHBhc3NlZCwgY3JlYXRlcyBhIGxleGVyIHRoYXQgdG9rZW5pemUgdGhlIGlucHV0IHN0cmluZy4gXHJcbiovXHJcbmZ1bmN0aW9uIExleChzdHJpbmcpe1xyXG5cdGlmKHR5cGVvZihzdHJpbmcpICE9PSBcInN0cmluZ1wiKXtcclxuXHRcdGNvbnNvbGUud2FybihcIkNhbm5vdCBjcmVhdGUgYSBsZXhlciBvbiBhIG5vbi1zdHJpbmcgb2JqZWN0IVwiKTtcclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIG5ldyBMZXhlcihuZXcgVG9rZW5pemVyKHN0cmluZykpO1xyXG59XHJcblxyXG5leHBvcnQge1xyXG5cdExleCxcclxuXHRMZXhlciwgXHJcblx0VG9rZW5pemVyLFxyXG5cdG1vbnRocyxcclxuXHRkb3csXHJcblx0UUJlemllcixcclxuXHRDQmV6aWVyLFxyXG5cdFR1cm5RdWVyeUludG9EYXRhLFxyXG5cdFR1cm5EYXRhSW50b1F1ZXJ5LFxyXG5cdEdldERheVN0YXJ0QW5kRW5kLFxyXG5cdFRvdWNoU2Nyb2xsZXIsXHJcblx0ZmxvYXQyNHRvMTJNb2RUaW1lXHJcbn07XHJcblxyXG4vKioqKioqIEdsb2JhbCBPYmplY3QgRXh0ZW5kZXJzICoqKioqKioqKioqKiovXHJcbi8vKlxyXG5FbGVtZW50LnByb3RvdHlwZS5nZXRXaW5kb3dUb3AgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuICh0aGlzLm9mZnNldFRvcCArICgodGhpcy5wYXJlbnRFbGVtZW50KSA/IHRoaXMucGFyZW50RWxlbWVudC5nZXRXaW5kb3dUb3AoKSA6IDApKTtcclxufVxyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuZ2V0V2luZG93TGVmdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gKHRoaXMub2Zmc2V0TGVmdCArICgodGhpcy5wYXJlbnRFbGVtZW50KSA/IHRoaXMucGFyZW50RWxlbWVudC5nZXRXaW5kb3dMZWZ0KCkgOiAwKSk7XHJcbn1cclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmdldFBhcmVudFdpbmRvd1RvcCA9IGZ1bmN0aW9uKGJvb2wgPSBmYWxzZSl7XHJcbiAgICByZXR1cm4gKCgoYm9vbCA/IHRoaXMub2Zmc2V0VG9wIDogMCkpKygodGhpcy5wYXJlbnRFbGVtZW50KSA/IHRoaXMucGFyZW50RWxlbWVudC5nZXRQYXJlbnRXaW5kb3dUb3AodHJ1ZSkgOiAwKSk7XHJcbn1cclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmdldFBhcmVudFdpbmRvd0xlZnQgPSBmdW5jdGlvbihib29sID0gZmFsc2Upe1xyXG4gICAgcmV0dXJuICgoKGJvb2wgPyB0aGlzLm9mZnNldExlZnQgOiAwKSkrKCh0aGlzLnBhcmVudEVsZW1lbnQpID8gdGhpcy5wYXJlbnRFbGVtZW50LmdldFdpbmRvd0xlZnQodHJ1ZSkgOiAwKSk7XHJcbn1cclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmdldFN0eWxlID0gZnVuY3Rpb24oc3R5bGVfbmFtZSl7XHJcblx0cmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMsbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShzdHlsZV9uYW1lKTtcclxufVxyXG4vLyovIiwiaW1wb3J0IHtcclxuICAgIE5VTUJFUlxyXG59IGZyb20gXCIuL251bWJlcl90eXBlLmpzXCJcclxuaW1wb3J0IHtcclxuICAgIExleFxyXG59IGZyb20gXCIuLi9jb21tb25cIlxyXG5cclxubGV0IHNjYXBlX2RhdGUgPSBuZXcgRGF0ZSgpO1xyXG5zY2FwZV9kYXRlLnNldEhvdXJzKDApO1xyXG5zY2FwZV9kYXRlLnNldE1pbGxpc2Vjb25kcygwKTtcclxuc2NhcGVfZGF0ZS5zZXRTZWNvbmRzKDApO1xyXG5zY2FwZV9kYXRlLnNldFRpbWUoMCk7XHJcblxyXG5sZXQgREFURSA9IG5ldyhjbGFzcyBEYXRlU2NoZW1hIGV4dGVuZHMgTlVNQkVSLmNvbnN0cnVjdG9yIHtcclxuICAgIHBhcnNlKHZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICghaXNOYU4odmFsdWUpKVxyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUpO1xyXG5cclxuICAgICAgICBsZXQgbGV4ID0gTGV4KHZhbHVlKTtcclxuXHJcbiAgICAgICAgbGV0IHllYXIgPSBwYXJzZUludChsZXgudG9rZW4udGV4dClcclxuXHJcbiAgICAgICAgaWYgKHllYXIpIHtcclxuXHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0SG91cnMoMCk7XHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0TWlsbGlzZWNvbmRzKDApO1xyXG4gICAgICAgICAgICBzY2FwZV9kYXRlLnNldFNlY29uZHMoMCk7XHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0VGltZSgwKTtcclxuXHJcbiAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIGxldCBtb250aCA9IHBhcnNlSW50KGxleC50b2tlbi50ZXh0KSAtIDE7XHJcbiAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIGxldCBkYXkgPSBwYXJzZUludChsZXgudG9rZW4udGV4dClcclxuICAgICAgICAgICAgc2NhcGVfZGF0ZS5zZXRGdWxsWWVhcih5ZWFyKTtcclxuICAgICAgICAgICAgc2NhcGVfZGF0ZS5zZXREYXRlKGRheSk7XHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0TW9udGgobW9udGgpO1xyXG5cclxuICAgICAgICAgICAgbGV4Lm5leHQoKVxyXG4gICAgICAgICAgICBpZiAobGV4LnRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaG91cnMgPSBwYXJzZUludChsZXgudG9rZW4udGV4dClcclxuICAgICAgICAgICAgICAgIGxleC5uZXh0KClcclxuICAgICAgICAgICAgICAgIGxleC5uZXh0KClcclxuICAgICAgICAgICAgICAgIGxldCBtaW51dGVzID0gcGFyc2VJbnQobGV4LnRva2VuLnRleHQpXHJcblxyXG4gICAgICAgICAgICAgICAgc2NhcGVfZGF0ZS5zZXRIb3Vycyhob3Vycyk7XHJcbiAgICAgICAgICAgICAgICBzY2FwZV9kYXRlLnNldE1pbnV0ZXMobWludXRlcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzY2FwZV9kYXRlLnZhbHVlT2YoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gKG5ldyBEYXRlKHZhbHVlKSkudmFsdWVPZigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICBcclxuICAgICAqL1xyXG4gICAgdmVyaWZ5KHZhbHVlLCByZXN1bHQpIHtcclxuICAgICAgICB0aGlzLnBhcnNlKHZhbHVlKTtcclxuICAgICAgICBzdXBlci52ZXJpZnkodmFsdWUsIHJlc3VsdCk7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyKGlkZW50aWZpZXIsIGZpbHRlcnMpIHtcclxuXHJcbiAgICAgICAgaWYgKGZpbHRlcnMubGVuZ3RoID4gMSkge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBmaWx0ZXJzLmxlbmd0aCAtIDE7IGkgPCBsOyBpICs9IDIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzdGFydCA9IGZpbHRlcnNbaV07XHJcbiAgICAgICAgICAgICAgICBsZXQgZW5kID0gZmlsdGVyc1tpICsgMV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0IDw9IGlkZW50aWZpZXIgJiYgaWRlbnRpZmllciA8PSBlbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0cmluZyh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiAobmV3IERhdGUodmFsdWUpKSArIFwiXCI7XHJcbiAgICB9XHJcbn0pXHJcblxyXG5leHBvcnQge1xyXG4gICAgREFURVxyXG59IiwiaW1wb3J0IHtcclxuICAgIE5VTUJFUlxyXG59IGZyb20gXCIuL251bWJlcl90eXBlLmpzXCJcclxuXHJcbmxldCBUSU1FID0gbmV3KGNsYXNzIFRpbWVTY2hlbWEgZXh0ZW5kcyBOVU1CRVIuY29uc3RydWN0b3Ige1xyXG5cclxuICAgIHBhcnNlKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCFpc05hTih2YWx1ZSkpXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIGhvdXIgPSBwYXJzZUludCh2YWx1ZS5zcGxpdChcIjpcIilbMF0pO1xyXG4gICAgICAgICAgICB2YXIgbWluID0gcGFyc2VJbnQodmFsdWUuc3BsaXQoXCI6XCIpWzFdLnNwbGl0KFwiIFwiKVswXSk7XHJcbiAgICAgICAgICAgIHZhciBoYWxmID0gKHZhbHVlLnNwbGl0KFwiOlwiKVsxXS5zcGxpdChcIiBcIilbMV0udG9Mb3dlckNhc2UoKSA9PSBcInBtXCIpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdmFyIGhvdXIgPSAwO1xyXG4gICAgICAgICAgICB2YXIgbWluID0gMDtcclxuICAgICAgICAgICAgdmFyIGhhbGYgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoKGhvdXIgKyAoKGhhbGYpID8gMTIgOiAwKSArIChtaW4gLyA2MCkpKTtcclxuICAgIH1cclxuXHJcbiAgICB2ZXJpZnkodmFsdWUsIHJlc3VsdCkge1xyXG4gICAgICAgIHRoaXMucGFyc2UodmFsdWUpO1xyXG4gICAgICAgIHN1cGVyLnZlcmlmeSh2YWx1ZSwgcmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXIoaWRlbnRpZmllciwgZmlsdGVycykge1xyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgc3RyaW5nKHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIChuZXcgRGF0ZSh2YWx1ZSkpICsgXCJcIjtcclxuICAgIH1cclxufSkoKVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFRJTUVcclxufSIsImltcG9ydCB7XHJcbiAgICBTY2hlbWFUeXBlXHJcbn0gZnJvbSBcIi4vc2NoZW1hX3R5cGUuanNcIlxyXG5cclxubGV0IFNUUklORyA9IG5ldyhjbGFzcyBTdHJpbmdTY2hlbWEgZXh0ZW5kcyBTY2hlbWFUeXBlIHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnN0YXJ0X3ZhbHVlID0gXCJcIlxyXG4gICAgfVxyXG4gICAgcGFyc2UodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gdmFsdWUgKyBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIHZlcmlmeSh2YWx1ZSwgcmVzdWx0KSB7XHJcbiAgICAgICAgcmVzdWx0LnZhbGlkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXIoaWRlbnRpZmllciwgZmlsdGVycykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIubWF0Y2goZmlsdGVyc1tpXStcIlwiKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG59KSgpXHJcblxyXG5leHBvcnQge1xyXG4gICAgU1RSSU5HXHJcbn07IiwiaW1wb3J0IHtcclxuICAgIFNjaGVtYVR5cGVcclxufSBmcm9tIFwiLi9zY2hlbWFfdHlwZS5qc1wiXHJcblxyXG5sZXQgQk9PTCA9IG5ldyhjbGFzcyBCb29sU2NoZW1hIGV4dGVuZHMgU2NoZW1hVHlwZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdGFydF92YWx1ZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlKHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuICh2YWx1ZSkgPyB0cnVlIDogZmFsc2U7IFxyXG4gICAgfVxyXG5cclxuICAgIHZlcmlmeSh2YWx1ZSwgcmVzdWx0KSB7XHJcbiAgICAgICAgcmVzdWx0LnZhbGlkID0gdHJ1ZTtcclxuICAgICAgICBpZighdmFsdWUgaW5zdGFuY2VvZiBCb29sZWFuKXtcclxuICAgICAgICAgICAgcmVzdWx0LnZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJlc3VsdC5yZWFzb24gPSBcIiBWYWx1ZSBpcyBub3QgYSBCb29sZWFuLlwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcihpZGVudGlmaWVyLCBmaWx0ZXJzKSB7XHJcbiAgICAgICAgaWYodmFsdWUgaW5zdGFuY2VvZiBCT09MKVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG59KSgpXHJcblxyXG5leHBvcnQge1xyXG4gICAgQk9PTFxyXG59OyIsImltcG9ydCB7U2NoZW1hVHlwZX0gZnJvbSBcIi4vc2NoZW1hX3R5cGVcIlxyXG5pbXBvcnQge0RBVEV9IGZyb20gXCIuL2RhdGVfdHlwZVwiXHJcbmltcG9ydCB7VElNRX0gZnJvbSBcIi4vdGltZV90eXBlXCJcclxuaW1wb3J0IHtTVFJJTkd9IGZyb20gXCIuL3N0cmluZ190eXBlXCJcclxuaW1wb3J0IHtOVU1CRVJ9IGZyb20gXCIuL251bWJlcl90eXBlXCJcclxuaW1wb3J0IHtCT09MfSBmcm9tIFwiLi9ib29sX3R5cGVcIlxyXG5cclxubGV0IHNjaGVtYSA9IHtcclxuXHREQVRFLFxyXG5cdFNUUklORyxcclxuXHROVU1CRVIsXHJcblx0Qk9PTCxcclxuXHRUSU1FXHJcbn1cclxuXHJcbmV4cG9ydCB7U2NoZW1hVHlwZSwgc2NoZW1hfTsgIiwiaW1wb3J0IHtcclxuICAgIE1vZGVsQmFzZVxyXG59IGZyb20gXCIuL21vZGVsX2Jhc2UuanNcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIE1vZGVsQ29udGFpbmVyLFxyXG4gICAgTXVsdGlJbmRleGVkQ29udGFpbmVyXHJcbn0gZnJvbSBcIi4vbW9kZWxfY29udGFpbmVyXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBBcnJheU1vZGVsQ29udGFpbmVyXHJcbn0gZnJvbSBcIi4vYXJyYXlfY29udGFpbmVyXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBCVHJlZU1vZGVsQ29udGFpbmVyXHJcbn0gZnJvbSBcIi4vYnRyZWVfY29udGFpbmVyXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBTY2hlbWFUeXBlXHJcbn0gZnJvbSBcIi4uL3NjaGVtYS9zY2hlbWFzXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBTY2hlZHVsZXJcclxufSBmcm9tIFwiLi4vc2NoZWR1bGVyXCJcclxuXHJcblxyXG4vKipcclxuICAgIFRoaXMgaXMgdXNlZCBieSBOTW9kZWwgdG8gY3JlYXRlIGN1c3RvbSBwcm9wZXJ0eSBnZXR0ZXIgYW5kIHNldHRlcnMgXHJcbiAgICBvbiBub24tTW9kZWxDb250YWluZXIgYW5kIG5vbi1Nb2RlbCBwcm9wZXJ0aWVzIG9mIHRoZSBOTW9kZWwgY29uc3RydWN0b3IuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBDcmVhdGVTY2hlbWVkUHJvcGVydHkoY29uc3RydWN0b3IsIHNjaGVtZSwgc2NoZW1hX25hbWUpIHtcclxuXHJcbiAgICBpZiAoY29uc3RydWN0b3IucHJvdG90eXBlW3NjaGVtYV9uYW1lXSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgbGV0IF9fc2hhZG93X25hbWVfXyA9IGBfXyR7c2NoZW1hX25hbWV9X19gO1xyXG5cclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBfX3NoYWRvd19uYW1lX18sIHtcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgIHZhbHVlOiBzY2hlbWUuc3RhcnRfdmFsdWUgfHwgdW5kZWZpbmVkXHJcbiAgICB9KVxyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHNjaGVtYV9uYW1lLCB7XHJcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzW19fc2hhZG93X25hbWVfX107XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHtcclxuICAgICAgICAgICAgICAgIHZhbGlkOiBmYWxzZVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IHZhbCA9IHNjaGVtZS5wYXJzZSh2YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICBzY2hlbWUudmVyaWZ5KHZhbCwgcmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQudmFsaWQgJiYgdGhpc1tfX3NoYWRvd19uYW1lX19dICE9IHZhbClcclxuICAgICAgICAgICAgICAgICh0aGlzW19fc2hhZG93X25hbWVfX10gPSB2YWwsIHRoaXMuc2NoZWR1bGVVcGRhdGUoc2NoZW1hX25hbWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICAgIFRoaXMgaXMgdXNlZCBieSBOTW9kZWwgdG8gY3JlYXRlIGN1c3RvbSBwcm9wZXJ0eSBnZXR0ZXIgYW5kIHNldHRlcnMgXHJcbiAgICBvbiBTY2hlbWVkIE1vZGVsQ29udGFpbmVyIHByb3BlcnRpZXMgb2YgdGhlIE5Nb2RlbCBjb25zdHJ1Y3Rvci5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIENyZWF0ZU1DU2NoZW1lZFByb3BlcnR5KGNvbnN0cnVjdG9yLCBzY2hlbWUsIHNjaGVtYV9uYW1lKSB7XHJcblxyXG4gICAgbGV0IHNjaGVtYSA9IHNjaGVtZS5zY2hlbWE7XHJcblxyXG4gICAgbGV0IG1jX2NvbnN0cnVjdG9yID0gc2NoZW1lLmNvbnRhaW5lcjtcclxuXHJcbiAgICBsZXQgX19zaGFkb3dfbmFtZV9fID0gYF9fJHtzY2hlbWFfbmFtZX1fX2A7XHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgX19zaGFkb3dfbmFtZV9fLCB7XHJcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgdmFsdWU6IG51bGxcclxuICAgIH0pXHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgc2NoZW1hX25hbWUsIHtcclxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpc1tfX3NoYWRvd19uYW1lX19dKVxyXG4gICAgICAgICAgICAgICAgdGhpc1tfX3NoYWRvd19uYW1lX19dID0gbmV3IG1jX2NvbnN0cnVjdG9yKHNjaGVtZS5zY2hlbWEpXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1tfX3NoYWRvd19uYW1lX19dO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBNQyA9IHRoaXNbX19zaGFkb3dfbmFtZV9fXTtcclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZih2YWx1ZSkgPT0gXCJzdHJpbmdcIilcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBNQyA9IG5ldyBtY19jb25zdHJ1Y3RvcihzY2hlbWUuc2NoZW1hKTtcclxuICAgICAgICAgICAgICAgIHRoaXNbX19zaGFkb3dfbmFtZV9fXSA9IE1DO1xyXG4gICAgICAgICAgICAgICAgTUMuaW5zZXJ0KGRhdGEpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlVXBkYXRlKHNjaGVtYV9uYW1lKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIG1jX2NvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzW19fc2hhZG93X25hbWVfX10gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNjaGVtYV9uYW1lKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZVVwZGF0ZShzY2hlbWFfbmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICAgIFRoaXMgaXMgdXNlZCBieSBOTW9kZWwgdG8gY3JlYXRlIGN1c3RvbSBwcm9wZXJ0eSBnZXR0ZXIgYW5kIHNldHRlcnMgXHJcbiAgICBvbiBNb2RlbCBwcm9wZXJ0aWVzIG9mIHRoZSBOTW9kZWwgY29uc3RydWN0b3IuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBDcmVhdGVNb2RlbFByb3BlcnR5KGNvbnN0cnVjdG9yLCBzY2hlbWUsIHNjaGVtYV9uYW1lKSB7XHJcblxyXG4gICAgbGV0IHNjaGVtYSA9IHNjaGVtZS5zY2hlbWE7XHJcblxyXG4gICAgbGV0IF9fc2hhZG93X25hbWVfXyA9IGBfXyR7c2NoZW1hX25hbWV9X19gO1xyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHNjaGVtYV9uYW1lLCB7XHJcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG5cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgc2NoZW1hX25hbWUsIHtcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IG5ldyBzY2hlbWUoKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1tzY2hlbWFfbmFtZV07XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge31cclxuICAgIH0pXHJcbn1cclxuXHJcbmNsYXNzIE1vZGVsIGV4dGVuZHMgTW9kZWxCYXNlIHtcclxuICAgIC8qKlxyXG4gICAgIFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy9UaGUgc2NoZW1hIGlzIHN0b3JlZCBkaXJlY3RseSBvbiB0aGUgY29uc3RydWN0b3IuIElmIGl0IGlzIG5vdCB0aGVyZSwgdGhlbiBjb25zaWRlciB0aGlzIG1vZGVsIHR5cGUgdG8gXCJBTllcIlxyXG4gICAgICAgIGxldCBzY2hlbWEgPSB0aGlzLmNvbnN0cnVjdG9yLnNjaGVtYTtcclxuXHJcbiAgICAgICAgaWYgKHNjaGVtYSkge1xyXG4gICAgICAgICAgICBsZXQgX19GaW5hbENvbnN0cnVjdG9yX18gPSBzY2hlbWEuX19GaW5hbENvbnN0cnVjdG9yX187XHJcblxyXG4gICAgICAgICAgICBsZXQgY29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xyXG5cclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgXCJzY2hlbWFcIiwge1xyXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHNjaGVtYVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgaWYgKCFfX0ZpbmFsQ29uc3RydWN0b3JfXykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgc2NoZW1hX25hbWUgaW4gc2NoZW1hKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNjaGVtZSA9IHNjaGVtYVtzY2hlbWFfbmFtZV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY2hlbWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2NoZW1lWzBdICYmIHNjaGVtZVswXS5jb250YWluZXIgJiYgc2NoZW1lWzBdLnNjaGVtYSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ3JlYXRlTUNTY2hlbWVkUHJvcGVydHkoY29uc3RydWN0b3IsIHNjaGVtZVswXSwgc2NoZW1hX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjaGVtZVswXSBpbnN0YW5jZW9mIE1vZGVsQ29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVNb2RlbFByb3BlcnR5KGNvbnN0cnVjdG9yLCBzY2hlbWVbMF0uY29uc3RydWN0b3IsIHNjaGVtYV9uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2NoZW1lIGluc3RhbmNlb2YgTW9kZWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZU1vZGVsUHJvcGVydHkoY29uc3RydWN0b3IsIHNjaGVtZVswXS5jb25zdHJ1Y3Rvciwgc2NoZW1hX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNjaGVtZSBpbnN0YW5jZW9mIFNjaGVtYVR5cGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZVNjaGVtZWRQcm9wZXJ0eShjb25zdHJ1Y3Rvciwgc2NoZW1lLCBzY2hlbWFfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYENvdWxkIG5vdCBjcmVhdGUgcHJvcGVydHkgJHtzY2hlbWFfbmFtZX0uYClcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgT2JqZWN0LnNlYWwoY29uc3RydWN0b3IpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2NoZW1hLCBcIl9fRmluYWxDb25zdHJ1Y3Rvcl9fXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAvL3NjaGVtYS5fX0ZpbmFsQ29uc3RydWN0b3JfXyA9IGNvbnN0cnVjdG9yO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAvL1N0YXJ0IHRoZSBwcm9jZXNzIG92ZXIgd2l0aCBhIG5ld2x5IG1pbnRlZCBNb2RlbCB0aGF0IGhhcyB0aGUgcHJvcGVydGllcyBkZWZpbmVkIGluIHRoZSBTY2hlbWFcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgY29uc3RydWN0b3IoZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvKiBUaGlzIHdpbGwgYmUgYW4gQU5ZIE1vZGVsICovXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQW55TW9kZWwoZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF0YSlcclxuICAgICAgICAgICAgdGhpcy5hZGQoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmVtb3ZlcyBhbGwgaGVsZCByZWZlcmVuY2VzIGFuZCBjYWxscyB1bnNldE1vZGVsIG9uIGFsbCBsaXN0ZW5pbmcgdmlld3MuXHJcbiAgICAqL1xyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zY2hlbWEgPSBudWxsO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBhIGluIHRoaXMpIHtcclxuICAgICAgICAgICAgbGV0IHByb3AgPSB0aGlzW2FdO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mKHByb3ApID09IFwib2JqZWN0XCIgJiYgcHJvcC5kZXN0cnVjdG9yIGluc3RhbmNlb2YgRnVuY3Rpb24pXHJcbiAgICAgICAgICAgICAgICBwcm9wLmRlc3RydWN0b3IoKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpc1thXSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgLy9kZWJ1Z2dlclxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEdpdmVuIGEga2V5LCByZXR1cm5zIGFuIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgdGhlIHN0YXR1cyBvZiB0aGUgdmFsdWUgY29udGFpbmVkLCBpZiBpdCBpcyB2YWxpZCBvciBub3QsIGFjY29yZGluZyB0byB0aGUgc2NoZW1hIGZvciB0aGF0IHByb3BlcnR5LiBcclxuICAgICovXHJcbiAgICB2ZXJpZnkoa2V5KSB7XHJcblxyXG4gICAgICAgIGxldCBvdXRfZGF0YSA9IHtcclxuICAgICAgICAgICAgdmFsaWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHJlYXNvbjogXCJcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBzY2hlbWUgPSB0aGlzLnNjaGVtYVtrZXldO1xyXG5cclxuICAgICAgICBpZiAoc2NoZW1lKSB7XHJcbiAgICAgICAgICAgIGlmIChzY2hlbWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzY2hlbWUgaW5zdGFuY2VvZiBNb2RlbCkge1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNjaGVtZS52ZXJpZnkodGhpc1trZXldLCBvdXRfZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfZGF0YVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJldHVybnMgYSBwYXJzZWQgdmFsdWUgYmFzZWQgb24gdGhlIGtleSBcclxuICAgICovXHJcbiAgICBzdHJpbmcoa2V5KSB7XHJcbiAgICAgICAgbGV0IG91dF9kYXRhID0ge1xyXG4gICAgICAgICAgICB2YWxpZDogdHJ1ZSxcclxuICAgICAgICAgICAgcmVhc29uOiBcIlwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKGtleSkge1xyXG4gICAgICAgICAgICB2YXIgc2NoZW1lID0gdGhpcy5zY2hlbWFba2V5XTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzY2hlbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzY2hlbWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XS5zdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2NoZW1lIGluc3RhbmNlb2YgTW9kZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0uc3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY2hlbWUuc3RyaW5nKHRoaXNba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQHBhcmFtIGRhdGEgOiBBbiBvYmplY3QgY29udGFpbmluZyBrZXkgdmFsdWUgcGFpcnMgdG8gaW5zZXJ0IGludG8gdGhlIG1vZGVsLiBcclxuICAgICovXHJcbiAgICBhZGQoZGF0YSkge1xyXG4gICAgICAgIGZvciAobGV0IGEgaW4gZGF0YSlcclxuICAgICAgICAgICAgaWYgKGEgaW4gdGhpcykgdGhpc1thXSA9IGRhdGFbYV07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldChkYXRhKSB7XHJcbiAgICAgICAgdmFyIG91dF9kYXRhID0ge307XHJcblxyXG4gICAgICAgIGlmICghZGF0YSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBmb3IgKHZhciBhIGluIGRhdGEpXHJcbiAgICAgICAgICAgICAgICBpZiAoYSBpbiB0aGlzKSBvdXRfZGF0YVthXSA9IHRoaXNbYV07XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgbGV0IG91dCA9IHt9O1xyXG5cclxuICAgICAgICBsZXQgc2NoZW1hID0gdGhpcy5zY2hlbWE7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHByb3AgaW4gc2NoZW1hKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2NoZW1lID0gc2NoZW1hW3Byb3BdO1xyXG5cclxuICAgICAgICAgICAgb3V0W3Byb3BdID0gdGhpc1twcm9wXVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAgICBUaGlzIGlzIHVzZWQgYnkgTk1vZGVsIHRvIGNyZWF0ZSBjdXN0b20gcHJvcGVydHkgZ2V0dGVyIGFuZCBzZXR0ZXJzIFxyXG4gICAgb24gbm9uLU1vZGVsQ29udGFpbmVyIGFuZCBub24tTW9kZWwgcHJvcGVydGllcyBvZiB0aGUgTk1vZGVsIGNvbnN0cnVjdG9yLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gQ3JlYXRlR2VuZXJpY1Byb3BlcnR5KGNvbnN0cnVjdG9yLCBwcm9wX3ZhbCwgcHJvcF9uYW1lLCBtb2RlbCkge1xyXG5cclxuICAgIGlmIChjb25zdHJ1Y3Rvci5wcm90b3R5cGVbcHJvcF9uYW1lXSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgbGV0IF9fc2hhZG93X25hbWVfXyA9IGBfXyR7cHJvcF9uYW1lfV9fYDtcclxuXHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgX19zaGFkb3dfbmFtZV9fLCB7XHJcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICB2YWw6IHByb3BfdmFsXHJcbiAgICB9KVxyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3BfbmFtZSwge1xyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbX19zaGFkb3dfbmFtZV9fXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQudmFsaWQgJiYgdGhpc1tfX3NoYWRvd19uYW1lX19dICE9IHZhbClcclxuICAgICAgICAgICAgICAgICh0aGlzW19fc2hhZG93X25hbWVfX10gPSB2YWwsIG1vZGVsLnNjaGVkdWxlVXBkYXRlKHByb3BfbmFtZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIEFueU1vZGVsUHJveHlTZXQob2JqLCBwcm9wLCB2YWwpIHtcclxuICAgIGlmIChwcm9wIGluIG9iaiAmJiBvYmpbcHJvcF0gPT0gdmFsKVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcblxyXG4gICAgb2JqW3Byb3BdID0gdmFsO1xyXG5cclxuICAgIG9iai5zY2hlZHVsZVVwZGF0ZShwcm9wKTtcclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuY2xhc3MgQW55TW9kZWwgZXh0ZW5kcyBNb2RlbEJhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcHJvcF9uYW1lIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNbcHJvcF9uYW1lXSA9IGRhdGFbcHJvcF9uYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh0aGlzLCB7XHJcbiAgICAgICAgICAgIHNldDogQW55TW9kZWxQcm94eVNldFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQWxpYXMgZm9yIGRlc3RydWN0b3JcclxuICAgICovXHJcblxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZW1vdmVzIGFsbCBoZWxkIHJlZmVyZW5jZXMgYW5kIGNhbGxzIHVuc2V0TW9kZWwgb24gYWxsIGxpc3RlbmluZyB2aWV3cy5cclxuICAgICovXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGQoZGF0YSkge1xyXG4gICAgICAgIGZvciAodmFyIGEgaW4gZGF0YSlcclxuICAgICAgICAgICAgdGhpc1thXSA9IGRhdGFbYV07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KGRhdGEpIHtcclxuICAgICAgICB2YXIgb3V0X2RhdGEgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGEgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb3AgPSB0aGlzW2FdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRfZGF0YVthXSA9IHByb3A7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZW1vdmVzIGl0ZW1zIGluIGNvbnRhaW5lcnMgYmFzZWQgb24gbWF0Y2hpbmcgaW5kZXguXHJcbiAgICAqL1xyXG5cclxuICAgIHJlbW92ZShkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpIHtcclxuICAgICAgICBsZXQgb3V0ID0ge307XHJcblxyXG5cclxuICAgICAgICBmb3IgKGxldCBwcm9wIGluIHRoaXMpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChwcm9wID09IFwiZmlyc3Rfdmlld1wiIHx8XHJcbiAgICAgICAgICAgICAgICBwcm9wID09IFwiY2hhbmdlZF92YWx1ZXNcIiB8fFxyXG4gICAgICAgICAgICAgICAgcHJvcCA9PSBcIl9fX19TQ0hFRFVMRURfX19fXCIpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIG91dFtwcm9wXSA9IHRoaXNbcHJvcF1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9Kc29uU3RyaW5nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEgKyBcIlwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgTW9kZWwsXHJcbiAgICBBbnlNb2RlbCxcclxuICAgIE1vZGVsQ29udGFpbmVyLFxyXG4gICAgQXJyYXlNb2RlbENvbnRhaW5lcixcclxuICAgIE11bHRpSW5kZXhlZENvbnRhaW5lcixcclxuICAgIEJUcmVlTW9kZWxDb250YWluZXJcclxufSIsImltcG9ydCB7TW9kZWx9IGZyb20gXCIuL21vZGVsL21vZGVsXCJcclxuXHJcbmNsYXNzIENvbnRyb2xsZXJ7XHJcblx0XHJcblx0Y29uc3RydWN0b3IoKXtcclxuXHRcdHRoaXMubW9kZWwgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0ZGVzdHJ1Y3Rvcigpe1xyXG5cdFx0dGhpcy5tb2RlbCA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRzZXRNb2RlbChtb2RlbCl7XHJcblx0XHRpZihtb2RlbCBpbnN0YW5jZW9mIE1vZGVsKXtcclxuXHRcdFx0dGhpcy5tb2RlbCA9IG1vZGVsO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2V0KGRhdGEpe1xyXG5cdFx0aWYodGhpcy5tb2RlbClcclxuXHRcdFx0dGhpcy5tb2RlbC5hZGQoZGF0YSk7XHJcblx0XHRcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydHtDb250cm9sbGVyfSIsImltcG9ydCB7XHJcbiAgICBDb250cm9sbGVyXHJcbn0gZnJvbSBcIi4vY29udHJvbGxlclwiXHJcbi8qKlxyXG4gKiBUaGlzIENsYXNzIGlzIHJlc3BvbnNpYmxlIGZvciBoYW5kbGluZyByZXF1ZXN0cyB0byB0aGUgc2VydmVyLiBJdCBjYW4gYWN0IGFzIGEgY29udHJvbGxlciB0byBzcGVjaWZpY2FsbHkgcHVsbCBkYXRhIGRvd24gZnJvbSB0aGUgc2VydmVyIGFuZCBwdXNoIGludG8gZGF0YSBtZW1iZXJzLlxyXG4gKlxyXG4gKiB7bmFtZX0gR2V0dGVyXHJcbiAqL1xyXG5jbGFzcyBHZXR0ZXIgZXh0ZW5kcyBDb250cm9sbGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHVybCwgcHJvY2Vzc19kYXRhKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgICAgICB0aGlzLkZFVENIX0lOX1BST0dSRVNTID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ydXJsID0gcHJvY2Vzc19kYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChyZXF1ZXN0X29iamVjdCwgc3RvcmVfb2JqZWN0LCBzZWN1cmUgPSB0cnVlKSB7XHJcbiAgICAgICAgLy9pZih0aGlzLkZFVENIX0lOX1BST0dSRVNTKVxyXG4gICAgICAgIC8vICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHRoaXMuRkVUQ0hfSU5fUFJPR1JFU1MgPSB0cnVlO1xyXG5cclxuICAgICAgICB2YXIgdXJsID0gKChzZWN1cmUpID8gXCJodHRwczovL1wiIDogXCJodHRwOi8vXCIpICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyB0aGlzLnVybCArICggKHJlcXVlc3Rfb2JqZWN0KSA/IChcIj9cIiArIHRoaXMuX19wcm9jZXNzX3VybF9fKHJlcXVlc3Rfb2JqZWN0KSkgOiBcIlwiKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICgoc3RvcmUpID0+IGZldGNoKHVybCxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIC8vIFNlbmRzIGNvb2tpZXMgYmFjayB0byBzZXJ2ZXIgd2l0aCByZXF1ZXN0XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCdcclxuICAgICAgICB9KS50aGVuKChyZXNwb25zZSk9PntcclxuICAgICAgICAgICAgdGhpcy5GRVRDSF9JTl9QUk9HUkVTUyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAocmVzcG9uc2UuanNvbigpLnRoZW4oKGopPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fcHJvY2Vzc19yZXNwb25zZV9fKGosIHN0b3JlKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH0pLmNhdGNoKChlcnJvcik9PntcclxuICAgICAgICAgICAgdGhpcy5GRVRDSF9JTl9QUk9HUkVTUyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9fcmVqZWN0ZWRfcmVwb25zZV9fKHN0b3JlKTtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmFibGUgdG8gcHJvY2VzcyByZXNwb25zZSBmb3IgcmVxdWVzdCBtYWRlIHRvOiAke3RoaXMudXJsfS4gUmVzcG9uc2U6ICR7ZXJyb3J9LiBFcnJvciBSZWNlaXZlZDogJHtlcnJvcn1gKTtcclxuICAgICAgICB9KSkgKHN0b3JlX29iamVjdClcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZUpzb24oaW5fanNvbil7XHJcbiAgICAgICAgcmV0dXJuIGluX2pzb247XHJcbiAgICB9XHJcblxyXG4gICAgX19wcm9jZXNzX3VybF9fKGRhdGEpIHtcclxuICAgICAgICB2YXIgc3RyID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciBhIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgc3RyICs9IGAke2F9PSR7ZGF0YVthXX1cXCZgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN0ci5zbGljZSgwLCAtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgX19yZWplY3RlZF9yZXBvbnNlX18oc3RvcmUpe1xyXG4gICAgICAgIGlmKHN0b3JlKVxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5wcm9jZXNzZWQgc3RvcmVkIGRhdGEgaW4gZ2V0dGVyLlwiKTtcclxuICAgIH0gICBcclxuXHJcbiAgICBfX3Byb2Nlc3NfcmVzcG9uc2VfXyhqc29uLCBzdG9yZSkge1xyXG5cclxuICAgICAgICBpZih0aGlzLnJ1cmwgJiYganNvbil7XHJcbiAgICAgICAgICAgIHZhciB3YXRjaF9wb2ludHMgPSB0aGlzLnJ1cmwuc3BsaXQoXCI8XCIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHdhdGNoX3BvaW50cy5sZW5ndGggJiYganNvbjsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGpzb24gPSBqc29uW3BhcnNlSW50KHdhdGNoX3BvaW50c1tpXSk/cGFyc2VJbnQod2F0Y2hfcG9pbnRzW2ldKTp3YXRjaF9wb2ludHNbaV1dO1xyXG4gICAgICAgICAgICB9IFxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJqc29uXCIsIGpzb24pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcmVzcG9uc2UgPSB7fVxyXG4gICAgICAgIHZhciByZXF1ZXN0ID0gcmVzcG9uc2UudGFyZ2V0O1xyXG5cclxuICAgICAgICAvL3Jlc3VsdChyZXF1ZXN0KTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubW9kZWwpe1xyXG4gICAgICAgICAgICAvL3Nob3VsZCBiZSBhYmxlIHRvIHBpcGUgcmVzcG9uc2VzIGFzIG9iamVjdHMgY3JlYXRlZCBmcm9tIHdlbGwgZm9ybXVsYXRlZCBkYXRhIGRpcmVjdGx5IGludG8gdGhlIG1vZGVsLlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQodGhpcy5wYXJzZUpzb24oanNvbiwgc3RvcmUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFVuYWJsZSB0byBwcm9jZXNzIHJlc3BvbnNlIGZvciByZXF1ZXN0IG1hZGUgdG86ICR7dGhpcy51cmx9LiBUaGVyZSBpcyBubyBtb2RlbCBhdHRhY2hlZCB0byB0aGlzIHJlcXVlc3QgY29udHJvbGxlciFgKVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIEdldHRlclxyXG59XHJcbiIsImltcG9ydCB7XHJcbiAgICBWaWV3XHJcbn0gZnJvbSBcIi4vdmlld1wiXHJcbi8qKlxyXG4gKiBUaGlzIENsYXNzIGlzIHJlc3BvbnNpYmxlIGZvciBoYW5kbGluZyByZXF1ZXN0cyB0byB0aGUgc2VydmVyLiBJdCBjYW4gYWN0IGFzIGEgY29udHJvbGxlciB0byBzcGVjaWZpY2FsbHkgcHVsbCBkYXRhIGRvd24gZnJvbSB0aGUgc2VydmVyIGFuZCBwdXNoIGludG8gZGF0YSBtZW1iZXJzLlxyXG4gKlxyXG4gKiB7bmFtZX0gUmVxdWVzdGVyXHJcbiAqL1xyXG5jbGFzcyBTZXR0ZXIgZXh0ZW5kcyBWaWV3IHtcclxuICAgIGNvbnN0cnVjdG9yKHVybCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0KHJlcXVlc3Rfb2JqZWN0KSB7XHJcblxyXG4gICAgICAgIHZhciB1cmwgPSBcImh0dHA6Ly9cIiArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgdGhpcy51cmwgKyAoIChyZXF1ZXN0X29iamVjdCkgPyAoXCI/XCIgKyB0aGlzLl9fcHJvY2Vzc191cmxfXyhyZXF1ZXN0X29iamVjdCkpIDogXCJcIik7XHJcblxyXG4gICAgICAgIGZldGNoKHVybCwgXHJcbiAgICAgICAgeyBcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgLy8gU2VuZHMgY29va2llcyBiYWNrIHRvIHNlcnZlciB3aXRoIHJlcXVlc3RcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCdcclxuICAgICAgICB9KS50aGVuKChyZXNwb25zZSk9PntcclxuICAgICAgICAgICAgKHJlc3BvbnNlLmpzb24oKS50aGVuKChqKT0+e1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fX3Byb2Nlc3NfcmVzcG9uc2VfXyhqKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH0pLmNhdGNoKChlcnJvcik9PntcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmFibGUgdG8gcHJvY2VzcyByZXNwb25zZSBmb3IgcmVxdWVzdCBtYWRlIHRvOiAke3RoaXMudXJsfS4gUmVzcG9uc2U6ICR7ZXJyb3J9LiBFcnJvciBSZWNlaXZlZDogJHtlcnJvcn1gKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlSnNvbihpbl9qc29uKXtcclxuICAgICAgICByZXR1cm4gaW5fanNvbjtcclxuICAgIH1cclxuXHJcbiAgICBfX3Byb2Nlc3NfdXJsX18oZGF0YSkge1xyXG4gICAgICAgIHZhciBzdHIgPSBcIlwiO1xyXG4gICAgICAgIGZvciAodmFyIGEgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICBzdHIgKz0gYCR7YX09JHtkYXRhW2FdfVxcJmA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3RyLnNsaWNlKDAsIC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBfX3Byb2Nlc3NfcmVzcG9uc2VfXyhqc29uKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHJlc3BvbnNlID0ge31cclxuICAgICAgICB2YXIgcmVxdWVzdCA9IHJlc3BvbnNlLnRhcmdldDtcclxuXHJcbiAgICAgICAgLy9yZXN1bHQocmVxdWVzdCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1vZGVsKXtcclxuXHJcbiAgICAgICAgICAgIC8vc2hvdWxkIGJlIGFibGUgdG8gcGlwZSByZXNwb25zZXMgYXMgb2JqZWN0cyBjcmVhdGVkIGZyb20gd2VsbCBmb3JtdWxhdGVkIGRhdGEgZGlyZWN0bHkgaW50byB0aGUgbW9kZWwuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldCh0aGlzLnBhcnNlSnNvbihqc29uKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm1vZGVsKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgVW5hYmxlIHRvIHByb2Nlc3MgcmVzcG9uc2UgZm9yIHJlcXVlc3QgbWFkZSB0bzogJHt0aGlzLnVybH0uIFRoZXJlIGlzIG5vIG1vZGVsIGF0dGFjaGVkIHRvIHRoaXMgcmVxdWVzdCBjb250cm9sbGVyIWApXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBTZXR0ZXJcclxufSIsIi8qXHJcblx0SGFuZGxlcyB0aGUgcGFyc2luZyBhbmQgbG9hZGluZyBvZiBjb21wb25lbnRzIGZvciBhIHBhcnRpY3VsYXIgcGFnZS5cclxuKi9cclxuY2xhc3MgUGFnZVZpZXcge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFVSTCwgYXBwX3BhZ2UpIHtcclxuICAgICAgICB0aGlzLnVybCA9IFVSTDtcclxuICAgICAgICB0aGlzLmVsZW1lbnRzID0gW107XHJcbiAgICAgICAgdGhpcy5maW5hbGl6aW5nX3ZpZXcgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudHlwZSA9IFwibm9ybWFsXCI7XHJcbiAgICAgICAgaWYgKCFhcHBfcGFnZSkgZGVidWdnZXJcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBhcHBfcGFnZTtcclxuICAgICAgICB0aGlzLmVsZW1lbnRfYmFja2VyID0gbnVsbDtcclxuICAgICAgICB0aGlzLkxPQURFRCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgZWxlbWVudC5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHVubG9hZCh0cmFuc2l0aW9ucykge1xyXG5cclxuICAgICAgICB0aGlzLkxPQURFRCA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlbWVudHNbaV07XHJcbiAgICAgICAgICAgIGVsZW1lbnQuZ2V0VHJhbnNmb3JtVG8odHJhbnNpdGlvbnMpO1xyXG4gICAgICAgICAgICBlbGVtZW50LnVubG9hZENvbXBvbmVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNpdGlvbk91dCh0cmFuc2l0aW9ucykge1xyXG5cclxuICAgICAgICBsZXQgdGltZSA9IDA7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aW1lID0gTWF0aC5tYXgodGltZSwgdGhpcy5lbGVtZW50c1tpXS50cmFuc2l0aW9uT3V0KHRyYW5zaXRpb25zKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGltZTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5hbGl6ZSgpIHtcclxuICAgICAgICBpZih0aGlzLkxPQURFRCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBlbGVtZW50LmZpbmFsaXplKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQpXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZChhcHBfZWxlbWVudCwgd3VybCkge1xyXG5cclxuICAgICAgICB0aGlzLkxPQURFRCA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgZWxlbWVudC5sb2FkQ29tcG9uZW50cyh3dXJsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFwcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XHJcblxyXG4gICAgICAgIHZhciB0ID0gdGhpcy5lbGVtZW50LnN0eWxlLm9wYWNpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNpdGlvbkluKHRyYW5zaXRpb25zKSB7XHJcbiAgICAgICAgbGV0IGZpbmFsX3RpbWUgPSAwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50eXBlID09IFwibW9kYWxcIikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZWxlbWVudF9iYWNrZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF9iYWNrZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50X2JhY2tlci5jbGFzc0xpc3QuYWRkKFwibW9kYWxfYmFja2VyXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50X2JhY2tlcilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICAgICAgfSwgNTApXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBlbGVtZW50LnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0VHJhbnNmb3JtVG8odHJhbnNpdGlvbnMpO1xyXG4gICAgICAgICAgICBlbGVtZW50LnRyYW5zaXRpb25JbigpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWVkRWxlbWVudHMobmFtZWRfZWxlbWVudHMpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBlbGVtZW50LmdldE5hbWVkRWxlbWVudHMobmFtZWRfZWxlbWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb21wYXJlQ29tcG9uZW50cygpIHtcclxuICAgICAgICAvL1RoaXMgd2lsbCB0cmFuc2l0aW9uIG9iamVjdHNcclxuICAgIH1cclxuXHJcbiAgICBzZXRUeXBlKHR5cGUpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlIHx8IFwibm9ybWFsXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBQYWdlVmlld1xyXG59IiwiLyoqXHJcbiAqXHRDb252ZXJ0cyBsaW5rcyBpbnRvIEphdmFjcmlwdCBlbmFibGVkIGJ1dHRvbnMgdGhhdCB3aWxsIGJlIGhhbmRsZWQgd2l0aGluIHRoZSBjdXJyZW50IEFjdGl2ZSBwYWdlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gUGFyZW50IEVsZW1lbnQgdGhhdCBjb250YWlucyB0aGUgPGE+IGVsZW1lbnRzIHRvIGJlIGV2YXVsYXRlZCBieSBmdW5jdGlvbi5cclxuICogQHBhcmFtIHtmdW5jdGlvbn0gX19mdW5jdGlvbl9fIC0gQSBmdW5jdGlvbiB0aGUgbGluayB3aWxsIGNhbGwgd2hlbiBpdCBpcyBjbGlja2VkIGJ5IHVzZXIuIElmIGl0IHJldHVybnMgZmFsc2UsIHRoZSBsaW5rIHdpbGwgYWN0IGxpa2UgYSBub3JtYWwgPGE+IGVsZW1lbnQgYW5kIGNhdXNlIHRoZSBicm93c2VyIHRvIG5hdmlnYXRlIHRvIHRoZSBcImhyZWZcIiB2YWx1ZS5cclxuICpcclxuICogSWYgdGhlIDxhPiBlbGVtZW50IGhhcyBhIGRhdGEtaWdub3JlX2xpbmsgYXR0cmlidXRlIHNldCB0byBhIHRydXRoeSB2YWx1ZSwgdGhlbiB0aGlzIGZ1bmN0aW9uIHdpbGwgbm90IGNoYW5nZSB0aGUgd2F5IHRoYXQgbGluayBvcGVyYXRlcy5cclxuICogTGlrZXdpc2UsIGlmIHRoZSA8YT4gZWxlbWVudCBoYXMgYSBocmVmIHRoYXQgcG9pbnRzIGFub3RoZXIgZG9tYWluLCB0aGVuIHRoZSBsaW5rIHdpbGwgcmVtYWluIHVuYWZmZWN0ZWQuXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRMaW5rcyhlbGVtZW50LCBfX2Z1bmN0aW9uX18pIHtcclxuICAgIGxldCBsaW5rcyA9IGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBsaW5rcy5sZW5ndGgsIHRlbXAsIGhyZWY7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBsZXQgdGVtcCA9IGxpbmtzW2ldO1xyXG5cclxuICAgICAgICBpZiAodGVtcC5kYXRhc2V0Lmlnbm9yZV9saW5rKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgaWYgKHRlbXAub3JpZ2luICE9PSBsb2NhdGlvbi5vcmlnaW4pIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBpZiAoIXRlbXAub25jbGljaykgdGVtcC5vbmNsaWNrID0gKChocmVmLCBhLCBfX2Z1bmN0aW9uX18pID0+IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgaWYgKF9fZnVuY3Rpb25fXyhocmVmLCBhKSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pKHRlbXAuaHJlZiwgdGVtcCwgX19mdW5jdGlvbl9fKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCB7c2V0TGlua3N9XHJcbiIsImltcG9ydCB7TGV4fSBmcm9tIFwiLi4vY29tbW9uXCJcclxuXHJcbmNsYXNzIENvbG9yIGV4dGVuZHMgRmxvYXQ2NEFycmF5e1xyXG5cclxuXHRjb25zdHJ1Y3RvcihyLGcsYixhID0gMCl7XHJcblx0XHRzdXBlcig0KVxyXG5cclxuXHRcdHRoaXMuciA9IDA7XHJcblx0XHR0aGlzLmcgPSAwO1xyXG5cdFx0dGhpcy5iID0gMDtcclxuXHRcdHRoaXMuYSA9IDE7XHJcblxyXG5cdFx0aWYodHlwZW9mKHIpID09IFwic3RyaW5nXCIpe1xyXG5cdFx0XHR0aGlzLmZyb21TdHJpbmcocik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0dGhpcy5yID0gciAvL01hdGgubWF4KE1hdGgubWluKE1hdGgucm91bmQociksMjU1KSwtMjU1KTtcclxuXHRcdFx0dGhpcy5nID0gZyAvL01hdGgubWF4KE1hdGgubWluKE1hdGgucm91bmQoZyksMjU1KSwtMjU1KTtcclxuXHRcdFx0dGhpcy5iID0gYiAvL01hdGgubWF4KE1hdGgubWluKE1hdGgucm91bmQoYiksMjU1KSwtMjU1KTtcclxuXHRcdFx0dGhpcy5hID0gYSAvL01hdGgubWF4KE1hdGgubWluKGEsMSksLTEpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Z2V0IHIoKXtcclxuXHRcdHJldHVybiB0aGlzWzBdO1xyXG5cdH1cclxuXHJcblx0c2V0IHIocil7XHJcblx0XHR0aGlzWzBdID0gcjtcclxuXHR9XHJcblxyXG5cdGdldCBnKCl7XHJcblx0XHRyZXR1cm4gdGhpc1sxXTtcclxuXHR9XHJcblxyXG5cdHNldCBnKGcpe1xyXG5cdFx0dGhpc1sxXSA9IGc7XHJcblx0fVxyXG5cclxuXHRnZXQgYigpe1xyXG5cdFx0cmV0dXJuIHRoaXNbMl07XHJcblx0fVxyXG5cclxuXHRzZXQgYihiKXtcclxuXHRcdHRoaXNbMl0gPSBiO1xyXG5cdH1cclxuXHJcblx0Z2V0IGEoKXtcclxuXHRcdHJldHVybiB0aGlzWzNdO1xyXG5cdH1cclxuXHJcblx0c2V0IGEoYSl7XHJcblx0XHR0aGlzWzNdID0gYTtcclxuXHR9XHJcblxyXG5cdHNldChjb2xvcil7XHJcblx0XHR0aGlzLnIgPSBjb2xvci5yO1xyXG5cdFx0dGhpcy5nID0gY29sb3IuZztcclxuXHRcdHRoaXMuYiA9IGNvbG9yLmI7XHJcblx0XHR0aGlzLmEgPSAoY29sb3IuYSAhPSB1bmRlZmluZWQpID8gY29sb3IuYSA6IHRoaXMuYTtcclxuXHR9XHJcblxyXG5cdGFkZChjb2xvcil7XHJcblx0XHRyZXR1cm4gbmV3IENvbG9yKFxyXG5cdFx0XHRjb2xvci5yICsgdGhpcy5yLFxyXG5cdFx0XHRjb2xvci5nICsgdGhpcy5nLFxyXG5cdFx0XHRjb2xvci5iICsgdGhpcy5iLFxyXG5cdFx0XHRjb2xvci5hICsgdGhpcy5hXHJcblx0XHQpXHJcblx0fVxyXG5cclxuXHRtdWx0KGNvbG9yKXtcclxuXHRcdGlmKHR5cGVvZihjb2xvcikgPT0gXCJudW1iZXJcIil7XHJcblx0XHRcdHJldHVybiBuZXcgQ29sb3IoXHJcblx0XHRcdFx0dGhpcy5yICogY29sb3IsXHJcblx0XHRcdFx0dGhpcy5nICogY29sb3IsXHJcblx0XHRcdFx0dGhpcy5iICogY29sb3IsXHJcblx0XHRcdFx0dGhpcy5hICogY29sb3JcclxuXHRcdFx0KVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiBuZXcgQ29sb3IoXHJcblx0XHRcdFx0dGhpcy5yICogY29sb3IucixcclxuXHRcdFx0XHR0aGlzLmcgKiBjb2xvci5nLFxyXG5cdFx0XHRcdHRoaXMuYiAqIGNvbG9yLmIsXHJcblx0XHRcdFx0dGhpcy5hICogY29sb3IuYVxyXG5cdFx0XHQpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdWIoY29sb3Ipe1xyXG5cdFx0cmV0dXJuIG5ldyBDb2xvcihcclxuXHRcdFx0IHRoaXMuciAtIGNvbG9yLnIsXHJcblx0XHRcdCB0aGlzLmcgLSBjb2xvci5nLFxyXG5cdFx0XHQgdGhpcy5iIC0gY29sb3IuYixcclxuXHRcdFx0IHRoaXMuYSAtIGNvbG9yLmFcclxuXHRcdClcclxuXHR9XHJcblxyXG5cdHRvU3RyaW5nKCl7XHJcblx0XHRyZXR1cm4gYHJnYmEoJHt0aGlzLnJ8MH0sICR7dGhpcy5nfDB9LCAke3RoaXMuYnwwfSwgJHt0aGlzLmF9KWA7XHJcblx0fVxyXG5cclxuXHRmcm9tU3RyaW5nKHN0cmluZyl7XHJcblx0XHRcclxuXHRcdGxldCBsZXhlciA9IExleChzdHJpbmcpXHJcblxyXG5cdFx0bGV0IHIsZyxiLGE7XHJcblx0XHRzd2l0Y2gobGV4ZXIudG9rZW4udGV4dCl7XHJcblxyXG5cclxuXHRcdFx0Y2FzZSBcInJnYlwiOlxyXG5cdFx0XHRcdGxleGVyLm5leHQoKSAvLyAoXHJcblx0XHRcdFx0ciA9IHBhcnNlSW50KGxleGVyLm5leHQoKS50ZXh0KVxyXG5cdFx0XHRcdGxleGVyLm5leHQoKSAvLyAsXHJcblx0XHRcdFx0ZyA9IHBhcnNlSW50KGxleGVyLm5leHQoKS50ZXh0KVxyXG5cdFx0XHRcdGxleGVyLm5leHQoKSAvLyAsXHJcblx0XHRcdFx0YiA9IHBhcnNlSW50KGxleGVyLm5leHQoKS50ZXh0KVxyXG5cdFx0XHRcdHRoaXMuc2V0KHtyLGcsYn0pO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgXCJyZ2JhXCI6XHJcblx0XHRcdFx0bGV4ZXIubmV4dCgpIC8vIChcclxuXHRcdFx0XHRyID0gcGFyc2VJbnQobGV4ZXIubmV4dCgpLnRleHQpXHJcblx0XHRcdFx0bGV4ZXIubmV4dCgpIC8vICxcclxuXHRcdFx0XHRnID0gcGFyc2VJbnQobGV4ZXIubmV4dCgpLnRleHQpXHJcblx0XHRcdFx0bGV4ZXIubmV4dCgpIC8vICxcclxuXHRcdFx0XHRiID0gcGFyc2VJbnQobGV4ZXIubmV4dCgpLnRleHQpXHJcblx0XHRcdFx0bGV4ZXIubmV4dCgpIC8vICxcclxuXHRcdFx0XHRhID0gcGFyc2VGbG9hdChsZXhlci5uZXh0KCkudGV4dClcclxuXHRcdFx0XHR0aGlzLnNldCh7cixnLGIsYX0pO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgXCIjXCI6XHJcblx0XHRcdFx0dmFyIHZhbHVlID0gbGV4ZXIubmV4dCgpLnRleHQ7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0ZGVmYXVsdDpcclxuXHJcblx0XHRcdFx0aWYoQ29sb3IuY29sb3JzW3N0cmluZ10pXHJcblx0XHRcdFx0XHR0aGlzLnNldChDb2xvci5jb2xvcnNbc3RyaW5nXSAgfHwgbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUsIDAuMDAwMSkpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbkNvbG9yLmNvbG9ycyA9IHtcclxuXHRcInRyYW5zcGFyZW50XCIgOiBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSwgMC4wMDAxKSxcclxuXHRcImNsZWFyXCIgOiBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSwgMC4wMDAxKSxcclxuXHRcInJlZFwiIDogbmV3IENvbG9yKDI1NSwgMCwgMCksXHJcblx0XCJncmVlblwiIDogbmV3IENvbG9yKDAsIDI1NSwgMCksXHJcblx0XCJibHVlXCIgOiBuZXcgQ29sb3IoMCwgMCwgMjU1KSxcclxuXHRcIkJsYWNrXCI6IG5ldyBDb2xvcigwLDAsMCksXHJcbiBcdFwiV2hpdGVcIjogbmV3IENvbG9yKDI1NSwyNTUsMjU1KSxcclxuIFx0XCJ3aGl0ZVwiOiBuZXcgQ29sb3IoMjU1LDI1NSwyNTUpLFxyXG4gXHRcIlJlZFwiOiBuZXcgQ29sb3IoMjU1LDAsMCksXHJcbiBcdFwiTGltZVwiOiBuZXcgQ29sb3IoMCwyNTUsMCksXHJcbiBcdFwiQmx1ZVwiOiBuZXcgQ29sb3IoMCwwLDI1NSksXHJcbiBcdFwiWWVsbG93XCI6IG5ldyBDb2xvcigyNTUsMjU1LDApLFxyXG4gXHRcIkN5YW5cIjogbmV3IENvbG9yKDAsMjU1LDI1NSksXHJcbiBcdFwiQXF1YVwiOiBuZXcgQ29sb3IoMCwyNTUsMjU1KSxcclxuIFx0XCJNYWdlbnRhXCI6IG5ldyBDb2xvcigyNTUsMCwyNTUpICxcclxuIFx0XCJGdWNoc2lhXCI6IG5ldyBDb2xvcigyNTUsMCwyNTUpLFxyXG4gXHRcIlNpbHZlclwiOiBuZXcgQ29sb3IoMTkyLDE5MiwxOTIpLFxyXG4gXHRcIkdyYXlcIjogbmV3IENvbG9yKDEyOCwxMjgsMTI4KSxcclxuIFx0XCJNYXJvb25cIjogbmV3IENvbG9yKDEyOCwwLDApLFxyXG4gXHRcIk9saXZlXCI6IG5ldyBDb2xvcigxMjgsMTI4LDApLFxyXG4gXHRcIkdyZWVuXCI6IG5ldyBDb2xvcigwLDEyOCwwKSxcclxuIFx0XCJQdXJwbGVcIjogbmV3IENvbG9yKDEyOCwwLDEyOCksXHJcbiBcdFwiVGVhbFwiOiBuZXcgQ29sb3IoMCwxMjgsMTI4KSxcclxuIFx0XCJOYXZ5XCI6IG5ldyBDb2xvcigwLDAsMTI4KSxcclxuIFx0XCJtYXJvb25cIjogbmV3IENvbG9yKDEyOCwwLDApLFxyXG4gXHRcImRhcmsgcmVkXCI6IG5ldyBDb2xvcigxMzksMCwwKSxcclxuIFx0XCJicm93blwiOiBuZXcgQ29sb3IoMTY1LDQyLDQyKSxcclxuIFx0XCJmaXJlYnJpY2tcIjogbmV3IENvbG9yKDE3OCwzNCwzNCksXHJcbiBcdFwiY3JpbXNvblwiOiBuZXcgQ29sb3IoMjIwLDIwLDYwKSxcclxuIFx0XCJyZWRcIjogbmV3IENvbG9yKDI1NSwwLDApLFxyXG4gXHRcInRvbWF0b1wiOiBuZXcgQ29sb3IoMjU1LDk5LDcxKSxcclxuIFx0XCJjb3JhbFwiOiBuZXcgQ29sb3IoMjU1LDEyNyw4MCksXHJcbiBcdFwiaW5kaWFuIHJlZFwiOiBuZXcgQ29sb3IoMjA1LDkyLDkyKSxcclxuIFx0XCJsaWdodCBjb3JhbFwiOiBuZXcgQ29sb3IoMjQwLDEyOCwxMjgpLFxyXG4gXHRcImRhcmsgc2FsbW9uXCI6IG5ldyBDb2xvcigyMzMsMTUwLDEyMiksXHJcbiBcdFwic2FsbW9uXCI6IG5ldyBDb2xvcigyNTAsMTI4LDExNCksXHJcbiBcdFwibGlnaHQgc2FsbW9uXCI6IG5ldyBDb2xvcigyNTUsMTYwLDEyMiksXHJcbiBcdFwib3JhbmdlIHJlZFwiOiBuZXcgQ29sb3IoMjU1LDY5LDApLFxyXG4gXHRcImRhcmsgb3JhbmdlXCI6IG5ldyBDb2xvcigyNTUsMTQwLDApLFxyXG4gXHRcIm9yYW5nZVwiOiBuZXcgQ29sb3IoMjU1LDE2NSwwKSxcclxuIFx0XCJnb2xkXCI6IG5ldyBDb2xvcigyNTUsMjE1LDApLFxyXG4gXHRcImRhcmsgZ29sZGVuIHJvZFwiOiBuZXcgQ29sb3IoMTg0LDEzNCwxMSksXHJcbiBcdFwiZ29sZGVuIHJvZFwiOiBuZXcgQ29sb3IoMjE4LDE2NSwzMiksXHJcbiBcdFwicGFsZSBnb2xkZW4gcm9kXCI6IG5ldyBDb2xvcigyMzgsMjMyLDE3MCksXHJcbiBcdFwiZGFyayBraGFraVwiOiBuZXcgQ29sb3IoMTg5LDE4MywxMDcpLFxyXG4gXHRcImtoYWtpXCI6IG5ldyBDb2xvcigyNDAsMjMwLDE0MCksXHJcbiBcdFwib2xpdmVcIjogbmV3IENvbG9yKDEyOCwxMjgsMCksXHJcbiBcdFwieWVsbG93XCI6IG5ldyBDb2xvcigyNTUsMjU1LDApLFxyXG4gXHRcInllbGxvdyBncmVlblwiOiBuZXcgQ29sb3IoMTU0LDIwNSw1MCksXHJcbiBcdFwiZGFyayBvbGl2ZSBncmVlblwiOiBuZXcgQ29sb3IoODUsMTA3LDQ3KSxcclxuIFx0XCJvbGl2ZSBkcmFiXCI6IG5ldyBDb2xvcigxMDcsMTQyLDM1KSxcclxuIFx0XCJsYXduIGdyZWVuXCI6IG5ldyBDb2xvcigxMjQsMjUyLDApLFxyXG4gXHRcImNoYXJ0IHJldXNlXCI6IG5ldyBDb2xvcigxMjcsMjU1LDApLFxyXG4gXHRcImdyZWVuIHllbGxvd1wiOiBuZXcgQ29sb3IoMTczLDI1NSw0NyksXHJcbiBcdFwiZGFyayBncmVlblwiOiBuZXcgQ29sb3IoMCwxMDAsMCksXHJcbiBcdFwiZ3JlZW5cIjogbmV3IENvbG9yKDAsMTI4LDApLFxyXG4gXHRcImZvcmVzdCBncmVlblwiOiBuZXcgQ29sb3IoMzQsMTM5LDM0KSxcclxuIFx0XCJsaW1lXCI6IG5ldyBDb2xvcigwLDI1NSwwKSxcclxuIFx0XCJsaW1lIGdyZWVuXCI6IG5ldyBDb2xvcig1MCwyMDUsNTApLFxyXG4gXHRcImxpZ2h0IGdyZWVuXCI6IG5ldyBDb2xvcigxNDQsMjM4LDE0NCksXHJcbiBcdFwicGFsZSBncmVlblwiOiBuZXcgQ29sb3IoMTUyLDI1MSwxNTIpLFxyXG4gXHRcImRhcmsgc2VhIGdyZWVuXCI6IG5ldyBDb2xvcigxNDMsMTg4LDE0MyksXHJcbiBcdFwibWVkaXVtIHNwcmluZyBncmVlblwiOiBuZXcgQ29sb3IoMCwyNTAsMTU0KSxcclxuIFx0XCJzcHJpbmcgZ3JlZW5cIjogbmV3IENvbG9yKDAsMjU1LDEyNyksXHJcbiBcdFwic2VhIGdyZWVuXCI6IG5ldyBDb2xvcig0NiwxMzksODcpLFxyXG4gXHRcIm1lZGl1bSBhcXVhIG1hcmluZVwiOiBuZXcgQ29sb3IoMTAyLDIwNSwxNzApLFxyXG4gXHRcIm1lZGl1bSBzZWEgZ3JlZW5cIjogbmV3IENvbG9yKDYwLDE3OSwxMTMpLFxyXG4gXHRcImxpZ2h0IHNlYSBncmVlblwiOiBuZXcgQ29sb3IoMzIsMTc4LDE3MCksXHJcbiBcdFwiZGFyayBzbGF0ZSBncmF5XCI6IG5ldyBDb2xvcig0Nyw3OSw3OSksXHJcbiBcdFwidGVhbFwiOiBuZXcgQ29sb3IoMCwxMjgsMTI4KSxcclxuIFx0XCJkYXJrIGN5YW5cIjogbmV3IENvbG9yKDAsMTM5LDEzOSksXHJcbiBcdFwiYXF1YVwiOiBuZXcgQ29sb3IoMCwyNTUsMjU1KSxcclxuIFx0XCJjeWFuXCI6IG5ldyBDb2xvcigwLDI1NSwyNTUpLFxyXG4gXHRcImxpZ2h0IGN5YW5cIjogbmV3IENvbG9yKDIyNCwyNTUsMjU1KSxcclxuIFx0XCJkYXJrIHR1cnF1b2lzZVwiOiBuZXcgQ29sb3IoMCwyMDYsMjA5KSxcclxuIFx0XCJ0dXJxdW9pc2VcIjogbmV3IENvbG9yKDY0LDIyNCwyMDgpLFxyXG4gXHRcIm1lZGl1bSB0dXJxdW9pc2VcIjogbmV3IENvbG9yKDcyLDIwOSwyMDQpLFxyXG4gXHRcInBhbGUgdHVycXVvaXNlXCI6IG5ldyBDb2xvcigxNzUsMjM4LDIzOCksXHJcbiBcdFwiYXF1YSBtYXJpbmVcIjogbmV3IENvbG9yKDEyNywyNTUsMjEyKSxcclxuIFx0XCJwb3dkZXIgYmx1ZVwiOiBuZXcgQ29sb3IoMTc2LDIyNCwyMzApLFxyXG4gXHRcImNhZGV0IGJsdWVcIjogbmV3IENvbG9yKDk1LDE1OCwxNjApLFxyXG4gXHRcInN0ZWVsIGJsdWVcIjogbmV3IENvbG9yKDcwLDEzMCwxODApLFxyXG4gXHRcImNvcm4gZmxvd2VyIGJsdWVcIjogbmV3IENvbG9yKDEwMCwxNDksMjM3KSxcclxuIFx0XCJkZWVwIHNreSBibHVlXCI6IG5ldyBDb2xvcigwLDE5MSwyNTUpLFxyXG4gXHRcImRvZGdlciBibHVlXCI6IG5ldyBDb2xvcigzMCwxNDQsMjU1KSxcclxuIFx0XCJsaWdodCBibHVlXCI6IG5ldyBDb2xvcigxNzMsMjE2LDIzMCksXHJcbiBcdFwic2t5IGJsdWVcIjogbmV3IENvbG9yKDEzNSwyMDYsMjM1KSxcclxuIFx0XCJsaWdodCBza3kgYmx1ZVwiOiBuZXcgQ29sb3IoMTM1LDIwNiwyNTApLFxyXG4gXHRcIm1pZG5pZ2h0IGJsdWVcIjogbmV3IENvbG9yKDI1LDI1LDExMiksXHJcbiBcdFwibmF2eVwiOiBuZXcgQ29sb3IoMCwwLDEyOCksXHJcbiBcdFwiZGFyayBibHVlXCI6IG5ldyBDb2xvcigwLDAsMTM5KSxcclxuIFx0XCJtZWRpdW0gYmx1ZVwiOiBuZXcgQ29sb3IoMCwwLDIwNSksXHJcbiBcdFwiYmx1ZVwiOiBuZXcgQ29sb3IoMCwwLDI1NSksXHJcbiBcdFwicm95YWwgYmx1ZVwiOiBuZXcgQ29sb3IoNjUsMTA1LDIyNSksXHJcbiBcdFwiYmx1ZSB2aW9sZXRcIjogbmV3IENvbG9yKDEzOCw0MywyMjYpLFxyXG4gXHRcImluZGlnb1wiOiBuZXcgQ29sb3IoNzUsMCwxMzApLFxyXG4gXHRcImRhcmsgc2xhdGUgYmx1ZVwiOiBuZXcgQ29sb3IoNzIsNjEsMTM5KSxcclxuIFx0XCJzbGF0ZSBibHVlXCI6IG5ldyBDb2xvcigxMDYsOTAsMjA1KSxcclxuIFx0XCJtZWRpdW0gc2xhdGUgYmx1ZVwiOiBuZXcgQ29sb3IoMTIzLDEwNCwyMzgpLFxyXG4gXHRcIm1lZGl1bSBwdXJwbGVcIjogbmV3IENvbG9yKDE0NywxMTIsMjE5KSxcclxuIFx0XCJkYXJrIG1hZ2VudGFcIjogbmV3IENvbG9yKDEzOSwwLDEzOSksXHJcbiBcdFwiZGFyayB2aW9sZXRcIjogbmV3IENvbG9yKDE0OCwwLDIxMSksXHJcbiBcdFwiZGFyayBvcmNoaWRcIjogbmV3IENvbG9yKDE1Myw1MCwyMDQpLFxyXG4gXHRcIm1lZGl1bSBvcmNoaWRcIjogbmV3IENvbG9yKDE4Niw4NSwyMTEpLFxyXG4gXHRcInB1cnBsZVwiOiBuZXcgQ29sb3IoMTI4LDAsMTI4KSxcclxuIFx0XCJ0aGlzdGxlXCI6IG5ldyBDb2xvcigyMTYsMTkxLDIxNiksXHJcbiBcdFwicGx1bVwiOiBuZXcgQ29sb3IoMjIxLDE2MCwyMjEpLFxyXG4gXHRcInZpb2xldFwiOiBuZXcgQ29sb3IoMjM4LDEzMCwyMzgpLFxyXG4gXHRcIm1hZ2VudGFcIjogbmV3IENvbG9yKDI1NSwwLDI1NSksXHJcbiBcdFwiZnVjaHNpYVwiOiBuZXcgQ29sb3IoMjU1LDAsMjU1KSxcclxuIFx0XCJvcmNoaWRcIjogbmV3IENvbG9yKDIxOCwxMTIsMjE0KSxcclxuIFx0XCJtZWRpdW0gdmlvbGV0IHJlZFwiOiBuZXcgQ29sb3IoMTk5LDIxLDEzMyksXHJcbiBcdFwicGFsZSB2aW9sZXQgcmVkXCI6IG5ldyBDb2xvcigyMTksMTEyLDE0NyksXHJcbiBcdFwiZGVlcCBwaW5rXCI6IG5ldyBDb2xvcigyNTUsMjAsMTQ3KSxcclxuIFx0XCJob3QgcGlua1wiOiBuZXcgQ29sb3IoMjU1LDEwNSwxODApLFxyXG4gXHRcImxpZ2h0IHBpbmtcIjogbmV3IENvbG9yKDI1NSwxODIsMTkzKSxcclxuIFx0XCJwaW5rXCI6IG5ldyBDb2xvcigyNTUsMTkyLDIwMyksXHJcbiBcdFwiYW50aXF1ZSB3aGl0ZVwiOiBuZXcgQ29sb3IoMjUwLDIzNSwyMTUpLFxyXG4gXHRcImJlaWdlXCI6IG5ldyBDb2xvcigyNDUsMjQ1LDIyMCksXHJcbiBcdFwiYmlzcXVlXCI6IG5ldyBDb2xvcigyNTUsMjI4LDE5NiksXHJcbiBcdFwiYmxhbmNoZWQgYWxtb25kXCI6IG5ldyBDb2xvcigyNTUsMjM1LDIwNSksXHJcbiBcdFwid2hlYXRcIjogbmV3IENvbG9yKDI0NSwyMjIsMTc5KSxcclxuIFx0XCJjb3JuIHNpbGtcIjogbmV3IENvbG9yKDI1NSwyNDgsMjIwKSxcclxuIFx0XCJsZW1vbiBjaGlmZm9uXCI6IG5ldyBDb2xvcigyNTUsMjUwLDIwNSksXHJcbiBcdFwibGlnaHQgZ29sZGVuIHJvZCB5ZWxsb3dcIjogbmV3IENvbG9yKDI1MCwyNTAsMjEwKSxcclxuIFx0XCJsaWdodCB5ZWxsb3dcIjogbmV3IENvbG9yKDI1NSwyNTUsMjI0KSxcclxuIFx0XCJzYWRkbGUgYnJvd25cIjogbmV3IENvbG9yKDEzOSw2OSwxOSksXHJcbiBcdFwic2llbm5hXCI6IG5ldyBDb2xvcigxNjAsODIsNDUpLFxyXG4gXHRcImNob2NvbGF0ZVwiOiBuZXcgQ29sb3IoMjEwLDEwNSwzMCksXHJcbiBcdFwicGVydVwiOiBuZXcgQ29sb3IoMjA1LDEzMyw2MyksXHJcbiBcdFwic2FuZHkgYnJvd25cIjogbmV3IENvbG9yKDI0NCwxNjQsOTYpLFxyXG4gXHRcImJ1cmx5IHdvb2RcIjogbmV3IENvbG9yKDIyMiwxODQsMTM1KSxcclxuIFx0XCJ0YW5cIjogbmV3IENvbG9yKDIxMCwxODAsMTQwKSxcclxuIFx0XCJyb3N5IGJyb3duXCI6IG5ldyBDb2xvcigxODgsMTQzLDE0MyksXHJcbiBcdFwibW9jY2FzaW5cIjogbmV3IENvbG9yKDI1NSwyMjgsMTgxKSxcclxuIFx0XCJuYXZham8gd2hpdGVcIjogbmV3IENvbG9yKDI1NSwyMjIsMTczKSxcclxuIFx0XCJwZWFjaCBwdWZmXCI6IG5ldyBDb2xvcigyNTUsMjE4LDE4NSksXHJcbiBcdFwibWlzdHkgcm9zZVwiOiBuZXcgQ29sb3IoMjU1LDIyOCwyMjUpLFxyXG4gXHRcImxhdmVuZGVyIGJsdXNoXCI6IG5ldyBDb2xvcigyNTUsMjQwLDI0NSksXHJcbiBcdFwibGluZW5cIjogbmV3IENvbG9yKDI1MCwyNDAsMjMwKSxcclxuIFx0XCJvbGQgbGFjZVwiOiBuZXcgQ29sb3IoMjUzLDI0NSwyMzApLFxyXG4gXHRcInBhcGF5YSB3aGlwXCI6IG5ldyBDb2xvcigyNTUsMjM5LDIxMyksXHJcbiBcdFwic2VhIHNoZWxsXCI6IG5ldyBDb2xvcigyNTUsMjQ1LDIzOCksXHJcbiBcdFwibWludCBjcmVhbVwiOiBuZXcgQ29sb3IoMjQ1LDI1NSwyNTApLFxyXG4gXHRcInNsYXRlIGdyYXlcIjogbmV3IENvbG9yKDExMiwxMjgsMTQ0KSxcclxuIFx0XCJsaWdodCBzbGF0ZSBncmF5XCI6IG5ldyBDb2xvcigxMTksMTM2LDE1MyksXHJcbiBcdFwibGlnaHQgc3RlZWwgYmx1ZVwiOiBuZXcgQ29sb3IoMTc2LDE5NiwyMjIpLFxyXG4gXHRcImxhdmVuZGVyXCI6IG5ldyBDb2xvcigyMzAsMjMwLDI1MCksXHJcbiBcdFwiZmxvcmFsIHdoaXRlXCI6IG5ldyBDb2xvcigyNTUsMjUwLDI0MCksXHJcbiBcdFwiYWxpY2UgYmx1ZVwiOiBuZXcgQ29sb3IoMjQwLDI0OCwyNTUpLFxyXG4gXHRcImdob3N0IHdoaXRlXCI6IG5ldyBDb2xvcigyNDgsMjQ4LDI1NSksXHJcbiBcdFwiaG9uZXlkZXdcIjogbmV3IENvbG9yKDI0MCwyNTUsMjQwKSxcclxuIFx0XCJpdm9yeVwiOiBuZXcgQ29sb3IoMjU1LDI1NSwyNDApLFxyXG4gXHRcImF6dXJlXCI6IG5ldyBDb2xvcigyNDAsMjU1LDI1NSksXHJcbiBcdFwic25vd1wiOiBuZXcgQ29sb3IoMjU1LDI1MCwyNTApLFxyXG4gXHRcImJsYWNrXCI6IG5ldyBDb2xvcigwLDAsMCksXHJcbiBcdFwiZGltIGdyYXlcIjogbmV3IENvbG9yKDEwNSwxMDUsMTA1KSxcclxuIFx0XCJkaW0gZ3JleVwiOiBuZXcgQ29sb3IoMTA1LDEwNSwxMDUpLFxyXG4gXHRcImdyYXlcIjogbmV3IENvbG9yKDEyOCwxMjgsMTI4KSxcclxuIFx0XCJncmV5XCI6IG5ldyBDb2xvcigxMjgsMTI4LDEyOCksXHJcbiBcdFwiZGFyayBncmF5XCI6IG5ldyBDb2xvcigxNjksMTY5LDE2OSksXHJcbiBcdFwiZGFyayBncmV5XCI6IG5ldyBDb2xvcigxNjksMTY5LDE2OSksXHJcbiBcdFwic2lsdmVyXCI6IG5ldyBDb2xvcigxOTIsMTkyLDE5MiksXHJcbiBcdFwibGlnaHQgZ3JheVwiOiBuZXcgQ29sb3IoMjExLDIxMSwyMTEpLFxyXG4gXHRcImxpZ2h0IGdyZXlcIjogbmV3IENvbG9yKDIxMSwyMTEsMjExKSxcclxuIFx0XCJnYWluc2Jvcm9cIjogbmV3IENvbG9yKDIyMCwyMjAsMjIwKSxcclxuIFx0XCJ3aGl0ZSBzbW9rZVwiOiBuZXcgQ29sb3IoMjQ1LDI0NSwyNDUpLFxyXG4gXHRcIndoaXRlXCI6IG5ldyBDb2xvcigyNTUsMjU1LDI1NSlcclxufVxyXG5cclxuZXhwb3J0IHtDb2xvcn1cclxuIiwiaW1wb3J0IHtcclxuICAgIENvbG9yXHJcbn0gZnJvbSBcIi4vY29sb3JcIlxyXG5pbXBvcnQge1xyXG4gICAgQ0JlemllclxyXG59IGZyb20gXCIuLi9jb21tb25cIlxyXG5pbXBvcnQge1xyXG4gICAgU2NoZWR1bGVyXHJcbn0gZnJvbSBcIi4uL3NjaGVkdWxlclwiXHJcblxyXG52YXIgZWFzZV9vdXQgPSBuZXcgQ0JlemllcigwLjUsIDAuMiwgMCwgMSk7XHJcblxyXG5pZiAoIXJlcXVlc3RBbmltYXRpb25GcmFtZSlcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IChlKSA9PiB7XHJcbiAgICAgICAgc2V0VGltZW91dChlLCAxMDAwKTtcclxuICAgIH1cclxuXHJcbmNsYXNzIFRUX0Zyb20ge1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkge1xyXG4gICAgICAgIC8vZXh0cmFjdGVkIGFuaW1hdGFibGUgY29tcG9uZW50c1xyXG4gICAgICAgIHZhciByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvciA9IG5ldyBDb2xvcih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiYmFja2dyb3VuZC1jb2xvclwiKSk7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJoZWlnaHRcIikpO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJ3aWR0aFwiKSk7XHJcblxyXG4gICAgICAgIC8vKmlmKCF0aGlzLmhlaWdodCB8fCAhdGhpcy53aWR0aCl7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSByZWN0LmhlaWdodDtcclxuICAgICAgICB0aGlzLndpZHRoID0gcmVjdC53aWR0aDtcclxuICAgICAgICAvL30qL1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5sZWZ0ID0gcGFyc2VGbG9hdChyZWN0LmxlZnQpO1xyXG4gICAgICAgIHRoaXMudG9wID0gcGFyc2VGbG9hdChyZWN0LnRvcCk7XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbG9yID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZW5kKCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVFRfVG8gZXh0ZW5kcyBUVF9Gcm9tIHtcclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGZyb20pIHtcclxuICAgICAgICBzdXBlcihlbGVtZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5mcm9tID0gZnJvbTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXMgPSAoKGVsZW1lbnQuc3R5bGUudG9wKSAmJiAoZWxlbWVudC5zdHlsZS5sZWZ0KSk7XHJcblxyXG4gICAgICAgIHRoaXMucnQgPSAoZWxlbWVudC5zdHlsZS50b3ApID8gKGVsZW1lbnQuc3R5bGUudG9wKSA6IG51bGw7XHJcbiAgICAgICAgdGhpcy5ybCA9IGVsZW1lbnQuc3R5bGUubGVmdCA/IGVsZW1lbnQuc3R5bGUubGVmdCA6IG51bGw7XHJcblxyXG5cclxuICAgICAgICAvL2dldCB0aGUgcmVsYXRpdmUgb2Zmc2V0IG9mIHRoaXMgb2JqZWN0XHJcbiAgICAgICAgdmFyIG9mZnNldF94ID0gMDsgLSBlbGVtZW50LmdldFBhcmVudFdpbmRvd0xlZnQoKTtcclxuICAgICAgICB2YXIgb2Zmc2V0X3kgPSAwOyAtIGVsZW1lbnQuZ2V0UGFyZW50V2luZG93VG9wKCk7XHJcblxyXG4gICAgICAgIHZhciBvZmZzZXRfeCA9IHBhcnNlRmxvYXQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcImxlZnRcIikpO1xyXG4gICAgICAgIHZhciBvZmZzZXRfeSA9IHBhcnNlRmxvYXQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcInRvcFwiKSk7XHJcbiAgICAgICAgLy9BbmQgYWRqdXN0IHN0YXJ0IHRvIHJlc3BlY3QgdGhlIGVsZW1lbnRzIG93biBwYXJlbnRhbCBvZmZzZXRzXHJcbiAgICAgICAgdmFyIGRpZmZ4ID0gdGhpcy5sZWZ0IC0gdGhpcy5mcm9tLmxlZnQ7XHJcbiAgICAgICAgdGhpcy5sZWZ0ID0gb2Zmc2V0X3g7XHJcbiAgICAgICAgdGhpcy5mcm9tLmxlZnQgPSB0aGlzLmxlZnQgLSBkaWZmeDtcclxuXHJcbiAgICAgICAgdmFyIGRpZmZ5ID0gdGhpcy50b3AgLSB0aGlzLmZyb20udG9wO1xyXG4gICAgICAgIHRoaXMudG9wID0gb2Zmc2V0X3k7XHJcbiAgICAgICAgdGhpcy5mcm9tLnRvcCA9IHRoaXMudG9wIC0gZGlmZnk7XHJcblxyXG4gICAgICAgIHRoaXMudGltZSA9IDYwICogLjM1O1xyXG4gICAgICAgIHRoaXMucyA9IDA7XHJcbiAgICAgICAgdGhpcy5jb2xvcl9vID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcImJhY2tncm91bmQtY29sb3JcIik7XHJcbiAgICAgICAgdGhpcy5oZWlnaHRfbyA9IGVsZW1lbnQuc3R5bGUud2lkdGg7XHJcbiAgICAgICAgdGhpcy53aWR0aF9vID0gZWxlbWVudC5zdHlsZS5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy50b3BfbyA9IHRoaXMudG9wO1xyXG4gICAgICAgIHRoaXMubGVmdF9vID0gdGhpcy5sZWZ0O1xyXG4gICAgICAgIHRoaXMucG9zID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcInBvc2l0aW9uXCIpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVuZCgpOyAvL1Jlc3RvcmUgZXZlcnl0aGluZyBiYWNrIHRvIGl0J3Mgb3JpZ2luYWwgdHlwZTtcclxuICAgICAgICB0aGlzLmZyb20gPSBudWxsO1xyXG4gICAgICAgIHRoaXMucyA9IEluZmluaXR5O1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gdGhpcy5mcm9tLnRvcCArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IHRoaXMuZnJvbS5sZWZ0ICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMuZnJvbS53aWR0aCArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5mcm9tLmhlaWdodCArIFwicHhcIjtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCkge1xyXG4gICAgICAgIHRoaXMucysrXHJcblxyXG4gICAgICAgICAgICB2YXIgdCA9IHRoaXMucyAvIHRoaXMudGltZTtcclxuXHJcbiAgICAgICAgaWYgKHQgPiAxKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIHZhciByYXRpbyA9IGVhc2Vfb3V0LmdldFlhdFgodCk7XHJcblxyXG4gICAgICAgIGlmIChyYXRpbyA+IDEpIHJhdGlvID0gMTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IE1hdGgucm91bmQoKHRoaXMudG9wIC0gdGhpcy5mcm9tLnRvcCkgKiByYXRpbyArIHRoaXMuZnJvbS50b3ApICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gTWF0aC5yb3VuZCgodGhpcy5sZWZ0IC0gdGhpcy5mcm9tLmxlZnQpICogcmF0aW8gKyB0aGlzLmZyb20ubGVmdCkgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gKCh0aGlzLndpZHRoIC0gdGhpcy5mcm9tLndpZHRoKSAqIHJhdGlvICsgdGhpcy5mcm9tLndpZHRoKSArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gKCh0aGlzLmhlaWdodCAtIHRoaXMuZnJvbS5oZWlnaHQpICogcmF0aW8gKyB0aGlzLmZyb20uaGVpZ2h0KSArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gKHRoaXMuY29sb3Iuc3ViKHRoaXMuZnJvbS5jb2xvcikubXVsdChyYXRpbykuYWRkKHRoaXMuZnJvbS5jb2xvcikpICsgXCJcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuICh0IDwgMC45OTk5OTk1KTtcclxuICAgIH1cclxuXHJcbiAgICBlbmQoKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0X287XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy53aWR0aF9vO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSB0aGlzLnJ0O1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gdGhpcy5ybDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmNsYXNzIFRUUGFpciB7XHJcbiAgICBjb25zdHJ1Y3RvcihlX3RvLCBlX2Zyb20pIHtcclxuICAgICAgICB0aGlzLmIgPSAoZV9mcm9tIGluc3RhbmNlb2YgVFRfRnJvbSkgPyBlX2Zyb20gOiBuZXcgVFRfRnJvbShlX2Zyb20pO1xyXG4gICAgICAgIHRoaXMuYSA9IG5ldyBUVF9UbyhlX3RvLCB0aGlzLmIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hLmVsZW1lbnQuX19UVF9fKVxyXG4gICAgICAgICAgICB0aGlzLmEuZWxlbWVudC5fX1RUX18uZGVzdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5iLmVsZW1lbnQuX19UVF9fKVxyXG4gICAgICAgICAgICB0aGlzLmIuZWxlbWVudC5fX1RUX18uZGVzdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICB0aGlzLmEuZWxlbWVudC5fX1RUX18gPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuYi5lbGVtZW50Ll9fVFRfXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZGVzdHJveWVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKHRoaXMuYi5lbGVtZW50KVxyXG4gICAgICAgICAgICB0aGlzLmIuZWxlbWVudC5fX1RUX18gPSBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLmEuZWxlbWVudClcclxuICAgICAgICAgICAgdGhpcy5hLmVsZW1lbnQuX19UVF9fID0gbnVsbDtcclxuICAgICAgICB0aGlzLmEuZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLmIuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLmEuc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmEuc3RlcCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBUcmFuc2Zvcm1SdW5uZXIgPSBuZXcgKGNsYXNze1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5wYWlycyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX19fX1NDSEVEVUxFRF9fX18gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdXNoUGFpcihwYWlyKSB7XHJcbiAgICAgICAgdGhpcy5wYWlycy5wdXNoKHBhaXIpO1xyXG4gICAgICAgIFNjaGVkdWxlci5xdWV1ZVVwZGF0ZSh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUocmF0aW8pIHtcclxuICAgICAgICBsZXQgcnAgPSB0aGlzLnBhaXJzO1xyXG5cclxuICAgICAgICBpZihycC5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICBTY2hlZHVsZXIucXVldWVVcGRhdGUodGhpcyk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIF9ycCA9IHJwW2ldO1xyXG4gICAgICAgICAgICBpZiAoIV9ycC5zdGVwKHJhdGlvKSkge1xyXG4gICAgICAgICAgICAgICAgX3JwLmRlc3RydWN0b3IoKTtcclxuICAgICAgICAgICAgICAgIHJwLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgfVxyXG59KSgpXHJcblxyXG5cclxuLyoqXHJcbiAgICBUcmFuc2Zvcm0gb25lIGVsZW1lbnQgZnJvbSBhbm90aGVyIGJhY2sgdG8gaXRzZWxmXHJcbiovXHJcbmZ1bmN0aW9uIFRyYW5zZm9ybVRvKGVsZW1lbnRfZnJvbSwgZWxlbWVudF90bywgSElERV9PVEhFUikge1xyXG5cclxuXHJcbiAgICBpZiAoIWVsZW1lbnRfdG8pIHtcclxuXHJcbiAgICAgICAgbGV0IGEgPSAoZnJvbSkgPT4gKGVsZW1lbnRfdG8sIEhJREVfT1RIRVIpID0+IHtcclxuICAgICAgICAgICAgbGV0IHBhaXIgPSBuZXcgVFRQYWlyKGVsZW1lbnRfdG8sIGZyb20pO1xyXG4gICAgICAgICAgICBUcmFuc2Zvcm1SdW5uZXIucHVzaFBhaXIocGFpcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYiA9IGEobmV3IFRUX0Zyb20oZWxlbWVudF9mcm9tKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBiO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwYWlyID0gbmV3IFRUUGFpcihlbGVtZW50X3RvLCBlbGVtZW50X2Zyb20pO1xyXG5cclxuICAgIFRyYW5zZm9ybVJ1bm5lci5wdXNoUGFpcihwYWlyKTtcclxuXHJcbiAgICBwYWlyLnN0YXJ0KCk7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IHtcclxuICAgIFRyYW5zZm9ybVRvXHJcbn0iLCJpbXBvcnQge1xyXG5cdFN0eWxlTWFwcGluZ3NcclxufSBmcm9tIFwiLi9zdHlsZV9tYXBwaW5nc1wiXHJcbmltcG9ydCB7Q29sb3J9IGZyb20gXCIuL2NvbG9yXCIgXHJcbmltcG9ydCB7VHJhbnNmb3JtVG99IGZyb20gXCIuL3RyYW5zZm9ybXRvXCJcclxuXHJcbmNsYXNzIFN0eWxlQW5pbUJsb2Mge1xyXG5cdGNvbnN0cnVjdG9yKHN0eWxlLCB0b192YWwsIGR1cmF0aW9uLCBkZWxheSkge1xyXG5cdFx0dGhpcy5zdHlsZSA9IHN0eWxlO1xyXG5cdFx0dGhpcy5kZWxheSA9IGRlbGF5O1xyXG5cdFx0dGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0dGhpcy50b192YWwgPSB0b192YWw7XHJcblx0XHR0aGlzLnN0ZXAgPSAwO1xyXG5cdFx0dGhpcy5uZXh0ID0gbnVsbDtcclxuXHRcdHRoaXMucHJldiA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRkZXN0cnVjdG9yKCkge1xyXG5cclxuXHR9XHJcblxyXG5cdHN0ZXAoc3RlcF9tdWx0aXBsaWVyKSB7XHJcblxyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgU3R5bGVBbmltQmxvY1BlcmNlbnRhZ2UgZXh0ZW5kcyBTdHlsZUFuaW1CbG9jIHt9XHJcbmNsYXNzIFN0eWxlQW5pbUJsb2NQaXhlbCBleHRlbmRzIFN0eWxlQW5pbUJsb2Mge31cclxuY2xhc3MgU3R5bGVBbmltQmxvY0VNIGV4dGVuZHMgU3R5bGVBbmltQmxvYyB7fVxyXG5jbGFzcyBTdHlsZUFuaW1CbG9jQ29sb3IgZXh0ZW5kcyBTdHlsZUFuaW1CbG9jIHt9XHJcblxyXG5jbGFzcyBTdHlsZUtleUZyYW1lZEFuaW1CbG9jIGV4dGVuZHMgU3R5bGVBbmltQmxvYyB7XHJcblx0Y29uc3RydWN0b3Ioc3R5bGUsIGtleV9mcmFtZXMsIGRlbGF5KSB7XHJcblx0XHRzdXBlcigpXHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBBbmltQnVkZHkge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcclxuXHRcdHRoaXMuc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKTtcclxuXHRcdHRoaXMuZmlyc3RfYW5pbWF0aW9uID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdHNldEFuaW1hdGlvbih2YWxzKSB7XHJcblx0XHRsZXQgYW5pbV9ibG9jID0gbnVsbDtcclxuXHRcdGlmICh2YWxzIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdH1cclxuXHRcdGlmKGFuaW1fYmxvYyl7XHJcblx0XHRcdHRoaXMuX19pbnNlcnRfXyhhYik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfX2luc2VydF9fKGFiKSB7XHJcblx0XHRsZXQgYmxvYyA9IHRoaXMuZmlyc3RfYW5pbWF0aW9uO1xyXG5cclxuXHRcdHdoaWxlIChibG9jKSB7XHJcblx0XHRcdGlmIChibG9jLnN0eWxlID0gYWIuc3R5bGUpIHtcclxuXHRcdFx0XHRhYi5kZXN0cnVjdG9yKCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0YWIubmV4dCA9IHRoaXMuZmlyc3RfYW5pbWF0aW9uO1xyXG5cdFx0aWYgKHRoaXMuZmlyc3RfYW5pbWF0aW9uKVxyXG5cdFx0XHR0aGlzLmZpcnN0X2FuaW1hdGlvbi5wcmV2ID0gYWI7XHJcblx0XHR0aGlzLmZpcnN0X2FuaW1hdGlvbiA9IGFiO1xyXG5cdH1cclxuXHJcblx0c3RlcChzdGVwX211bHRpcGxpZXIpIHtcclxuXHRcdHZhciBhbmltX2Jsb2MgPSB0aGlzLmZpcnN0X2FuaW1hdGlvbjtcclxuXHRcdGlmIChhbmltX2Jsb2MpXHJcblx0XHRcdHdoaWxlIChhbmltX2Jsb2MpXHJcblx0XHRcdFx0aWYgKCFhbmltX2Jsb2Muc3RlcChzdGVwX211bHRpcGxpZXIpKSB7XHJcblx0XHRcdFx0XHRpZiAoIWFuaW1fYmxvYy5wcmV2KVxyXG5cdFx0XHRcdFx0XHR0aGlzLmZpcnN0X2FuaW1hdGlvbiA9IGFuaW1fYmxvYy5uZXh0O1xyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRhbmltX2Jsb2MucHJldi5uZXh0ID0gYW5pbV9ibG9jLm5leHQ7XHJcblx0XHRcdFx0XHRpZiAoYW5pbV9ibG9jLm5leHQpXHJcblx0XHRcdFx0XHRcdGFuaW1fYmxvYy5uZXh0LnByZXYgPSBhbmltX2Jsb2MucHJldjtcclxuXHJcblx0XHRcdFx0XHRsZXQgbmV4dCA9IGFuaW1fYmxvYy5uZXh0O1xyXG5cclxuXHRcdFx0XHRcdGFuaW1fYmxvYy5kZXN0cnVjdG9yKCk7XHJcblxyXG5cdFx0XHRcdFx0YW5pbV9ibG9jID0gbmV4dDtcclxuXHRcdFx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHRcdGFuaW1fYmxvYyA9IGFuaW1fYmxvYy5uZXh0O1xyXG5cclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRkZXN0cnVjdG9yKCkge1xyXG5cclxuXHR9XHJcblxyXG5cdGdldFN0eWxlKCkge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRzZXRTdHlsZSh2YWx1ZSkge1xyXG5cclxuXHR9XHJcblxyXG5cdG9uUmVzaXplKCkge1xyXG5cdFx0dGhpcy5nZXRTdHlsZSgpXHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBBbmltQ29yZXtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuYW5pbV9ncm91cCA9IHt9O1xyXG5cdFx0dGhpcy5ydW5uaW5nX2FuaW1hdGlvbnMgPSBbXTtcclxuXHR9XHJcblxyXG5cdHN0ZXAoc3RlcF9tdWx0aXBsaWVyKSB7XHJcblx0XHR2YXIgbCA9IHRoaXMucnVubmluZ19hbmltYXRpb25zLmxlbmdodDtcclxuXHRcdGlmIChsID4gMCkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xyXG5cclxuXHRcdFx0XHR2YXIgYWIgPSB0aGlzLnJ1bm5pbmdfYW5pbWF0aW9uc1tpXTtcclxuXHJcblx0XHRcdFx0aWYgKGFiICYmICFhYi5zdGVwKHN0ZXBfbXVsdGlwbGllcikpIHtcclxuXHRcdFx0XHRcdGFiLmRlc3RydWN0b3IoKTtcclxuXHRcdFx0XHRcdHRoaXMucnVubmluZ19hbmltYXRpb25zW2ldID0gbnVsbDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFkZEJsb2MoYW5pbV9ibG9jKSB7XHJcblx0XHRpZiAoYW5pbV9ibG9jIGluc3RhbmNlb2YgQW5pbUJsb2MpIHtcclxuXHRcdFx0Ly9hZGQgdG8gZ3JvdXAgb2Ygb2JqZWN0XHJcblxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IHtBbmltQ29yZSwgVHJhbnNmb3JtVG8sIENvbG9yfSIsImNsYXNzIFRyYW5zaXRpb25lZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldChlbGVtZW50LCBkYXRhKSB7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gXCJvcGFjaXR5IDAuNXNcIjtcclxuICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHNldF9pbihlbGVtZW50LCBkYXRhLCBpbmRleCA9IDApIHtcclxuICAgIFx0ZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gYG9wYWNpdHkgJHswLjgqaW5kZXgrMC41fXNgO1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIDAuODtcclxuICAgIH1cclxuXHJcbiAgICBzZXRfb3V0KGVsZW1lbnQsIGRhdGEsIGluZGV4ID0gMCkge1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgcmV0dXJuIDAuODtcclxuICAgIH1cclxuXHJcbiAgICBmaW5hbGl6ZV9vdXQoZWxlbWVudCkge1xyXG4gICAgXHRlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCB7XHJcbiAgICBUcmFuc2l0aW9uZWVyXHJcbn0iLCJpbXBvcnQge1xyXG4gICAgVmlld1xyXG59IGZyb20gXCIuLi92aWV3XCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBBbnlNb2RlbFxyXG59IGZyb20gXCIuLi9tb2RlbC9tb2RlbFwiXHJcblxyXG4vKlxyXG4gICAgVHJhbnNpdGlvbmVlcnNcclxuKi9cclxuXHJcbmltcG9ydCB7XHJcbiAgICBUcmFuc2l0aW9uZWVyXHJcbn0gZnJvbSBcIi4uL2FuaW1hdGlvbi90cmFuc2l0aW9uL3RyYW5zaXRpb25lZXJcIlxyXG5cclxubGV0IFByZXNldFRyYW5zaXRpb25lZXJzID0ge1xyXG4gICAgYmFzZTogVHJhbnNpdGlvbmVlclxyXG59XHJcblxyXG5jbGFzcyBSaXZldCBleHRlbmRzIFZpZXcge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCA9IG51bGwsIGRhdGEgPSB7fSwgcHJlc2V0cyA9IHt9KSB7XHJcblxyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5uYW1lZF9lbGVtZW50cyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmV4cG9ydF92YWwgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLkRFU1RST1lFRCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvL1NldHRpbmcgdGhlIHRyYW5zaXRpb25lclxyXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbmVlciA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChkYXRhLnRycykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHByZXNldHMudHJhbnNpdGlvbnMgJiYgcHJlc2V0cy50cmFuc2l0aW9uc1tkYXRhLnRyc10pXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25lZXIgPSBuZXcgcHJlc2V0cy50cmFuc2l0aW9uc1tkYXRhLnRyc10oKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoUHJlc2V0VHJhbnNpdGlvbmVlcnNbZGF0YS50cnNdKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyID0gbmV3IFByZXNldFRyYW5zaXRpb25lZXJzW2RhdGEudHJzXSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyLnNldCh0aGlzLmVsZW1lbnQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFkZFRvUGFyZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkVG9QYXJlbnQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB0aGlzLnBhcmVudC5jaGlsZHJlbi5wdXNoKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuREVTVFJPWUVEID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuTE9BREVEKSB7XHJcblxyXG5cclxuICAgICAgICAgICAgbGV0IHQgPSB0aGlzLnRyYW5zaXRpb25PdXQoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baV07XHJcblxyXG4gICAgICAgICAgICAgICAgdCA9IE1hdGgubWF4KHQsIGNoaWxkLnRyYW5zaXRpb25PdXQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0ID4gMClcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLmRlc3RydWN0b3IoKTsgfSwgdCAqIDEwMDAgKyA1KVxyXG5cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5maW5hbGl6ZVRyYW5zaXRpb25PdXQoKTtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjKSA9PiBjLmRlc3RydWN0b3IoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQgJiYgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBidWJibGVMaW5rKGxpbmtfdXJsLCBjaGlsZCwgdHJzX2VsZSA9IHt9KSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS50cmFuc2l0aW9uKVxyXG4gICAgICAgICAgICAgICAgdHJzX2VsZVt0aGlzLmRhdGEudHJhbnNpdGlvbl0gPSB0aGlzLmVsZW1lbnQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNoID0gdGhpcy5jaGlsZHJlbltpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2ggIT09IGNoaWxkKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoLmdhdGhlclRyYW5zaXRpb25FbGVtZW50cyh0cnNfZWxlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuYnViYmxlTGluayhsaW5rX3VybCwgdGhpcywgdHJzX2VsZSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJpZ25vcmVkIHRpdGxlXCIsIGxpbmtfdXJsKTtcclxuICAgICAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZWRFbGVtZW50cyhuYW1lZF9lbGVtZW50cykge31cclxuXHJcbiAgICBnYXRoZXJUcmFuc2l0aW9uRWxlbWVudHModHJzX2VsZSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnRyYW5zaXRpb24gJiYgIXRyc19lbGVbdGhpcy5kYXRhLnRyYW5zaXRpb25dKVxyXG4gICAgICAgICAgICB0cnNfZWxlW3RoaXMuZGF0YS50cmFuc2l0aW9uXSA9IHRoaXMuZWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLmlzID09IDEpXHJcbiAgICAgICAgICAgICAgICBlLmdhdGhlclRyYW5zaXRpb25FbGVtZW50cyh0cnNfZWxlKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNvcHkoZWxlbWVudCwgaW5kZXgpIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgb3V0X29iamVjdCA9IHt9O1xyXG5cclxuICAgICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQuY2xvbmVOb2RlKHRydWUpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBvdXRfb2JqZWN0LmVsZW1lbnQgPSBlbGVtZW50LmNoaWxkcmVuW3RoaXMuZWxlbWVudF07XHJcbiAgICAgICAgICAgIG91dF9vYmplY3QuY2hpbGRyZW4gPSBuZXcgQXJyYXkodGhpcy5jaGlsZHJlbi5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgIG91dF9vYmplY3QuY2hpbGRyZW5baV0gPSBjaGlsZC5jb3B5KG91dF9vYmplY3QuZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfb2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVVybFVwZGF0ZSh3dXJsKSB7fVxyXG5cclxuICAgIGZpbmFsaXplVHJhbnNpdGlvbk91dCgpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5maW5hbGl6ZVRyYW5zaXRpb25PdXQoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbmVlcilcclxuICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyLmZpbmFsaXplX291dCh0aGlzLmVsZW1lbnQpO1xyXG5cclxuICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgIEByZXR1cm5zIHtudW1iZXJ9IFRpbWUgaW4gbWlsbGlzZWNvbmRzIHRoYXQgdGhlIHRyYW5zaXRpb24gd2lsbCB0YWtlIHRvIGNvbXBsZXRlLlxyXG4gICAgKi9cclxuICAgIHRyYW5zaXRpb25JbihpbmRleCA9IDApIHtcclxuXHJcbiAgICAgICAgdGhpcy5zaG93KCk7XHJcblxyXG4gICAgICAgIGxldCB0cmFuc2l0aW9uX3RpbWUgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLkxPQURFRCA9IHRydWU7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgdGhpcy5jaGlsZHJlbltpXS50cmFuc2l0aW9uSW4oaW5kZXgpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbmVlcilcclxuICAgICAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCB0aGlzLnRyYW5zaXRpb25lZXIuc2V0X2luKHRoaXMuZWxlbWVudCwgdGhpcy5kYXRhLCBpbmRleCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbl90aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFRha2VzIGFzIGFuIGlucHV0IGEgbGlzdCBvZiB0cmFuc2l0aW9uIG9iamVjdHMgdGhhdCBjYW4gYmUgdXNlZFxyXG4gICAgKi9cclxuICAgIHRyYW5zaXRpb25PdXQoaW5kZXggPSAwLCBERVNUUk9ZID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fdGltZSA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuTE9BREVEID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb25lZXIpXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgdGhpcy50cmFuc2l0aW9uZWVyLnNldF9vdXQodGhpcy5lbGVtZW50LCB0aGlzLmRhdGEsIGluZGV4KSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgdGhpcy5jaGlsZHJlbltpXS50cmFuc2l0aW9uT3V0KGluZGV4KSk7XHJcblxyXG4gICAgICAgIGlmIChERVNUUk9ZKVxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5maW5hbGl6ZVRyYW5zaXRpb25PdXQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzdHJ1Y3RvcigpOyB9LCB0cmFuc2l0aW9uX3RpbWUgKiAxMDAwKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25fdGltZTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEaW1lbnNpb25zKCkge1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0udXBkYXRlRGltZW5zaW9ucygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIENhbGxlZCBieSAgcGFyZW50IHdoZW4gZGF0YSBpcyB1cGRhdGUgYW5kIHBhc3NlZCBkb3duIGZyb20gZnVydGhlciB1cCB0aGUgZ3JhcGguIFxyXG4gICAgICAgIEBwYXJhbSB7KE9iamVjdCB8IE1vZGVsKX0gZGF0YSAtIERhdGEgdGhhdCBoYXMgYmVlbiB1cGRhdGVkIGFuZCBpcyB0byBiZSByZWFkLiBcclxuICAgICAgICBAcGFyYW0ge0FycmF5fSBjaGFuZ2VkX3Byb3BlcnRpZXMgLSBBbiBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyB0aGF0IGhhdmUgYmVlbiB1cGRhdGVkLiBcclxuICAgICAgICBAcGFyYW0ge0Jvb2xlYW59IElNUE9SVEVEIC0gVHJ1ZSBpZiB0aGUgZGF0YSBkaWQgbm90IG9yaWdpbmF0ZSBmcm9tIHRoZSBtb2RlbCB3YXRjaGVkIGJ5IHRoZSBwYXJlbnQgQ2FzZS4gRmFsc2Ugb3RoZXJ3aXNlLlxyXG4gICAgKi9cclxuICAgIF9fZG93bl9fKGRhdGEsIGNoYW5nZWRfcHJvcGVydGllcyA9IG51bGwsIElNUE9SVEVEID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgbGV0IHJfdmFsID0gdGhpcy5kb3duKGRhdGEsIGNoYW5nZWRfcHJvcGVydGllcywgSU1QT1JURUQpO1xyXG5cclxuICAgICAgICBpZiAocl92YWwpKGRhdGEgPSByX3ZhbCwgSU1QT1JURUQgPSB0cnVlKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5fX2Rvd25fXyhkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMsIElNUE9SVEVEKTtcclxuICAgIH1cclxuICAgIGRvd24oZGF0YSwgY2hhbmdlZF9wcm9wZXJ0aWVzID0gbnVsbCwgSU1QT1JURUQpIHt9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQ2FsbGVkIGJ5ICBwYXJlbnQgd2hlbiBkYXRhIGlzIHVwZGF0ZSBhbmQgcGFzc2VkIHVwIGZyb20gYSBsZWFmLiBcclxuICAgICAgICBAcGFyYW0geyhPYmplY3QgfCBNb2RlbCl9IGRhdGEgLSBEYXRhIHRoYXQgaGFzIGJlZW4gdXBkYXRlZCBhbmQgaXMgdG8gYmUgcmVhZC4gXHJcbiAgICAgICAgQHBhcmFtIHtBcnJheX0gY2hhbmdlZF9wcm9wZXJ0aWVzIC0gQW4gYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgdGhhdCBoYXZlIGJlZW4gdXBkYXRlZC4gXHJcbiAgICAgICAgQHBhcmFtIHtCb29sZWFufSBJTVBPUlRFRCAtIFRydWUgaWYgdGhlIGRhdGEgZGlkIG5vdCBvcmlnaW5hdGUgZnJvbSB0aGUgbW9kZWwgd2F0Y2hlZCBieSB0aGUgcGFyZW50IENhc2UuIEZhbHNlIG90aGVyd2lzZS5cclxuICAgICovXHJcbiAgICBfX3VwX18oZGF0YSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50KHVwKTtcclxuICAgIH1cclxuXHJcbiAgICB1cChkYXRhKSB7XHJcblxyXG4gICAgICAgIGlmIChkYXRhKVxyXG4gICAgICAgICAgICB0aGlzLl9fdXBfXyhkYXRhKVxyXG4gICAgfVxyXG5cclxuICAgIF9fdXBkYXRlX18oZGF0YSwgRlJPTV9QQVJFTlQgPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBsZXQgcl9kYXRhID0gdGhpcy51cGRhdGUoZGF0YSwgRlJPTV9QQVJFTlQpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLl9fdXBkYXRlX18ocl9kYXRhIHx8IGRhdGEsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWQobW9kZWwpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0ubG9hZChtb2RlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5ID0gdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNob3coKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQpXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PSBcIm5vbmVcIilcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gdGhpcy5kaXNwbGF5O1xyXG4gICAgfVxyXG5cclxuICAgIF9fdXBkYXRlRXhwb3J0c19fKGRhdGEpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5leHBvcnQgJiYgZGF0YVt0aGlzLmRhdGEuZXhwb3J0XSlcclxuICAgICAgICAgICAgdGhpcy5leHBvcnRfdmFsID0gZGF0YVt0aGlzLmRhdGEuZXhwb3J0XTtcclxuICAgIH1cclxuXHJcbiAgICBfX2dldEV4cG9ydHNfXyhleHBvcnRzKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmV4cG9ydF92YWwpXHJcbiAgICAgICAgICAgIGV4cG9ydHNbdGhpcy5kYXRhLmV4cG9ydF0gPSB0aGlzLmV4cG9ydF92YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgRXhwb3J0cyBkYXRhIHN0b3JlZCBmcm9tIHVwZGF0ZUV4cG9ydHMoKSBpbnRvIGEgYW4gT2JqZWN0IGV4cG9ydHMgYW5kIGNhbGxzIGl0J3MgcGFyZW50J3MgZXhwb3J0IGZ1bmN0aW9uLCBwYXNzaW5nIGV4cG9ydHNcclxuICAgICovXHJcbiAgICBleHBvcnQgKGV4cG9ydHMgPSBuZXcgQW55TW9kZWwpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LmV4cG9ydCkge1xyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX19nZXRFeHBvcnRzX18oZXhwb3J0cylcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLl9fZ2V0RXhwb3J0c19fKGV4cG9ydHMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuZXhwb3J0KGV4cG9ydHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbXBvcnQgKGRhdGEpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwpXHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwuYWRkKGRhdGEpO1xyXG5cclxuICAgICAgICB0aGlzLmV4cG9ydChkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVFeHBvcnRzKGRhdGEpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5leHBvcnQgJiYgZGF0YVt0aGlzLmRhdGEuZXhwb3J0XSlcclxuICAgICAgICAgICAgdGhpcy5leHBvcnQgPSBkYXRhW3RoaXMuZGF0YS5leHBvcnRdO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZCh2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmFkZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwb3J0KHRoaXMubW9kZWwpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuYWRkKVxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5hZGQodmFsdWUpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBSaXZldFxyXG59IiwiaW1wb3J0IHtcclxuICAgIFZpZXdcclxufSBmcm9tIFwiLi4vdmlld1wiXHJcbmltcG9ydCB7XHJcbiAgICBHZXR0ZXJcclxufSBmcm9tIFwiLi4vZ2V0dGVyXCJcclxuaW1wb3J0IHtcclxuICAgIFJpdmV0XHJcbn0gZnJvbSBcIi4uL2Nhc2Uvcml2ZXRcIlxyXG5pbXBvcnQge1xyXG4gICAgVHVybkRhdGFJbnRvUXVlcnlcclxufSBmcm9tIFwiLi4vY29tbW9uXCJcclxuaW1wb3J0IHtcclxuICAgIERhdGFUZW1wbGF0ZVxyXG59IGZyb20gXCIuL2RhdGFfdGVtcGxhdGVcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIFRyYW5zaXRpb25lZXJcclxufSBmcm9tIFwiLi4vYW5pbWF0aW9uL3RyYW5zaXRpb24vdHJhbnNpdGlvbmVlclwiXHJcblxyXG5cclxuLyoqXHJcbiAgICBIYW5kbGVzIHRoZSB0cmFuc2l0aW9uIG9mIHNlcGFyYXRlIGVsZW1lbnRzLlxyXG4qL1xyXG5jbGFzcyBCYXNpY0Nhc2UgZXh0ZW5kcyBSaXZldCB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7XHJcbiAgICAgICAgc3VwZXIobnVsbCwgZWxlbWVudCwge30sIHt9KTtcclxuICAgICAgICB0aGlzLmFuY2hvciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyID0gbmV3IFRyYW5zaXRpb25lZXIoKTtcclxuICAgICAgICB0aGlzLnRyYW5zaXRpb25lZXIuc2V0KHRoaXMuZWxlbWVudClcclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKSB7XHJcbiAgICAgICAgbGV0IGNoaWxkcmVuID0gdGhpcy5lbGVtZW50LmNoaWxkcmVuO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNoaWxkLmRhdGFzZXQudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgbmFtZWRfZWxlbWVudHNbY2hpbGQuZGF0YXNldC50cmFuc2l0aW9uXSA9IGNoaWxkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICAgIFRoaXMgaXMgYSBmYWxsYmFjayBjb21wb25lbnQgaWYgY29uc3RydWN0aW5nIGEgQ2FzZUNvbXBvbmVudCBvciBub3JtYWwgQ29tcG9uZW50IHRocm93cyBhbiBlcnJvci5cclxuKi9cclxuXHJcbmNsYXNzIEZhaWxlZENhc2UgZXh0ZW5kcyBSaXZldCB7XHJcbiAgICBjb25zdHJ1Y3RvcihlcnJvcl9tZXNzYWdlLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2LmlubmVySFRNTCA9IGA8aDM+IFRoaXMgV2ljayBjb21wb25lbnQgaGFzIGZhaWxlZCE8L2gzPiA8aDQ+RXJyb3IgTWVzc2FnZTo8L2g0PjxwPiR7ZXJyb3JfbWVzc2FnZS5zdGFja308L3A+PHA+UGxlYXNlIGNvbnRhY3QgdGhlIHdlYnNpdGUgbWFpbnRhaW5lcnMgdG8gYWRkcmVzcyB0aGUgcHJvYmxlbS48L3A+IDxwPiR7cHJlc2V0cy5lcnJvcl9jb250YWN0fTwvcD5gO1xyXG4gICAgICAgIHN1cGVyKG51bGwsIGRpdiwge30sIHt9KTtcclxuXHJcbiAgICAgICAgIHRoaXMudHJhbnNpdGlvbmVlciA9IG5ldyBUcmFuc2l0aW9uZWVyKCk7XHJcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyLnNldCh0aGlzLmVsZW1lbnQpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBCYXNpY0Nhc2UsXHJcbiAgICBGYWlsZWRDYXNlXHJcbn0iLCJpbXBvcnQge1xyXG4gICAgc2V0TGlua3NcclxufSBmcm9tIFwiLi4vLi4vbGlua2VyL3NldGxpbmtzXCJcclxuaW1wb3J0IHtcclxuICAgIExleFxyXG59IGZyb20gXCIuLi8uLi9jb21tb25cIlxyXG5pbXBvcnQge1xyXG4gICAgUml2ZXRcclxufSBmcm9tIFwiLi4vcml2ZXRcIlxyXG5cclxuLyoqXHJcbiAgICBEZWFscyB3aXRoIHNwZWNpZmljIHByb3BlcnRpZXMgb24gYSBtb2RlbC4gXHJcbiovXHJcblxyXG5jbGFzcyBDYXNzZXR0ZSBleHRlbmRzIFJpdmV0IHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgZWxlbWVudCwgcHJlc2V0cywgZGF0YSkge1xyXG5cclxuICAgICAgICBzdXBlcihwYXJlbnQsIGVsZW1lbnQsIHByZXNldHMsIGRhdGEpO1xyXG5cclxuICAgICAgICB0aGlzLnByb3AgPSB0aGlzLmRhdGEucHJvcDtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAwO1xyXG4gICAgICAgIHRoaXMudG9wID0gMDtcclxuICAgICAgICB0aGlzLmxlZnQgPSAwO1xyXG4gICAgICAgIHRoaXMubHZsID0gMDtcclxuICAgICAgICB0aGlzLmlzID0gMTtcclxuICAgICAgICB0aGlzLmRhdGFfY2FjaGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC50YWdOYW1lID09IFwiQVwiKVxyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaW5rKHRoaXMuZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC50YWdOYW1lID09IFwiQVwiKVxyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3lMaW5rKHRoaXMuZWxlbWVudCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YV9jYWNoZSA9IG51bGw7XHJcblxyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBUaGlzIHdpbGwgYXR0YWNoIGEgZnVuY3Rpb24gdG8gdGhlIGxpbmsgZWxlbWVudCB0byBpbnRlcmNlcHQgYW5kIHByb2Nlc3MgZGF0YSBmcm9tIHRoZSBjYXNzZXR0ZS5cclxuICAgICovXHJcbiAgICBwcm9jZXNzTGluayhlbGVtZW50LCBsaW5rKSB7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50Lm9yaWdpbiAhPT0gbG9jYXRpb24ub3JpZ2luKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICghZWxlbWVudC5vbmNsaWNrKSBlbGVtZW50Lm9uY2xpY2sgPSAoKGhyZWYsIGEsIF9fZnVuY3Rpb25fXykgPT4gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBpZiAoX19mdW5jdGlvbl9fKGhyZWYsIGEpKSBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSkoZWxlbWVudC5ocmVmLCBlbGVtZW50LCAoaHJlZiwgYSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IFNBTUVfTE9DQUxFID0gKGxvY2F0aW9uLnBhdGhuYW1lID09IGEucGF0aG5hbWUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGhhc2h0YWcgPSBocmVmLmluY2x1ZGVzKFwiI1wiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCByZWFsX2hyZWYgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgbGV0IGxleCA9IExleChocmVmKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChsZXgudG9rZW4pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobGV4LnRva2VuLnRleHQgPT0gXCJ7XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9wID0gbGV4LnRva2VuLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICByZWFsX2hyZWYgKz0gdGhpc1twcm9wXSB8fCB0aGlzLmRhdGFfY2FjaGVbcHJvcF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZXgudG9rZW4udGV4dCAhPSBcIn1cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBpbmNvcnJlY3QgdmFsdWUgZm91bmQgaW4gdXJsICR7aHJlZn1gKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWFsX2hyZWYgKz0gbGV4LnRva2VuLnRleHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGhhc2h0YWcpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmV4cG9ydCgpO1xyXG5cclxuICAgICAgICAgICAgaWYoIVNBTUVfTE9DQUxFKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5idWJibGVMaW5rKHJlYWxfaHJlZik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZWxlbWVudC5vbm1vdXNlb3ZlciA9ICgoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgaHJlZiA9IGVsZW1lbnQuaHJlZjtcclxuXHJcbiAgICAgICAgICAgIGxldCByZWFsX2hyZWYgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgbGV0IGxleCA9IExleChocmVmKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChsZXgudG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIGlmIChsZXgudG9rZW4udGV4dCA9PSBcIntcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3AgPSBsZXgudG9rZW4udGV4dDtcclxuICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZWFsX2hyZWYgKz0gdGhpc1twcm9wXSB8fCB0aGlzLmRhdGFfY2FjaGVbcHJvcF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZXgudG9rZW4udGV4dCAhPSBcIn1cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBpbmNvcnJlY3QgdmFsdWUgZm91bmQgaW4gdXJsICR7aHJlZn1gKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWFsX2hyZWYgKz0gbGV4LnRva2VuLnRleHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveUxpbmsoZWxlbWVudCkge1xyXG5cclxuICAgICAgICBlbGVtZW50Lm9uY2xpY2sgPSBudWxsXHJcbiAgICAgICAgZWxlbWVudC5vbm1vdXNlb3ZlciA9IG51bGw7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVwZGF0ZShkYXRhLCBfX0ZST01fUEFSRU5UX18gPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBzdXBlci5fX3VwZGF0ZUV4cG9ydHNfXyhkYXRhKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3ApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSBkYXRhW3RoaXMucHJvcF07XHJcbiAgICAgICAgICAgICAgICB0aGlzW3RoaXMucHJvcF0gPSBkYXRhW3RoaXMucHJvcF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFfY2FjaGUgPSBkYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGltcG9ydCAoZGF0YSkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBsb2FkKG1vZGVsKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLmxvYWQobW9kZWwpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEubW9kZWwpXHJcbiAgICAgICAgICAgIG1vZGVsLmFkZFZpZXcodGhpcylcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEaW1lbnNpb25zKCkge1xyXG5cclxuICAgICAgICB2YXIgZCA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IGQud2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBkLmhlaWdodDtcclxuICAgICAgICB0aGlzLnRvcCA9IGQudG9wO1xyXG4gICAgICAgIHRoaXMubGVmdCA9IGQubGVmdDtcclxuXHJcbiAgICAgICAgc3VwZXIudXBkYXRlRGltZW5zaW9ucygpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBDbG9zZUNhc3NldHRlIGV4dGVuZHMgQ2Fzc2V0dGUge1xyXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBlbGVtZW50LCBkLCBwKSB7XHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBlbGVtZW50LCBkLCBwKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHBhcmVudC5oaWRlKCk7IC8vT3IgVVJMIGJhY2s7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIENhc3NldHRlLFxyXG4gICAgQ2xvc2VDYXNzZXR0ZSxcclxuICAgIEltcG9ydERhdGFGcm9tRGF0YVNldFxyXG59IiwiaW1wb3J0IHtcclxuICAgIFJpdmV0XHJcbn0gZnJvbSBcIi4vcml2ZXRcIlxyXG5pbXBvcnQge1xyXG4gICAgTW9kZWxcclxufSBmcm9tIFwiLi4vbW9kZWwvbW9kZWxcIlxyXG5pbXBvcnQge1xyXG4gICAgQ29udHJvbGxlclxyXG59IGZyb20gXCIuLi9jb250cm9sbGVyXCJcclxuaW1wb3J0IHtcclxuICAgIEdldHRlclxyXG59IGZyb20gXCIuLi9nZXR0ZXJcIlxyXG5pbXBvcnQge1xyXG4gICAgQ2Fzc2V0dGVcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9jYXNzZXR0ZVwiXHJcblxyXG5jbGFzcyBDYXNlIGV4dGVuZHMgUml2ZXQge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIENhc2UgY29uc3RydWN0b3IuIEJ1aWxkcyBhIENhc2Ugb2JqZWN0LlxyXG4gICAgICAgIEBwYXJhbXMgW0RPTUVsZW1lbnRdIGVsZW1lbnQgLSBBIERPTSA8dGVtcGxhdGU+IGVsZW1lbnQgdGhhdCBjb250YWlucyBhIDxjYXNlPiBlbGVtZW50LlxyXG4gICAgICAgIEBwYXJhbXMgW0xpbmtlclByZXNldHNdIHByZXNldHNcclxuICAgICAgICBAcGFyYW1zIFtDYXNlXSBwYXJlbnQgLSBUaGUgcGFyZW50IENhc2Ugb2JqZWN0LCB1c2VkIGludGVybmFsbHkgdG8gYnVpbGQgQ2FzZSdzIGluIGEgaGllcmFyY2h5XHJcbiAgICAgICAgQHBhcmFtcyBbTW9kZWxdIG1vZGVsIC0gQSBtb2RlbCB0aGF0IGNhbiBiZSBwYXNzZWQgdG8gdGhlIGNhc2UgaW5zdGVhZCBvZiBoYXZpbmcgb25lIGNyZWF0ZWQgb3IgcHVsbGVkIGZyb20gcHJlc2V0cy4gXHJcbiAgICAgICAgQHBhcmFtcyBbRE9NXSAgV09SS0lOR19ET00gLSBUaGUgRE9NIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRlbXBsYXRlcyB0byBiZSB1c2VkIHRvIGJ1aWxkIHRoZSBjYXNlIG9iamVjdHMuIFxyXG4gICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCA9IG51bGwsIGRhdGEsIHByZXNldHMpIHtcclxuXHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBkYXRhLCBwcmVzZXRzKVxyXG5cclxuICAgICAgICB0aGlzLlVTRV9TRUNVUkUgPSBwcmVzZXRzLlVTRV9IVFRQUztcclxuICAgICAgICB0aGlzLm5hbWVkX2VsZW1lbnRzID0ge307XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wcm9wID0gbnVsbDtcclxuICAgICAgICB0aGlzLnVybCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wcmVzZXRzID0gcHJlc2V0cztcclxuICAgICAgICB0aGlzLnJlY2VpdmVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLnF1ZXJ5ID0ge307XHJcbiAgICAgICAgdGhpcy5SRVFVRVNUSU5HID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5leHBvcnRzID0gbnVsbDtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuZmlsdGVyX2xpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZmlsdGVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaXMgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucmVjZWl2ZXIpXHJcbiAgICAgICAgICAgIHRoaXMucmVjZWl2ZXIuZGVzdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVtcGxhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNbaV0uZGVzdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgU2V0cyB1cCBNb2RlbCBjb25uZWN0aW9uIG9yIGNyZWF0ZXMgYSBuZXcgTW9kZWwgZnJvbSBhIHNjaGVtYS5cclxuICAgICovXHJcbiAgICBsb2FkKG1vZGVsKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS51cmwpIHtcclxuICAgICAgICAgICAgLy9pbXBvcnQgcXVlcnkgaW5mbyBmcm9tIHRoZSB3dXJsXHJcbiAgICAgICAgICAgIGxldCBzdHIgPSB0aGlzLmRhdGEudXJsO1xyXG4gICAgICAgICAgICBsZXQgY2Fzc2V0dGVzID0gc3RyLnNwbGl0KFwiO1wiKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnVybCA9IGNhc3NldHRlc1swXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgY2Fzc2V0dGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2Fzc2V0dGUgPSBjYXNzZXR0ZXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjYXNzZXR0ZVswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ET1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVybF9wYXJlbnRfaW1wb3J0ID0gY2Fzc2V0dGUuc2xpY2UoMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInFcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cmxfcXVlcnkgPSBjYXNzZXR0ZS5zbGljZSgxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIjxcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cmxfcmV0dXJuID0gY2Fzc2V0dGUuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucHJvcCA9IHRoaXMuZGF0YS5wcm9wO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLmV4cG9ydCkgdGhpcy5leHBvcnRzID0gdGhpcy5kYXRhLmV4cG9ydDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwpIHtcclxuICAgICAgICAgICAgbW9kZWwgPSB0aGlzLm1vZGVsO1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbCAmJiBtb2RlbCBpbnN0YW5jZW9mIE1vZGVsKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zY2hlbWEpIHtcclxuICAgICAgICAgICAgICAgIC8qIE9waW5pb25hdGVkIENhc2UgLSBPbmx5IGFjY2VwdHMgTW9kZWxzIHRoYXQgYXJlIG9mIHRoZSBzYW1lIHR5cGUgYXMgaXRzIHNjaGVtYS4qL1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vZGVsLmNvbnN0cnVjdG9yICE9IHRoaXMuc2NoZW1hKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aHJvdyBuZXcgRXJyb3IoYE1vZGVsIFNjaGVtYSAke3RoaXMubW9kZWwuc2NoZW1hfSBkb2VzIG5vdCBtYXRjaCBDYXNlIFNjaGVtYSAke3ByZXNldHMuc2NoZW1hc1t0aGlzLmRhdGEuc2NoZW1hXS5zY2hlbWF9YClcclxuICAgICAgICAgICAgICAgIH1lbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlbWEgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5tb2RlbCA9IG51bGw7XHJcbiAgICAgICAgfSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2NoZW1hKSBcclxuICAgICAgICAgICAgbW9kZWwgPSBuZXcgdGhpcy5zY2hlbWEoKTtcclxuXHJcbiAgICAgICAgbW9kZWwuYWRkVmlldyh0aGlzKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS51cmwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVjZWl2ZXIgPSBuZXcgR2V0dGVyKHRoaXMuZGF0YS51cmwsIHRoaXMudXJsX3JldHVybik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlY2VpdmVyLnNldE1vZGVsKG1vZGVsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX19fX3JlcXVlc3RfX19fKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gTW9kZWwgY291bGQgYmUgZm91bmQgZm9yIENhc2UgY29uc3RydWN0b3IhIENhc2Ugc2NoZW1hIFwiJHt0aGlzLmRhdGEuc2NoZW1hfVwiLCBcIiR7dGhpcy5wcmVzZXRzLnNjaGVtYXNbdGhpcy5kYXRhLnNjaGVtYV19XCI7IENhc2UgbW9kZWwgXCIke3RoaXMuZGF0YS5tb2RlbH1cIiwgXCIke3RoaXMucHJlc2V0cy5tb2RlbHNbdGhpcy5kYXRhLm1vZGVsXX1cIjtgKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSBcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5sb2FkKHRoaXMubW9kZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIF9fX19yZXF1ZXN0X19fXyhxdWVyeSkge1xyXG5cclxuICAgICAgICB0aGlzLnJlY2VpdmVyLmdldChxdWVyeSwgbnVsbCwgdGhpcy5VU0VfU0VDVVJFKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5SRVFVRVNUSU5HID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5SRVFVRVNUSU5HID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgKGV4cG9ydHMpIHtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTdWJzKHRoaXMuY2hpbGRyZW4sIGV4cG9ydHMsIHRydWUpO1xyXG5cclxuICAgICAgICBzdXBlci5leHBvcnQoZXhwb3J0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU3VicyhjYXNzZXR0ZXMsIGRhdGEsIElNUE9SVCA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2Fzc2V0dGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGNhc3NldHRlID0gY2Fzc2V0dGVzW2ldO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKGNhc3NldHRlIGluc3RhbmNlb2YgQ2FzZSlcclxuICAgICAgICAgICAgICAgIGNhc3NldHRlLnVwZGF0ZShkYXRhLCB0cnVlKTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcl92YWw7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKElNUE9SVCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2Fzc2V0dGUuZGF0YS5pbXBvcnQgJiYgZGF0YVtjYXNzZXR0ZS5kYXRhLmltcG9ydF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcl92YWwgPSBjYXNzZXR0ZS51cGRhdGUoZGF0YSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocl92YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU3VicyhjYXNzZXR0ZS5jaGlsZHJlbiwgcl92YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qKiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgT3ZlcnJpZGluZyB0aGUgbW9kZWwgZGF0YSBoYXBwZW5zIHdoZW4gYSBjYXNzZXR0ZSByZXR1cm5zIGFuIG9iamVjdCBpbnN0ZWFkIG9mIHVuZGVmaW5lZC4gVGhpcyBpcyBhc3NpZ25lZCB0byB0aGUgXCJyX3ZhbFwiIHZhcmlhYmxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFueSBjaGlsZCBjYXNzZXR0ZSBvZiB0aGUgcmV0dXJuaW5nIGNhc3NldHRlIHdpbGwgYmUgZmVkIFwicl92YWxcIiBpbnN0ZWFkIG9mIFwiZGF0YVwiLlxyXG4gICAgICAgICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJfdmFsID0gY2Fzc2V0dGUudXBkYXRlKGRhdGEsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN1YnMoY2Fzc2V0dGUuY2hpbGRyZW4sIHJfdmFsIHx8IGRhdGEsIElNUE9SVCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXAoZGF0YSl7XHJcbiAgICAgICAgdGhpcy5tb2RlbC5hZGQoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEsIGNoYW5nZWRfdmFsdWVzKSB7XHJcbiAgICAgICAgdGhpcy5fX2Rvd25fXyhkYXRhLCBjaGFuZ2VkX3ZhbHVlcyk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGhhbmRsZVVybFVwZGF0ZSh3dXJsKSB7XHJcbiAgICAgICAgbGV0IHF1ZXJ5X2RhdGEgPSBudWxsO1xyXG4gICAgICAgIC8qIFxyXG4gICAgICAgICAgICBUaGlzIHBhcnQgb2YgdGhlIGZ1bmN0aW9uIHdpbGwgaW1wb3J0IGRhdGEgaW50byB0aGUgbW9kZWwgdGhhdCBpcyBvYnRhaW5lZCBmcm9tIHRoZSBxdWVyeSBzdHJpbmcgXHJcbiAgICAgICAgKi9cclxuICAgICAgICBpZiAod3VybCAmJiB0aGlzLmRhdGEuaW1wb3J0KSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5X2RhdGEgPSB7fTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5pbXBvcnQgPT0gXCJudWxsXCIpIHtcclxuICAgICAgICAgICAgICAgIHF1ZXJ5X2RhdGEgPSB3dXJsLmdldENsYXNzKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhxdWVyeV9kYXRhKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGwgPSB0aGlzLmRhdGEuaW1wb3J0LnNwbGl0KFwiO1wiKVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG4gPSBsW2ldLnNwbGl0KFwiOlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsYXNzX25hbWUgPSBuWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwID0gblsxXS5zcGxpdChcIj0+XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXlfbmFtZSA9IHBbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltcG9ydF9uYW1lID0gcFsxXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2xhc3NfbmFtZSA9PSBcInJvb3RcIikgY2xhc3NfbmFtZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVlcnlfZGF0YVtpbXBvcnRfbmFtZV0gPSB3dXJsLmdldChjbGFzc19uYW1lLCBrZXlfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh3dXJsICYmIHRoaXMuZGF0YS51cmwpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBxdWVyeV9kYXRhID0ge307XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVybF9xdWVyeSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGwgPSB0aGlzLnVybF9xdWVyeS5zcGxpdChcIjtcIilcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuID0gbFtpXS5zcGxpdChcIjpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsYXNzX25hbWUgPSBuWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwID0gblsxXS5zcGxpdChcIj0+XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXlfbmFtZSA9IHBbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltcG9ydF9uYW1lID0gcFsxXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2xhc3NfbmFtZSA9PSBcInJvb3RcIikgY2xhc3NfbmFtZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVlcnlfZGF0YVtpbXBvcnRfbmFtZV0gPSB3dXJsLmdldChjbGFzc19uYW1lLCBrZXlfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX19fX3JlcXVlc3RfX19fKHF1ZXJ5X2RhdGEpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMubW9kZWwpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBuZXcgdGhpcy5tb2RlbF9jb25zdHJ1Y3RvcigpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdldHRlcilcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0dGVyLnNldE1vZGVsKHRoaXMubW9kZWwpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tb2RlbC5hZGRWaWV3KHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHF1ZXJ5X2RhdGEpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLm1vZGVsLmFkZChxdWVyeV9kYXRhKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5tb2RlbC5nZXQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5tb2RlbC5nZXQoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNpdGlvbkluKGluZGV4ID0gMCkge1xyXG5cclxuICAgICAgICBsZXQgdHJhbnNpdGlvbl90aW1lID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnRlbXBsYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgdGhpcy50ZW1wbGF0ZXNbaV0udHJhbnNpdGlvbkluKGluZGV4KSk7XHJcblxyXG4gICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgc3VwZXIudHJhbnNpdGlvbkluKGluZGV4KSk7XHJcblxyXG4gICAgICAgdGhpcy51cGRhdGVEaW1lbnNpb25zKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uX3RpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgVGFrZXMgYXMgYW4gaW5wdXQgYSBsaXN0IG9mIHRyYW5zaXRpb24gb2JqZWN0cyB0aGF0IGNhbiBiZSB1c2VkXHJcbiAgICAqL1xyXG4gICAgdHJhbnNpdGlvbk91dChpbmRleCA9IDAsIERFU1RST1kgPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBsZXQgdHJhbnNpdGlvbl90aW1lID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnRlbXBsYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgdGhpcy50ZW1wbGF0ZXNbaV0udHJhbnNpdGlvbk91dChpbmRleCkpO1xyXG5cclxuICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHN1cGVyLnRyYW5zaXRpb25PdXQoaW5kZXgsIERFU1RST1kpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25fdGltZTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5hbGl6ZVRyYW5zaXRpb25PdXQoKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlc1tpXS5maW5hbGl6ZVRyYW5zaXRpb25PdXQoKTtcclxuXHJcbiAgICAgICAgc3VwZXIuZmluYWxpemVUcmFuc2l0aW9uT3V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QWN0aXZhdGluZygpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LnNldEFjdGl2YXRpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgY29tcF9uYW1lIGluIHRoaXMubmFtZWRfZWxlbWVudHMpIFxyXG4gICAgICAgICAgICBuYW1lZF9lbGVtZW50c1tjb21wX25hbWVdID0gdGhpcy5uYW1lZF9lbGVtZW50c1tjb21wX25hbWVdO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBDdXN0b21DYXNlIGV4dGVuZHMgQ2FzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBkYXRhID0ge30sIHByZXNldHMgPSB7fSkge1xyXG4gICAgICAgIHN1cGVyKG51bGwsIGVsZW1lbnQsIGRhdGEsIHByZXNldHMpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBDYXNlLFxyXG4gICAgQ3VzdG9tQ2FzZVxyXG59IiwiaW1wb3J0IHtcclxuICAgIENhc3NldHRlXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGVcIlxyXG5cclxuY2xhc3MgRmlsdGVyIGV4dGVuZHMgQ2Fzc2V0dGUge1xyXG5cdFxyXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBlbGVtZW50LCBkLCBwKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKHBhcmVudCwgZWxlbWVudCwgZCwgcCk7XHJcblxyXG4gICAgICAgIHBhcmVudC5maWx0ZXJfbGlzdC5wdXNoKChkYXRhKSA9PiB0aGlzLmZpbHRlcihkYXRhKSk7XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC51cGRhdGUoKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkYXRhKSB7XHJcbiAgICAgICAgLy9hcHBseSBhIGZpbHRlciBvYmplY3QgdG8gdGhlIHBhcmVudFxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXIoZGF0YSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIEZpbHRlclxyXG59IiwiaW1wb3J0IHtcclxuICAgIENhc2VcclxufSBmcm9tIFwiLi9jYXNlXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBGaWx0ZXJcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9maWx0ZXJcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIFRlcm1cclxufSBmcm9tIFwiLi9jYXNzZXR0ZS90ZXJtXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBNQ0FycmF5LFxyXG4gICAgTW9kZWxDb250YWluZXIsXHJcbiAgICBNdWx0aUluZGV4ZWRDb250YWluZXJcclxufSBmcm9tIFwiLi4vbW9kZWwvbW9kZWxfY29udGFpbmVyXCJcclxuXHJcbmNsYXNzIENhc2VUZW1wbGF0ZSBleHRlbmRzIENhc2Uge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIENhc2VUZW1wbGF0ZSBjb25zdHJ1Y3Rvci4gQnVpbGRzIGEgQ2FzZVRlbXBsYXRlIG9iamVjdC5cclxuICAgICovXHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50ID0gbnVsbCwgZGF0YSwgcHJlc2V0cykge1xyXG5cclxuICAgICAgICBzdXBlcihwYXJlbnQsIGRhdGEsIHByZXNldHMpO1xyXG5cclxuICAgICAgICB0aGlzLmNhc2VzID0gW107XHJcbiAgICAgICAgdGhpcy5hY3RpdmVDYXNlcyA9IFtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0gW107XHJcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy50ZXJtcyA9IFtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucmFuZ2UgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BfZWxlbWVudHMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJVcGRhdGUoKSB7XHJcblxyXG4gICAgICAgIGxldCBvdXRwdXQgPSB0aGlzLmNhc2VzLnNsaWNlKCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGwgPSB0aGlzLmZpbHRlcnMubGVuZ3RoLCBpID0gMDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBvdXRwdXQgPSB0aGlzLmZpbHRlcnNbaV0uZmlsdGVyKG91dHB1dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYWN0aXZlQ2FzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuYWN0aXZlQ2FzZXNbaV0uZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG91dHB1dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQob3V0cHV0W2ldLmVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gdGhpcy5lbGVtZW50LnN0eWxlLnBvc2l0aW9uO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG91dHB1dC5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgb3V0cHV0W2ldLnRyYW5zaXRpb25JbihpKTtcclxuXHJcbiAgICAgICAgdGhpcy5hY3RpdmVDYXNlcyA9IG91dHB1dDtcclxuICAgICAgICAvL1NvcnQgYW5kIGZpbHRlciB0aGUgb3V0cHV0IHRvIHByZXNlbnQgdGhlIHJlc3VsdHMgb24gc2NyZWVuLlxyXG4gICAgfVxyXG5cclxuICAgIGN1bGwobmV3X2l0ZW1zKSB7XHJcblxyXG4gICAgICAgIGlmIChuZXdfaXRlbXMubGVuZ3RoID09IDApIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jYXNlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2ldLmRlc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FzZXMubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBleGlzdHMgPSBuZXcgTWFwKG5ld19pdGVtcy5tYXAoZSA9PiBbZSwgdHJ1ZV0pKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBvdXQgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jYXNlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICBpZiAoIWV4aXN0cy5oYXModGhpcy5jYXNlc1tpXS5tb2RlbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2ldLmRlc3RydWN0b3IoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhc2VzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBsLS07XHJcbiAgICAgICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RzLnNldCh0aGlzLmNhc2VzW2ldLm1vZGVsLCBmYWxzZSk7XHJcblxyXG5cclxuICAgICAgICAgICAgZXhpc3RzLmZvckVhY2goKHYsIGssIG0pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh2KSBvdXQucHVzaChrKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAob3V0Lmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZGVkKG91dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvYWQobW9kZWwpIHt9XHJcblxyXG4gICAgcmVtb3ZlZChpdGVtcykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSBpdGVtc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jYXNlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IENhc2UgPSB0aGlzLmNhc2VzW2pdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChDYXNlLm1vZGVsID09IGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhc2VzLnNwbGljZShqLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBDYXNlLmRpc3NvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZmlsdGVyVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkZWQoaXRlbXMpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgQ2FzZSA9IHRoaXMudGVtcGxhdGVzWzBdLmZsZXNoKGl0ZW1zW2ldKTtcclxuICAgICAgICAgICAgQ2FzZS5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmNhc2VzLnB1c2goQ2FzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmZpbHRlclVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldmlzZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5jYWNoZSlcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5jYWNoZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldFRlcm1zKCkge1xyXG5cclxuICAgICAgICBsZXQgb3V0X3Rlcm1zID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZXJtcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIG91dF90ZXJtcy5wdXNoKHRoaXMudGVybXNbaV0udGVybSk7XHJcblxyXG5cclxuICAgICAgICBpZiAob3V0X3Rlcm1zLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dF90ZXJtcztcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGF0YSwgSU1QT1JUID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YS50b0pzb24oKSlcclxuXHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRhdGEuZ2V0Q2hhbmdlZCh0aGlzLnByb3ApO1xyXG5cclxuICAgICAgICBpZiAoSU1QT1JUKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgVVBEQVRFID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVybXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXJtc1tpXS51cGRhdGUoZGF0YSkpXHJcbiAgICAgICAgICAgICAgICAgICAgVVBEQVRFID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKFVQREFURSAmJiB0aGlzLm1vZGVsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdWxsKHRoaXMuZ2V0KCkpXHJcblxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlsdGVyc1tpXS51cGRhdGUoZGF0YSkpXHJcbiAgICAgICAgICAgICAgICAgICAgVVBEQVRFID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChVUERBVEUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlclVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb250YWluZXIgJiYgKGNvbnRhaW5lciBpbnN0YW5jZW9mIE1vZGVsQ29udGFpbmVyIHx8IGNvbnRhaW5lci5fX19fc2VsZl9fX18pKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhY2hlID0gZGF0YTtcclxuXHJcbiAgICAgICAgICAgIGxldCBvd25fY29udGFpbmVyID0gY29udGFpbmVyLmdldCh0aGlzLmdldFRlcm1zKCksIG51bGwpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG93bl9jb250YWluZXIgaW5zdGFuY2VvZiBNb2RlbENvbnRhaW5lcikge1xyXG4gICAgICAgICAgICAgICAgb3duX2NvbnRhaW5lci5waW4oKTtcclxuICAgICAgICAgICAgICAgIG93bl9jb250YWluZXIuYWRkVmlldyh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VsbCh0aGlzLmdldCgpKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG93bl9jb250YWluZXIgaW5zdGFuY2VvZiBNQ0FycmF5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1bGwob3duX2NvbnRhaW5lcilcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG93bl9jb250YWluZXIgPSBkYXRhLl9fX19zZWxmX19fXy5kYXRhW3RoaXMucHJvcF1cclxuICAgICAgICAgICAgICAgIGlmIChvd25fY29udGFpbmVyIGluc3RhbmNlb2YgTW9kZWxDb250YWluZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvd25fY29udGFpbmVyLmFkZFZpZXcodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdWxsKHRoaXMuZ2V0KCkpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLm1vZGVsIGluc3RhbmNlb2YgTXVsdGlJbmRleGVkQ29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuZGF0YS5pbmRleDtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcXVlcnkgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICBxdWVyeVtpbmRleF0gPSB0aGlzLmdldFRlcm1zKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuZ2V0KHF1ZXJ5KVtpbmRleF07XHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiTm8gaW5kZXggdmFsdWUgcHJvdmlkZWQgZm9yIE11bHRpSW5kZXhlZENvbnRhaW5lciFcIilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgc291cmNlID0gdGhpcy5tb2RlbC5zb3VyY2U7XHJcbiAgICAgICAgICAgIGxldCB0ZXJtcyA9IHRoaXMuZ2V0VGVybXMoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwuZGVzdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBtb2RlbCA9IHNvdXJjZS5nZXQodGVybXMsIG51bGwpO1xyXG5cclxuICAgICAgICAgICAgICAgIG1vZGVsLnBpbigpO1xyXG4gICAgICAgICAgICAgICAgbW9kZWwuYWRkVmlldyh0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuZ2V0KHRlcm1zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25JbihlbGVtZW50cywgd3VybCkge1xyXG5cclxuICAgICAgICBsZXQgdHJhbnNpdGlvbl90aW1lID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnRlbXBsYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgdGhpcy50ZW1wbGF0ZXNbaV0udHJhbnNpdGlvbkluKGVsZW1lbnRzLCB3dXJsKSk7XHJcblxyXG4gICAgICAgIE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgc3VwZXIudHJhbnNpdGlvbkluKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbl90aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFRha2VzIGFzIGFuIGlucHV0IGEgbGlzdCBvZiB0cmFuc2l0aW9uIG9iamVjdHMgdGhhdCBjYW4gYmUgdXNlZFxyXG4gICAgKi9cclxuICAgIHRyYW5zaXRpb25PdXQodHJhbnNpdGlvbl90aW1lID0gMCwgREVTVFJPWSA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMudGVtcGxhdGVzW2ldLnRyYW5zaXRpb25PdXQoKSk7XHJcblxyXG4gICAgICAgIE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgc3VwZXIudHJhbnNpdGlvbk91dCh0cmFuc2l0aW9uX3RpbWUsIERFU1RST1kpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25fdGltZTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBDYXNlVGVtcGxhdGVcclxufSIsImltcG9ydCB7XHJcbiAgICBMZXhcclxufSBmcm9tIFwiLi4vY29tbW9uXCJcclxuXHJcbmNsYXNzIEluZGV4ZXIge1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMubGV4ZXIgPSBuZXcgTGV4KGVsZW1lbnQuaW5uZXJIVE1MKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIHRoaXMuc3RhY2sgPSBbXTtcclxuICAgICAgICB0aGlzLnNwID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoaW5kZXgsIFJFRE8gPSBmYWxzZSkge1xyXG4gICAgICAgIGxldCBsZXggPSB0aGlzLmxleGVyO1xyXG5cclxuICAgICAgICBpZiAoUkVETykge1xyXG4gICAgICAgICAgICBsZXgucmVzZXQoKTtcclxuICAgICAgICAgICAgdGhpcy5zdGFjay5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnNwID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgIGlmICghbGV4LnRleHQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChSRURPKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldChpbmRleCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAobGV4LnRleHQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCI8XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxleC5wZWVrKCkudGV4dCA9PSBcIi9cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpOyAvLyA8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7IC8vIC9cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gdGFnbmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpOyAvLyA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKC0tdGhpcy5zcCA8IDApIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YWNrLmxlbmd0aCA9IHRoaXMuc3AgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YWNrW3RoaXMuc3BdKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gPFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpOyAvLyB0YWduYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChsZXgudGV4dCAhPT0gXCI+XCIgJiYgbGV4LnRleHQgIT09IFwiL1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpOyAvLyBhdHRyaWIgbmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxleC50ZXh0ID09IFwiPVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChsZXgubmV4dCgpLCBsZXgubmV4dCgpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZXgudGV4dCA9PSBcIi9cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKSAvLyAvIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKSAvLyA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpOyAvLyA+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5zdGFjay5wdXNoKDApLCB0aGlzLnNwKyspXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGV4LnRleHQgPT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGV4LnRleHQgPT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZXgudGV4dCA9PSBcIjpcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGV4LnR5cGUgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG51bWJlciA9IHBhcnNlSW50KGxleC50ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChudW1iZXIgPT0gaW5kZXgpIHJldHVybiB0aGlzLmdldEVsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldEVsZW1lbnQoKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNwOyBpKyspIHtcclxuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuY2hpbGRyZW5bdGhpcy5zdGFja1tpXV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG59XHJcblxyXG4vKlxyXG4gICAgQ2FzZSBza2VsZXRvblxyXG4gICAgICAgIE1vZGVsIHBvaW50ZXIgT1Igc2NoZW1hIHBvaW50ZXJcclxuICAgICAgICAgICAgSUYgc2NoZW1hLCB0aGVuIHRoZSBza2VsZXRvbiB3aWxsIGNyZWF0ZSBhIG5ldyBNb2RlbCB3aGVuIGl0IGlzIGNvcGllZCwgVU5MRVNTIGEgbW9kZWwgaXMgZ2l2ZW4gdG8gdGhlIHNrZWxldG9uIGNvcHkgQ29uc3RydWN0b3IuIFxyXG4gICAgICAgICAgICBPdGhlciB3aXNlLCB0aGUgc2tlbGV0b24gd2lsbCBhdXRvbWF0aWNhbGx5IGFzc2lnbiB0aGUgTW9kZWwgdG8gdGhlIGNhc2Ugb2JqZWN0LiBcclxuXHJcbiAgICAgICAgVGhlIG1vZGVsIHdpbGwgYXV0b21hdGljYWxseSBjb3B5IGl0J3MgZWxlbWVudCBkYXRhIGludG8gdGhlIGNvcHksIHppcHBpbmcgdGhlIGRhdGEgZG93biBhcyB0aGUgQ29uc3RydWN0b3IgYnVpbGRzIHRoZSBDYXNlJ3MgY2hpbGRyZW4uXHJcblxyXG4qL1xyXG5leHBvcnQgY2xhc3MgQ2FzZVNrZWxldG9uIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBjb25zdHJ1Y3RvciwgZGF0YSwgcHJlc2V0cywgaW5kZXgpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIHRoaXMuQ29uc3RydWN0b3IgPSBjb25zdHJ1Y3RvcjtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmZpbHRlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLnRlcm1zID0gW107XHJcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICB0aGlzLnByZXNldHMgPSBwcmVzZXRzO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgIFxyXG4gICAgKi9cclxuICAgIGZsZXNoKE1vZGVsID0gbnVsbCkge1xyXG4gICAgICAgIGxldCBDYXNlID0gdGhpcy5fX19fY29weV9fX18obnVsbCwgbnVsbCwgbnVsbCk7XHJcblxyXG4gICAgICAgIENhc2UubG9hZChNb2RlbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBDYXNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIENvbnN0cnVjdHMgYSBuZXcgb2JqZWN0LCBhdHRhY2hpbmcgdG8gZWxlbWVudHMgaG9zdGVkIGJ5IGEgY2FzZS4gSWYgdGhlIGNvbXBvbmVudCB0byBjb25zdHJ1Y3QgaXMgYSBDYXNlLCB0aGVuIHRoZSBcclxuICAgICAgICBwYXJlbnRfZWxlbWVudCBnZXRzIHN3YXBwZWQgb3V0IGJ5IGEgY2xvbmVkIGVsZW1lbnQgdGhhdCBpcyBob3N0ZWQgYnkgdGhlIG5ld2x5IGNvbnN0cnVjdGVkIENhc2UuXHJcbiAgICAqL1xyXG4gICAgX19fX2NvcHlfX19fKHBhcmVudF9lbGVtZW50LCBwYXJlbnQsIGluZGV4ZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IGVsZW1lbnQsIENMQUlNRURfRUxFTUVOVCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pbmRleCA+IDApIHtcclxuICAgICAgICAgICAgZWxlbWVudCA9IGluZGV4ZXIuZ2V0KHRoaXMuaW5kZXgpXHJcbiAgICAgICAgICAgIENMQUlNRURfRUxFTUVOVCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHBhcmVudF9lbGVtZW50ID0gdGhpcy5lbGVtZW50LmNsb25lTm9kZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRfZWxlbWVudC5wYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRfZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlcGxhY2VOb2RlKHBhcmVudF9lbGVtZW50LCBlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGluZGV4ZXIgPSBuZXcgSW5kZXhlcihwYXJlbnRfZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgb3V0X29iamVjdDtcclxuICAgICAgICBpZiAodGhpcy5Db25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICBvdXRfb2JqZWN0ID0gbmV3IHRoaXMuQ29uc3RydWN0b3IocGFyZW50LCB0aGlzLmRhdGEsIHRoaXMucHJlc2V0cyk7XHJcbiAgICAgICAgICAgIGlmIChDTEFJTUVEX0VMRU1FTlQpXHJcbiAgICAgICAgICAgICAgICBvdXRfb2JqZWN0LmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIXBhcmVudCkge1xyXG4gICAgICAgICAgICBvdXRfb2JqZWN0ID0gdGhpcy5jaGlsZHJlblswXS5fX19fY29weV9fX18ocGFyZW50X2VsZW1lbnQsIG51bGwsIGluZGV4ZXIpO1xyXG4gICAgICAgICAgICBvdXRfb2JqZWN0LmVsZW1lbnQgPSBwYXJlbnRfZWxlbWVudDtcclxuICAgICAgICAgICAgcmV0dXJuIG91dF9vYmplY3Q7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIG91dF9vYmplY3QgPSBwYXJlbnQ7XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5fX19fY29weV9fX18ocGFyZW50X2VsZW1lbnQsIG91dF9vYmplY3QsIGluZGV4ZXIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXMubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudGVybXMubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy50ZXJtcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0X29iamVjdC50ZXJtcy5wdXNoKHRoaXMudGVybXNbaV0uX19fX2NvcHlfX19fKHBhcmVudF9lbGVtZW50LCBudWxsLCBpbmRleGVyKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0X29iamVjdC5maWx0ZXJzLnB1c2godGhpcy5maWx0ZXJzW2ldLl9fX19jb3B5X19fXyhwYXJlbnRfZWxlbWVudCwgbnVsbCwgaW5kZXhlcikpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLnRlbXBsYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICBvdXRfb2JqZWN0LnRlbXBsYXRlcy5wdXNoKHRoaXMudGVtcGxhdGVzW2ldKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfb2JqZWN0O1xyXG4gICAgfVxyXG59IiwibGV0IEdMT0JBTCA9ICgoKT0+e1xyXG5cdGxldCBsaW5rZXIgPSBudWxsO1xyXG5cdHJldHVybiB7XHJcblx0XHRnZXQgbGlua2VyKCl7XHJcblx0XHRcdHJldHVybiBsaW5rZXI7XHJcblx0XHR9LFxyXG5cdFx0c2V0IGxpbmtlcihsKXtcclxuXHRcdFx0aWYoIWxpbmtlcilcclxuXHRcdFx0XHRsaW5rZXIgPSBsO1xyXG5cdFx0fVxyXG5cdH1cclxufSlcclxuXHJcbmV4cG9ydCB7R0xPQkFMfSIsImltcG9ydCB7XHJcbiAgICBDYXNzZXR0ZVxyXG59IGZyb20gXCIuL2Nhc3NldHRlXCJcclxuXHJcbmNsYXNzIElucHV0IGV4dGVuZHMgQ2Fzc2V0dGUge1xyXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBlbGVtZW50LCBkLCBwKSB7XHJcbiAgICAgICAgLy9TY2FuIHRoZSBlbGVtZW50IGFuZCBsb29rIGZvciBpbnB1dHMgdGhhdCBjYW4gYmUgbWFwcGVkIHRvIHRoZVxyXG4gICAgICAgIHN1cGVyKHBhcmVudCwgZWxlbWVudCwgZCwgcCk7XHJcblxyXG4gICAgICAgIC8vSW5wdXRzIGluIGZvcm1zIGFyZSBhdXRvbWF0aWNhbGx5IGhpZGRlbi5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7fVxyXG4gICAgICAgICAgICBkYXRhW3RoaXMucHJvcF0gPSB0aGlzLmVsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkKGRhdGEpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhW3RoaXMucHJvcF0pIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy52YWwgPSBkYXRhW3RoaXMucHJvcF07XHJcblxyXG4gICAgICAgIHN3aXRjaCAodGhpcy5lbGVtZW50LnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImRhdGVcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC52YWx1ZSA9IChuZXcgRGF0ZShwYXJzZUludChkYXRhW3RoaXMucHJvcF0pKSkudG9JU09TdHJpbmcoKS5zcGxpdChcIlRcIilbMF07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInRpbWVcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC52YWx1ZSA9IGAkeyhcIjAwXCIrKGRhdGFbdGhpcy5wcm9wXSB8IDApKS5zbGljZSgtMil9OiR7KFwiMDBcIisoKGRhdGFbdGhpcy5wcm9wXSUxKSo2MCkpLnNsaWNlKC0yKX06MDAuMDAwYDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidGV4dFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnZhbHVlID0gKGRhdGFbdGhpcy5wcm9wXSAhPSB1bmRlZmluZWQpID8gZGF0YVt0aGlzLnByb3BdIDogXCJcIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0ID0gdGhpcy5lbGVtZW50LmNsYXNzTGlzdFswXTtcclxuXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibW9kdWxvX3RpbWVcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRpbWUgPSBkYXRhW3RoaXMucHJvcF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBJU19QTSA9ICh0aW1lIC8gMTIgPiAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1pbnV0ZXMgPSAoKHRpbWUgJSAxKSAqIDYwKSB8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBob3VycyA9ICgoKHRpbWUgfCAwKSAlIDEyKSAhPSAwKSA/ICh0aW1lIHwgMCkgJSAxMiA6IDEyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnZhbHVlID0gKGhvdXJzICsgXCI6XCIgKyAoXCIwXCIgKyBtaW51dGVzKS5zbGljZSgtMikpICsgKChJU19QTSkgPyBcIiBQTVwiIDogXCIgQU1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudmFsdWUgPSAoZGF0YVt0aGlzLnByb3BdICE9IHVuZGVmaW5lZCkgPyBkYXRhW3RoaXMucHJvcF0gOiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgSW5wdXRcclxufSIsImltcG9ydCB7XHJcbiAgICBHTE9CQUxcclxufSBmcm9tIFwiLi4vLi4vZ2xvYmFsXCJcclxuaW1wb3J0IHtcclxuICAgIElucHV0XHJcbn0gZnJvbSBcIi4vaW5wdXRcIlxyXG5pbXBvcnQge1xyXG4gICAgQ2Fzc2V0dGVcclxufSBmcm9tIFwiLi9jYXNzZXR0ZVwiXHJcblxyXG5jbGFzcyBGb3JtIGV4dGVuZHMgQ2Fzc2V0dGUge1xyXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBlbGVtZW50LCBkLCBwKSB7XHJcbiAgICAgICAgLy9TY2FuIHRoZSBlbGVtZW50IGFuZCBsb29rIGZvciBpbnB1dHMgdGhhdCBjYW4gYmUgbWFwcGVkIHRvIHRoZSBcclxuICAgICAgICBzdXBlcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApO1xyXG5cclxuICAgICAgICB0aGlzLnN1Ym1pdHRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc2NoZW1hID0gbnVsbDtcclxuXHJcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LCB0aGlzLCBwYXJlbnQpXHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3VibWl0dGVkKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdWJtaXQoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3VibWl0dGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFjY2VwdGVkKHJlc3VsdCkge1xyXG4gICAgICAgIHJlc3VsdC50ZXh0KCkudGhlbigoZSkgPT4ge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlclxyXG4gICAgICAgICAgICBHTE9CQUwubGlua2VyLmxvYWRQYWdlKFxyXG4gICAgICAgICAgICAgICAgR0xPQkFMLmxpbmtlci5sb2FkTmV3UGFnZShyZXN1bHQudXJsLCAobmV3IERPTVBhcnNlcigpKS5wYXJzZUZyb21TdHJpbmcoZSwgXCJ0ZXh0L2h0bWxcIikpLFxyXG4gICAgICAgICAgICAgICAgZmFsc2VcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHJlamVjdGVkKHJlc3VsdCkge1xyXG4gICAgICAgIHJlc3VsdC50ZXh0KCkudGhlbigoZSkgPT4ge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlclxyXG4gICAgICAgICAgICBHTE9CQUwubGlua2VyLmxvYWRQYWdlKFxyXG4gICAgICAgICAgICAgICAgR0xPQkFMLmxpbmtlci5sb2FkTmV3UGFnZShyZXN1bHQudXJsLCAobmV3IERPTVBhcnNlcigpKS5wYXJzZUZyb21TdHJpbmcoZSwgXCJ0ZXh0L2h0bWxcIikpLFxyXG4gICAgICAgICAgICAgICAgZmFsc2VcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGxvYWQobW9kZWwpIHtcclxuXHJcbiAgICAgICAgaWYgKG1vZGVsKVxyXG4gICAgICAgICAgICB0aGlzLnNjaGVtYSA9IG1vZGVsLnNjaGVtYTtcclxuXHJcbiAgICAgICAgc3VwZXIubG9hZChtb2RlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3VibWl0KCkge1xyXG5cclxuICAgICAgICBsZXQgdXJsID0gdGhpcy5lbGVtZW50LmFjdGlvbjtcclxuXHJcbiAgICAgICAgdmFyIGZvcm1fZGF0YSA9IChuZXcgRm9ybURhdGEodGhpcy5lbGVtZW50KSk7XHJcbiAgICAgICAgaWYgKHRoaXMuc2NoZW1hKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgSW5wdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGNoaWxkLmVsZW1lbnQubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcCA9IGNoaWxkLnByb3A7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNjaGVtZSA9IHRoaXMuc2NoZW1hW3Byb3BdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY2hlbWUgJiYgcHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsID0gc2NoZW1lLnN0cmluZyhjaGlsZC52YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtX2RhdGEuc2V0KG5hbWUsIHZhbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJvcCwgbmFtZSwgdmFsLCBjaGlsZC52YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGVidWdnZXJcclxuICAgICAgICBmZXRjaCh1cmwsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcInBvc3RcIixcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICAgICAgYm9keTogZm9ybV9kYXRhLFxyXG4gICAgICAgIH0pLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgIT0gMjAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWplY3RlZChyZXN1bHQpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY2VwdGVkKHJlc3VsdClcclxuXHJcbiAgICAgICAgfSkuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZWplY3RlZChlKTtcclxuICAgICAgICB9KVxyXG5cclxuXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiV2ljayBGb3JtIFN1Ym1pdHRlZFwiLCB1cmwsIGZvcm1fZGF0YSlcclxuXHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgRm9ybVxyXG59IiwiaW1wb3J0IHtcclxuICAgIFJpdmV0XHJcbn0gZnJvbSBcIi4uL3JpdmV0XCJcclxuZXhwb3J0IGNsYXNzIFRhcCBleHRlbmRzIFJpdmV0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIGRhdGEsIHByZXNldHMpIHtcclxuICAgICAgICBzdXBlcihwYXJlbnQsIGRhdGEsIHByZXNldHMpO1xyXG4gICAgICAgIHRoaXMucHJvcCA9IGRhdGEucHJvcDtcclxuICAgIH1cclxuXHJcbiAgICBkb3duKGRhdGEsIGNoYW5nZWRfcHJvcGVydGllcyA9IG51bGwsIGltcG9ydGVkKSB7XHJcbiAgICAgICAgaWYgKGNoYW5nZWRfcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNoYW5nZWRfcHJvcGVydGllcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGFuZ2VkX3Byb3BlcnRpZXNbaV0gPT0gdGhpcy5wcm9wKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhW3RoaXMucHJvcF0gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IGRhdGFbdGhpcy5wcm9wXSB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gbCAtIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZGF0YVt0aGlzLnByb3BdICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogZGF0YVt0aGlzLnByb3BdIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgU2VlIERlZmluaXRpb24gaW4gUml2ZXQgXHJcbiAgXHQqL1xyXG4gICAgX19kb3duX18oZGF0YSwgY2hhbmdlZF9wcm9wZXJ0aWVzID0gbnVsbCwgSU1QT1JURUQgPSBmYWxzZSkge1xyXG4gICAgICAgIGxldCByX3ZhbCA9IHRoaXMuZG93bihkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMsIElNUE9SVEVEKTtcclxuICAgICAgICBpZiAocl92YWwpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLl9fZG93bl9fKHJfdmFsLCBbdGhpcy5wcm9wXSwgSU1QT1JURUQpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwKGRhdGEpIHtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEudmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBsZXQgb3V0ID0ge307XHJcbiAgICAgICAgICAgIG91dFt0aGlzLnByb3BdID0gZGF0YS52YWx1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtcclxuICAgIFJpdmV0XHJcbn0gZnJvbSBcIi4uL3JpdmV0XCJcclxuZXhwb3J0IGNsYXNzIFBpcGUgZXh0ZW5kcyBSaXZldCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBkYXRhLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBkYXRhLCBwcmVzZXRzKTtcclxuICAgIH1cclxuXHJcbiAgICBkb3duKGRhdGEpe1xyXG4gICAgXHRyZXR1cm4ge3ZhbHVlOmA8Yj4ke2RhdGEudmFsdWV9PC9iPmB9XHJcbiAgICB9XHJcbn1cclxuXHJcblBpcGUuQUREU19UQUdTID0gdHJ1ZTtcclxuUGlwZS5DQU5fQkVfU1RBVElDID0gdHJ1ZTsiLCJpbXBvcnQge1xyXG4gICAgUml2ZXRcclxufSBmcm9tIFwiLi4vcml2ZXRcIlxyXG5cclxuZXhwb3J0IGNsYXNzIElPIGV4dGVuZHMgUml2ZXR7XHJcblx0Y29uc3RydWN0b3IocGFyZW50LCBkYXRhLCBwcmVzZXRzKXtcclxuXHRcdHN1cGVyKHBhcmVudCwgZGF0YSwgcHJlc2V0cylcclxuXHRcdHRoaXMucHJvcCA9IGRhdGEucHJvcFxyXG5cdH1cclxuXHJcblx0ZG93bihkYXRhKXtcclxuXHRcdGNvbnNvbGUubG9nKGRhdGEpXHJcblx0XHR0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gZGF0YS52YWx1ZTtcclxuXHR9XHJcbn0iLCIvKlxyXG4gICAgQm9yaW5nIENhc2Ugc3R1ZmZcclxuKi9cclxuaW1wb3J0IHtcclxuICAgIENhc2UsXHJcbn0gZnJvbSBcIi4vY2FzZVwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQ2FzZVRlbXBsYXRlXHJcbn0gZnJvbSBcIi4vY2FzZV90ZW1wbGF0ZVwiXHJcbmltcG9ydCB7XHJcbiAgICBDYXNlU2tlbGV0b25cclxufSBmcm9tIFwiLi9jYXNlX3NrZWxldG9uXCJcclxuLyogXHJcbiAgICBDYXNzZXR0ZXNcclxuKi9cclxuaW1wb3J0IHtcclxuICAgIEZpbHRlckxpbWl0XHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZmlsdGVyX2xpbWl0XCJcclxuaW1wb3J0IHtcclxuICAgIENhc3NldHRlLFxyXG4gICAgQ2xvc2VDYXNzZXR0ZVxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2Nhc3NldHRlXCJcclxuaW1wb3J0IHtcclxuICAgIEZvcm1cclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9mb3JtXCJcclxuaW1wb3J0IHtcclxuICAgIElucHV0XHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvaW5wdXRcIlxyXG5pbXBvcnQge1xyXG4gICAgRmlsdGVyXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZmlsdGVyXCJcclxuaW1wb3J0IHtcclxuICAgIFRlcm1cclxufSBmcm9tIFwiLi9jYXNzZXR0ZS90ZXJtXCJcclxuaW1wb3J0IHtcclxuICAgIEV4cG9ydGVyXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZXhwb3J0ZXJcIlxyXG5pbXBvcnQge1xyXG4gICAgSW1wb3J0UXVlcnlcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9pbXBvcnRfcXVlcnlcIlxyXG5pbXBvcnQge1xyXG4gICAgRGF0YUVkaXRcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9kYXRhX2VkaXRcIlxyXG5pbXBvcnQge1xyXG4gICAgRXhpc3RzLFxyXG4gICAgTm90RXhpc3RzXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZXhpc3RzXCJcclxuaW1wb3J0IHtcclxuICAgIEVwb2NoRGF5LFxyXG4gICAgRXBvY2hUaW1lLFxyXG4gICAgRXBvY2hEYXRlLFxyXG4gICAgRXBvY2hNb250aCxcclxuICAgIEVwb2NoWWVhcixcclxuICAgIEVwb2NoVG9EYXRlVGltZVxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2Vwb2NoXCJcclxuXHJcbmxldCBQcmVzZXRDYXNzZXR0ZXMgPSB7XHJcbiAgICByYXc6IENhc3NldHRlLFxyXG4gICAgY2Fzc2V0dGU6IENhc3NldHRlLFxyXG4gICAgZm9ybTogRm9ybSxcclxuICAgIGlucHV0OiBJbnB1dCxcclxuICAgIGV4cG9ydDogRXhwb3J0ZXIsXHJcbiAgICBpcXVlcnk6IEltcG9ydFF1ZXJ5LFxyXG4gICAgZWR0OiBFcG9jaFRvRGF0ZVRpbWUsXHJcbiAgICBldGltZTogRXBvY2hUaW1lLFxyXG4gICAgZWRheTogRXBvY2hEYXksXHJcbiAgICBlZGF0ZTogRXBvY2hEYXRlLFxyXG4gICAgZXllYXI6IEVwb2NoWWVhcixcclxuICAgIGVtb250aDogRXBvY2hNb250aCxcclxuICAgIGV4aXN0czogRXhpc3RzLFxyXG4gICAgbm90X2V4aXN0czogTm90RXhpc3RzLFxyXG4gICAgZGF0YV9lZGl0OiBEYXRhRWRpdCxcclxuICAgIHRlcm06IFRlcm0sXHJcbiAgICBsaW1pdDogRmlsdGVyTGltaXRcclxufVxyXG5cclxuaW1wb3J0IHsgVGFwIH0gZnJvbSBcIi4vdGFwcy90YXBcIlxyXG5pbXBvcnQgeyBQaXBlIH0gZnJvbSBcIi4vcGlwZXMvcGlwZVwiXHJcbmltcG9ydCB7IElPIH0gZnJvbSBcIi4vaW8vaW9cIlxyXG5cclxuZXhwb3J0IGNsYXNzIFJvb3Qge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5odG1sID0gXCJcIjtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgdGhpcy50YWdfaW5kZXggPSAxO1xyXG4gICAgfTtcclxuXHJcbiAgICBhZGRDaGlsZChjaGlsZCkge1xyXG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RTa2VsZXRvbihwcmVzZXRzKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLmh0bWw7XHJcbiAgICAgICAgbGV0IHJvb3Rfc2tlbGV0b24gPSBuZXcgQ2FzZVNrZWxldG9uKGVsZW1lbnQpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uY29uc3RydWN0U2tlbGV0b24ocm9vdF9za2VsZXRvbiwgcHJlc2V0cyk7XHJcbiAgICAgICAgcmV0dXJuIHJvb3Rfc2tlbGV0b247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SW5kZXgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFnX2luZGV4Kys7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiB0aGlzLmNoaWxkcmVuLFxyXG4gICAgICAgICAgICBodG1sOiB0aGlzLmh0bWxcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb2Zmc2V0KGluY3JlYXNlID0gMCkge1xyXG4gICAgICAgIGxldCBvdXQgPSB0aGlzLnRhZ19jb3VudDtcclxuICAgICAgICB0aGlzLnRhZ19jb3VudCArPSBpbmNyZWFzZTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR2VuZXJpY05vZGUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCkge1xyXG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnRhZ25hbWUgPSB0YWduYW1lO1xyXG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMgfHwge307XHJcbiAgICAgICAgdGhpcy5JU19OVUxMID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5DT05TVU1FU19UQUcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuQ09OU1VNRVNfU0FNRSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICB0aGlzLnByb3BfbmFtZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5odG1sID0gXCJcIjtcclxuICAgICAgICB0aGlzLm9wZW5fdGFnID0gXCJcIjtcclxuICAgICAgICB0aGlzLmNsb3NlX3RhZyA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy50YWdfaW5kZXggPSAwO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSAwO1xyXG4gICAgICAgIGlmIChwYXJlbnQpXHJcbiAgICAgICAgICAgIHBhcmVudC5hZGRDaGlsZCh0aGlzKTtcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBmaW5hbGl6ZShjdHgpIHtcclxuICAgICAgICBjdHguaHRtbCArPSB0aGlzLm9wZW5fdGFnICsgdGhpcy5odG1sICsgdGhpcy5jbG9zZV90YWc7XHJcbiAgICB9XHJcblxyXG4gICAgcmVwbGFjZUNoaWxkKGNoaWxkLCBuZXdfY2hpbGQpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoaWxkcmVuW2ldID09IGNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldID0gbmV3X2NoaWxkO1xyXG4gICAgICAgICAgICAgICAgbmV3X2NoaWxkLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVDaGlsZChjaGlsZCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW5baV0gPT0gY2hpbGQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5zcGxpY2UoaSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ2hpbGQoY2hpbGQpIHtcclxuXHJcbiAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgVGFwTm9kZSAmJiAhKHRoaXMgaW5zdGFuY2VvZiBDYXNlTm9kZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmFkZENoaWxkKGNoaWxkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZUF0dHJpYnV0ZXMoKSB7XHJcbiAgICAgICAgbGV0IG91dCA9IHt9O1xyXG4gICAgICAgIG91dC5wcm9wID0gdGhpcy5wcm9wX25hbWU7XHJcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUHJvcChsZXhlciwgcHJvcF9uYW1lLCBwYXJzZUZ1bmN0aW9uLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvcF9uYW1lICE9PSBwcm9wX25hbWUpXHJcbiAgICAgICAgICAgIHRoaXMuc3BsaXQobmV3IElPTm9kZShwcm9wX25hbWUsIHRoaXMuYXR0cmlidXRlcywgbnVsbCwgdGhpcywgdGhpcy5nZXRJbmRleCgpKSwgcHJvcF9uYW1lKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG5ldyBJT05vZGUocHJvcF9uYW1lLCB0aGlzLmF0dHJpYnV0ZXMsIHRoaXMsIHRoaXMsIHRoaXMuZ2V0SW5kZXgoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiB0aGlzLmNoaWxkcmVuLFxyXG4gICAgICAgICAgICB0YWduYW1lOiB0aGlzLnRhZ25hbWUsXHJcbiAgICAgICAgICAgIHRhZ19jb3VudDogdGhpcy50YWdfY291bnQsXHJcbiAgICAgICAgICAgIHRhZzogeyBvcGVuX3RhZzogdGhpcy5vcGVuX3RhZywgY2xvc2VfdGFnOiB0aGlzLmNsb3NlX3RhZyB9LFxyXG4gICAgICAgICAgICBodG1sOiB0aGlzLmh0bWwsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNwbGl0KG5vZGUsIHByb3BfbmFtZSkge1xyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BfbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BfbmFtZSA9PSB0aGlzLnByb3BfbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy50YWduYW1lLCB0aGlzLmF0dHJpYnV0ZXMsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHIuQ09OU1VNRVNfU0FNRSA9IChyLkNPTlNVTUVTX1RBRykgPyAoIShyLkNPTlNVTUVTX1RBRyA9ICExKSkgOiAhMTtcclxuICAgICAgICAgICAgICAgICAgICByLnByb3BfbmFtZSA9IHByb3BfbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICByLmFkZENoaWxkKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5zcGxpdChyLCBwcm9wX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChub2RlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvcF9uYW1lID0gcHJvcF9uYW1lO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuc3BsaXQodGhpcywgcHJvcF9uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BfbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BfbmFtZSA9PSB0aGlzLnByb3BfbmFtZSkge30gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnRhZ25hbWUsIHRoaXMuYXR0cmlidXRlcywgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgci5wcm9wX25hbWUgPSBwcm9wX25hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnNwbGl0KHIsIHByb3BfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5zcGxpdCh0aGlzLCBwcm9wX25hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBnZXRJbmRleCgpIHtcclxuICAgICAgICBpZih0aGlzLnRhZ19pbmRleCA+IDApIHJldHVybiB0aGlzLnRhZ19pbmRleCsrO1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkgcmV0dXJuIHRoaXMucGFyZW50LmdldEluZGV4KCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0U2tlbGV0b24ocGFyZW50X3NrZWxldG9uLCBwcmVzZXRzKSB7XHJcblxyXG4gICAgICAgIGxldCBza2VsZXRvbiA9IHRoaXMuY3JlYXRlU2tlbGV0b25Db25zdHJ1Y3RvcihwcmVzZXRzKTtcclxuXHJcbiAgICAgICAgcGFyZW50X3NrZWxldG9uLmNoaWxkcmVuLnB1c2goc2tlbGV0b24pXHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5jb25zdHJ1Y3RTa2VsZXRvbihza2VsZXRvbiwgcHJlc2V0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlU2tlbGV0b25Db25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcbiAgICAgICAgbGV0IHNrZWxldG9uID0gbmV3IENhc2VTa2VsZXRvbih0aGlzLmdldEVsZW1lbnQoKSwgdGhpcy5nZXRDb25zdHJ1Y3RvcihwcmVzZXRzKSwgdGhpcy5wYXJzZUF0dHJpYnV0ZXMoKSwgcHJlc2V0cywgdGhpcy5pbmRleCk7XHJcbiAgICAgICAgcmV0dXJuIHNrZWxldG9uO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEVsZW1lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDYXNlTm9kZSBleHRlbmRzIEdlbmVyaWNOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCkge1xyXG4gICAgICAgIHN1cGVyKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGZpbmFsaXplKGN0eCkge1xyXG4gICAgICAgIGN0eC5odG1sICs9IHRoaXMuaHRtbDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQcm9wKGxleGVyLCBwcm9wX25hbWUsIHBhcnNlRnVuY3Rpb24sIHByZXNldHMpIHtcclxuICAgICAgICBpZiAobGV4ZXIudGV4dCA9PSBcIihcIiAmJiBsZXhlci5wZWVrKCkudGV4dCA9PSBcIihcIikge1xyXG4gICAgICAgICAgICBsZXhlci5hc3NlcnQoXCIoXCIpO1xyXG4gICAgICAgICAgICBsZXhlci5hc3NlcnQoXCIoXCIpO1xyXG4gICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBuZXcgVGVtcGxhdGVOb2RlKFwibGlzdFwiLCB0aGlzLmF0dHJpYnV0ZXMsIHRoaXMsIHRoaXMpO1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZS5wYXJzZShsZXhlciwgcGFyc2VGdW5jdGlvbiwgcHJlc2V0cyk7XHJcbiAgICAgICAgICAgIGxleGVyLmFzc2VydChcIilcIik7XHJcbiAgICAgICAgICAgIGxldCBvdXQgPSBsZXhlci5wb3MgKyAxO1xyXG4gICAgICAgICAgICBsZXhlci5hc3NlcnQoXCIpXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRDb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICByZXR1cm4gQ2FzZTtcclxuICAgIH1cclxuXHJcbiAgICBzcGxpdChub2RlLCBwcm9wX25hbWUpIHtcclxuICAgICAgICBpZiAobm9kZSkgdGhpcy5hZGRDaGlsZChub2RlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlTm9kZSBleHRlbmRzIEdlbmVyaWNOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCwgY3R4KSB7XHJcbiAgICAgICAgc3VwZXIodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5nZXRJbmRleCgpO1xyXG4gICAgICAgIGN0eC5odG1sICs9IGA8bGlzdD4jIzoke3RoaXMuaW5kZXh9PC9saXN0PmBcclxuICAgICAgICB0aGlzLmZpbHRlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLnRlcm1zID0gW107XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSBbXTtcclxuICAgIH07XHJcblxyXG4gICAgYWRkQ2hpbGQoY2hpbGQpIHtcclxuICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBGaWx0ZXJOb2RlKVxyXG4gICAgICAgICAgICB0aGlzLmZpbHRlcnMucHVzaChjaGlsZCk7XHJcbiAgICAgICAgZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUZXJtTm9kZSlcclxuICAgICAgICAgICAgdGhpcy50ZXJtcy5wdXNoKGNoaWxkKTtcclxuICAgICAgICBlbHNlIGlmIChjaGlsZCBpbnN0YW5jZW9mIENhc2VOb2RlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRlbXBsYXRlcy5sZW5ndGggPiAwKSB0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IG9uZSBDYXNlIGFsbG93ZWQgaW4gYSBUZW1wbGF0ZS5cIik7XHJcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzLnB1c2goY2hpbGQpO1xyXG4gICAgICAgICAgICBjaGlsZC50YWdfaW5kZXggPSAxO1xyXG4gICAgICAgICAgICB0aGlzLmh0bWwgPSBjaGlsZC5odG1sO1xyXG4gICAgICAgIH0gZWxzZSB0aHJvdyBuZXcgRXJyb3IoXCJUZW1wbGF0ZXMgb25seSBzdXBwb3J0IEZpbHRlciwgVGVybSBvciBDYXNlIGVsZW1lbnRzLlwiKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdFNrZWxldG9uKHBhcmVudF9za2VsZXRvbiwgcHJlc2V0cykge1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IHRoaXMuaHRtbDtcclxuICAgICAgICBsZXQgc2tlbGV0b24gPSBuZXcgQ2FzZVNrZWxldG9uKHRoaXMuZ2V0RWxlbWVudCgpLCBDYXNlVGVtcGxhdGUsIHRoaXMucGFyc2VBdHRyaWJ1dGVzKCksIHByZXNldHMsIHRoaXMuaW5kZXgpO1xyXG4gICAgICAgIHNrZWxldG9uLmZpbHRlcnMgPSB0aGlzLmZpbHRlcnMubWFwKChmaWx0ZXIpID0+IGZpbHRlci5jcmVhdGVTa2VsZXRvbkNvbnN0cnVjdG9yKHByZXNldHMpKVxyXG4gICAgICAgIHNrZWxldG9uLnRlcm1zID0gdGhpcy50ZXJtcy5tYXAoKHRlcm0pID0+IHRlcm0uY3JlYXRlU2tlbGV0b25Db25zdHJ1Y3RvcihwcmVzZXRzKSlcclxuICAgICAgICBza2VsZXRvbi50ZW1wbGF0ZXMgPSB0aGlzLnRlbXBsYXRlcy5tYXAoKHRlbXBsYXRlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBza2wgPSB0ZW1wbGF0ZS5jcmVhdGVTa2VsZXRvbkNvbnN0cnVjdG9yKHByZXNldHMpO1xyXG4gICAgICAgICAgICBza2wuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHJldHVybiBza2w7XHJcbiAgICAgICAgfSlcclxuICAgICAgICBwYXJlbnRfc2tlbGV0b24uY2hpbGRyZW4ucHVzaChza2VsZXRvbilcclxuICAgIH1cclxuXHJcbiAgICBnZXRFbGVtZW50KCkge1xyXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlzdFwiKTtcclxuICAgICAgICByZXR1cm4gZGl2O1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFByb3AobGV4ZXIsIHByb3BfbmFtZSwgcGFyc2VGdW5jdGlvbiwgcHJlc2V0cykge1xyXG4gICAgICAgIC8vY3R4Lmh0bWwgKz0gcHJvcF9uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlKGxleGVyLCBwYXJzZUZ1bmN0aW9uLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHsgaHRtbDogXCJcIiB9O1xyXG4gICAgICAgIGxldCByb290ID0gbmV3IFJvb3QoKTtcclxuICAgICAgICB3aGlsZSAobGV4ZXIudGV4dCAhPT0gXCIpXCIgJiYgbGV4ZXIucGVlaygpLnRleHQgIT09IFwiKVwiKSB7XHJcbiAgICAgICAgICAgIGlmICghbGV4ZXIudGV4dCkgdGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCBlbmQgb2YgT3V0cHV0LiBNaXNzaW5nICcpKScgXCIpO1xyXG4gICAgICAgICAgICBsZXQgb3V0ID0gcGFyc2VGdW5jdGlvbihsZXhlciwgdGhpcywgcHJlc2V0cyk7XHJcbiAgICAgICAgICAgIGlmIChvdXQgaW5zdGFuY2VvZiBDYXNlTm9kZSlcclxuICAgICAgICAgICAgICAgIHRoaXMuaHRtbCA9IG91dC5odG1sO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzcGxpdChub2RlLCBwcm9wX25hbWUpIHtcclxuXHJcbiAgICAgICAgaWYgKG5vZGUpXHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQobm9kZSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnRhZ19jb3VudDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRhcE5vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpIHtcclxuICAgICAgICBzdXBlcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmaW5hbGl6ZShjdHgpIHtcclxuICAgICAgICBjdHguaHRtbCArPSB0aGlzLmh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29uc3RydWN0b3IocHJlc2V0cykge1xyXG4gICAgICAgIHJldHVybiBUYXA7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRmlsdGVyTm9kZSBleHRlbmRzIEdlbmVyaWNOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCkge1xyXG4gICAgICAgIHN1cGVyKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICAgICAgdGhpcy5DT05TVU1FU19UQUcgPSBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgZmluYWxpemUoY3R4KSB7fVxyXG5cclxuICAgIGdldENvbnN0cnVjdG9yKHByZXNldHMpIHtcclxuICAgICAgICByZXR1cm4gVGFwO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFByb3AobGV4ZXIsIHByb3BfbmFtZSwgcGFyc2VGdW5jdGlvbiwgcHJlc2V0cykge1xyXG4gICAgICAgIHRoaXMuYXR0cmlidXRlcy5wcm9wID0gcHJvcF9uYW1lO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFRlcm1Ob2RlIGV4dGVuZHMgR2VuZXJpY05vZGUge1xyXG4gICAgY29uc3RydWN0b3IodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgIH07XHJcblxyXG4gICAgZmluYWxpemUoY3R4KSB7fVxyXG5cclxuICAgIGdldENvbnN0cnVjdG9yKHByZXNldHMpIHtcclxuICAgICAgICByZXR1cm4gVGFwO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFByb3AobGV4ZXIsIHByb3BfbmFtZSwgcGFyc2VGdW5jdGlvbiwgcHJlc2V0cykge1xyXG4gICAgICAgIHRoaXMuYXR0cmlidXRlcy5wcm9wID0gcHJvcF9uYW1lO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBQaXBlTm9kZSBleHRlbmRzIEdlbmVyaWNOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCkge1xyXG4gICAgICAgIHN1cGVyKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGZpbmFsaXplKGN0eCwgcHJlc2V0cykge1xyXG4gICAgICAgIGN0eC5odG1sICs9IHRoaXMuaHRtbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDb25zdHJ1Y3RvcihwcmVzZXRzLCBmaW5hbGl6aW5nID0gZmFsc2UpIHtcclxuICAgICAgICBsZXQgY29uc3RydWN0b3IgPSBQaXBlO1xyXG4gICAgICAgIHJldHVybiBjb25zdHJ1Y3RvcjtcclxuICAgIH1cclxuXHJcbiAgICBzcGxpdChub2RlLCBwcm9wX25hbWUpIHtcclxuICAgICAgICBpZiAoISh0aGlzLnBhcmVudCBpbnN0YW5jZW9mIFBpcGVOb2RlKSAmJlxyXG4gICAgICAgICAgICAhKHRoaXMucGFyZW50IGluc3RhbmNlb2YgVGFwTm9kZSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgLy9OZWVkIGEgVGFwTm9kZSB0byBjb21wbGV0ZSB0aGUgcGlwZWxpbmVcclxuICAgICAgICAgICAgbGV0IHRhcCA9IG5ldyBUYXBOb2RlKFwiXCIsIHt9LCBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLnByb3BfbmFtZSA9IHRoaXMucHJvcF9uYW1lO1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZXBsYWNlQ2hpbGQodGhpcywgdGFwKTtcclxuICAgICAgICAgICAgdGFwLmFkZENoaWxkKHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIuc3BsaXQobm9kZSwgcHJvcF9uYW1lKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIElPTm9kZSBleHRlbmRzIEdlbmVyaWNOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BfbmFtZSwgYXR0cmlidXRlcywgcGFyZW50LCBjdHgsIGluZGV4KSB7XHJcbiAgICAgICAgc3VwZXIoXCJcIiwgbnVsbCwgcGFyZW50KTtcclxuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgY3R4Lmh0bWwgKz0gYDxpbyBwcm9wPVwiJHtwcm9wX25hbWV9XCI+IyM6JHtpbmRleH08L2lvPmBcclxuICAgICAgICB0aGlzLnByb3BfbmFtZSA9IHByb3BfbmFtZTtcclxuICAgICAgICB0aGlzLkNPTlNVTUVTX1RBRyA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIGdldENvbnN0cnVjdG9yKHByZXNldHMpIHtcclxuICAgICAgICByZXR1cm4gSU87XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge1xyXG4gICAgTGV4XHJcbn0gZnJvbSBcIi4uL2NvbW1vblwiXHJcblxyXG5pbXBvcnQgKiBhcyBBU1QgZnJvbSBcIi4vY2FzZV9jb25zdHJ1Y3Rvcl9hc3RcIlxyXG5cclxuLypcclxuICAgIFRoaXMgZnVuY3Rpb24ncyByb2xlIGlzIHRvIGNvbnN0cnVjdCBhIGNhc2Ugc2tlbGV0b24gZ2l2ZW4gYSB0ZW1wbGF0ZSwgYSBsaXN0IG9mIHByZXNldHMsIGFuZCBcclxuICAgIGFuZCBvcHRpb25hbGx5IGEgd29ya2luZyBET00uIFRoaXMgd2lsbCByZXR1cm4gQ2FzZSBTa2VsZXRvbiB0aGF0IGNhbiBiZSBjbG9uZWQgaW50byBhIG5ldyBDYXNlIG9iamVjdC4gXHJcblxyXG4gICAgQHBhcmFtIHtIVE1MRWxlbWVudH0gVGVtcGxhdGVcclxuICAgIEBwYXJhbSB7UHJlc2V0c30gcHJlc2V0cyBcclxuICAgIEBwYXJhbSB7RE9NRWxlbWVudH0gV09SS0lOR19ET01cclxuKi9cclxuZXhwb3J0IGZ1bmN0aW9uIENhc2VDb25zdHJ1Y3RvcihUZW1wbGF0ZSwgUHJlc2V0cywgV09SS0lOR19ET00pIHtcclxuXHJcbiAgICBsZXQgc2tlbGV0b247XHJcblxyXG4gICAgaWYgKCFUZW1wbGF0ZSlcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICBpZiAoVGVtcGxhdGUuc2tlbGV0b24pXHJcbiAgICAgICAgcmV0dXJuIFRlbXBsYXRlLnNrZWxldG9uO1xyXG5cclxuXHJcbiAgICAvL1RFbXBsYXRlIEZpbHRyYXRpb24gaGFuZGxlZCBoZXJlLlxyXG4gICAgLy9JbXBvcnQgdGhlIFxyXG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5pbXBvcnROb2RlKFRlbXBsYXRlLCB0cnVlKTtcclxuXHJcbiAgICBza2VsZXRvbiA9IENvbXBvbmVudENvbnN0cnVjdG9yKGVsZW1lbnQsIFByZXNldHMsIFdPUktJTkdfRE9NKTtcclxuXHJcbiAgICBpZiAoIXNrZWxldG9uKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgIFRlbXBsYXRlLnNrZWxldG9uID0gKChza2VsZXRvbikgPT4gKG1vZGVsKSA9PiBza2VsZXRvbi5mbGVzaChtb2RlbCkpKHNrZWxldG9uKTtcclxuXHJcbiAgICByZXR1cm4gVGVtcGxhdGUuc2tlbGV0b247XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFJlcGxhY2VUZW1wbGF0ZVdpdGhFbGVtZW50KFRlbXBsYXRlKSB7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBDb21wb25lbnRDb25zdHJ1Y3RvcihlbGVtZW50LCBwcmVzZXRzLCBXT1JLSU5HX0RPTSkge1xyXG4gICAgbGV0IGF0dHJpYnV0ZXMgPSBbXTtcclxuICAgIGxldCBwcm9wcyA9IFtdO1xyXG5cclxuICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT09IFwiVEVNUExBVEVcIikge1xyXG4gICAgICAgIGxldCBjb21wb25lbnRfbmFtZSA9IGVsZW1lbnQuaWQ7XHJcbiAgICAgICAgbGV0IGlucHV0ID0gZWxlbWVudC5pbm5lckhUTUw7XHJcbiAgICAgICAgbGV0IGxleGVyID0gTGV4KGlucHV0KTtcclxuXHJcbiAgICAgICAgLy9NYWtlIHN1cmUgd2UgYXJlIHN0YXJ0aW5nIHdpdGggYSBjYXNlIG9iamVjdC4gXHJcblxyXG4gICAgICAgIGlmIChsZXhlci50ZXh0ID09IFwiPFwiKSB7XHJcbiAgICAgICAgICAgIC8vb2ZmIHRvIGEgZ29vZCBzdGFydFxyXG4gICAgICAgICAgICBsZXQgcm9vdCA9IG5ldyBBU1QuUm9vdCgpO1xyXG4gICAgICAgICAgICBQYXJzZVRhZyhsZXhlciwgcm9vdCwgcHJlc2V0cyk7XHJcbiAgICAgICAgICAgIHJldHVybiByb290LmNvbnN0cnVjdFNrZWxldG9uKHByZXNldHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG4vKipcclxuICAgIEhhbmRsZXMgdGhlIHNlbGVjdGlvbiBvZiBBU1Qgbm9kZXMgYmFzZWQgb24gdGFnbmFtZTtcclxuICAgIFxyXG4gICAgQHBhcmFtIHtMZXhlcn0gbGV4ZXIgLSBUaGUgbGV4aWNhbCBwYXJzZXIgXHJcbiAgICBAcGFyYW0ge1N0cmluZ30gdGFnbmFtZSAtIFRoZSBlbGVtZW50cyB0YWduYW1lXHJcbiAgICBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyAtIFxyXG4gICAgQHBhcmFtIHtPYmplY3R9IGN0eFxyXG4gICAgQHBhcmFtIHtDQ0FzdE5vZGV9IHBhcmVudFxyXG4qL1xyXG5mdW5jdGlvbiBEaXNwYXRjaChsZXhlciwgdGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KSB7XHJcbiAgICBsZXQgYXN0O1xyXG4gICAgc3dpdGNoICh0YWduYW1lKSB7XHJcbiAgICAgICAgLyogVGFwcyAqL1xyXG4gICAgICAgIGNhc2UgXCJ3XCI6XHJcbiAgICAgICAgY2FzZSBcInctYVwiOlxyXG4gICAgICAgIGNhc2UgXCJ3X2FcIjpcclxuICAgICAgICAgICAgYXN0ID0gbmV3IEFTVC5UYXBOb2RlKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBhc3Q7XHJcbiAgICAgICAgY2FzZSBcInctZmlsdGVyXCI6XHJcbiAgICAgICAgICAgIGFzdCA9IG5ldyBBU1QuRmlsdGVyTm9kZSh0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXN0O1xyXG4gICAgICAgIGNhc2UgXCJ3LXRlcm1cIjpcclxuICAgICAgICAgICAgYXN0ID0gbmV3IEFTVC5UZXJtTm9kZSh0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXN0O1xyXG4gICAgICAgIGNhc2UgXCJ3LWNcIjpcclxuICAgICAgICBjYXNlIFwid19jXCI6XHJcbiAgICAgICAgY2FzZSBcInctY2FzZVwiOlxyXG4gICAgICAgIGNhc2UgXCJ3X2Nhc2VcIjpcclxuICAgICAgICAgICAgYXN0ID0gbmV3IEFTVC5DYXNlTm9kZSh0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXN0O1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGlmICh0YWduYW1lWzBdID09IFwid1wiKSB7XHJcbiAgICAgICAgICAgICAgICBhc3QgPSBuZXcgQVNULlBpcGVOb2RlKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXN0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgYXN0ID0gbmV3IEFTVC5HZW5lcmljTm9kZSh0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgcmV0dXJuIGFzdDtcclxufVxyXG5cclxuLyoqXHJcbiAgICBIYW5kbGVzIHRoZSBwYXJzaW5nIG9mIEhUTUwgdGFncyBhbmQgY29udGVudFxyXG4gICAgQHBhcmFtIHtTdHJpbmd9IHRhZ25hbWVcclxuICAgIEBwYXJhbSB7T2JqZWN0fSBjdHhcclxuICAgIEBwYXJhbSB7Q0NBc3ROb2RlfSBwYXJlbnRcclxuKi9cclxuZnVuY3Rpb24gUGFyc2VUYWcobGV4ZXIsIHBhcmVudCwgcHJlc2V0cykge1xyXG4gICAgbGV0IHN0YXJ0ID0gbGV4ZXIucG9zO1xyXG4gICAgbGV0IGF0dHJpYnV0ZXMgPSB7fTtcclxuICAgIFxyXG4gICAgbGV4ZXIuYXNzZXJ0KFwiPFwiKVxyXG4gICAgXHJcbiAgICBsZXQgdGFnbmFtZSA9IGxleGVyLnRleHQ7XHJcbiAgICBcclxuICAgIGlmIChsZXhlci50eXBlID09IFwiaWRlbnRpZmllclwiKSB7XHJcbiAgICAgICAgbGV4ZXIubmV4dCgpO1xyXG4gICAgICAgIEdldEF0dHJpYnV0ZXMobGV4ZXIsIGF0dHJpYnV0ZXMpO1xyXG4gICAgfSBlbHNlIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgdGFnLW5hbWUgaWRlbnRpZmllciwgZ290ICR7bGV4ZXIudGV4dH1gKTtcclxuXHJcbiAgICBsZXQgZWxlID0gRGlzcGF0Y2gobGV4ZXIsIHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcblxyXG4gICAgZWxlLm9wZW5fdGFnICs9IGxleGVyLnNsaWNlKHN0YXJ0KTtcclxuXHJcbiAgICBzdGFydCA9IGxleGVyLnRva2VuLnBvcztcclxuXHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWxleGVyLnRleHQpXHJcbiAgICAgICAgICAgIHRocm93IChcIlVuZXhwZWN0ZWQgZW5kIG9mIG91dHB1dFwiKTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChsZXhlci50ZXh0KSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCI8XCI6XHJcbiAgICAgICAgICAgICAgICBpZiAobGV4ZXIucGVlaygpLnRleHQgPT0gXCIvXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlLmh0bWwgKz0gbGV4ZXIuc2xpY2Uoc3RhcnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IGxleGVyLnBvcztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9TaG91bGQgYmUgY2xvc2luZyBpdCdzIG93biB0YWcuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiPFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXhlci5hc3NlcnQoXCIvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxleGVyLmFzc2VydCh0YWduYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG91dCA9IGxleGVyLnBvcyArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiPlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlLmNsb3NlX3RhZyA9IGxleGVyLnNsaWNlKHN0YXJ0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlLmZpbmFsaXplKHBhcmVudCB8fCB7aHRtbDpcIlwifSwgcHJlc2V0cyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IFBhcnNlVGFnKGxleGVyLCBlbGUpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJbXCI6XHJcbiAgICAgICAgICAgICAgICBlbGUuaHRtbCArPSBsZXhlci5zbGljZShzdGFydCk7XHJcbiAgICAgICAgICAgICAgICBsZXhlci5uZXh0KClcclxuICAgICAgICAgICAgICAgIGxldCBwcm9wX25hbWUgPSBsZXhlci50ZXh0O1xyXG4gICAgICAgICAgICAgICAgbGV4ZXIubmV4dCgpXHJcbiAgICAgICAgICAgICAgICBzdGFydCA9IGxleGVyLnBvcyArIDE7XHJcbiAgICAgICAgICAgICAgICBsZXhlci5hc3NlcnQoXCJdXCIpO1xyXG4gICAgICAgICAgICAgICAgc3RhcnQgPSBlbGUuYWRkUHJvcChsZXhlciwgcHJvcF9uYW1lLCBQYXJzZVRhZywgcHJlc2V0cykgfHwgc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGxleGVyLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAgICBSZXR1cm5zIGFsbCBhdHRyaWJ1dGVzIGluIGFuIGVsZW1lbnQgYXMgYSBrZXktdmFsdWUgb2JqZWN0LlxyXG5cclxuICAgIEBwYXJhbSB7TGV4ZXJ9IGxleGVyIC0gVGhlIGxleGljYWwgcGFyc2VyICBcclxuICAgIEBwYXJhbSB7T2JqZWN0fSBhdHRpYnMgLSBBbiBvYmplY3Qgd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBhdHRyaWJ1dGUga2V5cyBhbmQgdmFsdWVzLiBcclxuKi9cclxuZnVuY3Rpb24gR2V0QXR0cmlidXRlcyhsZXhlciwgYXR0cmlicykge1xyXG4gICAgd2hpbGUgKGxleGVyLnRleHQgIT09IFwiPlwiICYmIGxleGVyLnRleHQgIT09IFwiL1wiKSB7XHJcbiAgICAgICAgaWYgKCFsZXhlci50ZXh0KSB0aHJvdyBFcnJvcihcIlVuZXhwZWN0ZWQgZW5kIG9mIGlucHV0LlwiKTtcclxuICAgICAgICBsZXQgYXR0cmliX25hbWUgPSBsZXhlci50ZXh0O1xyXG4gICAgICAgIGxldCBhdHRyaWJfdmFsID0gbnVsbDtcclxuICAgICAgICBsZXhlci5uZXh0KCk7XHJcbiAgICAgICAgaWYgKGxleGVyLnRleHQgPT0gXCI9XCIpIHtcclxuICAgICAgICAgICAgbGV4ZXIubmV4dCgpO1xyXG4gICAgICAgICAgICBpZiAobGV4ZXIudG9rZW4udHlwZSA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJfdmFsID0gbGV4ZXIudGV4dC5zbGljZSgxLCAtMSk7XHJcbiAgICAgICAgICAgICAgICBsZXhlci5uZXh0KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0aW5nIGF0dHJpYnV0ZSBkZWZpbml0aW9uLlwiKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGF0dHJpYnNbYXR0cmliX25hbWVdID0gYXR0cmliX3ZhbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobGV4ZXIudGV4dCA9PSBcIi9cIikgLy8gVm9pZCBOb2Rlc1xyXG4gICAgICAgIGxleGVyLmFzc2VydChcIi9cIik7XHJcbiAgICBsZXhlci5hc3NlcnQoXCI+XCIpO1xyXG59IiwiaW1wb3J0IHtcclxuICAgIHNldExpbmtzXHJcbn0gZnJvbSBcIi4vc2V0bGlua3NcIlxyXG5pbXBvcnQge1xyXG4gICAgVHJhbnNmb3JtVG9cclxufSBmcm9tIFwiLi4vYW5pbWF0aW9uL2FuaW1hdGlvblwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQmFzaWNDYXNlLFxyXG4gICAgRmFpbGVkQ2FzZVxyXG59IGZyb20gXCIuL2NvbXBvbmVudFwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQ2FzZUNvbnN0cnVjdG9yXHJcbn0gZnJvbSBcIi4uL2Nhc2UvY2FzZV9jb25zdHJ1Y3RvclwiXHJcblxyXG4vKipcclxuICAgIFRoZSBtYWluIGNvbnRhaW5lciBvZiBDYXNlcy4gUmVwcmVzZW50cyBhbiBhcmVhIG9mIGludGVyZXN0IG9uIHRoZSBjbGllbnQgdmlldy5cclxuKi9cclxuY2xhc3MgRWxlbWVudCB7XHJcbiAgICAvKipcclxuICAgICBcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSAoZWxlbWVudC5jbGFzc0xpc3QpID8gZWxlbWVudC5jbGFzc0xpc3RbMF0gOiBlbGVtZW50LmlkO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYnViYmxlZF9lbGVtZW50cyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy53cmFwcyA9IFtdO1xyXG5cclxuICAgICAgICAvL1RoZSBvcmlnaW5hbCBlbGVtZW50IGNvbnRhaW5lci5cclxuICAgICAgICAvL3RoaXMucGFyZW50X2VsZW1lbnQgPSBwYXJlbnRfZWxlbWVudDtcclxuXHJcbiAgICAgICAgLy9Db250ZW50IHRoYXQgaXMgd3JhcHBlZCBpbiBhbiBlbGVfd3JhcFxyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVubG9hZENvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNvbXBvbmVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50c1tpXS5MT0FERUQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uT3V0KCkge1xyXG5cclxuICAgICAgICBsZXQgdCA9IDA7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuTE9BREVEKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnBhcmVudCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgdCA9IE1hdGgubWF4KGNvbXBvbmVudC50cmFuc2l0aW9uT3V0KCksIHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZmluYWxpemUoKSB7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuTE9BREVEICYmIGNvbXBvbmVudC5wYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuZmluYWxpemVUcmFuc2l0aW9uT3V0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndyYXBzW2ldLnJlbW92ZUNoaWxkKGNvbXBvbmVudC5lbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29tcG9uZW50LkxPQURFRCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2FkQ29tcG9uZW50cyh3dXJsKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW2ldO1xyXG5cclxuICAgICAgICAgICAgY29tcG9uZW50LnBhcmVudCA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50LmVsZW1lbnQucGFyZW50RWxlbWVudClcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoY29tcG9uZW50LmVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cmFwc1tpXS5hcHBlbmRDaGlsZChjb21wb25lbnQuZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICBjb21wb25lbnQuaGFuZGxlVXJsVXBkYXRlKHd1cmwpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzW2ldLkxPQURFRCA9IHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uSW4oKSB7XHJcblxyXG4gICAgICAgIC8vIFRoaXMgaXMgdG8gZm9yY2UgYSBkb2N1bWVudCByZXBhaW50LCB3aGljaCBzaG91bGQgY2F1c2UgYWxsIGVsZW1lbnRzIHRvIHJlcG9ydCBjb3JyZWN0IHBvc2l0aW9uaW5nIGhlcmVhZnRlclxyXG5cclxuICAgICAgICBsZXQgdCA9IHRoaXMuZWxlbWVudC5zdHlsZS50b3A7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IHQ7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbaV07XHJcblxyXG4gICAgICAgICAgICBjb21wb25lbnQudHJhbnNpdGlvbkluKCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBidWJibGVMaW5rKGxpbmtfdXJsLCBjaGlsZCwgdHJzX2VsZSA9IHt9KSB7XHJcblxyXG4gICAgICAgIHRoaXMuYnViYmxlZF9lbGVtZW50cyA9IHRyc19lbGU7XHJcblxyXG4gICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHt9LCBcImlnbm9yZWQgdGl0bGVcIiwgbGlua191cmwpO1xyXG5cclxuICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRyYW5zZm9ybVRvKHRyYW5zaXRpb25zKSB7XHJcbiAgICAgICAgaWYgKHRyYW5zaXRpb25zKSB7XHJcbiAgICAgICAgICAgIGxldCBvd25fZWxlbWVudHMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0TmFtZWRFbGVtZW50cyhvd25fZWxlbWVudHMpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBvd25fZWxlbWVudHMpIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zW25hbWVdID0gVHJhbnNmb3JtVG8ob3duX2VsZW1lbnRzW25hbWVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRUcmFuc2Zvcm1Ubyh0cmFuc2l0aW9ucykge1xyXG4gICAgICAgIGlmICh0cmFuc2l0aW9ucykge1xyXG4gICAgICAgICAgICBsZXQgb3duX2VsZW1lbnRzID0ge307XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdldE5hbWVkRWxlbWVudHMob3duX2VsZW1lbnRzKTtcclxuXHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIG93bl9lbGVtZW50cykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRvLCBmcm9tID0gdHJhbnNpdGlvbnNbbmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAoKHRvID0gb3duX2VsZW1lbnRzW25hbWVdKSAmJiBmcm9tKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbSh0bywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWVkRWxlbWVudHMobmFtZWRfZWxlbWVudHMpIHtcclxuICAgICAgICBpZiAodGhpcy5idWJibGVkX2VsZW1lbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCB0ID0gdGhpcy5idWJibGVkX2VsZW1lbnRzO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgdCBpbiB0aGlzLmJ1YmJsZWRfZWxlbWVudHMpXHJcbiAgICAgICAgICAgICAgICBuYW1lZF9lbGVtZW50c1t0XSA9IHRoaXMuYnViYmxlZF9lbGVtZW50c1t0XTtcclxuXHJcbiAgICAgICAgICAgIC8vdGhpcy5idWJibGVkX2VsZW1lbnRzID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuZWxlbWVudC5jaGlsZHJlbjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjaGlsZHJlbltpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5kYXRhc2V0LnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIG5hbWVkX2VsZW1lbnRzW2NoaWxkLmRhdGFzZXQudHJhbnNpdGlvbl0gPSBjaGlsZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpXTtcclxuICAgICAgICAgICAgY29tcG9uZW50LmdldE5hbWVkRWxlbWVudHMobmFtZWRfZWxlbWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRDb21wb25lbnRzKEFwcF9Db21wb25lbnRzLCBNb2RlbF9Db25zdHJ1Y3RvcnMsIENvbXBvbmVudF9Db25zdHJ1Y3RvcnMsIHByZXNldHMsIERPTSwgd3VybCkge1xyXG4gICAgICAgIC8vaWYgdGhlcmUgaXMgYSBjb21wb25lbnQgaW5zaWRlIHRoZSBlbGVtZW50LCByZWdpc3RlciB0aGF0IGNvbXBvbmVudCBpZiBpdCBoYXMgbm90IGFscmVhZHkgYmVlbiByZWdpc3RlcmVkXHJcbiAgICAgICAgdmFyIGNvbXBvbmVudHMgPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwodGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiY29tcG9uZW50XCIpLCAoYSkgPT4gYSk7XHJcblxyXG4gICAgICAgIHNldExpbmtzKHRoaXMuZWxlbWVudCwgKGhyZWYsIGUpID0+IHtcclxuICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiaWdub3JlZCB0aXRsZVwiLCBocmVmKTtcclxuICAgICAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKGNvbXBvbmVudHMubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgICAgICAvL0NyZWF0ZSBhIHdyYXBwZWQgY29tcG9uZW50IGZvciB0aGUgZWxlbWVudHMgaW5zaWRlIHRoZSA8ZWxlbWVudD5cclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5jbGFzc0xpc3QuYWRkKFwiY29tcF93cmFwXCIpO1xyXG5cclxuICAgICAgICAgICAgLy9TdHJhaWdodCB1cCBzdHJpbmcgY29weSBvZiB0aGUgZWxlbWVudCdzIERPTS5cclxuICAgICAgICAgICAgY29tcG9uZW50LmlubmVySFRNTCA9IHRoaXMuZWxlbWVudC5pbm5lckhUTUw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdGVtcGxhdGVzID0gRE9NLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGVtcGxhdGVcIik7XHJcblxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGFwcF9jYXNlID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IGNvbXBvbmVudHNbaV07XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgUmVwbGFjZSB0aGUgY29tcG9uZW50IHdpdGggYSBjb21wb25lbnQgd3JhcHBlciB0byBoZWxwIHByZXNlcnZlIERPTSBhcnJhbmdlbWVudFxyXG4gICAgICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY29tcF93cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbXBfd3JhcC5jbGFzc0xpc3QuYWRkKFwiY29tcF93cmFwXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53cmFwcy5wdXNoKGNvbXBfd3JhcCk7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQucGFyZW50RWxlbWVudC5yZXBsYWNlQ2hpbGQoY29tcF93cmFwLCBjb21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpZCA9IGNvbXBvbmVudC5jbGFzc0xpc3RbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgY29tcDtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICBXZSBtdXN0IGVuc3VyZSB0aGF0IGNvbXBvbmVudHMgYWN0IGFzIHRlbXBsYXRlIFwibGFuZGluZyBzcG90c1wiLiBJbiBvcmRlciBmb3IgdGhhdCB0byBoYXBwZW4gd2UgbXVzdCBjaGVjayBmb3I6XHJcbiAgICAgICAgICAgICAgICAgICgxKSBUaGUgY29tcG9uZW50IGhhcywgYXMgaXQncyBmaXJzdCBjbGFzcyBuYW1lLCBhbiBpZCB0aGF0ICgyKSBtYXRjaGVzIHRoZSBpZCBvZiBhIHRlbXBsYXRlLiBJZiBlaXRoZXIgb2YgdGhlc2UgcHJvdmUgdG8gYmUgbm90IHRydWUsIHdlIHNob3VsZCByZWplY3QgdGhlIGFkb3B0aW9uIG9mIHRoZSBjb21wb25lbnQgYXMgYSBXaWNrXHJcbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCBhbmQgaW5zdGVhZCB0cmVhdCBpdCBhcyBhIG5vcm1hbCBcInBhc3MgdGhyb3VnaFwiIGVsZW1lbnQuXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qc2V0TGlua3MoY29tcG9uZW50LCAoaHJlZiwgZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJpZ25vcmVkIHRpdGxlXCIsIGhyZWYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KSovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gbmV3IEJhc2ljQ2FzZShjb21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghQXBwX0NvbXBvbmVudHNbaWRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wID0gQ29tcG9uZW50X0NvbnN0cnVjdG9yc1tpZF0pIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBfY2FzZSA9IG5ldyBjb21wLmNvbnN0cnVjdG9yKHRlbXBsYXRlcywgcHJlc2V0cywgY29tcG9uZW50LCBET00pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wLm1vZGVsX25hbWUgJiYgTW9kZWxfQ29uc3RydWN0b3JzW2NvbXAubW9kZWxfbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbW9kZWwgPSBNb2RlbF9Db25zdHJ1Y3RvcnNbY29tcC5tb2RlbF9uYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWwuZ2V0dGVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbC5nZXR0ZXIuZ2V0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwuYWRkVmlldyhhcHBfY2FzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UuaWQgPSBpZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBfQ29tcG9uZW50c1tpZF0gPSBhcHBfY2FzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IHRlbXBsYXRlc1tpZF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBDYXNlQ29uc3RydWN0b3IodGVtcGxhdGUsIHByZXNldHMsIERPTSkoKTsgLy9uZXcgQ2FzZUNvbXBvbmVudCh0ZW1wbGF0ZSwgcHJlc2V0cywgTW9kZWxfQ29uc3RydWN0b3JzLCBudWxsLCBET00pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29uc3RydWN0b3IgPSBDYXNlQ29uc3RydWN0b3IoY29tcG9uZW50LCBwcmVzZXRzLCBET00pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbnN0cnVjdG9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3RvciA9IENhc2VDb25zdHJ1Y3Rvcihjb21wb25lbnQuY2hpbGRyZW5bMF0sIHByZXNldHMsIERPTSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb25zdHJ1Y3RvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBuZXcgQmFzaWNDYXNlKGNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBfY2FzZSA9IGNvbnN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYXBwX2Nhc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkFwcCBDb21wb25lbnQgbm90IGNvbnN0cnVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqIFRPRE86IElmIHRoZXJlIGlzIGEgZmFsbGJhY2sgPG5vLXNjcmlwdD4gc2VjdGlvbiB1c2UgdGhhdCBpbnN0ZWFkLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBuZXcgRmFpbGVkQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwX0NvbXBvbmVudHNbaWRdID0gYXBwX2Nhc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBfY2FzZSA9IEFwcF9Db21wb25lbnRzW2lkXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlLmhhbmRsZVVybFVwZGF0ZSh3dXJsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gbmV3IEZhaWxlZENhc2UoZSwgcHJlc2V0cyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5wdXNoKGFwcF9jYXNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBFbGVtZW50XHJcbn0iLCJpbXBvcnQge1xyXG4gICAgV1VSTFxyXG59IGZyb20gXCIuL3d1cmxcIlxyXG5pbXBvcnQge1xyXG4gICAgQW55TW9kZWxcclxufWZyb20gXCIuLi9tb2RlbC9tb2RlbFwiXHJcbmltcG9ydCB7XHJcbiAgICBQYWdlVmlld1xyXG59IGZyb20gXCIuL3BhZ2VcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIEVsZW1lbnRcclxufSBmcm9tIFwiLi9lbGVtZW50XCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBUdXJuRGF0YUludG9RdWVyeVxyXG59IGZyb20gXCIuLi9jb21tb24vdXJsL3VybFwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgR0xPQkFMXHJcbn0gZnJvbSBcIi4uL2dsb2JhbFwiXHJcblxyXG5sZXQgVVJMX0hPU1QgPSB7XHJcbiAgICB3dXJsOiBudWxsXHJcbn07XHJcbmxldCBVUkwgPSAoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgQ2hhbmdlcyB0aGUgVVJMIHRvIHRoZSBvbmUgcHJvdmlkZWQsIHByb21wdHMgcGFnZSB1cGRhdGUuIG92ZXJ3cml0ZXMgY3VycmVudCBVUkwuXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbihhLCBiLCBjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFVSTF9IT1NULnd1cmwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFVSTF9IT1NULnd1cmwuc2V0KGEsIGIsIGMpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmV0dXJucyBhIFF1ZXJ5IGVudHJ5IGlmIGl0IGV4aXN0cyBpbiB0aGUgcXVlcnkgc3RyaW5nLiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChVUkxfSE9TVC53dXJsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVVJMX0hPU1Qud3VybC5zZXQoYSwgYik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFuZ2VzIHRoZSBVUkwgc3RhdGUgdG8gdGhlIG9uZSBwcm92aWRlZCBhbmQgcHJvbXB0cyB0aGUgQnJvd3NlciB0byByZXNwb25kIG8gdGhlIGNoYW5nZS4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBnb3RvOiBmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHt9LCBcImlnbm9yZWQgdGl0bGVcIiwgYCR7YX0keyAoKGIpID8gYD8ke1R1cm5EYXRhSW50b1F1ZXJ5KGIpfWAgOiBcIlwiKSB9YCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuZnVuY3Rpb24gZ2V0TW9kYWxDb250YWluZXIoKSB7XHJcbiAgICBsZXQgbW9kYWxfY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJtb2RhbHNcIilbMF07XHJcblxyXG4gICAgaWYgKCFtb2RhbF9jb250YWluZXIpIHtcclxuXHJcbiAgICAgICAgbW9kYWxfY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm1vZGFsc1wiKTtcclxuXHJcbiAgICAgICAgdmFyIGRvbV9hcHAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFwcFwiKVswXTtcclxuXHJcbiAgICAgICAgaWYgKGRvbV9hcHApXHJcbiAgICAgICAgICAgIGRvbV9hcHAucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUobW9kYWxfY29udGFpbmVyLCBkb21fYXBwKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobW9kYWxfY29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbW9kYWxfY29udGFpbmVyXHJcbn1cclxuXHJcbi8qKiBAbmFtZXNwYWNlIGxpbmtlciAqL1xyXG5cclxuLyoqXHJcbiAqICBSZXNwb25zaWJsZSBmb3IgbG9hZGluZyBwYWdlcyBhbmQgcHJlc2VudGluZyB0aGVtIGluIHRoZSBtYWluIERPTS5cclxuICovXHJcbmNsYXNzIExpbmtlciB7XHJcbiAgICAvKipcclxuICAgICAqICBUaGlzIChpbmtlci5MaW5rZXIpIGlzIHJlc3BvbnNpYmxlIGZvciBsb2FkaW5nIHBhZ2VzIGR5bmFtaWNhbGx5LCBoYW5kbGluZyB0aGUgdHJhbnNpdGlvbiBvZiBwYWdlIGNvbXBvbmVudHMsIGFuZCBtb25pdG9yaW5nIGFuZCByZWFjdGluZyB0byBVUkwgY2hhbmdlc1xyXG4gICAgICpcclxuICAgICAqXHJcbiAgICAgKiAgQHBhcmFtIHtMaW5rZXJQcmVzZXRzfSBwcmVzZXRzIC0gQSBwcmVzZXQgYmFzZWQgb2JqZWN0IHRoYXQgd2lsbCBiZSB1c2VkIGJ5IFdpY2sgZm9yIGhhbmRsaW5nIGN1c3RvbSBjb21wb25lbnRzLiBJcyB2YWxpZGF0ZWQgYWNjb3JkaW5nIHRvIHRoZSBkZWZpbml0aW9uIG9mIGEgTGlua2VyUHJlc2V0XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHByZXNldHMpIHtcclxuICAgICAgICB0aGlzLnBhZ2VzID0ge307XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0ge307XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRfY29uc3RydWN0b3JzID0ge307XHJcbiAgICAgICAgdGhpcy5tb2RlbHNfY29uc3RydWN0b3JzID0ge307XHJcbiAgICAgICAgdGhpcy5wcmVzZXRzID0gcHJlc2V0cztcclxuICAgICAgICB0aGlzLmN1cnJlbnRfdXJsID0gbnVsbDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfcXVlcnk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3ZpZXcgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmluYWxpemluZ19wYWdlcyA9IFtdO1xyXG5cclxuICAgICAgICBHTE9CQUwubGlua2VyID0gdGhpcztcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgIFRoZSBzdGF0aWMgZmllbGQgaW4gcHJlc2V0cyBhcmUgYWxsIENvbXBvbmVudC1saWtlIG9iamVjdHMgY29udHJ1Y3RvcnMgdGhhdCBhcmUgZGVmaW5lZCBieSB0aGUgY2xpZW50XHJcbiAgICAgICAgICB0byBiZSB1c2VkIGJ5IFdpY2sgZm9yIGN1c3RvbSBjb21wb25lbnRzLlxyXG5cclxuICAgICAgICAgIFRoZSBjb25zdHJ1Y3RvcnMgbXVzdCBzdXBwb3J0IHNldmVyYWwgQ29tcG9uZW50IGJhc2VkIG1ldGhvZHMgaW4gb3JkZXJlZCBvdCBiZSBhY2NlcHRlZCBmb3IgdXNlLiBUaGVzZSBtZXRob2RlcyBpbmNsdWRlOlxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uSW5cclxuICAgICAgICAgICAgdHJhbnNpdGlvbk91dFxyXG4gICAgICAgICAgICBzZXRNb2RlbFxyXG4gICAgICAgICAgICB1bnNldE1vZGVsXHJcbiAgICAgICAgKi9cclxuICAgICAgICBpZiAocHJlc2V0cy5zdGF0aWMpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29tcG9uZW50X25hbWUgaW4gcHJlc2V0cy5zdGF0aWMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gcHJlc2V0cy5zdGF0aWNbY29tcG9uZW50X25hbWVdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBhID0gMCxcclxuICAgICAgICAgICAgICAgICAgICBiID0gMCxcclxuICAgICAgICAgICAgICAgICAgICBjID0gMCxcclxuICAgICAgICAgICAgICAgICAgICBkID0gMCxcclxuICAgICAgICAgICAgICAgICAgICBlID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKGEgPSAoY29tcG9uZW50LnByb3RvdHlwZS50cmFuc2l0aW9uSW4gJiYgY29tcG9uZW50LnByb3RvdHlwZS50cmFuc2l0aW9uSW4gaW5zdGFuY2VvZiBGdW5jdGlvbikpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGIgPSAoY29tcG9uZW50LnByb3RvdHlwZS50cmFuc2l0aW9uT3V0ICYmIGNvbXBvbmVudC5wcm90b3R5cGUudHJhbnNpdGlvbk91dCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkgJiZcclxuICAgICAgICAgICAgICAgICAgICAoYyA9IChjb21wb25lbnQucHJvdG90eXBlLnNldE1vZGVsICYmIGNvbXBvbmVudC5wcm90b3R5cGUuc2V0TW9kZWwgaW5zdGFuY2VvZiBGdW5jdGlvbikpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGQgPSAoY29tcG9uZW50LnByb3RvdHlwZS51bnNldE1vZGVsICYmIGNvbXBvbmVudC5wcm90b3R5cGUudW5zZXRNb2RlbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRTdGF0aWMoY29tcG9uZW50X25hbWUsIGNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBTdGF0aWMgY29tcG9uZW50ICR7Y29tcG9uZW50X25hbWV9IGxhY2tzIGNvcnJlY3QgY29tcG9uZW50IG1ldGhvZHMsIFxcbkhhcyB0cmFuc2l0aW9uSW4gZnVuY3Rpb246JHthfVxcbkhhcyB0cmFuc2l0aW9uT3V0IGZ1bmN0b246JHtifVxcbkhhcyBzZXQgbW9kZWwgZnVuY3Rpb246JHtjfVxcbkhhcyB1bnNldE1vZGVsIGZ1bmN0aW9uOiR7ZH1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqIFRPRE9cclxuICAgICAgICAgICAgQGRlZmluZSBQYWdlUGFyc2VyXHJcblxyXG4gICAgICAgICAgICBBIHBhZ2UgcGFyc2VyIHdpbGwgcGFyc2UgdGVtcGxhdGVzIGJlZm9yZSBwYXNzaW5nIHRoYXQgZGF0YSB0byB0aGUgQ2FzZSBoYW5kbGVyLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgaWYgKHByZXNldHMucGFyc2VyKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHBhcnNlcl9uYW1lIGluIHByZXNldHMucGFnZV9wYXJzZXIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJzZXIgPSBwcmVzZXRzLnBhZ2VfcGFyc2VyW3BhcnNlcl9uYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICAgIFNjaGVtYXMgcHJvdmlkZSB0aGUgY29uc3RydWN0b3JzIGZvciBtb2RlbHNcclxuICAgICAgICAqL1xyXG4gICAgICAgIGlmIChwcmVzZXRzLnNjaGVtYXMpIHtcclxuXHJcbiAgICAgICAgICAgIHByZXNldHMuc2NoZW1hcy5hbnkgPSBBbnlNb2RlbDtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcHJlc2V0cy5zY2hlbWFzID0ge1xyXG4gICAgICAgICAgICAgICAgYW55IDogQW55TW9kZWxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgICBNb2RhbHMgYXJlIHRoZSBnbG9iYWwgbW9kZWxzIHRoYXQgY2FuIGJlIGFjY2Vzc2VkIGJ5IGFueSBDYXNlXHJcbiAgICAgICAgKi9cclxuICAgICAgICBpZiAocHJlc2V0cy5tb2RlbHMpIHtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcHJlc2V0cy5tb2RlbHMgPSB7fTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgVE9ETyBWYWxpZGF0ZSB0aGF0IGV2ZXJ5IHNjaGFtYSBpcyBhIE1vZGVsIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgLyogKi9cclxuICAgICAgICB0aGlzLm1vZGFsX3N0YWNrID0gW107XHJcblxyXG4gICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlVVJMKGRvY3VtZW50LmxvY2F0aW9uKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICAgIFRoaXMgZnVuY3Rpb24gd2lsbCBwYXJzZSBhIFVSTCBhbmQgZGV0ZXJtaW5lIHdoYXQgUGFnZSBuZWVkcyB0byBiZSBsb2FkZWQgaW50byB0aGUgY3VycmVudCB2aWV3LlxyXG4gICAgKi9cclxuICAgIHBhcnNlVVJMKGxvY2F0aW9uKSB7XHJcblxyXG4gICAgICAgIGxldCB1cmwgPSBsb2NhdGlvbi5wYXRobmFtZTtcclxuXHJcbiAgICAgICAgbGV0IElTX1NBTUVfUEFHRSA9ICh0aGlzLmN1cnJlbnRfdXJsID09IHVybCksXHJcbiAgICAgICAgICAgIHBhZ2UgPSBudWxsLFxyXG4gICAgICAgICAgICB3dXJsID0gbmV3IFdVUkwobG9jYXRpb24pO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRfdXJsID0gdXJsO1xyXG5cclxuICAgICAgICBpZiAoKHBhZ2UgPSB0aGlzLnBhZ2VzW3VybF0pKSB7XHJcbiAgICAgICAgICAgIGlmIChJU19TQU1FX1BBR0UpIHtcclxuICAgICAgICAgICAgICAgIFVSTF9IT1NULnd1cmwgPSB3dXJsO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBwYWdlLnRyYW5zaXRpb25JbihcclxuICAgICAgICAgICAgICAgICAgICAocGFnZS50eXBlID09IFwibW9kYWxcIikgPyBnZXRNb2RhbENvbnRhaW5lcigpIDogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhcHBcIilbMF0sIFxyXG4gICAgICAgICAgICAgICAgICAgIG51bGwsIHd1cmwsIElTX1NBTUVfUEFHRSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9hZFBhZ2UocGFnZSwgd3VybCwgSVNfU0FNRV9QQUdFKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsb2NhdGlvbilcclxuICAgICAgICAgICAgZmV0Y2gobG9jYXRpb24uaHJlZiwge1xyXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgLy8gU2VuZHMgY29va2llcyBiYWNrIHRvIHNlcnZlciB3aXRoIHJlcXVlc3RcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCdcclxuICAgICAgICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgIChyZXNwb25zZS50ZXh0KCkudGhlbigoaHRtbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBET00gPSAobmV3IERPTVBhcnNlcigpKS5wYXJzZUZyb21TdHJpbmcoaHRtbCwgXCJ0ZXh0L2h0bWxcIilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRQYWdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWROZXdQYWdlKHVybCwgRE9NLCB3dXJsKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3VybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgSVNfU0FNRV9QQUdFXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFVuYWJsZSB0byBwcm9jZXNzIHJlc3BvbnNlIGZvciByZXF1ZXN0IG1hZGUgdG86ICR7dGhpcy51cmx9LiBSZXNwb25zZTogJHtlcnJvcn0uIEVycm9yIFJlY2VpdmVkOiAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZpbmFsaXplUGFnZXMoKSB7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYXJtZWQpe1xyXG4gICAgICAgICAgICBsZXQgYSA9IHRoaXMuYXJtZWQ7XHJcbiAgICAgICAgICAvLyAgYS5wLnRyYW5zaXRpb25JbihhLmUsIHRoaXMuY3VycmVudF92aWV3LCBhLnd1cmwsIGEuU1AsIGEudGUpO1xyXG4gICAgICAgICAgICB0aGlzLmFybWVkID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmZpbmFsaXppbmdfcGFnZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuZmluYWxpemluZ19wYWdlc1tpXTtcclxuICAgICAgICAgICAgcGFnZS5maW5hbGl6ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5maW5hbGl6aW5nX3BhZ2VzLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgTG9hZHMgcGFnZXMgZnJvbSBzZXJ2ZXIsIG9yIGZyb20gbG9jYWwgY2FjaGUsIGFuZCBzZW5kcyBpdCB0byB0aGUgcGFnZSBwYXJzZXIuXHJcblxyXG4gICAgICBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIFVSTCBpZCBvZiB0aGUgY2FjaGVkIHBhZ2UgdG8gbG9hZC5cclxuICAgICAgQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5IC1cclxuICAgICAgQHBhcmFtIHtCb29sfSBJU19TQU1FX1BBR0UgLVxyXG4gICAgKi9cclxuICAgIGxvYWRQYWdlKHBhZ2UsIHd1cmwgPSBuZXcgV1VSTChkb2N1bWVudC5sb2NhdGlvbiksIElTX1NBTUVfUEFHRSkge1xyXG5cclxuXHJcbiAgICAgICAgVVJMX0hPU1Qud3VybCA9IHd1cmw7XHJcblxyXG4gICAgICAgIGxldCB0cmFuc2l0aW9uX2xlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIGxldCBhcHBfZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhcHBcIilbMF07XHJcblxyXG4gICAgICAgIC8vRmluYWxpemUgYW55IGV4aXN0aW5nIHBhZ2UgdHJhbnNpdGlvbnM7XHJcbiAgICAgICAgLy8gdGhpcy5maW5hbGl6ZVBhZ2VzKCk7XHJcblxyXG4gICAgICAgIGxldCB0cmFuc2l0aW9uX2VsZW1lbnRzID0ge307XHJcblxyXG4gICAgICAgIGlmIChwYWdlLnR5cGUgPT0gXCJtb2RhbFwiKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL3RyYWNlIG1vZGFsIHN0YWNrIGFuZCBzZWUgaWYgdGhlIG1vZGFsIGFscmVhZHkgZXhpc3RzXHJcbiAgICAgICAgICAgIGlmIChJU19TQU1FX1BBR0UpIHtcclxuICAgICAgICAgICAgICAgIHBhZ2UudHJhbnNpdGlvbkluKClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IFVOV0lORCA9IDA7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubW9kYWxfc3RhY2subGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbW9kYWwgPSB0aGlzLm1vZGFsX3N0YWNrW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChVTldJTkQgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RhbCA9PSBwYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFVOV0lORCA9IGkgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRycyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWwudW5sb2FkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cnMgPSBtb2RhbC50cmFuc2l0aW9uT3V0KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbl9sZW5ndGggPSBNYXRoLm1heCh0cnMsIHRyYW5zaXRpb25fbGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbGl6aW5nX3BhZ2VzLnB1c2gobW9kYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWwuZmluYWxpemUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKFVOV0lORCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9kYWxfc3RhY2subGVuZ3RoID0gVU5XSU5EO1xyXG4gICAgICAgICAgICAgICAgcGFnZS5sb2FkKGdldE1vZGFsQ29udGFpbmVyKCksIHd1cmwpO1xyXG4gICAgICAgICAgICAgICAgcGFnZS50cmFuc2l0aW9uSW4oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vY3JlYXRlIG5ldyBtb2RhbFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbF9zdGFjay5wdXNoKHBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgcGFnZS5sb2FkKGdldE1vZGFsQ29udGFpbmVyKCksIHd1cmwpO1xyXG4gICAgICAgICAgICAgICAgcGFnZS50cmFuc2l0aW9uSW4oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLm1vZGFsX3N0YWNrLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1vZGFsID0gdGhpcy5tb2RhbF9zdGFja1tpXTtcclxuICAgICAgICAgICAgICAgIGxldCB0cnMgPSAwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBtb2RhbC51bmxvYWQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHJzID0gbW9kYWwudHJhbnNpdGlvbk91dCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbl9sZW5ndGggPSBNYXRoLm1heCh0cnMsIHRyYW5zaXRpb25fbGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmFsaXppbmdfcGFnZXMucHVzaChtb2RhbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWwuZmluYWxpemUoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm1vZGFsX3N0YWNrLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgICAgICBsZXQgdHJzID0gMDtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50X3ZpZXcgJiYgdGhpcy5jdXJyZW50X3ZpZXcgIT0gcGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50X3ZpZXcudW5sb2FkKHRyYW5zaXRpb25fZWxlbWVudHMpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBwYWdlLmxvYWQoYXBwX2VsZSwgd3VybCk7XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IHQgPSB0aGlzLmN1cnJlbnRfdmlldy50cmFuc2l0aW9uT3V0KCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCk9PntcclxuICAgICAgICAgICAgICAgICAgICBwYWdlLnRyYW5zaXRpb25Jbih0cmFuc2l0aW9uX2VsZW1lbnRzKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX2xlbmd0aCA9IE1hdGgubWF4KHQsIHRyYW5zaXRpb25fbGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5maW5hbGl6aW5nX3BhZ2VzLnB1c2godGhpcy5jdXJyZW50X3ZpZXcpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoIXRoaXMuY3VycmVudF92aWV3KXtcclxuICAgICAgICAgICAgICAgIHBhZ2UubG9hZChhcHBfZWxlLCB3dXJsKTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZS50cmFuc2l0aW9uSW4odHJhbnNpdGlvbl9lbGVtZW50cylcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF92aWV3ID0gcGFnZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmZpbmFsaXplUGFnZXMoKTtcclxuICAgICAgICB9LCAodHJhbnNpdGlvbl9sZW5ndGgqMTAwMCkgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBQcmUtbG9hZHMgYSBjdXN0b20gY29uc3RydWN0b3IgZm9yIGFuIGVsZW1lbnQgd2l0aCB0aGUgc3BlY2lmaWVkIGlkIGFuZCBwcm92aWRlcyBhIG1vZGVsIHRvIHRoYXQgY29uc3RydWN0b3Igd2hlbiBpdCBpcyBjYWxsZWQuXHJcbiAgICAgICAgVGhlIGNvbnN0cnVjdG9yIG11c3QgaGF2ZSBDb21wb25lbnQgaW4gaXRzIGluaGVyaXRhbmNlIGNoYWluLlxyXG4gICAgKi9cclxuICAgIGFkZFN0YXRpYyhlbGVtZW50X2lkLCBjb25zdHJ1Y3RvciwgbW9kZWwpIHtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudF9jb25zdHJ1Y3RvcnNbZWxlbWVudF9pZF0gPSB7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yLFxyXG4gICAgICAgICAgICBtb2RlbF9uYW1lOiBtb2RlbFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFkZE1vZGVsKG1vZGVsX25hbWUsIG1vZGVsQ29uc3RydWN0b3IpIHtcclxuICAgICAgICB0aGlzLm1vZGVsc19jb25zdHJ1Y3RvcnNbbW9kZWxfbmFtZV0gPSBtb2RlbENvbnN0cnVjdG9yO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgICAgQ3JlYXRlcyBhIG5ldyBpZnJhbWUgb2JqZWN0IHRoYXQgYWN0cyBhcyBhIG1vZGFsIHRoYXQgd2lsbCBzaXQgb250b3Agb2YgZXZlcnl0aGluZyBlbHNlLlxyXG4gICAgKi9cclxuICAgIGxvYWROb25XaWNrUGFnZShVUkwpIHtcclxuICAgICAgICBsZXQgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTtcclxuICAgICAgICBpZnJhbWUuc3JjID0gVVJMO1xyXG4gICAgICAgIGlmcmFtZS5jbGFzc0xpc3QuYWRkKFwibW9kYWxcIiwgXCJjb21wX3dyYXBcIik7XHJcbiAgICAgICAgdmFyIHBhZ2UgPSBuZXcgUGFnZVZpZXcoVVJMLCBpZnJhbWUpO1xyXG4gICAgICAgIHBhZ2UudHlwZSA9IFwibW9kYWxcIjtcclxuICAgICAgICB0aGlzLnBhZ2VzW1VSTF0gPSBwYWdlIC8vbmV3IE1vZGFsKHBhZ2UsIGlmcmFtZSwgZ2V0TW9kYWxDb250YWluZXIoKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFnZXNbVVJMXTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICAgIFRha2VzIHRoZSBET00gb2YgYW5vdGhlciBwYWdlIGFuZCBzdHJpcHMgaXQsIGxvb2tpbmcgZm9yIGNvbXBvbmVudCBhbmQgYXBwIGVsZW1lbnRzIHRvIHVzZSB0byBpbnRlZ3JhdGUgaW50byB0aGUgU1BBIHN5c3RlbS5cclxuICAgICAgICBJZiBpdCBpcyB1bmFibGUgdG8gZmluZCB0aGVzZSBlbGVtZW50cywgdGhlbiBpdCB3aWxsIHBhc3MgdGhlIERPTSB0byBsb2FkTm9uV2lja1BhZ2UgdG8gaGFuZGxlIHdyYXBwaW5nIHRoZSBwYWdlIGJvZHkgaW50byBhIHdpY2sgYXBwIGVsZW1lbnQuXHJcbiAgICAqL1xyXG4gICAgbG9hZE5ld1BhZ2UoVVJMLCBET00sIHd1cmwpIHtcclxuICAgICAgICAvL2xvb2sgZm9yIHRoZSBhcHAgc2VjdGlvbi5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICAgIElmIHRoZSBwYWdlIHNob3VsZCBub3QgYmUgcmV1c2VkLCBhcyBpbiBjYXNlcyB3aGVyZSB0aGUgc2VydmVyIGRvZXMgYWxsIHRoZSByZW5kZXJpbmcgZm9yIGEgZHluYW1pYyBwYWdlIGFuZCB3ZSdyZSBqdXN0IHByZXNlbnRpbmcgdGhlIHJlc3VsdHMsXHJcbiAgICAgICAgICAgIHRoZW4gaGF2aW5nIE5PX0JVRkZFUiBzZXQgdG8gdHJ1ZSB3aWxsIGNhdXNlIHRoZSBsaW5rZXIgdG8gbm90IHNhdmUgdGhlIHBhZ2UgdG8gdGhlIGhhc2h0YWJsZSBvZiBleGlzdGluZyBwYWdlcywgZm9yY2luZyBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciBldmVyeSB0aW1lIHRoZSBwYWdlIGlzIHZpc2l0ZWQuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBsZXQgTk9fQlVGRkVSID0gZmFsc2U7XHJcblxyXG5cclxuICAgICAgICAvKiBcclxuICAgICAgICAgICAgQXBwIGVsZW1lbnRzOiBUaGVyZSBzaG91bGQgb25seSBiZSBvbmUuIFxyXG4gICAgICAgICovXHJcbiAgICAgICAgbGV0IGFwcF9saXN0ID0gRE9NLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYXBwXCIpO1xyXG5cclxuICAgICAgICBpZiAoYXBwX2xpc3QubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFdpY2sgaXMgZGVzaWduZWQgdG8gd29yayB3aXRoIGp1c3Qgb25lIDxhcHA+IGVsZW1lbnQgaW4gYSBwYWdlLiBUaGVyZSBhcmUgJHthcHBfbGlzdC5sZW5ndGh9IGFwcHMgZWxlbWVudHMgaW4gJHt1cmx9LiBXaWNrIHdpbGwgcHJvY2VlZCB3aXRoIHRoZSBmaXJzdCA8YXBwPiBlbGVtZW50IGluIHRoZSBET00uIFVuZXhwZWN0ZWQgYmVoYXZpb3IgbWF5IG9jY3VyLmApXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYXBwX3NvdXJjZSA9IGFwcF9saXN0WzBdXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgSWYgdGhlcmUgaXMgbm8gPGFwcD4gZWxlbWVudCB3aXRoaW4gdGhlIERPTSwgdGhlbiB3ZSBtdXN0IGhhbmRsZSB0aGlzIGNhc2UgY2FyZWZ1bGx5LiBUaGlzIGxpa2VseSBpbmRpY2F0ZXMgYSBwYWdlIGRlbGl2ZXJlZCBmcm9tIHRoZSBzYW1lIG9yaWdpbiB0aGF0IGhhcyBub3QgYmVlbiBjb252ZXJ0ZWQgdG8gd29yayB3aXRoIHRoZSBXaWNrIHN5c3RlbS5cclxuICAgICAgICAgIFRoZSBlbnRpcmUgY29udGVudHMgb2YgdGhlIHBhZ2UgY2FuIGJlIHdyYXBwZWQgaW50byBhIDxpZnJhbWU+LCB0aGF0IHdpbGwgYmUgY291bGQgc2V0IGFzIGEgbW9kYWwgb24gdG9wIG9mIGV4aXN0aW5nIHBhZ2VzLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgaWYgKCFhcHBfc291cmNlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUudHJhY2UoXCJQYWdlIGRvZXMgbm90IGhhdmUgYW4gPGFwcD4gZWxlbWVudCFcIik7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvYWROb25XaWNrUGFnZShVUkwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGFwcF9wYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFwcHBhZ2VcIik7XHJcbiAgICAgICAgYXBwX3BhZ2UuaW5uZXJIVE1MID0gYXBwX3NvdXJjZS5pbm5lckhUTUw7XHJcblxyXG4gICAgICAgIHZhciBhcHAgPSBhcHBfc291cmNlLmNsb25lTm9kZSh0cnVlKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBkb21fYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhcHBcIilbMF07XHJcblxyXG4gICAgICAgIHZhciBwYWdlID0gbmV3IFBhZ2VWaWV3KFVSTCwgYXBwX3BhZ2UpO1xyXG4gICAgICAgIGlmIChhcHBfc291cmNlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoYXBwX3NvdXJjZS5kYXRhc2V0Lm1vZGFsID09IFwidHJ1ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlLnNldFR5cGUoXCJtb2RhbFwiKTtcclxuICAgICAgICAgICAgICAgIGxldCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtb2RhbFwiKTtcclxuICAgICAgICAgICAgICAgIG1vZGFsLmlubmVySFRNTCA9IGFwcC5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgICAgICBhcHAuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGFwcCA9IG1vZGFsO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgSWYgdGhlIERPTSBpcyB0aGUgc2FtZSBlbGVtZW50IGFzIHRoZSBhY3R1YWwgZG9jdW1lbnQsIHRoZW4gd2Ugc2hhbGwgcmVidWlsZCB0aGUgZXhpc3RpbmcgPGFwcD4gZWxlbWVudCwgY2xlYXJpbmcgaXQgb2YgaXQncyBjb250ZW50cy5cclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoRE9NID09IGRvY3VtZW50ICYmIGRvbV9hcHApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3X2FwcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhcHBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZXBsYWNlQ2hpbGQobmV3X2FwcCwgZG9tX2FwcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tX2FwcCA9IG5ld19hcHA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChhcHAuZGF0YXNldC5ub19idWZmZXIgPT0gXCJ0cnVlXCIpXHJcbiAgICAgICAgICAgICAgICBOT19CVUZGRVIgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gYXBwX3BhZ2UuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJlbGVtZW50XCIpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBlbGUgPSBlbGVtZW50c1tpXSxcclxuICAgICAgICAgICAgICAgICAgICBlcXVpdmlsYW50X2VsZW1lbnRfZnJvbV9tYWluX2RvbSA9IGVsZSxcclxuICAgICAgICAgICAgICAgICAgICB3aWNrX2VsZW1lbnQ7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBlbGVtZW50X2lkID0gZWxlLmlkO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwYWdlLnR5cGUgIT09IFwibW9kYWxcIikge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB3aWNrX2VsZW1lbnQgPSBuZXcgRWxlbWVudChlbGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gZWxlLmlubmVySFRNTDtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJlbGVfd3JhcFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2lja19lbGVtZW50ID0gbmV3IEVsZW1lbnQoZWxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBwYWdlLmVsZW1lbnRzLnB1c2god2lja19lbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY29tcG9uZW50c1tlbGVtZW50X2lkXSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHNbZWxlbWVudF9pZF0gPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aWNrX2VsZW1lbnQuc2V0Q29tcG9uZW50cyh0aGlzLmNvbXBvbmVudHNbZWxlbWVudF9pZF0sIHRoaXMubW9kZWxzX2NvbnN0cnVjdG9ycywgdGhpcy5jb21wb25lbnRfY29uc3RydWN0b3JzLCB0aGlzLnByZXNldHMsIERPTSwgd3VybCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudCA9PSBET00pXHJcbiAgICAgICAgICAgICAgICBkb21fYXBwLmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gcGFnZTtcclxuXHJcbiAgICAgICAgICAgIGlmICghTk9fQlVGRkVSKSB0aGlzLnBhZ2VzW1VSTF0gPSByZXN1bHQ7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBMaW5rZXIsXHJcbiAgICBVUkxcclxufSIsIi8qKlxyXG5cdExpZ2h0IGl0IHVwIVxyXG4qL1xyXG5pbXBvcnQge1xyXG4gICAgV1VSTFxyXG59IGZyb20gXCIuL2xpbmtlci93dXJsXCJcclxuaW1wb3J0IHtcclxuICAgIFZpZXdcclxufSBmcm9tIFwiLi92aWV3XCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBBbnlNb2RlbCxcclxuICAgIEFycmF5TW9kZWxDb250YWluZXIsXHJcbiAgICBCVHJlZU1vZGVsQ29udGFpbmVyLFxyXG4gICAgTXVsdGlJbmRleGVkQ29udGFpbmVyLFxyXG4gICAgTW9kZWwsXHJcbiAgICBNb2RlbENvbnRhaW5lclxyXG59IGZyb20gXCIuL21vZGVsL21vZGVsXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBDb250cm9sbGVyXHJcbn0gZnJvbSBcIi4vY29udHJvbGxlclwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgR2V0dGVyXHJcbn0gZnJvbSBcIi4vZ2V0dGVyXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBTZXR0ZXJcclxufSBmcm9tIFwiLi9zZXR0ZXJcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIExpbmtlcixcclxuICAgIFVSTFxyXG59IGZyb20gXCIuL2xpbmtlci9saW5rZXJcIlxyXG5cclxuaW1wb3J0ICogYXMgQW5pbWF0aW9uIGZyb20gXCIuL2FuaW1hdGlvbi9hbmltYXRpb25cIlxyXG5cclxuaW1wb3J0ICogYXMgQ29tbW9uIGZyb20gXCIuL2NvbW1vblwiXHJcblxyXG5sZXQgd2lja192YW5pdHkgPSBcIlxcIFxcKFxcIFxcIFxcKFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcKVxcblxcIFxcKVxcXFxcXClcXClcXChcXCBcXCBcXCBcXCdcXCBcXChcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXChcXCBcXC9cXChcXG5cXChcXChcXF9cXClcXChcXClcXFxcXFwgXFwpXFwgXFwgXFwpXFxcXFxcIFxcIFxcIFxcIFxcKFxcIFxcIFxcIFxcIFxcKVxcXFxcXChcXClcXClcXG5cXF9cXChcXChcXClcXClcXFxcXFxfXFwpXFwoXFwpXFwoXFwoXFxfXFwpXFwgXFwgXFwgXFwpXFxcXFxcIFxcIFxcKFxcKFxcX1xcKVxcXFxcXG5cXFxcXFwgXFxcXFxcKFxcKFxcX1xcKVxcL1xcIFxcL1xcIFxcKFxcX1xcKVxcIFxcIFxcKFxcKFxcX1xcKVxcIFxcfFxcIFxcfFxcKFxcX1xcKVxcblxcIFxcXFxcXCBcXFxcXFwvXFxcXFxcL1xcIFxcL1xcIFxcIFxcfFxcIFxcfFxcIFxcL1xcIFxcX1xcfFxcIFxcIFxcfFxcIFxcL1xcIFxcL1xcblxcIFxcIFxcXFxcXF9cXC9cXFxcXFxfXFwvXFwgXFwgXFwgXFx8XFxfXFx8XFwgXFxcXFxcX1xcX1xcfFxcIFxcIFxcfFxcX1xcXFxcXF9cXFxcXFxuXCI7XHJcblxyXG5pbXBvcnQge1xyXG4gICAgQ3VzdG9tQ2FzZVxyXG59IGZyb20gXCIuL2Nhc2UvY2FzZVwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgUml2ZXRcclxufSBmcm9tIFwiLi9jYXNlL3JpdmV0XCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBDYXNlQ29uc3RydWN0b3JcclxufSBmcm9tIFwiLi9jYXNlL2Nhc2VfY29uc3RydWN0b3JcIlxyXG5cclxuaW1wb3J0e1xyXG4gICAgRmlsdGVyXHJcbn0gZnJvbSBcIi4vY2FzZS9jYXNzZXR0ZS9maWx0ZXJcIlxyXG5cclxuaW1wb3J0e1xyXG4gICAgRm9ybVxyXG59IGZyb20gXCIuL2Nhc2UvY2Fzc2V0dGUvZm9ybVwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQ2Fzc2V0dGVcclxufSBmcm9tIFwiLi9jYXNlL2Nhc3NldHRlL2Nhc3NldHRlXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBTY2hlbWFUeXBlLFxyXG4gICAgc2NoZW1hXHJcbn0gZnJvbSBcIi4vc2NoZW1hL3NjaGVtYXNcIlxyXG5cclxubGV0IExJTktFUl9MT0FERUQgPSBmYWxzZTtcclxubGV0IERFQlVHR0VSID0gdHJ1ZTtcclxuXHJcbi8qKlxyXG4gKiAgICBDcmVhdGVzIGEgbmV3IHtMaW5rZXJ9IGluc3RhbmNlLCBwYXNzaW5nIGFueSBwcmVzZXRzIGZyb20gdGhlIGNsaWVudC5cclxuICogICAgSXQgd2lsbCB0aGVuIHdhaXQgZm9yIHRoZSBkb2N1bWVudCB0byBsb2FkLCBhbmQgb25jZSBsb2FkZWQsIHdpbGwgc3RhcnQgdGhlIGxpbmtlciBhbmQgbG9hZCB0aGUgY3VycmVudCBwYWdlIGludG8gdGhlIGxpbmtlci5cclxuICpcclxuICogICAgTm90ZTogVGhpcyBmdW5jdGlvbiBzaG91bGQgb25seSBiZSBjYWxsZWQgb25jZS4gQW55IHN1YnNlcXVlbnQgY2FsbHMgd2lsbCBub3QgZG8gYW55dGhpbmcuXHJcbiAqXHJcbiAqICAgIEBwYXJhbSB7TGlua2VyUHJlc2V0c30gcHJlc2V0cyAtIEFuIG9iamVjdCBvZiB1c2VyIGRlZmluZWQgV2ljayBvYmplY3RzLlxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGxpZ2h0KHByZXNldHMpIHtcclxuICAgIGlmIChERUJVR0dFUikgY29uc29sZS5sb2cocHJlc2V0cylcclxuXHJcbiAgICBpZiAoTElOS0VSX0xPQURFRCkgcmV0dXJuO1xyXG5cclxuICAgIExJTktFUl9MT0FERUQgPSB0cnVlO1xyXG5cclxuICAgIC8vUGFzcyBpbiB0aGUgcHJlc2V0cyBvciBhIHBsYWluIG9iamVjdCBpZiBwcmVzZXRzIGlzIHVuZGVmaW5lZC5cclxuXHJcbiAgICBsZXQgbGluayA9IG5ldyBMaW5rZXIocHJlc2V0cyB8fCB7fSk7XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcclxuICAgICAgICBsaW5rLmxvYWRQYWdlKFxyXG4gICAgICAgICAgICBsaW5rLmxvYWROZXdQYWdlKGRvY3VtZW50LmxvY2F0aW9uLnBhdGhuYW1lLCBkb2N1bWVudCksXHJcbiAgICAgICAgICAgIG5ldyBXVVJMKGRvY3VtZW50LmxvY2F0aW9uKSxcclxuICAgICAgICAgICAgZmFsc2VcclxuICAgICAgICApO1xyXG4gICAgfSlcclxuXHJcbiAgICBjb25zb2xlLmxvZyhgJHt3aWNrX3Zhbml0eX1Db3B5cmlnaHQgMjAxOCBBbnRob255IEMgV2VhdGhlcnNieVxcbmh0dHBzOi8vZ2l0bGFiLmNvbS9hbnRob255Y3dlYXRoZXJzYnkvd2lja2ApXHJcbn1cclxuXHJcbi8qKiogRXhwb3J0cyAqKiovXHJcblxyXG5leHBvcnQge1xyXG4gICAgVVJMLFxyXG4gICAgQW5pbWF0aW9uLFxyXG4gICAgQXJyYXlNb2RlbENvbnRhaW5lcixcclxuICAgIEJUcmVlTW9kZWxDb250YWluZXIsXHJcbiAgICBNdWx0aUluZGV4ZWRDb250YWluZXIsXHJcbiAgICBDb250cm9sbGVyLFxyXG4gICAgQ3VzdG9tQ2FzZSxcclxuICAgIFJpdmV0LFxyXG4gICAgQ2FzZUNvbnN0cnVjdG9yLFxyXG4gICAgQ2Fzc2V0dGUsXHJcbiAgICBGb3JtLFxyXG4gICAgRmlsdGVyLFxyXG4gICAgQ29tbW9uLFxyXG4gICAgR2V0dGVyLFxyXG4gICAgTGlua2VyLFxyXG4gICAgTW9kZWwsXHJcbiAgICBBbnlNb2RlbCxcclxuICAgIE1vZGVsQ29udGFpbmVyLFxyXG4gICAgU2V0dGVyLFxyXG4gICAgVmlldyxcclxuICAgIGxpZ2h0LFxyXG4gICAgU2NoZW1hVHlwZSxcclxuICAgIHNjaGVtYVxyXG59Il0sIm5hbWVzIjpbInNjaGVtYSIsIkNhc2UiLCJBU1QuUm9vdCIsIkFTVC5UYXBOb2RlIiwiQVNULkZpbHRlck5vZGUiLCJBU1QuVGVybU5vZGUiLCJBU1QuQ2FzZU5vZGUiLCJBU1QuUGlwZU5vZGUiLCJBU1QuR2VuZXJpY05vZGUiLCJFbGVtZW50Il0sIm1hcHBpbmdzIjoiOzs7SUFBQSxJQUFJLFVBQVUsR0FBRztJQUNqQixJQUFJLElBQUks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QUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLEdBQUcsT0FBTztJQUNWLEdBQUc7O0lBRUgsRUFBRSxJQUFJLENBQUMsWUFBWSxLQUFLLEVBQUU7SUFDMUIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixHQUFHO0lBQ0gsRUFBRTs7SUFFRixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQixFQUFFLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNsQixFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNwRCxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNmLEVBQUU7O0lBRUYsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7O0lBRTFELENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFF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RUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO0lBQzNCLEtBQUs7O0lBRUwsSUFBSSxNQUFNLEdBQUc7SUFDYixRQUFRLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7SUFFbkMsUUFBUSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsUUFBUSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsUUFBUSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsUUFBUSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsUUFBUSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsUUFBUSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRTFCLFFBQVEsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNqQyxRQUFRLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDakMsUUFBUSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDL0IsUUFBUSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7O0lBRXZCLFFBQVEsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNqQyxRQUFRLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDakMsUUFBUSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDL0IsUUFBUSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7O0lBRXZCLFFBQVEsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQzVCLFFBQVEsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOztJQUU1QixRQUFRLE9BQU8sRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7SUFDM0IsS0FBSzs7SUFFTCxJQUFJLFdBQVcsR0FBRztJQUNsQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksS0FBSyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQyxRQUFRLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQztJQUN6RixRQUFRLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQztJQUN6RixRQUFRLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0YsUUFBUSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztJQUUzRixRQUFRLE9BQU87SUFDZixZQUFZLEdBQUcsRUFBRTtJQUNqQixnQkFBZ0IsQ0FBQyxFQUFFLEtBQUs7SUFDeEIsZ0JBQWdCLENBQUMsRUFBRSxLQUFLO0lBQ3hCLGFBQWE7SUFDYixZQUFZLEdBQUcsRUFBRTtJQUNqQixnQkFBZ0IsQ0FBQyxFQUFFLEtBQUs7SUFDeEIsZ0JBQWdCLENBQUMsRUFBRSxLQUFLO0lBQ3hCLGFBQWE7SUFDYixTQUFTLENBQUM7SUFDVixLQUFLOztJQUVMLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7SUFDMUIsUUFBUSxLQUFLLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUM7O0lBRXhDLFFBQVEsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDOztJQUV2QyxRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUN2QyxZQUFZLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLFlBQVksSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzVDLFlBQVksU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNwRixZQUFZLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLFNBQVM7O0lBRVQsUUFBUSxPQUFPLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3RDLEtBQUs7O0lBRUwsSUFBSSxVQUFVLEdBQUc7SUFDakIsUUFBUSxPQUFPO0lBQ2YsWUFBWSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDNUQsWUFBWSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDNUQsU0FBUztJQUNULEtBQUs7O0lBRUwsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNkLFFBQVEsSUFBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRTtJQUNuQyxZQUFZLE9BQU8sSUFBSSxPQUFPO0lBQzlCLGdCQUFnQixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUM7SUFDM0IsZ0JBQWdCLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUMzQixnQkFBZ0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDO0lBQzNCLGdCQUFnQixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUM7SUFDM0IsZ0JBQWdCLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUMzQixnQkFBZ0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDO0lBQzNCLGFBQWE7SUFDYixTQUFTO0lBQ1QsS0FBSztJQUNMLENBQUM7O0lDM1FELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDdkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNyQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3ZCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7O0lDS25CO0lBQ0EsU0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFO0lBQ3JCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQyxFQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7Ozs7SUFJRCxTQUFTLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0lBQ2xDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoQixDQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDbkIsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztJQUVoQixDQUFDLE9BQU8sRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMxRSxDQUFDOzs7SUFHRCxNQUFNLE9BQU8sU0FBUyxZQUFZO0lBQ2xDLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7SUFDN0MsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFDOztJQUVWO0lBQ0EsRUFBRSxHQUFHLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBQzNCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNoQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDaEIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNoQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixHQUFHLE9BQU87SUFDVixHQUFHO0lBQ0g7SUFDQSxFQUFFLElBQUksT0FBTyxFQUFFLENBQUMsSUFBSSxRQUFRLEVBQUU7SUFDOUIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNoQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDaEIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNoQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDaEIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNoQixHQUFHLE9BQU87SUFDVixHQUFHOztJQUVILEVBQUUsSUFBSSxFQUFFLFlBQVksS0FBSyxFQUFFO0lBQzNCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkIsR0FBRyxPQUFPO0lBQ1YsR0FBRztJQUNILEVBQUU7O0lBRUYsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7SUFDeEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7SUFDeEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7SUFDeEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7SUFDeEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7SUFDeEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7SUFDeEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7SUFDeEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7O0lBRXhCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsRUFBRSxPQUFPLElBQUksTUFBTTtJQUNuQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2QsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNkLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDZCxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2QsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNkLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDZCxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2QsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNkLEdBQUc7SUFDSCxFQUFFOztJQUVGLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNSLEVBQUUsT0FBTyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RELEVBQUU7O0lBRUYsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ1IsRUFBRSxPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEQsRUFBRTs7SUFFRixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7SUFDVixFQUFFLE9BQU8sSUFBSSxPQUFPO0lBQ3BCLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxHQUFHO0lBQ0gsRUFBRTtJQUNGO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTs7SUFFQSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDcEIsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ3RDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztJQUNyQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7SUFDN0IsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzs7SUFFZCxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDN0IsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDYixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUU7SUFDaEQsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDYixHQUFHLFlBQVksR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDOztJQUV6QztJQUNBLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDOztJQUVsQztJQUNBLEVBQUUsSUFBSSxZQUFZLEdBQUcsQ0FBQyxFQUFFO0lBQ3hCLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNuQixJQUFJLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7SUFDMUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3hDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdEIsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN0QixJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ2xCLEdBQUcsS0FBSyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckMsR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEQsR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEQsR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7SUFDL0IsR0FBRzs7SUFFSDtJQUNBLEVBQUUsSUFBSSxZQUFZLEtBQUssQ0FBQyxFQUFFO0lBQzFCLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0MsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLEdBQUcsS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkIsR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztJQUN4QixHQUFHOztJQUVIO0lBQ0EsRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDOUIsRUFBRSxFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN6QixFQUFFLEVBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLEVBQUUsS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDaEIsRUFBRTs7SUFFRixDQUFDLE1BQU0sR0FBRztJQUNWLEVBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRCxFQUFFOztJQUVGLENBQUMsTUFBTSxHQUFHO0lBQ1YsRUFBRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BELEVBQUU7SUFDRjtJQUNBLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNYLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDNUUsR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDN0MsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbkQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLElBQUksRUFBRTtJQUNsQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO0lBQzFCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0lBQ2QsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRTtJQUMzQixHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRTtJQUNkLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FB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QUMsSUFBSSxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUMxQyxLQUFLO0lBQ0wsQ0FBQzs7SUNyQkQsTUFBTSxLQUFLLFNBQVMsWUFBWTs7SUFFaEMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QixFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUM7O0lBRVYsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNiLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDYixFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7SUFFYixFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUM7SUFDM0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLEdBQUcsSUFBSTtJQUNQLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFDO0lBQ2IsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUM7SUFDYixHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBQztJQUNiLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFDO0lBQ2IsR0FBRztJQUNILEVBQUU7O0lBRUYsQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUNSLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakIsRUFBRTs7SUFFRixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNULEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNkLEVBQUU7O0lBRUYsQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUNSLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakIsRUFBRTs7SUFFRixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNULEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNkLEVBQUU7O0lBRUYsQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUNSLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakIsRUFBRTs7SUFFRixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNULEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNkLEVBQUU7O0lBRUYsQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUNSLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakIsRUFBRTs7SUFFRixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNULEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNkLEVBQUU7O0lBRUYsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQ1gsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDbkIsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDbkIsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDbkIsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxTQUFTLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3JELEVBQUU7O0lBRUYsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQ1gsRUFBRSxPQUFPLElBQUksS0FBSztJQUNsQixHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDbkIsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ25CLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNuQixHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDbkIsR0FBRztJQUNILEVBQUU7O0lBRUYsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ1osRUFBRSxHQUFHLE9BQU8sS0FBSyxDQUFDLElBQUksUUFBUSxDQUFDO0lBQy9CLEdBQUcsT0FBTyxJQUFJLEtBQUs7SUFDbkIsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUs7SUFDbEIsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUs7SUFDbEIsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUs7SUFDbEIsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUs7SUFDbEIsSUFBSTtJQUNKLEdBQUcsSUFBSTtJQUNQLEdBQUcsT0FBTyxJQUFJLEtBQUs7SUFDbkIsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQ3BCLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztJQUNwQixJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDcEIsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQ3BCLElBQUk7SUFDSixHQUFHO0lBQ0gsRUFBRTs7SUFFRixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDWCxFQUFFLE9BQU8sSUFBSSxLQUFLO0lBQ2xCLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztJQUNwQixJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDcEIsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQ3BCLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztJQUNwQixHQUFHO0lBQ0gsRUFBRTs7SUFFRixDQUFDLFFBQVEsRUFBRTtJQUNYLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLEVBQUU7O0lBRUYsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQ25CO0lBQ0EsRUFBRSxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFDOztJQUV6QixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2QsRUFBRSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSTs7O0lBR3pCLEdBQUcsS0FBSyxLQUFLO0lBQ2IsSUFBSSxLQUFLLENBQUMsSUFBSSxHQUFFO0lBQ2hCLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFDO0lBQ25DLElBQUksS0FBSyxDQUFDLElBQUksR0FBRTtJQUNoQixJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBQztJQUNuQyxJQUFJLEtBQUssQ0FBQyxJQUFJLEdBQUU7SUFDaEIsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUM7SUFDbkMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLEdBQUcsTUFBTTs7SUFFVCxHQUFHLEtBQUssTUFBTTtJQUNkLElBQUksS0FBSyxDQUFDLElBQUksR0FBRTtJQUNoQixJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBQztJQUNuQyxJQUFJLEtBQUssQ0FBQyxJQUFJLEdBQUU7SUFDaEIsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUM7SUFDbkMsSUFBSSxLQUFLLENBQUMsSUFBSSxHQUFFO0lBQ2hCLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFDO0lBQ25DLElBQUksS0FBSyxDQUFDLElBQUksR0FBRTtJQUNoQixJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBQztJQUNyQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLEdBQUcsTUFBTTs7SUFFVCxHQUFHLEtBQUssR0FBRztJQUNYLElBQUksSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQztJQUNsQyxHQUFHLE1BQU07O0lBRVQsR0FBRzs7SUFFSCxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDM0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN6RSxHQUFHLE1BQU07SUFDVCxHQUFHO0lBQ0gsRUFBRTtJQUNGLENBQUM7O0lBRUQsS0FBSyxDQUFDLE1BQU0sR0FBRztJQUNmLENBQUMsYUFBYSxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQztJQUNqRCxDQUFDLE9BQU8sR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUM7SUFDM0MsQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDN0IsQ0FBQyxPQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDL0IsQ0FBQyxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUM7SUFDOUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDakMsRUFBRSxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDakMsRUFBRSxLQUFLLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDNUIsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDNUIsRUFBRSxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEMsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDOUIsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDOUIsRUFBRSxTQUFTLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDakMsRUFBRSxTQUFTLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDakMsRUFBRSxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDbEMsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDaEMsRUFBRSxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDL0IsRUFBRSxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDN0IsRUFBRSxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDaEMsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDOUIsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDNUIsRUFBRSxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUIsRUFBRSxVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsRUFBRSxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDL0IsRUFBRSxXQUFXLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDbkMsRUFBRSxTQUFTLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDakMsRUFBRSxLQUFLLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsRUFBRSxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDaEMsRUFBRSxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7SUFDaEMsRUFBRSxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDcEMsRUFBRSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDdkMsRUFBRSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDdkMsRUFBRSxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDbEMsRUFBRSxjQUFjLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDeEMsRUFBRSxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbkMsRUFBRSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDckMsRUFBRSxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEMsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDOUIsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUMxQyxFQUFFLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUNyQyxFQUFFLGlCQUFpQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxH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QUFHLENBQUM7SUFDckMsRUFBRSxtQkFBbUIsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUM3QyxFQUFFLGVBQWUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN6QyxFQUFFLGNBQWMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUN0QyxFQUFFLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNyQyxFQUFFLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUN0QyxFQUFFLGVBQWUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUN4QyxFQUFFLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNoQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNuQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNoQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNsQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNqQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNqQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNsQyxFQUFFLG1CQUFtQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQzVDLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDM0MsRUFBRSxXQUFXLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDcEMsRUFBRSxVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDcEMsRUFBRSxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDdEMsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDaEMsRUFBRSxlQUFlLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDekMsRUFBRSxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDakMsRUFBRSxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDbEMsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUMzQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNqQyxFQUFFLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNyQyxFQUFFLGVBQWUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN6QyxFQUFFLHlCQUF5QixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ25ELEVBQUUsY0FBYyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3hDLEVBQUUsY0FBYyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQ3RDLEVBQUUsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQ2hDLEVBQUUsV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0lBQ3BDLEVBQUUsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0lBQy9CLEVBQUUsYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0lBQ3RDLEVBQUUsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3RDLEVBQUUsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQy9CLEVBQUUsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3RDLEVBQUUsVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3BDLEVBQUUsY0FBYyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3hDLEVBQUUsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3RDLEVBQUUsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3RDLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDMUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDakMsRUFBRSxVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDcEMsRUFBRSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDdkMsRUFBRSxXQUFXLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDckMsRUFBRSxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDdEMsRUFBRSxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDdEMsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUM1QyxFQUFFLGtCQUFrQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQzVDLEVBQUUsVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3BDLEVBQUUsY0FBYyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3hDLEVBQUUsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3RDLEVBQUUsYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3ZDLEVBQUUsVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3BDLEVBQUUsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2pDLEVBQUUsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2pDLEVBQUUsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2hDLEVBQUUsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNCLEVBQUUsVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3BDLEVBQUUsVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3BDLEVBQUUsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2hDLEVBQUUsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2hDLEVBQUUsV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3JDLEVBQUUsV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3JDLEVBQUUsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2xDLEVBQUUsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3RDLEVBQUUsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3RDLEVBQUUsV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENB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
