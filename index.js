import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import readlinesync from "readline-sync";
dotenv.config();

const ai = new GoogleGenAI({apiKey:process.env.SECRET_API_KEY});




//handle a history automatically
async function main() {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    history: [],
    config:{
      
      systemInstruction:`You are a coding tutor,strict rule to follow
      - you will only answer the question which is related to coding
      -dont answer anything which is not relatd to coding
      -reply rudely to user if they ask question which is not related coding 
      Ex.you dumb,only ask question related to coding`
    },
  });

  

  while(true)
  {
    const question=readlinesync.question("Ask me Question: ");
    //break
    if(question=="exit")
    {
      break;
    }
    const response = await chat.sendMessage({
      message: question,
    });
    console.log("Chat response:", response.text);
  }

}
await main();