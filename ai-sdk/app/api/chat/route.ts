import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { Meow_Script } from "next/font/google";
import { NextResponse } from "next/server";


// here this is for tracking the history of chat so as here we get the multiple messages so in input it will take array of messages
export async function POST(req:Request) {
     try {
         const {messages} :{messages: UIMessage[]}= await req.json();
         const result = streamText({
            model:google('gemini-2.0-flash'),
            // messages:convertToModelMessages(messages) // converttomodel convert the timestampt etc for model
            messages:[{
                role:"system",
                content:"You are friendly teacher who explain concepts using simple analogies.Always related technical concepts to everyday experiences "
            },
            ...convertToModelMessages(messages)
        ]
         })
        //  token usage
        result.usage.then((usage)=>{
            console.log({
                messageCount : messages.length,
                inputToken: usage.inputTokens,
                outputTokens : usage.outputTokens,
                totalTokens : usage.totalTokens
            })
        })

         return result.toUIMessageStreamResponse();
         
     } catch (error) {
        console.error("Error streaming chat completion" ,error);
        return NextResponse.json({
            error: "Failed to stream chat response",
            status: 500
        })
     }
}