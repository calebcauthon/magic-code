const BasicTestCase = (function () {
    const prefix = "DEBUG: ";
    let elements = {};
    let library = {};
    let out = {};
    let libs = {};
    let testId = null;
    let params = {};

    const log = function (...args) {
        if (args.length > 1) {
            args.forEach((thisArg) => BasicTestCase.log(thisArg));
            return;
        }

        const logMessage = args[0];

        if (Array.isArray(logMessage) || logMessage instanceof Set) {
            BasicTestCase.log(` * ${logMessage.size} items:`);
            logMessage.forEach((item) => BasicTestCase.log(` * * ${item}`));
        } else {
           // console.log(`\n${BasicTestCase.prefix} ${logMessage}`);
        }
    };

    const api = {
        "trace": (...args) => {
            BasicTestCase.log(args[0]);
            // print the others with a new line and indented
            if (args.length > 1) {
                args.slice(1).forEach((arg) => BasicTestCase.log(` * ${arg}`));
            }
        }
    };


    const mock = function (name, value) {
        const parts = name.split("\\.").reverse();
        const stub = parts.reduce((innerStub, part) => {
            return { [part]: innerStub };
        }, value);
        return stub;
    }

    const resetOnTestStart = function () {
        this.testId = null;

        this.params = {};

        this.elements = {};
        this.library = {};
        this.out = {};
        this.libs = {};
        this.api = {
            "trace": (...args) => {
                // print the first argument
                BasicTestCase.log(args[0]);
                // print the others with a new line and indented
                if (args.length > 1) {
                    args.slice(1).forEach((arg) => BasicTestCase.log(arg));
                }
            }
        };

        this.api.isDebugMode = () => false;

        this.output = null; // result of "when"
        this.called = null;
    };

    const resetOnTestEnd = function () {
        BasicTestCase.log("BasicTestCase.Log resetOnTestEnd()");
        this.givenFn = [];
    };

    const BeforeEverything = function () {
        this.resetOnTestStart();
    };

    const AfterEverything = function () {
        this.resetOnTestStart();
    };

    const Before = function () {
        this.api.local = {};
        this.api.global = {};

        this.api.trace = (...args) => {
            BasicTestCase.log(args[0]);
            if (args.length > 1) {
                args.slice(1).forEach((arg) => BasicTestCase.log(arg));
            }
        };
        this.api.isDebugMode = () => false;
        this.api.addWarning = this.api.trace;
        BasicTestCase.log(`Starting test ${this.testId}`);
        this.setup();
    };

    const setup = function () {
        // ...
    };

    const After = function () {
        // ...
    };

    const test = async function (...args) {
        BasicTestCase.log(`Starting test, givenResults has ${Object.keys(this.givenResults).length} items, keys: ${Object.keys(this.givenResults)}`);
        if (args.length > 1) {
            this.testId = args[0];
            BasicTestCase.prefix = `${this.testId} ${BasicTestCase.prefix}`;
        }

        this.BeforeEverything();
        this.Before();

        if (args.length > 0) {
            const lastParameter = args[args.length - 1];
            await lastParameter.call(this);
        }

        this.After();
        this.AfterEverything();
    };

    const scenarioOperator = {
        "api": {
            "isDebugMode": () => false,
            "trace": (...args) => {
                BasicTestCase.log(args[0]);
                if (args.length > 1) {
                    args.slice(1).forEach((arg) => BasicTestCase.log(arg));
                }
            }
        },
        "delegate": null,
        "named": {},
        "as": function (name) {
            BasicTestCase.log(`as "${name}"`);
            const fn = BasicTestCase.lastFn;
            BasicTestCase.scenarioOperator["named"][name] = fn.method;
            fn.name = name;

            BasicTestCase.lastName = name;
            return BasicTestCase.scenarioOperator;
        },
        "using": function (paramsFn) {
            const name = BasicTestCase.lastName;
            const fn = BasicTestCase.lastFn.method;

            const fnWithParams = (myFn, newParams, thisName) => {
                const newFn = myFn.bind(null, newParams);
                newFn.call(this);
            };

            const fnWithParamsCurried = (name) => fnWithParams.bind(null, fn, paramsFn(), name);

            BasicTestCase.setLastFn.call(fnWithParamsCurried);
            return BasicTestCase.scenarioOperator;
        }
    };

    const givenFn = [];
    const given = function (arg) {
        let fn = "";
        if (typeof arg === 'string') {
            fn = BasicTestCase.scenarioOperator["named"][arg];
            BasicTestCase.lastName = arg;
            if (fn === null) {
                throw new Error(`given("${arg}") not found\nAvailable:\n${Object.keys(BasicTestCase.scenarioOperator.named)}\n`);
            }
        } else {
            BasicTestCase.log("BasicTestCase.Log defining a given");
            fn = arg;
        }
        BasicTestCase.givenFn.push({ "method": fn, "name": "anon" });
        BasicTestCase.lastFn = BasicTestCase.givenFn[BasicTestCase.givenFn.length - 1];
        BasicTestCase.setLastFn = (newLastFn) => {
            BasicTestCase.givenFn[BasicTestCase.givenFn.length - 1].method = newLastFn;
        };

        return BasicTestCase.scenarioOperator;
    };

    const whenFn = null;
    const when = function (arg) {
        let fn = "";
        if (typeof arg === 'string') {
            fn = BasicTestCase.scenarioOperator["named"][arg];
            if (fn === null) {
                throw new Error(`when("${arg}") not found\nAvailable:\n${Object.keys(BasicTestCase.scenarioOperator.named)}\n`);
            }
        } else {
            fn = arg;
        }
        BasicTestCase.whenFn = fn;
        BasicTestCase.lastFn = { "method": fn, "name": "anon" };
        return BasicTestCase.scenarioOperator;
    };

    const givenResults = {};
    const givens = function (name) {
        if (BasicTestCase.givenResults[name] === undefined) {
            throw new Error(`givenResults['${name}'] not found\nAvailable:\n${Object.keys(BasicTestCase.givenResults)}\n`);
        }
        BasicTestCase.log(`BasicTestCase.Log returning givenResults['${name}']`);
        return BasicTestCase.givenResults[name];
    };

    let result = null;
    const then = async function (...args) {
        let thisTestId = this;
        let fn = null;
        if (args.length === 1) {
            fn = args[0];
        } else {
            thisTestId = args[0];
            fn = args[1];
        }

        try {
            await this.test(thisTestId, async () => {
                BasicTestCase.scenarioOperator.delegate = this;
                BasicTestCase.log(`BasicTestCase.Log calling ${BasicTestCase.givenFn.length} givens`);
                BasicTestCase.log(`Available Keys for Givens: ${Object.keys(BasicTestCase.givenResults)}`);
                BasicTestCase.givenFn.forEach((given) => {
                    BasicTestCase.log(`BasicTestCase.Log calling given: ${given.name}`);
                    BasicTestCase.givenResults[given.name] = given.method.call(this);
                    BasicTestCase.log(`Available Keys for Givens: ${Object.keys(BasicTestCase.givenResults)}`);
                });

                if (BasicTestCase.whenFn) {
                    this.result = await BasicTestCase.whenFn.call(this);
                }

                await fn.call(this, this.result);
            });
        } catch (e) {
            BasicTestCase.log(`BasicTestCase.Log Exception: ${e.message}`);
            throw e;
        } finally {
            this.resetOnTestEnd();
        }
        this.resetOnTestEnd();
    }

    return {
        prefix: prefix,
        elements: elements,
        library: library,
        out: out,
        libs: libs,
        log: log,
        api: api,
        testId: testId,
        params: params,
        resetOnTestStart: resetOnTestStart,
        resetOnTestEnd: resetOnTestEnd,
        BeforeEverything: BeforeEverything,
        AfterEverything: AfterEverything,
        Before: Before,
        setup: setup,
        After: After,
        test: test,
        scenarioOperator: scenarioOperator,
        givenFn: givenFn,
        given: given,
        whenFn: whenFn,
        when: when,
        givenResults: givenResults,
        givens: givens,
        result: result,
        then: then
    };
})();


module.exports = { BasicTestCase };
