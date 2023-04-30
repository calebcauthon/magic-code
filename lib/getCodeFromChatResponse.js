async function getCodeFromChatResponse(callExternalAPI, code) {
    const chatResponse = await callExternalAPI(code);
    return extractCodeFrom(chatResponse);
}

function extractCodeFrom(output) {
    var firstLine = output.indexOf('```');
    var lastLine = output.lastIndexOf('```');
    if (firstLine !== -1 && lastLine !== -1) {
        const lines = output.split('\n');
        const firstLine = lines.findIndex(line => line.includes('```'));
        const lastLine = lines.slice(firstLine + 1).findIndex(line => line.includes('```')) + firstLine + 1;
        const code = lines.slice(firstLine + 1, lastLine).join('\n');
        return extractCodeFrom(code);
    }

    var firstLine = output.indexOf('----');
    var lastLine = output.lastIndexOf('----');
    if (firstLine !== -1 && lastLine !== -1) {
        const lines = output.split('\n');
        const firstLine = lines.findIndex(line => line.includes('----'));
        const lastLine = lines.slice(firstLine + 1).findIndex(line => line.includes('----')) + firstLine + 1;
        const code = lines.slice(firstLine + 1, lastLine).join('\n');
        return extractCodeFrom(code);
    }

    return output;
}

module.exports = {
    getCodeFromChatResponse
}