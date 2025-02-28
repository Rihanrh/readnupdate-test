const fs = require('fs');

function processNodeId(nodeId) {
    if (!nodeId) return [];

    // Extract the base path without the test parameters
    const basePath = nodeId.split('::')[0];
    
    // Get all three file paths
    const testFilePath = basePath;
    const implFilePath = basePath
        .replace('/python_testcases/', '/python_programs/')
        .replace('test_', '');
    
    return {
        testFile: testFilePath,
        implementationFile: implFilePath,
        filesToUpload: [testFilePath, implFilePath]
    };
}

function getFailedTestNodeIds(reportPath) {
    try {
        // Check if reportPath is defined
        if (!reportPath) {
            console.error('No report path provided to getFailedTestNodeIds');
            return { filesToUpload: [], implementationFile: '' };
        }

        const jsonData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        
        if (!jsonData.tests || !Array.isArray(jsonData.tests)) {
            console.error('Invalid or missing tests array in report');
            return { filesToUpload: [], implementationFile: '' };
        }

        const failedTest = jsonData.tests.find(test => test.outcome === "failed");
        return failedTest ? processNodeId(failedTest.nodeid) : { filesToUpload: [], implementationFile: '' };
    } catch (error) {
        console.error('Error processing file:', error);
        return { filesToUpload: [], implementationFile: '' };
    }
}

module.exports = {
    getFailedTestNodeIds,
    processNodeId
};

/* Uncomment this block to test the function
if (require.main === module) {
    const paths = getFailedTestNodeIds();
    if (paths.length) {
        console.log('Test file:', paths[0]);
        console.log('Implementation file:', paths[1]);
        console.log('JSON test cases:', paths[2]);
    } else {
        console.log('No failed tests found or error occurred');
    }
}
*/