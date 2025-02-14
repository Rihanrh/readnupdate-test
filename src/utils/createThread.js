const { openai } = require("./openaiClient");

/**
 * Explanation about the functions
 * 
 * @param {Array<string>} fieldIds Field ids of the blablabla
 * @returns {Promise<Thread>}
 * 
 * @example
 * const fieldIds = ['foo', 'bar']
 * const thread = await createThread(fieldIds)
 * console.log(thread)
 * 
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
