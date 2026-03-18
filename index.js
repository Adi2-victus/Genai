import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({apiKey:process.env.SECRET_API_KEY});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    config:{
      systemInstruction:`current user name is Aditya Darade ,Today date is ${new Date()}`
    },
    contents: "what is current date",
   
    
     });
  console.log(response.text);
}

await main();