import { uploadFiles } from "./uploadFiles.js";
import { createThread } from "./createThread.js";
import { runAssistant } from "./runAssistant.js";
import { giveResults } from "./giveResults.js";
import { config } from "./config.js";
//import { responseWriter } from "./responseWriter.js";

export async function fullAssistantProcesser() {
    try {
        const fileIds = await uploadFiles(config.filesToUpload); 
        const thread = await createThread(fileIds);
        const run = await runAssistant(thread.id);
        console.log(run.status);
        const fileId = await giveResults(thread.id);
        return fileId;
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

