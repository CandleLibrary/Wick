import {Lexer} from "../string_parsing/lexer"
import {Tokenizer} from "../string_parsing/tokenizer"



/**
URL Query Syntax

root => [root_class [& classes]]

root_class = key_list

class_list [class [& class_list]]

class => name & key_list

key_list => [key_val [& key_list]]

key_val => name = val

name => ALPHANUMERIC_ID

val => NUMBER
    => ALPHANUMERIC_ID
*/
function QueryParse(query){

  let mapped_object = new Map;

  if(!query instanceof String){
    console.warn("query argument provided is not a string!")
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
        let val = lex.token.text;
        map.set(key, val);
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

    map[null] = new Map();

    key_val_list(lex, map[null]);

    while(lex.token && lex.token.text =="&"){
      lex.next();
      class_(lex, map)
    }
  }

  root(lex, mapped_object);
  return mapped_object;
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
                })
            }
        })
    else {
        query.split("&").forEach((a) => {
            let b = a.split("=");
            out[b[0]] = b[1]
        });
    }



    return out;
}

export {
    TurnQueryIntoData,
    TurnDataIntoQuery,
    QueryParse
}
