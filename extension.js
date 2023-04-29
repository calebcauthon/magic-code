const vscode = require('vscode');
const goCommand = require('./commands/go');
const localAPI = require('./lib/localAPI');
const trySafely = require('./lib/trySafely');

function activate(context) {
	console.log('Congratulations, your extension "magic-code" is now active!');

	let processSelectedTextCommand = vscode.commands.registerCommand('magic-code.processSelectedText', () => {
		trySafely.trySafely(() => {
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
