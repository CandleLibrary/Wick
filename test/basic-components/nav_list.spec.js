import wick from "@candlefw/wick";
import { getClassString } from "../test-tools/tools.js";

const source = `

var nav_links = { 
    data: [ 
        {header: "A", entries:[{value:"C", href:"F"}, {value:"I", href:"L"}, {value:"O", href:"P"}, {value:"Q", href:"R"}, {value:"S", href:"T"}] },
        {header: "A", entries:[{value:"D"}, {value:"G"},{value:"J"}, {value:"M"}] },
        {header: "A", entries:[{value:"E"}, {value:"H"},{value:"K", href:"N"}] },
    ]
}


 export default <div>
    <container class="nav-links" data=\${nav_links} ele=ul>
        <li class="nav-link">  
            \${header}

            <div class="nav-menu">
                <container data=\${entries}>
                    <li>
                        <a href=\${href}>\${value}</a>
                    </li>
                </container>
            </div>          
        </li>
    </container>

    
</div>
 `;

assert_group("Clicker component updates button's innerHTML", browser, sequence, () => {

    wick.utils.enableTest();

    const model = { limit: 1 };

    const comp = await(await wick(source)).mount(model, document.body);

    await comp.sleep();

    assert(comp.getFirstMatch("ul") != null);

    assert(comp.getNumberOfMatches("a") == 12);
    assert(comp.getNumberOfMatches("li") == 15);

});