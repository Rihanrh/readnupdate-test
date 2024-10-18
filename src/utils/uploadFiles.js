const { openai } = require("./openaiClient");
const fs = require("fs");

/**
 * Uploads files to OpenAI and returns their IDs.
 * 
 * @param {Array<string>} filePaths - An array of file paths to upload.
 * @returns {Promise<Array<string>>} An array of file IDs from the uploaded files.
 */
async function uploadFiles(filePaths) {
    const fileIds = [];

    for (const filePath of filePaths) {
        const file = await openai.files.create({
            file: fs.createReadStream(filePath),
            purpose: "assistants",
        });

        console.log(
            `File uploaded successfully: ${filePath}, ID: ${file.id}`
        );
        fileIds.push(file.id);
    }

    return fileIds;
}

module.exports = { uploadFiles };
