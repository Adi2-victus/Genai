import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({apiKey:process.env.SECRET_API_KEY});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    // contents: "What is array in dsa,explain in short",
    contents:[
      {
        role:"user",
        parts:[{text:"what is my name?"}]
      },
      {
        role:"model",
        parts:[{text:"I don’t know your name yet! As an AI, I don’t have access to your personal information or identity unless you tell me"}]
      },
      {
        role:"user",
        parts:[{text:"my name is Aditya"}]
      },
      {
        role:"user",
        parts:[{text:"Nice to meet you, Aditya! How can I help you today"}]
      },
      {
        role:"user",
        parts:[{text:"what is your name?"}]
      },
    ]
     })
  console.log(response.text);
}

await main();