import { openai } from "./openaiClient.js";
import { config } from "./config.js";

export async function runAssistant(threadId) {
    return await openai.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: config.assistantID,
    });
}
