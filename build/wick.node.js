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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ljay5ub2RlLmpzIiwic291cmNlcyI6WyIuLi9zb3VyY2UvY29tbW9uL3N0cmluZ19wYXJzaW5nL2xleGVyLmpzIiwiLi4vc291cmNlL2NvbW1vbi9zdHJpbmdfcGFyc2luZy90b2tlbml6ZXIuanMiLCIuLi9zb3VyY2UvY29tbW9uL3VybC91cmwuanMiLCIuLi9zb3VyY2UvbGlua2VyL3d1cmwuanMiLCIuLi9zb3VyY2Uvdmlldy5qcyIsIi4uL3NvdXJjZS9zY2hlZHVsZXIuanMiLCIuLi9zb3VyY2UvbW9kZWwvbW9kZWxfYmFzZS5qcyIsIi4uL3NvdXJjZS9zY2hlbWEvc2NoZW1hX3R5cGUuanMiLCIuLi9zb3VyY2UvbW9kZWwvbW9kZWxfY29udGFpbmVyLmpzIiwiLi4vc291cmNlL21vZGVsL2FycmF5X2NvbnRhaW5lci5qcyIsIi4uL3NvdXJjZS9tb2RlbC9idHJlZV9jb250YWluZXIuanMiLCIuLi9zb3VyY2Uvc2NoZW1hL251bWJlcl90eXBlLmpzIiwiLi4vc291cmNlL2NvbW1vbi9kYXRlX3RpbWUvbW9udGhzLmpzIiwiLi4vc291cmNlL2NvbW1vbi9kYXRlX3RpbWUvZGF5c19vZl93ZWVrLmpzIiwiLi4vc291cmNlL2NvbW1vbi9kYXRlX3RpbWUvZGF5X3N0YXJ0X2FuZF9lbmRfZXBvY2guanMiLCIuLi9zb3VyY2UvY29tbW9uL2RhdGVfdGltZS90aW1lLmpzIiwiLi4vc291cmNlL2NvbW1vbi9tYXRoL3BvaW50MkQuanMiLCIuLi9zb3VyY2UvY29tbW9uL21hdGgvcXVhZHJhdGljX2Jlemllci5qcyIsIi4uL3NvdXJjZS9jb21tb24vbWF0aC9jb25zdHMuanMiLCIuLi9zb3VyY2UvY29tbW9uL21hdGgvY3ViaWNfYmV6aWVyLmpzIiwiLi4vc291cmNlL2NvbW1vbi9ldmVudC90b3VjaF9zY3JvbGxlci5qcyIsIi4uL3NvdXJjZS9jb21tb24uanMiLCIuLi9zb3VyY2Uvc2NoZW1hL2RhdGVfdHlwZS5qcyIsIi4uL3NvdXJjZS9zY2hlbWEvdGltZV90eXBlLmpzIiwiLi4vc291cmNlL3NjaGVtYS9zdHJpbmdfdHlwZS5qcyIsIi4uL3NvdXJjZS9zY2hlbWEvYm9vbF90eXBlLmpzIiwiLi4vc291cmNlL3NjaGVtYS9zY2hlbWFzLmpzIiwiLi4vc291cmNlL21vZGVsL21vZGVsLmpzIiwiLi4vc291cmNlL2NvbnRyb2xsZXIuanMiLCIuLi9zb3VyY2UvZ2V0dGVyLmpzIiwiLi4vc291cmNlL3NldHRlci5qcyIsIi4uL3NvdXJjZS9saW5rZXIvcGFnZS5qcyIsIi4uL3NvdXJjZS9saW5rZXIvc2V0bGlua3MuanMiLCIuLi9zb3VyY2UvYW5pbWF0aW9uL2NvbG9yLmpzIiwiLi4vc291cmNlL2FuaW1hdGlvbi90cmFuc2Zvcm10by5qcyIsIi4uL3NvdXJjZS9hbmltYXRpb24vYW5pbWF0aW9uLmpzIiwiLi4vc291cmNlL2FuaW1hdGlvbi90cmFuc2l0aW9uL3RyYW5zaXRpb25lZXIuanMiLCIuLi9zb3VyY2UvY2FzZS9yaXZldC5qcyIsIi4uL3NvdXJjZS9saW5rZXIvY29tcG9uZW50LmpzIiwiLi4vc291cmNlL2Nhc2UvY2Fzc2V0dGUvY2Fzc2V0dGUuanMiLCIuLi9zb3VyY2UvY2FzZS9jYXNlLmpzIiwiLi4vc291cmNlL2Nhc2UvY2Fzc2V0dGUvZmlsdGVyLmpzIiwiLi4vc291cmNlL2Nhc2UvY2FzZV90ZW1wbGF0ZS5qcyIsIi4uL3NvdXJjZS9jYXNlL2Nhc2Vfc2tlbGV0b24uanMiLCIuLi9zb3VyY2UvZ2xvYmFsLmpzIiwiLi4vc291cmNlL2Nhc2UvY2Fzc2V0dGUvaW5wdXQuanMiLCIuLi9zb3VyY2UvY2FzZS9jYXNzZXR0ZS9mb3JtLmpzIiwiLi4vc291cmNlL2Nhc2UvdGFwcy90YXAuanMiLCIuLi9zb3VyY2UvY2FzZS9waXBlcy9waXBlLmpzIiwiLi4vc291cmNlL2Nhc2UvaW8vaW8uanMiLCIuLi9zb3VyY2UvY2FzZS9jYXNlX2NvbnN0cnVjdG9yX2FzdC5qcyIsIi4uL3NvdXJjZS9jYXNlL2Nhc2VfY29uc3RydWN0b3IuanMiLCIuLi9zb3VyY2UvbGlua2VyL2VsZW1lbnQuanMiLCIuLi9zb3VyY2UvbGlua2VyL2xpbmtlci5qcyIsIi4uL3NvdXJjZS93aWNrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBudWxsX3Rva2VuID0ge1xyXG4gICAgdHlwZTogXCJcIixcclxuICAgIHRleHQ6IFwiXCJcclxufTtcclxuXHJcbmNsYXNzIExleGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHRva2VuaXplcikge1xyXG4gICAgICAgIHRoaXMudGsgPSB0b2tlbml6ZXI7XHJcblxyXG4gICAgICAgIHRoaXMudG9rZW4gPSB0b2tlbml6ZXIubmV4dCgpO1xyXG5cclxuICAgICAgICB0aGlzLmhvbGQgPSBudWxsO1xyXG5cclxuICAgICAgICB3aGlsZSAodGhpcy50b2tlbiAmJiAodGhpcy50b2tlbi50eXBlID09PSBcIm5ld19saW5lXCIgfHwgdGhpcy50b2tlbi50eXBlID09PSBcIndoaXRlX3NwYWNlXCIgfHwgdGhpcy50b2tlbi50eXBlID09PSBcImdlbmVyaWNcIikpIHtcclxuICAgICAgICAgICAgdGhpcy50b2tlbiA9IHRoaXMudGsubmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpe1xyXG4gICAgICAgIHRoaXMudGsucmVzZXQoKTtcclxuICAgICAgICB0aGlzLnRva2VuID0gdGhpcy50ay5uZXh0KCk7XHJcbiAgICAgICAgdGhpcy5ob2xkID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhvbGQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50b2tlbiA9IHRoaXMuaG9sZDtcclxuICAgICAgICAgICAgdGhpcy5ob2xkID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMudG9rZW4pIHJldHVybiBudWxsO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgdGhpcy50b2tlbiA9IHRoaXMudGsubmV4dCgpO1xyXG4gICAgICAgIH0gd2hpbGUgKHRoaXMudG9rZW4gJiYgKHRoaXMudG9rZW4udHlwZSA9PT0gXCJuZXdfbGluZVwiIHx8IHRoaXMudG9rZW4udHlwZSA9PT0gXCJ3aGl0ZV9zcGFjZVwiIHx8IHRoaXMudG9rZW4udHlwZSA9PT0gXCJnZW5lcmljXCIpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudG9rZW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGFzc2VydCh0ZXh0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnRva2VuKSB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGluZyAke3RleHR9IGdvdCBudWxsYCk7XHJcblxyXG4gICAgICAgIHZhciBib29sID0gdGhpcy50b2tlbi50ZXh0ID09IHRleHQ7XHJcblxyXG5cclxuICAgICAgICBpZiAoYm9vbCkge1xyXG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RpbmcgXCIke3RleHR9XCIgZ290IFwiJHt0aGlzLnRva2VuLnRleHR9XCJgKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGJvb2w7XHJcbiAgICB9XHJcblxyXG4gICAgcGVlaygpIHtcclxuICAgICAgICBpZiAodGhpcy5ob2xkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhvbGQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmhvbGQgPSB0aGlzLnRrLm5leHQoKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmhvbGQpIHJldHVybiBudWxsX3Rva2VuO1xyXG5cclxuICAgICAgICB3aGlsZSAodGhpcy5ob2xkICYmICh0aGlzLmhvbGQudHlwZSA9PT0gXCJuZXdfbGluZVwiIHx8IHRoaXMuaG9sZC50eXBlID09PSBcIndoaXRlX3NwYWNlXCIgfHwgdGhpcy5ob2xkLnR5cGUgPT09IFwiZ2VuZXJpY1wiKSkge1xyXG4gICAgICAgICAgICB0aGlzLmhvbGQgPSB0aGlzLnRrLm5leHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmhvbGQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaG9sZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsX3Rva2VuO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0ZXh0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnRva2VuKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbi50ZXh0O1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0eXBlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnRva2VuKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbi50eXBlO1xyXG4gICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwb3MoKXtcclxuICAgICAgICBpZiAodGhpcy50b2tlbilcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW4ucG9zO1xyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcbiAgICBzbGljZShzdGFydCkge1xyXG4gICAgICAgIGlmICh0aGlzLnRva2VuKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ay5zdHJpbmcuc2xpY2Uoc3RhcnQsIHRoaXMudG9rZW4ucG9zKVxyXG4gICAgICAgIHJldHVybiB0aGlzLnRrLnN0cmluZy5zbGljZShzdGFydClcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHsgTGV4ZXIgfSIsIi8vQ29tcGFyZXMgY29kZSB3aXRoIGFyZ3VtZW50IGxpc3QgYW5kIHJldHVybnMgdHJ1ZSBpZiBtYXRjaCBpcyBmb3VuZCwgb3RoZXJ3aXNlIGZhbHNlIGlzIHJldHVybmVkXHJcbmZ1bmN0aW9uIGNvbXBhcmVDb2RlKGNvZGUpIHtcclxuICAgIHZhciBsaXN0ID0gYXJndW1lbnRzO1xyXG4gICAgZm9yICh2YXIgaSA9IDEsIGwgPSBsaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChsaXN0W2ldID09PSBjb2RlKSByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLy9SZXR1cm5zIHRydWUgaWYgY29kZSBsaWVzIGJldHdlZW4gdGhlIG90aGVyIHR3byBhcmd1bWVudHNcclxuZnVuY3Rpb24gaW5SYW5nZShjb2RlKSB7XHJcbiAgICByZXR1cm4gKGNvZGUgPiBhcmd1bWVudHNbMV0gJiYgY29kZSA8IGFyZ3VtZW50c1syXSk7XHJcbn1cclxuXHJcbi8vVGhlIHJlc3VsdGluZyBhcnJheSBpcyB1c2VkIHdoaWxlIHBhcnNpbmcgYW5kIHRva2VuaXppbmcgdG9rZW4gc3RyaW5nc1xyXG52YXIgc3RyaW5nX3BhcnNlX2FuZF9mb3JtYXRfZnVuY3Rpb25zID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGFycmF5ID0gW3tcclxuICAgICAgICAgICAgdHlwZTogXCJudW1iZXJcIixcclxuICAgICAgICAgICAgLy9Jbml0aWFsIGNoZWNrIGZ1bmN0aW9uLiBSZXR1cm4gaW5kZXggb2Zmc2V0IHRvIHN0YXJ0IGZvciBzY2FuLiBJZiAwIGlzIHJldHVybmVkIHRoZW4gdGhlIHBhcnNlciB3aWxsIG1vdmUgb24gdG8gdGhlIG5leHQgY2hlY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgY2hlY2soY29kZSwgdGV4dCwgb2Zmc2V0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5SYW5nZShjb2RlLCA0NywgNTgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29kZSA9IHRleHQuY2hhckNvZGVBdCgxICsgb2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGFyZUNvZGUoY29kZSwgNjYsIDk4LCA4OCwgMTIwLCA3OSwgMTExKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPT0gNDYpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2RlID0gdGV4dC5jaGFyQ29kZUF0KDEgKyBvZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpblJhbmdlKGNvZGUsIDQ3LCA1OCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChpblJhbmdlKGNvZGUsIDQ3LCA1OCkgfHwgY29kZSA9PT0gNDYpID8gLTEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLmNvbG9yID0gXCJyZ2IoMjAsNDAsMTgwKVwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJpZGVudGlmaWVyXCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoaW5SYW5nZShjb2RlLCA2NCwgOTEpIHx8IGluUmFuZ2UoY29kZSwgOTYsIDEyMykpID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChpblJhbmdlKGNvZGUsIDQ3LCA1OCkgfHwgaW5SYW5nZShjb2RlLCA2NCwgOTEpIHx8IGluUmFuZ2UoY29kZSwgOTYsIDEyMykgfHwgY29tcGFyZUNvZGUoY29kZSwgMzUsIDM2LCA0NSwgOTUpKSA/IC0xIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy90b2tlbi5jb2xvciA9IHJhbmRvbUNvbG9yKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwvKiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tbWVudFwiLFxyXG4gICAgICAgICAgICAvL0luaXRpYWwgY2hlY2sgZnVuY3Rpb24uIFJldHVybiBpbmRleCBvZmZzZXQgdG8gc3RhcnQgZm9yIHNjYW4uIElmIDAgaXMgcmV0dXJuZWQgdGhlbiB0aGUgcGFyc2VyIHdpbGwgbW92ZSBvbiB0byB0aGUgbmV4dCBjaGVjayBmdW5jdGlvblxyXG4gICAgICAgICAgICBjaGVjayhjb2RlLCB0ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKChjb2RlID09PSA0NykgJiYgKHRleHQuY2hhckNvZGVBdCgxKSA9PT0gNDcpKSA/IDIgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoaW5SYW5nZShjb2RlLCAzMiwgMTI4KSB8fCBjb2RlID09PSAzMiB8fCBjb2RlID09PSA5KSA/IC0xIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRva2VuKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sICove1xyXG4gICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxyXG4gICAgICAgICAgICAvL0luaXRpYWwgY2hlY2sgZnVuY3Rpb24uIFJldHVybiBpbmRleCBvZmZzZXQgdG8gc3RhcnQgZm9yIHNjYW4uIElmIDAgaXMgcmV0dXJuZWQgdGhlbiB0aGUgcGFyc2VyIHdpbGwgbW92ZSBvbiB0byB0aGUgbmV4dCBjaGVjayBmdW5jdGlvblxyXG4gICAgICAgICAgICBjaGVjayhjb2RlLCB0ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGNvZGUgPT09IDM0KSA/IDEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoY29kZSA9PT0gMzQpID8gMSA6IC0xO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRva2VuKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJ3aGl0ZV9zcGFjZVwiLFxyXG4gICAgICAgICAgICAvL0luaXRpYWwgY2hlY2sgZnVuY3Rpb24uIFJldHVybiBpbmRleCBvZmZzZXQgdG8gc3RhcnQgZm9yIHNjYW4uIElmIDAgaXMgcmV0dXJuZWQgdGhlbiB0aGUgcGFyc2VyIHdpbGwgbW92ZSBvbiB0byB0aGUgbmV4dCBjaGVjayBmdW5jdGlvblxyXG4gICAgICAgICAgICBjaGVjayhjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGNvZGUgPT09IDMyIHx8IGNvZGUgPT09IDkpID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChjb2RlID09PSAzMiB8fCBjb2RlID09PSA5KSA/IC0xIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRva2VuKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJuZXdfbGluZVwiLFxyXG4gICAgICAgICAgICAvL0luaXRpYWwgY2hlY2sgZnVuY3Rpb24uIFJldHVybiBpbmRleCBvZmZzZXQgdG8gc3RhcnQgZm9yIHNjYW4uIElmIDAgaXMgcmV0dXJuZWQgdGhlbiB0aGUgcGFyc2VyIHdpbGwgbW92ZSBvbiB0byB0aGUgbmV4dCBjaGVjayBmdW5jdGlvblxyXG4gICAgICAgICAgICBjaGVjayhjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGNvZGUgPT09IDEwKSA/IDEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9rZW4pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwib3Blbl9icmFja2V0XCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wYXJlQ29kZShjb2RlLCAxMjMsIDQwLCA5MSkgPyAxIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvL1NpbmdsZSBjaGFyYWN0ZXIsIGVuZCBjb21lcyBpbW1lZGlhdGx5XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi5jb2xvciA9IFwicmdiKDEwMCwxMDAsMTAwKVwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJjbG9zZV9icmFja2V0XCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wYXJlQ29kZShjb2RlLCAxMjUsIDQxLCA5MykgPyAxIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvL1NpbmdsZSBjaGFyYWN0ZXIsIGVuZCBjb21lcyBpbW1lZGlhdGx5XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi5jb2xvciA9IFwicmdiKDEwMCwxMDAsMTAwKVwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogXCJPcGVyYXRvclwiLFxyXG4gICAgICAgICAgICAvL0luaXRpYWwgY2hlY2sgZnVuY3Rpb24uIFJldHVybiBpbmRleCBvZmZzZXQgdG8gc3RhcnQgZm9yIHNjYW4uIElmIDAgaXMgcmV0dXJuZWQgdGhlbiB0aGUgcGFyc2VyIHdpbGwgbW92ZSBvbiB0byB0aGUgbmV4dCBjaGVjayBmdW5jdGlvblxyXG4gICAgICAgICAgICBjaGVjayhjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcGFyZUNvZGUoY29kZSwgNDIsIDQzLCA2MCwgNjEsIDYyLCA5MiwgMzgsIDM3LCAzMywgOTQsIDEyNCwgNTgpID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgLy9TaW5nbGUgY2hhcmFjdGVyLCBlbmQgY29tZXMgaW1tZWRpYXRseVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4uY29sb3IgPSBcInJnYigyMDUsMTIwLDApXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcIlN5bWJvbFwiLCAvL0V2ZXJ5dGhpbmcgZWxzZSBzaG91bGQgYmUgZ2VuZXJpYyBzeW1ib2xzXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIC8vR2VuZXJpYyB3aWxsIGNhcHR1cmUgQU5ZIHJlbWFpbmRlciBjaGFyYWN0ZXIgc2V0cy5cclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLmNvbG9yID0gXCJyZWRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIF07XHJcblxyXG4gICAgLy9UaGlzIGFsbG93cyBmb3IgY3JlYXRpb24gY3VzdG9tIHBhcnNlcnMgYW5kIGZvcm1hdHRlcnMgYmFzZWQgdXBvbiB0aGlzIG9iamVjdC5cclxuICAgIGFycmF5LmNsb25lID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmluZ19wYXJzZV9hbmRfZm9ybWF0X2Z1bmN0aW9ucygpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gYXJyYXk7XHJcbn0pO1xyXG5cclxudmFyIFNQRiA9IHN0cmluZ19wYXJzZV9hbmRfZm9ybWF0X2Z1bmN0aW9ucygpO1xyXG52YXIgU1BGX2xlbmd0aCA9IFNQRi5sZW5ndGg7XHJcblxyXG5jbGFzcyBUb2tlbml6ZXIge1xyXG4gICAgY29uc3RydWN0b3Ioc3RyaW5nKSB7XHJcbiAgICBcdHRoaXMuaCA9IG51bGw7XHJcblx0ICAgIHRoaXMubGluZSA9IDA7XHJcblx0ICAgIHRoaXMuY2hhciA9IDA7XHJcblx0ICAgIHRoaXMub2Zmc2V0ID0gMDtcclxuXHQgICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXQoKXtcclxuICAgICAgICB0aGlzLmxpbmUgPSAwO1xyXG4gICAgICAgIHRoaXMuY2hhciA9IDA7XHJcbiAgICAgICAgdGhpcy5vZmZzZXQgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGhvbGQodG9rZW4pIHtcclxuICAgICAgICB0aGlzLmggPSB0b2tlbjtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KCkge1xyXG5cclxuICAgICAgICB2YXIgdG9rZW5fbGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaCkge1xyXG4gICAgICAgICAgICB2YXIgdCA9IHRoaXMuaDtcclxuICAgICAgICAgICAgdGhpcy5oID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zdHJpbmcubGVuZ3RoIDwgMSkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGxldCBvZmZzZXQgPSB0aGlzLm9mZnNldDtcclxuICAgICAgICBcclxuICAgICAgICBpZiAob2Zmc2V0ID49IHRoaXMuc3RyaW5nLmxlbmd0aCkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIHZhciBjb2RlID0gdGhpcy5zdHJpbmcuY2hhckNvZGVBdChvZmZzZXQpO1xyXG4gICAgICAgIGxldCBTUEZfZnVuY3Rpb247XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBTUEZfbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgU1BGX2Z1bmN0aW9uID0gU1BGW2ldO1xyXG4gICAgICAgICAgICBsZXQgdGVzdF9pbmRleCA9IFNQRl9mdW5jdGlvbi5jaGVjayhjb2RlLCB0aGlzLnN0cmluZywgb2Zmc2V0KTtcclxuICAgICAgICAgICAgaWYgKHRlc3RfaW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSBTUEZfZnVuY3Rpb24udHlwZTtcclxuICAgICAgICAgICAgICAgIHZhciBlID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IHRlc3RfaW5kZXg7IGkgPCB0aGlzLnN0cmluZy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGUgPSBTUEZfZnVuY3Rpb24uc2NhblRvRW5kKHRoaXMuc3RyaW5nLmNoYXJDb2RlQXQoaSArIG9mZnNldCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlID4gLTEpIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGUgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdG9rZW5fbGVuZ3RoID0gaSArIGU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHRlbXAgPSB0aGlzLnN0cmluZy5zbGljZShvZmZzZXQsIG9mZnNldCArIHRva2VuX2xlbmd0aCk7XHJcblxyXG4gICAgICAgIGlmIChTUEZfZnVuY3Rpb24udHlwZSA9PT0gXCJuZXdfbGluZVwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhciA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMubGluZSsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG91dCA9IHtcclxuICAgICAgICAgICAgdHlwZTogU1BGX2Z1bmN0aW9uLnR5cGUsXHJcbiAgICAgICAgICAgIHRleHQ6IHRlbXAsXHJcbiAgICAgICAgICAgIHBvczogdGhpcy5vZmZzZXQsXHJcbiAgICAgICAgICAgIGxlbmd0aDogdG9rZW5fbGVuZ3RoLFxyXG4gICAgICAgICAgICBjaGFyOiB0aGlzLmNoYXIsXHJcbiAgICAgICAgICAgIGxpbmU6IHRoaXMubGluZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub2Zmc2V0ICs9IHRva2VuX2xlbmd0aDtcclxuICAgICAgICB0aGlzLmNoYXIgKz0gdG9rZW5fbGVuZ3RoO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1Rva2VuaXplcn1cclxuIiwiaW1wb3J0IHtMZXhlcn0gZnJvbSBcIi4uL3N0cmluZ19wYXJzaW5nL2xleGVyXCJcclxuaW1wb3J0IHtUb2tlbml6ZXJ9IGZyb20gXCIuLi9zdHJpbmdfcGFyc2luZy90b2tlbml6ZXJcIlxyXG5cclxuLyoqXHJcblVSTCBRdWVyeSBTeW50YXhcclxuXHJcbnJvb3QgPT4gW3Jvb3RfY2xhc3NdIFsmIFtjbGFzc2VzXV1cclxuICAgICA9PiBbY2xhc3Nlc11cclxuXHJcbnJvb3RfY2xhc3MgPSBrZXlfbGlzdFxyXG5cclxuY2xhc3NfbGlzdCBbY2xhc3MgWyYgY2xhc3NfbGlzdF1dXHJcblxyXG5jbGFzcyA9PiBuYW1lICYga2V5X2xpc3RcclxuXHJcbmtleV9saXN0ID0+IFtrZXlfdmFsIFsmIGtleV9saXN0XV1cclxuXHJcbmtleV92YWwgPT4gbmFtZSA9IHZhbFxyXG5cclxubmFtZSA9PiBBTFBIQU5VTUVSSUNfSURcclxuXHJcbnZhbCA9PiBOVU1CRVJcclxuICAgID0+IEFMUEhBTlVNRVJJQ19JRFxyXG4qL1xyXG5mdW5jdGlvbiBRdWVyeVN0cmluZ1RvUXVlcnlNYXAocXVlcnkpe1xyXG5cclxuICBsZXQgbWFwcGVkX29iamVjdCA9IG5ldyBNYXA7XHJcblxyXG4gIGlmKCFxdWVyeSBpbnN0YW5jZW9mIFN0cmluZyl7XHJcbiAgICBjb25zb2xlLndhcm4oXCJxdWVyeSBhcmd1bWVudCBwcm92aWRlZCBpcyBub3QgYSBzdHJpbmchXCIpXHJcbiAgICByZXR1cm4gbWFwcGVkX29iamVjdDtcclxuICB9XHJcblxyXG4gIGlmKHF1ZXJ5WzBdID09IFwiP1wiKSBxdWVyeSA9IHF1ZXJ5LnNsaWNlKDEpO1xyXG5cclxuICBsZXQgbGV4ID0gbmV3IExleGVyKG5ldyBUb2tlbml6ZXIocXVlcnkpKTtcclxuXHJcbiAgZnVuY3Rpb24ga2V5X3ZhbF9saXN0KGxleCwgbWFwKXtcclxuICAgIGxldCB0b2tlbjtcclxuICAgIHdoaWxlKCh0b2tlbiA9IGxleC50b2tlbikgJiYgdG9rZW4udGV4dCAhPT0gXCImXCIpe1xyXG4gICAgICBpZihsZXgucGVlaygpLnRleHQgPT0gXCI9XCIpe1xyXG4gICAgICAgIGxldCBrZXkgPSB0b2tlbi50ZXh0O1xyXG4gICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICBsZXQgdmFsID0gbGV4LnRva2VuO1xyXG4gICAgICAgIG1hcC5zZXQoa2V5LCAodmFsLnR5cGUgPT0gXCJudW1iZXJcIik/cGFyc2VGbG9hdCh2YWwudGV4dCk6dmFsLnRleHQpO1xyXG4gICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjbGFzc18obGV4LCBtYXApe1xyXG5cclxuICAgIGxldCB0b2tlbjtcclxuXHJcbiAgICBpZigodG9rZW4gPSBsZXgucGVlaygpKSAmJiB0b2tlbi50ZXh0ID09IFwiJlwiKXtcclxuXHJcbiAgICAgIHRva2VuID0gbGV4LnRva2VuO1xyXG5cclxuICAgICAgbGV4Lm5leHQoKTtsZXgubmV4dCgpO1xyXG4gICAgICBtYXAuc2V0KHRva2VuLnRleHQsIG5ldyBNYXAoKSk7XHJcbiAgICAgIGtleV92YWxfbGlzdChsZXgsbWFwLmdldCh0b2tlbi50ZXh0KSk7XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByb290KGxleCxtYXApe1xyXG4gICAgICAgbWFwLnNldChudWxsLCBuZXcgTWFwKCkpO1xyXG5cclxuICAgICAgaWYobGV4LnBlZWsoKS50ZXh0ID09IFwiJlwiKXtcclxuICAgICAgICAgIGNsYXNzXyhsZXgsIG1hcClcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBrZXlfdmFsX2xpc3QobGV4LCBtYXAuZ2V0KG51bGwpKTtcclxuICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgd2hpbGUobGV4LnRva2VuICYmIGxleC50b2tlbi50ZXh0ID09XCImXCIpe1xyXG4gICAgICBsZXgubmV4dCgpO1xyXG4gICAgICBjbGFzc18obGV4LCBtYXApXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByb290KGxleCwgbWFwcGVkX29iamVjdCk7XHJcbiAgcmV0dXJuIG1hcHBlZF9vYmplY3Q7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFF1ZXJ5TWFwVG9RdWVyeVN0cmluZyhtYXApe1xyXG4gICAgbGV0IGNsYXNzXywgbnVsbF9jbGFzcyxzdHIgPVwiXCI7XHJcbiAgICBpZigobnVsbF9jbGFzcyA9IG1hcC5nZXQobnVsbCkpKXtcclxuICAgICAgICBpZihudWxsX2NsYXNzLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICBmb3IobGV0IFtrZXksdmFsXSBvZiBudWxsX2NsYXNzLmVudHJpZXMoKSl7XHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gYCYke2tleX09JHt2YWx9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IFtrZXksY2xhc3NfXSBvZiBtYXAuZW50cmllcygpKXtcclxuICAgICAgICAgICAgaWYoa2V5ID09IG51bGwpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBzdHIgKz0gYCYke2tleX1gXHJcbiAgICAgICAgICAgIGZvcihsZXQgW2tleSx2YWxdIG9mIGNsYXNzXy5lbnRyaWVzKCkpe1xyXG4gICAgICAgICAgICAgICAgc3RyICs9IGAmJHtrZXl9PSR7dmFsfWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0ci5zbGljZSgxKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzdHI7XHJcbn1cclxuZnVuY3Rpb24gVHVybkRhdGFJbnRvUXVlcnkoZGF0YSkge1xyXG4gICAgdmFyIHN0ciA9IFwiXCI7XHJcblxyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBhcmd1bWVudHNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF0YS5jb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdfc3RyID0gYCR7ZGF0YS5jb21wb25lbnR9JmA7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIG5ld19zdHIgKz0gKGEgIT0gXCJjb21wb25lbnRcIikgPyBgJHthfT0ke2RhdGFbYV19XFwmYCA6IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RyICs9IG5ld19zdHIuc2xpY2UoMCwgLTEpICsgXCIuXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBlbHNlXHJcbiAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKVxyXG4gICAgICAgICAgICBzdHIgKz0gYCR7YX09JHtkYXRhW2FdfVxcJmA7XHJcblxyXG4gICAgcmV0dXJuIHN0ci5zbGljZSgwLCAtMSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFR1cm5RdWVyeUludG9EYXRhKHF1ZXJ5KSB7XHJcbiAgICB2YXIgb3V0ID0ge307XHJcblxyXG4gICAgbGV0IHQgPSBxdWVyeS5zcGxpdChcIi5cIik7XHJcblxyXG4gICAgaWYgKHQubGVuZ3RoID4gMClcclxuICAgICAgICB0LmZvckVhY2goKGEpID0+IHtcclxuICAgICAgICAgICAgdmFyIHQgPSB7fTtcclxuICAgICAgICAgICAgaWYgKGEubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgYS5zcGxpdChcIiZcIikuZm9yRWFjaCgoYSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpIDwgMSkgb3V0W2FdID0gdDtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGIgPSBhLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0W2JbMF1dID0gYlsxXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHF1ZXJ5LnNwbGl0KFwiJlwiKS5mb3JFYWNoKChhKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBiID0gYS5zcGxpdChcIj1cIik7XHJcbiAgICAgICAgICAgIG91dFtiWzBdXSA9IGJbMV1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJldHVybiBvdXQ7XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBUdXJuUXVlcnlJbnRvRGF0YSxcclxuICAgIFR1cm5EYXRhSW50b1F1ZXJ5LFxyXG4gICAgUXVlcnlNYXBUb1F1ZXJ5U3RyaW5nLFxyXG4gICAgUXVlcnlTdHJpbmdUb1F1ZXJ5TWFwXHJcbn1cclxuIiwiaW1wb3J0IHtcclxuICAgIFR1cm5RdWVyeUludG9EYXRhLFxyXG4gICAgVHVybkRhdGFJbnRvUXVlcnksXHJcbiAgICBRdWVyeVN0cmluZ1RvUXVlcnlNYXAsXHJcbiAgICBRdWVyeU1hcFRvUXVlcnlTdHJpbmdcclxufSBmcm9tIFwiLi4vY29tbW9uL3VybC91cmxcIlxyXG5cclxuY2xhc3MgV1VSTCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihsb2NhdGlvbil7XHJcbiAgICAgICAgLy9wYXJzZSB0aGUgdXJsIGludG8gZGlmZmVyZW50IHNlY3Rpb25zXHJcbiAgICAgICAgdGhpcy5wYXRoID0gbG9jYXRpb24ucGF0aG5hbWU7XHJcbiAgICAgICAgdGhpcy5ob3N0ID0gbG9jYXRpb24uaG9zdG5hbWU7XHJcbiAgICAgICAgdGhpcy5xdWVyeSA9IFF1ZXJ5U3RyaW5nVG9RdWVyeU1hcChsb2NhdGlvbi5zZWFyY2guc2xpY2UoMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFBhdGgocGF0aCl7XHJcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgICAgICB0aGlzLnNldExvY2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TG9jYXRpb24oKXtcclxuICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSxcInJlcGxhY2VkIHN0YXRlXCIsYCR7dGhpc31gKTtcclxuICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMucGF0aH0/JHtRdWVyeU1hcFRvUXVlcnlTdHJpbmcodGhpcy5xdWVyeSl9YDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDbGFzcyhjbGFzc19uYW1lKXtcclxuXHJcbiAgICAgICAgaWYoIWNsYXNzX25hbWUpIGNsYXNzX25hbWUgPSBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBvdXQgPSB7fSwgY2xhc3NfO1xyXG5cclxuICAgICAgICBpZihjbGFzc18gPSB0aGlzLnF1ZXJ5LmdldChjbGFzc19uYW1lKSl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgW2tleSwgdmFsXSBvZiBjbGFzc18uZW50cmllcygpKXtcclxuICAgICAgICAgICAgICAgIG91dFtrZXldID0gdmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldChjbGFzc19uYW1lLCBrZXlfbmFtZSwgdmFsdWUpe1xyXG5cclxuICAgICAgICBpZighY2xhc3NfbmFtZSkgY2xhc3NfbmFtZSA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmKCF0aGlzLnF1ZXJ5LmhhcyhjbGFzc19uYW1lKSkgdGhpcy5xdWVyeS5zZXQoY2xhc3NfbmFtZSwgbmV3IE1hcCgpKTtcclxuXHJcbiAgICAgICAgbGV0IGNsYXNzXyA9IHRoaXMucXVlcnkuZ2V0KGNsYXNzX25hbWUpO1xyXG5cclxuICAgICAgICBjbGFzc18uc2V0KGtleV9uYW1lLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TG9jYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoY2xhc3NfbmFtZSwga2V5X25hbWUpe1xyXG4gICAgICAgIGlmKCFjbGFzc19uYW1lKSBjbGFzc19uYW1lID0gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IGNsYXNzXyA9IHRoaXMucXVlcnkuZ2V0KGNsYXNzX25hbWUpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChjbGFzc18pID8gY2xhc3NfLmdldChrZXlfbmFtZSkgOiBudWxsOyAgXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuICAgIFdVUkxcclxufVxyXG4iLCIvL1VwZGF0ZXMgVUlcclxuLy9VcGRhdGVkIEJ5IE1vZGVsXHJcblxyXG5jbGFzcyBWaWV3e1xyXG5cdGNvbnN0cnVjdG9yKCl7XHJcblx0XHR0aGlzLm5leHQgPSBudWxsO1xyXG5cdFx0dGhpcy5tb2RlbCA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRkZXN0cnVjdG9yKCl7XHJcblx0XHRpZih0aGlzLm1vZGVsKXtcclxuXHRcdFx0dGhpcy5tb2RlbC5yZW1vdmVWaWV3KHRoaXMpO1xyXG5cdFx0fVxyXG5cdH1cdFxyXG5cdC8qKlxyXG5cdFx0Q2FsbGVkIGEgTW9kZWwgd2hlbiBpdHMgZGF0YSBoYXMgY2hhbmdlZC5cclxuXHQqL1xyXG5cdHVwZGF0ZShkYXRhKXtcclxuXHJcblx0fVxyXG5cdC8qKlxyXG5cdFx0Q2FsbGVkIGJ5IGEgTW9kZWxDb250YWluZXIgd2hlbiBhbiBpdGVtIGhhcyBiZWVuIHJlbW92ZWQuXHJcblx0Ki9cclxuXHRyZW1vdmVkKGRhdGEpe1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdFx0Q2FsbGVkIGJ5IGEgTW9kZWxDb250YWluZXIgd2hlbiBhbiBpdGVtIGhhcyBiZWVuIGFkZGVkLlxyXG5cdCovXHJcblx0YWRkZWQoZGF0YSl7XHJcblxyXG5cdH1cclxuXHRzZXRNb2RlbChtb2RlbCl7XHJcblx0fVxyXG5cclxuXHRyZXNldCgpe1xyXG5cdFx0XHJcblx0fVxyXG5cdHVuc2V0TW9kZWwoKXtcclxuXHRcdHRoaXMubmV4dCA9IG51bGw7XHJcblx0XHR0aGlzLm1vZGVsID0gbnVsbDtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydHtWaWV3fSIsImNvbnN0IGNhbGxlciA9ICh3aW5kb3cgJiYgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkgPyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIDogKGYpID0+IHtcclxuICAgIHNldFRpbWVvdXQoZiwgMSlcclxufTtcclxuLyoqIFxyXG4gICAgVGhlIFNjaGVkdWxlciBoYW5kbGVzIHVwZGF0aW5nIG9iamVjdHMuIEl0IGRvZXMgdGhpcyBieSBzcGxpdHRpbmcgdXAgdXBkYXRlIGN5Y2xlcywgXHJcbiAgICB0byByZXNwZWN0IHRoZSBicm93c2VyIGV2ZW50IG1vZGVsLiBcclxuXHJcbiAgICBJZiBhbnkgb2JqZWN0IGlzIHNjaGVkdWxlZCB0byBiZSB1cGRhdGVkLCBpdCB3aWxsIGJlIGJsb2NrZWQgZnJvbSBzY2hlZHVsaW5nIG1vcmUgdXBkYXRlcyBcclxuICAgIHVudGlsIGl0cyBvd24gdXBkYXRlIG1ldGhvZCBpcyBjYWxsZWQuXHJcbiovXHJcblxyXG5jb25zdCBTY2hlZHVsZXIgPSBuZXcoY2xhc3Mge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZV9xdWV1ZV9hID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVfcXVldWVfYiA9IG5ldyBBcnJheSgpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZV9xdWV1ZSA9IHRoaXMudXBkYXRlX3F1ZXVlX2E7XHJcblxyXG4gICAgICAgIHRoaXMucXVldWVfc3dpdGNoID0gMDtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSAoKSA9PiB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmZyYW1lX3RpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX19fU0NIRURVTEVEX19fXyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHF1ZXVlVXBkYXRlKG9iamVjdCkge1xyXG5cclxuICAgICAgICBpZiAob2JqZWN0Ll9fX19TQ0hFRFVMRURfX19fIHx8ICFvYmplY3QudXBkYXRlIGluc3RhbmNlb2YgRnVuY3Rpb24pXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9fX19TQ0hFRFVMRURfX19fKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGVyKHRoaXMuY2FsbGJhY2spO1xyXG5cclxuICAgICAgICBvYmplY3QuX19fX1NDSEVEVUxFRF9fX18gPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZV9xdWV1ZS5wdXNoKG9iamVjdCk7XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5fX19fU0NIRURVTEVEX19fXylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLl9fX19TQ0hFRFVMRURfX19fID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY2FsbGVyKHRoaXMuY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fX19fU0NIRURVTEVEX19fXyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgdXEgPSB0aGlzLnVwZGF0ZV9xdWV1ZTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5xdWV1ZV9zd2l0Y2ggPT0gMClcclxuICAgICAgICAgICAgKHRoaXMudXBkYXRlX3F1ZXVlID0gdGhpcy51cGRhdGVfcXVldWVfYiwgdGhpcy5xdWV1ZV9zd2l0Y2ggPSAxKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICh0aGlzLnVwZGF0ZV9xdWV1ZSA9IHRoaXMudXBkYXRlX3F1ZXVlX2EsIHRoaXMucXVldWVfc3dpdGNoID0gMCk7XHJcblxyXG4gICAgICAgIGxldCB0aW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgICAgIGxldCBkaWZmID0gdGltZSAtIHRoaXMuZnJhbWVfdGltZTtcclxuXHJcbiAgICAgICAgdGhpcy5mcmFtZV90aW1lID0gdGltZTtcclxuXHJcbiAgICAgICAgbGV0IHN0ZXBfcmF0aW8gPSAoZGlmZiAqIDAuMDYpOyAvLyAgc3RlcF9yYXRpbyBvZiAxID0gMTYuNjY2NjY2NjYgb3IgMTAwMCAvIDYwIGZvciA2MCBGUFNcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB1cS5sZW5ndGgsIG8gPSB1cVswXTsgaSA8IGw7IG8gPSB1cVsrK2ldKXtcclxuICAgICAgICAgICAgby5fX19fU0NIRURVTEVEX19fXyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBvLnVwZGF0ZShzdGVwX3JhdGlvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVxLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbn0pKClcclxuXHJcbmV4cG9ydCB7XHJcbiAgICBTY2hlZHVsZXJcclxufSIsImltcG9ydCB7XHJcblx0Vmlld1xyXG59IGZyb20gXCIuLi92aWV3XCJcclxuaW1wb3J0IHtcclxuXHRTY2hlZHVsZXJcclxufSBmcm9tIFwiLi4vc2NoZWR1bGVyXCJcclxuXHJcblxyXG5jbGFzcyBNb2RlbEJhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG4gICBcdFx0dGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fID0gW107XHJcblx0fTtcclxuXHJcblx0ZGVzdHJ1Y3RvcigpIHtcclxuXHRcdGRlYnVnZ2VyXHJcbiAgICAgICAgLy9pbmZvcm0gdmlld3Mgb2YgdGhlIG1vZGVscyBkZW1pc2VcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXMuZmlyc3RfdmlldztcclxuXHJcbiAgICAgICAgd2hpbGUgKHZpZXcpIHtcclxuICAgICAgICAgICAgdmlldy51bnNldE1vZGVsKCk7XHJcbiAgICAgICAgICAgIHZpZXcgPSB2aWV3Lm5leHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3RoaXMuZmlyc3RfdmlldyA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fXyA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRnZXQgKCl7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHRcdFxyXG5cdCovXHJcblxyXG4gICAgc2NoZWR1bGVVcGRhdGUoY2hhbmdlZF92YWx1ZSkge1xyXG4gICAgXHRpZighdGhpcy5maXJzdF92aWV3KVxyXG4gICAgXHRcdHJldHVybjtcclxuXHJcbiAgICBcdHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fXy5wdXNoKGNoYW5nZWRfdmFsdWUpO1xyXG5cclxuICAgICAgICBTY2hlZHVsZXIucXVldWVVcGRhdGUodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hhbmdlZChwcm9wX25hbWUpIHtcclxuXHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgaWYgKHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fX1tpXSA9PSBwcm9wX25hbWUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1twcm9wX25hbWVdO1xyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoc3RlcCkge1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXdzKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLl9fX19jaGFuZ2VkX3ZhbHVlc19fX18ubGVuZ3RoID0gMDtcclxuICAgIH1cclxuXHJcblx0LyoqXHJcblx0XHRBZGRzIGEgdmlldyB0byB0aGUgbGlua2VkIGxpc3Qgb2Ygdmlld3Mgb24gdGhlIG1vZGVsLiBhcmd1bWVudCB2aWV3IE1VU1QgYmUgYW4gaW5zdGFuY2Ugb2YgVmlldy4gXHJcblx0Ki9cclxuXHRhZGRWaWV3KHZpZXcpIHtcclxuXHRcdFxyXG5cdFx0aWYgKHZpZXcgaW5zdGFuY2VvZiBWaWV3KSB7XHJcblx0XHRcdGlmICh2aWV3Lm1vZGVsKVxyXG5cdFx0XHRcdHZpZXcubW9kZWwucmVtb3ZlVmlldyh2aWV3KTtcclxuXHJcblx0XHRcdHZhciBjaGlsZF92aWV3ID0gdGhpcy5maXJzdF92aWV3O1xyXG5cclxuXHRcdFx0d2hpbGUgKGNoaWxkX3ZpZXcpIHtcclxuXHRcdFx0XHRpZiAodmlldyA9PSBjaGlsZF92aWV3KSByZXR1cm47XHJcblx0XHRcdFx0Y2hpbGRfdmlldyA9IGNoaWxkX3ZpZXcubmV4dDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmlldy5tb2RlbCA9IHRoaXM7XHJcblx0XHRcdHZpZXcubmV4dCA9IHRoaXMuZmlyc3RfdmlldztcclxuXHRcdFx0dGhpcy5maXJzdF92aWV3ID0gdmlldztcclxuXHJcblx0XHRcdHZpZXcuc2V0TW9kZWwodGhpcyk7XHJcblx0XHRcdHZpZXcudXBkYXRlKHRoaXMuZ2V0KCkpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHRocm93IG5ldyBFeGNlcHRpb24oXCJQYXNzZWQgaW4gdmlldyBpcyBub3QgYW4gaW5zdGFuY2Ugb2Ygd2ljay5WaWV3IVwiKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdFx0UmVtb3ZlcyB2aWV3IGZyb20gc2V0IG9mIHZpZXdzIGlmIHRoZSBwYXNzZWQgaW4gdmlldyBpcyBhIG1lbWJlciBvZiBtb2RlbC4gXHJcblx0Ki9cclxuXHRyZW1vdmVWaWV3KHZpZXcpIHtcclxuXHRcdGlmICh2aWV3IGluc3RhbmNlb2YgVmlldyAmJiB2aWV3Lm1vZGVsID09IHRoaXMpIHtcclxuXHRcdFx0dmFyIGNoaWxkX3ZpZXcgPSB0aGlzLmZpcnN0X3ZpZXc7XHJcblx0XHRcdHZhciBwcmV2X2NoaWxkID0gbnVsbDtcclxuXHJcblx0XHRcdHdoaWxlIChjaGlsZF92aWV3KSB7XHJcblx0XHRcdFx0aWYgKHZpZXcgPT0gY2hpbGRfdmlldykge1xyXG5cclxuXHRcdFx0XHRcdGlmIChwcmV2X2NoaWxkKSB7XHJcblx0XHRcdFx0XHRcdHByZXZfY2hpbGQubmV4dCA9IHZpZXcubmV4dDtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZmlyc3RfdmlldyA9IHZpZXcubmV4dDtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR2aWV3Lm5leHQgPSBudWxsXHJcblx0XHRcdFx0XHR2aWV3Lm1vZGVsID0gbnVsbDtcclxuXHRcdFx0XHRcdHZpZXcucmVzZXQoKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRwcmV2X2NoaWxkID0gY2hpbGRfdmlldztcclxuXHRcdFx0XHRjaGlsZF92aWV3ID0gY2hpbGRfdmlldy5uZXh0O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL2RlYnVnZ2VyXHJcblx0XHR9XHJcblx0XHRjb25zb2xlLndhcm4oXCJWaWV3IG5vdCBhIG1lbWJlciBvZiBNb2RlbCFcIiwgdmlldyk7XHJcblx0fVxyXG5cdC8qKlxyXG5cdFx0Q2FsbHMgdXBkYXRlKCkgb24gZXZlcnkgdmlldyBvYmplY3QsIHBhc3NpbmcgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIE1vZGVsLlxyXG5cdCovXHRcclxuXHR1cGRhdGVWaWV3cygpIHtcclxuXHRcdHZhciB2aWV3ID0gdGhpcy5maXJzdF92aWV3O1xyXG5cclxuXHRcdHdoaWxlICh2aWV3KSB7XHJcblx0XHRcdFxyXG5cdFx0XHR2aWV3LnVwZGF0ZSh0aGlzLCB0aGlzLl9fX19jaGFuZ2VkX3ZhbHVlc19fX18pO1xyXG5cclxuXHRcdFx0XHJcblx0XHRcdHZpZXcgPSB2aWV3Lm5leHQ7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fXy5sZW5ndGggPSAwO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0XHRVcGRhdGVzIHZpZXdzIHdpdGggYSBsaXN0IG9mIG1vZGVscyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkLiBcclxuXHRcdFByaW1hcmlseSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggY29udGFpbmVyIGJhc2VkIHZpZXdzLCBzdWNoIGFzIENhc2VUZW1wbGF0ZXMuXHJcblx0Ki9cclxuXHR1cGRhdGVWaWV3c1JlbW92ZWQoZGF0YSkge1xyXG5cdFx0dmFyIHZpZXcgPSB0aGlzLmZpcnN0X3ZpZXc7XHJcblxyXG5cdFx0d2hpbGUgKHZpZXcpIHtcclxuXHRcdFx0XHJcblx0XHRcdHZpZXcucmVtb3ZlZChkYXRhKTtcclxuXHRcdFx0XHJcblx0XHRcdHZpZXcgPSB2aWV3Lm5leHQ7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHRcdFVwZGF0ZXMgdmlld3Mgd2l0aCBhIGxpc3Qgb2YgbW9kZWxzIHRoYXQgaGF2ZSBiZWVuIGFkZGVkLiBcclxuXHRcdFByaW1hcmlseSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggY29udGFpbmVyIGJhc2VkIHZpZXdzLCBzdWNoIGFzIENhc2VUZW1wbGF0ZXMuXHJcblx0Ki9cclxuXHR1cGRhdGVWaWV3c0FkZGVkKGRhdGEpIHtcclxuXHRcdHZhciB2aWV3ID0gdGhpcy5maXJzdF92aWV3O1xyXG5cclxuXHRcdHdoaWxlICh2aWV3KSB7XHJcblx0XHRcdFxyXG5cdFx0XHR2aWV3LmFkZGVkKGRhdGEpO1xyXG5cdFx0XHRcclxuXHRcdFx0dmlldyA9IHZpZXcubmV4dDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG4gICAgdG9Kc29uKCkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLG51bGwsICdcXHQnKTtcclxuICAgIH1cclxufVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZGVsQmFzZS5wcm90b3R5cGUsIFwiZmlyc3Rfdmlld1wiLCB7XHJcblx0d3JpdGFibGUgOiB0cnVlLFxyXG5cdGNvbmZpZ3VyYWJsZSA6IGZhbHNlLFxyXG5cdGVudW1lcmFibGUgOiBmYWxzZSxcclxufSlcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShNb2RlbEJhc2UucHJvdG90eXBlLCBcIl9fX19jaGFuZ2VkX3ZhbHVlc19fX19cIiwge1xyXG5cdHdyaXRhYmxlIDogdHJ1ZSxcclxuXHRjb25maWd1cmFibGUgOiBmYWxzZSxcclxuXHRlbnVtZXJhYmxlIDogZmFsc2UsXHJcbn0pXHJcblxyXG5cclxuT2JqZWN0LnNlYWwoTW9kZWxCYXNlLnByb3RvdHlwZSk7XHJcblxyXG5cclxuZXhwb3J0IHtcclxuXHRNb2RlbEJhc2VcclxufSIsIi8qKlxyXG5cdFNjaGVtYSB0eXBlLiBIYW5kbGVzIHRoZSBwYXJzaW5nLCB2YWxpZGF0aW9uLCBhbmQgZmlsdGVyaW5nIG9mIE1vZGVsIGRhdGEgcHJvcGVydGllcy4gXHJcbiovXHJcbmNsYXNzIFNjaGVtYVR5cGUge1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKCl7XHJcblx0XHR0aGlzLnN0YXJ0X3ZhbHVlID0gdW5kZWZpbmVkO1xyXG5cdH1cclxuXHRcclxuXHQvKipcclxuXHRcdFBhcnNlcyB2YWx1ZSByZXR1cm5zIGFuIGFwcHJvcHJpYXRlIHRyYW5zZm9ybWVkIHZhbHVlXHJcblx0Ki9cclxuXHRwYXJzZSh2YWx1ZSl7XHJcblx0XHRyZXR1cm4gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHJcblx0Ki9cclxuXHR2ZXJpZnkodmFsdWUsIHJlc3VsdCl7XHJcblx0XHRyZXN1bHQudmFsaWQgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0ZmlsdGVyKCl7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHN0cmluZyh2YWx1ZSl7XHJcblx0XHRyZXR1cm4gdmFsdWUgKyBcIlwiO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IHtTY2hlbWFUeXBlfTsgIiwiaW1wb3J0IHtcclxuICAgIE1vZGVsQmFzZSxcclxufSBmcm9tIFwiLi9tb2RlbF9iYXNlLmpzXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBTY2hlbWFUeXBlXHJcbn0gZnJvbSBcIi4uL3NjaGVtYS9zY2hlbWFfdHlwZVwiXHJcblxyXG5jbGFzcyBNQ0FycmF5IGV4dGVuZHMgQXJyYXkge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdXNoKGl0ZW0pIHtcclxuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEFycmF5KVxyXG4gICAgICAgICAgICBpdGVtLmZvckVhY2goKGkpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHVzaChpKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3VwZXIucHVzaChpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICAvL0ZvciBjb21wYXRpYmlsaXR5XHJcbiAgICBfX3NldEZpbHRlcnNfXygpIHtcclxuXHJcbiAgICB9XHJcbiAgICBnZXRDaGFuZ2VkKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgdG9Kc29uKCkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLCBudWxsLCAnXFx0Jyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIEEgXCJudWxsXCIgZnVuY3Rpb25cclxubGV0IEVtcHR5RnVuY3Rpb24gPSAoKSA9PiB7fTtcclxubGV0IEVtcHR5QXJyYXkgPSBbXTtcclxuXHJcblxyXG5cclxuY2xhc3MgTW9kZWxDb250YWluZXIgZXh0ZW5kcyBNb2RlbEJhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjaGVtYSkge1xyXG5cclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvL0ZvciBMaW5raW5nIHRvIG9yaWdpbmFsIFxyXG4gICAgICAgIHRoaXMuc291cmNlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpcnN0X2xpbmsgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubmV4dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wcmV2ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy9Gb3Iga2VlcGluZyB0aGUgY29udGFpbmVyIGZyb20gYXV0b21hdGljIGRlbGV0aW9uLlxyXG4gICAgICAgIHRoaXMucGluID0gRW1wdHlGdW5jdGlvbjtcclxuXHJcbiAgICAgICAgLy9GaWx0ZXJzIGFyZSBhIHNlcmllcyBvZiBzdHJpbmdzIG9yIG51bWJlciBzZWxlY3RvcnMgdXNlZCB0byBkZXRlcm1pbmUgaWYgYSBtb2RlbCBzaG91bGQgYmUgaW5zZXJ0ZWQgaW50byBvciByZXRyaWV2ZWQgZnJvbSB0aGUgY29udGFpbmVyLlxyXG4gICAgICAgIHRoaXMuX19maWx0ZXJzX18gPSBFbXB0eUFycmF5O1xyXG5cclxuICAgICAgICB0aGlzLnNjaGVtYSA9IHNjaGVtYSB8fCB0aGlzLmNvbnN0cnVjdG9yLnNjaGVtYSB8fCB7fTtcclxuXHJcbiAgICAgICAgLy9UaGUgcGFyc2VyIHdpbGwgaGFuZGxlIHRoZSBldmFsdWF0aW9uIG9mIGlkZW50aWZpZXJzIGFjY29yZGluZyB0byB0aGUgY3JpdGVyaWEgc2V0IGJ5IHRoZSBfX2ZpbHRlcnNfXyBsaXN0LiBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2NoZW1hLnBhcnNlciAmJiB0aGlzLnNjaGVtYS5wYXJzZXIgaW5zdGFuY2VvZiBTY2hlbWFUeXBlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VyID0gdGhpcy5zY2hlbWEucGFyc2VyXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZXIgPSBuZXcgU2NoZW1hVHlwZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pZCA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNjaGVtYS5pZGVudGlmaWVyICYmIHR5cGVvZih0aGlzLnNjaGVtYS5pZGVudGlmaWVyKSA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSB0aGlzLnNjaGVtYS5pZGVudGlmaWVyO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHRocm93IChgV3Jvbmcgc2NoZW1hIGlkZW50aWZpZXIgdHlwZSBnaXZlbiB0byBNb2RlbENvbnRhaW5lci4gRXhwZWN0ZWQgdHlwZSBTdHJpbmcsIGdvdDogJHt0eXBlb2YodGhpcy5zY2hlbWEuaWRlbnRpZmllcil9IWAsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodGhpcywge1xyXG4gICAgICAgICAgICBnZXQ6IChvYmosIHByb3AsIHZhbCkgPT4gKHByb3AgaW4gb2JqKSA/IG9ialtwcm9wXSA6IG9iai5nZXQodmFsKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnNjaGVtYSA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuX19maWx0ZXJzX18gPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zb3VyY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5zb3VyY2UuX191bmxpbmtfXyh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBHZXQgdGhlIG51bWJlciBvZiBNb2RlbHMgaGVsZCBpbiB0aGlzIE1vZGVsQ29udGFpbmVyXHJcblxyXG4gICAgICAgIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAgICAqL1xyXG4gICAgZ2V0IGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbGVuZ3RoKGUpIHtcclxuICAgICAgICAvL05VTEwgZnVuY3Rpb24uIERvIE5vdCBPdmVycmlkZSFcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgICAgUmV0dXJucyBhIE1vZGVsQ29udGFpbmVyIHR5cGUgdG8gc3RvcmUgdGhlIHJlc3VsdHMgb2YgYSBnZXQoKS5cclxuICAgICovXHJcbiAgICBfX2RlZmF1bHRSZXR1cm5fXyhVU0VfQVJSQVkpIHtcclxuICAgICAgICBpZiAoVVNFX0FSUkFZKSByZXR1cm4gbmV3IE1DQXJyYXk7XHJcblxyXG4gICAgICAgIGxldCBuID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5zY2hlbWEpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbGlua19fKG4pO1xyXG5cclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBBcnJheSBlbXVsYXRpbmcga2x1ZGdlXHJcblxyXG4gICAgICAgIEByZXR1cm5zIFRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGlzLmluc2VydFxyXG4gICAgKi9cclxuICAgIHB1c2goaXRlbSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluc2VydChpdGVtLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZXRyaWV2ZXMgYSBsaXN0IG9mIGl0ZW1zIHRoYXQgbWF0Y2ggdGhlIHRlcm0vdGVybXMuIFxyXG5cclxuICAgICAgICBAcGFyYW0geyhBcnJheXxTZWFyY2hUZXJtKX0gdGVybSAtIEEgc2luZ2xlIHRlcm0gb3IgYSBzZXQgb2YgdGVybXMgdG8gbG9vayBmb3IgaW4gdGhlIE1vZGVsQ29udGFpbmVyLiBcclxuICAgICAgICBAcGFyYW0ge0FycmF5fSBfX3JldHVybl9kYXRhX18gLSBTZXQgdG8gdHJ1ZSBieSBhIHNvdXJjZSBDb250YWluZXIgaWYgaXQgaXMgY2FsbGluZyBhIFN1YkNvbnRhaW5lciBpbnNlcnQgZnVuY3Rpb24uIFxyXG5cclxuICAgICAgICBAcmV0dXJucyB7KE1vZGVsQ29udGFpbmVyfEFycmF5KX0gUmV0dXJucyBhIE1vZGVsIGNvbnRhaW5lciBvciBhbiBBcnJheSBvZiBNb2RlbHMgbWF0Y2hpbmcgdGhlIHNlYXJjaCB0ZXJtcy4gXHJcbiAgICAqL1xyXG4gICAgZ2V0KHRlcm0sIF9fcmV0dXJuX2RhdGFfXykge1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IFVTRV9BUlJBWSA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmICh0ZXJtKSB7XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICBpZiAoX19yZXR1cm5fZGF0YV9fKSB7XHJcbiAgICAgICAgICAgICAgICBvdXQgPSBfX3JldHVybl9kYXRhX187XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF9fcmV0dXJuX2RhdGFfXyA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICBVU0VfQVJSQVkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc291cmNlKVxyXG4gICAgICAgICAgICAgICAgICAgIFVTRV9BUlJBWSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIG91dCA9IHRoaXMuX19kZWZhdWx0UmV0dXJuX18oVVNFX0FSUkFZKTtcclxuICAgICAgICAgICAgICAgIG91dC5fX3NldEZpbHRlcnNfXyh0ZXJtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBvdXQgPSAoX19yZXR1cm5fZGF0YV9fKSA/IF9fcmV0dXJuX2RhdGFfXyA6IHRoaXMuX19kZWZhdWx0UmV0dXJuX18oVVNFX0FSUkFZKTtcclxuXHJcbiAgICAgICAgaWYgKCF0ZXJtKVxyXG4gICAgICAgICAgICB0aGlzLl9fZ2V0QWxsX18ob3V0KTtcclxuICAgICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB0ZXJtcyA9IHRlcm07XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRlcm0gaW5zdGFuY2VvZiBBcnJheSlcclxuICAgICAgICAgICAgICAgIHRlcm1zID0gW3Rlcm1dO1xyXG5cclxuICAgICAgICAgICAgLy9OZWVkIHRvIGNvbnZlcnQgdGVybXMgaW50byBhIGZvcm0gdGhhdCB3aWxsIHdvcmsgZm9yIHRoZSBpZGVudGlmaWVyIHR5cGVcclxuICAgICAgICAgICAgdGVybXMgPSB0ZXJtcy5tYXAodCA9PiB0aGlzLnBhcnNlci5wYXJzZSh0KSk7XHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy5fX2dldF9fKHRlcm1zLCBvdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEluc2VydHMgYW4gaXRlbSBpbnRvIHRoZSBjb250YWluZXIuIElmIHRoZSBpdGVtIGlzIG5vdCBhIHtNb2RlbH0sIGFuIGF0dGVtcHQgd2lsbCBiZSBtYWRlIHRvIGNvbnZlcnQgdGhlIGRhdGEgaW4gdGhlIE9iamVjdCBpbnRvIGEgTW9kZWwuXHJcbiAgICAgICAgSWYgdGhlIGl0ZW0gaXMgYW4gYXJyYXkgb2Ygb2JqZWN0cywgZWFjaCBvYmplY3QgaW4gdGhlIGFycmF5IHdpbGwgYmUgY29uc2lkZXJlZCBzZXBhcmF0ZWx5LiBcclxuXHJcbiAgICAgICAgQHBhcmFtIHtPYmplY3R9IGl0ZW0gLSBBbiBPYmplY3QgdG8gaW5zZXJ0IGludG8gdGhlIGNvbnRhaW5lci4gT24gb2YgdGhlIHByb3BlcnRpZXMgb2YgdGhlIG9iamVjdCBNVVNUIGhhdmUgdGhlIHNhbWUgbmFtZSBhcyB0aGUgTW9kZWxDb250YWluZXIncyBcclxuICAgICAgICBAcGFyYW0ge0FycmF5fSBpdGVtIC0gQW4gYXJyYXkgb2YgT2JqZWN0cyB0byBpbnNlcnQgaW50byB0aGUgY29udGFpbmVyLlxyXG4gICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gX19GUk9NX1NPVVJDRV9fIC0gU2V0IHRvIHRydWUgYnkgYSBzb3VyY2UgQ29udGFpbmVyIGlmIGl0IGlzIGNhbGxpbmcgYSBTdWJDb250YWluZXIgaW5zZXJ0IGZ1bmN0aW9uLiBcclxuXHJcbiAgICAgICAgQHJldHVybnMge0Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBhbiBpbnNlcnRpb24gaW50byB0aGUgTW9kZWxDb250YWluZXIgb2NjdXJyZWQsIGZhbHNlIG90aGVyd2lzZS5cclxuICAgICovXHJcbiAgICBpbnNlcnQoaXRlbSwgX19GUk9NX1NPVVJDRV9fID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgbGV0IGFkZF9saXN0ID0gKHRoaXMuZmlyc3RfdmlldykgPyBbXSA6IG51bGw7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKCFfX0ZST01fU09VUkNFX18gJiYgdGhpcy5zb3VyY2UpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5pbnNlcnQoaXRlbSk7XHJcblxyXG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX19pbnNlcnRTdWJfXyhpdGVtW2ldLCBvdXQsIGFkZF9saXN0KSlcclxuICAgICAgICAgICAgICAgICAgICBvdXQgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbSlcclxuICAgICAgICAgICAgb3V0ID0gdGhpcy5fX2luc2VydFN1Yl9fKGl0ZW0sIG91dCwgYWRkX2xpc3QpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKGFkZF9saXN0ICYmIGFkZF9saXN0Lmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlld3NBZGRlZChhZGRfbGlzdCk7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQSBzdWJzZXQgb2YgdGhlIGluc2VydCBmdW5jdGlvbi4gSGFuZGxlcyB0aGUgdGVzdCBvZiBpZGVudGlmaWVyLCB0aGUgY29udmVyc2lvbiBvZiBhbiBPYmplY3QgaW50byBhIE1vZGVsLCBhbmQgdGhlIGNhbGxpbmcgb2YgdGhlIGludGVybmFsIF9faW5zZXJ0X18gZnVuY3Rpb24uXHJcbiAgICAqL1xyXG4gICAgX19pbnNlcnRTdWJfXyhpdGVtLCBvdXQsIGFkZF9saXN0KSB7XHJcblxyXG4gICAgICAgIGxldCBtb2RlbCA9IGl0ZW07XHJcblxyXG4gICAgICAgIHZhciBpZGVudGlmaWVyID0gdGhpcy5fX2dldElkZW50aWZpZXJfXyhpdGVtKTtcclxuXHJcbiAgICAgICAgaWYgKGlkZW50aWZpZXIgIT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIShtb2RlbCBpbnN0YW5jZW9mIHRoaXMuc2NoZW1hLm1vZGVsKSAmJiAhKG1vZGVsID0gbW9kZWwuX19fX3NlbGZfX19fKSkge1xyXG4gICAgICAgICAgICAgICAgbW9kZWwgPSBuZXcgdGhpcy5zY2hlbWEubW9kZWwoKTtcclxuICAgICAgICAgICAgICAgIG1vZGVsLmFkZChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWRlbnRpZmllciA9IHRoaXMuX19nZXRJZGVudGlmaWVyX18obW9kZWwsIHRoaXMuX19maWx0ZXJzX18pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIpIHtcclxuICAgICAgICAgICAgICAgIG91dCA9IHRoaXMuX19pbnNlcnRfXyhtb2RlbCwgYWRkX2xpc3QsIGlkZW50aWZpZXIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fbGlua3NJbnNlcnRfXyhtb2RlbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJlbW92ZXMgYW4gaXRlbSBmcm9tIHRoZSBjb250YWluZXIuIFxyXG4gICAgKi9cclxuICAgIHJlbW92ZSh0ZXJtLCBfX0ZST01fU09VUkNFX18gPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBsZXQgdGVybXMgPSB0ZXJtO1xyXG5cclxuICAgICAgICBpZiAoIV9fRlJPTV9TT1VSQ0VfXyAmJiB0aGlzLnNvdXJjZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0ZXJtKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnJlbW92ZSh0aGlzLl9fZmlsdGVyc19fKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnJlbW92ZSh0ZXJtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBvdXRfY29udGFpbmVyID0gW107XHJcblxyXG4gICAgICAgIGlmICghdGVybSlcclxuICAgICAgICAgICAgdGhpcy5fX3JlbW92ZUFsbF9fKCk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghdGVybSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICB0ZXJtcyA9IFt0ZXJtXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9OZWVkIHRvIGNvbnZlcnQgdGVybXMgaW50byBhIGZvcm0gdGhhdCB3aWxsIHdvcmsgZm9yIHRoZSBpZGVudGlmaWVyIHR5cGVcclxuICAgICAgICAgICAgdGVybXMgPSB0ZXJtcy5tYXAodCA9PiB0aGlzLnBhcnNlci5wYXJzZSh0KSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9fcmVtb3ZlX18odGVybXMsIG91dF9jb250YWluZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fX2xpbmtzUmVtb3ZlX18odGVybXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0X2NvbnRhaW5lcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZW1vdmVzIGEgTW9kZWxDb250YWluZXIgZnJvbSBsaXN0IG9mIGxpbmtlZCBjb250YWluZXJzLiBcclxuXHJcbiAgICAgICAgQHBhcmFtIHtNb2RlbENvbnRhaW5lcn0gY29udGFpbmVyIC0gVGhlIE1vZGVsQ29udGFpbmVyIGluc3RhbmNlIHRvIHJlbW92ZSBmcm9tIHRoZSBzZXQgb2YgbGlua2VkIGNvbnRhaW5lcnMuIE11c3QgYmUgYSBtZW1iZXIgb2YgdGhlIGxpbmtlZCBjb250YWluZXJzLiBcclxuICAgICovXHJcbiAgICBfX3VubGlua19fKGNvbnRhaW5lcikge1xyXG5cclxuICAgICAgICBpZiAoY29udGFpbmVyIGluc3RhbmNlb2YgTW9kZWxDb250YWluZXIgJiYgY29udGFpbmVyLnNvdXJjZSA9PSB0aGlzKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGFpbmVyID09IHRoaXMuZmlyc3RfbGluaylcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RfbGluayA9IGNvbnRhaW5lci5uZXh0O1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lci5uZXh0KVxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLm5leHQucHJldiA9IGNvbnRhaW5lci5wcmV2O1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lci5wcmV2KVxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnByZXYubmV4dCA9IGNvbnRhaW5lci5uZXh0O1xyXG5cclxuICAgICAgICAgICAgY29udGFpbmVyLnNvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEFkZHMgYSBjb250YWluZXIgdG8gdGhlIGxpc3Qgb2YgdHJhY2tlZCBjb250YWluZXJzLiBcclxuXHJcbiAgICAgICAgQHBhcmFtIHtNb2RlbENvbnRhaW5lcn0gY29udGFpbmVyIC0gVGhlIE1vZGVsQ29udGFpbmVyIGluc3RhbmNlIHRvIGFkZCB0aGUgc2V0IG9mIGxpbmtlZCBjb250YWluZXJzLlxyXG4gICAgKi9cclxuICAgIF9fbGlua19fKGNvbnRhaW5lcikge1xyXG4gICAgICAgIGlmIChjb250YWluZXIgaW5zdGFuY2VvZiBNb2RlbENvbnRhaW5lciAmJiAhY29udGFpbmVyLnNvdXJjZSkge1xyXG5cclxuICAgICAgICAgICAgY29udGFpbmVyLnNvdXJjZSA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBjb250YWluZXIubmV4dCA9IHRoaXMuZmlyc3RfbGluaztcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZpcnN0X2xpbmspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcnN0X2xpbmsucHJldiA9IGNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZmlyc3RfbGluayA9IGNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5waW4gPSAoKGNvbnRhaW5lcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlkID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLl9fdW5saW5rX18oKTtcclxuICAgICAgICAgICAgICAgIH0sIDUwKVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbnRhaW5lci5zb3VyY2UpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImZhaWxlZCB0byBjbGVhciB0aGUgZGVzdHJ1Y3Rpb24gb2YgY29udGFpbmVyIGluIHRpbWUhXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KShjb250YWluZXIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9fbGlua3NSZW1vdmVfXyh0ZXJtcykge1xyXG4gICAgICAgIGxldCBhID0gdGhpcy5maXJzdF9saW5rO1xyXG4gICAgICAgIHdoaWxlIChhKSB7XHJcbiAgICAgICAgICAgIGEucmVtb3ZlKHRlcm1zLCB0cnVlKTtcclxuICAgICAgICAgICAgYSA9IGEubmV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX19saW5rc0luc2VydF9fKGl0ZW0pIHtcclxuICAgICAgICBsZXQgYSA9IHRoaXMuZmlyc3RfbGluaztcclxuICAgICAgICB3aGlsZSAoYSkge1xyXG4gICAgICAgICAgICBhLmluc2VydChpdGVtLCB0cnVlKTtcclxuICAgICAgICAgICAgYSA9IGEubmV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmVtb3ZlcyBhbnkgaXRlbXMgaW4gdGhlIG1vZGVsIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkgXCJpdGVtc1wiLCBhbmQgYWRkcyBhbnkgaXRlbXMgaW4gaXRlbXMgbm90IGFscmVhZHkgaW4gdGhlIE1vZGVsQ29udGFpbmVyLlxyXG5cclxuICAgICAgICBAcGFyYW0ge0FycmF5fSBpdGVtcyAtIEFuIGFycmF5IG9mIGlkZW50aWZpYWJsZSBNb2RlbHMgb3Igb2JqZWN0cy4gXHJcbiAgICAqL1xyXG4gICAgY3VsbChpdGVtcykge1xyXG5cclxuICAgICAgICBsZXQgaGFzaF90YWJsZSA9IHt9O1xyXG4gICAgICAgIGxldCBleGlzdGluZ19pdGVtcyA9IF9fZ2V0QWxsX18oW10sIHRydWUpO1xyXG5cclxuICAgICAgICBsZXQgbG9hZEhhc2ggPSAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEFycmF5KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uZm9yRWFjaCgoZSkgPT4gbG9hZEhhc2goZSkpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGlkZW50aWZpZXIgPSB0aGlzLl9fZ2V0SWRlbnRpZmllcl9fKGl0ZW0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIpXHJcbiAgICAgICAgICAgICAgICBoYXNoX3RhYmxlW2lkZW50aWZpZXJdID0gaXRlbTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsb2FkSGFzaChpdGVtcyk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhpc3RpbmdfaXRlbXMubGVudGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZV9pdGVtID0gZXhpc3RpbmdfaXRlbXNbaV07XHJcbiAgICAgICAgICAgIGlmICghZXhpc3RpbmdfaXRlbXNbdGhpcy5fX2dldElkZW50aWZpZXJfXyhlX2l0ZW0pXSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX19yZW1vdmVfXyhlX2l0ZW0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbnNlcnQoaXRlbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIF9fc2V0RmlsdGVyc19fKHRlcm0pIHtcclxuICAgICAgICBpZiAodGVybSBpbnN0YW5jZW9mIEFycmF5KVxyXG4gICAgICAgICAgICB0aGlzLl9fZmlsdGVyc19fID0gdGhpcy5fX2ZpbHRlcnNfXy5jb25jYXQodGVybS5tYXAodCA9PiB0aGlzLnBhcnNlci5wYXJzZSh0KSkpXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLl9fZmlsdGVyc19fLnB1c2godGhpcy5wYXJzZXIucGFyc2UodGVybSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZXR1cm5zIHRydWUgaWYgdGhlIGlkZW50aWZpZXIgbWF0Y2hlcyBhIHByZWRlZmluZWQgZmlsdGVyIHBhdHRlcm4sIHdoaWNoIGlzIGV2YWx1YXRlZCBieSB0aGlzLnBhcnNlci4gSWYgYSBcclxuICAgICAgICBwYXJzZXIgd2FzIG5vdCBwcmVzZW50IHRoZSBNb2RlbENvbnRhaW5lcnMgc2NoZW1hLCB0aGVuIHRoZSBmdW5jdGlvbiB3aWxsIHJldHVybiB0cnVlIHVwb24gZXZlcnkgZXZhbHVhdGlvbi5cclxuICAgICovXHJcbiAgICBfX2ZpbHRlcklkZW50aWZpZXJfXyhpZGVudGlmaWVyLCBmaWx0ZXJzKSB7XHJcbiAgICAgICAgaWYgKGZpbHRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZXIuZmlsdGVyKGlkZW50aWZpZXIsIGZpbHRlcnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZXR1cm5zIHRoZSBJZGVudGlmaWVyIHByb3BlcnR5IHZhbHVlIGlmIGl0IGV4aXN0cyBpbiB0aGUgaXRlbS4gSWYgYW4gYXJyYXkgdmFsdWUgZm9yIGZpbHRlcnMgaXMgcGFzc2VkLCB0aGVuIHVuZGVmaW5lZCBpcyByZXR1cm5lZCBpZiB0aGUgaWRlbnRpZmllciB2YWx1ZSBkb2VzIG5vdCBwYXNzIGZpbHRlcmluZyBjcml0ZXJpYS5cclxuICAgICAgICBAcGFyYW0geyhPYmplY3R8TW9kZWwpfSBpdGVtXHJcbiAgICAgICAgQHBhcmFtIHtBcnJheX0gZmlsdGVycyAtIEFuIGFycmF5IG9mIGZpbHRlciB0ZXJtcyB0byB0ZXN0IHdoZXRoZXIgdGhlIGlkZW50aWZpZXIgbWVldHMgdGhlIGNyaXRlcmlhIHRvIGJlIGhhbmRsZWQgYnkgdGhlIE1vZGVsQ29udGFpbmVyLlxyXG4gICAgKi9cclxuICAgIF9fZ2V0SWRlbnRpZmllcl9fKGl0ZW0sIGZpbHRlcnMgPSBudWxsKSB7XHJcblxyXG4gICAgICAgIGxldCBpZGVudGlmaWVyID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZihpdGVtKSA9PSBcIm9iamVjdFwiKVxyXG4gICAgICAgICAgICBpZGVudGlmaWVyID0gaXRlbVt0aGlzLnNjaGVtYS5pZGVudGlmaWVyXTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGlkZW50aWZpZXIgPSBpdGVtO1xyXG5cclxuICAgICAgICBpZiAoaWRlbnRpZmllcilcclxuICAgICAgICAgICAgaWRlbnRpZmllciA9IHRoaXMucGFyc2VyLnBhcnNlKGlkZW50aWZpZXIpO1xyXG5cclxuICAgICAgICBpZiAoZmlsdGVycyAmJiBpZGVudGlmaWVyKVxyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuX19maWx0ZXJJZGVudGlmaWVyX18oaWRlbnRpZmllciwgZmlsdGVycykpID8gaWRlbnRpZmllciA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGlkZW50aWZpZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICAgIE9WRVJSSURFIFNFQ1RJT04gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICBcclxuICAgICAgICBBbGwgb2YgdGhlc2UgZnVuY3Rpb25zIHNob3VsZCBiZSBvdmVycmlkZGVuIGJ5IGluaGVyaXRpbmcgY2xhc3Nlc1xyXG4gICAgKi9cclxuXHJcbiAgICBfX2luc2VydF9fKGl0ZW0sIGFkZF9saXN0LCBpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0X18oaXRlbSwgX19yZXR1cm5fZGF0YV9fKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fcmV0dXJuX2RhdGFfXztcclxuICAgIH1cclxuXHJcbiAgICBfX2dldEFsbF9fKF9fcmV0dXJuX2RhdGFfXykge1xyXG4gICAgICAgIHJldHVybiBfX3JldHVybl9kYXRhX187XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVBbGxfXygpIHtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVfXyhpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEVORCBPVkVSUklERSAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG59XHJcblxyXG5jbGFzcyBNdWx0aUluZGV4ZWRDb250YWluZXIgZXh0ZW5kcyBNb2RlbENvbnRhaW5lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihzY2hlbWEpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoe1xyXG4gICAgICAgICAgICBpZGVudGlmaWVyOiBcImluZGV4ZWRcIixcclxuICAgICAgICAgICAgbW9kZWw6IHNjaGVtYS5tb2RlbFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNjaGVtYSA9IHNjaGVtYTtcclxuICAgICAgICB0aGlzLmluZGV4ZXMgPSB7fTtcclxuICAgICAgICB0aGlzLmZpcnN0X2luZGV4ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRJbmRleChzY2hlbWEuaW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgZmlyc3QgaW5kZXggaW4gdGhpcyBjb250YWluZXIuIFxyXG4gICAgKi9cclxuICAgIGdldCBsZW5ndGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlyc3RfaW5kZXgubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEluc2VydCBhIG5ldyBNb2RlbENvbnRhaW5lciBpbnRvIHRoZSBpbmRleCB0aHJvdWdoIHRoZSBzY2hlbWEuICBcclxuICAgICovXHJcbiAgICBhZGRJbmRleChpbmRleF9zY2hlbWEpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBpbmRleF9zY2hlbWEpIHtcclxuICAgICAgICAgICAgbGV0IHNjaGVtZSA9IGluZGV4X3NjaGVtYVtuYW1lXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzY2hlbWUuY29udGFpbmVyICYmICF0aGlzLmluZGV4ZXNbbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhlc1tuYW1lXSA9IG5ldyBzY2hlbWUuY29udGFpbmVyKHNjaGVtZS5zY2hlbWEpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpcnN0X2luZGV4KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhlc1tuYW1lXS5pbnNlcnQodGhpcy5maXJzdF9pbmRleC5fX2dldEFsbF9fKCkpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RfaW5kZXggPSB0aGlzLmluZGV4ZXNbbmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KGl0ZW0sIF9fcmV0dXJuX2RhdGFfXykge1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0ge307XHJcblxyXG4gICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gaXRlbSlcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmluZGV4ZXNbbmFtZV0pXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0W25hbWVdID0gdGhpcy5pbmRleGVzW25hbWVdLmdldChpdGVtW25hbWVdLCBfX3JldHVybl9kYXRhX18pO1xyXG4gICAgICAgIH0gZWxzZVxyXG5cclxuICAgICAgICAgICAgb3V0ID0gdGhpcy5maXJzdF9pbmRleC5nZXQobnVsbCk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZShpdGVtKSB7XHJcblxyXG4gICAgICAgIHZhciBvdXQgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgYSBpbiBpdGVtKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pbmRleGVzW2FdKVxyXG4gICAgICAgICAgICAgICAgb3V0ID0gb3V0LmNvbmNhdCh0aGlzLmluZGV4ZXNbYV0ucmVtb3ZlKGl0ZW1bYV0pKTtcclxuXHJcbiAgICAgICAgLyogUmVwbGF5IGl0ZW1zIGFnYWluc3QgaW5kZXhlcyB0byBpbnN1cmUgYWxsIGl0ZW1zIGhhdmUgYmVlbiByZW1vdmVkIGZyb20gYWxsIGluZGV4ZXMgKi9cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLmluZGV4ZXMubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3V0Lmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleGVzW2pdLnJlbW92ZShvdXRbaV0pO1xyXG5cclxuICAgICAgICAvL1VwZGF0ZSBhbGwgdmlld3NcclxuICAgICAgICBpZiAob3V0Lmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlld3NSZW1vdmVkKG91dCk7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgX19pbnNlcnRfXyhtb2RlbCwgYWRkX2xpc3QsIGlkZW50aWZpZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IGZhbHNlXHJcblxyXG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gdGhpcy5pbmRleGVzKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmluZGV4ZXNbbmFtZV07XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5kZXguaW5zZXJ0KG1vZGVsKSlcclxuICAgICAgICAgICAgICAgIG91dCA9IHRydWU7XHJcbiAgICAgICAgICAgIC8vZWxzZVxyXG4gICAgICAgICAgICAvLyAgICBjb25zb2xlLndhcm4oYEluZGV4ZWQgY29udGFpbmVyICR7YX0gJHtpbmRleH0gZmFpbGVkIHRvIGluc2VydDpgLCBtb2RlbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3V0KVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpZXdzKHRoaXMuZmlyc3RfaW5kZXguZ2V0KCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgICAgQHByaXZhdGUgXHJcbiAgICAqL1xyXG4gICAgX19yZW1vdmVfXyhpdGVtKSB7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLmluZGV4ZXMpIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5pbmRleGVzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXgucmVtb3ZlKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgb3V0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVBbGxfXygpIHtcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBuYW1lIGluIHRoaXMuaW5kZXhlcykge1xyXG4gICAgICAgICAgICBpZiAoaW5kZXguX19yZW1vdmVBbGxfXygpKVxyXG4gICAgICAgICAgICAgICAgb3V0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIE92ZXJyaWRlcyBNb2RlbCBjb250YWluZXIgZGVmYXVsdCBfX2dldElkZW50aWZpZXJfXyB0byBmb3JjZSBpdGVtIHRvIHBhc3MuXHJcbiAgICAgICAgQHByaXZhdGUgXHJcbiAgICAqL1xyXG4gICAgX19nZXRJZGVudGlmaWVyX18oaXRlbSwgZmlsdGVycyA9IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgcmV0dXJuIFwiW11cIjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIE1DQXJyYXksXHJcbiAgICBNb2RlbENvbnRhaW5lcixcclxuICAgIE11bHRpSW5kZXhlZENvbnRhaW5lcixcclxuICAgIGFycmF5X2NvbnRhaW5lclxyXG59OyIsImltcG9ydCB7XHJcbiAgICBNb2RlbENvbnRhaW5lcixcclxuICAgIE1DQXJyYXlcclxufSBmcm9tIFwiLi9tb2RlbF9jb250YWluZXJcIlxyXG5cclxuXHJcbi8qKlxyXG4gKi9cclxuY2xhc3MgQXJyYXlNb2RlbENvbnRhaW5lciBleHRlbmRzIE1vZGVsQ29udGFpbmVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY2hlbWEpIHtcclxuICAgICAgICBzdXBlcihzY2hlbWEpO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YSA9IG51bGw7XHJcblxyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZGVmYXVsdFJldHVybl9fKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNvdXJjZSkgcmV0dXJuIG5ldyBNQ0FycmF5O1xyXG5cclxuICAgICAgICBsZXQgbiA9IG5ldyBBcnJheU1vZGVsQ29udGFpbmVyKHRoaXMuc2NoZW1hKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX2xpbmtfXyhuKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9XHJcblxyXG4gICAgX19pbnNlcnRfXyhtb2RlbCwgYWRkX2xpc3QsIGlkZW50aWZpZXIpIHtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmRhdGEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgb2JqID0gdGhpcy5kYXRhW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX19nZXRJZGVudGlmaWVyX18ob2JqKSA9PSBpZGVudGlmaWVyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgb2JqLmFkZChtb2RlbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvL01vZGVsIG5vdCBhZGRlZCB0byBDb250YWluZXIuIE1vZGVsIGp1c3QgdXBkYXRlZC5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kYXRhLnB1c2gobW9kZWwpO1xyXG5cclxuICAgICAgICBpZiAoYWRkX2xpc3QpIGFkZF9saXN0LnB1c2gobW9kZWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gTW9kZWwgYWRkZWQgdG8gQ29udGFpbmVyLlxyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0X18odGVybSwgcmV0dXJuX2RhdGEpIHtcclxuXHJcbiAgICAgICAgbGV0IHRlcm1zID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHRlcm0pXHJcbiAgICAgICAgICAgIGlmICh0ZXJtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHRlcm1zID0gdGVybTtcclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICB0ZXJtcyA9IFt0ZXJtXTtcclxuXHJcblxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuZGF0YS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IG9iaiA9IHRoaXMuZGF0YVtpXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX19nZXRJZGVudGlmaWVyX18ob2JqLCB0ZXJtcykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybl9kYXRhLnB1c2gob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJldHVybl9kYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0QWxsX18ocmV0dXJuX2RhdGEpIHtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhLmZvckVhY2goKG0pID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuX2RhdGEucHVzaChtKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHJldHVybiByZXR1cm5fZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBfX3JlbW92ZUFsbF9fKCkge1xyXG4gICAgICAgIGxldCBpdGVtcyA9IHRoaXMuZGF0YS5tYXAoZCA9PiBkKSB8fCBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuXHJcbiAgICBfX3JlbW92ZV9fKHRlcm0sIG91dF9jb250YWluZXIpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmRhdGEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvYmogPSB0aGlzLmRhdGFbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fX2dldElkZW50aWZpZXJfXyhvYmosIHRlcm0pKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc3BsaWNlKGksIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIGwtLTtcclxuICAgICAgICAgICAgICAgIGktLTtcclxuXHJcbiAgICAgICAgICAgICAgICBvdXRfY29udGFpbmVyLnB1c2gob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBBcnJheU1vZGVsQ29udGFpbmVyXHJcbn0iLCJpbXBvcnQge1xyXG4gICAgTW9kZWxDb250YWluZXIsXHJcbiAgICBNQ0FycmF5XHJcbn0gZnJvbSBcIi4vbW9kZWxfY29udGFpbmVyXCJcclxuXHJcbmNsYXNzIEJUcmVlTW9kZWxDb250YWluZXIgZXh0ZW5kcyBNb2RlbENvbnRhaW5lciB7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NoZW1hKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKHNjaGVtYSk7XHJcblxyXG4gICAgICAgIHRoaXMucm9vdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5taW4gPSAxMDtcclxuICAgICAgICB0aGlzLm1heCA9IDIwO1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAodGhpcy5yb290KVxyXG4gICAgICAgICAgICB0aGlzLnJvb3QuZGVzdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zaXplO1xyXG4gICAgfVxyXG5cclxuICAgIF9faW5zZXJ0X18obW9kZWwsIGFkZF9saXN0LCBpZGVudGlmaWVyKSB7XHJcblxyXG4gICAgICAgIGxldCByZXN1bHQgPSB7XHJcbiAgICAgICAgICAgIGFkZGVkOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5yb290KVxyXG4gICAgICAgICAgICB0aGlzLnJvb3QgPSBuZXcgQnRyZWVOb2RlKHRydWUpO1xyXG5cclxuICAgICAgICB0aGlzLnJvb3QgPSB0aGlzLnJvb3QuaW5zZXJ0KGlkZW50aWZpZXIsIG1vZGVsLCB0aGlzLm1heCwgdHJ1ZSwgcmVzdWx0KS5uZXdub2RlO1xyXG5cclxuICAgICAgICBpZiAoYWRkX2xpc3QpIGFkZF9saXN0LnB1c2gobW9kZWwpO1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0LmFkZGVkKVxyXG4gICAgICAgICAgICB0aGlzLnNpemUrKztcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5hZGRlZDtcclxuICAgIH1cclxuXHJcbiAgICBfX2dldF9fKHRlcm1zLCBfX3JldHVybl9kYXRhX18pIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucm9vdCAmJiB0ZXJtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0ZXJtcy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmdldChwYXJzZUZsb2F0KHRlcm1zWzBdKSwgcGFyc2VGbG9hdCh0ZXJtc1swXSksIF9fcmV0dXJuX2RhdGFfXyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGVybXMubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmdldChwYXJzZUZsb2F0KHRlcm1zWzBdKSwgcGFyc2VGbG9hdCh0ZXJtc1sxXSksIF9fcmV0dXJuX2RhdGFfXyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRlcm1zLmxlbmd0aCAtIDE7IGkgPiBsOyBpICs9IDIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LmdldChwYXJzZUZsb2F0KHRlcm1zW2ldKSwgcGFyc2VGbG9hdCh0ZXJtc1tpICsgMV0pLCBfX3JldHVybl9kYXRhX18pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gX19yZXR1cm5fZGF0YV9fO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcmVtb3ZlX18odGVybXMsIG91dF9jb250YWluZXIpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucm9vdCAmJiB0ZXJtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0ZXJtcy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG8gPSB0aGlzLnJvb3QucmVtb3ZlKHRlcm1zWzBdLCB0ZXJtc1swXSwgdHJ1ZSwgdGhpcy5taW4sIG91dF9jb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gby5vdXQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QgPSBvLm91dF9ub2RlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRlcm1zLmxlbmd0aCA8IDMpIHtcclxuICAgICAgICAgICAgICAgIGxldCBvID0gdGhpcy5yb290LnJlbW92ZSh0ZXJtc1swXSwgdGVybXNbMV0sIHRydWUsIHRoaXMubWluLCBvdXRfY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9by5vdXQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QgPSBvLm91dF9ub2RlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0ZXJtcy5sZW5ndGggLSAxOyBpID4gbDsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG8gPSB0aGlzLnJvb3QucmVtb3ZlKHRlcm1zW2ldLCB0ZXJtc1tpICsgMV0sIHRydWUsIHRoaXMubWluLCBvdXRfY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBvLm91dDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QgPSBvLm91dF9ub2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNpemUgLT0gcmVzdWx0O1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0ICE9PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0QWxsX18oX19yZXR1cm5fZGF0YV9fKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucm9vdClcclxuICAgICAgICAgICAgdGhpcy5yb290LmdldCgtSW5maW5pdHksIEluZmluaXR5LCBfX3JldHVybl9kYXRhX18pO1xyXG4gICAgICAgIHJldHVybiBfX3JldHVybl9kYXRhX187XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVBbGxfXygpIHtcclxuICAgICAgICBpZiAodGhpcy5yb290KVxyXG4gICAgICAgICAgICB0aGlzLnJvb3QuZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgIHRoaXMucm9vdCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKCkge1xyXG4gICAgICAgIGxldCBvdXRfZGF0YSA9IFtdO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yb290KSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJvb3QuZ2V0KC1JbmZpbml0eSwgSW5maW5pdHksIG91dF9kYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQnRyZWVOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKElTX0xFQUYgPSBmYWxzZSkge1xyXG4gICAgICAgIHRoaXMuTEVBRiA9IElTX0xFQUY7XHJcbiAgICAgICAgdGhpcy5ub2RlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMua2V5cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaXRlbXMgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZXMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMua2V5cyA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5MRUFGKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5ub2Rlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGVzW2ldLmRlc3RydWN0b3IoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGJhbGFuY2VJbnNlcnQobWF4X3NpemUsIElTX1JPT1QgPSBmYWxzZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmtleXMubGVuZ3RoID49IG1heF9zaXplKSB7XHJcbiAgICAgICAgICAgIC8vbmVlZCB0byBzcGxpdCB0aGlzIHVwIVxyXG5cclxuICAgICAgICAgICAgbGV0IG5ld25vZGUgPSBuZXcgQnRyZWVOb2RlKHRoaXMuTEVBRik7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3BsaXQgPSAobWF4X3NpemUgPj4gMSkgfCAwO1xyXG5cclxuICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tzcGxpdF07XHJcblxyXG4gICAgICAgICAgICBsZXQgbGVmdF9rZXlzID0gdGhpcy5rZXlzLnNsaWNlKDAsIHNwbGl0KTtcclxuICAgICAgICAgICAgbGV0IGxlZnRfbm9kZXMgPSB0aGlzLm5vZGVzLnNsaWNlKDAsICh0aGlzLkxFQUYpID8gc3BsaXQgOiBzcGxpdCArIDEpXHJcblxyXG4gICAgICAgICAgICBsZXQgcmlnaHRfa2V5cyA9IHRoaXMua2V5cy5zbGljZSgodGhpcy5MRUFGKSA/IHNwbGl0IDogc3BsaXQgKyAxKTtcclxuICAgICAgICAgICAgbGV0IHJpZ2h0X25vZGVzID0gdGhpcy5ub2Rlcy5zbGljZSgodGhpcy5MRUFGKSA/IHNwbGl0IDogc3BsaXQgKyAxKTtcclxuXHJcbiAgICAgICAgICAgIG5ld25vZGUua2V5cyA9IHJpZ2h0X2tleXM7XHJcbiAgICAgICAgICAgIG5ld25vZGUubm9kZXMgPSByaWdodF9ub2RlcztcclxuXHJcbiAgICAgICAgICAgIHRoaXMua2V5cyA9IGxlZnRfa2V5cztcclxuICAgICAgICAgICAgdGhpcy5ub2RlcyA9IGxlZnRfbm9kZXM7XHJcblxyXG4gICAgICAgICAgICBpZiAoSVNfUk9PVCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCByb290ID0gbmV3IEJ0cmVlTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJvb3Qua2V5cy5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgICAgICByb290Lm5vZGVzLnB1c2godGhpcywgbmV3bm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdub2RlOiByb290LFxyXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgbmV3bm9kZTogbmV3bm9kZSxcclxuICAgICAgICAgICAgICAgIGtleToga2V5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5ld25vZGU6IHRoaXMsXHJcbiAgICAgICAgICAgIGtleTogMFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgSW5zZXJ0cyBtb2RlbCBpbnRvIHRoZSB0cmVlLCBzb3J0ZWQgYnkgaWRlbnRpZmllci4gXHJcbiAgICAqL1xyXG4gICAgaW5zZXJ0KGlkZW50aWZpZXIsIG1vZGVsLCBtYXhfc2l6ZSwgSVNfUk9PVCA9IGZhbHNlLCByZXN1bHQpIHtcclxuXHJcbiAgICAgICAgbGV0IGwgPSB0aGlzLmtleXMubGVuZ3RoO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuTEVBRikge1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5rZXlzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpZGVudGlmaWVyIDwga2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbyA9IG5vZGUuaW5zZXJ0KGlkZW50aWZpZXIsIG1vZGVsLCBtYXhfc2l6ZSwgZmFsc2UsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGtleXIgPSBvLmtleTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3bm9kZSA9IG8ubmV3bm9kZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleXIgPT0gdW5kZWZpbmVkKSBkZWJ1Z2dlclxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3bm9kZSAhPSBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMua2V5cy5zcGxpY2UoaSwgMCwga2V5cik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZXMuc3BsaWNlKGkgKyAxLCAwLCBuZXdub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJhbGFuY2VJbnNlcnQobWF4X3NpemUsIElTX1JPT1QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXMubm9kZXNbaV07XHJcblxyXG4gICAgICAgICAgICBsZXQge1xyXG4gICAgICAgICAgICAgICAgbmV3bm9kZSxcclxuICAgICAgICAgICAgICAgIGtleVxyXG4gICAgICAgICAgICB9ID0gbm9kZS5pbnNlcnQoaWRlbnRpZmllciwgbW9kZWwsIG1heF9zaXplLCBmYWxzZSwgcmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChrZXkgPT0gdW5kZWZpbmVkKSBkZWJ1Z2dlclxyXG5cclxuICAgICAgICAgICAgaWYgKG5ld25vZGUgIT0gbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZXMucHVzaChuZXdub2RlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFsYW5jZUluc2VydChtYXhfc2l6ZSwgSVNfUk9PVCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMua2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgPT0ga2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2Rlc1tpXS5hZGQoa2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld25vZGU6IHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogaWRlbnRpZmllclxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlkZW50aWZpZXIgPCBrZXkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5rZXlzLnNwbGljZShpLCAwLCBpZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVzLnNwbGljZShpLCAwLCBtb2RlbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJhbGFuY2VJbnNlcnQobWF4X3NpemUsIElTX1JPT1QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmtleXMucHVzaChpZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgdGhpcy5ub2Rlcy5wdXNoKG1vZGVsKTtcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdC5hZGRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iYWxhbmNlSW5zZXJ0KG1heF9zaXplLCBJU19ST09UKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5ld25vZGU6IHRoaXMsXHJcbiAgICAgICAgICAgIGtleTogaWRlbnRpZmllcixcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGJhbGFuY2VSZW1vdmUoaW5kZXgsIG1pbl9zaXplKSB7XHJcbiAgICAgICAgbGV0IGxlZnQgPSB0aGlzLm5vZGVzW2luZGV4IC0gMV07XHJcbiAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5ub2Rlc1tpbmRleCArIDFdO1xyXG4gICAgICAgIGxldCBub2RlID0gdGhpcy5ub2Rlc1tpbmRleF07XHJcblxyXG4gICAgICAgIC8vTGVmdCByb3RhdGVcclxuICAgICAgICBpZiAobGVmdCAmJiBsZWZ0LmtleXMubGVuZ3RoID4gbWluX3NpemUpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBsayA9IGxlZnQua2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBsbiA9IGxlZnQubm9kZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgbm9kZS5rZXlzLnVuc2hpZnQoKG5vZGUuTEVBRikgPyBsZWZ0LmtleXNbbGsgLSAxXSA6IHRoaXMua2V5c1tpbmRleCAtIDFdKTtcclxuICAgICAgICAgICAgbm9kZS5ub2Rlcy51bnNoaWZ0KGxlZnQubm9kZXNbbG4gLSAxXSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmtleXNbaW5kZXggLSAxXSA9IGxlZnQua2V5c1tsayAtIDFdO1xyXG5cclxuICAgICAgICAgICAgbGVmdC5rZXlzLmxlbmd0aCA9IGxrIC0gMTtcclxuICAgICAgICAgICAgbGVmdC5ub2Rlcy5sZW5ndGggPSBsbiAtIDE7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgLy9SaWdodCByb3RhdGVcclxuICAgICAgICBpZiAocmlnaHQgJiYgcmlnaHQua2V5cy5sZW5ndGggPiBtaW5fc2l6ZSkge1xyXG5cclxuICAgICAgICAgICAgbm9kZS5rZXlzLnB1c2goKG5vZGUuTEVBRikgPyByaWdodC5rZXlzWzBdIDogdGhpcy5rZXlzW2luZGV4XSk7XHJcbiAgICAgICAgICAgIG5vZGUubm9kZXMucHVzaChyaWdodC5ub2Rlc1swXSk7XHJcblxyXG4gICAgICAgICAgICByaWdodC5rZXlzLnNwbGljZSgwLCAxKTtcclxuICAgICAgICAgICAgcmlnaHQubm9kZXMuc3BsaWNlKDAsIDEpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5rZXlzW2luZGV4XSA9IChub2RlLkxFQUYpID8gcmlnaHQua2V5c1sxXSA6IHJpZ2h0LmtleXNbMF07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAvL0xlZnQgb3IgUmlnaHQgTWVyZ2VcclxuICAgICAgICAgICAgaWYgKCFsZWZ0KSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgbGVmdCA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gcmlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbaW5kZXggLSAxXTtcclxuICAgICAgICAgICAgdGhpcy5rZXlzLnNwbGljZShpbmRleCAtIDEsIDEpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGVzLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG4gICAgICAgICAgICBsZWZ0Lm5vZGVzID0gbGVmdC5ub2Rlcy5jb25jYXQobm9kZS5ub2Rlcyk7XHJcbiAgICAgICAgICAgIGlmICghbGVmdC5MRUFGKSBsZWZ0LmtleXMucHVzaChrZXkpXHJcbiAgICAgICAgICAgIGxlZnQua2V5cyA9IGxlZnQua2V5cy5jb25jYXQobm9kZS5rZXlzKTtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAobGVmdC5MRUFGKVxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZWZ0LmtleXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlZnQua2V5c1tpXSAhPSBsZWZ0Lm5vZGVzW2ldLmlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlKHN0YXJ0LCBlbmQsIElTX1JPT1QgPSBmYWxzZSwgbWluX3NpemUsIG91dF9jb250YWluZXIpIHtcclxuICAgICAgICBsZXQgbCA9IHRoaXMua2V5cy5sZW5ndGgsXHJcbiAgICAgICAgICAgIG91dCA9IDAsXHJcbiAgICAgICAgICAgIG91dF9ub2RlID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLkxFQUYpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPD0ga2V5KVxyXG4gICAgICAgICAgICAgICAgICAgIG91dCArPSB0aGlzLm5vZGVzW2ldLnJlbW92ZShzdGFydCwgZW5kLCBmYWxzZSwgbWluX3NpemUsIG91dF9jb250YWluZXIpLm91dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgb3V0ICs9IHRoaXMubm9kZXNbaV0ucmVtb3ZlKHN0YXJ0LCBlbmQsIGZhbHNlLCBtaW5fc2l6ZSwgb3V0X2NvbnRhaW5lcikub3V0O1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ub2Rlc1tpXS5rZXlzLmxlbmd0aCA8IG1pbl9zaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYmFsYW5jZVJlbW92ZShpLCBtaW5fc2l6ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbC0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGVzLmxlbmd0aCA9PSAxKVxyXG4gICAgICAgICAgICAgICAgb3V0X25vZGUgPSB0aGlzLm5vZGVzWzBdO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5rZXlzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPD0gZW5kICYmIGtleSA+PSBzdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dF9jb250YWluZXIucHVzaCh0aGlzLm5vZGVzW2ldKVxyXG4gICAgICAgICAgICAgICAgICAgIG91dCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMua2V5cy5zcGxpY2UoaSwgMSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBsLS07XHJcbiAgICAgICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBvdXRfbm9kZSxcclxuICAgICAgICAgICAgb3V0XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoc3RhcnQsIGVuZCwgb3V0X2NvbnRhaW5lcikge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXJ0IHx8ICFlbmQpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLkxFQUYpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5rZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0IDw9IGtleSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVzW2ldLmdldChzdGFydCwgZW5kLCBvdXRfY29udGFpbmVyKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm5vZGVzW2ldLmdldChzdGFydCwgZW5kLCBvdXRfY29udGFpbmVyLCApXHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgb3V0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMua2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA8PSBlbmQgJiYga2V5ID49IHN0YXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgIG91dF9jb250YWluZXIucHVzaCh0aGlzLm5vZGVzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIEJUcmVlTW9kZWxDb250YWluZXJcclxufSIsImltcG9ydCB7XHJcbiAgICBTY2hlbWFUeXBlXHJcbn0gZnJvbSBcIi4vc2NoZW1hX3R5cGUuanNcIlxyXG5cclxubGV0IE5VTUJFUiA9IG5ldyhjbGFzcyBOdW1iZXJTY2hlbWEgZXh0ZW5kcyBTY2hlbWFUeXBlIHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRfdmFsdWUgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlKHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHZlcmlmeSh2YWx1ZSwgcmVzdWx0KSB7XHJcbiAgICAgICAgcmVzdWx0LnZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYodmFsdWUgPT0gTmFOIHx8IHZhbHVlID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHJlc3VsdC52YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXN1bHQucmVhc29uID0gXCJJbnZhbGlkIG51bWJlciB0eXBlLlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXIoaWRlbnRpZmllciwgZmlsdGVycykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgPT0gZmlsdGVyc1tpXSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG59KSgpXHJcblxyXG5leHBvcnQge1xyXG4gICAgTlVNQkVSXHJcbn07IiwiY29uc3QgbW9udGhzID0gW3tcclxuICAgIG5hbWU6IFwiSmFudWFyeVwiLFxyXG4gICAgZGF5czogMzEsXHJcbiAgICBkYXlfb2Zmc2V0OiAwLFxyXG4gICAgZGF5X29mZnNlX2xlYXB0OiAwXHJcbn0sIHtcclxuICAgIG5hbWU6IFwiRmVicnVhcnlcIixcclxuICAgIGRheXM6IDI4LFxyXG4gICAgZGF5X29mZnNldDogMzEsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDMxXHJcbn0sIHtcclxuICAgIG5hbWU6IFwiTWFyY2hcIixcclxuICAgIGRheXM6IDMxLFxyXG4gICAgZGF5X29mZnNldDogNTksXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDYwXHJcbn0sIHtcclxuICAgIG5hbWU6IFwiQXByaWxcIixcclxuICAgIGRheXM6IDMwLFxyXG4gICAgZGF5X29mZnNldDogOTAsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDkxXHJcbn0sIHtcclxuICAgIG5hbWU6IFwiTWF5XCIsXHJcbiAgICBkYXlzOiAzMSxcclxuICAgIGRheV9vZmZzZXQ6IDEyMCxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogMTIxXHJcbn0sIHtcclxuICAgIG5hbWU6IFwiSnVuZVwiLFxyXG4gICAgZGF5czogMzAsXHJcbiAgICBkYXlfb2Zmc2V0OiAxNTEsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDE1MlxyXG59LCB7XHJcbiAgICBuYW1lOiBcIkp1bHlcIixcclxuICAgIGRheXM6IDMxLFxyXG4gICAgZGF5X29mZnNldDogMTgxLFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiAxODJcclxufSwge1xyXG4gICAgbmFtZTogXCJBdWd1c3RcIixcclxuICAgIGRheXM6IDMxLFxyXG4gICAgZGF5X29mZnNldDogMjEyLFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiAyMTNcclxufSwge1xyXG4gICAgbmFtZTogXCJTZXB0ZW1iZXJcIixcclxuICAgIGRheXM6IDMwLFxyXG4gICAgZGF5X29mZnNldDogMjQzLFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiAyNDRcclxufSwge1xyXG4gICAgbmFtZTogXCJPY3RvYmVyXCIsXHJcbiAgICBkYXlzOiAzMSxcclxuICAgIGRheV9vZmZzZXQ6IDI3MyxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogMjc0XHJcbn0sIHtcclxuICAgIG5hbWU6IFwiTm92ZW1iZXJcIixcclxuICAgIGRheXM6IDMwLFxyXG4gICAgZGF5X29mZnNldDogMzA0LFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiAzMDVcclxufSwge1xyXG4gICAgbmFtZTogXCJEZWNlbWJlclwiLFxyXG4gICAgZGF5czogMzEsXHJcbiAgICBkYXlfb2Zmc2V0OiAzMyxcclxuICAgIGRheV9vZmZzZV9sZWFwdDogMzM1XHJcbn1dXHJcblxyXG5leHBvcnQge21vbnRoc30iLCJcclxudmFyIGRvdyA9IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdO1xyXG5cclxuZXhwb3J0IHtkb3d9IiwiZnVuY3Rpb24gR2V0RGF5U3RhcnRBbmRFbmQoZGF0ZSkge1xyXG4gICAgdmFyIHJ2YWwgPSB7XHJcbiAgICAgICAgc3RhcnQ6IDAsXHJcbiAgICAgICAgZW5kOiAwXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChkYXRlIGluc3RhbmNlb2YgRGF0ZSB8fCB0eXBlb2YoZGF0ZSkgPT0gXCJudW1iZXJcIiApIHtcclxuICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKGRhdGUpO1xyXG5cclxuICAgICAgICBkLnNldEhvdXJzKDApO1xyXG4gICAgICAgIGQuc2V0TWludXRlcygwKTtcclxuICAgICAgICBkLnNldFNlY29uZHMoMCk7XHJcbiAgICAgICAgZC5zZXRNaWxsaXNlY29uZHMoMClcclxuXHJcbiAgICAgICAgcnZhbC5zdGFydCA9IGQudmFsdWVPZigpO1xyXG4gICAgICAgIGQuc2V0RGF0ZShkLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIGQuc2V0U2Vjb25kcygtMSk7XHJcbiAgICAgICAgcnZhbC5lbmQgPSBkLnZhbHVlT2YoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcnZhbDtcclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIEdldERheVN0YXJ0QW5kRW5kXHJcbn0iLCJmdW5jdGlvbiBmbG9hdDI0dG8xMk1vZFRpbWUodGltZSwgQ0FQSVRBTCkge1xyXG4gICAgdmFyIElTX1BNID0gdGltZSA+PSAxMiAmJiB0aW1lIDwgMjQ7XHJcbiAgICB2YXIgbWludXRlcyA9ICgodGltZSAlIDEpICogNjApIHwgMDtcclxuICAgIHZhciBob3VycyA9ICgoKHRpbWUgfCAwKSAlIDEyKSAhPSAwKSA/ICh0aW1lIHwgMCkgJSAxMiA6IDEyO1xyXG5cclxuICAgIHJldHVybiAoaG91cnMgKyBcIjpcIiArIChcIjBcIiArIG1pbnV0ZXMpLnNsaWNlKC0yKSkgKyAoKElTX1BNKSA/IChDQVBJVEFMKSA/IFwiUE1cIiA6XCJwbVwiIDogKENBUElUQUwpID8gXCJBTVwiIDogXCJhbVwiKTtcclxufVxyXG5cclxuZXhwb3J0IHtmbG9hdDI0dG8xMk1vZFRpbWV9IiwiY2xhc3MgUG9pbnQyRCBleHRlbmRzIEZsb2F0NjRBcnJheXtcclxuXHRcclxuXHRjb25zdHJ1Y3Rvcih4LCB5KSB7XHJcblx0XHRzdXBlcigyKVxyXG5cclxuXHRcdGlmICh0eXBlb2YoeCkgPT0gXCJudW1iZXJcIikge1xyXG5cdFx0XHR0aGlzWzBdID0geDtcclxuXHRcdFx0dGhpc1sxXSA9IHk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoeCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcblx0XHRcdHRoaXNbMF0gPSB4WzBdO1xyXG5cdFx0XHR0aGlzWzFdID0geFsxXTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRyYXcoY3R4LCBzID0gMSl7XHJcblx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRjdHgubW92ZVRvKHRoaXMueCpzLHRoaXMueSpzKTtcclxuXHRcdGN0eC5hcmModGhpcy54KnMsIHRoaXMueSpzLCBzKjAuMDEsIDAsIDIqTWF0aC5QSSk7XHJcblx0XHRjdHguc3Ryb2tlKCk7XHJcblx0fVxyXG5cclxuXHRnZXQgeCAoKXsgcmV0dXJuIHRoaXNbMF19XHJcblx0c2V0IHggKHYpe2lmKHR5cGVvZih2KSAhPT0gXCJudW1iZXJcIikgcmV0dXJuOyB0aGlzWzBdID0gdn1cclxuXHJcblx0Z2V0IHkgKCl7IHJldHVybiB0aGlzWzFdfVxyXG5cdHNldCB5ICh2KXtpZih0eXBlb2YodikgIT09IFwibnVtYmVyXCIpIHJldHVybjsgdGhpc1sxXSA9IHZ9XHJcbn1cclxuXHJcbmV4cG9ydCB7UG9pbnQyRH0iLCJpbXBvcnQge1xyXG4gICAgUG9pbnQyRFxyXG59IGZyb20gXCIuL3BvaW50MkRcIlxyXG5cclxuZnVuY3Rpb24gY3VydmVQb2ludChjdXJ2ZSwgdCkge1xyXG4gICAgdmFyIHBvaW50ID0ge1xyXG4gICAgICAgIHg6IDAsXHJcbiAgICAgICAgeTogMFxyXG4gICAgfTtcclxuICAgIHBvaW50LnggPSBwb3NPbkN1cnZlKHQsIGN1cnZlWzBdLCBjdXJ2ZVsyXSwgY3VydmVbNF0pO1xyXG4gICAgcG9pbnQueSA9IHBvc09uQ3VydmUodCwgY3VydmVbMV0sIGN1cnZlWzNdLCBjdXJ2ZVs1XSk7XHJcbiAgICByZXR1cm4gcG9pbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBvc09uQ3VydmUodCwgcDEsIHAyLCBwMykge1xyXG4gICAgdmFyIHRpID0gMSAtIHQ7XHJcbiAgICByZXR1cm4gdGkgKiB0aSAqIHAxICsgMiAqIHRpICogdCAqIHAyICsgdCAqIHQgKiBwMztcclxufVxyXG5cclxuZnVuY3Rpb24gc3BsaXRDdXJ2ZShicCwgdCkge1xyXG4gICAgdmFyIGxlZnQgPSBbXTtcclxuICAgIHZhciByaWdodCA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGRyYXdDdXJ2ZShicCwgdCkge1xyXG4gICAgICAgIGlmIChicC5sZW5ndGggPT0gMikge1xyXG4gICAgICAgICAgICBsZWZ0LnB1c2goYnBbMF0sIGJwWzFdKTtcclxuICAgICAgICAgICAgcmlnaHQucHVzaChicFswXSwgYnBbMV0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdfYnAgPSBbXSAvL2JwLnNsaWNlKDAsLTIpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJwLmxlbmd0aCAtIDI7IGkgKz0gMikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQucHVzaChicFtpXSwgYnBbaSArIDFdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpID09IGJwLmxlbmd0aCAtIDQpIHtcclxuICAgICAgICAgICAgICAgICAgICByaWdodC5wdXNoKGJwW2kgKyAyXSwgYnBbaSArIDNdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG5ld19icC5wdXNoKCgxIC0gdCkgKiBicFtpXSArIHQgKiBicFtpICsgMl0pO1xyXG4gICAgICAgICAgICAgICAgbmV3X2JwLnB1c2goKDEgLSB0KSAqIGJwW2kgKyAxXSArIHQgKiBicFtpICsgM10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRyYXdDdXJ2ZShuZXdfYnAsIHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcmF3Q3VydmUoYnAsIHQpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgeDogbmV3IFFCZXppZXIocmlnaHQpLFxyXG4gICAgICAgIHk6IG5ldyBRQmV6aWVyKGxlZnQpXHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjdXJ2ZUludGVyc2VjdGlvbnMocDEsIHAyLCBwMykge1xyXG4gICAgdmFyIGludGVyc2VjdGlvbnMgPSB7XHJcbiAgICAgICAgYTogSW5maW5pdHksXHJcbiAgICAgICAgYjogSW5maW5pdHlcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGEgPSBwMSAtIDIgKiBwMiArIHAzO1xyXG5cclxuICAgIHZhciBiID0gMiAqIChwMiAtIHAxKTtcclxuXHJcbiAgICB2YXIgYyA9IHAxO1xyXG5cclxuICAgIGlmIChiID09IDApIHt9IGVsc2UgaWYgKE1hdGguYWJzKGEpIDwgMC4wMDAwMDAwMDAwNSkge1xyXG4gICAgICAgIGludGVyc2VjdGlvbnMuYSA9ICgtYyAvIGIpOyAvL2MgLyBiO1xyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgaW50ZXJzZWN0aW9ucy5hID0gKCgtYiAtIE1hdGguc3FydCgoYiAqIGIpIC0gNCAqIGEgKiBjKSkgLyAoMiAqIGEpKTtcclxuICAgICAgICBpbnRlcnNlY3Rpb25zLmIgPSAoKC1iICsgTWF0aC5zcXJ0KChiICogYikgLSA0ICogYSAqIGMpKSAvICgyICogYSkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGludGVyc2VjdGlvbnNcclxufVxyXG5cclxuY2xhc3MgUUJlemllciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4MSwgeTEsIHgyLCB5MiwgeDMsIHkzKSB7XHJcbiAgICAgICAgdGhpcy54MSA9IDA7XHJcbiAgICAgICAgdGhpcy54MiA9IDA7XHJcbiAgICAgICAgdGhpcy54MyA9IDA7XHJcbiAgICAgICAgdGhpcy55MSA9IDA7XHJcbiAgICAgICAgdGhpcy55MiA9IDA7XHJcbiAgICAgICAgdGhpcy55MyA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YoeDEpID09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgdGhpcy54MSA9IHgxO1xyXG4gICAgICAgICAgICB0aGlzLngyID0geDI7XHJcbiAgICAgICAgICAgIHRoaXMueDMgPSB4MztcclxuICAgICAgICAgICAgdGhpcy55MSA9IHkxO1xyXG4gICAgICAgICAgICB0aGlzLnkyID0geTI7XHJcbiAgICAgICAgICAgIHRoaXMueTMgPSB5MztcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHgxIGluc3RhbmNlb2YgUUJlemllcikge1xyXG4gICAgICAgICAgICB0aGlzLngxID0geDEueDE7XHJcbiAgICAgICAgICAgIHRoaXMueDIgPSB4MS54MjtcclxuICAgICAgICAgICAgdGhpcy54MyA9IHgxLngzO1xyXG4gICAgICAgICAgICB0aGlzLnkxID0geDEueTE7XHJcbiAgICAgICAgICAgIHRoaXMueTIgPSB4MS55MjtcclxuICAgICAgICAgICAgdGhpcy55MyA9IHgxLnkzO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoeDEgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICB0aGlzLngxID0geDFbMF07XHJcbiAgICAgICAgICAgIHRoaXMueTEgPSB4MVsxXTtcclxuICAgICAgICAgICAgdGhpcy54MiA9IHgxWzJdO1xyXG4gICAgICAgICAgICB0aGlzLnkyID0geDFbM107XHJcbiAgICAgICAgICAgIHRoaXMueDMgPSB4MVs0XTtcclxuICAgICAgICAgICAgdGhpcy55MyA9IHgxWzVdO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldmVyc2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRQmV6aWVyKFxyXG4gICAgICAgICAgICB0aGlzLngzLFxyXG4gICAgICAgICAgICB0aGlzLnkzLFxyXG4gICAgICAgICAgICB0aGlzLngyLFxyXG4gICAgICAgICAgICB0aGlzLnkyLFxyXG4gICAgICAgICAgICB0aGlzLngxLFxyXG4gICAgICAgICAgICB0aGlzLnkxXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHBvaW50KHQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50MkQoXHJcbiAgICAgICAgICAgIHBvc09uQ3VydmUodCwgdGhpcy54MSwgdGhpcy54MiwgdGhpcy54MyksXHJcbiAgICAgICAgICAgIHBvc09uQ3VydmUodCwgdGhpcy55MSwgdGhpcy55MiwgdGhpcy55MykpXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRhbmdlbnQodCkge1xyXG4gICAgICAgIHZhciB0YW4gPSB7XHJcbiAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgIHk6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgcHgxID0gdGhpcy54MiAtIHRoaXMueDE7XHJcbiAgICAgICAgdmFyIHB5MSA9IHRoaXMueTIgLSB0aGlzLnkxO1xyXG5cclxuICAgICAgICB2YXIgcHgyID0gdGhpcy54MyAtIHRoaXMueDI7XHJcbiAgICAgICAgdmFyIHB5MiA9IHRoaXMueTMgLSB0aGlzLnkyO1xyXG5cclxuICAgICAgICB0YW4ueCA9ICgxIC0gdCkgKiBweDEgKyB0ICogcHgyO1xyXG4gICAgICAgIHRhbi55ID0gKDEgLSB0KSAqIHB5MSArIHQgKiBweTI7XHJcblxyXG4gICAgICAgIHJldHVybiB0YW47XHJcbiAgICB9XHJcblxyXG4gICAgdG9BcnJheSgpIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMueDEsIHRoaXMueTEsIHRoaXMueDIsIHRoaXMueTIsIHRoaXMueDMsIHRoaXMueTNdO1xyXG4gICAgfVxyXG5cclxuICAgIHNwbGl0KHQpIHtcclxuICAgICAgICByZXR1cm4gc3BsaXRDdXJ2ZSh0aGlzLnRvQXJyYXkoKSwgdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcm9vdHNYICgpe1xyXG4gICAgXHRyZXR1cm4gdGhpcy5yb290cyhcclxuICAgIFx0XHR0aGlzLngxLCBcclxuICAgIFx0XHR0aGlzLngyLFxyXG4gICAgXHRcdHRoaXMueDNcclxuICAgIFx0XHQpXHJcbiAgICBcdFxyXG4gICAgfVxyXG5cclxuICAgIHJvb3RzKHAxLCBwMiwgcDMpIHtcclxuICAgICAgICB2YXIgY3VydmUgPSB0aGlzLnRvQXJyYXkoKTtcclxuXHJcbiAgICAgICAgdmFyIGMgPSBwMSAtICgyKnAyKSArIHAzO1xyXG4gICAgICAgIHZhciBiID0gMioocDIgLSBwMSk7XHJcbiAgICAgICAgdmFyIGEgPSBwMTtcclxuICAgICAgICB2YXIgYTIgPSBhKjI7XHJcbiAgICAgICAgY29uc29sZS5sb2coYyAsXCIgY1wiKVxyXG4gICAgICAgIHZhciBzcXJ0ID0gTWF0aC5zcXJ0KGIqYiAtIChhICogNCAqYykpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHNxcnQsIGIsIGEyLCBwMylcclxuICAgICAgICB2YXIgdDEgPSAoLWIgKyBzcXJ0KSAvIGEyO1xyXG4gICAgICAgIHZhciB0MiA9ICgtYiAtIHNxcnQpIC8gYTI7XHJcblxyXG4gICAgICAgIHJldHVybiBbIHQxICwgdDIgXTtcclxuICAgIH0gXHJcblxyXG4gICAgcm9vdHNhKCkge1xyXG4gICAgICAgIHZhciBjdXJ2ZSA9IHRoaXMudG9BcnJheSgpO1xyXG5cclxuICAgICAgICB2YXIgcDEgPSBjdXJ2ZVsxXTtcclxuICAgICAgICB2YXIgcDIgPSBjdXJ2ZVszXTtcclxuICAgICAgICB2YXIgcDMgPSBjdXJ2ZVs1XTtcclxuICAgICAgICB2YXIgeDEgPSBjdXJ2ZVswXTtcclxuICAgICAgICB2YXIgeDIgPSBjdXJ2ZVsyXTtcclxuICAgICAgICB2YXIgeDMgPSBjdXJ2ZVs0XTtcclxuXHJcbiAgICAgICAgdmFyIHB5MWQgPSAyICogKHAyIC0gcDEpO1xyXG4gICAgICAgIHZhciBweTJkID0gMiAqIChwMyAtIHAyKTtcclxuICAgICAgICB2YXIgYWQxID0gLXB5MWQgKyBweTJkO1xyXG4gICAgICAgIHZhciBiZDEgPSBweTFkO1xyXG5cclxuICAgICAgICB2YXIgcHgxZCA9IDIgKiAoeDIgLSB4MSk7XHJcbiAgICAgICAgdmFyIHB4MmQgPSAyICogKHgzIC0geDIpO1xyXG4gICAgICAgIHZhciBhZDIgPSAtcHgxZCArIHB4MmQ7XHJcbiAgICAgICAgdmFyIGJkMiA9IHB4MWQ7XHJcblxyXG4gICAgICAgIHZhciB0MSA9IC1iZDEgLyBhZDE7XHJcbiAgICAgICAgdmFyIHQyID0gLWJkMiAvIGFkMjtcclxuXHJcbiAgICAgICAgcmV0dXJuIFsgdDEgLCB0MiBdO1xyXG4gICAgfVxyXG5cclxuICAgIGJvdW5kaW5nQm94KCkge1xyXG4gICAgICAgIHZhciB4MSA9IGN1cnZlWzBdO1xyXG4gICAgICAgIHZhciB5MSA9IGN1cnZlWzFdO1xyXG4gICAgICAgIHZhciB4MiA9IGN1cnZlWzJdO1xyXG4gICAgICAgIHZhciB5MiA9IGN1cnZlWzNdO1xyXG4gICAgICAgIHZhciB4MyA9IGN1cnZlWzRdO1xyXG4gICAgICAgIHZhciB5MyA9IGN1cnZlWzVdO1xyXG4gICAgICAgIHZhciByb290cyA9IGdldFJvb3RzQ2xhbXBlZChjdXJ2ZSk7XHJcbiAgICAgICAgdmFyIG1pbl94ID0gTWF0aC5taW4oeDEsIHgyLCB4Mywgcm9vdHMueVswXSB8fCBJbmZpbml0eSwgcm9vdHMueFswXSB8fCBJbmZpbml0eSk7XHJcbiAgICAgICAgdmFyIG1pbl95ID0gTWF0aC5taW4oeTEsIHkyLCB5Mywgcm9vdHMueVsxXSB8fCBJbmZpbml0eSwgcm9vdHMueFsxXSB8fCBJbmZpbml0eSk7XHJcbiAgICAgICAgdmFyIG1heF94ID0gTWF0aC5tYXgoeDEsIHgyLCB4Mywgcm9vdHMueVswXSB8fCAtSW5maW5pdHksIHJvb3RzLnhbMF0gfHwgLUluZmluaXR5KTtcclxuICAgICAgICB2YXIgbWF4X3kgPSBNYXRoLm1heCh5MSwgeTIsIHkzLCByb290cy55WzFdIHx8IC1JbmZpbml0eSwgcm9vdHMueFsxXSB8fCAtSW5maW5pdHkpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtaW46IHtcclxuICAgICAgICAgICAgICAgIHg6IG1pbl94LFxyXG4gICAgICAgICAgICAgICAgeTogbWluX3lcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbWF4OiB7XHJcbiAgICAgICAgICAgICAgICB4OiBtYXhfeCxcclxuICAgICAgICAgICAgICAgIHk6IG1heF95XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0ZShhbmdsZSwgb2Zmc2V0KSB7XHJcbiAgICAgICAgYW5nbGUgPSAoYW5nbGUgLyAxODApICogTWF0aC5QSTtcclxuXHJcbiAgICAgICAgdmFyIG5ld19jdXJ2ZSA9IHRoaXMudG9BcnJheSgpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkgKz0gMikge1xyXG4gICAgICAgICAgICB2YXIgeCA9IGN1cnZlW2ldIC0gb2Zmc2V0Lng7XHJcbiAgICAgICAgICAgIHZhciB5ID0gY3VydmVbaSArIDFdIC0gb2Zmc2V0Lnk7XHJcbiAgICAgICAgICAgIG5ld19jdXJ2ZVtpXSA9ICgoeCAqIE1hdGguY29zKGFuZ2xlKSAtIHkgKiBNYXRoLnNpbihhbmdsZSkpKSArIG9mZnNldC54O1xyXG4gICAgICAgICAgICBuZXdfY3VydmVbaSArIDFdID0gKCh4ICogTWF0aC5zaW4oYW5nbGUpICsgeSAqIE1hdGguY29zKGFuZ2xlKSkpICsgb2Zmc2V0Lnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFFCZXppZXIobmV3X2N1cnZlKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcnNlY3RzKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6IGN1cnZlSW50ZXJzZWN0aW9ucyh0aGlzLngxLCB0aGlzLngyLCB0aGlzLngzKSxcclxuICAgICAgICAgICAgeTogY3VydmVJbnRlcnNlY3Rpb25zKHRoaXMueTEsIHRoaXMueTIsIHRoaXMueTMpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZCh4LCB5KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZih4KSA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUUJlemllcihcclxuICAgICAgICAgICAgICAgIHRoaXMueDEgKyB4LFxyXG4gICAgICAgICAgICAgICAgdGhpcy55MSArIHksXHJcbiAgICAgICAgICAgICAgICB0aGlzLngyICsgeCxcclxuICAgICAgICAgICAgICAgIHRoaXMueTIgKyB5LFxyXG4gICAgICAgICAgICAgICAgdGhpcy54MyArIHgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnkzICsgeSxcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFFCZXppZXJcclxufSIsImNvbnN0IHNxcnQgPSBNYXRoLnNxcnQ7XHJcbmNvbnN0IGNvcyA9IE1hdGguY29zO1xyXG5jb25zdCBhY29zID0gTWF0aC5hY29zO1xyXG5jb25zdCBQSSA9IE1hdGguUEk7XHJcbmNvbnN0IHNpbiA9IE1hdGguc2luO1xyXG5cclxuZXhwb3J0e1xyXG5cdHNxcnQsXHJcblx0Y29zLFxyXG5cdHNpbixcclxuXHRhY29zLFxyXG5cdGFjb3MyLFxyXG5cdFBJXHJcbn0iLCJpbXBvcnQge1BvaW50MkR9IGZyb20gXCIuL3BvaW50MkRcIlxyXG5pbXBvcnQge3NxcnQsY29zLGFjb3MsUEl9IGZyb20gXCIuL2NvbnN0c1wiXHJcblxyXG4vLyBBIGhlbHBlciBmdW5jdGlvbiB0byBmaWx0ZXIgZm9yIHZhbHVlcyBpbiB0aGUgWzAsMV0gaW50ZXJ2YWw6XHJcbmZ1bmN0aW9uIGFjY2VwdCh0KSB7XHJcbiAgcmV0dXJuIDA8PXQgJiYgdCA8PTE7XHJcbn1cclxuXHJcbi8vIEEgcmVhbC1jdWJlcm9vdHMtb25seSBmdW5jdGlvbjpcclxuZnVuY3Rpb24gY3ViZXJvb3Qodikge1xyXG4gIGlmKHY8MCkgcmV0dXJuIC1NYXRoLnBvdygtdiwxLzMpO1xyXG4gIHJldHVybiBNYXRoLnBvdyh2LDEvMyk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gcG9pbnQodCwgcDEsIHAyLCBwMywgcDQpIHtcclxuXHR2YXIgdGkgPSAxIC0gdDtcclxuXHR2YXIgdGkyID0gdGkgKiB0aTtcclxuXHR2YXIgdDIgPSB0ICogdDtcclxuXHJcblx0cmV0dXJuIHRpICogdGkyICogcDEgKyAzICogdGkyICogdCAqIHAyICsgdDIgKiAzICogdGkgKiBwMyArIHQyICogdCAqIHA0O1xyXG59XHJcblxyXG5cclxuY2xhc3MgQ0JlemllciBleHRlbmRzIEZsb2F0NjRBcnJheXtcclxuXHRjb25zdHJ1Y3Rvcih4MSwgeTEsIHgyLCB5MiwgeDMsIHkzLCB4NCwgeTQpIHtcclxuXHRcdHN1cGVyKDgpXHJcblxyXG5cdFx0Ly9NYXAgUDEgYW5kIFAyIHRvIHswLDAsMSwxfSBpZiBvbmx5IGZvdXIgYXJndW1lbnRzIGFyZSBwcm92aWRlZDsgZm9yIHVzZSB3aXRoIGFuaW1hdGlvbnNcclxuXHRcdGlmKGFyZ3VtZW50cy5sZW5ndGggPT0gNCl7XHJcblx0XHRcdHRoaXNbMF0gPSAwO1xyXG5cdFx0XHR0aGlzWzFdID0gMDtcclxuXHRcdFx0dGhpc1syXSA9IHgxO1xyXG5cdFx0XHR0aGlzWzNdID0geTE7XHJcblx0XHRcdHRoaXNbNF0gPSB4MjtcclxuXHRcdFx0dGhpc1s1XSA9IHkyO1xyXG5cdFx0XHR0aGlzWzZdID0gMTtcclxuXHRcdFx0dGhpc1s3XSA9IDE7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYgKHR5cGVvZih4MSkgPT0gXCJudW1iZXJcIikge1xyXG5cdFx0XHR0aGlzWzBdID0geDE7XHJcblx0XHRcdHRoaXNbMV0gPSB5MTtcclxuXHRcdFx0dGhpc1syXSA9IHgyO1xyXG5cdFx0XHR0aGlzWzNdID0geTI7XHJcblx0XHRcdHRoaXNbNF0gPSB4MztcclxuXHRcdFx0dGhpc1s1XSA9IHkzO1xyXG5cdFx0XHR0aGlzWzZdID0geDQ7XHJcblx0XHRcdHRoaXNbN10gPSB5NDtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh4MSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcblx0XHRcdHRoaXNbMF0gPSB4MVswXTtcclxuXHRcdFx0dGhpc1sxXSA9IHgxWzFdO1xyXG5cdFx0XHR0aGlzWzJdID0geDFbMl07XHJcblx0XHRcdHRoaXNbM10gPSB4MVszXTtcclxuXHRcdFx0dGhpc1s0XSA9IHgxWzRdO1xyXG5cdFx0XHR0aGlzWzVdID0geDFbNV07XHJcblx0XHRcdHRoaXNbNl0gPSB4MVs2XTtcclxuXHRcdFx0dGhpc1s3XSA9IHgxWzRdO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRnZXQgeDEgKCl7IHJldHVybiB0aGlzWzBdfVxyXG5cdHNldCB4MSAodil7dGhpc1swXSA9IHZ9XHJcblx0Z2V0IHgyICgpeyByZXR1cm4gdGhpc1syXX1cclxuXHRzZXQgeDIgKHYpe3RoaXNbMl0gPSB2fVxyXG5cdGdldCB4MyAoKXsgcmV0dXJuIHRoaXNbNF19XHJcblx0c2V0IHgzICh2KXt0aGlzWzRdID0gdn1cclxuXHRnZXQgeDQgKCl7IHJldHVybiB0aGlzWzZdfVxyXG5cdHNldCB4NCAodil7dGhpc1s2XSA9IHZ9XHJcblx0Z2V0IHkxICgpeyByZXR1cm4gdGhpc1sxXX1cclxuXHRzZXQgeTEgKHYpe3RoaXNbMV0gPSB2fVxyXG5cdGdldCB5MiAoKXsgcmV0dXJuIHRoaXNbM119XHJcblx0c2V0IHkyICh2KXt0aGlzWzNdID0gdn1cclxuXHRnZXQgeTMgKCl7IHJldHVybiB0aGlzWzVdfVxyXG5cdHNldCB5MyAodil7dGhpc1s1XSA9IHZ9XHJcblx0Z2V0IHk0ICgpeyByZXR1cm4gdGhpc1s3XX1cclxuXHRzZXQgeTQgKHYpe3RoaXNbN10gPSB2fVxyXG5cclxuXHRhZGQoeCx5ID0gMCl7XHJcblx0XHRyZXR1cm4gbmV3IENDdXJ2ZShcclxuXHRcdFx0dGhpc1swXSArIHgsXHJcblx0XHRcdHRoaXNbMV0gKyB5LFxyXG5cdFx0XHR0aGlzWzJdICsgeCxcclxuXHRcdFx0dGhpc1szXSArIHksXHJcblx0XHRcdHRoaXNbNF0gKyB4LFxyXG5cdFx0XHR0aGlzWzVdICsgeSxcclxuXHRcdFx0dGhpc1s2XSArIHgsXHJcblx0XHRcdHRoaXNbN10gKyB5XHJcblx0XHQpXHJcblx0fVxyXG5cclxuXHR2YWxZKHQpe1xyXG5cdFx0cmV0dXJuIHBvaW50KHQsIHRoaXNbMV0sIHRoaXNbM10sIHRoaXNbNV0sIHRoaXNbN10pO1xyXG5cdH1cclxuXHJcblx0dmFsWCh0KXtcclxuXHRcdHJldHVybiBwb2ludCh0LCB0aGlzWzBdLCB0aGlzWzJdLCB0aGlzWzRdLCB0aGlzWzZdKTtcclxuXHR9XHJcblxyXG5cdHBvaW50KHQpIHtcclxuXHRcdHJldHVybiBuZXcgUG9pbnQyRChcclxuXHRcdFx0cG9pbnQodCwgdGhpc1swXSwgdGhpc1syXSwgdGhpc1s0XSwgdGhpc1s2XSksXHJcblx0XHRcdHBvaW50KHQsIHRoaXNbMV0sIHRoaXNbM10sIHRoaXNbNV0sIHRoaXNbN10pXHJcblx0XHQpXHJcblx0fVxyXG5cdFxyXG5cdC8qKiBcclxuXHRcdEFxdWlyZWQgZnJvbSA6IGh0dHBzOi8vcG9tYXguZ2l0aHViLmlvL2JlemllcmluZm8vXHJcblx0XHRBdXRob3I6ICBNaWtlIFwiUG9tYXhcIiBLYW1lcm1hbnNcclxuXHRcdEdpdEh1YjogaHR0cHM6Ly9naXRodWIuY29tL1BvbWF4L1xyXG5cdCovXHJcblxyXG5cdHJvb3RzKHAxLHAyLHAzLHA0KSB7XHJcblx0XHR2YXIgZCA9ICgtcDEgKyAzICogcDIgLSAzICogcDMgKyBwNCksXHJcblx0XHRcdGEgPSAoMyAqIHAxIC0gNiAqIHAyICsgMyAqIHAzKSAvIGQsXHJcblx0XHRcdGIgPSAoLTMgKiBwMSArIDMgKiBwMikgLyBkLFxyXG5cdFx0XHRjID0gcDEgLyBkO1xyXG5cclxuXHRcdHZhciBwID0gKDMgKiBiIC0gYSAqIGEpIC8gMyxcclxuXHRcdFx0cDMgPSBwIC8gMyxcclxuXHRcdFx0cSA9ICgyICogYSAqIGEgKiBhIC0gOSAqIGEgKiBiICsgMjcgKiBjKSAvIDI3LFxyXG5cdFx0XHRxMiA9IHEgLyAyLFxyXG5cdFx0XHRkaXNjcmltaW5hbnQgPSBxMiAqIHEyICsgcDMgKiBwMyAqIHAzO1xyXG5cclxuXHRcdC8vIGFuZCBzb21lIHZhcmlhYmxlcyB3ZSdyZSBnb2luZyB0byB1c2UgbGF0ZXIgb246XHJcblx0XHR2YXIgdTEsIHYxLCByb290MSwgcm9vdDIsIHJvb3QzO1xyXG5cclxuXHRcdC8vIHRocmVlIHBvc3NpYmxlIHJlYWwgcm9vdHM6XHJcblx0XHRpZiAoZGlzY3JpbWluYW50IDwgMCkge1xyXG5cdFx0XHR2YXIgbXAzID0gLXAgLyAzLFxyXG5cdFx0XHRcdG1wMzMgPSBtcDMgKiBtcDMgKiBtcDMsXHJcblx0XHRcdFx0ciA9IHNxcnQobXAzMyksXHJcblx0XHRcdFx0dCA9IC1xIC8gKDIgKiByKSxcclxuXHRcdFx0XHRjb3NwaGkgPSB0IDwgLTEgPyAtMSA6IHQgPiAxID8gMSA6IHQsXHJcblx0XHRcdFx0cGhpID0gYWNvcyhjb3NwaGkpLFxyXG5cdFx0XHRcdGNydHIgPSBjdWJlcm9vdChyKSxcclxuXHRcdFx0XHR0MSA9IDIgKiBjcnRyO1xyXG5cdFx0XHRyb290MSA9IHQxICogY29zKHBoaSAvIDMpIC0gYSAvIDM7XHJcblx0XHRcdHJvb3QyID0gdDEgKiBjb3MoKHBoaSArIDIgKiBQSSkgLyAzKSAtIGEgLyAzO1xyXG5cdFx0XHRyb290MyA9IHQxICogY29zKChwaGkgKyA0ICogUEkpIC8gMykgLSBhIC8gMztcclxuXHRcdFx0cmV0dXJuIFtyb290Mywgcm9vdDEsIHJvb3QyXVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRocmVlIHJlYWwgcm9vdHMsIGJ1dCB0d28gb2YgdGhlbSBhcmUgZXF1YWw6XHJcblx0XHRpZiAoZGlzY3JpbWluYW50ID09PSAwKSB7XHJcblx0XHRcdHUxID0gcTIgPCAwID8gY3ViZXJvb3QoLXEyKSA6IC1jdWJlcm9vdChxMik7XHJcblx0XHRcdHJvb3QxID0gMiAqIHUxIC0gYSAvIDM7XHJcblx0XHRcdHJvb3QyID0gLXUxIC0gYSAvIDM7XHJcblx0XHRcdHJldHVybiBbcm9vdDIsIHJvb3QxXVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG9uZSByZWFsIHJvb3QsIHR3byBjb21wbGV4IHJvb3RzXHJcblx0XHR2YXIgc2QgPSBzcXJ0KGRpc2NyaW1pbmFudCk7XHJcblx0XHR1MSA9IGN1YmVyb290KHNkIC0gcTIpO1xyXG5cdFx0djEgPSBjdWJlcm9vdChzZCArIHEyKTtcclxuXHRcdHJvb3QxID0gdTEgLSB2MSAtIGEgLyAzO1xyXG5cdFx0cmV0dXJuIFtyb290MV1cclxuXHR9XHJcblxyXG5cdHJvb3RzWSgpIHtcclxuXHRcdHJldHVybiB0aGlzLnJvb3RzKHRoaXNbMV0sdGhpc1szXSx0aGlzWzVdLHRoaXNbN10pXHJcblx0fVxyXG5cclxuXHRyb290c1goKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5yb290cyh0aGlzWzBdLHRoaXNbMl0sdGhpc1s0XSx0aGlzWzZdKVxyXG5cdH1cclxuXHRcclxuXHRnZXRZYXRYKHgpe1xyXG5cdFx0dmFyIHgxID0gdGhpc1swXSAtIHgsIHgyID0gdGhpc1syXSAtIHgsIHgzID0gdGhpc1s0XSAtIHgsIHg0ID0gdGhpc1s2XSAtIHgsXHJcblx0XHRcdHgyXzMgPSB4MiAqIDMsIHgxXzMgPSB4MSAqMywgeDNfMyA9IHgzICogMyxcclxuXHRcdFx0ZCA9ICgteDEgKyB4Ml8zIC0geDNfMyArIHg0KSwgZGkgPSAxL2QsIGkzID0gMS8zLFxyXG5cdFx0XHRhID0gKHgxXzMgLSA2ICogeDIgKyB4M18zKSAqIGRpLFxyXG5cdFx0XHRiID0gKC14MV8zICsgeDJfMykgKiBkaSxcclxuXHRcdFx0YyA9IHgxICogZGksXHJcblx0XHRcdHAgPSAoMyAqIGIgLSBhICogYSkgKiBpMyxcclxuXHRcdFx0cDMgPSBwICogaTMsXHJcblx0XHRcdHEgPSAoMiAqIGEgKiBhICogYSAtIDkgKiBhICogYiArIDI3ICogYykgKiAoMS8yNyksXHJcblx0XHRcdHEyID0gcSAqIDAuNSxcclxuXHRcdFx0ZGlzY3JpbWluYW50ID0gcTIgKiBxMiArIHAzICogcDMgKiBwMztcclxuXHJcblx0XHQvLyBhbmQgc29tZSB2YXJpYWJsZXMgd2UncmUgZ29pbmcgdG8gdXNlIGxhdGVyIG9uOlxyXG5cdFx0dmFyIHUxLCB2MSwgcm9vdDtcclxuXHJcblx0XHQvL1RocmVlIHJlYWwgcm9vdHMgY2FuIG5ldmVyIGhhcHBlbiBpZiBwMSgwLDApIGFuZCBwNCgxLDEpO1xyXG5cclxuXHRcdC8vIHRocmVlIHJlYWwgcm9vdHMsIGJ1dCB0d28gb2YgdGhlbSBhcmUgZXF1YWw6XHJcblx0XHRpZiAoZGlzY3JpbWluYW50IDwgMCkge1xyXG5cdFx0XHR2YXIgbXAzID0gLXAgLyAzLFxyXG5cdFx0XHRcdG1wMzMgPSBtcDMgKiBtcDMgKiBtcDMsXHJcblx0XHRcdFx0ciA9IHNxcnQobXAzMyksXHJcblx0XHRcdFx0dCA9IC1xIC8gKDIgKiByKSxcclxuXHRcdFx0XHRjb3NwaGkgPSB0IDwgLTEgPyAtMSA6IHQgPiAxID8gMSA6IHQsXHJcblx0XHRcdFx0cGhpID0gYWNvcyhjb3NwaGkpLFxyXG5cdFx0XHRcdGNydHIgPSBjdWJlcm9vdChyKSxcclxuXHRcdFx0XHR0MSA9IDIgKiBjcnRyO1xyXG5cdFx0XHRyb290ID0gdDEgKiBjb3MoKHBoaSArIDQgKiBQSSkgLyAzKSAtIGEgLyAzO1xyXG5cdFx0fWVsc2UgaWYgKGRpc2NyaW1pbmFudCA9PT0gMCkge1xyXG5cdFx0XHR1MSA9IHEyIDwgMCA/IGN1YmVyb290KC1xMikgOiAtY3ViZXJvb3QocTIpO1xyXG5cdFx0XHRyb290ID0gLXUxIC0gYSAqIGkzO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHZhciBzZCA9IHNxcnQoZGlzY3JpbWluYW50KTtcclxuXHRcdFx0Ly8gb25lIHJlYWwgcm9vdCwgdHdvIGNvbXBsZXggcm9vdHNcclxuXHRcdFx0dTEgPSBjdWJlcm9vdChzZCAtIHEyKTtcclxuXHRcdFx0djEgPSBjdWJlcm9vdChzZCArIHEyKTtcclxuXHRcdFx0cm9vdCA9IHUxIC0gdjEgLSBhICogaTM7XHRcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcG9pbnQocm9vdCwgdGhpc1sxXSwgdGhpc1szXSwgdGhpc1s1XSwgdGhpc1s3XSk7XHJcblx0fVxyXG5cdC8qKlxyXG5cdFx0R2l2ZW4gYSBDYW52YXMgMkQgY29udGV4dCBvYmplY3QgYW5kIHNjYWxlIHZhbHVlLCBzdHJva2VzIGEgY3ViaWMgYmV6aWVyIGN1cnZlLlxyXG5cdCovXHJcblx0ZHJhdyhjdHgsIHMgPSAxKXtcclxuXHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdGN0eC5tb3ZlVG8odGhpc1swXSpzLCB0aGlzWzFdKnMpXHJcblx0XHRjdHguYmV6aWVyQ3VydmVUbyhcclxuXHRcdFx0dGhpc1syXSpzLCB0aGlzWzNdKnMsXHJcblx0XHRcdHRoaXNbNF0qcywgdGhpc1s1XSpzLFxyXG5cdFx0XHR0aGlzWzZdKnMsIHRoaXNbN10qc1xyXG5cdFx0XHQpXHJcblx0XHRjdHguc3Ryb2tlKClcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCB7Q0Jlemllcn0iLCIvKipcclxuXHRKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIGEgdG91Y2ggc2Nyb2xsaW5nIGludGVyZmFjZSB1c2luZyB0b3VjaCBldmVudHNcclxuKi9cclxuY2xhc3MgVG91Y2hTY3JvbGxlciB7XHJcbiAgICAvKiogXHJcbiAgICAgICAgQ29uc3RydWN0cyBhIHRvdWNoIG9iamVjdCBhcm91bmQgYSBnaXZlbiBkb20gZWxlbWVudC4gRnVuY3Rpb25zIGxpc3RlbmVycyBjYW4gYmUgYm91bmQgdG8gdGhpcyBvYmplY3QgdXNpbmdcclxuICAgICAgICB0aGlzIGFkZEV2ZW50TGlzdGVuZXIgbWV0aG9kLlxyXG4gICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGRyYWcgPSAwLjAyLCB0b3VjaGlkID0gMCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMub3JpZ2luX3ggPSAwO1xyXG4gICAgICAgIHRoaXMub3JpZ2luX3kgPSAwO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHlfeCA9IDA7XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eV95ID0gMDtcclxuICAgICAgICB0aGlzLkdPID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmRyYWcgPSAoZHJhZyA+IDApID8gZHJhZyA6IDAuMDI7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuXHJcbiAgICAgICAgaWYgKCF0b3VjaGlkIGluc3RhbmNlb2YgTnVtYmVyKVxyXG4gICAgICAgICAgICB0b3VjaGlkID0gMDtcclxuXHJcbiAgICAgICAgbGV0IHRpbWVfb2xkID0gMDtcclxuXHJcbiAgICAgICAgbGV0IGZyYW1lID0gKGR4LCBkeSwgc3RlcHMsIHJhdGlvID0gMSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IGRyYWdfdmFsID0gdGhpcy5kcmFnO1xyXG5cclxuICAgICAgICAgICAgZHggLT0gZHggKiBkcmFnX3ZhbCAqIHN0ZXBzICogcmF0aW87XHJcbiAgICAgICAgICAgIGR5IC09IGR5ICogZHJhZ192YWwgKiBzdGVwcyAqIHJhdGlvO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRtID0gTWF0aC5tYXgoTWF0aC5hYnMoZHkpLCBNYXRoLmFicyhkeSkpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGVuZCA9ICEoc3RlcHMgPiAwICYmIGRtID4gMC4xICYmIHRoaXMuR08pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFlbmQpIHtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJhbWUoZHgsIGR5LCAxKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGVuZCA9IGVuZCAmJiBzdGVwcyAhPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxpc3RlbmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnNbaV0oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkeCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFxyXG4gICAgICAgICAgICAgICAgICAgIH0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5HTyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ldmVudF9iID0gKGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHRpbWVfb2xkID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG91Y2ggPSBlLnRvdWNoZXNbdG91Y2hpZF07XHJcblxyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5X3ggPSB0aGlzLm9yaWdpbl94IC0gdG91Y2guY2xpZW50WDtcclxuICAgICAgICAgICAgdGhpcy52ZWxvY2l0eV95ID0gdGhpcy5vcmlnaW5feSAtIHRvdWNoLmNsaWVudFk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbl94ID0gdG91Y2guY2xpZW50WDtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5feSA9IHRvdWNoLmNsaWVudFk7XHJcblxyXG4gICAgICAgICAgICBmcmFtZSh0aGlzLnZlbG9jaXR5X3gsIHRoaXMudmVsb2NpdHlfeSwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmV2ZW50X2MgPSAoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IHRpbWVfbmV3ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGlmZiA9IHRpbWVfbmV3IC0gdGltZV9vbGQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3RlcHMgPSBNYXRoLm1pbihkaWZmIC8gOC42NjY2NjY2LCAxIC8gdGhpcy5kcmFnKTsgLy8gNjAgRlBTXHJcblxyXG4gICAgICAgICAgICB0aGlzLkdPID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGZyYW1lKHRoaXMudmVsb2NpdHlfeCwgdGhpcy52ZWxvY2l0eV95LCBzdGVwcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5X3ggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5X3kgPSAwO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5ldmVudF9iKTtcclxuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLmV2ZW50X2MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ldmVudF9hID0gKGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmKCF0aGlzLkdPKXtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZnVhbHQoKTtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRpbWVfb2xkID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLkdPID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG91Y2ggPSBlLnRvdWNoZXNbdG91Y2hpZF07XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRvdWNoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5feSA9IHRvdWNoLmNsaWVudFk7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luX3ggPSB0b3VjaC5jbGllbnRYO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5ldmVudF9iKTtcclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLmV2ZW50X2MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMuZXZlbnRfYSk7XHJcblxyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0aGlzLmV2ZW50X2EpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcihjYWxsYmFjaykge1xyXG4gICAgICAgIGlmIChjYWxsYmFjayBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnNbaV0gPT0gY2FsbGJhY2spIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihjYWxsYmFjaykge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubGlzdGVuZXJzW2ldID09IGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBUb3VjaFNjcm9sbGVyXHJcbn0iLCJpbXBvcnQge0xleGVyfSBmcm9tIFwiLi9jb21tb24vc3RyaW5nX3BhcnNpbmcvbGV4ZXJcIlxyXG5pbXBvcnQge1Rva2VuaXplcn0gZnJvbSBcIi4vY29tbW9uL3N0cmluZ19wYXJzaW5nL3Rva2VuaXplclwiXHJcblxyXG4vL1RpbWVcclxuaW1wb3J0IHttb250aHN9IGZyb20gXCIuL2NvbW1vbi9kYXRlX3RpbWUvbW9udGhzXCJcclxuaW1wb3J0IHtkb3d9IGZyb20gXCIuL2NvbW1vbi9kYXRlX3RpbWUvZGF5c19vZl93ZWVrXCJcclxuaW1wb3J0IHtHZXREYXlTdGFydEFuZEVuZH0gZnJvbSBcIi4vY29tbW9uL2RhdGVfdGltZS9kYXlfc3RhcnRfYW5kX2VuZF9lcG9jaFwiXHJcbmltcG9ydCB7ZmxvYXQyNHRvMTJNb2RUaW1lfSBmcm9tIFwiLi9jb21tb24vZGF0ZV90aW1lL3RpbWUuanNcIlxyXG5cclxuLy9NYXRoXHJcbmltcG9ydCB7UUJlemllcn0gZnJvbSBcIi4vY29tbW9uL21hdGgvcXVhZHJhdGljX2JlemllclwiXHJcbmltcG9ydCB7Q0Jlemllcn0gZnJvbSBcIi4vY29tbW9uL21hdGgvY3ViaWNfYmV6aWVyXCJcclxuaW1wb3J0IHtUdXJuUXVlcnlJbnRvRGF0YSwgVHVybkRhdGFJbnRvUXVlcnl9IGZyb20gXCIuL2NvbW1vbi91cmwvdXJsXCJcclxuaW1wb3J0IHtUb3VjaFNjcm9sbGVyfSBmcm9tIFwiLi9jb21tb24vZXZlbnQvdG91Y2hfc2Nyb2xsZXJcIlxyXG5cclxuXHJcbi8qKioqKioqKioqKiBTdHJpbmcgUGFyc2luZyBCYXNpYyBGdW5jdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbi8qKlxyXG5cdElmIGEgc3RyaW5nIG9iamVjdCBpcyBwYXNzZWQsIGNyZWF0ZXMgYSBsZXhlciB0aGF0IHRva2VuaXplIHRoZSBpbnB1dCBzdHJpbmcuIFxyXG4qL1xyXG5mdW5jdGlvbiBMZXgoc3RyaW5nKXtcclxuXHRpZih0eXBlb2Yoc3RyaW5nKSAhPT0gXCJzdHJpbmdcIil7XHJcblx0XHRjb25zb2xlLndhcm4oXCJDYW5ub3QgY3JlYXRlIGEgbGV4ZXIgb24gYSBub24tc3RyaW5nIG9iamVjdCFcIik7XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdHJldHVybiBuZXcgTGV4ZXIobmV3IFRva2VuaXplcihzdHJpbmcpKTtcclxufVxyXG5cclxuZXhwb3J0IHtcclxuXHRMZXgsXHJcblx0TGV4ZXIsIFxyXG5cdFRva2VuaXplcixcclxuXHRtb250aHMsXHJcblx0ZG93LFxyXG5cdFFCZXppZXIsXHJcblx0Q0JlemllcixcclxuXHRUdXJuUXVlcnlJbnRvRGF0YSxcclxuXHRUdXJuRGF0YUludG9RdWVyeSxcclxuXHRHZXREYXlTdGFydEFuZEVuZCxcclxuXHRUb3VjaFNjcm9sbGVyLFxyXG5cdGZsb2F0MjR0bzEyTW9kVGltZVxyXG59O1xyXG5cclxuLyoqKioqKiBHbG9iYWwgT2JqZWN0IEV4dGVuZGVycyAqKioqKioqKioqKioqL1xyXG4vLypcclxuRWxlbWVudC5wcm90b3R5cGUuZ2V0V2luZG93VG9wID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiAodGhpcy5vZmZzZXRUb3AgKyAoKHRoaXMucGFyZW50RWxlbWVudCkgPyB0aGlzLnBhcmVudEVsZW1lbnQuZ2V0V2luZG93VG9wKCkgOiAwKSk7XHJcbn1cclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmdldFdpbmRvd0xlZnQgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuICh0aGlzLm9mZnNldExlZnQgKyAoKHRoaXMucGFyZW50RWxlbWVudCkgPyB0aGlzLnBhcmVudEVsZW1lbnQuZ2V0V2luZG93TGVmdCgpIDogMCkpO1xyXG59XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5nZXRQYXJlbnRXaW5kb3dUb3AgPSBmdW5jdGlvbihib29sID0gZmFsc2Upe1xyXG4gICAgcmV0dXJuICgoKGJvb2wgPyB0aGlzLm9mZnNldFRvcCA6IDApKSsoKHRoaXMucGFyZW50RWxlbWVudCkgPyB0aGlzLnBhcmVudEVsZW1lbnQuZ2V0UGFyZW50V2luZG93VG9wKHRydWUpIDogMCkpO1xyXG59XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5nZXRQYXJlbnRXaW5kb3dMZWZ0ID0gZnVuY3Rpb24oYm9vbCA9IGZhbHNlKXtcclxuICAgIHJldHVybiAoKChib29sID8gdGhpcy5vZmZzZXRMZWZ0IDogMCkpKygodGhpcy5wYXJlbnRFbGVtZW50KSA/IHRoaXMucGFyZW50RWxlbWVudC5nZXRXaW5kb3dMZWZ0KHRydWUpIDogMCkpO1xyXG59XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5nZXRTdHlsZSA9IGZ1bmN0aW9uKHN0eWxlX25hbWUpe1xyXG5cdHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLG51bGwpLmdldFByb3BlcnR5VmFsdWUoc3R5bGVfbmFtZSk7XHJcbn1cclxuLy8qLyIsImltcG9ydCB7XHJcbiAgICBOVU1CRVJcclxufSBmcm9tIFwiLi9udW1iZXJfdHlwZS5qc1wiXHJcbmltcG9ydCB7XHJcbiAgICBMZXhcclxufSBmcm9tIFwiLi4vY29tbW9uXCJcclxuXHJcbmxldCBzY2FwZV9kYXRlID0gbmV3IERhdGUoKTtcclxuc2NhcGVfZGF0ZS5zZXRIb3VycygwKTtcclxuc2NhcGVfZGF0ZS5zZXRNaWxsaXNlY29uZHMoMCk7XHJcbnNjYXBlX2RhdGUuc2V0U2Vjb25kcygwKTtcclxuc2NhcGVfZGF0ZS5zZXRUaW1lKDApO1xyXG5cclxubGV0IERBVEUgPSBuZXcoY2xhc3MgRGF0ZVNjaGVtYSBleHRlbmRzIE5VTUJFUi5jb25zdHJ1Y3RvciB7XHJcbiAgICBwYXJzZSh2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWlzTmFOKHZhbHVlKSlcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHZhbHVlKTtcclxuXHJcbiAgICAgICAgbGV0IGxleCA9IExleCh2YWx1ZSk7XHJcblxyXG4gICAgICAgIGxldCB5ZWFyID0gcGFyc2VJbnQobGV4LnRva2VuLnRleHQpXHJcblxyXG4gICAgICAgIGlmICh5ZWFyKSB7XHJcblxyXG4gICAgICAgICAgICBzY2FwZV9kYXRlLnNldEhvdXJzKDApO1xyXG4gICAgICAgICAgICBzY2FwZV9kYXRlLnNldE1pbGxpc2Vjb25kcygwKTtcclxuICAgICAgICAgICAgc2NhcGVfZGF0ZS5zZXRTZWNvbmRzKDApO1xyXG4gICAgICAgICAgICBzY2FwZV9kYXRlLnNldFRpbWUoMCk7XHJcblxyXG4gICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICBsZXQgbW9udGggPSBwYXJzZUludChsZXgudG9rZW4udGV4dCkgLSAxO1xyXG4gICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICBsZXQgZGF5ID0gcGFyc2VJbnQobGV4LnRva2VuLnRleHQpXHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0RnVsbFllYXIoeWVhcik7XHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0RGF0ZShkYXkpO1xyXG4gICAgICAgICAgICBzY2FwZV9kYXRlLnNldE1vbnRoKG1vbnRoKTtcclxuXHJcbiAgICAgICAgICAgIGxleC5uZXh0KClcclxuICAgICAgICAgICAgaWYgKGxleC50b2tlbikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGhvdXJzID0gcGFyc2VJbnQobGV4LnRva2VuLnRleHQpXHJcbiAgICAgICAgICAgICAgICBsZXgubmV4dCgpXHJcbiAgICAgICAgICAgICAgICBsZXgubmV4dCgpXHJcbiAgICAgICAgICAgICAgICBsZXQgbWludXRlcyA9IHBhcnNlSW50KGxleC50b2tlbi50ZXh0KVxyXG5cclxuICAgICAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0SG91cnMoaG91cnMpO1xyXG4gICAgICAgICAgICAgICAgc2NhcGVfZGF0ZS5zZXRNaW51dGVzKG1pbnV0ZXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc2NhcGVfZGF0ZS52YWx1ZU9mKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIChuZXcgRGF0ZSh2YWx1ZSkpLnZhbHVlT2YoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgXHJcbiAgICAgKi9cclxuICAgIHZlcmlmeSh2YWx1ZSwgcmVzdWx0KSB7XHJcbiAgICAgICAgdGhpcy5wYXJzZSh2YWx1ZSk7XHJcbiAgICAgICAgc3VwZXIudmVyaWZ5KHZhbHVlLCByZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcihpZGVudGlmaWVyLCBmaWx0ZXJzKSB7XHJcblxyXG4gICAgICAgIGlmIChmaWx0ZXJzLmxlbmd0aCA+IDEpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZmlsdGVycy5sZW5ndGggLSAxOyBpIDwgbDsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3RhcnQgPSBmaWx0ZXJzW2ldO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVuZCA9IGZpbHRlcnNbaSArIDFdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzdGFydCA8PSBpZGVudGlmaWVyICYmIGlkZW50aWZpZXIgPD0gZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzdHJpbmcodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gKG5ldyBEYXRlKHZhbHVlKSkgKyBcIlwiO1xyXG4gICAgfVxyXG59KVxyXG5cclxuZXhwb3J0IHtcclxuICAgIERBVEVcclxufSIsImltcG9ydCB7XHJcbiAgICBOVU1CRVJcclxufSBmcm9tIFwiLi9udW1iZXJfdHlwZS5qc1wiXHJcblxyXG5sZXQgVElNRSA9IG5ldyhjbGFzcyBUaW1lU2NoZW1hIGV4dGVuZHMgTlVNQkVSLmNvbnN0cnVjdG9yIHtcclxuXHJcbiAgICBwYXJzZSh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghaXNOYU4odmFsdWUpKVxyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBob3VyID0gcGFyc2VJbnQodmFsdWUuc3BsaXQoXCI6XCIpWzBdKTtcclxuICAgICAgICAgICAgdmFyIG1pbiA9IHBhcnNlSW50KHZhbHVlLnNwbGl0KFwiOlwiKVsxXS5zcGxpdChcIiBcIilbMF0pO1xyXG4gICAgICAgICAgICB2YXIgaGFsZiA9ICh2YWx1ZS5zcGxpdChcIjpcIilbMV0uc3BsaXQoXCIgXCIpWzFdLnRvTG93ZXJDYXNlKCkgPT0gXCJwbVwiKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHZhciBob3VyID0gMDtcclxuICAgICAgICAgICAgdmFyIG1pbiA9IDA7XHJcbiAgICAgICAgICAgIHZhciBoYWxmID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KChob3VyICsgKChoYWxmKSA/IDEyIDogMCkgKyAobWluIC8gNjApKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmVyaWZ5KHZhbHVlLCByZXN1bHQpIHtcclxuICAgICAgICB0aGlzLnBhcnNlKHZhbHVlKTtcclxuICAgICAgICBzdXBlci52ZXJpZnkodmFsdWUsIHJlc3VsdCk7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyKGlkZW50aWZpZXIsIGZpbHRlcnMpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIHN0cmluZyh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiAobmV3IERhdGUodmFsdWUpKSArIFwiXCI7XHJcbiAgICB9XHJcbn0pKClcclxuXHJcbmV4cG9ydCB7XHJcbiAgICBUSU1FXHJcbn0iLCJpbXBvcnQge1xyXG4gICAgU2NoZW1hVHlwZVxyXG59IGZyb20gXCIuL3NjaGVtYV90eXBlLmpzXCJcclxuXHJcbmxldCBTVFJJTkcgPSBuZXcoY2xhc3MgU3RyaW5nU2NoZW1hIGV4dGVuZHMgU2NoZW1hVHlwZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdGFydF92YWx1ZSA9IFwiXCJcclxuICAgIH1cclxuICAgIHBhcnNlKHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlICsgXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICB2ZXJpZnkodmFsdWUsIHJlc3VsdCkge1xyXG4gICAgICAgIHJlc3VsdC52YWxpZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyKGlkZW50aWZpZXIsIGZpbHRlcnMpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpZGVudGlmaWVyLm1hdGNoKGZpbHRlcnNbaV0rXCJcIikpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxufSkoKVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFNUUklOR1xyXG59OyIsImltcG9ydCB7XHJcbiAgICBTY2hlbWFUeXBlXHJcbn0gZnJvbSBcIi4vc2NoZW1hX3R5cGUuanNcIlxyXG5cclxubGV0IEJPT0wgPSBuZXcoY2xhc3MgQm9vbFNjaGVtYSBleHRlbmRzIFNjaGVtYVR5cGUge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRfdmFsdWUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZSh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiAodmFsdWUpID8gdHJ1ZSA6IGZhbHNlOyBcclxuICAgIH1cclxuXHJcbiAgICB2ZXJpZnkodmFsdWUsIHJlc3VsdCkge1xyXG4gICAgICAgIHJlc3VsdC52YWxpZCA9IHRydWU7XHJcbiAgICAgICAgaWYoIXZhbHVlIGluc3RhbmNlb2YgQm9vbGVhbil7XHJcbiAgICAgICAgICAgIHJlc3VsdC52YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXN1bHQucmVhc29uID0gXCIgVmFsdWUgaXMgbm90IGEgQm9vbGVhbi5cIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXIoaWRlbnRpZmllciwgZmlsdGVycykge1xyXG4gICAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgQk9PTClcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxufSkoKVxyXG5cclxuZXhwb3J0IHtcclxuICAgIEJPT0xcclxufTsiLCJpbXBvcnQge1NjaGVtYVR5cGV9IGZyb20gXCIuL3NjaGVtYV90eXBlXCJcclxuaW1wb3J0IHtEQVRFfSBmcm9tIFwiLi9kYXRlX3R5cGVcIlxyXG5pbXBvcnQge1RJTUV9IGZyb20gXCIuL3RpbWVfdHlwZVwiXHJcbmltcG9ydCB7U1RSSU5HfSBmcm9tIFwiLi9zdHJpbmdfdHlwZVwiXHJcbmltcG9ydCB7TlVNQkVSfSBmcm9tIFwiLi9udW1iZXJfdHlwZVwiXHJcbmltcG9ydCB7Qk9PTH0gZnJvbSBcIi4vYm9vbF90eXBlXCJcclxuXHJcbmxldCBzY2hlbWEgPSB7XHJcblx0REFURSxcclxuXHRTVFJJTkcsXHJcblx0TlVNQkVSLFxyXG5cdEJPT0wsXHJcblx0VElNRVxyXG59XHJcblxyXG5leHBvcnQge1NjaGVtYVR5cGUsIHNjaGVtYX07ICIsImltcG9ydCB7XHJcbiAgICBNb2RlbEJhc2VcclxufSBmcm9tIFwiLi9tb2RlbF9iYXNlLmpzXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBNb2RlbENvbnRhaW5lcixcclxuICAgIE11bHRpSW5kZXhlZENvbnRhaW5lclxyXG59IGZyb20gXCIuL21vZGVsX2NvbnRhaW5lclwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQXJyYXlNb2RlbENvbnRhaW5lclxyXG59IGZyb20gXCIuL2FycmF5X2NvbnRhaW5lclwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQlRyZWVNb2RlbENvbnRhaW5lclxyXG59IGZyb20gXCIuL2J0cmVlX2NvbnRhaW5lclwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgU2NoZW1hVHlwZVxyXG59IGZyb20gXCIuLi9zY2hlbWEvc2NoZW1hc1wiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgU2NoZWR1bGVyXHJcbn0gZnJvbSBcIi4uL3NjaGVkdWxlclwiXHJcblxyXG5cclxuLyoqXHJcbiAgICBUaGlzIGlzIHVzZWQgYnkgTk1vZGVsIHRvIGNyZWF0ZSBjdXN0b20gcHJvcGVydHkgZ2V0dGVyIGFuZCBzZXR0ZXJzIFxyXG4gICAgb24gbm9uLU1vZGVsQ29udGFpbmVyIGFuZCBub24tTW9kZWwgcHJvcGVydGllcyBvZiB0aGUgTk1vZGVsIGNvbnN0cnVjdG9yLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gQ3JlYXRlU2NoZW1lZFByb3BlcnR5KGNvbnN0cnVjdG9yLCBzY2hlbWUsIHNjaGVtYV9uYW1lKSB7XHJcblxyXG4gICAgaWYgKGNvbnN0cnVjdG9yLnByb3RvdHlwZVtzY2hlbWFfbmFtZV0pXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgIGxldCBfX3NoYWRvd19uYW1lX18gPSBgX18ke3NjaGVtYV9uYW1lfV9fYDtcclxuXHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgX19zaGFkb3dfbmFtZV9fLCB7XHJcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICB2YWx1ZTogc2NoZW1lLnN0YXJ0X3ZhbHVlIHx8IHVuZGVmaW5lZFxyXG4gICAgfSlcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBzY2hlbWFfbmFtZSwge1xyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1tfX3NoYWRvd19uYW1lX19dO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSB7XHJcbiAgICAgICAgICAgICAgICB2YWxpZDogZmFsc2VcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCB2YWwgPSBzY2hlbWUucGFyc2UodmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgc2NoZW1lLnZlcmlmeSh2YWwsIHJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnZhbGlkICYmIHRoaXNbX19zaGFkb3dfbmFtZV9fXSAhPSB2YWwpXHJcbiAgICAgICAgICAgICAgICAodGhpc1tfX3NoYWRvd19uYW1lX19dID0gdmFsLCB0aGlzLnNjaGVkdWxlVXBkYXRlKHNjaGVtYV9uYW1lKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAgICBUaGlzIGlzIHVzZWQgYnkgTk1vZGVsIHRvIGNyZWF0ZSBjdXN0b20gcHJvcGVydHkgZ2V0dGVyIGFuZCBzZXR0ZXJzIFxyXG4gICAgb24gU2NoZW1lZCBNb2RlbENvbnRhaW5lciBwcm9wZXJ0aWVzIG9mIHRoZSBOTW9kZWwgY29uc3RydWN0b3IuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBDcmVhdGVNQ1NjaGVtZWRQcm9wZXJ0eShjb25zdHJ1Y3Rvciwgc2NoZW1lLCBzY2hlbWFfbmFtZSkge1xyXG5cclxuICAgIGxldCBzY2hlbWEgPSBzY2hlbWUuc2NoZW1hO1xyXG5cclxuICAgIGxldCBtY19jb25zdHJ1Y3RvciA9IHNjaGVtZS5jb250YWluZXI7XHJcblxyXG4gICAgbGV0IF9fc2hhZG93X25hbWVfXyA9IGBfXyR7c2NoZW1hX25hbWV9X19gO1xyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIF9fc2hhZG93X25hbWVfXywge1xyXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgIHZhbHVlOiBudWxsXHJcbiAgICB9KVxyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHNjaGVtYV9uYW1lLCB7XHJcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXNbX19zaGFkb3dfbmFtZV9fXSlcclxuICAgICAgICAgICAgICAgIHRoaXNbX19zaGFkb3dfbmFtZV9fXSA9IG5ldyBtY19jb25zdHJ1Y3RvcihzY2hlbWUuc2NoZW1hKVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbX19zaGFkb3dfbmFtZV9fXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgTUMgPSB0aGlzW19fc2hhZG93X25hbWVfX107XHJcbiAgICAgICAgICAgIGxldCBkYXRhID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YodmFsdWUpID09IFwic3RyaW5nXCIpXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgTUMgPSBuZXcgbWNfY29uc3RydWN0b3Ioc2NoZW1lLnNjaGVtYSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzW19fc2hhZG93X25hbWVfX10gPSBNQztcclxuICAgICAgICAgICAgICAgIE1DLmluc2VydChkYXRhKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZVVwZGF0ZShzY2hlbWFfbmFtZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBtY19jb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpc1tfX3NoYWRvd19uYW1lX19dID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzY2hlbWFfbmFtZSlcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVVcGRhdGUoc2NoZW1hX25hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAgICBUaGlzIGlzIHVzZWQgYnkgTk1vZGVsIHRvIGNyZWF0ZSBjdXN0b20gcHJvcGVydHkgZ2V0dGVyIGFuZCBzZXR0ZXJzIFxyXG4gICAgb24gTW9kZWwgcHJvcGVydGllcyBvZiB0aGUgTk1vZGVsIGNvbnN0cnVjdG9yLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gQ3JlYXRlTW9kZWxQcm9wZXJ0eShjb25zdHJ1Y3Rvciwgc2NoZW1lLCBzY2hlbWFfbmFtZSkge1xyXG5cclxuICAgIGxldCBzY2hlbWEgPSBzY2hlbWUuc2NoZW1hO1xyXG5cclxuICAgIGxldCBfX3NoYWRvd19uYW1lX18gPSBgX18ke3NjaGVtYV9uYW1lfV9fYDtcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBzY2hlbWFfbmFtZSwge1xyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIHNjaGVtYV9uYW1lLCB7XHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBuZXcgc2NoZW1lKClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbc2NoZW1hX25hbWVdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHt9XHJcbiAgICB9KVxyXG59XHJcblxyXG5jbGFzcyBNb2RlbCBleHRlbmRzIE1vZGVsQmFzZSB7XHJcbiAgICAvKipcclxuICAgICBcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZGF0YSkge1xyXG5cclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vVGhlIHNjaGVtYSBpcyBzdG9yZWQgZGlyZWN0bHkgb24gdGhlIGNvbnN0cnVjdG9yLiBJZiBpdCBpcyBub3QgdGhlcmUsIHRoZW4gY29uc2lkZXIgdGhpcyBtb2RlbCB0eXBlIHRvIFwiQU5ZXCJcclxuICAgICAgICBsZXQgc2NoZW1hID0gdGhpcy5jb25zdHJ1Y3Rvci5zY2hlbWE7XHJcblxyXG4gICAgICAgIGlmIChzY2hlbWEpIHtcclxuICAgICAgICAgICAgbGV0IF9fRmluYWxDb25zdHJ1Y3Rvcl9fID0gc2NoZW1hLl9fRmluYWxDb25zdHJ1Y3Rvcl9fO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIFwic2NoZW1hXCIsIHtcclxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBzY2hlbWFcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGlmICghX19GaW5hbENvbnN0cnVjdG9yX18pIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHNjaGVtYV9uYW1lIGluIHNjaGVtYSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzY2hlbWUgPSBzY2hlbWFbc2NoZW1hX25hbWVdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2NoZW1lIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNjaGVtZVswXSAmJiBzY2hlbWVbMF0uY29udGFpbmVyICYmIHNjaGVtZVswXS5zY2hlbWEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZU1DU2NoZW1lZFByb3BlcnR5KGNvbnN0cnVjdG9yLCBzY2hlbWVbMF0sIHNjaGVtYV9uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzY2hlbWVbMF0gaW5zdGFuY2VvZiBNb2RlbENvbnRhaW5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ3JlYXRlTW9kZWxQcm9wZXJ0eShjb25zdHJ1Y3Rvciwgc2NoZW1lWzBdLmNvbnN0cnVjdG9yLCBzY2hlbWFfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjaGVtZSBpbnN0YW5jZW9mIE1vZGVsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVNb2RlbFByb3BlcnR5KGNvbnN0cnVjdG9yLCBzY2hlbWVbMF0uY29uc3RydWN0b3IsIHNjaGVtYV9uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzY2hlbWUgaW5zdGFuY2VvZiBTY2hlbWFUeXBlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVTY2hlbWVkUHJvcGVydHkoY29uc3RydWN0b3IsIHNjaGVtZSwgc2NoZW1hX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBDb3VsZCBub3QgY3JlYXRlIHByb3BlcnR5ICR7c2NoZW1hX25hbWV9LmApXHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIE9iamVjdC5zZWFsKGNvbnN0cnVjdG9yKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNjaGVtYSwgXCJfX0ZpbmFsQ29uc3RydWN0b3JfX1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLy9zY2hlbWEuX19GaW5hbENvbnN0cnVjdG9yX18gPSBjb25zdHJ1Y3RvcjtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgLy9TdGFydCB0aGUgcHJvY2VzcyBvdmVyIHdpdGggYSBuZXdseSBtaW50ZWQgTW9kZWwgdGhhdCBoYXMgdGhlIHByb3BlcnRpZXMgZGVmaW5lZCBpbiB0aGUgU2NoZW1hXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGNvbnN0cnVjdG9yKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLyogVGhpcyB3aWxsIGJlIGFuIEFOWSBNb2RlbCAqL1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEFueU1vZGVsKGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRhdGEpXHJcbiAgICAgICAgICAgIHRoaXMuYWRkKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJlbW92ZXMgYWxsIGhlbGQgcmVmZXJlbmNlcyBhbmQgY2FsbHMgdW5zZXRNb2RlbCBvbiBhbGwgbGlzdGVuaW5nIHZpZXdzLlxyXG4gICAgKi9cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZW1hID0gbnVsbDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgYSBpbiB0aGlzKSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wID0gdGhpc1thXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZihwcm9wKSA9PSBcIm9iamVjdFwiICYmIHByb3AuZGVzdHJ1Y3RvciBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxyXG4gICAgICAgICAgICAgICAgcHJvcC5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXNbYV0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgIC8vZGVidWdnZXJcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBHaXZlbiBhIGtleSwgcmV0dXJucyBhbiBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSBzdGF0dXMgb2YgdGhlIHZhbHVlIGNvbnRhaW5lZCwgaWYgaXQgaXMgdmFsaWQgb3Igbm90LCBhY2NvcmRpbmcgdG8gdGhlIHNjaGVtYSBmb3IgdGhhdCBwcm9wZXJ0eS4gXHJcbiAgICAqL1xyXG4gICAgdmVyaWZ5KGtleSkge1xyXG5cclxuICAgICAgICBsZXQgb3V0X2RhdGEgPSB7XHJcbiAgICAgICAgICAgIHZhbGlkOiB0cnVlLFxyXG4gICAgICAgICAgICByZWFzb246IFwiXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgc2NoZW1lID0gdGhpcy5zY2hlbWFba2V5XTtcclxuXHJcbiAgICAgICAgaWYgKHNjaGVtZSkge1xyXG4gICAgICAgICAgICBpZiAoc2NoZW1lIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2NoZW1lIGluc3RhbmNlb2YgTW9kZWwpIHtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzY2hlbWUudmVyaWZ5KHRoaXNba2V5XSwgb3V0X2RhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0X2RhdGFcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZXR1cm5zIGEgcGFyc2VkIHZhbHVlIGJhc2VkIG9uIHRoZSBrZXkgXHJcbiAgICAqL1xyXG4gICAgc3RyaW5nKGtleSkge1xyXG4gICAgICAgIGxldCBvdXRfZGF0YSA9IHtcclxuICAgICAgICAgICAgdmFsaWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHJlYXNvbjogXCJcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChrZXkpIHtcclxuICAgICAgICAgICAgdmFyIHNjaGVtZSA9IHRoaXMuc2NoZW1hW2tleV07XHJcblxyXG4gICAgICAgICAgICBpZiAoc2NoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2NoZW1lIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0uc3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjaGVtZSBpbnN0YW5jZW9mIE1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1trZXldLnN0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2NoZW1lLnN0cmluZyh0aGlzW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEBwYXJhbSBkYXRhIDogQW4gb2JqZWN0IGNvbnRhaW5pbmcga2V5IHZhbHVlIHBhaXJzIHRvIGluc2VydCBpbnRvIHRoZSBtb2RlbC4gXHJcbiAgICAqL1xyXG4gICAgYWRkKGRhdGEpIHtcclxuICAgICAgICBmb3IgKGxldCBhIGluIGRhdGEpXHJcbiAgICAgICAgICAgIGlmIChhIGluIHRoaXMpIHRoaXNbYV0gPSBkYXRhW2FdO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQoZGF0YSkge1xyXG4gICAgICAgIHZhciBvdXRfZGF0YSA9IHt9O1xyXG5cclxuICAgICAgICBpZiAoIWRhdGEpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKVxyXG4gICAgICAgICAgICAgICAgaWYgKGEgaW4gdGhpcykgb3V0X2RhdGFbYV0gPSB0aGlzW2FdO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0X2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKCkge1xyXG4gICAgICAgIGxldCBvdXQgPSB7fTtcclxuXHJcbiAgICAgICAgbGV0IHNjaGVtYSA9IHRoaXMuc2NoZW1hO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBwcm9wIGluIHNjaGVtYSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHNjaGVtZSA9IHNjaGVtYVtwcm9wXTtcclxuXHJcbiAgICAgICAgICAgIG91dFtwcm9wXSA9IHRoaXNbcHJvcF1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gICAgVGhpcyBpcyB1c2VkIGJ5IE5Nb2RlbCB0byBjcmVhdGUgY3VzdG9tIHByb3BlcnR5IGdldHRlciBhbmQgc2V0dGVycyBcclxuICAgIG9uIG5vbi1Nb2RlbENvbnRhaW5lciBhbmQgbm9uLU1vZGVsIHByb3BlcnRpZXMgb2YgdGhlIE5Nb2RlbCBjb25zdHJ1Y3Rvci5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIENyZWF0ZUdlbmVyaWNQcm9wZXJ0eShjb25zdHJ1Y3RvciwgcHJvcF92YWwsIHByb3BfbmFtZSwgbW9kZWwpIHtcclxuXHJcbiAgICBpZiAoY29uc3RydWN0b3IucHJvdG90eXBlW3Byb3BfbmFtZV0pXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgIGxldCBfX3NoYWRvd19uYW1lX18gPSBgX18ke3Byb3BfbmFtZX1fX2A7XHJcblxyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIF9fc2hhZG93X25hbWVfXywge1xyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgdmFsOiBwcm9wX3ZhbFxyXG4gICAgfSlcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBwcm9wX25hbWUsIHtcclxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcblxyXG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzW19fc2hhZG93X25hbWVfX107XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnZhbGlkICYmIHRoaXNbX19zaGFkb3dfbmFtZV9fXSAhPSB2YWwpXHJcbiAgICAgICAgICAgICAgICAodGhpc1tfX3NoYWRvd19uYW1lX19dID0gdmFsLCBtb2RlbC5zY2hlZHVsZVVwZGF0ZShwcm9wX25hbWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBBbnlNb2RlbFByb3h5U2V0KG9iaiwgcHJvcCwgdmFsKSB7XHJcbiAgICBpZiAocHJvcCBpbiBvYmogJiYgb2JqW3Byb3BdID09IHZhbClcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAgIG9ialtwcm9wXSA9IHZhbDtcclxuXHJcbiAgICBvYmouc2NoZWR1bGVVcGRhdGUocHJvcCk7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbmNsYXNzIEFueU1vZGVsIGV4dGVuZHMgTW9kZWxCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHByb3BfbmFtZSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzW3Byb3BfbmFtZV0gPSBkYXRhW3Byb3BfbmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodGhpcywge1xyXG4gICAgICAgICAgICBzZXQ6IEFueU1vZGVsUHJveHlTZXRcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEFsaWFzIGZvciBkZXN0cnVjdG9yXHJcbiAgICAqL1xyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmVtb3ZlcyBhbGwgaGVsZCByZWZlcmVuY2VzIGFuZCBjYWxscyB1bnNldE1vZGVsIG9uIGFsbCBsaXN0ZW5pbmcgdmlld3MuXHJcbiAgICAqL1xyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKGRhdGEpIHtcclxuICAgICAgICBmb3IgKHZhciBhIGluIGRhdGEpXHJcbiAgICAgICAgICAgIHRoaXNbYV0gPSBkYXRhW2FdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChkYXRhKSB7XHJcbiAgICAgICAgdmFyIG91dF9kYXRhID0ge307XHJcblxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBhIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwcm9wID0gdGhpc1thXTtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0X2RhdGFbYV0gPSBwcm9wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0X2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmVtb3ZlcyBpdGVtcyBpbiBjb250YWluZXJzIGJhc2VkIG9uIG1hdGNoaW5nIGluZGV4LlxyXG4gICAgKi9cclxuXHJcbiAgICByZW1vdmUoZGF0YSkge1xyXG4gICAgICAgIHJldHVybiB7fTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgbGV0IG91dCA9IHt9O1xyXG5cclxuXHJcbiAgICAgICAgZm9yIChsZXQgcHJvcCBpbiB0aGlzKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJvcCA9PSBcImZpcnN0X3ZpZXdcIiB8fFxyXG4gICAgICAgICAgICAgICAgcHJvcCA9PSBcImNoYW5nZWRfdmFsdWVzXCIgfHxcclxuICAgICAgICAgICAgICAgIHByb3AgPT0gXCJfX19fU0NIRURVTEVEX19fX1wiKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBvdXRbcHJvcF0gPSB0aGlzW3Byb3BdXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSnNvblN0cmluZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhICsgXCJcIjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIE1vZGVsLFxyXG4gICAgQW55TW9kZWwsXHJcbiAgICBNb2RlbENvbnRhaW5lcixcclxuICAgIEFycmF5TW9kZWxDb250YWluZXIsXHJcbiAgICBNdWx0aUluZGV4ZWRDb250YWluZXIsXHJcbiAgICBCVHJlZU1vZGVsQ29udGFpbmVyXHJcbn0iLCJpbXBvcnQge01vZGVsfSBmcm9tIFwiLi9tb2RlbC9tb2RlbFwiXHJcblxyXG5jbGFzcyBDb250cm9sbGVye1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKCl7XHJcblx0XHR0aGlzLm1vZGVsID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdGRlc3RydWN0b3IoKXtcclxuXHRcdHRoaXMubW9kZWwgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0c2V0TW9kZWwobW9kZWwpe1xyXG5cdFx0aWYobW9kZWwgaW5zdGFuY2VvZiBNb2RlbCl7XHJcblx0XHRcdHRoaXMubW9kZWwgPSBtb2RlbDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNldChkYXRhKXtcclxuXHRcdGlmKHRoaXMubW9kZWwpXHJcblx0XHRcdHRoaXMubW9kZWwuYWRkKGRhdGEpO1xyXG5cdFx0XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnR7Q29udHJvbGxlcn0iLCJpbXBvcnQge1xyXG4gICAgQ29udHJvbGxlclxyXG59IGZyb20gXCIuL2NvbnRyb2xsZXJcIlxyXG4vKipcclxuICogVGhpcyBDbGFzcyBpcyByZXNwb25zaWJsZSBmb3IgaGFuZGxpbmcgcmVxdWVzdHMgdG8gdGhlIHNlcnZlci4gSXQgY2FuIGFjdCBhcyBhIGNvbnRyb2xsZXIgdG8gc3BlY2lmaWNhbGx5IHB1bGwgZGF0YSBkb3duIGZyb20gdGhlIHNlcnZlciBhbmQgcHVzaCBpbnRvIGRhdGEgbWVtYmVycy5cclxuICpcclxuICoge25hbWV9IEdldHRlclxyXG4gKi9cclxuY2xhc3MgR2V0dGVyIGV4dGVuZHMgQ29udHJvbGxlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1cmwsIHByb2Nlc3NfZGF0YSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5GRVRDSF9JTl9QUk9HUkVTUyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucnVybCA9IHByb2Nlc3NfZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQocmVxdWVzdF9vYmplY3QsIHN0b3JlX29iamVjdCwgc2VjdXJlID0gdHJ1ZSkge1xyXG4gICAgICAgIC8vaWYodGhpcy5GRVRDSF9JTl9QUk9HUkVTUylcclxuICAgICAgICAvLyAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB0aGlzLkZFVENIX0lOX1BST0dSRVNTID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdmFyIHVybCA9ICgoc2VjdXJlKSA/IFwiaHR0cHM6Ly9cIiA6IFwiaHR0cDovL1wiKSArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgdGhpcy51cmwgKyAoIChyZXF1ZXN0X29iamVjdCkgPyAoXCI/XCIgKyB0aGlzLl9fcHJvY2Vzc191cmxfXyhyZXF1ZXN0X29iamVjdCkpIDogXCJcIik7XHJcblxyXG4gICAgICAgIHJldHVybiAoKHN0b3JlKSA9PiBmZXRjaCh1cmwsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCAvLyBTZW5kcyBjb29raWVzIGJhY2sgdG8gc2VydmVyIHdpdGggcmVxdWVzdFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnXHJcbiAgICAgICAgfSkudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgIHRoaXMuRkVUQ0hfSU5fUFJPR1JFU1MgPSBmYWxzZTtcclxuICAgICAgICAgICAgKHJlc3BvbnNlLmpzb24oKS50aGVuKChqKT0+e1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fX3Byb2Nlc3NfcmVzcG9uc2VfXyhqLCBzdG9yZSk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9KS5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgIHRoaXMuRkVUQ0hfSU5fUFJPR1JFU1MgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fX3JlamVjdGVkX3JlcG9uc2VfXyhzdG9yZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgVW5hYmxlIHRvIHByb2Nlc3MgcmVzcG9uc2UgZm9yIHJlcXVlc3QgbWFkZSB0bzogJHt0aGlzLnVybH0uIFJlc3BvbnNlOiAke2Vycm9yfS4gRXJyb3IgUmVjZWl2ZWQ6ICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgfSkpIChzdG9yZV9vYmplY3QpXHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VKc29uKGluX2pzb24pe1xyXG4gICAgICAgIHJldHVybiBpbl9qc29uO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcHJvY2Vzc191cmxfXyhkYXRhKSB7XHJcbiAgICAgICAgdmFyIHN0ciA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgIHN0ciArPSBgJHthfT0ke2RhdGFbYV19XFwmYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdHIuc2xpY2UoMCwgLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcmVqZWN0ZWRfcmVwb25zZV9fKHN0b3JlKXtcclxuICAgICAgICBpZihzdG9yZSlcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlVucHJvY2Vzc2VkIHN0b3JlZCBkYXRhIGluIGdldHRlci5cIik7XHJcbiAgICB9ICAgXHJcblxyXG4gICAgX19wcm9jZXNzX3Jlc3BvbnNlX18oanNvbiwgc3RvcmUpIHtcclxuXHJcbiAgICAgICAgaWYodGhpcy5ydXJsICYmIGpzb24pe1xyXG4gICAgICAgICAgICB2YXIgd2F0Y2hfcG9pbnRzID0gdGhpcy5ydXJsLnNwbGl0KFwiPFwiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB3YXRjaF9wb2ludHMubGVuZ3RoICYmIGpzb247IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBqc29uID0ganNvbltwYXJzZUludCh3YXRjaF9wb2ludHNbaV0pP3BhcnNlSW50KHdhdGNoX3BvaW50c1tpXSk6d2F0Y2hfcG9pbnRzW2ldXTtcclxuICAgICAgICAgICAgfSBcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwianNvblwiLCBqc29uKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHJlc3BvbnNlID0ge31cclxuICAgICAgICB2YXIgcmVxdWVzdCA9IHJlc3BvbnNlLnRhcmdldDtcclxuXHJcbiAgICAgICAgLy9yZXN1bHQocmVxdWVzdCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1vZGVsKXtcclxuICAgICAgICAgICAgLy9zaG91bGQgYmUgYWJsZSB0byBwaXBlIHJlc3BvbnNlcyBhcyBvYmplY3RzIGNyZWF0ZWQgZnJvbSB3ZWxsIGZvcm11bGF0ZWQgZGF0YSBkaXJlY3RseSBpbnRvIHRoZSBtb2RlbC5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHRoaXMucGFyc2VKc29uKGpzb24sIHN0b3JlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmFibGUgdG8gcHJvY2VzcyByZXNwb25zZSBmb3IgcmVxdWVzdCBtYWRlIHRvOiAke3RoaXMudXJsfS4gVGhlcmUgaXMgbm8gbW9kZWwgYXR0YWNoZWQgdG8gdGhpcyByZXF1ZXN0IGNvbnRyb2xsZXIhYClcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBHZXR0ZXJcclxufVxyXG4iLCJpbXBvcnQge1xyXG4gICAgVmlld1xyXG59IGZyb20gXCIuL3ZpZXdcIlxyXG4vKipcclxuICogVGhpcyBDbGFzcyBpcyByZXNwb25zaWJsZSBmb3IgaGFuZGxpbmcgcmVxdWVzdHMgdG8gdGhlIHNlcnZlci4gSXQgY2FuIGFjdCBhcyBhIGNvbnRyb2xsZXIgdG8gc3BlY2lmaWNhbGx5IHB1bGwgZGF0YSBkb3duIGZyb20gdGhlIHNlcnZlciBhbmQgcHVzaCBpbnRvIGRhdGEgbWVtYmVycy5cclxuICpcclxuICoge25hbWV9IFJlcXVlc3RlclxyXG4gKi9cclxuY2xhc3MgU2V0dGVyIGV4dGVuZHMgVmlldyB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1cmwpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldChyZXF1ZXN0X29iamVjdCkge1xyXG5cclxuICAgICAgICB2YXIgdXJsID0gXCJodHRwOi8vXCIgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIHRoaXMudXJsICsgKCAocmVxdWVzdF9vYmplY3QpID8gKFwiP1wiICsgdGhpcy5fX3Byb2Nlc3NfdXJsX18ocmVxdWVzdF9vYmplY3QpKSA6IFwiXCIpO1xyXG5cclxuICAgICAgICBmZXRjaCh1cmwsIFxyXG4gICAgICAgIHsgXHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIC8vIFNlbmRzIGNvb2tpZXMgYmFjayB0byBzZXJ2ZXIgd2l0aCByZXF1ZXN0XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnXHJcbiAgICAgICAgfSkudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgIChyZXNwb25zZS5qc29uKCkudGhlbigoaik9PntcclxuICAgICAgICAgICAgICAgIHRoaXMuX19wcm9jZXNzX3Jlc3BvbnNlX18oaik7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9KS5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgVW5hYmxlIHRvIHByb2Nlc3MgcmVzcG9uc2UgZm9yIHJlcXVlc3QgbWFkZSB0bzogJHt0aGlzLnVybH0uIFJlc3BvbnNlOiAke2Vycm9yfS4gRXJyb3IgUmVjZWl2ZWQ6ICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZUpzb24oaW5fanNvbil7XHJcbiAgICAgICAgcmV0dXJuIGluX2pzb247XHJcbiAgICB9XHJcblxyXG4gICAgX19wcm9jZXNzX3VybF9fKGRhdGEpIHtcclxuICAgICAgICB2YXIgc3RyID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciBhIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgc3RyICs9IGAke2F9PSR7ZGF0YVthXX1cXCZgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN0ci5zbGljZSgwLCAtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgX19wcm9jZXNzX3Jlc3BvbnNlX18oanNvbikge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciByZXNwb25zZSA9IHt9XHJcbiAgICAgICAgdmFyIHJlcXVlc3QgPSByZXNwb25zZS50YXJnZXQ7XHJcblxyXG4gICAgICAgIC8vcmVzdWx0KHJlcXVlc3QpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tb2RlbCl7XHJcblxyXG4gICAgICAgICAgICAvL3Nob3VsZCBiZSBhYmxlIHRvIHBpcGUgcmVzcG9uc2VzIGFzIG9iamVjdHMgY3JlYXRlZCBmcm9tIHdlbGwgZm9ybXVsYXRlZCBkYXRhIGRpcmVjdGx5IGludG8gdGhlIG1vZGVsLlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQodGhpcy5wYXJzZUpzb24oanNvbikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5tb2RlbClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFVuYWJsZSB0byBwcm9jZXNzIHJlc3BvbnNlIGZvciByZXF1ZXN0IG1hZGUgdG86ICR7dGhpcy51cmx9LiBUaGVyZSBpcyBubyBtb2RlbCBhdHRhY2hlZCB0byB0aGlzIHJlcXVlc3QgY29udHJvbGxlciFgKVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgU2V0dGVyXHJcbn0iLCIvKlxyXG5cdEhhbmRsZXMgdGhlIHBhcnNpbmcgYW5kIGxvYWRpbmcgb2YgY29tcG9uZW50cyBmb3IgYSBwYXJ0aWN1bGFyIHBhZ2UuXHJcbiovXHJcbmNsYXNzIFBhZ2VWaWV3IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihVUkwsIGFwcF9wYWdlKSB7XHJcbiAgICAgICAgdGhpcy51cmwgPSBVUkw7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZmluYWxpemluZ192aWV3ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnR5cGUgPSBcIm5vcm1hbFwiO1xyXG4gICAgICAgIGlmICghYXBwX3BhZ2UpIGRlYnVnZ2VyXHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gYXBwX3BhZ2U7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50X2JhY2tlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlbWVudHNbaV07XHJcbiAgICAgICAgICAgIGVsZW1lbnQuZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50cyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB1bmxvYWQodHJhbnNpdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBlbGVtZW50LmdldFRyYW5zZm9ybVRvKHRyYW5zaXRpb25zKTtcclxuICAgICAgICAgICAgZWxlbWVudC51bmxvYWRDb21wb25lbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25PdXQodHJhbnNpdGlvbnMpIHtcclxuXHJcbiAgICAgICAgbGV0IHRpbWUgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGltZSA9IE1hdGgubWF4KHRpbWUsIHRoaXMuZWxlbWVudHNbaV0udHJhbnNpdGlvbk91dCh0cmFuc2l0aW9ucykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmluYWxpemUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5MT0FERUQpIHJldHVybjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgZWxlbWVudC5maW5hbGl6ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50KVxyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWQoYXBwX2VsZW1lbnQsIHd1cmwpIHtcclxuXHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSB0cnVlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlbWVudHNbaV07XHJcbiAgICAgICAgICAgIGVsZW1lbnQubG9hZENvbXBvbmVudHMod3VybCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhcHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xyXG5cclxuICAgICAgICB2YXIgdCA9IHRoaXMuZWxlbWVudC5zdHlsZS5vcGFjaXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25Jbih0cmFuc2l0aW9ucykge1xyXG4gICAgICAgIGxldCBmaW5hbF90aW1lID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBcIm1vZGFsXCIpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnRfYmFja2VyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRfYmFja2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF9iYWNrZXIuY2xhc3NMaXN0LmFkZChcIm1vZGFsX2JhY2tlclwiKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudF9iYWNrZXIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICAgICAgICAgIH0sIDUwKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICBlbGVtZW50LnNldFRyYW5zZm9ybVRvKHRyYW5zaXRpb25zKTtcclxuICAgICAgICAgICAgZWxlbWVudC50cmFuc2l0aW9uSW4oKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgZWxlbWVudC5nZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29tcGFyZUNvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgLy9UaGlzIHdpbGwgdHJhbnNpdGlvbiBvYmplY3RzXHJcbiAgICB9XHJcblxyXG4gICAgc2V0VHlwZSh0eXBlKSB7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZSB8fCBcIm5vcm1hbFwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgUGFnZVZpZXdcclxufSIsIi8qKlxyXG4gKlx0Q29udmVydHMgbGlua3MgaW50byBKYXZhY3JpcHQgZW5hYmxlZCBidXR0b25zIHRoYXQgd2lsbCBiZSBoYW5kbGVkIHdpdGhpbiB0aGUgY3VycmVudCBBY3RpdmUgcGFnZS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFBhcmVudCBFbGVtZW50IHRoYXQgY29udGFpbnMgdGhlIDxhPiBlbGVtZW50cyB0byBiZSBldmF1bGF0ZWQgYnkgZnVuY3Rpb24uXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IF9fZnVuY3Rpb25fXyAtIEEgZnVuY3Rpb24gdGhlIGxpbmsgd2lsbCBjYWxsIHdoZW4gaXQgaXMgY2xpY2tlZCBieSB1c2VyLiBJZiBpdCByZXR1cm5zIGZhbHNlLCB0aGUgbGluayB3aWxsIGFjdCBsaWtlIGEgbm9ybWFsIDxhPiBlbGVtZW50IGFuZCBjYXVzZSB0aGUgYnJvd3NlciB0byBuYXZpZ2F0ZSB0byB0aGUgXCJocmVmXCIgdmFsdWUuXHJcbiAqXHJcbiAqIElmIHRoZSA8YT4gZWxlbWVudCBoYXMgYSBkYXRhLWlnbm9yZV9saW5rIGF0dHJpYnV0ZSBzZXQgdG8gYSB0cnV0aHkgdmFsdWUsIHRoZW4gdGhpcyBmdW5jdGlvbiB3aWxsIG5vdCBjaGFuZ2UgdGhlIHdheSB0aGF0IGxpbmsgb3BlcmF0ZXMuXHJcbiAqIExpa2V3aXNlLCBpZiB0aGUgPGE+IGVsZW1lbnQgaGFzIGEgaHJlZiB0aGF0IHBvaW50cyBhbm90aGVyIGRvbWFpbiwgdGhlbiB0aGUgbGluayB3aWxsIHJlbWFpbiB1bmFmZmVjdGVkLlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0TGlua3MoZWxlbWVudCwgX19mdW5jdGlvbl9fKSB7XHJcbiAgICBsZXQgbGlua3MgPSBlbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKTtcclxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gbGlua3MubGVuZ3RoLCB0ZW1wLCBocmVmOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHRlbXAgPSBsaW5rc1tpXTtcclxuXHJcbiAgICAgICAgaWYgKHRlbXAuZGF0YXNldC5pZ25vcmVfbGluaykgY29udGludWU7XHJcblxyXG4gICAgICAgIGlmICh0ZW1wLm9yaWdpbiAhPT0gbG9jYXRpb24ub3JpZ2luKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgaWYgKCF0ZW1wLm9uY2xpY2spIHRlbXAub25jbGljayA9ICgoaHJlZiwgYSwgX19mdW5jdGlvbl9fKSA9PiAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGlmIChfX2Z1bmN0aW9uX18oaHJlZiwgYSkpIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9KSh0ZW1wLmhyZWYsIHRlbXAsIF9fZnVuY3Rpb25fXyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQge3NldExpbmtzfVxyXG4iLCJpbXBvcnQge0xleH0gZnJvbSBcIi4uL2NvbW1vblwiXHJcblxyXG5jbGFzcyBDb2xvciBleHRlbmRzIEZsb2F0NjRBcnJheXtcclxuXHJcblx0Y29uc3RydWN0b3IocixnLGIsYSA9IDApe1xyXG5cdFx0c3VwZXIoNClcclxuXHJcblx0XHR0aGlzLnIgPSAwO1xyXG5cdFx0dGhpcy5nID0gMDtcclxuXHRcdHRoaXMuYiA9IDA7XHJcblx0XHR0aGlzLmEgPSAxO1xyXG5cclxuXHRcdGlmKHR5cGVvZihyKSA9PSBcInN0cmluZ1wiKXtcclxuXHRcdFx0dGhpcy5mcm9tU3RyaW5nKHIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHRoaXMuciA9IHIgLy9NYXRoLm1heChNYXRoLm1pbihNYXRoLnJvdW5kKHIpLDI1NSksLTI1NSk7XHJcblx0XHRcdHRoaXMuZyA9IGcgLy9NYXRoLm1heChNYXRoLm1pbihNYXRoLnJvdW5kKGcpLDI1NSksLTI1NSk7XHJcblx0XHRcdHRoaXMuYiA9IGIgLy9NYXRoLm1heChNYXRoLm1pbihNYXRoLnJvdW5kKGIpLDI1NSksLTI1NSk7XHJcblx0XHRcdHRoaXMuYSA9IGEgLy9NYXRoLm1heChNYXRoLm1pbihhLDEpLC0xKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdldCByKCl7XHJcblx0XHRyZXR1cm4gdGhpc1swXTtcclxuXHR9XHJcblxyXG5cdHNldCByKHIpe1xyXG5cdFx0dGhpc1swXSA9IHI7XHJcblx0fVxyXG5cclxuXHRnZXQgZygpe1xyXG5cdFx0cmV0dXJuIHRoaXNbMV07XHJcblx0fVxyXG5cclxuXHRzZXQgZyhnKXtcclxuXHRcdHRoaXNbMV0gPSBnO1xyXG5cdH1cclxuXHJcblx0Z2V0IGIoKXtcclxuXHRcdHJldHVybiB0aGlzWzJdO1xyXG5cdH1cclxuXHJcblx0c2V0IGIoYil7XHJcblx0XHR0aGlzWzJdID0gYjtcclxuXHR9XHJcblxyXG5cdGdldCBhKCl7XHJcblx0XHRyZXR1cm4gdGhpc1szXTtcclxuXHR9XHJcblxyXG5cdHNldCBhKGEpe1xyXG5cdFx0dGhpc1szXSA9IGE7XHJcblx0fVxyXG5cclxuXHRzZXQoY29sb3Ipe1xyXG5cdFx0dGhpcy5yID0gY29sb3IucjtcclxuXHRcdHRoaXMuZyA9IGNvbG9yLmc7XHJcblx0XHR0aGlzLmIgPSBjb2xvci5iO1xyXG5cdFx0dGhpcy5hID0gKGNvbG9yLmEgIT0gdW5kZWZpbmVkKSA/IGNvbG9yLmEgOiB0aGlzLmE7XHJcblx0fVxyXG5cclxuXHRhZGQoY29sb3Ipe1xyXG5cdFx0cmV0dXJuIG5ldyBDb2xvcihcclxuXHRcdFx0Y29sb3IuciArIHRoaXMucixcclxuXHRcdFx0Y29sb3IuZyArIHRoaXMuZyxcclxuXHRcdFx0Y29sb3IuYiArIHRoaXMuYixcclxuXHRcdFx0Y29sb3IuYSArIHRoaXMuYVxyXG5cdFx0KVxyXG5cdH1cclxuXHJcblx0bXVsdChjb2xvcil7XHJcblx0XHRpZih0eXBlb2YoY29sb3IpID09IFwibnVtYmVyXCIpe1xyXG5cdFx0XHRyZXR1cm4gbmV3IENvbG9yKFxyXG5cdFx0XHRcdHRoaXMuciAqIGNvbG9yLFxyXG5cdFx0XHRcdHRoaXMuZyAqIGNvbG9yLFxyXG5cdFx0XHRcdHRoaXMuYiAqIGNvbG9yLFxyXG5cdFx0XHRcdHRoaXMuYSAqIGNvbG9yXHJcblx0XHRcdClcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gbmV3IENvbG9yKFxyXG5cdFx0XHRcdHRoaXMuciAqIGNvbG9yLnIsXHJcblx0XHRcdFx0dGhpcy5nICogY29sb3IuZyxcclxuXHRcdFx0XHR0aGlzLmIgKiBjb2xvci5iLFxyXG5cdFx0XHRcdHRoaXMuYSAqIGNvbG9yLmFcclxuXHRcdFx0KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3ViKGNvbG9yKXtcclxuXHRcdHJldHVybiBuZXcgQ29sb3IoXHJcblx0XHRcdCB0aGlzLnIgLSBjb2xvci5yLFxyXG5cdFx0XHQgdGhpcy5nIC0gY29sb3IuZyxcclxuXHRcdFx0IHRoaXMuYiAtIGNvbG9yLmIsXHJcblx0XHRcdCB0aGlzLmEgLSBjb2xvci5hXHJcblx0XHQpXHJcblx0fVxyXG5cclxuXHR0b1N0cmluZygpe1xyXG5cdFx0cmV0dXJuIGByZ2JhKCR7dGhpcy5yfDB9LCAke3RoaXMuZ3wwfSwgJHt0aGlzLmJ8MH0sICR7dGhpcy5hfSlgO1xyXG5cdH1cclxuXHJcblx0ZnJvbVN0cmluZyhzdHJpbmcpe1xyXG5cdFx0XHJcblx0XHRsZXQgbGV4ZXIgPSBMZXgoc3RyaW5nKVxyXG5cclxuXHRcdGxldCByLGcsYixhO1xyXG5cdFx0c3dpdGNoKGxleGVyLnRva2VuLnRleHQpe1xyXG5cclxuXHJcblx0XHRcdGNhc2UgXCJyZ2JcIjpcclxuXHRcdFx0XHRsZXhlci5uZXh0KCkgLy8gKFxyXG5cdFx0XHRcdHIgPSBwYXJzZUludChsZXhlci5uZXh0KCkudGV4dClcclxuXHRcdFx0XHRsZXhlci5uZXh0KCkgLy8gLFxyXG5cdFx0XHRcdGcgPSBwYXJzZUludChsZXhlci5uZXh0KCkudGV4dClcclxuXHRcdFx0XHRsZXhlci5uZXh0KCkgLy8gLFxyXG5cdFx0XHRcdGIgPSBwYXJzZUludChsZXhlci5uZXh0KCkudGV4dClcclxuXHRcdFx0XHR0aGlzLnNldCh7cixnLGJ9KTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlIFwicmdiYVwiOlxyXG5cdFx0XHRcdGxleGVyLm5leHQoKSAvLyAoXHJcblx0XHRcdFx0ciA9IHBhcnNlSW50KGxleGVyLm5leHQoKS50ZXh0KVxyXG5cdFx0XHRcdGxleGVyLm5leHQoKSAvLyAsXHJcblx0XHRcdFx0ZyA9IHBhcnNlSW50KGxleGVyLm5leHQoKS50ZXh0KVxyXG5cdFx0XHRcdGxleGVyLm5leHQoKSAvLyAsXHJcblx0XHRcdFx0YiA9IHBhcnNlSW50KGxleGVyLm5leHQoKS50ZXh0KVxyXG5cdFx0XHRcdGxleGVyLm5leHQoKSAvLyAsXHJcblx0XHRcdFx0YSA9IHBhcnNlRmxvYXQobGV4ZXIubmV4dCgpLnRleHQpXHJcblx0XHRcdFx0dGhpcy5zZXQoe3IsZyxiLGF9KTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlIFwiI1wiOlxyXG5cdFx0XHRcdHZhciB2YWx1ZSA9IGxleGVyLm5leHQoKS50ZXh0O1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGRlZmF1bHQ6XHJcblxyXG5cdFx0XHRcdGlmKENvbG9yLmNvbG9yc1tzdHJpbmddKVxyXG5cdFx0XHRcdFx0dGhpcy5zZXQoQ29sb3IuY29sb3JzW3N0cmluZ10gIHx8IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1LCAwLjAwMDEpKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5Db2xvci5jb2xvcnMgPSB7XHJcblx0XCJ0cmFuc3BhcmVudFwiIDogbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUsIDAuMDAwMSksXHJcblx0XCJjbGVhclwiIDogbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUsIDAuMDAwMSksXHJcblx0XCJyZWRcIiA6IG5ldyBDb2xvcigyNTUsIDAsIDApLFxyXG5cdFwiZ3JlZW5cIiA6IG5ldyBDb2xvcigwLCAyNTUsIDApLFxyXG5cdFwiYmx1ZVwiIDogbmV3IENvbG9yKDAsIDAsIDI1NSksXHJcblx0XCJCbGFja1wiOiBuZXcgQ29sb3IoMCwwLDApLFxyXG4gXHRcIldoaXRlXCI6IG5ldyBDb2xvcigyNTUsMjU1LDI1NSksXHJcbiBcdFwid2hpdGVcIjogbmV3IENvbG9yKDI1NSwyNTUsMjU1KSxcclxuIFx0XCJSZWRcIjogbmV3IENvbG9yKDI1NSwwLDApLFxyXG4gXHRcIkxpbWVcIjogbmV3IENvbG9yKDAsMjU1LDApLFxyXG4gXHRcIkJsdWVcIjogbmV3IENvbG9yKDAsMCwyNTUpLFxyXG4gXHRcIlllbGxvd1wiOiBuZXcgQ29sb3IoMjU1LDI1NSwwKSxcclxuIFx0XCJDeWFuXCI6IG5ldyBDb2xvcigwLDI1NSwyNTUpLFxyXG4gXHRcIkFxdWFcIjogbmV3IENvbG9yKDAsMjU1LDI1NSksXHJcbiBcdFwiTWFnZW50YVwiOiBuZXcgQ29sb3IoMjU1LDAsMjU1KSAsXHJcbiBcdFwiRnVjaHNpYVwiOiBuZXcgQ29sb3IoMjU1LDAsMjU1KSxcclxuIFx0XCJTaWx2ZXJcIjogbmV3IENvbG9yKDE5MiwxOTIsMTkyKSxcclxuIFx0XCJHcmF5XCI6IG5ldyBDb2xvcigxMjgsMTI4LDEyOCksXHJcbiBcdFwiTWFyb29uXCI6IG5ldyBDb2xvcigxMjgsMCwwKSxcclxuIFx0XCJPbGl2ZVwiOiBuZXcgQ29sb3IoMTI4LDEyOCwwKSxcclxuIFx0XCJHcmVlblwiOiBuZXcgQ29sb3IoMCwxMjgsMCksXHJcbiBcdFwiUHVycGxlXCI6IG5ldyBDb2xvcigxMjgsMCwxMjgpLFxyXG4gXHRcIlRlYWxcIjogbmV3IENvbG9yKDAsMTI4LDEyOCksXHJcbiBcdFwiTmF2eVwiOiBuZXcgQ29sb3IoMCwwLDEyOCksXHJcbiBcdFwibWFyb29uXCI6IG5ldyBDb2xvcigxMjgsMCwwKSxcclxuIFx0XCJkYXJrIHJlZFwiOiBuZXcgQ29sb3IoMTM5LDAsMCksXHJcbiBcdFwiYnJvd25cIjogbmV3IENvbG9yKDE2NSw0Miw0MiksXHJcbiBcdFwiZmlyZWJyaWNrXCI6IG5ldyBDb2xvcigxNzgsMzQsMzQpLFxyXG4gXHRcImNyaW1zb25cIjogbmV3IENvbG9yKDIyMCwyMCw2MCksXHJcbiBcdFwicmVkXCI6IG5ldyBDb2xvcigyNTUsMCwwKSxcclxuIFx0XCJ0b21hdG9cIjogbmV3IENvbG9yKDI1NSw5OSw3MSksXHJcbiBcdFwiY29yYWxcIjogbmV3IENvbG9yKDI1NSwxMjcsODApLFxyXG4gXHRcImluZGlhbiByZWRcIjogbmV3IENvbG9yKDIwNSw5Miw5MiksXHJcbiBcdFwibGlnaHQgY29yYWxcIjogbmV3IENvbG9yKDI0MCwxMjgsMTI4KSxcclxuIFx0XCJkYXJrIHNhbG1vblwiOiBuZXcgQ29sb3IoMjMzLDE1MCwxMjIpLFxyXG4gXHRcInNhbG1vblwiOiBuZXcgQ29sb3IoMjUwLDEyOCwxMTQpLFxyXG4gXHRcImxpZ2h0IHNhbG1vblwiOiBuZXcgQ29sb3IoMjU1LDE2MCwxMjIpLFxyXG4gXHRcIm9yYW5nZSByZWRcIjogbmV3IENvbG9yKDI1NSw2OSwwKSxcclxuIFx0XCJkYXJrIG9yYW5nZVwiOiBuZXcgQ29sb3IoMjU1LDE0MCwwKSxcclxuIFx0XCJvcmFuZ2VcIjogbmV3IENvbG9yKDI1NSwxNjUsMCksXHJcbiBcdFwiZ29sZFwiOiBuZXcgQ29sb3IoMjU1LDIxNSwwKSxcclxuIFx0XCJkYXJrIGdvbGRlbiByb2RcIjogbmV3IENvbG9yKDE4NCwxMzQsMTEpLFxyXG4gXHRcImdvbGRlbiByb2RcIjogbmV3IENvbG9yKDIxOCwxNjUsMzIpLFxyXG4gXHRcInBhbGUgZ29sZGVuIHJvZFwiOiBuZXcgQ29sb3IoMjM4LDIzMiwxNzApLFxyXG4gXHRcImRhcmsga2hha2lcIjogbmV3IENvbG9yKDE4OSwxODMsMTA3KSxcclxuIFx0XCJraGFraVwiOiBuZXcgQ29sb3IoMjQwLDIzMCwxNDApLFxyXG4gXHRcIm9saXZlXCI6IG5ldyBDb2xvcigxMjgsMTI4LDApLFxyXG4gXHRcInllbGxvd1wiOiBuZXcgQ29sb3IoMjU1LDI1NSwwKSxcclxuIFx0XCJ5ZWxsb3cgZ3JlZW5cIjogbmV3IENvbG9yKDE1NCwyMDUsNTApLFxyXG4gXHRcImRhcmsgb2xpdmUgZ3JlZW5cIjogbmV3IENvbG9yKDg1LDEwNyw0NyksXHJcbiBcdFwib2xpdmUgZHJhYlwiOiBuZXcgQ29sb3IoMTA3LDE0MiwzNSksXHJcbiBcdFwibGF3biBncmVlblwiOiBuZXcgQ29sb3IoMTI0LDI1MiwwKSxcclxuIFx0XCJjaGFydCByZXVzZVwiOiBuZXcgQ29sb3IoMTI3LDI1NSwwKSxcclxuIFx0XCJncmVlbiB5ZWxsb3dcIjogbmV3IENvbG9yKDE3MywyNTUsNDcpLFxyXG4gXHRcImRhcmsgZ3JlZW5cIjogbmV3IENvbG9yKDAsMTAwLDApLFxyXG4gXHRcImdyZWVuXCI6IG5ldyBDb2xvcigwLDEyOCwwKSxcclxuIFx0XCJmb3Jlc3QgZ3JlZW5cIjogbmV3IENvbG9yKDM0LDEzOSwzNCksXHJcbiBcdFwibGltZVwiOiBuZXcgQ29sb3IoMCwyNTUsMCksXHJcbiBcdFwibGltZSBncmVlblwiOiBuZXcgQ29sb3IoNTAsMjA1LDUwKSxcclxuIFx0XCJsaWdodCBncmVlblwiOiBuZXcgQ29sb3IoMTQ0LDIzOCwxNDQpLFxyXG4gXHRcInBhbGUgZ3JlZW5cIjogbmV3IENvbG9yKDE1MiwyNTEsMTUyKSxcclxuIFx0XCJkYXJrIHNlYSBncmVlblwiOiBuZXcgQ29sb3IoMTQzLDE4OCwxNDMpLFxyXG4gXHRcIm1lZGl1bSBzcHJpbmcgZ3JlZW5cIjogbmV3IENvbG9yKDAsMjUwLDE1NCksXHJcbiBcdFwic3ByaW5nIGdyZWVuXCI6IG5ldyBDb2xvcigwLDI1NSwxMjcpLFxyXG4gXHRcInNlYSBncmVlblwiOiBuZXcgQ29sb3IoNDYsMTM5LDg3KSxcclxuIFx0XCJtZWRpdW0gYXF1YSBtYXJpbmVcIjogbmV3IENvbG9yKDEwMiwyMDUsMTcwKSxcclxuIFx0XCJtZWRpdW0gc2VhIGdyZWVuXCI6IG5ldyBDb2xvcig2MCwxNzksMTEzKSxcclxuIFx0XCJsaWdodCBzZWEgZ3JlZW5cIjogbmV3IENvbG9yKDMyLDE3OCwxNzApLFxyXG4gXHRcImRhcmsgc2xhdGUgZ3JheVwiOiBuZXcgQ29sb3IoNDcsNzksNzkpLFxyXG4gXHRcInRlYWxcIjogbmV3IENvbG9yKDAsMTI4LDEyOCksXHJcbiBcdFwiZGFyayBjeWFuXCI6IG5ldyBDb2xvcigwLDEzOSwxMzkpLFxyXG4gXHRcImFxdWFcIjogbmV3IENvbG9yKDAsMjU1LDI1NSksXHJcbiBcdFwiY3lhblwiOiBuZXcgQ29sb3IoMCwyNTUsMjU1KSxcclxuIFx0XCJsaWdodCBjeWFuXCI6IG5ldyBDb2xvcigyMjQsMjU1LDI1NSksXHJcbiBcdFwiZGFyayB0dXJxdW9pc2VcIjogbmV3IENvbG9yKDAsMjA2LDIwOSksXHJcbiBcdFwidHVycXVvaXNlXCI6IG5ldyBDb2xvcig2NCwyMjQsMjA4KSxcclxuIFx0XCJtZWRpdW0gdHVycXVvaXNlXCI6IG5ldyBDb2xvcig3MiwyMDksMjA0KSxcclxuIFx0XCJwYWxlIHR1cnF1b2lzZVwiOiBuZXcgQ29sb3IoMTc1LDIzOCwyMzgpLFxyXG4gXHRcImFxdWEgbWFyaW5lXCI6IG5ldyBDb2xvcigxMjcsMjU1LDIxMiksXHJcbiBcdFwicG93ZGVyIGJsdWVcIjogbmV3IENvbG9yKDE3NiwyMjQsMjMwKSxcclxuIFx0XCJjYWRldCBibHVlXCI6IG5ldyBDb2xvcig5NSwxNTgsMTYwKSxcclxuIFx0XCJzdGVlbCBibHVlXCI6IG5ldyBDb2xvcig3MCwxMzAsMTgwKSxcclxuIFx0XCJjb3JuIGZsb3dlciBibHVlXCI6IG5ldyBDb2xvcigxMDAsMTQ5LDIzNyksXHJcbiBcdFwiZGVlcCBza3kgYmx1ZVwiOiBuZXcgQ29sb3IoMCwxOTEsMjU1KSxcclxuIFx0XCJkb2RnZXIgYmx1ZVwiOiBuZXcgQ29sb3IoMzAsMTQ0LDI1NSksXHJcbiBcdFwibGlnaHQgYmx1ZVwiOiBuZXcgQ29sb3IoMTczLDIxNiwyMzApLFxyXG4gXHRcInNreSBibHVlXCI6IG5ldyBDb2xvcigxMzUsMjA2LDIzNSksXHJcbiBcdFwibGlnaHQgc2t5IGJsdWVcIjogbmV3IENvbG9yKDEzNSwyMDYsMjUwKSxcclxuIFx0XCJtaWRuaWdodCBibHVlXCI6IG5ldyBDb2xvcigyNSwyNSwxMTIpLFxyXG4gXHRcIm5hdnlcIjogbmV3IENvbG9yKDAsMCwxMjgpLFxyXG4gXHRcImRhcmsgYmx1ZVwiOiBuZXcgQ29sb3IoMCwwLDEzOSksXHJcbiBcdFwibWVkaXVtIGJsdWVcIjogbmV3IENvbG9yKDAsMCwyMDUpLFxyXG4gXHRcImJsdWVcIjogbmV3IENvbG9yKDAsMCwyNTUpLFxyXG4gXHRcInJveWFsIGJsdWVcIjogbmV3IENvbG9yKDY1LDEwNSwyMjUpLFxyXG4gXHRcImJsdWUgdmlvbGV0XCI6IG5ldyBDb2xvcigxMzgsNDMsMjI2KSxcclxuIFx0XCJpbmRpZ29cIjogbmV3IENvbG9yKDc1LDAsMTMwKSxcclxuIFx0XCJkYXJrIHNsYXRlIGJsdWVcIjogbmV3IENvbG9yKDcyLDYxLDEzOSksXHJcbiBcdFwic2xhdGUgYmx1ZVwiOiBuZXcgQ29sb3IoMTA2LDkwLDIwNSksXHJcbiBcdFwibWVkaXVtIHNsYXRlIGJsdWVcIjogbmV3IENvbG9yKDEyMywxMDQsMjM4KSxcclxuIFx0XCJtZWRpdW0gcHVycGxlXCI6IG5ldyBDb2xvcigxNDcsMTEyLDIxOSksXHJcbiBcdFwiZGFyayBtYWdlbnRhXCI6IG5ldyBDb2xvcigxMzksMCwxMzkpLFxyXG4gXHRcImRhcmsgdmlvbGV0XCI6IG5ldyBDb2xvcigxNDgsMCwyMTEpLFxyXG4gXHRcImRhcmsgb3JjaGlkXCI6IG5ldyBDb2xvcigxNTMsNTAsMjA0KSxcclxuIFx0XCJtZWRpdW0gb3JjaGlkXCI6IG5ldyBDb2xvcigxODYsODUsMjExKSxcclxuIFx0XCJwdXJwbGVcIjogbmV3IENvbG9yKDEyOCwwLDEyOCksXHJcbiBcdFwidGhpc3RsZVwiOiBuZXcgQ29sb3IoMjE2LDE5MSwyMTYpLFxyXG4gXHRcInBsdW1cIjogbmV3IENvbG9yKDIyMSwxNjAsMjIxKSxcclxuIFx0XCJ2aW9sZXRcIjogbmV3IENvbG9yKDIzOCwxMzAsMjM4KSxcclxuIFx0XCJtYWdlbnRhXCI6IG5ldyBDb2xvcigyNTUsMCwyNTUpLFxyXG4gXHRcImZ1Y2hzaWFcIjogbmV3IENvbG9yKDI1NSwwLDI1NSksXHJcbiBcdFwib3JjaGlkXCI6IG5ldyBDb2xvcigyMTgsMTEyLDIxNCksXHJcbiBcdFwibWVkaXVtIHZpb2xldCByZWRcIjogbmV3IENvbG9yKDE5OSwyMSwxMzMpLFxyXG4gXHRcInBhbGUgdmlvbGV0IHJlZFwiOiBuZXcgQ29sb3IoMjE5LDExMiwxNDcpLFxyXG4gXHRcImRlZXAgcGlua1wiOiBuZXcgQ29sb3IoMjU1LDIwLDE0NyksXHJcbiBcdFwiaG90IHBpbmtcIjogbmV3IENvbG9yKDI1NSwxMDUsMTgwKSxcclxuIFx0XCJsaWdodCBwaW5rXCI6IG5ldyBDb2xvcigyNTUsMTgyLDE5MyksXHJcbiBcdFwicGlua1wiOiBuZXcgQ29sb3IoMjU1LDE5MiwyMDMpLFxyXG4gXHRcImFudGlxdWUgd2hpdGVcIjogbmV3IENvbG9yKDI1MCwyMzUsMjE1KSxcclxuIFx0XCJiZWlnZVwiOiBuZXcgQ29sb3IoMjQ1LDI0NSwyMjApLFxyXG4gXHRcImJpc3F1ZVwiOiBuZXcgQ29sb3IoMjU1LDIyOCwxOTYpLFxyXG4gXHRcImJsYW5jaGVkIGFsbW9uZFwiOiBuZXcgQ29sb3IoMjU1LDIzNSwyMDUpLFxyXG4gXHRcIndoZWF0XCI6IG5ldyBDb2xvcigyNDUsMjIyLDE3OSksXHJcbiBcdFwiY29ybiBzaWxrXCI6IG5ldyBDb2xvcigyNTUsMjQ4LDIyMCksXHJcbiBcdFwibGVtb24gY2hpZmZvblwiOiBuZXcgQ29sb3IoMjU1LDI1MCwyMDUpLFxyXG4gXHRcImxpZ2h0IGdvbGRlbiByb2QgeWVsbG93XCI6IG5ldyBDb2xvcigyNTAsMjUwLDIxMCksXHJcbiBcdFwibGlnaHQgeWVsbG93XCI6IG5ldyBDb2xvcigyNTUsMjU1LDIyNCksXHJcbiBcdFwic2FkZGxlIGJyb3duXCI6IG5ldyBDb2xvcigxMzksNjksMTkpLFxyXG4gXHRcInNpZW5uYVwiOiBuZXcgQ29sb3IoMTYwLDgyLDQ1KSxcclxuIFx0XCJjaG9jb2xhdGVcIjogbmV3IENvbG9yKDIxMCwxMDUsMzApLFxyXG4gXHRcInBlcnVcIjogbmV3IENvbG9yKDIwNSwxMzMsNjMpLFxyXG4gXHRcInNhbmR5IGJyb3duXCI6IG5ldyBDb2xvcigyNDQsMTY0LDk2KSxcclxuIFx0XCJidXJseSB3b29kXCI6IG5ldyBDb2xvcigyMjIsMTg0LDEzNSksXHJcbiBcdFwidGFuXCI6IG5ldyBDb2xvcigyMTAsMTgwLDE0MCksXHJcbiBcdFwicm9zeSBicm93blwiOiBuZXcgQ29sb3IoMTg4LDE0MywxNDMpLFxyXG4gXHRcIm1vY2Nhc2luXCI6IG5ldyBDb2xvcigyNTUsMjI4LDE4MSksXHJcbiBcdFwibmF2YWpvIHdoaXRlXCI6IG5ldyBDb2xvcigyNTUsMjIyLDE3MyksXHJcbiBcdFwicGVhY2ggcHVmZlwiOiBuZXcgQ29sb3IoMjU1LDIxOCwxODUpLFxyXG4gXHRcIm1pc3R5IHJvc2VcIjogbmV3IENvbG9yKDI1NSwyMjgsMjI1KSxcclxuIFx0XCJsYXZlbmRlciBibHVzaFwiOiBuZXcgQ29sb3IoMjU1LDI0MCwyNDUpLFxyXG4gXHRcImxpbmVuXCI6IG5ldyBDb2xvcigyNTAsMjQwLDIzMCksXHJcbiBcdFwib2xkIGxhY2VcIjogbmV3IENvbG9yKDI1MywyNDUsMjMwKSxcclxuIFx0XCJwYXBheWEgd2hpcFwiOiBuZXcgQ29sb3IoMjU1LDIzOSwyMTMpLFxyXG4gXHRcInNlYSBzaGVsbFwiOiBuZXcgQ29sb3IoMjU1LDI0NSwyMzgpLFxyXG4gXHRcIm1pbnQgY3JlYW1cIjogbmV3IENvbG9yKDI0NSwyNTUsMjUwKSxcclxuIFx0XCJzbGF0ZSBncmF5XCI6IG5ldyBDb2xvcigxMTIsMTI4LDE0NCksXHJcbiBcdFwibGlnaHQgc2xhdGUgZ3JheVwiOiBuZXcgQ29sb3IoMTE5LDEzNiwxNTMpLFxyXG4gXHRcImxpZ2h0IHN0ZWVsIGJsdWVcIjogbmV3IENvbG9yKDE3NiwxOTYsMjIyKSxcclxuIFx0XCJsYXZlbmRlclwiOiBuZXcgQ29sb3IoMjMwLDIzMCwyNTApLFxyXG4gXHRcImZsb3JhbCB3aGl0ZVwiOiBuZXcgQ29sb3IoMjU1LDI1MCwyNDApLFxyXG4gXHRcImFsaWNlIGJsdWVcIjogbmV3IENvbG9yKDI0MCwyNDgsMjU1KSxcclxuIFx0XCJnaG9zdCB3aGl0ZVwiOiBuZXcgQ29sb3IoMjQ4LDI0OCwyNTUpLFxyXG4gXHRcImhvbmV5ZGV3XCI6IG5ldyBDb2xvcigyNDAsMjU1LDI0MCksXHJcbiBcdFwiaXZvcnlcIjogbmV3IENvbG9yKDI1NSwyNTUsMjQwKSxcclxuIFx0XCJhenVyZVwiOiBuZXcgQ29sb3IoMjQwLDI1NSwyNTUpLFxyXG4gXHRcInNub3dcIjogbmV3IENvbG9yKDI1NSwyNTAsMjUwKSxcclxuIFx0XCJibGFja1wiOiBuZXcgQ29sb3IoMCwwLDApLFxyXG4gXHRcImRpbSBncmF5XCI6IG5ldyBDb2xvcigxMDUsMTA1LDEwNSksXHJcbiBcdFwiZGltIGdyZXlcIjogbmV3IENvbG9yKDEwNSwxMDUsMTA1KSxcclxuIFx0XCJncmF5XCI6IG5ldyBDb2xvcigxMjgsMTI4LDEyOCksXHJcbiBcdFwiZ3JleVwiOiBuZXcgQ29sb3IoMTI4LDEyOCwxMjgpLFxyXG4gXHRcImRhcmsgZ3JheVwiOiBuZXcgQ29sb3IoMTY5LDE2OSwxNjkpLFxyXG4gXHRcImRhcmsgZ3JleVwiOiBuZXcgQ29sb3IoMTY5LDE2OSwxNjkpLFxyXG4gXHRcInNpbHZlclwiOiBuZXcgQ29sb3IoMTkyLDE5MiwxOTIpLFxyXG4gXHRcImxpZ2h0IGdyYXlcIjogbmV3IENvbG9yKDIxMSwyMTEsMjExKSxcclxuIFx0XCJsaWdodCBncmV5XCI6IG5ldyBDb2xvcigyMTEsMjExLDIxMSksXHJcbiBcdFwiZ2FpbnNib3JvXCI6IG5ldyBDb2xvcigyMjAsMjIwLDIyMCksXHJcbiBcdFwid2hpdGUgc21va2VcIjogbmV3IENvbG9yKDI0NSwyNDUsMjQ1KSxcclxuIFx0XCJ3aGl0ZVwiOiBuZXcgQ29sb3IoMjU1LDI1NSwyNTUpXHJcbn1cclxuXHJcbmV4cG9ydCB7Q29sb3J9XHJcbiIsImltcG9ydCB7XHJcbiAgICBDb2xvclxyXG59IGZyb20gXCIuL2NvbG9yXCJcclxuaW1wb3J0IHtcclxuICAgIENCZXppZXJcclxufSBmcm9tIFwiLi4vY29tbW9uXCJcclxuaW1wb3J0IHtcclxuICAgIFNjaGVkdWxlclxyXG59IGZyb20gXCIuLi9zY2hlZHVsZXJcIlxyXG5cclxudmFyIGVhc2Vfb3V0ID0gbmV3IENCZXppZXIoMC41LCAwLjIsIDAsIDEpO1xyXG5cclxuaWYgKCFyZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSAoZSkgPT4ge1xyXG4gICAgICAgIHNldFRpbWVvdXQoZSwgMTAwMCk7XHJcbiAgICB9XHJcblxyXG5jbGFzcyBUVF9Gcm9tIHtcclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcclxuICAgICAgICAvL2V4dHJhY3RlZCBhbmltYXRhYmxlIGNvbXBvbmVudHNcclxuICAgICAgICB2YXIgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29sb3IgPSBuZXcgQ29sb3Iod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcImJhY2tncm91bmQtY29sb3JcIikpO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gcGFyc2VGbG9hdCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiaGVpZ2h0XCIpKTtcclxuICAgICAgICB0aGlzLndpZHRoID0gcGFyc2VGbG9hdCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwid2lkdGhcIikpO1xyXG5cclxuICAgICAgICAvLyppZighdGhpcy5oZWlnaHQgfHwgIXRoaXMud2lkdGgpe1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHJlY3Qud2lkdGg7XHJcbiAgICAgICAgLy99Ki9cclxuXHJcblxyXG4gICAgICAgIHRoaXMubGVmdCA9IHBhcnNlRmxvYXQocmVjdC5sZWZ0KTtcclxuICAgICAgICB0aGlzLnRvcCA9IHBhcnNlRmxvYXQocmVjdC50b3ApO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGVuZCgpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFRUX1RvIGV4dGVuZHMgVFRfRnJvbSB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBmcm9tKSB7XHJcbiAgICAgICAgc3VwZXIoZWxlbWVudCk7XHJcblxyXG4gICAgICAgIHRoaXMuZnJvbSA9IGZyb207XHJcblxyXG4gICAgICAgIHRoaXMucmVzID0gKChlbGVtZW50LnN0eWxlLnRvcCkgJiYgKGVsZW1lbnQuc3R5bGUubGVmdCkpO1xyXG5cclxuICAgICAgICB0aGlzLnJ0ID0gKGVsZW1lbnQuc3R5bGUudG9wKSA/IChlbGVtZW50LnN0eWxlLnRvcCkgOiBudWxsO1xyXG4gICAgICAgIHRoaXMucmwgPSBlbGVtZW50LnN0eWxlLmxlZnQgPyBlbGVtZW50LnN0eWxlLmxlZnQgOiBudWxsO1xyXG5cclxuXHJcbiAgICAgICAgLy9nZXQgdGhlIHJlbGF0aXZlIG9mZnNldCBvZiB0aGlzIG9iamVjdFxyXG4gICAgICAgIHZhciBvZmZzZXRfeCA9IDA7IC0gZWxlbWVudC5nZXRQYXJlbnRXaW5kb3dMZWZ0KCk7XHJcbiAgICAgICAgdmFyIG9mZnNldF95ID0gMDsgLSBlbGVtZW50LmdldFBhcmVudFdpbmRvd1RvcCgpO1xyXG5cclxuICAgICAgICB2YXIgb2Zmc2V0X3ggPSBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJsZWZ0XCIpKTtcclxuICAgICAgICB2YXIgb2Zmc2V0X3kgPSBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJ0b3BcIikpO1xyXG4gICAgICAgIC8vQW5kIGFkanVzdCBzdGFydCB0byByZXNwZWN0IHRoZSBlbGVtZW50cyBvd24gcGFyZW50YWwgb2Zmc2V0c1xyXG4gICAgICAgIHZhciBkaWZmeCA9IHRoaXMubGVmdCAtIHRoaXMuZnJvbS5sZWZ0O1xyXG4gICAgICAgIHRoaXMubGVmdCA9IG9mZnNldF94O1xyXG4gICAgICAgIHRoaXMuZnJvbS5sZWZ0ID0gdGhpcy5sZWZ0IC0gZGlmZng7XHJcblxyXG4gICAgICAgIHZhciBkaWZmeSA9IHRoaXMudG9wIC0gdGhpcy5mcm9tLnRvcDtcclxuICAgICAgICB0aGlzLnRvcCA9IG9mZnNldF95O1xyXG4gICAgICAgIHRoaXMuZnJvbS50b3AgPSB0aGlzLnRvcCAtIGRpZmZ5O1xyXG5cclxuICAgICAgICB0aGlzLnRpbWUgPSA2MCAqIC4zNTtcclxuICAgICAgICB0aGlzLnMgPSAwO1xyXG4gICAgICAgIHRoaXMuY29sb3JfbyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJiYWNrZ3JvdW5kLWNvbG9yXCIpO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0X28gPSBlbGVtZW50LnN0eWxlLndpZHRoO1xyXG4gICAgICAgIHRoaXMud2lkdGhfbyA9IGVsZW1lbnQuc3R5bGUuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMudG9wX28gPSB0aGlzLnRvcDtcclxuICAgICAgICB0aGlzLmxlZnRfbyA9IHRoaXMubGVmdDtcclxuICAgICAgICB0aGlzLnBvcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJwb3NpdGlvblwiKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbmQoKTsgLy9SZXN0b3JlIGV2ZXJ5dGhpbmcgYmFjayB0byBpdCdzIG9yaWdpbmFsIHR5cGU7XHJcbiAgICAgICAgdGhpcy5mcm9tID0gbnVsbDtcclxuICAgICAgICB0aGlzLnMgPSBJbmZpbml0eTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IHRoaXMuZnJvbS50b3AgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSB0aGlzLmZyb20ubGVmdCArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLmZyb20ud2lkdGggKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuZnJvbS5oZWlnaHQgKyBcInB4XCI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCgpIHtcclxuICAgICAgICB0aGlzLnMrK1xyXG5cclxuICAgICAgICAgICAgdmFyIHQgPSB0aGlzLnMgLyB0aGlzLnRpbWU7XHJcblxyXG4gICAgICAgIGlmICh0ID4gMSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICB2YXIgcmF0aW8gPSBlYXNlX291dC5nZXRZYXRYKHQpO1xyXG5cclxuICAgICAgICBpZiAocmF0aW8gPiAxKSByYXRpbyA9IDE7XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSBNYXRoLnJvdW5kKCh0aGlzLnRvcCAtIHRoaXMuZnJvbS50b3ApICogcmF0aW8gKyB0aGlzLmZyb20udG9wKSArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IE1hdGgucm91bmQoKHRoaXMubGVmdCAtIHRoaXMuZnJvbS5sZWZ0KSAqIHJhdGlvICsgdGhpcy5mcm9tLmxlZnQpICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9ICgodGhpcy53aWR0aCAtIHRoaXMuZnJvbS53aWR0aCkgKiByYXRpbyArIHRoaXMuZnJvbS53aWR0aCkgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICgodGhpcy5oZWlnaHQgLSB0aGlzLmZyb20uaGVpZ2h0KSAqIHJhdGlvICsgdGhpcy5mcm9tLmhlaWdodCkgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICh0aGlzLmNvbG9yLnN1Yih0aGlzLmZyb20uY29sb3IpLm11bHQocmF0aW8pLmFkZCh0aGlzLmZyb20uY29sb3IpKSArIFwiXCI7XHJcblxyXG4gICAgICAgIHJldHVybiAodCA8IDAuOTk5OTk5NSk7XHJcbiAgICB9XHJcblxyXG4gICAgZW5kKCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodF9vO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGhfbztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gdGhpcy5ydDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IHRoaXMucmw7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5jbGFzcyBUVFBhaXIge1xyXG4gICAgY29uc3RydWN0b3IoZV90bywgZV9mcm9tKSB7XHJcbiAgICAgICAgdGhpcy5iID0gKGVfZnJvbSBpbnN0YW5jZW9mIFRUX0Zyb20pID8gZV9mcm9tIDogbmV3IFRUX0Zyb20oZV9mcm9tKTtcclxuICAgICAgICB0aGlzLmEgPSBuZXcgVFRfVG8oZV90bywgdGhpcy5iKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYS5lbGVtZW50Ll9fVFRfXylcclxuICAgICAgICAgICAgdGhpcy5hLmVsZW1lbnQuX19UVF9fLmRlc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYi5lbGVtZW50Ll9fVFRfXylcclxuICAgICAgICAgICAgdGhpcy5iLmVsZW1lbnQuX19UVF9fLmRlc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hLmVsZW1lbnQuX19UVF9fID0gdGhpcztcclxuICAgICAgICB0aGlzLmIuZWxlbWVudC5fX1RUX18gPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHJldHVyblxyXG4gICAgICAgIGlmICh0aGlzLmIuZWxlbWVudClcclxuICAgICAgICAgICAgdGhpcy5iLmVsZW1lbnQuX19UVF9fID0gbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5hLmVsZW1lbnQpXHJcbiAgICAgICAgICAgIHRoaXMuYS5lbGVtZW50Ll9fVFRfXyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5hLmRlc3RydWN0b3IoKTtcclxuICAgICAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5iLnN0YXJ0KCk7XHJcbiAgICAgICAgdGhpcy5hLnN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hLnN0ZXAoKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVHJhbnNmb3JtUnVubmVyID0gbmV3IChjbGFzc3tcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucGFpcnMgPSBbXTtcclxuICAgICAgICB0aGlzLl9fX19TQ0hFRFVMRURfX19fID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVzaFBhaXIocGFpcikge1xyXG4gICAgICAgIHRoaXMucGFpcnMucHVzaChwYWlyKTtcclxuICAgICAgICBTY2hlZHVsZXIucXVldWVVcGRhdGUodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKHJhdGlvKSB7XHJcbiAgICAgICAgbGV0IHJwID0gdGhpcy5wYWlycztcclxuXHJcbiAgICAgICAgaWYocnAubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgU2NoZWR1bGVyLnF1ZXVlVXBkYXRlKHRoaXMpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBfcnAgPSBycFtpXTtcclxuICAgICAgICAgICAgaWYgKCFfcnAuc3RlcChyYXRpbykpIHtcclxuICAgICAgICAgICAgICAgIF9ycC5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgICAgICBycC5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgIH1cclxufSkoKVxyXG5cclxuXHJcbi8qKlxyXG4gICAgVHJhbnNmb3JtIG9uZSBlbGVtZW50IGZyb20gYW5vdGhlciBiYWNrIHRvIGl0c2VsZlxyXG4qL1xyXG5mdW5jdGlvbiBUcmFuc2Zvcm1UbyhlbGVtZW50X2Zyb20sIGVsZW1lbnRfdG8sIEhJREVfT1RIRVIpIHtcclxuXHJcblxyXG4gICAgaWYgKCFlbGVtZW50X3RvKSB7XHJcblxyXG4gICAgICAgIGxldCBhID0gKGZyb20pID0+IChlbGVtZW50X3RvLCBISURFX09USEVSKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBwYWlyID0gbmV3IFRUUGFpcihlbGVtZW50X3RvLCBmcm9tKTtcclxuICAgICAgICAgICAgVHJhbnNmb3JtUnVubmVyLnB1c2hQYWlyKHBhaXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGIgPSBhKG5ldyBUVF9Gcm9tKGVsZW1lbnRfZnJvbSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gYjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcGFpciA9IG5ldyBUVFBhaXIoZWxlbWVudF90bywgZWxlbWVudF9mcm9tKTtcclxuXHJcbiAgICBUcmFuc2Zvcm1SdW5uZXIucHVzaFBhaXIocGFpcik7XHJcblxyXG4gICAgcGFpci5zdGFydCgpO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBUcmFuc2Zvcm1Ub1xyXG59IiwiaW1wb3J0IHtcclxuXHRTdHlsZU1hcHBpbmdzXHJcbn0gZnJvbSBcIi4vc3R5bGVfbWFwcGluZ3NcIlxyXG5pbXBvcnQge0NvbG9yfSBmcm9tIFwiLi9jb2xvclwiIFxyXG5pbXBvcnQge1RyYW5zZm9ybVRvfSBmcm9tIFwiLi90cmFuc2Zvcm10b1wiXHJcblxyXG5jbGFzcyBTdHlsZUFuaW1CbG9jIHtcclxuXHRjb25zdHJ1Y3RvcihzdHlsZSwgdG9fdmFsLCBkdXJhdGlvbiwgZGVsYXkpIHtcclxuXHRcdHRoaXMuc3R5bGUgPSBzdHlsZTtcclxuXHRcdHRoaXMuZGVsYXkgPSBkZWxheTtcclxuXHRcdHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHRoaXMudG9fdmFsID0gdG9fdmFsO1xyXG5cdFx0dGhpcy5zdGVwID0gMDtcclxuXHRcdHRoaXMubmV4dCA9IG51bGw7XHJcblx0XHR0aGlzLnByZXYgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0ZGVzdHJ1Y3RvcigpIHtcclxuXHJcblx0fVxyXG5cclxuXHRzdGVwKHN0ZXBfbXVsdGlwbGllcikge1xyXG5cclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIFN0eWxlQW5pbUJsb2NQZXJjZW50YWdlIGV4dGVuZHMgU3R5bGVBbmltQmxvYyB7fVxyXG5jbGFzcyBTdHlsZUFuaW1CbG9jUGl4ZWwgZXh0ZW5kcyBTdHlsZUFuaW1CbG9jIHt9XHJcbmNsYXNzIFN0eWxlQW5pbUJsb2NFTSBleHRlbmRzIFN0eWxlQW5pbUJsb2Mge31cclxuY2xhc3MgU3R5bGVBbmltQmxvY0NvbG9yIGV4dGVuZHMgU3R5bGVBbmltQmxvYyB7fVxyXG5cclxuY2xhc3MgU3R5bGVLZXlGcmFtZWRBbmltQmxvYyBleHRlbmRzIFN0eWxlQW5pbUJsb2Mge1xyXG5cdGNvbnN0cnVjdG9yKHN0eWxlLCBrZXlfZnJhbWVzLCBkZWxheSkge1xyXG5cdFx0c3VwZXIoKVxyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgQW5pbUJ1ZGR5IHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50KSB7XHJcblx0XHR0aGlzLnN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCk7XHJcblx0XHR0aGlzLmZpcnN0X2FuaW1hdGlvbiA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRzZXRBbmltYXRpb24odmFscykge1xyXG5cdFx0bGV0IGFuaW1fYmxvYyA9IG51bGw7XHJcblx0XHRpZiAodmFscyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHR9XHJcblx0XHRpZihhbmltX2Jsb2Mpe1xyXG5cdFx0XHR0aGlzLl9faW5zZXJ0X18oYWIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X19pbnNlcnRfXyhhYikge1xyXG5cdFx0bGV0IGJsb2MgPSB0aGlzLmZpcnN0X2FuaW1hdGlvbjtcclxuXHJcblx0XHR3aGlsZSAoYmxvYykge1xyXG5cdFx0XHRpZiAoYmxvYy5zdHlsZSA9IGFiLnN0eWxlKSB7XHJcblx0XHRcdFx0YWIuZGVzdHJ1Y3RvcigpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGFiLm5leHQgPSB0aGlzLmZpcnN0X2FuaW1hdGlvbjtcclxuXHRcdGlmICh0aGlzLmZpcnN0X2FuaW1hdGlvbilcclxuXHRcdFx0dGhpcy5maXJzdF9hbmltYXRpb24ucHJldiA9IGFiO1xyXG5cdFx0dGhpcy5maXJzdF9hbmltYXRpb24gPSBhYjtcclxuXHR9XHJcblxyXG5cdHN0ZXAoc3RlcF9tdWx0aXBsaWVyKSB7XHJcblx0XHR2YXIgYW5pbV9ibG9jID0gdGhpcy5maXJzdF9hbmltYXRpb247XHJcblx0XHRpZiAoYW5pbV9ibG9jKVxyXG5cdFx0XHR3aGlsZSAoYW5pbV9ibG9jKVxyXG5cdFx0XHRcdGlmICghYW5pbV9ibG9jLnN0ZXAoc3RlcF9tdWx0aXBsaWVyKSkge1xyXG5cdFx0XHRcdFx0aWYgKCFhbmltX2Jsb2MucHJldilcclxuXHRcdFx0XHRcdFx0dGhpcy5maXJzdF9hbmltYXRpb24gPSBhbmltX2Jsb2MubmV4dDtcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0YW5pbV9ibG9jLnByZXYubmV4dCA9IGFuaW1fYmxvYy5uZXh0O1xyXG5cdFx0XHRcdFx0aWYgKGFuaW1fYmxvYy5uZXh0KVxyXG5cdFx0XHRcdFx0XHRhbmltX2Jsb2MubmV4dC5wcmV2ID0gYW5pbV9ibG9jLnByZXY7XHJcblxyXG5cdFx0XHRcdFx0bGV0IG5leHQgPSBhbmltX2Jsb2MubmV4dDtcclxuXHJcblx0XHRcdFx0XHRhbmltX2Jsb2MuZGVzdHJ1Y3RvcigpO1xyXG5cclxuXHRcdFx0XHRcdGFuaW1fYmxvYyA9IG5leHQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRhbmltX2Jsb2MgPSBhbmltX2Jsb2MubmV4dDtcclxuXHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0ZGVzdHJ1Y3RvcigpIHtcclxuXHJcblx0fVxyXG5cclxuXHRnZXRTdHlsZSgpIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0c2V0U3R5bGUodmFsdWUpIHtcclxuXHJcblx0fVxyXG5cclxuXHRvblJlc2l6ZSgpIHtcclxuXHRcdHRoaXMuZ2V0U3R5bGUoKVxyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgQW5pbUNvcmV7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmFuaW1fZ3JvdXAgPSB7fTtcclxuXHRcdHRoaXMucnVubmluZ19hbmltYXRpb25zID0gW107XHJcblx0fVxyXG5cclxuXHRzdGVwKHN0ZXBfbXVsdGlwbGllcikge1xyXG5cdFx0dmFyIGwgPSB0aGlzLnJ1bm5pbmdfYW5pbWF0aW9ucy5sZW5naHQ7XHJcblx0XHRpZiAobCA+IDApIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuXHJcblx0XHRcdFx0dmFyIGFiID0gdGhpcy5ydW5uaW5nX2FuaW1hdGlvbnNbaV07XHJcblxyXG5cdFx0XHRcdGlmIChhYiAmJiAhYWIuc3RlcChzdGVwX211bHRpcGxpZXIpKSB7XHJcblx0XHRcdFx0XHRhYi5kZXN0cnVjdG9yKCk7XHJcblx0XHRcdFx0XHR0aGlzLnJ1bm5pbmdfYW5pbWF0aW9uc1tpXSA9IG51bGw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhZGRCbG9jKGFuaW1fYmxvYykge1xyXG5cdFx0aWYgKGFuaW1fYmxvYyBpbnN0YW5jZW9mIEFuaW1CbG9jKSB7XHJcblx0XHRcdC8vYWRkIHRvIGdyb3VwIG9mIG9iamVjdFxyXG5cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCB7QW5pbUNvcmUsIFRyYW5zZm9ybVRvLCBDb2xvcn0iLCJjbGFzcyBUcmFuc2l0aW9uZWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZXQoZWxlbWVudCwgZGF0YSkge1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9IFwib3BhY2l0eSAwLjVzXCI7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRfaW4oZWxlbWVudCwgZGF0YSwgaW5kZXggPSAwKSB7XHJcbiAgICBcdGVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9IGBvcGFjaXR5ICR7MC44KmluZGV4KzAuNX1zYDtcclxuICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAxO1xyXG4gICAgICAgIHJldHVybiAwLjg7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0X291dChlbGVtZW50LCBkYXRhLCBpbmRleCA9IDApIHtcclxuICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgIHJldHVybiAwLjg7XHJcbiAgICB9XHJcblxyXG4gICAgZmluYWxpemVfb3V0KGVsZW1lbnQpIHtcclxuICAgIFx0ZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcclxuICAgIH1cclxufVxyXG5leHBvcnQge1xyXG4gICAgVHJhbnNpdGlvbmVlclxyXG59IiwiaW1wb3J0IHtcclxuICAgIFZpZXdcclxufSBmcm9tIFwiLi4vdmlld1wiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQW55TW9kZWxcclxufSBmcm9tIFwiLi4vbW9kZWwvbW9kZWxcIlxyXG5cclxuLypcclxuICAgIFRyYW5zaXRpb25lZXJzXHJcbiovXHJcblxyXG5pbXBvcnQge1xyXG4gICAgVHJhbnNpdGlvbmVlclxyXG59IGZyb20gXCIuLi9hbmltYXRpb24vdHJhbnNpdGlvbi90cmFuc2l0aW9uZWVyXCJcclxuXHJcbmxldCBQcmVzZXRUcmFuc2l0aW9uZWVycyA9IHtcclxuICAgIGJhc2U6IFRyYW5zaXRpb25lZXJcclxufVxyXG5cclxuY2xhc3MgUml2ZXQgZXh0ZW5kcyBWaWV3IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQgPSBudWxsLCBkYXRhID0ge30sIHByZXNldHMgPSB7fSkge1xyXG5cclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMubmFtZWRfZWxlbWVudHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5leHBvcnRfdmFsID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5ERVNUUk9ZRUQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy9TZXR0aW5nIHRoZSB0cmFuc2l0aW9uZXJcclxuICAgICAgICB0aGlzLnRyYW5zaXRpb25lZXIgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS50cnMpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChwcmVzZXRzLnRyYW5zaXRpb25zICYmIHByZXNldHMudHJhbnNpdGlvbnNbZGF0YS50cnNdKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyID0gbmV3IHByZXNldHMudHJhbnNpdGlvbnNbZGF0YS50cnNdKCk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKFByZXNldFRyYW5zaXRpb25lZXJzW2RhdGEudHJzXSlcclxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbmVlciA9IG5ldyBQcmVzZXRUcmFuc2l0aW9uZWVyc1tkYXRhLnRyc10oKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbmVlci5zZXQodGhpcy5lbGVtZW50KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hZGRUb1BhcmVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFRvUGFyZW50KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkgdGhpcy5wYXJlbnQuY2hpbGRyZW4ucHVzaCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLkRFU1RST1lFRCA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLkxPQURFRCkge1xyXG5cclxuXHJcbiAgICAgICAgICAgIGxldCB0ID0gdGhpcy50cmFuc2l0aW9uT3V0KCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIHQgPSBNYXRoLm1heCh0LCBjaGlsZC50cmFuc2l0aW9uT3V0KCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodCA+IDApXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5kZXN0cnVjdG9yKCk7IH0sIHQgKiAxMDAwICsgNSlcclxuXHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmluYWxpemVUcmFuc2l0aW9uT3V0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoYykgPT4gYy5kZXN0cnVjdG9yKCkpO1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50ICYmIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBzdXBlci5kZXN0cnVjdG9yKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYnViYmxlTGluayhsaW5rX3VybCwgY2hpbGQsIHRyc19lbGUgPSB7fSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEudHJhbnNpdGlvbilcclxuICAgICAgICAgICAgICAgIHRyc19lbGVbdGhpcy5kYXRhLnRyYW5zaXRpb25dID0gdGhpcy5lbGVtZW50O1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjaCA9IHRoaXMuY2hpbGRyZW5baV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoICE9PSBjaGlsZClcclxuICAgICAgICAgICAgICAgICAgICBjaC5nYXRoZXJUcmFuc2l0aW9uRWxlbWVudHModHJzX2VsZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LmJ1YmJsZUxpbmsobGlua191cmwsIHRoaXMsIHRyc19lbGUpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiaWdub3JlZCB0aXRsZVwiLCBsaW5rX3VybCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWVkRWxlbWVudHMobmFtZWRfZWxlbWVudHMpIHt9XHJcblxyXG4gICAgZ2F0aGVyVHJhbnNpdGlvbkVsZW1lbnRzKHRyc19lbGUpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS50cmFuc2l0aW9uICYmICF0cnNfZWxlW3RoaXMuZGF0YS50cmFuc2l0aW9uXSlcclxuICAgICAgICAgICAgdHJzX2VsZVt0aGlzLmRhdGEudHJhbnNpdGlvbl0gPSB0aGlzLmVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS5pcyA9PSAxKVxyXG4gICAgICAgICAgICAgICAgZS5nYXRoZXJUcmFuc2l0aW9uRWxlbWVudHModHJzX2VsZSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb3B5KGVsZW1lbnQsIGluZGV4KSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG91dF9vYmplY3QgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgICBlbGVtZW50ID0gdGhpcy5lbGVtZW50LmNsb25lTm9kZSh0cnVlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgb3V0X29iamVjdC5lbGVtZW50ID0gZWxlbWVudC5jaGlsZHJlblt0aGlzLmVsZW1lbnRdO1xyXG4gICAgICAgICAgICBvdXRfb2JqZWN0LmNoaWxkcmVuID0gbmV3IEFycmF5KHRoaXMuY2hpbGRyZW4ubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICBvdXRfb2JqZWN0LmNoaWxkcmVuW2ldID0gY2hpbGQuY29weShvdXRfb2JqZWN0LmVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0X29iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVVcmxVcGRhdGUod3VybCkge31cclxuXHJcbiAgICBmaW5hbGl6ZVRyYW5zaXRpb25PdXQoKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uZmluYWxpemVUcmFuc2l0aW9uT3V0KCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb25lZXIpXHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbmVlci5maW5hbGl6ZV9vdXQodGhpcy5lbGVtZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICBAcmV0dXJucyB7bnVtYmVyfSBUaW1lIGluIG1pbGxpc2Vjb25kcyB0aGF0IHRoZSB0cmFuc2l0aW9uIHdpbGwgdGFrZSB0byBjb21wbGV0ZS5cclxuICAgICovXHJcbiAgICB0cmFuc2l0aW9uSW4oaW5kZXggPSAwKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2hvdygpO1xyXG5cclxuICAgICAgICBsZXQgdHJhbnNpdGlvbl90aW1lID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSB0cnVlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMuY2hpbGRyZW5baV0udHJhbnNpdGlvbkluKGluZGV4KSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb25lZXIpXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgdGhpcy50cmFuc2l0aW9uZWVyLnNldF9pbih0aGlzLmVsZW1lbnQsIHRoaXMuZGF0YSwgaW5kZXgpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25fdGltZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBUYWtlcyBhcyBhbiBpbnB1dCBhIGxpc3Qgb2YgdHJhbnNpdGlvbiBvYmplY3RzIHRoYXQgY2FuIGJlIHVzZWRcclxuICAgICovXHJcbiAgICB0cmFuc2l0aW9uT3V0KGluZGV4ID0gMCwgREVTVFJPWSA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGxldCB0cmFuc2l0aW9uX3RpbWUgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLkxPQURFRCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uZWVyKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMudHJhbnNpdGlvbmVlci5zZXRfb3V0KHRoaXMuZWxlbWVudCwgdGhpcy5kYXRhLCBpbmRleCkpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMuY2hpbGRyZW5baV0udHJhbnNpdGlvbk91dChpbmRleCkpO1xyXG5cclxuICAgICAgICBpZiAoREVTVFJPWSlcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuZmluYWxpemVUcmFuc2l0aW9uT3V0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc3RydWN0b3IoKTsgfSwgdHJhbnNpdGlvbl90aW1lICogMTAwMCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uX3RpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRGltZW5zaW9ucygpIHtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnVwZGF0ZURpbWVuc2lvbnMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBDYWxsZWQgYnkgIHBhcmVudCB3aGVuIGRhdGEgaXMgdXBkYXRlIGFuZCBwYXNzZWQgZG93biBmcm9tIGZ1cnRoZXIgdXAgdGhlIGdyYXBoLiBcclxuICAgICAgICBAcGFyYW0geyhPYmplY3QgfCBNb2RlbCl9IGRhdGEgLSBEYXRhIHRoYXQgaGFzIGJlZW4gdXBkYXRlZCBhbmQgaXMgdG8gYmUgcmVhZC4gXHJcbiAgICAgICAgQHBhcmFtIHtBcnJheX0gY2hhbmdlZF9wcm9wZXJ0aWVzIC0gQW4gYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgdGhhdCBoYXZlIGJlZW4gdXBkYXRlZC4gXHJcbiAgICAgICAgQHBhcmFtIHtCb29sZWFufSBJTVBPUlRFRCAtIFRydWUgaWYgdGhlIGRhdGEgZGlkIG5vdCBvcmlnaW5hdGUgZnJvbSB0aGUgbW9kZWwgd2F0Y2hlZCBieSB0aGUgcGFyZW50IENhc2UuIEZhbHNlIG90aGVyd2lzZS5cclxuICAgICovXHJcbiAgICBfX2Rvd25fXyhkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMgPSBudWxsLCBJTVBPUlRFRCA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGxldCByX3ZhbCA9IHRoaXMuZG93bihkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMsIElNUE9SVEVEKTtcclxuXHJcbiAgICAgICAgaWYgKHJfdmFsKShkYXRhID0gcl92YWwsIElNUE9SVEVEID0gdHJ1ZSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uX19kb3duX18oZGF0YSwgY2hhbmdlZF9wcm9wZXJ0aWVzLCBJTVBPUlRFRCk7XHJcbiAgICB9XHJcbiAgICBkb3duKGRhdGEsIGNoYW5nZWRfcHJvcGVydGllcyA9IG51bGwsIElNUE9SVEVEKSB7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIENhbGxlZCBieSAgcGFyZW50IHdoZW4gZGF0YSBpcyB1cGRhdGUgYW5kIHBhc3NlZCB1cCBmcm9tIGEgbGVhZi4gXHJcbiAgICAgICAgQHBhcmFtIHsoT2JqZWN0IHwgTW9kZWwpfSBkYXRhIC0gRGF0YSB0aGF0IGhhcyBiZWVuIHVwZGF0ZWQgYW5kIGlzIHRvIGJlIHJlYWQuIFxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IGNoYW5nZWRfcHJvcGVydGllcyAtIEFuIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIHRoYXQgaGF2ZSBiZWVuIHVwZGF0ZWQuIFxyXG4gICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gSU1QT1JURUQgLSBUcnVlIGlmIHRoZSBkYXRhIGRpZCBub3Qgb3JpZ2luYXRlIGZyb20gdGhlIG1vZGVsIHdhdGNoZWQgYnkgdGhlIHBhcmVudCBDYXNlLiBGYWxzZSBvdGhlcndpc2UuXHJcbiAgICAqL1xyXG4gICAgX191cF9fKGRhdGEpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KVxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudCh1cCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXAoZGF0YSkge1xyXG5cclxuICAgICAgICBpZiAoZGF0YSlcclxuICAgICAgICAgICAgdGhpcy5fX3VwX18oZGF0YSlcclxuICAgIH1cclxuXHJcbiAgICBfX3VwZGF0ZV9fKGRhdGEsIEZST01fUEFSRU5UID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgbGV0IHJfZGF0YSA9IHRoaXMudXBkYXRlKGRhdGEsIEZST01fUEFSRU5UKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5fX3VwZGF0ZV9fKHJfZGF0YSB8fCBkYXRhLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkKG1vZGVsKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLmxvYWQobW9kZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSA9IHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5O1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzaG93KCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50KVxyXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPT0gXCJub25lXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IHRoaXMuZGlzcGxheTtcclxuICAgIH1cclxuXHJcbiAgICBfX3VwZGF0ZUV4cG9ydHNfXyhkYXRhKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEuZXhwb3J0ICYmIGRhdGFbdGhpcy5kYXRhLmV4cG9ydF0pXHJcbiAgICAgICAgICAgIHRoaXMuZXhwb3J0X3ZhbCA9IGRhdGFbdGhpcy5kYXRhLmV4cG9ydF07XHJcbiAgICB9XHJcblxyXG4gICAgX19nZXRFeHBvcnRzX18oZXhwb3J0cykge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5leHBvcnRfdmFsKVxyXG4gICAgICAgICAgICBleHBvcnRzW3RoaXMuZGF0YS5leHBvcnRdID0gdGhpcy5leHBvcnRfdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEV4cG9ydHMgZGF0YSBzdG9yZWQgZnJvbSB1cGRhdGVFeHBvcnRzKCkgaW50byBhIGFuIE9iamVjdCBleHBvcnRzIGFuZCBjYWxscyBpdCdzIHBhcmVudCdzIGV4cG9ydCBmdW5jdGlvbiwgcGFzc2luZyBleHBvcnRzXHJcbiAgICAqL1xyXG4gICAgZXhwb3J0IChleHBvcnRzID0gbmV3IEFueU1vZGVsKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC5leHBvcnQpIHtcclxuXHJcblxyXG4gICAgICAgICAgICB0aGlzLl9fZ2V0RXhwb3J0c19fKGV4cG9ydHMpXHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5fX2dldEV4cG9ydHNfXyhleHBvcnRzKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LmV4cG9ydChleHBvcnRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW1wb3J0IChkYXRhKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1vZGVsKVxyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmFkZChkYXRhKTtcclxuXHJcbiAgICAgICAgdGhpcy5leHBvcnQoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRXhwb3J0cyhkYXRhKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEuZXhwb3J0ICYmIGRhdGFbdGhpcy5kYXRhLmV4cG9ydF0pXHJcbiAgICAgICAgICAgIHRoaXMuZXhwb3J0ID0gZGF0YVt0aGlzLmRhdGEuZXhwb3J0XTtcclxuICAgIH1cclxuXHJcbiAgICBhZGQodmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5tb2RlbC5hZGQodmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmV4cG9ydCh0aGlzLm1vZGVsKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LmFkZClcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuYWRkKHZhbHVlKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgUml2ZXRcclxufSIsImltcG9ydCB7XHJcbiAgICBWaWV3XHJcbn0gZnJvbSBcIi4uL3ZpZXdcIlxyXG5pbXBvcnQge1xyXG4gICAgR2V0dGVyXHJcbn0gZnJvbSBcIi4uL2dldHRlclwiXHJcbmltcG9ydCB7XHJcbiAgICBSaXZldFxyXG59IGZyb20gXCIuLi9jYXNlL3JpdmV0XCJcclxuaW1wb3J0IHtcclxuICAgIFR1cm5EYXRhSW50b1F1ZXJ5XHJcbn0gZnJvbSBcIi4uL2NvbW1vblwiXHJcbmltcG9ydCB7XHJcbiAgICBEYXRhVGVtcGxhdGVcclxufSBmcm9tIFwiLi9kYXRhX3RlbXBsYXRlXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBUcmFuc2l0aW9uZWVyXHJcbn0gZnJvbSBcIi4uL2FuaW1hdGlvbi90cmFuc2l0aW9uL3RyYW5zaXRpb25lZXJcIlxyXG5cclxuXHJcbi8qKlxyXG4gICAgSGFuZGxlcyB0aGUgdHJhbnNpdGlvbiBvZiBzZXBhcmF0ZSBlbGVtZW50cy5cclxuKi9cclxuY2xhc3MgQmFzaWNDYXNlIGV4dGVuZHMgUml2ZXQge1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkge1xyXG4gICAgICAgIHN1cGVyKG51bGwsIGVsZW1lbnQsIHt9LCB7fSk7XHJcbiAgICAgICAgdGhpcy5hbmNob3IgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuTE9BREVEID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbmVlciA9IG5ldyBUcmFuc2l0aW9uZWVyKCk7XHJcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyLnNldCh0aGlzLmVsZW1lbnQpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZWRFbGVtZW50cyhuYW1lZF9lbGVtZW50cykge1xyXG4gICAgICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuZWxlbWVudC5jaGlsZHJlbjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjaGlsZHJlbltpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5kYXRhc2V0LnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIG5hbWVkX2VsZW1lbnRzW2NoaWxkLmRhdGFzZXQudHJhbnNpdGlvbl0gPSBjaGlsZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAgICBUaGlzIGlzIGEgZmFsbGJhY2sgY29tcG9uZW50IGlmIGNvbnN0cnVjdGluZyBhIENhc2VDb21wb25lbnQgb3Igbm9ybWFsIENvbXBvbmVudCB0aHJvd3MgYW4gZXJyb3IuXHJcbiovXHJcblxyXG5jbGFzcyBGYWlsZWRDYXNlIGV4dGVuZHMgUml2ZXQge1xyXG4gICAgY29uc3RydWN0b3IoZXJyb3JfbWVzc2FnZSwgcHJlc2V0cykge1xyXG4gICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdi5pbm5lckhUTUwgPSBgPGgzPiBUaGlzIFdpY2sgY29tcG9uZW50IGhhcyBmYWlsZWQhPC9oMz4gPGg0PkVycm9yIE1lc3NhZ2U6PC9oND48cD4ke2Vycm9yX21lc3NhZ2Uuc3RhY2t9PC9wPjxwPlBsZWFzZSBjb250YWN0IHRoZSB3ZWJzaXRlIG1haW50YWluZXJzIHRvIGFkZHJlc3MgdGhlIHByb2JsZW0uPC9wPiA8cD4ke3ByZXNldHMuZXJyb3JfY29udGFjdH08L3A+YDtcclxuICAgICAgICBzdXBlcihudWxsLCBkaXYsIHt9LCB7fSk7XHJcblxyXG4gICAgICAgICB0aGlzLnRyYW5zaXRpb25lZXIgPSBuZXcgVHJhbnNpdGlvbmVlcigpO1xyXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbmVlci5zZXQodGhpcy5lbGVtZW50KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgQmFzaWNDYXNlLFxyXG4gICAgRmFpbGVkQ2FzZVxyXG59IiwiaW1wb3J0IHtcclxuICAgIHNldExpbmtzXHJcbn0gZnJvbSBcIi4uLy4uL2xpbmtlci9zZXRsaW5rc1wiXHJcbmltcG9ydCB7XHJcbiAgICBMZXhcclxufSBmcm9tIFwiLi4vLi4vY29tbW9uXCJcclxuaW1wb3J0IHtcclxuICAgIFJpdmV0XHJcbn0gZnJvbSBcIi4uL3JpdmV0XCJcclxuXHJcbi8qKlxyXG4gICAgRGVhbHMgd2l0aCBzcGVjaWZpYyBwcm9wZXJ0aWVzIG9uIGEgbW9kZWwuIFxyXG4qL1xyXG5cclxuY2xhc3MgQ2Fzc2V0dGUgZXh0ZW5kcyBSaXZldCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIGVsZW1lbnQsIHByZXNldHMsIGRhdGEpIHtcclxuXHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBlbGVtZW50LCBwcmVzZXRzLCBkYXRhKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wID0gdGhpcy5kYXRhLnByb3A7XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggPSAwO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMDtcclxuICAgICAgICB0aGlzLnRvcCA9IDA7XHJcbiAgICAgICAgdGhpcy5sZWZ0ID0gMDtcclxuICAgICAgICB0aGlzLmx2bCA9IDA7XHJcbiAgICAgICAgdGhpcy5pcyA9IDE7XHJcbiAgICAgICAgdGhpcy5kYXRhX2NhY2hlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQudGFnTmFtZSA9PSBcIkFcIilcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGluayh0aGlzLmVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQudGFnTmFtZSA9PSBcIkFcIilcclxuICAgICAgICAgICAgdGhpcy5kZXN0cm95TGluayh0aGlzLmVsZW1lbnQpO1xyXG5cclxuICAgICAgICB0aGlzLmRhdGFfY2FjaGUgPSBudWxsO1xyXG5cclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgVGhpcyB3aWxsIGF0dGFjaCBhIGZ1bmN0aW9uIHRvIHRoZSBsaW5rIGVsZW1lbnQgdG8gaW50ZXJjZXB0IGFuZCBwcm9jZXNzIGRhdGEgZnJvbSB0aGUgY2Fzc2V0dGUuXHJcbiAgICAqL1xyXG4gICAgcHJvY2Vzc0xpbmsoZWxlbWVudCwgbGluaykge1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudC5vcmlnaW4gIT09IGxvY2F0aW9uLm9yaWdpbikgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAoIWVsZW1lbnQub25jbGljaykgZWxlbWVudC5vbmNsaWNrID0gKChocmVmLCBhLCBfX2Z1bmN0aW9uX18pID0+IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgaWYgKF9fZnVuY3Rpb25fXyhocmVmLCBhKSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pKGVsZW1lbnQuaHJlZiwgZWxlbWVudCwgKGhyZWYsIGEpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCBTQU1FX0xPQ0FMRSA9IChsb2NhdGlvbi5wYXRobmFtZSA9PSBhLnBhdGhuYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBoYXNodGFnID0gaHJlZi5pbmNsdWRlcyhcIiNcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmVhbF9ocmVmID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGxldCBsZXggPSBMZXgoaHJlZik7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAobGV4LnRva2VuKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGxleC50b2tlbi50ZXh0ID09IFwie1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcCA9IGxleC50b2tlbi50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhbF9ocmVmICs9IHRoaXNbcHJvcF0gfHwgdGhpcy5kYXRhX2NhY2hlW3Byb3BdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobGV4LnRva2VuLnRleHQgIT0gXCJ9XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgaW5jb3JyZWN0IHZhbHVlIGZvdW5kIGluIHVybCAke2hyZWZ9YClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhbF9ocmVmICs9IGxleC50b2tlbi50ZXh0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChoYXNodGFnKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5leHBvcnQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCFTQU1FX0xPQ0FMRSlcclxuICAgICAgICAgICAgICAgIHRoaXMuYnViYmxlTGluayhyZWFsX2hyZWYpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGVsZW1lbnQub25tb3VzZW92ZXIgPSAoKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IGhyZWYgPSBlbGVtZW50LmhyZWY7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmVhbF9ocmVmID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGxldCBsZXggPSBMZXgoaHJlZik7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAobGV4LnRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGV4LnRva2VuLnRleHQgPT0gXCJ7XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9wID0gbGV4LnRva2VuLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVhbF9ocmVmICs9IHRoaXNbcHJvcF0gfHwgdGhpcy5kYXRhX2NhY2hlW3Byb3BdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobGV4LnRva2VuLnRleHQgIT0gXCJ9XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgaW5jb3JyZWN0IHZhbHVlIGZvdW5kIGluIHVybCAke2hyZWZ9YClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhbF9ocmVmICs9IGxleC50b2tlbi50ZXh0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3lMaW5rKGVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgZWxlbWVudC5vbmNsaWNrID0gbnVsbFxyXG4gICAgICAgIGVsZW1lbnQub25tb3VzZW92ZXIgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGUoZGF0YSwgX19GUk9NX1BBUkVOVF9fID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgc3VwZXIuX191cGRhdGVFeHBvcnRzX18oZGF0YSk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gZGF0YVt0aGlzLnByb3BdO1xyXG4gICAgICAgICAgICAgICAgdGhpc1t0aGlzLnByb3BdID0gZGF0YVt0aGlzLnByb3BdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhX2NhY2hlID0gZGF0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbXBvcnQgKGRhdGEpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbG9hZChtb2RlbCkge1xyXG5cclxuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGUpID0+IHtcclxuICAgICAgICAgICAgZS5sb2FkKG1vZGVsKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLm1vZGVsKVxyXG4gICAgICAgICAgICBtb2RlbC5hZGRWaWV3KHRoaXMpXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRGltZW5zaW9ucygpIHtcclxuXHJcbiAgICAgICAgdmFyIGQgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggPSBkLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZC5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy50b3AgPSBkLnRvcDtcclxuICAgICAgICB0aGlzLmxlZnQgPSBkLmxlZnQ7XHJcblxyXG4gICAgICAgIHN1cGVyLnVwZGF0ZURpbWVuc2lvbnMoKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQ2xvc2VDYXNzZXR0ZSBleHRlbmRzIENhc3NldHRlIHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgZWxlbWVudCwgZCwgcCkge1xyXG4gICAgICAgIHN1cGVyKHBhcmVudCwgZWxlbWVudCwgZCwgcCk7XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBwYXJlbnQuaGlkZSgpOyAvL09yIFVSTCBiYWNrO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBDYXNzZXR0ZSxcclxuICAgIENsb3NlQ2Fzc2V0dGUsXHJcbiAgICBJbXBvcnREYXRhRnJvbURhdGFTZXRcclxufSIsImltcG9ydCB7XHJcbiAgICBSaXZldFxyXG59IGZyb20gXCIuL3JpdmV0XCJcclxuaW1wb3J0IHtcclxuICAgIE1vZGVsXHJcbn0gZnJvbSBcIi4uL21vZGVsL21vZGVsXCJcclxuaW1wb3J0IHtcclxuICAgIENvbnRyb2xsZXJcclxufSBmcm9tIFwiLi4vY29udHJvbGxlclwiXHJcbmltcG9ydCB7XHJcbiAgICBHZXR0ZXJcclxufSBmcm9tIFwiLi4vZ2V0dGVyXCJcclxuaW1wb3J0IHtcclxuICAgIENhc3NldHRlXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvY2Fzc2V0dGVcIlxyXG5cclxuY2xhc3MgQ2FzZSBleHRlbmRzIFJpdmV0IHtcclxuXHJcbiAgICAvKipcclxuICAgICAgICBDYXNlIGNvbnN0cnVjdG9yLiBCdWlsZHMgYSBDYXNlIG9iamVjdC5cclxuICAgICAgICBAcGFyYW1zIFtET01FbGVtZW50XSBlbGVtZW50IC0gQSBET00gPHRlbXBsYXRlPiBlbGVtZW50IHRoYXQgY29udGFpbnMgYSA8Y2FzZT4gZWxlbWVudC5cclxuICAgICAgICBAcGFyYW1zIFtMaW5rZXJQcmVzZXRzXSBwcmVzZXRzXHJcbiAgICAgICAgQHBhcmFtcyBbQ2FzZV0gcGFyZW50IC0gVGhlIHBhcmVudCBDYXNlIG9iamVjdCwgdXNlZCBpbnRlcm5hbGx5IHRvIGJ1aWxkIENhc2UncyBpbiBhIGhpZXJhcmNoeVxyXG4gICAgICAgIEBwYXJhbXMgW01vZGVsXSBtb2RlbCAtIEEgbW9kZWwgdGhhdCBjYW4gYmUgcGFzc2VkIHRvIHRoZSBjYXNlIGluc3RlYWQgb2YgaGF2aW5nIG9uZSBjcmVhdGVkIG9yIHB1bGxlZCBmcm9tIHByZXNldHMuIFxyXG4gICAgICAgIEBwYXJhbXMgW0RPTV0gIFdPUktJTkdfRE9NIC0gVGhlIERPTSBvYmplY3QgdGhhdCBjb250YWlucyB0ZW1wbGF0ZXMgdG8gYmUgdXNlZCB0byBidWlsZCB0aGUgY2FzZSBvYmplY3RzLiBcclxuICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQgPSBudWxsLCBkYXRhLCBwcmVzZXRzKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKHBhcmVudCwgZGF0YSwgcHJlc2V0cylcclxuXHJcbiAgICAgICAgdGhpcy5VU0VfU0VDVVJFID0gcHJlc2V0cy5VU0VfSFRUUFM7XHJcbiAgICAgICAgdGhpcy5uYW1lZF9lbGVtZW50cyA9IHt9O1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucHJvcCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy51cmwgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucHJlc2V0cyA9IHByZXNldHM7XHJcbiAgICAgICAgdGhpcy5yZWNlaXZlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5xdWVyeSA9IHt9O1xyXG4gICAgICAgIHRoaXMuUkVRVUVTVElORyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZXhwb3J0cyA9IG51bGw7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmZpbHRlcl9saXN0ID0gW107XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmZpbHRlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLmlzID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJlY2VpdmVyKVxyXG4gICAgICAgICAgICB0aGlzLnJlY2VpdmVyLmRlc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnRlbXBsYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW2ldLmRlc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFNldHMgdXAgTW9kZWwgY29ubmVjdGlvbiBvciBjcmVhdGVzIGEgbmV3IE1vZGVsIGZyb20gYSBzY2hlbWEuXHJcbiAgICAqL1xyXG4gICAgbG9hZChtb2RlbCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEudXJsKSB7XHJcbiAgICAgICAgICAgIC8vaW1wb3J0IHF1ZXJ5IGluZm8gZnJvbSB0aGUgd3VybFxyXG4gICAgICAgICAgICBsZXQgc3RyID0gdGhpcy5kYXRhLnVybDtcclxuICAgICAgICAgICAgbGV0IGNhc3NldHRlcyA9IHN0ci5zcGxpdChcIjtcIik7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS51cmwgPSBjYXNzZXR0ZXNbMF07XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGNhc3NldHRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhc3NldHRlID0gY2Fzc2V0dGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoY2Fzc2V0dGVbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1RPRE9cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cmxfcGFyZW50X2ltcG9ydCA9IGNhc3NldHRlLnNsaWNlKDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJxXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXJsX3F1ZXJ5ID0gY2Fzc2V0dGUuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCI8XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXJsX3JldHVybiA9IGNhc3NldHRlLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnByb3AgPSB0aGlzLmRhdGEucHJvcDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5leHBvcnQpIHRoaXMuZXhwb3J0cyA9IHRoaXMuZGF0YS5leHBvcnQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1vZGVsKSB7XHJcbiAgICAgICAgICAgIG1vZGVsID0gdGhpcy5tb2RlbDtcclxuICAgICAgICAgICAgdGhpcy5tb2RlbCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwgJiYgbW9kZWwgaW5zdGFuY2VvZiBNb2RlbCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2NoZW1hKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBPcGluaW9uYXRlZCBDYXNlIC0gT25seSBhY2NlcHRzIE1vZGVscyB0aGF0IGFyZSBvZiB0aGUgc2FtZSB0eXBlIGFzIGl0cyBzY2hlbWEuKi9cclxuICAgICAgICAgICAgICAgIGlmIChtb2RlbC5jb25zdHJ1Y3RvciAhPSB0aGlzLnNjaGVtYSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdGhyb3cgbmV3IEVycm9yKGBNb2RlbCBTY2hlbWEgJHt0aGlzLm1vZGVsLnNjaGVtYX0gZG9lcyBub3QgbWF0Y2ggQ2FzZSBTY2hlbWEgJHtwcmVzZXRzLnNjaGVtYXNbdGhpcy5kYXRhLnNjaGVtYV0uc2NoZW1hfWApXHJcbiAgICAgICAgICAgICAgICB9ZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NoZW1hID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBudWxsO1xyXG4gICAgICAgIH0gXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNjaGVtYSkgXHJcbiAgICAgICAgICAgIG1vZGVsID0gbmV3IHRoaXMuc2NoZW1hKCk7XHJcblxyXG4gICAgICAgIG1vZGVsLmFkZFZpZXcodGhpcyk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1vZGVsKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEudXJsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlY2VpdmVyID0gbmV3IEdldHRlcih0aGlzLmRhdGEudXJsLCB0aGlzLnVybF9yZXR1cm4pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNlaXZlci5zZXRNb2RlbChtb2RlbCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fX19yZXF1ZXN0X19fXygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIE1vZGVsIGNvdWxkIGJlIGZvdW5kIGZvciBDYXNlIGNvbnN0cnVjdG9yISBDYXNlIHNjaGVtYSBcIiR7dGhpcy5kYXRhLnNjaGVtYX1cIiwgXCIke3RoaXMucHJlc2V0cy5zY2hlbWFzW3RoaXMuZGF0YS5zY2hlbWFdfVwiOyBDYXNlIG1vZGVsIFwiJHt0aGlzLmRhdGEubW9kZWx9XCIsIFwiJHt0aGlzLnByZXNldHMubW9kZWxzW3RoaXMuZGF0YS5tb2RlbF19XCI7YCk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykgXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0ubG9hZCh0aGlzLm1vZGVsKTtcclxuICAgIH1cclxuXHJcbiAgICBfX19fcmVxdWVzdF9fX18ocXVlcnkpIHtcclxuXHJcbiAgICAgICAgdGhpcy5yZWNlaXZlci5nZXQocXVlcnksIG51bGwsIHRoaXMuVVNFX1NFQ1VSRSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuUkVRVUVTVElORyA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuUkVRVUVTVElORyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IChleHBvcnRzKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlU3Vicyh0aGlzLmNoaWxkcmVuLCBleHBvcnRzLCB0cnVlKTtcclxuXHJcbiAgICAgICAgc3VwZXIuZXhwb3J0KGV4cG9ydHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVN1YnMoY2Fzc2V0dGVzLCBkYXRhLCBJTVBPUlQgPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNhc3NldHRlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBjYXNzZXR0ZSA9IGNhc3NldHRlc1tpXTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChjYXNzZXR0ZSBpbnN0YW5jZW9mIENhc2UpXHJcbiAgICAgICAgICAgICAgICBjYXNzZXR0ZS51cGRhdGUoZGF0YSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJfdmFsO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChJTVBPUlQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhc3NldHRlLmRhdGEuaW1wb3J0ICYmIGRhdGFbY2Fzc2V0dGUuZGF0YS5pbXBvcnRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJfdmFsID0gY2Fzc2V0dGUudXBkYXRlKGRhdGEsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJfdmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN1YnMoY2Fzc2V0dGUuY2hpbGRyZW4sIHJfdmFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvKiogXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE92ZXJyaWRpbmcgdGhlIG1vZGVsIGRhdGEgaGFwcGVucyB3aGVuIGEgY2Fzc2V0dGUgcmV0dXJucyBhbiBvYmplY3QgaW5zdGVhZCBvZiB1bmRlZmluZWQuIFRoaXMgaXMgYXNzaWduZWQgdG8gdGhlIFwicl92YWxcIiB2YXJpYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBbnkgY2hpbGQgY2Fzc2V0dGUgb2YgdGhlIHJldHVybmluZyBjYXNzZXR0ZSB3aWxsIGJlIGZlZCBcInJfdmFsXCIgaW5zdGVhZCBvZiBcImRhdGFcIi5cclxuICAgICAgICAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByX3ZhbCA9IGNhc3NldHRlLnVwZGF0ZShkYXRhLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTdWJzKGNhc3NldHRlLmNoaWxkcmVuLCByX3ZhbCB8fCBkYXRhLCBJTVBPUlQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwKGRhdGEpe1xyXG4gICAgICAgIHRoaXMubW9kZWwuYWRkKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkYXRhLCBjaGFuZ2VkX3ZhbHVlcykge1xyXG4gICAgICAgIHRoaXMuX19kb3duX18oZGF0YSwgY2hhbmdlZF92YWx1ZXMpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBoYW5kbGVVcmxVcGRhdGUod3VybCkge1xyXG4gICAgICAgIGxldCBxdWVyeV9kYXRhID0gbnVsbDtcclxuICAgICAgICAvKiBcclxuICAgICAgICAgICAgVGhpcyBwYXJ0IG9mIHRoZSBmdW5jdGlvbiB3aWxsIGltcG9ydCBkYXRhIGludG8gdGhlIG1vZGVsIHRoYXQgaXMgb2J0YWluZWQgZnJvbSB0aGUgcXVlcnkgc3RyaW5nIFxyXG4gICAgICAgICovXHJcbiAgICAgICAgaWYgKHd1cmwgJiYgdGhpcy5kYXRhLmltcG9ydCkge1xyXG4gICAgICAgICAgICBxdWVyeV9kYXRhID0ge307XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuaW1wb3J0ID09IFwibnVsbFwiKSB7XHJcbiAgICAgICAgICAgICAgICBxdWVyeV9kYXRhID0gd3VybC5nZXRDbGFzcygpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocXVlcnlfZGF0YSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBsID0gdGhpcy5kYXRhLmltcG9ydC5zcGxpdChcIjtcIilcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuID0gbFtpXS5zcGxpdChcIjpcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc19uYW1lID0gblswXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IG5bMV0uc3BsaXQoXCI9PlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5X25hbWUgPSBwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbXBvcnRfbmFtZSA9IHBbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzX25hbWUgPT0gXCJyb290XCIpIGNsYXNzX25hbWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5X2RhdGFbaW1wb3J0X25hbWVdID0gd3VybC5nZXQoY2xhc3NfbmFtZSwga2V5X25hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAod3VybCAmJiB0aGlzLmRhdGEudXJsKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgcXVlcnlfZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy51cmxfcXVlcnkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsID0gdGhpcy51cmxfcXVlcnkuc3BsaXQoXCI7XCIpXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbiA9IGxbaV0uc3BsaXQoXCI6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc19uYW1lID0gblswXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IG5bMV0uc3BsaXQoXCI9PlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5X25hbWUgPSBwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbXBvcnRfbmFtZSA9IHBbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzX25hbWUgPT0gXCJyb290XCIpIGNsYXNzX25hbWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5X2RhdGFbaW1wb3J0X25hbWVdID0gd3VybC5nZXQoY2xhc3NfbmFtZSwga2V5X25hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9fX19yZXF1ZXN0X19fXyhxdWVyeV9kYXRhKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm1vZGVsKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbmV3IHRoaXMubW9kZWxfY29uc3RydWN0b3IoKTtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXR0ZXIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldHRlci5zZXRNb2RlbCh0aGlzLm1vZGVsKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwuYWRkVmlldyh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChxdWVyeV9kYXRhKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5tb2RlbC5hZGQocXVlcnlfZGF0YSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMubW9kZWwuZ2V0KCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMubW9kZWwuZ2V0KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25JbihpbmRleCA9IDApIHtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fdGltZSA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMudGVtcGxhdGVzW2ldLnRyYW5zaXRpb25JbihpbmRleCkpO1xyXG5cclxuICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHN1cGVyLnRyYW5zaXRpb25JbihpbmRleCkpO1xyXG5cclxuICAgICAgIHRoaXMudXBkYXRlRGltZW5zaW9ucygpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbl90aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFRha2VzIGFzIGFuIGlucHV0IGEgbGlzdCBvZiB0cmFuc2l0aW9uIG9iamVjdHMgdGhhdCBjYW4gYmUgdXNlZFxyXG4gICAgKi9cclxuICAgIHRyYW5zaXRpb25PdXQoaW5kZXggPSAwLCBERVNUUk9ZID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fdGltZSA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMudGVtcGxhdGVzW2ldLnRyYW5zaXRpb25PdXQoaW5kZXgpKTtcclxuXHJcbiAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCBzdXBlci50cmFuc2l0aW9uT3V0KGluZGV4LCBERVNUUk9ZKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uX3RpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmluYWxpemVUcmFuc2l0aW9uT3V0KCkge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVtcGxhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNbaV0uZmluYWxpemVUcmFuc2l0aW9uT3V0KCk7XHJcblxyXG4gICAgICAgIHN1cGVyLmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEFjdGl2YXRpbmcoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KVxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5zZXRBY3RpdmF0aW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZWRFbGVtZW50cyhuYW1lZF9lbGVtZW50cykge1xyXG4gICAgICAgIGZvciAobGV0IGNvbXBfbmFtZSBpbiB0aGlzLm5hbWVkX2VsZW1lbnRzKSBcclxuICAgICAgICAgICAgbmFtZWRfZWxlbWVudHNbY29tcF9uYW1lXSA9IHRoaXMubmFtZWRfZWxlbWVudHNbY29tcF9uYW1lXTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQ3VzdG9tQ2FzZSBleHRlbmRzIENhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgZGF0YSA9IHt9LCBwcmVzZXRzID0ge30pIHtcclxuICAgICAgICBzdXBlcihudWxsLCBlbGVtZW50LCBkYXRhLCBwcmVzZXRzKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgQ2FzZSxcclxuICAgIEN1c3RvbUNhc2VcclxufSIsImltcG9ydCB7XHJcbiAgICBDYXNzZXR0ZVxyXG59IGZyb20gXCIuL2Nhc3NldHRlXCJcclxuXHJcbmNsYXNzIEZpbHRlciBleHRlbmRzIENhc3NldHRlIHtcclxuXHRcclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgZWxlbWVudCwgZCwgcCkge1xyXG5cclxuICAgICAgICBzdXBlcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApO1xyXG5cclxuICAgICAgICBwYXJlbnQuZmlsdGVyX2xpc3QucHVzaCgoZGF0YSkgPT4gdGhpcy5maWx0ZXIoZGF0YSkpO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQudXBkYXRlKCk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGF0YSkge1xyXG4gICAgICAgIC8vYXBwbHkgYSBmaWx0ZXIgb2JqZWN0IHRvIHRoZSBwYXJlbnRcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBGaWx0ZXJcclxufSIsImltcG9ydCB7XHJcbiAgICBDYXNlXHJcbn0gZnJvbSBcIi4vY2FzZVwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgRmlsdGVyXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZmlsdGVyXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBUZXJtXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvdGVybVwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgTUNBcnJheSxcclxuICAgIE1vZGVsQ29udGFpbmVyLFxyXG4gICAgTXVsdGlJbmRleGVkQ29udGFpbmVyXHJcbn0gZnJvbSBcIi4uL21vZGVsL21vZGVsX2NvbnRhaW5lclwiXHJcblxyXG5jbGFzcyBDYXNlVGVtcGxhdGUgZXh0ZW5kcyBDYXNlIHtcclxuXHJcbiAgICAvKipcclxuICAgICAgICBDYXNlVGVtcGxhdGUgY29uc3RydWN0b3IuIEJ1aWxkcyBhIENhc2VUZW1wbGF0ZSBvYmplY3QuXHJcbiAgICAqL1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCA9IG51bGwsIGRhdGEsIHByZXNldHMpIHtcclxuXHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBkYXRhLCBwcmVzZXRzKTtcclxuXHJcbiAgICAgICAgdGhpcy5jYXNlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlQ2FzZXMgPSBbXTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZmlsdGVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMudGVybXMgPSBbXTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnJhbmdlID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wX2VsZW1lbnRzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyVXBkYXRlKCkge1xyXG5cclxuICAgICAgICBsZXQgb3V0cHV0ID0gdGhpcy5jYXNlcy5zbGljZSgpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBsID0gdGhpcy5maWx0ZXJzLmxlbmd0aCwgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgb3V0cHV0ID0gdGhpcy5maWx0ZXJzW2ldLmZpbHRlcihvdXRwdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFjdGl2ZUNhc2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmFjdGl2ZUNhc2VzW2ldLmVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvdXRwdXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG91dHB1dFtpXS5lbGVtZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvdXRwdXQubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIG91dHB1dFtpXS50cmFuc2l0aW9uSW4oaSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aXZlQ2FzZXMgPSBvdXRwdXQ7XHJcbiAgICAgICAgLy9Tb3J0IGFuZCBmaWx0ZXIgdGhlIG91dHB1dCB0byBwcmVzZW50IHRoZSByZXN1bHRzIG9uIHNjcmVlbi5cclxuICAgIH1cclxuXHJcbiAgICBjdWxsKG5ld19pdGVtcykge1xyXG5cclxuICAgICAgICBpZiAobmV3X2l0ZW1zLmxlbmd0aCA9PSAwKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2FzZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tpXS5kZXN0cnVjdG9yKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhc2VzLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgZXhpc3RzID0gbmV3IE1hcChuZXdfaXRlbXMubWFwKGUgPT4gW2UsIHRydWVdKSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgb3V0ID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2FzZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgaWYgKCFleGlzdHMuaGFzKHRoaXMuY2FzZXNbaV0ubW9kZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tpXS5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXNlcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGV4aXN0cy5zZXQodGhpcy5jYXNlc1tpXS5tb2RlbCwgZmFsc2UpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGV4aXN0cy5mb3JFYWNoKCh2LCBrLCBtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodikgb3V0LnB1c2goayk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKG91dC5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRlZChvdXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2FkKG1vZGVsKSB7fVxyXG5cclxuICAgIHJlbW92ZWQoaXRlbXMpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gaXRlbXNbaV07XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY2FzZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBDYXNlID0gdGhpcy5jYXNlc1tqXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoQ2FzZS5tb2RlbCA9PSBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXNlcy5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQ2FzZS5kaXNzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmZpbHRlclVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZGVkKGl0ZW1zKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IENhc2UgPSB0aGlzLnRlbXBsYXRlc1swXS5mbGVzaChpdGVtc1tpXSk7XHJcbiAgICAgICAgICAgIENhc2UucGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5jYXNlcy5wdXNoKENhc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5maWx0ZXJVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXZpc2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FjaGUpXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMuY2FjaGUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRUZXJtcygpIHtcclxuXHJcbiAgICAgICAgbGV0IG91dF90ZXJtcyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVybXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICBvdXRfdGVybXMucHVzaCh0aGlzLnRlcm1zW2ldLnRlcm0pO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKG91dF90ZXJtcy5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfdGVybXM7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEsIElNUE9SVCA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEudG9Kc29uKCkpXHJcblxyXG4gICAgICAgIGxldCBjb250YWluZXIgPSBkYXRhLmdldENoYW5nZWQodGhpcy5wcm9wKTtcclxuXHJcbiAgICAgICAgaWYgKElNUE9SVCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IFVQREFURSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnRlcm1zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGVybXNbaV0udXBkYXRlKGRhdGEpKVxyXG4gICAgICAgICAgICAgICAgICAgIFVQREFURSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChVUERBVEUgJiYgdGhpcy5tb2RlbClcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VsbCh0aGlzLmdldCgpKVxyXG5cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5maWx0ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlcnNbaV0udXBkYXRlKGRhdGEpKVxyXG4gICAgICAgICAgICAgICAgICAgIFVQREFURSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpZiAoVVBEQVRFKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJVcGRhdGUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY29udGFpbmVyICYmIChjb250YWluZXIgaW5zdGFuY2VvZiBNb2RlbENvbnRhaW5lciB8fCBjb250YWluZXIuX19fX3NlbGZfX19fKSkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYWNoZSA9IGRhdGE7XHJcblxyXG4gICAgICAgICAgICBsZXQgb3duX2NvbnRhaW5lciA9IGNvbnRhaW5lci5nZXQodGhpcy5nZXRUZXJtcygpLCBudWxsKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvd25fY29udGFpbmVyIGluc3RhbmNlb2YgTW9kZWxDb250YWluZXIpIHtcclxuICAgICAgICAgICAgICAgIG93bl9jb250YWluZXIucGluKCk7XHJcbiAgICAgICAgICAgICAgICBvd25fY29udGFpbmVyLmFkZFZpZXcodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1bGwodGhpcy5nZXQoKSlcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvd25fY29udGFpbmVyIGluc3RhbmNlb2YgTUNBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdWxsKG93bl9jb250YWluZXIpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvd25fY29udGFpbmVyID0gZGF0YS5fX19fc2VsZl9fX18uZGF0YVt0aGlzLnByb3BdXHJcbiAgICAgICAgICAgICAgICBpZiAob3duX2NvbnRhaW5lciBpbnN0YW5jZW9mIE1vZGVsQ29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duX2NvbnRhaW5lci5hZGRWaWV3KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VsbCh0aGlzLmdldCgpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCgpIHtcclxuICAgICAgICBpZiAodGhpcy5tb2RlbCBpbnN0YW5jZW9mIE11bHRpSW5kZXhlZENvbnRhaW5lcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmRhdGEuaW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5ID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgcXVlcnlbaW5kZXhdID0gdGhpcy5nZXRUZXJtcygpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmdldChxdWVyeSlbaW5kZXhdO1xyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5vIGluZGV4IHZhbHVlIHByb3ZpZGVkIGZvciBNdWx0aUluZGV4ZWRDb250YWluZXIhXCIpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHNvdXJjZSA9IHRoaXMubW9kZWwuc291cmNlO1xyXG4gICAgICAgICAgICBsZXQgdGVybXMgPSB0aGlzLmdldFRlcm1zKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLmRlc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWwgPSBzb3VyY2UuZ2V0KHRlcm1zLCBudWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICBtb2RlbC5waW4oKTtcclxuICAgICAgICAgICAgICAgIG1vZGVsLmFkZFZpZXcodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmdldCh0ZXJtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uSW4oZWxlbWVudHMsIHd1cmwpIHtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fdGltZSA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMudGVtcGxhdGVzW2ldLnRyYW5zaXRpb25JbihlbGVtZW50cywgd3VybCkpO1xyXG5cclxuICAgICAgICBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHN1cGVyLnRyYW5zaXRpb25JbigpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25fdGltZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBUYWtlcyBhcyBhbiBpbnB1dCBhIGxpc3Qgb2YgdHJhbnNpdGlvbiBvYmplY3RzIHRoYXQgY2FuIGJlIHVzZWRcclxuICAgICovXHJcbiAgICB0cmFuc2l0aW9uT3V0KHRyYW5zaXRpb25fdGltZSA9IDAsIERFU1RST1kgPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVtcGxhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCB0aGlzLnRlbXBsYXRlc1tpXS50cmFuc2l0aW9uT3V0KCkpO1xyXG5cclxuICAgICAgICBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHN1cGVyLnRyYW5zaXRpb25PdXQodHJhbnNpdGlvbl90aW1lLCBERVNUUk9ZKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uX3RpbWU7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgQ2FzZVRlbXBsYXRlXHJcbn0iLCJpbXBvcnQge1xyXG4gICAgTGV4XHJcbn0gZnJvbSBcIi4uL2NvbW1vblwiXHJcblxyXG5jbGFzcyBJbmRleGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLmxleGVyID0gbmV3IExleChlbGVtZW50LmlubmVySFRNTCk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLnN0YWNrID0gW107XHJcbiAgICAgICAgdGhpcy5zcCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KGluZGV4LCBSRURPID0gZmFsc2UpIHtcclxuICAgICAgICBsZXQgbGV4ID0gdGhpcy5sZXhlcjtcclxuXHJcbiAgICAgICAgaWYgKFJFRE8pIHtcclxuICAgICAgICAgICAgbGV4LnJlc2V0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhY2subGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgdGhpcy5zcCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgICAgICBpZiAoIWxleC50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoUkVETylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoaW5kZXgsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKGxleC50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiPFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZXgucGVlaygpLnRleHQgPT0gXCIvXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gPFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpOyAvLyAvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7IC8vIHRhZ25hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigtLXRoaXMuc3AgPCAwKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5sZW5ndGggPSB0aGlzLnNwICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFja1t0aGlzLnNwXSsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7IC8vIDxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gdGFnbmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAobGV4LnRleHQgIT09IFwiPlwiICYmIGxleC50ZXh0ICE9PSBcIi9cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gYXR0cmliIG5hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZXgudGV4dCA9PSBcIj1cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobGV4Lm5leHQoKSwgbGV4Lm5leHQoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGV4LnRleHQgPT0gXCIvXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCkgLy8gLyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCkgLy8gPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuc3RhY2sucHVzaCgwKSwgdGhpcy5zcCsrKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxleC50ZXh0ID09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxleC50ZXh0ID09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGV4LnRleHQgPT0gXCI6XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxleC50eXBlID09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBudW1iZXIgPSBwYXJzZUludChsZXgudGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVtYmVyID09IGluZGV4KSByZXR1cm4gdGhpcy5nZXRFbGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRFbGVtZW50KCkge1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zcDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LmNoaWxkcmVuW3RoaXMuc3RhY2tbaV1dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxufVxyXG5cclxuLypcclxuICAgIENhc2Ugc2tlbGV0b25cclxuICAgICAgICBNb2RlbCBwb2ludGVyIE9SIHNjaGVtYSBwb2ludGVyXHJcbiAgICAgICAgICAgIElGIHNjaGVtYSwgdGhlbiB0aGUgc2tlbGV0b24gd2lsbCBjcmVhdGUgYSBuZXcgTW9kZWwgd2hlbiBpdCBpcyBjb3BpZWQsIFVOTEVTUyBhIG1vZGVsIGlzIGdpdmVuIHRvIHRoZSBza2VsZXRvbiBjb3B5IENvbnN0cnVjdG9yLiBcclxuICAgICAgICAgICAgT3RoZXIgd2lzZSwgdGhlIHNrZWxldG9uIHdpbGwgYXV0b21hdGljYWxseSBhc3NpZ24gdGhlIE1vZGVsIHRvIHRoZSBjYXNlIG9iamVjdC4gXHJcblxyXG4gICAgICAgIFRoZSBtb2RlbCB3aWxsIGF1dG9tYXRpY2FsbHkgY29weSBpdCdzIGVsZW1lbnQgZGF0YSBpbnRvIHRoZSBjb3B5LCB6aXBwaW5nIHRoZSBkYXRhIGRvd24gYXMgdGhlIENvbnN0cnVjdG9yIGJ1aWxkcyB0aGUgQ2FzZSdzIGNoaWxkcmVuLlxyXG5cclxuKi9cclxuZXhwb3J0IGNsYXNzIENhc2VTa2VsZXRvbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgY29uc3RydWN0b3IsIGRhdGEsIHByZXNldHMsIGluZGV4KSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLkNvbnN0cnVjdG9yID0gY29uc3RydWN0b3I7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0gW107XHJcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy50ZXJtcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5wcmVzZXRzID0gcHJlc2V0cztcclxuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICBcclxuICAgICovXHJcbiAgICBmbGVzaChNb2RlbCA9IG51bGwpIHtcclxuICAgICAgICBsZXQgQ2FzZSA9IHRoaXMuX19fX2NvcHlfX19fKG51bGwsIG51bGwsIG51bGwpO1xyXG5cclxuICAgICAgICBDYXNlLmxvYWQoTW9kZWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gQ2FzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBDb25zdHJ1Y3RzIGEgbmV3IG9iamVjdCwgYXR0YWNoaW5nIHRvIGVsZW1lbnRzIGhvc3RlZCBieSBhIGNhc2UuIElmIHRoZSBjb21wb25lbnQgdG8gY29uc3RydWN0IGlzIGEgQ2FzZSwgdGhlbiB0aGUgXHJcbiAgICAgICAgcGFyZW50X2VsZW1lbnQgZ2V0cyBzd2FwcGVkIG91dCBieSBhIGNsb25lZCBlbGVtZW50IHRoYXQgaXMgaG9zdGVkIGJ5IHRoZSBuZXdseSBjb25zdHJ1Y3RlZCBDYXNlLlxyXG4gICAgKi9cclxuICAgIF9fX19jb3B5X19fXyhwYXJlbnRfZWxlbWVudCwgcGFyZW50LCBpbmRleGVyKSB7XHJcblxyXG4gICAgICAgIGxldCBlbGVtZW50LCBDTEFJTUVEX0VMRU1FTlQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBpbmRleGVyLmdldCh0aGlzLmluZGV4KVxyXG4gICAgICAgICAgICBDTEFJTUVEX0VMRU1FTlQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudCkge1xyXG4gICAgICAgICAgICBwYXJlbnRfZWxlbWVudCA9IHRoaXMuZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50X2VsZW1lbnQucGFyZW50RWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50X2VsZW1lbnQucGFyZW50RWxlbWVudC5yZXBsYWNlTm9kZShwYXJlbnRfZWxlbWVudCwgZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBpbmRleGVyID0gbmV3IEluZGV4ZXIocGFyZW50X2VsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG91dF9vYmplY3Q7XHJcbiAgICAgICAgaWYgKHRoaXMuQ29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgb3V0X29iamVjdCA9IG5ldyB0aGlzLkNvbnN0cnVjdG9yKHBhcmVudCwgdGhpcy5kYXRhLCB0aGlzLnByZXNldHMpO1xyXG4gICAgICAgICAgICBpZiAoQ0xBSU1FRF9FTEVNRU5UKVxyXG4gICAgICAgICAgICAgICAgb3V0X29iamVjdC5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICB9IGVsc2UgaWYgKCFwYXJlbnQpIHtcclxuICAgICAgICAgICAgb3V0X29iamVjdCA9IHRoaXMuY2hpbGRyZW5bMF0uX19fX2NvcHlfX19fKHBhcmVudF9lbGVtZW50LCBudWxsLCBpbmRleGVyKTtcclxuICAgICAgICAgICAgb3V0X29iamVjdC5lbGVtZW50ID0gcGFyZW50X2VsZW1lbnQ7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXRfb2JqZWN0O1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBvdXRfb2JqZWN0ID0gcGFyZW50O1xyXG5cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uX19fX2NvcHlfX19fKHBhcmVudF9lbGVtZW50LCBvdXRfb2JqZWN0LCBpbmRleGVyKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudGVtcGxhdGVzLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRlcm1zLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMudGVybXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgIG91dF9vYmplY3QudGVybXMucHVzaCh0aGlzLnRlcm1zW2ldLl9fX19jb3B5X19fXyhwYXJlbnRfZWxlbWVudCwgbnVsbCwgaW5kZXhlcikpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZmlsdGVycy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgIG91dF9vYmplY3QuZmlsdGVycy5wdXNoKHRoaXMuZmlsdGVyc1tpXS5fX19fY29weV9fX18ocGFyZW50X2VsZW1lbnQsIG51bGwsIGluZGV4ZXIpKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgb3V0X29iamVjdC50ZW1wbGF0ZXMucHVzaCh0aGlzLnRlbXBsYXRlc1tpXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0X29iamVjdDtcclxuICAgIH1cclxufSIsImxldCBHTE9CQUwgPSAoKCk9PntcclxuXHRsZXQgbGlua2VyID0gbnVsbDtcclxuXHRyZXR1cm4ge1xyXG5cdFx0Z2V0IGxpbmtlcigpe1xyXG5cdFx0XHRyZXR1cm4gbGlua2VyO1xyXG5cdFx0fSxcclxuXHRcdHNldCBsaW5rZXIobCl7XHJcblx0XHRcdGlmKCFsaW5rZXIpXHJcblx0XHRcdFx0bGlua2VyID0gbDtcclxuXHRcdH1cclxuXHR9XHJcbn0pXHJcblxyXG5leHBvcnQge0dMT0JBTH0iLCJpbXBvcnQge1xyXG4gICAgQ2Fzc2V0dGVcclxufSBmcm9tIFwiLi9jYXNzZXR0ZVwiXHJcblxyXG5jbGFzcyBJbnB1dCBleHRlbmRzIENhc3NldHRlIHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgZWxlbWVudCwgZCwgcCkge1xyXG4gICAgICAgIC8vU2NhbiB0aGUgZWxlbWVudCBhbmQgbG9vayBmb3IgaW5wdXRzIHRoYXQgY2FuIGJlIG1hcHBlZCB0byB0aGVcclxuICAgICAgICBzdXBlcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApO1xyXG5cclxuICAgICAgICAvL0lucHV0cyBpbiBmb3JtcyBhcmUgYXV0b21hdGljYWxseSBoaWRkZW4uXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0ge31cclxuICAgICAgICAgICAgZGF0YVt0aGlzLnByb3BdID0gdGhpcy5lbGVtZW50LnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmFkZChkYXRhKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkYXRhKSB7XHJcblxyXG4gICAgICAgIGlmICghZGF0YVt0aGlzLnByb3BdKSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMudmFsID0gZGF0YVt0aGlzLnByb3BdO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKHRoaXMuZWxlbWVudC50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJkYXRlXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudmFsdWUgPSAobmV3IERhdGUocGFyc2VJbnQoZGF0YVt0aGlzLnByb3BdKSkpLnRvSVNPU3RyaW5nKCkuc3BsaXQoXCJUXCIpWzBdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0aW1lXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudmFsdWUgPSBgJHsoXCIwMFwiKyhkYXRhW3RoaXMucHJvcF0gfCAwKSkuc2xpY2UoLTIpfTokeyhcIjAwXCIrKChkYXRhW3RoaXMucHJvcF0lMSkqNjApKS5zbGljZSgtMil9OjAwLjAwMGA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInRleHRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC52YWx1ZSA9IChkYXRhW3RoaXMucHJvcF0gIT0gdW5kZWZpbmVkKSA/IGRhdGFbdGhpcy5wcm9wXSA6IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdCA9IHRoaXMuZWxlbWVudC5jbGFzc0xpc3RbMF07XHJcblxyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm1vZHVsb190aW1lXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aW1lID0gZGF0YVt0aGlzLnByb3BdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgSVNfUE0gPSAodGltZSAvIDEyID4gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtaW51dGVzID0gKCh0aW1lICUgMSkgKiA2MCkgfCAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaG91cnMgPSAoKCh0aW1lIHwgMCkgJSAxMikgIT0gMCkgPyAodGltZSB8IDApICUgMTIgOiAxMjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC52YWx1ZSA9IChob3VycyArIFwiOlwiICsgKFwiMFwiICsgbWludXRlcykuc2xpY2UoLTIpKSArICgoSVNfUE0pID8gXCIgUE1cIiA6IFwiIEFNXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnZhbHVlID0gKGRhdGFbdGhpcy5wcm9wXSAhPSB1bmRlZmluZWQpID8gZGF0YVt0aGlzLnByb3BdIDogXCJcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIElucHV0XHJcbn0iLCJpbXBvcnQge1xyXG4gICAgR0xPQkFMXHJcbn0gZnJvbSBcIi4uLy4uL2dsb2JhbFwiXHJcbmltcG9ydCB7XHJcbiAgICBJbnB1dFxyXG59IGZyb20gXCIuL2lucHV0XCJcclxuaW1wb3J0IHtcclxuICAgIENhc3NldHRlXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGVcIlxyXG5cclxuY2xhc3MgRm9ybSBleHRlbmRzIENhc3NldHRlIHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgZWxlbWVudCwgZCwgcCkge1xyXG4gICAgICAgIC8vU2NhbiB0aGUgZWxlbWVudCBhbmQgbG9vayBmb3IgaW5wdXRzIHRoYXQgY2FuIGJlIG1hcHBlZCB0byB0aGUgXHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBlbGVtZW50LCBkLCBwKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdWJtaXR0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNjaGVtYSA9IG51bGw7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlLnRhcmdldCwgdGhpcywgcGFyZW50KVxyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN1Ym1pdHRlZClcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VibWl0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhY2NlcHRlZChyZXN1bHQpIHtcclxuICAgICAgICByZXN1bHQudGV4dCgpLnRoZW4oKGUpID0+IHtcclxuICAgICAgICAgICAgZGVidWdnZXJcclxuICAgICAgICAgICAgR0xPQkFMLmxpbmtlci5sb2FkUGFnZShcclxuICAgICAgICAgICAgICAgIEdMT0JBTC5saW5rZXIubG9hZE5ld1BhZ2UocmVzdWx0LnVybCwgKG5ldyBET01QYXJzZXIoKSkucGFyc2VGcm9tU3RyaW5nKGUsIFwidGV4dC9odG1sXCIpKSxcclxuICAgICAgICAgICAgICAgIGZhbHNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZWplY3RlZChyZXN1bHQpIHtcclxuICAgICAgICByZXN1bHQudGV4dCgpLnRoZW4oKGUpID0+IHtcclxuICAgICAgICAgICAgZGVidWdnZXJcclxuICAgICAgICAgICAgR0xPQkFMLmxpbmtlci5sb2FkUGFnZShcclxuICAgICAgICAgICAgICAgIEdMT0JBTC5saW5rZXIubG9hZE5ld1BhZ2UocmVzdWx0LnVybCwgKG5ldyBET01QYXJzZXIoKSkucGFyc2VGcm9tU3RyaW5nKGUsIFwidGV4dC9odG1sXCIpKSxcclxuICAgICAgICAgICAgICAgIGZhbHNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBsb2FkKG1vZGVsKSB7XHJcblxyXG4gICAgICAgIGlmIChtb2RlbClcclxuICAgICAgICAgICAgdGhpcy5zY2hlbWEgPSBtb2RlbC5zY2hlbWE7XHJcblxyXG4gICAgICAgIHN1cGVyLmxvYWQobW9kZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkYXRhKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN1Ym1pdCgpIHtcclxuXHJcbiAgICAgICAgbGV0IHVybCA9IHRoaXMuZWxlbWVudC5hY3Rpb247XHJcblxyXG4gICAgICAgIHZhciBmb3JtX2RhdGEgPSAobmV3IEZvcm1EYXRhKHRoaXMuZWxlbWVudCkpO1xyXG4gICAgICAgIGlmICh0aGlzLnNjaGVtYSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIElucHV0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBjaGlsZC5lbGVtZW50Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3AgPSBjaGlsZC5wcm9wO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzY2hlbWUgPSB0aGlzLnNjaGVtYVtwcm9wXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2NoZW1lICYmIHByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbCA9IHNjaGVtZS5zdHJpbmcoY2hpbGQudmFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybV9kYXRhLnNldChuYW1lLCB2YWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByb3AsIG5hbWUsIHZhbCwgY2hpbGQudmFsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlYnVnZ2VyXHJcbiAgICAgICAgZmV0Y2godXJsLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXHJcbiAgICAgICAgICAgIGJvZHk6IGZvcm1fZGF0YSxcclxuICAgICAgICB9KS50aGVuKChyZXN1bHQpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzICE9IDIwMClcclxuICAgICAgICAgICAgICAgIHRoaXMucmVqZWN0ZWQocmVzdWx0KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hY2NlcHRlZChyZXN1bHQpXHJcblxyXG4gICAgICAgIH0pLmNhdGNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVqZWN0ZWQoZSk7XHJcbiAgICAgICAgfSlcclxuXHJcblxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIldpY2sgRm9ybSBTdWJtaXR0ZWRcIiwgdXJsLCBmb3JtX2RhdGEpXHJcblxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIEZvcm1cclxufSIsImltcG9ydCB7XHJcbiAgICBSaXZldFxyXG59IGZyb20gXCIuLi9yaXZldFwiXHJcbmV4cG9ydCBjbGFzcyBUYXAgZXh0ZW5kcyBSaXZldCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBkYXRhLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBkYXRhLCBwcmVzZXRzKTtcclxuICAgICAgICB0aGlzLnByb3AgPSBkYXRhLnByb3A7XHJcbiAgICB9XHJcblxyXG4gICAgZG93bihkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMgPSBudWxsLCBpbXBvcnRlZCkge1xyXG4gICAgICAgIGlmIChjaGFuZ2VkX3Byb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGFuZ2VkX3Byb3BlcnRpZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdlZF9wcm9wZXJ0aWVzW2ldID09IHRoaXMucHJvcClcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVt0aGlzLnByb3BdICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBkYXRhW3RoaXMucHJvcF0gfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpID09IGwgLSAxKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGRhdGFbdGhpcy5wcm9wXSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IGRhdGFbdGhpcy5wcm9wXSB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFNlZSBEZWZpbml0aW9uIGluIFJpdmV0IFxyXG4gIFx0Ki9cclxuICAgIF9fZG93bl9fKGRhdGEsIGNoYW5nZWRfcHJvcGVydGllcyA9IG51bGwsIElNUE9SVEVEID0gZmFsc2UpIHtcclxuICAgICAgICBsZXQgcl92YWwgPSB0aGlzLmRvd24oZGF0YSwgY2hhbmdlZF9wcm9wZXJ0aWVzLCBJTVBPUlRFRCk7XHJcbiAgICAgICAgaWYgKHJfdmFsKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5fX2Rvd25fXyhyX3ZhbCwgW3RoaXMucHJvcF0sIElNUE9SVEVEKTtcclxuICAgIH1cclxuXHJcbiAgICB1cChkYXRhKSB7XHJcblxyXG4gICAgICAgIGlmIChkYXRhLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV0IG91dCA9IHt9O1xyXG4gICAgICAgICAgICBvdXRbdGhpcy5wcm9wXSA9IGRhdGEudmFsdWU7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufSIsImltcG9ydCB7XHJcbiAgICBSaXZldFxyXG59IGZyb20gXCIuLi9yaXZldFwiXHJcbmV4cG9ydCBjbGFzcyBQaXBlIGV4dGVuZHMgUml2ZXQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgZGF0YSwgcHJlc2V0cykge1xyXG4gICAgICAgIHN1cGVyKHBhcmVudCwgZGF0YSwgcHJlc2V0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgZG93bihkYXRhKXtcclxuICAgIFx0cmV0dXJuIHt2YWx1ZTpgPGI+JHtkYXRhLnZhbHVlfTwvYj5gfVxyXG4gICAgfVxyXG59XHJcblxyXG5QaXBlLkFERFNfVEFHUyA9IHRydWU7XHJcblBpcGUuQ0FOX0JFX1NUQVRJQyA9IHRydWU7IiwiaW1wb3J0IHtcclxuICAgIFJpdmV0XHJcbn0gZnJvbSBcIi4uL3JpdmV0XCJcclxuXHJcbmV4cG9ydCBjbGFzcyBJTyBleHRlbmRzIFJpdmV0e1xyXG5cdGNvbnN0cnVjdG9yKHBhcmVudCwgZGF0YSwgcHJlc2V0cyl7XHJcblx0XHRzdXBlcihwYXJlbnQsIGRhdGEsIHByZXNldHMpXHJcblx0XHR0aGlzLnByb3AgPSBkYXRhLnByb3BcclxuXHR9XHJcblxyXG5cdGRvd24oZGF0YSl7XHJcblx0XHRjb25zb2xlLmxvZyhkYXRhKVxyXG5cdFx0dGhpcy5lbGVtZW50LmlubmVySFRNTCA9IGRhdGEudmFsdWU7XHJcblx0fVxyXG59IiwiLypcclxuICAgIEJvcmluZyBDYXNlIHN0dWZmXHJcbiovXHJcbmltcG9ydCB7XHJcbiAgICBDYXNlLFxyXG59IGZyb20gXCIuL2Nhc2VcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIENhc2VUZW1wbGF0ZVxyXG59IGZyb20gXCIuL2Nhc2VfdGVtcGxhdGVcIlxyXG5pbXBvcnQge1xyXG4gICAgQ2FzZVNrZWxldG9uXHJcbn0gZnJvbSBcIi4vY2FzZV9za2VsZXRvblwiXHJcbi8qIFxyXG4gICAgQ2Fzc2V0dGVzXHJcbiovXHJcbmltcG9ydCB7XHJcbiAgICBGaWx0ZXJMaW1pdFxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2ZpbHRlcl9saW1pdFwiXHJcbmltcG9ydCB7XHJcbiAgICBDYXNzZXR0ZSxcclxuICAgIENsb3NlQ2Fzc2V0dGVcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9jYXNzZXR0ZVwiXHJcbmltcG9ydCB7XHJcbiAgICBGb3JtXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZm9ybVwiXHJcbmltcG9ydCB7XHJcbiAgICBJbnB1dFxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2lucHV0XCJcclxuaW1wb3J0IHtcclxuICAgIEZpbHRlclxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2ZpbHRlclwiXHJcbmltcG9ydCB7XHJcbiAgICBUZXJtXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvdGVybVwiXHJcbmltcG9ydCB7XHJcbiAgICBFeHBvcnRlclxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2V4cG9ydGVyXCJcclxuaW1wb3J0IHtcclxuICAgIEltcG9ydFF1ZXJ5XHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvaW1wb3J0X3F1ZXJ5XCJcclxuaW1wb3J0IHtcclxuICAgIERhdGFFZGl0XHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZGF0YV9lZGl0XCJcclxuaW1wb3J0IHtcclxuICAgIEV4aXN0cyxcclxuICAgIE5vdEV4aXN0c1xyXG59IGZyb20gXCIuL2Nhc3NldHRlL2V4aXN0c1wiXHJcbmltcG9ydCB7XHJcbiAgICBFcG9jaERheSxcclxuICAgIEVwb2NoVGltZSxcclxuICAgIEVwb2NoRGF0ZSxcclxuICAgIEVwb2NoTW9udGgsXHJcbiAgICBFcG9jaFllYXIsXHJcbiAgICBFcG9jaFRvRGF0ZVRpbWVcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9lcG9jaFwiXHJcblxyXG5sZXQgUHJlc2V0Q2Fzc2V0dGVzID0ge1xyXG4gICAgcmF3OiBDYXNzZXR0ZSxcclxuICAgIGNhc3NldHRlOiBDYXNzZXR0ZSxcclxuICAgIGZvcm06IEZvcm0sXHJcbiAgICBpbnB1dDogSW5wdXQsXHJcbiAgICBleHBvcnQ6IEV4cG9ydGVyLFxyXG4gICAgaXF1ZXJ5OiBJbXBvcnRRdWVyeSxcclxuICAgIGVkdDogRXBvY2hUb0RhdGVUaW1lLFxyXG4gICAgZXRpbWU6IEVwb2NoVGltZSxcclxuICAgIGVkYXk6IEVwb2NoRGF5LFxyXG4gICAgZWRhdGU6IEVwb2NoRGF0ZSxcclxuICAgIGV5ZWFyOiBFcG9jaFllYXIsXHJcbiAgICBlbW9udGg6IEVwb2NoTW9udGgsXHJcbiAgICBleGlzdHM6IEV4aXN0cyxcclxuICAgIG5vdF9leGlzdHM6IE5vdEV4aXN0cyxcclxuICAgIGRhdGFfZWRpdDogRGF0YUVkaXQsXHJcbiAgICB0ZXJtOiBUZXJtLFxyXG4gICAgbGltaXQ6IEZpbHRlckxpbWl0XHJcbn1cclxuXHJcbmltcG9ydCB7IFRhcCB9IGZyb20gXCIuL3RhcHMvdGFwXCJcclxuaW1wb3J0IHsgUGlwZSB9IGZyb20gXCIuL3BpcGVzL3BpcGVcIlxyXG5pbXBvcnQgeyBJTyB9IGZyb20gXCIuL2lvL2lvXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBSb290IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMudGFnX2luZGV4ID0gMTtcclxuICAgIH07XHJcblxyXG4gICAgYWRkQ2hpbGQoY2hpbGQpIHtcclxuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0U2tlbGV0b24ocHJlc2V0cykge1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy5odG1sO1xyXG4gICAgICAgIGxldCByb290X3NrZWxldG9uID0gbmV3IENhc2VTa2VsZXRvbihlbGVtZW50KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLmNvbnN0cnVjdFNrZWxldG9uKHJvb3Rfc2tlbGV0b24sIHByZXNldHMpO1xyXG4gICAgICAgIHJldHVybiByb290X3NrZWxldG9uO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEluZGV4KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRhZ19pbmRleCsrO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogdGhpcy5jaGlsZHJlbixcclxuICAgICAgICAgICAgaHRtbDogdGhpcy5odG1sXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9mZnNldChpbmNyZWFzZSA9IDApIHtcclxuICAgICAgICBsZXQgb3V0ID0gdGhpcy50YWdfY291bnQ7XHJcbiAgICAgICAgdGhpcy50YWdfY291bnQgKz0gaW5jcmVhc2U7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEdlbmVyaWNOb2RlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpIHtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy50YWduYW1lID0gdGFnbmFtZTtcclxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzIHx8IHt9O1xyXG4gICAgICAgIHRoaXMuSVNfTlVMTCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuQ09OU1VNRVNfVEFHID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLkNPTlNVTUVTX1NBTUUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgdGhpcy5wcm9wX25hbWUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5vcGVuX3RhZyA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jbG9zZV90YWcgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMudGFnX2luZGV4ID0gMDtcclxuICAgICAgICB0aGlzLmluZGV4ID0gMDtcclxuICAgICAgICBpZiAocGFyZW50KVxyXG4gICAgICAgICAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcyk7XHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgZmluYWxpemUoY3R4KSB7XHJcbiAgICAgICAgY3R4Lmh0bWwgKz0gdGhpcy5vcGVuX3RhZyArIHRoaXMuaHRtbCArIHRoaXMuY2xvc2VfdGFnO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcGxhY2VDaGlsZChjaGlsZCwgbmV3X2NoaWxkKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGlsZHJlbltpXSA9PSBjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXSA9IG5ld19jaGlsZDtcclxuICAgICAgICAgICAgICAgIG5ld19jaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQ2hpbGQoY2hpbGQpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoaWxkcmVuW2ldID09IGNoaWxkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZENoaWxkKGNoaWxkKSB7XHJcblxyXG4gICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFRhcE5vZGUgJiYgISh0aGlzIGluc3RhbmNlb2YgQ2FzZU5vZGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5hZGRDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VBdHRyaWJ1dGVzKCkge1xyXG4gICAgICAgIGxldCBvdXQgPSB7fTtcclxuICAgICAgICBvdXQucHJvcCA9IHRoaXMucHJvcF9uYW1lO1xyXG4gICAgICAgIHRoaXMuYXR0cmlidXRlcztcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFByb3AobGV4ZXIsIHByb3BfbmFtZSwgcGFyc2VGdW5jdGlvbiwgcHJlc2V0cykge1xyXG4gICAgICAgIGlmICh0aGlzLnByb3BfbmFtZSAhPT0gcHJvcF9uYW1lKVxyXG4gICAgICAgICAgICB0aGlzLnNwbGl0KG5ldyBJT05vZGUocHJvcF9uYW1lLCB0aGlzLmF0dHJpYnV0ZXMsIG51bGwsIHRoaXMsIHRoaXMuZ2V0SW5kZXgoKSksIHByb3BfbmFtZSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBuZXcgSU9Ob2RlKHByb3BfbmFtZSwgdGhpcy5hdHRyaWJ1dGVzLCB0aGlzLCB0aGlzLCB0aGlzLmdldEluZGV4KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogdGhpcy5jaGlsZHJlbixcclxuICAgICAgICAgICAgdGFnbmFtZTogdGhpcy50YWduYW1lLFxyXG4gICAgICAgICAgICB0YWdfY291bnQ6IHRoaXMudGFnX2NvdW50LFxyXG4gICAgICAgICAgICB0YWc6IHsgb3Blbl90YWc6IHRoaXMub3Blbl90YWcsIGNsb3NlX3RhZzogdGhpcy5jbG9zZV90YWcgfSxcclxuICAgICAgICAgICAgaHRtbDogdGhpcy5odG1sLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzcGxpdChub2RlLCBwcm9wX25hbWUpIHtcclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wX25hbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wX25hbWUgPT0gdGhpcy5wcm9wX25hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgciA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMudGFnbmFtZSwgdGhpcy5hdHRyaWJ1dGVzLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICByLkNPTlNVTUVTX1NBTUUgPSAoci5DT05TVU1FU19UQUcpID8gKCEoci5DT05TVU1FU19UQUcgPSAhMSkpIDogITE7XHJcbiAgICAgICAgICAgICAgICAgICAgci5wcm9wX25hbWUgPSBwcm9wX25hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgci5hZGRDaGlsZChub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuc3BsaXQociwgcHJvcF9uYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BfbmFtZSA9IHByb3BfbmFtZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnNwbGl0KHRoaXMsIHByb3BfbmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlclxyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wX25hbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wX25hbWUgPT0gdGhpcy5wcm9wX25hbWUpIHt9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy50YWduYW1lLCB0aGlzLmF0dHJpYnV0ZXMsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHIucHJvcF9uYW1lID0gcHJvcF9uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5zcGxpdChyLCBwcm9wX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuc3BsaXQodGhpcywgcHJvcF9uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgZ2V0SW5kZXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy50YWdfaW5kZXggPiAwKSByZXR1cm4gdGhpcy50YWdfaW5kZXgrKztcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHJldHVybiB0aGlzLnBhcmVudC5nZXRJbmRleCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdFNrZWxldG9uKHBhcmVudF9za2VsZXRvbiwgcHJlc2V0cykge1xyXG5cclxuICAgICAgICBsZXQgc2tlbGV0b24gPSB0aGlzLmNyZWF0ZVNrZWxldG9uQ29uc3RydWN0b3IocHJlc2V0cyk7XHJcblxyXG4gICAgICAgIHBhcmVudF9za2VsZXRvbi5jaGlsZHJlbi5wdXNoKHNrZWxldG9uKVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uY29uc3RydWN0U2tlbGV0b24oc2tlbGV0b24sIHByZXNldHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVNrZWxldG9uQ29uc3RydWN0b3IocHJlc2V0cykge1xyXG4gICAgICAgIGxldCBza2VsZXRvbiA9IG5ldyBDYXNlU2tlbGV0b24odGhpcy5nZXRFbGVtZW50KCksIHRoaXMuZ2V0Q29uc3RydWN0b3IocHJlc2V0cyksIHRoaXMucGFyc2VBdHRyaWJ1dGVzKCksIHByZXNldHMsIHRoaXMuaW5kZXgpO1xyXG4gICAgICAgIHJldHVybiBza2VsZXRvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFbGVtZW50KCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FzZU5vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpIHtcclxuICAgICAgICBzdXBlcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmaW5hbGl6ZShjdHgpIHtcclxuICAgICAgICBjdHguaHRtbCArPSB0aGlzLmh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUHJvcChsZXhlciwgcHJvcF9uYW1lLCBwYXJzZUZ1bmN0aW9uLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgaWYgKGxleGVyLnRleHQgPT0gXCIoXCIgJiYgbGV4ZXIucGVlaygpLnRleHQgPT0gXCIoXCIpIHtcclxuICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiKFwiKTtcclxuICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiKFwiKTtcclxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gbmV3IFRlbXBsYXRlTm9kZShcImxpc3RcIiwgdGhpcy5hdHRyaWJ1dGVzLCB0aGlzLCB0aGlzKTtcclxuICAgICAgICAgICAgdGVtcGxhdGUucGFyc2UobGV4ZXIsIHBhcnNlRnVuY3Rpb24sIHByZXNldHMpO1xyXG4gICAgICAgICAgICBsZXhlci5hc3NlcnQoXCIpXCIpO1xyXG4gICAgICAgICAgICBsZXQgb3V0ID0gbGV4ZXIucG9zICsgMTtcclxuICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiKVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgcmV0dXJuIENhc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQobm9kZSwgcHJvcF9uYW1lKSB7XHJcbiAgICAgICAgaWYgKG5vZGUpIHRoaXMuYWRkQ2hpbGQobm9kZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZU5vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQsIGN0eCkge1xyXG4gICAgICAgIHN1cGVyKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuZ2V0SW5kZXgoKTtcclxuICAgICAgICBjdHguaHRtbCArPSBgPGxpc3Q+IyM6JHt0aGlzLmluZGV4fTwvbGlzdD5gXHJcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy50ZXJtcyA9IFtdO1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0gW107XHJcbiAgICB9O1xyXG5cclxuICAgIGFkZENoaWxkKGNoaWxkKSB7XHJcbiAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgRmlsdGVyTm9kZSlcclxuICAgICAgICAgICAgdGhpcy5maWx0ZXJzLnB1c2goY2hpbGQpO1xyXG4gICAgICAgIGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgVGVybU5vZGUpXHJcbiAgICAgICAgICAgIHRoaXMudGVybXMucHVzaChjaGlsZCk7XHJcbiAgICAgICAgZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBDYXNlTm9kZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXMubGVuZ3RoID4gMCkgdGhyb3cgbmV3IEVycm9yKFwiT25seSBvbmUgQ2FzZSBhbGxvd2VkIGluIGEgVGVtcGxhdGUuXCIpO1xyXG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlcy5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgICAgY2hpbGQudGFnX2luZGV4ID0gMTtcclxuICAgICAgICAgICAgdGhpcy5odG1sID0gY2hpbGQuaHRtbDtcclxuICAgICAgICB9IGVsc2UgdGhyb3cgbmV3IEVycm9yKFwiVGVtcGxhdGVzIG9ubHkgc3VwcG9ydCBGaWx0ZXIsIFRlcm0gb3IgQ2FzZSBlbGVtZW50cy5cIilcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RTa2VsZXRvbihwYXJlbnRfc2tlbGV0b24sIHByZXNldHMpIHtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLmh0bWw7XHJcbiAgICAgICAgbGV0IHNrZWxldG9uID0gbmV3IENhc2VTa2VsZXRvbih0aGlzLmdldEVsZW1lbnQoKSwgQ2FzZVRlbXBsYXRlLCB0aGlzLnBhcnNlQXR0cmlidXRlcygpLCBwcmVzZXRzLCB0aGlzLmluZGV4KTtcclxuICAgICAgICBza2VsZXRvbi5maWx0ZXJzID0gdGhpcy5maWx0ZXJzLm1hcCgoZmlsdGVyKSA9PiBmaWx0ZXIuY3JlYXRlU2tlbGV0b25Db25zdHJ1Y3RvcihwcmVzZXRzKSlcclxuICAgICAgICBza2VsZXRvbi50ZXJtcyA9IHRoaXMudGVybXMubWFwKCh0ZXJtKSA9PiB0ZXJtLmNyZWF0ZVNrZWxldG9uQ29uc3RydWN0b3IocHJlc2V0cykpXHJcbiAgICAgICAgc2tlbGV0b24udGVtcGxhdGVzID0gdGhpcy50ZW1wbGF0ZXMubWFwKCh0ZW1wbGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2tsID0gdGVtcGxhdGUuY3JlYXRlU2tlbGV0b25Db25zdHJ1Y3RvcihwcmVzZXRzKTtcclxuICAgICAgICAgICAgc2tsLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgICAgICByZXR1cm4gc2tsO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcGFyZW50X3NrZWxldG9uLmNoaWxkcmVuLnB1c2goc2tlbGV0b24pXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RWxlbWVudCgpIHtcclxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpc3RcIik7XHJcbiAgICAgICAgcmV0dXJuIGRpdjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQcm9wKGxleGVyLCBwcm9wX25hbWUsIHBhcnNlRnVuY3Rpb24sIHByZXNldHMpIHtcclxuICAgICAgICAvL2N0eC5odG1sICs9IHByb3BfbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZShsZXhlciwgcGFyc2VGdW5jdGlvbiwgcHJlc2V0cykge1xyXG4gICAgICAgIGxldCBjdHggPSB7IGh0bWw6IFwiXCIgfTtcclxuICAgICAgICBsZXQgcm9vdCA9IG5ldyBSb290KCk7XHJcbiAgICAgICAgd2hpbGUgKGxleGVyLnRleHQgIT09IFwiKVwiICYmIGxleGVyLnBlZWsoKS50ZXh0ICE9PSBcIilcIikge1xyXG4gICAgICAgICAgICBpZiAoIWxleGVyLnRleHQpIHRocm93IG5ldyBFcnJvcihcIlVuZXhwZWN0ZWQgZW5kIG9mIE91dHB1dC4gTWlzc2luZyAnKSknIFwiKTtcclxuICAgICAgICAgICAgbGV0IG91dCA9IHBhcnNlRnVuY3Rpb24obGV4ZXIsIHRoaXMsIHByZXNldHMpO1xyXG4gICAgICAgICAgICBpZiAob3V0IGluc3RhbmNlb2YgQ2FzZU5vZGUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmh0bWwgPSBvdXQuaHRtbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQobm9kZSwgcHJvcF9uYW1lKSB7XHJcblxyXG4gICAgICAgIGlmIChub2RlKVxyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKG5vZGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50YWdfY291bnQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUYXBOb2RlIGV4dGVuZHMgR2VuZXJpY05vZGUge1xyXG4gICAgY29uc3RydWN0b3IodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgIH07XHJcblxyXG4gICAgZmluYWxpemUoY3R4KSB7XHJcbiAgICAgICAgY3R4Lmh0bWwgKz0gdGhpcy5odG1sO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbnN0cnVjdG9yKHByZXNldHMpIHtcclxuICAgICAgICByZXR1cm4gVGFwO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEZpbHRlck5vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpIHtcclxuICAgICAgICBzdXBlcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgICAgIHRoaXMuQ09OU1VNRVNfVEFHID0gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIGZpbmFsaXplKGN0eCkge31cclxuXHJcbiAgICBnZXRDb25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcbiAgICAgICAgcmV0dXJuIFRhcDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQcm9wKGxleGVyLCBwcm9wX25hbWUsIHBhcnNlRnVuY3Rpb24sIHByZXNldHMpIHtcclxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHJvcCA9IHByb3BfbmFtZTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBUZXJtTm9kZSBleHRlbmRzIEdlbmVyaWNOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCkge1xyXG4gICAgICAgIHN1cGVyKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGZpbmFsaXplKGN0eCkge31cclxuXHJcbiAgICBnZXRDb25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcbiAgICAgICAgcmV0dXJuIFRhcDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQcm9wKGxleGVyLCBwcm9wX25hbWUsIHBhcnNlRnVuY3Rpb24sIHByZXNldHMpIHtcclxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHJvcCA9IHByb3BfbmFtZTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUGlwZU5vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpIHtcclxuICAgICAgICBzdXBlcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmaW5hbGl6ZShjdHgsIHByZXNldHMpIHtcclxuICAgICAgICBjdHguaHRtbCArPSB0aGlzLmh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29uc3RydWN0b3IocHJlc2V0cywgZmluYWxpemluZyA9IGZhbHNlKSB7XHJcbiAgICAgICAgbGV0IGNvbnN0cnVjdG9yID0gUGlwZTtcclxuICAgICAgICByZXR1cm4gY29uc3RydWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQobm9kZSwgcHJvcF9uYW1lKSB7XHJcbiAgICAgICAgaWYgKCEodGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBQaXBlTm9kZSkgJiZcclxuICAgICAgICAgICAgISh0aGlzLnBhcmVudCBpbnN0YW5jZW9mIFRhcE5vZGUpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIC8vTmVlZCBhIFRhcE5vZGUgdG8gY29tcGxldGUgdGhlIHBpcGVsaW5lXHJcbiAgICAgICAgICAgIGxldCB0YXAgPSBuZXcgVGFwTm9kZShcIlwiLCB7fSwgbnVsbClcclxuICAgICAgICAgICAgdGhpcy5wcm9wX25hbWUgPSB0aGlzLnByb3BfbmFtZTtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVwbGFjZUNoaWxkKHRoaXMsIHRhcCk7XHJcbiAgICAgICAgICAgIHRhcC5hZGRDaGlsZCh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1cGVyLnNwbGl0KG5vZGUsIHByb3BfbmFtZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJT05vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wX25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCwgY3R4LCBpbmRleCkge1xyXG4gICAgICAgIHN1cGVyKFwiXCIsIG51bGwsIHBhcmVudCk7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gICAgICAgIGN0eC5odG1sICs9IGA8aW8gcHJvcD1cIiR7cHJvcF9uYW1lfVwiPiMjOiR7aW5kZXh9PC9pbz5gXHJcbiAgICAgICAgdGhpcy5wcm9wX25hbWUgPSBwcm9wX25hbWU7XHJcbiAgICAgICAgdGhpcy5DT05TVU1FU19UQUcgPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBnZXRDb25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcbiAgICAgICAgcmV0dXJuIElPO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtcclxuICAgIExleFxyXG59IGZyb20gXCIuLi9jb21tb25cIlxyXG5cclxuaW1wb3J0ICogYXMgQVNUIGZyb20gXCIuL2Nhc2VfY29uc3RydWN0b3JfYXN0XCJcclxuXHJcbi8qXHJcbiAgICBUaGlzIGZ1bmN0aW9uJ3Mgcm9sZSBpcyB0byBjb25zdHJ1Y3QgYSBjYXNlIHNrZWxldG9uIGdpdmVuIGEgdGVtcGxhdGUsIGEgbGlzdCBvZiBwcmVzZXRzLCBhbmQgXHJcbiAgICBhbmQgb3B0aW9uYWxseSBhIHdvcmtpbmcgRE9NLiBUaGlzIHdpbGwgcmV0dXJuIENhc2UgU2tlbGV0b24gdGhhdCBjYW4gYmUgY2xvbmVkIGludG8gYSBuZXcgQ2FzZSBvYmplY3QuIFxyXG5cclxuICAgIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFRlbXBsYXRlXHJcbiAgICBAcGFyYW0ge1ByZXNldHN9IHByZXNldHMgXHJcbiAgICBAcGFyYW0ge0RPTUVsZW1lbnR9IFdPUktJTkdfRE9NXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBDYXNlQ29uc3RydWN0b3IoVGVtcGxhdGUsIFByZXNldHMsIFdPUktJTkdfRE9NKSB7XHJcblxyXG4gICAgbGV0IHNrZWxldG9uO1xyXG5cclxuICAgIGlmICghVGVtcGxhdGUpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgaWYgKFRlbXBsYXRlLnNrZWxldG9uKVxyXG4gICAgICAgIHJldHVybiBUZW1wbGF0ZS5za2VsZXRvbjtcclxuXHJcblxyXG4gICAgLy9URW1wbGF0ZSBGaWx0cmF0aW9uIGhhbmRsZWQgaGVyZS5cclxuICAgIC8vSW1wb3J0IHRoZSBcclxuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShUZW1wbGF0ZSwgdHJ1ZSk7XHJcblxyXG4gICAgc2tlbGV0b24gPSBDb21wb25lbnRDb25zdHJ1Y3RvcihlbGVtZW50LCBQcmVzZXRzLCBXT1JLSU5HX0RPTSk7XHJcblxyXG4gICAgaWYgKCFza2VsZXRvbilcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICBUZW1wbGF0ZS5za2VsZXRvbiA9ICgoc2tlbGV0b24pID0+IChtb2RlbCkgPT4gc2tlbGV0b24uZmxlc2gobW9kZWwpKShza2VsZXRvbik7XHJcblxyXG4gICAgcmV0dXJuIFRlbXBsYXRlLnNrZWxldG9uO1xyXG59XHJcblxyXG5mdW5jdGlvbiBSZXBsYWNlVGVtcGxhdGVXaXRoRWxlbWVudChUZW1wbGF0ZSkge1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gQ29tcG9uZW50Q29uc3RydWN0b3IoZWxlbWVudCwgcHJlc2V0cywgV09SS0lOR19ET00pIHtcclxuICAgIGxldCBhdHRyaWJ1dGVzID0gW107XHJcbiAgICBsZXQgcHJvcHMgPSBbXTtcclxuXHJcbiAgICBpZiAoZWxlbWVudC50YWdOYW1lID09PSBcIlRFTVBMQVRFXCIpIHtcclxuICAgICAgICBsZXQgY29tcG9uZW50X25hbWUgPSBlbGVtZW50LmlkO1xyXG4gICAgICAgIGxldCBpbnB1dCA9IGVsZW1lbnQuaW5uZXJIVE1MO1xyXG4gICAgICAgIGxldCBsZXhlciA9IExleChpbnB1dCk7XHJcblxyXG4gICAgICAgIC8vTWFrZSBzdXJlIHdlIGFyZSBzdGFydGluZyB3aXRoIGEgY2FzZSBvYmplY3QuIFxyXG5cclxuICAgICAgICBpZiAobGV4ZXIudGV4dCA9PSBcIjxcIikge1xyXG4gICAgICAgICAgICAvL29mZiB0byBhIGdvb2Qgc3RhcnRcclxuICAgICAgICAgICAgbGV0IHJvb3QgPSBuZXcgQVNULlJvb3QoKTtcclxuICAgICAgICAgICAgUGFyc2VUYWcobGV4ZXIsIHJvb3QsIHByZXNldHMpO1xyXG4gICAgICAgICAgICByZXR1cm4gcm9vdC5jb25zdHJ1Y3RTa2VsZXRvbihwcmVzZXRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAgICBIYW5kbGVzIHRoZSBzZWxlY3Rpb24gb2YgQVNUIG5vZGVzIGJhc2VkIG9uIHRhZ25hbWU7XHJcbiAgICBcclxuICAgIEBwYXJhbSB7TGV4ZXJ9IGxleGVyIC0gVGhlIGxleGljYWwgcGFyc2VyIFxyXG4gICAgQHBhcmFtIHtTdHJpbmd9IHRhZ25hbWUgLSBUaGUgZWxlbWVudHMgdGFnbmFtZVxyXG4gICAgQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgLSBcclxuICAgIEBwYXJhbSB7T2JqZWN0fSBjdHhcclxuICAgIEBwYXJhbSB7Q0NBc3ROb2RlfSBwYXJlbnRcclxuKi9cclxuZnVuY3Rpb24gRGlzcGF0Y2gobGV4ZXIsIHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCkge1xyXG4gICAgbGV0IGFzdDtcclxuICAgIHN3aXRjaCAodGFnbmFtZSkge1xyXG4gICAgICAgIC8qIFRhcHMgKi9cclxuICAgICAgICBjYXNlIFwid1wiOlxyXG4gICAgICAgIGNhc2UgXCJ3LWFcIjpcclxuICAgICAgICBjYXNlIFwid19hXCI6XHJcbiAgICAgICAgICAgIGFzdCA9IG5ldyBBU1QuVGFwTm9kZSh0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXN0O1xyXG4gICAgICAgIGNhc2UgXCJ3LWZpbHRlclwiOlxyXG4gICAgICAgICAgICBhc3QgPSBuZXcgQVNULkZpbHRlck5vZGUodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFzdDtcclxuICAgICAgICBjYXNlIFwidy10ZXJtXCI6XHJcbiAgICAgICAgICAgIGFzdCA9IG5ldyBBU1QuVGVybU5vZGUodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFzdDtcclxuICAgICAgICBjYXNlIFwidy1jXCI6XHJcbiAgICAgICAgY2FzZSBcIndfY1wiOlxyXG4gICAgICAgIGNhc2UgXCJ3LWNhc2VcIjpcclxuICAgICAgICBjYXNlIFwid19jYXNlXCI6XHJcbiAgICAgICAgICAgIGFzdCA9IG5ldyBBU1QuQ2FzZU5vZGUodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFzdDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBpZiAodGFnbmFtZVswXSA9PSBcIndcIikge1xyXG4gICAgICAgICAgICAgICAgYXN0ID0gbmV3IEFTVC5QaXBlTm9kZSh0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGFzdCA9IG5ldyBBU1QuR2VuZXJpY05vZGUodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgIHJldHVybiBhc3Q7XHJcbn1cclxuXHJcbi8qKlxyXG4gICAgSGFuZGxlcyB0aGUgcGFyc2luZyBvZiBIVE1MIHRhZ3MgYW5kIGNvbnRlbnRcclxuICAgIEBwYXJhbSB7U3RyaW5nfSB0YWduYW1lXHJcbiAgICBAcGFyYW0ge09iamVjdH0gY3R4XHJcbiAgICBAcGFyYW0ge0NDQXN0Tm9kZX0gcGFyZW50XHJcbiovXHJcbmZ1bmN0aW9uIFBhcnNlVGFnKGxleGVyLCBwYXJlbnQsIHByZXNldHMpIHtcclxuICAgIGxldCBzdGFydCA9IGxleGVyLnBvcztcclxuICAgIGxldCBhdHRyaWJ1dGVzID0ge307XHJcbiAgICBcclxuICAgIGxleGVyLmFzc2VydChcIjxcIilcclxuICAgIFxyXG4gICAgbGV0IHRhZ25hbWUgPSBsZXhlci50ZXh0O1xyXG4gICAgXHJcbiAgICBpZiAobGV4ZXIudHlwZSA9PSBcImlkZW50aWZpZXJcIikge1xyXG4gICAgICAgIGxleGVyLm5leHQoKTtcclxuICAgICAgICBHZXRBdHRyaWJ1dGVzKGxleGVyLCBhdHRyaWJ1dGVzKTtcclxuICAgIH0gZWxzZSB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHRhZy1uYW1lIGlkZW50aWZpZXIsIGdvdCAke2xleGVyLnRleHR9YCk7XHJcblxyXG4gICAgbGV0IGVsZSA9IERpc3BhdGNoKGxleGVyLCB0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG5cclxuICAgIGVsZS5vcGVuX3RhZyArPSBsZXhlci5zbGljZShzdGFydCk7XHJcblxyXG4gICAgc3RhcnQgPSBsZXhlci50b2tlbi5wb3M7XHJcblxyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFsZXhlci50ZXh0KVxyXG4gICAgICAgICAgICB0aHJvdyAoXCJVbmV4cGVjdGVkIGVuZCBvZiBvdXRwdXRcIik7XHJcblxyXG4gICAgICAgIHN3aXRjaCAobGV4ZXIudGV4dCkge1xyXG4gICAgICAgICAgICBjYXNlIFwiPFwiOlxyXG4gICAgICAgICAgICAgICAgaWYgKGxleGVyLnBlZWsoKS50ZXh0ID09IFwiL1wiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGVsZS5odG1sICs9IGxleGVyLnNsaWNlKHN0YXJ0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBsZXhlci5wb3M7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vU2hvdWxkIGJlIGNsb3NpbmcgaXQncyBvd24gdGFnLlxyXG4gICAgICAgICAgICAgICAgICAgIGxleGVyLmFzc2VydChcIjxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiL1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXhlci5hc3NlcnQodGFnbmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBvdXQgPSBsZXhlci5wb3MgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGxleGVyLmFzc2VydChcIj5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGVsZS5jbG9zZV90YWcgPSBsZXhlci5zbGljZShzdGFydCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGVsZS5maW5hbGl6ZShwYXJlbnQgfHwge2h0bWw6XCJcIn0sIHByZXNldHMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBQYXJzZVRhZyhsZXhlciwgZWxlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiW1wiOlxyXG4gICAgICAgICAgICAgICAgZWxlLmh0bWwgKz0gbGV4ZXIuc2xpY2Uoc3RhcnQpO1xyXG4gICAgICAgICAgICAgICAgbGV4ZXIubmV4dCgpXHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvcF9uYW1lID0gbGV4ZXIudGV4dDtcclxuICAgICAgICAgICAgICAgIGxleGVyLm5leHQoKVxyXG4gICAgICAgICAgICAgICAgc3RhcnQgPSBsZXhlci5wb3MgKyAxO1xyXG4gICAgICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiXVwiKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gZWxlLmFkZFByb3AobGV4ZXIsIHByb3BfbmFtZSwgUGFyc2VUYWcsIHByZXNldHMpIHx8IHN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBsZXhlci5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gICAgUmV0dXJucyBhbGwgYXR0cmlidXRlcyBpbiBhbiBlbGVtZW50IGFzIGEga2V5LXZhbHVlIG9iamVjdC5cclxuXHJcbiAgICBAcGFyYW0ge0xleGVyfSBsZXhlciAtIFRoZSBsZXhpY2FsIHBhcnNlciAgXHJcbiAgICBAcGFyYW0ge09iamVjdH0gYXR0aWJzIC0gQW4gb2JqZWN0IHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgYXR0cmlidXRlIGtleXMgYW5kIHZhbHVlcy4gXHJcbiovXHJcbmZ1bmN0aW9uIEdldEF0dHJpYnV0ZXMobGV4ZXIsIGF0dHJpYnMpIHtcclxuICAgIHdoaWxlIChsZXhlci50ZXh0ICE9PSBcIj5cIiAmJiBsZXhlci50ZXh0ICE9PSBcIi9cIikge1xyXG4gICAgICAgIGlmICghbGV4ZXIudGV4dCkgdGhyb3cgRXJyb3IoXCJVbmV4cGVjdGVkIGVuZCBvZiBpbnB1dC5cIik7XHJcbiAgICAgICAgbGV0IGF0dHJpYl9uYW1lID0gbGV4ZXIudGV4dDtcclxuICAgICAgICBsZXQgYXR0cmliX3ZhbCA9IG51bGw7XHJcbiAgICAgICAgbGV4ZXIubmV4dCgpO1xyXG4gICAgICAgIGlmIChsZXhlci50ZXh0ID09IFwiPVwiKSB7XHJcbiAgICAgICAgICAgIGxleGVyLm5leHQoKTtcclxuICAgICAgICAgICAgaWYgKGxleGVyLnRva2VuLnR5cGUgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgYXR0cmliX3ZhbCA9IGxleGVyLnRleHQuc2xpY2UoMSwgLTEpO1xyXG4gICAgICAgICAgICAgICAgbGV4ZXIubmV4dCgpO1xyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGluZyBhdHRyaWJ1dGUgZGVmaW5pdGlvbi5cIik7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBhdHRyaWJzW2F0dHJpYl9uYW1lXSA9IGF0dHJpYl92YWw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGxleGVyLnRleHQgPT0gXCIvXCIpIC8vIFZvaWQgTm9kZXNcclxuICAgICAgICBsZXhlci5hc3NlcnQoXCIvXCIpO1xyXG4gICAgbGV4ZXIuYXNzZXJ0KFwiPlwiKTtcclxufSIsImltcG9ydCB7XHJcbiAgICBzZXRMaW5rc1xyXG59IGZyb20gXCIuL3NldGxpbmtzXCJcclxuaW1wb3J0IHtcclxuICAgIFRyYW5zZm9ybVRvXHJcbn0gZnJvbSBcIi4uL2FuaW1hdGlvbi9hbmltYXRpb25cIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIEJhc2ljQ2FzZSxcclxuICAgIEZhaWxlZENhc2VcclxufSBmcm9tIFwiLi9jb21wb25lbnRcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIENhc2VDb25zdHJ1Y3RvclxyXG59IGZyb20gXCIuLi9jYXNlL2Nhc2VfY29uc3RydWN0b3JcIlxyXG5cclxuLyoqXHJcbiAgICBUaGUgbWFpbiBjb250YWluZXIgb2YgQ2FzZXMuIFJlcHJlc2VudHMgYW4gYXJlYSBvZiBpbnRlcmVzdCBvbiB0aGUgY2xpZW50IHZpZXcuXHJcbiovXHJcbmNsYXNzIEVsZW1lbnQge1xyXG4gICAgLyoqXHJcbiAgICAgXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLmlkID0gKGVsZW1lbnQuY2xhc3NMaXN0KSA/IGVsZW1lbnQuY2xhc3NMaXN0WzBdIDogZWxlbWVudC5pZDtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBbXTtcclxuICAgICAgICB0aGlzLmJ1YmJsZWRfZWxlbWVudHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMud3JhcHMgPSBbXTtcclxuXHJcbiAgICAgICAgLy9UaGUgb3JpZ2luYWwgZWxlbWVudCBjb250YWluZXIuXHJcbiAgICAgICAgLy90aGlzLnBhcmVudF9lbGVtZW50ID0gcGFyZW50X2VsZW1lbnQ7XHJcblxyXG4gICAgICAgIC8vQ29udGVudCB0aGF0IGlzIHdyYXBwZWQgaW4gYW4gZWxlX3dyYXBcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1bmxvYWRDb21wb25lbnRzKCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHNbaV0uTE9BREVEID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNpdGlvbk91dCgpIHtcclxuXHJcbiAgICAgICAgbGV0IHQgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50LkxPQURFRCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wYXJlbnQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIHQgPSBNYXRoLm1heChjb21wb25lbnQudHJhbnNpdGlvbk91dCgpLCB0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmFsaXplKCkge1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50LkxPQURFRCAmJiBjb21wb25lbnQucGFyZW50RWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53cmFwc1tpXS5yZW1vdmVDaGlsZChjb21wb25lbnQuZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5MT0FERUQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZENvbXBvbmVudHMod3VybCkge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5wYXJlbnQgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5lbGVtZW50LnBhcmVudEVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGNvbXBvbmVudC5lbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3JhcHNbaV0uYXBwZW5kQ2hpbGQoY29tcG9uZW50LmVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgY29tcG9uZW50LmhhbmRsZVVybFVwZGF0ZSh3dXJsKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50c1tpXS5MT0FERUQgPSB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNpdGlvbkluKCkge1xyXG5cclxuICAgICAgICAvLyBUaGlzIGlzIHRvIGZvcmNlIGEgZG9jdW1lbnQgcmVwYWludCwgd2hpY2ggc2hvdWxkIGNhdXNlIGFsbCBlbGVtZW50cyB0byByZXBvcnQgY29ycmVjdCBwb3NpdGlvbmluZyBoZXJlYWZ0ZXJcclxuXHJcbiAgICAgICAgbGV0IHQgPSB0aGlzLmVsZW1lbnQuc3R5bGUudG9wO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSB0O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW2ldO1xyXG5cclxuICAgICAgICAgICAgY29tcG9uZW50LnRyYW5zaXRpb25JbigpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYnViYmxlTGluayhsaW5rX3VybCwgY2hpbGQsIHRyc19lbGUgPSB7fSkge1xyXG5cclxuICAgICAgICB0aGlzLmJ1YmJsZWRfZWxlbWVudHMgPSB0cnNfZWxlO1xyXG5cclxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJpZ25vcmVkIHRpdGxlXCIsIGxpbmtfdXJsKTtcclxuXHJcbiAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUcmFuc2Zvcm1Ubyh0cmFuc2l0aW9ucykge1xyXG4gICAgICAgIGlmICh0cmFuc2l0aW9ucykge1xyXG4gICAgICAgICAgICBsZXQgb3duX2VsZW1lbnRzID0ge307XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdldE5hbWVkRWxlbWVudHMob3duX2VsZW1lbnRzKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gb3duX2VsZW1lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uc1tuYW1lXSA9IFRyYW5zZm9ybVRvKG93bl9lbGVtZW50c1tuYW1lXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VHJhbnNmb3JtVG8odHJhbnNpdGlvbnMpIHtcclxuICAgICAgICBpZiAodHJhbnNpdGlvbnMpIHtcclxuICAgICAgICAgICAgbGV0IG93bl9lbGVtZW50cyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5nZXROYW1lZEVsZW1lbnRzKG93bl9lbGVtZW50cyk7XHJcblxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBvd25fZWxlbWVudHMpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0bywgZnJvbSA9IHRyYW5zaXRpb25zW25hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCh0byA9IG93bl9lbGVtZW50c1tuYW1lXSkgJiYgZnJvbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZyb20odG8sIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYnViYmxlZF9lbGVtZW50cykge1xyXG4gICAgICAgICAgICBsZXQgdCA9IHRoaXMuYnViYmxlZF9lbGVtZW50cztcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHQgaW4gdGhpcy5idWJibGVkX2VsZW1lbnRzKVxyXG4gICAgICAgICAgICAgICAgbmFtZWRfZWxlbWVudHNbdF0gPSB0aGlzLmJ1YmJsZWRfZWxlbWVudHNbdF07XHJcblxyXG4gICAgICAgICAgICAvL3RoaXMuYnViYmxlZF9lbGVtZW50cyA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmVsZW1lbnQuY2hpbGRyZW47XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkID0gY2hpbGRyZW5baV07XHJcblxyXG4gICAgICAgICAgICBpZiAoY2hpbGQuZGF0YXNldC50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lZF9lbGVtZW50c1tjaGlsZC5kYXRhc2V0LnRyYW5zaXRpb25dID0gY2hpbGQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbaV07XHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5nZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29tcG9uZW50cyhBcHBfQ29tcG9uZW50cywgTW9kZWxfQ29uc3RydWN0b3JzLCBDb21wb25lbnRfQ29uc3RydWN0b3JzLCBwcmVzZXRzLCBET00sIHd1cmwpIHtcclxuICAgICAgICAvL2lmIHRoZXJlIGlzIGEgY29tcG9uZW50IGluc2lkZSB0aGUgZWxlbWVudCwgcmVnaXN0ZXIgdGhhdCBjb21wb25lbnQgaWYgaXQgaGFzIG5vdCBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZFxyXG4gICAgICAgIHZhciBjb21wb25lbnRzID0gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImNvbXBvbmVudFwiKSwgKGEpID0+IGEpO1xyXG5cclxuICAgICAgICBzZXRMaW5rcyh0aGlzLmVsZW1lbnQsIChocmVmLCBlKSA9PiB7XHJcbiAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHt9LCBcImlnbm9yZWQgdGl0bGVcIiwgaHJlZik7XHJcbiAgICAgICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA8IDEpIHtcclxuICAgICAgICAgICAgLy9DcmVhdGUgYSB3cmFwcGVkIGNvbXBvbmVudCBmb3IgdGhlIGVsZW1lbnRzIGluc2lkZSB0aGUgPGVsZW1lbnQ+XHJcbiAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBjb21wb25lbnQuY2xhc3NMaXN0LmFkZChcImNvbXBfd3JhcFwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vU3RyYWlnaHQgdXAgc3RyaW5nIGNvcHkgb2YgdGhlIGVsZW1lbnQncyBET00uXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5pbm5lckhUTUwgPSB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHRlbXBsYXRlcyA9IERPTS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRlbXBsYXRlXCIpO1xyXG5cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBhcHBfY2FzZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSBjb21wb25lbnRzW2ldO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgIFJlcGxhY2UgdGhlIGNvbXBvbmVudCB3aXRoIGEgY29tcG9uZW50IHdyYXBwZXIgdG8gaGVscCBwcmVzZXJ2ZSBET00gYXJyYW5nZW1lbnRcclxuICAgICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNvbXBfd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgICAgICBjb21wX3dyYXAuY2xhc3NMaXN0LmFkZChcImNvbXBfd3JhcFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud3JhcHMucHVzaChjb21wX3dyYXApO1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnBhcmVudEVsZW1lbnQucmVwbGFjZUNoaWxkKGNvbXBfd3JhcCwgY29tcG9uZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBjb21wb25lbnQuY2xhc3NMaXN0WzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbXA7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgV2UgbXVzdCBlbnN1cmUgdGhhdCBjb21wb25lbnRzIGFjdCBhcyB0ZW1wbGF0ZSBcImxhbmRpbmcgc3BvdHNcIi4gSW4gb3JkZXIgZm9yIHRoYXQgdG8gaGFwcGVuIHdlIG11c3QgY2hlY2sgZm9yOlxyXG4gICAgICAgICAgICAgICAgICAoMSkgVGhlIGNvbXBvbmVudCBoYXMsIGFzIGl0J3MgZmlyc3QgY2xhc3MgbmFtZSwgYW4gaWQgdGhhdCAoMikgbWF0Y2hlcyB0aGUgaWQgb2YgYSB0ZW1wbGF0ZS4gSWYgZWl0aGVyIG9mIHRoZXNlIHByb3ZlIHRvIGJlIG5vdCB0cnVlLCB3ZSBzaG91bGQgcmVqZWN0IHRoZSBhZG9wdGlvbiBvZiB0aGUgY29tcG9uZW50IGFzIGEgV2lja1xyXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnQgYW5kIGluc3RlYWQgdHJlYXQgaXQgYXMgYSBub3JtYWwgXCJwYXNzIHRocm91Z2hcIiBlbGVtZW50LlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmICghaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKnNldExpbmtzKGNvbXBvbmVudCwgKGhyZWYsIGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiaWdub3JlZCB0aXRsZVwiLCBocmVmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBhcHBfY2FzZSA9IG5ldyBCYXNpY0Nhc2UoY29tcG9uZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIUFwcF9Db21wb25lbnRzW2lkXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcCA9IENvbXBvbmVudF9Db25zdHJ1Y3RvcnNbaWRdKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBuZXcgY29tcC5jb25zdHJ1Y3Rvcih0ZW1wbGF0ZXMsIHByZXNldHMsIGNvbXBvbmVudCwgRE9NKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcC5tb2RlbF9uYW1lICYmIE1vZGVsX0NvbnN0cnVjdG9yc1tjb21wLm1vZGVsX25hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1vZGVsID0gTW9kZWxfQ29uc3RydWN0b3JzW2NvbXAubW9kZWxfbmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsLmdldHRlcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwuZ2V0dGVyLmdldCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLmFkZFZpZXcoYXBwX2Nhc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlLmlkID0gaWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwX0NvbXBvbmVudHNbaWRdID0gYXBwX2Nhc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSB0ZW1wbGF0ZXNbaWRdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gQ2FzZUNvbnN0cnVjdG9yKHRlbXBsYXRlLCBwcmVzZXRzLCBET00pKCk7IC8vbmV3IENhc2VDb21wb25lbnQodGVtcGxhdGUsIHByZXNldHMsIE1vZGVsX0NvbnN0cnVjdG9ycywgbnVsbCwgRE9NKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnN0cnVjdG9yID0gQ2FzZUNvbnN0cnVjdG9yKGNvbXBvbmVudCwgcHJlc2V0cywgRE9NKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb25zdHJ1Y3RvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RydWN0b3IgPSBDYXNlQ29uc3RydWN0b3IoY29tcG9uZW50LmNoaWxkcmVuWzBdLCBwcmVzZXRzLCBET00pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29uc3RydWN0b3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gbmV3IEJhc2ljQ2FzZShjb21wb25lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBjb25zdHJ1Y3RvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFwcF9jYXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJBcHAgQ29tcG9uZW50IG5vdCBjb25zdHJ1Y3RlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKiBUT0RPOiBJZiB0aGVyZSBpcyBhIGZhbGxiYWNrIDxuby1zY3JpcHQ+IHNlY3Rpb24gdXNlIHRoYXQgaW5zdGVhZC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gbmV3IEZhaWxlZENhc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcF9Db21wb25lbnRzW2lkXSA9IGFwcF9jYXNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBBcHBfQ29tcG9uZW50c1tpZF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBhcHBfY2FzZS5oYW5kbGVVcmxVcGRhdGUod3VybCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgICAgICBhcHBfY2FzZSA9IG5ldyBGYWlsZWRDYXNlKGUsIHByZXNldHMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMucHVzaChhcHBfY2FzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgRWxlbWVudFxyXG59IiwiaW1wb3J0IHtcclxuICAgIFdVUkxcclxufSBmcm9tIFwiLi93dXJsXCJcclxuaW1wb3J0IHtcclxuICAgIEFueU1vZGVsXHJcbn1mcm9tIFwiLi4vbW9kZWwvbW9kZWxcIlxyXG5pbXBvcnQge1xyXG4gICAgUGFnZVZpZXdcclxufSBmcm9tIFwiLi9wYWdlXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBFbGVtZW50XHJcbn0gZnJvbSBcIi4vZWxlbWVudFwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgVHVybkRhdGFJbnRvUXVlcnlcclxufSBmcm9tIFwiLi4vY29tbW9uL3VybC91cmxcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIEdMT0JBTFxyXG59IGZyb20gXCIuLi9nbG9iYWxcIlxyXG5cclxubGV0IFVSTF9IT1NUID0ge1xyXG4gICAgd3VybDogbnVsbFxyXG59O1xyXG5sZXQgVVJMID0gKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgIENoYW5nZXMgdGhlIFVSTCB0byB0aGUgb25lIHByb3ZpZGVkLCBwcm9tcHRzIHBhZ2UgdXBkYXRlLiBvdmVyd3JpdGVzIGN1cnJlbnQgVVJMLlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24oYSwgYiwgYykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChVUkxfSE9TVC53dXJsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBVUkxfSE9TVC53dXJsLnNldChhLCBiLCBjKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJldHVybnMgYSBRdWVyeSBlbnRyeSBpZiBpdCBleGlzdHMgaW4gdGhlIHF1ZXJ5IHN0cmluZy4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoVVJMX0hPU1Qud3VybClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFVSTF9IT1NULnd1cmwuc2V0KGEsIGIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhbmdlcyB0aGUgVVJMIHN0YXRlIHRvIHRoZSBvbmUgcHJvdmlkZWQgYW5kIHByb21wdHMgdGhlIEJyb3dzZXIgdG8gcmVzcG9uZCBvIHRoZSBjaGFuZ2UuIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZ290bzogZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJpZ25vcmVkIHRpdGxlXCIsIGAke2F9JHsgKChiKSA/IGA/JHtUdXJuRGF0YUludG9RdWVyeShiKX1gIDogXCJcIikgfWApO1xyXG4gICAgICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuXHJcbmZ1bmN0aW9uIGdldE1vZGFsQ29udGFpbmVyKCkge1xyXG4gICAgbGV0IG1vZGFsX2NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibW9kYWxzXCIpWzBdO1xyXG5cclxuICAgIGlmICghbW9kYWxfY29udGFpbmVyKSB7XHJcblxyXG4gICAgICAgIG1vZGFsX2NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtb2RhbHNcIik7XHJcblxyXG4gICAgICAgIHZhciBkb21fYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhcHBcIilbMF07XHJcblxyXG4gICAgICAgIGlmIChkb21fYXBwKVxyXG4gICAgICAgICAgICBkb21fYXBwLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG1vZGFsX2NvbnRhaW5lciwgZG9tX2FwcCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1vZGFsX2NvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1vZGFsX2NvbnRhaW5lclxyXG59XHJcblxyXG4vKiogQG5hbWVzcGFjZSBsaW5rZXIgKi9cclxuXHJcbi8qKlxyXG4gKiAgUmVzcG9uc2libGUgZm9yIGxvYWRpbmcgcGFnZXMgYW5kIHByZXNlbnRpbmcgdGhlbSBpbiB0aGUgbWFpbiBET00uXHJcbiAqL1xyXG5jbGFzcyBMaW5rZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiAgVGhpcyAoaW5rZXIuTGlua2VyKSBpcyByZXNwb25zaWJsZSBmb3IgbG9hZGluZyBwYWdlcyBkeW5hbWljYWxseSwgaGFuZGxpbmcgdGhlIHRyYW5zaXRpb24gb2YgcGFnZSBjb21wb25lbnRzLCBhbmQgbW9uaXRvcmluZyBhbmQgcmVhY3RpbmcgdG8gVVJMIGNoYW5nZXNcclxuICAgICAqXHJcbiAgICAgKlxyXG4gICAgICogIEBwYXJhbSB7TGlua2VyUHJlc2V0c30gcHJlc2V0cyAtIEEgcHJlc2V0IGJhc2VkIG9iamVjdCB0aGF0IHdpbGwgYmUgdXNlZCBieSBXaWNrIGZvciBoYW5kbGluZyBjdXN0b20gY29tcG9uZW50cy4gSXMgdmFsaWRhdGVkIGFjY29yZGluZyB0byB0aGUgZGVmaW5pdGlvbiBvZiBhIExpbmtlclByZXNldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcbiAgICAgICAgdGhpcy5wYWdlcyA9IHt9O1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHt9O1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50X2NvbnN0cnVjdG9ycyA9IHt9O1xyXG4gICAgICAgIHRoaXMubW9kZWxzX2NvbnN0cnVjdG9ycyA9IHt9O1xyXG4gICAgICAgIHRoaXMucHJlc2V0cyA9IHByZXNldHM7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3VybCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3F1ZXJ5O1xyXG4gICAgICAgIHRoaXMuY3VycmVudF92aWV3ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpbmFsaXppbmdfcGFnZXMgPSBbXTtcclxuXHJcbiAgICAgICAgR0xPQkFMLmxpbmtlciA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICBUaGUgc3RhdGljIGZpZWxkIGluIHByZXNldHMgYXJlIGFsbCBDb21wb25lbnQtbGlrZSBvYmplY3RzIGNvbnRydWN0b3JzIHRoYXQgYXJlIGRlZmluZWQgYnkgdGhlIGNsaWVudFxyXG4gICAgICAgICAgdG8gYmUgdXNlZCBieSBXaWNrIGZvciBjdXN0b20gY29tcG9uZW50cy5cclxuXHJcbiAgICAgICAgICBUaGUgY29uc3RydWN0b3JzIG11c3Qgc3VwcG9ydCBzZXZlcmFsIENvbXBvbmVudCBiYXNlZCBtZXRob2RzIGluIG9yZGVyZWQgb3QgYmUgYWNjZXB0ZWQgZm9yIHVzZS4gVGhlc2UgbWV0aG9kZXMgaW5jbHVkZTpcclxuICAgICAgICAgICAgdHJhbnNpdGlvbkluXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25PdXRcclxuICAgICAgICAgICAgc2V0TW9kZWxcclxuICAgICAgICAgICAgdW5zZXRNb2RlbFxyXG4gICAgICAgICovXHJcbiAgICAgICAgaWYgKHByZXNldHMuc3RhdGljKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbXBvbmVudF9uYW1lIGluIHByZXNldHMuc3RhdGljKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHByZXNldHMuc3RhdGljW2NvbXBvbmVudF9uYW1lXTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgYSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgYiA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgYyA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgZCA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgZSA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKChhID0gKGNvbXBvbmVudC5wcm90b3R5cGUudHJhbnNpdGlvbkluICYmIGNvbXBvbmVudC5wcm90b3R5cGUudHJhbnNpdGlvbkluIGluc3RhbmNlb2YgRnVuY3Rpb24pKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChiID0gKGNvbXBvbmVudC5wcm90b3R5cGUudHJhbnNpdGlvbk91dCAmJiBjb21wb25lbnQucHJvdG90eXBlLnRyYW5zaXRpb25PdXQgaW5zdGFuY2VvZiBGdW5jdGlvbikpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGMgPSAoY29tcG9uZW50LnByb3RvdHlwZS5zZXRNb2RlbCAmJiBjb21wb25lbnQucHJvdG90eXBlLnNldE1vZGVsIGluc3RhbmNlb2YgRnVuY3Rpb24pKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChkID0gKGNvbXBvbmVudC5wcm90b3R5cGUudW5zZXRNb2RlbCAmJiBjb21wb25lbnQucHJvdG90eXBlLnVuc2V0TW9kZWwgaW5zdGFuY2VvZiBGdW5jdGlvbikpKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkU3RhdGljKGNvbXBvbmVudF9uYW1lLCBjb21wb25lbnQpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgU3RhdGljIGNvbXBvbmVudCAke2NvbXBvbmVudF9uYW1lfSBsYWNrcyBjb3JyZWN0IGNvbXBvbmVudCBtZXRob2RzLCBcXG5IYXMgdHJhbnNpdGlvbkluIGZ1bmN0aW9uOiR7YX1cXG5IYXMgdHJhbnNpdGlvbk91dCBmdW5jdG9uOiR7Yn1cXG5IYXMgc2V0IG1vZGVsIGZ1bmN0aW9uOiR7Y31cXG5IYXMgdW5zZXRNb2RlbCBmdW5jdGlvbjoke2R9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKiBUT0RPXHJcbiAgICAgICAgICAgIEBkZWZpbmUgUGFnZVBhcnNlclxyXG5cclxuICAgICAgICAgICAgQSBwYWdlIHBhcnNlciB3aWxsIHBhcnNlIHRlbXBsYXRlcyBiZWZvcmUgcGFzc2luZyB0aGF0IGRhdGEgdG8gdGhlIENhc2UgaGFuZGxlci5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGlmIChwcmVzZXRzLnBhcnNlcikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwYXJzZXJfbmFtZSBpbiBwcmVzZXRzLnBhZ2VfcGFyc2VyKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyc2VyID0gcHJlc2V0cy5wYWdlX3BhcnNlcltwYXJzZXJfbmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgICBTY2hlbWFzIHByb3ZpZGUgdGhlIGNvbnN0cnVjdG9ycyBmb3IgbW9kZWxzXHJcbiAgICAgICAgKi9cclxuICAgICAgICBpZiAocHJlc2V0cy5zY2hlbWFzKSB7XHJcblxyXG4gICAgICAgICAgICBwcmVzZXRzLnNjaGVtYXMuYW55ID0gQW55TW9kZWw7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHByZXNldHMuc2NoZW1hcyA9IHtcclxuICAgICAgICAgICAgICAgIGFueSA6IEFueU1vZGVsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgICAgTW9kYWxzIGFyZSB0aGUgZ2xvYmFsIG1vZGVscyB0aGF0IGNhbiBiZSBhY2Nlc3NlZCBieSBhbnkgQ2FzZVxyXG4gICAgICAgICovXHJcbiAgICAgICAgaWYgKHByZXNldHMubW9kZWxzKSB7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHByZXNldHMubW9kZWxzID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgIFRPRE8gVmFsaWRhdGUgdGhhdCBldmVyeSBzY2hhbWEgaXMgYSBNb2RlbCBjb25zdHJ1Y3RvclxyXG4gICAgICAgICovXHJcblxyXG4gICAgICAgIC8qICovXHJcbiAgICAgICAgdGhpcy5tb2RhbF9zdGFjayA9IFtdO1xyXG5cclxuICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZVVSTChkb2N1bWVudC5sb2NhdGlvbilcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAgICBUaGlzIGZ1bmN0aW9uIHdpbGwgcGFyc2UgYSBVUkwgYW5kIGRldGVybWluZSB3aGF0IFBhZ2UgbmVlZHMgdG8gYmUgbG9hZGVkIGludG8gdGhlIGN1cnJlbnQgdmlldy5cclxuICAgICovXHJcbiAgICBwYXJzZVVSTChsb2NhdGlvbikge1xyXG5cclxuICAgICAgICBsZXQgdXJsID0gbG9jYXRpb24ucGF0aG5hbWU7XHJcblxyXG4gICAgICAgIGxldCBJU19TQU1FX1BBR0UgPSAodGhpcy5jdXJyZW50X3VybCA9PSB1cmwpLFxyXG4gICAgICAgICAgICBwYWdlID0gbnVsbCxcclxuICAgICAgICAgICAgd3VybCA9IG5ldyBXVVJMKGxvY2F0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3VybCA9IHVybDtcclxuXHJcbiAgICAgICAgaWYgKChwYWdlID0gdGhpcy5wYWdlc1t1cmxdKSkge1xyXG4gICAgICAgICAgICBpZiAoSVNfU0FNRV9QQUdFKSB7XHJcbiAgICAgICAgICAgICAgICBVUkxfSE9TVC53dXJsID0gd3VybDtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFnZS50cmFuc2l0aW9uSW4oXHJcbiAgICAgICAgICAgICAgICAgICAgKHBhZ2UudHlwZSA9PSBcIm1vZGFsXCIpID8gZ2V0TW9kYWxDb250YWluZXIoKSA6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYXBwXCIpWzBdLCBcclxuICAgICAgICAgICAgICAgICAgICBudWxsLCB3dXJsLCBJU19TQU1FX1BBR0UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRQYWdlKHBhZ2UsIHd1cmwsIElTX1NBTUVfUEFHRSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobG9jYXRpb24pXHJcbiAgICAgICAgICAgIGZldGNoKGxvY2F0aW9uLmhyZWYsIHtcclxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIC8vIFNlbmRzIGNvb2tpZXMgYmFjayB0byBzZXJ2ZXIgd2l0aCByZXF1ZXN0XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnXHJcbiAgICAgICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAocmVzcG9uc2UudGV4dCgpLnRoZW4oKGh0bWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgRE9NID0gKG5ldyBET01QYXJzZXIoKSkucGFyc2VGcm9tU3RyaW5nKGh0bWwsIFwidGV4dC9odG1sXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkUGFnZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkTmV3UGFnZSh1cmwsIERPTSwgd3VybCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHd1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIElTX1NBTUVfUEFHRVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmFibGUgdG8gcHJvY2VzcyByZXNwb25zZSBmb3IgcmVxdWVzdCBtYWRlIHRvOiAke3RoaXMudXJsfS4gUmVzcG9uc2U6ICR7ZXJyb3J9LiBFcnJvciBSZWNlaXZlZDogJHtlcnJvcn1gKTtcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmaW5hbGl6ZVBhZ2VzKCkge1xyXG5cclxuICAgICAgICBpZih0aGlzLmFybWVkKXtcclxuICAgICAgICAgICAgbGV0IGEgPSB0aGlzLmFybWVkO1xyXG4gICAgICAgICAgLy8gIGEucC50cmFuc2l0aW9uSW4oYS5lLCB0aGlzLmN1cnJlbnRfdmlldywgYS53dXJsLCBhLlNQLCBhLnRlKTtcclxuICAgICAgICAgICAgdGhpcy5hcm1lZCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5maW5hbGl6aW5nX3BhZ2VzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmZpbmFsaXppbmdfcGFnZXNbaV07XHJcbiAgICAgICAgICAgIHBhZ2UuZmluYWxpemUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZmluYWxpemluZ19wYWdlcy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIExvYWRzIHBhZ2VzIGZyb20gc2VydmVyLCBvciBmcm9tIGxvY2FsIGNhY2hlLCBhbmQgc2VuZHMgaXQgdG8gdGhlIHBhZ2UgcGFyc2VyLlxyXG5cclxuICAgICAgQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSBVUkwgaWQgb2YgdGhlIGNhY2hlZCBwYWdlIHRvIGxvYWQuXHJcbiAgICAgIEBwYXJhbSB7c3RyaW5nfSBxdWVyeSAtXHJcbiAgICAgIEBwYXJhbSB7Qm9vbH0gSVNfU0FNRV9QQUdFIC1cclxuICAgICovXHJcbiAgICBsb2FkUGFnZShwYWdlLCB3dXJsID0gbmV3IFdVUkwoZG9jdW1lbnQubG9jYXRpb24pLCBJU19TQU1FX1BBR0UpIHtcclxuXHJcblxyXG4gICAgICAgIFVSTF9IT1NULnd1cmwgPSB3dXJsO1xyXG5cclxuICAgICAgICBsZXQgdHJhbnNpdGlvbl9sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICBsZXQgYXBwX2VsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYXBwXCIpWzBdO1xyXG5cclxuICAgICAgICAvL0ZpbmFsaXplIGFueSBleGlzdGluZyBwYWdlIHRyYW5zaXRpb25zO1xyXG4gICAgICAgIC8vIHRoaXMuZmluYWxpemVQYWdlcygpO1xyXG5cclxuICAgICAgICBsZXQgdHJhbnNpdGlvbl9lbGVtZW50cyA9IHt9O1xyXG5cclxuICAgICAgICBpZiAocGFnZS50eXBlID09IFwibW9kYWxcIikge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy90cmFjZSBtb2RhbCBzdGFjayBhbmQgc2VlIGlmIHRoZSBtb2RhbCBhbHJlYWR5IGV4aXN0c1xyXG4gICAgICAgICAgICBpZiAoSVNfU0FNRV9QQUdFKSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlLnRyYW5zaXRpb25JbigpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBVTldJTkQgPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLm1vZGFsX3N0YWNrLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1vZGFsID0gdGhpcy5tb2RhbF9zdGFja1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoVU5XSU5EID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobW9kYWwgPT0gcGFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBVTldJTkQgPSBpICsgMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0cnMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsLnVubG9hZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHJzID0gbW9kYWwudHJhbnNpdGlvbk91dCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25fbGVuZ3RoID0gTWF0aC5tYXgodHJzLCB0cmFuc2l0aW9uX2xlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluYWxpemluZ19wYWdlcy5wdXNoKG1vZGFsKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsLmZpbmFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChVTldJTkQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsX3N0YWNrLmxlbmd0aCA9IFVOV0lORDtcclxuICAgICAgICAgICAgICAgIHBhZ2UubG9hZChnZXRNb2RhbENvbnRhaW5lcigpLCB3dXJsKTtcclxuICAgICAgICAgICAgICAgIHBhZ2UudHJhbnNpdGlvbkluKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvL2NyZWF0ZSBuZXcgbW9kYWxcclxuICAgICAgICAgICAgICAgIHRoaXMubW9kYWxfc3RhY2sucHVzaChwYWdlKTtcclxuICAgICAgICAgICAgICAgIHBhZ2UubG9hZChnZXRNb2RhbENvbnRhaW5lcigpLCB3dXJsKTtcclxuICAgICAgICAgICAgICAgIHBhZ2UudHJhbnNpdGlvbkluKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5tb2RhbF9zdGFjay5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBtb2RhbCA9IHRoaXMubW9kYWxfc3RhY2tbaV07XHJcbiAgICAgICAgICAgICAgICBsZXQgdHJzID0gMDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbW9kYWwudW5sb2FkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRycyA9IG1vZGFsLnRyYW5zaXRpb25PdXQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25fbGVuZ3RoID0gTWF0aC5tYXgodHJzLCB0cmFuc2l0aW9uX2xlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbGl6aW5nX3BhZ2VzLnB1c2gobW9kYWwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsLmZpbmFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5tb2RhbF9zdGFjay5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICAgICAgbGV0IHRycyA9IDA7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudF92aWV3ICYmIHRoaXMuY3VycmVudF92aWV3ICE9IHBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudF92aWV3LnVubG9hZCh0cmFuc2l0aW9uX2VsZW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcGFnZS5sb2FkKGFwcF9lbGUsIHd1cmwpO1xyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCB0ID0gdGhpcy5jdXJyZW50X3ZpZXcudHJhbnNpdGlvbk91dCgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZS50cmFuc2l0aW9uSW4odHJhbnNpdGlvbl9lbGVtZW50cylcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbl9sZW5ndGggPSBNYXRoLm1heCh0LCB0cmFuc2l0aW9uX2xlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuZmluYWxpemluZ19wYWdlcy5wdXNoKHRoaXMuY3VycmVudF92aWV3KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmKCF0aGlzLmN1cnJlbnRfdmlldyl7XHJcbiAgICAgICAgICAgICAgICBwYWdlLmxvYWQoYXBwX2VsZSwgd3VybCk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2UudHJhbnNpdGlvbkluKHRyYW5zaXRpb25fZWxlbWVudHMpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfdmlldyA9IHBhZ2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5maW5hbGl6ZVBhZ2VzKCk7XHJcbiAgICAgICAgfSwgKHRyYW5zaXRpb25fbGVuZ3RoKjEwMDApICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUHJlLWxvYWRzIGEgY3VzdG9tIGNvbnN0cnVjdG9yIGZvciBhbiBlbGVtZW50IHdpdGggdGhlIHNwZWNpZmllZCBpZCBhbmQgcHJvdmlkZXMgYSBtb2RlbCB0byB0aGF0IGNvbnN0cnVjdG9yIHdoZW4gaXQgaXMgY2FsbGVkLlxyXG4gICAgICAgIFRoZSBjb25zdHJ1Y3RvciBtdXN0IGhhdmUgQ29tcG9uZW50IGluIGl0cyBpbmhlcml0YW5jZSBjaGFpbi5cclxuICAgICovXHJcbiAgICBhZGRTdGF0aWMoZWxlbWVudF9pZCwgY29uc3RydWN0b3IsIG1vZGVsKSB7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRfY29uc3RydWN0b3JzW2VsZW1lbnRfaWRdID0ge1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcixcclxuICAgICAgICAgICAgbW9kZWxfbmFtZTogbW9kZWxcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhZGRNb2RlbChtb2RlbF9uYW1lLCBtb2RlbENvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5tb2RlbHNfY29uc3RydWN0b3JzW21vZGVsX25hbWVdID0gbW9kZWxDb25zdHJ1Y3RvcjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICAgIENyZWF0ZXMgYSBuZXcgaWZyYW1lIG9iamVjdCB0aGF0IGFjdHMgYXMgYSBtb2RhbCB0aGF0IHdpbGwgc2l0IG9udG9wIG9mIGV2ZXJ5dGhpbmcgZWxzZS5cclxuICAgICovXHJcbiAgICBsb2FkTm9uV2lja1BhZ2UoVVJMKSB7XHJcbiAgICAgICAgbGV0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7XHJcbiAgICAgICAgaWZyYW1lLnNyYyA9IFVSTDtcclxuICAgICAgICBpZnJhbWUuY2xhc3NMaXN0LmFkZChcIm1vZGFsXCIsIFwiY29tcF93cmFwXCIpO1xyXG4gICAgICAgIHZhciBwYWdlID0gbmV3IFBhZ2VWaWV3KFVSTCwgaWZyYW1lKTtcclxuICAgICAgICBwYWdlLnR5cGUgPSBcIm1vZGFsXCI7XHJcbiAgICAgICAgdGhpcy5wYWdlc1tVUkxdID0gcGFnZSAvL25ldyBNb2RhbChwYWdlLCBpZnJhbWUsIGdldE1vZGFsQ29udGFpbmVyKCkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2VzW1VSTF07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAgICBUYWtlcyB0aGUgRE9NIG9mIGFub3RoZXIgcGFnZSBhbmQgc3RyaXBzIGl0LCBsb29raW5nIGZvciBjb21wb25lbnQgYW5kIGFwcCBlbGVtZW50cyB0byB1c2UgdG8gaW50ZWdyYXRlIGludG8gdGhlIFNQQSBzeXN0ZW0uXHJcbiAgICAgICAgSWYgaXQgaXMgdW5hYmxlIHRvIGZpbmQgdGhlc2UgZWxlbWVudHMsIHRoZW4gaXQgd2lsbCBwYXNzIHRoZSBET00gdG8gbG9hZE5vbldpY2tQYWdlIHRvIGhhbmRsZSB3cmFwcGluZyB0aGUgcGFnZSBib2R5IGludG8gYSB3aWNrIGFwcCBlbGVtZW50LlxyXG4gICAgKi9cclxuICAgIGxvYWROZXdQYWdlKFVSTCwgRE9NLCB3dXJsKSB7XHJcbiAgICAgICAgLy9sb29rIGZvciB0aGUgYXBwIHNlY3Rpb24uXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgICBJZiB0aGUgcGFnZSBzaG91bGQgbm90IGJlIHJldXNlZCwgYXMgaW4gY2FzZXMgd2hlcmUgdGhlIHNlcnZlciBkb2VzIGFsbCB0aGUgcmVuZGVyaW5nIGZvciBhIGR5bmFtaWMgcGFnZSBhbmQgd2UncmUganVzdCBwcmVzZW50aW5nIHRoZSByZXN1bHRzLFxyXG4gICAgICAgICAgICB0aGVuIGhhdmluZyBOT19CVUZGRVIgc2V0IHRvIHRydWUgd2lsbCBjYXVzZSB0aGUgbGlua2VyIHRvIG5vdCBzYXZlIHRoZSBwYWdlIHRvIHRoZSBoYXNodGFibGUgb2YgZXhpc3RpbmcgcGFnZXMsIGZvcmNpbmcgYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgZXZlcnkgdGltZSB0aGUgcGFnZSBpcyB2aXNpdGVkLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgbGV0IE5PX0JVRkZFUiA9IGZhbHNlO1xyXG5cclxuXHJcbiAgICAgICAgLyogXHJcbiAgICAgICAgICAgIEFwcCBlbGVtZW50czogVGhlcmUgc2hvdWxkIG9ubHkgYmUgb25lLiBcclxuICAgICAgICAqL1xyXG4gICAgICAgIGxldCBhcHBfbGlzdCA9IERPTS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFwcFwiKTtcclxuXHJcbiAgICAgICAgaWYgKGFwcF9saXN0Lmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBXaWNrIGlzIGRlc2lnbmVkIHRvIHdvcmsgd2l0aCBqdXN0IG9uZSA8YXBwPiBlbGVtZW50IGluIGEgcGFnZS4gVGhlcmUgYXJlICR7YXBwX2xpc3QubGVuZ3RofSBhcHBzIGVsZW1lbnRzIGluICR7dXJsfS4gV2ljayB3aWxsIHByb2NlZWQgd2l0aCB0aGUgZmlyc3QgPGFwcD4gZWxlbWVudCBpbiB0aGUgRE9NLiBVbmV4cGVjdGVkIGJlaGF2aW9yIG1heSBvY2N1ci5gKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGFwcF9zb3VyY2UgPSBhcHBfbGlzdFswXVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgIElmIHRoZXJlIGlzIG5vIDxhcHA+IGVsZW1lbnQgd2l0aGluIHRoZSBET00sIHRoZW4gd2UgbXVzdCBoYW5kbGUgdGhpcyBjYXNlIGNhcmVmdWxseS4gVGhpcyBsaWtlbHkgaW5kaWNhdGVzIGEgcGFnZSBkZWxpdmVyZWQgZnJvbSB0aGUgc2FtZSBvcmlnaW4gdGhhdCBoYXMgbm90IGJlZW4gY29udmVydGVkIHRvIHdvcmsgd2l0aCB0aGUgV2ljayBzeXN0ZW0uXHJcbiAgICAgICAgICBUaGUgZW50aXJlIGNvbnRlbnRzIG9mIHRoZSBwYWdlIGNhbiBiZSB3cmFwcGVkIGludG8gYSA8aWZyYW1lPiwgdGhhdCB3aWxsIGJlIGNvdWxkIHNldCBhcyBhIG1vZGFsIG9uIHRvcCBvZiBleGlzdGluZyBwYWdlcy5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGlmICghYXBwX3NvdXJjZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLnRyYWNlKFwiUGFnZSBkb2VzIG5vdCBoYXZlIGFuIDxhcHA+IGVsZW1lbnQhXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkTm9uV2lja1BhZ2UoVVJMKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBhcHBfcGFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhcHBwYWdlXCIpO1xyXG4gICAgICAgIGFwcF9wYWdlLmlubmVySFRNTCA9IGFwcF9zb3VyY2UuaW5uZXJIVE1MO1xyXG5cclxuICAgICAgICB2YXIgYXBwID0gYXBwX3NvdXJjZS5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgZG9tX2FwcCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYXBwXCIpWzBdO1xyXG5cclxuICAgICAgICB2YXIgcGFnZSA9IG5ldyBQYWdlVmlldyhVUkwsIGFwcF9wYWdlKTtcclxuICAgICAgICBpZiAoYXBwX3NvdXJjZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGFwcF9zb3VyY2UuZGF0YXNldC5tb2RhbCA9PSBcInRydWVcIikge1xyXG4gICAgICAgICAgICAgICAgcGFnZS5zZXRUeXBlKFwibW9kYWxcIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibW9kYWxcIik7XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5pbm5lckhUTUwgPSBhcHAuaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICAgICAgYXBwLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBhcHAgPSBtb2RhbDtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgIElmIHRoZSBET00gaXMgdGhlIHNhbWUgZWxlbWVudCBhcyB0aGUgYWN0dWFsIGRvY3VtZW50LCB0aGVuIHdlIHNoYWxsIHJlYnVpbGQgdGhlIGV4aXN0aW5nIDxhcHA+IGVsZW1lbnQsIGNsZWFyaW5nIGl0IG9mIGl0J3MgY29udGVudHMuXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKERPTSA9PSBkb2N1bWVudCAmJiBkb21fYXBwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld19hcHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXBwXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVwbGFjZUNoaWxkKG5ld19hcHAsIGRvbV9hcHApO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbV9hcHAgPSBuZXdfYXBwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoYXBwLmRhdGFzZXQubm9fYnVmZmVyID09IFwidHJ1ZVwiKVxyXG4gICAgICAgICAgICAgICAgTk9fQlVGRkVSID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGFwcF9wYWdlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZWxlbWVudFwiKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZWxlID0gZWxlbWVudHNbaV0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXF1aXZpbGFudF9lbGVtZW50X2Zyb21fbWFpbl9kb20gPSBlbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lja19lbGVtZW50O1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudF9pZCA9IGVsZS5pZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGFnZS50eXBlICE9PSBcIm1vZGFsXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2lja19lbGVtZW50ID0gbmV3IEVsZW1lbnQoZWxlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IGVsZS5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZWxlX3dyYXBcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpY2tfZWxlbWVudCA9IG5ldyBFbGVtZW50KGVsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcGFnZS5lbGVtZW50cy5wdXNoKHdpY2tfZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbXBvbmVudHNbZWxlbWVudF9pZF0pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzW2VsZW1lbnRfaWRdID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgd2lja19lbGVtZW50LnNldENvbXBvbmVudHModGhpcy5jb21wb25lbnRzW2VsZW1lbnRfaWRdLCB0aGlzLm1vZGVsc19jb25zdHJ1Y3RvcnMsIHRoaXMuY29tcG9uZW50X2NvbnN0cnVjdG9ycywgdGhpcy5wcmVzZXRzLCBET00sIHd1cmwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQgPT0gRE9NKVxyXG4gICAgICAgICAgICAgICAgZG9tX2FwcC5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHBhZ2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoIU5PX0JVRkZFUikgdGhpcy5wYWdlc1tVUkxdID0gcmVzdWx0O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgTGlua2VyLFxyXG4gICAgVVJMXHJcbn0iLCIvKipcclxuXHRMaWdodCBpdCB1cCFcclxuKi9cclxuaW1wb3J0IHtcclxuICAgIFdVUkxcclxufSBmcm9tIFwiLi9saW5rZXIvd3VybFwiXHJcbmltcG9ydCB7XHJcbiAgICBWaWV3XHJcbn0gZnJvbSBcIi4vdmlld1wiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQW55TW9kZWwsXHJcbiAgICBBcnJheU1vZGVsQ29udGFpbmVyLFxyXG4gICAgQlRyZWVNb2RlbENvbnRhaW5lcixcclxuICAgIE11bHRpSW5kZXhlZENvbnRhaW5lcixcclxuICAgIE1vZGVsLFxyXG4gICAgTW9kZWxDb250YWluZXJcclxufSBmcm9tIFwiLi9tb2RlbC9tb2RlbFwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQ29udHJvbGxlclxyXG59IGZyb20gXCIuL2NvbnRyb2xsZXJcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIEdldHRlclxyXG59IGZyb20gXCIuL2dldHRlclwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgU2V0dGVyXHJcbn0gZnJvbSBcIi4vc2V0dGVyXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBMaW5rZXIsXHJcbiAgICBVUkxcclxufSBmcm9tIFwiLi9saW5rZXIvbGlua2VyXCJcclxuXHJcbmltcG9ydCAqIGFzIEFuaW1hdGlvbiBmcm9tIFwiLi9hbmltYXRpb24vYW5pbWF0aW9uXCJcclxuXHJcbmltcG9ydCAqIGFzIENvbW1vbiBmcm9tIFwiLi9jb21tb25cIlxyXG5cclxubGV0IHdpY2tfdmFuaXR5ID0gXCJcXCBcXChcXCBcXCBcXChcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXClcXG5cXCBcXClcXFxcXFwpXFwpXFwoXFwgXFwgXFwgXFwnXFwgXFwoXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwoXFwgXFwvXFwoXFxuXFwoXFwoXFxfXFwpXFwoXFwpXFxcXFxcIFxcKVxcIFxcIFxcKVxcXFxcXCBcXCBcXCBcXCBcXChcXCBcXCBcXCBcXCBcXClcXFxcXFwoXFwpXFwpXFxuXFxfXFwoXFwoXFwpXFwpXFxcXFxcX1xcKVxcKFxcKVxcKFxcKFxcX1xcKVxcIFxcIFxcIFxcKVxcXFxcXCBcXCBcXChcXChcXF9cXClcXFxcXFxuXFxcXFxcIFxcXFxcXChcXChcXF9cXClcXC9cXCBcXC9cXCBcXChcXF9cXClcXCBcXCBcXChcXChcXF9cXClcXCBcXHxcXCBcXHxcXChcXF9cXClcXG5cXCBcXFxcXFwgXFxcXFxcL1xcXFxcXC9cXCBcXC9cXCBcXCBcXHxcXCBcXHxcXCBcXC9cXCBcXF9cXHxcXCBcXCBcXHxcXCBcXC9cXCBcXC9cXG5cXCBcXCBcXFxcXFxfXFwvXFxcXFxcX1xcL1xcIFxcIFxcIFxcfFxcX1xcfFxcIFxcXFxcXF9cXF9cXHxcXCBcXCBcXHxcXF9cXFxcXFxfXFxcXFxcblwiO1xyXG5cclxuaW1wb3J0IHtcclxuICAgIEN1c3RvbUNhc2VcclxufSBmcm9tIFwiLi9jYXNlL2Nhc2VcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIFJpdmV0XHJcbn0gZnJvbSBcIi4vY2FzZS9yaXZldFwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQ2FzZUNvbnN0cnVjdG9yXHJcbn0gZnJvbSBcIi4vY2FzZS9jYXNlX2NvbnN0cnVjdG9yXCJcclxuXHJcbmltcG9ydHtcclxuICAgIEZpbHRlclxyXG59IGZyb20gXCIuL2Nhc2UvY2Fzc2V0dGUvZmlsdGVyXCJcclxuXHJcbmltcG9ydHtcclxuICAgIEZvcm1cclxufSBmcm9tIFwiLi9jYXNlL2Nhc3NldHRlL2Zvcm1cIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIENhc3NldHRlXHJcbn0gZnJvbSBcIi4vY2FzZS9jYXNzZXR0ZS9jYXNzZXR0ZVwiXHJcblxyXG5pbXBvcnQge1xyXG4gICAgU2NoZW1hVHlwZSxcclxuICAgIHNjaGVtYVxyXG59IGZyb20gXCIuL3NjaGVtYS9zY2hlbWFzXCJcclxuXHJcbmxldCBMSU5LRVJfTE9BREVEID0gZmFsc2U7XHJcbmxldCBERUJVR0dFUiA9IHRydWU7XHJcblxyXG4vKipcclxuICogICAgQ3JlYXRlcyBhIG5ldyB7TGlua2VyfSBpbnN0YW5jZSwgcGFzc2luZyBhbnkgcHJlc2V0cyBmcm9tIHRoZSBjbGllbnQuXHJcbiAqICAgIEl0IHdpbGwgdGhlbiB3YWl0IGZvciB0aGUgZG9jdW1lbnQgdG8gbG9hZCwgYW5kIG9uY2UgbG9hZGVkLCB3aWxsIHN0YXJ0IHRoZSBsaW5rZXIgYW5kIGxvYWQgdGhlIGN1cnJlbnQgcGFnZSBpbnRvIHRoZSBsaW5rZXIuXHJcbiAqXHJcbiAqICAgIE5vdGU6IFRoaXMgZnVuY3Rpb24gc2hvdWxkIG9ubHkgYmUgY2FsbGVkIG9uY2UuIEFueSBzdWJzZXF1ZW50IGNhbGxzIHdpbGwgbm90IGRvIGFueXRoaW5nLlxyXG4gKlxyXG4gKiAgICBAcGFyYW0ge0xpbmtlclByZXNldHN9IHByZXNldHMgLSBBbiBvYmplY3Qgb2YgdXNlciBkZWZpbmVkIFdpY2sgb2JqZWN0cy5cclxuICovXHJcblxyXG5mdW5jdGlvbiBsaWdodChwcmVzZXRzKSB7XHJcbiAgICBpZiAoREVCVUdHRVIpIGNvbnNvbGUubG9nKHByZXNldHMpXHJcblxyXG4gICAgaWYgKExJTktFUl9MT0FERUQpIHJldHVybjtcclxuXHJcbiAgICBMSU5LRVJfTE9BREVEID0gdHJ1ZTtcclxuXHJcbiAgICAvL1Bhc3MgaW4gdGhlIHByZXNldHMgb3IgYSBwbGFpbiBvYmplY3QgaWYgcHJlc2V0cyBpcyB1bmRlZmluZWQuXHJcblxyXG4gICAgbGV0IGxpbmsgPSBuZXcgTGlua2VyKHByZXNldHMgfHwge30pO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XHJcbiAgICAgICAgbGluay5sb2FkUGFnZShcclxuICAgICAgICAgICAgbGluay5sb2FkTmV3UGFnZShkb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZSwgZG9jdW1lbnQpLFxyXG4gICAgICAgICAgICBuZXcgV1VSTChkb2N1bWVudC5sb2NhdGlvbiksXHJcbiAgICAgICAgICAgIGZhbHNlXHJcbiAgICAgICAgKTtcclxuICAgIH0pXHJcblxyXG4gICAgY29uc29sZS5sb2coYCR7d2lja192YW5pdHl9Q29weXJpZ2h0IDIwMTggQW50aG9ueSBDIFdlYXRoZXJzYnlcXG5odHRwczovL2dpdGxhYi5jb20vYW50aG9ueWN3ZWF0aGVyc2J5L3dpY2tgKVxyXG59XHJcblxyXG4vKioqIEV4cG9ydHMgKioqL1xyXG5cclxuZXhwb3J0IHtcclxuICAgIFVSTCxcclxuICAgIEFuaW1hdGlvbixcclxuICAgIEFycmF5TW9kZWxDb250YWluZXIsXHJcbiAgICBCVHJlZU1vZGVsQ29udGFpbmVyLFxyXG4gICAgTXVsdGlJbmRleGVkQ29udGFpbmVyLFxyXG4gICAgQ29udHJvbGxlcixcclxuICAgIEN1c3RvbUNhc2UsXHJcbiAgICBSaXZldCxcclxuICAgIENhc2VDb25zdHJ1Y3RvcixcclxuICAgIENhc3NldHRlLFxyXG4gICAgRm9ybSxcclxuICAgIEZpbHRlcixcclxuICAgIENvbW1vbixcclxuICAgIEdldHRlcixcclxuICAgIExpbmtlcixcclxuICAgIE1vZGVsLFxyXG4gICAgQW55TW9kZWwsXHJcbiAgICBNb2RlbENvbnRhaW5lcixcclxuICAgIFNldHRlcixcclxuICAgIFZpZXcsXHJcbiAgICBsaWdodCxcclxuICAgIFNjaGVtYVR5cGUsXHJcbiAgICBzY2hlbWFcclxufSJdLCJuYW1lcyI6WyJzY2hlbWEiLCJDYXNlIiwiQVNULlJvb3QiLCJBU1QuVGFwTm9kZSIsIkFTVC5GaWx0ZXJOb2RlIiwiQVNULlRlcm1Ob2RlIiwiQVNULkNhc2VOb2RlIiwiQVNULlBpcGVOb2RlIiwiQVNULkdlbmVyaWNOb2RlIiwiRWxlbWVudCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUksVUFBVSxHQUFHO0lBQ2IsSUFBSSxFQUFFLEVBQUU7SUFDUixJQUFJLEVBQUUsRUFBRTtDQUNYLENBQUM7O0FBRUYsTUFBTSxLQUFLLENBQUM7SUFDUixXQUFXLENBQUMsU0FBUyxFQUFFO1FBQ25CLElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDOztRQUVwQixJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7UUFFOUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7O1FBRWpCLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxVQUFVLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssYUFBYSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxFQUFFO1lBQ3pILElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUMvQjtLQUNKOztJQUVELEtBQUssRUFBRTtRQUNILElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ3BCOztJQUVELElBQUksR0FBRztRQUNILElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNyQjs7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLElBQUksQ0FBQztRQUM3QixHQUFHO1lBQ0MsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQy9CLFFBQVEsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxVQUFVLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssYUFBYSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxFQUFFOztRQUUvSCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDWixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDckI7UUFDRCxPQUFPLElBQUksQ0FBQztLQUNmOztJQUVELE1BQU0sQ0FBQyxJQUFJLEVBQUU7UUFDVCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOztRQUUvRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7OztRQUduQyxJQUFJLElBQUksRUFBRTtZQUNOLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNmLElBQUk7WUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEU7O1FBRUQsT0FBTyxJQUFJLENBQUM7S0FDZjs7SUFFRCxJQUFJLEdBQUc7UUFDSCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDWCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDcEI7O1FBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDOztRQUUzQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLFVBQVUsQ0FBQzs7UUFFbEMsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxJQUFJ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LENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDOztRQUV0RSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7UUFFeEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7O1FBRTVCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUN0Qjs7SUFFRCxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQztRQUNyQixHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsR0FBRyxJQUFJLENBQUM7O1FBRWxDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDOzs7UUFHeEMsT0FBTyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztLQUNqRDs7Q0FFSjs7QUNsRUQ7OztBQUdBLE1BQU0sSUFBSTtDQUNULFdBQVcsRUFBRTtFQUNaLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0VBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0VBQ2xCOztDQUVELFVBQVUsRUFBRTtFQUNYLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztHQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzVCO0VBQ0Q7Ozs7Q0FJRCxNQUFNLENBQUMsSUFBSSxDQUFDOztFQUVYOzs7O0NBSUQsT0FBTyxDQUFDLElBQUksQ0FBQzs7RUFFWjs7Ozs7Q0FLRCxLQUFLLENBQUMsSUFBSSxDQUFDOztFQUVWO0NBQ0QsUUFBUSxDQUFDLEtBQUssQ0FBQztFQUNkOztDQUVELEtBQUssRUFBRTs7RUFFTjtDQUNELFVBQVUsRUFBRTtFQUNYLElBQUks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V0FBVyxHQUFHO1FBQ1YsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsSUFBSSxLQUFLLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQztRQUNqRixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUM7UUFDakYsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUs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QUFDLENBQUM7R0FDaEIsT0FBTztHQUNQO0VBQ0Q7O0NBRUQsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQzFCLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQztDQUN2QixJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDMUIsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDO0NBQ3ZCLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUMxQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7Q0FDdkIsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQzFCLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQztDQUN2QixJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDMUIsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDO0NBQ3ZCLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUMxQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7Q0FDdkIsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQzFCLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQztDQUN2QixJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDMUIsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDOztDQUV2QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDWCxPQUFPLElBQUksTUFBTTtHQUNoQixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztHQUNYLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0dBQ1gsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7R0FDWCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztHQUNYLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0dBQ1gsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7R0FDWCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztHQUNYLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0dBQ1g7RUFDRDs7Q0FFRCxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQ04sT0FBTyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3BEOztDQUVELElBQUksQ0FBQyxDQUFDLENBQUM7RUFDTixPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDcEQ7O0NBRUQsS0FBSyxDQUFDLENBQUMsRUFBRTtFQUNSLE9BQU8sSUFBSSxPQUFPO0dBQ2pCLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQzVDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQzVDO0VBQ0Q7Ozs7Ozs7O0NBUUQsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtFQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0dBQ25DLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7R0FDbEMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztHQUMxQixDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzs7RUFFWixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO0dBQzFCLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQztHQUNWLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUU7R0FDN0MsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDO0dBQ1YsWUFBWSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7OztFQUd2QyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7OztFQUdoQyxJQUFJLFlBQVksR0FBRyxDQUFDLEVBQUU7R0FDckIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNmLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7SUFDdEIsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoQixNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDcEMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDbEIsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDbEIsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7R0FDZixLQUFLLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUNsQyxLQUFLLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDN0MsS0FBSyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQzdDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztHQUM1Qjs7O0VBR0QsSUFBSSxZQUFZLEtBQUssQ0FBQyxFQUFFO0dBQ3ZCLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0dBQzVDLEtBQUssR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDdkIsS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDcEIsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7R0FDckI7OztFQUdELElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztFQUM1QixFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztFQUN2QixFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztFQUN2QixLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3hCLE9BQU8sQ0FBQyxLQUFLLENBQUM7RUFDZDs7Q0FFRCxNQUFNLEdBQUc7RUFDUixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2xEOztDQUVELE1BQU0sR0FBRztFQUNSLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDbEQ7O0NBRUQsT0FBTyxDQUFDLENBQUMsQ0FBQztFQUNULElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0dBQ3pFLElBQUksR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksR0FBRyxFQUFFLEdBQUcsQ0FBQztHQUMxQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7R0FDaEQsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxJQUFJLEVBQUU7R0FDL0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7R0FDdkIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0dBQ1gsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7R0FDeEIsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFO0dBQ1gsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztHQUNqRCxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUc7R0FDWixZQUFZLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQzs7O0VBR3ZDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUM7Ozs7O0VBS2pCLElBQUksWUFBWSxHQUFHLENBQUMsRUFBRTtHQUNyQixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2YsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztJQUN0QixDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNwQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNsQixJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNsQixFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztHQUNmLElBQUksR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUM1QyxLQUFLLElBQUksWUFBWSxLQUFLLENBQUMsRUFBRTtHQUM3QixFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztHQUM1QyxJQUFJLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztHQUNwQixJQUFJO0dBQ0osSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDOztHQUU1QixFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztHQUN2QixFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztHQUN2QixJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0dBQ3hCOztFQUVELE9BQU8sS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFD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LEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7R0FDdEUsTUFBTTtHQUNOO0VBQ0Q7Q0FDRDs7QUFFRCxLQUFLLENBQUMsTUFBTSxHQUFHO0NBQ2QsYUFBYSxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQztDQUNoRCxPQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDO0NBQzFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztDQUM1QixPQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7Q0FDOUIsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDO0NBQzdCLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN4QixPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDL0IsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQy9CLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6QixNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDMUIsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0VBQzFCLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztFQUM5QixNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDNUIsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQzVCLFNBQVMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztFQUMvQixTQUFTLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7RUFDL0IsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ2hDLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUM5QixRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDNUIsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQzdCLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztFQUMzQixRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7RUFDOUIsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQzVCLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztFQUMxQixRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDNUIsVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzlCLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztFQUM3QixXQUFXLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7RUFDakMsU0FBUyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0VBQy9CLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6QixRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7RUFDOUIsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0VBQzlCLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztFQUNsQyxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDckMsYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ3JDLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNoQyxjQUFjLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDdEMsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQ2pDLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztFQUNuQyxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDOUIsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQzVCLGlCQUFpQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0VBQ3hDLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztFQUNuQyxpQkFBaUIsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUN6QyxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDcEMsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQy9CLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztFQUM3QixRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDOUIsY0FBYyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0VBQ3JDLGtCQUFrQixFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0VBQ3hDLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztFQUNuQyxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDbEMsYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQ25DLGNBQWMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztFQUNyQyxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDaEMsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQzNCLGNBQWMsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztFQUNwQyxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDMUIsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0VBQ2xDLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNyQyxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDcEMsZ0JBQWdCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDeEMscUJBQXFCLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDM0MsY0FBYyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ3BDLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztFQUNqQyxvQkFBb0IsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUM1QyxrQkFBa0IsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUN6QyxpQkFBaUIsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUN4QyxpQkFBaUIsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztFQUN0QyxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDNUIsV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ2pDLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUM1QixNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDNUIsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ3BDLGdCQUFnQixFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ3RDLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNsQyxrQkFBa0IsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUN6QyxnQkFBZ0IsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUN4QyxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDckMsYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ3JDLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNuQyxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDbkMsa0JBQWtCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDMUMsZUFBZSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ3JDLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNwQyxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDcEMsVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ2xDLGdCQUFnQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ3hDLGVBQWUsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztFQUNyQyxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7RUFDMUIsV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0VBQy9CLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztFQUNqQyxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7RUFDMUIsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ25DLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztFQUNwQyxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7RUFDN0IsaUJBQWlCLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7RUFDdkMsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDO0VBQ25DLG1CQUFtQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQzNDLGVBQWUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUN2QyxjQUFjLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7RUFDcEMsYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0VBQ25DLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztFQUNwQyxlQUFlLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7RUFDdEMsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0VBQzlCLFNBQVMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNqQyxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDOUIsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ2hDLFNBQVMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztFQUMvQixTQUFTLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7RUFDL0IsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ2hDLG1CQUFtQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDO0VBQzFDLGlCQUFpQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ3pDLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztFQUNsQyxVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDbEMsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ3BDLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUM5QixlQUFlLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDdkMsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQy9CLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNoQyxpQkFBaUIsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUN6QyxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDL0IsV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ25DLGVBQWUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUN2Qyx5QkFBeUIsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNqRCxjQUFjLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDdEMsY0FBYyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0VBQ3BDLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztFQUM5QixXQUFXLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7RUFDbEMsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0VBQzdCLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztFQUNwQyxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDcEMsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQzdCLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNwQyxVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDbEMsY0FBYyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ3RDLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNwQyxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDcEMsZ0JBQWdCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDeEMsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQy9CLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNsQyxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDckMsV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ25DLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNwQyxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDcEMsa0JBQWtCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDMUMsa0JBQWtCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDMUMsVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ2xDLGNBQWMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUN0QyxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDcEMsYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ3JDLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNsQyxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDL0IsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQy9CLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUM5QixPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDekIsVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ2xDLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNsQyxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDOUIsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQzlCLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNuQyxXQUFXLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDbkMsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ2hDLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNwQyxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDcEMsV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ25DLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNyQyxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Q0FDaEM7O0FDL1NELElBQUksUUFBUSxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUUzQyxJQUFJLENBQUMscUJBQXFCO0lBQ3RCLHFCQUFxQixHQUFHLENBQUMsQ0FBQyxLQUFLO1FBQzNCLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7TUFDdkI7O0FBRUwsTUFBTSxPQUFPLENBQUM7SUFDVixXQUFXLENBQUMsT0FBTyxFQUFFOztRQUVqQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQzs7UUFFM0MsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztRQUNwRyxJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDNUYsSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzs7UUFHMUYsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzs7OztRQUl4QixJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztRQUVoQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7S0FFMUI7O0lBRUQsVUFBVSxHQUFHO1FBQ1QsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7S0FDckI7O0lBRUQsS0FBSyxHQUFHO1FBQ0osSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztLQUNsQzs7SUFFRCxHQUFHLEdBQUc7UUFDRixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0tBQ2xDO0NBQ0o7O0FBRUQsTUFBTSxLQUFLLFNBQVMsT0FBTyxDQUFDO0lBQ3hCLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO1FBQ3ZCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQzs7UUFFZixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7UUFFakIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7UUFFekQsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQztRQUMzRCxJQUFJLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7OztRQUl6RCxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQ2xELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLGtCQUFrQixFQUFFLENBQUM7O1FBRWpELElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDM0YsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7UUFFMUYsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQzs7UUFFbkMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNyQyxJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQztRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQzs7UUFFakMsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDM0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDOzs7S0FHbEY7O0lBRUQsVUFBVSxHQUFHO1FBQ1QsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1gsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ3RCOztJQUVELEtBQUssR0FBRztRQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztRQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztLQUN2RDs7SUFFRCxJQUFJLEdBQUc7UUFDSCxJQUFJLENBQUMsQ0FBQyxHQUFFOztZQUVKLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzs7UUFFL0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sS0FBSyxDQUFDOztRQUV4QixJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOztRQUVoQyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQzs7UUFFekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUMvRixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25HLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO1FBQzdGLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO1FBQ2pHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7UUFFN0csUUFBUSxDQUFDLEdBQUcsU0FBUyxFQUFFO0tBQzFCOztJQUVELEdBQUcsR0FBRztRQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFF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QUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7WUFFbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7O1lBRXRCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7WUFFbkIsT0FBTyxLQUFLLENBQUM7U0FDaEIsRUFBQztLQUNMOztJQUVELFVBQVUsR0FBRzs7S0FFWjs7SUFFRCxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ2IsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSztZQUN0QixRQUFRO1lBQ1IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRO2dCQUNsQixNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxTQUFTLEVBQUUsRUFBRSxlQUFlLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUN4RixLQUFLO2FBQ1IsQ0FBQztTQUNMLEVBQUM7S0FDTDs7SUFFRCxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ2IsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSztZQUN0QixRQUFRO1lBQ1IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRO2dCQUNsQixNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxTQUFTLEVBQUUsRUFBRSxlQUFlLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUN4RixLQUFLO2FBQ1IsQ0FBQztTQUNMLEVBQUM7S0FDTDs7SUFFRCxJQUFJLENBQUMsS0FBSyxFQUFFOztRQUVSLElBQUksS0FBSztZQUNMLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQzs7UUFFL0IsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNyQjs7SUFFRCxNQUFNLENBQUMsSUFBSSxFQUFFOztLQUVaOztJQUVELE1BQU0sR0FBRzs7UUFFTCxJQUFJLEdB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
