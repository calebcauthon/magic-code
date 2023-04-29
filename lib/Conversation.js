const PersonalityAPI = (() => {
    function ask(personalityFile, prompt) {
        const personality = new LoadablePersonality(personalityFile);
        return personality.askChatGPT(prompt);
    }

    return {
        ask,
    };
})();

const Conversation = (() => {
    const log = (...args) => console.log(...args);

    function create(chatAPI = null) {
        const self = {
            chatAPI: chatAPI === null ? new ChatAPI() : chatAPI,
            conversation: null,
        };

        function start_conversation() {
            self.conversation = [];
        }

        function instruct(newSetup) {
            self.chatAPI.initiate_conversation(self.conversation, newSetup);
            log(`Started conversation with setup ${newSetup}`);
        }

        async function ask(...args) {
            return await continue_conversation(...args);
        }

        async function continue_conversation(prompt) {
            log(`Prompt: ${prompt}`, { color: 'yellow' });
            log(`Waiting...`);
            const messages = await self.chatAPI.get_text_completion(prompt, self.conversation);
            log(`Response: ${messages[messages.length - 1].content}`, { color: 'green' });
            self.conversation.push(...messages);

            return get_last_response();
        }

        function get_last_response() {
            return self.conversation[self.conversation.length - 1].content;
        }

        function branch() {
            const clone = create(self.chatAPI);
            clone.conversation = self.conversation.slice();
            return clone;
        }

        return {
            start_conversation,
            instruct,
            ask,
            continue_conversation,
            get_last_response,
            branch,
        };
    }

    return {
        create,
    };
})();

module.exports = {
    PersonalityAPI,
    Conversation
};
