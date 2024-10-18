const { openai } = require("./openaiClient");

/**
 * @param {string} threadId The ID of the thread to get results from.
 * @returns {Promise<string>} The file ID from the thread message.
 */
async function giveResults(threadId) {
    const message = await openai.beta.threads.messages.list(threadId);
    console.log(message.data[0].content);
    const fileId = message.data[0].content.map(item => item.text.annotations[0].file_path)[0].file_id;
    return fileId;
}

module.exports = { giveResults };
