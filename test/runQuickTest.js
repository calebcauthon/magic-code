const path = require('path');
const { runQuick } = require('./suite/index');

async function main() {
	try {
		const extensionDevelopmentPath = path.resolve(__dirname, '../');
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		await runQuick();
	} catch (err) {
		console.error('Failed to run tests', err);
		process.exit(1);
	}
}

main();
