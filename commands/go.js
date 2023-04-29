const command = (() => {
    const injected = {
        vscode: null,
        callExternalAPI: null
    };
    async function processSelectedText() {
        const editor = injected.vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;

            if (!selection.isEmpty) {
                const selectedText = document.getText(selection);

                const suggestion = await getSuggestion(selectedText);
                const result = await showPopup(suggestion);

                if (result) {
                    applySuggestion(editor, selection, suggestion);
                }
            }
        }
    }

    async function getSuggestion(selectedText) {
        const chatResponse = await injected.callExternalAPI(selectedText);
        return extractCodeFrom(chatResponse);
    }

    async function showPopup(suggestion) {
        const message = `Do you want to change the highlighted text to "${suggestion}"?`;
        const yesButton = 'Apply';
        const noButton = 'Cancel';

        const result = await injected.vscode.window.showInformationMessage(message, yesButton, noButton);
        return result === yesButton;
    }

    function applySuggestion(editor, selection, suggestion) {
        editor.edit((editBuilder) => {
            editBuilder.replace(selection, suggestion);
        });
    }

    function init(vscode, callExternalAPI) {
        console.log("extension.js callExternalAPI", callExternalAPI);
        injected.vscode = vscode;
        injected.callExternalAPI = callExternalAPI;
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

    return {
        init,
        processSelectedText
    };
})();

module.exports = {
    init: (...args) => { command.init(...args); },
    processSelectedText: (...args) => { command.processSelectedText(...args); }
};