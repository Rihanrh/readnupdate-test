const dotenv = require("dotenv");
const { getFailedTestNodeIds } = require("./failedCodeProcessor");

dotenv.config();

const failedTestInfo = getFailedTestNodeIds();

const config = {
    assistantID: process.env.ASSISTANT_ID,
    openaiApiKey: process.env.OPENAI_API_KEY,
    filesToUpload: failedTestInfo.filesToUpload,
    implementationFile: failedTestInfo.implementationFile
};

module.exports = { config };