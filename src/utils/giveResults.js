import { openai } from "./openaiClient.js";

export async function giveResults(threadId) {
    const message = await openai.beta.threads.messages.list(threadId);
    console.log(message.data[0].content);
    const fileId = message.data[0].content.map(item=>item.text.annotations[0].file_path)[0].file_id;
    return fileId;
}
