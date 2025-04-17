import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.REACT_APP_HF_ACCESS_TOKEN);

export async function getAIResponse(promptText) {
  try {
    const response = await client.chatCompletion({
      provider: "hf-inference",
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [
        {
          role: "system",
          content: "You are a helpful fitness and mental assistant. Keep responses concise."
        },
        {
          role: "user",
          content: promptText
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    
    // More specific error messages
    if (error.name === 'TypeError') {
      return "There was a problem connecting to the AI service. Please try again later.";
    }
    if (error.message.includes('token')) {
      return "There's an authentication issue. Please contact support.";
    }
    return "I apologize, but I'm having trouble processing your request right now.";
  }
}