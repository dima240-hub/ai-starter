require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai'); // updated import for OpenAI v4

const app = express();
app.use(cors());
app.use(express.json());

// Create OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            temperature: 0.7,
        });
        // The response structure differs slightly in v4
        res.json({ message: response.choices[0].message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'OpenAI request failed' });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));