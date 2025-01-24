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

        // Process with the assistant
        const newData = await fullAssistantProcessor();

        if (!newData) {
            throw new Error(
                "No new data was returned from the assistant processor"
            );
        }

        const octokit = github.getOctokit(token);
        const { owner, repo } = github.context.repo;

        // Get the current branch name
        const { data: { name: currentBranch } } = await octokit.rest.repos.get({
            owner,
            repo
        });

        const filePath = config.implementationFile;

        // Create a new branch from the current branch
        const { data: branchRef } = await octokit.rest.git.getRef({
            owner,
            repo,
            ref: `heads/${currentBranch}`
        });

        const newBranchName = `ai-fix-${Date.now()}`;
        await octokit.rest.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${newBranchName}`,
            sha: branchRef.object.sha
        });

        // Fetch the current file content to get its SHA
        let fileSha;
        try {
            const { data: fileData } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path: filePath,
                ref: newBranchName
            });
            fileSha = fileData.sha;
        } catch (error) {
            if (error.status === 404) {
                console.log(`File ${filePath} does not exist. Creating new file.`);
            } else {
                throw error;
            }
        }

        // Update file in the new branch
        await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: commitMessage,
            content: Buffer.from(newData).toString("base64"),
            sha: fileSha,
            branch: newBranchName
        });

        // Push the new branch
        console.log(
            `Created new branch ${newBranchName} and updated ${filePath} with AI-generated fix.`
        );
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();