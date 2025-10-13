// import { streamText } from "ai";
// import { openai } from "@ai-sdk/openai";

// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json();
//     console.log(prompt)
//     const result = streamText({
//       model: openai("gpt-4-turbo"),
//       prompt,
//     });
//     // track of tokens
//     result.usage.then((usage)=>{
//         console.log({
//               inputTokens : usage.inputTokens,
//               outputtokens: usage.outputTokens,
//               totalTokens : usage.totalTokens
//         })
       
//     })

//     return result.toUIMessageStreamResponse();
//   } catch (error) {
//     console.error("Error streaming text:", error);
//     return new Response("Failed to stream text", { status: 500 });
//   }
// }

import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log(prompt)
    const result = streamText({
      model: google("gemini-2.5-flash"),
      // apikey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      prompt,
    });
    // track of tokens
    result.usage.then((usage)=>{
        console.log({
              inputTokens : usage.inputTokens,
              outputtokens: usage.outputTokens,
              totalTokens : usage.totalTokens
        })
       
    })

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming text:", error);
    return new Response("Failed to stream text", { status: 500 });
  }
}