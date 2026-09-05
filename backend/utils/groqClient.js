const OpenAI = require('openai');

// Groq exposes an OpenAI-compatible API, so the standard `openai` SDK works
// unchanged - only the baseURL and API key differ.
let client = null;

function getGroqClient() {
    if (!process.env.GROQ_API_KEY) {
        return null;
    }
    if (!client) {
        client = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: 'https://api.groq.com/openai/v1',
            timeout: 20000,
        });
    }
    return client;
}

const getGroqModel = () => process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

module.exports = { getGroqClient, getGroqModel };
