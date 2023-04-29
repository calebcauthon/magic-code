const axios = require('axios');
const { Conversation } = require('./Conversation');
const { ChatAPI } = require('./ChatAPI');

async function callExternalAPI(selectedText) {
  const conversation = Conversation.create(ChatAPI);
  conversation.start_conversation();
  conversation.instruct(`Add snarky in-line comments to the following javascript code.`);
  const response = await conversation.ask(`
	-------------
	
	${selectedText}
	
	-------------
	End of File
	
	Include the code, which is between the "-------", in your response.`)

  console.log("response", response)
  return response;
}

function setApiKey(apiKey) {
  ChatAPI.setApiKey(apiKey);
}

module.exports = {
    callExternalAPI,
    setApiKey
};