import {GoogleGenAI,Type} from "@google/genai";
import "dotenv/config";
import fs from "fs";
import path from "path";

const ai=new GoogleGenAI({});

//tool function
async function listFiles({directory}){

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