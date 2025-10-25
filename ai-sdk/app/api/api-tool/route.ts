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
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`)
            const data = await response.json();

            const weatherData = {
                location:{
                    name:data.location.name,
                    country:data.location.country,
                    localtime: data.location.localtime
                },
                current:{
                    temp_c: data.current.temp_c,
                    condition:{
                        text:data.current.condition.text,
                        code:data.current.condition.code
                    },

                }
            }
            return weatherData;
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