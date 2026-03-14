import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey:"SECRET_API_KEY"});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "What is array in dsa,explain in short",
  });
  console.log(response.text);
}

await main();