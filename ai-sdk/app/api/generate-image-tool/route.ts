import { google } from "@ai-sdk/google";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  experimental_generateImage as generateImage,
  stepCountIs,
  InferUITools,
  UIDataTypes,
} from "ai";
import { openai } from "@ai-sdk/openai";
import z from "zod";

const tools = {
  generateImage: tool({
    description: "Generate an image for prompt",
    inputSchema: z.object({
      prompt: z.string().describe("The prompt to generate an image for "),
    }),
    execute: async ({ prompt }) => {
      const { image } = await generateImage({
        model: openai.imageModel("dall-e-3"),
        prompt,
        size: "1024x1024",
        providerOptions: {
          openai: {
            style: "vivid",
            quality: "hd",
          },
        },
      });
      return image.base64;
    },
    toModelOutput: () => {
      return {
        type: "content",
        value: [
          {
            type: "text",
            text: "generated image in base64",
          },
        ],
      };
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>
export type ChatMessages = UIMessage<never , UIDataTypes , ChatTools>

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: openai("gpt-4.1-mini"),
      messages: convertToModelMessages(messages),
      tools,
      stopWhen:stepCountIs(2)
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return new Response("Failed to generate response", { status: 500 });
  }
}
