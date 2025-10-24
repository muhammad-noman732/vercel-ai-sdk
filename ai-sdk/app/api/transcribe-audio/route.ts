import { openai } from "@ai-sdk/openai";
import { experimental_transcribe as transcribe } from "ai";

export async function POST(req:Request) {
     try {
        const formData = await req.formData(); // Converts the incoming POST request body into a FormData object.
        const audioFile = formData.get("audio") as File;  // get the uploaded file whose input name is audio

     if(!audioFile){
         return new Response("No audioFile provided", {status:500})
    }

    const arrayBuffer = await audioFile.arrayBuffer();//convert the file into binary data stored in ArrayBuffer
    const uint8Array = new Uint8Array(arrayBuffer);// ai  read accept data as uint8array instead of buffer
    
    const transcription = await transcribe({
        model: openai.transcription('whisper-1'),
        audio: uint8Array
    })

    return Response.json(transcription)


     } catch (error) {
        console.error("error in Transcription of audio", error)
        return new Response("Failed to Generate audio Transcription", {status:500})

     }
}