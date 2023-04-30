const command = (() => {
    const injected = {
        vscode: null,
        transform: null
    };

    function init(vscode, transform) {
        injected.vscode = vscode;
        injected.transform = transform;
    }

    async function processSelectedText() {
        const editor = injected.vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;

            if (!selection.isEmpty) {
                const selectedText = document.getText(selection);
                const suggestion = await injected.transform(selectedText);
                const result = await showPopup(suggestion);

                if (result) {
                    applySuggestion(editor, selection, suggestion);
                }
            }
        }
    }

    async function showPopup(suggestion) {
        const message = `Do you want to change the highlighted text to "${suggestion.slice(0, 10)}"?`;
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

    return {
        init,
        processSelectedText
    };
})();

module.exports = {
    init: (...args) => { command.init(...args); },
    processSelectedText: (...args) => { command.processSelectedText(...args); }
};