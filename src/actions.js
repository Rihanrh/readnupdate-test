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
        
        // Get the base branch (current PR branch)
        const baseBranch = github.context.payload.pull_request.head.ref;
        
        // Create a new branch name
        const newBranchName = `ai-fix-${github.context.issue.number}`;

        // Create a new branch from the base branch
        const { data: baseRef } = await octokit.rest.git.getRef({
            owner,
            repo,
            ref: `heads/${baseBranch}`
        });

        await octokit.rest.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${newBranchName}`,
            sha: baseRef.object.sha
        });

        // Update or create file in the new branch
        await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: config.implementationFile,
            message: commitMessage,
            content: Buffer.from(newData).toString("base64"),
            branch: newBranchName
        });

        console.log(`Branch ${newBranchName} created and file updated.`);

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();