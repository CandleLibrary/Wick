/**[testing]
 *
 */

import wick from "@candlefw/wick";

const comp = await wick("./test_component.wick");

assert(wick.utils.parse.RenderPage(comp) == "");