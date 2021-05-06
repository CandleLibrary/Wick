import wick from "@candlefw/wick";

const comp_data = await wick("./component.wick");

const comp = new comp_data.class();

assert(browser, comp_data.errors[0].lexer.errorMessage() == "");

assert(browser, comp.ele.tagName !== "ERROR");

