import { openai } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage } from "ai";

export async function POST(req: Request) {
  const { prompt } = await req.json();

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

  return Response.json({ image: image.base64 });
}



// import { google } from "@ai-sdk/google";
// import { experimental_generateImage as generateImage } from "ai";

// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json();
    
//     if (!prompt || prompt.trim().length === 0) {
//       return Response.json({ error: "Prompt is required" }, { status: 400 });
//     }

//     const { image } = await generateImage({
//       model : google.image("imagen-3"), 
//       prompt,
//       size: "1024x1024",
//     });

//     return Response.json({ image: image.base64 });
//   } catch (error) {
//     console.error("Error in generating image:", error);
//     return Response.json(
//       { error: "Failed to generate image" },
//       { status: 500 }
//     );
//   }
// }
