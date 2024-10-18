const core = require("@actions/core");
const github = require("@actions/github");
const { fullAssistantProcesser } = require("./utils/fullAssistantProcesser");

async function run() {
    try {
        const token = core.getInput("github-token", { required: true });
        const filePath = core.getInput("file-path", { required: true });
        const commitMessage = core.getInput("commit-message", {
            required: true,
        });

        // Process with the assistant
        const newData = await fullAssistantProcesser();

        if (!newData) {
            throw new Error(
                "No new data was returned from the assistant processor"
            );
        }

        const octokit = github.getOctokit(token);
        const { owner, repo } = github.context.repo;

        // Fetch the current file content to get its SHA
        let fileSha;
        try {
            const { data: fileData } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path: filePath,
            });
            fileSha = fileData.sha;
        } catch (error) {
            if (error.status === 404) {
                console.log(`File ${filePath} does not exist. Creating new file.`);
            } else {
                throw error;
            }
        }

        // Create or update file
        await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: commitMessage,
            content: Buffer.from(newData).toString("base64"),
            sha: fileSha, // Include SHA if updating, omit if creating new file
        });

        console.log(
            `File ${filePath} has been ${fileSha ? 'updated' : 'created'} successfully with assistant results.`
        );
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();