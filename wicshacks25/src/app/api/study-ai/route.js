import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  try {
    const { topic, type, pdfContent } = await request.json();
    
    // Create a context-aware prompt that includes PDF content
    const contextPrompt = pdfContent 
      ? `Using the following document content as reference:\n\n${pdfContent}\n\nCreate a study plan for: ${topic}`
      : `Create a study plan for: ${topic}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful study assistant. Create a detailed study plan and key concepts based on the provided document content and topic."
        },
        {
          role: "user",
          content: contextPrompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return new Response(JSON.stringify(completion.choices[0].message), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
