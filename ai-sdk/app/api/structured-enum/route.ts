import { google } from "@ai-sdk/google";
import { generateObject } from "ai";


export async function POST(req:Request) {
    try {
        // enum only work with generateObject not streamObject
        const {text} = await req.json();
       const result= await generateObject({
            model: google('gemini-2.0-flash'),
            output:"enum",
            enum:["positive" , "negative" , "neutral"],
            prompt:`classify the sentiment in the ${text} text`
        })
        // it return the json not text 
        return result.toJsonResponse();
    } catch (error) {
        return new Response("Faile to Generate enum sentiment" , {status: 500})
    }
}