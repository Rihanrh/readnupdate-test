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
            throw new Error(
                "No failed test implementation file found to update"
            );
        }

        // Process with the assistant
        const newData = await fullAssistantProcessor();

        if (!newData) {
            throw new Error(
                "No new data was returned from the assistant processor"
            );
        }

        // Initialize GitHub client
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
        const newBranchName = core.getInput("base-branch", { required: true });
        await octokit.rest.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${newBranchName}`,
            sha: latestCommitSha,
        });

        // Fetch the current file content to get its SHA from the new branch
        let fileSha;
        try {
            const { data: fileData } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path: filePath,
                ref: newBranchName, // Check in the new branch
            });
            fileSha = fileData.sha;
        } catch (error) {
            if (error.status === 404) {
                // File not found in the new branch, fetch from the default branch
                const { data: fileDataDefault } =
                    await octokit.rest.repos.getContent({
                        owner,
                        repo,
                        path: filePath,
                        ref: defaultBranch, // Fallback to default branch
                    });
                fileSha = fileDataDefault.sha;
            } else {
                throw error;
            }
        }

        // Log the details before updating the file
        console.log("Updating file:", filePath);
        console.log("New data to write:", newData);
        console.log("Branch being updated:", newBranchName);

        // Now create or update the file in the new branch
        await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: commitMessage,
            content: Buffer.from(newData).toString("base64"),
            sha: fileSha, // Use the correct file SHA (either from new branch or fallback)
            branch: newBranchName, // Make sure the file is updated in the new branch
        });

        console.log("File update result:", result);

        // Log the details of the commit and file update
        console.log(
            `Created new branch ${newBranchName} and updated ${filePath} successfully with assistant results.`
        );
        console.log(`Commit SHA: ${result.data.commit.sha}`);
        console.log(`File updated at: ${result.data.content.html_url}`);
        console.log(
            `Download updated file: ${result.data.content.download_url}`
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
        core.setFailed(`Action failed: ${error.message}`);
    }
}

run();
