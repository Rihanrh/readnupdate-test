const fs = require('fs');

function processTestReport(jsonData) {
    if (!jsonData.tests || !Array.isArray(jsonData.tests)) {
        console.error('Invalid or missing tests array in report');
        return { filesToUpload: [], implementationFile: '', testFile: '' };
    }

    const failedTest = jsonData.tests.find(test => test.outcome === "failed");
    
    if (!failedTest) {
        console.error('No failed tests found in report');
        return { filesToUpload: [], implementationFile: '', testFile: '' };
    }

    // Get test file from nodeid
    const testFile = failedTest.nodeid.split('::')[0];
    
    // Get implementation file directly from crash path if available
    let implementationFile = '';
    if (failedTest.call && failedTest.call.crash && failedTest.call.crash.path) {
        implementationFile = failedTest.call.crash.path
            .replace(/\\/g, '/') // Convert Windows backslashes to forward slashes
            .replace(/^.*?([A-Za-z]:\/|\/)(.*?)$/, '$2'); // Remove machine-specific path prefix
    } else if (failedTest.call && failedTest.call.traceback && failedTest.call.traceback.length > 0) {
        // Backup: look for implementation file in traceback
        const sourceFrame = failedTest.call.traceback.find(frame => 
            !frame.path.includes('test_') && !frame.path.includes('python_testcases'));
            
        if (sourceFrame) {
            implementationFile = sourceFrame.path.replace(/\\/g, '/');
        }
    }
    
    // If still couldn't find implementation file, fall back to original method
    if (!implementationFile) {
        implementationFile = testFile
            .replace('/python_testcases/', '/python_programs/')
            .replace('test_', '');
        console.warn('Using fallback method to determine implementation file:', implementationFile);
    }

    return {
        testFile,
        implementationFile,
        filesToUpload: [testFile, implementationFile]
    };
}

function getRelevantFiles(reportPath) {
    try {
        // Check if reportPath is defined
        if (!reportPath) {
            console.error('No report path provided.');
            return { filesToUpload: [], implementationFile: '' };
        }

        const jsonData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        return processTestReport(jsonData);
    } catch (error) {
        console.error('Error processing file:', error);
        return { filesToUpload: [], implementationFile: '' };
    }
}

module.exports = {
    getRelevantFiles,
    processTestReport
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