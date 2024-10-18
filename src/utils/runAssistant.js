const { openai } = require("./openaiClient");
const { config } = require("./config");

/**
 * Runs the assistant and polls for the result based on the thread ID.
 * 
 * @param {string} threadId - The ID of the thread to run the assistant.
 * @returns {Promise<any>} The result of the assistant run.
 */
async function runAssistant(threadId) {
    return await openai.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: config.assistantID,
    });
}

module.exports = { runAssistant };
