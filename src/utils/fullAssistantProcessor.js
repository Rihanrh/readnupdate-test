const { uploadFiles } = require("./uploadFiles");
const { createThread } = require("./createThread");
const { runAssistant } = require("./runAssistant");
const { giveResults } = require("./giveResults");
const { getConfig } = require("./config");
const { retrieveContent } = require("./retrieveContent");

async function fullAssistantProcessor(feedback, reportPath) {
    try {
        const config = getConfig(reportPath);
        if (!config.filesToUpload.length) {
            console.log("No failed test files found to process");
            return null;
        }

        const fileIds = await uploadFiles(config.filesToUpload);
        const thread = await createThread(fileIds, feedback);
        const run = await runAssistant(thread.id);
        console.log(run.status);
        const fileId = await giveResults(thread.id);
        const newData = await retrieveContent(fileId);
        return newData;
    } catch (error) {
        console.error("An error occurred:", error);
        throw error; 
    }
}

module.exports = { fullAssistantProcessor };