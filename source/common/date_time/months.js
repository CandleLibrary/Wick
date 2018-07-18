/**
 * 12 Months of the year stored as objects in an array.
 * 
 * @property months
 * @type       {Array}
 * @memberof module:wick.core.common
 */
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
}]

export {months}