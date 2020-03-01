export var WickComponentErrorCode;
(function (WickComponentErrorCode) {
    /**
    * This error occurs when an attempt to retrieve a network resource fails.
    */
    WickComponentErrorCode[WickComponentErrorCode["FAILED_TO_FETCH_RESOURCE"] = 0] = "FAILED_TO_FETCH_RESOURCE";
    /**
     * This error occurs when parsing of a wick component fails due to incorrect syntax.
     */
    WickComponentErrorCode[WickComponentErrorCode["SYNTAX_ERROR_DURING_PARSE"] = 1] = "SYNTAX_ERROR_DURING_PARSE";
})(WickComponentErrorCode || (WickComponentErrorCode = {}));
