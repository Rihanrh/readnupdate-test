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
        const baseBranch = github.context.payload.repository.default_branch;
        const newBranchName = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME;

        if (!newBranchName) {
            throw new Error("Could not determine the branch name");
        }

        // Fetch the current file content and SHA
        const { data: fileContent } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: config.implementationFile,
            ref: newBranchName
        });

        // Create or update file in the new branch
        await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: config.implementationFile,
            message: commitMessage,
            content: Buffer.from(newData).toString("base64"),
            branch: newBranchName,
            sha: fileContent.sha
        });

        // Create a pull request
        await octokit.rest.pulls.create({
            owner,
            repo,
            title: commitMessage,
            head: newBranchName,
            base: baseBranch,
            body: "Automated fix generated by AI assistant based on test failures"
        });

        console.log(`File updated in branch ${newBranchName}. Pull request created.`);

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();