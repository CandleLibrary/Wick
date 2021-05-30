import { JSNodeType } from "@candlelib/js";
import { getExtendTypeVal } from "./extended_types.js";


export const
    BindingIdentifierBinding = getExtendTypeVal("binding-id", JSNodeType.IdentifierBinding),
    BindingIdentifierReference = getExtendTypeVal("ref-id", JSNodeType.IdentifierReference);
