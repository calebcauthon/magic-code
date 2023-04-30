const assert = require('assert');

const { BasicTestCase } = require('../BasicTestCase');
const { getCodeFromChatResponse } = require('../../lib/getCodeFromChatResponse');

suite('getCodeFromChatResponse', () => {
    [
        '```',
        '----',
    ].forEach(delimiter => {
        test('Different delimiters', async () => {
            const myTest = BasicTestCase;
            myTest.given(() => {
            });
    
            await myTest.when(async () => {
                const text = `
                ${delimiter}
                the-code
                ${delimiter}
                `;

                const callAPI = () => text;
                const result = await getCodeFromChatResponse(callAPI, "")

                return result
            });
            
            await myTest.then(async result => {
                assert.equal(result.trim(), "the-code", `using ${delimiter} delimiter`);
            });
        });
    });
});
