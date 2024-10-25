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
            sha: fileSha, 
        });

        console.log(
            `File ${filePath} has been ${fileSha ? 'updated' : 'created'} successfully with assistant results.`
        );
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();