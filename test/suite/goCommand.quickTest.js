const assert = require('assert');

const { BasicTestCase } = require('../BasicTestCase');
const go = require('../../commands/go');

suite('Extension Test Suite', () => {
	test('BasicTestCase', () => {
		const myTest = BasicTestCase;
		myTest.given(() => {
			return {
				window: {
					activeTextEditor: {}
				}
			};
        }).as("vscode");
		
		myTest.when(() => {
			const vscode = myTest.givens("vscode");
			const transform = (codeInput) => codeInput;
			go.init(vscode, transform);
			go.processSelectedText();
        });
		
		myTest.then(() => {
            console.log("FAIL?")
        });
	});
});
