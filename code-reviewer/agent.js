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


