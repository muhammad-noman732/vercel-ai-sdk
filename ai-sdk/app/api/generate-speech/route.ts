import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const { audio } = await generateSpeech({
      model: openai.speech('tts-1'),
      text,
    });

    return new Response(audio.uint8Array, {
      headers: {
        "Content-Type": audio.mediaType || 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to generate Text to Speech", { status: 500 });
  }
}
