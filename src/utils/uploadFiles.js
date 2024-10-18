import { openai } from "./openaiClient.js";
import fs from "fs";

export async function uploadFiles(filePaths) {
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

