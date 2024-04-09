import { StreamingTextResponse, GoogleGenerativeAIStream } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const genAI = new GoogleGenerativeAI(
    "AIzaSyBfhB_y-hjwnqpVfVuC8ctvKy4gyiTesKo"
  );

  const generationConfig = {
    max_output_tokens: 2048,
    temperature: 0.9,
    top_p: 1,
  };

  const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig});
  const streamingResponse = await model.generateContentStream(prompt);

  return new StreamingTextResponse(GoogleGenerativeAIStream(streamingResponse));
}
