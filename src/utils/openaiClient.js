const OpenAI = require("openai");
const { config } = require("./config");

/**
 * Initialize OpenAI client with the API key from the config.
 */
const openai = new OpenAI({
    apiKey: config.openaiApiKey,
});

module.exports = { openai };
