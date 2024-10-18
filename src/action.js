const core = require("@actions/core");
const github = require("@actions/github");
const { fullAssistantProcesser } = require("./fullAssistantProcesser.js");

async function run() {
    try {
        const token = core.getInput("github-token", { required: true });
        const filePath = core.getInput("file-path", { required: true });
        const commitMessage = core.getInput("commit-message", {
            required: true,
        });

        // Process with the assistant
        const fileId = await fullAssistantProcesser();
        
        if (!fileId) {
            throw new Error("No file ID was returned from the assistant processor");
        }

        const octokit = github.getOctokit(token);
        const { owner, repo } = github.context.repo;

        await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: commitMessage,
            content: Buffer.from(fileId).toString("base64"),
        });

        console.log(`File ${filePath} has been updated successfully with assistant results.`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();