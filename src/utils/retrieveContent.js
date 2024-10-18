const { openai } = require("./openaiClient");
const fs = require("fs");

/**
 * Writes the content of the OpenAI file to a local file.
 * 
 * @param {string} filePath - The path of the file to retrieve content from.
 */

async function retrieveContent(filePath) {
    // FIX LATER: How to define relative path with os/path lib
    const path = 'src/sample_files/corrected_code.py';

    const file = await openai.files.content(filePath);
    const newData = await file.text();
    return newData;
    
    // fs.writeFileSync(
    //     path, 
    //     newData,
    //     { encoding: "utf8" }
    // );
}

module.exports = { retrieveContent };
