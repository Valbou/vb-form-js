class TestError extends Error {}


function assertEqual(a, b, message="") {
    if(a != b) {
        throw new TestError(message || a+" is not equal to "+b);
    }
}

function assertNotEqual(a, b, message="") {
    if(a == b) {
        throw new TestError(message || a+" is not equal to "+b);
    }
}

function assertGreater(a, b, message="") {
    if(a <= b) {
        throw new TestError(message || a+" is not greater to "+b);
    }
}

function assertGreaterEqual(a, b, message="") {
    if(a < b) {
        throw new TestError(message || a+" is not greater equal to "+b);
    }
}

function assertLower(a, b, message="") {
    if(a >= b) {
        throw new TestError(message || a+" is not lower to "+b);
    }
}

function assertLowerEqual(a, b, message="") {
    if(a > b) {
        throw new TestError(message || a+" is not lower equal to "+b);
    }
}

function assertTrue(a, message="") {
    if(!a) {
        throw new TestError(message || a+" is not true");
    }
}

function assertFalse(a, message="") {
    if(a) {
        throw new TestError(message || a+" is not false");
    }
}

function assertIn(a, list, message="") {
    if(list.indexOf(a) < 0) {
        throw new TestError(message || a+" is not in the list");
    }
}

function assertNotNull(a, message="") {
    if(a == null) {
        throw new TestError(message || a.name+" is null");
    }
}

function assertIsInstance(a, type, message="") {
    if(!(a instanceof type)) {
        throw new TestError(message || a+" is not an instance of "+type.name);
    }
}

function assertRaise(typeError, func, message="") {
    try {
        func();
    }
    catch (e) {
        if (!(e instanceof typeError)) {
            throw new TestError(message || func.name+" throw a "+typeError.name+" exception");
        }
    }
    throw new TestError(message || func.name+" does not throw an exception");
}


class TestsRunner {
    constructor() {
        this.testsList = []
        this.results = []
    }

    addAllTests(all_tests) {
        this.testsList = [...this.testsList, ...all_tests];
    }

    addTest(func) {
        this.testsList.push(func);
    }

    pretify(testobj) {
        return testobj.name + "\t->\t" + testobj.status + "\t(" + testobj.time + "ms)\t"+testobj.message;
    }

    run() {
        let start = new Date().getTime();
        let success = 0;
        let fail = 0;
        let error = 0;

        this.testsList.forEach(testfunc => {
            let name = testfunc.name;
            let testobj = {name: name, status: "Pending", message: "", time: 0};
            try {
                let local_start = new Date().getTime();
                testfunc();
                let local_end = new Date().getTime();
                testobj.status = "Success";
                testobj.time = (local_end - local_start);
                this.results.push(testobj);
                console.log(this.pretify(testobj));
                ++success;
            }
            catch (e) {
                if (e instanceof TestError) {
                    testobj.status = "Fail";
                    testobj.message = e.message+" in " + e.fileName + " at line "+ e.lineNumber;
                    this.results.push(testobj);
                    console.log(this.pretify(testobj));
                    ++fail;
                }
                else {
                    testobj.status = "Error";
                    testobj.message = e.message+" in " + e.fileName + " at line "+ e.lineNumber;
                    this.results.push(testobj);
                    console.error(this.pretify(testobj));
                    ++error;
                }
            }
        })
        let end = new Date().getTime();

        let duration = (end - start) / 1000;
        let success_rate = this.results.length > 0 ? (success / this.results.length * 100).toPrecision(3) : 0
        let fail_rate = this.results.length > 0 ? (fail / this.results.length * 100).toPrecision(3) : 0
        let error_rate = this.results.length > 0 ? (error / this.results.length * 100).toPrecision(3) : 0

        let report = [
            "Ran "+this.results.length+" tests in " + duration + "s.",
            success+" success (" + success_rate + "%).",
            fail+" fails (" + fail_rate + "%).",
            error+" errors (" + error_rate + "%).",
        ]
        console.log("----------------------------------");
        report.forEach(el => {
            console.log(el);
        });
        return report;
    }

    getHTMLResults() {
        let report = tests.run();

        let container = document.querySelector('section');
        let table = document.createElement('table');
        table.className = "vb_detailtests";

        let cols = ['', 'Function', 'Status', 'Time', 'Message']
        let tr_head = document.createElement('tr');
        cols.forEach(col => {
            let th = document.createElement('th');
            th.innerText = col;
            tr_head.appendChild(th);
        })
        table.appendChild(tr_head);

        let results = tests.results;
        results.forEach(element => {
            let tr = document.createElement('tr');
            cols.forEach(col => {
                let td = document.createElement('td');
                switch (col) {
                    case '':
                        td.className = "vb_" + element.status;
                        break;
                    case 'Function':
                        td.innerText = element.name;
                        break;
                    case 'Status':
                        td.innerText = element.status;
                        break;
                    case 'Time':
                        td.innerText = element.time + " ms";
                        break;
                    case 'Message':
                        td.innerText = element.message;
                        break;
                }
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        let p = document.createElement('p');
        p.className = "vb_reporttests";
        p.innerHTML = "<span>"+report.join("</span><br /><span>")+"</span>";
        container.appendChild(p);

        container.appendChild(table);
    }
}
