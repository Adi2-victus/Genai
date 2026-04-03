import {GoogleGenAI,Type} from "@google/genai";
import "dotenv/config";
import fs from "fs";
import { type } from "os";
import path from "path";
import { text } from "stream/consumers";

const ai=new GoogleGenAI({});

//tool function
async function listFiles({directory}){
    const files=[];
    const extensions=[".js",".jsx",".ts",".tsx",".html",".css"];

    function scan(dir){
        //apne level wale ko point krega
        const item=fs.readdirSync(dir);

        for(const item of items){
            const fullPath=path.join(dir,item);

            //skip node_modules , dist,build

        if(fullPath.includes("node_modules") || fullPath.includes("dist") || fullPath.includes("build" ))
        {
            continue;
        }
        //ye power deta hai ke ye directory hai ya file hai
        const stat=fs.statSync(fullPath);
        if(stat.isDirectory())
        {
            scan(fullPath)
        }
        else if(stat.isFile()){
            const ext=path.extname(item);
            if(extensions.includes(text))
            {
                files.push(fullPath);
            }
        }
        }
    }
}

async function readFiles({directory}){
    const content=fs.readFileSync(file_path,"utf-8");
    console.log(`Reading: ${file_path}`);
    return {content};
}

async function writeFile({file_path,content}){
    fs.writeFileSync(file_path,content,"utf-8");
    console.log(`Fixed:${file_path}`);
    return {success:true};
}


//tool declaration
const listFilesTool={
    name:"list_files",
    description:"Get all javascript files in a directory",
    parameters:{
        type:Type.OBJECT,
        properties:{
            directory:{
                type:Type.STRING,
                description:"Directory path to scan"
            }
        },
        required:["directory"]
    }
}


const readFileTool={
    name:"read_file",
    description:"Read a file's content",
    parameters:{
        type:Type.OBJECT,
        properties:{
            file_path:{
                type:Type.STRING,
                description:"path to the file"
            }
        },
        required:["file_path"]
    }
}

const writeFileTool={
    name:"write_file",
    description:"Write fixed content back to a file",
    parameters:{
        type:Type.OBJECT,
        properties:{
            file_path:{
                type:Type.STRING,
                description:"Path to the file to write"
            },
            content:{
                type:Type.STRING,
                description:"The fixed/corrected content"
            }
        },
        required:["file_path,content"]
    }
}


//main agent
export async function runAgent(directoryPath){
    console.log(`Reviewing:${directoryPath}\n`);
    const History=[{
        role:"user",
        parts:[{text:`Review and fix all javascript code in :${directoryPath}`}]
    }];

    while(true){
        const result=await ai.models.generateContent({
            model:"gemini-2.5",
            contents:History,
            config:{
                systemInstruction:`You are an expert Javascript code reviewer and fixer.
                **Your Job:**
                1.Use list_files to get all HTML,CSS,Javascript and Typescript files in the directory
                2. Use read_file to read and file's content
                3.Analyze for:
                   **HTML Issues:**
                   -Missing doctype,meta tags, semantic HTML
                   -Broken links, missing alt attributes
                   -Accessibility issues (ARTA roles)
                   -Inline styles that should be in CSS
                   
                   **CSS Issues:**
                   -Syntax errors,invalid properties
                   -Browser combatibility issues
                   -Inefficient selectors
                   -Missing vendor prefixes
                   -Unused or duplicate styles
                   
                   **Javascript Issues:**
                   -BUGS:null/undefined errors,missing returns,type issues,async problems
                   -SECURITY:hardcoded secrets,eval(),XSS risks,  injection vulnerabilities
                   -CODE Quality:console.log,unused code,bad naming,complex logic
                   
                   4.Use write_file to FIX the issues you found(write corrected code back)
                   5.After fixing all files,respond with a summary report in TEXT format
                   
                   **Summary Report Format:**
                   CODE REVIEW COMPLETE
                   
                   Total Files Analyzed:X
                   Files Fixed:Y
                   
                   SECURITY FIXES:
                   -file.js:line-Fixed hardcoded API key
                   -auth.js:line-Removed eval() usage
                   
                   BUG FIXES:
                   -app.js:line-Added null check for user object
                   -index.html:line-Added missing alt attribute
                   
                   CODE QUALITY IMPROVEMENTS:
                   -styles.css:line-Removed duplicate styles
                   -script.js:line -Removed console.log statements
                   
                   Be practical and focus on real issues.Actually FIX the code,don't just report.`,
                   tools:[{
                    functionDeclarations:[listFilesTool,readFileTool,writeFileTool]
                   }]
            }

        });

        //processall functioncalls at once
        if(result.functionCalls?.length>0){
            //execute all function calls
            for(const functionCall of result.functionCalls){
                const{name,args} = functionCall;

                console.log(`${name}`);
                const toolResponse=await tools[name](args);

                //add functionality to call history
                History.push({
                    role:"model",
                    parts:[{functionCall}]
                });
                //add function response to history
                History.push({
                    role:"user",
                    parts:[{
                        functionResponse:{
                            name,
                            response:{result:toolResponse}
                        }
                    }]
                });
            }  
        }else{
            console.log('\n'+result.text);
            break;
        }
    }
}
const directory=process.argv[2]|| '.';
await runAgent(directory);
