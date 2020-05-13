import "./child.jsx";

import { grab as getObject } from "@api";

import { test } from "@model";

// import anim from "@candlefw/glow"; // <-- stored in presets as an import object. 


var local_data = 0;

function testA() {
    local_data = getObject(test);
}

export default <div component="parent">

    <style>
        #div {color:red}
        div {color:red}
    </style>

    <container data="((getObject( local_data)))" onclick="((testA))" filter="(( m1.length > 1 ))">
        <div export="update" import="update" />
    </container>

    <child onclick="((local_data+=1))" import="local_datum:local_data" export="local_data:datum, douglas"></child>
    <child export="mog:update, alpha:douglas"></child>
</div >;