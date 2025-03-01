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
    
    // Get implementation file by comparing crash path with traceback paths
    let implementationFile = '';
    
    if (failedTest.call && failedTest.call.crash && failedTest.call.crash.path) {
        const crashPath = failedTest.call.crash.path.replace(/\\/g, '/');
        
        if (failedTest.call.traceback && Array.isArray(failedTest.call.traceback)) {
            // Extract the filename portion from the crash path
            const crashPathParts = crashPath.split('/');
            const crashFileName = crashPathParts[crashPathParts.length - 1];
            
            // Look for matching filename in traceback paths
            for (const frame of failedTest.call.traceback) {
                if (!frame.path) continue;
                
                const tracebackPath = frame.path.replace(/\\/g, '/');
                
                // Check if this traceback path is for an implementation file (not a test file)
                if (!tracebackPath.includes('test_') && !tracebackPath.includes('python_testcases')) {
                    // Check if the traceback path ends with the same filename as the crash path
                    if (tracebackPath.endsWith(crashFileName)) {
                        implementationFile = tracebackPath;
                        break;
                    }
                }
            }
        }
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