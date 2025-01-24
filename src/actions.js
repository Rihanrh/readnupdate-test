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
        const filePath = config.implementationFile;

        // Get the current branch reference
        const { data: currentBranch } = await octokit.rest.repos.get({
            owner,
            repo,
        });
        const defaultBranch = currentBranch.default_branch;

        // Get the latest commit SHA of the default branch
        const { data: refData } = await octokit.rest.git.getRef({
            owner,
            repo,
            ref: `heads/${defaultBranch}`,
        });
        const latestCommitSha = refData.object.sha;

        // Create a new branch
        const newBranchName = `${github.context.ref.replace('refs/heads/', '')}-AIFix-${new Date().toISOString().split('T')[0]}`;
        await octokit.rest.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${newBranchName}`,
            sha: latestCommitSha,
        });

        // Fetch the current file content to get its SHA (if it exists)
        let fileSha;
        try {
            const { data: fileData } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path: filePath,
                ref: newBranchName,
            });
            fileSha = fileData.sha;
        } catch (error) {
            if (error.status !== 404) {
                throw error;
            }
        }

        // Create or update file in the new branch
        await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: commitMessage,
            content: Buffer.from(newData).toString("base64"),
            sha: fileSha,
            branch: newBranchName,
        });

        console.log(
            `Created new branch ${newBranchName} and updated ${filePath} successfully with assistant results.`
        );

        // Optionally, create a pull request: To be implemented later
        // await octokit.rest.pulls.create({
        //     owner,
        //     repo,
        //     title: commitMessage,
        //     head: newBranchName,
        //     base: defaultBranch,
        //     body: "Automated AI-assisted fix for failed tests"
        // });
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();