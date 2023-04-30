const assert = require('assert');

const { BasicTestCase } = require('../BasicTestCase');
const go = require('../../commands/go');

suite('Go command', async () => {
	await test('it runs', async () => {
		const myTest = BasicTestCase;
		myTest.given(() => {
			return {
				window: {
					activeTextEditor: {}
				}
			};
        }).as("vscode");
		
		await myTest.when(async () => {
			const vscode = myTest.givens("vscode");
			const transform = (codeInput) => codeInput;
			go.init(vscode, transform);
			try {
				return await go.processSelectedText();
			} catch (err) {
				assert.fail();
			}
        });
		
		await myTest.then(async result => {
			console.log("result", result);
        });
	});
});
