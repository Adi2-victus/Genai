
import { GoogleGenAI, Type } from "@google/genai";
import readlineSync from "readline-sync";
import "dotenv/config";


const ai = new GoogleGenAI({
  apiKey: process.env.SECRET_API_KEY,
});



//  Crypto Tool
async function cryptoCurrency({ coin }) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`
  );
  const data = await response.json();
  return data;
}

//  Weather Tool
async function weatherInformation({ city }) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
  );
  const data = await response.json();
  return data;
}



const cryptoInfo = {
  name: "cryptoCurrency",
  description:
    "Get current cryptocurrency price like bitcoin, ethereum etc.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      coin: {
        type: Type.STRING,
        description: "Cryptocurrency name like bitcoin or ethereum",
      },
    },
    required: ["coin"],
  },
};

const weatherInfo = {
  name: "weatherInformation",
  description: "Get current weather of a city",
  parameters: {
    type: Type.OBJECT,
    properties: {
      city: {
        type: Type.STRING,
        description: "City name like Delhi, Mumbai",
      },
    },
    required: ["city"],
  },
};



const tools = [
  {
    functionDeclarations: [cryptoInfo, weatherInfo],
  },
];

const toolFunctions = {
  cryptoCurrency,
  weatherInformation,
};



const history = [];


// AGENT LOOP


async function runAgent() {
  while (true) {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history,
      config: { tools },
    });

   // If model wants to call a function
    if (result.functionCalls && result.functionCalls.length > 0) {
      const functionCall = result.functionCalls[0];
      const { name, args } = functionCall;

      console.log(`🔧 Calling Tool: ${name}`, args);

      const response = await toolFunctions[name](args);

      const functionResponsePart = {
        name: name,
        response: {
          result: response,
        },
      };

      // Save model function call
       history.push(result.candidates[0].content);

      // Send tool response back
      history.push({
        role: "user",
        parts: [{ functionResponse: functionResponsePart }],
      });
    } else {
      // Final answer
      console.log("🤖:", result.text);

      history.push({
        role: "model",
        parts: [{ text: result.text }],
      });

      break;
    }
  }
}


// USER INPUT LOOP


while (true) {
  const question = readlineSync.question("Ask me anything: ");

  if (question.toLowerCase() === "exit") break;

  history.push({
    role: "user",
    parts: [{ text: question }],
  });

  await runAgent();
}