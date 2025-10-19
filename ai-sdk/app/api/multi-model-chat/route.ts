import { google } from "@ai-sdk/google";
import { streamText, UIMessage } from "ai";
import { convertToModelMessages } from "ai";

export async function POST(req:Request) {
    try {
        const {messages} : {messages : UIMessage[]} = await req.json();

        const result =  streamText({
            model: google('gemini-2.5-flash'),
            messages:convertToModelMessages(messages)
        })

        return result.toUIMessageStreamResponse()
    } catch (error) {
        return new Response("Failed to generate response" ,{status:500})
    }
}