import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { pokemonSchema } from "./schema";

export async function POST(req:Request) {
    try {
        const {type} = await req.json();
       const result= streamObject({
            model: google('gemini-2.0-flash'),
            output:"array",
            schema: pokemonSchema,
            prompt:`Generate a list of 5 ${type} type of pokemon`
        })
        return result.toTextStreamResponse();
    } catch (error) {
        return new Response("Faile to Generate Pokemon" , {status: 500})
    }
}