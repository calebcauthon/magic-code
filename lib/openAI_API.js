const { Configuration, OpenAIApi } = require('openai');

const OpenaiAPI = (() => {
    async function openai_ChatCompletion_create(settings, messages) {
        const configuration = new Configuration({
            apiKey: settings.api_key
        });
        const openai = new OpenAIApi(configuration);
          
        const completion = await openai.createChatCompletion({
            model: settings.model,
            messages: messages,
            max_tokens: settings.max_tokens,
            temperature: settings.temperature,
        });

        return completion;
    }

    return {
        openai_ChatCompletion_create
    };
})();

module.exports = { OpenaiAPI };
