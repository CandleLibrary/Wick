const 
    regFNHead = /([^=]*\=\>\s*\{?)|(function[^\{]*{)/,
    regFNTail = /\}$/,
	getFunctionBodyString = fn => fn.toString().replace(regFNHead, "").replace(regFNTail, "").trim();

export {getFunctionBodyString};
