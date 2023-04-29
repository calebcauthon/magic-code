const vscode = require('vscode');
const goCommand = require('./commands/go');
const localAPI = require('./lib/localAPI');
const trySafely = require('./lib/trySafely');

function activate(context) {
	let processSelectedTextCommand = vscode.commands.registerCommand('magic-code.processSelectedText', () => {
		trySafely.trySafely(() => {
			const config = vscode.workspace.getConfiguration('magic-code');
			localAPI.setApiKey(config.get("openai_api_key"));
			goCommand.init(vscode, localAPI.callExternalAPI);
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
