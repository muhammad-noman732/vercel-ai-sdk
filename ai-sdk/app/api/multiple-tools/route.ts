import { google } from '@ai-sdk/google';
import {openai} from '@ai-sdk/openai'
import { convertToModelMessages,InferToolInput,UIDataTypes, streamText, UIMessage , tool, InferUITools ,stepCountIs} from 'ai'
import { NextResponse } from 'next/server';
import z from 'zod';


const tools ={
    getLocation: tool({
        description:"Get the location of the name",
        inputSchema: z.object({
            name:z.string().describe("the name of the user")
        }),
        execute:async({name})=>{
            if(name === "Bruce Wayne"){
                return "Gotham City"
            }
            else if(name ==="Clerk Kant"){
                return "Metropolis"
            }
            else{
                return "Unknown"
            }
        }
    }),
    getWeather : tool({
        description:'Get the weather for a location',
        inputSchema: z.object({
            city:z.string().describe("the city for which get the weather")
        }),
        execute: async({city})=>{
            if(city === "Gotham City"){
               return `70F and cloudy`
            }
            else if(city ==="Metropolis"){
                return "80F and sunny"
            }
            else{
                return "Unknown"
            }
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
            stopWhen: stepCountIs(3) // it takes three step call the tool of location and return location and than again call the weather and then in response  return response 
        
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