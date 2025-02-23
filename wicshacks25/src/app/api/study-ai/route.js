import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  try {
    const { topic, type, pdfContent } = await request.json();

    // Construct prompt dynamically based on input availability
    let prompt = '';

    if (pdfContent && topic) {
      prompt = `Using the following document content:\n\n${pdfContent}\n\nCreate a ${type} for: ${topic}`;
    } else if (pdfContent) {
      prompt = `Based on the following document, generate a ${type}:\n\n${pdfContent}`;
    } else if (topic) {
      prompt = `Create a ${type} for: ${topic}`;
    } else {
      return new Response(JSON.stringify({ error: 'No valid input provided' }), { status: 400 });
    }

    // Make API call
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'system', content: 'You are an AI study assistant.' }, { role: 'user', content: prompt }],
    });

    return new Response(JSON.stringify({ content: completion.choices[0].message.content }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in API route:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
