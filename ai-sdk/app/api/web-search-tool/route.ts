import { google } from '@ai-sdk/google';
import {openai} from '@ai-sdk/openai'
import { convertToModelMessages,InferToolInput,UIDataTypes, streamText, UIMessage , tool, InferUITools ,stepCountIs} from 'ai'
import { NextResponse } from 'next/server';
import z from 'zod';


const tools ={
      web_search_preview: openai.tools.webSearchPreview({}),
}


export type ChatTools = InferUITools<typeof tools>
export type ChatMessages = UIMessage<never , UIDataTypes , ChatTools>
export async function POST(req:Request) {
    try {
          const {messages} :{messages: ChatMessages[]}= await req.json();
         const result = streamText({
            model: openai.responses('gpt-4o-mini'),
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