import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      model = "llama-3.3-70b-versatile",
      messages,
      temperature = 0.7,
      max_tokens = 1500
    } = req.body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const completion = await groq.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens
    });

    return res.status(200).json(completion);
  } catch (err) {
    console.error('Groq error:', err);
    return res.status(500).json({
      error: err.message || 'Internal server error'
    });
  }
}
