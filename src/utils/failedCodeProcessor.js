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
    
    // Implementation file logic
    // Find implementation file by checking which traceback path is contained in the crash path
    let implementationFile = '';
    
    if (failedTest.call && 
        failedTest.call.crash && 
        failedTest.call.crash.path && 
        failedTest.call.traceback && 
        Array.isArray(failedTest.call.traceback)) {
        
        const crashPath = failedTest.call.crash.path.replace(/\\/g, '\\\\'); // Escape backslashes
        
        // Find the traceback entry that matches the implementation file
        const implementationTraceback = failedTest.call.traceback.find(trace => {
            // Convert Windows paths to a consistent format for comparison
            const normalizedTracePath = trace.path.replace(/\\/g, '\\\\');
            return crashPath.includes(normalizedTracePath);
        });
        
        if (implementationTraceback) {
            implementationFile = implementationTraceback.path;
        }
    }

    return {
        testFile,
        implementationFile,
        filesToUpload: [testFile, implementationFile].filter(Boolean) // Filter out empty strings
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