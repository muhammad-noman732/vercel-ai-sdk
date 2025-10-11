import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const {prompt} = await req.json();
    const { text } = await generateText({
    model: openai('gpt-4.1-mini'),
    prompt: prompt,
  });

  return NextResponse.json({ data: text });
  } catch (error) {
    console.error("Error generating text " , error);
    return NextResponse.json({
        error:"Failed to generate Text",
        status:500
    })
  }

}
