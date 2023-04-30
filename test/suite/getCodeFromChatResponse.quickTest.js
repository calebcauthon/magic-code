const assert = require('assert');

const { BasicTestCase } = require('../BasicTestCase');
const { getCodeFromChatResponse } = require('../../lib/getCodeFromChatResponse');

suite('getCodeFromChatResponse', () => {
    [
        '```',
        '----',
    ].forEach(delimiter => {
        test(`Different delimiters: ${delimiter}`, async () => {
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

    test('Backticks within the block', async () => {
        const myTest = BasicTestCase;
        myTest.given(() => {
        });

        const backticks = '```';
        await myTest.when(async () => {
            const text = `
            ${backticks}
            the-code-1${backticks}the-code-2
            ${backticks}
            `;
        
            const callAPI = () => text;
            const result = await getCodeFromChatResponse(callAPI, "")
        
            return result
        });
        
        await myTest.then(async result => {
            assert.equal(result.trim(), "the-code-1```the-code-2", 'using multiple ``` delimiters');
        });
    });
});
