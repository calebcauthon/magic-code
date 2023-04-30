async function getCodeFromChatResponse(callExternalAPI, code) {
    const chatResponse = await callExternalAPI(code);
    return extractCodeFrom(chatResponse);
}

function extractCodeFrom(text) {
    let result;
    [
        "```",
        "----",
    ].forEach(delimiter => {
        code = extractCodeUsing(text, delimiter);
        if (code !== undefined) {
            result = code;
        }
    });

    return result;
}

function extractCodeUsing(output, delimiter) {
    let firstDelimiterIndex = output.indexOf(delimiter);
    let lastDelimiterIndex = -1;
    let tempIndex = firstDelimiterIndex;

    while (tempIndex !== -1) {
        tempIndex = output.indexOf(delimiter, tempIndex + delimiter.length);
        if (tempIndex !== -1) {
            lastDelimiterIndex = tempIndex;
        }
    }

    if (firstDelimiterIndex !== -1 && lastDelimiterIndex !== -1) {
        const code = output.slice(firstDelimiterIndex + delimiter.length, lastDelimiterIndex);
        return code;
    }
}

module.exports = {
    getCodeFromChatResponse
}