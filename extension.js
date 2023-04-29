const vscode = require('vscode');
const goCommand = require('./commands/go');
const localAPI = require('./lib/localAPI');
const trySafely = require('./lib/trySafely');

async function activate(context) {
	const config = vscode.workspace.getConfiguration("magic-code");
    const templates = config.get("templates");
	const keys = Object.keys(templates);

	let processSelectedTextCommand = vscode.commands.registerCommand('magic-code.processSelectedText', async () => {
		trySafely.trySafely(async () => {
			const selectedKey = await vscode.window.showQuickPick(keys, {
                placeHolder: 'Select a template'
            });

            if (!selectedKey) {
                return;
            }

			const setup = templates[selectedKey];

			const template = {
				setup,
				prompt: (data) => `
				-------------
				
				${data.selectedText}
				
				-------------
				End of File
				
				Include the code, which is between the "-------", in your response.`
			};
			const config = vscode.workspace.getConfiguration('magic-code');
			localAPI.setApiKey(config.get("openai_api_key"));
			goCommand.init(vscode, (text) => localAPI.callExternalAPI(template, text));
			goCommand.processSelectedText();
		});
	});
	context.subscriptions.push(processSelectedTextCommand);
}
  
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
