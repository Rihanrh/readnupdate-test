import { openai } from "./openaiClient.js";
import fs from "fs";

export async function responseWriter(filePath) {
    // FIX LATER: How to define relative path with os/path lib
    const path = 'src/sample_files/corrected_code.py';

    const file = await openai.files.content(filePath);

    const data = await file.text()
    
    fs.writeFileSync(
        path, 
        data,
        { encoding: "utf8" }
    );
}

