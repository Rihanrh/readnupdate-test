import { openai } from "./openaiClient.js";

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
export async function createThread(fileIds) {
    const attachments = fileIds.map((fileId) => ({
        file_id: fileId,
        tools: [{ type: "code_interpreter" }],
    }));

    const thread = await openai.beta.threads.create({
        messages: [
            {
                role: "user",
                content: "Run instructions",
                attachments: attachments,
            },
        ],
    });

    return thread;
}
