const { getFailedTestNodeIds } = require("./failedCodeProcessor");

function getConfig(reportPath) {
    // If no report path is provided, return a basic config without trying to process a file
    if (!reportPath) {
        console.warn('No report path provided to getConfig');
        return {
            assistantID: process.env.ASSISTANT_ID,
            openaiApiKey: process.env.OPENAI_API_KEY,
            filesToUpload: [],
            implementationFile: ''
        };
    }
    
    const failedTestInfo = getFailedTestNodeIds(reportPath);
    
    return {
        assistantID: process.env.ASSISTANT_ID,
        openaiApiKey: process.env.OPENAI_API_KEY,
        filesToUpload: failedTestInfo.filesToUpload,
        implementationFile: failedTestInfo.implementationFile
    };
}

// Export a placeholder config that doesn't require file reading
// This avoids the undefined path error during module initialization
const config = {
    get assistantID() { return process.env.ASSISTANT_ID; },
    get openaiApiKey() { return process.env.OPENAI_API_KEY; },
    filesToUpload: [],
    implementationFile: ''
};

module.exports = { config, getConfig };