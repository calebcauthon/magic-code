const axios = require('axios');

async function callExternalAPI(selectedText) {
  const apiURL = 'http://127.0.0.1:5000/continue';
  const response = await axios.post(apiURL, {
	setup: `Add snarky in-line comments to the following javascript code.`,
	prompt: `
	-------------
	
	${selectedText}
	
	-------------
	End of File
	
	Include the code, which is between the "-------", in your response.`
  });

  return response.data;
}

module.exports = {
    callExternalAPI
};