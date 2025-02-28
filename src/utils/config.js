const { getFailedTestNodeIds } = require("./failedCodeProcessor");

function getConfig(reportPath) {
    const failedTestInfo = getFailedTestNodeIds(reportPath);
    
    return {
        assistantID: process.env.ASSISTANT_ID,
        openaiApiKey: process.env.OPENAI_API_KEY,
        filesToUpload: failedTestInfo.filesToUpload,
        implementationFile: failedTestInfo.implementationFile
    };
}

// Default config for backward compatibility
const config = getConfig();

module.exports = { config, getConfig };