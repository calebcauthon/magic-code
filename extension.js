const vscode = require('vscode');
const goCommand = require('./commands/go');
const localAPI = require('./lib/localAPI');
const trySafely = require('./lib/trySafely');

function activate(context) {
	let processSelectedTextCommand = vscode.commands.registerCommand('magic-code.processSelectedText', () => {
		trySafely.trySafely(() => {
			const template = {
				setup: "Add snarky in-line comments to the following javascript code.",
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
