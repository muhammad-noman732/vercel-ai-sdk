import {google} from '@ai-sdk/google'
import {streamObject} from 'ai'
import NextResponse from 'next/server'
import {recipeSchema } from './schema'

export async function POST(req:Request) {
    try {
        const {dish} = await req.json();
        
        const result = await streamObject({
            model: google('gemini-2.0-flash'),
            schema: recipeSchema,
            prompt: `generate a recipe for ${dish}`
        })

        return result.toTextStreamResponse()
    } catch (error) {
        console.error("error in generating recipe " , error);
           return new Response("Failed to stream text", { status: 500 });
    }
}