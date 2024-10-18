const { uploadFiles } = require("./uploadFiles");
const { createThread } = require("./createThread");
const { runAssistant } = require("./runAssistant");
const { giveResults } = require("./giveResults");
const { config } = require("./config");
//const { responseWriter } = require("./responseWriter");

async function fullAssistantProcesser() {
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

module.exports = { fullAssistantProcesser };
