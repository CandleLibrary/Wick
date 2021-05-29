import { CSSNodeType } from "@candlelib/css";
import { JSNodeType } from "@candlelib/js";
import { HTMLNodeType } from "../../types/all.js";

type ExtendedType = CSSNodeType | JSNodeType | HTMLNodeType;

const extended_types = new Map();
/**
 * Registers an extended type name and/or retrieve its type value, 
 * which is an integer in the range 1<<32 - (21^2-1)<<32. 
 * 
 * This value can be used to replace a node's type value with the
 * custom type value while parsing, and used as reference when building
 * hooks resolvers. 
 * 
 * @param type_name 
 * @returns 
 */
export function getExtendTypeVal(type_name: string, original_type: JSNodeType | CSSNodeType | HTMLNodeType = 0): ExtendedType {
    const universal_name = type_name.toLocaleLowerCase();

    if (extended_types.has(universal_name))
        return extended_types.get(universal_name);
    else {
        extended_types.set(universal_name, (extended_types.size + 1) << 32 | original_type);
        return getExtendTypeVal(type_name);
    }
}

export function Is_Extend_Type(type: ExtendedType): type is ExtendedType {
    return (0xFFFFFFFF & type) != type;
}

export function getOriginalTypeOfExtendedType(type: ExtendedType): CSSNodeType | JSNodeType | HTMLNodeType {
    return 0xFFFFFFFF & type;
}
/**

registerTypeHandler(
    getExtendTypeVal("watch-call"),
    function (node, element_index, addHookResolver) {
        return node;
    },
    function (node, element_index,) {
        return node;
    }
);
 */