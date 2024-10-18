const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
    try {
        const token = core.getInput("github-token", { required: true });
        const filePath = core.getInput("file-path", { required: true });
        const fileContent = core.getInput("file-content", { required: true });
        const commitMessage = core.getInput("commit-message", {
            required: true,
        });

        const octokit = github.getOctokit(token);
        const { owner, repo } = github.context.repo;

        const { data: currentFile } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: filePath,
        });

        await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: commitMessage,
            content: Buffer.from(fileContent).toString("base64"),
            sha: currentFile.sha,
        });

        console.log(`File ${filePath} has been updated successfully.`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
