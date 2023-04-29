const { OpenaiAPI } = require('./openAI_API');

const settings = {
    model: 'gpt-3.5-turbo',
    max_tokens: 3000,
    temperature: 1,
    api_key: "CHANGE API KEY IN SETTINGS",
};

const ChatAPI = (() => {
    function setApiKey(apiKey) {
        settings.api_key = apiKey;
    }

    function create(openai = null) {
        const self = {
            openai: openai === null ? new OpenaiAPI() : openai,
        };

        function initiate_conversation(conversation, input) {
            const setup = {
                content: input,
                role: 'system',
            };
            conversation.push(setup);
        }

        async function get_text_completion(prompt, additional = []) {
            const new_question = {
                content: prompt,
                role: 'user',
            };

            const messages = additional.concat([new_question]);
            const response = await self.openai.openai_ChatCompletion_create(settings, messages);
            console.log("response.data", response.data);

            return [
                new_question,
                response.data.choices[0].message,
            ];
        }

        return {
            initiate_conversation,
            get_text_completion,
            setApiKey
        };
    }

    return {
        create,
    };
})().create(OpenaiAPI);

module.exports = { ChatAPI };
