const fs = require('fs');
const path = require('path');

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

function getFailedTestNodeIds() {
    try {
        const reportPath = path.join(__dirname, '..', 'pytest_report', 'report.json');
        const jsonData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        
        if (!jsonData.tests || !Array.isArray(jsonData.tests)) {
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