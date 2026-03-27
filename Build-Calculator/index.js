import { GoogleGenAI, Type } from "@google/genai";
import 'dotenv/config';
import { exec } from "child_process";
import util from "util";
import 'dotenv/config'
import os from "os"
import readlinesync from "readline-sync";
//konse operating system kam kr rha hu
const platform = os.platform();
const ai = new GoogleGenAI({
  apiKey: process.env.SECRET_API_KEY,
});

//kisi bhi command ko run kr kte ho
const execute = util.promisify(exec)
///tool
async function executeCommand({ command }) {
    try {
        const { stdout, stderr } = await execute(command);

        if (stderr) {
            return `Error: ${stderr}`
        }
        return `Success: ${stdout}`
    }
    catch (err) {
        return `Error : ${err}`
    }
}

const commandExecuter = {
    name: "executeCommand",
    description: "It takes any shell/terminal command and execute it. It will heelp us to create,read,write.update,delete any folder and file",
    parameters: {
        type: Type.OBJECT,
        properties: {
            command: {
                type: Type.STRING,
                description: "It is the terminal/shell command. Ex:mkdir calculator, touch calculator/index.js etc"
            }
        },
        required: ["command"]
    }
}

const History = []

async function buildWebsite(query) {
    while (true) {
        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: History,
            config: {
                systemInstruction: `You are a website Builder,which will create the frontend part of the website using terminal/shell command.
                You will give shell/terminal command one by one andour tool will execute it .
                
                Give the command according to the operating system we are using
                My current Operating system is ${platform}.

                Kindly use best practice for command , it should handle multiline write also efficiently.
                
                your Job
                1:analyse the user query
                2:Take the necessary action after analysing the query by giving proper shell.command according to the user operating system
                
                step by step by Guide
                
                1:First you have to create the folder for the website which we have to create,ex:mkdir calculator
                2:Give shell/terminal command to create html file, ex:touch calculator/index.html
                3:GIve shell/terminal command to create css file.
                4:Give shell/terminal command to create javascript file.
                5:Give shell/terminal command to write on html file
                6:Give shell/terminal command to write on css file
                7:Give shell/terminal command to write on javascript file
                8:fix the error if they are present at any step by writing , update or deleting.`,
                tools: [
                    {
                        functionDeclarations: [commandExecuter]
                    }
                ]
            },

        });



        if (result.functionCalls && result.functionCalls.length > 0) {
            const functionCall = result.functionCalls[0];

            const { name, args } = functionCall;

            const toolResponse = await executeCommand(args);
            // const response=await toolFunctions[name](args);
            // const functionResponsePart={
            //     name:functionCall.name,
            //     response:{
            //         result:response,
            //     }
            // }


            History.push(result.candidates[0].content);

            // send tool response
             // send tool response
      History.push({
        role: "user",
        parts: [
          {
            functionResponse: {
              name: name,
              response: {
                result: toolResponse,
              },
            },
          },
        ],
      });
    }
   else {
            break;
            console.log(result.text);
            History.push({
                role: "model",
                parts: [{ text: result.text }]
            })
        }
    }

}

while (true) {
    const question = readlinesync.question("Ask me anything -->");
    if (question == "exit") {
        break;
    }

    History.push({
        role: "user",
        parts: [{ text: question }]
    })
    await buildWebsite(question);
}