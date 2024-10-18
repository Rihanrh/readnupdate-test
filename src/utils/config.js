import dotenv from "dotenv";

dotenv.config();

export const config = {
    assistantID: process.env.ASSISTANT_ID,
    openaiApiKey: process.env.OPENAI_API_KEY,
    filesToUpload: [
        "src/sample_files/bucketsort.py",
        "src/sample_files/test_bucketsort.py",
        "src/sample_files/bucketsort.json",
    ],
};
