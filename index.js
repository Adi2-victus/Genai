// import { FunctionResponse, GoogleGenAI ,Type } from '@google/genai';
// import {type} from "os";
// import readlinesync from "readline-sync";


// const ai = new GoogleGenAI({apiKey:process.env.SECRET_API_KEY});



// const a={
//     coin:"bitcoin",
    
// }
// //crypto currency tool
// async function cryptoCurrency({coin}) {
//     const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`);
//     const data = await response.json();
//     console.log(data);
//     return data;
// }
// cryptoCurrency({coin:"bitcoin"});



// //weather tool
// async function weatherInformation({city}) {
//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY`);
//     const data = await response.json();
//     console.log(data);
//     return data;
// }
// ///cryptocyrrency wale ki information karke dunga
// //tool ke bare me info
//   const cryptoInfo={
//     name:"cryptoCurrency",
//     description:"we can give you the current price or other information  related to cryptocurrency like bitcoin and ethereum etc.",
//     parameters:{
//         coin:{
//             type:Type.OBJECT,
//             properties:{
//                 coin:{
//                     type:Type.STRING,
//                     description:"it will be the name of the cryptocurrency like bitcoin,ethereum,etc"
//                 }
//             }
            
//         }
//     }
//   }


//   const weatherInfo={
//     name:"weatherInformation",
//     description:"You can get the current weather information of any city likelondon,goa etc",
//     parameters:{
        
//             type:Type.OBJECT,
//             properties:{
//                 city:{
//                     type:Type.STRING,
//                     description:"Name of the city forwhich i have to fetch weather information like london,goa,etc"
//                 }
//             },
//             required:["city"]
            
        
//     }
//   }
// //tool ki info pass kr rha hu
// const tools=[{
//   // functionDeclarations:[
//     cryptoInfo,
//     weatherInfo
// // ]
    
// }]
// const toolFunctions={
//     "cryptoCurrency":cryptoCurrency,
//     "weatherInformation":weatherInformation
// }
// const History=[];

// async function runAgent(){
//     while(true)
//     {
//         const result=await ai.models.generateContent({
//             model:"gemini-3-flash-preview",
//             contents:History,
//             config:{tools},
//         });

//         if(result.functionCalls && result.functionCalls.length > 0){
//             const functionCall=result.functionCalls[0];
//             const{name,args}=functionCall;
//             // if(name=="cryptoCurrency")
//             // {
//             //     const response=await cryptoCurrency(args);
//             // }
//             // else if(name=="weatherInformation")
//             // {
//             //     const response=await weatherInformation(args);

//             // }
//             //100 tool honge to itna so or
//             const response=await toolFunctions[name](args);
//             const functionResponsePart={
//                 name:functionCall.name,
//                 response:{
//                     result:response,
//                 }
//             }
//             //send the function response back to the model
//             History.push({
//                 role:"model",
//                 parts:[
//                     {
//                         functionCall:functionCall,
//                     },
//                 ],
//             })

//             //function call ke respnose
//             History.push(
//                 {
//                     role:"user",
//                     parts:[{functionResponse:functionResponsePart}]
//                 }
//             );
//         }
//         else{
//             History.push({
//                 role:"model",
//                 parts:[{text:result.text}]
//             })
//             // console.log(result.text);
//             break;
//         }
//     }
// }



// while(true)
// {
//     const  question=readlinesync.question("Ask me anything:");
//     if(question=="exit")
//     {
//         break;
//     }
//     History.push({
//         role:"user",
//         parts:[{text:question}]
//     });

//     await runAgent();
// }



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