import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({apiKey:process.env.SECRET_API_KEY});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    config:{
      systemInstruction:`You are a coding tutor,strict rule to follow
      - you will only answer the question which is related to coding
      -dont answer anything which is not relatd to coding
      -reply rudely to user if they ask question which is not related coding 
      Ex.you dumb,only ask question related to coding`
    },
    contents: "what is current date",
   
    
     });
  console.log(response.text);
}

await main();