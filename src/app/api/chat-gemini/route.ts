import { StreamingTextResponse, GoogleGenerativeAIStream } from "ai";
import {
  ChatSession,
  Content,
  GoogleGenerativeAI,
} from "@google/generative-ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt, response, previousHistory } = await req.json();
  
  let chatHistory: Content[] = [];
  if (JSON.parse(previousHistory).length > 0) {
    JSON.parse(previousHistory).forEach((prchat: any) => {
      chatHistory.push(
        {
          role: "user",
          parts: [{ text: prchat.user }],
        },
        {
          role: "model",
          parts: [{ text: prchat.model }],
        }
      );
    });
  }

  const genAI = new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
  );

  const generationConfig = {
    max_output_tokens: 2048,
    temperature: 0.9,
    top_p: 1,
  };

  const model = genAI.getGenerativeModel({
    model: "gemini-1.0-pro-001",
    generationConfig,
  });

  let chat: ChatSession;

  console.log(JSON.parse(previousHistory).length);
  if (JSON.parse(previousHistory).length > 0) {
    chat = model.startChat({
      history: chatHistory,
    });
  } else {
    chat = model.startChat();
  }

  const inputconfig =
    JSON.parse(previousHistory).length > 0
      ? response
      : `${prompt} \n Input : ${response}`;

  const streamingResponse = await chat.sendMessageStream(inputconfig);
  return new StreamingTextResponse(GoogleGenerativeAIStream(streamingResponse));
}
