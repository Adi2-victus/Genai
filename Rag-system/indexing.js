
import * as dotenv from 'dotenv';
dotenv.config();

import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {GoogleGenerativeAIEmbeddings} from "@langchain/google-genai";
import {Pinecone} from "@pinecone-database/pinecone";
import {PineconeStore} from "@langchain/pinecone"

async function indexing(params) {
    //pdf file ko load karriye
    const PDF_PATH="./CS 2.pdf";
    const pdfLoader=new PDFLoader(PDF_PATH);
   const rawDocs=await pdfLoader.load();

   console.log(rawDocs);
   //chunking create karna
   const textSplitter=new RecursiveCharacterTextSplitter({                                    
    chunkSize:1000,
    chunkOverlap:200,  //matlab 1000 character ke baad 200 character overlap hoga
   });  
   const chunkedDocs=await textSplitter.splitDocuments(rawDocs);
    console.log(chunkedDocs);

    //embedding create karna->chunk ke corresponding vector chahiye
    const embeddings=new GoogleGenerativeAIEmbeddings({
        apiKey:process.env.GEMINI_API_KEY,
        model: "text-embedding-004",
    });
    const embeddedDocs=await embeddings.embedDocuments(chunkedDocs.map((doc)=>doc.pageContent));
    console.log(embeddedDocs);

   
}
indexing();