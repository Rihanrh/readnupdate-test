import { uploadFiles } from "./utils/uploadFiles.js";
import { createThread } from "./utils/createThread.js";
import { runAssistant } from "./utils/runAssistant.js";
import { giveResults } from "./utils/giveResults.js";
import { config } from "./utils/config.js";
import { responseWriter } from "./utils/responseWriter.js";

async function main() {
    try {
        const fileIds = await uploadFiles(config.filesToUpload); 
        const thread = await createThread(fileIds);
        const run = await runAssistant(thread.id);
        console.log(run.status);
        const fileId = await giveResults(thread.id);
        await responseWriter(fileId);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}


main();
