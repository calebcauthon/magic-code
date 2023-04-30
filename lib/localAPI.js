const axios = require('axios');
const { Conversation } = require('./Conversation');
const { ChatAPI } = require('./ChatAPI');

/**
 * Calls an external API using a given template and the selected text.
 * 
 * This function creates a conversation with the Chat API using the specified
 * template and selected text. It then starts the conversation, instructs the API
 * with the provided setup, and sends the selected text using the formatted prompt.
 * Finally, it logs and returns the API response.
 * 
 * @async
 * @function
 * @param {Object} template - An object containing the setup and prompt functions for the API call.
 * @param {String} template.setup - The initial instruction for the API.
 * @param {Function} template.prompt - A function that takes an object with a 'input' property and returns the formatted prompt for the API call.
 * @param {String} selectedText - The text to be inserted into the prompt
 * @returns {Promise<String>} The response from the external API call.
 * 
 * @example
 * const template = {
 *   setup: "Please analyze the following code snippet:",
 *   prompt: ({ input }) => `Snippet: ${selectedText}`
 * };
 * const input = "const example = 'This is an example';";
 * const response = await callExternalAPI(template, input);
 */
async function callExternalAPI(template, input) {
  const conversation = Conversation.create(ChatAPI);
  conversation.start_conversation();
  conversation.instruct(template.setup);
  const response = await conversation.ask(template.prompt({ input }));

  return response;
}

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