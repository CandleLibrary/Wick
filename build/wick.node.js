'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ljay5ub2RlLmpzIiwic291cmNlcyI6WyIuLi9zb3VyY2UvY29tbW9uL3N0cmluZ19wYXJzaW5nL2xleGVyLmpzIiwiLi4vc291cmNlL2NvbW1vbi9zdHJpbmdfcGFyc2luZy90b2tlbml6ZXIuanMiLCIuLi9zb3VyY2UvY29tbW9uL3VybC91cmwuanMiLCIuLi9zb3VyY2UvbGlua2VyL3d1cmwuanMiLCIuLi9zb3VyY2Uvdmlldy5qcyIsIi4uL3NvdXJjZS9zY2hlZHVsZXIuanMiLCIuLi9zb3VyY2UvbW9kZWwvbW9kZWxfYmFzZS5qcyIsIi4uL3NvdXJjZS9zY2hlbWEvc2NoZW1hX3R5cGUuanMiLCIuLi9zb3VyY2UvbW9kZWwvbW9kZWxfY29udGFpbmVyLmpzIiwiLi4vc291cmNlL21vZGVsL2FycmF5X2NvbnRhaW5lci5qcyIsIi4uL3NvdXJjZS9tb2RlbC9idHJlZV9jb250YWluZXIuanMiLCIuLi9zb3VyY2Uvc2NoZW1hL251bWJlcl90eXBlLmpzIiwiLi4vc291cmNlL2NvbW1vbi9kYXRlX3RpbWUvbW9udGhzLmpzIiwiLi4vc291cmNlL2NvbW1vbi9kYXRlX3RpbWUvZGF5c19vZl93ZWVrLmpzIiwiLi4vc291cmNlL2NvbW1vbi9kYXRlX3RpbWUvZGF5X3N0YXJ0X2FuZF9lbmRfZXBvY2guanMiLCIuLi9zb3VyY2UvY29tbW9uL2RhdGVfdGltZS90aW1lLmpzIiwiLi4vc291cmNlL2NvbW1vbi9tYXRoL3BvaW50MkQuanMiLCIuLi9zb3VyY2UvY29tbW9uL21hdGgvcXVhZHJhdGljX2Jlemllci5qcyIsIi4uL3NvdXJjZS9jb21tb24vbWF0aC9jb25zdHMuanMiLCIuLi9zb3VyY2UvY29tbW9uL21hdGgvY3ViaWNfYmV6aWVyLmpzIiwiLi4vc291cmNlL2NvbW1vbi9ldmVudC90b3VjaF9zY3JvbGxlci5qcyIsIi4uL3NvdXJjZS9jb21tb24uanMiLCIuLi9zb3VyY2Uvc2NoZW1hL2RhdGVfdHlwZS5qcyIsIi4uL3NvdXJjZS9zY2hlbWEvdGltZV90eXBlLmpzIiwiLi4vc291cmNlL3NjaGVtYS9zdHJpbmdfdHlwZS5qcyIsIi4uL3NvdXJjZS9zY2hlbWEvYm9vbF90eXBlLmpzIiwiLi4vc291cmNlL3NjaGVtYS9zY2hlbWFzLmpzIiwiLi4vc291cmNlL21vZGVsL21vZGVsLmpzIiwiLi4vc291cmNlL2NvbnRyb2xsZXIuanMiLCIuLi9zb3VyY2UvZ2V0dGVyLmpzIiwiLi4vc291cmNlL3NldHRlci5qcyIsIi4uL3NvdXJjZS9saW5rZXIvcGFnZS5qcyIsIi4uL3NvdXJjZS9saW5rZXIvc2V0bGlua3MuanMiLCIuLi9zb3VyY2UvYW5pbWF0aW9uL2NvbG9yLmpzIiwiLi4vc291cmNlL2FuaW1hdGlvbi90cmFuc2Zvcm10by5qcyIsIi4uL3NvdXJjZS9hbmltYXRpb24vYW5pbWF0aW9uLmpzIiwiLi4vc291cmNlL2FuaW1hdGlvbi90cmFuc2l0aW9uL3RyYW5zaXRpb25lZXIuanMiLCIuLi9zb3VyY2UvY2FzZS9yaXZldC5qcyIsIi4uL3NvdXJjZS9saW5rZXIvY29tcG9uZW50LmpzIiwiLi4vc291cmNlL2Nhc2UvY2Fzc2V0dGUvY2Fzc2V0dGUuanMiLCIuLi9zb3VyY2UvY2FzZS9jYXNlLmpzIiwiLi4vc291cmNlL2Nhc2UvY2Fzc2V0dGUvZmlsdGVyLmpzIiwiLi4vc291cmNlL2Nhc2UvY2FzZV90ZW1wbGF0ZS5qcyIsIi4uL3NvdXJjZS9jYXNlL2Nhc2Vfc2tlbGV0b24uanMiLCIuLi9zb3VyY2UvZ2xvYmFsLmpzIiwiLi4vc291cmNlL2Nhc2UvY2Fzc2V0dGUvaW5wdXQuanMiLCIuLi9zb3VyY2UvY2FzZS9jYXNzZXR0ZS9mb3JtLmpzIiwiLi4vc291cmNlL2Nhc2UvdGFwcy90YXAuanMiLCIuLi9zb3VyY2UvY2FzZS9waXBlcy9waXBlLmpzIiwiLi4vc291cmNlL2Nhc2UvaW8vaW8uanMiLCIuLi9zb3VyY2UvY2FzZS9jYXNlX2NvbnN0cnVjdG9yX2FzdC5qcyIsIi4uL3NvdXJjZS9jYXNlL2Nhc2VfY29uc3RydWN0b3IuanMiLCIuLi9zb3VyY2UvbGlua2VyL2VsZW1lbnQuanMiLCIuLi9zb3VyY2UvbGlua2VyL2xpbmtlci5qcyIsIi4uL3NvdXJjZS93aWNrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBudWxsX3Rva2VuID0ge1xyXG4gICAgdHlwZTogXCJcIixcclxuICAgIHRleHQ6IFwiXCJcclxufTtcclxuXHJcbmNsYXNzIExleGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHRva2VuaXplcikge1xyXG4gICAgICAgIHRoaXMudGsgPSB0b2tlbml6ZXI7XHJcblxyXG4gICAgICAgIHRoaXMudG9rZW4gPSB0b2tlbml6ZXIubmV4dCgpO1xyXG5cclxuICAgICAgICB0aGlzLmhvbGQgPSBudWxsO1xyXG5cclxuICAgICAgICB3aGlsZSAodGhpcy50b2tlbiAmJiAodGhpcy50b2tlbi50eXBlID09PSBcIm5ld19saW5lXCIgfHwgdGhpcy50b2tlbi50eXBlID09PSBcIndoaXRlX3NwYWNlXCIgfHwgdGhpcy50b2tlbi50eXBlID09PSBcImdlbmVyaWNcIikpIHtcclxuICAgICAgICAgICAgdGhpcy50b2tlbiA9IHRoaXMudGsubmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpe1xyXG4gICAgICAgIHRoaXMudGsucmVzZXQoKTtcclxuICAgICAgICB0aGlzLnRva2VuID0gdGhpcy50ay5uZXh0KCk7XHJcbiAgICAgICAgdGhpcy5ob2xkID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhvbGQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50b2tlbiA9IHRoaXMuaG9sZDtcclxuICAgICAgICAgICAgdGhpcy5ob2xkID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMudG9rZW4pIHJldHVybiBudWxsO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgdGhpcy50b2tlbiA9IHRoaXMudGsubmV4dCgpO1xyXG4gICAgICAgIH0gd2hpbGUgKHRoaXMudG9rZW4gJiYgKHRoaXMudG9rZW4udHlwZSA9PT0gXCJuZXdfbGluZVwiIHx8IHRoaXMudG9rZW4udHlwZSA9PT0gXCJ3aGl0ZV9zcGFjZVwiIHx8IHRoaXMudG9rZW4udHlwZSA9PT0gXCJnZW5lcmljXCIpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudG9rZW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGFzc2VydCh0ZXh0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnRva2VuKSB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGluZyAke3RleHR9IGdvdCBudWxsYCk7XHJcblxyXG4gICAgICAgIHZhciBib29sID0gdGhpcy50b2tlbi50ZXh0ID09IHRleHQ7XHJcblxyXG5cclxuICAgICAgICBpZiAoYm9vbCkge1xyXG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RpbmcgXCIke3RleHR9XCIgZ290IFwiJHt0aGlzLnRva2VuLnRleHR9XCJgKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGJvb2w7XHJcbiAgICB9XHJcblxyXG4gICAgcGVlaygpIHtcclxuICAgICAgICBpZiAodGhpcy5ob2xkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhvbGQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmhvbGQgPSB0aGlzLnRrLm5leHQoKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmhvbGQpIHJldHVybiBudWxsX3Rva2VuO1xyXG5cclxuICAgICAgICB3aGlsZSAodGhpcy5ob2xkICYmICh0aGlzLmhvbGQudHlwZSA9PT0gXCJuZXdfbGluZVwiIHx8IHRoaXMuaG9sZC50eXBlID09PSBcIndoaXRlX3NwYWNlXCIgfHwgdGhpcy5ob2xkLnR5cGUgPT09IFwiZ2VuZXJpY1wiKSkge1xyXG4gICAgICAgICAgICB0aGlzLmhvbGQgPSB0aGlzLnRrLm5leHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmhvbGQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaG9sZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsX3Rva2VuO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0ZXh0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnRva2VuKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbi50ZXh0O1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0eXBlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnRva2VuKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbi50eXBlO1xyXG4gICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwb3MoKXtcclxuICAgICAgICBpZiAodGhpcy50b2tlbilcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW4ucG9zO1xyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcbiAgICBzbGljZShzdGFydCkge1xyXG4gICAgICAgIGlmICh0aGlzLnRva2VuKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ay5zdHJpbmcuc2xpY2Uoc3RhcnQsIHRoaXMudG9rZW4ucG9zKVxyXG4gICAgICAgIHJldHVybiB0aGlzLnRrLnN0cmluZy5zbGljZShzdGFydClcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHsgTGV4ZXIgfSIsIi8vQ29tcGFyZXMgY29kZSB3aXRoIGFyZ3VtZW50IGxpc3QgYW5kIHJldHVybnMgdHJ1ZSBpZiBtYXRjaCBpcyBmb3VuZCwgb3RoZXJ3aXNlIGZhbHNlIGlzIHJldHVybmVkXHJcbmZ1bmN0aW9uIGNvbXBhcmVDb2RlKGNvZGUpIHtcclxuICAgIHZhciBsaXN0ID0gYXJndW1lbnRzO1xyXG4gICAgZm9yICh2YXIgaSA9IDEsIGwgPSBsaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChsaXN0W2ldID09PSBjb2RlKSByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLy9SZXR1cm5zIHRydWUgaWYgY29kZSBsaWVzIGJldHdlZW4gdGhlIG90aGVyIHR3byBhcmd1bWVudHNcclxuZnVuY3Rpb24gaW5SYW5nZShjb2RlKSB7XHJcbiAgICByZXR1cm4gKGNvZGUgPiBhcmd1bWVudHNbMV0gJiYgY29kZSA8IGFyZ3VtZW50c1syXSk7XHJcbn1cclxuXHJcbi8vVGhlIHJlc3VsdGluZyBhcnJheSBpcyB1c2VkIHdoaWxlIHBhcnNpbmcgYW5kIHRva2VuaXppbmcgdG9rZW4gc3RyaW5nc1xyXG52YXIgc3RyaW5nX3BhcnNlX2FuZF9mb3JtYXRfZnVuY3Rpb25zID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGFycmF5ID0gW3tcclxuICAgICAgICAgICAgdHlwZTogXCJudW1iZXJcIixcclxuICAgICAgICAgICAgLy9Jbml0aWFsIGNoZWNrIGZ1bmN0aW9uLiBSZXR1cm4gaW5kZXggb2Zmc2V0IHRvIHN0YXJ0IGZvciBzY2FuLiBJZiAwIGlzIHJldHVybmVkIHRoZW4gdGhlIHBhcnNlciB3aWxsIG1vdmUgb24gdG8gdGhlIG5leHQgY2hlY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgY2hlY2soY29kZSwgdGV4dCwgb2Zmc2V0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5SYW5nZShjb2RlLCA0NywgNTgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29kZSA9IHRleHQuY2hhckNvZGVBdCgxICsgb2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGFyZUNvZGUoY29kZSwgNjYsIDk4LCA4OCwgMTIwLCA3OSwgMTExKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPT0gNDYpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2RlID0gdGV4dC5jaGFyQ29kZUF0KDEgKyBvZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpblJhbmdlKGNvZGUsIDQ3LCA1OCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChpblJhbmdlKGNvZGUsIDQ3LCA1OCkgfHwgY29kZSA9PT0gNDYpID8gLTEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLmNvbG9yID0gXCJyZ2IoMjAsNDAsMTgwKVwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJpZGVudGlmaWVyXCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoaW5SYW5nZShjb2RlLCA2NCwgOTEpIHx8IGluUmFuZ2UoY29kZSwgOTYsIDEyMykpID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChpblJhbmdlKGNvZGUsIDQ3LCA1OCkgfHwgaW5SYW5nZShjb2RlLCA2NCwgOTEpIHx8IGluUmFuZ2UoY29kZSwgOTYsIDEyMykgfHwgY29tcGFyZUNvZGUoY29kZSwgMzUsIDM2LCA0NSwgOTUpKSA/IC0xIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy90b2tlbi5jb2xvciA9IHJhbmRvbUNvbG9yKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwvKiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tbWVudFwiLFxyXG4gICAgICAgICAgICAvL0luaXRpYWwgY2hlY2sgZnVuY3Rpb24uIFJldHVybiBpbmRleCBvZmZzZXQgdG8gc3RhcnQgZm9yIHNjYW4uIElmIDAgaXMgcmV0dXJuZWQgdGhlbiB0aGUgcGFyc2VyIHdpbGwgbW92ZSBvbiB0byB0aGUgbmV4dCBjaGVjayBmdW5jdGlvblxyXG4gICAgICAgICAgICBjaGVjayhjb2RlLCB0ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKChjb2RlID09PSA0NykgJiYgKHRleHQuY2hhckNvZGVBdCgxKSA9PT0gNDcpKSA/IDIgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoaW5SYW5nZShjb2RlLCAzMiwgMTI4KSB8fCBjb2RlID09PSAzMiB8fCBjb2RlID09PSA5KSA/IC0xIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRva2VuKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sICove1xyXG4gICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxyXG4gICAgICAgICAgICAvL0luaXRpYWwgY2hlY2sgZnVuY3Rpb24uIFJldHVybiBpbmRleCBvZmZzZXQgdG8gc3RhcnQgZm9yIHNjYW4uIElmIDAgaXMgcmV0dXJuZWQgdGhlbiB0aGUgcGFyc2VyIHdpbGwgbW92ZSBvbiB0byB0aGUgbmV4dCBjaGVjayBmdW5jdGlvblxyXG4gICAgICAgICAgICBjaGVjayhjb2RlLCB0ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGNvZGUgPT09IDM0KSA/IDEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoY29kZSA9PT0gMzQpID8gMSA6IC0xO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRva2VuKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJ3aGl0ZV9zcGFjZVwiLFxyXG4gICAgICAgICAgICAvL0luaXRpYWwgY2hlY2sgZnVuY3Rpb24uIFJldHVybiBpbmRleCBvZmZzZXQgdG8gc3RhcnQgZm9yIHNjYW4uIElmIDAgaXMgcmV0dXJuZWQgdGhlbiB0aGUgcGFyc2VyIHdpbGwgbW92ZSBvbiB0byB0aGUgbmV4dCBjaGVjayBmdW5jdGlvblxyXG4gICAgICAgICAgICBjaGVjayhjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGNvZGUgPT09IDMyIHx8IGNvZGUgPT09IDkpID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChjb2RlID09PSAzMiB8fCBjb2RlID09PSA5KSA/IC0xIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRva2VuKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJuZXdfbGluZVwiLFxyXG4gICAgICAgICAgICAvL0luaXRpYWwgY2hlY2sgZnVuY3Rpb24uIFJldHVybiBpbmRleCBvZmZzZXQgdG8gc3RhcnQgZm9yIHNjYW4uIElmIDAgaXMgcmV0dXJuZWQgdGhlbiB0aGUgcGFyc2VyIHdpbGwgbW92ZSBvbiB0byB0aGUgbmV4dCBjaGVjayBmdW5jdGlvblxyXG4gICAgICAgICAgICBjaGVjayhjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGNvZGUgPT09IDEwKSA/IDEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9rZW4pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwib3Blbl9icmFja2V0XCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wYXJlQ29kZShjb2RlLCAxMjMsIDQwLCA5MSkgPyAxIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvL1NpbmdsZSBjaGFyYWN0ZXIsIGVuZCBjb21lcyBpbW1lZGlhdGx5XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi5jb2xvciA9IFwicmdiKDEwMCwxMDAsMTAwKVwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJjbG9zZV9icmFja2V0XCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wYXJlQ29kZShjb2RlLCAxMjUsIDQxLCA5MykgPyAxIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvL1NpbmdsZSBjaGFyYWN0ZXIsIGVuZCBjb21lcyBpbW1lZGlhdGx5XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi5jb2xvciA9IFwicmdiKDEwMCwxMDAsMTAwKVwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogXCJPcGVyYXRvclwiLFxyXG4gICAgICAgICAgICAvL0luaXRpYWwgY2hlY2sgZnVuY3Rpb24uIFJldHVybiBpbmRleCBvZmZzZXQgdG8gc3RhcnQgZm9yIHNjYW4uIElmIDAgaXMgcmV0dXJuZWQgdGhlbiB0aGUgcGFyc2VyIHdpbGwgbW92ZSBvbiB0byB0aGUgbmV4dCBjaGVjayBmdW5jdGlvblxyXG4gICAgICAgICAgICBjaGVjayhjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcGFyZUNvZGUoY29kZSwgNDIsIDQzLCA2MCwgNjEsIDYyLCA5MiwgMzgsIDM3LCAzMywgOTQsIDEyNCwgNTgpID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgLy9TaW5nbGUgY2hhcmFjdGVyLCBlbmQgY29tZXMgaW1tZWRpYXRseVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4uY29sb3IgPSBcInJnYigyMDUsMTIwLDApXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcIlN5bWJvbFwiLCAvL0V2ZXJ5dGhpbmcgZWxzZSBzaG91bGQgYmUgZ2VuZXJpYyBzeW1ib2xzXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIC8vR2VuZXJpYyB3aWxsIGNhcHR1cmUgQU5ZIHJlbWFpbmRlciBjaGFyYWN0ZXIgc2V0cy5cclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLmNvbG9yID0gXCJyZWRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIF07XHJcblxyXG4gICAgLy9UaGlzIGFsbG93cyBmb3IgY3JlYXRpb24gY3VzdG9tIHBhcnNlcnMgYW5kIGZvcm1hdHRlcnMgYmFzZWQgdXBvbiB0aGlzIG9iamVjdC5cclxuICAgIGFycmF5LmNsb25lID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmluZ19wYXJzZV9hbmRfZm9ybWF0X2Z1bmN0aW9ucygpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gYXJyYXk7XHJcbn0pO1xyXG5cclxudmFyIFNQRiA9IHN0cmluZ19wYXJzZV9hbmRfZm9ybWF0X2Z1bmN0aW9ucygpO1xyXG52YXIgU1BGX2xlbmd0aCA9IFNQRi5sZW5ndGg7XHJcblxyXG5jbGFzcyBUb2tlbml6ZXIge1xyXG4gICAgY29uc3RydWN0b3Ioc3RyaW5nKSB7XHJcbiAgICBcdHRoaXMuaCA9IG51bGw7XHJcblx0ICAgIHRoaXMubGluZSA9IDA7XHJcblx0ICAgIHRoaXMuY2hhciA9IDA7XHJcblx0ICAgIHRoaXMub2Zmc2V0ID0gMDtcclxuXHQgICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXQoKXtcclxuICAgICAgICB0aGlzLmxpbmUgPSAwO1xyXG4gICAgICAgIHRoaXMuY2hhciA9IDA7XHJcbiAgICAgICAgdGhpcy5vZmZzZXQgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGhvbGQodG9rZW4pIHtcclxuICAgICAgICB0aGlzLmggPSB0b2tlbjtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KCkge1xyXG5cclxuICAgICAgICB2YXIgdG9rZW5fbGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaCkge1xyXG4gICAgICAgICAgICB2YXIgdCA9IHRoaXMuaDtcclxuICAgICAgICAgICAgdGhpcy5oID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zdHJpbmcubGVuZ3RoIDwgMSkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGxldCBvZmZzZXQgPSB0aGlzLm9mZnNldDtcclxuICAgICAgICBcclxuICAgICAgICBpZiAob2Zmc2V0ID49IHRoaXMuc3RyaW5nLmxlbmd0aCkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIHZhciBjb2RlID0gdGhpcy5zdHJpbmcuY2hhckNvZGVBdChvZmZzZXQpO1xyXG4gICAgICAgIGxldCBTUEZfZnVuY3Rpb247XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBTUEZfbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgU1BGX2Z1bmN0aW9uID0gU1BGW2ldO1xyXG4gICAgICAgICAgICBsZXQgdGVzdF9pbmRleCA9IFNQRl9mdW5jdGlvbi5jaGVjayhjb2RlLCB0aGlzLnN0cmluZywgb2Zmc2V0KTtcclxuICAgICAgICAgICAgaWYgKHRlc3RfaW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSBTUEZfZnVuY3Rpb24udHlwZTtcclxuICAgICAgICAgICAgICAgIHZhciBlID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IHRlc3RfaW5kZXg7IGkgPCB0aGlzLnN0cmluZy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGUgPSBTUEZfZnVuY3Rpb24uc2NhblRvRW5kKHRoaXMuc3RyaW5nLmNoYXJDb2RlQXQoaSArIG9mZnNldCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlID4gLTEpIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGUgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdG9rZW5fbGVuZ3RoID0gaSArIGU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHRlbXAgPSB0aGlzLnN0cmluZy5zbGljZShvZmZzZXQsIG9mZnNldCArIHRva2VuX2xlbmd0aCk7XHJcblxyXG4gICAgICAgIGlmIChTUEZfZnVuY3Rpb24udHlwZSA9PT0gXCJuZXdfbGluZVwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhciA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMubGluZSsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG91dCA9IHtcclxuICAgICAgICAgICAgdHlwZTogU1BGX2Z1bmN0aW9uLnR5cGUsXHJcbiAgICAgICAgICAgIHRleHQ6IHRlbXAsXHJcbiAgICAgICAgICAgIHBvczogdGhpcy5vZmZzZXQsXHJcbiAgICAgICAgICAgIGxlbmd0aDogdG9rZW5fbGVuZ3RoLFxyXG4gICAgICAgICAgICBjaGFyOiB0aGlzLmNoYXIsXHJcbiAgICAgICAgICAgIGxpbmU6IHRoaXMubGluZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub2Zmc2V0ICs9IHRva2VuX2xlbmd0aDtcclxuICAgICAgICB0aGlzLmNoYXIgKz0gdG9rZW5fbGVuZ3RoO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1Rva2VuaXplcn1cclxuIiwiaW1wb3J0IHtMZXhlcn0gZnJvbSBcIi4uL3N0cmluZ19wYXJzaW5nL2xleGVyXCJcclxuaW1wb3J0IHtUb2tlbml6ZXJ9IGZyb20gXCIuLi9zdHJpbmdfcGFyc2luZy90b2tlbml6ZXJcIlxyXG5cclxuLyoqXHJcblVSTCBRdWVyeSBTeW50YXhcclxuXHJcbnJvb3QgPT4gW3Jvb3RfY2xhc3NdIFsmIFtjbGFzc2VzXV1cclxuICAgICA9PiBbY2xhc3Nlc11cclxuXHJcbnJvb3RfY2xhc3MgPSBrZXlfbGlzdFxyXG5cclxuY2xhc3NfbGlzdCBbY2xhc3MgWyYgY2xhc3NfbGlzdF1dXHJcblxyXG5jbGFzcyA9PiBuYW1lICYga2V5X2xpc3RcclxuXHJcbmtleV9saXN0ID0+IFtrZXlfdmFsIFsmIGtleV9saXN0XV1cclxuXHJcbmtleV92YWwgPT4gbmFtZSA9IHZhbFxyXG5cclxubmFtZSA9PiBBTFBIQU5VTUVSSUNfSURcclxuXHJcbnZhbCA9PiBOVU1CRVJcclxuICAgID0+IEFMUEhBTlVNRVJJQ19JRFxyXG4qL1xyXG5mdW5jdGlvbiBRdWVyeVN0cmluZ1RvUXVlcnlNYXAocXVlcnkpe1xyXG5cclxuICBsZXQgbWFwcGVkX29iamVjdCA9IG5ldyBNYXA7XHJcblxyXG4gIGlmKCFxdWVyeSBpbnN0YW5jZW9mIFN0cmluZyl7XHJcbiAgICBjb25zb2xlLndhcm4oXCJxdWVyeSBhcmd1bWVudCBwcm92aWRlZCBpcyBub3QgYSBzdHJpbmchXCIpXHJcbiAgICByZXR1cm4gbWFwcGVkX29iamVjdDtcclxuICB9XHJcblxyXG4gIGlmKHF1ZXJ5WzBdID09IFwiP1wiKSBxdWVyeSA9IHF1ZXJ5LnNsaWNlKDEpO1xyXG5cclxuICBsZXQgbGV4ID0gbmV3IExleGVyKG5ldyBUb2tlbml6ZXIocXVlcnkpKTtcclxuXHJcbiAgZnVuY3Rpb24ga2V5X3ZhbF9saXN0KGxleCwgbWFwKXtcclxuICAgIGxldCB0b2tlbjtcclxuICAgIHdoaWxlKCh0b2tlbiA9IGxleC50b2tlbikgJiYgdG9rZW4udGV4dCAhPT0gXCImXCIpe1xyXG4gICAgICBpZihsZXgucGVlaygpLnRleHQgPT0gXCI9XCIpe1xyXG4gICAgICAgIGxldCBrZXkgPSB0b2tlbi50ZXh0O1xyXG4gICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICBsZXQgdmFsID0gbGV4LnRva2VuO1xyXG4gICAgICAgIG1hcC5zZXQoa2V5LCAodmFsLnR5cGUgPT0gXCJudW1iZXJcIik/cGFyc2VGbG9hdCh2YWwudGV4dCk6dmFsLnRleHQpO1xyXG4gICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjbGFzc18obGV4LCBtYXApe1xyXG5cclxuICAgIGxldCB0b2tlbjtcclxuXHJcbiAgICBpZigodG9rZW4gPSBsZXgucGVlaygpKSAmJiB0b2tlbi50ZXh0ID09IFwiJlwiKXtcclxuXHJcbiAgICAgIHRva2VuID0gbGV4LnRva2VuO1xyXG5cclxuICAgICAgbGV4Lm5leHQoKTtsZXgubmV4dCgpO1xyXG4gICAgICBtYXAuc2V0KHRva2VuLnRleHQsIG5ldyBNYXAoKSk7XHJcbiAgICAgIGtleV92YWxfbGlzdChsZXgsbWFwLmdldCh0b2tlbi50ZXh0KSk7XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByb290KGxleCxtYXApe1xyXG4gICAgICAgbWFwLnNldChudWxsLCBuZXcgTWFwKCkpO1xyXG5cclxuICAgICAgaWYobGV4LnBlZWsoKS50ZXh0ID09IFwiJlwiKXtcclxuICAgICAgICAgIGNsYXNzXyhsZXgsIG1hcClcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBrZXlfdmFsX2xpc3QobGV4LCBtYXAuZ2V0KG51bGwpKTtcclxuICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgd2hpbGUobGV4LnRva2VuICYmIGxleC50b2tlbi50ZXh0ID09XCImXCIpe1xyXG4gICAgICBsZXgubmV4dCgpO1xyXG4gICAgICBjbGFzc18obGV4LCBtYXApXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByb290KGxleCwgbWFwcGVkX29iamVjdCk7XHJcbiAgcmV0dXJuIG1hcHBlZF9vYmplY3Q7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFF1ZXJ5TWFwVG9RdWVyeVN0cmluZyhtYXApe1xyXG4gICAgbGV0IGNsYXNzXywgbnVsbF9jbGFzcyxzdHIgPVwiXCI7XHJcbiAgICBpZigobnVsbF9jbGFzcyA9IG1hcC5nZXQobnVsbCkpKXtcclxuICAgICAgICBpZihudWxsX2NsYXNzLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICBmb3IobGV0IFtrZXksdmFsXSBvZiBudWxsX2NsYXNzLmVudHJpZXMoKSl7XHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gYCYke2tleX09JHt2YWx9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IFtrZXksY2xhc3NfXSBvZiBtYXAuZW50cmllcygpKXtcclxuICAgICAgICAgICAgaWYoa2V5ID09IG51bGwpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBzdHIgKz0gYCYke2tleX1gXHJcbiAgICAgICAgICAgIGZvcihsZXQgW2tleSx2YWxdIG9mIGNsYXNzXy5lbnRyaWVzKCkpe1xyXG4gICAgICAgICAgICAgICAgc3RyICs9IGAmJHtrZXl9PSR7dmFsfWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0ci5zbGljZSgxKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzdHI7XHJcbn1cclxuZnVuY3Rpb24gVHVybkRhdGFJbnRvUXVlcnkoZGF0YSkge1xyXG4gICAgdmFyIHN0ciA9IFwiXCI7XHJcblxyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBhcmd1bWVudHNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF0YS5jb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdfc3RyID0gYCR7ZGF0YS5jb21wb25lbnR9JmA7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIG5ld19zdHIgKz0gKGEgIT0gXCJjb21wb25lbnRcIikgPyBgJHthfT0ke2RhdGFbYV19XFwmYCA6IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RyICs9IG5ld19zdHIuc2xpY2UoMCwgLTEpICsgXCIuXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBlbHNlXHJcbiAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKVxyXG4gICAgICAgICAgICBzdHIgKz0gYCR7YX09JHtkYXRhW2FdfVxcJmA7XHJcblxyXG4gICAgcmV0dXJuIHN0ci5zbGljZSgwLCAtMSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFR1cm5RdWVyeUludG9EYXRhKHF1ZXJ5KSB7XHJcbiAgICB2YXIgb3V0ID0ge307XHJcblxyXG4gICAgbGV0IHQgPSBxdWVyeS5zcGxpdChcIi5cIik7XHJcblxyXG4gICAgaWYgKHQubGVuZ3RoID4gMClcclxuICAgICAgICB0LmZvckVhY2goKGEpID0+IHtcclxuICAgICAgICAgICAgdmFyIHQgPSB7fTtcclxuICAgICAgICAgICAgaWYgKGEubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgYS5zcGxpdChcIiZcIikuZm9yRWFjaCgoYSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpIDwgMSkgb3V0W2FdID0gdDtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGIgPSBhLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0W2JbMF1dID0gYlsxXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHF1ZXJ5LnNwbGl0KFwiJlwiKS5mb3JFYWNoKChhKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBiID0gYS5zcGxpdChcIj1cIik7XHJcbiAgICAgICAgICAgIG91dFtiWzBdXSA9IGJbMV1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJldHVybiBvdXQ7XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBUdXJuUXVlcnlJbnRvRGF0YSxcclxuICAgIFR1cm5EYXRhSW50b1F1ZXJ5LFxyXG4gICAgUXVlcnlNYXBUb1F1ZXJ5U3RyaW5nLFxyXG4gICAgUXVlcnlTdHJpbmdUb1F1ZXJ5TWFwXHJcbn1cclxuIiwiaW1wb3J0IHtcclxuICAgIFR1cm5RdWVyeUludG9EYXRhLFxyXG4gICAgVHVybkRhdGFJbnRvUXVlcnksXHJcbiAgICBRdWVyeVN0cmluZ1RvUXVlcnlNYXAsXHJcbiAgICBRdWVyeU1hcFRvUXVlcnlTdHJpbmdcclxufSBmcm9tIFwiLi4vY29tbW9uL3VybC91cmxcIlxyXG5cclxuY2xhc3MgV1VSTCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihsb2NhdGlvbil7XHJcbiAgICAgICAgLy9wYXJzZSB0aGUgdXJsIGludG8gZGlmZmVyZW50IHNlY3Rpb25zXHJcbiAgICAgICAgdGhpcy5wYXRoID0gbG9jYXRpb24ucGF0aG5hbWU7XHJcbiAgICAgICAgdGhpcy5ob3N0ID0gbG9jYXRpb24uaG9zdG5hbWU7XHJcbiAgICAgICAgdGhpcy5xdWVyeSA9IFF1ZXJ5U3RyaW5nVG9RdWVyeU1hcChsb2NhdGlvbi5zZWFyY2guc2xpY2UoMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFBhdGgocGF0aCl7XHJcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgICAgICB0aGlzLnNldExvY2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TG9jYXRpb24oKXtcclxuICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSxcInJlcGxhY2VkIHN0YXRlXCIsYCR7dGhpc31gKTtcclxuICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMucGF0aH0/JHtRdWVyeU1hcFRvUXVlcnlTdHJpbmcodGhpcy5xdWVyeSl9YDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDbGFzcyhjbGFzc19uYW1lKXtcclxuXHJcbiAgICAgICAgaWYoIWNsYXNzX25hbWUpIGNsYXNzX25hbWUgPSBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBvdXQgPSB7fSwgY2xhc3NfO1xyXG5cclxuICAgICAgICBpZihjbGFzc18gPSB0aGlzLnF1ZXJ5LmdldChjbGFzc19uYW1lKSl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgW2tleSwgdmFsXSBvZiBjbGFzc18uZW50cmllcygpKXtcclxuICAgICAgICAgICAgICAgIG91dFtrZXldID0gdmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldChjbGFzc19uYW1lLCBrZXlfbmFtZSwgdmFsdWUpe1xyXG5cclxuICAgICAgICBpZighY2xhc3NfbmFtZSkgY2xhc3NfbmFtZSA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmKCF0aGlzLnF1ZXJ5LmhhcyhjbGFzc19uYW1lKSkgdGhpcy5xdWVyeS5zZXQoY2xhc3NfbmFtZSwgbmV3IE1hcCgpKTtcclxuXHJcbiAgICAgICAgbGV0IGNsYXNzXyA9IHRoaXMucXVlcnkuZ2V0KGNsYXNzX25hbWUpO1xyXG5cclxuICAgICAgICBjbGFzc18uc2V0KGtleV9uYW1lLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TG9jYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoY2xhc3NfbmFtZSwga2V5X25hbWUpe1xyXG4gICAgICAgIGlmKCFjbGFzc19uYW1lKSBjbGFzc19uYW1lID0gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IGNsYXNzXyA9IHRoaXMucXVlcnkuZ2V0KGNsYXNzX25hbWUpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChjbGFzc18pID8gY2xhc3NfLmdldChrZXlfbmFtZSkgOiBudWxsOyAgXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuICAgIFdVUkxcclxufVxyXG4iLCIvL1VwZGF0ZXMgVUlcclxuLy9VcGRhdGVkIEJ5IE1vZGVsXHJcblxyXG5jbGFzcyBWaWV3e1xyXG5cdGNvbnN0cnVjdG9yKCl7XHJcblx0XHR0aGlzLm5leHQgPSBudWxsO1xyXG5cdFx0dGhpcy5tb2RlbCA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRkZXN0cnVjdG9yKCl7XHJcblx0XHRpZih0aGlzLm1vZGVsKXtcclxuXHRcdFx0dGhpcy5tb2RlbC5yZW1vdmVWaWV3KHRoaXMpO1xyXG5cdFx0fVxyXG5cdH1cdFxyXG5cdC8qKlxyXG5cdFx0Q2FsbGVkIGEgTW9kZWwgd2hlbiBpdHMgZGF0YSBoYXMgY2hhbmdlZC5cclxuXHQqL1xyXG5cdHVwZGF0ZShkYXRhKXtcclxuXHJcblx0fVxyXG5cdC8qKlxyXG5cdFx0Q2FsbGVkIGJ5IGEgTW9kZWxDb250YWluZXIgd2hlbiBhbiBpdGVtIGhhcyBiZWVuIHJlbW92ZWQuXHJcblx0Ki9cclxuXHRyZW1vdmVkKGRhdGEpe1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdFx0Q2FsbGVkIGJ5IGEgTW9kZWxDb250YWluZXIgd2hlbiBhbiBpdGVtIGhhcyBiZWVuIGFkZGVkLlxyXG5cdCovXHJcblx0YWRkZWQoZGF0YSl7XHJcblxyXG5cdH1cclxuXHRzZXRNb2RlbChtb2RlbCl7XHJcblx0fVxyXG5cclxuXHRyZXNldCgpe1xyXG5cdFx0XHJcblx0fVxyXG5cdHVuc2V0TW9kZWwoKXtcclxuXHRcdHRoaXMubmV4dCA9IG51bGw7XHJcblx0XHR0aGlzLm1vZGVsID0gbnVsbDtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydHtWaWV3fSIsImNvbnN0IGNhbGxlciA9ICh3aW5kb3cgJiYgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkgPyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIDogKGYpID0+IHtcclxuICAgIHNldFRpbWVvdXQoZiwgMSlcclxufTtcclxuLyoqIFxyXG4gICAgVGhlIFNjaGVkdWxlciBoYW5kbGVzIHVwZGF0aW5nIG9iamVjdHMuIEl0IGRvZXMgdGhpcyBieSBzcGxpdHRpbmcgdXAgdXBkYXRlIGN5Y2xlcywgXHJcbiAgICB0byByZXNwZWN0IHRoZSBicm93c2VyIGV2ZW50IG1vZGVsLiBcclxuXHJcbiAgICBJZiBhbnkgb2JqZWN0IGlzIHNjaGVkdWxlZCB0byBiZSB1cGRhdGVkLCBpdCB3aWxsIGJlIGJsb2NrZWQgZnJvbSBzY2hlZHVsaW5nIG1vcmUgdXBkYXRlcyBcclxuICAgIHVudGlsIGl0cyBvd24gdXBkYXRlIG1ldGhvZCBpcyBjYWxsZWQuXHJcbiovXHJcblxyXG5jb25zdCBTY2hlZHVsZXIgPSBuZXcoY2xhc3Mge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZV9xdWV1ZV9hID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVfcXVldWVfYiA9IG5ldyBBcnJheSgpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZV9xdWV1ZSA9IHRoaXMudXBkYXRlX3F1ZXVlX2E7XHJcblxyXG4gICAgICAgIHRoaXMucXVldWVfc3dpdGNoID0gMDtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSAoKSA9PiB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmZyYW1lX3RpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX19fU0NIRURVTEVEX19fXyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHF1ZXVlVXBkYXRlKG9iamVjdCkge1xyXG5cclxuICAgICAgICBpZiAob2JqZWN0Ll9fX19TQ0hFRFVMRURfX19fIHx8ICFvYmplY3QudXBkYXRlIGluc3RhbmNlb2YgRnVuY3Rpb24pXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9fX19TQ0hFRFVMRURfX19fKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGVyKHRoaXMuY2FsbGJhY2spO1xyXG5cclxuICAgICAgICBvYmplY3QuX19fX1NDSEVEVUxFRF9fX18gPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZV9xdWV1ZS5wdXNoKG9iamVjdCk7XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5fX19fU0NIRURVTEVEX19fXylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLl9fX19TQ0hFRFVMRURfX19fID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY2FsbGVyKHRoaXMuY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fX19fU0NIRURVTEVEX19fXyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgdXEgPSB0aGlzLnVwZGF0ZV9xdWV1ZTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5xdWV1ZV9zd2l0Y2ggPT0gMClcclxuICAgICAgICAgICAgKHRoaXMudXBkYXRlX3F1ZXVlID0gdGhpcy51cGRhdGVfcXVldWVfYiwgdGhpcy5xdWV1ZV9zd2l0Y2ggPSAxKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICh0aGlzLnVwZGF0ZV9xdWV1ZSA9IHRoaXMudXBkYXRlX3F1ZXVlX2EsIHRoaXMucXVldWVfc3dpdGNoID0gMCk7XHJcblxyXG4gICAgICAgIGxldCB0aW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgICAgIGxldCBkaWZmID0gdGltZSAtIHRoaXMuZnJhbWVfdGltZTtcclxuXHJcbiAgICAgICAgdGhpcy5mcmFtZV90aW1lID0gdGltZTtcclxuXHJcbiAgICAgICAgbGV0IHN0ZXBfcmF0aW8gPSAoZGlmZiAqIDAuMDYpOyAvLyAgc3RlcF9yYXRpbyBvZiAxID0gMTYuNjY2NjY2NjYgb3IgMTAwMCAvIDYwIGZvciA2MCBGUFNcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB1cS5sZW5ndGgsIG8gPSB1cVswXTsgaSA8IGw7IG8gPSB1cVsrK2ldKXtcclxuICAgICAgICAgICAgby5fX19fU0NIRURVTEVEX19fXyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBvLnVwZGF0ZShzdGVwX3JhdGlvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVxLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbn0pKClcclxuXHJcbmV4cG9ydCB7XHJcbiAgICBTY2hlZHVsZXJcclxufSIsImltcG9ydCB7XHJcblx0Vmlld1xyXG59IGZyb20gXCIuLi92aWV3XCJcclxuaW1wb3J0IHtcclxuXHRTY2hlZHVsZXJcclxufSBmcm9tIFwiLi4vc2NoZWR1bGVyXCJcclxuXHJcblxyXG5jbGFzcyBNb2RlbEJhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG4gICBcdFx0dGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fID0gW107XHJcblx0fTtcclxuXHJcblx0ZGVzdHJ1Y3RvcigpIHtcclxuXHRcdGRlYnVnZ2VyXHJcbiAgICAgICAgLy9pbmZvcm0gdmlld3Mgb2YgdGhlIG1vZGVscyBkZW1pc2VcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXMuZmlyc3RfdmlldztcclxuXHJcbiAgICAgICAgd2hpbGUgKHZpZXcpIHtcclxuICAgICAgICAgICAgdmlldy51bnNldE1vZGVsKCk7XHJcbiAgICAgICAgICAgIHZpZXcgPSB2aWV3Lm5leHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3RoaXMuZmlyc3RfdmlldyA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fXyA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRnZXQgKCl7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHRcdFxyXG5cdCovXHJcblxyXG4gICAgc2NoZWR1bGVVcGRhdGUoY2hhbmdlZF92YWx1ZSkge1xyXG4gICAgXHRpZighdGhpcy5maXJzdF92aWV3KVxyXG4gICAgXHRcdHJldHVybjtcclxuXHJcbiAgICBcdHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fXy5wdXNoKGNoYW5nZWRfdmFsdWUpO1xyXG5cclxuICAgICAgICBTY2hlZHVsZXIucXVldWVVcGRhdGUodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hhbmdlZChwcm9wX25hbWUpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLl9fX19jaGFuZ2VkX3ZhbHVlc19fX18ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fW2ldID09IHByb3BfbmFtZSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW3Byb3BfbmFtZV07XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShzdGVwKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlVmlld3ModGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fXy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuXHQvKipcclxuXHRcdEFkZHMgYSB2aWV3IHRvIHRoZSBsaW5rZWQgbGlzdCBvZiB2aWV3cyBvbiB0aGUgbW9kZWwuIGFyZ3VtZW50IHZpZXcgTVVTVCBiZSBhbiBpbnN0YW5jZSBvZiBWaWV3LiBcclxuXHQqL1xyXG5cdGFkZFZpZXcodmlldykge1xyXG5cdFx0aWYgKHZpZXcgaW5zdGFuY2VvZiBWaWV3KSB7XHJcblx0XHRcdGlmICh2aWV3Lm1vZGVsKVxyXG5cdFx0XHRcdHZpZXcubW9kZWwucmVtb3ZlVmlldyh2aWV3KTtcclxuXHJcblx0XHRcdHZhciBjaGlsZF92aWV3ID0gdGhpcy5maXJzdF92aWV3O1xyXG5cclxuXHRcdFx0d2hpbGUgKGNoaWxkX3ZpZXcpIHtcclxuXHRcdFx0XHRpZiAodmlldyA9PSBjaGlsZF92aWV3KSByZXR1cm47XHJcblx0XHRcdFx0Y2hpbGRfdmlldyA9IGNoaWxkX3ZpZXcubmV4dDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmlldy5tb2RlbCA9IHRoaXM7XHJcblx0XHRcdHZpZXcubmV4dCA9IHRoaXMuZmlyc3RfdmlldztcclxuXHRcdFx0dGhpcy5maXJzdF92aWV3ID0gdmlldztcclxuXHJcblx0XHRcdHZpZXcuc2V0TW9kZWwodGhpcyk7XHJcblx0XHRcdHZpZXcudXBkYXRlKHRoaXMuZ2V0KCkpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHRocm93IG5ldyBFeGNlcHRpb24oXCJQYXNzZWQgaW4gdmlldyBpcyBub3QgYW4gaW5zdGFuY2Ugb2Ygd2ljay5WaWV3IVwiKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdFx0UmVtb3ZlcyB2aWV3IGZyb20gc2V0IG9mIHZpZXdzIGlmIHRoZSBwYXNzZWQgaW4gdmlldyBpcyBhIG1lbWJlciBvZiBtb2RlbC4gXHJcblx0Ki9cclxuXHRyZW1vdmVWaWV3KHZpZXcpIHtcclxuXHRcdGlmICh2aWV3IGluc3RhbmNlb2YgVmlldyAmJiB2aWV3Lm1vZGVsID09IHRoaXMpIHtcclxuXHRcdFx0dmFyIGNoaWxkX3ZpZXcgPSB0aGlzLmZpcnN0X3ZpZXc7XHJcblx0XHRcdHZhciBwcmV2X2NoaWxkID0gbnVsbDtcclxuXHJcblx0XHRcdHdoaWxlIChjaGlsZF92aWV3KSB7XHJcblx0XHRcdFx0aWYgKHZpZXcgPT0gY2hpbGRfdmlldykge1xyXG5cclxuXHRcdFx0XHRcdGlmIChwcmV2X2NoaWxkKSB7XHJcblx0XHRcdFx0XHRcdHByZXZfY2hpbGQubmV4dCA9IHZpZXcubmV4dDtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZmlyc3RfdmlldyA9IHZpZXcubmV4dDtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR2aWV3Lm5leHQgPSBudWxsXHJcblx0XHRcdFx0XHR2aWV3Lm1vZGVsID0gbnVsbDtcclxuXHRcdFx0XHRcdHZpZXcucmVzZXQoKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRwcmV2X2NoaWxkID0gY2hpbGRfdmlldztcclxuXHRcdFx0XHRjaGlsZF92aWV3ID0gY2hpbGRfdmlldy5uZXh0O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL2RlYnVnZ2VyXHJcblx0XHR9XHJcblx0XHRjb25zb2xlLndhcm4oXCJWaWV3IG5vdCBhIG1lbWJlciBvZiBNb2RlbCFcIiwgdmlldyk7XHJcblx0fVxyXG5cdC8qKlxyXG5cdFx0Q2FsbHMgdXBkYXRlKCkgb24gZXZlcnkgdmlldyBvYmplY3QsIHBhc3NpbmcgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIE1vZGVsLlxyXG5cdCovXHRcclxuXHR1cGRhdGVWaWV3cygpIHtcclxuXHRcdHZhciB2aWV3ID0gdGhpcy5maXJzdF92aWV3O1xyXG5cclxuXHRcdHdoaWxlICh2aWV3KSB7XHJcblx0XHRcdFxyXG5cdFx0XHR2aWV3LnVwZGF0ZSh0aGlzLCB0aGlzLl9fX19jaGFuZ2VkX3ZhbHVlc19fX18pO1xyXG5cclxuXHRcdFx0XHJcblx0XHRcdHZpZXcgPSB2aWV3Lm5leHQ7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fXy5sZW5ndGggPSAwO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0XHRVcGRhdGVzIHZpZXdzIHdpdGggYSBsaXN0IG9mIG1vZGVscyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkLiBcclxuXHRcdFByaW1hcmlseSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggY29udGFpbmVyIGJhc2VkIHZpZXdzLCBzdWNoIGFzIENhc2VUZW1wbGF0ZXMuXHJcblx0Ki9cclxuXHR1cGRhdGVWaWV3c1JlbW92ZWQoZGF0YSkge1xyXG5cdFx0dmFyIHZpZXcgPSB0aGlzLmZpcnN0X3ZpZXc7XHJcblxyXG5cdFx0d2hpbGUgKHZpZXcpIHtcclxuXHRcdFx0XHJcblx0XHRcdHZpZXcucmVtb3ZlZChkYXRhKTtcclxuXHRcdFx0XHJcblx0XHRcdHZpZXcgPSB2aWV3Lm5leHQ7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHRcdFVwZGF0ZXMgdmlld3Mgd2l0aCBhIGxpc3Qgb2YgbW9kZWxzIHRoYXQgaGF2ZSBiZWVuIGFkZGVkLiBcclxuXHRcdFByaW1hcmlseSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggY29udGFpbmVyIGJhc2VkIHZpZXdzLCBzdWNoIGFzIENhc2VUZW1wbGF0ZXMuXHJcblx0Ki9cclxuXHR1cGRhdGVWaWV3c0FkZGVkKGRhdGEpIHtcclxuXHRcdHZhciB2aWV3ID0gdGhpcy5maXJzdF92aWV3O1xyXG5cclxuXHRcdHdoaWxlICh2aWV3KSB7XHJcblx0XHRcdFxyXG5cdFx0XHR2aWV3LmFkZGVkKGRhdGEpO1xyXG5cdFx0XHRcclxuXHRcdFx0dmlldyA9IHZpZXcubmV4dDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG4gICAgdG9Kc29uKCkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLG51bGwsICdcXHQnKTtcclxuICAgIH1cclxufVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZGVsQmFzZS5wcm90b3R5cGUsIFwiZmlyc3Rfdmlld1wiLCB7XHJcblx0d3JpdGFibGUgOiB0cnVlLFxyXG5cdGNvbmZpZ3VyYWJsZSA6IGZhbHNlLFxyXG5cdGVudW1lcmFibGUgOiBmYWxzZSxcclxufSlcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShNb2RlbEJhc2UucHJvdG90eXBlLCBcIl9fX19jaGFuZ2VkX3ZhbHVlc19fX19cIiwge1xyXG5cdHdyaXRhYmxlIDogdHJ1ZSxcclxuXHRjb25maWd1cmFibGUgOiBmYWxzZSxcclxuXHRlbnVtZXJhYmxlIDogZmFsc2UsXHJcbn0pXHJcblxyXG5cclxuT2JqZWN0LnNlYWwoTW9kZWxCYXNlLnByb3RvdHlwZSk7XHJcblxyXG5cclxuZXhwb3J0IHtcclxuXHRNb2RlbEJhc2VcclxufSIsIi8qKlxyXG5cdFNjaGVtYSB0eXBlLiBIYW5kbGVzIHRoZSBwYXJzaW5nLCB2YWxpZGF0aW9uLCBhbmQgZmlsdGVyaW5nIG9mIE1vZGVsIGRhdGEgcHJvcGVydGllcy4gXHJcbiovXHJcbmNsYXNzIFNjaGVtYVR5cGUge1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKCl7XHJcblx0XHR0aGlzLnN0YXJ0X3ZhbHVlID0gdW5kZWZpbmVkO1xyXG5cdH1cclxuXHRcclxuXHQvKipcclxuXHRcdFBhcnNlcyB2YWx1ZSByZXR1cm5zIGFuIGFwcHJvcHJpYXRlIHRyYW5zZm9ybWVkIHZhbHVlXHJcblx0Ki9cclxuXHRwYXJzZSh2YWx1ZSl7XHJcblx0XHRyZXR1cm4gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHJcblx0Ki9cclxuXHR2ZXJpZnkodmFsdWUsIHJlc3VsdCl7XHJcblx0XHRyZXN1bHQudmFsaWQgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0ZmlsdGVyKCl7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHN0cmluZyh2YWx1ZSl7XHJcblx0XHRyZXR1cm4gdmFsdWUgKyBcIlwiO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IHtTY2hlbWFUeXBlfTsgIiwiaW1wb3J0IHtcclxuICAgIE1vZGVsQmFzZSxcclxufSBmcm9tIFwiLi9tb2RlbF9iYXNlLmpzXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBTY2hlbWFUeXBlXHJcbn0gZnJvbSBcIi4uL3NjaGVtYS9zY2hlbWFfdHlwZVwiXHJcblxyXG5jbGFzcyBNQ0FycmF5IGV4dGVuZHMgQXJyYXkge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdXNoKGl0ZW0pIHtcclxuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEFycmF5KVxyXG4gICAgICAgICAgICBpdGVtLmZvckVhY2goKGkpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHVzaChpKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3VwZXIucHVzaChpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICAvL0ZvciBjb21wYXRpYmlsaXR5XHJcbiAgICBfX3NldEZpbHRlcnNfXygpIHtcclxuXHJcbiAgICB9XHJcbiAgICBnZXRDaGFuZ2VkKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgdG9Kc29uKCkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLCBudWxsLCAnXFx0Jyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIEEgXCJudWxsXCIgZnVuY3Rpb25cclxubGV0IEVtcHR5RnVuY3Rpb24gPSAoKSA9PiB7fTtcclxubGV0IEVtcHR5QXJyYXkgPSBbXTtcclxuXHJcblxyXG5cclxuY2xhc3MgTW9kZWxDb250YWluZXIgZXh0ZW5kcyBNb2RlbEJhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjaGVtYSkge1xyXG5cclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvL0ZvciBMaW5raW5nIHRvIG9yaWdpbmFsIFxyXG4gICAgICAgIHRoaXMuc291cmNlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpcnN0X2xpbmsgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubmV4dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wcmV2ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy9Gb3Iga2VlcGluZyB0aGUgY29udGFpbmVyIGZyb20gYXV0b21hdGljIGRlbGV0aW9uLlxyXG4gICAgICAgIHRoaXMucGluID0gRW1wdHlGdW5jdGlvbjtcclxuXHJcbiAgICAgICAgLy9GaWx0ZXJzIGFyZSBhIHNlcmllcyBvZiBzdHJpbmdzIG9yIG51bWJlciBzZWxlY3RvcnMgdXNlZCB0byBkZXRlcm1pbmUgaWYgYSBtb2RlbCBzaG91bGQgYmUgaW5zZXJ0ZWQgaW50byBvciByZXRyaWV2ZWQgZnJvbSB0aGUgY29udGFpbmVyLlxyXG4gICAgICAgIHRoaXMuX19maWx0ZXJzX18gPSBFbXB0eUFycmF5O1xyXG5cclxuICAgICAgICB0aGlzLnNjaGVtYSA9IHNjaGVtYSB8fCB0aGlzLmNvbnN0cnVjdG9yLnNjaGVtYSB8fCB7fTtcclxuXHJcbiAgICAgICAgLy9UaGUgcGFyc2VyIHdpbGwgaGFuZGxlIHRoZSBldmFsdWF0aW9uIG9mIGlkZW50aWZpZXJzIGFjY29yZGluZyB0byB0aGUgY3JpdGVyaWEgc2V0IGJ5IHRoZSBfX2ZpbHRlcnNfXyBsaXN0LiBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2NoZW1hLnBhcnNlciAmJiB0aGlzLnNjaGVtYS5wYXJzZXIgaW5zdGFuY2VvZiBTY2hlbWFUeXBlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VyID0gdGhpcy5zY2hlbWEucGFyc2VyXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZXIgPSBuZXcgU2NoZW1hVHlwZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pZCA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNjaGVtYS5pZGVudGlmaWVyICYmIHR5cGVvZih0aGlzLnNjaGVtYS5pZGVudGlmaWVyKSA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSB0aGlzLnNjaGVtYS5pZGVudGlmaWVyO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHRocm93IChgV3Jvbmcgc2NoZW1hIGlkZW50aWZpZXIgdHlwZSBnaXZlbiB0byBNb2RlbENvbnRhaW5lci4gRXhwZWN0ZWQgdHlwZSBTdHJpbmcsIGdvdDogJHt0eXBlb2YodGhpcy5zY2hlbWEuaWRlbnRpZmllcil9IWAsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodGhpcywge1xyXG4gICAgICAgICAgICBnZXQ6IChvYmosIHByb3AsIHZhbCkgPT4gKHByb3AgaW4gb2JqKSA/IG9ialtwcm9wXSA6IG9iai5nZXQodmFsKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnNjaGVtYSA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuX19maWx0ZXJzX18gPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zb3VyY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5zb3VyY2UuX191bmxpbmtfXyh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBHZXQgdGhlIG51bWJlciBvZiBNb2RlbHMgaGVsZCBpbiB0aGlzIE1vZGVsQ29udGFpbmVyXHJcblxyXG4gICAgICAgIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAgICAqL1xyXG4gICAgZ2V0IGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbGVuZ3RoKGUpIHtcclxuICAgICAgICAvL05VTEwgZnVuY3Rpb24uIERvIE5vdCBPdmVycmlkZSFcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgICAgUmV0dXJucyBhIE1vZGVsQ29udGFpbmVyIHR5cGUgdG8gc3RvcmUgdGhlIHJlc3VsdHMgb2YgYSBnZXQoKS5cclxuICAgICovXHJcbiAgICBfX2RlZmF1bHRSZXR1cm5fXyhVU0VfQVJSQVkpIHtcclxuICAgICAgICBpZiAoVVNFX0FSUkFZKSByZXR1cm4gbmV3IE1DQXJyYXk7XHJcblxyXG4gICAgICAgIGxldCBuID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5zY2hlbWEpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbGlua19fKG4pO1xyXG5cclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBBcnJheSBlbXVsYXRpbmcga2x1ZGdlXHJcblxyXG4gICAgICAgIEByZXR1cm5zIFRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGlzLmluc2VydFxyXG4gICAgKi9cclxuICAgIHB1c2goaXRlbSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluc2VydChpdGVtLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZXRyaWV2ZXMgYSBsaXN0IG9mIGl0ZW1zIHRoYXQgbWF0Y2ggdGhlIHRlcm0vdGVybXMuIFxyXG5cclxuICAgICAgICBAcGFyYW0geyhBcnJheXxTZWFyY2hUZXJtKX0gdGVybSAtIEEgc2luZ2xlIHRlcm0gb3IgYSBzZXQgb2YgdGVybXMgdG8gbG9vayBmb3IgaW4gdGhlIE1vZGVsQ29udGFpbmVyLiBcclxuICAgICAgICBAcGFyYW0ge0FycmF5fSBfX3JldHVybl9kYXRhX18gLSBTZXQgdG8gdHJ1ZSBieSBhIHNvdXJjZSBDb250YWluZXIgaWYgaXQgaXMgY2FsbGluZyBhIFN1YkNvbnRhaW5lciBpbnNlcnQgZnVuY3Rpb24uIFxyXG5cclxuICAgICAgICBAcmV0dXJucyB7KE1vZGVsQ29udGFpbmVyfEFycmF5KX0gUmV0dXJucyBhIE1vZGVsIGNvbnRhaW5lciBvciBhbiBBcnJheSBvZiBNb2RlbHMgbWF0Y2hpbmcgdGhlIHNlYXJjaCB0ZXJtcy4gXHJcbiAgICAqL1xyXG4gICAgZ2V0KHRlcm0sIF9fcmV0dXJuX2RhdGFfXykge1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IFVTRV9BUlJBWSA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmICh0ZXJtKSB7XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICBpZiAoX19yZXR1cm5fZGF0YV9fKSB7XHJcbiAgICAgICAgICAgICAgICBvdXQgPSBfX3JldHVybl9kYXRhX187XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF9fcmV0dXJuX2RhdGFfXyA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICBVU0VfQVJSQVkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc291cmNlKVxyXG4gICAgICAgICAgICAgICAgICAgIFVTRV9BUlJBWSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIG91dCA9IHRoaXMuX19kZWZhdWx0UmV0dXJuX18oVVNFX0FSUkFZKTtcclxuICAgICAgICAgICAgICAgIG91dC5fX3NldEZpbHRlcnNfXyh0ZXJtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBvdXQgPSAoX19yZXR1cm5fZGF0YV9fKSA/IF9fcmV0dXJuX2RhdGFfXyA6IHRoaXMuX19kZWZhdWx0UmV0dXJuX18oVVNFX0FSUkFZKTtcclxuXHJcbiAgICAgICAgaWYgKCF0ZXJtKVxyXG4gICAgICAgICAgICB0aGlzLl9fZ2V0QWxsX18ob3V0KTtcclxuICAgICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB0ZXJtcyA9IHRlcm07XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRlcm0gaW5zdGFuY2VvZiBBcnJheSlcclxuICAgICAgICAgICAgICAgIHRlcm1zID0gW3Rlcm1dO1xyXG5cclxuICAgICAgICAgICAgLy9OZWVkIHRvIGNvbnZlcnQgdGVybXMgaW50byBhIGZvcm0gdGhhdCB3aWxsIHdvcmsgZm9yIHRoZSBpZGVudGlmaWVyIHR5cGVcclxuICAgICAgICAgICAgdGVybXMgPSB0ZXJtcy5tYXAodCA9PiB0aGlzLnBhcnNlci5wYXJzZSh0KSk7XHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy5fX2dldF9fKHRlcm1zLCBvdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEluc2VydHMgYW4gaXRlbSBpbnRvIHRoZSBjb250YWluZXIuIElmIHRoZSBpdGVtIGlzIG5vdCBhIHtNb2RlbH0sIGFuIGF0dGVtcHQgd2lsbCBiZSBtYWRlIHRvIGNvbnZlcnQgdGhlIGRhdGEgaW4gdGhlIE9iamVjdCBpbnRvIGEgTW9kZWwuXHJcbiAgICAgICAgSWYgdGhlIGl0ZW0gaXMgYW4gYXJyYXkgb2Ygb2JqZWN0cywgZWFjaCBvYmplY3QgaW4gdGhlIGFycmF5IHdpbGwgYmUgY29uc2lkZXJlZCBzZXBhcmF0ZWx5LiBcclxuXHJcbiAgICAgICAgQHBhcmFtIHtPYmplY3R9IGl0ZW0gLSBBbiBPYmplY3QgdG8gaW5zZXJ0IGludG8gdGhlIGNvbnRhaW5lci4gT24gb2YgdGhlIHByb3BlcnRpZXMgb2YgdGhlIG9iamVjdCBNVVNUIGhhdmUgdGhlIHNhbWUgbmFtZSBhcyB0aGUgTW9kZWxDb250YWluZXIncyBcclxuICAgICAgICBAcGFyYW0ge0FycmF5fSBpdGVtIC0gQW4gYXJyYXkgb2YgT2JqZWN0cyB0byBpbnNlcnQgaW50byB0aGUgY29udGFpbmVyLlxyXG4gICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gX19GUk9NX1NPVVJDRV9fIC0gU2V0IHRvIHRydWUgYnkgYSBzb3VyY2UgQ29udGFpbmVyIGlmIGl0IGlzIGNhbGxpbmcgYSBTdWJDb250YWluZXIgaW5zZXJ0IGZ1bmN0aW9uLiBcclxuXHJcbiAgICAgICAgQHJldHVybnMge0Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBhbiBpbnNlcnRpb24gaW50byB0aGUgTW9kZWxDb250YWluZXIgb2NjdXJyZWQsIGZhbHNlIG90aGVyd2lzZS5cclxuICAgICovXHJcbiAgICBpbnNlcnQoaXRlbSwgX19GUk9NX1NPVVJDRV9fID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgbGV0IGFkZF9saXN0ID0gKHRoaXMuZmlyc3RfdmlldykgPyBbXSA6IG51bGw7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKCFfX0ZST01fU09VUkNFX18gJiYgdGhpcy5zb3VyY2UpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5pbnNlcnQoaXRlbSk7XHJcblxyXG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX19pbnNlcnRTdWJfXyhpdGVtW2ldLCBvdXQsIGFkZF9saXN0KSlcclxuICAgICAgICAgICAgICAgICAgICBvdXQgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbSlcclxuICAgICAgICAgICAgb3V0ID0gdGhpcy5fX2luc2VydFN1Yl9fKGl0ZW0sIG91dCwgYWRkX2xpc3QpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKGFkZF9saXN0ICYmIGFkZF9saXN0Lmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlld3NBZGRlZChhZGRfbGlzdCk7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQSBzdWJzZXQgb2YgdGhlIGluc2VydCBmdW5jdGlvbi4gSGFuZGxlcyB0aGUgdGVzdCBvZiBpZGVudGlmaWVyLCB0aGUgY29udmVyc2lvbiBvZiBhbiBPYmplY3QgaW50byBhIE1vZGVsLCBhbmQgdGhlIGNhbGxpbmcgb2YgdGhlIGludGVybmFsIF9faW5zZXJ0X18gZnVuY3Rpb24uXHJcbiAgICAqL1xyXG4gICAgX19pbnNlcnRTdWJfXyhpdGVtLCBvdXQsIGFkZF9saXN0KSB7XHJcblxyXG4gICAgICAgIGxldCBtb2RlbCA9IGl0ZW07XHJcblxyXG4gICAgICAgIHZhciBpZGVudGlmaWVyID0gdGhpcy5fX2dldElkZW50aWZpZXJfXyhpdGVtKTtcclxuXHJcbiAgICAgICAgaWYgKGlkZW50aWZpZXIgIT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIShtb2RlbCBpbnN0YW5jZW9mIHRoaXMuc2NoZW1hLm1vZGVsKSAmJiAhKG1vZGVsID0gbW9kZWwuX19fX3NlbGZfX19fKSkge1xyXG4gICAgICAgICAgICAgICAgbW9kZWwgPSBuZXcgdGhpcy5zY2hlbWEubW9kZWwoKTtcclxuICAgICAgICAgICAgICAgIG1vZGVsLmFkZChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWRlbnRpZmllciA9IHRoaXMuX19nZXRJZGVudGlmaWVyX18obW9kZWwsIHRoaXMuX19maWx0ZXJzX18pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIpIHtcclxuICAgICAgICAgICAgICAgIG91dCA9IHRoaXMuX19pbnNlcnRfXyhtb2RlbCwgYWRkX2xpc3QsIGlkZW50aWZpZXIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fbGlua3NJbnNlcnRfXyhtb2RlbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJlbW92ZXMgYW4gaXRlbSBmcm9tIHRoZSBjb250YWluZXIuIFxyXG4gICAgKi9cclxuICAgIHJlbW92ZSh0ZXJtLCBfX0ZST01fU09VUkNFX18gPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBsZXQgdGVybXMgPSB0ZXJtO1xyXG5cclxuICAgICAgICBpZiAoIV9fRlJPTV9TT1VSQ0VfXyAmJiB0aGlzLnNvdXJjZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0ZXJtKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnJlbW92ZSh0aGlzLl9fZmlsdGVyc19fKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnJlbW92ZSh0ZXJtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBvdXRfY29udGFpbmVyID0gW107XHJcblxyXG4gICAgICAgIGlmICghdGVybSlcclxuICAgICAgICAgICAgdGhpcy5fX3JlbW92ZUFsbF9fKCk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghdGVybSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICB0ZXJtcyA9IFt0ZXJtXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9OZWVkIHRvIGNvbnZlcnQgdGVybXMgaW50byBhIGZvcm0gdGhhdCB3aWxsIHdvcmsgZm9yIHRoZSBpZGVudGlmaWVyIHR5cGVcclxuICAgICAgICAgICAgdGVybXMgPSB0ZXJtcy5tYXAodCA9PiB0aGlzLnBhcnNlci5wYXJzZSh0KSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9fcmVtb3ZlX18odGVybXMsIG91dF9jb250YWluZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fX2xpbmtzUmVtb3ZlX18odGVybXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0X2NvbnRhaW5lcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZW1vdmVzIGEgTW9kZWxDb250YWluZXIgZnJvbSBsaXN0IG9mIGxpbmtlZCBjb250YWluZXJzLiBcclxuXHJcbiAgICAgICAgQHBhcmFtIHtNb2RlbENvbnRhaW5lcn0gY29udGFpbmVyIC0gVGhlIE1vZGVsQ29udGFpbmVyIGluc3RhbmNlIHRvIHJlbW92ZSBmcm9tIHRoZSBzZXQgb2YgbGlua2VkIGNvbnRhaW5lcnMuIE11c3QgYmUgYSBtZW1iZXIgb2YgdGhlIGxpbmtlZCBjb250YWluZXJzLiBcclxuICAgICovXHJcbiAgICBfX3VubGlua19fKGNvbnRhaW5lcikge1xyXG5cclxuICAgICAgICBpZiAoY29udGFpbmVyIGluc3RhbmNlb2YgTW9kZWxDb250YWluZXIgJiYgY29udGFpbmVyLnNvdXJjZSA9PSB0aGlzKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGFpbmVyID09IHRoaXMuZmlyc3RfbGluaylcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RfbGluayA9IGNvbnRhaW5lci5uZXh0O1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lci5uZXh0KVxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLm5leHQucHJldiA9IGNvbnRhaW5lci5wcmV2O1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lci5wcmV2KVxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnByZXYubmV4dCA9IGNvbnRhaW5lci5uZXh0O1xyXG5cclxuICAgICAgICAgICAgY29udGFpbmVyLnNvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEFkZHMgYSBjb250YWluZXIgdG8gdGhlIGxpc3Qgb2YgdHJhY2tlZCBjb250YWluZXJzLiBcclxuXHJcbiAgICAgICAgQHBhcmFtIHtNb2RlbENvbnRhaW5lcn0gY29udGFpbmVyIC0gVGhlIE1vZGVsQ29udGFpbmVyIGluc3RhbmNlIHRvIGFkZCB0aGUgc2V0IG9mIGxpbmtlZCBjb250YWluZXJzLlxyXG4gICAgKi9cclxuICAgIF9fbGlua19fKGNvbnRhaW5lcikge1xyXG4gICAgICAgIGlmIChjb250YWluZXIgaW5zdGFuY2VvZiBNb2RlbENvbnRhaW5lciAmJiAhY29udGFpbmVyLnNvdXJjZSkge1xyXG5cclxuICAgICAgICAgICAgY29udGFpbmVyLnNvdXJjZSA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBjb250YWluZXIubmV4dCA9IHRoaXMuZmlyc3RfbGluaztcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZpcnN0X2xpbmspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcnN0X2xpbmsucHJldiA9IGNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZmlyc3RfbGluayA9IGNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5waW4gPSAoKGNvbnRhaW5lcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlkID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLl9fdW5saW5rX18oKTtcclxuICAgICAgICAgICAgICAgIH0sIDUwKVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbnRhaW5lci5zb3VyY2UpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImZhaWxlZCB0byBjbGVhciB0aGUgZGVzdHJ1Y3Rpb24gb2YgY29udGFpbmVyIGluIHRpbWUhXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KShjb250YWluZXIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9fbGlua3NSZW1vdmVfXyh0ZXJtcykge1xyXG4gICAgICAgIGxldCBhID0gdGhpcy5maXJzdF9saW5rO1xyXG4gICAgICAgIHdoaWxlIChhKSB7XHJcbiAgICAgICAgICAgIGEucmVtb3ZlKHRlcm1zLCB0cnVlKTtcclxuICAgICAgICAgICAgYSA9IGEubmV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX19saW5rc0luc2VydF9fKGl0ZW0pIHtcclxuICAgICAgICBsZXQgYSA9IHRoaXMuZmlyc3RfbGluaztcclxuICAgICAgICB3aGlsZSAoYSkge1xyXG4gICAgICAgICAgICBhLmluc2VydChpdGVtLCB0cnVlKTtcclxuICAgICAgICAgICAgYSA9IGEubmV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmVtb3ZlcyBhbnkgaXRlbXMgaW4gdGhlIG1vZGVsIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkgXCJpdGVtc1wiLCBhbmQgYWRkcyBhbnkgaXRlbXMgaW4gaXRlbXMgbm90IGFscmVhZHkgaW4gdGhlIE1vZGVsQ29udGFpbmVyLlxyXG5cclxuICAgICAgICBAcGFyYW0ge0FycmF5fSBpdGVtcyAtIEFuIGFycmF5IG9mIGlkZW50aWZpYWJsZSBNb2RlbHMgb3Igb2JqZWN0cy4gXHJcbiAgICAqL1xyXG4gICAgY3VsbChpdGVtcykge1xyXG5cclxuICAgICAgICBsZXQgaGFzaF90YWJsZSA9IHt9O1xyXG4gICAgICAgIGxldCBleGlzdGluZ19pdGVtcyA9IF9fZ2V0QWxsX18oW10sIHRydWUpO1xyXG5cclxuICAgICAgICBsZXQgbG9hZEhhc2ggPSAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEFycmF5KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uZm9yRWFjaCgoZSkgPT4gbG9hZEhhc2goZSkpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGlkZW50aWZpZXIgPSB0aGlzLl9fZ2V0SWRlbnRpZmllcl9fKGl0ZW0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIpXHJcbiAgICAgICAgICAgICAgICBoYXNoX3RhYmxlW2lkZW50aWZpZXJdID0gaXRlbTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsb2FkSGFzaChpdGVtcyk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhpc3RpbmdfaXRlbXMubGVudGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZV9pdGVtID0gZXhpc3RpbmdfaXRlbXNbaV07XHJcbiAgICAgICAgICAgIGlmICghZXhpc3RpbmdfaXRlbXNbdGhpcy5fX2dldElkZW50aWZpZXJfXyhlX2l0ZW0pXSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX19yZW1vdmVfXyhlX2l0ZW0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbnNlcnQoaXRlbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIF9fc2V0RmlsdGVyc19fKHRlcm0pIHtcclxuICAgICAgICBpZiAodGVybSBpbnN0YW5jZW9mIEFycmF5KVxyXG4gICAgICAgICAgICB0aGlzLl9fZmlsdGVyc19fID0gdGhpcy5fX2ZpbHRlcnNfXy5jb25jYXQodGVybS5tYXAodCA9PiB0aGlzLnBhcnNlci5wYXJzZSh0KSkpXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLl9fZmlsdGVyc19fLnB1c2godGhpcy5wYXJzZXIucGFyc2UodGVybSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZXR1cm5zIHRydWUgaWYgdGhlIGlkZW50aWZpZXIgbWF0Y2hlcyBhIHByZWRlZmluZWQgZmlsdGVyIHBhdHRlcm4sIHdoaWNoIGlzIGV2YWx1YXRlZCBieSB0aGlzLnBhcnNlci4gSWYgYSBcclxuICAgICAgICBwYXJzZXIgd2FzIG5vdCBwcmVzZW50IHRoZSBNb2RlbENvbnRhaW5lcnMgc2NoZW1hLCB0aGVuIHRoZSBmdW5jdGlvbiB3aWxsIHJldHVybiB0cnVlIHVwb24gZXZlcnkgZXZhbHVhdGlvbi5cclxuICAgICovXHJcbiAgICBfX2ZpbHRlcklkZW50aWZpZXJfXyhpZGVudGlmaWVyLCBmaWx0ZXJzKSB7XHJcbiAgICAgICAgaWYgKGZpbHRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZXIuZmlsdGVyKGlkZW50aWZpZXIsIGZpbHRlcnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZXR1cm5zIHRoZSBJZGVudGlmaWVyIHByb3BlcnR5IHZhbHVlIGlmIGl0IGV4aXN0cyBpbiB0aGUgaXRlbS4gSWYgYW4gYXJyYXkgdmFsdWUgZm9yIGZpbHRlcnMgaXMgcGFzc2VkLCB0aGVuIHVuZGVmaW5lZCBpcyByZXR1cm5lZCBpZiB0aGUgaWRlbnRpZmllciB2YWx1ZSBkb2VzIG5vdCBwYXNzIGZpbHRlcmluZyBjcml0ZXJpYS5cclxuICAgICAgICBAcGFyYW0geyhPYmplY3R8TW9kZWwpfSBpdGVtXHJcbiAgICAgICAgQHBhcmFtIHtBcnJheX0gZmlsdGVycyAtIEFuIGFycmF5IG9mIGZpbHRlciB0ZXJtcyB0byB0ZXN0IHdoZXRoZXIgdGhlIGlkZW50aWZpZXIgbWVldHMgdGhlIGNyaXRlcmlhIHRvIGJlIGhhbmRsZWQgYnkgdGhlIE1vZGVsQ29udGFpbmVyLlxyXG4gICAgKi9cclxuICAgIF9fZ2V0SWRlbnRpZmllcl9fKGl0ZW0sIGZpbHRlcnMgPSBudWxsKSB7XHJcblxyXG4gICAgICAgIGxldCBpZGVudGlmaWVyID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZihpdGVtKSA9PSBcIm9iamVjdFwiKVxyXG4gICAgICAgICAgICBpZGVudGlmaWVyID0gaXRlbVt0aGlzLnNjaGVtYS5pZGVudGlmaWVyXTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGlkZW50aWZpZXIgPSBpdGVtO1xyXG5cclxuICAgICAgICBpZiAoaWRlbnRpZmllcilcclxuICAgICAgICAgICAgaWRlbnRpZmllciA9IHRoaXMucGFyc2VyLnBhcnNlKGlkZW50aWZpZXIpO1xyXG5cclxuICAgICAgICBpZiAoZmlsdGVycyAmJiBpZGVudGlmaWVyKVxyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuX19maWx0ZXJJZGVudGlmaWVyX18oaWRlbnRpZmllciwgZmlsdGVycykpID8gaWRlbnRpZmllciA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGlkZW50aWZpZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICAgIE9WRVJSSURFIFNFQ1RJT04gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICBcclxuICAgICAgICBBbGwgb2YgdGhlc2UgZnVuY3Rpb25zIHNob3VsZCBiZSBvdmVycmlkZGVuIGJ5IGluaGVyaXRpbmcgY2xhc3Nlc1xyXG4gICAgKi9cclxuXHJcbiAgICBfX2luc2VydF9fKGl0ZW0sIGFkZF9saXN0LCBpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0X18oaXRlbSwgX19yZXR1cm5fZGF0YV9fKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fcmV0dXJuX2RhdGFfXztcclxuICAgIH1cclxuXHJcbiAgICBfX2dldEFsbF9fKF9fcmV0dXJuX2RhdGFfXykge1xyXG4gICAgICAgIHJldHVybiBfX3JldHVybl9kYXRhX187XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVBbGxfXygpIHtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVfXyhpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEVORCBPVkVSUklERSAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG59XHJcblxyXG5jbGFzcyBNdWx0aUluZGV4ZWRDb250YWluZXIgZXh0ZW5kcyBNb2RlbENvbnRhaW5lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihzY2hlbWEpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoe1xyXG4gICAgICAgICAgICBpZGVudGlmaWVyOiBcImluZGV4ZWRcIixcclxuICAgICAgICAgICAgbW9kZWw6IHNjaGVtYS5tb2RlbFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNjaGVtYSA9IHNjaGVtYTtcclxuICAgICAgICB0aGlzLmluZGV4ZXMgPSB7fTtcclxuICAgICAgICB0aGlzLmZpcnN0X2luZGV4ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRJbmRleChzY2hlbWEuaW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgZmlyc3QgaW5kZXggaW4gdGhpcyBjb250YWluZXIuIFxyXG4gICAgKi9cclxuICAgIGdldCBsZW5ndGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlyc3RfaW5kZXgubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEluc2VydCBhIG5ldyBNb2RlbENvbnRhaW5lciBpbnRvIHRoZSBpbmRleCB0aHJvdWdoIHRoZSBzY2hlbWEuICBcclxuICAgICovXHJcbiAgICBhZGRJbmRleChpbmRleF9zY2hlbWEpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBpbmRleF9zY2hlbWEpIHtcclxuICAgICAgICAgICAgbGV0IHNjaGVtZSA9IGluZGV4X3NjaGVtYVtuYW1lXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzY2hlbWUuY29udGFpbmVyICYmICF0aGlzLmluZGV4ZXNbbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhlc1tuYW1lXSA9IG5ldyBzY2hlbWUuY29udGFpbmVyKHNjaGVtZS5zY2hlbWEpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpcnN0X2luZGV4KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhlc1tuYW1lXS5pbnNlcnQodGhpcy5maXJzdF9pbmRleC5fX2dldEFsbF9fKCkpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RfaW5kZXggPSB0aGlzLmluZGV4ZXNbbmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KGl0ZW0sIF9fcmV0dXJuX2RhdGFfXykge1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0ge307XHJcblxyXG4gICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gaXRlbSlcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmluZGV4ZXNbbmFtZV0pXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0W25hbWVdID0gdGhpcy5pbmRleGVzW25hbWVdLmdldChpdGVtW25hbWVdLCBfX3JldHVybl9kYXRhX18pO1xyXG4gICAgICAgIH0gZWxzZVxyXG5cclxuICAgICAgICAgICAgb3V0ID0gdGhpcy5maXJzdF9pbmRleC5nZXQobnVsbCk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZShpdGVtKSB7XHJcblxyXG4gICAgICAgIHZhciBvdXQgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgYSBpbiBpdGVtKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pbmRleGVzW2FdKVxyXG4gICAgICAgICAgICAgICAgb3V0ID0gb3V0LmNvbmNhdCh0aGlzLmluZGV4ZXNbYV0ucmVtb3ZlKGl0ZW1bYV0pKTtcclxuXHJcbiAgICAgICAgLyogUmVwbGF5IGl0ZW1zIGFnYWluc3QgaW5kZXhlcyB0byBpbnN1cmUgYWxsIGl0ZW1zIGhhdmUgYmVlbiByZW1vdmVkIGZyb20gYWxsIGluZGV4ZXMgKi9cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLmluZGV4ZXMubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3V0Lmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleGVzW2pdLnJlbW92ZShvdXRbaV0pO1xyXG5cclxuICAgICAgICAvL1VwZGF0ZSBhbGwgdmlld3NcclxuICAgICAgICBpZiAob3V0Lmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlld3NSZW1vdmVkKG91dCk7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgX19pbnNlcnRfXyhtb2RlbCwgYWRkX2xpc3QsIGlkZW50aWZpZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IGZhbHNlXHJcblxyXG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gdGhpcy5pbmRleGVzKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmluZGV4ZXNbbmFtZV07XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5kZXguaW5zZXJ0KG1vZGVsKSlcclxuICAgICAgICAgICAgICAgIG91dCA9IHRydWU7XHJcbiAgICAgICAgICAgIC8vZWxzZVxyXG4gICAgICAgICAgICAvLyAgICBjb25zb2xlLndhcm4oYEluZGV4ZWQgY29udGFpbmVyICR7YX0gJHtpbmRleH0gZmFpbGVkIHRvIGluc2VydDpgLCBtb2RlbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3V0KVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpZXdzKHRoaXMuZmlyc3RfaW5kZXguZ2V0KCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgICAgQHByaXZhdGUgXHJcbiAgICAqL1xyXG4gICAgX19yZW1vdmVfXyhpdGVtKSB7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLmluZGV4ZXMpIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5pbmRleGVzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXgucmVtb3ZlKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgb3V0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVBbGxfXygpIHtcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBuYW1lIGluIHRoaXMuaW5kZXhlcykge1xyXG4gICAgICAgICAgICBpZiAoaW5kZXguX19yZW1vdmVBbGxfXygpKVxyXG4gICAgICAgICAgICAgICAgb3V0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIE92ZXJyaWRlcyBNb2RlbCBjb250YWluZXIgZGVmYXVsdCBfX2dldElkZW50aWZpZXJfXyB0byBmb3JjZSBpdGVtIHRvIHBhc3MuXHJcbiAgICAgICAgQHByaXZhdGUgXHJcbiAgICAqL1xyXG4gICAgX19nZXRJZGVudGlmaWVyX18oaXRlbSwgZmlsdGVycyA9IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgcmV0dXJuIFwiW11cIjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIE1DQXJyYXksXHJcbiAgICBNb2RlbENvbnRhaW5lcixcclxuICAgIE11bHRpSW5kZXhlZENvbnRhaW5lcixcclxuICAgIGFycmF5X2NvbnRhaW5lclxyXG59OyIsImltcG9ydCB7XHJcbiAgICBNb2RlbENvbnRhaW5lcixcclxuICAgIE1DQXJyYXlcclxufSBmcm9tIFwiLi9tb2RlbF9jb250YWluZXJcIlxyXG5cclxuXHJcbi8qKlxyXG4gKi9cclxuY2xhc3MgQXJyYXlNb2RlbENvbnRhaW5lciBleHRlbmRzIE1vZGVsQ29udGFpbmVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY2hlbWEpIHtcclxuICAgICAgICBzdXBlcihzY2hlbWEpO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YSA9IG51bGw7XHJcblxyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZGVmYXVsdFJldHVybl9fKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNvdXJjZSkgcmV0dXJuIG5ldyBNQ0FycmF5O1xyXG5cclxuICAgICAgICBsZXQgbiA9IG5ldyBBcnJheU1vZGVsQ29udGFpbmVyKHRoaXMuc2NoZW1hKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX2xpbmtfXyhuKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9XHJcblxyXG4gICAgX19pbnNlcnRfXyhtb2RlbCwgYWRkX2xpc3QsIGlkZW50aWZpZXIpIHtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmRhdGEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgb2JqID0gdGhpcy5kYXRhW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX19nZXRJZGVudGlmaWVyX18ob2JqKSA9PSBpZGVudGlmaWVyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgb2JqLmFkZChtb2RlbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvL01vZGVsIG5vdCBhZGRlZCB0byBDb250YWluZXIuIE1vZGVsIGp1c3QgdXBkYXRlZC5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kYXRhLnB1c2gobW9kZWwpO1xyXG5cclxuICAgICAgICBpZiAoYWRkX2xpc3QpIGFkZF9saXN0LnB1c2gobW9kZWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gTW9kZWwgYWRkZWQgdG8gQ29udGFpbmVyLlxyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0X18odGVybSwgcmV0dXJuX2RhdGEpIHtcclxuXHJcbiAgICAgICAgbGV0IHRlcm1zID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHRlcm0pXHJcbiAgICAgICAgICAgIGlmICh0ZXJtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHRlcm1zID0gdGVybTtcclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICB0ZXJtcyA9IFt0ZXJtXTtcclxuXHJcblxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuZGF0YS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IG9iaiA9IHRoaXMuZGF0YVtpXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX19nZXRJZGVudGlmaWVyX18ob2JqLCB0ZXJtcykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybl9kYXRhLnB1c2gob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJldHVybl9kYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0QWxsX18ocmV0dXJuX2RhdGEpIHtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhLmZvckVhY2goKG0pID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuX2RhdGEucHVzaChtKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHJldHVybiByZXR1cm5fZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBfX3JlbW92ZUFsbF9fKCkge1xyXG4gICAgICAgIGxldCBpdGVtcyA9IHRoaXMuZGF0YS5tYXAoZCA9PiBkKSB8fCBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuXHJcbiAgICBfX3JlbW92ZV9fKHRlcm0sIG91dF9jb250YWluZXIpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmRhdGEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvYmogPSB0aGlzLmRhdGFbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fX2dldElkZW50aWZpZXJfXyhvYmosIHRlcm0pKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc3BsaWNlKGksIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIGwtLTtcclxuICAgICAgICAgICAgICAgIGktLTtcclxuXHJcbiAgICAgICAgICAgICAgICBvdXRfY29udGFpbmVyLnB1c2gob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBBcnJheU1vZGVsQ29udGFpbmVyXHJcbn0iLCJpbXBvcnQge1xyXG4gICAgTW9kZWxDb250YWluZXIsXHJcbiAgICBNQ0FycmF5XHJcbn0gZnJvbSBcIi4vbW9kZWxfY29udGFpbmVyXCJcclxuXHJcbmNsYXNzIEJUcmVlTW9kZWxDb250YWluZXIgZXh0ZW5kcyBNb2RlbENvbnRhaW5lciB7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NoZW1hKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKHNjaGVtYSk7XHJcblxyXG4gICAgICAgIHRoaXMucm9vdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5taW4gPSAxMDtcclxuICAgICAgICB0aGlzLm1heCA9IDIwO1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAodGhpcy5yb290KVxyXG4gICAgICAgICAgICB0aGlzLnJvb3QuZGVzdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zaXplO1xyXG4gICAgfVxyXG5cclxuICAgIF9faW5zZXJ0X18obW9kZWwsIGFkZF9saXN0LCBpZGVudGlmaWVyKSB7XHJcblxyXG4gICAgICAgIGxldCByZXN1bHQgPSB7XHJcbiAgICAgICAgICAgIGFkZGVkOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5yb290KVxyXG4gICAgICAgICAgICB0aGlzLnJvb3QgPSBuZXcgQnRyZWVOb2RlKHRydWUpO1xyXG5cclxuICAgICAgICB0aGlzLnJvb3QgPSB0aGlzLnJvb3QuaW5zZXJ0KGlkZW50aWZpZXIsIG1vZGVsLCB0aGlzLm1heCwgdHJ1ZSwgcmVzdWx0KS5uZXdub2RlO1xyXG5cclxuICAgICAgICBpZiAoYWRkX2xpc3QpIGFkZF9saXN0LnB1c2gobW9kZWwpO1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0LmFkZGVkKVxyXG4gICAgICAgICAgICB0aGlzLnNpemUrKztcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5hZGRlZDtcclxuICAgIH1cclxuXHJcbiAgICBfX2dldF9fKHRlcm1zLCBfX3JldHVybl9kYXRhX18pIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucm9vdCAmJiB0ZXJtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0ZXJtcy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmdldChwYXJzZUZsb2F0KHRlcm1zWzBdKSwgcGFyc2VGbG9hdCh0ZXJtc1swXSksIF9fcmV0dXJuX2RhdGFfXyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGVybXMubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmdldChwYXJzZUZsb2F0KHRlcm1zWzBdKSwgcGFyc2VGbG9hdCh0ZXJtc1sxXSksIF9fcmV0dXJuX2RhdGFfXyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRlcm1zLmxlbmd0aCAtIDE7IGkgPiBsOyBpICs9IDIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LmdldChwYXJzZUZsb2F0KHRlcm1zW2ldKSwgcGFyc2VGbG9hdCh0ZXJtc1tpICsgMV0pLCBfX3JldHVybl9kYXRhX18pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gX19yZXR1cm5fZGF0YV9fO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcmVtb3ZlX18odGVybXMsIG91dF9jb250YWluZXIpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucm9vdCAmJiB0ZXJtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0ZXJtcy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG8gPSB0aGlzLnJvb3QucmVtb3ZlKHRlcm1zWzBdLCB0ZXJtc1swXSwgdHJ1ZSwgdGhpcy5taW4sIG91dF9jb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gby5vdXQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QgPSBvLm91dF9ub2RlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRlcm1zLmxlbmd0aCA8IDMpIHtcclxuICAgICAgICAgICAgICAgIGxldCBvID0gdGhpcy5yb290LnJlbW92ZSh0ZXJtc1swXSwgdGVybXNbMV0sIHRydWUsIHRoaXMubWluLCBvdXRfY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9by5vdXQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QgPSBvLm91dF9ub2RlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0ZXJtcy5sZW5ndGggLSAxOyBpID4gbDsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG8gPSB0aGlzLnJvb3QucmVtb3ZlKHRlcm1zW2ldLCB0ZXJtc1tpICsgMV0sIHRydWUsIHRoaXMubWluLCBvdXRfY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBvLm91dDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QgPSBvLm91dF9ub2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNpemUgLT0gcmVzdWx0O1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0ICE9PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0QWxsX18oX19yZXR1cm5fZGF0YV9fKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucm9vdClcclxuICAgICAgICAgICAgdGhpcy5yb290LmdldCgtSW5maW5pdHksIEluZmluaXR5LCBfX3JldHVybl9kYXRhX18pO1xyXG4gICAgICAgIHJldHVybiBfX3JldHVybl9kYXRhX187XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVBbGxfXygpIHtcclxuICAgICAgICBpZiAodGhpcy5yb290KVxyXG4gICAgICAgICAgICB0aGlzLnJvb3QuZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgIHRoaXMucm9vdCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKCkge1xyXG4gICAgICAgIGxldCBvdXRfZGF0YSA9IFtdO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yb290KSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJvb3QuZ2V0KC1JbmZpbml0eSwgSW5maW5pdHksIG91dF9kYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQnRyZWVOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKElTX0xFQUYgPSBmYWxzZSkge1xyXG4gICAgICAgIHRoaXMuTEVBRiA9IElTX0xFQUY7XHJcbiAgICAgICAgdGhpcy5ub2RlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMua2V5cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaXRlbXMgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZXMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMua2V5cyA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5MRUFGKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5ub2Rlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGVzW2ldLmRlc3RydWN0b3IoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGJhbGFuY2VJbnNlcnQobWF4X3NpemUsIElTX1JPT1QgPSBmYWxzZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmtleXMubGVuZ3RoID49IG1heF9zaXplKSB7XHJcbiAgICAgICAgICAgIC8vbmVlZCB0byBzcGxpdCB0aGlzIHVwIVxyXG5cclxuICAgICAgICAgICAgbGV0IG5ld25vZGUgPSBuZXcgQnRyZWVOb2RlKHRoaXMuTEVBRik7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3BsaXQgPSAobWF4X3NpemUgPj4gMSkgfCAwO1xyXG5cclxuICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tzcGxpdF07XHJcblxyXG4gICAgICAgICAgICBsZXQgbGVmdF9rZXlzID0gdGhpcy5rZXlzLnNsaWNlKDAsIHNwbGl0KTtcclxuICAgICAgICAgICAgbGV0IGxlZnRfbm9kZXMgPSB0aGlzLm5vZGVzLnNsaWNlKDAsICh0aGlzLkxFQUYpID8gc3BsaXQgOiBzcGxpdCArIDEpXHJcblxyXG4gICAgICAgICAgICBsZXQgcmlnaHRfa2V5cyA9IHRoaXMua2V5cy5zbGljZSgodGhpcy5MRUFGKSA/IHNwbGl0IDogc3BsaXQgKyAxKTtcclxuICAgICAgICAgICAgbGV0IHJpZ2h0X25vZGVzID0gdGhpcy5ub2Rlcy5zbGljZSgodGhpcy5MRUFGKSA/IHNwbGl0IDogc3BsaXQgKyAxKTtcclxuXHJcbiAgICAgICAgICAgIG5ld25vZGUua2V5cyA9IHJpZ2h0X2tleXM7XHJcbiAgICAgICAgICAgIG5ld25vZGUubm9kZXMgPSByaWdodF9ub2RlcztcclxuXHJcbiAgICAgICAgICAgIHRoaXMua2V5cyA9IGxlZnRfa2V5cztcclxuICAgICAgICAgICAgdGhpcy5ub2RlcyA9IGxlZnRfbm9kZXM7XHJcblxyXG4gICAgICAgICAgICBpZiAoSVNfUk9PVCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCByb290ID0gbmV3IEJ0cmVlTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJvb3Qua2V5cy5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgICAgICByb290Lm5vZGVzLnB1c2godGhpcywgbmV3bm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdub2RlOiByb290LFxyXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgbmV3bm9kZTogbmV3bm9kZSxcclxuICAgICAgICAgICAgICAgIGtleToga2V5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5ld25vZGU6IHRoaXMsXHJcbiAgICAgICAgICAgIGtleTogMFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgSW5zZXJ0cyBtb2RlbCBpbnRvIHRoZSB0cmVlLCBzb3J0ZWQgYnkgaWRlbnRpZmllci4gXHJcbiAgICAqL1xyXG4gICAgaW5zZXJ0KGlkZW50aWZpZXIsIG1vZGVsLCBtYXhfc2l6ZSwgSVNfUk9PVCA9IGZhbHNlLCByZXN1bHQpIHtcclxuXHJcbiAgICAgICAgbGV0IGwgPSB0aGlzLmtleXMubGVuZ3RoO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuTEVBRikge1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5rZXlzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpZGVudGlmaWVyIDwga2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbyA9IG5vZGUuaW5zZXJ0KGlkZW50aWZpZXIsIG1vZGVsLCBtYXhfc2l6ZSwgZmFsc2UsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGtleXIgPSBvLmtleTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3bm9kZSA9IG8ubmV3bm9kZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleXIgPT0gdW5kZWZpbmVkKSBkZWJ1Z2dlclxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3bm9kZSAhPSBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMua2V5cy5zcGxpY2UoaSwgMCwga2V5cik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZXMuc3BsaWNlKGkgKyAxLCAwLCBuZXdub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJhbGFuY2VJbnNlcnQobWF4X3NpemUsIElTX1JPT1QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXMubm9kZXNbaV07XHJcblxyXG4gICAgICAgICAgICBsZXQge1xyXG4gICAgICAgICAgICAgICAgbmV3bm9kZSxcclxuICAgICAgICAgICAgICAgIGtleVxyXG4gICAgICAgICAgICB9ID0gbm9kZS5pbnNlcnQoaWRlbnRpZmllciwgbW9kZWwsIG1heF9zaXplLCBmYWxzZSwgcmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChrZXkgPT0gdW5kZWZpbmVkKSBkZWJ1Z2dlclxyXG5cclxuICAgICAgICAgICAgaWYgKG5ld25vZGUgIT0gbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZXMucHVzaChuZXdub2RlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFsYW5jZUluc2VydChtYXhfc2l6ZSwgSVNfUk9PVCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMua2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgPT0ga2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2Rlc1tpXS5hZGQoa2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld25vZGU6IHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogaWRlbnRpZmllclxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlkZW50aWZpZXIgPCBrZXkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5rZXlzLnNwbGljZShpLCAwLCBpZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVzLnNwbGljZShpLCAwLCBtb2RlbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJhbGFuY2VJbnNlcnQobWF4X3NpemUsIElTX1JPT1QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmtleXMucHVzaChpZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgdGhpcy5ub2Rlcy5wdXNoKG1vZGVsKTtcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdC5hZGRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iYWxhbmNlSW5zZXJ0KG1heF9zaXplLCBJU19ST09UKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5ld25vZGU6IHRoaXMsXHJcbiAgICAgICAgICAgIGtleTogaWRlbnRpZmllcixcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGJhbGFuY2VSZW1vdmUoaW5kZXgsIG1pbl9zaXplKSB7XHJcbiAgICAgICAgbGV0IGxlZnQgPSB0aGlzLm5vZGVzW2luZGV4IC0gMV07XHJcbiAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5ub2Rlc1tpbmRleCArIDFdO1xyXG4gICAgICAgIGxldCBub2RlID0gdGhpcy5ub2Rlc1tpbmRleF07XHJcblxyXG4gICAgICAgIC8vTGVmdCByb3RhdGVcclxuICAgICAgICBpZiAobGVmdCAmJiBsZWZ0LmtleXMubGVuZ3RoID4gbWluX3NpemUpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBsayA9IGxlZnQua2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBsbiA9IGxlZnQubm9kZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgbm9kZS5rZXlzLnVuc2hpZnQoKG5vZGUuTEVBRikgPyBsZWZ0LmtleXNbbGsgLSAxXSA6IHRoaXMua2V5c1tpbmRleCAtIDFdKTtcclxuICAgICAgICAgICAgbm9kZS5ub2Rlcy51bnNoaWZ0KGxlZnQubm9kZXNbbG4gLSAxXSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmtleXNbaW5kZXggLSAxXSA9IGxlZnQua2V5c1tsayAtIDFdO1xyXG5cclxuICAgICAgICAgICAgbGVmdC5rZXlzLmxlbmd0aCA9IGxrIC0gMTtcclxuICAgICAgICAgICAgbGVmdC5ub2Rlcy5sZW5ndGggPSBsbiAtIDE7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgLy9SaWdodCByb3RhdGVcclxuICAgICAgICBpZiAocmlnaHQgJiYgcmlnaHQua2V5cy5sZW5ndGggPiBtaW5fc2l6ZSkge1xyXG5cclxuICAgICAgICAgICAgbm9kZS5rZXlzLnB1c2goKG5vZGUuTEVBRikgPyByaWdodC5rZXlzWzBdIDogdGhpcy5rZXlzW2luZGV4XSk7XHJcbiAgICAgICAgICAgIG5vZGUubm9kZXMucHVzaChyaWdodC5ub2Rlc1swXSk7XHJcblxyXG4gICAgICAgICAgICByaWdodC5rZXlzLnNwbGljZSgwLCAxKTtcclxuICAgICAgICAgICAgcmlnaHQubm9kZXMuc3BsaWNlKDAsIDEpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5rZXlzW2luZGV4XSA9IChub2RlLkxFQUYpID8gcmlnaHQua2V5c1sxXSA6IHJpZ2h0LmtleXNbMF07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAvL0xlZnQgb3IgUmlnaHQgTWVyZ2VcclxuICAgICAgICAgICAgaWYgKCFsZWZ0KSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgbGVmdCA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gcmlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbaW5kZXggLSAxXTtcclxuICAgICAgICAgICAgdGhpcy5rZXlzLnNwbGljZShpbmRleCAtIDEsIDEpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGVzLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG4gICAgICAgICAgICBsZWZ0Lm5vZGVzID0gbGVmdC5ub2Rlcy5jb25jYXQobm9kZS5ub2Rlcyk7XHJcbiAgICAgICAgICAgIGlmICghbGVmdC5MRUFGKSBsZWZ0LmtleXMucHVzaChrZXkpXHJcbiAgICAgICAgICAgIGxlZnQua2V5cyA9IGxlZnQua2V5cy5jb25jYXQobm9kZS5rZXlzKTtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAobGVmdC5MRUFGKVxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZWZ0LmtleXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlZnQua2V5c1tpXSAhPSBsZWZ0Lm5vZGVzW2ldLmlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlKHN0YXJ0LCBlbmQsIElTX1JPT1QgPSBmYWxzZSwgbWluX3NpemUsIG91dF9jb250YWluZXIpIHtcclxuICAgICAgICBsZXQgbCA9IHRoaXMua2V5cy5sZW5ndGgsXHJcbiAgICAgICAgICAgIG91dCA9IDAsXHJcbiAgICAgICAgICAgIG91dF9ub2RlID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLkxFQUYpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPD0ga2V5KVxyXG4gICAgICAgICAgICAgICAgICAgIG91dCArPSB0aGlzLm5vZGVzW2ldLnJlbW92ZShzdGFydCwgZW5kLCBmYWxzZSwgbWluX3NpemUsIG91dF9jb250YWluZXIpLm91dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgb3V0ICs9IHRoaXMubm9kZXNbaV0ucmVtb3ZlKHN0YXJ0LCBlbmQsIGZhbHNlLCBtaW5fc2l6ZSwgb3V0X2NvbnRhaW5lcikub3V0O1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ub2Rlc1tpXS5rZXlzLmxlbmd0aCA8IG1pbl9zaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYmFsYW5jZVJlbW92ZShpLCBtaW5fc2l6ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbC0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGVzLmxlbmd0aCA9PSAxKVxyXG4gICAgICAgICAgICAgICAgb3V0X25vZGUgPSB0aGlzLm5vZGVzWzBdO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5rZXlzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPD0gZW5kICYmIGtleSA+PSBzdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dF9jb250YWluZXIucHVzaCh0aGlzLm5vZGVzW2ldKVxyXG4gICAgICAgICAgICAgICAgICAgIG91dCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMua2V5cy5zcGxpY2UoaSwgMSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBsLS07XHJcbiAgICAgICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBvdXRfbm9kZSxcclxuICAgICAgICAgICAgb3V0XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoc3RhcnQsIGVuZCwgb3V0X2NvbnRhaW5lcikge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXJ0IHx8ICFlbmQpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLkxFQUYpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5rZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0IDw9IGtleSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVzW2ldLmdldChzdGFydCwgZW5kLCBvdXRfY29udGFpbmVyKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm5vZGVzW2ldLmdldChzdGFydCwgZW5kLCBvdXRfY29udGFpbmVyLCApXHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgb3V0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMua2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA8PSBlbmQgJiYga2V5ID49IHN0YXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgIG91dF9jb250YWluZXIucHVzaCh0aGlzLm5vZGVzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIEJUcmVlTW9kZWxDb250YWluZXJcclxufSIsImltcG9ydCB7XHJcbiAgICBTY2hlbWFUeXBlXHJcbn0gZnJvbSBcIi4vc2NoZW1hX3R5cGUuanNcIlxyXG5cclxubGV0IE5VTUJFUiA9IG5ldyhjbGFzcyBOdW1iZXJTY2hlbWEgZXh0ZW5kcyBTY2hlbWFUeXBlIHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRfdmFsdWUgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlKHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHZlcmlmeSh2YWx1ZSwgcmVzdWx0KSB7XHJcbiAgICAgICAgcmVzdWx0LnZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYodmFsdWUgPT0gTmFOIHx8IHZhbHVlID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHJlc3VsdC52YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXN1bHQucmVhc29uID0gXCJJbnZhbGlkIG51bWJlciB0eXBlLlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXIoaWRlbnRpZmllciwgZmlsdGVycykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgPT0gZmlsdGVyc1tpXSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG59KSgpXHJcblxyXG5leHBvcnQge1xyXG4gICAgTlVNQkVSXHJcbn07IiwiY29uc3QgbW9udGhzID0gW3tcclxuICAgIG5hbWU6IFwiSmFudWFyeVwiLFxyXG4gICAgZGF5czogMzEsXHJcbiAgICBkYXlfb2Zmc2V0OiAwLFxyXG4gICAgZGF5X29mZnNlX2xlYXB0OiAwXHJcbn0sIHtcclxuICAgIG5hbWU6IFwiRmVicnVhcnlcIixcclxuICAgIGRheXM6IDI4LFxyXG4gICAgZGF5X29mZnNldDogMzEsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDMxXHJcbn0sIHtcclxuICAgIG5hbWU6IFwiTWFyY2hcIixcclxuICAgIGRheXM6IDMxLFxyXG4gICAgZGF5X29mZnNldDogNTksXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDYwXHJcbn0sIHtcclxuICAgIG5hbWU6IFwiQXByaWxcIixcclxuICAgIGRheXM6IDMwLFxyXG4gICAgZGF5X29mZnNldDogOTAsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDkxXHJcbn0sIHtcclxuICAgIG5hbWU6IFwiTWF5XCIsXHJcbiAgICBkYXlzOiAzMSxcclxuICAgIGRheV9vZmZzZXQ6IDEyMCxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogMTIxXHJcbn0sIHtcclxuICAgIG5hbWU6IFwiSnVuZVwiLFxyXG4gICAgZGF5czogMzAsXHJcbiAgICBkYXlfb2Zmc2V0OiAxNTEsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDE1MlxyXG59LCB7XHJcbiAgICBuYW1lOiBcIkp1bHlcIixcclxuICAgIGRheXM6IDMxLFxyXG4gICAgZGF5X29mZnNldDogMTgxLFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiAxODJcclxufSwge1xyXG4gICAgbmFtZTogXCJBdWd1c3RcIixcclxuICAgIGRheXM6IDMxLFxyXG4gICAgZGF5X29mZnNldDogMjEyLFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiAyMTNcclxufSwge1xyXG4gICAgbmFtZTogXCJTZXB0ZW1iZXJcIixcclxuICAgIGRheXM6IDMwLFxyXG4gICAgZGF5X29mZnNldDogMjQzLFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiAyNDRcclxufSwge1xyXG4gICAgbmFtZTogXCJPY3RvYmVyXCIsXHJcbiAgICBkYXlzOiAzMSxcclxuICAgIGRheV9vZmZzZXQ6IDI3MyxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogMjc0XHJcbn0sIHtcclxuICAgIG5hbWU6IFwiTm92ZW1iZXJcIixcclxuICAgIGRheXM6IDMwLFxyXG4gICAgZGF5X29mZnNldDogMzA0LFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiAzMDVcclxufSwge1xyXG4gICAgbmFtZTogXCJEZWNlbWJlclwiLFxyXG4gICAgZGF5czogMzEsXHJcbiAgICBkYXlfb2Zmc2V0OiAzMyxcclxuICAgIGRheV9vZmZzZV9sZWFwdDogMzM1XHJcbn1dXHJcblxyXG5leHBvcnQge21vbnRoc30iLCJcclxudmFyIGRvdyA9IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdO1xyXG5cclxuZXhwb3J0IHtkb3d9IiwiZnVuY3Rpb24gR2V0RGF5U3RhcnRBbmRFbmQoZGF0ZSkge1xyXG4gICAgdmFyIHJ2YWwgPSB7XHJcbiAgICAgICAgc3RhcnQ6IDAsXHJcbiAgICAgICAgZW5kOiAwXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChkYXRlIGluc3RhbmNlb2YgRGF0ZSB8fCB0eXBlb2YoZGF0ZSkgPT0gXCJudW1iZXJcIiApIHtcclxuICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKGRhdGUpO1xyXG5cclxuICAgICAgICBkLnNldEhvdXJzKDApO1xyXG4gICAgICAgIGQuc2V0TWludXRlcygwKTtcclxuICAgICAgICBkLnNldFNlY29uZHMoMCk7XHJcbiAgICAgICAgZC5zZXRNaWxsaXNlY29uZHMoMClcclxuXHJcbiAgICAgICAgcnZhbC5zdGFydCA9IGQudmFsdWVPZigpO1xyXG4gICAgICAgIGQuc2V0RGF0ZShkLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIGQuc2V0U2Vjb25kcygtMSk7XHJcbiAgICAgICAgcnZhbC5lbmQgPSBkLnZhbHVlT2YoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcnZhbDtcclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIEdldERheVN0YXJ0QW5kRW5kXHJcbn0iLCJmdW5jdGlvbiBmbG9hdDI0dG8xMk1vZFRpbWUodGltZSwgQ0FQSVRBTCkge1xyXG4gICAgdmFyIElTX1BNID0gdGltZSA+PSAxMiAmJiB0aW1lIDwgMjQ7XHJcbiAgICB2YXIgbWludXRlcyA9ICgodGltZSAlIDEpICogNjApIHwgMDtcclxuICAgIHZhciBob3VycyA9ICgoKHRpbWUgfCAwKSAlIDEyKSAhPSAwKSA/ICh0aW1lIHwgMCkgJSAxMiA6IDEyO1xyXG5cclxuICAgIHJldHVybiAoaG91cnMgKyBcIjpcIiArIChcIjBcIiArIG1pbnV0ZXMpLnNsaWNlKC0yKSkgKyAoKElTX1BNKSA/IChDQVBJVEFMKSA/IFwiUE1cIiA6XCJwbVwiIDogKENBUElUQUwpID8gXCJBTVwiIDogXCJhbVwiKTtcclxufVxyXG5cclxuZXhwb3J0IHtmbG9hdDI0dG8xMk1vZFRpbWV9IiwiY2xhc3MgUG9pbnQyRCBleHRlbmRzIEZsb2F0NjRBcnJheXtcclxuXHRcclxuXHRjb25zdHJ1Y3Rvcih4LCB5KSB7XHJcblx0XHRzdXBlcigyKVxyXG5cclxuXHRcdGlmICh0eXBlb2YoeCkgPT0gXCJudW1iZXJcIikge1xyXG5cdFx0XHR0aGlzWzBdID0geDtcclxuXHRcdFx0dGhpc1sxXSA9IHk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoeCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcblx0XHRcdHRoaXNbMF0gPSB4WzBdO1xyXG5cdFx0XHR0aGlzWzFdID0geFsxXTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRyYXcoY3R4LCBzID0gMSl7XHJcblx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRjdHgubW92ZVRvKHRoaXMueCpzLHRoaXMueSpzKTtcclxuXHRcdGN0eC5hcmModGhpcy54KnMsIHRoaXMueSpzLCBzKjAuMDEsIDAsIDIqTWF0aC5QSSk7XHJcblx0XHRjdHguc3Ryb2tlKCk7XHJcblx0fVxyXG5cclxuXHRnZXQgeCAoKXsgcmV0dXJuIHRoaXNbMF19XHJcblx0c2V0IHggKHYpe2lmKHR5cGVvZih2KSAhPT0gXCJudW1iZXJcIikgcmV0dXJuOyB0aGlzWzBdID0gdn1cclxuXHJcblx0Z2V0IHkgKCl7IHJldHVybiB0aGlzWzFdfVxyXG5cdHNldCB5ICh2KXtpZih0eXBlb2YodikgIT09IFwibnVtYmVyXCIpIHJldHVybjsgdGhpc1sxXSA9IHZ9XHJcbn1cclxuXHJcbmV4cG9ydCB7UG9pbnQyRH0iLCJpbXBvcnQge1xyXG4gICAgUG9pbnQyRFxyXG59IGZyb20gXCIuL3BvaW50MkRcIlxyXG5cclxuZnVuY3Rpb24gY3VydmVQb2ludChjdXJ2ZSwgdCkge1xyXG4gICAgdmFyIHBvaW50ID0ge1xyXG4gICAgICAgIHg6IDAsXHJcbiAgICAgICAgeTogMFxyXG4gICAgfTtcclxuICAgIHBvaW50LnggPSBwb3NPbkN1cnZlKHQsIGN1cnZlWzBdLCBjdXJ2ZVsyXSwgY3VydmVbNF0pO1xyXG4gICAgcG9pbnQueSA9IHBvc09uQ3VydmUodCwgY3VydmVbMV0sIGN1cnZlWzNdLCBjdXJ2ZVs1XSk7XHJcbiAgICByZXR1cm4gcG9pbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBvc09uQ3VydmUodCwgcDEsIHAyLCBwMykge1xyXG4gICAgdmFyIHRpID0gMSAtIHQ7XHJcbiAgICByZXR1cm4gdGkgKiB0aSAqIHAxICsgMiAqIHRpICogdCAqIHAyICsgdCAqIHQgKiBwMztcclxufVxyXG5cclxuZnVuY3Rpb24gc3BsaXRDdXJ2ZShicCwgdCkge1xyXG4gICAgdmFyIGxlZnQgPSBbXTtcclxuICAgIHZhciByaWdodCA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGRyYXdDdXJ2ZShicCwgdCkge1xyXG4gICAgICAgIGlmIChicC5sZW5ndGggPT0gMikge1xyXG4gICAgICAgICAgICBsZWZ0LnB1c2goYnBbMF0sIGJwWzFdKTtcclxuICAgICAgICAgICAgcmlnaHQucHVzaChicFswXSwgYnBbMV0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdfYnAgPSBbXSAvL2JwLnNsaWNlKDAsLTIpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJwLmxlbmd0aCAtIDI7IGkgKz0gMikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQucHVzaChicFtpXSwgYnBbaSArIDFdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpID09IGJwLmxlbmd0aCAtIDQpIHtcclxuICAgICAgICAgICAgICAgICAgICByaWdodC5wdXNoKGJwW2kgKyAyXSwgYnBbaSArIDNdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG5ld19icC5wdXNoKCgxIC0gdCkgKiBicFtpXSArIHQgKiBicFtpICsgMl0pO1xyXG4gICAgICAgICAgICAgICAgbmV3X2JwLnB1c2goKDEgLSB0KSAqIGJwW2kgKyAxXSArIHQgKiBicFtpICsgM10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRyYXdDdXJ2ZShuZXdfYnAsIHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcmF3Q3VydmUoYnAsIHQpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgeDogbmV3IFFCZXppZXIocmlnaHQpLFxyXG4gICAgICAgIHk6IG5ldyBRQmV6aWVyKGxlZnQpXHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjdXJ2ZUludGVyc2VjdGlvbnMocDEsIHAyLCBwMykge1xyXG4gICAgdmFyIGludGVyc2VjdGlvbnMgPSB7XHJcbiAgICAgICAgYTogSW5maW5pdHksXHJcbiAgICAgICAgYjogSW5maW5pdHlcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGEgPSBwMSAtIDIgKiBwMiArIHAzO1xyXG5cclxuICAgIHZhciBiID0gMiAqIChwMiAtIHAxKTtcclxuXHJcbiAgICB2YXIgYyA9IHAxO1xyXG5cclxuICAgIGlmIChiID09IDApIHt9IGVsc2UgaWYgKE1hdGguYWJzKGEpIDwgMC4wMDAwMDAwMDAwNSkge1xyXG4gICAgICAgIGludGVyc2VjdGlvbnMuYSA9ICgtYyAvIGIpOyAvL2MgLyBiO1xyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgaW50ZXJzZWN0aW9ucy5hID0gKCgtYiAtIE1hdGguc3FydCgoYiAqIGIpIC0gNCAqIGEgKiBjKSkgLyAoMiAqIGEpKTtcclxuICAgICAgICBpbnRlcnNlY3Rpb25zLmIgPSAoKC1iICsgTWF0aC5zcXJ0KChiICogYikgLSA0ICogYSAqIGMpKSAvICgyICogYSkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGludGVyc2VjdGlvbnNcclxufVxyXG5cclxuY2xhc3MgUUJlemllciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4MSwgeTEsIHgyLCB5MiwgeDMsIHkzKSB7XHJcbiAgICAgICAgdGhpcy54MSA9IDA7XHJcbiAgICAgICAgdGhpcy54MiA9IDA7XHJcbiAgICAgICAgdGhpcy54MyA9IDA7XHJcbiAgICAgICAgdGhpcy55MSA9IDA7XHJcbiAgICAgICAgdGhpcy55MiA9IDA7XHJcbiAgICAgICAgdGhpcy55MyA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YoeDEpID09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgdGhpcy54MSA9IHgxO1xyXG4gICAgICAgICAgICB0aGlzLngyID0geDI7XHJcbiAgICAgICAgICAgIHRoaXMueDMgPSB4MztcclxuICAgICAgICAgICAgdGhpcy55MSA9IHkxO1xyXG4gICAgICAgICAgICB0aGlzLnkyID0geTI7XHJcbiAgICAgICAgICAgIHRoaXMueTMgPSB5MztcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHgxIGluc3RhbmNlb2YgUUJlemllcikge1xyXG4gICAgICAgICAgICB0aGlzLngxID0geDEueDE7XHJcbiAgICAgICAgICAgIHRoaXMueDIgPSB4MS54MjtcclxuICAgICAgICAgICAgdGhpcy54MyA9IHgxLngzO1xyXG4gICAgICAgICAgICB0aGlzLnkxID0geDEueTE7XHJcbiAgICAgICAgICAgIHRoaXMueTIgPSB4MS55MjtcclxuICAgICAgICAgICAgdGhpcy55MyA9IHgxLnkzO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoeDEgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICB0aGlzLngxID0geDFbMF07XHJcbiAgICAgICAgICAgIHRoaXMueTEgPSB4MVsxXTtcclxuICAgICAgICAgICAgdGhpcy54MiA9IHgxWzJdO1xyXG4gICAgICAgICAgICB0aGlzLnkyID0geDFbM107XHJcbiAgICAgICAgICAgIHRoaXMueDMgPSB4MVs0XTtcclxuICAgICAgICAgICAgdGhpcy55MyA9IHgxWzVdO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldmVyc2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRQmV6aWVyKFxyXG4gICAgICAgICAgICB0aGlzLngzLFxyXG4gICAgICAgICAgICB0aGlzLnkzLFxyXG4gICAgICAgICAgICB0aGlzLngyLFxyXG4gICAgICAgICAgICB0aGlzLnkyLFxyXG4gICAgICAgICAgICB0aGlzLngxLFxyXG4gICAgICAgICAgICB0aGlzLnkxXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHBvaW50KHQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50MkQoXHJcbiAgICAgICAgICAgIHBvc09uQ3VydmUodCwgdGhpcy54MSwgdGhpcy54MiwgdGhpcy54MyksXHJcbiAgICAgICAgICAgIHBvc09uQ3VydmUodCwgdGhpcy55MSwgdGhpcy55MiwgdGhpcy55MykpXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRhbmdlbnQodCkge1xyXG4gICAgICAgIHZhciB0YW4gPSB7XHJcbiAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgIHk6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgcHgxID0gdGhpcy54MiAtIHRoaXMueDE7XHJcbiAgICAgICAgdmFyIHB5MSA9IHRoaXMueTIgLSB0aGlzLnkxO1xyXG5cclxuICAgICAgICB2YXIgcHgyID0gdGhpcy54MyAtIHRoaXMueDI7XHJcbiAgICAgICAgdmFyIHB5MiA9IHRoaXMueTMgLSB0aGlzLnkyO1xyXG5cclxuICAgICAgICB0YW4ueCA9ICgxIC0gdCkgKiBweDEgKyB0ICogcHgyO1xyXG4gICAgICAgIHRhbi55ID0gKDEgLSB0KSAqIHB5MSArIHQgKiBweTI7XHJcblxyXG4gICAgICAgIHJldHVybiB0YW47XHJcbiAgICB9XHJcblxyXG4gICAgdG9BcnJheSgpIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMueDEsIHRoaXMueTEsIHRoaXMueDIsIHRoaXMueTIsIHRoaXMueDMsIHRoaXMueTNdO1xyXG4gICAgfVxyXG5cclxuICAgIHNwbGl0KHQpIHtcclxuICAgICAgICByZXR1cm4gc3BsaXRDdXJ2ZSh0aGlzLnRvQXJyYXkoKSwgdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcm9vdHNYICgpe1xyXG4gICAgXHRyZXR1cm4gdGhpcy5yb290cyhcclxuICAgIFx0XHR0aGlzLngxLCBcclxuICAgIFx0XHR0aGlzLngyLFxyXG4gICAgXHRcdHRoaXMueDNcclxuICAgIFx0XHQpXHJcbiAgICBcdFxyXG4gICAgfVxyXG5cclxuICAgIHJvb3RzKHAxLCBwMiwgcDMpIHtcclxuICAgICAgICB2YXIgY3VydmUgPSB0aGlzLnRvQXJyYXkoKTtcclxuXHJcbiAgICAgICAgdmFyIGMgPSBwMSAtICgyKnAyKSArIHAzO1xyXG4gICAgICAgIHZhciBiID0gMioocDIgLSBwMSk7XHJcbiAgICAgICAgdmFyIGEgPSBwMTtcclxuICAgICAgICB2YXIgYTIgPSBhKjI7XHJcbiAgICAgICAgY29uc29sZS5sb2coYyAsXCIgY1wiKVxyXG4gICAgICAgIHZhciBzcXJ0ID0gTWF0aC5zcXJ0KGIqYiAtIChhICogNCAqYykpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHNxcnQsIGIsIGEyLCBwMylcclxuICAgICAgICB2YXIgdDEgPSAoLWIgKyBzcXJ0KSAvIGEyO1xyXG4gICAgICAgIHZhciB0MiA9ICgtYiAtIHNxcnQpIC8gYTI7XHJcblxyXG4gICAgICAgIHJldHVybiBbIHQxICwgdDIgXTtcclxuICAgIH0gXHJcblxyXG4gICAgcm9vdHNhKCkge1xyXG4gICAgICAgIHZhciBjdXJ2ZSA9IHRoaXMudG9BcnJheSgpO1xyXG5cclxuICAgICAgICB2YXIgcDEgPSBjdXJ2ZVsxXTtcclxuICAgICAgICB2YXIgcDIgPSBjdXJ2ZVszXTtcclxuICAgICAgICB2YXIgcDMgPSBjdXJ2ZVs1XTtcclxuICAgICAgICB2YXIgeDEgPSBjdXJ2ZVswXTtcclxuICAgICAgICB2YXIgeDIgPSBjdXJ2ZVsyXTtcclxuICAgICAgICB2YXIgeDMgPSBjdXJ2ZVs0XTtcclxuXHJcbiAgICAgICAgdmFyIHB5MWQgPSAyICogKHAyIC0gcDEpO1xyXG4gICAgICAgIHZhciBweTJkID0gMiAqIChwMyAtIHAyKTtcclxuICAgICAgICB2YXIgYWQxID0gLXB5MWQgKyBweTJkO1xyXG4gICAgICAgIHZhciBiZDEgPSBweTFkO1xyXG5cclxuICAgICAgICB2YXIgcHgxZCA9IDIgKiAoeDIgLSB4MSk7XHJcbiAgICAgICAgdmFyIHB4MmQgPSAyICogKHgzIC0geDIpO1xyXG4gICAgICAgIHZhciBhZDIgPSAtcHgxZCArIHB4MmQ7XHJcbiAgICAgICAgdmFyIGJkMiA9IHB4MWQ7XHJcblxyXG4gICAgICAgIHZhciB0MSA9IC1iZDEgLyBhZDE7XHJcbiAgICAgICAgdmFyIHQyID0gLWJkMiAvIGFkMjtcclxuXHJcbiAgICAgICAgcmV0dXJuIFsgdDEgLCB0MiBdO1xyXG4gICAgfVxyXG5cclxuICAgIGJvdW5kaW5nQm94KCkge1xyXG4gICAgICAgIHZhciB4MSA9IGN1cnZlWzBdO1xyXG4gICAgICAgIHZhciB5MSA9IGN1cnZlWzFdO1xyXG4gICAgICAgIHZhciB4MiA9IGN1cnZlWzJdO1xyXG4gICAgICAgIHZhciB5MiA9IGN1cnZlWzNdO1xyXG4gICAgICAgIHZhciB4MyA9IGN1cnZlWzRdO1xyXG4gICAgICAgIHZhciB5MyA9IGN1cnZlWzVdO1xyXG4gICAgICAgIHZhciByb290cyA9IGdldFJvb3RzQ2xhbXBlZChjdXJ2ZSk7XHJcbiAgICAgICAgdmFyIG1pbl94ID0gTWF0aC5taW4oeDEsIHgyLCB4Mywgcm9vdHMueVswXSB8fCBJbmZpbml0eSwgcm9vdHMueFswXSB8fCBJbmZpbml0eSk7XHJcbiAgICAgICAgdmFyIG1pbl95ID0gTWF0aC5taW4oeTEsIHkyLCB5Mywgcm9vdHMueVsxXSB8fCBJbmZpbml0eSwgcm9vdHMueFsxXSB8fCBJbmZpbml0eSk7XHJcbiAgICAgICAgdmFyIG1heF94ID0gTWF0aC5tYXgoeDEsIHgyLCB4Mywgcm9vdHMueVswXSB8fCAtSW5maW5pdHksIHJvb3RzLnhbMF0gfHwgLUluZmluaXR5KTtcclxuICAgICAgICB2YXIgbWF4X3kgPSBNYXRoLm1heCh5MSwgeTIsIHkzLCByb290cy55WzFdIHx8IC1JbmZpbml0eSwgcm9vdHMueFsxXSB8fCAtSW5maW5pdHkpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtaW46IHtcclxuICAgICAgICAgICAgICAgIHg6IG1pbl94LFxyXG4gICAgICAgICAgICAgICAgeTogbWluX3lcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbWF4OiB7XHJcbiAgICAgICAgICAgICAgICB4OiBtYXhfeCxcclxuICAgICAgICAgICAgICAgIHk6IG1heF95XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0ZShhbmdsZSwgb2Zmc2V0KSB7XHJcbiAgICAgICAgYW5nbGUgPSAoYW5nbGUgLyAxODApICogTWF0aC5QSTtcclxuXHJcbiAgICAgICAgdmFyIG5ld19jdXJ2ZSA9IHRoaXMudG9BcnJheSgpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkgKz0gMikge1xyXG4gICAgICAgICAgICB2YXIgeCA9IGN1cnZlW2ldIC0gb2Zmc2V0Lng7XHJcbiAgICAgICAgICAgIHZhciB5ID0gY3VydmVbaSArIDFdIC0gb2Zmc2V0Lnk7XHJcbiAgICAgICAgICAgIG5ld19jdXJ2ZVtpXSA9ICgoeCAqIE1hdGguY29zKGFuZ2xlKSAtIHkgKiBNYXRoLnNpbihhbmdsZSkpKSArIG9mZnNldC54O1xyXG4gICAgICAgICAgICBuZXdfY3VydmVbaSArIDFdID0gKCh4ICogTWF0aC5zaW4oYW5nbGUpICsgeSAqIE1hdGguY29zKGFuZ2xlKSkpICsgb2Zmc2V0Lnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFFCZXppZXIobmV3X2N1cnZlKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcnNlY3RzKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6IGN1cnZlSW50ZXJzZWN0aW9ucyh0aGlzLngxLCB0aGlzLngyLCB0aGlzLngzKSxcclxuICAgICAgICAgICAgeTogY3VydmVJbnRlcnNlY3Rpb25zKHRoaXMueTEsIHRoaXMueTIsIHRoaXMueTMpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZCh4LCB5KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZih4KSA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUUJlemllcihcclxuICAgICAgICAgICAgICAgIHRoaXMueDEgKyB4LFxyXG4gICAgICAgICAgICAgICAgdGhpcy55MSArIHksXHJcbiAgICAgICAgICAgICAgICB0aGlzLngyICsgeCxcclxuICAgICAgICAgICAgICAgIHRoaXMueTIgKyB5LFxyXG4gICAgICAgICAgICAgICAgdGhpcy54MyArIHgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnkzICsgeSxcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFFCZXppZXJcclxufSIsImNvbnN0IHNxcnQgPSBNYXRoLnNxcnQ7XHJcbmNvbnN0IGNvcyA9IE1hdGguY29zO1xyXG5jb25zdCBhY29zID0gTWF0aC5hY29zO1xyXG5jb25zdCBQSSA9IE1hdGguUEk7XHJcbmNvbnN0IHNpbiA9IE1hdGguc2luO1xyXG5cclxuZXhwb3J0e1xyXG5cdHNxcnQsXHJcblx0Y29zLFxyXG5cdHNpbixcclxuXHRhY29zLFxyXG5cdGFjb3MyLFxyXG5cdFBJXHJcbn0iLCJpbXBvcnQge1BvaW50MkR9IGZyb20gXCIuL3BvaW50MkRcIlxyXG5pbXBvcnQge3NxcnQsY29zLGFjb3MsUEl9IGZyb20gXCIuL2NvbnN0c1wiXHJcblxyXG4vLyBBIGhlbHBlciBmdW5jdGlvbiB0byBmaWx0ZXIgZm9yIHZhbHVlcyBpbiB0aGUgWzAsMV0gaW50ZXJ2YWw6XHJcbmZ1bmN0aW9uIGFjY2VwdCh0KSB7XHJcbiAgcmV0dXJuIDA8PXQgJiYgdCA8PTE7XHJcbn1cclxuXHJcbi8vIEEgcmVhbC1jdWJlcm9vdHMtb25seSBmdW5jdGlvbjpcclxuZnVuY3Rpb24gY3ViZXJvb3Qodikge1xyXG4gIGlmKHY8MCkgcmV0dXJuIC1NYXRoLnBvdygtdiwxLzMpO1xyXG4gIHJldHVybiBNYXRoLnBvdyh2LDEvMyk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gcG9pbnQodCwgcDEsIHAyLCBwMywgcDQpIHtcclxuXHR2YXIgdGkgPSAxIC0gdDtcclxuXHR2YXIgdGkyID0gdGkgKiB0aTtcclxuXHR2YXIgdDIgPSB0ICogdDtcclxuXHJcblx0cmV0dXJuIHRpICogdGkyICogcDEgKyAzICogdGkyICogdCAqIHAyICsgdDIgKiAzICogdGkgKiBwMyArIHQyICogdCAqIHA0O1xyXG59XHJcblxyXG5cclxuY2xhc3MgQ0JlemllciBleHRlbmRzIEZsb2F0NjRBcnJheXtcclxuXHRjb25zdHJ1Y3Rvcih4MSwgeTEsIHgyLCB5MiwgeDMsIHkzLCB4NCwgeTQpIHtcclxuXHRcdHN1cGVyKDgpXHJcblxyXG5cdFx0Ly9NYXAgUDEgYW5kIFAyIHRvIHswLDAsMSwxfSBpZiBvbmx5IGZvdXIgYXJndW1lbnRzIGFyZSBwcm92aWRlZDsgZm9yIHVzZSB3aXRoIGFuaW1hdGlvbnNcclxuXHRcdGlmKGFyZ3VtZW50cy5sZW5ndGggPT0gNCl7XHJcblx0XHRcdHRoaXNbMF0gPSAwO1xyXG5cdFx0XHR0aGlzWzFdID0gMDtcclxuXHRcdFx0dGhpc1syXSA9IHgxO1xyXG5cdFx0XHR0aGlzWzNdID0geTE7XHJcblx0XHRcdHRoaXNbNF0gPSB4MjtcclxuXHRcdFx0dGhpc1s1XSA9IHkyO1xyXG5cdFx0XHR0aGlzWzZdID0gMTtcclxuXHRcdFx0dGhpc1s3XSA9IDE7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYgKHR5cGVvZih4MSkgPT0gXCJudW1iZXJcIikge1xyXG5cdFx0XHR0aGlzWzBdID0geDE7XHJcblx0XHRcdHRoaXNbMV0gPSB5MTtcclxuXHRcdFx0dGhpc1syXSA9IHgyO1xyXG5cdFx0XHR0aGlzWzNdID0geTI7XHJcblx0XHRcdHRoaXNbNF0gPSB4MztcclxuXHRcdFx0dGhpc1s1XSA9IHkzO1xyXG5cdFx0XHR0aGlzWzZdID0geDQ7XHJcblx0XHRcdHRoaXNbN10gPSB5NDtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh4MSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcblx0XHRcdHRoaXNbMF0gPSB4MVswXTtcclxuXHRcdFx0dGhpc1sxXSA9IHgxWzFdO1xyXG5cdFx0XHR0aGlzWzJdID0geDFbMl07XHJcblx0XHRcdHRoaXNbM10gPSB4MVszXTtcclxuXHRcdFx0dGhpc1s0XSA9IHgxWzRdO1xyXG5cdFx0XHR0aGlzWzVdID0geDFbNV07XHJcblx0XHRcdHRoaXNbNl0gPSB4MVs2XTtcclxuXHRcdFx0dGhpc1s3XSA9IHgxWzRdO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRnZXQgeDEgKCl7IHJldHVybiB0aGlzWzBdfVxyXG5cdHNldCB4MSAodil7dGhpc1swXSA9IHZ9XHJcblx0Z2V0IHgyICgpeyByZXR1cm4gdGhpc1syXX1cclxuXHRzZXQgeDIgKHYpe3RoaXNbMl0gPSB2fVxyXG5cdGdldCB4MyAoKXsgcmV0dXJuIHRoaXNbNF19XHJcblx0c2V0IHgzICh2KXt0aGlzWzRdID0gdn1cclxuXHRnZXQgeDQgKCl7IHJldHVybiB0aGlzWzZdfVxyXG5cdHNldCB4NCAodil7dGhpc1s2XSA9IHZ9XHJcblx0Z2V0IHkxICgpeyByZXR1cm4gdGhpc1sxXX1cclxuXHRzZXQgeTEgKHYpe3RoaXNbMV0gPSB2fVxyXG5cdGdldCB5MiAoKXsgcmV0dXJuIHRoaXNbM119XHJcblx0c2V0IHkyICh2KXt0aGlzWzNdID0gdn1cclxuXHRnZXQgeTMgKCl7IHJldHVybiB0aGlzWzVdfVxyXG5cdHNldCB5MyAodil7dGhpc1s1XSA9IHZ9XHJcblx0Z2V0IHk0ICgpeyByZXR1cm4gdGhpc1s3XX1cclxuXHRzZXQgeTQgKHYpe3RoaXNbN10gPSB2fVxyXG5cclxuXHRhZGQoeCx5ID0gMCl7XHJcblx0XHRyZXR1cm4gbmV3IENDdXJ2ZShcclxuXHRcdFx0dGhpc1swXSArIHgsXHJcblx0XHRcdHRoaXNbMV0gKyB5LFxyXG5cdFx0XHR0aGlzWzJdICsgeCxcclxuXHRcdFx0dGhpc1szXSArIHksXHJcblx0XHRcdHRoaXNbNF0gKyB4LFxyXG5cdFx0XHR0aGlzWzVdICsgeSxcclxuXHRcdFx0dGhpc1s2XSArIHgsXHJcblx0XHRcdHRoaXNbN10gKyB5XHJcblx0XHQpXHJcblx0fVxyXG5cclxuXHR2YWxZKHQpe1xyXG5cdFx0cmV0dXJuIHBvaW50KHQsIHRoaXNbMV0sIHRoaXNbM10sIHRoaXNbNV0sIHRoaXNbN10pO1xyXG5cdH1cclxuXHJcblx0dmFsWCh0KXtcclxuXHRcdHJldHVybiBwb2ludCh0LCB0aGlzWzBdLCB0aGlzWzJdLCB0aGlzWzRdLCB0aGlzWzZdKTtcclxuXHR9XHJcblxyXG5cdHBvaW50KHQpIHtcclxuXHRcdHJldHVybiBuZXcgUG9pbnQyRChcclxuXHRcdFx0cG9pbnQodCwgdGhpc1swXSwgdGhpc1syXSwgdGhpc1s0XSwgdGhpc1s2XSksXHJcblx0XHRcdHBvaW50KHQsIHRoaXNbMV0sIHRoaXNbM10sIHRoaXNbNV0sIHRoaXNbN10pXHJcblx0XHQpXHJcblx0fVxyXG5cdFxyXG5cdC8qKiBcclxuXHRcdEFxdWlyZWQgZnJvbSA6IGh0dHBzOi8vcG9tYXguZ2l0aHViLmlvL2JlemllcmluZm8vXHJcblx0XHRBdXRob3I6ICBNaWtlIFwiUG9tYXhcIiBLYW1lcm1hbnNcclxuXHRcdEdpdEh1YjogaHR0cHM6Ly9naXRodWIuY29tL1BvbWF4L1xyXG5cdCovXHJcblxyXG5cdHJvb3RzKHAxLHAyLHAzLHA0KSB7XHJcblx0XHR2YXIgZCA9ICgtcDEgKyAzICogcDIgLSAzICogcDMgKyBwNCksXHJcblx0XHRcdGEgPSAoMyAqIHAxIC0gNiAqIHAyICsgMyAqIHAzKSAvIGQsXHJcblx0XHRcdGIgPSAoLTMgKiBwMSArIDMgKiBwMikgLyBkLFxyXG5cdFx0XHRjID0gcDEgLyBkO1xyXG5cclxuXHRcdHZhciBwID0gKDMgKiBiIC0gYSAqIGEpIC8gMyxcclxuXHRcdFx0cDMgPSBwIC8gMyxcclxuXHRcdFx0cSA9ICgyICogYSAqIGEgKiBhIC0gOSAqIGEgKiBiICsgMjcgKiBjKSAvIDI3LFxyXG5cdFx0XHRxMiA9IHEgLyAyLFxyXG5cdFx0XHRkaXNjcmltaW5hbnQgPSBxMiAqIHEyICsgcDMgKiBwMyAqIHAzO1xyXG5cclxuXHRcdC8vIGFuZCBzb21lIHZhcmlhYmxlcyB3ZSdyZSBnb2luZyB0byB1c2UgbGF0ZXIgb246XHJcblx0XHR2YXIgdTEsIHYxLCByb290MSwgcm9vdDIsIHJvb3QzO1xyXG5cclxuXHRcdC8vIHRocmVlIHBvc3NpYmxlIHJlYWwgcm9vdHM6XHJcblx0XHRpZiAoZGlzY3JpbWluYW50IDwgMCkge1xyXG5cdFx0XHR2YXIgbXAzID0gLXAgLyAzLFxyXG5cdFx0XHRcdG1wMzMgPSBtcDMgKiBtcDMgKiBtcDMsXHJcblx0XHRcdFx0ciA9IHNxcnQobXAzMyksXHJcblx0XHRcdFx0dCA9IC1xIC8gKDIgKiByKSxcclxuXHRcdFx0XHRjb3NwaGkgPSB0IDwgLTEgPyAtMSA6IHQgPiAxID8gMSA6IHQsXHJcblx0XHRcdFx0cGhpID0gYWNvcyhjb3NwaGkpLFxyXG5cdFx0XHRcdGNydHIgPSBjdWJlcm9vdChyKSxcclxuXHRcdFx0XHR0MSA9IDIgKiBjcnRyO1xyXG5cdFx0XHRyb290MSA9IHQxICogY29zKHBoaSAvIDMpIC0gYSAvIDM7XHJcblx0XHRcdHJvb3QyID0gdDEgKiBjb3MoKHBoaSArIDIgKiBQSSkgLyAzKSAtIGEgLyAzO1xyXG5cdFx0XHRyb290MyA9IHQxICogY29zKChwaGkgKyA0ICogUEkpIC8gMykgLSBhIC8gMztcclxuXHRcdFx0cmV0dXJuIFtyb290Mywgcm9vdDEsIHJvb3QyXVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRocmVlIHJlYWwgcm9vdHMsIGJ1dCB0d28gb2YgdGhlbSBhcmUgZXF1YWw6XHJcblx0XHRpZiAoZGlzY3JpbWluYW50ID09PSAwKSB7XHJcblx0XHRcdHUxID0gcTIgPCAwID8gY3ViZXJvb3QoLXEyKSA6IC1jdWJlcm9vdChxMik7XHJcblx0XHRcdHJvb3QxID0gMiAqIHUxIC0gYSAvIDM7XHJcblx0XHRcdHJvb3QyID0gLXUxIC0gYSAvIDM7XHJcblx0XHRcdHJldHVybiBbcm9vdDIsIHJvb3QxXVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG9uZSByZWFsIHJvb3QsIHR3byBjb21wbGV4IHJvb3RzXHJcblx0XHR2YXIgc2QgPSBzcXJ0KGRpc2NyaW1pbmFudCk7XHJcblx0XHR1MSA9IGN1YmVyb290KHNkIC0gcTIpO1xyXG5cdFx0djEgPSBjdWJlcm9vdChzZCArIHEyKTtcclxuXHRcdHJvb3QxID0gdTEgLSB2MSAtIGEgLyAzO1xyXG5cdFx0cmV0dXJuIFtyb290MV1cclxuXHR9XHJcblxyXG5cdHJvb3RzWSgpIHtcclxuXHRcdHJldHVybiB0aGlzLnJvb3RzKHRoaXNbMV0sdGhpc1szXSx0aGlzWzVdLHRoaXNbN10pXHJcblx0fVxyXG5cclxuXHRyb290c1goKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5yb290cyh0aGlzWzBdLHRoaXNbMl0sdGhpc1s0XSx0aGlzWzZdKVxyXG5cdH1cclxuXHRcclxuXHRnZXRZYXRYKHgpe1xyXG5cdFx0dmFyIHgxID0gdGhpc1swXSAtIHgsIHgyID0gdGhpc1syXSAtIHgsIHgzID0gdGhpc1s0XSAtIHgsIHg0ID0gdGhpc1s2XSAtIHgsXHJcblx0XHRcdHgyXzMgPSB4MiAqIDMsIHgxXzMgPSB4MSAqMywgeDNfMyA9IHgzICogMyxcclxuXHRcdFx0ZCA9ICgteDEgKyB4Ml8zIC0geDNfMyArIHg0KSwgZGkgPSAxL2QsIGkzID0gMS8zLFxyXG5cdFx0XHRhID0gKHgxXzMgLSA2ICogeDIgKyB4M18zKSAqIGRpLFxyXG5cdFx0XHRiID0gKC14MV8zICsgeDJfMykgKiBkaSxcclxuXHRcdFx0YyA9IHgxICogZGksXHJcblx0XHRcdHAgPSAoMyAqIGIgLSBhICogYSkgKiBpMyxcclxuXHRcdFx0cDMgPSBwICogaTMsXHJcblx0XHRcdHEgPSAoMiAqIGEgKiBhICogYSAtIDkgKiBhICogYiArIDI3ICogYykgKiAoMS8yNyksXHJcblx0XHRcdHEyID0gcSAqIDAuNSxcclxuXHRcdFx0ZGlzY3JpbWluYW50ID0gcTIgKiBxMiArIHAzICogcDMgKiBwMztcclxuXHJcblx0XHQvLyBhbmQgc29tZSB2YXJpYWJsZXMgd2UncmUgZ29pbmcgdG8gdXNlIGxhdGVyIG9uOlxyXG5cdFx0dmFyIHUxLCB2MSwgcm9vdDtcclxuXHJcblx0XHQvL1RocmVlIHJlYWwgcm9vdHMgY2FuIG5ldmVyIGhhcHBlbiBpZiBwMSgwLDApIGFuZCBwNCgxLDEpO1xyXG5cclxuXHRcdC8vIHRocmVlIHJlYWwgcm9vdHMsIGJ1dCB0d28gb2YgdGhlbSBhcmUgZXF1YWw6XHJcblx0XHRpZiAoZGlzY3JpbWluYW50IDwgMCkge1xyXG5cdFx0XHR2YXIgbXAzID0gLXAgLyAzLFxyXG5cdFx0XHRcdG1wMzMgPSBtcDMgKiBtcDMgKiBtcDMsXHJcblx0XHRcdFx0ciA9IHNxcnQobXAzMyksXHJcblx0XHRcdFx0dCA9IC1xIC8gKDIgKiByKSxcclxuXHRcdFx0XHRjb3NwaGkgPSB0IDwgLTEgPyAtMSA6IHQgPiAxID8gMSA6IHQsXHJcblx0XHRcdFx0cGhpID0gYWNvcyhjb3NwaGkpLFxyXG5cdFx0XHRcdGNydHIgPSBjdWJlcm9vdChyKSxcclxuXHRcdFx0XHR0MSA9IDIgKiBjcnRyO1xyXG5cdFx0XHRyb290ID0gdDEgKiBjb3MoKHBoaSArIDQgKiBQSSkgLyAzKSAtIGEgLyAzO1xyXG5cdFx0fWVsc2UgaWYgKGRpc2NyaW1pbmFudCA9PT0gMCkge1xyXG5cdFx0XHR1MSA9IHEyIDwgMCA/IGN1YmVyb290KC1xMikgOiAtY3ViZXJvb3QocTIpO1xyXG5cdFx0XHRyb290ID0gLXUxIC0gYSAqIGkzO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHZhciBzZCA9IHNxcnQoZGlzY3JpbWluYW50KTtcclxuXHRcdFx0Ly8gb25lIHJlYWwgcm9vdCwgdHdvIGNvbXBsZXggcm9vdHNcclxuXHRcdFx0dTEgPSBjdWJlcm9vdChzZCAtIHEyKTtcclxuXHRcdFx0djEgPSBjdWJlcm9vdChzZCArIHEyKTtcclxuXHRcdFx0cm9vdCA9IHUxIC0gdjEgLSBhICogaTM7XHRcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcG9pbnQocm9vdCwgdGhpc1sxXSwgdGhpc1szXSwgdGhpc1s1XSwgdGhpc1s3XSk7XHJcblx0fVxyXG5cdC8qKlxyXG5cdFx0R2l2ZW4gYSBDYW52YXMgMkQgY29udGV4dCBvYmplY3QgYW5kIHNjYWxlIHZhbHVlLCBzdHJva2VzIGEgY3ViaWMgYmV6aWVyIGN1cnZlLlxyXG5cdCovXHJcblx0ZHJhdyhjdHgsIHMgPSAxKXtcclxuXHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdGN0eC5tb3ZlVG8odGhpc1swXSpzLCB0aGlzWzFdKnMpXHJcblx0XHRjdHguYmV6aWVyQ3VydmVUbyhcclxuXHRcdFx0dGhpc1syXSpzLCB0aGlzWzNdKnMsXHJcblx0XHRcdHRoaXNbNF0qcywgdGhpc1s1XSpzLFxyXG5cdFx0XHR0aGlzWzZdKnMsIHRoaXNbN10qc1xyXG5cdFx0XHQpXHJcblx0XHRjdHguc3Ryb2tlKClcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCB7Q0Jlemllcn0iLCIvKipcclxuXHRKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIGEgdG91Y2ggc2Nyb2xsaW5nIGludGVyZmFjZSB1c2luZyB0b3VjaCBldmVudHNcclxuKi9cclxuY2xhc3MgVG91Y2hTY3JvbGxlciB7XHJcbiAgICAvKiogXHJcbiAgICAgICAgQ29uc3RydWN0cyBhIHRvdWNoIG9iamVjdCBhcm91bmQgYSBnaXZlbiBkb20gZWxlbWVudC4gRnVuY3Rpb25zIGxpc3RlbmVycyBjYW4gYmUgYm91bmQgdG8gdGhpcyBvYmplY3QgdXNpbmdcclxuICAgICAgICB0aGlzIGFkZEV2ZW50TGlzdGVuZXIgbWV0aG9kLlxyXG4gICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGRyYWcgPSAwLjAyLCB0b3VjaGlkID0gMCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMub3JpZ2luX3ggPSAwO1xyXG4gICAgICAgIHRoaXMub3JpZ2luX3kgPSAwO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHlfeCA9IDA7XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eV95ID0gMDtcclxuICAgICAgICB0aGlzLkdPID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmRyYWcgPSAoZHJhZyA+IDApID8gZHJhZyA6IDAuMDI7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuXHJcbiAgICAgICAgaWYgKCF0b3VjaGlkIGluc3RhbmNlb2YgTnVtYmVyKVxyXG4gICAgICAgICAgICB0b3VjaGlkID0gMDtcclxuXHJcbiAgICAgICAgbGV0IHRpbWVfb2xkID0gMDtcclxuXHJcbiAgICAgICAgbGV0IGZyYW1lID0gKGR4LCBkeSwgc3RlcHMsIHJhdGlvID0gMSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IGRyYWdfdmFsID0gdGhpcy5kcmFnO1xyXG5cclxuICAgICAgICAgICAgZHggLT0gZHggKiBkcmFnX3ZhbCAqIHN0ZXBzICogcmF0aW87XHJcbiAgICAgICAgICAgIGR5IC09IGR5ICogZHJhZ192YWwgKiBzdGVwcyAqIHJhdGlvO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRtID0gTWF0aC5tYXgoTWF0aC5hYnMoZHkpLCBNYXRoLmFicyhkeSkpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGVuZCA9ICEoc3RlcHMgPiAwICYmIGRtID4gMC4xICYmIHRoaXMuR08pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFlbmQpIHtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJhbWUoZHgsIGR5LCAxKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGVuZCA9IGVuZCAmJiBzdGVwcyAhPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxpc3RlbmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnNbaV0oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkeCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFxyXG4gICAgICAgICAgICAgICAgICAgIH0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5HTyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ldmVudF9iID0gKGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHRpbWVfb2xkID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG91Y2ggPSBlLnRvdWNoZXNbdG91Y2hpZF07XHJcblxyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5X3ggPSB0aGlzLm9yaWdpbl94IC0gdG91Y2guY2xpZW50WDtcclxuICAgICAgICAgICAgdGhpcy52ZWxvY2l0eV95ID0gdGhpcy5vcmlnaW5feSAtIHRvdWNoLmNsaWVudFk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbl94ID0gdG91Y2guY2xpZW50WDtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5feSA9IHRvdWNoLmNsaWVudFk7XHJcblxyXG4gICAgICAgICAgICBmcmFtZSh0aGlzLnZlbG9jaXR5X3gsIHRoaXMudmVsb2NpdHlfeSwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmV2ZW50X2MgPSAoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IHRpbWVfbmV3ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGlmZiA9IHRpbWVfbmV3IC0gdGltZV9vbGQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3RlcHMgPSBNYXRoLm1pbihkaWZmIC8gOC42NjY2NjY2LCAxIC8gdGhpcy5kcmFnKTsgLy8gNjAgRlBTXHJcblxyXG4gICAgICAgICAgICB0aGlzLkdPID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGZyYW1lKHRoaXMudmVsb2NpdHlfeCwgdGhpcy52ZWxvY2l0eV95LCBzdGVwcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5X3ggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5X3kgPSAwO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5ldmVudF9iKTtcclxuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLmV2ZW50X2MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ldmVudF9hID0gKGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmKCF0aGlzLkdPKXtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZnVhbHQoKTtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRpbWVfb2xkID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLkdPID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG91Y2ggPSBlLnRvdWNoZXNbdG91Y2hpZF07XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRvdWNoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5feSA9IHRvdWNoLmNsaWVudFk7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luX3ggPSB0b3VjaC5jbGllbnRYO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5ldmVudF9iKTtcclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLmV2ZW50X2MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMuZXZlbnRfYSk7XHJcblxyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0aGlzLmV2ZW50X2EpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcihjYWxsYmFjaykge1xyXG4gICAgICAgIGlmIChjYWxsYmFjayBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnNbaV0gPT0gY2FsbGJhY2spIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihjYWxsYmFjaykge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubGlzdGVuZXJzW2ldID09IGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBUb3VjaFNjcm9sbGVyXHJcbn0iLCJpbXBvcnQge0xleGVyfSBmcm9tIFwiLi9jb21tb24vc3RyaW5nX3BhcnNpbmcvbGV4ZXJcIlxyXG5pbXBvcnQge1Rva2VuaXplcn0gZnJvbSBcIi4vY29tbW9uL3N0cmluZ19wYXJzaW5nL3Rva2VuaXplclwiXHJcblxyXG4vL1RpbWVcclxuaW1wb3J0IHttb250aHN9IGZyb20gXCIuL2NvbW1vbi9kYXRlX3RpbWUvbW9udGhzXCJcclxuaW1wb3J0IHtkb3d9IGZyb20gXCIuL2NvbW1vbi9kYXRlX3RpbWUvZGF5c19vZl93ZWVrXCJcclxuaW1wb3J0IHtHZXREYXlTdGFydEFuZEVuZH0gZnJvbSBcIi4vY29tbW9uL2RhdGVfdGltZS9kYXlfc3RhcnRfYW5kX2VuZF9lcG9jaFwiXHJcbmltcG9ydCB7ZmxvYXQyNHRvMTJNb2RUaW1lfSBmcm9tIFwiLi9jb21tb24vZGF0ZV90aW1lL3RpbWUuanNcIlxyXG5cclxuLy9NYXRoXHJcbmltcG9ydCB7UUJlemllcn0gZnJvbSBcIi4vY29tbW9uL21hdGgvcXVhZHJhdGljX2JlemllclwiXHJcbmltcG9ydCB7Q0Jlemllcn0gZnJvbSBcIi4vY29tbW9uL21hdGgvY3ViaWNfYmV6aWVyXCJcclxuaW1wb3J0IHtUdXJuUXVlcnlJbnRvRGF0YSwgVHVybkRhdGFJbnRvUXVlcnl9IGZyb20gXCIuL2NvbW1vbi91cmwvdXJsXCJcclxuaW1wb3J0IHtUb3VjaFNjcm9sbGVyfSBmcm9tIFwiLi9jb21tb24vZXZlbnQvdG91Y2hfc2Nyb2xsZXJcIlxyXG5cclxuXHJcbi8qKioqKioqKioqKiBTdHJpbmcgUGFyc2luZyBCYXNpYyBGdW5jdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbi8qKlxyXG5cdElmIGEgc3RyaW5nIG9iamVjdCBpcyBwYXNzZWQsIGNyZWF0ZXMgYSBsZXhlciB0aGF0IHRva2VuaXplIHRoZSBpbnB1dCBzdHJpbmcuIFxyXG4qL1xyXG5mdW5jdGlvbiBMZXgoc3RyaW5nKXtcclxuXHRpZih0eXBlb2Yoc3RyaW5nKSAhPT0gXCJzdHJpbmdcIil7XHJcblx0XHRjb25zb2xlLndhcm4oXCJDYW5ub3QgY3JlYXRlIGEgbGV4ZXIgb24gYSBub24tc3RyaW5nIG9iamVjdCFcIik7XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdHJldHVybiBuZXcgTGV4ZXIobmV3IFRva2VuaXplcihzdHJpbmcpKTtcclxufVxyXG5cclxuZXhwb3J0IHtcclxuXHRMZXgsXHJcblx0TGV4ZXIsIFxyXG5cdFRva2VuaXplcixcclxuXHRtb250aHMsXHJcblx0ZG93LFxyXG5cdFFCZXppZXIsXHJcblx0Q0JlemllcixcclxuXHRUdXJuUXVlcnlJbnRvRGF0YSxcclxuXHRUdXJuRGF0YUludG9RdWVyeSxcclxuXHRHZXREYXlTdGFydEFuZEVuZCxcclxuXHRUb3VjaFNjcm9sbGVyLFxyXG5cdGZsb2F0MjR0bzEyTW9kVGltZVxyXG59O1xyXG5cclxuLyoqKioqKiBHbG9iYWwgT2JqZWN0IEV4dGVuZGVycyAqKioqKioqKioqKioqL1xyXG4vLypcclxuRWxlbWVudC5wcm90b3R5cGUuZ2V0V2luZG93VG9wID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiAodGhpcy5vZmZzZXRUb3AgKyAoKHRoaXMucGFyZW50RWxlbWVudCkgPyB0aGlzLnBhcmVudEVsZW1lbnQuZ2V0V2luZG93VG9wKCkgOiAwKSk7XHJcbn1cclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmdldFdpbmRvd0xlZnQgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuICh0aGlzLm9mZnNldExlZnQgKyAoKHRoaXMucGFyZW50RWxlbWVudCkgPyB0aGlzLnBhcmVudEVsZW1lbnQuZ2V0V2luZG93TGVmdCgpIDogMCkpO1xyXG59XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5nZXRQYXJlbnRXaW5kb3dUb3AgPSBmdW5jdGlvbihib29sID0gZmFsc2Upe1xyXG4gICAgcmV0dXJuICgoKGJvb2wgPyB0aGlzLm9mZnNldFRvcCA6IDApKSsoKHRoaXMucGFyZW50RWxlbWVudCkgPyB0aGlzLnBhcmVudEVsZW1lbnQuZ2V0UGFyZW50V2luZG93VG9wKHRydWUpIDogMCkpO1xyXG59XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5nZXRQYXJlbnRXaW5kb3dMZWZ0ID0gZnVuY3Rpb24oYm9vbCA9IGZhbHNlKXtcclxuICAgIHJldHVybiAoKChib29sID8gdGhpcy5vZmZzZXRMZWZ0IDogMCkpKygodGhpcy5wYXJlbnRFbGVtZW50KSA/IHRoaXMucGFyZW50RWxlbWVudC5nZXRXaW5kb3dMZWZ0KHRydWUpIDogMCkpO1xyXG59XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5nZXRTdHlsZSA9IGZ1bmN0aW9uKHN0eWxlX25hbWUpe1xyXG5cdHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLG51bGwpLmdldFByb3BlcnR5VmFsdWUoc3R5bGVfbmFtZSk7XHJcbn1cclxuLy8qLyIsImltcG9ydCB7XHJcbiAgICBOVU1CRVJcclxufSBmcm9tIFwiLi9udW1iZXJfdHlwZS5qc1wiXHJcbmltcG9ydCB7XHJcbiAgICBMZXhcclxufSBmcm9tIFwiLi4vY29tbW9uXCJcclxuXHJcbmxldCBzY2FwZV9kYXRlID0gbmV3IERhdGUoKTtcclxuc2NhcGVfZGF0ZS5zZXRIb3VycygwKTtcclxuc2NhcGVfZGF0ZS5zZXRNaWxsaXNlY29uZHMoMCk7XHJcbnNjYXBlX2RhdGUuc2V0U2Vjb25kcygwKTtcclxuc2NhcGVfZGF0ZS5zZXRUaW1lKDApO1xyXG5cclxubGV0IERBVEUgPSBuZXcoY2xhc3MgRGF0ZVNjaGVtYSBleHRlbmRzIE5VTUJFUi5jb25zdHJ1Y3RvciB7XHJcbiAgICBwYXJzZSh2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWlzTmFOKHZhbHVlKSlcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHZhbHVlKTtcclxuXHJcbiAgICAgICAgbGV0IGxleCA9IExleCh2YWx1ZSk7XHJcblxyXG4gICAgICAgIGxldCB5ZWFyID0gcGFyc2VJbnQobGV4LnRva2VuLnRleHQpXHJcblxyXG4gICAgICAgIGlmICh5ZWFyKSB7XHJcblxyXG4gICAgICAgICAgICBzY2FwZV9kYXRlLnNldEhvdXJzKDApO1xyXG4gICAgICAgICAgICBzY2FwZV9kYXRlLnNldE1pbGxpc2Vjb25kcygwKTtcclxuICAgICAgICAgICAgc2NhcGVfZGF0ZS5zZXRTZWNvbmRzKDApO1xyXG4gICAgICAgICAgICBzY2FwZV9kYXRlLnNldFRpbWUoMCk7XHJcblxyXG4gICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICBsZXQgbW9udGggPSBwYXJzZUludChsZXgudG9rZW4udGV4dCkgLSAxO1xyXG4gICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICBsZXQgZGF5ID0gcGFyc2VJbnQobGV4LnRva2VuLnRleHQpXHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0RnVsbFllYXIoeWVhcik7XHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0RGF0ZShkYXkpO1xyXG4gICAgICAgICAgICBzY2FwZV9kYXRlLnNldE1vbnRoKG1vbnRoKTtcclxuXHJcbiAgICAgICAgICAgIGxleC5uZXh0KClcclxuICAgICAgICAgICAgaWYgKGxleC50b2tlbikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGhvdXJzID0gcGFyc2VJbnQobGV4LnRva2VuLnRleHQpXHJcbiAgICAgICAgICAgICAgICBsZXgubmV4dCgpXHJcbiAgICAgICAgICAgICAgICBsZXgubmV4dCgpXHJcbiAgICAgICAgICAgICAgICBsZXQgbWludXRlcyA9IHBhcnNlSW50KGxleC50b2tlbi50ZXh0KVxyXG5cclxuICAgICAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0SG91cnMoaG91cnMpO1xyXG4gICAgICAgICAgICAgICAgc2NhcGVfZGF0ZS5zZXRNaW51dGVzKG1pbnV0ZXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc2NhcGVfZGF0ZS52YWx1ZU9mKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIChuZXcgRGF0ZSh2YWx1ZSkpLnZhbHVlT2YoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgXHJcbiAgICAgKi9cclxuICAgIHZlcmlmeSh2YWx1ZSwgcmVzdWx0KSB7XHJcbiAgICAgICAgdGhpcy5wYXJzZSh2YWx1ZSk7XHJcbiAgICAgICAgc3VwZXIudmVyaWZ5KHZhbHVlLCByZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcihpZGVudGlmaWVyLCBmaWx0ZXJzKSB7XHJcblxyXG4gICAgICAgIGlmIChmaWx0ZXJzLmxlbmd0aCA+IDEpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZmlsdGVycy5sZW5ndGggLSAxOyBpIDwgbDsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3RhcnQgPSBmaWx0ZXJzW2ldO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVuZCA9IGZpbHRlcnNbaSArIDFdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzdGFydCA8PSBpZGVudGlmaWVyICYmIGlkZW50aWZpZXIgPD0gZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzdHJpbmcodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gKG5ldyBEYXRlKHZhbHVlKSkgKyBcIlwiO1xyXG4gICAgfVxyXG59KVxyXG5cclxuZXhwb3J0IHtcclxuICAgIERBVEVcclxufSIsImltcG9ydCB7XHJcbiAgICBOVU1CRVJcclxufSBmcm9tIFwiLi9udW1iZXJfdHlwZS5qc1wiXHJcblxyXG5sZXQgVElNRSA9IG5ldyhjbGFzcyBUaW1lU2NoZW1hIGV4dGVuZHMgTlVNQkVSLmNvbnN0cnVjdG9yIHtcclxuXHJcbiAgICBwYXJzZSh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghaXNOYU4odmFsdWUpKVxyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBob3VyID0gcGFyc2VJbnQodmFsdWUuc3BsaXQoXCI6XCIpWzBdKTtcclxuICAgICAgICAgICAgdmFyIG1pbiA9IHBhcnNlSW50KHZhbHVlLnNwbGl0KFwiOlwiKVsxXS5zcGxpdChcIiBcIilbMF0pO1xyXG4gICAgICAgICAgICB2YXIgaGFsZiA9ICh2YWx1ZS5zcGxpdChcIjpcIilbMV0uc3BsaXQoXCIgXCIpWzFdLnRvTG93ZXJDYXNlKCkgPT0gXCJwbVwiKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHZhciBob3VyID0gMDtcclxuICAgICAgICAgICAgdmFyIG1pbiA9IDA7XHJcbiAgICAgICAgICAgIHZhciBoYWxmID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KChob3VyICsgKChoYWxmKSA/IDEyIDogMCkgKyAobWluIC8gNjApKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmVyaWZ5KHZhbHVlLCByZXN1bHQpIHtcclxuICAgICAgICB0aGlzLnBhcnNlKHZhbHVlKTtcclxuICAgICAgICBzdXBlci52ZXJpZnkodmFsdWUsIHJlc3VsdCk7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyKGlkZW50aWZpZXIsIGZpbHRlcnMpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIHN0cmluZyh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiAobmV3IERhdGUodmFsdWUpKSArIFwiXCI7XHJcbiAgICB9XHJcbn0pKClcclxuXHJcbmV4cG9ydCB7XHJcbiAgICBUSU1FXHJcbn0iLCJpbXBvcnQge1xyXG4gICAgU2NoZW1hVHlwZVxyXG59IGZyb20gXCIuL3NjaGVtYV90eXBlLmpzXCJcclxuXHJcbmxldCBTVFJJTkcgPSBuZXcoY2xhc3MgU3RyaW5nU2NoZW1hIGV4dGVuZHMgU2NoZW1hVHlwZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdGFydF92YWx1ZSA9IFwiXCJcclxuICAgIH1cclxuICAgIHBhcnNlKHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlICsgXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICB2ZXJpZnkodmFsdWUsIHJlc3VsdCkge1xyXG4gICAgICAgIHJlc3VsdC52YWxpZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyKGlkZW50aWZpZXIsIGZpbHRlcnMpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpZGVudGlmaWVyLm1hdGNoKGZpbHRlcnNbaV0rXCJcIikpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxufSkoKVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFNUUklOR1xyXG59OyIsImltcG9ydCB7XHJcbiAgICBTY2hlbWFUeXBlXHJcbn0gZnJvbSBcIi4vc2NoZW1hX3R5cGUuanNcIlxyXG5cclxubGV0IEJPT0wgPSBuZXcoY2xhc3MgQm9vbFNjaGVtYSBleHRlbmRzIFNjaGVtYVR5cGUge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRfdmFsdWUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZSh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiAodmFsdWUpID8gdHJ1ZSA6IGZhbHNlOyBcclxuICAgIH1cclxuXHJcbiAgICB2ZXJpZnkodmFsdWUsIHJlc3VsdCkge1xyXG4gICAgICAgIHJlc3VsdC52YWxpZCA9IHRydWU7XHJcbiAgICAgICAgaWYoIXZhbHVlIGluc3RhbmNlb2YgQm9vbGVhbil7XHJcbiAgICAgICAgICAgIHJlc3VsdC52YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXN1bHQucmVhc29uID0gXCIgVmFsdWUgaXMgbm90IGEgQm9vbGVhbi5cIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXIoaWRlbnRpZmllciwgZmlsdGVycykge1xyXG4gICAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgQk9PTClcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxufSkoKVxyXG5cclxuZXhwb3J0IHtcclxuICAgIEJPT0xcclxufTsiLCJpbXBvcnQge1NjaGVtYVR5cGV9IGZyb20gXCIuL3NjaGVtYV90eXBlXCJcclxuaW1wb3J0IHtEQVRFfSBmcm9tIFwiLi9kYXRlX3R5cGVcIlxyXG5pbXBvcnQge1RJTUV9IGZyb20gXCIuL3RpbWVfdHlwZVwiXHJcbmltcG9ydCB7U1RSSU5HfSBmcm9tIFwiLi9zdHJpbmdfdHlwZVwiXHJcbmltcG9ydCB7TlVNQkVSfSBmcm9tIFwiLi9udW1iZXJfdHlwZVwiXHJcbmltcG9ydCB7Qk9PTH0gZnJvbSBcIi4vYm9vbF90eXBlXCJcclxuXHJcbmxldCBzY2hlbWEgPSB7XHJcblx0REFURSxcclxuXHRTVFJJTkcsXHJcblx0TlVNQkVSLFxyXG5cdEJPT0wsXHJcblx0VElNRVxyXG59XHJcblxyXG5leHBvcnQge1NjaGVtYVR5cGUsIHNjaGVtYX07ICIsImltcG9ydCB7XHJcbiAgICBNb2RlbEJhc2VcclxufSBmcm9tIFwiLi9tb2RlbF9iYXNlLmpzXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBNb2RlbENvbnRhaW5lcixcclxuICAgIE11bHRpSW5kZXhlZENvbnRhaW5lclxyXG59IGZyb20gXCIuL21vZGVsX2NvbnRhaW5lclwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQXJyYXlNb2RlbENvbnRhaW5lclxyXG59IGZyb20gXCIuL2FycmF5X2NvbnRhaW5lclwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQlRyZWVNb2RlbENvbnRhaW5lclxyXG59IGZyb20gXCIuL2J0cmVlX2NvbnRhaW5lclwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgU2NoZW1hVHlwZVxyXG59IGZyb20gXCIuLi9zY2hlbWEvc2NoZW1hc1wiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgU2NoZWR1bGVyXHJcbn0gZnJvbSBcIi4uL3NjaGVkdWxlclwiXHJcblxyXG5cclxuLyoqXHJcbiAgICBUaGlzIGlzIHVzZWQgYnkgTk1vZGVsIHRvIGNyZWF0ZSBjdXN0b20gcHJvcGVydHkgZ2V0dGVyIGFuZCBzZXR0ZXJzIFxyXG4gICAgb24gbm9uLU1vZGVsQ29udGFpbmVyIGFuZCBub24tTW9kZWwgcHJvcGVydGllcyBvZiB0aGUgTk1vZGVsIGNvbnN0cnVjdG9yLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gQ3JlYXRlU2NoZW1lZFByb3BlcnR5KGNvbnN0cnVjdG9yLCBzY2hlbWUsIHNjaGVtYV9uYW1lKSB7XHJcblxyXG4gICAgaWYgKGNvbnN0cnVjdG9yLnByb3RvdHlwZVtzY2hlbWFfbmFtZV0pXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgIGxldCBfX3NoYWRvd19uYW1lX18gPSBgX18ke3NjaGVtYV9uYW1lfV9fYDtcclxuXHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgX19zaGFkb3dfbmFtZV9fLCB7XHJcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICB2YWx1ZTogc2NoZW1lLnN0YXJ0X3ZhbHVlIHx8IHVuZGVmaW5lZFxyXG4gICAgfSlcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBzY2hlbWFfbmFtZSwge1xyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1tfX3NoYWRvd19uYW1lX19dO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSB7XHJcbiAgICAgICAgICAgICAgICB2YWxpZDogZmFsc2VcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCB2YWwgPSBzY2hlbWUucGFyc2UodmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgc2NoZW1lLnZlcmlmeSh2YWwsIHJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnZhbGlkICYmIHRoaXNbX19zaGFkb3dfbmFtZV9fXSAhPSB2YWwpXHJcbiAgICAgICAgICAgICAgICAodGhpc1tfX3NoYWRvd19uYW1lX19dID0gdmFsLCB0aGlzLnNjaGVkdWxlVXBkYXRlKHNjaGVtYV9uYW1lKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAgICBUaGlzIGlzIHVzZWQgYnkgTk1vZGVsIHRvIGNyZWF0ZSBjdXN0b20gcHJvcGVydHkgZ2V0dGVyIGFuZCBzZXR0ZXJzIFxyXG4gICAgb24gU2NoZW1lZCBNb2RlbENvbnRhaW5lciBwcm9wZXJ0aWVzIG9mIHRoZSBOTW9kZWwgY29uc3RydWN0b3IuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBDcmVhdGVNQ1NjaGVtZWRQcm9wZXJ0eShjb25zdHJ1Y3Rvciwgc2NoZW1lLCBzY2hlbWFfbmFtZSkge1xyXG5cclxuICAgIGxldCBzY2hlbWEgPSBzY2hlbWUuc2NoZW1hO1xyXG5cclxuICAgIGxldCBtY19jb25zdHJ1Y3RvciA9IHNjaGVtZS5jb250YWluZXI7XHJcblxyXG4gICAgbGV0IF9fc2hhZG93X25hbWVfXyA9IGBfXyR7c2NoZW1hX25hbWV9X19gO1xyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIF9fc2hhZG93X25hbWVfXywge1xyXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgIHZhbHVlOiBudWxsXHJcbiAgICB9KVxyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHNjaGVtYV9uYW1lLCB7XHJcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXNbX19zaGFkb3dfbmFtZV9fXSlcclxuICAgICAgICAgICAgICAgIHRoaXNbX19zaGFkb3dfbmFtZV9fXSA9IG5ldyBtY19jb25zdHJ1Y3RvcihzY2hlbWUuc2NoZW1hKVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbX19zaGFkb3dfbmFtZV9fXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgTUMgPSB0aGlzW19fc2hhZG93X25hbWVfX107XHJcbiAgICAgICAgICAgIGxldCBkYXRhID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YodmFsdWUpID09IFwic3RyaW5nXCIpXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgTUMgPSBuZXcgbWNfY29uc3RydWN0b3Ioc2NoZW1lLnNjaGVtYSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzW19fc2hhZG93X25hbWVfX10gPSBNQztcclxuICAgICAgICAgICAgICAgIE1DLmluc2VydChkYXRhKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZVVwZGF0ZShzY2hlbWFfbmFtZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBtY19jb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpc1tfX3NoYWRvd19uYW1lX19dID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzY2hlbWFfbmFtZSlcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVVcGRhdGUoc2NoZW1hX25hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAgICBUaGlzIGlzIHVzZWQgYnkgTk1vZGVsIHRvIGNyZWF0ZSBjdXN0b20gcHJvcGVydHkgZ2V0dGVyIGFuZCBzZXR0ZXJzIFxyXG4gICAgb24gTW9kZWwgcHJvcGVydGllcyBvZiB0aGUgTk1vZGVsIGNvbnN0cnVjdG9yLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gQ3JlYXRlTW9kZWxQcm9wZXJ0eShjb25zdHJ1Y3Rvciwgc2NoZW1lLCBzY2hlbWFfbmFtZSkge1xyXG5cclxuICAgIGxldCBzY2hlbWEgPSBzY2hlbWUuc2NoZW1hO1xyXG5cclxuICAgIGxldCBfX3NoYWRvd19uYW1lX18gPSBgX18ke3NjaGVtYV9uYW1lfV9fYDtcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBzY2hlbWFfbmFtZSwge1xyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIHNjaGVtYV9uYW1lLCB7XHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBuZXcgc2NoZW1lKClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbc2NoZW1hX25hbWVdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHt9XHJcbiAgICB9KVxyXG59XHJcblxyXG5jbGFzcyBNb2RlbCBleHRlbmRzIE1vZGVsQmFzZSB7XHJcbiAgICAvKipcclxuICAgICBcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZGF0YSkge1xyXG5cclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vVGhlIHNjaGVtYSBpcyBzdG9yZWQgZGlyZWN0bHkgb24gdGhlIGNvbnN0cnVjdG9yLiBJZiBpdCBpcyBub3QgdGhlcmUsIHRoZW4gY29uc2lkZXIgdGhpcyBtb2RlbCB0eXBlIHRvIFwiQU5ZXCJcclxuICAgICAgICBsZXQgc2NoZW1hID0gdGhpcy5jb25zdHJ1Y3Rvci5zY2hlbWE7XHJcblxyXG4gICAgICAgIGlmIChzY2hlbWEpIHtcclxuICAgICAgICAgICAgbGV0IF9fRmluYWxDb25zdHJ1Y3Rvcl9fID0gc2NoZW1hLl9fRmluYWxDb25zdHJ1Y3Rvcl9fO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIFwic2NoZW1hXCIsIHtcclxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBzY2hlbWFcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGlmICghX19GaW5hbENvbnN0cnVjdG9yX18pIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHNjaGVtYV9uYW1lIGluIHNjaGVtYSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzY2hlbWUgPSBzY2hlbWFbc2NoZW1hX25hbWVdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2NoZW1lIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNjaGVtZVswXSAmJiBzY2hlbWVbMF0uY29udGFpbmVyICYmIHNjaGVtZVswXS5zY2hlbWEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZU1DU2NoZW1lZFByb3BlcnR5KGNvbnN0cnVjdG9yLCBzY2hlbWVbMF0sIHNjaGVtYV9uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzY2hlbWVbMF0gaW5zdGFuY2VvZiBNb2RlbENvbnRhaW5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ3JlYXRlTW9kZWxQcm9wZXJ0eShjb25zdHJ1Y3Rvciwgc2NoZW1lWzBdLmNvbnN0cnVjdG9yLCBzY2hlbWFfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjaGVtZSBpbnN0YW5jZW9mIE1vZGVsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVNb2RlbFByb3BlcnR5KGNvbnN0cnVjdG9yLCBzY2hlbWVbMF0uY29uc3RydWN0b3IsIHNjaGVtYV9uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzY2hlbWUgaW5zdGFuY2VvZiBTY2hlbWFUeXBlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVTY2hlbWVkUHJvcGVydHkoY29uc3RydWN0b3IsIHNjaGVtZSwgc2NoZW1hX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBDb3VsZCBub3QgY3JlYXRlIHByb3BlcnR5ICR7c2NoZW1hX25hbWV9LmApXHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIE9iamVjdC5zZWFsKGNvbnN0cnVjdG9yKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNjaGVtYSwgXCJfX0ZpbmFsQ29uc3RydWN0b3JfX1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLy9zY2hlbWEuX19GaW5hbENvbnN0cnVjdG9yX18gPSBjb25zdHJ1Y3RvcjtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgLy9TdGFydCB0aGUgcHJvY2VzcyBvdmVyIHdpdGggYSBuZXdseSBtaW50ZWQgTW9kZWwgdGhhdCBoYXMgdGhlIHByb3BlcnRpZXMgZGVmaW5lZCBpbiB0aGUgU2NoZW1hXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGNvbnN0cnVjdG9yKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLyogVGhpcyB3aWxsIGJlIGFuIEFOWSBNb2RlbCAqL1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEFueU1vZGVsKGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRhdGEpXHJcbiAgICAgICAgICAgIHRoaXMuYWRkKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJlbW92ZXMgYWxsIGhlbGQgcmVmZXJlbmNlcyBhbmQgY2FsbHMgdW5zZXRNb2RlbCBvbiBhbGwgbGlzdGVuaW5nIHZpZXdzLlxyXG4gICAgKi9cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZW1hID0gbnVsbDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgYSBpbiB0aGlzKSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wID0gdGhpc1thXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZihwcm9wKSA9PSBcIm9iamVjdFwiICYmIHByb3AuZGVzdHJ1Y3RvciBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxyXG4gICAgICAgICAgICAgICAgcHJvcC5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXNbYV0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgIC8vZGVidWdnZXJcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBHaXZlbiBhIGtleSwgcmV0dXJucyBhbiBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSBzdGF0dXMgb2YgdGhlIHZhbHVlIGNvbnRhaW5lZCwgaWYgaXQgaXMgdmFsaWQgb3Igbm90LCBhY2NvcmRpbmcgdG8gdGhlIHNjaGVtYSBmb3IgdGhhdCBwcm9wZXJ0eS4gXHJcbiAgICAqL1xyXG4gICAgdmVyaWZ5KGtleSkge1xyXG5cclxuICAgICAgICBsZXQgb3V0X2RhdGEgPSB7XHJcbiAgICAgICAgICAgIHZhbGlkOiB0cnVlLFxyXG4gICAgICAgICAgICByZWFzb246IFwiXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgc2NoZW1lID0gdGhpcy5zY2hlbWFba2V5XTtcclxuXHJcbiAgICAgICAgaWYgKHNjaGVtZSkge1xyXG4gICAgICAgICAgICBpZiAoc2NoZW1lIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2NoZW1lIGluc3RhbmNlb2YgTW9kZWwpIHtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzY2hlbWUudmVyaWZ5KHRoaXNba2V5XSwgb3V0X2RhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0X2RhdGFcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZXR1cm5zIGEgcGFyc2VkIHZhbHVlIGJhc2VkIG9uIHRoZSBrZXkgXHJcbiAgICAqL1xyXG4gICAgc3RyaW5nKGtleSkge1xyXG4gICAgICAgIGxldCBvdXRfZGF0YSA9IHtcclxuICAgICAgICAgICAgdmFsaWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHJlYXNvbjogXCJcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChrZXkpIHtcclxuICAgICAgICAgICAgdmFyIHNjaGVtZSA9IHRoaXMuc2NoZW1hW2tleV07XHJcblxyXG4gICAgICAgICAgICBpZiAoc2NoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2NoZW1lIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0uc3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjaGVtZSBpbnN0YW5jZW9mIE1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1trZXldLnN0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2NoZW1lLnN0cmluZyh0aGlzW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEBwYXJhbSBkYXRhIDogQW4gb2JqZWN0IGNvbnRhaW5pbmcga2V5IHZhbHVlIHBhaXJzIHRvIGluc2VydCBpbnRvIHRoZSBtb2RlbC4gXHJcbiAgICAqL1xyXG4gICAgYWRkKGRhdGEpIHtcclxuICAgICAgICBmb3IgKGxldCBhIGluIGRhdGEpXHJcbiAgICAgICAgICAgIGlmIChhIGluIHRoaXMpIHRoaXNbYV0gPSBkYXRhW2FdO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQoZGF0YSkge1xyXG4gICAgICAgIHZhciBvdXRfZGF0YSA9IHt9O1xyXG5cclxuICAgICAgICBpZiAoIWRhdGEpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKVxyXG4gICAgICAgICAgICAgICAgaWYgKGEgaW4gdGhpcykgb3V0X2RhdGFbYV0gPSB0aGlzW2FdO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0X2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKCkge1xyXG4gICAgICAgIGxldCBvdXQgPSB7fTtcclxuXHJcbiAgICAgICAgbGV0IHNjaGVtYSA9IHRoaXMuc2NoZW1hO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBwcm9wIGluIHNjaGVtYSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHNjaGVtZSA9IHNjaGVtYVtwcm9wXTtcclxuXHJcbiAgICAgICAgICAgIG91dFtwcm9wXSA9IHRoaXNbcHJvcF1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gICAgVGhpcyBpcyB1c2VkIGJ5IE5Nb2RlbCB0byBjcmVhdGUgY3VzdG9tIHByb3BlcnR5IGdldHRlciBhbmQgc2V0dGVycyBcclxuICAgIG9uIG5vbi1Nb2RlbENvbnRhaW5lciBhbmQgbm9uLU1vZGVsIHByb3BlcnRpZXMgb2YgdGhlIE5Nb2RlbCBjb25zdHJ1Y3Rvci5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIENyZWF0ZUdlbmVyaWNQcm9wZXJ0eShjb25zdHJ1Y3RvciwgcHJvcF92YWwsIHByb3BfbmFtZSwgbW9kZWwpIHtcclxuXHJcbiAgICBpZiAoY29uc3RydWN0b3IucHJvdG90eXBlW3Byb3BfbmFtZV0pXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgIGxldCBfX3NoYWRvd19uYW1lX18gPSBgX18ke3Byb3BfbmFtZX1fX2A7XHJcblxyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIF9fc2hhZG93X25hbWVfXywge1xyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgdmFsOiBwcm9wX3ZhbFxyXG4gICAgfSlcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBwcm9wX25hbWUsIHtcclxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcblxyXG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzW19fc2hhZG93X25hbWVfX107XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnZhbGlkICYmIHRoaXNbX19zaGFkb3dfbmFtZV9fXSAhPSB2YWwpXHJcbiAgICAgICAgICAgICAgICAodGhpc1tfX3NoYWRvd19uYW1lX19dID0gdmFsLCBtb2RlbC5zY2hlZHVsZVVwZGF0ZShwcm9wX25hbWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBBbnlNb2RlbFByb3h5U2V0KG9iaiwgcHJvcCwgdmFsKSB7XHJcbiAgICBpZiAocHJvcCBpbiBvYmogJiYgb2JqW3Byb3BdID09IHZhbClcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAgIG9ialtwcm9wXSA9IHZhbDtcclxuXHJcbiAgICBvYmouc2NoZWR1bGVVcGRhdGUocHJvcCk7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbmNsYXNzIEFueU1vZGVsIGV4dGVuZHMgTW9kZWxCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHByb3BfbmFtZSBpbiBkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpc1twcm9wX25hbWVdID0gZGF0YVtwcm9wX25hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHRoaXMsIHtcclxuICAgICAgICAgICAgc2V0OiBBbnlNb2RlbFByb3h5U2V0XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBBbGlhcyBmb3IgZGVzdHJ1Y3RvclxyXG4gICAgKi9cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMuZGVzdHJ1Y3RvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJlbW92ZXMgYWxsIGhlbGQgcmVmZXJlbmNlcyBhbmQgY2FsbHMgdW5zZXRNb2RlbCBvbiBhbGwgbGlzdGVuaW5nIHZpZXdzLlxyXG4gICAgKi9cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZChkYXRhKSB7XHJcbiAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKVxyXG4gICAgICAgICAgICB0aGlzW2FdID0gZGF0YVthXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoZGF0YSkge1xyXG4gICAgICAgIHZhciBvdXRfZGF0YSA9IHt9O1xyXG5cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvcCA9IHRoaXNbYV07XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dF9kYXRhW2FdID0gcHJvcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dF9kYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJlbW92ZXMgaXRlbXMgaW4gY29udGFpbmVycyBiYXNlZCBvbiBtYXRjaGluZyBpbmRleC5cclxuICAgICovXHJcblxyXG4gICAgcmVtb3ZlKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4ge307XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKCkge1xyXG4gICAgICAgIGxldCBvdXQgPSB7fTtcclxuXHJcblxyXG4gICAgICAgIGZvciAobGV0IHByb3AgaW4gdGhpcykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHByb3AgPT0gXCJmaXJzdF92aWV3XCIgfHxcclxuICAgICAgICAgICAgICAgIHByb3AgPT0gXCJjaGFuZ2VkX3ZhbHVlc1wiIHx8XHJcbiAgICAgICAgICAgICAgICBwcm9wID09IFwiX19fX1NDSEVEVUxFRF9fX19cIilcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgb3V0W3Byb3BdID0gdGhpc1twcm9wXVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pzb25TdHJpbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSArIFwiXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBNb2RlbCxcclxuICAgIEFueU1vZGVsLFxyXG4gICAgTW9kZWxDb250YWluZXIsXHJcbiAgICBBcnJheU1vZGVsQ29udGFpbmVyLFxyXG4gICAgTXVsdGlJbmRleGVkQ29udGFpbmVyLFxyXG4gICAgQlRyZWVNb2RlbENvbnRhaW5lclxyXG59IiwiaW1wb3J0IHtNb2RlbH0gZnJvbSBcIi4vbW9kZWwvbW9kZWxcIlxyXG5cclxuY2xhc3MgQ29udHJvbGxlcntcclxuXHRcclxuXHRjb25zdHJ1Y3Rvcigpe1xyXG5cdFx0dGhpcy5tb2RlbCA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRkZXN0cnVjdG9yKCl7XHJcblx0XHR0aGlzLm1vZGVsID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdHNldE1vZGVsKG1vZGVsKXtcclxuXHRcdGlmKG1vZGVsIGluc3RhbmNlb2YgTW9kZWwpe1xyXG5cdFx0XHR0aGlzLm1vZGVsID0gbW9kZWw7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzZXQoZGF0YSl7XHJcblx0XHRpZih0aGlzLm1vZGVsKVxyXG5cdFx0XHR0aGlzLm1vZGVsLmFkZChkYXRhKTtcclxuXHRcdFxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0e0NvbnRyb2xsZXJ9IiwiaW1wb3J0IHtcclxuICAgIENvbnRyb2xsZXJcclxufSBmcm9tIFwiLi9jb250cm9sbGVyXCJcclxuLyoqXHJcbiAqIFRoaXMgQ2xhc3MgaXMgcmVzcG9uc2libGUgZm9yIGhhbmRsaW5nIHJlcXVlc3RzIHRvIHRoZSBzZXJ2ZXIuIEl0IGNhbiBhY3QgYXMgYSBjb250cm9sbGVyIHRvIHNwZWNpZmljYWxseSBwdWxsIGRhdGEgZG93biBmcm9tIHRoZSBzZXJ2ZXIgYW5kIHB1c2ggaW50byBkYXRhIG1lbWJlcnMuXHJcbiAqXHJcbiAqIHtuYW1lfSBHZXR0ZXJcclxuICovXHJcbmNsYXNzIEdldHRlciBleHRlbmRzIENvbnRyb2xsZXIge1xyXG4gICAgY29uc3RydWN0b3IodXJsLCBwcm9jZXNzX2RhdGEpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMuRkVUQ0hfSU5fUFJPR1JFU1MgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJ1cmwgPSBwcm9jZXNzX2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KHJlcXVlc3Rfb2JqZWN0LCBzdG9yZV9vYmplY3QsIHNlY3VyZSA9IHRydWUpIHtcclxuICAgICAgICAvL2lmKHRoaXMuRkVUQ0hfSU5fUFJPR1JFU1MpXHJcbiAgICAgICAgLy8gICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdGhpcy5GRVRDSF9JTl9QUk9HUkVTUyA9IHRydWU7XHJcblxyXG4gICAgICAgIHZhciB1cmwgPSAoKHNlY3VyZSkgPyBcImh0dHBzOi8vXCIgOiBcImh0dHA6Ly9cIikgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIHRoaXMudXJsICsgKCAocmVxdWVzdF9vYmplY3QpID8gKFwiP1wiICsgdGhpcy5fX3Byb2Nlc3NfdXJsX18ocmVxdWVzdF9vYmplY3QpKSA6IFwiXCIpO1xyXG5cclxuICAgICAgICByZXR1cm4gKChzdG9yZSkgPT4gZmV0Y2godXJsLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgLy8gU2VuZHMgY29va2llcyBiYWNrIHRvIHNlcnZlciB3aXRoIHJlcXVlc3RcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJ1xyXG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICB0aGlzLkZFVENIX0lOX1BST0dSRVNTID0gZmFsc2U7XHJcbiAgICAgICAgICAgIChyZXNwb25zZS5qc29uKCkudGhlbigoaik9PntcclxuICAgICAgICAgICAgICAgIHRoaXMuX19wcm9jZXNzX3Jlc3BvbnNlX18oaiwgc3RvcmUpO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfSkuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICB0aGlzLkZFVENIX0lOX1BST0dSRVNTID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX19yZWplY3RlZF9yZXBvbnNlX18oc3RvcmUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFVuYWJsZSB0byBwcm9jZXNzIHJlc3BvbnNlIGZvciByZXF1ZXN0IG1hZGUgdG86ICR7dGhpcy51cmx9LiBSZXNwb25zZTogJHtlcnJvcn0uIEVycm9yIFJlY2VpdmVkOiAke2Vycm9yfWApO1xyXG4gICAgICAgIH0pKSAoc3RvcmVfb2JqZWN0KVxyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlSnNvbihpbl9qc29uKXtcclxuICAgICAgICByZXR1cm4gaW5fanNvbjtcclxuICAgIH1cclxuXHJcbiAgICBfX3Byb2Nlc3NfdXJsX18oZGF0YSkge1xyXG4gICAgICAgIHZhciBzdHIgPSBcIlwiO1xyXG4gICAgICAgIGZvciAodmFyIGEgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICBzdHIgKz0gYCR7YX09JHtkYXRhW2FdfVxcJmA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3RyLnNsaWNlKDAsIC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBfX3JlamVjdGVkX3JlcG9uc2VfXyhzdG9yZSl7XHJcbiAgICAgICAgaWYoc3RvcmUpXHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbnByb2Nlc3NlZCBzdG9yZWQgZGF0YSBpbiBnZXR0ZXIuXCIpO1xyXG4gICAgfSAgIFxyXG5cclxuICAgIF9fcHJvY2Vzc19yZXNwb25zZV9fKGpzb24sIHN0b3JlKSB7XHJcblxyXG4gICAgICAgIGlmKHRoaXMucnVybCAmJiBqc29uKXtcclxuICAgICAgICAgICAgdmFyIHdhdGNoX3BvaW50cyA9IHRoaXMucnVybC5zcGxpdChcIjxcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgd2F0Y2hfcG9pbnRzLmxlbmd0aCAmJiBqc29uOyBpKyspe1xyXG4gICAgICAgICAgICAgICAganNvbiA9IGpzb25bcGFyc2VJbnQod2F0Y2hfcG9pbnRzW2ldKT9wYXJzZUludCh3YXRjaF9wb2ludHNbaV0pOndhdGNoX3BvaW50c1tpXV07XHJcbiAgICAgICAgICAgIH0gXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImpzb25cIiwganNvbilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciByZXNwb25zZSA9IHt9XHJcbiAgICAgICAgdmFyIHJlcXVlc3QgPSByZXNwb25zZS50YXJnZXQ7XHJcblxyXG4gICAgICAgIC8vcmVzdWx0KHJlcXVlc3QpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tb2RlbCl7XHJcbiAgICAgICAgICAgIC8vc2hvdWxkIGJlIGFibGUgdG8gcGlwZSByZXNwb25zZXMgYXMgb2JqZWN0cyBjcmVhdGVkIGZyb20gd2VsbCBmb3JtdWxhdGVkIGRhdGEgZGlyZWN0bHkgaW50byB0aGUgbW9kZWwuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldCh0aGlzLnBhcnNlSnNvbihqc29uLCBzdG9yZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgVW5hYmxlIHRvIHByb2Nlc3MgcmVzcG9uc2UgZm9yIHJlcXVlc3QgbWFkZSB0bzogJHt0aGlzLnVybH0uIFRoZXJlIGlzIG5vIG1vZGVsIGF0dGFjaGVkIHRvIHRoaXMgcmVxdWVzdCBjb250cm9sbGVyIWApXHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgR2V0dGVyXHJcbn1cclxuIiwiaW1wb3J0IHtcclxuICAgIFZpZXdcclxufSBmcm9tIFwiLi92aWV3XCJcclxuLyoqXHJcbiAqIFRoaXMgQ2xhc3MgaXMgcmVzcG9uc2libGUgZm9yIGhhbmRsaW5nIHJlcXVlc3RzIHRvIHRoZSBzZXJ2ZXIuIEl0IGNhbiBhY3QgYXMgYSBjb250cm9sbGVyIHRvIHNwZWNpZmljYWxseSBwdWxsIGRhdGEgZG93biBmcm9tIHRoZSBzZXJ2ZXIgYW5kIHB1c2ggaW50byBkYXRhIG1lbWJlcnMuXHJcbiAqXHJcbiAqIHtuYW1lfSBSZXF1ZXN0ZXJcclxuICovXHJcbmNsYXNzIFNldHRlciBleHRlbmRzIFZpZXcge1xyXG4gICAgY29uc3RydWN0b3IodXJsKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQocmVxdWVzdF9vYmplY3QpIHtcclxuXHJcbiAgICAgICAgdmFyIHVybCA9IFwiaHR0cDovL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyB0aGlzLnVybCArICggKHJlcXVlc3Rfb2JqZWN0KSA/IChcIj9cIiArIHRoaXMuX19wcm9jZXNzX3VybF9fKHJlcXVlc3Rfb2JqZWN0KSkgOiBcIlwiKTtcclxuXHJcbiAgICAgICAgZmV0Y2godXJsLCBcclxuICAgICAgICB7IFxyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCAvLyBTZW5kcyBjb29raWVzIGJhY2sgdG8gc2VydmVyIHdpdGggcmVxdWVzdFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJ1xyXG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAocmVzcG9uc2UuanNvbigpLnRoZW4oKGopPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fcHJvY2Vzc19yZXNwb25zZV9fKGopO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfSkuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFVuYWJsZSB0byBwcm9jZXNzIHJlc3BvbnNlIGZvciByZXF1ZXN0IG1hZGUgdG86ICR7dGhpcy51cmx9LiBSZXNwb25zZTogJHtlcnJvcn0uIEVycm9yIFJlY2VpdmVkOiAke2Vycm9yfWApO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VKc29uKGluX2pzb24pe1xyXG4gICAgICAgIHJldHVybiBpbl9qc29uO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcHJvY2Vzc191cmxfXyhkYXRhKSB7XHJcbiAgICAgICAgdmFyIHN0ciA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgIHN0ciArPSBgJHthfT0ke2RhdGFbYV19XFwmYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdHIuc2xpY2UoMCwgLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcHJvY2Vzc19yZXNwb25zZV9fKGpzb24pIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgcmVzcG9uc2UgPSB7fVxyXG4gICAgICAgIHZhciByZXF1ZXN0ID0gcmVzcG9uc2UudGFyZ2V0O1xyXG5cclxuICAgICAgICAvL3Jlc3VsdChyZXF1ZXN0KTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubW9kZWwpe1xyXG5cclxuICAgICAgICAgICAgLy9zaG91bGQgYmUgYWJsZSB0byBwaXBlIHJlc3BvbnNlcyBhcyBvYmplY3RzIGNyZWF0ZWQgZnJvbSB3ZWxsIGZvcm11bGF0ZWQgZGF0YSBkaXJlY3RseSBpbnRvIHRoZSBtb2RlbC5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHRoaXMucGFyc2VKc29uKGpzb24pKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMubW9kZWwpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmFibGUgdG8gcHJvY2VzcyByZXNwb25zZSBmb3IgcmVxdWVzdCBtYWRlIHRvOiAke3RoaXMudXJsfS4gVGhlcmUgaXMgbm8gbW9kZWwgYXR0YWNoZWQgdG8gdGhpcyByZXF1ZXN0IGNvbnRyb2xsZXIhYClcclxuICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFNldHRlclxyXG59IiwiLypcclxuXHRIYW5kbGVzIHRoZSBwYXJzaW5nIGFuZCBsb2FkaW5nIG9mIGNvbXBvbmVudHMgZm9yIGEgcGFydGljdWxhciBwYWdlLlxyXG4qL1xyXG5jbGFzcyBQYWdlVmlldyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoVVJMLCBhcHBfcGFnZSkge1xyXG4gICAgICAgIHRoaXMudXJsID0gVVJMO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcclxuICAgICAgICB0aGlzLmZpbmFsaXppbmdfdmlldyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy50eXBlID0gXCJub3JtYWxcIjtcclxuICAgICAgICBpZiAoIWFwcF9wYWdlKSBkZWJ1Z2dlclxyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGFwcF9wYWdlO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudF9iYWNrZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuTE9BREVEID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBlbGVtZW50LmRlc3RydWN0b3IoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdW5sb2FkKHRyYW5zaXRpb25zKSB7XHJcblxyXG4gICAgICAgIHRoaXMuTE9BREVEID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgZWxlbWVudC5nZXRUcmFuc2Zvcm1Ubyh0cmFuc2l0aW9ucyk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQudW5sb2FkQ29tcG9uZW50cygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uT3V0KHRyYW5zaXRpb25zKSB7XHJcblxyXG4gICAgICAgIGxldCB0aW1lID0gMDtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRpbWUgPSBNYXRoLm1heCh0aW1lLCB0aGlzLmVsZW1lbnRzW2ldLnRyYW5zaXRpb25PdXQodHJhbnNpdGlvbnMpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmFsaXplKCkge1xyXG4gICAgICAgIGlmKHRoaXMuTE9BREVEKSByZXR1cm47XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlbWVudHNbaV07XHJcbiAgICAgICAgICAgIGVsZW1lbnQuZmluYWxpemUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudClcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkKGFwcF9lbGVtZW50LCB3dXJsKSB7XHJcblxyXG4gICAgICAgIHRoaXMuTE9BREVEID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBlbGVtZW50LmxvYWRDb21wb25lbnRzKHd1cmwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcclxuXHJcbiAgICAgICAgdmFyIHQgPSB0aGlzLmVsZW1lbnQuc3R5bGUub3BhY2l0eTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uSW4odHJhbnNpdGlvbnMpIHtcclxuICAgICAgICBsZXQgZmluYWxfdGltZSA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gXCJtb2RhbFwiKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5lbGVtZW50X2JhY2tlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50X2JhY2tlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRfYmFja2VyLmNsYXNzTGlzdC5hZGQoXCJtb2RhbF9iYWNrZXJcIilcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnRfYmFja2VyKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAxO1xyXG4gICAgICAgICAgICB9LCA1MClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlbWVudHNbaV07XHJcbiAgICAgICAgICAgIGVsZW1lbnQucGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgZWxlbWVudC5zZXRUcmFuc2Zvcm1Ubyh0cmFuc2l0aW9ucyk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQudHJhbnNpdGlvbkluKCk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZWRFbGVtZW50cyhuYW1lZF9lbGVtZW50cykge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlbWVudHNbaV07XHJcbiAgICAgICAgICAgIGVsZW1lbnQuZ2V0TmFtZWRFbGVtZW50cyhuYW1lZF9lbGVtZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbXBhcmVDb21wb25lbnRzKCkge1xyXG4gICAgICAgIC8vVGhpcyB3aWxsIHRyYW5zaXRpb24gb2JqZWN0c1xyXG4gICAgfVxyXG5cclxuICAgIHNldFR5cGUodHlwZSkge1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGUgfHwgXCJub3JtYWxcIjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFBhZ2VWaWV3XHJcbn0iLCIvKipcclxuICpcdENvbnZlcnRzIGxpbmtzIGludG8gSmF2YWNyaXB0IGVuYWJsZWQgYnV0dG9ucyB0aGF0IHdpbGwgYmUgaGFuZGxlZCB3aXRoaW4gdGhlIGN1cnJlbnQgQWN0aXZlIHBhZ2UuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBQYXJlbnQgRWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoZSA8YT4gZWxlbWVudHMgdG8gYmUgZXZhdWxhdGVkIGJ5IGZ1bmN0aW9uLlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBfX2Z1bmN0aW9uX18gLSBBIGZ1bmN0aW9uIHRoZSBsaW5rIHdpbGwgY2FsbCB3aGVuIGl0IGlzIGNsaWNrZWQgYnkgdXNlci4gSWYgaXQgcmV0dXJucyBmYWxzZSwgdGhlIGxpbmsgd2lsbCBhY3QgbGlrZSBhIG5vcm1hbCA8YT4gZWxlbWVudCBhbmQgY2F1c2UgdGhlIGJyb3dzZXIgdG8gbmF2aWdhdGUgdG8gdGhlIFwiaHJlZlwiIHZhbHVlLlxyXG4gKlxyXG4gKiBJZiB0aGUgPGE+IGVsZW1lbnQgaGFzIGEgZGF0YS1pZ25vcmVfbGluayBhdHRyaWJ1dGUgc2V0IHRvIGEgdHJ1dGh5IHZhbHVlLCB0aGVuIHRoaXMgZnVuY3Rpb24gd2lsbCBub3QgY2hhbmdlIHRoZSB3YXkgdGhhdCBsaW5rIG9wZXJhdGVzLlxyXG4gKiBMaWtld2lzZSwgaWYgdGhlIDxhPiBlbGVtZW50IGhhcyBhIGhyZWYgdGhhdCBwb2ludHMgYW5vdGhlciBkb21haW4sIHRoZW4gdGhlIGxpbmsgd2lsbCByZW1haW4gdW5hZmZlY3RlZC5cclxuICovXHJcbmZ1bmN0aW9uIHNldExpbmtzKGVsZW1lbnQsIF9fZnVuY3Rpb25fXykge1xyXG4gICAgbGV0IGxpbmtzID0gZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFcIik7XHJcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IGxpbmtzLmxlbmd0aCwgdGVtcCwgaHJlZjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGxldCB0ZW1wID0gbGlua3NbaV07XHJcblxyXG4gICAgICAgIGlmICh0ZW1wLmRhdGFzZXQuaWdub3JlX2xpbmspIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBpZiAodGVtcC5vcmlnaW4gIT09IGxvY2F0aW9uLm9yaWdpbikgY29udGludWU7XHJcblxyXG4gICAgICAgIGlmICghdGVtcC5vbmNsaWNrKSB0ZW1wLm9uY2xpY2sgPSAoKGhyZWYsIGEsIF9fZnVuY3Rpb25fXykgPT4gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBpZiAoX19mdW5jdGlvbl9fKGhyZWYsIGEpKSBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSkodGVtcC5ocmVmLCB0ZW1wLCBfX2Z1bmN0aW9uX18pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IHtzZXRMaW5rc31cclxuIiwiaW1wb3J0IHtMZXh9IGZyb20gXCIuLi9jb21tb25cIlxyXG5cclxuY2xhc3MgQ29sb3IgZXh0ZW5kcyBGbG9hdDY0QXJyYXl7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHIsZyxiLGEgPSAwKXtcclxuXHRcdHN1cGVyKDQpXHJcblxyXG5cdFx0dGhpcy5yID0gMDtcclxuXHRcdHRoaXMuZyA9IDA7XHJcblx0XHR0aGlzLmIgPSAwO1xyXG5cdFx0dGhpcy5hID0gMTtcclxuXHJcblx0XHRpZih0eXBlb2YocikgPT0gXCJzdHJpbmdcIil7XHJcblx0XHRcdHRoaXMuZnJvbVN0cmluZyhyKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHR0aGlzLnIgPSByIC8vTWF0aC5tYXgoTWF0aC5taW4oTWF0aC5yb3VuZChyKSwyNTUpLC0yNTUpO1xyXG5cdFx0XHR0aGlzLmcgPSBnIC8vTWF0aC5tYXgoTWF0aC5taW4oTWF0aC5yb3VuZChnKSwyNTUpLC0yNTUpO1xyXG5cdFx0XHR0aGlzLmIgPSBiIC8vTWF0aC5tYXgoTWF0aC5taW4oTWF0aC5yb3VuZChiKSwyNTUpLC0yNTUpO1xyXG5cdFx0XHR0aGlzLmEgPSBhIC8vTWF0aC5tYXgoTWF0aC5taW4oYSwxKSwtMSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRnZXQgcigpe1xyXG5cdFx0cmV0dXJuIHRoaXNbMF07XHJcblx0fVxyXG5cclxuXHRzZXQgcihyKXtcclxuXHRcdHRoaXNbMF0gPSByO1xyXG5cdH1cclxuXHJcblx0Z2V0IGcoKXtcclxuXHRcdHJldHVybiB0aGlzWzFdO1xyXG5cdH1cclxuXHJcblx0c2V0IGcoZyl7XHJcblx0XHR0aGlzWzFdID0gZztcclxuXHR9XHJcblxyXG5cdGdldCBiKCl7XHJcblx0XHRyZXR1cm4gdGhpc1syXTtcclxuXHR9XHJcblxyXG5cdHNldCBiKGIpe1xyXG5cdFx0dGhpc1syXSA9IGI7XHJcblx0fVxyXG5cclxuXHRnZXQgYSgpe1xyXG5cdFx0cmV0dXJuIHRoaXNbM107XHJcblx0fVxyXG5cclxuXHRzZXQgYShhKXtcclxuXHRcdHRoaXNbM10gPSBhO1xyXG5cdH1cclxuXHJcblx0c2V0KGNvbG9yKXtcclxuXHRcdHRoaXMuciA9IGNvbG9yLnI7XHJcblx0XHR0aGlzLmcgPSBjb2xvci5nO1xyXG5cdFx0dGhpcy5iID0gY29sb3IuYjtcclxuXHRcdHRoaXMuYSA9IChjb2xvci5hICE9IHVuZGVmaW5lZCkgPyBjb2xvci5hIDogdGhpcy5hO1xyXG5cdH1cclxuXHJcblx0YWRkKGNvbG9yKXtcclxuXHRcdHJldHVybiBuZXcgQ29sb3IoXHJcblx0XHRcdGNvbG9yLnIgKyB0aGlzLnIsXHJcblx0XHRcdGNvbG9yLmcgKyB0aGlzLmcsXHJcblx0XHRcdGNvbG9yLmIgKyB0aGlzLmIsXHJcblx0XHRcdGNvbG9yLmEgKyB0aGlzLmFcclxuXHRcdClcclxuXHR9XHJcblxyXG5cdG11bHQoY29sb3Ipe1xyXG5cdFx0aWYodHlwZW9mKGNvbG9yKSA9PSBcIm51bWJlclwiKXtcclxuXHRcdFx0cmV0dXJuIG5ldyBDb2xvcihcclxuXHRcdFx0XHR0aGlzLnIgKiBjb2xvcixcclxuXHRcdFx0XHR0aGlzLmcgKiBjb2xvcixcclxuXHRcdFx0XHR0aGlzLmIgKiBjb2xvcixcclxuXHRcdFx0XHR0aGlzLmEgKiBjb2xvclxyXG5cdFx0XHQpXHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIG5ldyBDb2xvcihcclxuXHRcdFx0XHR0aGlzLnIgKiBjb2xvci5yLFxyXG5cdFx0XHRcdHRoaXMuZyAqIGNvbG9yLmcsXHJcblx0XHRcdFx0dGhpcy5iICogY29sb3IuYixcclxuXHRcdFx0XHR0aGlzLmEgKiBjb2xvci5hXHJcblx0XHRcdClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN1Yihjb2xvcil7XHJcblx0XHRyZXR1cm4gbmV3IENvbG9yKFxyXG5cdFx0XHQgdGhpcy5yIC0gY29sb3IucixcclxuXHRcdFx0IHRoaXMuZyAtIGNvbG9yLmcsXHJcblx0XHRcdCB0aGlzLmIgLSBjb2xvci5iLFxyXG5cdFx0XHQgdGhpcy5hIC0gY29sb3IuYVxyXG5cdFx0KVxyXG5cdH1cclxuXHJcblx0dG9TdHJpbmcoKXtcclxuXHRcdHJldHVybiBgcmdiYSgke3RoaXMucnwwfSwgJHt0aGlzLmd8MH0sICR7dGhpcy5ifDB9LCAke3RoaXMuYX0pYDtcclxuXHR9XHJcblxyXG5cdGZyb21TdHJpbmcoc3RyaW5nKXtcclxuXHRcdFxyXG5cdFx0bGV0IGxleGVyID0gTGV4KHN0cmluZylcclxuXHJcblx0XHRsZXQgcixnLGIsYTtcclxuXHRcdHN3aXRjaChsZXhlci50b2tlbi50ZXh0KXtcclxuXHJcblxyXG5cdFx0XHRjYXNlIFwicmdiXCI6XHJcblx0XHRcdFx0bGV4ZXIubmV4dCgpIC8vIChcclxuXHRcdFx0XHRyID0gcGFyc2VJbnQobGV4ZXIubmV4dCgpLnRleHQpXHJcblx0XHRcdFx0bGV4ZXIubmV4dCgpIC8vICxcclxuXHRcdFx0XHRnID0gcGFyc2VJbnQobGV4ZXIubmV4dCgpLnRleHQpXHJcblx0XHRcdFx0bGV4ZXIubmV4dCgpIC8vICxcclxuXHRcdFx0XHRiID0gcGFyc2VJbnQobGV4ZXIubmV4dCgpLnRleHQpXHJcblx0XHRcdFx0dGhpcy5zZXQoe3IsZyxifSk7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSBcInJnYmFcIjpcclxuXHRcdFx0XHRsZXhlci5uZXh0KCkgLy8gKFxyXG5cdFx0XHRcdHIgPSBwYXJzZUludChsZXhlci5uZXh0KCkudGV4dClcclxuXHRcdFx0XHRsZXhlci5uZXh0KCkgLy8gLFxyXG5cdFx0XHRcdGcgPSBwYXJzZUludChsZXhlci5uZXh0KCkudGV4dClcclxuXHRcdFx0XHRsZXhlci5uZXh0KCkgLy8gLFxyXG5cdFx0XHRcdGIgPSBwYXJzZUludChsZXhlci5uZXh0KCkudGV4dClcclxuXHRcdFx0XHRsZXhlci5uZXh0KCkgLy8gLFxyXG5cdFx0XHRcdGEgPSBwYXJzZUZsb2F0KGxleGVyLm5leHQoKS50ZXh0KVxyXG5cdFx0XHRcdHRoaXMuc2V0KHtyLGcsYixhfSk7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSBcIiNcIjpcclxuXHRcdFx0XHR2YXIgdmFsdWUgPSBsZXhlci5uZXh0KCkudGV4dDtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRkZWZhdWx0OlxyXG5cclxuXHRcdFx0XHRpZihDb2xvci5jb2xvcnNbc3RyaW5nXSlcclxuXHRcdFx0XHRcdHRoaXMuc2V0KENvbG9yLmNvbG9yc1tzdHJpbmddICB8fCBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSwgMC4wMDAxKSk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuQ29sb3IuY29sb3JzID0ge1xyXG5cdFwidHJhbnNwYXJlbnRcIiA6IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1LCAwLjAwMDEpLFxyXG5cdFwiY2xlYXJcIiA6IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1LCAwLjAwMDEpLFxyXG5cdFwicmVkXCIgOiBuZXcgQ29sb3IoMjU1LCAwLCAwKSxcclxuXHRcImdyZWVuXCIgOiBuZXcgQ29sb3IoMCwgMjU1LCAwKSxcclxuXHRcImJsdWVcIiA6IG5ldyBDb2xvcigwLCAwLCAyNTUpLFxyXG5cdFwiQmxhY2tcIjogbmV3IENvbG9yKDAsMCwwKSxcclxuIFx0XCJXaGl0ZVwiOiBuZXcgQ29sb3IoMjU1LDI1NSwyNTUpLFxyXG4gXHRcIndoaXRlXCI6IG5ldyBDb2xvcigyNTUsMjU1LDI1NSksXHJcbiBcdFwiUmVkXCI6IG5ldyBDb2xvcigyNTUsMCwwKSxcclxuIFx0XCJMaW1lXCI6IG5ldyBDb2xvcigwLDI1NSwwKSxcclxuIFx0XCJCbHVlXCI6IG5ldyBDb2xvcigwLDAsMjU1KSxcclxuIFx0XCJZZWxsb3dcIjogbmV3IENvbG9yKDI1NSwyNTUsMCksXHJcbiBcdFwiQ3lhblwiOiBuZXcgQ29sb3IoMCwyNTUsMjU1KSxcclxuIFx0XCJBcXVhXCI6IG5ldyBDb2xvcigwLDI1NSwyNTUpLFxyXG4gXHRcIk1hZ2VudGFcIjogbmV3IENvbG9yKDI1NSwwLDI1NSkgLFxyXG4gXHRcIkZ1Y2hzaWFcIjogbmV3IENvbG9yKDI1NSwwLDI1NSksXHJcbiBcdFwiU2lsdmVyXCI6IG5ldyBDb2xvcigxOTIsMTkyLDE5MiksXHJcbiBcdFwiR3JheVwiOiBuZXcgQ29sb3IoMTI4LDEyOCwxMjgpLFxyXG4gXHRcIk1hcm9vblwiOiBuZXcgQ29sb3IoMTI4LDAsMCksXHJcbiBcdFwiT2xpdmVcIjogbmV3IENvbG9yKDEyOCwxMjgsMCksXHJcbiBcdFwiR3JlZW5cIjogbmV3IENvbG9yKDAsMTI4LDApLFxyXG4gXHRcIlB1cnBsZVwiOiBuZXcgQ29sb3IoMTI4LDAsMTI4KSxcclxuIFx0XCJUZWFsXCI6IG5ldyBDb2xvcigwLDEyOCwxMjgpLFxyXG4gXHRcIk5hdnlcIjogbmV3IENvbG9yKDAsMCwxMjgpLFxyXG4gXHRcIm1hcm9vblwiOiBuZXcgQ29sb3IoMTI4LDAsMCksXHJcbiBcdFwiZGFyayByZWRcIjogbmV3IENvbG9yKDEzOSwwLDApLFxyXG4gXHRcImJyb3duXCI6IG5ldyBDb2xvcigxNjUsNDIsNDIpLFxyXG4gXHRcImZpcmVicmlja1wiOiBuZXcgQ29sb3IoMTc4LDM0LDM0KSxcclxuIFx0XCJjcmltc29uXCI6IG5ldyBDb2xvcigyMjAsMjAsNjApLFxyXG4gXHRcInJlZFwiOiBuZXcgQ29sb3IoMjU1LDAsMCksXHJcbiBcdFwidG9tYXRvXCI6IG5ldyBDb2xvcigyNTUsOTksNzEpLFxyXG4gXHRcImNvcmFsXCI6IG5ldyBDb2xvcigyNTUsMTI3LDgwKSxcclxuIFx0XCJpbmRpYW4gcmVkXCI6IG5ldyBDb2xvcigyMDUsOTIsOTIpLFxyXG4gXHRcImxpZ2h0IGNvcmFsXCI6IG5ldyBDb2xvcigyNDAsMTI4LDEyOCksXHJcbiBcdFwiZGFyayBzYWxtb25cIjogbmV3IENvbG9yKDIzMywxNTAsMTIyKSxcclxuIFx0XCJzYWxtb25cIjogbmV3IENvbG9yKDI1MCwxMjgsMTE0KSxcclxuIFx0XCJsaWdodCBzYWxtb25cIjogbmV3IENvbG9yKDI1NSwxNjAsMTIyKSxcclxuIFx0XCJvcmFuZ2UgcmVkXCI6IG5ldyBDb2xvcigyNTUsNjksMCksXHJcbiBcdFwiZGFyayBvcmFuZ2VcIjogbmV3IENvbG9yKDI1NSwxNDAsMCksXHJcbiBcdFwib3JhbmdlXCI6IG5ldyBDb2xvcigyNTUsMTY1LDApLFxyXG4gXHRcImdvbGRcIjogbmV3IENvbG9yKDI1NSwyMTUsMCksXHJcbiBcdFwiZGFyayBnb2xkZW4gcm9kXCI6IG5ldyBDb2xvcigxODQsMTM0LDExKSxcclxuIFx0XCJnb2xkZW4gcm9kXCI6IG5ldyBDb2xvcigyMTgsMTY1LDMyKSxcclxuIFx0XCJwYWxlIGdvbGRlbiByb2RcIjogbmV3IENvbG9yKDIzOCwyMzIsMTcwKSxcclxuIFx0XCJkYXJrIGtoYWtpXCI6IG5ldyBDb2xvcigxODksMTgzLDEwNyksXHJcbiBcdFwia2hha2lcIjogbmV3IENvbG9yKDI0MCwyMzAsMTQwKSxcclxuIFx0XCJvbGl2ZVwiOiBuZXcgQ29sb3IoMTI4LDEyOCwwKSxcclxuIFx0XCJ5ZWxsb3dcIjogbmV3IENvbG9yKDI1NSwyNTUsMCksXHJcbiBcdFwieWVsbG93IGdyZWVuXCI6IG5ldyBDb2xvcigxNTQsMjA1LDUwKSxcclxuIFx0XCJkYXJrIG9saXZlIGdyZWVuXCI6IG5ldyBDb2xvcig4NSwxMDcsNDcpLFxyXG4gXHRcIm9saXZlIGRyYWJcIjogbmV3IENvbG9yKDEwNywxNDIsMzUpLFxyXG4gXHRcImxhd24gZ3JlZW5cIjogbmV3IENvbG9yKDEyNCwyNTIsMCksXHJcbiBcdFwiY2hhcnQgcmV1c2VcIjogbmV3IENvbG9yKDEyNywyNTUsMCksXHJcbiBcdFwiZ3JlZW4geWVsbG93XCI6IG5ldyBDb2xvcigxNzMsMjU1LDQ3KSxcclxuIFx0XCJkYXJrIGdyZWVuXCI6IG5ldyBDb2xvcigwLDEwMCwwKSxcclxuIFx0XCJncmVlblwiOiBuZXcgQ29sb3IoMCwxMjgsMCksXHJcbiBcdFwiZm9yZXN0IGdyZWVuXCI6IG5ldyBDb2xvcigzNCwxMzksMzQpLFxyXG4gXHRcImxpbWVcIjogbmV3IENvbG9yKDAsMjU1LDApLFxyXG4gXHRcImxpbWUgZ3JlZW5cIjogbmV3IENvbG9yKDUwLDIwNSw1MCksXHJcbiBcdFwibGlnaHQgZ3JlZW5cIjogbmV3IENvbG9yKDE0NCwyMzgsMTQ0KSxcclxuIFx0XCJwYWxlIGdyZWVuXCI6IG5ldyBDb2xvcigxNTIsMjUxLDE1MiksXHJcbiBcdFwiZGFyayBzZWEgZ3JlZW5cIjogbmV3IENvbG9yKDE0MywxODgsMTQzKSxcclxuIFx0XCJtZWRpdW0gc3ByaW5nIGdyZWVuXCI6IG5ldyBDb2xvcigwLDI1MCwxNTQpLFxyXG4gXHRcInNwcmluZyBncmVlblwiOiBuZXcgQ29sb3IoMCwyNTUsMTI3KSxcclxuIFx0XCJzZWEgZ3JlZW5cIjogbmV3IENvbG9yKDQ2LDEzOSw4NyksXHJcbiBcdFwibWVkaXVtIGFxdWEgbWFyaW5lXCI6IG5ldyBDb2xvcigxMDIsMjA1LDE3MCksXHJcbiBcdFwibWVkaXVtIHNlYSBncmVlblwiOiBuZXcgQ29sb3IoNjAsMTc5LDExMyksXHJcbiBcdFwibGlnaHQgc2VhIGdyZWVuXCI6IG5ldyBDb2xvcigzMiwxNzgsMTcwKSxcclxuIFx0XCJkYXJrIHNsYXRlIGdyYXlcIjogbmV3IENvbG9yKDQ3LDc5LDc5KSxcclxuIFx0XCJ0ZWFsXCI6IG5ldyBDb2xvcigwLDEyOCwxMjgpLFxyXG4gXHRcImRhcmsgY3lhblwiOiBuZXcgQ29sb3IoMCwxMzksMTM5KSxcclxuIFx0XCJhcXVhXCI6IG5ldyBDb2xvcigwLDI1NSwyNTUpLFxyXG4gXHRcImN5YW5cIjogbmV3IENvbG9yKDAsMjU1LDI1NSksXHJcbiBcdFwibGlnaHQgY3lhblwiOiBuZXcgQ29sb3IoMjI0LDI1NSwyNTUpLFxyXG4gXHRcImRhcmsgdHVycXVvaXNlXCI6IG5ldyBDb2xvcigwLDIwNiwyMDkpLFxyXG4gXHRcInR1cnF1b2lzZVwiOiBuZXcgQ29sb3IoNjQsMjI0LDIwOCksXHJcbiBcdFwibWVkaXVtIHR1cnF1b2lzZVwiOiBuZXcgQ29sb3IoNzIsMjA5LDIwNCksXHJcbiBcdFwicGFsZSB0dXJxdW9pc2VcIjogbmV3IENvbG9yKDE3NSwyMzgsMjM4KSxcclxuIFx0XCJhcXVhIG1hcmluZVwiOiBuZXcgQ29sb3IoMTI3LDI1NSwyMTIpLFxyXG4gXHRcInBvd2RlciBibHVlXCI6IG5ldyBDb2xvcigxNzYsMjI0LDIzMCksXHJcbiBcdFwiY2FkZXQgYmx1ZVwiOiBuZXcgQ29sb3IoOTUsMTU4LDE2MCksXHJcbiBcdFwic3RlZWwgYmx1ZVwiOiBuZXcgQ29sb3IoNzAsMTMwLDE4MCksXHJcbiBcdFwiY29ybiBmbG93ZXIgYmx1ZVwiOiBuZXcgQ29sb3IoMTAwLDE0OSwyMzcpLFxyXG4gXHRcImRlZXAgc2t5IGJsdWVcIjogbmV3IENvbG9yKDAsMTkxLDI1NSksXHJcbiBcdFwiZG9kZ2VyIGJsdWVcIjogbmV3IENvbG9yKDMwLDE0NCwyNTUpLFxyXG4gXHRcImxpZ2h0IGJsdWVcIjogbmV3IENvbG9yKDE3MywyMTYsMjMwKSxcclxuIFx0XCJza3kgYmx1ZVwiOiBuZXcgQ29sb3IoMTM1LDIwNiwyMzUpLFxyXG4gXHRcImxpZ2h0IHNreSBibHVlXCI6IG5ldyBDb2xvcigxMzUsMjA2LDI1MCksXHJcbiBcdFwibWlkbmlnaHQgYmx1ZVwiOiBuZXcgQ29sb3IoMjUsMjUsMTEyKSxcclxuIFx0XCJuYXZ5XCI6IG5ldyBDb2xvcigwLDAsMTI4KSxcclxuIFx0XCJkYXJrIGJsdWVcIjogbmV3IENvbG9yKDAsMCwxMzkpLFxyXG4gXHRcIm1lZGl1bSBibHVlXCI6IG5ldyBDb2xvcigwLDAsMjA1KSxcclxuIFx0XCJibHVlXCI6IG5ldyBDb2xvcigwLDAsMjU1KSxcclxuIFx0XCJyb3lhbCBibHVlXCI6IG5ldyBDb2xvcig2NSwxMDUsMjI1KSxcclxuIFx0XCJibHVlIHZpb2xldFwiOiBuZXcgQ29sb3IoMTM4LDQzLDIyNiksXHJcbiBcdFwiaW5kaWdvXCI6IG5ldyBDb2xvcig3NSwwLDEzMCksXHJcbiBcdFwiZGFyayBzbGF0ZSBibHVlXCI6IG5ldyBDb2xvcig3Miw2MSwxMzkpLFxyXG4gXHRcInNsYXRlIGJsdWVcIjogbmV3IENvbG9yKDEwNiw5MCwyMDUpLFxyXG4gXHRcIm1lZGl1bSBzbGF0ZSBibHVlXCI6IG5ldyBDb2xvcigxMjMsMTA0LDIzOCksXHJcbiBcdFwibWVkaXVtIHB1cnBsZVwiOiBuZXcgQ29sb3IoMTQ3LDExMiwyMTkpLFxyXG4gXHRcImRhcmsgbWFnZW50YVwiOiBuZXcgQ29sb3IoMTM5LDAsMTM5KSxcclxuIFx0XCJkYXJrIHZpb2xldFwiOiBuZXcgQ29sb3IoMTQ4LDAsMjExKSxcclxuIFx0XCJkYXJrIG9yY2hpZFwiOiBuZXcgQ29sb3IoMTUzLDUwLDIwNCksXHJcbiBcdFwibWVkaXVtIG9yY2hpZFwiOiBuZXcgQ29sb3IoMTg2LDg1LDIxMSksXHJcbiBcdFwicHVycGxlXCI6IG5ldyBDb2xvcigxMjgsMCwxMjgpLFxyXG4gXHRcInRoaXN0bGVcIjogbmV3IENvbG9yKDIxNiwxOTEsMjE2KSxcclxuIFx0XCJwbHVtXCI6IG5ldyBDb2xvcigyMjEsMTYwLDIyMSksXHJcbiBcdFwidmlvbGV0XCI6IG5ldyBDb2xvcigyMzgsMTMwLDIzOCksXHJcbiBcdFwibWFnZW50YVwiOiBuZXcgQ29sb3IoMjU1LDAsMjU1KSxcclxuIFx0XCJmdWNoc2lhXCI6IG5ldyBDb2xvcigyNTUsMCwyNTUpLFxyXG4gXHRcIm9yY2hpZFwiOiBuZXcgQ29sb3IoMjE4LDExMiwyMTQpLFxyXG4gXHRcIm1lZGl1bSB2aW9sZXQgcmVkXCI6IG5ldyBDb2xvcigxOTksMjEsMTMzKSxcclxuIFx0XCJwYWxlIHZpb2xldCByZWRcIjogbmV3IENvbG9yKDIxOSwxMTIsMTQ3KSxcclxuIFx0XCJkZWVwIHBpbmtcIjogbmV3IENvbG9yKDI1NSwyMCwxNDcpLFxyXG4gXHRcImhvdCBwaW5rXCI6IG5ldyBDb2xvcigyNTUsMTA1LDE4MCksXHJcbiBcdFwibGlnaHQgcGlua1wiOiBuZXcgQ29sb3IoMjU1LDE4MiwxOTMpLFxyXG4gXHRcInBpbmtcIjogbmV3IENvbG9yKDI1NSwxOTIsMjAzKSxcclxuIFx0XCJhbnRpcXVlIHdoaXRlXCI6IG5ldyBDb2xvcigyNTAsMjM1LDIxNSksXHJcbiBcdFwiYmVpZ2VcIjogbmV3IENvbG9yKDI0NSwyNDUsMjIwKSxcclxuIFx0XCJiaXNxdWVcIjogbmV3IENvbG9yKDI1NSwyMjgsMTk2KSxcclxuIFx0XCJibGFuY2hlZCBhbG1vbmRcIjogbmV3IENvbG9yKDI1NSwyMzUsMjA1KSxcclxuIFx0XCJ3aGVhdFwiOiBuZXcgQ29sb3IoMjQ1LDIyMiwxNzkpLFxyXG4gXHRcImNvcm4gc2lsa1wiOiBuZXcgQ29sb3IoMjU1LDI0OCwyMjApLFxyXG4gXHRcImxlbW9uIGNoaWZmb25cIjogbmV3IENvbG9yKDI1NSwyNTAsMjA1KSxcclxuIFx0XCJsaWdodCBnb2xkZW4gcm9kIHllbGxvd1wiOiBuZXcgQ29sb3IoMjUwLDI1MCwyMTApLFxyXG4gXHRcImxpZ2h0IHllbGxvd1wiOiBuZXcgQ29sb3IoMjU1LDI1NSwyMjQpLFxyXG4gXHRcInNhZGRsZSBicm93blwiOiBuZXcgQ29sb3IoMTM5LDY5LDE5KSxcclxuIFx0XCJzaWVubmFcIjogbmV3IENvbG9yKDE2MCw4Miw0NSksXHJcbiBcdFwiY2hvY29sYXRlXCI6IG5ldyBDb2xvcigyMTAsMTA1LDMwKSxcclxuIFx0XCJwZXJ1XCI6IG5ldyBDb2xvcigyMDUsMTMzLDYzKSxcclxuIFx0XCJzYW5keSBicm93blwiOiBuZXcgQ29sb3IoMjQ0LDE2NCw5NiksXHJcbiBcdFwiYnVybHkgd29vZFwiOiBuZXcgQ29sb3IoMjIyLDE4NCwxMzUpLFxyXG4gXHRcInRhblwiOiBuZXcgQ29sb3IoMjEwLDE4MCwxNDApLFxyXG4gXHRcInJvc3kgYnJvd25cIjogbmV3IENvbG9yKDE4OCwxNDMsMTQzKSxcclxuIFx0XCJtb2NjYXNpblwiOiBuZXcgQ29sb3IoMjU1LDIyOCwxODEpLFxyXG4gXHRcIm5hdmFqbyB3aGl0ZVwiOiBuZXcgQ29sb3IoMjU1LDIyMiwxNzMpLFxyXG4gXHRcInBlYWNoIHB1ZmZcIjogbmV3IENvbG9yKDI1NSwyMTgsMTg1KSxcclxuIFx0XCJtaXN0eSByb3NlXCI6IG5ldyBDb2xvcigyNTUsMjI4LDIyNSksXHJcbiBcdFwibGF2ZW5kZXIgYmx1c2hcIjogbmV3IENvbG9yKDI1NSwyNDAsMjQ1KSxcclxuIFx0XCJsaW5lblwiOiBuZXcgQ29sb3IoMjUwLDI0MCwyMzApLFxyXG4gXHRcIm9sZCBsYWNlXCI6IG5ldyBDb2xvcigyNTMsMjQ1LDIzMCksXHJcbiBcdFwicGFwYXlhIHdoaXBcIjogbmV3IENvbG9yKDI1NSwyMzksMjEzKSxcclxuIFx0XCJzZWEgc2hlbGxcIjogbmV3IENvbG9yKDI1NSwyNDUsMjM4KSxcclxuIFx0XCJtaW50IGNyZWFtXCI6IG5ldyBDb2xvcigyNDUsMjU1LDI1MCksXHJcbiBcdFwic2xhdGUgZ3JheVwiOiBuZXcgQ29sb3IoMTEyLDEyOCwxNDQpLFxyXG4gXHRcImxpZ2h0IHNsYXRlIGdyYXlcIjogbmV3IENvbG9yKDExOSwxMzYsMTUzKSxcclxuIFx0XCJsaWdodCBzdGVlbCBibHVlXCI6IG5ldyBDb2xvcigxNzYsMTk2LDIyMiksXHJcbiBcdFwibGF2ZW5kZXJcIjogbmV3IENvbG9yKDIzMCwyMzAsMjUwKSxcclxuIFx0XCJmbG9yYWwgd2hpdGVcIjogbmV3IENvbG9yKDI1NSwyNTAsMjQwKSxcclxuIFx0XCJhbGljZSBibHVlXCI6IG5ldyBDb2xvcigyNDAsMjQ4LDI1NSksXHJcbiBcdFwiZ2hvc3Qgd2hpdGVcIjogbmV3IENvbG9yKDI0OCwyNDgsMjU1KSxcclxuIFx0XCJob25leWRld1wiOiBuZXcgQ29sb3IoMjQwLDI1NSwyNDApLFxyXG4gXHRcIml2b3J5XCI6IG5ldyBDb2xvcigyNTUsMjU1LDI0MCksXHJcbiBcdFwiYXp1cmVcIjogbmV3IENvbG9yKDI0MCwyNTUsMjU1KSxcclxuIFx0XCJzbm93XCI6IG5ldyBDb2xvcigyNTUsMjUwLDI1MCksXHJcbiBcdFwiYmxhY2tcIjogbmV3IENvbG9yKDAsMCwwKSxcclxuIFx0XCJkaW0gZ3JheVwiOiBuZXcgQ29sb3IoMTA1LDEwNSwxMDUpLFxyXG4gXHRcImRpbSBncmV5XCI6IG5ldyBDb2xvcigxMDUsMTA1LDEwNSksXHJcbiBcdFwiZ3JheVwiOiBuZXcgQ29sb3IoMTI4LDEyOCwxMjgpLFxyXG4gXHRcImdyZXlcIjogbmV3IENvbG9yKDEyOCwxMjgsMTI4KSxcclxuIFx0XCJkYXJrIGdyYXlcIjogbmV3IENvbG9yKDE2OSwxNjksMTY5KSxcclxuIFx0XCJkYXJrIGdyZXlcIjogbmV3IENvbG9yKDE2OSwxNjksMTY5KSxcclxuIFx0XCJzaWx2ZXJcIjogbmV3IENvbG9yKDE5MiwxOTIsMTkyKSxcclxuIFx0XCJsaWdodCBncmF5XCI6IG5ldyBDb2xvcigyMTEsMjExLDIxMSksXHJcbiBcdFwibGlnaHQgZ3JleVwiOiBuZXcgQ29sb3IoMjExLDIxMSwyMTEpLFxyXG4gXHRcImdhaW5zYm9yb1wiOiBuZXcgQ29sb3IoMjIwLDIyMCwyMjApLFxyXG4gXHRcIndoaXRlIHNtb2tlXCI6IG5ldyBDb2xvcigyNDUsMjQ1LDI0NSksXHJcbiBcdFwid2hpdGVcIjogbmV3IENvbG9yKDI1NSwyNTUsMjU1KVxyXG59XHJcblxyXG5leHBvcnQge0NvbG9yfVxyXG4iLCJpbXBvcnQge1xyXG4gICAgQ29sb3JcclxufSBmcm9tIFwiLi9jb2xvclwiXHJcbmltcG9ydCB7XHJcbiAgICBDQmV6aWVyXHJcbn0gZnJvbSBcIi4uL2NvbW1vblwiXHJcbmltcG9ydCB7XHJcbiAgICBTY2hlZHVsZXJcclxufSBmcm9tIFwiLi4vc2NoZWR1bGVyXCJcclxuXHJcbnZhciBlYXNlX291dCA9IG5ldyBDQmV6aWVyKDAuNSwgMC4yLCAwLCAxKTtcclxuXHJcbmlmICghcmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gKGUpID0+IHtcclxuICAgICAgICBzZXRUaW1lb3V0KGUsIDEwMDApO1xyXG4gICAgfVxyXG5cclxuY2xhc3MgVFRfRnJvbSB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7XHJcbiAgICAgICAgLy9leHRyYWN0ZWQgYW5pbWF0YWJsZSBjb21wb25lbnRzXHJcbiAgICAgICAgdmFyIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbG9yID0gbmV3IENvbG9yKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJiYWNrZ3JvdW5kLWNvbG9yXCIpKTtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IHBhcnNlRmxvYXQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcImhlaWdodFwiKSk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHBhcnNlRmxvYXQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcIndpZHRoXCIpKTtcclxuXHJcbiAgICAgICAgLy8qaWYoIXRoaXMuaGVpZ2h0IHx8ICF0aGlzLndpZHRoKXtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IHJlY3QuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMud2lkdGggPSByZWN0LndpZHRoO1xyXG4gICAgICAgIC8vfSovXHJcblxyXG5cclxuICAgICAgICB0aGlzLmxlZnQgPSBwYXJzZUZsb2F0KHJlY3QubGVmdCk7XHJcbiAgICAgICAgdGhpcy50b3AgPSBwYXJzZUZsb2F0KHJlY3QudG9wKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBlbmQoKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAxO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBUVF9UbyBleHRlbmRzIFRUX0Zyb20ge1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgZnJvbSkge1xyXG4gICAgICAgIHN1cGVyKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICB0aGlzLmZyb20gPSBmcm9tO1xyXG5cclxuICAgICAgICB0aGlzLnJlcyA9ICgoZWxlbWVudC5zdHlsZS50b3ApICYmIChlbGVtZW50LnN0eWxlLmxlZnQpKTtcclxuXHJcbiAgICAgICAgdGhpcy5ydCA9IChlbGVtZW50LnN0eWxlLnRvcCkgPyAoZWxlbWVudC5zdHlsZS50b3ApIDogbnVsbDtcclxuICAgICAgICB0aGlzLnJsID0gZWxlbWVudC5zdHlsZS5sZWZ0ID8gZWxlbWVudC5zdHlsZS5sZWZ0IDogbnVsbDtcclxuXHJcblxyXG4gICAgICAgIC8vZ2V0IHRoZSByZWxhdGl2ZSBvZmZzZXQgb2YgdGhpcyBvYmplY3RcclxuICAgICAgICB2YXIgb2Zmc2V0X3ggPSAwOyAtIGVsZW1lbnQuZ2V0UGFyZW50V2luZG93TGVmdCgpO1xyXG4gICAgICAgIHZhciBvZmZzZXRfeSA9IDA7IC0gZWxlbWVudC5nZXRQYXJlbnRXaW5kb3dUb3AoKTtcclxuXHJcbiAgICAgICAgdmFyIG9mZnNldF94ID0gcGFyc2VGbG9hdCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwibGVmdFwiKSk7XHJcbiAgICAgICAgdmFyIG9mZnNldF95ID0gcGFyc2VGbG9hdCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwidG9wXCIpKTtcclxuICAgICAgICAvL0FuZCBhZGp1c3Qgc3RhcnQgdG8gcmVzcGVjdCB0aGUgZWxlbWVudHMgb3duIHBhcmVudGFsIG9mZnNldHNcclxuICAgICAgICB2YXIgZGlmZnggPSB0aGlzLmxlZnQgLSB0aGlzLmZyb20ubGVmdDtcclxuICAgICAgICB0aGlzLmxlZnQgPSBvZmZzZXRfeDtcclxuICAgICAgICB0aGlzLmZyb20ubGVmdCA9IHRoaXMubGVmdCAtIGRpZmZ4O1xyXG5cclxuICAgICAgICB2YXIgZGlmZnkgPSB0aGlzLnRvcCAtIHRoaXMuZnJvbS50b3A7XHJcbiAgICAgICAgdGhpcy50b3AgPSBvZmZzZXRfeTtcclxuICAgICAgICB0aGlzLmZyb20udG9wID0gdGhpcy50b3AgLSBkaWZmeTtcclxuXHJcbiAgICAgICAgdGhpcy50aW1lID0gNjAgKiAuMzU7XHJcbiAgICAgICAgdGhpcy5zID0gMDtcclxuICAgICAgICB0aGlzLmNvbG9yX28gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiYmFja2dyb3VuZC1jb2xvclwiKTtcclxuICAgICAgICB0aGlzLmhlaWdodF9vID0gZWxlbWVudC5zdHlsZS53aWR0aDtcclxuICAgICAgICB0aGlzLndpZHRoX28gPSBlbGVtZW50LnN0eWxlLmhlaWdodDtcclxuICAgICAgICB0aGlzLnRvcF9vID0gdGhpcy50b3A7XHJcbiAgICAgICAgdGhpcy5sZWZ0X28gPSB0aGlzLmxlZnQ7XHJcbiAgICAgICAgdGhpcy5wb3MgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwicG9zaXRpb25cIik7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZW5kKCk7IC8vUmVzdG9yZSBldmVyeXRoaW5nIGJhY2sgdG8gaXQncyBvcmlnaW5hbCB0eXBlO1xyXG4gICAgICAgIHRoaXMuZnJvbSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zID0gSW5maW5pdHk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAxO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSB0aGlzLmZyb20udG9wICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gdGhpcy5mcm9tLmxlZnQgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy5mcm9tLndpZHRoICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmZyb20uaGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgfVxyXG5cclxuICAgIHN0ZXAoKSB7XHJcbiAgICAgICAgdGhpcy5zKytcclxuXHJcbiAgICAgICAgICAgIHZhciB0ID0gdGhpcy5zIC8gdGhpcy50aW1lO1xyXG5cclxuICAgICAgICBpZiAodCA+IDEpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgdmFyIHJhdGlvID0gZWFzZV9vdXQuZ2V0WWF0WCh0KTtcclxuXHJcbiAgICAgICAgaWYgKHJhdGlvID4gMSkgcmF0aW8gPSAxO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gTWF0aC5yb3VuZCgodGhpcy50b3AgLSB0aGlzLmZyb20udG9wKSAqIHJhdGlvICsgdGhpcy5mcm9tLnRvcCkgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBNYXRoLnJvdW5kKCh0aGlzLmxlZnQgLSB0aGlzLmZyb20ubGVmdCkgKiByYXRpbyArIHRoaXMuZnJvbS5sZWZ0KSArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSAoKHRoaXMud2lkdGggLSB0aGlzLmZyb20ud2lkdGgpICogcmF0aW8gKyB0aGlzLmZyb20ud2lkdGgpICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAoKHRoaXMuaGVpZ2h0IC0gdGhpcy5mcm9tLmhlaWdodCkgKiByYXRpbyArIHRoaXMuZnJvbS5oZWlnaHQpICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAodGhpcy5jb2xvci5zdWIodGhpcy5mcm9tLmNvbG9yKS5tdWx0KHJhdGlvKS5hZGQodGhpcy5mcm9tLmNvbG9yKSkgKyBcIlwiO1xyXG5cclxuICAgICAgICByZXR1cm4gKHQgPCAwLjk5OTk5OTUpO1xyXG4gICAgfVxyXG5cclxuICAgIGVuZCgpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gbnVsbDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHRfbztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoX287XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IHRoaXMucnQ7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSB0aGlzLnJsO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuY2xhc3MgVFRQYWlyIHtcclxuICAgIGNvbnN0cnVjdG9yKGVfdG8sIGVfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuYiA9IChlX2Zyb20gaW5zdGFuY2VvZiBUVF9Gcm9tKSA/IGVfZnJvbSA6IG5ldyBUVF9Gcm9tKGVfZnJvbSk7XHJcbiAgICAgICAgdGhpcy5hID0gbmV3IFRUX1RvKGVfdG8sIHRoaXMuYik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmEuZWxlbWVudC5fX1RUX18pXHJcbiAgICAgICAgICAgIHRoaXMuYS5lbGVtZW50Ll9fVFRfXy5kZXN0cnVjdG9yKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmIuZWxlbWVudC5fX1RUX18pXHJcbiAgICAgICAgICAgIHRoaXMuYi5lbGVtZW50Ll9fVFRfXy5kZXN0cnVjdG9yKCk7XHJcblxyXG4gICAgICAgIHRoaXMuYS5lbGVtZW50Ll9fVFRfXyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5iLmVsZW1lbnQuX19UVF9fID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSByZXR1cm5cclxuICAgICAgICBpZiAodGhpcy5iLmVsZW1lbnQpXHJcbiAgICAgICAgICAgIHRoaXMuYi5lbGVtZW50Ll9fVFRfXyA9IG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMuYS5lbGVtZW50KVxyXG4gICAgICAgICAgICB0aGlzLmEuZWxlbWVudC5fX1RUX18gPSBudWxsO1xyXG4gICAgICAgIHRoaXMuYS5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuYi5zdGFydCgpO1xyXG4gICAgICAgIHRoaXMuYS5zdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0ZXAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYS5zdGVwKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFRyYW5zZm9ybVJ1bm5lciA9IG5ldyAoY2xhc3N7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnBhaXJzID0gW107XHJcbiAgICAgICAgdGhpcy5fX19fU0NIRURVTEVEX19fXyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1c2hQYWlyKHBhaXIpIHtcclxuICAgICAgICB0aGlzLnBhaXJzLnB1c2gocGFpcik7XHJcbiAgICAgICAgU2NoZWR1bGVyLnF1ZXVlVXBkYXRlKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShyYXRpbykge1xyXG4gICAgICAgIGxldCBycCA9IHRoaXMucGFpcnM7XHJcblxyXG4gICAgICAgIGlmKHJwLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIFNjaGVkdWxlci5xdWV1ZVVwZGF0ZSh0aGlzKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBycC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgX3JwID0gcnBbaV07XHJcbiAgICAgICAgICAgIGlmICghX3JwLnN0ZXAocmF0aW8pKSB7XHJcbiAgICAgICAgICAgICAgICBfcnAuZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgICAgICAgICAgcnAuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0pKClcclxuXHJcblxyXG4vKipcclxuICAgIFRyYW5zZm9ybSBvbmUgZWxlbWVudCBmcm9tIGFub3RoZXIgYmFjayB0byBpdHNlbGZcclxuKi9cclxuZnVuY3Rpb24gVHJhbnNmb3JtVG8oZWxlbWVudF9mcm9tLCBlbGVtZW50X3RvLCBISURFX09USEVSKSB7XHJcblxyXG5cclxuICAgIGlmICghZWxlbWVudF90bykge1xyXG5cclxuICAgICAgICBsZXQgYSA9IChmcm9tKSA9PiAoZWxlbWVudF90bywgSElERV9PVEhFUikgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcGFpciA9IG5ldyBUVFBhaXIoZWxlbWVudF90bywgZnJvbSk7XHJcbiAgICAgICAgICAgIFRyYW5zZm9ybVJ1bm5lci5wdXNoUGFpcihwYWlyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBiID0gYShuZXcgVFRfRnJvbShlbGVtZW50X2Zyb20pKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGI7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHBhaXIgPSBuZXcgVFRQYWlyKGVsZW1lbnRfdG8sIGVsZW1lbnRfZnJvbSk7XHJcblxyXG4gICAgVHJhbnNmb3JtUnVubmVyLnB1c2hQYWlyKHBhaXIpO1xyXG5cclxuICAgIHBhaXIuc3RhcnQoKTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQge1xyXG4gICAgVHJhbnNmb3JtVG9cclxufSIsImltcG9ydCB7XHJcblx0U3R5bGVNYXBwaW5nc1xyXG59IGZyb20gXCIuL3N0eWxlX21hcHBpbmdzXCJcclxuaW1wb3J0IHtDb2xvcn0gZnJvbSBcIi4vY29sb3JcIiBcclxuaW1wb3J0IHtUcmFuc2Zvcm1Ub30gZnJvbSBcIi4vdHJhbnNmb3JtdG9cIlxyXG5cclxuY2xhc3MgU3R5bGVBbmltQmxvYyB7XHJcblx0Y29uc3RydWN0b3Ioc3R5bGUsIHRvX3ZhbCwgZHVyYXRpb24sIGRlbGF5KSB7XHJcblx0XHR0aGlzLnN0eWxlID0gc3R5bGU7XHJcblx0XHR0aGlzLmRlbGF5ID0gZGVsYXk7XHJcblx0XHR0aGlzLmR1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHR0aGlzLnRvX3ZhbCA9IHRvX3ZhbDtcclxuXHRcdHRoaXMuc3RlcCA9IDA7XHJcblx0XHR0aGlzLm5leHQgPSBudWxsO1xyXG5cdFx0dGhpcy5wcmV2ID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdGRlc3RydWN0b3IoKSB7XHJcblxyXG5cdH1cclxuXHJcblx0c3RlcChzdGVwX211bHRpcGxpZXIpIHtcclxuXHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBTdHlsZUFuaW1CbG9jUGVyY2VudGFnZSBleHRlbmRzIFN0eWxlQW5pbUJsb2Mge31cclxuY2xhc3MgU3R5bGVBbmltQmxvY1BpeGVsIGV4dGVuZHMgU3R5bGVBbmltQmxvYyB7fVxyXG5jbGFzcyBTdHlsZUFuaW1CbG9jRU0gZXh0ZW5kcyBTdHlsZUFuaW1CbG9jIHt9XHJcbmNsYXNzIFN0eWxlQW5pbUJsb2NDb2xvciBleHRlbmRzIFN0eWxlQW5pbUJsb2Mge31cclxuXHJcbmNsYXNzIFN0eWxlS2V5RnJhbWVkQW5pbUJsb2MgZXh0ZW5kcyBTdHlsZUFuaW1CbG9jIHtcclxuXHRjb25zdHJ1Y3RvcihzdHlsZSwga2V5X2ZyYW1lcywgZGVsYXkpIHtcclxuXHRcdHN1cGVyKClcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIEFuaW1CdWRkeSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCkge1xyXG5cdFx0dGhpcy5zdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpO1xyXG5cdFx0dGhpcy5maXJzdF9hbmltYXRpb24gPSBudWxsO1xyXG5cdH1cclxuXHJcblx0c2V0QW5pbWF0aW9uKHZhbHMpIHtcclxuXHRcdGxldCBhbmltX2Jsb2MgPSBudWxsO1xyXG5cdFx0aWYgKHZhbHMgaW5zdGFuY2VvZiBBcnJheSkge1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0fVxyXG5cdFx0aWYoYW5pbV9ibG9jKXtcclxuXHRcdFx0dGhpcy5fX2luc2VydF9fKGFiKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9faW5zZXJ0X18oYWIpIHtcclxuXHRcdGxldCBibG9jID0gdGhpcy5maXJzdF9hbmltYXRpb247XHJcblxyXG5cdFx0d2hpbGUgKGJsb2MpIHtcclxuXHRcdFx0aWYgKGJsb2Muc3R5bGUgPSBhYi5zdHlsZSkge1xyXG5cdFx0XHRcdGFiLmRlc3RydWN0b3IoKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRhYi5uZXh0ID0gdGhpcy5maXJzdF9hbmltYXRpb247XHJcblx0XHRpZiAodGhpcy5maXJzdF9hbmltYXRpb24pXHJcblx0XHRcdHRoaXMuZmlyc3RfYW5pbWF0aW9uLnByZXYgPSBhYjtcclxuXHRcdHRoaXMuZmlyc3RfYW5pbWF0aW9uID0gYWI7XHJcblx0fVxyXG5cclxuXHRzdGVwKHN0ZXBfbXVsdGlwbGllcikge1xyXG5cdFx0dmFyIGFuaW1fYmxvYyA9IHRoaXMuZmlyc3RfYW5pbWF0aW9uO1xyXG5cdFx0aWYgKGFuaW1fYmxvYylcclxuXHRcdFx0d2hpbGUgKGFuaW1fYmxvYylcclxuXHRcdFx0XHRpZiAoIWFuaW1fYmxvYy5zdGVwKHN0ZXBfbXVsdGlwbGllcikpIHtcclxuXHRcdFx0XHRcdGlmICghYW5pbV9ibG9jLnByZXYpXHJcblx0XHRcdFx0XHRcdHRoaXMuZmlyc3RfYW5pbWF0aW9uID0gYW5pbV9ibG9jLm5leHQ7XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdGFuaW1fYmxvYy5wcmV2Lm5leHQgPSBhbmltX2Jsb2MubmV4dDtcclxuXHRcdFx0XHRcdGlmIChhbmltX2Jsb2MubmV4dClcclxuXHRcdFx0XHRcdFx0YW5pbV9ibG9jLm5leHQucHJldiA9IGFuaW1fYmxvYy5wcmV2O1xyXG5cclxuXHRcdFx0XHRcdGxldCBuZXh0ID0gYW5pbV9ibG9jLm5leHQ7XHJcblxyXG5cdFx0XHRcdFx0YW5pbV9ibG9jLmRlc3RydWN0b3IoKTtcclxuXHJcblx0XHRcdFx0XHRhbmltX2Jsb2MgPSBuZXh0O1xyXG5cdFx0XHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdFx0YW5pbV9ibG9jID0gYW5pbV9ibG9jLm5leHQ7XHJcblxyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdGRlc3RydWN0b3IoKSB7XHJcblxyXG5cdH1cclxuXHJcblx0Z2V0U3R5bGUoKSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdHNldFN0eWxlKHZhbHVlKSB7XHJcblxyXG5cdH1cclxuXHJcblx0b25SZXNpemUoKSB7XHJcblx0XHR0aGlzLmdldFN0eWxlKClcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIEFuaW1Db3Jle1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5hbmltX2dyb3VwID0ge307XHJcblx0XHR0aGlzLnJ1bm5pbmdfYW5pbWF0aW9ucyA9IFtdO1xyXG5cdH1cclxuXHJcblx0c3RlcChzdGVwX211bHRpcGxpZXIpIHtcclxuXHRcdHZhciBsID0gdGhpcy5ydW5uaW5nX2FuaW1hdGlvbnMubGVuZ2h0O1xyXG5cdFx0aWYgKGwgPiAwKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XHJcblxyXG5cdFx0XHRcdHZhciBhYiA9IHRoaXMucnVubmluZ19hbmltYXRpb25zW2ldO1xyXG5cclxuXHRcdFx0XHRpZiAoYWIgJiYgIWFiLnN0ZXAoc3RlcF9tdWx0aXBsaWVyKSkge1xyXG5cdFx0XHRcdFx0YWIuZGVzdHJ1Y3RvcigpO1xyXG5cdFx0XHRcdFx0dGhpcy5ydW5uaW5nX2FuaW1hdGlvbnNbaV0gPSBudWxsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YWRkQmxvYyhhbmltX2Jsb2MpIHtcclxuXHRcdGlmIChhbmltX2Jsb2MgaW5zdGFuY2VvZiBBbmltQmxvYykge1xyXG5cdFx0XHQvL2FkZCB0byBncm91cCBvZiBvYmplY3RcclxuXHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQge0FuaW1Db3JlLCBUcmFuc2Zvcm1UbywgQ29sb3J9IiwiY2xhc3MgVHJhbnNpdGlvbmVlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2V0KGVsZW1lbnQsIGRhdGEpIHtcclxuICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBcIm9wYWNpdHkgMC41c1wiO1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0X2luKGVsZW1lbnQsIGRhdGEsIGluZGV4ID0gMCkge1xyXG4gICAgXHRlbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBgb3BhY2l0eSAkezAuOCppbmRleCswLjV9c2A7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICByZXR1cm4gMC44O1xyXG4gICAgfVxyXG5cclxuICAgIHNldF9vdXQoZWxlbWVudCwgZGF0YSwgaW5kZXggPSAwKSB7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICByZXR1cm4gMC44O1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmFsaXplX291dChlbGVtZW50KSB7XHJcbiAgICBcdGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IHtcclxuICAgIFRyYW5zaXRpb25lZXJcclxufSIsImltcG9ydCB7XHJcbiAgICBWaWV3XHJcbn0gZnJvbSBcIi4uL3ZpZXdcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIEFueU1vZGVsXHJcbn0gZnJvbSBcIi4uL21vZGVsL21vZGVsXCJcclxuXHJcbi8qXHJcbiAgICBUcmFuc2l0aW9uZWVyc1xyXG4qL1xyXG5cclxuaW1wb3J0IHtcclxuICAgIFRyYW5zaXRpb25lZXJcclxufSBmcm9tIFwiLi4vYW5pbWF0aW9uL3RyYW5zaXRpb24vdHJhbnNpdGlvbmVlclwiXHJcblxyXG5sZXQgUHJlc2V0VHJhbnNpdGlvbmVlcnMgPSB7XHJcbiAgICBiYXNlOiBUcmFuc2l0aW9uZWVyXHJcbn1cclxuXHJcbmNsYXNzIFJpdmV0IGV4dGVuZHMgVmlldyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50ID0gbnVsbCwgZGF0YSA9IHt9LCBwcmVzZXRzID0ge30pIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICB0aGlzLm5hbWVkX2VsZW1lbnRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZXhwb3J0X3ZhbCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuREVTVFJPWUVEID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vU2V0dGluZyB0aGUgdHJhbnNpdGlvbmVyXHJcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEudHJzKSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVzZXRzLnRyYW5zaXRpb25zICYmIHByZXNldHMudHJhbnNpdGlvbnNbZGF0YS50cnNdKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyID0gbmV3IHByZXNldHMudHJhbnNpdGlvbnNbZGF0YS50cnNdKCk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKFByZXNldFRyYW5zaXRpb25lZXJzW2RhdGEudHJzXSlcclxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbmVlciA9IG5ldyBQcmVzZXRUcmFuc2l0aW9uZWVyc1tkYXRhLnRyc10oKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbmVlci5zZXQodGhpcy5lbGVtZW50KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hZGRUb1BhcmVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFRvUGFyZW50KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkgdGhpcy5wYXJlbnQuY2hpbGRyZW4ucHVzaCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLkRFU1RST1lFRCA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLkxPQURFRCkge1xyXG5cclxuXHJcbiAgICAgICAgICAgIGxldCB0ID0gdGhpcy50cmFuc2l0aW9uT3V0KCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIHQgPSBNYXRoLm1heCh0LCBjaGlsZC50cmFuc2l0aW9uT3V0KCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgICAgICB9LCB0ICogMTAwMCArIDUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGMpID0+IGMuZGVzdHJ1Y3RvcigpKTtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudCAmJiB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudClcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJ1YmJsZUxpbmsobGlua191cmwsIGNoaWxkLCB0cnNfZWxlID0ge30pIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEudHJhbnNpdGlvbilcclxuICAgICAgICAgICAgICAgIHRyc19lbGVbdGhpcy5kYXRhLnRyYW5zaXRpb25dID0gdGhpcy5lbGVtZW50O1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoID0gdGhpcy5jaGlsZHJlbltpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2ggIT09IGNoaWxkKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoLmdhdGhlclRyYW5zaXRpb25FbGVtZW50cyh0cnNfZWxlKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LmJ1YmJsZUxpbmsobGlua191cmwsIHRoaXMsIHRyc19lbGUpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiaWdub3JlZCB0aXRsZVwiLCBsaW5rX3VybCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWVkRWxlbWVudHMobmFtZWRfZWxlbWVudHMpIHt9XHJcblxyXG4gICAgZ2F0aGVyVHJhbnNpdGlvbkVsZW1lbnRzKHRyc19lbGUpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS50cmFuc2l0aW9uICYmICF0cnNfZWxlW3RoaXMuZGF0YS50cmFuc2l0aW9uXSlcclxuICAgICAgICAgICAgdHJzX2VsZVt0aGlzLmRhdGEudHJhbnNpdGlvbl0gPSB0aGlzLmVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS5pcyA9PSAxKVxyXG4gICAgICAgICAgICAgICAgZS5nYXRoZXJUcmFuc2l0aW9uRWxlbWVudHModHJzX2VsZSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb3B5KGVsZW1lbnQsIGluZGV4KSB7XHJcbiAgICAgICAgbGV0IG91dF9vYmplY3QgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgb3V0X29iamVjdC5lbGVtZW50ID0gZWxlbWVudC5jaGlsZHJlblt0aGlzLmVsZW1lbnRdO1xyXG4gICAgICAgICAgICBvdXRfb2JqZWN0LmNoaWxkcmVuID0gbmV3IEFycmF5KHRoaXMuY2hpbGRyZW4ubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICBvdXRfb2JqZWN0LmNoaWxkcmVuW2ldID0gY2hpbGQuY29weShvdXRfb2JqZWN0LmVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0X29iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVVcmxVcGRhdGUod3VybCkge31cclxuXHJcbiAgICBmaW5hbGl6ZVRyYW5zaXRpb25PdXQoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5maW5hbGl6ZVRyYW5zaXRpb25PdXQoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbmVlcikge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25lZXIuZmluYWxpemVfb3V0KHRoaXMuZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgIEByZXR1cm5zIHtudW1iZXJ9IFRpbWUgaW4gbWlsbGlzZWNvbmRzIHRoYXQgdGhlIHRyYW5zaXRpb24gd2lsbCB0YWtlIHRvIGNvbXBsZXRlLlxyXG4gICAgKi9cclxuICAgIHRyYW5zaXRpb25JbihpbmRleCA9IDApIHtcclxuXHJcbiAgICAgICAgdGhpcy5zaG93KCk7XHJcblxyXG4gICAgICAgIGxldCB0cmFuc2l0aW9uX3RpbWUgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLkxPQURFRCA9IHRydWU7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgdGhpcy5jaGlsZHJlbltpXS50cmFuc2l0aW9uSW4oaW5kZXgpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbmVlcikge1xyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMudHJhbnNpdGlvbmVlci5zZXRfaW4odGhpcy5lbGVtZW50LCB0aGlzLmRhdGEsIGluZGV4KSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbl90aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFRha2VzIGFzIGFuIGlucHV0IGEgbGlzdCBvZiB0cmFuc2l0aW9uIG9iamVjdHMgdGhhdCBjYW4gYmUgdXNlZFxyXG4gICAgKi9cclxuICAgIHRyYW5zaXRpb25PdXQoaW5kZXggPSAwLCBERVNUUk9ZID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fdGltZSA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuTE9BREVEID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb25lZXIpIHtcclxuICAgICAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCB0aGlzLnRyYW5zaXRpb25lZXIuc2V0X291dCh0aGlzLmVsZW1lbnQsIHRoaXMuZGF0YSwgaW5kZXgpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgdGhpcy5jaGlsZHJlbltpXS50cmFuc2l0aW9uT3V0KGluZGV4KSk7XHJcblxyXG4gICAgICAgIGlmIChERVNUUk9ZKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maW5hbGl6ZVRyYW5zaXRpb25PdXQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgICAgICB9LCB0cmFuc2l0aW9uX3RpbWUgKiAxMDAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uX3RpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRGltZW5zaW9ucygpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0udXBkYXRlRGltZW5zaW9ucygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIENhbGxlZCBieSAgcGFyZW50IHdoZW4gZGF0YSBpcyB1cGRhdGUgYW5kIHBhc3NlZCBkb3duIGZyb20gZnVydGhlciB1cCB0aGUgZ3JhcGguIFxyXG4gICAgICAgIEBwYXJhbSB7KE9iamVjdCB8IE1vZGVsKX0gZGF0YSAtIERhdGEgdGhhdCBoYXMgYmVlbiB1cGRhdGVkIGFuZCBpcyB0byBiZSByZWFkLiBcclxuICAgICAgICBAcGFyYW0ge0FycmF5fSBjaGFuZ2VkX3Byb3BlcnRpZXMgLSBBbiBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyB0aGF0IGhhdmUgYmVlbiB1cGRhdGVkLiBcclxuICAgICAgICBAcGFyYW0ge0Jvb2xlYW59IElNUE9SVEVEIC0gVHJ1ZSBpZiB0aGUgZGF0YSBkaWQgbm90IG9yaWdpbmF0ZSBmcm9tIHRoZSBtb2RlbCB3YXRjaGVkIGJ5IHRoZSBwYXJlbnQgQ2FzZS4gRmFsc2Ugb3RoZXJ3aXNlLlxyXG4gICAgKi9cclxuICAgIF9fZG93bl9fKGRhdGEsIGNoYW5nZWRfcHJvcGVydGllcyA9IG51bGwsIElNUE9SVEVEID0gZmFsc2UpIHtcclxuICAgICAgICBsZXQgcl92YWwgPSB0aGlzLmRvd24oZGF0YSwgY2hhbmdlZF9wcm9wZXJ0aWVzLCBJTVBPUlRFRCk7XHJcbiAgICAgICAgaWYgKHJfdmFsKShkYXRhID0gcl92YWwsIElNUE9SVEVEID0gdHJ1ZSk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLl9fZG93bl9fKGRhdGEsIGNoYW5nZWRfcHJvcGVydGllcywgSU1QT1JURUQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRvd24oZGF0YSwgY2hhbmdlZF9wcm9wZXJ0aWVzID0gbnVsbCwgSU1QT1JURUQpIHt9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQ2FsbGVkIGJ5ICBwYXJlbnQgd2hlbiBkYXRhIGlzIHVwZGF0ZSBhbmQgcGFzc2VkIHVwIGZyb20gYSBsZWFmLiBcclxuICAgICAgICBAcGFyYW0geyhPYmplY3QgfCBNb2RlbCl9IGRhdGEgLSBEYXRhIHRoYXQgaGFzIGJlZW4gdXBkYXRlZCBhbmQgaXMgdG8gYmUgcmVhZC4gXHJcbiAgICAgICAgQHBhcmFtIHtBcnJheX0gY2hhbmdlZF9wcm9wZXJ0aWVzIC0gQW4gYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgdGhhdCBoYXZlIGJlZW4gdXBkYXRlZC4gXHJcbiAgICAgICAgQHBhcmFtIHtCb29sZWFufSBJTVBPUlRFRCAtIFRydWUgaWYgdGhlIGRhdGEgZGlkIG5vdCBvcmlnaW5hdGUgZnJvbSB0aGUgbW9kZWwgd2F0Y2hlZCBieSB0aGUgcGFyZW50IENhc2UuIEZhbHNlIG90aGVyd2lzZS5cclxuICAgICovXHJcbiAgICBfX3VwX18oZGF0YSkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudClcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQodXApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cChkYXRhKSB7XHJcbiAgICAgICAgaWYoZGF0YSlcclxuICAgICAgICAgICAgdGhpcy5fX3VwX18oZGF0YSlcclxuICAgIH1cclxuXHJcbiAgICBfX3VwZGF0ZV9fKGRhdGEsIEZST01fUEFSRU5UID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgbGV0IHJfZGF0YSA9IHRoaXMudXBkYXRlKGRhdGEsIEZST01fUEFSRU5UKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLl9fdXBkYXRlX18ocl9kYXRhIHx8IGRhdGEsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2FkKG1vZGVsKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0ubG9hZChtb2RlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkgPSB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdygpIHtcclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PSBcIm5vbmVcIilcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gdGhpcy5kaXNwbGF5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfX3VwZGF0ZUV4cG9ydHNfXyhkYXRhKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5leHBvcnQgJiYgZGF0YVt0aGlzLmRhdGEuZXhwb3J0XSlcclxuICAgICAgICAgICAgdGhpcy5leHBvcnRfdmFsID0gZGF0YVt0aGlzLmRhdGEuZXhwb3J0XTtcclxuICAgIH1cclxuXHJcbiAgICBfX2dldEV4cG9ydHNfXyhleHBvcnRzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZXhwb3J0X3ZhbClcclxuICAgICAgICAgICAgZXhwb3J0c1t0aGlzLmRhdGEuZXhwb3J0XSA9IHRoaXMuZXhwb3J0X3ZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBFeHBvcnRzIGRhdGEgc3RvcmVkIGZyb20gdXBkYXRlRXhwb3J0cygpIGludG8gYSBhbiBPYmplY3QgZXhwb3J0cyBhbmQgY2FsbHMgaXQncyBwYXJlbnQncyBleHBvcnQgZnVuY3Rpb24sIHBhc3NpbmcgZXhwb3J0c1xyXG4gICAgKi9cclxuICAgIGV4cG9ydCAoZXhwb3J0cyA9IG5ldyBBbnlNb2RlbCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuZXhwb3J0KSB7XHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy5fX2dldEV4cG9ydHNfXyhleHBvcnRzKVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uX19nZXRFeHBvcnRzX18oZXhwb3J0cyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5leHBvcnQoZXhwb3J0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGltcG9ydCAoZGF0YSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5tb2RlbClcclxuICAgICAgICAgICAgdGhpcy5tb2RlbC5hZGQoZGF0YSk7XHJcblxyXG4gICAgICAgIHRoaXMuZXhwb3J0KGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUV4cG9ydHMoZGF0YSkge1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEuZXhwb3J0ICYmIGRhdGFbdGhpcy5kYXRhLmV4cG9ydF0pXHJcbiAgICAgICAgICAgIHRoaXMuZXhwb3J0ID0gZGF0YVt0aGlzLmRhdGEuZXhwb3J0XTtcclxuICAgIH1cclxuXHJcbiAgICBhZGQodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmFkZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwb3J0KHRoaXMubW9kZWwpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuYWRkKVxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5hZGQodmFsdWUpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBSaXZldFxyXG59IiwiaW1wb3J0IHtcclxuICAgIFZpZXdcclxufSBmcm9tIFwiLi4vdmlld1wiXHJcbmltcG9ydCB7XHJcbiAgICBHZXR0ZXJcclxufSBmcm9tIFwiLi4vZ2V0dGVyXCJcclxuaW1wb3J0IHtcclxuICAgIFJpdmV0XHJcbn0gZnJvbSBcIi4uL2Nhc2Uvcml2ZXRcIlxyXG5pbXBvcnQge1xyXG4gICAgVHVybkRhdGFJbnRvUXVlcnlcclxufSBmcm9tIFwiLi4vY29tbW9uXCJcclxuaW1wb3J0IHtcclxuICAgIERhdGFUZW1wbGF0ZVxyXG59IGZyb20gXCIuL2RhdGFfdGVtcGxhdGVcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIFRyYW5zaXRpb25lZXJcclxufSBmcm9tIFwiLi4vYW5pbWF0aW9uL3RyYW5zaXRpb24vdHJhbnNpdGlvbmVlclwiXHJcblxyXG5cclxuLyoqXHJcbiAgICBIYW5kbGVzIHRoZSB0cmFuc2l0aW9uIG9mIHNlcGFyYXRlIGVsZW1lbnRzLlxyXG4qL1xyXG5jbGFzcyBCYXNpY0Nhc2UgZXh0ZW5kcyBSaXZldCB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7XHJcbiAgICAgICAgc3VwZXIobnVsbCwgZWxlbWVudCwge30sIHt9KTtcclxuICAgICAgICB0aGlzLmFuY2hvciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyID0gbmV3IFRyYW5zaXRpb25lZXIoKTtcclxuICAgICAgICB0aGlzLnRyYW5zaXRpb25lZXIuc2V0KHRoaXMuZWxlbWVudClcclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKSB7XHJcbiAgICAgICAgbGV0IGNoaWxkcmVuID0gdGhpcy5lbGVtZW50LmNoaWxkcmVuO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNoaWxkLmRhdGFzZXQudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgbmFtZWRfZWxlbWVudHNbY2hpbGQuZGF0YXNldC50cmFuc2l0aW9uXSA9IGNoaWxkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICAgIFRoaXMgaXMgYSBmYWxsYmFjayBjb21wb25lbnQgaWYgY29uc3RydWN0aW5nIGEgQ2FzZUNvbXBvbmVudCBvciBub3JtYWwgQ29tcG9uZW50IHRocm93cyBhbiBlcnJvci5cclxuKi9cclxuXHJcbmNsYXNzIEZhaWxlZENhc2UgZXh0ZW5kcyBSaXZldCB7XHJcbiAgICBjb25zdHJ1Y3RvcihlcnJvcl9tZXNzYWdlLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2LmlubmVySFRNTCA9IGA8aDM+IFRoaXMgV2ljayBjb21wb25lbnQgaGFzIGZhaWxlZCE8L2gzPiA8aDQ+RXJyb3IgTWVzc2FnZTo8L2g0PjxwPiR7ZXJyb3JfbWVzc2FnZS5zdGFja308L3A+PHA+UGxlYXNlIGNvbnRhY3QgdGhlIHdlYnNpdGUgbWFpbnRhaW5lcnMgdG8gYWRkcmVzcyB0aGUgcHJvYmxlbS48L3A+IDxwPiR7cHJlc2V0cy5lcnJvcl9jb250YWN0fTwvcD5gO1xyXG4gICAgICAgIHN1cGVyKG51bGwsIGRpdiwge30sIHt9KTtcclxuXHJcbiAgICAgICAgIHRoaXMudHJhbnNpdGlvbmVlciA9IG5ldyBUcmFuc2l0aW9uZWVyKCk7XHJcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyLnNldCh0aGlzLmVsZW1lbnQpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBCYXNpY0Nhc2UsXHJcbiAgICBGYWlsZWRDYXNlXHJcbn0iLCJpbXBvcnQge1xyXG4gICAgc2V0TGlua3NcclxufSBmcm9tIFwiLi4vLi4vbGlua2VyL3NldGxpbmtzXCJcclxuaW1wb3J0IHtcclxuICAgIExleFxyXG59IGZyb20gXCIuLi8uLi9jb21tb25cIlxyXG5pbXBvcnQge1xyXG4gICAgUml2ZXRcclxufSBmcm9tIFwiLi4vcml2ZXRcIlxyXG5cclxuLyoqXHJcbiAgICBEZWFscyB3aXRoIHNwZWNpZmljIHByb3BlcnRpZXMgb24gYSBtb2RlbC4gXHJcbiovXHJcblxyXG5jbGFzcyBDYXNzZXR0ZSBleHRlbmRzIFJpdmV0IHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgZWxlbWVudCwgcHJlc2V0cywgZGF0YSkge1xyXG5cclxuICAgICAgICBzdXBlcihwYXJlbnQsIGVsZW1lbnQsIHByZXNldHMsIGRhdGEpO1xyXG5cclxuICAgICAgICB0aGlzLnByb3AgPSB0aGlzLmRhdGEucHJvcDtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAwO1xyXG4gICAgICAgIHRoaXMudG9wID0gMDtcclxuICAgICAgICB0aGlzLmxlZnQgPSAwO1xyXG4gICAgICAgIHRoaXMubHZsID0gMDtcclxuICAgICAgICB0aGlzLmlzID0gMTtcclxuICAgICAgICB0aGlzLmRhdGFfY2FjaGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC50YWdOYW1lID09IFwiQVwiKVxyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaW5rKHRoaXMuZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC50YWdOYW1lID09IFwiQVwiKVxyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3lMaW5rKHRoaXMuZWxlbWVudCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YV9jYWNoZSA9IG51bGw7XHJcblxyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBUaGlzIHdpbGwgYXR0YWNoIGEgZnVuY3Rpb24gdG8gdGhlIGxpbmsgZWxlbWVudCB0byBpbnRlcmNlcHQgYW5kIHByb2Nlc3MgZGF0YSBmcm9tIHRoZSBjYXNzZXR0ZS5cclxuICAgICovXHJcbiAgICBwcm9jZXNzTGluayhlbGVtZW50LCBsaW5rKSB7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50Lm9yaWdpbiAhPT0gbG9jYXRpb24ub3JpZ2luKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICghZWxlbWVudC5vbmNsaWNrKSBlbGVtZW50Lm9uY2xpY2sgPSAoKGhyZWYsIGEsIF9fZnVuY3Rpb25fXykgPT4gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBpZiAoX19mdW5jdGlvbl9fKGhyZWYsIGEpKSBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSkoZWxlbWVudC5ocmVmLCBlbGVtZW50LCAoaHJlZiwgYSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IFNBTUVfTE9DQUxFID0gKGxvY2F0aW9uLnBhdGhuYW1lID09IGEucGF0aG5hbWUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGhhc2h0YWcgPSBocmVmLmluY2x1ZGVzKFwiI1wiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCByZWFsX2hyZWYgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgbGV0IGxleCA9IExleChocmVmKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChsZXgudG9rZW4pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobGV4LnRva2VuLnRleHQgPT0gXCJ7XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9wID0gbGV4LnRva2VuLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICByZWFsX2hyZWYgKz0gdGhpc1twcm9wXSB8fCB0aGlzLmRhdGFfY2FjaGVbcHJvcF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZXgudG9rZW4udGV4dCAhPSBcIn1cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBpbmNvcnJlY3QgdmFsdWUgZm91bmQgaW4gdXJsICR7aHJlZn1gKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWFsX2hyZWYgKz0gbGV4LnRva2VuLnRleHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGhhc2h0YWcpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmV4cG9ydCgpO1xyXG5cclxuICAgICAgICAgICAgaWYoIVNBTUVfTE9DQUxFKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5idWJibGVMaW5rKHJlYWxfaHJlZik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZWxlbWVudC5vbm1vdXNlb3ZlciA9ICgoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgaHJlZiA9IGVsZW1lbnQuaHJlZjtcclxuXHJcbiAgICAgICAgICAgIGxldCByZWFsX2hyZWYgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgbGV0IGxleCA9IExleChocmVmKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChsZXgudG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIGlmIChsZXgudG9rZW4udGV4dCA9PSBcIntcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3AgPSBsZXgudG9rZW4udGV4dDtcclxuICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZWFsX2hyZWYgKz0gdGhpc1twcm9wXSB8fCB0aGlzLmRhdGFfY2FjaGVbcHJvcF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZXgudG9rZW4udGV4dCAhPSBcIn1cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBpbmNvcnJlY3QgdmFsdWUgZm91bmQgaW4gdXJsICR7aHJlZn1gKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWFsX2hyZWYgKz0gbGV4LnRva2VuLnRleHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveUxpbmsoZWxlbWVudCkge1xyXG5cclxuICAgICAgICBlbGVtZW50Lm9uY2xpY2sgPSBudWxsXHJcbiAgICAgICAgZWxlbWVudC5vbm1vdXNlb3ZlciA9IG51bGw7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVwZGF0ZShkYXRhLCBfX0ZST01fUEFSRU5UX18gPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBzdXBlci5fX3VwZGF0ZUV4cG9ydHNfXyhkYXRhKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3ApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSBkYXRhW3RoaXMucHJvcF07XHJcbiAgICAgICAgICAgICAgICB0aGlzW3RoaXMucHJvcF0gPSBkYXRhW3RoaXMucHJvcF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFfY2FjaGUgPSBkYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGltcG9ydCAoZGF0YSkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBsb2FkKG1vZGVsKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLmxvYWQobW9kZWwpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEubW9kZWwpXHJcbiAgICAgICAgICAgIG1vZGVsLmFkZFZpZXcodGhpcylcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEaW1lbnNpb25zKCkge1xyXG5cclxuICAgICAgICB2YXIgZCA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IGQud2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBkLmhlaWdodDtcclxuICAgICAgICB0aGlzLnRvcCA9IGQudG9wO1xyXG4gICAgICAgIHRoaXMubGVmdCA9IGQubGVmdDtcclxuXHJcbiAgICAgICAgc3VwZXIudXBkYXRlRGltZW5zaW9ucygpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBDbG9zZUNhc3NldHRlIGV4dGVuZHMgQ2Fzc2V0dGUge1xyXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBlbGVtZW50LCBkLCBwKSB7XHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBlbGVtZW50LCBkLCBwKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHBhcmVudC5oaWRlKCk7IC8vT3IgVVJMIGJhY2s7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIENhc3NldHRlLFxyXG4gICAgQ2xvc2VDYXNzZXR0ZSxcclxuICAgIEltcG9ydERhdGFGcm9tRGF0YVNldFxyXG59IiwiaW1wb3J0IHtcclxuICAgIFJpdmV0XHJcbn0gZnJvbSBcIi4vcml2ZXRcIlxyXG5pbXBvcnQge1xyXG4gICAgTW9kZWxcclxufSBmcm9tIFwiLi4vbW9kZWwvbW9kZWxcIlxyXG5pbXBvcnQge1xyXG4gICAgQ29udHJvbGxlclxyXG59IGZyb20gXCIuLi9jb250cm9sbGVyXCJcclxuaW1wb3J0IHtcclxuICAgIEdldHRlclxyXG59IGZyb20gXCIuLi9nZXR0ZXJcIlxyXG5pbXBvcnQge1xyXG4gICAgQ2Fzc2V0dGVcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9jYXNzZXR0ZVwiXHJcblxyXG5jbGFzcyBDYXNlIGV4dGVuZHMgUml2ZXQge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIENhc2UgY29uc3RydWN0b3IuIEJ1aWxkcyBhIENhc2Ugb2JqZWN0LlxyXG4gICAgICAgIEBwYXJhbXMgW0RPTUVsZW1lbnRdIGVsZW1lbnQgLSBBIERPTSA8dGVtcGxhdGU+IGVsZW1lbnQgdGhhdCBjb250YWlucyBhIDxjYXNlPiBlbGVtZW50LlxyXG4gICAgICAgIEBwYXJhbXMgW0xpbmtlclByZXNldHNdIHByZXNldHNcclxuICAgICAgICBAcGFyYW1zIFtDYXNlXSBwYXJlbnQgLSBUaGUgcGFyZW50IENhc2Ugb2JqZWN0LCB1c2VkIGludGVybmFsbHkgdG8gYnVpbGQgQ2FzZSdzIGluIGEgaGllcmFyY2h5XHJcbiAgICAgICAgQHBhcmFtcyBbTW9kZWxdIG1vZGVsIC0gQSBtb2RlbCB0aGF0IGNhbiBiZSBwYXNzZWQgdG8gdGhlIGNhc2UgaW5zdGVhZCBvZiBoYXZpbmcgb25lIGNyZWF0ZWQgb3IgcHVsbGVkIGZyb20gcHJlc2V0cy4gXHJcbiAgICAgICAgQHBhcmFtcyBbRE9NXSAgV09SS0lOR19ET00gLSBUaGUgRE9NIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRlbXBsYXRlcyB0byBiZSB1c2VkIHRvIGJ1aWxkIHRoZSBjYXNlIG9iamVjdHMuIFxyXG4gICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCA9IG51bGwsIGRhdGEsIHByZXNldHMpIHtcclxuXHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBkYXRhLCBwcmVzZXRzKVxyXG5cclxuICAgICAgICB0aGlzLlVTRV9TRUNVUkUgPSBwcmVzZXRzLlVTRV9IVFRQUztcclxuICAgICAgICB0aGlzLm5hbWVkX2VsZW1lbnRzID0ge307XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wcm9wID0gbnVsbDtcclxuICAgICAgICB0aGlzLnVybCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wcmVzZXRzID0gcHJlc2V0cztcclxuICAgICAgICB0aGlzLnJlY2VpdmVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLnF1ZXJ5ID0ge307XHJcbiAgICAgICAgdGhpcy5SRVFVRVNUSU5HID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5leHBvcnRzID0gbnVsbDtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuZmlsdGVyX2xpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZmlsdGVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaXMgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucmVjZWl2ZXIpXHJcbiAgICAgICAgICAgIHRoaXMucmVjZWl2ZXIuZGVzdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVtcGxhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNbaV0uZGVzdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgU2V0cyB1cCBNb2RlbCBjb25uZWN0aW9uIG9yIGNyZWF0ZXMgYSBuZXcgTW9kZWwgZnJvbSBhIHNjaGVtYS5cclxuICAgICovXHJcbiAgICBsb2FkKG1vZGVsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS51cmwpIHtcclxuICAgICAgICAgICAgLy9pbXBvcnQgcXVlcnkgaW5mbyBmcm9tIHRoZSB3dXJsXHJcbiAgICAgICAgICAgIGxldCBzdHIgPSB0aGlzLmRhdGEudXJsO1xyXG4gICAgICAgICAgICBsZXQgY2Fzc2V0dGVzID0gc3RyLnNwbGl0KFwiO1wiKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnVybCA9IGNhc3NldHRlc1swXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgY2Fzc2V0dGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2Fzc2V0dGUgPSBjYXNzZXR0ZXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjYXNzZXR0ZVswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ET1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVybF9wYXJlbnRfaW1wb3J0ID0gY2Fzc2V0dGUuc2xpY2UoMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInFcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cmxfcXVlcnkgPSBjYXNzZXR0ZS5zbGljZSgxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIjxcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cmxfcmV0dXJuID0gY2Fzc2V0dGUuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucHJvcCA9IHRoaXMuZGF0YS5wcm9wO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLmV4cG9ydCkgdGhpcy5leHBvcnRzID0gdGhpcy5kYXRhLmV4cG9ydDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwpIHtcclxuICAgICAgICAgICAgbW9kZWwgPSB0aGlzLm1vZGVsO1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb2RlbCAmJiBtb2RlbCBpbnN0YW5jZW9mIE1vZGVsKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zY2hlbWEpIHtcclxuICAgICAgICAgICAgICAgIC8qIE9waW5pb25hdGVkIENhc2UgLSBPbmx5IGFjY2VwdHMgTW9kZWxzIHRoYXQgYXJlIG9mIHRoZSBzYW1lIHR5cGUgYXMgaXRzIHNjaGVtYS4qL1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vZGVsLmNvbnN0cnVjdG9yICE9IHRoaXMuc2NoZW1hKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aHJvdyBuZXcgRXJyb3IoYE1vZGVsIFNjaGVtYSAke3RoaXMubW9kZWwuc2NoZW1hfSBkb2VzIG5vdCBtYXRjaCBDYXNlIFNjaGVtYSAke3ByZXNldHMuc2NoZW1hc1t0aGlzLmRhdGEuc2NoZW1hXS5zY2hlbWF9YClcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NoZW1hID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbnVsbDtcclxuICAgICAgICB9IFxyXG5cclxuICAgICAgICBpZiAodGhpcy5zY2hlbWEpIFxyXG4gICAgICAgICAgICBtb2RlbCA9IG5ldyB0aGlzLnNjaGVtYSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIG1vZGVsLmFkZFZpZXcodGhpcyk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1vZGVsKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEudXJsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlY2VpdmVyID0gbmV3IEdldHRlcih0aGlzLmRhdGEudXJsLCB0aGlzLnVybF9yZXR1cm4pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNlaXZlci5zZXRNb2RlbChtb2RlbCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fX19yZXF1ZXN0X19fXygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBNb2RlbCBjb3VsZCBiZSBmb3VuZCBmb3IgQ2FzZSBjb25zdHJ1Y3RvciEgQ2FzZSBzY2hlbWEgXCIke3RoaXMuZGF0YS5zY2hlbWF9XCIsIFwiJHt0aGlzLnByZXNldHMuc2NoZW1hc1t0aGlzLmRhdGEuc2NoZW1hXX1cIjsgQ2FzZSBtb2RlbCBcIiR7dGhpcy5kYXRhLm1vZGVsfVwiLCBcIiR7dGhpcy5wcmVzZXRzLm1vZGVsc1t0aGlzLmRhdGEubW9kZWxdfVwiO2ApO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLmxvYWQodGhpcy5tb2RlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9fX19yZXF1ZXN0X19fXyhxdWVyeSkge1xyXG5cclxuICAgICAgICB0aGlzLnJlY2VpdmVyLmdldChxdWVyeSwgbnVsbCwgdGhpcy5VU0VfU0VDVVJFKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5SRVFVRVNUSU5HID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5SRVFVRVNUSU5HID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgKGV4cG9ydHMpIHtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTdWJzKHRoaXMuY2hpbGRyZW4sIGV4cG9ydHMsIHRydWUpO1xyXG5cclxuICAgICAgICBzdXBlci5leHBvcnQoZXhwb3J0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU3VicyhjYXNzZXR0ZXMsIGRhdGEsIElNUE9SVCA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2Fzc2V0dGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgY2Fzc2V0dGUgPSBjYXNzZXR0ZXNbaV07XHJcbiAgICAgICAgICAgIGlmIChjYXNzZXR0ZSBpbnN0YW5jZW9mIENhc2UpXHJcbiAgICAgICAgICAgICAgICBjYXNzZXR0ZS51cGRhdGUoZGF0YSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJfdmFsO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChJTVBPUlQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhc3NldHRlLmRhdGEuaW1wb3J0ICYmIGRhdGFbY2Fzc2V0dGUuZGF0YS5pbXBvcnRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJfdmFsID0gY2Fzc2V0dGUudXBkYXRlKGRhdGEsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJfdmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN1YnMoY2Fzc2V0dGUuY2hpbGRyZW4sIHJfdmFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvKiogXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE92ZXJyaWRpbmcgdGhlIG1vZGVsIGRhdGEgaGFwcGVucyB3aGVuIGEgY2Fzc2V0dGUgcmV0dXJucyBhbiBvYmplY3QgaW5zdGVhZCBvZiB1bmRlZmluZWQuIFRoaXMgaXMgYXNzaWduZWQgdG8gdGhlIFwicl92YWxcIiB2YXJpYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBbnkgY2hpbGQgY2Fzc2V0dGUgb2YgdGhlIHJldHVybmluZyBjYXNzZXR0ZSB3aWxsIGJlIGZlZCBcInJfdmFsXCIgaW5zdGVhZCBvZiBcImRhdGFcIi5cclxuICAgICAgICAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByX3ZhbCA9IGNhc3NldHRlLnVwZGF0ZShkYXRhLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTdWJzKGNhc3NldHRlLmNoaWxkcmVuLCByX3ZhbCB8fCBkYXRhLCBJTVBPUlQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwKGRhdGEpe1xyXG4gICAgICAgIHRoaXMubW9kZWwuYWRkKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkYXRhLCBjaGFuZ2VkX3ZhbHVlcykge1xyXG4gICAgICAgIHRoaXMuX19kb3duX18oZGF0YSwgY2hhbmdlZF92YWx1ZXMpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgaGFuZGxlVXJsVXBkYXRlKHd1cmwpIHtcclxuICAgICAgICBsZXQgcXVlcnlfZGF0YSA9IG51bGw7XHJcbiAgICAgICAgLyogXHJcbiAgICAgICAgICAgIFRoaXMgcGFydCBvZiB0aGUgZnVuY3Rpb24gd2lsbCBpbXBvcnQgZGF0YSBpbnRvIHRoZSBtb2RlbCB0aGF0IGlzIG9idGFpbmVkIGZyb20gdGhlIHF1ZXJ5IHN0cmluZyBcclxuICAgICAgICAqL1xyXG4gICAgICAgIGlmICh3dXJsICYmIHRoaXMuZGF0YS5pbXBvcnQpIHtcclxuICAgICAgICAgICAgcXVlcnlfZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmltcG9ydCA9PSBcIm51bGxcIikge1xyXG4gICAgICAgICAgICAgICAgcXVlcnlfZGF0YSA9IHd1cmwuZ2V0Q2xhc3MoKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHF1ZXJ5X2RhdGEpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbCA9IHRoaXMuZGF0YS5pbXBvcnQuc3BsaXQoXCI7XCIpXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbiA9IGxbaV0uc3BsaXQoXCI6XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2xhc3NfbmFtZSA9IG5bMF07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHAgPSBuWzFdLnNwbGl0KFwiPT5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleV9uYW1lID0gcFswXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW1wb3J0X25hbWUgPSBwWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbGFzc19uYW1lID09IFwicm9vdFwiKSBjbGFzc19uYW1lID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBxdWVyeV9kYXRhW2ltcG9ydF9uYW1lXSA9IHd1cmwuZ2V0KGNsYXNzX25hbWUsIGtleV9uYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHd1cmwgJiYgdGhpcy5kYXRhLnVybCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHF1ZXJ5X2RhdGEgPSB7fTtcclxuICAgICAgICAgICAgaWYgKHRoaXMudXJsX3F1ZXJ5KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbCA9IHRoaXMudXJsX3F1ZXJ5LnNwbGl0KFwiO1wiKVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG4gPSBsW2ldLnNwbGl0KFwiOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2xhc3NfbmFtZSA9IG5bMF07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHAgPSBuWzFdLnNwbGl0KFwiPT5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleV9uYW1lID0gcFswXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW1wb3J0X25hbWUgPSBwWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbGFzc19uYW1lID09IFwicm9vdFwiKSBjbGFzc19uYW1lID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBxdWVyeV9kYXRhW2ltcG9ydF9uYW1lXSA9IHd1cmwuZ2V0KGNsYXNzX25hbWUsIGtleV9uYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fX19fcmVxdWVzdF9fX18ocXVlcnlfZGF0YSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5tb2RlbCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tb2RlbCA9IG5ldyB0aGlzLm1vZGVsX2NvbnN0cnVjdG9yKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0dGVyKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXR0ZXIuc2V0TW9kZWwodGhpcy5tb2RlbCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmFkZFZpZXcodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocXVlcnlfZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMubW9kZWwuYWRkKHF1ZXJ5X2RhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0aGlzLm1vZGVsLmdldCgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSh0aGlzLm1vZGVsLmdldCgpKTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uSW4oaW5kZXggPSAwKSB7XHJcblxyXG4gICAgICAgIGxldCB0cmFuc2l0aW9uX3RpbWUgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVtcGxhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCB0aGlzLnRlbXBsYXRlc1tpXS50cmFuc2l0aW9uSW4oaW5kZXgpKTtcclxuXHJcbiAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCBzdXBlci50cmFuc2l0aW9uSW4oaW5kZXgpKTtcclxuXHJcbiAgICAgICB0aGlzLnVwZGF0ZURpbWVuc2lvbnMoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25fdGltZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBUYWtlcyBhcyBhbiBpbnB1dCBhIGxpc3Qgb2YgdHJhbnNpdGlvbiBvYmplY3RzIHRoYXQgY2FuIGJlIHVzZWRcclxuICAgICovXHJcbiAgICB0cmFuc2l0aW9uT3V0KGluZGV4ID0gMCwgREVTVFJPWSA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGxldCB0cmFuc2l0aW9uX3RpbWUgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVtcGxhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCB0aGlzLnRlbXBsYXRlc1tpXS50cmFuc2l0aW9uT3V0KGluZGV4KSk7XHJcblxyXG4gICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgc3VwZXIudHJhbnNpdGlvbk91dChpbmRleCwgREVTVFJPWSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbl90aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmFsaXplVHJhbnNpdGlvbk91dCgpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnRlbXBsYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW2ldLmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG5cclxuICAgICAgICBzdXBlci5maW5hbGl6ZVRyYW5zaXRpb25PdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBY3RpdmF0aW5nKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudClcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuc2V0QWN0aXZhdGluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWVkRWxlbWVudHMobmFtZWRfZWxlbWVudHMpIHtcclxuICAgICAgICBmb3IgKGxldCBjb21wX25hbWUgaW4gdGhpcy5uYW1lZF9lbGVtZW50cykge1xyXG4gICAgICAgICAgICBuYW1lZF9lbGVtZW50c1tjb21wX25hbWVdID0gdGhpcy5uYW1lZF9lbGVtZW50c1tjb21wX25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQ3VzdG9tQ2FzZSBleHRlbmRzIENhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgZGF0YSA9IHt9LCBwcmVzZXRzID0ge30pIHtcclxuICAgICAgICBzdXBlcihudWxsLCBlbGVtZW50LCBkYXRhLCBwcmVzZXRzKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgQ2FzZSxcclxuICAgIEN1c3RvbUNhc2VcclxufSIsImltcG9ydCB7XHJcbiAgICBDYXNzZXR0ZVxyXG59IGZyb20gXCIuL2Nhc3NldHRlXCJcclxuXHJcbmNsYXNzIEZpbHRlciBleHRlbmRzIENhc3NldHRlIHtcclxuXHRcclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgZWxlbWVudCwgZCwgcCkge1xyXG5cclxuICAgICAgICBzdXBlcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApO1xyXG5cclxuICAgICAgICBwYXJlbnQuZmlsdGVyX2xpc3QucHVzaCgoZGF0YSkgPT4gdGhpcy5maWx0ZXIoZGF0YSkpO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQudXBkYXRlKCk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGF0YSkge1xyXG4gICAgICAgIC8vYXBwbHkgYSBmaWx0ZXIgb2JqZWN0IHRvIHRoZSBwYXJlbnRcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBGaWx0ZXJcclxufSIsImltcG9ydCB7XHJcbiAgICBDYXNlXHJcbn0gZnJvbSBcIi4vY2FzZVwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgRmlsdGVyXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZmlsdGVyXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBUZXJtXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvdGVybVwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgTUNBcnJheSxcclxuICAgIE1vZGVsQ29udGFpbmVyLFxyXG4gICAgTXVsdGlJbmRleGVkQ29udGFpbmVyXHJcbn0gZnJvbSBcIi4uL21vZGVsL21vZGVsX2NvbnRhaW5lclwiXHJcblxyXG5jbGFzcyBDYXNlVGVtcGxhdGUgZXh0ZW5kcyBDYXNlIHtcclxuXHJcbiAgICAvKipcclxuICAgICAgICBDYXNlVGVtcGxhdGUgY29uc3RydWN0b3IuIEJ1aWxkcyBhIENhc2VUZW1wbGF0ZSBvYmplY3QuXHJcbiAgICAqL1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCA9IG51bGwsIGRhdGEsIHByZXNldHMpIHtcclxuXHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBkYXRhLCBwcmVzZXRzKTtcclxuXHJcbiAgICAgICAgdGhpcy5jYXNlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlQ2FzZXMgPSBbXTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZmlsdGVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMudGVybXMgPSBbXTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnJhbmdlID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wX2VsZW1lbnRzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyVXBkYXRlKCkge1xyXG5cclxuICAgICAgICBsZXQgb3V0cHV0ID0gdGhpcy5jYXNlcy5zbGljZSgpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBsID0gdGhpcy5maWx0ZXJzLmxlbmd0aCwgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgb3V0cHV0ID0gdGhpcy5maWx0ZXJzW2ldLmZpbHRlcihvdXRwdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFjdGl2ZUNhc2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmFjdGl2ZUNhc2VzW2ldLmVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvdXRwdXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG91dHB1dFtpXS5lbGVtZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvdXRwdXQubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIG91dHB1dFtpXS50cmFuc2l0aW9uSW4oaSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aXZlQ2FzZXMgPSBvdXRwdXQ7XHJcbiAgICAgICAgLy9Tb3J0IGFuZCBmaWx0ZXIgdGhlIG91dHB1dCB0byBwcmVzZW50IHRoZSByZXN1bHRzIG9uIHNjcmVlbi5cclxuICAgIH1cclxuXHJcbiAgICBjdWxsKG5ld19pdGVtcykge1xyXG5cclxuICAgICAgICBpZiAobmV3X2l0ZW1zLmxlbmd0aCA9PSAwKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2FzZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tpXS5kZXN0cnVjdG9yKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhc2VzLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgZXhpc3RzID0gbmV3IE1hcChuZXdfaXRlbXMubWFwKGUgPT4gW2UsIHRydWVdKSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgb3V0ID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2FzZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgaWYgKCFleGlzdHMuaGFzKHRoaXMuY2FzZXNbaV0ubW9kZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tpXS5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXNlcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGV4aXN0cy5zZXQodGhpcy5jYXNlc1tpXS5tb2RlbCwgZmFsc2UpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGV4aXN0cy5mb3JFYWNoKCh2LCBrLCBtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodikgb3V0LnB1c2goayk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKG91dC5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRlZChvdXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2FkKG1vZGVsKSB7fVxyXG5cclxuICAgIHJlbW92ZWQoaXRlbXMpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gaXRlbXNbaV07XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY2FzZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBDYXNlID0gdGhpcy5jYXNlc1tqXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoQ2FzZS5tb2RlbCA9PSBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXNlcy5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQ2FzZS5kaXNzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmZpbHRlclVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZGVkKGl0ZW1zKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IENhc2UgPSB0aGlzLnRlbXBsYXRlc1swXS5mbGVzaChpdGVtc1tpXSk7XHJcbiAgICAgICAgICAgIENhc2UucGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5jYXNlcy5wdXNoKENhc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5maWx0ZXJVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXZpc2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FjaGUpXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMuY2FjaGUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRUZXJtcygpIHtcclxuXHJcbiAgICAgICAgbGV0IG91dF90ZXJtcyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVybXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICBvdXRfdGVybXMucHVzaCh0aGlzLnRlcm1zW2ldLnRlcm0pO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKG91dF90ZXJtcy5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfdGVybXM7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEsIElNUE9SVCA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEudG9Kc29uKCkpXHJcblxyXG4gICAgICAgIGxldCBjb250YWluZXIgPSBkYXRhLmdldENoYW5nZWQodGhpcy5wcm9wKTtcclxuXHJcbiAgICAgICAgaWYgKElNUE9SVCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IFVQREFURSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnRlcm1zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGVybXNbaV0udXBkYXRlKGRhdGEpKVxyXG4gICAgICAgICAgICAgICAgICAgIFVQREFURSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChVUERBVEUgJiYgdGhpcy5tb2RlbClcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VsbCh0aGlzLmdldCgpKVxyXG5cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5maWx0ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlcnNbaV0udXBkYXRlKGRhdGEpKVxyXG4gICAgICAgICAgICAgICAgICAgIFVQREFURSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpZiAoVVBEQVRFKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJVcGRhdGUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY29udGFpbmVyICYmIChjb250YWluZXIgaW5zdGFuY2VvZiBNb2RlbENvbnRhaW5lciB8fCBjb250YWluZXIuX19fX3NlbGZfX19fKSkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYWNoZSA9IGRhdGE7XHJcblxyXG4gICAgICAgICAgICBsZXQgb3duX2NvbnRhaW5lciA9IGNvbnRhaW5lci5nZXQodGhpcy5nZXRUZXJtcygpLCBudWxsKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvd25fY29udGFpbmVyIGluc3RhbmNlb2YgTW9kZWxDb250YWluZXIpIHtcclxuICAgICAgICAgICAgICAgIG93bl9jb250YWluZXIucGluKCk7XHJcbiAgICAgICAgICAgICAgICBvd25fY29udGFpbmVyLmFkZFZpZXcodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1bGwodGhpcy5nZXQoKSlcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvd25fY29udGFpbmVyIGluc3RhbmNlb2YgTUNBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdWxsKG93bl9jb250YWluZXIpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvd25fY29udGFpbmVyID0gZGF0YS5fX19fc2VsZl9fX18uZGF0YVt0aGlzLnByb3BdXHJcbiAgICAgICAgICAgICAgICBpZiAob3duX2NvbnRhaW5lciBpbnN0YW5jZW9mIE1vZGVsQ29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duX2NvbnRhaW5lci5hZGRWaWV3KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VsbCh0aGlzLmdldCgpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCgpIHtcclxuICAgICAgICBpZiAodGhpcy5tb2RlbCBpbnN0YW5jZW9mIE11bHRpSW5kZXhlZENvbnRhaW5lcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmRhdGEuaW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5ID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgcXVlcnlbaW5kZXhdID0gdGhpcy5nZXRUZXJtcygpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmdldChxdWVyeSlbaW5kZXhdO1xyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5vIGluZGV4IHZhbHVlIHByb3ZpZGVkIGZvciBNdWx0aUluZGV4ZWRDb250YWluZXIhXCIpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHNvdXJjZSA9IHRoaXMubW9kZWwuc291cmNlO1xyXG4gICAgICAgICAgICBsZXQgdGVybXMgPSB0aGlzLmdldFRlcm1zKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLmRlc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWwgPSBzb3VyY2UuZ2V0KHRlcm1zLCBudWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICBtb2RlbC5waW4oKTtcclxuICAgICAgICAgICAgICAgIG1vZGVsLmFkZFZpZXcodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmdldCh0ZXJtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uSW4oZWxlbWVudHMsIHd1cmwpIHtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fdGltZSA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMudGVtcGxhdGVzW2ldLnRyYW5zaXRpb25JbihlbGVtZW50cywgd3VybCkpO1xyXG5cclxuICAgICAgICBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHN1cGVyLnRyYW5zaXRpb25JbigpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25fdGltZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBUYWtlcyBhcyBhbiBpbnB1dCBhIGxpc3Qgb2YgdHJhbnNpdGlvbiBvYmplY3RzIHRoYXQgY2FuIGJlIHVzZWRcclxuICAgICovXHJcbiAgICB0cmFuc2l0aW9uT3V0KHRyYW5zaXRpb25fdGltZSA9IDAsIERFU1RST1kgPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVtcGxhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCB0aGlzLnRlbXBsYXRlc1tpXS50cmFuc2l0aW9uT3V0KCkpO1xyXG5cclxuICAgICAgICBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHN1cGVyLnRyYW5zaXRpb25PdXQodHJhbnNpdGlvbl90aW1lLCBERVNUUk9ZKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uX3RpbWU7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgQ2FzZVRlbXBsYXRlXHJcbn0iLCJpbXBvcnQge1xyXG4gICAgTGV4XHJcbn0gZnJvbSBcIi4uL2NvbW1vblwiXHJcblxyXG5jbGFzcyBJbmRleGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLmxleGVyID0gbmV3IExleChlbGVtZW50LmlubmVySFRNTCk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLnN0YWNrID0gW107XHJcbiAgICAgICAgdGhpcy5zcCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KGluZGV4LCBSRURPID0gZmFsc2UpIHtcclxuICAgICAgICBsZXQgbGV4ID0gdGhpcy5sZXhlcjtcclxuXHJcbiAgICAgICAgaWYgKFJFRE8pIHtcclxuICAgICAgICAgICAgbGV4LnJlc2V0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhY2subGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgdGhpcy5zcCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgICAgICBpZiAoIWxleC50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoUkVETylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoaW5kZXgsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKGxleC50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiPFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZXgucGVlaygpLnRleHQgPT0gXCIvXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gPFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpOyAvLyAvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7IC8vIHRhZ25hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigtLXRoaXMuc3AgPCAwKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5sZW5ndGggPSB0aGlzLnNwICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFja1t0aGlzLnNwXSsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7IC8vIDxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gdGFnbmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAobGV4LnRleHQgIT09IFwiPlwiICYmIGxleC50ZXh0ICE9PSBcIi9cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gYXR0cmliIG5hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZXgudGV4dCA9PSBcIj1cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobGV4Lm5leHQoKSwgbGV4Lm5leHQoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGV4LnRleHQgPT0gXCIvXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCkgLy8gLyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCkgLy8gPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuc3RhY2sucHVzaCgwKSwgdGhpcy5zcCsrKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxleC50ZXh0ID09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxleC50ZXh0ID09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGV4LnRleHQgPT0gXCI6XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxleC50eXBlID09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBudW1iZXIgPSBwYXJzZUludChsZXgudGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVtYmVyID09IGluZGV4KSByZXR1cm4gdGhpcy5nZXRFbGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRFbGVtZW50KCkge1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zcDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LmNoaWxkcmVuW3RoaXMuc3RhY2tbaV1dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxufVxyXG5cclxuLypcclxuICAgIENhc2Ugc2tlbGV0b25cclxuICAgICAgICBNb2RlbCBwb2ludGVyIE9SIHNjaGVtYSBwb2ludGVyXHJcbiAgICAgICAgICAgIElGIHNjaGVtYSwgdGhlbiB0aGUgc2tlbGV0b24gd2lsbCBjcmVhdGUgYSBuZXcgTW9kZWwgd2hlbiBpdCBpcyBjb3BpZWQsIFVOTEVTUyBhIG1vZGVsIGlzIGdpdmVuIHRvIHRoZSBza2VsZXRvbiBjb3B5IENvbnN0cnVjdG9yLiBcclxuICAgICAgICAgICAgT3RoZXIgd2lzZSwgdGhlIHNrZWxldG9uIHdpbGwgYXV0b21hdGljYWxseSBhc3NpZ24gdGhlIE1vZGVsIHRvIHRoZSBjYXNlIG9iamVjdC4gXHJcblxyXG4gICAgICAgIFRoZSBtb2RlbCB3aWxsIGF1dG9tYXRpY2FsbHkgY29weSBpdCdzIGVsZW1lbnQgZGF0YSBpbnRvIHRoZSBjb3B5LCB6aXBwaW5nIHRoZSBkYXRhIGRvd24gYXMgdGhlIENvbnN0cnVjdG9yIGJ1aWxkcyB0aGUgQ2FzZSdzIGNoaWxkcmVuLlxyXG5cclxuKi9cclxuZXhwb3J0IGNsYXNzIENhc2VTa2VsZXRvbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgY29uc3RydWN0b3IsIGRhdGEsIHByZXNldHMsIGluZGV4KSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLkNvbnN0cnVjdG9yID0gY29uc3RydWN0b3I7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0gW107XHJcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy50ZXJtcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5wcmVzZXRzID0gcHJlc2V0cztcclxuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICBcclxuICAgICovXHJcbiAgICBmbGVzaChNb2RlbCA9IG51bGwpIHtcclxuICAgICAgICBsZXQgQ2FzZSA9IHRoaXMuX19fX2NvcHlfX19fKG51bGwsIG51bGwsIG51bGwpO1xyXG5cclxuICAgICAgICBDYXNlLmxvYWQoTW9kZWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gQ2FzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBDb25zdHJ1Y3RzIGEgbmV3IG9iamVjdCwgYXR0YWNoaW5nIHRvIGVsZW1lbnRzIGhvc3RlZCBieSBhIGNhc2UuIElmIHRoZSBjb21wb25lbnQgdG8gY29uc3RydWN0IGlzIGEgQ2FzZSwgdGhlbiB0aGUgXHJcbiAgICAgICAgcGFyZW50X2VsZW1lbnQgZ2V0cyBzd2FwcGVkIG91dCBieSBhIGNsb25lZCBlbGVtZW50IHRoYXQgaXMgaG9zdGVkIGJ5IHRoZSBuZXdseSBjb25zdHJ1Y3RlZCBDYXNlLlxyXG4gICAgKi9cclxuICAgIF9fX19jb3B5X19fXyhwYXJlbnRfZWxlbWVudCwgcGFyZW50LCBpbmRleGVyKSB7XHJcblxyXG4gICAgICAgIGxldCBlbGVtZW50LCBDTEFJTUVEX0VMRU1FTlQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBpbmRleGVyLmdldCh0aGlzLmluZGV4KVxyXG4gICAgICAgICAgICBDTEFJTUVEX0VMRU1FTlQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudCkge1xyXG4gICAgICAgICAgICBwYXJlbnRfZWxlbWVudCA9IHRoaXMuZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50X2VsZW1lbnQucGFyZW50RWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50X2VsZW1lbnQucGFyZW50RWxlbWVudC5yZXBsYWNlTm9kZShwYXJlbnRfZWxlbWVudCwgZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2cocGFyZW50X2VsZW1lbnQuaW5uZXJIVE1MKVxyXG5cclxuICAgICAgICAgICAgaW5kZXhlciA9IG5ldyBJbmRleGVyKHBhcmVudF9lbGVtZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBvdXRfb2JqZWN0O1xyXG4gICAgICAgIGlmICh0aGlzLkNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgIG91dF9vYmplY3QgPSBuZXcgdGhpcy5Db25zdHJ1Y3RvcihwYXJlbnQsIHRoaXMuZGF0YSwgdGhpcy5wcmVzZXRzKTtcclxuICAgICAgICAgICAgaWYgKENMQUlNRURfRUxFTUVOVClcclxuICAgICAgICAgICAgICAgIG91dF9vYmplY3QuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgfSBlbHNlIGlmICghcGFyZW50KSB7XHJcbiAgICAgICAgICAgIG91dF9vYmplY3QgPSB0aGlzLmNoaWxkcmVuWzBdLl9fX19jb3B5X19fXyhwYXJlbnRfZWxlbWVudCwgbnVsbCwgaW5kZXhlcik7XHJcbiAgICAgICAgICAgIG91dF9vYmplY3QuZWxlbWVudCA9IHBhcmVudF9lbGVtZW50O1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0X29iamVjdDtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgb3V0X29iamVjdCA9IHBhcmVudDtcclxuXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLl9fX19jb3B5X19fXyhwYXJlbnRfZWxlbWVudCwgb3V0X29iamVjdCwgaW5kZXhlcik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRlbXBsYXRlcy5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy50ZXJtcy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLnRlcm1zLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICBvdXRfb2JqZWN0LnRlcm1zLnB1c2godGhpcy50ZXJtc1tpXS5fX19fY29weV9fX18ocGFyZW50X2VsZW1lbnQsIG51bGwsIGluZGV4ZXIpKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlcnMubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5maWx0ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICBvdXRfb2JqZWN0LmZpbHRlcnMucHVzaCh0aGlzLmZpbHRlcnNbaV0uX19fX2NvcHlfX19fKHBhcmVudF9lbGVtZW50LCBudWxsLCBpbmRleGVyKSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMudGVtcGxhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgICAgIG91dF9vYmplY3QudGVtcGxhdGVzLnB1c2godGhpcy50ZW1wbGF0ZXNbaV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dF9vYmplY3Q7XHJcbiAgICB9XHJcbn0iLCJsZXQgR0xPQkFMID0gKCgpPT57XHJcblx0bGV0IGxpbmtlciA9IG51bGw7XHJcblx0cmV0dXJuIHtcclxuXHRcdGdldCBsaW5rZXIoKXtcclxuXHRcdFx0cmV0dXJuIGxpbmtlcjtcclxuXHRcdH0sXHJcblx0XHRzZXQgbGlua2VyKGwpe1xyXG5cdFx0XHRpZighbGlua2VyKVxyXG5cdFx0XHRcdGxpbmtlciA9IGw7XHJcblx0XHR9XHJcblx0fVxyXG59KVxyXG5cclxuZXhwb3J0IHtHTE9CQUx9IiwiaW1wb3J0IHtcclxuICAgIENhc3NldHRlXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGVcIlxyXG5cclxuY2xhc3MgSW5wdXQgZXh0ZW5kcyBDYXNzZXR0ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApIHtcclxuICAgICAgICAvL1NjYW4gdGhlIGVsZW1lbnQgYW5kIGxvb2sgZm9yIGlucHV0cyB0aGF0IGNhbiBiZSBtYXBwZWQgdG8gdGhlXHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBlbGVtZW50LCBkLCBwKTtcclxuXHJcbiAgICAgICAgLy9JbnB1dHMgaW4gZm9ybXMgYXJlIGF1dG9tYXRpY2FsbHkgaGlkZGVuLlxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5kaXNwbGF5ID0gXCJub25lXCI7XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHt9XHJcbiAgICAgICAgICAgIGRhdGFbdGhpcy5wcm9wXSA9IHRoaXMuZWxlbWVudC52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5hZGQoZGF0YSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGF0YSkge1xyXG5cclxuICAgICAgICBpZiAoIWRhdGFbdGhpcy5wcm9wXSkgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLnZhbCA9IGRhdGFbdGhpcy5wcm9wXTtcclxuXHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmVsZW1lbnQudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiZGF0ZVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnZhbHVlID0gKG5ldyBEYXRlKHBhcnNlSW50KGRhdGFbdGhpcy5wcm9wXSkpKS50b0lTT1N0cmluZygpLnNwbGl0KFwiVFwiKVswXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidGltZVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnZhbHVlID0gYCR7KFwiMDBcIisoZGF0YVt0aGlzLnByb3BdIHwgMCkpLnNsaWNlKC0yKX06JHsoXCIwMFwiKygoZGF0YVt0aGlzLnByb3BdJTEpKjYwKSkuc2xpY2UoLTIpfTowMC4wMDBgO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0ZXh0XCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudmFsdWUgPSAoZGF0YVt0aGlzLnByb3BdICE9IHVuZGVmaW5lZCkgPyBkYXRhW3RoaXMucHJvcF0gOiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHQgPSB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0WzBdO1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJtb2R1bG9fdGltZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGltZSA9IGRhdGFbdGhpcy5wcm9wXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIElTX1BNID0gKHRpbWUgLyAxMiA+IDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWludXRlcyA9ICgodGltZSAlIDEpICogNjApIHwgMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhvdXJzID0gKCgodGltZSB8IDApICUgMTIpICE9IDApID8gKHRpbWUgfCAwKSAlIDEyIDogMTI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudmFsdWUgPSAoaG91cnMgKyBcIjpcIiArIChcIjBcIiArIG1pbnV0ZXMpLnNsaWNlKC0yKSkgKyAoKElTX1BNKSA/IFwiIFBNXCIgOiBcIiBBTVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC52YWx1ZSA9IChkYXRhW3RoaXMucHJvcF0gIT0gdW5kZWZpbmVkKSA/IGRhdGFbdGhpcy5wcm9wXSA6IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBJbnB1dFxyXG59IiwiaW1wb3J0IHtcclxuICAgIEdMT0JBTFxyXG59IGZyb20gXCIuLi8uLi9nbG9iYWxcIlxyXG5pbXBvcnQge1xyXG4gICAgSW5wdXRcclxufSBmcm9tIFwiLi9pbnB1dFwiXHJcbmltcG9ydCB7XHJcbiAgICBDYXNzZXR0ZVxyXG59IGZyb20gXCIuL2Nhc3NldHRlXCJcclxuXHJcbmNsYXNzIEZvcm0gZXh0ZW5kcyBDYXNzZXR0ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApIHtcclxuICAgICAgICAvL1NjYW4gdGhlIGVsZW1lbnQgYW5kIGxvb2sgZm9yIGlucHV0cyB0aGF0IGNhbiBiZSBtYXBwZWQgdG8gdGhlIFxyXG4gICAgICAgIHN1cGVyKHBhcmVudCwgZWxlbWVudCwgZCwgcCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3VibWl0dGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zY2hlbWEgPSBudWxsO1xyXG5cclxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZS50YXJnZXQsIHRoaXMsIHBhcmVudClcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdWJtaXR0ZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1Ym1pdCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdWJtaXR0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWNjZXB0ZWQocmVzdWx0KSB7XHJcbiAgICAgICAgcmVzdWx0LnRleHQoKS50aGVuKChlKSA9PiB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyXHJcbiAgICAgICAgICAgIEdMT0JBTC5saW5rZXIubG9hZFBhZ2UoXHJcbiAgICAgICAgICAgICAgICBHTE9CQUwubGlua2VyLmxvYWROZXdQYWdlKHJlc3VsdC51cmwsIChuZXcgRE9NUGFyc2VyKCkpLnBhcnNlRnJvbVN0cmluZyhlLCBcInRleHQvaHRtbFwiKSksXHJcbiAgICAgICAgICAgICAgICBmYWxzZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmVqZWN0ZWQocmVzdWx0KSB7XHJcbiAgICAgICAgcmVzdWx0LnRleHQoKS50aGVuKChlKSA9PiB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyXHJcbiAgICAgICAgICAgIEdMT0JBTC5saW5rZXIubG9hZFBhZ2UoXHJcbiAgICAgICAgICAgICAgICBHTE9CQUwubGlua2VyLmxvYWROZXdQYWdlKHJlc3VsdC51cmwsIChuZXcgRE9NUGFyc2VyKCkpLnBhcnNlRnJvbVN0cmluZyhlLCBcInRleHQvaHRtbFwiKSksXHJcbiAgICAgICAgICAgICAgICBmYWxzZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgbG9hZChtb2RlbCkge1xyXG5cclxuICAgICAgICBpZiAobW9kZWwpXHJcbiAgICAgICAgICAgIHRoaXMuc2NoZW1hID0gbW9kZWwuc2NoZW1hO1xyXG5cclxuICAgICAgICBzdXBlci5sb2FkKG1vZGVsKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGF0YSkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdWJtaXQoKSB7XHJcblxyXG4gICAgICAgIGxldCB1cmwgPSB0aGlzLmVsZW1lbnQuYWN0aW9uO1xyXG5cclxuICAgICAgICB2YXIgZm9ybV9kYXRhID0gKG5ldyBGb3JtRGF0YSh0aGlzLmVsZW1lbnQpKTtcclxuICAgICAgICBpZiAodGhpcy5zY2hlbWEpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5jaGlsZHJlbltpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBJbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gY2hpbGQuZWxlbWVudC5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9wID0gY2hpbGQucHJvcDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2NoZW1lID0gdGhpcy5zY2hlbWFbcHJvcF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjaGVtZSAmJiBwcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWwgPSBzY2hlbWUuc3RyaW5nKGNoaWxkLnZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1fZGF0YS5zZXQobmFtZSwgdmFsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwcm9wLCBuYW1lLCB2YWwsIGNoaWxkLnZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZWJ1Z2dlclxyXG4gICAgICAgIGZldGNoKHVybCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxyXG4gICAgICAgICAgICBib2R5OiBmb3JtX2RhdGEsXHJcbiAgICAgICAgfSkudGhlbigocmVzdWx0KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyAhPSAyMDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlamVjdGVkKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuYWNjZXB0ZWQocmVzdWx0KVxyXG5cclxuICAgICAgICB9KS5jYXRjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlamVjdGVkKGUpO1xyXG4gICAgICAgIH0pXHJcblxyXG5cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJXaWNrIEZvcm0gU3VibWl0dGVkXCIsIHVybCwgZm9ybV9kYXRhKVxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBGb3JtXHJcbn0iLCJpbXBvcnQge1xyXG4gICAgUml2ZXRcclxufSBmcm9tIFwiLi4vcml2ZXRcIlxyXG5leHBvcnQgY2xhc3MgVGFwIGV4dGVuZHMgUml2ZXQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgZGF0YSwgcHJlc2V0cykge1xyXG4gICAgICAgIHN1cGVyKHBhcmVudCwgZGF0YSwgcHJlc2V0cyk7XHJcbiAgICAgICAgdGhpcy5wcm9wID0gZGF0YS5wcm9wO1xyXG4gICAgfVxyXG5cclxuICAgIGRvd24oZGF0YSwgY2hhbmdlZF9wcm9wZXJ0aWVzID0gbnVsbCwgaW1wb3J0ZWQpIHtcclxuICAgICAgICBpZiAoY2hhbmdlZF9wcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2hhbmdlZF9wcm9wZXJ0aWVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoYW5nZWRfcHJvcGVydGllc1tpXSA9PSB0aGlzLnByb3ApXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gbCAtIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZGF0YVt0aGlzLnByb3BdICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogZGF0YVt0aGlzLnByb3BdIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgU2VlIERlZmluaXRpb24gaW4gUml2ZXQgXHJcbiAgXHQqL1xyXG4gICAgX19kb3duX18oZGF0YSwgY2hhbmdlZF9wcm9wZXJ0aWVzID0gbnVsbCwgSU1QT1JURUQgPSBmYWxzZSkge1xyXG4gICAgICAgIGxldCByX3ZhbCA9IHRoaXMuZG93bihkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMsIElNUE9SVEVEKTtcclxuICAgICAgICBpZiAocl92YWwpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLl9fZG93bl9fKHJfdmFsLCBbdGhpcy5wcm9wXSwgSU1QT1JURUQpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwKGRhdGEpIHtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEudmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBsZXQgb3V0ID0ge307XHJcbiAgICAgICAgICAgIG91dFt0aGlzLnByb3BdID0gZGF0YS52YWx1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtcclxuICAgIFJpdmV0XHJcbn0gZnJvbSBcIi4uL3JpdmV0XCJcclxuZXhwb3J0IGNsYXNzIFBpcGUgZXh0ZW5kcyBSaXZldCB7XHJcblxyXG4gICAgc3RhdGljIFN0YXRpYyhkYXRhLCBodG1sKSB7XHJcbiAgICAgICAgcmV0dXJuIGA8JHtkYXRhLnRhZ25hbWV9PiR7aHRtbH08LyR7ZGF0YS50YWduYW1lfT5gXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBkYXRhLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBkYXRhLCBwcmVzZXRzKTtcclxuICAgIH1cclxuXHJcbiAgICBkb3duKGRhdGEpe1xyXG4gICAgXHRyZXR1cm4ge3ZhbHVlOmA8Yj4ke2RhdGEudmFsdWV9PC9iPmB9XHJcbiAgICB9XHJcbn1cclxuXHJcblBpcGUuQUREU19UQUdTID0gdHJ1ZTtcclxuUGlwZS5DQU5fQkVfU1RBVElDID0gdHJ1ZTsiLCJpbXBvcnQge1xyXG4gICAgUml2ZXRcclxufSBmcm9tIFwiLi4vcml2ZXRcIlxyXG5cclxuZXhwb3J0IGNsYXNzIElPIGV4dGVuZHMgUml2ZXR7XHJcblx0Y29uc3RydWN0b3IocGFyZW50LCBkYXRhLCBwcmVzZXRzKXtcclxuXHRcdHN1cGVyKHBhcmVudCwgZGF0YSwgcHJlc2V0cylcclxuXHRcdHRoaXMucHJvcCA9IGRhdGEucHJvcFxyXG5cdH1cclxuXHJcblx0ZG93bihkYXRhKXtcclxuXHRcdHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSBkYXRhLnZhbHVlO1xyXG5cdH1cclxufSIsIi8qXHJcbiAgICBCb3JpbmcgQ2FzZSBzdHVmZlxyXG4qL1xyXG5pbXBvcnQge1xyXG4gICAgQ2FzZSxcclxufSBmcm9tIFwiLi9jYXNlXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBDYXNlVGVtcGxhdGVcclxufSBmcm9tIFwiLi9jYXNlX3RlbXBsYXRlXCJcclxuaW1wb3J0IHtcclxuICAgIENhc2VTa2VsZXRvblxyXG59IGZyb20gXCIuL2Nhc2Vfc2tlbGV0b25cIlxyXG4vKiBcclxuICAgIENhc3NldHRlc1xyXG4qL1xyXG5pbXBvcnQge1xyXG4gICAgRmlsdGVyTGltaXRcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9maWx0ZXJfbGltaXRcIlxyXG5pbXBvcnQge1xyXG4gICAgQ2Fzc2V0dGUsXHJcbiAgICBDbG9zZUNhc3NldHRlXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvY2Fzc2V0dGVcIlxyXG5pbXBvcnQge1xyXG4gICAgRm9ybVxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2Zvcm1cIlxyXG5pbXBvcnQge1xyXG4gICAgSW5wdXRcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9pbnB1dFwiXHJcbmltcG9ydCB7XHJcbiAgICBGaWx0ZXJcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9maWx0ZXJcIlxyXG5pbXBvcnQge1xyXG4gICAgVGVybVxyXG59IGZyb20gXCIuL2Nhc3NldHRlL3Rlcm1cIlxyXG5pbXBvcnQge1xyXG4gICAgRXhwb3J0ZXJcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9leHBvcnRlclwiXHJcbmltcG9ydCB7XHJcbiAgICBJbXBvcnRRdWVyeVxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2ltcG9ydF9xdWVyeVwiXHJcbmltcG9ydCB7XHJcbiAgICBEYXRhRWRpdFxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2RhdGFfZWRpdFwiXHJcbmltcG9ydCB7XHJcbiAgICBFeGlzdHMsXHJcbiAgICBOb3RFeGlzdHNcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9leGlzdHNcIlxyXG5pbXBvcnQge1xyXG4gICAgRXBvY2hEYXksXHJcbiAgICBFcG9jaFRpbWUsXHJcbiAgICBFcG9jaERhdGUsXHJcbiAgICBFcG9jaE1vbnRoLFxyXG4gICAgRXBvY2hZZWFyLFxyXG4gICAgRXBvY2hUb0RhdGVUaW1lXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZXBvY2hcIlxyXG5cclxubGV0IFByZXNldENhc3NldHRlcyA9IHtcclxuICAgIHJhdzogQ2Fzc2V0dGUsXHJcbiAgICBjYXNzZXR0ZTogQ2Fzc2V0dGUsXHJcbiAgICBmb3JtOiBGb3JtLFxyXG4gICAgaW5wdXQ6IElucHV0LFxyXG4gICAgZXhwb3J0OiBFeHBvcnRlcixcclxuICAgIGlxdWVyeTogSW1wb3J0UXVlcnksXHJcbiAgICBlZHQ6IEVwb2NoVG9EYXRlVGltZSxcclxuICAgIGV0aW1lOiBFcG9jaFRpbWUsXHJcbiAgICBlZGF5OiBFcG9jaERheSxcclxuICAgIGVkYXRlOiBFcG9jaERhdGUsXHJcbiAgICBleWVhcjogRXBvY2hZZWFyLFxyXG4gICAgZW1vbnRoOiBFcG9jaE1vbnRoLFxyXG4gICAgZXhpc3RzOiBFeGlzdHMsXHJcbiAgICBub3RfZXhpc3RzOiBOb3RFeGlzdHMsXHJcbiAgICBkYXRhX2VkaXQ6IERhdGFFZGl0LFxyXG4gICAgdGVybTogVGVybSxcclxuICAgIGxpbWl0OiBGaWx0ZXJMaW1pdFxyXG59XHJcblxyXG5pbXBvcnQgeyBUYXAgfSBmcm9tIFwiLi90YXBzL3RhcFwiXHJcbmltcG9ydCB7IFBpcGUgfSBmcm9tIFwiLi9waXBlcy9waXBlXCJcclxuaW1wb3J0IHsgSU8gfSBmcm9tIFwiLi9pby9pb1wiXHJcblxyXG5leHBvcnQgY2xhc3MgUm9vdCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmh0bWwgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICB0aGlzLnRhZ19pbmRleCA9IDE7XHJcbiAgICB9O1xyXG5cclxuICAgIGFkZENoaWxkKGNoaWxkKSB7XHJcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdFNrZWxldG9uKHByZXNldHMpIHtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IHRoaXMuaHRtbDtcclxuICAgICAgICBsZXQgcm9vdF9za2VsZXRvbiA9IG5ldyBDYXNlU2tlbGV0b24oZWxlbWVudCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5jb25zdHJ1Y3RTa2VsZXRvbihyb290X3NrZWxldG9uLCBwcmVzZXRzKTtcclxuICAgICAgICByZXR1cm4gcm9vdF9za2VsZXRvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJbmRleCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50YWdfaW5kZXgrKztcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY2hpbGRyZW46IHRoaXMuY2hpbGRyZW4sXHJcbiAgICAgICAgICAgIGh0bWw6IHRoaXMuaHRtbFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvZmZzZXQoaW5jcmVhc2UgPSAwKSB7XHJcbiAgICAgICAgbGV0IG91dCA9IHRoaXMudGFnX2NvdW50O1xyXG4gICAgICAgIHRoaXMudGFnX2NvdW50ICs9IGluY3JlYXNlO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHZW5lcmljTm9kZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudGFnbmFtZSA9IHRhZ25hbWU7XHJcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcyB8fCB7fTtcclxuICAgICAgICB0aGlzLklTX05VTEwgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLkNPTlNVTUVTX1RBRyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5DT05TVU1FU19TQU1FID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMucHJvcF9uYW1lID0gbnVsbDtcclxuICAgICAgICB0aGlzLmh0bWwgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMub3Blbl90YWcgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuY2xvc2VfdGFnID0gXCJcIjtcclxuICAgICAgICB0aGlzLnRhZ19pbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IDA7XHJcbiAgICAgICAgaWYgKHBhcmVudClcclxuICAgICAgICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMpO1xyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIGZpbmFsaXplKGN0eCkge1xyXG4gICAgICAgIGN0eC5odG1sICs9IHRoaXMub3Blbl90YWcgKyB0aGlzLmh0bWwgKyB0aGlzLmNsb3NlX3RhZztcclxuICAgIH1cclxuXHJcbiAgICByZXBsYWNlQ2hpbGQoY2hpbGQsIG5ld19jaGlsZCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW5baV0gPT0gY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0gPSBuZXdfY2hpbGQ7XHJcbiAgICAgICAgICAgICAgICBuZXdfY2hpbGQucGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgICAgIGNoaWxkLnBhcmVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUNoaWxkKGNoaWxkKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGlsZHJlbltpXSA9PSBjaGlsZClcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnNwbGljZShpLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDaGlsZChjaGlsZCkge1xyXG5cclxuICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUYXBOb2RlICYmICEodGhpcyBpbnN0YW5jZW9mIENhc2VOb2RlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuYWRkQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlQXR0cmlidXRlcygpIHtcclxuICAgICAgICBsZXQgb3V0ID0ge307XHJcbiAgICAgICAgb3V0LnByb3AgPSB0aGlzLnByb3BfbmFtZTtcclxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQcm9wKGxleGVyLCBwcm9wX25hbWUsIHBhcnNlRnVuY3Rpb24sIHByZXNldHMpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9wX25hbWUgIT09IHByb3BfbmFtZSlcclxuICAgICAgICAgICAgdGhpcy5zcGxpdChuZXcgSU9Ob2RlKHByb3BfbmFtZSwgdGhpcy5hdHRyaWJ1dGVzLCBudWxsLCB0aGlzLCB0aGlzLmdldEluZGV4KCkpLCBwcm9wX25hbWUpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgbmV3IElPTm9kZShwcm9wX25hbWUsIHRoaXMuYXR0cmlidXRlcywgdGhpcywgdGhpcywgdGhpcy5nZXRJbmRleCgpKTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY2hpbGRyZW46IHRoaXMuY2hpbGRyZW4sXHJcbiAgICAgICAgICAgIHRhZ25hbWU6IHRoaXMudGFnbmFtZSxcclxuICAgICAgICAgICAgdGFnX2NvdW50OiB0aGlzLnRhZ19jb3VudCxcclxuICAgICAgICAgICAgdGFnOiB7IG9wZW5fdGFnOiB0aGlzLm9wZW5fdGFnLCBjbG9zZV90YWc6IHRoaXMuY2xvc2VfdGFnIH0sXHJcbiAgICAgICAgICAgIGh0bWw6IHRoaXMuaHRtbCxcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQobm9kZSwgcHJvcF9uYW1lKSB7XHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvcF9uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcF9uYW1lID09IHRoaXMucHJvcF9uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChub2RlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnRhZ25hbWUsIHRoaXMuYXR0cmlidXRlcywgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgci5DT05TVU1FU19TQU1FID0gKHIuQ09OU1VNRVNfVEFHKSA/ICghKHIuQ09OU1VNRVNfVEFHID0gITEpKSA6ICExO1xyXG4gICAgICAgICAgICAgICAgICAgIHIucHJvcF9uYW1lID0gcHJvcF9uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHIuYWRkQ2hpbGQobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnNwbGl0KHIsIHByb3BfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wX25hbWUgPSBwcm9wX25hbWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5zcGxpdCh0aGlzLCBwcm9wX25hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGVidWdnZXJcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvcF9uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcF9uYW1lID09IHRoaXMucHJvcF9uYW1lKSB7fSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgciA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMudGFnbmFtZSwgdGhpcy5hdHRyaWJ1dGVzLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICByLnByb3BfbmFtZSA9IHByb3BfbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuc3BsaXQociwgcHJvcF9uYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnNwbGl0KHRoaXMsIHByb3BfbmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGdldEluZGV4KCkge1xyXG4gICAgICAgIGlmKHRoaXMudGFnX2luZGV4ID4gMCkgcmV0dXJuIHRoaXMudGFnX2luZGV4Kys7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0SW5kZXgoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RTa2VsZXRvbihwYXJlbnRfc2tlbGV0b24sIHByZXNldHMpIHtcclxuXHJcbiAgICAgICAgbGV0IHNrZWxldG9uID0gdGhpcy5jcmVhdGVTa2VsZXRvbkNvbnN0cnVjdG9yKHByZXNldHMpO1xyXG5cclxuICAgICAgICBwYXJlbnRfc2tlbGV0b24uY2hpbGRyZW4ucHVzaChza2VsZXRvbilcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLmNvbnN0cnVjdFNrZWxldG9uKHNrZWxldG9uLCBwcmVzZXRzKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTa2VsZXRvbkNvbnN0cnVjdG9yKHByZXNldHMpIHtcclxuICAgICAgICBsZXQgc2tlbGV0b24gPSBuZXcgQ2FzZVNrZWxldG9uKHRoaXMuZ2V0RWxlbWVudCgpLCB0aGlzLmdldENvbnN0cnVjdG9yKHByZXNldHMpLCB0aGlzLnBhcnNlQXR0cmlidXRlcygpLCBwcmVzZXRzLCB0aGlzLmluZGV4KTtcclxuICAgICAgICByZXR1cm4gc2tlbGV0b247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RWxlbWVudCgpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENhc2VOb2RlIGV4dGVuZHMgR2VuZXJpY05vZGUge1xyXG4gICAgY29uc3RydWN0b3IodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgIH07XHJcblxyXG4gICAgZmluYWxpemUoY3R4KSB7XHJcbiAgICAgICAgY3R4Lmh0bWwgKz0gdGhpcy5odG1sO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFByb3AobGV4ZXIsIHByb3BfbmFtZSwgcGFyc2VGdW5jdGlvbiwgcHJlc2V0cykge1xyXG4gICAgICAgIGlmIChsZXhlci50ZXh0ID09IFwiKFwiICYmIGxleGVyLnBlZWsoKS50ZXh0ID09IFwiKFwiKSB7XHJcbiAgICAgICAgICAgIGxleGVyLmFzc2VydChcIihcIik7XHJcbiAgICAgICAgICAgIGxleGVyLmFzc2VydChcIihcIik7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IG5ldyBUZW1wbGF0ZU5vZGUoXCJsaXN0XCIsIHRoaXMuYXR0cmlidXRlcywgdGhpcywgdGhpcyk7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlLnBhcnNlKGxleGVyLCBwYXJzZUZ1bmN0aW9uLCBwcmVzZXRzKTtcclxuICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiKVwiKTtcclxuICAgICAgICAgICAgbGV0IG91dCA9IGxleGVyLnBvcyArIDE7XHJcbiAgICAgICAgICAgIGxleGVyLmFzc2VydChcIilcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldENvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHJldHVybiBDYXNlO1xyXG4gICAgfVxyXG5cclxuICAgIHNwbGl0KG5vZGUsIHByb3BfbmFtZSkge1xyXG4gICAgICAgIGlmIChub2RlKSB0aGlzLmFkZENoaWxkKG5vZGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVOb2RlIGV4dGVuZHMgR2VuZXJpY05vZGUge1xyXG4gICAgY29uc3RydWN0b3IodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50LCBjdHgpIHtcclxuICAgICAgICBzdXBlcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLmdldEluZGV4KCk7XHJcbiAgICAgICAgY3R4Lmh0bWwgKz0gYDxsaXN0PiMjOiR7dGhpcy5pbmRleH08L2xpc3Q+YFxyXG4gICAgICAgIHRoaXMuZmlsdGVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMudGVybXMgPSBbXTtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IFtdO1xyXG4gICAgfTtcclxuXHJcbiAgICBhZGRDaGlsZChjaGlsZCkge1xyXG4gICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIEZpbHRlck5vZGUpXHJcbiAgICAgICAgICAgIHRoaXMuZmlsdGVycy5wdXNoKGNoaWxkKTtcclxuICAgICAgICBlbHNlIGlmIChjaGlsZCBpbnN0YW5jZW9mIFRlcm1Ob2RlKVxyXG4gICAgICAgICAgICB0aGlzLnRlcm1zLnB1c2goY2hpbGQpO1xyXG4gICAgICAgIGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgQ2FzZU5vZGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGVtcGxhdGVzLmxlbmd0aCA+IDApIHRocm93IG5ldyBFcnJvcihcIk9ubHkgb25lIENhc2UgYWxsb3dlZCBpbiBhIFRlbXBsYXRlLlwiKTtcclxuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXMucHVzaChjaGlsZCk7XHJcbiAgICAgICAgICAgIGNoaWxkLnRhZ19pbmRleCA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMuaHRtbCA9IGNoaWxkLmh0bWw7XHJcbiAgICAgICAgfSBlbHNlIHRocm93IG5ldyBFcnJvcihcIlRlbXBsYXRlcyBvbmx5IHN1cHBvcnQgRmlsdGVyLCBUZXJtIG9yIENhc2UgZWxlbWVudHMuXCIpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0U2tlbGV0b24ocGFyZW50X3NrZWxldG9uLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy5odG1sO1xyXG4gICAgICAgIGxldCBza2VsZXRvbiA9IG5ldyBDYXNlU2tlbGV0b24odGhpcy5nZXRFbGVtZW50KCksIENhc2VUZW1wbGF0ZSwgdGhpcy5wYXJzZUF0dHJpYnV0ZXMoKSwgcHJlc2V0cywgdGhpcy5pbmRleCk7XHJcbiAgICAgICAgc2tlbGV0b24uZmlsdGVycyA9IHRoaXMuZmlsdGVycy5tYXAoKGZpbHRlcikgPT4gZmlsdGVyLmNyZWF0ZVNrZWxldG9uQ29uc3RydWN0b3IocHJlc2V0cykpXHJcbiAgICAgICAgc2tlbGV0b24udGVybXMgPSB0aGlzLnRlcm1zLm1hcCgodGVybSkgPT4gdGVybS5jcmVhdGVTa2VsZXRvbkNvbnN0cnVjdG9yKHByZXNldHMpKVxyXG4gICAgICAgIHNrZWxldG9uLnRlbXBsYXRlcyA9IHRoaXMudGVtcGxhdGVzLm1hcCgodGVtcGxhdGUpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNrbCA9IHRlbXBsYXRlLmNyZWF0ZVNrZWxldG9uQ29uc3RydWN0b3IocHJlc2V0cyk7XHJcbiAgICAgICAgICAgIHNrbC5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgICAgcmV0dXJuIHNrbDtcclxuICAgICAgICB9KVxyXG4gICAgICAgIHBhcmVudF9za2VsZXRvbi5jaGlsZHJlbi5wdXNoKHNrZWxldG9uKVxyXG4gICAgfVxyXG5cclxuICAgIGdldEVsZW1lbnQoKSB7XHJcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaXN0XCIpO1xyXG4gICAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUHJvcChsZXhlciwgcHJvcF9uYW1lLCBwYXJzZUZ1bmN0aW9uLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgLy9jdHguaHRtbCArPSBwcm9wX25hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2UobGV4ZXIsIHBhcnNlRnVuY3Rpb24sIHByZXNldHMpIHtcclxuICAgICAgICBsZXQgY3R4ID0geyBodG1sOiBcIlwiIH07XHJcbiAgICAgICAgbGV0IHJvb3QgPSBuZXcgUm9vdCgpO1xyXG4gICAgICAgIHdoaWxlIChsZXhlci50ZXh0ICE9PSBcIilcIiAmJiBsZXhlci5wZWVrKCkudGV4dCAhPT0gXCIpXCIpIHtcclxuICAgICAgICAgICAgaWYgKCFsZXhlci50ZXh0KSB0aHJvdyBuZXcgRXJyb3IoXCJVbmV4cGVjdGVkIGVuZCBvZiBPdXRwdXQuIE1pc3NpbmcgJykpJyBcIik7XHJcbiAgICAgICAgICAgIGxldCBvdXQgPSBwYXJzZUZ1bmN0aW9uKGxleGVyLCB0aGlzLCBwcmVzZXRzKTtcclxuICAgICAgICAgICAgaWYgKG91dCBpbnN0YW5jZW9mIENhc2VOb2RlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5odG1sID0gb3V0Lmh0bWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNwbGl0KG5vZGUsIHByb3BfbmFtZSkge1xyXG5cclxuICAgICAgICBpZiAobm9kZSlcclxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChub2RlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFnX2NvdW50O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGFwTm9kZSBleHRlbmRzIEdlbmVyaWNOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCkge1xyXG4gICAgICAgIHN1cGVyKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGZpbmFsaXplKGN0eCkge1xyXG4gICAgICAgIGN0eC5odG1sICs9IHRoaXMuaHRtbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDb25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcbiAgICAgICAgcmV0dXJuIFRhcDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBGaWx0ZXJOb2RlIGV4dGVuZHMgR2VuZXJpY05vZGUge1xyXG4gICAgY29uc3RydWN0b3IodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgICAgICB0aGlzLkNPTlNVTUVTX1RBRyA9IGZhbHNlO1xyXG4gICAgfTtcclxuXHJcbiAgICBmaW5hbGl6ZShjdHgpIHt9XHJcblxyXG4gICAgZ2V0Q29uc3RydWN0b3IocHJlc2V0cykge1xyXG4gICAgICAgIHJldHVybiBUYXA7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUHJvcChsZXhlciwgcHJvcF9uYW1lLCBwYXJzZUZ1bmN0aW9uLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnByb3AgPSBwcm9wX25hbWU7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVGVybU5vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpIHtcclxuICAgICAgICBzdXBlcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmaW5hbGl6ZShjdHgpIHt9XHJcblxyXG4gICAgZ2V0Q29uc3RydWN0b3IocHJlc2V0cykge1xyXG4gICAgICAgIHJldHVybiBUYXA7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUHJvcChsZXhlciwgcHJvcF9uYW1lLCBwYXJzZUZ1bmN0aW9uLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnByb3AgPSBwcm9wX25hbWU7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFBpcGVOb2RlIGV4dGVuZHMgR2VuZXJpY05vZGUge1xyXG4gICAgY29uc3RydWN0b3IodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgIH07XHJcblxyXG4gICAgZmluYWxpemUoY3R4LCBwcmVzZXRzKSB7XHJcbiAgICAgICAgY3R4Lmh0bWwgKz0gdGhpcy5odG1sO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbnN0cnVjdG9yKHByZXNldHMsIGZpbmFsaXppbmcgPSBmYWxzZSkge1xyXG4gICAgICAgIGxldCBjb25zdHJ1Y3RvciA9IFBpcGU7XHJcbiAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHNwbGl0KG5vZGUsIHByb3BfbmFtZSkge1xyXG4gICAgICAgIGlmICghKHRoaXMucGFyZW50IGluc3RhbmNlb2YgUGlwZU5vZGUpICYmXHJcbiAgICAgICAgICAgICEodGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBUYXBOb2RlKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICAvL05lZWQgYSBUYXBOb2RlIHRvIGNvbXBsZXRlIHRoZSBwaXBlbGluZVxyXG4gICAgICAgICAgICBsZXQgdGFwID0gbmV3IFRhcE5vZGUoXCJcIiwge30sIG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMucHJvcF9uYW1lID0gdGhpcy5wcm9wX25hbWU7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LnJlcGxhY2VDaGlsZCh0aGlzLCB0YXApO1xyXG4gICAgICAgICAgICB0YXAuYWRkQ2hpbGQodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdXBlci5zcGxpdChub2RlLCBwcm9wX25hbWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSU9Ob2RlIGV4dGVuZHMgR2VuZXJpY05vZGUge1xyXG4gICAgY29uc3RydWN0b3IocHJvcF9uYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQsIGN0eCwgaW5kZXgpIHtcclxuICAgICAgICBzdXBlcihcIlwiLCBudWxsLCBwYXJlbnQpO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgICAgICBjb25zb2xlLmxvZyhpbmRleClcclxuICAgICAgICBjdHguaHRtbCArPSBgPGlvIHByb3A9XCIke3Byb3BfbmFtZX1cIj4jIzoke2luZGV4fTwvaW8+YFxyXG4gICAgICAgIHRoaXMucHJvcF9uYW1lID0gcHJvcF9uYW1lO1xyXG4gICAgICAgIHRoaXMuQ09OU1VNRVNfVEFHID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgZ2V0Q29uc3RydWN0b3IocHJlc2V0cykge1xyXG4gICAgICAgIHJldHVybiBJTztcclxuICAgIH1cclxufSIsImltcG9ydCB7XHJcbiAgICBMZXhcclxufSBmcm9tIFwiLi4vY29tbW9uXCJcclxuXHJcbmltcG9ydCAqIGFzIEFTVCBmcm9tIFwiLi9jYXNlX2NvbnN0cnVjdG9yX2FzdFwiXHJcblxyXG4vKlxyXG4gICAgVGhpcyBmdW5jdGlvbidzIHJvbGUgaXMgdG8gY29uc3RydWN0IGEgY2FzZSBza2VsZXRvbiBnaXZlbiBhIHRlbXBsYXRlLCBhIGxpc3Qgb2YgcHJlc2V0cywgYW5kIFxyXG4gICAgYW5kIG9wdGlvbmFsbHkgYSB3b3JraW5nIERPTS4gVGhpcyB3aWxsIHJldHVybiBDYXNlIFNrZWxldG9uIHRoYXQgY2FuIGJlIGNsb25lZCBpbnRvIGEgbmV3IENhc2Ugb2JqZWN0LiBcclxuXHJcbiAgICBAcGFyYW0ge0hUTUxFbGVtZW50fSBUZW1wbGF0ZVxyXG4gICAgQHBhcmFtIHtQcmVzZXRzfSBwcmVzZXRzIFxyXG4gICAgQHBhcmFtIHtET01FbGVtZW50fSBXT1JLSU5HX0RPTVxyXG4qL1xyXG5leHBvcnQgZnVuY3Rpb24gQ2FzZUNvbnN0cnVjdG9yKFRlbXBsYXRlLCBQcmVzZXRzLCBXT1JLSU5HX0RPTSkge1xyXG5cclxuICAgIGxldCBza2VsZXRvbjtcclxuXHJcbiAgICBpZiAoIVRlbXBsYXRlKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgIGlmIChUZW1wbGF0ZS5za2VsZXRvbilcclxuICAgICAgICByZXR1cm4gVGVtcGxhdGUuc2tlbGV0b247XHJcblxyXG5cclxuICAgIC8vVEVtcGxhdGUgRmlsdHJhdGlvbiBoYW5kbGVkIGhlcmUuXHJcbiAgICAvL0ltcG9ydCB0aGUgXHJcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmltcG9ydE5vZGUoVGVtcGxhdGUsIHRydWUpO1xyXG5cclxuICAgIHNrZWxldG9uID0gQ29tcG9uZW50Q29uc3RydWN0b3IoZWxlbWVudCwgUHJlc2V0cywgV09SS0lOR19ET00pO1xyXG5cclxuICAgIGlmICghc2tlbGV0b24pXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgVGVtcGxhdGUuc2tlbGV0b24gPSAoKHNrZWxldG9uKSA9PiAobW9kZWwpID0+IHNrZWxldG9uLmZsZXNoKG1vZGVsKSkoc2tlbGV0b24pO1xyXG5cclxuICAgIHJldHVybiBUZW1wbGF0ZS5za2VsZXRvbjtcclxufVxyXG5cclxuZnVuY3Rpb24gUmVwbGFjZVRlbXBsYXRlV2l0aEVsZW1lbnQoVGVtcGxhdGUpIHtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIENvbXBvbmVudENvbnN0cnVjdG9yKGVsZW1lbnQsIHByZXNldHMsIFdPUktJTkdfRE9NKSB7XHJcbiAgICBsZXQgYXR0cmlidXRlcyA9IFtdO1xyXG4gICAgbGV0IHByb3BzID0gW107XHJcblxyXG4gICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PT0gXCJURU1QTEFURVwiKSB7XHJcbiAgICAgICAgbGV0IGNvbXBvbmVudF9uYW1lID0gZWxlbWVudC5pZDtcclxuICAgICAgICBsZXQgaW5wdXQgPSBlbGVtZW50LmlubmVySFRNTDtcclxuICAgICAgICBsZXQgbGV4ZXIgPSBMZXgoaW5wdXQpO1xyXG5cclxuICAgICAgICAvL01ha2Ugc3VyZSB3ZSBhcmUgc3RhcnRpbmcgd2l0aCBhIGNhc2Ugb2JqZWN0LiBcclxuXHJcbiAgICAgICAgaWYgKGxleGVyLnRleHQgPT0gXCI8XCIpIHtcclxuICAgICAgICAgICAgLy9vZmYgdG8gYSBnb29kIHN0YXJ0XHJcbiAgICAgICAgICAgIGxldCByb290ID0gbmV3IEFTVC5Sb290KCk7XHJcbiAgICAgICAgICAgIFBhcnNlVGFnKGxleGVyLCByb290LCBwcmVzZXRzKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocm9vdClcclxuICAgICAgICAgICAgcmV0dXJuIHJvb3QuY29uc3RydWN0U2tlbGV0b24ocHJlc2V0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gICAgSGFuZGxlcyB0aGUgc2VsZWN0aW9uIG9mIEFTVCBub2RlcyBiYXNlZCBvbiB0YWduYW1lO1xyXG4gICAgXHJcbiAgICBAcGFyYW0ge0xleGVyfSBsZXhlciAtIFRoZSBsZXhpY2FsIHBhcnNlciBcclxuICAgIEBwYXJhbSB7U3RyaW5nfSB0YWduYW1lIC0gVGhlIGVsZW1lbnRzIHRhZ25hbWVcclxuICAgIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVzIC0gXHJcbiAgICBAcGFyYW0ge09iamVjdH0gY3R4XHJcbiAgICBAcGFyYW0ge0NDQXN0Tm9kZX0gcGFyZW50XHJcbiovXHJcbmZ1bmN0aW9uIERpc3BhdGNoKGxleGVyLCB0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpIHtcclxuICAgIGxldCBhc3Q7XHJcbiAgICBzd2l0Y2ggKHRhZ25hbWUpIHtcclxuICAgICAgICAvKiBUYXBzICovXHJcbiAgICAgICAgY2FzZSBcIndcIjpcclxuICAgICAgICBjYXNlIFwidy1hXCI6XHJcbiAgICAgICAgY2FzZSBcIndfYVwiOlxyXG4gICAgICAgICAgICBhc3QgPSBuZXcgQVNULlRhcE5vZGUodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFzdDtcclxuICAgICAgICBjYXNlIFwidy1maWx0ZXJcIjpcclxuICAgICAgICAgICAgYXN0ID0gbmV3IEFTVC5GaWx0ZXJOb2RlKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBhc3Q7XHJcbiAgICAgICAgY2FzZSBcInctdGVybVwiOlxyXG4gICAgICAgICAgICBhc3QgPSBuZXcgQVNULlRlcm1Ob2RlKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBhc3Q7XHJcbiAgICAgICAgY2FzZSBcInctY1wiOlxyXG4gICAgICAgIGNhc2UgXCJ3X2NcIjpcclxuICAgICAgICBjYXNlIFwidy1jYXNlXCI6XHJcbiAgICAgICAgY2FzZSBcIndfY2FzZVwiOlxyXG4gICAgICAgICAgICBhc3QgPSBuZXcgQVNULkNhc2VOb2RlKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBhc3Q7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgaWYgKHRhZ25hbWVbMF0gPT0gXCJ3XCIpIHtcclxuICAgICAgICAgICAgICAgIGFzdCA9IG5ldyBBU1QuUGlwZU5vZGUodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhc3Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBhc3QgPSBuZXcgQVNULkdlbmVyaWNOb2RlKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICByZXR1cm4gYXN0O1xyXG59XHJcblxyXG4vKipcclxuICAgIEhhbmRsZXMgdGhlIHBhcnNpbmcgb2YgSFRNTCB0YWdzIGFuZCBjb250ZW50XHJcbiAgICBAcGFyYW0ge1N0cmluZ30gdGFnbmFtZVxyXG4gICAgQHBhcmFtIHtPYmplY3R9IGN0eFxyXG4gICAgQHBhcmFtIHtDQ0FzdE5vZGV9IHBhcmVudFxyXG4qL1xyXG5mdW5jdGlvbiBQYXJzZVRhZyhsZXhlciwgcGFyZW50LCBwcmVzZXRzKSB7XHJcbiAgICBsZXQgc3RhcnQgPSBsZXhlci5wb3M7XHJcbiAgICBsZXQgYXR0cmlidXRlcyA9IHt9O1xyXG4gICAgXHJcbiAgICBsZXhlci5hc3NlcnQoXCI8XCIpXHJcbiAgICBcclxuICAgIGxldCB0YWduYW1lID0gbGV4ZXIudGV4dDtcclxuICAgIFxyXG4gICAgaWYgKGxleGVyLnR5cGUgPT0gXCJpZGVudGlmaWVyXCIpIHtcclxuICAgICAgICBsZXhlci5uZXh0KCk7XHJcbiAgICAgICAgR2V0QXR0cmlidXRlcyhsZXhlciwgYXR0cmlidXRlcyk7XHJcbiAgICB9IGVsc2UgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCB0YWctbmFtZSBpZGVudGlmaWVyLCBnb3QgJHtsZXhlci50ZXh0fWApO1xyXG5cclxuICAgIGxldCBlbGUgPSBEaXNwYXRjaChsZXhlciwgdGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuXHJcbiAgICBlbGUub3Blbl90YWcgKz0gbGV4ZXIuc2xpY2Uoc3RhcnQpO1xyXG5cclxuICAgIHN0YXJ0ID0gbGV4ZXIudG9rZW4ucG9zO1xyXG5cclxuICAgIHdoaWxlICh0cnVlKSB7XHJcblxyXG4gICAgICAgIGlmICghbGV4ZXIudGV4dClcclxuICAgICAgICAgICAgdGhyb3cgKFwiVW5leHBlY3RlZCBlbmQgb2Ygb3V0cHV0XCIpO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGxleGVyLnRleHQpIHtcclxuICAgICAgICAgICAgY2FzZSBcIjxcIjpcclxuICAgICAgICAgICAgICAgIGlmIChsZXhlci5wZWVrKCkudGV4dCA9PSBcIi9cIikge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBlbGUuaHRtbCArPSBsZXhlci5zbGljZShzdGFydCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gbGV4ZXIucG9zO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL1Nob3VsZCBiZSBjbG9zaW5nIGl0J3Mgb3duIHRhZy5cclxuICAgICAgICAgICAgICAgICAgICBsZXhlci5hc3NlcnQoXCI8XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxleGVyLmFzc2VydChcIi9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KHRhZ25hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgb3V0ID0gbGV4ZXIucG9zICsgMTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXhlci5hc3NlcnQoXCI+XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBlbGUuY2xvc2VfdGFnID0gbGV4ZXIuc2xpY2Uoc3RhcnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBlbGUuZmluYWxpemUocGFyZW50IHx8IHtodG1sOlwiXCJ9LCBwcmVzZXRzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gUGFyc2VUYWcobGV4ZXIsIGVsZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIltcIjpcclxuICAgICAgICAgICAgICAgIGVsZS5odG1sICs9IGxleGVyLnNsaWNlKHN0YXJ0KTtcclxuICAgICAgICAgICAgICAgIGxleGVyLm5leHQoKVxyXG4gICAgICAgICAgICAgICAgbGV0IHByb3BfbmFtZSA9IGxleGVyLnRleHQ7XHJcbiAgICAgICAgICAgICAgICBsZXhlci5uZXh0KClcclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gbGV4ZXIucG9zICsgMTtcclxuICAgICAgICAgICAgICAgIGxleGVyLmFzc2VydChcIl1cIik7XHJcbiAgICAgICAgICAgICAgICBzdGFydCA9IGVsZS5hZGRQcm9wKGxleGVyLCBwcm9wX25hbWUsIFBhcnNlVGFnLCBwcmVzZXRzKSB8fCBzdGFydDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgbGV4ZXIubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICAgIFJldHVybnMgYWxsIGF0dHJpYnV0ZXMgaW4gYW4gZWxlbWVudCBhcyBhIGtleS12YWx1ZSBvYmplY3QuXHJcblxyXG4gICAgQHBhcmFtIHtMZXhlcn0gbGV4ZXIgLSBUaGUgbGV4aWNhbCBwYXJzZXIgIFxyXG4gICAgQHBhcmFtIHtPYmplY3R9IGF0dGlicyAtIEFuIG9iamVjdCB3aGljaCB3aWxsIHJlY2VpdmUgdGhlIGF0dHJpYnV0ZSBrZXlzIGFuZCB2YWx1ZXMuIFxyXG4qL1xyXG5mdW5jdGlvbiBHZXRBdHRyaWJ1dGVzKGxleGVyLCBhdHRyaWJzKSB7XHJcbiAgICB3aGlsZSAobGV4ZXIudGV4dCAhPT0gXCI+XCIgJiYgbGV4ZXIudGV4dCAhPT0gXCIvXCIpIHtcclxuICAgICAgICBpZiAoIWxleGVyLnRleHQpIHRocm93IEVycm9yKFwiVW5leHBlY3RlZCBlbmQgb2YgaW5wdXQuXCIpO1xyXG4gICAgICAgIGxldCBhdHRyaWJfbmFtZSA9IGxleGVyLnRleHQ7XHJcbiAgICAgICAgbGV0IGF0dHJpYl92YWwgPSBudWxsO1xyXG4gICAgICAgIGxleGVyLm5leHQoKTtcclxuICAgICAgICBpZiAobGV4ZXIudGV4dCA9PSBcIj1cIikge1xyXG4gICAgICAgICAgICBsZXhlci5uZXh0KCk7XHJcbiAgICAgICAgICAgIGlmIChsZXhlci50b2tlbi50eXBlID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYl92YWwgPSBsZXhlci50ZXh0LnNsaWNlKDEsIC0xKTtcclxuICAgICAgICAgICAgICAgIGxleGVyLm5leHQoKTtcclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RpbmcgYXR0cmlidXRlIGRlZmluaXRpb24uXCIpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgYXR0cmlic1thdHRyaWJfbmFtZV0gPSBhdHRyaWJfdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChsZXhlci50ZXh0ID09IFwiL1wiKSAvLyBWb2lkIE5vZGVzXHJcbiAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiL1wiKTtcclxuICAgIGxleGVyLmFzc2VydChcIj5cIik7XHJcbn0iLCJpbXBvcnQge1xyXG4gICAgc2V0TGlua3NcclxufSBmcm9tIFwiLi9zZXRsaW5rc1wiXHJcbmltcG9ydCB7XHJcbiAgICBUcmFuc2Zvcm1Ub1xyXG59IGZyb20gXCIuLi9hbmltYXRpb24vYW5pbWF0aW9uXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBCYXNpY0Nhc2UsXHJcbiAgICBGYWlsZWRDYXNlXHJcbn0gZnJvbSBcIi4vY29tcG9uZW50XCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBDYXNlQ29uc3RydWN0b3JcclxufSBmcm9tIFwiLi4vY2FzZS9jYXNlX2NvbnN0cnVjdG9yXCJcclxuXHJcbi8qKlxyXG4gICAgVGhlIG1haW4gY29udGFpbmVyIG9mIENhc2VzLiBSZXByZXNlbnRzIGFuIGFyZWEgb2YgaW50ZXJlc3Qgb24gdGhlIGNsaWVudCB2aWV3LlxyXG4qL1xyXG5jbGFzcyBFbGVtZW50IHtcclxuICAgIC8qKlxyXG4gICAgIFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IChlbGVtZW50LmNsYXNzTGlzdCkgPyBlbGVtZW50LmNsYXNzTGlzdFswXSA6IGVsZW1lbnQuaWQ7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gW107XHJcbiAgICAgICAgdGhpcy5idWJibGVkX2VsZW1lbnRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLndyYXBzID0gW107XHJcblxyXG4gICAgICAgIC8vVGhlIG9yaWdpbmFsIGVsZW1lbnQgY29udGFpbmVyLlxyXG4gICAgICAgIC8vdGhpcy5wYXJlbnRfZWxlbWVudCA9IHBhcmVudF9lbGVtZW50O1xyXG5cclxuICAgICAgICAvL0NvbnRlbnQgdGhhdCBpcyB3cmFwcGVkIGluIGFuIGVsZV93cmFwXHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdW5sb2FkQ29tcG9uZW50cygpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzW2ldLkxPQURFRCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25PdXQoKSB7XHJcblxyXG4gICAgICAgIGxldCB0ID0gMDtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudC5MT0FERUQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQucGFyZW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICB0ID0gTWF0aC5tYXgoY29tcG9uZW50LnRyYW5zaXRpb25PdXQoKSwgdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuXHJcbiAgICBmaW5hbGl6ZSgpIHtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudC5MT0FERUQgJiYgY29tcG9uZW50LnBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5maW5hbGl6ZVRyYW5zaXRpb25PdXQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud3JhcHNbaV0ucmVtb3ZlQ2hpbGQoY29tcG9uZW50LmVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb21wb25lbnQuTE9BREVEID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvYWRDb21wb25lbnRzKHd1cmwpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbaV07XHJcblxyXG4gICAgICAgICAgICBjb21wb25lbnQucGFyZW50ID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuZWxlbWVudC5wYXJlbnRFbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChjb21wb25lbnQuZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndyYXBzW2ldLmFwcGVuZENoaWxkKGNvbXBvbmVudC5lbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5oYW5kbGVVcmxVcGRhdGUod3VybCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHNbaV0uTE9BREVEID0gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25JbigpIHtcclxuXHJcbiAgICAgICAgLy8gVGhpcyBpcyB0byBmb3JjZSBhIGRvY3VtZW50IHJlcGFpbnQsIHdoaWNoIHNob3VsZCBjYXVzZSBhbGwgZWxlbWVudHMgdG8gcmVwb3J0IGNvcnJlY3QgcG9zaXRpb25pbmcgaGVyZWFmdGVyXHJcblxyXG4gICAgICAgIGxldCB0ID0gdGhpcy5lbGVtZW50LnN0eWxlLnRvcDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gdDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC50cmFuc2l0aW9uSW4oKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJ1YmJsZUxpbmsobGlua191cmwsIGNoaWxkLCB0cnNfZWxlID0ge30pIHtcclxuXHJcbiAgICAgICAgdGhpcy5idWJibGVkX2VsZW1lbnRzID0gdHJzX2VsZTtcclxuXHJcbiAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiaWdub3JlZCB0aXRsZVwiLCBsaW5rX3VybCk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VHJhbnNmb3JtVG8odHJhbnNpdGlvbnMpIHtcclxuICAgICAgICBpZiAodHJhbnNpdGlvbnMpIHtcclxuICAgICAgICAgICAgbGV0IG93bl9lbGVtZW50cyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5nZXROYW1lZEVsZW1lbnRzKG93bl9lbGVtZW50cyk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIG93bl9lbGVtZW50cykge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbnNbbmFtZV0gPSBUcmFuc2Zvcm1Ubyhvd25fZWxlbWVudHNbbmFtZV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldFRyYW5zZm9ybVRvKHRyYW5zaXRpb25zKSB7XHJcbiAgICAgICAgaWYgKHRyYW5zaXRpb25zKSB7XHJcbiAgICAgICAgICAgIGxldCBvd25fZWxlbWVudHMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0TmFtZWRFbGVtZW50cyhvd25fZWxlbWVudHMpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gb3duX2VsZW1lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdG8sIGZyb20gPSB0cmFuc2l0aW9uc1tuYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmICgodG8gPSBvd25fZWxlbWVudHNbbmFtZV0pICYmIGZyb20pIHtcclxuICAgICAgICAgICAgICAgICAgICBmcm9tKHRvLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZWRFbGVtZW50cyhuYW1lZF9lbGVtZW50cykge1xyXG4gICAgICAgIGlmICh0aGlzLmJ1YmJsZWRfZWxlbWVudHMpIHtcclxuICAgICAgICAgICAgbGV0IHQgPSB0aGlzLmJ1YmJsZWRfZWxlbWVudHM7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCB0IGluIHRoaXMuYnViYmxlZF9lbGVtZW50cylcclxuICAgICAgICAgICAgICAgIG5hbWVkX2VsZW1lbnRzW3RdID0gdGhpcy5idWJibGVkX2VsZW1lbnRzW3RdO1xyXG5cclxuICAgICAgICAgICAgLy90aGlzLmJ1YmJsZWRfZWxlbWVudHMgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNoaWxkcmVuID0gdGhpcy5lbGVtZW50LmNoaWxkcmVuO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNoaWxkLmRhdGFzZXQudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgbmFtZWRfZWxlbWVudHNbY2hpbGQuZGF0YXNldC50cmFuc2l0aW9uXSA9IGNoaWxkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW2ldO1xyXG4gICAgICAgICAgICBjb21wb25lbnQuZ2V0TmFtZWRFbGVtZW50cyhuYW1lZF9lbGVtZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldENvbXBvbmVudHMoQXBwX0NvbXBvbmVudHMsIE1vZGVsX0NvbnN0cnVjdG9ycywgQ29tcG9uZW50X0NvbnN0cnVjdG9ycywgcHJlc2V0cywgRE9NLCB3dXJsKSB7XHJcbiAgICAgICAgLy9pZiB0aGVyZSBpcyBhIGNvbXBvbmVudCBpbnNpZGUgdGhlIGVsZW1lbnQsIHJlZ2lzdGVyIHRoYXQgY29tcG9uZW50IGlmIGl0IGhhcyBub3QgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWRcclxuICAgICAgICB2YXIgY29tcG9uZW50cyA9IEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbCh0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJjb21wb25lbnRcIiksIChhKSA9PiBhKTtcclxuXHJcbiAgICAgICAgc2V0TGlua3ModGhpcy5lbGVtZW50LCAoaHJlZiwgZSkgPT4ge1xyXG4gICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJpZ25vcmVkIHRpdGxlXCIsIGhyZWYpO1xyXG4gICAgICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAoY29tcG9uZW50cy5sZW5ndGggPCAxKSB7XHJcbiAgICAgICAgICAgIC8vQ3JlYXRlIGEgd3JhcHBlZCBjb21wb25lbnQgZm9yIHRoZSBlbGVtZW50cyBpbnNpZGUgdGhlIDxlbGVtZW50PlxyXG4gICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgY29tcG9uZW50LmNsYXNzTGlzdC5hZGQoXCJjb21wX3dyYXBcIik7XHJcblxyXG4gICAgICAgICAgICAvL1N0cmFpZ2h0IHVwIHN0cmluZyBjb3B5IG9mIHRoZSBlbGVtZW50J3MgRE9NLlxyXG4gICAgICAgICAgICBjb21wb25lbnQuaW5uZXJIVE1MID0gdGhpcy5lbGVtZW50LmlubmVySFRNTDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB0ZW1wbGF0ZXMgPSBET00uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0ZW1wbGF0ZVwiKTtcclxuXHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgYXBwX2Nhc2UgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gY29tcG9uZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICBSZXBsYWNlIHRoZSBjb21wb25lbnQgd2l0aCBhIGNvbXBvbmVudCB3cmFwcGVyIHRvIGhlbHAgcHJlc2VydmUgRE9NIGFycmFuZ2VtZW50XHJcbiAgICAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjb21wX3dyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgY29tcF93cmFwLmNsYXNzTGlzdC5hZGQoXCJjb21wX3dyYXBcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndyYXBzLnB1c2goY29tcF93cmFwKTtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wYXJlbnRFbGVtZW50LnJlcGxhY2VDaGlsZChjb21wX3dyYXAsIGNvbXBvbmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gY29tcG9uZW50LmNsYXNzTGlzdFswXSxcclxuICAgICAgICAgICAgICAgICAgICBjb21wO1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgIFdlIG11c3QgZW5zdXJlIHRoYXQgY29tcG9uZW50cyBhY3QgYXMgdGVtcGxhdGUgXCJsYW5kaW5nIHNwb3RzXCIuIEluIG9yZGVyIGZvciB0aGF0IHRvIGhhcHBlbiB3ZSBtdXN0IGNoZWNrIGZvcjpcclxuICAgICAgICAgICAgICAgICAgKDEpIFRoZSBjb21wb25lbnQgaGFzLCBhcyBpdCdzIGZpcnN0IGNsYXNzIG5hbWUsIGFuIGlkIHRoYXQgKDIpIG1hdGNoZXMgdGhlIGlkIG9mIGEgdGVtcGxhdGUuIElmIGVpdGhlciBvZiB0aGVzZSBwcm92ZSB0byBiZSBub3QgdHJ1ZSwgd2Ugc2hvdWxkIHJlamVjdCB0aGUgYWRvcHRpb24gb2YgdGhlIGNvbXBvbmVudCBhcyBhIFdpY2tcclxuICAgICAgICAgICAgICAgICAgY29tcG9uZW50IGFuZCBpbnN0ZWFkIHRyZWF0IGl0IGFzIGEgbm9ybWFsIFwicGFzcyB0aHJvdWdoXCIgZWxlbWVudC5cclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoIWlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLypzZXRMaW5rcyhjb21wb25lbnQsIChocmVmLCBlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHt9LCBcImlnbm9yZWQgdGl0bGVcIiwgaHJlZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBuZXcgQmFzaWNDYXNlKGNvbXBvbmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFBcHBfQ29tcG9uZW50c1tpZF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXAgPSBDb21wb25lbnRfQ29uc3RydWN0b3JzW2lkXSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gbmV3IGNvbXAuY29uc3RydWN0b3IodGVtcGxhdGVzLCBwcmVzZXRzLCBjb21wb25lbnQsIERPTSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXAubW9kZWxfbmFtZSAmJiBNb2RlbF9Db25zdHJ1Y3RvcnNbY29tcC5tb2RlbF9uYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtb2RlbCA9IE1vZGVsX0NvbnN0cnVjdG9yc1tjb21wLm1vZGVsX25hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5nZXR0ZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLmdldHRlci5nZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbC5hZGRWaWV3KGFwcF9jYXNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBfY2FzZS5pZCA9IGlkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcF9Db21wb25lbnRzW2lkXSA9IGFwcF9jYXNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gdGVtcGxhdGVzW2lkXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBfY2FzZSA9IENhc2VDb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgcHJlc2V0cywgRE9NKSgpOyAvL25ldyBDYXNlQ29tcG9uZW50KHRlbXBsYXRlLCBwcmVzZXRzLCBNb2RlbF9Db25zdHJ1Y3RvcnMsIG51bGwsIERPTSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb25zdHJ1Y3RvciA9IENhc2VDb25zdHJ1Y3Rvcihjb21wb25lbnQsIHByZXNldHMsIERPTSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29uc3RydWN0b3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yID0gQ2FzZUNvbnN0cnVjdG9yKGNvbXBvbmVudC5jaGlsZHJlblswXSwgcHJlc2V0cywgRE9NKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbnN0cnVjdG9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBfY2FzZSA9IG5ldyBCYXNpY0Nhc2UoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gY29uc3RydWN0b3IoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhcHBfY2FzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQXBwIENvbXBvbmVudCBub3QgY29uc3RydWN0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiogVE9ETzogSWYgdGhlcmUgaXMgYSBmYWxsYmFjayA8bm8tc2NyaXB0PiBzZWN0aW9uIHVzZSB0aGF0IGluc3RlYWQuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBfY2FzZSA9IG5ldyBGYWlsZWRDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBfQ29tcG9uZW50c1tpZF0gPSBhcHBfY2FzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gQXBwX0NvbXBvbmVudHNbaWRdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UuaGFuZGxlVXJsVXBkYXRlKHd1cmwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBuZXcgRmFpbGVkQ2FzZShlLCBwcmVzZXRzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnB1c2goYXBwX2Nhc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIEVsZW1lbnRcclxufSIsImltcG9ydCB7XHJcbiAgICBXVVJMXHJcbn0gZnJvbSBcIi4vd3VybFwiXHJcbmltcG9ydCB7XHJcbiAgICBBbnlNb2RlbFxyXG59ZnJvbSBcIi4uL21vZGVsL21vZGVsXCJcclxuaW1wb3J0IHtcclxuICAgIFBhZ2VWaWV3XHJcbn0gZnJvbSBcIi4vcGFnZVwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgRWxlbWVudFxyXG59IGZyb20gXCIuL2VsZW1lbnRcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIFR1cm5EYXRhSW50b1F1ZXJ5XHJcbn0gZnJvbSBcIi4uL2NvbW1vbi91cmwvdXJsXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBHTE9CQUxcclxufSBmcm9tIFwiLi4vZ2xvYmFsXCJcclxuXHJcbmxldCBVUkxfSE9TVCA9IHtcclxuICAgIHd1cmw6IG51bGxcclxufTtcclxubGV0IFVSTCA9IChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICBDaGFuZ2VzIHRoZSBVUkwgdG8gdGhlIG9uZSBwcm92aWRlZCwgcHJvbXB0cyBwYWdlIHVwZGF0ZS4gb3ZlcndyaXRlcyBjdXJyZW50IFVSTC5cclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKGEsIGIsIGMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoVVJMX0hPU1Qud3VybClcclxuICAgICAgICAgICAgICAgICAgICAgICAgVVJMX0hPU1Qud3VybC5zZXQoYSwgYiwgYyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXR1cm5zIGEgUXVlcnkgZW50cnkgaWYgaXQgZXhpc3RzIGluIHRoZSBxdWVyeSBzdHJpbmcuIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFVSTF9IT1NULnd1cmwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBVUkxfSE9TVC53dXJsLnNldChhLCBiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENoYW5nZXMgdGhlIFVSTCBzdGF0ZSB0byB0aGUgb25lIHByb3ZpZGVkIGFuZCBwcm9tcHRzIHRoZSBCcm93c2VyIHRvIHJlc3BvbmQgbyB0aGUgY2hhbmdlLiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGdvdG86IGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiaWdub3JlZCB0aXRsZVwiLCBgJHthfSR7ICgoYikgPyBgPyR7VHVybkRhdGFJbnRvUXVlcnkoYil9YCA6IFwiXCIpIH1gKTtcclxuICAgICAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5mdW5jdGlvbiBnZXRNb2RhbENvbnRhaW5lcigpIHtcclxuICAgIGxldCBtb2RhbF9jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm1vZGFsc1wiKVswXTtcclxuXHJcbiAgICBpZiAoIW1vZGFsX2NvbnRhaW5lcikge1xyXG5cclxuICAgICAgICBtb2RhbF9jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibW9kYWxzXCIpO1xyXG5cclxuICAgICAgICB2YXIgZG9tX2FwcCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYXBwXCIpWzBdO1xyXG5cclxuICAgICAgICBpZiAoZG9tX2FwcClcclxuICAgICAgICAgICAgZG9tX2FwcC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShtb2RhbF9jb250YWluZXIsIGRvbV9hcHApO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbF9jb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtb2RhbF9jb250YWluZXJcclxufVxyXG5cclxuLyoqIEBuYW1lc3BhY2UgbGlua2VyICovXHJcblxyXG4vKipcclxuICogIFJlc3BvbnNpYmxlIGZvciBsb2FkaW5nIHBhZ2VzIGFuZCBwcmVzZW50aW5nIHRoZW0gaW4gdGhlIG1haW4gRE9NLlxyXG4gKi9cclxuY2xhc3MgTGlua2VyIHtcclxuICAgIC8qKlxyXG4gICAgICogIFRoaXMgKGlua2VyLkxpbmtlcikgaXMgcmVzcG9uc2libGUgZm9yIGxvYWRpbmcgcGFnZXMgZHluYW1pY2FsbHksIGhhbmRsaW5nIHRoZSB0cmFuc2l0aW9uIG9mIHBhZ2UgY29tcG9uZW50cywgYW5kIG1vbml0b3JpbmcgYW5kIHJlYWN0aW5nIHRvIFVSTCBjaGFuZ2VzXHJcbiAgICAgKlxyXG4gICAgICpcclxuICAgICAqICBAcGFyYW0ge0xpbmtlclByZXNldHN9IHByZXNldHMgLSBBIHByZXNldCBiYXNlZCBvYmplY3QgdGhhdCB3aWxsIGJlIHVzZWQgYnkgV2ljayBmb3IgaGFuZGxpbmcgY3VzdG9tIGNvbXBvbmVudHMuIElzIHZhbGlkYXRlZCBhY2NvcmRpbmcgdG8gdGhlIGRlZmluaXRpb24gb2YgYSBMaW5rZXJQcmVzZXRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IocHJlc2V0cykge1xyXG4gICAgICAgIHRoaXMucGFnZXMgPSB7fTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSB7fTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudF9jb25zdHJ1Y3RvcnMgPSB7fTtcclxuICAgICAgICB0aGlzLm1vZGVsc19jb25zdHJ1Y3RvcnMgPSB7fTtcclxuICAgICAgICB0aGlzLnByZXNldHMgPSBwcmVzZXRzO1xyXG4gICAgICAgIHRoaXMuY3VycmVudF91cmwgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9xdWVyeTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfdmlldyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maW5hbGl6aW5nX3BhZ2VzID0gW107XHJcblxyXG4gICAgICAgIEdMT0JBTC5saW5rZXIgPSB0aGlzO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAgVGhlIHN0YXRpYyBmaWVsZCBpbiBwcmVzZXRzIGFyZSBhbGwgQ29tcG9uZW50LWxpa2Ugb2JqZWN0cyBjb250cnVjdG9ycyB0aGF0IGFyZSBkZWZpbmVkIGJ5IHRoZSBjbGllbnRcclxuICAgICAgICAgIHRvIGJlIHVzZWQgYnkgV2ljayBmb3IgY3VzdG9tIGNvbXBvbmVudHMuXHJcblxyXG4gICAgICAgICAgVGhlIGNvbnN0cnVjdG9ycyBtdXN0IHN1cHBvcnQgc2V2ZXJhbCBDb21wb25lbnQgYmFzZWQgbWV0aG9kcyBpbiBvcmRlcmVkIG90IGJlIGFjY2VwdGVkIGZvciB1c2UuIFRoZXNlIG1ldGhvZGVzIGluY2x1ZGU6XHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25JblxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uT3V0XHJcbiAgICAgICAgICAgIHNldE1vZGVsXHJcbiAgICAgICAgICAgIHVuc2V0TW9kZWxcclxuICAgICAgICAqL1xyXG4gICAgICAgIGlmIChwcmVzZXRzLnN0YXRpYykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb21wb25lbnRfbmFtZSBpbiBwcmVzZXRzLnN0YXRpYykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSBwcmVzZXRzLnN0YXRpY1tjb21wb25lbnRfbmFtZV07XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGEgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGIgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGMgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGQgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGUgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgoYSA9IChjb21wb25lbnQucHJvdG90eXBlLnRyYW5zaXRpb25JbiAmJiBjb21wb25lbnQucHJvdG90eXBlLnRyYW5zaXRpb25JbiBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkgJiZcclxuICAgICAgICAgICAgICAgICAgICAoYiA9IChjb21wb25lbnQucHJvdG90eXBlLnRyYW5zaXRpb25PdXQgJiYgY29tcG9uZW50LnByb3RvdHlwZS50cmFuc2l0aW9uT3V0IGluc3RhbmNlb2YgRnVuY3Rpb24pKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChjID0gKGNvbXBvbmVudC5wcm90b3R5cGUuc2V0TW9kZWwgJiYgY29tcG9uZW50LnByb3RvdHlwZS5zZXRNb2RlbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkgJiZcclxuICAgICAgICAgICAgICAgICAgICAoZCA9IChjb21wb25lbnQucHJvdG90eXBlLnVuc2V0TW9kZWwgJiYgY29tcG9uZW50LnByb3RvdHlwZS51bnNldE1vZGVsIGluc3RhbmNlb2YgRnVuY3Rpb24pKSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFN0YXRpYyhjb21wb25lbnRfbmFtZSwgY29tcG9uZW50KTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFN0YXRpYyBjb21wb25lbnQgJHtjb21wb25lbnRfbmFtZX0gbGFja3MgY29ycmVjdCBjb21wb25lbnQgbWV0aG9kcywgXFxuSGFzIHRyYW5zaXRpb25JbiBmdW5jdGlvbjoke2F9XFxuSGFzIHRyYW5zaXRpb25PdXQgZnVuY3Rvbjoke2J9XFxuSGFzIHNldCBtb2RlbCBmdW5jdGlvbjoke2N9XFxuSGFzIHVuc2V0TW9kZWwgZnVuY3Rpb246JHtkfWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiogVE9ET1xyXG4gICAgICAgICAgICBAZGVmaW5lIFBhZ2VQYXJzZXJcclxuXHJcbiAgICAgICAgICAgIEEgcGFnZSBwYXJzZXIgd2lsbCBwYXJzZSB0ZW1wbGF0ZXMgYmVmb3JlIHBhc3NpbmcgdGhhdCBkYXRhIHRvIHRoZSBDYXNlIGhhbmRsZXIuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBpZiAocHJlc2V0cy5wYXJzZXIpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcGFyc2VyX25hbWUgaW4gcHJlc2V0cy5wYWdlX3BhcnNlcikge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcnNlciA9IHByZXNldHMucGFnZV9wYXJzZXJbcGFyc2VyX25hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgICAgU2NoZW1hcyBwcm92aWRlIHRoZSBjb25zdHJ1Y3RvcnMgZm9yIG1vZGVsc1xyXG4gICAgICAgICovXHJcbiAgICAgICAgaWYgKHByZXNldHMuc2NoZW1hcykge1xyXG5cclxuICAgICAgICAgICAgcHJlc2V0cy5zY2hlbWFzLmFueSA9IEFueU1vZGVsO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwcmVzZXRzLnNjaGVtYXMgPSB7XHJcbiAgICAgICAgICAgICAgICBhbnkgOiBBbnlNb2RlbFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICAgIE1vZGFscyBhcmUgdGhlIGdsb2JhbCBtb2RlbHMgdGhhdCBjYW4gYmUgYWNjZXNzZWQgYnkgYW55IENhc2VcclxuICAgICAgICAqL1xyXG4gICAgICAgIGlmIChwcmVzZXRzLm1vZGVscykge1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwcmVzZXRzLm1vZGVscyA9IHt9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICBUT0RPIFZhbGlkYXRlIHRoYXQgZXZlcnkgc2NoYW1hIGlzIGEgTW9kZWwgY29uc3RydWN0b3JcclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICAvKiAqL1xyXG4gICAgICAgIHRoaXMubW9kYWxfc3RhY2sgPSBbXTtcclxuXHJcbiAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VVUkwoZG9jdW1lbnQubG9jYXRpb24pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgICAgVGhpcyBmdW5jdGlvbiB3aWxsIHBhcnNlIGEgVVJMIGFuZCBkZXRlcm1pbmUgd2hhdCBQYWdlIG5lZWRzIHRvIGJlIGxvYWRlZCBpbnRvIHRoZSBjdXJyZW50IHZpZXcuXHJcbiAgICAqL1xyXG4gICAgcGFyc2VVUkwobG9jYXRpb24pIHtcclxuXHJcbiAgICAgICAgbGV0IHVybCA9IGxvY2F0aW9uLnBhdGhuYW1lO1xyXG5cclxuICAgICAgICBsZXQgSVNfU0FNRV9QQUdFID0gKHRoaXMuY3VycmVudF91cmwgPT0gdXJsKSxcclxuICAgICAgICAgICAgcGFnZSA9IG51bGwsXHJcbiAgICAgICAgICAgIHd1cmwgPSBuZXcgV1VSTChsb2NhdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudF91cmwgPSB1cmw7XHJcblxyXG4gICAgICAgIGlmICgocGFnZSA9IHRoaXMucGFnZXNbdXJsXSkpIHtcclxuICAgICAgICAgICAgaWYgKElTX1NBTUVfUEFHRSkge1xyXG4gICAgICAgICAgICAgICAgVVJMX0hPU1Qud3VybCA9IHd1cmw7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2UudHJhbnNpdGlvbkluKFxyXG4gICAgICAgICAgICAgICAgICAgIChwYWdlLnR5cGUgPT0gXCJtb2RhbFwiKSA/IGdldE1vZGFsQ29udGFpbmVyKCkgOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFwcFwiKVswXSwgXHJcbiAgICAgICAgICAgICAgICAgICAgbnVsbCwgd3VybCwgSVNfU0FNRV9QQUdFKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkUGFnZShwYWdlLCB3dXJsLCBJU19TQU1FX1BBR0UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGxvY2F0aW9uKVxyXG4gICAgICAgICAgICBmZXRjaChsb2NhdGlvbi5ocmVmLCB7XHJcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCAvLyBTZW5kcyBjb29raWVzIGJhY2sgdG8gc2VydmVyIHdpdGggcmVxdWVzdFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJ1xyXG4gICAgICAgICAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgKHJlc3BvbnNlLnRleHQoKS50aGVuKChodG1sKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIERPTSA9IChuZXcgRE9NUGFyc2VyKCkpLnBhcnNlRnJvbVN0cmluZyhodG1sLCBcInRleHQvaHRtbFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFBhZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZE5ld1BhZ2UodXJsLCBET00sIHd1cmwpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3dXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBJU19TQU1FX1BBR0VcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgVW5hYmxlIHRvIHByb2Nlc3MgcmVzcG9uc2UgZm9yIHJlcXVlc3QgbWFkZSB0bzogJHt0aGlzLnVybH0uIFJlc3BvbnNlOiAke2Vycm9yfS4gRXJyb3IgUmVjZWl2ZWQ6ICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZmluYWxpemVQYWdlcygpIHtcclxuXHJcbiAgICAgICAgaWYodGhpcy5hcm1lZCl7XHJcbiAgICAgICAgICAgIGxldCBhID0gdGhpcy5hcm1lZDtcclxuICAgICAgICAgIC8vICBhLnAudHJhbnNpdGlvbkluKGEuZSwgdGhpcy5jdXJyZW50X3ZpZXcsIGEud3VybCwgYS5TUCwgYS50ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXJtZWQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuZmluYWxpemluZ19wYWdlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5maW5hbGl6aW5nX3BhZ2VzW2ldO1xyXG4gICAgICAgICAgICBwYWdlLmZpbmFsaXplKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmZpbmFsaXppbmdfcGFnZXMubGVuZ3RoID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBMb2FkcyBwYWdlcyBmcm9tIHNlcnZlciwgb3IgZnJvbSBsb2NhbCBjYWNoZSwgYW5kIHNlbmRzIGl0IHRvIHRoZSBwYWdlIHBhcnNlci5cclxuXHJcbiAgICAgIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgVVJMIGlkIG9mIHRoZSBjYWNoZWQgcGFnZSB0byBsb2FkLlxyXG4gICAgICBAcGFyYW0ge3N0cmluZ30gcXVlcnkgLVxyXG4gICAgICBAcGFyYW0ge0Jvb2x9IElTX1NBTUVfUEFHRSAtXHJcbiAgICAqL1xyXG4gICAgbG9hZFBhZ2UocGFnZSwgd3VybCA9IG5ldyBXVVJMKGRvY3VtZW50LmxvY2F0aW9uKSwgSVNfU0FNRV9QQUdFKSB7XHJcblxyXG5cclxuICAgICAgICBVUkxfSE9TVC53dXJsID0gd3VybDtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fbGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgbGV0IGFwcF9lbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFwcFwiKVswXTtcclxuXHJcbiAgICAgICAgLy9GaW5hbGl6ZSBhbnkgZXhpc3RpbmcgcGFnZSB0cmFuc2l0aW9ucztcclxuICAgICAgICAvLyB0aGlzLmZpbmFsaXplUGFnZXMoKTtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fZWxlbWVudHMgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgKHBhZ2UudHlwZSA9PSBcIm1vZGFsXCIpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vdHJhY2UgbW9kYWwgc3RhY2sgYW5kIHNlZSBpZiB0aGUgbW9kYWwgYWxyZWFkeSBleGlzdHNcclxuICAgICAgICAgICAgaWYgKElTX1NBTUVfUEFHRSkge1xyXG4gICAgICAgICAgICAgICAgcGFnZS50cmFuc2l0aW9uSW4oKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgVU5XSU5EID0gMDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5tb2RhbF9zdGFjay5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBtb2RhbCA9IHRoaXMubW9kYWxfc3RhY2tbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKFVOV0lORCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGFsID09IHBhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVU5XSU5EID0gaSArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdHJzID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBtb2RhbC51bmxvYWQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRycyA9IG1vZGFsLnRyYW5zaXRpb25PdXQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX2xlbmd0aCA9IE1hdGgubWF4KHRycywgdHJhbnNpdGlvbl9sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmFsaXppbmdfcGFnZXMucHVzaChtb2RhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbC5maW5hbGl6ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoVU5XSU5EID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbF9zdGFjay5sZW5ndGggPSBVTldJTkQ7XHJcbiAgICAgICAgICAgICAgICBwYWdlLmxvYWQoZ2V0TW9kYWxDb250YWluZXIoKSwgd3VybCk7XHJcbiAgICAgICAgICAgICAgICBwYWdlLnRyYW5zaXRpb25JbigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy9jcmVhdGUgbmV3IG1vZGFsXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsX3N0YWNrLnB1c2gocGFnZSk7XHJcbiAgICAgICAgICAgICAgICBwYWdlLmxvYWQoZ2V0TW9kYWxDb250YWluZXIoKSwgd3VybCk7XHJcbiAgICAgICAgICAgICAgICBwYWdlLnRyYW5zaXRpb25JbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubW9kYWxfc3RhY2subGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbW9kYWwgPSB0aGlzLm1vZGFsX3N0YWNrW2ldO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRycyA9IDA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIG1vZGFsLnVubG9hZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0cnMgPSBtb2RhbC50cmFuc2l0aW9uT3V0KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX2xlbmd0aCA9IE1hdGgubWF4KHRycywgdHJhbnNpdGlvbl9sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmluYWxpemluZ19wYWdlcy5wdXNoKG1vZGFsKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBcclxuICAgICAgICAgICAgICAgICAgICBtb2RhbC5maW5hbGl6ZSgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMubW9kYWxfc3RhY2subGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgICAgIGxldCB0cnMgPSAwO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRfdmlldyAmJiB0aGlzLmN1cnJlbnRfdmlldyAhPSBwYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRfdmlldy51bmxvYWQodHJhbnNpdGlvbl9lbGVtZW50cyk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHBhZ2UubG9hZChhcHBfZWxlLCB3dXJsKTtcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBsZXQgdCA9IHRoaXMuY3VycmVudF92aWV3LnRyYW5zaXRpb25PdXQoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2UudHJhbnNpdGlvbkluKHRyYW5zaXRpb25fZWxlbWVudHMpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25fbGVuZ3RoID0gTWF0aC5tYXgodCwgdHJhbnNpdGlvbl9sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmFsaXppbmdfcGFnZXMucHVzaCh0aGlzLmN1cnJlbnRfdmlldyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZighdGhpcy5jdXJyZW50X3ZpZXcpe1xyXG4gICAgICAgICAgICAgICAgcGFnZS5sb2FkKGFwcF9lbGUsIHd1cmwpO1xyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCk9PntcclxuICAgICAgICAgICAgICAgICAgICBwYWdlLnRyYW5zaXRpb25Jbih0cmFuc2l0aW9uX2VsZW1lbnRzKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3ZpZXcgPSBwYWdlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZmluYWxpemVQYWdlcygpO1xyXG4gICAgICAgIH0sICh0cmFuc2l0aW9uX2xlbmd0aCoxMDAwKSArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFByZS1sb2FkcyBhIGN1c3RvbSBjb25zdHJ1Y3RvciBmb3IgYW4gZWxlbWVudCB3aXRoIHRoZSBzcGVjaWZpZWQgaWQgYW5kIHByb3ZpZGVzIGEgbW9kZWwgdG8gdGhhdCBjb25zdHJ1Y3RvciB3aGVuIGl0IGlzIGNhbGxlZC5cclxuICAgICAgICBUaGUgY29uc3RydWN0b3IgbXVzdCBoYXZlIENvbXBvbmVudCBpbiBpdHMgaW5oZXJpdGFuY2UgY2hhaW4uXHJcbiAgICAqL1xyXG4gICAgYWRkU3RhdGljKGVsZW1lbnRfaWQsIGNvbnN0cnVjdG9yLCBtb2RlbCkge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50X2NvbnN0cnVjdG9yc1tlbGVtZW50X2lkXSA9IHtcclxuICAgICAgICAgICAgY29uc3RydWN0b3IsXHJcbiAgICAgICAgICAgIG1vZGVsX25hbWU6IG1vZGVsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWRkTW9kZWwobW9kZWxfbmFtZSwgbW9kZWxDb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgIHRoaXMubW9kZWxzX2NvbnN0cnVjdG9yc1ttb2RlbF9uYW1lXSA9IG1vZGVsQ29uc3RydWN0b3I7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAgICBDcmVhdGVzIGEgbmV3IGlmcmFtZSBvYmplY3QgdGhhdCBhY3RzIGFzIGEgbW9kYWwgdGhhdCB3aWxsIHNpdCBvbnRvcCBvZiBldmVyeXRoaW5nIGVsc2UuXHJcbiAgICAqL1xyXG4gICAgbG9hZE5vbldpY2tQYWdlKFVSTCkge1xyXG4gICAgICAgIGxldCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO1xyXG4gICAgICAgIGlmcmFtZS5zcmMgPSBVUkw7XHJcbiAgICAgICAgaWZyYW1lLmNsYXNzTGlzdC5hZGQoXCJtb2RhbFwiLCBcImNvbXBfd3JhcFwiKTtcclxuICAgICAgICB2YXIgcGFnZSA9IG5ldyBQYWdlVmlldyhVUkwsIGlmcmFtZSk7XHJcbiAgICAgICAgcGFnZS50eXBlID0gXCJtb2RhbFwiO1xyXG4gICAgICAgIHRoaXMucGFnZXNbVVJMXSA9IHBhZ2UgLy9uZXcgTW9kYWwocGFnZSwgaWZyYW1lLCBnZXRNb2RhbENvbnRhaW5lcigpKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYWdlc1tVUkxdO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgICAgVGFrZXMgdGhlIERPTSBvZiBhbm90aGVyIHBhZ2UgYW5kIHN0cmlwcyBpdCwgbG9va2luZyBmb3IgY29tcG9uZW50IGFuZCBhcHAgZWxlbWVudHMgdG8gdXNlIHRvIGludGVncmF0ZSBpbnRvIHRoZSBTUEEgc3lzdGVtLlxyXG4gICAgICAgIElmIGl0IGlzIHVuYWJsZSB0byBmaW5kIHRoZXNlIGVsZW1lbnRzLCB0aGVuIGl0IHdpbGwgcGFzcyB0aGUgRE9NIHRvIGxvYWROb25XaWNrUGFnZSB0byBoYW5kbGUgd3JhcHBpbmcgdGhlIHBhZ2UgYm9keSBpbnRvIGEgd2ljayBhcHAgZWxlbWVudC5cclxuICAgICovXHJcbiAgICBsb2FkTmV3UGFnZShVUkwsIERPTSwgd3VybCkge1xyXG4gICAgICAgIC8vbG9vayBmb3IgdGhlIGFwcCBzZWN0aW9uLlxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgICAgSWYgdGhlIHBhZ2Ugc2hvdWxkIG5vdCBiZSByZXVzZWQsIGFzIGluIGNhc2VzIHdoZXJlIHRoZSBzZXJ2ZXIgZG9lcyBhbGwgdGhlIHJlbmRlcmluZyBmb3IgYSBkeW5hbWljIHBhZ2UgYW5kIHdlJ3JlIGp1c3QgcHJlc2VudGluZyB0aGUgcmVzdWx0cyxcclxuICAgICAgICAgICAgdGhlbiBoYXZpbmcgTk9fQlVGRkVSIHNldCB0byB0cnVlIHdpbGwgY2F1c2UgdGhlIGxpbmtlciB0byBub3Qgc2F2ZSB0aGUgcGFnZSB0byB0aGUgaGFzaHRhYmxlIG9mIGV4aXN0aW5nIHBhZ2VzLCBmb3JjaW5nIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIGV2ZXJ5IHRpbWUgdGhlIHBhZ2UgaXMgdmlzaXRlZC5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGxldCBOT19CVUZGRVIgPSBmYWxzZTtcclxuXHJcblxyXG4gICAgICAgIC8qIFxyXG4gICAgICAgICAgICBBcHAgZWxlbWVudHM6IFRoZXJlIHNob3VsZCBvbmx5IGJlIG9uZS4gXHJcbiAgICAgICAgKi9cclxuICAgICAgICBsZXQgYXBwX2xpc3QgPSBET00uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhcHBcIik7XHJcblxyXG4gICAgICAgIGlmIChhcHBfbGlzdC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgV2ljayBpcyBkZXNpZ25lZCB0byB3b3JrIHdpdGgganVzdCBvbmUgPGFwcD4gZWxlbWVudCBpbiBhIHBhZ2UuIFRoZXJlIGFyZSAke2FwcF9saXN0Lmxlbmd0aH0gYXBwcyBlbGVtZW50cyBpbiAke3VybH0uIFdpY2sgd2lsbCBwcm9jZWVkIHdpdGggdGhlIGZpcnN0IDxhcHA+IGVsZW1lbnQgaW4gdGhlIERPTS4gVW5leHBlY3RlZCBiZWhhdmlvciBtYXkgb2NjdXIuYClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBhcHBfc291cmNlID0gYXBwX2xpc3RbMF1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICBJZiB0aGVyZSBpcyBubyA8YXBwPiBlbGVtZW50IHdpdGhpbiB0aGUgRE9NLCB0aGVuIHdlIG11c3QgaGFuZGxlIHRoaXMgY2FzZSBjYXJlZnVsbHkuIFRoaXMgbGlrZWx5IGluZGljYXRlcyBhIHBhZ2UgZGVsaXZlcmVkIGZyb20gdGhlIHNhbWUgb3JpZ2luIHRoYXQgaGFzIG5vdCBiZWVuIGNvbnZlcnRlZCB0byB3b3JrIHdpdGggdGhlIFdpY2sgc3lzdGVtLlxyXG4gICAgICAgICAgVGhlIGVudGlyZSBjb250ZW50cyBvZiB0aGUgcGFnZSBjYW4gYmUgd3JhcHBlZCBpbnRvIGEgPGlmcmFtZT4sIHRoYXQgd2lsbCBiZSBjb3VsZCBzZXQgYXMgYSBtb2RhbCBvbiB0b3Agb2YgZXhpc3RpbmcgcGFnZXMuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBpZiAoIWFwcF9zb3VyY2UpIHtcclxuICAgICAgICAgICAgY29uc29sZS50cmFjZShcIlBhZ2UgZG9lcyBub3QgaGF2ZSBhbiA8YXBwPiBlbGVtZW50IVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9hZE5vbldpY2tQYWdlKFVSTCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYXBwX3BhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXBwcGFnZVwiKTtcclxuICAgICAgICBhcHBfcGFnZS5pbm5lckhUTUwgPSBhcHBfc291cmNlLmlubmVySFRNTDtcclxuXHJcbiAgICAgICAgdmFyIGFwcCA9IGFwcF9zb3VyY2UuY2xvbmVOb2RlKHRydWUpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGRvbV9hcHAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFwcFwiKVswXTtcclxuXHJcbiAgICAgICAgdmFyIHBhZ2UgPSBuZXcgUGFnZVZpZXcoVVJMLCBhcHBfcGFnZSk7XHJcbiAgICAgICAgaWYgKGFwcF9zb3VyY2UpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChhcHBfc291cmNlLmRhdGFzZXQubW9kYWwgPT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgICAgICAgIHBhZ2Uuc2V0VHlwZShcIm1vZGFsXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm1vZGFsXCIpO1xyXG4gICAgICAgICAgICAgICAgbW9kYWwuaW5uZXJIVE1MID0gYXBwLmlubmVySFRNTDtcclxuICAgICAgICAgICAgICAgIGFwcC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgYXBwID0gbW9kYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICBJZiB0aGUgRE9NIGlzIHRoZSBzYW1lIGVsZW1lbnQgYXMgdGhlIGFjdHVhbCBkb2N1bWVudCwgdGhlbiB3ZSBzaGFsbCByZWJ1aWxkIHRoZSBleGlzdGluZyA8YXBwPiBlbGVtZW50LCBjbGVhcmluZyBpdCBvZiBpdCdzIGNvbnRlbnRzLlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChET00gPT0gZG9jdW1lbnQgJiYgZG9tX2FwcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdfYXBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFwcFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlcGxhY2VDaGlsZChuZXdfYXBwLCBkb21fYXBwKTtcclxuICAgICAgICAgICAgICAgICAgICBkb21fYXBwID0gbmV3X2FwcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGFwcC5kYXRhc2V0Lm5vX2J1ZmZlciA9PSBcInRydWVcIilcclxuICAgICAgICAgICAgICAgIE5PX0JVRkZFUiA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBhcHBfcGFnZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImVsZW1lbnRcIik7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGVsZSA9IGVsZW1lbnRzW2ldLFxyXG4gICAgICAgICAgICAgICAgICAgIGVxdWl2aWxhbnRfZWxlbWVudF9mcm9tX21haW5fZG9tID0gZWxlLFxyXG4gICAgICAgICAgICAgICAgICAgIHdpY2tfZWxlbWVudDtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnRfaWQgPSBlbGUuaWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UudHlwZSAhPT0gXCJtb2RhbFwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpY2tfZWxlbWVudCA9IG5ldyBFbGVtZW50KGVsZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBlbGUuaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImVsZV93cmFwXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB3aWNrX2VsZW1lbnQgPSBuZXcgRWxlbWVudChlbGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHBhZ2UuZWxlbWVudHMucHVzaCh3aWNrX2VsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jb21wb25lbnRzW2VsZW1lbnRfaWRdKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50c1tlbGVtZW50X2lkXSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIHdpY2tfZWxlbWVudC5zZXRDb21wb25lbnRzKHRoaXMuY29tcG9uZW50c1tlbGVtZW50X2lkXSwgdGhpcy5tb2RlbHNfY29uc3RydWN0b3JzLCB0aGlzLmNvbXBvbmVudF9jb25zdHJ1Y3RvcnMsIHRoaXMucHJlc2V0cywgRE9NLCB3dXJsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50ID09IERPTSlcclxuICAgICAgICAgICAgICAgIGRvbV9hcHAuaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBwYWdlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFOT19CVUZGRVIpIHRoaXMucGFnZXNbVVJMXSA9IHJlc3VsdDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIExpbmtlcixcclxuICAgIFVSTFxyXG59IiwiLyoqXHJcblx0TGlnaHQgaXQgdXAhXHJcbiovXHJcbmltcG9ydCB7XHJcbiAgICBXVVJMXHJcbn0gZnJvbSBcIi4vbGlua2VyL3d1cmxcIlxyXG5pbXBvcnQge1xyXG4gICAgVmlld1xyXG59IGZyb20gXCIuL3ZpZXdcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIEFueU1vZGVsLFxyXG4gICAgQXJyYXlNb2RlbENvbnRhaW5lcixcclxuICAgIEJUcmVlTW9kZWxDb250YWluZXIsXHJcbiAgICBNdWx0aUluZGV4ZWRDb250YWluZXIsXHJcbiAgICBNb2RlbCxcclxuICAgIE1vZGVsQ29udGFpbmVyXHJcbn0gZnJvbSBcIi4vbW9kZWwvbW9kZWxcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIENvbnRyb2xsZXJcclxufSBmcm9tIFwiLi9jb250cm9sbGVyXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBHZXR0ZXJcclxufSBmcm9tIFwiLi9nZXR0ZXJcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIFNldHRlclxyXG59IGZyb20gXCIuL3NldHRlclwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgTGlua2VyLFxyXG4gICAgVVJMXHJcbn0gZnJvbSBcIi4vbGlua2VyL2xpbmtlclwiXHJcblxyXG5pbXBvcnQgKiBhcyBBbmltYXRpb24gZnJvbSBcIi4vYW5pbWF0aW9uL2FuaW1hdGlvblwiXHJcblxyXG5pbXBvcnQgKiBhcyBDb21tb24gZnJvbSBcIi4vY29tbW9uXCJcclxuXHJcbmxldCB3aWNrX3Zhbml0eSA9IFwiXFwgXFwoXFwgXFwgXFwoXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwpXFxuXFwgXFwpXFxcXFxcKVxcKVxcKFxcIFxcIFxcIFxcJ1xcIFxcKFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcKFxcIFxcL1xcKFxcblxcKFxcKFxcX1xcKVxcKFxcKVxcXFxcXCBcXClcXCBcXCBcXClcXFxcXFwgXFwgXFwgXFwgXFwoXFwgXFwgXFwgXFwgXFwpXFxcXFxcKFxcKVxcKVxcblxcX1xcKFxcKFxcKVxcKVxcXFxcXF9cXClcXChcXClcXChcXChcXF9cXClcXCBcXCBcXCBcXClcXFxcXFwgXFwgXFwoXFwoXFxfXFwpXFxcXFxcblxcXFxcXCBcXFxcXFwoXFwoXFxfXFwpXFwvXFwgXFwvXFwgXFwoXFxfXFwpXFwgXFwgXFwoXFwoXFxfXFwpXFwgXFx8XFwgXFx8XFwoXFxfXFwpXFxuXFwgXFxcXFxcIFxcXFxcXC9cXFxcXFwvXFwgXFwvXFwgXFwgXFx8XFwgXFx8XFwgXFwvXFwgXFxfXFx8XFwgXFwgXFx8XFwgXFwvXFwgXFwvXFxuXFwgXFwgXFxcXFxcX1xcL1xcXFxcXF9cXC9cXCBcXCBcXCBcXHxcXF9cXHxcXCBcXFxcXFxfXFxfXFx8XFwgXFwgXFx8XFxfXFxcXFxcX1xcXFxcXG5cIjtcclxuXHJcbmltcG9ydCB7XHJcbiAgICBDdXN0b21DYXNlXHJcbn0gZnJvbSBcIi4vY2FzZS9jYXNlXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBSaXZldFxyXG59IGZyb20gXCIuL2Nhc2Uvcml2ZXRcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIENhc2VDb25zdHJ1Y3RvclxyXG59IGZyb20gXCIuL2Nhc2UvY2FzZV9jb25zdHJ1Y3RvclwiXHJcblxyXG5pbXBvcnR7XHJcbiAgICBGaWx0ZXJcclxufSBmcm9tIFwiLi9jYXNlL2Nhc3NldHRlL2ZpbHRlclwiXHJcblxyXG5pbXBvcnR7XHJcbiAgICBGb3JtXHJcbn0gZnJvbSBcIi4vY2FzZS9jYXNzZXR0ZS9mb3JtXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBDYXNzZXR0ZVxyXG59IGZyb20gXCIuL2Nhc2UvY2Fzc2V0dGUvY2Fzc2V0dGVcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIFNjaGVtYVR5cGUsXHJcbiAgICBzY2hlbWFcclxufSBmcm9tIFwiLi9zY2hlbWEvc2NoZW1hc1wiXHJcblxyXG5sZXQgTElOS0VSX0xPQURFRCA9IGZhbHNlO1xyXG5sZXQgREVCVUdHRVIgPSB0cnVlO1xyXG5cclxuLyoqXHJcbiAqICAgIENyZWF0ZXMgYSBuZXcge0xpbmtlcn0gaW5zdGFuY2UsIHBhc3NpbmcgYW55IHByZXNldHMgZnJvbSB0aGUgY2xpZW50LlxyXG4gKiAgICBJdCB3aWxsIHRoZW4gd2FpdCBmb3IgdGhlIGRvY3VtZW50IHRvIGxvYWQsIGFuZCBvbmNlIGxvYWRlZCwgd2lsbCBzdGFydCB0aGUgbGlua2VyIGFuZCBsb2FkIHRoZSBjdXJyZW50IHBhZ2UgaW50byB0aGUgbGlua2VyLlxyXG4gKlxyXG4gKiAgICBOb3RlOiBUaGlzIGZ1bmN0aW9uIHNob3VsZCBvbmx5IGJlIGNhbGxlZCBvbmNlLiBBbnkgc3Vic2VxdWVudCBjYWxscyB3aWxsIG5vdCBkbyBhbnl0aGluZy5cclxuICpcclxuICogICAgQHBhcmFtIHtMaW5rZXJQcmVzZXRzfSBwcmVzZXRzIC0gQW4gb2JqZWN0IG9mIHVzZXIgZGVmaW5lZCBXaWNrIG9iamVjdHMuXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gbGlnaHQocHJlc2V0cykge1xyXG4gICAgaWYgKERFQlVHR0VSKSBjb25zb2xlLmxvZyhwcmVzZXRzKVxyXG5cclxuICAgIGlmIChMSU5LRVJfTE9BREVEKSByZXR1cm47XHJcblxyXG4gICAgTElOS0VSX0xPQURFRCA9IHRydWU7XHJcblxyXG4gICAgLy9QYXNzIGluIHRoZSBwcmVzZXRzIG9yIGEgcGxhaW4gb2JqZWN0IGlmIHByZXNldHMgaXMgdW5kZWZpbmVkLlxyXG5cclxuICAgIGxldCBsaW5rID0gbmV3IExpbmtlcihwcmVzZXRzIHx8IHt9KTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgICAgIGxpbmsubG9hZFBhZ2UoXHJcbiAgICAgICAgICAgIGxpbmsubG9hZE5ld1BhZ2UoZG9jdW1lbnQubG9jYXRpb24ucGF0aG5hbWUsIGRvY3VtZW50KSxcclxuICAgICAgICAgICAgbmV3IFdVUkwoZG9jdW1lbnQubG9jYXRpb24pLFxyXG4gICAgICAgICAgICBmYWxzZVxyXG4gICAgICAgICk7XHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnNvbGUubG9nKGAke3dpY2tfdmFuaXR5fUNvcHlyaWdodCAyMDE4IEFudGhvbnkgQyBXZWF0aGVyc2J5XFxuaHR0cHM6Ly9naXRsYWIuY29tL2FudGhvbnljd2VhdGhlcnNieS93aWNrYClcclxufVxyXG5cclxuLyoqKiBFeHBvcnRzICoqKi9cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBVUkwsXHJcbiAgICBBbmltYXRpb24sXHJcbiAgICBBcnJheU1vZGVsQ29udGFpbmVyLFxyXG4gICAgQlRyZWVNb2RlbENvbnRhaW5lcixcclxuICAgIE11bHRpSW5kZXhlZENvbnRhaW5lcixcclxuICAgIENvbnRyb2xsZXIsXHJcbiAgICBDdXN0b21DYXNlLFxyXG4gICAgUml2ZXQsXHJcbiAgICBDYXNlQ29uc3RydWN0b3IsXHJcbiAgICBDYXNzZXR0ZSxcclxuICAgIEZvcm0sXHJcbiAgICBGaWx0ZXIsXHJcbiAgICBDb21tb24sXHJcbiAgICBHZXR0ZXIsXHJcbiAgICBMaW5rZXIsXHJcbiAgICBNb2RlbCxcclxuICAgIEFueU1vZGVsLFxyXG4gICAgTW9kZWxDb250YWluZXIsXHJcbiAgICBTZXR0ZXIsXHJcbiAgICBWaWV3LFxyXG4gICAgbGlnaHQsXHJcbiAgICBTY2hlbWFUeXBlLFxyXG4gICAgc2NoZW1hXHJcbn0iXSwibmFtZXMiOlsic2NoZW1hIiwiQ2FzZSIsIkFTVC5Sb290IiwiQVNULlRhcE5vZGUiLCJBU1QuRmlsdGVyTm9kZSIsIkFTVC5UZXJtTm9kZSIsIkFTVC5DYXNlTm9kZSIsIkFTVC5QaXBlTm9kZSIsIkFTVC5HZW5lcmljTm9kZSIsIkVsZW1lbnQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJLFVBQVUsR0FBRztJQUNiLElBQUksRUFBRSxFQUFFO0lBQ1IsSUFBSSxFQUFFLEVBQUU7Q0FDWCxDQUFDOztBQUVGLE1BQU0sS0FBSyxDQUFDO0lBQ1IsV0FBVyxDQUFDLFNBQVMsRUFBRTtRQUNuQixJQUFJLENBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQzs7UUFFcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7O1FBRTlCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztRQUVqQixPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssVUFBVSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLGFBQWEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsRUFBRTtZQUN6SCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDL0I7S0FDSjs7SUFFRCxLQUFLLEVBQUU7UUFDSCxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztLQUNwQjs7SUFFRCxJQUFJLEdBQUc7UUFDSCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNqQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDckI7O1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxJQUFJLENBQUM7UUFDN0IsR0FBRztZQUNDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUMvQixRQUFRLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssVUFBVSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLGFBQWEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsRUFBRTs7UUFFL0gsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ3JCO1FBQ0QsT0FBTyxJQUFJLENBQUM7S0FDZjs7SUFFRCxNQUFNLENBQUMsSUFBSSxFQUFFO1FBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7UUFFL0QsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDOzs7UUFHbkMsSUFBSSxJQUFJLEVBQUU7WUFDTixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDZixJQUFJO1lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xFOztRQUVELE9BQU8sSUFBSSxDQUFDO0tBQ2Y7O0lBRUQsSUFBSSxHQUFHO1FBQ0gsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ3BCOztRQUVELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7UUFFM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxVQUFVLENBQUM7O1FBRWxDLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxVQUFVLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssYUFBYSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxFQUFFO1lBQ3JILElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUM5Qjs7UUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDWCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDcEI7O1FBRUQsT0FBTyxVQUFVLENBQUM7S0FDckI7O0lBRUQsSUFBSSxJQUFJLEdBQUc7UUFDUCxJQUFJLElBQUksQ0FBQyxLQUFLO1lBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztRQUMzQixPQUFPLElBQUksQ0FBQztLQUNmOztJQUVELElBQUksSUFBSSxHQUFHO1FBQ1AsSUFBSSxJQUFJLENBQUMsS0FBSztZQUNWLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDM0IsT0FBTyxFQUFFLENBQUM7S0FDYjs7SUFFRCxJQUFJLEdBQUcsRUFBRTtRQUNMLElBQUksSUFBSSxDQUFDLEtBQUs7WUFDVixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQzFCLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDYjs7SUFFRCxLQUFLLENBQUMsS0FBSyxFQUFFO1FBQ1QsSUFBSSxJQUFJLENBQUMsS0FBSztZQUNWLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUN0RCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7S0FDckM7Q0FDSjs7QUNwR0Q7QUFDQSxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUU7SUFDdkIsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDO0lBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDekMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFLE9BQU8sSUFBSSxDQUFDO0tBQ3JDO0lBQ0QsT0FBTyxLQUFLLENBQUM7Q0FDaEI7OztBQUdELFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRTtJQUNuQixRQUFRLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtDQUN2RDs7O0FBR0QsSUFBSSxpQ0FBaUMsSUFBSSxXQUFXO0lBQ2hELElBQUksS0FBSyxHQUFHLENBQUM7WUFDTCxJQUFJLEVBQUUsUUFBUTs7WUFFZCxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7Z0JBQ3RCLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7b0JBQ3ZCLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztvQkFDbkMsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUU7d0JBQzdDLE9BQU8sQ0FBQyxDQUFDO3FCQUNaO29CQUNELE9BQU8sQ0FBQyxDQUFDO2lCQUNaLE1BQU0sSUFBSSxJQUFJLElBQUksRUFBRSxFQUFFO29CQUNuQixJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7b0JBQ25DLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0JBQ3ZCLE9BQU8sQ0FBQyxDQUFDO3FCQUNaO2lCQUNKO2dCQUNELE9BQU8sQ0FBQyxDQUFDO2FBQ1o7O1lBRUQsU0FBUyxDQUFDLElBQUksRUFBRTtnQkFDWixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksSUFBSSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDMUQ7WUFDRCxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUNWLEtBQUssQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUM7YUFDbEM7O1NBRUosRUFBRTtZQUNDLElBQUksRUFBRSxZQUFZOztZQUVsQixLQUFLLENBQUMsSUFBSSxFQUFFO2dCQUNSLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3BFOztZQUVELFNBQVMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ1osT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25JO1lBQ0QsTUFBTSxDQUFDLEtBQUssRUFBRTs7O2FBR2I7O1NBRUo7Ozs7Ozs7Ozs7Ozs7O2FBY0k7WUFDRCxJQUFJLEVBQUUsUUFBUTs7WUFFZCxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtnQkFDZCxPQUFPLENBQUMsSUFBSSxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2hDOztZQUVELFNBQVMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ1osT0FBTyxDQUFDLElBQUksS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ2pDOztZQUVELE1BQU0sQ0FBQyxLQUFLLEVBQUU7O2FBRWI7O1NBRUosRUFBRTtZQUNDLElBQUksRUFBRSxhQUFhOztZQUVuQixLQUFLLENBQUMsSUFBSSxFQUFFO2dCQUNSLE9BQU8sQ0FBQyxJQUFJLEtBQUssRUFBRSxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM5Qzs7WUFFRCxTQUFTLENBQUMsSUFBSSxFQUFFO2dCQUNaLE9BQU8sQ0FBQyxJQUFJLEtBQUssRUFBRSxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQy9DO1lBQ0QsTUFBTSxDQUFDLEtBQUssRUFBRTs7YUFFYjs7U0FFSixFQUFFO1lBQ0MsSUFBSSxFQUFFLFVBQVU7O1lBRWhCLEtBQUssQ0FBQyxJQUFJLEVBQUU7Z0JBQ1IsT0FBTyxDQUFDLElBQUksS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNoQzs7WUFFRCxTQUFTLENBQUMsSUFBSSxFQUFFO2dCQUNaLE9BQU8sQ0FBQyxDQUFDO2FBQ1o7WUFDRCxNQUFNLENBQUMsS0FBSyxFQUFFOzthQUViO1NBQ0osRUFBRTtZQUNDLElBQUksRUFBRSxjQUFjOztZQUVwQixLQUFLLENBQUMsSUFBSSxFQUFFO2dCQUNSLE9BQU8sV0FBVyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDakQ7O1lBRUQsU0FBUyxDQUFDLElBQUksRUFBRTs7Z0JBRVosT0FBTyxDQUFDLENBQUM7YUFDWjtZQUNELE1BQU0sQ0FBQyxLQUFLLEVBQUU7Z0JBQ1YsS0FBSyxDQUFDLEtBQUssR0FBRyxrQkFBa0IsQ0FBQzthQUNwQzs7U0FFSixFQUFFO1lBQ0MsSUFBSSxFQUFFLGVBQWU7O1lBRXJCLEtBQUssQ0FBQyxJQUFJLEVBQUU7Z0JBQ1IsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNqRDs7WUFFRCxTQUFTLENBQUMsSUFBSSxFQUFFOztnQkFFWixPQUFPLENBQUMsQ0FBQzthQUNaO1lBQ0QsTUFBTSxDQUFDLEtBQUssRUFBRTtnQkFDVixLQUFLLENBQUMsS0FBSyxHQUFHLGtCQUFrQixDQUFDO2FBQ3BDOztTQUVKOztRQUVEO1lBQ0ksSUFBSSxFQUFFLFVBQVU7O1lBRWhCLEtBQUssQ0FBQyxJQUFJLEVBQUU7Z0JBQ1IsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNyRjs7WUFFRCxTQUFTLENBQUMsSUFBSSxFQUFFOztnQkFFWixPQUFPLENBQUMsQ0FBQzthQUNaO1lBQ0QsTUFBTSxDQUFDLEtBQUssRUFBRTtnQkFDVixLQUFLLENBQUMsS0FBSyxHQUFHLGdCQUFnQixDQUFDO2FBQ2xDOztTQUVKLEVBQUU7WUFDQyxJQUFJLEVBQUUsUUFBUTtZQUNkLEtBQUssQ0FBQyxJQUFJLEVBQUU7Z0JBQ1IsT0FBTyxDQUFDLENBQUM7YUFDWjs7WUFFRCxTQUFTLENBQUMsSUFBSSxFQUFFOztnQkFFWixPQUFPLENBQUMsQ0FBQzthQUNaO1lBQ0QsTUFBTSxDQUFDLEtBQUssRUFBRTtnQkFDVixLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzthQUN2QjtTQUNKO0tBQ0osQ0FBQzs7O0lBR0YsS0FBSyxDQUFDLEtBQUssR0FBRyxXQUFXO1FBQ3JCLE9BQU8saUNBQWlDLEVBQUUsQ0FBQztLQUM5QyxDQUFDOztJQUVGLE9BQU8sS0FBSyxDQUFDO0NBQ2hCLENBQUMsQ0FBQzs7QUFFSCxJQUFJLEdBQUcsR0FBRyxpQ0FBaUMsRUFBRSxDQUFDO0FBQzlDLElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7O0FBRTVCLE1BQU0sU0FBUyxDQUFDO0lBQ1osV0FBVyxDQUFDLE1BQU0sRUFBRTtLQUNuQixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztLQUNkLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0tBQ2QsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7S0FDZCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztLQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztLQUNyQjs7SUFFRCxLQUFLLEVBQUU7UUFDSCxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDbkI7O0lBRUQsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNSLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ2xCOztJQUVELElBQUksR0FBRzs7UUFFSCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7O1FBRXJCLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRTtZQUNSLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNkLE9BQU8sQ0FBQyxDQUFDO1NBQ1o7O1FBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUM7O1FBRXhDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7O1FBRXpCLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sSUFBSSxDQUFDOztRQUU5QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxJQUFJLFlBQVksQ0FBQztRQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pDLFlBQVksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxVQUFVLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMvRCxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQztnQkFDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNWLEtBQUssQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzlDLENBQUMsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUMvRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNO29CQUNsQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNUO2dCQUNELFlBQVksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixNQUFNO2FBQ1Q7U0FDSjs7UUFFRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxHQUFHLFlBQVksQ0FBQyxDQUFDOztRQUU1RCxJQUFJLFlBQVksQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2Y7O1FBRUQsSUFBSSxHQUFHLEdBQUc7WUFDTixJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUk7WUFDdkIsSUFBSSxFQUFFLElBQUk7WUFDVixHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDaEIsTUFBTSxFQUFFLFlBQVk7WUFDcEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2xCLENBQUM7O1FBRUYsSUFBSSxDQUFDLE1BQU0sSUFBSSxZQUFZLENBQUM7UUFDNUIsSUFBSSxDQUFDLElBQUksSUFBSSxZQUFZLENBQUM7O1FBRTFCLE9BQU8sR0FBRyxDQUFDO0tBQ2Q7Q0FDSjs7QUNsUUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCQSxTQUFTLHFCQUFxQixDQUFDLEtBQUssQ0FBQzs7RUFFbkMsSUFBSSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUM7O0VBRTVCLEdBQUcsQ0FBQyxLQUFLLFlBQVksTUFBTSxDQUFDO0lBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsMENBQTBDLEVBQUM7SUFDeEQsT0FBTyxhQUFhLENBQUM7R0FDdEI7O0VBRUQsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOztFQUUzQyxJQUFJLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztFQUUxQyxTQUFTLFlBQVksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzdCLElBQUksS0FBSyxDQUFDO0lBQ1YsTUFBTSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDO01BQzlDLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksSUFBSSxHQUFHLENBQUM7UUFDeEIsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUNyQixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsU0FBUztPQUNWO01BQ0QsT0FBTztLQUNSO0dBQ0Y7O0VBRUQsU0FBUyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQzs7SUFFdkIsSUFBSSxLQUFLLENBQUM7O0lBRVYsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssS0FBSyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUM7O01BRTNDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDOztNQUVsQixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO01BQ3RCLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7TUFDL0IsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJ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Q0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDcEQ7O0NBRUQsSUFBSSxDQUFDLENBQUMsQ0FBQztFQUNOLE9BQU8sS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNwRDs7Q0FFRCxLQUFLLENBQUMsQ0FBQyxFQUFFO0VBQ1IsT0FBTyxJQUFJLE9BQU87R0FDakIsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDNUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDNUM7RUFDRDs7Ozs7Ozs7Q0FRRCxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0VBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7R0FDbkMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztHQUNsQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFB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LENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDbEQ7O0NBRUQsTUFBTSxHQUFHO0VBQ1IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNsRDs7Q0FFRCxPQUFPLENBQUMsQ0FBQyxDQUFDO0VBQ1QsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7R0FDekUsSUFBSSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsR0FBRyxDQUFDO0dBQzFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztHQUNoRCxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLElBQUksRUFBRTtHQUMvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtHQUN2QixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7R0FDWCxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRTtHQUN4QixFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUU7R0FDWCxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO0dBQ2pELEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRztHQUNaLFlBQVksR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDOzs7RUFHdkMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQzs7Ozs7RUFLakIsSUFBSSxZQUFZLEdBQUcsQ0FBQyxFQUFFO0dBQ3JCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDZixJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO0lBQ3RCLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEIsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3BDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ2xCLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0dBQ2YsSUFBSSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQzVDLEtBQUssSUFBSSxZQUFZLEtBQUssQ0FBQyxFQUFFO0dBQzdCLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0dBQzVDLElBQUksR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxD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QUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7R0FDaEIsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztHQUNoQixLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0dBQ2hCO0VBQ0Q7O0NBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQztFQUNWLEdBQUcsT0FBTyxLQUFLLENBQUMsSUFBSSxRQUFRLENBQUM7R0FDNUIsT0FBTyxJQUFJLEtBQUs7SUFDZixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUs7SUFDZCxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUs7SUFDZCxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUs7SUFDZCxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUs7SUFDZDtHQUNELElBQUk7R0FDSixPQUFPLElBQUksS0FBSztJQUNmLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDaEIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztJQUNoQixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQ2hCLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDaEI7R0FDRDtFQUNEOztDQUVELEdBQUcsQ0FBQyxLQUFLLENBQUM7RUFDVCxPQUFPLElBQUksS0FBSztJQUNkLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDaEIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztJQUNoQixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQ2hCLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7R0FDakI7RUFDRDs7Q0FFRCxRQUFRLEVBQUU7RUFDVCxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDaEU7O0NBRUQsVUFBVSxDQUFDLE1BQU0sQ0FBQzs7RUFFakIsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBQzs7RUFFdkIsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDWixPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSTs7O0dBR3RCLEtBQUssS0FBSztJQUNULEtBQUssQ0FBQyxJQUFJLEdBQUU7SUFDWixDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUM7SUFDL0IsS0FBSyxDQUFDLElBQUksR0FBRTtJQUNaLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBQztJQUMvQixLQUFLLENBQUMsSUFBSSxHQUFFO0lBQ1osQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFDO0lBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDbkIsTUFBTTs7R0FFTixLQUFLLE1BQU07SUFDVixLQUFLLENBQUMsSUFBSSxHQUFFO0lBQ1osQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFDO0lBQy9CLEtBQUssQ0FBQyxJQUFJLEdBQUU7SUFDWixDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUM7SUFDL0IsS0FBSyxDQUFDLElBQUksR0FBRTtJQUNaLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBQztJQUMvQixLQUFLLENBQUMsSUFBSSxHQUFFO0lBQ1osQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFDO0lBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ3JCLE1BQU07O0dBRU4sS0FBSyxHQUFHO0lBQ1AsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQztHQUMvQixNQUFNOztHQUVOOztJQUVDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7S0FDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7R0FDdEUsTUFBTTtHQUNOO0VBQ0Q7Q0FDRDs7QUFFRCxLQUFLLENBQUMsTUFBTSxHQUFHO0NBQ2QsYUFBYSxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQztDQUNoRCxPQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDO0NBQzFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztDQUM1QixPQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7Q0FDOUIsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDO0NBQzdCLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN4QixPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDL0IsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQy9CLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6QixNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDMUIsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0VBQzFCLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztFQUM5QixNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDNUIsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQzVCLFNBQVMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztFQUMvQixTQUFTLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7RUFDL0IsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ2hDLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUM5QixRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDNUIsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQzdCLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztFQUMzQixRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7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QUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O1FBRzdCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQzs7UUFFOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTTtZQUN6QyxJQUFJLElBQUksR0FBRyxHQUFFO1lBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztZQUNyQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2xCLEVBQUM7S0FDTDs7SUFFRCxNQUFNLENBQUMsSUFBSSxFQUFFOztRQUVULElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU87O1FBRTdCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7UUFFM0IsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUk7WUFDckIsS0FBSyxNQUFNO2dCQUNQLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkYsTUFBTTtZQUNWLEtBQUssTUFBTTtnQkFDUCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMs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
