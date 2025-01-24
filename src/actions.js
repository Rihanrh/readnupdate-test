const core = require("@actions/core");
const github = require("@actions/github");
const { fullAssistantProcessor } = require("./utils/fullAssistantProcessor");
const { config } = require("./utils/config");

async function run() {
    try {
        const token = core.getInput("github-token", { required: true });
        const commitMessage = core.getInput("commit-message", {
            required: true,
        });

        if (!config.implementationFile) {
            throw new Error("No failed test implementation file found to update");
        }

        const newData = await fullAssistantProcessor();

        if (!newData) {
            throw new Error("No new data was returned from the assistant processor");
        }

        const octokit = github.getOctokit(token);
        const { owner, repo } = github.context.repo;
        const newBranchName = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME;

        if (!newBranchName) {
            throw new Error("Could not determine the branch name");
        }

        // Try to get the current file's SHA, fallback if not found
        let fileSha = null;
        try {
            const { data: fileContent } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path: config.implementationFile,
                ref: newBranchName
            });
            fileSha = fileContent.sha;
        } catch (error) {
            // File might not exist in the new branch, which is okay
            console.log(`File not found in branch, will create new: ${error.message}`);
        }

        // Update or create file in the new branch
        await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: config.implementationFile,
            message: commitMessage,
            content: Buffer.from(newData).toString("base64"),
            branch: newBranchName,
            sha: fileSha || undefined  // Use SHA only if available
        });

        console.log(`File updated in branch ${newBranchName}.`);

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();