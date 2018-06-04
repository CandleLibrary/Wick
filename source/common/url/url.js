function TurnDataIntoQuery(data) {
    var str = "";

    if (arguments.length > 1)
        for (var i = 0; i < arguments.length; i++) {
            data = arguments[i];

            if (data.component) {
                var new_str = `${data.component}&`;

                for (var a in data)
                    new_str += (a != "component") ? `${a}=${data[a]}\&` : "";

                str += new_str.slice(0, -1) + ".";
            }
        }
    else
        for (var a in data)
            str += `${a}=${data[a]}\&`;

    return str.slice(0, -1);
}

function TurnQueryIntoData(query) {
    var out = {};

    let t = query.split(".");

    if (t.length > 0)
        t.forEach((a) => {
            var t = {};
            if (a.length > 1) {
                a.split("&").forEach((a, i) => {
                    if (i < 1) out[a] = t;
                    else {
                        let b = a.split("=");
                        out[b[0]] = b[1];
                    }
                })
            }
        })
    else {
        query.split("&").forEach((a) => {
            let b = a.split("=");
            out[b[0]] = b[1]
        });
    }



    return out;
}

export {
    TurnQueryIntoData,
    TurnDataIntoQuery
}
