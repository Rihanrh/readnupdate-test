const { openai } = require("./openaiClient");

/**
 * Creates a new OpenAI thread with an initial user message.
 *
 * @param {Array<string>} fileIds - The IDs of files to attach to the message.
 * @param {string} feedback - The content of the user's message.
 * @returns {Promise<Thread>} - A promise resolving to the created thread.
 *
 * @example
 * const fileIds = ['file-123', 'file-456'];
 * const feedback = "Please analyze these files.";
 * const thread = await createThread(fileIds, feedback);
 * console.log(thread);
 */
async function createThread(fileIds, feedback) {
    const attachments = fileIds.map((fileId) => ({
        file_id: fileId,
        tools: [{ type: "code_interpreter" }],
    }));

    const thread = await openai.beta.threads.create({
        messages: [
            {
                role: "user",
                content: feedback,
                attachments: attachments,
            },
        ],
    });

    return thread;
}

module.exports = { createThread };
