const assert = require('assert');

const { BasicTestCase } = require('../BasicTestCase');


suite('Extension Test Suite', () => {
	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});
