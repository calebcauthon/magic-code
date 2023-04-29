const axios = require('axios');
const { Conversation } = require('./Conversation');
const { ChatAPI } = require('./ChatAPI');

async function callExternalAPI(template, selectedText) {
  const conversation = Conversation.create(ChatAPI);
  conversation.start_conversation();
  conversation.instruct(template.setup);
  const response = await conversation.ask(template.prompt({ selectedText }))

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