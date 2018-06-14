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
        d.setMilliseconds(0)

        rval.start = d.valueOf();
        d.setDate(d.getDate() + 1);
        d.setSeconds(-1);
        rval.end = d.valueOf();
    }

    return rval;
}

export {
    GetDayStartAndEnd
}