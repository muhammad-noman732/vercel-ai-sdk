import { google } from '@ai-sdk/google';
import {openai} from '@ai-sdk/openai'
import { convertToModelMessages,InferToolInput,UIDataTypes, streamText, UIMessage , tool, InferUITools ,stepCountIs} from 'ai'
import { NextResponse } from 'next/server';
import z from 'zod';


const tools ={
    getWeather : tool({
        description:'Get the weather for a location',
        inputSchema: z.object({
            city:z.string().describe("the city for which get the weather")
        }),
        execute: async({city})=>{
            return `Weather in ${city} is 22c`
        }
    })
}


export type ChatTools = InferUITools<typeof tools>
export type ChatMessages = UIMessage<never , UIDataTypes , ChatTools>
export async function POST(req:Request) {
    try {
          const {messages} :{messages: ChatMessages[]}= await req.json();
         const result = streamText({
            model:google('gemini-2.0-flash'),
            // messages:convertToModelMessages(messages) // converttomodel convert the timestampt etc for model
            messages:convertToModelMessages(messages),
            tools,
            stopWhen: stepCountIs(2)
        
         })

         return result.toUIMessageStreamResponse()

    } catch (error) {
        console.error("Error streaming chat completion" ,error);
        return NextResponse.json({
                error: "Failed to stream chat response",
                status: 500
            })
}
}