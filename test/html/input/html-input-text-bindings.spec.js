/**[API]:testing 
    Test for two-way binding between a text input and a model data. 

    Reference Info:S
    https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
    https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/oninput
*/

import wick from "@candlelib/wick";
import spark from "@candlelib/spark";

// Bindings should be two-way on input elements [value] attribute 
// by default

// hidden	        Hidden	        An arbitrary string	n/a
// text	            Text	        Text with no line breaks	A text control
// search	        Search	        Text with no line breaks	Search control
// tel	            Telephone	    Text with no line breaks	A text control
// url	            URL	            An absolute URL	A text control
// email	        Email	        An email address or list of email addresses	A text control
// password	        Password	    Text with no line breaks (sensitive information)	A text control that obscures data entry
// date	            Date	        A date (year, month, day) with no time zone	A date control
// month            Month	        A date consisting of a year and a month with no time zone	A month control
// week	            Week	        A date consisting of a week-year number and a week number with no time zone	A week control
// time	            Time	        A time (hour, minute, seconds, fractional seconds) with no time zone	A time control
// datetime-local	Local Date and Time	
//                                  A date and time (year, month, day, hour, minute, second, fraction of a second) with no time zone	A date and time control
// number	        Number	        A numerical value	A text control or spinner control
// range	        Range	        A numerical value, with the extra semantic that the exact value is not important	A slider control or similar
// color	        Color	        An sRGB color with 8-bit red, green, and blue components	A color picker
// checkbox	        Checkbox	    A set of zero or more values from a predefined list	A checkbox
// radio	        Radio Button	An enumerated value	A radio button
// file	            File Upload     Zero or more files each with a MIME type and optionally a filename	A label and a button
// submit	        Submit Button	An enumerated value, with the extra semantic that it must be the last value selected and initiates form submission	A button
// image	        Image Button	A coordinate, relative to a particular image's size, with the extra semantic that it must be the last value selected and initiates form submission	Either a clickable image, or a button
// reset	        Reset Button	n/a	A button
// button           Button

const comp = await wick(`
import {data} from "@model";
export default <div>
    <input type="text" value={data}/>
    <div>{ data == "test2" ? "yes" : "no" }</div>
</div>`);
assert_group("Text Input - Browser", sequence, browser, () => {

    const model = { data: "test" };

    const instance = await comp.mount(model, document.body);

    await spark.sleep(10);

    assert(instance.ele.children[0].value == "test");
    assert(instance.ele.children[1].innerHTML == "no");

    instance.ele.children[0].value = "test2";
    instance.ele.children[0].dispatchEvent(new Event("input"));

    //Updates text from input change
    assert("Model updated from input event.", model.data == "test2");

    await spark.sleep(100);

    assert("Binding with model dependency updated from input event.", instance.ele.children[1].innerHTML == "yes");

    model.data = "test3";

    await spark.sleep(400);

    assert("Input value changed from an update to the observed model", instance.ele.children[0].value == "test3");

});



