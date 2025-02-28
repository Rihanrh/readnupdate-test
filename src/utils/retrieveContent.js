const { openai } = require("./openaiClient");
const fs = require("fs");

/**
 * Writes the content of the OpenAI file to a new variable.
 * 
 * @param {string} filePath - The path of the file to retrieve content from.
 */

async function retrieveContent(filePath) {
    const file = await openai.files.content(filePath);
    const newData = await file.text();
    return newData;
}

module.exports = { retrieveContent };
